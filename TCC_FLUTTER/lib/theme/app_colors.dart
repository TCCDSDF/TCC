import 'package:flutter/material.dart';

class AppColors {
  // Cores principais - Tema Luxuoso
  static const Color primary = Color(0xFFC4A47C); // Dourado mais suave
  static const Color secondary = Color(0xFF3A2618); // Marrom café escuro
  static const Color accent = Color(0xFFE9D5B9); // Dourado claro
  
  // Cores de fundo
  static const Color background = Color(0xFF121212); // Preto profundo
  static const Color cardBackground = Color(0xFF1E1E1E); // Preto mais claro
  static const Color inputBackground = Color(0xFF2C2C2C); // Cinza escuro
  
  // Cores de texto
  static const Color textPrimary = Colors.white;
  static const Color textSecondary = Color(0xFFE0E0E0); // Branco suave
  static const Color textMuted = Color(0xFFAAAAAA); // Cinza claro
  static const Color textGold = Color(0xFFC4A47C); // Dourado para textos especiais
  
  // Cores de status
  static const Color success = Color(0xFF4CAF50);
  static const Color error = Color(0xFFE53935);
  static const Color warning = Color(0xFFFFB300);
  static const Color info = Color(0xFF2196F3);
  
  // Cores de gradiente
  static const List<Color> primaryGradient = [
    Color(0xFFC4A47C), // Dourado suave
    Color(0xFFA38155), // Dourado mais escuro
  ];
  
  static const List<Color> darkGradient = [
    Color(0xFF1E1E1E), // Preto mais claro
    Color(0xFF121212), // Preto profundo
  ];
  
  static const List<Color> brownGradient = [
    Color(0xFF3A2618), // Marrom café escuro
    Color(0xFF241912), // Marrom café mais escuro
  ];
  
  // Cores de sombra
  static Color shadowColor = Colors.black.withOpacity(0.5);
  static Color goldShadow = Color(0xFFC4A47C).withOpacity(0.3);
  
  // Decorações
  static BoxDecoration luxuryCardDecoration = BoxDecoration(
    color: cardBackground,
    borderRadius: BorderRadius.circular(16),
    boxShadow: [
      BoxShadow(
        color: shadowColor,
        blurRadius: 15,
        offset: Offset(0, 5),
      ),
    ],
    border: Border.all(
      color: primary.withOpacity(0.3),
      width: 1,
    ),
  );
  
  static BoxDecoration luxuryGradientDecoration = BoxDecoration(
    gradient: LinearGradient(
      colors: [secondary, Color(0xFF241912)],
      begin: Alignment.topLeft,
      end: Alignment.bottomRight,
    ),
    borderRadius: BorderRadius.circular(16),
    boxShadow: [
      BoxShadow(
        color: shadowColor,
        blurRadius: 15,
        offset: Offset(0, 5),
      ),
    ],
  );
  
  // Novas decorações para o tema cinematográfico
  static BoxDecoration cinematicCardDecoration = BoxDecoration(
    color: Colors.black.withOpacity(0.4),
    borderRadius: BorderRadius.circular(16),
    boxShadow: [
      BoxShadow(
        color: shadowColor,
        blurRadius: 15,
        offset: Offset(0, 5),
      ),
    ],
    border: Border.all(
      color: primary.withOpacity(0.3),
      width: 1,
    ),
    backgroundBlendMode: BlendMode.overlay,
  );
  
  static BoxDecoration glassmorphismDecoration = BoxDecoration(
    color: Colors.black.withOpacity(0.4),
    borderRadius: BorderRadius.circular(16),
    boxShadow: [
      BoxShadow(
        color: shadowColor,
        blurRadius: 15,
        offset: Offset(0, 5),
      ),
    ],
    border: Border.all(
      color: Colors.white.withOpacity(0.1),
      width: 1,
    ),
  );
  
  // Estilo de botão luxuoso
  static ButtonStyle luxuryButtonStyle = ButtonStyle(
    backgroundColor: WidgetStateProperty.all(Colors.transparent),
    shadowColor: WidgetStateProperty.all(Colors.transparent),
    shape: WidgetStateProperty.all(
      RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
    ),
    elevation: WidgetStateProperty.all(0),
    padding: WidgetStateProperty.all(
      EdgeInsets.symmetric(vertical: 16, horizontal: 24),
    ),
  );
}