import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'app.dart';
import 'services/auth_service.dart';
import 'services/barber_service.dart';
import 'services/appointment_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Inicializar serviços
  final authService = AuthService();
  await authService.init();
  
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider<AuthService>.value(value: authService),
        Provider<BarberService>(create: (_) => BarberService()),
        Provider<AppointmentService>(create: (_) => AppointmentService()),
      ],
      child: const BarberShopApp(),
    ),
  );
}