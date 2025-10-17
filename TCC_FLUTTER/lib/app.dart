import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'screens/auth/login_screen.dart';
import 'screens/auth/signup_screen.dart';
import 'screens/auth/forgot_password_screen.dart';
import 'screens/auth/pin_verification_screen.dart';
import 'screens/auth/terms_of_service_screen.dart';
import 'screens/home/home_screen_barber.dart';
import 'screens/profile/barber_profile_screen.dart';
import 'screens/agenda/agenda_barber_screen.dart';
import 'screens/notifications_screen.dart';
import 'services/auth_service.dart';
import 'theme/app_theme.dart';

class BarberShopApp extends StatelessWidget {
  const BarberShopApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Barber App',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      initialRoute: '/',
      routes: {
        '/': (context) => Consumer<AuthService>(
          builder: (context, authService, _) {
            if (authService.isLoggedIn) {
              return BarberDashboard();
            } else {
              return const LoginScreen();
            }
          },
        ),
        '/login': (context) => const LoginScreen(),
        '/signup': (context) => const SignupScreen(),
        '/forgot-password': (context) => const ForgotPasswordScreen(),
        '/pin-verification': (context) => const PinVerificationScreen(email: ''),
        '/terms-of-service': (context) => const TermsOfServiceScreen(),
        '/home-barber': (context) => BarberDashboard(),
        '/barber-profile': (context) => const BarberProfileScreen(),
        '/agenda-barber': (context) => AgendaScreen(),
        '/notifications': (context) => NotificationsScreen(),
      },
    );
  }
}