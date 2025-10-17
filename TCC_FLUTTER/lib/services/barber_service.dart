import '../models/barber.dart';

class BarberService {
  // Get popular barbers
  Future<List<Barber>> getPopularBarbers() async {
    return [
      Barber(
        id: '1',
        name: 'Corte Degradê Popular',
        imageUrl: 'assets/images/images_suggestions/cortes.png',
        rating: 4.8,
        originalPrice: 50.0,
        discountPrice: 40.0,
        specialties: ['Corte', 'Barba', 'Tratamento'],
        isPopular: true,
      ),
      Barber(
        id: '2',
        name: 'Barba Completa Popular',
        imageUrl: 'assets/images/images_suggestions/cortes2.png',
        rating: 4.7,
        originalPrice: 35.0,
        discountPrice: 30.0,
        specialties: ['Barba', 'Tratamento'],
        isPopular: true,
      ),
    ];
  }

  // Get recently viewed barbers
  Future<List<Barber>> getRecentBarbers() async {
    return [
      Barber(
        id: '4',
        name: 'Corte Feminino Recente',
        imageUrl: 'assets/images/images_recently/cortesFem.png',
        rating: 4.9,
        originalPrice: 70.0,
        discountPrice: 60.0,
        specialties: ['Corte Feminino', 'Tratamento'],
        isPopular: false,
      ),
    ];
  }

  // Get featured barbers
  Future<List<Barber>> getFeaturedBarbers() async {
    return [
      Barber(
        id: '7',
        name: 'Serviço Premium Destaque',
        imageUrl: 'assets/images/images_services/corte.png',
        rating: 5.0,
        originalPrice: 60.0,
        discountPrice: 45.0,
        specialties: ['Corte', 'Barba', 'Tratamento'],
        isPopular: true,
      ),
    ];
  }
  
  // Método auxiliar para mapear dados da API para o modelo Barber
  Barber _mapToBarber(Map<String, dynamic> item) {
    return Barber(
      id: item['id']?.toString() ?? '',
      name: item['nome'] ?? '',
      imageUrl: item['imagemUrl'] ?? 'assets/images/images_suggestions/cortes.png',
      rating: _toDouble(item['avaliacao']) ?? 4.5,
      originalPrice: _toDouble(item['precoOriginal']) ?? 45.0,
      discountPrice: _toDouble(item['precoDesconto']) ?? 35.0,
      specialties: item['especialidades'] != null 
          ? List<String>.from(item['especialidades']) 
          : ['Corte', 'Barba', 'Tratamento'],
      isPopular: item['popular'] ?? false,
    );
  }
  
  // Método auxiliar para converter valores para double com segurança
  double? _toDouble(dynamic value) {
    if (value == null) return null;
    if (value is double) return value;
    if (value is int) return value.toDouble();
    if (value is String) {
      try {
        return double.parse(value);
      } catch (_) {
        return null;
      }
    }
    return null;
  }
}