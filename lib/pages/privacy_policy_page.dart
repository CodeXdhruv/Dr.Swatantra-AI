import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class PrivacyPolicyPage extends StatelessWidget {
  const PrivacyPolicyPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Privacy Policy'),
        backgroundColor: const Color(0xFF6C63FF),
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Dr. Swatantra AI Privacy Policy',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Color(0xFF6C63FF),
              ),
            ),
            const SizedBox(height: 16),
            _buildSection(
              'Information We Collect',
              'We collect information you provide directly to us, such as:\n'
                  '• Account information (name, email)\n'
                  '• Voice recordings for AI processing\n'
                  '• Usage data and analytics\n'
                  '• Device information for optimization',
            ),
            _buildSection(
              'How We Use Your Information',
              'We use the information we collect to:\n'
                  '• Provide AI-powered spiritual guidance\n'
                  '• Improve our voice recognition services\n'
                  '• Personalize your experience\n'
                  '• Send you important updates',
            ),
            _buildSection(
              'Voice Data Processing',
              'Voice recordings are:\n'
                  '• Processed locally when possible\n'
                  '• Sent to secure AI services for analysis\n'
                  '• Not stored permanently\n'
                  '• Not shared with third parties',
            ),
            _buildSection(
              'Data Security',
              'We implement industry-standard security measures:\n'
                  '• All data transmission is encrypted (HTTPS)\n'
                  '• Firebase security rules protect your data\n'
                  '• Regular security audits and updates\n'
                  '• Secure API key management',
            ),
            _buildSection(
              'Your Rights',
              'You have the right to:\n'
                  '• Access your personal data\n'
                  '• Delete your account and data\n'
                  '• Opt out of data collection\n'
                  '• Request data portability',
            ),
            const SizedBox(height: 24),
            Center(
              child: ElevatedButton(
                onPressed: () => _launchPrivacyPolicy(),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF6C63FF),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(
                    horizontal: 32,
                    vertical: 12,
                  ),
                ),
                child: const Text('View Full Privacy Policy'),
              ),
            ),
            const SizedBox(height: 16),
            const Text(
              'Last updated: October 2025\n'
              'Contact: privacy@swatantraai.com',
              style: TextStyle(fontSize: 12, color: Colors.grey),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSection(String title, String content) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 24.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Color(0xFF6C63FF),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            content,
            style: const TextStyle(
              fontSize: 14,
              height: 1.5,
              color: Colors.black87,
            ),
          ),
        ],
      ),
    );
  }

  void _launchPrivacyPolicy() async {
    // TODO: Replace with your actual privacy policy URL
    const url = 'https://swatantraai.com/privacy-policy';
    if (await canLaunchUrl(Uri.parse(url))) {
      await launchUrl(Uri.parse(url));
    }
  }
}
