import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../services/api_service.dart';
import '../../services/auth_service.dart';
import '../../widgets/bottom_nav_barber.dart';

class BarberDashboard extends StatefulWidget {
  const BarberDashboard({super.key});

  @override
  _BarberDashboardState createState() => _BarberDashboardState();
}

class _BarberDashboardState extends State<BarberDashboard> {
  List<Map<String, dynamic>> agendamentos = [];
  Map<String, dynamic>? ultimoCorte;
  bool isLoading = true;
  String? barberName;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => isLoading = true);

    try {
      final authService = Provider.of<AuthService>(context, listen: false);
      final user = await authService.getCurrentUser();
      barberName = user?['nome'] ?? 'Barbeiro';

      final agendamentosResponse = await ApiService.get('agendamentos/confirmados/${user?['id'] ?? 1}');
      
      if (agendamentosResponse != null && agendamentosResponse is List) {
        agendamentos = agendamentosResponse.map((item) {
          if (item is List) {
            return {
              'id': item[0],
              'dataAgendamento': item[1],
              'statusAgendamento': item[2],
              'clienteNome': item[3],
              'servicoNome': item[4],
            };
          }
          return item as Map<String, dynamic>;
        }).toList().cast<Map<String, dynamic>>();
      }
      
      final ultimoCorteResponse = await ApiService.get('agendamentos/ultimo-corte/${user?['id'] ?? 1}');
      
      if (ultimoCorteResponse != null && ultimoCorteResponse is List && ultimoCorteResponse.isNotEmpty) {
        final item = ultimoCorteResponse[0];
        if (item is List && item.length >= 4) {
          ultimoCorte = {
            'id': item[0],
            'dataAgendamento': item[1],
            'clienteNome': item[2],
            'servicoNome': item[3],
          };
        }
      }
    } catch (e) {
      debugPrint('Erro ao carregar dados: $e');
    }

    setState(() => isLoading = false);
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
        onRefresh: _loadData,
        color: Colors.blue[600],
        child: CustomScrollView(
          slivers: [
            _buildAppBar(),
            SliverToBoxAdapter(child: _buildMetrics()),
            SliverToBoxAdapter(child: _buildTodaySection()),
            SliverToBoxAdapter(child: _buildRecentSection()),
            SliverToBoxAdapter(child: SizedBox(height: 100)),
          ],
        ),
      ),
      bottomNavigationBar: BarberBottomNavBar(currentIndex: 0),
    );
  }

  Widget _buildAppBar() {
    return SliverAppBar(
      backgroundColor: Colors.white,
      elevation: 0,
      pinned: true,
      expandedHeight: 140,
      flexibleSpace: FlexibleSpaceBar(
        background: Container(
          color: Colors.white,
          padding: EdgeInsets.fromLTRB(20, 80, 20, 20),
          child: Row(
            children: [
              CircleAvatar(
                radius: 20,
                backgroundColor: Colors.blue[100],
                child: Text(
                  (barberName ?? 'B')[0].toUpperCase(),
                  style: TextStyle(
                    color: Colors.blue[700],
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      'Olá, ${barberName ?? 'Barbeiro'}',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: Colors.grey[800],
                      ),
                      overflow: TextOverflow.ellipsis,
                      maxLines: 1,
                    ),
                    Text(
                      _getCurrentDate(),
                      style: TextStyle(
                        fontSize: 11,
                        color: Colors.grey[600],
                      ),
                      overflow: TextOverflow.ellipsis,
                      maxLines: 1,
                    ),
                  ],
                ),
              ),
              IconButton(
                onPressed: () => Navigator.pushNamed(context, '/notifications'),
                icon: Icon(Icons.notifications_outlined, color: Colors.grey[700], size: 20),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMetrics() {
    return Container(
      margin: EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Visão Geral',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: Colors.grey[800],
            ),
          ),
          SizedBox(height: 12),
          Row(
            children: [
              Expanded(child: _buildMetricCard('Agendamentos', '${agendamentos.length}', Icons.schedule, Colors.blue)),
              SizedBox(width: 8),
              Expanded(child: _buildMetricCard('Faturamento', 'R\$ 450', Icons.attach_money, Colors.green)),
            ],
          ),
          SizedBox(height: 8),
          Row(
            children: [
              Expanded(child: _buildMetricCard('Avaliação', '4.8', Icons.star, Colors.orange)),
              SizedBox(width: 8),
              Expanded(child: _buildMetricCard('Clientes', '${agendamentos.length}', Icons.people, Colors.purple)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildMetricCard(String title, String value, IconData icon, Color color) {
    return Container(
      padding: EdgeInsets.all(12),
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
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: color, size: 18),
          SizedBox(height: 6),
          Text(
            value,
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w700,
              color: Colors.grey[800],
            ),
            overflow: TextOverflow.ellipsis,
            maxLines: 1,
          ),
          Text(
            title,
            style: TextStyle(
              fontSize: 10,
              color: Colors.grey[600],
            ),
            overflow: TextOverflow.ellipsis,
            maxLines: 1,
          ),
        ],
      ),
    );
  }

  Widget _buildTodaySection() {
    return Container(
      margin: EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Agenda de Hoje',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                  color: Colors.grey[800],
                ),
              ),
              TextButton(
                onPressed: () => Navigator.pushNamed(context, '/agenda-barber'),
                child: Text('Ver tudo', style: TextStyle(color: Colors.blue[600])),
              ),
            ],
          ),
          SizedBox(height: 8),
          Container(
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
            child: agendamentos.isEmpty
                ? _buildEmptyState('Nenhum agendamento hoje', Icons.event_available)
                : Column(
                    children: agendamentos.take(3).map((item) => _buildAppointmentItem(item)).toList(),
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildAppointmentItem(Map<String, dynamic> item) {
    return Container(
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        border: Border(bottom: BorderSide(color: Colors.grey[200]!, width: 0.5)),
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 20,
            backgroundColor: Colors.blue[50],
            child: Icon(Icons.person, color: Colors.blue[600], size: 20),
          ),
          SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item['clienteNome'] ?? 'Cliente',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: Colors.grey[800],
                  ),
                ),
                Text(
                  item['servicoNome'] ?? 'Serviço',
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey[600],
                  ),
                ),
              ],
            ),
          ),
          Container(
            padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: _getStatusColor(item['statusAgendamento']).withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Text(
              item['statusAgendamento'] ?? 'Pendente',
              style: TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.w600,
                color: _getStatusColor(item['statusAgendamento']),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRecentSection() {
    return Container(
      margin: EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Atividade Recente',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: Colors.grey[800],
            ),
          ),
          SizedBox(height: 8),
          Container(
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
            child: ultimoCorte != null
                ? Container(
                    padding: EdgeInsets.all(16),
                    child: Row(
                      children: [
                        CircleAvatar(
                          radius: 20,
                          backgroundColor: Colors.green[50],
                          child: Icon(Icons.check_circle, color: Colors.green[600], size: 20),
                        ),
                        SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Serviço Concluído',
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w600,
                                  color: Colors.grey[800],
                                ),
                              ),
                              Text(
                                '${ultimoCorte!['clienteNome']} - ${ultimoCorte!['servicoNome']}',
                                style: TextStyle(
                                  fontSize: 12,
                                  color: Colors.grey[600],
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  )
                : _buildEmptyState('Nenhuma atividade recente', Icons.history),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState(String message, IconData icon) {
    return Container(
      padding: EdgeInsets.all(32),
      child: Column(
        children: [
          Icon(icon, color: Colors.grey[400], size: 32),
          SizedBox(height: 8),
          Text(
            message,
            style: TextStyle(
              color: Colors.grey[600],
              fontSize: 14,
            ),
          ),
        ],
      ),
    );
  }

  String _getCurrentDate() {
    final now = DateTime.now();
    final months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return '${now.day} ${months[now.month - 1]}, ${now.year}';
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