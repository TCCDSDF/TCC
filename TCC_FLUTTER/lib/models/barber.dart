class Barber {
  final String id;
  final String name;
  final String imageUrl;
  final double rating;
  final double originalPrice;
  final double discountPrice;
  final List<String> specialties;
  final bool isPopular;

  Barber({
    required this.id,
    required this.name,
    required this.imageUrl,
    required this.rating,
    required this.originalPrice,
    required this.discountPrice,
    required this.specialties,
    this.isPopular = false,
  });

  factory Barber.fromJson(Map<String, dynamic> json) {
    return Barber(
      id: json['id'],
      name: json['name'],
      imageUrl: json['imageUrl'],
      rating: json['rating'].toDouble(),
      originalPrice: json['originalPrice'].toDouble(),
      discountPrice: json['discountPrice'].toDouble(),
      specialties: List<String>.from(json['specialties']),
      isPopular: json['isPopular'] ?? false,
    );
  }

  get price => null;

  get reviewCount => null;

  String? get description => null;

  get services => null;

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'imageUrl': imageUrl,
      'rating': rating,
      'originalPrice': originalPrice,
      'discountPrice': discountPrice,
      'specialties': specialties,
      'isPopular': isPopular,
    };
  }
}