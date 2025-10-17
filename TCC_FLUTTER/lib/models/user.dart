class User {
  final int id;
  final String nome;
  final String email;
  final String? tipo;
  final bool isAdmin;
  final bool isBarber;
  
  User({
    required this.id,
    required this.nome,
    required this.email,
    this.tipo,
    bool? isAdmin,
    bool? isBarber,
  }) : 
    isAdmin = isAdmin ?? tipo == 'admin',
    isBarber = isBarber ?? tipo == 'barbeiro';
  
  factory User.fromJson(Map<String, dynamic> json) {
    final tipo = json['tipo'] as String?;
    return User(
      id: json['id'] is String ? int.parse(json['id']) : json['id'],
      nome: json['nome'] ?? '',
      email: json['email'] ?? '',
      tipo: tipo,
      isAdmin: json['isAdmin'] ?? tipo == 'admin',
      isBarber: json['isBarber'] ?? tipo == 'barbeiro',
    );
  }
  
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'nome': nome,
      'email': email,
      'tipo': tipo,
      'isAdmin': isAdmin,
      'isBarber': isBarber,
    };
  }
}