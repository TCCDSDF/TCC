import 'api_service.dart';

class AppointmentService {
  // Obter horários disponíveis para uma data específica
  Future<List<String>> getAvailableTimeSlots(String barberId, String date) async {
    try {
      final response = await ApiService.get('agendamentos/horarios-disponiveis?barberId=$barberId&data=$date');
      
      if (response != null && response is List) {
        return List<String>.from(response);
      } else if (response != null && response is Map && response.containsKey('horarios')) {
        // Caso o backend retorne um objeto com uma propriedade 'horarios'
        return List<String>.from(response['horarios']);
      }
      
      // Se não conseguir conectar ao servidor, retornar horários padrão
      print('Usando horários padrão devido a falha na conexão');
      return [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'
      ];
    } catch (e) {
      print('Erro ao buscar horários disponíveis: $e');
      // Retornar horários padrão em caso de erro
      return [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'
      ];
    }
  }

  // Criar um novo agendamento
  Future<bool> createAppointment({
    required String userId,
    required String barberId,
    required String serviceId,
    required String date,
    required String time,
  }) async {
    try {
      final response = await ApiService.post('api/agendamentos', {
        'usuarioId': userId,
        'barbeiroId': barberId,
        'servicoId': serviceId,
        'data': date,
        'horario': time,
      });
      
      return response != null && response['id'] != null;
    } catch (e) {
      print('Erro ao criar agendamento: $e');
      return false;
    }
  }

  // Obter agendamentos do usuário
  Future<List<Map<String, dynamic>>> getUserAppointments(String userId) async {
    try {
      final response = await ApiService.get('api/agendamentos/usuario/$userId');
      
      if (response != null) {
        return List<Map<String, dynamic>>.from(response);
      }
      return [];
    } catch (e) {
      print('Erro ao buscar agendamentos do usuário: $e');
      return [];
    }
  }

  // Cancelar um agendamento
  Future<bool> cancelAppointment(String appointmentId) async {
    try {
      final response = await ApiService.delete('api/agendamentos/$appointmentId');
      return true;
    } catch (e) {
      print('Erro ao cancelar agendamento: $e');
      return false;
    }
  }
}