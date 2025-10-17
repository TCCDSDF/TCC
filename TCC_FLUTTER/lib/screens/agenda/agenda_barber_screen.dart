import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:table_calendar/table_calendar.dart';
import '../../services/api_service.dart';
import '../../services/auth_service.dart';
import '../../widgets/bottom_nav_barber.dart';

class AgendaScreen extends StatefulWidget {
  const AgendaScreen({super.key});

  @override
  _AgendaScreenState createState() => _AgendaScreenState();
}

class _AgendaScreenState extends State<AgendaScreen> {
  DateTime _focusedDay = DateTime.now();
  DateTime? _selectedDay;
  String _selectedStatus = 'Todos';
  bool isLoading = true;

  final List<String> _statusFilters = ['Todos', 'Pendente', 'Confirmado', 'Completo', 'Cancelado'];
  List<Map<String, dynamic>> _appointments = [];
  
  @override
  void initState() {
    super.initState();
    _loadAppointments();
  }

  Future<void> _loadAppointments() async {
    setState(() => isLoading = true);

    try {
      final authService = Provider.of<AuthService>(context, listen: false);
      final user = await authService.getCurrentUser();
      final barbeiroId = user?['id'] ?? 1;
      
      final response = await ApiService.get('agendamentos/barbeiro/$barbeiroId');
      debugPrint('Agendamentos carregados: $response');
      final servicosResponse = await ApiService.get('servicos');
      final servicos = servicosResponse is List ? servicosResponse : [];
      
      if (response != null && response is List) {
        _appointments = [];
        
        for (var item in response) {
          try {
            Map<String, dynamic> agendamento = {};
            if (item is Map) {
              item.forEach((key, value) {
                if (key is String) {
                  agendamento[key] = value;
                }
              });
            } else if (item is List && item.length >= 5) {
              agendamento = {
                'id': item[0],
                'dataAgendamento': item[1],
                'statusAgendamento': item[2],
                'clienteNome': item[3],
                'servicoNome': item[4],
                'servicoId': item.length > 5 ? item[5] : null
              };
            } else {
              continue;
            }
            
            final servicoId = agendamento['servicoId'] ?? 0;
            final servico = servicos.firstWhere(
              (s) => s['id'] == servicoId,
              orElse: () => {'preco': 45.00, 'duracao': 45}
            );
            
            final dateTime = agendamento['dataAgendamento'];
            debugPrint('Data do agendamento: $dateTime');
            
            _appointments.add({
              'id': agendamento['id'],
              'title': agendamento['servicoNome'] ?? 'Serviço',
              'client': agendamento['clienteNome'] ?? 'Cliente',
              'date': _formatDate(dateTime),
              'time': _formatTime(dateTime),
              'duration': '${servico['duracao'] ?? 45} min',
              'price': 'R\$ ${servico['preco']?.toString() ?? '45.00'}',
              'status': agendamento['statusAgendamento'] ?? 'Pendente',
              'dateTime': dateTime,
              'fullDateTime': _formatFullDateTime(dateTime),
            });
          } catch (e) {
            debugPrint('Erro ao processar agendamento: $e');
          }
        }
      }
    } catch (e) {
      debugPrint('Erro ao carregar agendamentos: $e');
    }

    setState(() => isLoading = false);
  }

  String _formatTime(dynamic dateTime) {
    if (dateTime == null) return '00:00';
    try {
      final dt = DateTime.parse(dateTime.toString());
      return '${dt.hour.toString().padLeft(2, '0')}:${dt.minute.toString().padLeft(2, '0')}';
    } catch (e) {
      return '00:00';
    }
  }

  String _formatDate(dynamic dateTime) {
    if (dateTime == null) return 'Data não informada';
    try {
      final dt = DateTime.parse(dateTime.toString());
      return '${dt.day.toString().padLeft(2, '0')}/${dt.month.toString().padLeft(2, '0')}/${dt.year}';
    } catch (e) {
      debugPrint('Erro ao formatar data: $e');
      return 'Data não informada';
    }
  }

  String _formatFullDateTime(dynamic dateTime) {
    if (dateTime == null) return 'Data não informada';
    try {
      final dt = DateTime.parse(dateTime.toString());
      return '${dt.day.toString().padLeft(2, '0')}/${dt.month.toString().padLeft(2, '0')}/${dt.year} às ${dt.hour.toString().padLeft(2, '0')}:${dt.minute.toString().padLeft(2, '0')}';
    } catch (e) {
      debugPrint('Erro ao formatar data completa: $e');
      return 'Data não informada';
    }
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return Scaffold(
        backgroundColor: Colors.grey[50],
        body: Center(
          child: CircularProgressIndicator(
            valueColor: AlwaysStoppedAnimation<Color>(Colors.blue[600]!),
          ),
        ),
      );
    }

    return Scaffold(
      backgroundColor: Colors.grey[50],
      body: RefreshIndicator(
        onRefresh: _loadAppointments,
        color: Colors.blue[600],
        child: CustomScrollView(
          slivers: [
            _buildAppBar(),
            SliverToBoxAdapter(child: _buildCalendar()),
            SliverToBoxAdapter(child: _buildStatusFilters()),
            SliverToBoxAdapter(child: _buildAppointmentsList()),
            SliverToBoxAdapter(child: SizedBox(height: 100)),
          ],
        ),
      ),
      bottomNavigationBar: BarberBottomNavBar(currentIndex: 1),
    );
  }

  Widget _buildAppBar() {
    return SliverAppBar(
      backgroundColor: Colors.white,
      elevation: 0,
      pinned: true,
      title: Text(
        'Agenda',
        style: TextStyle(
          color: Colors.grey[800],
          fontSize: 20,
          fontWeight: FontWeight.w600,
        ),
      ),
      leading: IconButton(
        icon: Icon(Icons.arrow_back, color: Colors.grey[700]),
        onPressed: () => Navigator.pushReplacementNamed(context, '/home-barber'),
      ),
      actions: [
        IconButton(
          icon: Icon(Icons.notifications_outlined, color: Colors.grey[700]),
          onPressed: () => Navigator.pushNamed(context, '/notifications'),
        ),
      ],
    );
  }

  Widget _buildCalendar() {
    return Container(
      margin: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 4,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: TableCalendar<dynamic>(
        firstDay: DateTime.utc(2020, 1, 1),
        lastDay: DateTime.utc(2030, 12, 31),
        focusedDay: _focusedDay,
        selectedDayPredicate: (day) => isSameDay(_selectedDay, day),
        eventLoader: _getEventsForDay,
        onDaySelected: (selectedDay, focusedDay) {
          setState(() {
            _selectedDay = selectedDay;
            _focusedDay = focusedDay;
          });
        },
        onPageChanged: (focusedDay) {
          _focusedDay = focusedDay;
        },
        calendarStyle: CalendarStyle(
          outsideDaysVisible: false,
          weekendTextStyle: TextStyle(color: Colors.grey[800]),
          defaultTextStyle: TextStyle(color: Colors.grey[800]),
          selectedDecoration: BoxDecoration(
            color: Colors.blue[600],
            shape: BoxShape.circle,
          ),
          todayDecoration: BoxDecoration(
            color: Colors.blue[100],
            shape: BoxShape.circle,
          ),
          markerDecoration: BoxDecoration(
            color: Colors.orange,
            shape: BoxShape.circle,
          ),
          markersMaxCount: 3,
        ),
        headerStyle: HeaderStyle(
          formatButtonVisible: false,
          titleCentered: true,
          titleTextStyle: TextStyle(
            color: Colors.grey[800],
            fontSize: 18,
            fontWeight: FontWeight.w600,
          ),
          leftChevronIcon: Icon(Icons.chevron_left, color: Colors.grey[700]),
          rightChevronIcon: Icon(Icons.chevron_right, color: Colors.grey[700]),
        ),
        daysOfWeekStyle: DaysOfWeekStyle(
          weekdayStyle: TextStyle(color: Colors.grey[600], fontSize: 12),
          weekendStyle: TextStyle(color: Colors.grey[600], fontSize: 12),
        ),
      ),
    );
  }

  Widget _buildStatusFilters() {
    return Container(
      height: 50,
      margin: EdgeInsets.symmetric(horizontal: 16),
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: _statusFilters.length,
        itemBuilder: (context, index) {
          String status = _statusFilters[index];
          bool isSelected = _selectedStatus == status;
          Color statusColor = _getStatusColor(status);
          
          return GestureDetector(
            onTap: () {
              setState(() {
                _selectedStatus = status;
              });
            },
            child: Container(
              margin: EdgeInsets.only(right: 8),
              padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                color: isSelected ? statusColor.withOpacity(0.1) : Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                  color: isSelected ? statusColor : Colors.grey[300]!,
                  width: 1,
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.05),
                    blurRadius: 2,
                    offset: Offset(0, 1),
                  ),
                ],
              ),
              child: Row(
                children: [
                  if (status != 'Todos') ...[
                    Container(
                      width: 8,
                      height: 8,
                      decoration: BoxDecoration(
                        color: statusColor,
                        shape: BoxShape.circle,
                      ),
                    ),
                    SizedBox(width: 6),
                  ],
                  Text(
                    status,
                    style: TextStyle(
                      color: isSelected ? statusColor : Colors.grey[700],
                      fontSize: 12,
                      fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildAppointmentsList() {
    List<Map<String, dynamic>> filteredAppointments = _appointments;
    
    if (_selectedStatus != 'Todos') {
      filteredAppointments = _appointments.where((appointment) {
        return appointment['status'].toString().toLowerCase() == _selectedStatus.toLowerCase();
      }).toList();
    }

    if (filteredAppointments.isEmpty) {
      return Container(
        margin: EdgeInsets.all(16),
        padding: EdgeInsets.all(40),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 4,
              offset: Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          children: [
            Icon(Icons.event_busy, color: Colors.grey[400], size: 48),
            SizedBox(height: 16),
            Text(
              'Nenhum agendamento encontrado',
              style: TextStyle(
                color: Colors.grey[600],
                fontSize: 16,
              ),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      shrinkWrap: true,
      physics: NeverScrollableScrollPhysics(),
      padding: EdgeInsets.symmetric(horizontal: 16),
      itemCount: filteredAppointments.length,
      itemBuilder: (context, index) {
        final appointment = filteredAppointments[index];
        
        return Container(
          margin: EdgeInsets.only(bottom: 12),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.05),
                blurRadius: 4,
                offset: Offset(0, 2),
              ),
            ],
          ),
          child: Padding(
            padding: EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    CircleAvatar(
                      radius: 24,
                      backgroundColor: Colors.blue[50],
                      child: Icon(Icons.person, color: Colors.blue[600], size: 24),
                    ),
                    SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            appointment['client'],
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                              color: Colors.grey[800],
                            ),
                          ),
                          Text(
                            appointment['title'],
                            style: TextStyle(
                              fontSize: 14,
                              color: Colors.grey[600],
                            ),
                          ),
                          Text(
                            appointment['fullDateTime'] ?? '${appointment['date']} às ${appointment['time']}',
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.blue[600],
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: _getStatusColor(appointment['status']).withOpacity(0.1),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        appointment['status'],
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w600,
                          color: _getStatusColor(appointment['status']),
                        ),
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 12),
                Row(
                  children: [
                    _buildInfoChip(Icons.schedule, appointment['time']),
                    SizedBox(width: 8),
                    _buildInfoChip(Icons.timer, appointment['duration']),
                    SizedBox(width: 8),
                    _buildInfoChip(Icons.attach_money, appointment['price']),
                  ],
                ),
                SizedBox(height: 12),
                if (appointment['status'].toString().toLowerCase() == 'pendente')
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: () => _handleConfirm(appointment['id'].toString()),
                          icon: Icon(Icons.check, size: 16, color: Colors.green),
                          label: Text('Confirmar', style: TextStyle(color: Colors.green, fontSize: 12)),
                          style: OutlinedButton.styleFrom(
                            side: BorderSide(color: Colors.green),
                            padding: EdgeInsets.symmetric(vertical: 8),
                          ),
                        ),
                      ),
                      SizedBox(width: 8),
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: () => _handleCancel(appointment['id'].toString()),
                          icon: Icon(Icons.close, size: 16, color: Colors.red),
                          label: Text('Cancelar', style: TextStyle(color: Colors.red, fontSize: 12)),
                          style: OutlinedButton.styleFrom(
                            side: BorderSide(color: Colors.red),
                            padding: EdgeInsets.symmetric(vertical: 8),
                          ),
                        ),
                      ),
                    ],
                  ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildInfoChip(IconData icon, String text) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.grey[100],
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 12, color: Colors.grey[600]),
          SizedBox(width: 4),
          Text(
            text,
            style: TextStyle(
              fontSize: 10,
              color: Colors.grey[700],
            ),
          ),
        ],
      ),
    );
  }

  List<dynamic> _getEventsForDay(DateTime day) {
    return _appointments.where((appointment) {
      if (appointment['dateTime'] == null) return false;
      try {
        final appointmentDate = DateTime.parse(appointment['dateTime'].toString());
        return isSameDay(appointmentDate, day);
      } catch (e) {
        return false;
      }
    }).toList();
  }

  Future<void> _handleConfirm(String agendamentoId) async {
    try {
      await ApiService.put('agendamentos/confirmar/$agendamentoId', {});
      
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Agendamento confirmado com sucesso'),
          backgroundColor: Colors.green,
        ),
      );
      
      _loadAppointments();
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Erro ao confirmar agendamento'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  Future<void> _handleCancel(String agendamentoId) async {
    try {
      await ApiService.put('agendamentos/rejeitar/$agendamentoId', {});
      
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Agendamento cancelado com sucesso'),
          backgroundColor: Colors.red,
        ),
      );
      
      _loadAppointments();
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Erro ao cancelar agendamento: $e'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  Color _getStatusColor(String? status) {
    switch (status?.toLowerCase()) {
      case 'confirmado': return Colors.green;
      case 'pendente': return Colors.orange;
      case 'completo': return Colors.blue;
      case 'cancelado': return Colors.red;
      default: return Colors.grey;
    }
  }
}