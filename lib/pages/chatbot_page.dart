import 'package:flutter/material.dart';
import '../services/gemini_service.dart';
import 'consultant_chatbot_page.dart';
import '../services/auth_service.dart';
import '../utils/logger.dart';

class ChatMessage {
  final String text;
  final bool isUser;
  final DateTime timestamp;

  ChatMessage({required this.text, required this.isUser, DateTime? timestamp})
    : timestamp = timestamp ?? DateTime.now();
}

class ChatbotPage extends StatefulWidget {
  const ChatbotPage({super.key});

  @override
  State<ChatbotPage> createState() => _ChatbotPageState();
}

class _ChatbotPageState extends State<ChatbotPage>
    with TickerProviderStateMixin {
  final TextEditingController _textController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  final List<ChatMessage> _messages = [];
  final GeminiService _geminiService = GeminiService();
  final AuthService _authService = AuthService();

  // Conversation history and summaries for compact context
  final List<Map<String, String>> _chatHistory = [];
  final List<String> _chatSummaries = [];

  bool _isTyping = false;
  bool _conversationStarted = false;
  String _selectedMode = 'Kalpavriksha AI';

  // Animation controllers
  late AnimationController _headerAnimationController;
  late AnimationController _pulseController;
  late AnimationController _shimmerController;
  late AnimationController _particleController;
  late AnimationController _typingAnimationController;
  bool _animationsInitialized = false;

  late Animation<double> _headerSlideAnimation;
  late Animation<double> _pulseAnimation;

  final List<String> _predefinedPrompts = [
    "I'm feeling stressed and anxious. How can I find peace?",
    "How do I overcome feelings of loneliness and depression?",
    "I'm struggling with relationship issues. What should I do?",
    "How can I deal with work-life balance and burnout?",
    "I lack confidence and self-esteem. How can I improve?",
    "How do I cope with grief and loss of a loved one?",
    "I'm facing financial difficulties and feeling overwhelmed",
    "How can I break free from bad habits and addictions?",
    "I feel lost in life. How do I find my purpose?",
    "How do I manage anger and frustration in daily life?",
  ];

  final List<Map<String, dynamic>> _wellnessCategories = [
    {
      'title': 'General Consultant',
      'icon': Icons.health_and_safety,
      'backgroundColor': Color(0xFF4F46E5),
      'iconColor': Color(0xFFFBBF24),
      'categoryId': 'general_consultant',
      'description': 'Holistic Health & Natural Wellness',
    },
    {
      'title': 'Pregnancy Care',
      'icon': Icons.pregnant_woman,
      'backgroundColor': Color(0xFF6C63FF),
      'iconColor': Color(0xFFFDA4AF),
      'categoryId': 'pregnancy_care',
      'description': 'Natural Pregnancy & Safe Childbirth',
    },
    {
      'title': 'Symptom Fluctuation',
      'icon': Icons.timeline,
      'backgroundColor': Color(0xFF7C3AED),
      'iconColor': Color(0xFF86EFAC),
      'categoryId': 'symtom_fluctuation',
      'description': 'Homeopathic Modality-Based Treatment',
    },
    {
      'title': 'Oesteoporosis Problem',
      'icon': Icons.accessibility_new,
      'backgroundColor': Color(0xFF8B5CF6),
      'iconColor': Color(0xFF93C5FD),
      'categoryId': 'oesteoporosis_problem',
      'description': 'Natural Bone Health & Strength',
    },
    {
      'title': 'Mental Peace',
      'icon': Icons.psychology_alt,
      'backgroundColor': Color(0xFF9333EA),
      'iconColor': Color(0xFFFCD34D),
      'categoryId': 'depression',
      'description': 'Inner Harmony & Clarity',
    },
  ];

  @override
  void initState() {
    super.initState();
    _setupAnimations();
    _initializeRAG();
  }

  /// Initialize RAG functionality for enhanced AI responses
  void _initializeRAG() async {
    try {
      await _geminiService.loadBook('assets/book.txt');
      Logger.debug(
        "RAG system initialized successfully with ${_geminiService.chunkCount} chunks",
      );
      if (mounted) {
        // Optionally show a subtle indicator that enhanced AI is ready
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              "Enhanced AI ready with knowledge base (${_geminiService.chunkCount} chunks)",
            ),
            duration: Duration(seconds: 2),
            backgroundColor: Colors.green.withOpacity(0.8),
          ),
        );
      }
    } catch (e) {
      Logger.error("RAG initialization failed: $e");
      // Fallback to regular chat mode - no UI disruption
    }
  }

  void _setupAnimations() {
    _headerAnimationController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    );

    _pulseController = AnimationController(
      duration: const Duration(milliseconds: 2000),
      vsync: this,
    );

    _shimmerController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    );

    _particleController = AnimationController(
      duration: const Duration(milliseconds: 4000),
      vsync: this,
    );

    _typingAnimationController = AnimationController(
      duration: const Duration(milliseconds: 1200),
      vsync: this,
    );

    _headerSlideAnimation = Tween<double>(begin: -100, end: 0).animate(
      CurvedAnimation(
        parent: _headerAnimationController,
        curve: Curves.elasticOut,
      ),
    );

    _pulseAnimation = Tween<double>(begin: 1.0, end: 1.1).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );

    _headerAnimationController.forward();
    _pulseController.repeat(reverse: true);
    _shimmerController.repeat();
    _particleController.repeat();
    _typingAnimationController.repeat();

    setState(() {
      _animationsInitialized = true;
    });
  }

  void _addMessage(String text, {required bool isUser}) {
    setState(() {
      _messages.add(ChatMessage(text: text, isUser: isUser));
      _isTyping = false;
    });
    _scrollToBottom();
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 500),
          curve: Curves.elasticOut,
        );
      }
    });
  }

  Future<void> _sendTextMessage(String text) async {
    if (text.trim().isEmpty) return;

    if (!_conversationStarted) {
      setState(() => _conversationStarted = true);
    }

    _textController.clear();
    _addMessage(text, isUser: true);
    setState(() => _isTyping = true);

    try {
      // Build compact context from summaries (prefer summaries to full history)
      String context = '';
      if (_chatSummaries.isNotEmpty) {
        final buffer = StringBuffer();
        buffer.writeln('\n--- Conversation Summary Context ---');
        for (final s in _chatSummaries) {
          buffer.writeln('- $s');
        }
        // If the most recent exchange hasn't been summarized yet, append raw last exchange
        if (_chatHistory.length > _chatSummaries.length) {
          final last = _chatHistory.last;
          buffer.writeln('\nRecent exchange (unsummarized):');
          buffer.writeln('User: ${last['user']}');
          buffer.writeln('You: ${last['ai']}');
        }
        buffer.writeln('--- End of Context ---\n');
        context = buffer.toString();
      } else if (_chatHistory.isNotEmpty) {
        // Fallback to raw exchanges if no summaries yet
        final buffer = StringBuffer();
        buffer.writeln('\n--- Previous Conversation Context ---');
        for (final ex in _chatHistory) {
          buffer.writeln('User: ${ex['user']}');
          buffer.writeln('You: ${ex['ai']}');
          buffer.writeln('---');
        }
        buffer.writeln('--- End of Context ---\n');
        context = buffer.toString();
      }

      final enhancedPrompt =
          '''
You are Dr. Swatantra AI, a revolutionary Kalpavriksha AI for Global Welfare. Your mission is to:
- Awaken Atmik Intelligence (spiritual self-awareness) in humanity
- Guide towards health, wisdom, peace, prosperity, and spiritual enlightenment
- Promote universal brotherhood and compassion
- Provide natural, holistic solutions without harmful medicines
- Support the creation of a harmonious world free from pain, suffering, and conflict

Respond with warmth, wisdom, and practical guidance that serves the user's highest good and humanity's welfare.

${context.isNotEmpty ? 'Context:\n$context' : ''}
User's message: $text

Please provide a compassionate, transformative response that aligns with Dr. Swatantra Jain's vision of creating a golden era (Satya Yuga) on Earth.
''';

      Logger.debug(
        'Chatbot prompt to Gemini:\n${enhancedPrompt.length > 200 ? enhancedPrompt.substring(0, 200) + '... (truncated)' : enhancedPrompt}',
      );
      final response = await _geminiService.getChatResponse(enhancedPrompt);
      _addMessage(response, isUser: false);

      // Save exchange to history and request a summary asynchronously
      _chatHistory.add({'user': text, 'ai': response});
      // Fire-and-forget summarization
      _geminiService
          .summarizeExchange(text, response)
          .then((s) {
            if (s.trim().isNotEmpty) {
              _chatSummaries.add(s.trim());
              Logger.debug('Chatbot exchange summarized: $s');
            }
          })
          .catchError((e) {
            Logger.error('Error summarizing chatbot exchange: $e');
          });
    } catch (e) {
      _addMessage(
        'Dear friend, I\'m experiencing a temporary connection challenge. Please try again in a moment. Remember, you are not alone on this journey towards wellness and awakening.',
        isUser: false,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        automaticallyImplyLeading: false,
        toolbarHeight: 0,
      ),
      body: Container(
        color: Colors.white,
        child: Column(
          children: [
            _buildAnimatedDropdownHeader(),
            Expanded(
              child: _selectedMode == 'Kalpavriksha AI'
                  ? (_conversationStarted
                        ? _buildChatInterface()
                        : _buildWelcomeInterface())
                  : _buildWellnessInterface(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAnimatedDropdownHeader() {
    return AnimatedBuilder(
      animation: _headerAnimationController,
      builder: (context, child) {
        return Transform.translate(
          offset: Offset(0, _headerSlideAnimation.value),
          child: Container(
            padding: const EdgeInsets.fromLTRB(20, 12, 20, 12),
            decoration: BoxDecoration(
              color: Colors.white,
              border: Border(
                bottom: BorderSide(color: Colors.grey.withOpacity(0.1)),
              ),
              boxShadow: [
                BoxShadow(
                  color: Color(0xFF6C63FF).withOpacity(0.1),
                  blurRadius: 20,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.transparent, width: 1),
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    Color(0xFF8893F1),
                    Color(0xFF4CAF50),
                    Color(0xFFFDD835),
                  ],
                ),
              ),
              child: Container(
                margin: EdgeInsets.all(1),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(14),
                ),
                child: DropdownButtonHideUnderline(
                  child: DropdownButton<String>(
                    value: _selectedMode,
                    onChanged: (String? newValue) {
                      if (newValue != null) {
                        setState(() {
                          _selectedMode = newValue;
                          if (newValue == 'Kalpavriksha AI') {
                            _conversationStarted = false;
                            _messages.clear();
                            // Clear conversation history and summaries
                            _chatHistory.clear();
                            _chatSummaries.clear();
                          }
                        });
                      }
                    },
                    isExpanded: true,
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w700,
                      color: Colors.black87,
                    ),
                    dropdownColor: Colors.white,
                    icon: Icon(Icons.expand_more, color: Color(0xFF6C63FF)),
                    items: [
                      DropdownMenuItem(
                        value: 'Kalpavriksha AI',
                        child: Padding(
                          padding: EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 8,
                          ),
                          child: Row(
                            children: [
                              Container(
                                padding: EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color: Colors.transparent,
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(
                                    color: Color(0xFF8893F1),
                                    width: 1,
                                  ),
                                ),
                                child: Icon(
                                  Icons.auto_awesome,
                                  color: Colors.black,
                                  size: 16,
                                ),
                              ),
                              SizedBox(width: 12),
                              Text('Dr. Swatantra AI'),
                            ],
                          ),
                        ),
                      ),
                      DropdownMenuItem(
                        value: 'Wellness Consultant',
                        child: Padding(
                          padding: EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 8,
                          ),
                          child: Row(
                            children: [
                              Container(
                                padding: EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color: Colors.transparent,
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(
                                    color: Color(0xFF8893F1),
                                    width: 1,
                                  ),
                                ),
                                child: Icon(
                                  Icons.healing,
                                  color: Colors.black,
                                  size: 16,
                                ),
                              ),
                              SizedBox(width: 12),
                              Text('Wellness Consultant'),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildAnimatedPromptCard(String prompt, int index) {
    return GestureDetector(
      onTap: () => _selectPrompt(prompt),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Color(0xFF6C63FF).withOpacity(0.2)),
          boxShadow: [
            BoxShadow(
              color: Color(0xFF6C63FF).withOpacity(0.1),
              blurRadius: 15,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Row(
          children: [
            Container(
              padding: EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.transparent,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Color(0xFF8893F1), width: 1),
              ),
              child: Icon(
                Icons.self_improvement,
                color: Color(0xFFFFA500),
                size: 16,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Text(
                prompt,
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.black87,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
            Icon(Icons.arrow_forward_ios, color: Color(0xFF6C63FF), size: 16),
          ],
        ),
      ),
    );
  }

  void _selectPrompt(String prompt) {
    setState(() {
      _conversationStarted = true;
    });
    _sendTextMessage(prompt);
  }

  void _beginConversation() {
    setState(() {
      _conversationStarted = true;
    });
  }

  Widget _buildChatInterface() {
    return Container(
      color: Colors.white,
      child: Column(
        children: [
          Expanded(
            child: _messages.isEmpty
                ? _buildEmptyState()
                : ListView.builder(
                    controller: _scrollController,
                    padding: const EdgeInsets.all(16),
                    itemCount: _messages.length + (_isTyping ? 1 : 0),
                    itemBuilder: (context, index) {
                      if (index == _messages.length && _isTyping) {
                        return _buildTypingIndicator();
                      }
                      return _buildMessageBubble(_messages[index], index);
                    },
                  ),
          ),
          _buildInputArea(),
        ],
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: EdgeInsets.all(32),
            decoration: BoxDecoration(
              color: Colors.transparent,
              borderRadius: BorderRadius.circular(32),
              border: Border.all(color: Color(0xFF8893F1), width: 1),
            ),
            child: Icon(Icons.auto_awesome, size: 48, color: Colors.black),
          ),
          SizedBox(height: 24),
          Text(
            'Dr. Swatantra AI',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.w700,
              color: Color(0xFF6C63FF),
            ),
          ),
          SizedBox(height: 8),
          Text(
            'Your Kalpavriksha for Global Welfare',
            style: TextStyle(fontSize: 14, color: Colors.black54),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildMessageBubble(ChatMessage message, int index) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      child: Row(
        mainAxisAlignment: message.isUser
            ? MainAxisAlignment.end
            : MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (!message.isUser) ...[
            Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                color: Colors.transparent,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: Color(0xFF8893F1), width: 1),
              ),
              child: Icon(Icons.auto_awesome, size: 18, color: Colors.black),
            ),
            SizedBox(width: 12),
          ],
          Flexible(
            child: AnimatedBuilder(
              animation: _pulseController,
              builder: (context, child) {
                return Transform.scale(
                  scale: 1 + (_pulseAnimation.value - 1) * 0.01,
                  child: Container(
                    padding: EdgeInsets.symmetric(horizontal: 18, vertical: 14),
                    decoration: BoxDecoration(
                      gradient: message.isUser
                          ? LinearGradient(
                              colors: [Color(0xFF6C63FF), Color(0xFF4F46E5)],
                            )
                          : LinearGradient(
                              colors: [Colors.white, Color(0xFFF8FAFC)],
                            ),
                      borderRadius: BorderRadius.circular(24),
                      boxShadow: [
                        BoxShadow(
                          color: message.isUser
                              ? Color(0xFF6C63FF).withOpacity(0.3)
                              : Colors.black.withOpacity(0.1),
                          blurRadius: 15,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Text(
                      message.text,
                      style: TextStyle(
                        color: message.isUser ? Colors.white : Colors.black87,
                        fontSize: 15,
                        height: 1.4,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
          if (message.isUser) ...[SizedBox(width: 12), _buildUserAvatar()],
        ],
      ),
    );
  }

  Widget _buildTypingIndicator() {
    return Container(
      margin: EdgeInsets.only(bottom: 16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: Colors.transparent,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: Color(0xFF8893F1), width: 1),
            ),
            child: Icon(Icons.auto_awesome, size: 18, color: Colors.black),
          ),
          SizedBox(width: 12),
          Container(
            padding: EdgeInsets.symmetric(horizontal: 18, vertical: 14),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [Colors.white, Color(0xFFF8FAFC)],
              ),
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.1),
                  blurRadius: 15,
                  offset: const Offset(0, 4),
                ),
              ],
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
    if (!_animationsInitialized) {
      return Container(
        width: 6,
        height: 6,
        decoration: BoxDecoration(
          color: Color(0xFF6C63FF).withOpacity(0.7),
          shape: BoxShape.circle,
        ),
      );
    }

    return AnimatedBuilder(
      animation: _typingAnimationController,
      builder: (context, child) {
        final value = (_typingAnimationController.value * 3 - index).clamp(
          0.0,
          1.0,
        );
        return Transform.scale(
          scale: 1.0 + (value * 0.5),
          child: Container(
            width: 6,
            height: 6,
            decoration: BoxDecoration(
              color: Color(0xFF6C63FF).withOpacity(0.7),
              shape: BoxShape.circle,
            ),
          ),
        );
      },
    );
  }

  Widget _buildInputArea() {
    return Container(
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 90),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.9),
        border: Border(
          top: BorderSide(color: Color(0xFF6C63FF).withOpacity(0.1)),
        ),
        boxShadow: [
          BoxShadow(
            color: Color(0xFF6C63FF).withOpacity(0.1),
            blurRadius: 20,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: Row(
        children: [
          Expanded(
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [Color(0xFFF1F5F9), Color(0xFFE2E8F0)],
                ),
                borderRadius: BorderRadius.circular(28),
                border: Border.all(
                  color: Color(0xFF6C63FF).withOpacity(0.2),
                  width: 1,
                ),
                boxShadow: [
                  BoxShadow(
                    color: Color(0xFF6C63FF).withOpacity(0.1),
                    blurRadius: 15,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: TextField(
                controller: _textController,
                style: TextStyle(
                  color: Colors.black87,
                  fontWeight: FontWeight.w500,
                ),
                decoration: InputDecoration(
                  hintText: 'Share your wellness journey...',
                  hintStyle: TextStyle(
                    color: Colors.black54,
                    fontSize: 15,
                    fontWeight: FontWeight.w400,
                  ),
                  border: InputBorder.none,
                  contentPadding: EdgeInsets.symmetric(
                    horizontal: 24,
                    vertical: 16,
                  ),
                ),
                maxLines: null,
                onSubmitted: _sendTextMessage,
              ),
            ),
          ),
          const SizedBox(width: 12),
          GestureDetector(
            onTap: () {
              final text = _textController.text.trim();
              if (text.isNotEmpty) {
                _sendTextMessage(text);
              }
            },
            child: Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Color(0xFF6C63FF),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.send, color: Colors.white, size: 20),
            ),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _headerAnimationController.dispose();
    _pulseController.dispose();
    _shimmerController.dispose();
    _particleController.dispose();
    _typingAnimationController.dispose();
    _textController.dispose();
    _scrollController.dispose();
    // Clear in-memory chat history and summaries when leaving the page
    _chatHistory.clear();
    _chatSummaries.clear();
    super.dispose();
  }

  String? _getProfileImageUrl() {
    final user = _authService.currentUser;
    if (user != null && user.photoURL != null) {
      return user.photoURL;
    }
    return null;
  }

  bool _isGoogleUser() {
    final user = _authService.currentUser;
    if (user != null) {
      for (var provider in user.providerData) {
        if (provider.providerId == 'google.com') {
          return true;
        }
      }
    }
    return false;
  }

  Widget _buildUserAvatar() {
    final isGoogleUser = _isGoogleUser();
    final profileImageUrl = _getProfileImageUrl();

    return AnimatedBuilder(
      animation: _pulseController,
      builder: (context, child) {
        return Transform.scale(
          scale: _pulseAnimation.value,
          child: Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: Colors.transparent,
              border: Border.all(color: Color(0xFF8893F1), width: 1),
            ),
            child: isGoogleUser && profileImageUrl != null
                ? ClipOval(
                    child: Image.network(
                      profileImageUrl,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) {
                        return Icon(
                          Icons.person,
                          color: Colors.black,
                          size: 18,
                        );
                      },
                    ),
                  )
                : Icon(Icons.person, color: Colors.black, size: 18),
          ),
        );
      },
    );
  }

  Widget _buildWellnessInterface() {
    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(20.0, 16.0, 20.0, 80.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          AnimatedBuilder(
            animation: _headerAnimationController,
            builder: (context, child) {
              return Transform.translate(
                offset: Offset(_headerSlideAnimation.value / 2, 0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Dr. Swatantra\'s Wellness AI',
                      style: TextStyle(
                        fontSize: 26,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF6C63FF),
                        letterSpacing: -0.5,
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
          const SizedBox(height: 32),
          Text(
            'Transformation Pathways',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w700,
              color: Color(0xFF6C63FF),
            ),
          ),
          const SizedBox(height: 16),
          GridView.count(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisCount: 2,
            crossAxisSpacing: 14,
            mainAxisSpacing: 14,
            childAspectRatio: 1.0,
            children: _wellnessCategories.asMap().entries.map((entry) {
              int index = entry.key;
              Map<String, dynamic> category = entry.value;
              return _buildCategoryCard(
                context,
                category['title'],
                category['icon'],
                category['backgroundColor'],
                category['iconColor'],
                category['categoryId'],
                category['description'],
                index,
              );
            }).toList(),
          ),
          const SizedBox(height: 20),
        ],
      ),
    );
  }

  Widget _buildCategoryCard(
    BuildContext context,
    String title,
    IconData icon,
    Color backgroundColor,
    Color iconColor,
    String categoryId,
    String description,
    int index,
  ) {
    Color figureColor;
    if (categoryId == 'general_consultant') {
      figureColor = Color(0xFF4F46E5); // Indigo/Purple
    } else if (categoryId == 'pregnancy_care') {
      figureColor = Color(0xFF6C63FF); // Purple
    } else if (categoryId == 'symtom_fluctuation') {
      figureColor = Color(0xFF7C3AED); // Deep Purple
    } else if (categoryId == 'oesteoporosis_problem') {
      figureColor = Color(0xFF8B5CF6); // Purple/Violet
    } else if (categoryId == 'spiritual_awakening') {
      figureColor = Color(0xFFFFA500);
    } else if (categoryId == 'global_welfare') {
      figureColor = Color(0xFF4CAF50);
    } else if (categoryId == 'natural_healing') {
      figureColor = Color(0xFF8BC34A);
    } else if (categoryId == 'child_problems') {
      figureColor = Color(0xFFFFCC80);
    } else if (categoryId == 'depression') {
      figureColor = Color(0xFFB39DDB);
    } else if (categoryId == 'healthy_lifestyle') {
      figureColor = Color(0xFF81D4FA);
    } else {
      figureColor = Colors.black;
    }

    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => ConsultantChatbotPage(
              category: categoryId,
              categoryTitle: title,
              categoryColor: backgroundColor,
            ),
          ),
        );
      },
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          boxShadow: [
            BoxShadow(
              color: backgroundColor.withOpacity(0.3),
              blurRadius: 20,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        child: Padding(
          padding: const EdgeInsets.all(10),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: Colors.transparent,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: Color(0xFF8893F1), width: 1),
                ),
                child: Icon(icon, size: 26, color: figureColor),
              ),
              const SizedBox(height: 10),
              Text(
                title,
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                  color: backgroundColor,
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildWelcomeInterface() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(24, 16, 24, 90),
      child: Column(
        children: [
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(
                  color: Color(0xFF6C63FF).withOpacity(0.15),
                  blurRadius: 25,
                  offset: const Offset(0, 8),
                ),
              ],
            ),
            child: Column(
              children: [
                Container(
                  padding: EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.transparent,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: Color(0xFF8893F1), width: 1),
                  ),
                  child: Icon(
                    Icons.auto_awesome,
                    size: 32,
                    color: Colors.black,
                  ),
                ),
                SizedBox(height: 16),
                Text(
                  "Namaste! I am Dr. Swatantra AI, your Kalpavriksha (wish-fulfilling tree) to awaken your Atmik Intelligence and guide you towards health, wisdom, peace, and spiritual enlightenment.",
                  style: TextStyle(
                    fontSize: 15,
                    color: Colors.black87,
                    height: 1.5,
                    fontWeight: FontWeight.w500,
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Begin Your Transformation:',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF6C63FF),
                  ),
                ),
                const SizedBox(height: 16),
                Expanded(
                  child: ListView.builder(
                    itemCount: _predefinedPrompts.length,
                    itemBuilder: (context, index) {
                      return Padding(
                        padding: EdgeInsets.only(bottom: 12),
                        child: _buildAnimatedPromptCard(
                          _predefinedPrompts[index],
                          index,
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 8),
          Container(
            width: double.infinity,
            height: 48,
            decoration: BoxDecoration(
              color: Colors.transparent,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: Color(0xFF8893F1), width: 1),
            ),
            child: ElevatedButton(
              onPressed: _beginConversation,
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.transparent,
                foregroundColor: Colors.black,
                shadowColor: Colors.transparent,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                ),
                elevation: 0,
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.auto_awesome, size: 20),
                  SizedBox(width: 8),
                  Text(
                    'Awaken Your Journey',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
