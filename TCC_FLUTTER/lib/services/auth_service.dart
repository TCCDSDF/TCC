import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import '../models/user.dart';
import 'api_service.dart';

class AuthService extends ChangeNotifier {
  // Chaves para armazenamento local
  static const String _userKey = 'user_data';
  
  // Estado
  User? _currentUser;
  bool _isLoading = false;
  String? _errorMessage;
  bool _isInitialized = false;
  
  // Getters
  User? get currentUser => _currentUser;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  bool get isLoggedIn => _currentUser != null;
  
  // Inicialização
  Future<void> init() async {
    if (_isInitialized) return;
    
    _isLoading = true;
    notifyListeners();
    
    try {
      await _loadUserFromStorage();
    } catch (e) {
      debugPrint('Erro ao inicializar AuthService: $e');
    }
    
    _isLoading = false;
    _isInitialized = true;
    notifyListeners();
  }
  
  // Carregar usuário do armazenamento local
  Future<void> _loadUserFromStorage() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final userString = prefs.getString(_userKey);
      
      if (userString != null) {
        final userData = json.decode(userString);
        _currentUser = User.fromJson(userData);
        notifyListeners();
      }
    } catch (e) {
      debugPrint('Erro ao carregar usuário do armazenamento: $e');
    }
  }
  
  // Obter usuário atual
  Future<Map<String, dynamic>?> getCurrentUser() async {
    if (_currentUser != null) {
      return _currentUser!.toJson();
    }
    
    try {
      await _loadUserFromStorage();
      return _currentUser?.toJson();
    } catch (e) {
      debugPrint('Erro ao obter usuário atual: $e');
      return null;
    }
  }
  
  // Login
  Future<bool> login(String email, String senha) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();
    
    try {
      // Dados de teste para desenvolvimento
      if (email == 'seuantonhu@outlook.com.br' && senha == 'seViraAi') {
        // Simular login de barbeiro para desenvolvimento
        final userData = {
          'id': 1,
          'nome': 'Barbeiro Teste',
          'email': email,
          'tipo': 'barbeiro',
          'isAdmin': false,
          'isBarber': true
        };
        
        _currentUser = User.fromJson(userData);
        
        // Salvar dados do usuário
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString(_userKey, json.encode(_currentUser!.toJson()));
        
        _isLoading = false;
        notifyListeners();
        return true;
      }
      
      // Tentar login real com o backend
      final response = await ApiService.post('usuarios/login', {
        'email': email,
        'senha': senha
      });
      
      if (response != null && response['id'] != null) {
        // Adicionar propriedades extras baseadas no tipo
        final tipo = response['tipo'] as String?;
        response['isAdmin'] = tipo == 'admin';
        response['isBarber'] = tipo == 'barbeiro';
        
        debugPrint('Tipo de usuário: $tipo');
        debugPrint('isAdmin: ${response['isAdmin']}');
        debugPrint('isBarber: ${response['isBarber']}');
        
        // Criar objeto User
        _currentUser = User.fromJson(response);
        
        // Salvar dados do usuário
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString(_userKey, json.encode(_currentUser!.toJson()));
        
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _errorMessage = 'Credenciais inválidas';
        _isLoading = false;
        notifyListeners();
        return false;
      }
    } catch (e) {
      debugPrint('Erro ao fazer login: $e');
      
      // Modo offline para desenvolvimento
      if (email == 'admin@admin.com' && senha == 'admin123') {
        final userData = {
          'id': 2,
          'nome': 'Admin Teste',
          'email': email,
          'tipo': 'admin',
          'isAdmin': true,
          'isBarber': false
        };
        
        _currentUser = User.fromJson(userData);
        
        // Salvar dados do usuário
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString(_userKey, json.encode(_currentUser!.toJson()));
        
        _isLoading = false;
        notifyListeners();
        return true;
      }
      
      _errorMessage = 'Erro ao fazer login: $e';
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }
  
  // Registro
  Future<bool> register(String nome, String email, String senha) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();
    
    try {
      final response = await ApiService.post('usuarios/register', {
        'nome': nome,
        'email': email,
        'senha': senha
      });
      
      if (response != null && response['success'] == true) {
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _errorMessage = response?['message'] ?? 'Falha ao registrar';
        _isLoading = false;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _errorMessage = 'Erro ao registrar: $e';
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }
  
  // Logout
  Future<bool> logout() async {
    _isLoading = true;
    notifyListeners();
    
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(_userKey);
      _currentUser = null;
      
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = 'Erro ao fazer logout: $e';
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }
  
  // Testar conexão com o backend
  Future<bool> testBackendConnection() async {
    try {
      final response = await ApiService.get('health');
      return response != null;
    } catch (e) {
      debugPrint('Erro ao testar conexão com o backend: $e');
      return false;
    }
  }
}