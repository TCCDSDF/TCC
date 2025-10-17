import 'package:flutter/foundation.dart';
import 'api_service.dart';

class ProfileService {
  // Obter dados do perfil
  Future<Map<String, dynamic>> getProfile(int userId) async {
    try {
      final response = await ApiService.get('perfil/$userId');
      
      if (response != null) {
        return response;
      }
      
      // Fallback para dados padrão
      return {
        'id': userId,
        'nome': 'Usuário',
        'email': 'usuario@email.com',
        'telefone': '',
        'nivelFidelidade': 'Bronze'
      };
    } catch (e) {
      debugPrint('Erro ao buscar perfil: $e');
      // Retornar dados padrão em caso de erro
      return {
        'id': userId,
        'nome': 'Usuário',
        'email': 'usuario@email.com',
        'telefone': '',
        'nivelFidelidade': 'Bronze'
      };
    }
  }

  // Atualizar dados do perfil
  Future<bool> updateProfile(int userId, Map<String, dynamic> data) async {
    try {
      final response = await ApiService.put('perfil/$userId', data);
      return response != null && response['success'] == true;
    } catch (e) {
      debugPrint('Erro ao atualizar perfil: $e');
      return false;
    }
  }
}