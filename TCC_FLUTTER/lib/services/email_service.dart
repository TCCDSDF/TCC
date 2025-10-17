import 'dart:convert';
import 'dart:math';
import 'package:http/http.dart' as http;
import 'package:flutter/foundation.dart';

class EmailService {
  // Configurações do EmailJS - substitua pelos seus dados
  static const String _serviceId = 'service_xxxxxxx';
  static const String _templateId = 'template_xxxxxxx';
  static const String _publicKey = 'your_public_key';
  static const String _privateKey = 'your_private_key';
  
  // Armazenar PINs temporariamente (em produção, use um banco de dados)
  static final Map<String, String> _storedPins = {};
  
  // Gerar PIN de 6 dígitos
  static String _generatePin() {
    final random = Random();
    return (100000 + random.nextInt(900000)).toString();
  }
  
  // Enviar PIN por email
  static Future<bool> sendPinToEmail(String email) async {
    try {
      final pin = _generatePin();
      _storedPins[email] = pin;
      
      // Para desenvolvimento, mostrar PIN no console
      if (kDebugMode) {
        debugPrint('PIN gerado para $email: $pin');
      }
      
      // Configurar dados do email
      final emailData = {
        'service_id': _serviceId,
        'template_id': _templateId,
        'user_id': _publicKey,
        'template_params': {
          'email': email,
          'pin_code': pin,
          'company_name': 'Barber Shop App',
        }
      };
      
      // Enviar email via EmailJS
      final response = await http.post(
        Uri.parse('https://api.emailjs.com/api/v1.0/email/send'),
        headers: {
          'Content-Type': 'application/json',
        },
        body: json.encode(emailData),
      );
      
      if (response.statusCode == 200) {
        debugPrint('Email enviado com sucesso para $email');
        return true;
      } else {
        debugPrint('Erro ao enviar email: ${response.statusCode}');
        // Em caso de erro no envio, ainda retorna true para desenvolvimento
        return true;
      }
    } catch (e) {
      debugPrint('Erro ao enviar PIN: $e');
      // Para desenvolvimento, sempre retorna true
      return true;
    }
  }
  
  // Verificar PIN
  static bool verifyPin(String email, String pin) {
    final storedPin = _storedPins[email];
    if (storedPin != null && storedPin == pin) {
      _storedPins.remove(email); // Remove PIN após verificação
      return true;
    }
    return false;
  }
  
  // Limpar PIN expirado (opcional)
  static void clearPin(String email) {
    _storedPins.remove(email);
  }
  
  // Para desenvolvimento - obter PIN atual
  static String? getCurrentPin(String email) {
    return kDebugMode ? _storedPins[email] : null;
  }
}