import 'dart:convert';
import 'dart:io';
import 'dart:async';
import 'package:http/http.dart' as http;
import 'package:flutter/foundation.dart';

class ApiService {
  // URL base da API - ajuste para o endereço do seu backend
  // Use localhost para testes no Chrome ou emulador web
  // Use 10.0.2.2 para emulador Android
  static String get baseUrl {
    return 'http://localhost:8080/api';
  }

  // Headers padrão para requisições
  static final Map<String, String> _headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  // Método para definir token de autenticação
  static void setAuthToken(String token) {
    _headers['Authorization'] = 'Bearer $token';
  }

  // Método para limpar token de autenticação
  static void clearAuthToken() {
    _headers.remove('Authorization');
  }

  // GET request
  static Future<dynamic> get(String endpoint) async {
    try {
      // Remove 'api/' do início do endpoint se existir
      if (endpoint.startsWith('api/')) {
        endpoint = endpoint.substring(4);
      }
      
      final urlString = '$baseUrl/$endpoint';
      debugPrint('GET Request: $urlString');
      
      final response = await http.get(
        Uri.parse(urlString),
        headers: _headers,
      ).timeout(
        const Duration(seconds: 10),
        onTimeout: () {
          throw Exception('A conexão expirou. Verifique se o servidor está rodando na porta 8080.');
        },
      );
      
      debugPrint('GET Response: ${response.statusCode}');
      return _processResponse(response);
    } catch (e) {
      debugPrint('GET Error: $e');
      if (e is SocketException) {
        throw Exception('Não foi possível conectar ao servidor. Verifique se o servidor está rodando e acessível.');
      } else {
        throw Exception('Falha na conexão com o servidor: $e');
      }
    }
  }

  // POST request
  static Future<dynamic> post(String endpoint, dynamic data) async {
    try {
      // Remove 'api/' do início do endpoint se existir
      if (endpoint.startsWith('api/')) {
        endpoint = endpoint.substring(4);
      }
      
      final urlString = '$baseUrl/$endpoint';
      debugPrint('POST Request: $urlString');
      debugPrint('POST Data: ${json.encode(data)}');
      
      final response = await http.post(
        Uri.parse(urlString),
        headers: _headers,
        body: json.encode(data),
      );
      
      debugPrint('POST Response: ${response.statusCode}');
      debugPrint('POST Response Body: ${response.body}');
      
      return _processResponse(response);
    } catch (e) {
      debugPrint('POST Error: $e');
      throw Exception('Falha na conexão com o servidor: $e');
    }
  }

  // PUT request
  static Future<dynamic> put(String endpoint, dynamic data) async {
    try {
      // Remove 'api/' do início do endpoint se existir
      if (endpoint.startsWith('api/')) {
        endpoint = endpoint.substring(4);
      }
      
      final urlString = '$baseUrl/$endpoint';
      debugPrint('PUT Request: $urlString');
      final response = await http.put(
        Uri.parse(urlString),
        headers: _headers,
        body: json.encode(data),
      );
      
      debugPrint('PUT Response: ${response.statusCode}');
      return _processResponse(response);
    } catch (e) {
      debugPrint('PUT Error: $e');
      throw Exception('Falha na conexão com o servidor: $e');
    }
  }

  // DELETE request
  static Future<dynamic> delete(String endpoint) async {
    try {
      // Remove 'api/' do início do endpoint se existir
      if (endpoint.startsWith('api/')) {
        endpoint = endpoint.substring(4);
      }
      
      final urlString = '$baseUrl/$endpoint';
      debugPrint('DELETE Request: $urlString');

      final response = await http.delete(
        Uri.parse(urlString),
        headers: _headers,
      );
      
      debugPrint('DELETE Response: ${response.statusCode}');
      return _processResponse(response);
    } catch (e) {
      debugPrint('DELETE Error: $e');
      throw Exception('Falha na conexão com o servidor: $e');
    }
  }

  // Processa a resposta da API
  static dynamic _processResponse(http.Response response) {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      if (response.body.isNotEmpty) {
        try {
          return json.decode(response.body);
        } catch (e) {
          debugPrint('Erro ao decodificar resposta JSON: $e');
          debugPrint('Corpo da resposta: ${response.body}');
          throw Exception('Resposta inválida do servidor');
        }
      }
      return null;
    } else {
      debugPrint('Erro na requisição: ${response.statusCode}');
      debugPrint('Corpo da resposta: ${response.body}');
      
      // Tentar extrair mensagem de erro se possível
      String errorMessage = 'Erro ${response.statusCode}';
      try {
        final errorBody = json.decode(response.body);
        if (errorBody['message'] != null) {
          errorMessage = errorBody['message'];
        } else if (errorBody['error'] != null) {
          errorMessage = errorBody['error'];
        }
      } catch (_) {}
      
      throw Exception('Falha na requisição: $errorMessage');
    }
  }
  
  // Adicione este método ao ApiService para verificar se o servidor está online
static Future<bool> isServerOnline() async {
  try {
    final response = await http.get(
      Uri.parse('$baseUrl/usuarios/validate'),
      headers: _headers,
    ).timeout(const Duration(seconds: 5));
    return response.statusCode >= 200 && response.statusCode < 300;
  } catch (e) {
    return false;
  }
}

// Você pode chamar este método ao iniciar o aplicativo para decidir se deve usar dados locais


  // Método para testar a conexão com o backend
  static Future<bool> testConnection() async {
    try {
      // Tenta acessar a rota de usuários para verificar se o servidor está online
      final urlString = '$baseUrl/usuarios';
      debugPrint('Teste de conexão: $urlString');
      final response = await http.get(Uri.parse(urlString));
      debugPrint('Teste de conexão resposta: ${response.statusCode}');
      return response.statusCode >= 200 && response.statusCode < 500;
    } catch (e) {
      debugPrint('Erro ao testar conexão: $e');
      return false;
    }
  }
}