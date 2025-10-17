import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../services/api_service.dart';
import '../../services/auth_service.dart';
import '../../widgets/bottom_nav_barber.dart';
import '../../theme/app_colors.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  @override
  _NotificationsScreenState createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  String _selectedTab = 'Pendentes';
  bool isLoading = true;
  List<Map<String, dynamic>> _notifications = [];

  @override
  void initState() {
    super.initState();
    _loadNotifications();
  }

  Future<void> _loadNotifications() async {
    setState(() => isLoading = true);

    try {
      final authService = Provider.of<AuthService>(context, listen: false);
      final user = await authService.getCurrentUser();
      final barbeiroId = user?['id'] ?? 1;
      
      final response = await ApiService.get('agendamentos/pendentes/$barbeiroId');
      
      if (response != null && response is List) {
        _notifications = [];
        
        for (var item in response) {
          try {
            if (item is List && item.length >= 5) {
              _notifications.add({
                'id': item[0].toString(),
                'clientName': item[3] ?? 'Cliente',
                'subtitle': 'Solicitação de agendamento',
                'time': _formatTime(item[1]),
                'date': _formatFullDate(item[1]),
                'serviceName': item[4] ?? 'Serviço',
                'status': item[2] ?? 'Pendente',
                'isRead': false,
              });
            } else if (item is Map<String, dynamic>) {
              _notifications.add({
                'id': item['id']?.toString() ?? '0',
                'clientName': item['clienteNome'] ?? 'Cliente',
                'subtitle': 'Solicitação de agendamento',
                'time': _formatTime(item['dataAgendamento']),
                'date': _formatFullDate(item['dataAgendamento']),
                'serviceName': item['servicoNome'] ?? 'Serviço',
                'status': item['statusAgendamento'] ?? 'Pendente',
                'isRead': false,
              });
            }
          } catch (e) {
            debugPrint('Erro ao processar item de notificação: $e');
          }
        }
      }
    } catch (e) {
      debugPrint('Erro ao carregar notificações: $e');
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

  String _formatFullDate(dynamic dateTime) {
    if (dateTime == null) return 'Data não informada';
    try {
      final dt = DateTime.parse(dateTime.toString());
      return '${dt.day}/${dt.month}/${dt.year} às ${_formatTime(dateTime)}';
    } catch (e) {
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
      body: CustomScrollView(
        slivers: [
          _buildAppBar(),
          SliverToBoxAdapter(child: _buildTabSelector()),
          SliverToBoxAdapter(child: _buildNotificationsList()),
          SliverToBoxAdapter(child: SizedBox(height: 100)),
        ],
      ),
      bottomNavigationBar: BarberBottomNavBar(currentIndex: 1),
    );
  }

  Widget _buildAppBar() {
    return SliverAppBar(
      backgroundColor: Colors.white,
      elevation: 1,
      pinned: true,
      title: Row(
        children: [
          Icon(Icons.notifications, color: Colors.blue[600], size: 24),
          SizedBox(width: 8),
          Text(
            'Notificações',
            style: TextStyle(
              color: Colors.grey[800],
              fontSize: 20,
              fontWeight: FontWeight.w600,
            ),
          ),
          if (_notifications.isNotEmpty) ..[
            SizedBox(width: 8),
            Container(
              padding: EdgeInsets.symmetric(horizontal: 8, vertical: 2),
              decoration: BoxDecoration(
                color: Colors.red,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Text(
                '${_notifications.length}',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ],
        ],
      ),
      leading: IconButton(
        icon: Icon(Icons.arrow_back, color: Colors.grey[700]),
        onPressed: () => Navigator.pop(context),
      ),
      actions: [
        IconButton(
          icon: Icon(Icons.refresh, color: Colors.grey[700]),
          onPressed: _loadNotifications,
        ),
      ],
    );
  }

  Widget _buildTabSelector() {
    return Container(
      margin: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(8),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 4,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          _buildTabButton('Pendentes'),
          _buildTabButton('Concluídos'),
        ],
      ),
    );
  }

  Widget _buildTabButton(String tab) {
    bool isSelected = _selectedTab == tab;
    return Expanded(
      child: GestureDetector(
        onTap: () {
          setState(() {
            _selectedTab = tab;
          });
        },
        child: Container(
          padding: EdgeInsets.symmetric(vertical: 16),
          decoration: BoxDecoration(
            color: isSelected ? Colors.blue[600] : Colors.transparent,
            borderRadius: BorderRadius.circular(8),
          ),
          child: Text(
            tab,
            style: TextStyle(
              color: isSelected ? Colors.white : Colors.grey[600],
              fontSize: 14,
              fontWeight: FontWeight.w600,
            ),
            textAlign: TextAlign.center,
          ),
        ),
      ),
    );
  }

  List<Map<String, dynamic>> _getFilteredNotifications() {
    if (_selectedTab == 'Concluídos') {
      return _notifications.where((n) => n['isRead'] == true).toList();
    } else {
      return _notifications.where((n) => n['isRead'] == false).toList();
    }
  }

  Widget _buildNotificationsList() {
    List<Map<String, dynamic>> filteredNotifications = _getFilteredNotifications();
    
    if (filteredNotifications.isEmpty) {
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
            Icon(Icons.notifications_off, color: Colors.grey[400], size: 48),
            SizedBox(height: 16),
            Text(
              'Nenhuma notificação encontrada',
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
      itemCount: filteredNotifications.length,
      itemBuilder: (context, index) {
        final notification = filteredNotifications[index];
        
        return Container(
          margin: EdgeInsets.only(bottom: 8),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
            border: Border.left(
              color: Colors.blue[600]!,
              width: 4,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.08),
                blurRadius: 8,
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
                    Stack(
                      children: [
                        CircleAvatar(
                          radius: 24,
                          backgroundColor: Colors.blue[50],
                          child: Icon(Icons.person, color: Colors.blue[600], size: 24),
                        ),
                        Positioned(
                          top: 0,
                          right: 0,
                          child: Container(
                            width: 12,
                            height: 12,
                            decoration: BoxDecoration(
                              color: Colors.red,
                              shape: BoxShape.circle,
                              border: Border.all(color: Colors.white, width: 2),
                            ),
                          ),
                        ),
                      ],
                    ),
                    SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            notification['clientName'] ?? 'Cliente',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                              color: Colors.grey[800],
                            ),
                          ),
                          Text(
                            notification['subtitle'] ?? 'Solicitação de agendamento',
                            style: TextStyle(
                              fontSize: 14,
                              color: Colors.grey[600],
                            ),
                          ),
                          Text(
                            notification['date'] ?? 'Data não informada',
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
                        color: Colors.orange[50],
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        notification['status'] ?? 'Pendente',
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w600,
                          color: Colors.orange[700],
                        ),
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 12),
                Container(
                  padding: EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.grey[50],
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Detalhes do Agendamento',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: Colors.grey[800],
                        ),
                      ),
                      SizedBox(height: 8),
                      _buildDetailRow('Serviço:', notification['serviceName'] ?? 'Serviço'),
                      _buildDetailRow('Horário:', notification['time'] ?? '00:00'),
                    ],
                  ),
                ),
                SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: () => _handleAcceptSingle(notification['id']),
                        icon: Icon(Icons.check, size: 16),
                        label: Text('Confirmar', style: TextStyle(fontSize: 12)),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.green,
                          foregroundColor: Colors.white,
                          padding: EdgeInsets.symmetric(vertical: 8),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(6),
                          ),
                        ),
                      ),
                    ),
                    SizedBox(width: 8),
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: () => _handleRejectSingle(notification['id']),
                        icon: Icon(Icons.close, size: 16),
                        label: Text('Rejeitar', style: TextStyle(fontSize: 12)),
                        style: OutlinedButton.styleFrom(
                          foregroundColor: Colors.red,
                          side: BorderSide(color: Colors.red),
                          padding: EdgeInsets.symmetric(vertical: 8),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(6),
                          ),
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

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: EdgeInsets.only(bottom: 4),
      child: Row(
        children: [
          Text(
            label,
            style: TextStyle(
              color: Colors.grey[600],
              fontSize: 12,
              fontWeight: FontWeight.w500,
            ),
          ),
          SizedBox(width: 8),
          Text(
            value,
            style: TextStyle(
              color: Colors.grey[800],
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _handleAcceptSingle(String agendamentoId) async {
    try {
      await ApiService.put('agendamentos/confirmar/$agendamentoId', {});
      
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Agendamento confirmado com sucesso'),
          backgroundColor: Colors.green,
        ),
      );
      
      _loadNotifications();
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Erro ao confirmar agendamento'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  Future<void> _handleRejectSingle(String agendamentoId) async {
    try {
      await ApiService.put('agendamentos/rejeitar/$agendamentoId', {});
      
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Agendamento rejeitado com sucesso'),
          backgroundColor: Colors.red,
        ),
      );
      
      _loadNotifications();
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Erro ao rejeitar agendamento'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }
}