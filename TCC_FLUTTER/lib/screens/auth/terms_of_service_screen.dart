import 'package:flutter/material.dart';

class TermsOfServiceScreen extends StatelessWidget {
  const TermsOfServiceScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.black,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Voltar',
          style: TextStyle(color: Colors.white, fontSize: 16),
        ),
        elevation: 0,
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Hero Image Section
            Container(
              width: double.infinity,
              height: 200,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(16),
                image: const DecorationImage(
                  image: NetworkImage('https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg'),
                  fit: BoxFit.cover,
                ),
              ),
              margin: const EdgeInsets.all(16),
              child: Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(16),
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      Colors.transparent,
                      Colors.black.withOpacity(0.7),
                    ],
                  ),
                ),
                child: const Padding(
                  padding: EdgeInsets.all(20),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.end,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Termos de uso e serviço',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            
            // Content Section
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 16),
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.grey[900],
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Termos de uso',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Última revisão: 1 de setembro de 2024',
                    style: TextStyle(
                      color: Colors.grey[400],
                      fontSize: 14,
                    ),
                  ),
                  const SizedBox(height: 20),
                  Text(
                    'Obrigado por confiar nos nossos produtos e serviços. Abaixo estão relacionados importantes termos legais e políticas relevantes ao uso de nossos produtos e serviços. Estes termos são importantes.',
                    style: TextStyle(
                      color: Colors.grey[300],
                      fontSize: 14,
                      height: 1.5,
                    ),
                  ),
                  const SizedBox(height: 30),
                  
                  // Terms Section Header
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Termos',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      TextButton(
                        onPressed: () {},
                        child: const Text(
                          'Ver todos',
                          style: TextStyle(
                            color: Colors.purple,
                            fontSize: 14,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  
                  // Terms Items
                  _buildTermsItem(
                    '1. Serviços Oferecidos',
                    'Este site tem como objetivo fornecer informações sobre o Barber e Cia, incluindo serviços oferecidos, horários de funcionamento, agendamento de agendamento de horários. Reservamo-nos o direito de modificar, suspender ou descontinuar qualquer parte deste site a qualquer momento, sem aviso prévio.',
                  ),
                  const SizedBox(height: 20),
                  _buildTermsItem(
                    '2. Agendamento de Serviços',
                    'O usuário poderá agendar serviços por meio do site, estando sujeito à confirmação por parte do estabelecimento. Alterações, cancelamentos e reagendamentos devem ser feitos com antecedência mínima de 2 horas. O não comparecimento sem aviso prévio poderá resultar em cobrança ou restrição de novos agendamentos.',
                  ),
                  const SizedBox(height: 20),
                  _buildTermsItem(
                    '3. Responsabilidades do Usuário',
                    'O usuário compromete-se a fornecer informações verdadeiras e precisas no momento do agendamento e cadastro. É de responsabilidade do usuário manter seus dados atualizados e utilizar o site para fins lícitos que visem os direitos do estabelecimento ou de terceiros.',
                  ),
                ],
              ),
            ),
            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }

  Widget _buildTermsItem(String title, String content) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 16,
            fontWeight: FontWeight.w600,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          content,
          style: TextStyle(
            color: Colors.grey[300],
            fontSize: 14,
            height: 1.5,
          ),
        ),
      ],
    );
  }
}