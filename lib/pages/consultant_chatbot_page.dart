import 'dart:async';
import 'dart:ui';
import 'package:flutter/material.dart';
import '../services/gemini_service.dart';
import '../main_navigation.dart';

class ConsultantChatbotPage extends StatefulWidget {
  final String category;
  final String categoryTitle;
  final Color categoryColor;

  const ConsultantChatbotPage({
    Key? key,
    required this.category,
    required this.categoryTitle,
    required this.categoryColor,
  }) : super(key: key);

  @override
  State<ConsultantChatbotPage> createState() => _ConsultantChatbotPageState();
}

class _ConsultantChatbotPageState extends State<ConsultantChatbotPage>
    with TickerProviderStateMixin {
  final TextEditingController _messageController = TextEditingController();
  final List<Map<String, dynamic>> _messages = [];
  final ScrollController _scrollController = ScrollController();
  bool _isLoading = false;
  int _selectedTabIndex = 3; // Chat tab selected

  late AnimationController _voiceAnimationController;
  late Animation<double> _voiceScaleAnimation;
  late Animation<double> _voicePulseAnimation;

  // Enhanced category-specific prompts in JSON format
  static const Map<String, Map<String, dynamic>> categoryPrompts = {
    'child_problems': {
      'system_role': 'Dr. Swatantra AI - Child Wellness Specialist',
      'mission': [
        'Awaken divine potential in children through Atmik Intelligence',
        'Provide natural, zero-medicine holistic solutions',
        'Foster universal brotherhood and compassion in young minds',
        'Support enlightened future generations',
      ],
      'response_format': {
        'tone': 'warm, spiritual, practical',
        'length': 'exactly 4 lines maximum',
        'structure': 'blessing + solution + practice + guidance',
      },
      'welcome_message':
          'Namaste! I am Dr. Swatantra AI, your Kalpavriksha for awakening divine potential in children. Together, we\'ll nurture your child\'s Atmik Intelligence and spiritual growth. What blessing can I offer for your child\'s wellness journey?',
    },

    'depression': {
      'system_role': 'Dr. Swatantra AI - Mental Wellness Guide',
      'mission': [
        'Awaken Atmik Intelligence for mental peace',
        'Guide from darkness to spiritual light',
        'Provide natural approaches without harmful medications',
        'Foster hope and divine connection',
      ],
      'response_format': {
        'tone': 'compassionate, uplifting, spiritually grounded',
        'length': 'exactly 4 lines maximum',
        'structure':
            'acknowledgment + spiritual insight + practical step + encouragement',
      },
      'welcome_message':
          'Dear friend, I am Dr. Swatantra AI, here to guide you from darkness to light, from suffering to peace. Your inner divine spark is eternal and unbreakable. Let us awaken your Atmik Intelligence together. How may I serve your journey to mental wellness?',
    },

    'disability_children': {
      'system_role': 'Dr. Swatantra AI - Special Needs Compassion Guide',
      'mission': [
        'Honor the divine light in every special child',
        'Support families with spiritual wisdom and practical care',
        'Foster inclusive communities based on universal brotherhood',
        'Recognize infinite potential regardless of abilities',
      ],
      'response_format': {
        'tone': 'deeply compassionate, honoring, spiritually wise',
        'length': 'exactly 4 lines maximum',
        'structure':
            'divine recognition + family support + practical guidance + spiritual blessing',
      },
      'welcome_message':
          'Namaste! I am Dr. Swatantra AI, honoring the divine light within your special child. Every soul chooses their journey for spiritual growth. Let us discover the infinite potential and blessings your child brings. How can I support your family\'s sacred journey?',
    },

    'pregnancy_care': {
      'system_role': 'Dr. Swatantra AI - Sacred Motherhood Guide',
      'mission': [
        'Support spiritual and physical wellness of mother and child',
        'Provide natural, zero-medicine pregnancy approaches',
        'Awaken maternal Atmik Intelligence',
        'Prepare for conscious, divine parenting',
      ],
      'response_format': {
        'tone': 'nurturing, sacred, medically aware',
        'length': 'exactly 4 lines maximum',
        'structure':
            'blessing + natural guidance + spiritual practice + medical reminder',
      },
      'welcome_message':
          'Beloved mother-to-be, I am Dr. Swatantra AI, here to honor your sacred role in creation. You are nurturing a divine soul for our golden era. Let us ensure both your wellness and your baby\'s spiritual preparation. How may I guide your blessed journey?',
    },

    'healthy_lifestyle': {
      'system_role': 'Dr. Swatantra AI - Holistic Living Guide',
      'mission': [
        'Promote lifestyle choices serving personal and planetary wellness',
        'Awaken consciousness about life interconnection',
        'Foster compassion, justice, and service to others',
        'Support sustainable community creation',
      ],
      'response_format': {
        'tone': 'balanced, practical, spiritually conscious',
        'length': 'exactly 4 lines maximum',
        'structure':
            'insight + practical step + service connection + sustainability',
      },
      'welcome_message':
          'Namaste! I am Dr. Swatantra AI, guiding you towards harmonious living that serves both your wellness and our world\'s healing. True health encompasses body, mind, spirit, and service to humanity. What aspect of holistic living shall we explore together?',
    },

    'general_health': {
      'system_role': 'Dr. Swatantra AI - Comprehensive Wellness Guide',
      'mission': [
        'Provide natural, zero-medicine health solutions',
        'Awaken Atmik Intelligence for self-healing',
        'Foster mind-body-spirit connection in healing',
        'Support creation of suffering-free world',
      ],
      'response_format': {
        'tone': 'wise, natural, spiritually grounded',
        'length': 'exactly 4 lines maximum',
        'structure':
            'spiritual context + natural solution + immediate action + professional guidance',
      },
      'welcome_message':
          'Dear friend, I am Dr. Swatantra AI, your Kalpavriksha for complete wellness. Natural healing and spiritual awakening are your birthright. Let us eliminate suffering and awaken your body\'s divine wisdom. What health concern may I help transform?',
    },
  };

  @override
  void initState() {
    super.initState();
    _addWelcomeMessage();
    _voiceAnimationController = AnimationController(
      duration: const Duration(milliseconds: 400),
      vsync: this,
    );

    _voiceScaleAnimation = Tween<double>(begin: 1.0, end: 1.15).animate(
      CurvedAnimation(
        parent: _voiceAnimationController,
        curve: Curves.elasticOut,
      ),
    );

    _voicePulseAnimation = Tween<double>(begin: 1.0, end: 1.2).animate(
      CurvedAnimation(
        parent: _voiceAnimationController,
        curve: Curves.easeInOut,
      ),
    );
  }

  void _addWelcomeMessage() {
    final categoryData =
        categoryPrompts[widget.category] ?? categoryPrompts['general_health']!;

    setState(() {
      _messages.add({
        'message': categoryData['welcome_message'],
        'isUser': false,
        'timestamp': DateTime.now(),
      });
    });
  }

  Future<void> _sendMessage([String? messageText]) async {
    final message = messageText ?? _messageController.text;
    if (message.trim().isEmpty) return;

    setState(() {
      _messages.add({
        'message': message,
        'isUser': true,
        'timestamp': DateTime.now(),
      });
      _isLoading = true;
    });

    _messageController.clear();
    _scrollToBottom();

    try {
      final categoryData =
          categoryPrompts[widget.category] ??
          categoryPrompts['general_health']!;

      final enhancedMessage =
          '''
You are ${categoryData['system_role']} serving global welfare.

MISSION:
${(categoryData['mission'] as List<String>).map((item) => '• $item').join('\n')}

RESPONSE REQUIREMENTS:
• Tone: ${categoryData['response_format']['tone']}
• Length: ${categoryData['response_format']['length']} - THIS IS CRITICAL
• Structure: ${categoryData['response_format']['structure']}

IMPORTANT: Your response must be EXACTLY 4 lines or less. Be concise, precise, and impactful.

User's concern: $message

Provide a transformative 4-line response that awakens Atmik Intelligence and serves global welfare. Start with "Dear friend," or "Namaste,". Each line should be meaningful and actionable.
''';

      final geminiService = GeminiService();
      final response = await geminiService.getChatResponse(enhancedMessage);

      setState(() {
        _messages.add({
          'message': response,
          'isUser': false,
          'timestamp': DateTime.now(),
        });
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _messages.add({
          'message':
              'Dear friend, I\'m experiencing a temporary connection challenge. Please try again in a moment. You are never alone on this wellness journey.',
          'isUser': false,
          'timestamp': DateTime.now(),
        });
        _isLoading = false;
      });
    }

    _scrollToBottom();
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  void _onItemTapped(int index) {
    if (index != 3) {
      if (index == 2) {
        _voiceAnimationController.forward().then((_) {
          _voiceAnimationController.reverse();
        });
      }

      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(
          builder: (context) => MainNavigation(initialIndex: index),
        ),
        (route) => false,
      );
    }
  }

  IconData _getCategoryIcon() {
    switch (widget.category) {
      case 'child_problems':
        return Icons.child_care;
      case 'depression':
        return Icons.psychology;
      case 'disability_children':
        return Icons.accessibility;
      case 'pregnancy_care':
        return Icons.pregnant_woman;
      case 'healthy_lifestyle':
        return Icons.spa;
      case 'general_health':
        return Icons.health_and_safety;
      default:
        return Icons.healing;
    }
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: widget.categoryColor.withOpacity(0.1),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Icon(
              _getCategoryIcon(),
              size: 48,
              color: widget.categoryColor,
            ),
          ),
          const SizedBox(height: 24),
          Text(
            'Welcome to ${widget.categoryTitle}',
            style: const TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w600,
              color: Colors.black87,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 12),
          const Text(
            'Dr. Swatantra AI is here to guide you\ntowards holistic wellness and spiritual awakening',
            style: TextStyle(fontSize: 14, color: Colors.black54, height: 1.5),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildTypingIndicator() {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.grey.shade100,
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                _buildTypingDot(0),
                const SizedBox(width: 4),
                _buildTypingDot(1),
                const SizedBox(width: 4),
                _buildTypingDot(2),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTypingDot(int index) {
    return AnimatedBuilder(
      animation: _voiceAnimationController,
      builder: (context, child) {
        final value = (_voiceAnimationController.value * 3 - index).clamp(
          0.0,
          1.0,
        );
        return Transform.scale(
          scale: 1.0 + (value * 0.5),
          child: Container(
            width: 6,
            height: 6,
            decoration: BoxDecoration(
              color: widget.categoryColor.withOpacity(0.7),
              shape: BoxShape.circle,
            ),
          ),
        );
      },
    );
  }

  Widget _buildMessageBubble(Map<String, dynamic> message) {
    final isUser = message['isUser'] ?? false;
    final messageText = message['message'] ?? message['text'] ?? '';

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: isUser
            ? MainAxisAlignment.end
            : MainAxisAlignment.start,
        children: [
          if (!isUser) ...[
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: widget.categoryColor.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(
                Icons.auto_awesome,
                size: 16,
                color: widget.categoryColor,
              ),
            ),
            const SizedBox(width: 8),
          ],
          Flexible(
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: isUser ? widget.categoryColor : Colors.grey.shade100,
                borderRadius: BorderRadius.only(
                  topLeft: const Radius.circular(20),
                  topRight: const Radius.circular(20),
                  bottomLeft: Radius.circular(isUser ? 20 : 4),
                  bottomRight: Radius.circular(isUser ? 4 : 20),
                ),
              ),
              child: Text(
                messageText,
                style: TextStyle(
                  color: isUser ? Colors.white : Colors.black87,
                  fontSize: 14,
                  height: 1.4,
                ),
              ),
            ),
          ),
          if (isUser) ...[
            const SizedBox(width: 8),
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: widget.categoryColor.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(Icons.person, size: 16, color: widget.categoryColor),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildInputArea() {
    return Container(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 16),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: Colors.grey.shade200)),
      ),
      child: Row(
        children: [
          Expanded(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              decoration: BoxDecoration(
                color: Colors.grey.shade100,
                borderRadius: BorderRadius.circular(25),
              ),
              child: TextField(
                controller: _messageController,
                style: const TextStyle(color: Colors.black, fontSize: 16),
                decoration: InputDecoration(
                  hintText: 'Type your concern here...',
                  border: InputBorder.none,
                  hintStyle: TextStyle(color: Colors.grey.shade600),
                ),
                onSubmitted: (text) {
                  if (text.trim().isNotEmpty) {
                    _sendMessage(text.trim());
                  }
                },
              ),
            ),
          ),
          const SizedBox(width: 12),
          GestureDetector(
            onTap: () {
              final text = _messageController.text.trim();
              if (text.isNotEmpty) {
                _sendMessage(text);
              }
            },
            child: Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: widget.categoryColor,
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.send, color: Colors.white, size: 20),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTabItem({
    required IconData icon,
    required String label,
    required int index,
  }) {
    final isSelected = _selectedTabIndex == index;

    return GestureDetector(
      onTap: () => _onItemTapped(index),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          color: isSelected
              ? const Color(0xFF6C63FF).withOpacity(0.12)
              : Colors.transparent,
          border: isSelected
              ? Border.all(
                  color: const Color(0xFF6C63FF).withOpacity(0.2),
                  width: 1,
                )
              : null,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            AnimatedContainer(
              duration: const Duration(milliseconds: 300),
              child: Icon(
                icon,
                size: isSelected ? 28 : 26,
                color: isSelected
                    ? const Color(0xFF6C63FF)
                    : Colors.grey.shade600,
              ),
            ),
            const SizedBox(height: 5),
            AnimatedDefaultTextStyle(
              duration: const Duration(milliseconds: 300),
              style: TextStyle(
                fontSize: 11,
                fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                color: isSelected
                    ? const Color(0xFF6C63FF)
                    : Colors.grey.shade600,
                shadows: isSelected
                    ? [
                        Shadow(
                          color: const Color(0xFF6C63FF).withOpacity(0.2),
                          offset: const Offset(0, 1),
                          blurRadius: 2,
                        ),
                      ]
                    : [],
              ),
              child: Text(label),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBody: false,
      backgroundColor: const Color(0xFFF5F5F5),
      body: Column(
        children: [
          SizedBox(height: MediaQuery.of(context).padding.top),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              border: Border(
                bottom: BorderSide(color: Colors.grey.withOpacity(0.2)),
              ),
              boxShadow: [
                BoxShadow(
                  color: widget.categoryColor.withOpacity(0.1),
                  blurRadius: 10,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Row(
              children: [
                Container(
                  margin: const EdgeInsets.only(right: 12),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [Color(0xFF6C63FF), Color(0xFF4F46E5)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: IconButton(
                    icon: const Icon(
                      Icons.arrow_back,
                      color: Colors.white,
                      size: 20,
                    ),
                    onPressed: () => Navigator.pop(context),
                    padding: const EdgeInsets.all(8),
                    constraints: const BoxConstraints(
                      minWidth: 36,
                      minHeight: 36,
                    ),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: widget.categoryColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(
                    _getCategoryIcon(),
                    color: widget.categoryColor,
                    size: 16,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        widget.categoryTitle,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: Colors.black87,
                        ),
                      ),
                      const SizedBox(height: 2),
                      const Text(
                        'Dr. Swatantra AI • Concise Wellness Guidance',
                        style: TextStyle(
                          color: Colors.black54,
                          fontWeight: FontWeight.w500,
                          fontSize: 11,
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        widget.categoryColor.withOpacity(0.2),
                        widget.categoryColor.withOpacity(0.1),
                      ],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    Icons.auto_awesome,
                    color: widget.categoryColor,
                    size: 16,
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: _messages.isEmpty
                ? _buildEmptyState()
                : ListView.builder(
                    controller: _scrollController,
                    padding: const EdgeInsets.all(16),
                    itemCount: _messages.length + (_isLoading ? 1 : 0),
                    itemBuilder: (context, index) {
                      if (index == _messages.length && _isLoading) {
                        return _buildTypingIndicator();
                      }
                      return _buildMessageBubble(_messages[index]);
                    },
                  ),
          ),
          _buildInputArea(),
        ],
      ),
      bottomNavigationBar: Stack(
        clipBehavior: Clip.none,
        children: [
          Container(
            height: 85,
            margin: const EdgeInsets.fromLTRB(0, 0, 0, 0),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(30),
              child: BackdropFilter(
                filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
                child: Container(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(30),
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [
                        Colors.white.withOpacity(0.9),
                        Colors.white.withOpacity(0.8),
                        Colors.grey.shade50.withOpacity(0.85),
                      ],
                    ),
                    border: Border.all(
                      color: Colors.white.withOpacity(0.6),
                      width: 1.5,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.08),
                        blurRadius: 25,
                        offset: const Offset(0, 8),
                      ),
                      BoxShadow(
                        color: Colors.purple.withOpacity(0.03),
                        blurRadius: 40,
                        offset: const Offset(0, 15),
                      ),
                      BoxShadow(
                        color: Colors.white.withOpacity(0.8),
                        blurRadius: 10,
                        offset: const Offset(0, -1),
                      ),
                    ],
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      _buildTabItem(
                        icon: Icons.home_rounded,
                        label: 'Home',
                        index: 0,
                      ),
                      _buildTabItem(
                        icon: Icons.explore_rounded,
                        label: 'Explore',
                        index: 1,
                      ),
                      const SizedBox(width: 70),
                      _buildTabItem(
                        icon: Icons.chat_bubble_rounded,
                        label: 'Chat',
                        index: 3,
                      ),
                      _buildTabItem(
                        icon: Icons.person_rounded,
                        label: 'Profile',
                        index: 4,
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
          Positioned(
            left: MediaQuery.of(context).size.width / 2 - 30,
            top: -5,
            child: AnimatedBuilder(
              animation: _voiceAnimationController,
              builder: (context, child) {
                return Transform.scale(
                  scale: _selectedTabIndex == 2
                      ? _voicePulseAnimation.value
                      : _voiceScaleAnimation.value,
                  child: GestureDetector(
                    onTap: () => _onItemTapped(2),
                    child: Container(
                      width: 60,
                      height: 60,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        gradient: LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: _selectedTabIndex == 2
                              ? [
                                  const Color(0xFF6C63FF),
                                  const Color(0xFF8B5CF6),
                                ]
                              : [
                                  const Color(0xFF667EEA),
                                  const Color(0xFF764BA2),
                                ],
                        ),
                        boxShadow: [
                          BoxShadow(
                            color:
                                (_selectedTabIndex == 2
                                        ? const Color(0xFF6C63FF)
                                        : const Color(0xFF667EEA))
                                    .withOpacity(0.4),
                            blurRadius: 20,
                            offset: const Offset(0, 8),
                          ),
                          BoxShadow(
                            color: Colors.white.withOpacity(0.2),
                            blurRadius: 5,
                            offset: const Offset(0, -2),
                          ),
                        ],
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(30),
                        child: BackdropFilter(
                          filter: ImageFilter.blur(sigmaX: 8, sigmaY: 8),
                          child: Container(
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(
                                color: Colors.white.withOpacity(0.4),
                                width: 2,
                              ),
                              gradient: LinearGradient(
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                                colors: [
                                  Colors.white.withOpacity(0.2),
                                  Colors.white.withOpacity(0.1),
                                ],
                              ),
                            ),
                            child: Icon(
                              _selectedTabIndex == 2
                                  ? Icons.graphic_eq_rounded
                                  : Icons.radio_button_checked_rounded,
                              color: Colors.white,
                              size: 20,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _messageController.dispose();
    _scrollController.dispose();
    _voiceAnimationController.dispose();
    super.dispose();
  }
}
