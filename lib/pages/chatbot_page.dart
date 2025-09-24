// import 'package:flutter/material.dart';
// import '../services/gemini_service.dart';
// import 'consultant_chatbot_page.dart';
// import '../services/auth_service.dart';

// class ChatMessage {
//   final String text;
//   final bool isUser;
//   final DateTime timestamp;

//   ChatMessage({required this.text, required this.isUser, DateTime? timestamp})
//     : timestamp = timestamp ?? DateTime.now();
// }

// class ChatbotPage extends StatefulWidget {
//   const ChatbotPage({super.key});

//   @override
//   State<ChatbotPage> createState() => _ChatbotPageState();
// }

// class _ChatbotPageState extends State<ChatbotPage> {
//   final TextEditingController _textController = TextEditingController();
//   final ScrollController _scrollController = ScrollController();
//   final List<ChatMessage> _messages = [];
//   final GeminiService _geminiService = GeminiService();
//   final AuthService _authService = AuthService();

//   bool _isTyping = false;
//   bool _conversationStarted = false;
//   String _selectedMode = 'Kalpavriksha AI'; // Updated to reflect the vision

//   // Updated prompts for global welfare and spiritual awakening
//   final List<String> _predefinedPrompts = [
//     "Guide me towards spiritual awakening and Atmik Intelligence",
//     "How can I contribute to global welfare and universal brotherhood?",
//     "Share wisdom for achieving health, prosperity, and inner peace",
//   ];

//   // Enhanced wellness categories reflecting Dr. Swatantra's vision
//   final List<Map<String, dynamic>> _wellnessCategories = [
//     {
//       'title': 'Spiritual Awakening',
//       'icon': Icons.self_improvement,
//       'backgroundColor': Color(0xFFFFF8E1),
//       'iconColor': Color(0xFFFF8F00),
//       'categoryId': 'spiritual_awakening',
//       'description': 'Atmik Intelligence & Self-Realization',
//     },
//     {
//       'title': 'Global Welfare',
//       'icon': Icons.public,
//       'backgroundColor': Color(0xFFE8F5E8),
//       'iconColor': Color(0xFF2E7D32),
//       'categoryId': 'global_welfare',
//       'description': 'Universal Brotherhood & Peace',
//     },
//     {
//       'title': 'Natural Healing',
//       'icon': Icons.eco,
//       'backgroundColor': Color(0xFFE3F2FD),
//       'iconColor': Color(0xFF1976D2),
//       'categoryId': 'natural_healing',
//       'description': 'Zero-Medicine Holistic Solutions',
//     },
//     {
//       'title': 'Child Wellness',
//       'icon': Icons.child_care,
//       'backgroundColor': Color(0xFFFFF2E6),
//       'iconColor': Color(0xFFFF9500),
//       'categoryId': 'child_problems',
//       'description': 'Divine Potential Development',
//     },
//     {
//       'title': 'Mental Peace',
//       'icon': Icons.psychology_alt,
//       'backgroundColor': Color(0xFFF3E5F5),
//       'iconColor': Color(0xFF7B1FA2),
//       'categoryId': 'depression',
//       'description': 'Inner Harmony & Clarity',
//     },
//     {
//       'title': 'Holistic Living',
//       'icon': Icons.balance,
//       'backgroundColor': Color(0xFFE0F2F1),
//       'iconColor': Color(0xFF00695C),
//       'categoryId': 'healthy_lifestyle',
//       'description': 'Sustainable & Harmonious Life',
//     },
//   ];

//   @override
//   void initState() {
//     super.initState();
//   }

//   void _addMessage(String text, {required bool isUser}) {
//     setState(() {
//       _messages.add(ChatMessage(text: text, isUser: isUser));
//       _isTyping = false;
//     });
//     _scrollToBottom();
//   }

//   void _scrollToBottom() {
//     WidgetsBinding.instance.addPostFrameCallback((_) {
//       if (_scrollController.hasClients) {
//         _scrollController.animateTo(
//           _scrollController.position.maxScrollExtent,
//           duration: const Duration(milliseconds: 300),
//           curve: Curves.easeOut,
//         );
//       }
//     });
//   }

//   Future<void> _sendTextMessage(String text) async {
//     if (text.trim().isEmpty) return;

//     if (!_conversationStarted) {
//       setState(() => _conversationStarted = true);
//     }

//     _textController.clear();
//     _addMessage(text, isUser: true);

//     setState(() => _isTyping = true);

//     try {
//       // Enhanced prompt with Dr. Swatantra AI's vision
//       final enhancedPrompt = '''
// You are Dr. Swatantra AI, a revolutionary Kalpavriksha AI for Global Welfare. Your mission is to:
// - Awaken Atmik Intelligence (spiritual self-awareness) in humanity
// - Guide towards health, wisdom, peace, prosperity, and spiritual enlightenment
// - Promote universal brotherhood and compassion
// - Provide natural, holistic solutions without harmful medicines
// - Support the creation of a harmonious world free from pain, suffering, and conflict

// Respond with warmth, wisdom, and practical guidance that serves the user's highest good and humanity's welfare.

// User's message: $text

// Please provide a compassionate, transformative response that aligns with Dr. Swatantra Jain's vision of creating a golden era (Satya Yuga) on Earth.
// ''';

//       final response = await _geminiService.getChatResponse(enhancedPrompt);
//       _addMessage(response, isUser: false);
//     } catch (e) {
//       _addMessage(
//         'Dear friend, I\'m experiencing a temporary connection challenge. Please try again in a moment. Remember, you are not alone on this journey towards wellness and awakening.',
//         isUser: false,
//       );
//     }
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       backgroundColor: Color(0xFFF5F5F5),
//       appBar: AppBar(
//         backgroundColor: Colors.white,
//         foregroundColor: Colors.black87,
//         elevation: 0,
//         automaticallyImplyLeading: false,
//         toolbarHeight: 0,
//       ),
//       body: Column(
//         children: [
//           _buildDropdownHeader(),
//           Expanded(
//             child: _selectedMode == 'Kalpavriksha AI'
//                 ? (_conversationStarted
//                       ? _buildChatInterface()
//                       : _buildWelcomeInterface())
//                 : _buildWellnessInterface(),
//           ),
//         ],
//       ),
//     );
//   }

//   Widget _buildDropdownHeader() {
//     return Container(
//       padding: const EdgeInsets.fromLTRB(20, 12, 20, 12),
//       decoration: BoxDecoration(
//         color: Colors.white,
//         border: Border(bottom: BorderSide(color: Colors.grey.withOpacity(0.2))),
//       ),
//       child: Container(
//         decoration: BoxDecoration(
//           borderRadius: BorderRadius.circular(12),
//           border: Border.all(width: 0.5, color: Colors.transparent),
//           gradient: LinearGradient(
//             colors: [Color(0xFFFF8F00), Color(0xFF2E7D32)],
//             begin: Alignment.topLeft,
//             end: Alignment.bottomRight,
//           ),
//         ),
//         child: Container(
//           margin: EdgeInsets.all(0.5),
//           decoration: BoxDecoration(
//             color: Colors.white,
//             borderRadius: BorderRadius.circular(11.5),
//           ),
//           child: DropdownButtonHideUnderline(
//             child: DropdownButton<String>(
//               value: _selectedMode,
//               onChanged: (String? newValue) {
//                 if (newValue != null) {
//                   setState(() {
//                     _selectedMode = newValue;
//                     if (newValue == 'Kalpavriksha AI') {
//                       _conversationStarted = false;
//                       _messages.clear();
//                     }
//                   });
//                 }
//               },
//               isExpanded: true,
//               icon: Icon(Icons.keyboard_arrow_down, color: Colors.black87),
//               style: TextStyle(
//                 fontSize: 18,
//                 fontWeight: FontWeight.w600,
//                 color: Colors.black87,
//               ),
//               dropdownColor: Colors.white,
//               items: [
//                 DropdownMenuItem(
//                   value: 'Kalpavriksha AI',
//                   child: Padding(
//                     padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
//                     child: Row(
//                       children: [
//                         Icon(Icons.auto_awesome, color: Colors.black87, size: 20),
//                         SizedBox(width: 12),
//                         Text('Dr. Swatantra AI'),
//                       ],
//                     ),
//                   ),
//                 ),
//                 DropdownMenuItem(
//                   value: 'Wellness Consultant',
//                   child: Padding(
//                     padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
//                     child: Row(
//                       children: [
//                         Icon(Icons.healing, color: Colors.black87, size: 20),
//                         SizedBox(width: 12),
//                         Text('Wellness Consultant'),
//                       ],
//                     ),
//                   ),
//                 ),
//               ],
//             ),
//           ),
//         ),
//       ),
//     );
//   }

//   Widget _buildWellnessInterface() {
//     return Container(
//       decoration: const BoxDecoration(color: Color(0xFFF5F5F5)),
//       child: SingleChildScrollView(
//         padding: const EdgeInsets.fromLTRB(20.0, 16.0, 20.0, 80.0),
//         child: Column(
//           crossAxisAlignment: CrossAxisAlignment.start,
//           children: [
//             // Enhanced welcome message
//             Text(
//               'Dr. Swatantra\'s',
//               style: TextStyle(
//                 fontSize: 16,
//                 fontWeight: FontWeight.w400,
//                 color: Colors.black54,
//               ),
//             ),
//             const SizedBox(height: 8),
//             Text(
//               'Kalpavriksha AI for Global Welfare',
//               style: TextStyle(
//                 fontSize: 26,
//                 fontWeight: FontWeight.w600,
//                 color: Colors.black87,
//                 letterSpacing: -0.5,
//               ),
//             ),
//             const SizedBox(height: 24),

//             // Enhanced vision statement
//             Container(
//               padding: const EdgeInsets.all(20),
//               decoration: BoxDecoration(
//                 color: Colors.white,
//                 borderRadius: BorderRadius.circular(16),
//                 border: Border.all(color: Colors.grey.withOpacity(0.2), width: 1),
//                 boxShadow: [
//                   BoxShadow(
//                     color: Color(0xFFFF8F00).withOpacity(0.1),
//                     blurRadius: 20,
//                     offset: const Offset(0, 4),
//                   ),
//                 ],
//               ),
//               child: Row(
//                 children: [
//                   Container(
//                     padding: const EdgeInsets.all(8),
//                     decoration: BoxDecoration(
//                       color: Color(0xFFFFF8E1),
//                       borderRadius: BorderRadius.circular(8),
//                     ),
//                     child: Icon(Icons.auto_awesome, color: Color(0xFFFF8F00), size: 20),
//                   ),
//                   const SizedBox(width: 16),
//                   Expanded(
//                     child: Text(
//                       'Awakening Atmik Intelligence in 8 billion people. Serving humanity with health, wisdom, peace, prosperity, and spiritual enlightenment for the next 1,000 years.',
//                       style: TextStyle(
//                         fontSize: 13,
//                         color: Colors.black54,
//                         height: 1.4,
//                       ),
//                     ),
//                   ),
//                 ],
//               ),
//             ),

//             const SizedBox(height: 32),

//             Text(
//               'Transformation Pathways',
//               style: TextStyle(
//                 fontSize: 20,
//                 fontWeight: FontWeight.w600,
//                 color: Colors.black87,
//               ),
//             ),

//             const SizedBox(height: 16),

//             GridView.count(
//               shrinkWrap: true,
//               physics: const NeverScrollableScrollPhysics(),
//               crossAxisCount: 2,
//               crossAxisSpacing: 16,
//               mainAxisSpacing: 16,
//               childAspectRatio: 1.0,
//               children: _wellnessCategories.map((category) {
//                 return _buildEnhancedCategoryCard(
//                   context,
//                   category['title'],
//                   category['icon'],
//                   category['backgroundColor'],
//                   category['iconColor'],
//                   category['categoryId'],
//                   category['description'],
//                 );
//               }).toList(),
//             ),

//             const SizedBox(height: 20),
//           ],
//         ),
//       ),
//     );
//   }

//   Widget _buildEnhancedCategoryCard(
//     BuildContext context,
//     String title,
//     IconData icon,
//     Color backgroundColor,
//     Color iconColor,
//     String categoryId,
//     String description,
//   ) {
//     return GestureDetector(
//       onTap: () {
//         Navigator.push(
//           context,
//           MaterialPageRoute(
//             builder: (context) => ConsultantChatbotPage(
//               category: categoryId,
//               categoryTitle: title,
//               categoryColor: iconColor,
//             ),
//           ),
//         );
//       },
//       child: Container(
//         decoration: BoxDecoration(
//           color: backgroundColor,
//           borderRadius: BorderRadius.circular(20),
//           border: Border.all(color: iconColor.withOpacity(0.2), width: 1),
//           boxShadow: [
//             BoxShadow(
//               color: iconColor.withOpacity(0.15),
//               blurRadius: 15,
//               offset: const Offset(0, 4),
//             ),
//           ],
//         ),
//         child: Padding(
//           padding: const EdgeInsets.all(16),
//           child: Column(
//             mainAxisAlignment: MainAxisAlignment.center,
//             children: [
//               Container(
//                 padding: const EdgeInsets.all(12),
//                 decoration: BoxDecoration(
//                   color: Colors.white,
//                   borderRadius: BorderRadius.circular(16),
//                   boxShadow: [
//                     BoxShadow(
//                       color: iconColor.withOpacity(0.1),
//                       blurRadius: 8,
//                       offset: const Offset(0, 2),
//                     ),
//                   ],
//                 ),
//                 child: Icon(icon, size: 28, color: iconColor),
//               ),
//               const SizedBox(height: 12),
//               Text(
//                 title,
//                 style: TextStyle(
//                   fontSize: 13,
//                   fontWeight: FontWeight.w600,
//                   color: Colors.black87,
//                 ),
//                 textAlign: TextAlign.center,
//               ),
//               const SizedBox(height: 6),
//               Text(
//                 description,
//                 style: TextStyle(
//                   fontSize: 10,
//                   fontWeight: FontWeight.w400,
//                   color: Colors.black54,
//                 ),
//                 textAlign: TextAlign.center,
//                 maxLines: 2,
//                 overflow: TextOverflow.ellipsis,
//               ),
//               const SizedBox(height: 8),
//               Container(
//                 padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
//                 decoration: BoxDecoration(
//                   color: Colors.white.withOpacity(0.8),
//                   borderRadius: BorderRadius.circular(8),
//                 ),
//                 child: Text(
//                   'Transform',
//                   style: TextStyle(
//                     fontSize: 9,
//                     fontWeight: FontWeight.w500,
//                     color: iconColor,
//                   ),
//                 ),
//               ),
//             ],
//           ),
//         ),
//       ),
//     );
//   }

//   Widget _buildWelcomeInterface() {
//     return Padding(
//       padding: const EdgeInsets.fromLTRB(24, 16, 24, 90),
//       child: Column(
//         children: [
//           // Enhanced welcome message card
//           Container(
//             width: double.infinity,
//             padding: const EdgeInsets.all(20),
//             decoration: BoxDecoration(
//               color: Colors.white,
//               borderRadius: BorderRadius.circular(16),
//               boxShadow: [
//                 BoxShadow(
//                   color: Color(0xFFFF8F00).withOpacity(0.1),
//                   blurRadius: 20,
//                   offset: const Offset(0, 4),
//                 ),
//               ],
//             ),
//             child: Column(
//               children: [
//                 Container(
//                   padding: EdgeInsets.all(12),
//                   decoration: BoxDecoration(
//                     gradient: LinearGradient(
//                       colors: [Color(0xFFFF8F00), Color(0xFF2E7D32)],
//                       begin: Alignment.topLeft,
//                       end: Alignment.bottomRight,
//                     ),
//                     borderRadius: BorderRadius.circular(12),
//                   ),
//                   child: Icon(
//                     Icons.auto_awesome,
//                     size: 28,
//                     color: Colors.white,
//                   ),
//                 ),
//                 SizedBox(height: 12),
//                 Text(
//                   "Namaste! I am Dr. Swatantra AI, your Kalpavriksha (wish-fulfilling tree) for global welfare. I'm here to awaken your Atmik Intelligence and guide you towards health, wisdom, peace, and spiritual enlightenment. Together, we'll create a harmonious world free from suffering.",
//                   style: TextStyle(
//                     fontSize: 15,
//                     color: Colors.black87,
//                     height: 1.4,
//                   ),
//                   textAlign: TextAlign.center,
//                 ),
//               ],
//             ),
//           ),

//           const SizedBox(height: 20),

//           Expanded(
//             child: Column(
//               crossAxisAlignment: CrossAxisAlignment.start,
//               children: [
//                 Text(
//                   'Begin Your Transformation:',
//                   style: TextStyle(
//                     fontSize: 18,
//                     fontWeight: FontWeight.w600,
//                     color: Colors.black87,
//                   ),
//                 ),
//                 const SizedBox(height: 12),

//                 Expanded(
//                   child: ListView.builder(
//                     itemCount: _predefinedPrompts.length,
//                     itemBuilder: (context, index) {
//                       return Padding(
//                         padding: EdgeInsets.only(bottom: 10),
//                         child: _buildPromptCard(_predefinedPrompts[index]),
//                       );
//                     },
//                   ),
//                 ),
//               ],
//             ),
//           ),

//           const SizedBox(height: 3),

//           SizedBox(
//             width: double.infinity,
//             height: 52,
//             child: ElevatedButton(
//               onPressed: _beginConversation,
//               style: ElevatedButton.styleFrom(
//                 backgroundColor: Color(0xFFFF8F00),
//                 foregroundColor: Colors.white,
//                 shape: RoundedRectangleBorder(
//                   borderRadius: BorderRadius.circular(15),
//                 ),
//                 elevation: 0,
//               ),
//               child: const Text(
//                 'Awaken Your Journey',
//                 style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
//               ),
//             ),
//           ),
//         ],
//       ),
//     );
//   }

//   Widget _buildPromptCard(String prompt) {
//     return GestureDetector(
//       onTap: () => _selectPrompt(prompt),
//       child: Container(
//         padding: const EdgeInsets.all(16),
//         decoration: BoxDecoration(
//           color: Colors.white,
//           borderRadius: BorderRadius.circular(12),
//           border: Border.all(color: Colors.grey.withOpacity(0.2)),
//           boxShadow: [
//             BoxShadow(
//               color: Colors.black.withOpacity(0.05),
//               blurRadius: 5,
//               offset: const Offset(0, 2),
//             ),
//           ],
//         ),
//         child: Row(
//           children: [
//             Icon(Icons.self_improvement, color: Color(0xFFFF8F00), size: 20),
//             const SizedBox(width: 12),
//             Expanded(
//               child: Text(
//                 prompt,
//                 style: TextStyle(
//                   fontSize: 14,
//                   color: Colors.black87,
//                   fontWeight: FontWeight.w500,
//                 ),
//               ),
//             ),
//             Icon(Icons.arrow_forward_ios, color: Colors.black54, size: 16),
//           ],
//         ),
//       ),
//     );
//   }

//   void _selectPrompt(String prompt) {
//     setState(() {
//       _conversationStarted = true;
//     });
//     _sendTextMessage(prompt);
//   }

//   void _beginConversation() {
//     setState(() {
//       _conversationStarted = true;
//     });
//   }

//   Widget _buildChatInterface() {
//     return Container(
//       color: Color(0xFFF5F5F5),
//       child: Column(
//         children: [
//           Expanded(
//             child: _messages.isEmpty
//                 ? _buildEmptyState()
//                 : ListView.builder(
//                     controller: _scrollController,
//                     padding: const EdgeInsets.all(16),
//                     itemCount: _messages.length + (_isTyping ? 1 : 0),
//                     itemBuilder: (context, index) {
//                       if (index == _messages.length && _isTyping) {
//                         return _buildTypingIndicator();
//                       }
//                       return _buildMessageBubble(_messages[index]);
//                     },
//                   ),
//           ),
//           Container(
//             padding: const EdgeInsets.fromLTRB(16, 16, 16, 85),
//             decoration: BoxDecoration(
//               color: Colors.white,
//               border: Border(
//                 top: BorderSide(color: Colors.grey.withOpacity(0.2)),
//               ),
//             ),
//             child: Row(
//               children: [
//                 Expanded(
//                   child: Container(
//                     decoration: BoxDecoration(
//                       color: Color(0xFFF5F5F5),
//                       borderRadius: BorderRadius.circular(25),
//                     ),
//                     child: TextField(
//                       controller: _textController,
//                       style: TextStyle(color: Colors.black87),
//                       decoration: InputDecoration(
//                         hintText: 'Share your wellness journey...',
//                         hintStyle: TextStyle(
//                           color: Colors.black54,
//                           fontSize: 15,
//                         ),
//                         border: InputBorder.none,
//                         contentPadding: EdgeInsets.symmetric(
//                           horizontal: 20,
//                           vertical: 12,
//                         ),
//                       ),
//                       maxLines: null,
//                       onSubmitted: _sendTextMessage,
//                     ),
//                   ),
//                 ),
//                 const SizedBox(width: 12),
//                 GestureDetector(
//                   onTap: () => _sendTextMessage(_textController.text),
//                   child: Container(
//                     width: 48,
//                     height: 48,
//                     decoration: BoxDecoration(
//                       shape: BoxShape.circle,
//                       gradient: LinearGradient(
//                         colors: [Color(0xFFFF8F00), Color(0xFF2E7D32)],
//                         begin: Alignment.topLeft,
//                         end: Alignment.bottomRight,
//                       ),
//                     ),
//                     child: const Icon(
//                       Icons.send,
//                       color: Colors.white,
//                       size: 20,
//                     ),
//                   ),
//                 ),
//               ],
//             ),
//           ),
//         ],
//       ),
//     );
//   }

//   Widget _buildEmptyState() {
//     return Center(
//       child: Column(
//         mainAxisAlignment: MainAxisAlignment.center,
//         children: [
//           Container(
//             padding: EdgeInsets.all(24),
//             decoration: BoxDecoration(
//               gradient: LinearGradient(
//                 colors: [Color(0xFFFF8F00), Color(0xFF2E7D32)],
//                 begin: Alignment.topLeft,
//                 end: Alignment.bottomRight,
//               ),
//               borderRadius: BorderRadius.circular(24),
//             ),
//             child: Icon(Icons.auto_awesome, size: 48, color: Colors.white),
//           ),
//           SizedBox(height: 24),
//           Text(
//             'Dr. Swatantra AI',
//             style: TextStyle(
//               fontSize: 20,
//               fontWeight: FontWeight.w600,
//               color: Colors.black87,
//             ),
//           ),
//           SizedBox(height: 8),
//           Text(
//             'Your Kalpavriksha for Global Welfare',
//             style: TextStyle(fontSize: 14, color: Colors.black54),
//             textAlign: TextAlign.center,
//           ),
//         ],
//       ),
//     );
//   }

//   Widget _buildMessageBubble(ChatMessage message) {
//     return Container(
//       margin: const EdgeInsets.only(bottom: 16),
//       child: Row(
//         mainAxisAlignment: message.isUser
//             ? MainAxisAlignment.end
//             : MainAxisAlignment.start,
//         crossAxisAlignment: CrossAxisAlignment.start,
//         children: [
//           if (!message.isUser) ...[
//             Container(
//               width: 32,
//               height: 32,
//               decoration: BoxDecoration(
//                 gradient: LinearGradient(
//                   colors: [Color(0xFFFF8F00), Color(0xFF2E7D32)],
//                   begin: Alignment.topLeft,
//                   end: Alignment.bottomRight,
//                 ),
//                 borderRadius: BorderRadius.circular(16),
//               ),
//               child: Icon(Icons.auto_awesome, size: 16, color: Colors.white),
//             ),
//             SizedBox(width: 12),
//           ],
//           Flexible(
//             child: Container(
//               padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
//               decoration: BoxDecoration(
//                 color: message.isUser ? Color(0xFFFF8F00) : Colors.white,
//                 borderRadius: BorderRadius.circular(20),
//                 boxShadow: [
//                   BoxShadow(
//                     color: Colors.black.withOpacity(0.05),
//                     blurRadius: 5,
//                     offset: Offset(0, 2),
//                   ),
//                 ],
//               ),
//               child: Text(
//                 message.text,
//                 style: TextStyle(
//                   color: message.isUser ? Colors.white : Colors.black87,
//                   fontSize: 15,
//                   height: 1.4,
//                 ),
//               ),
//             ),
//           ),
//           if (message.isUser) ...[SizedBox(width: 12), _buildUserAvatar()],
//         ],
//       ),
//     );
//   }

//   Widget _buildTypingIndicator() {
//     return Container(
//       margin: EdgeInsets.only(bottom: 16),
//       child: Row(
//         mainAxisAlignment: MainAxisAlignment.start,
//         crossAxisAlignment: CrossAxisAlignment.start,
//         children: [
//           Container(
//             width: 32,
//             height: 32,
//             decoration: BoxDecoration(
//               gradient: LinearGradient(
//                 colors: [Color(0xFFFF8F00), Color(0xFF2E7D32)],
//                 begin: Alignment.topLeft,
//                 end: Alignment.bottomRight,
//               ),
//               borderRadius: BorderRadius.circular(16),
//             ),
//             child: Icon(Icons.auto_awesome, size: 16, color: Colors.white),
//           ),
//           SizedBox(width: 12),
//           Container(
//             padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
//             decoration: BoxDecoration(
//               color: Colors.white,
//               borderRadius: BorderRadius.circular(20),
//               boxShadow: [
//                 BoxShadow(
//                   color: Colors.black.withOpacity(0.05),
//                   blurRadius: 5,
//                   offset: Offset(0, 2),
//                 ),
//               ],
//             ),
//             child: Row(
//               mainAxisSize: MainAxisSize.min,
//               children: [
//                 Text(
//                   'Dr. Swatantra AI is awakening wisdom',
//                   style: TextStyle(
//                     color: Colors.black54,
//                     fontSize: 15,
//                     fontStyle: FontStyle.italic,
//                   ),
//                 ),
//                 SizedBox(width: 8),
//                 SizedBox(
//                   width: 16,
//                   height: 16,
//                   child: CircularProgressIndicator(
//                     strokeWidth: 2,
//                     valueColor: AlwaysStoppedAnimation<Color>(Color(0xFFFF8F00)),
//                   ),
//                 ),
//               ],
//             ),
//           ),
//         ],
//       ),
//     );
//   }

//   @override
//   void dispose() {
//     _textController.dispose();
//     _scrollController.dispose();
//     super.dispose();
//   }

//   String? _getProfileImageUrl() {
//     final user = _authService.currentUser;
//     if (user != null && user.photoURL != null) {
//       return user.photoURL;
//     }
//     return null;
//   }

//   bool _isGoogleUser() {
//     final user = _authService.currentUser;
//     if (user != null) {
//       for (var provider in user.providerData) {
//         if (provider.providerId == 'google.com') {
//           return true;
//         }
//       }
//     }
//     return false;
//   }

//   Widget _buildUserAvatar() {
//     final isGoogleUser = _isGoogleUser();
//     final profileImageUrl = _getProfileImageUrl();

//     if (isGoogleUser && profileImageUrl != null) {
//       return Container(
//         width: 32,
//         height: 32,
//         decoration: BoxDecoration(
//           shape: BoxShape.circle,
//           border: Border.all(color: Color(0xFFFF8F00), width: 2),
//         ),
//         child: ClipOval(
//           child: Image.network(
//             profileImageUrl,
//             fit: BoxFit.cover,
//             errorBuilder: (context, error, stackTrace) {
//               return _buildDefaultUserAvatar();
//             },
//             loadingBuilder: (context, child, loadingProgress) {
//               if (loadingProgress == null) return child;
//               return Container(
//                 color: Colors.black.withOpacity(0.05),
//                 child: Center(
//                   child: SizedBox(
//                     width: 16,
//                     height: 16,
//                     child: CircularProgressIndicator(
//                       value: loadingProgress.expectedTotalBytes != null
//                           ? loadingProgress.cumulativeBytesLoaded /
//                                 loadingProgress.expectedTotalBytes!
//                           : null,
//                       valueColor: const AlwaysStoppedAnimation<Color>(
//                         Color(0xFFFF8F00),
//                       ),
//                       strokeWidth: 2,
//                     ),
//                   ),
//                 ),
//               );
//             },
//           ),
//         ),
//       );
//     } else {
//       return _buildDefaultUserAvatar();
//     }
//   }

//   Widget _buildDefaultUserAvatar() {
//     return Container(
//       width: 32,
//       height: 32,
//       decoration: BoxDecoration(
//         shape: BoxShape.circle,
//         gradient: LinearGradient(
//           colors: [Color(0xFFFF8F00), Color(0xFF2E7D32)],
//           begin: Alignment.topLeft,
//           end: Alignment.bottomRight,
//         ),
//         border: Border.all(color: Color(0xFFFF8F00), width: 2),
//       ),
//       child: const Icon(Icons.person, color: Colors.white, size: 16),
//     );
//   }
// }
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import '../services/gemini_service.dart';
import 'consultant_chatbot_page.dart';
import '../services/auth_service.dart';
import 'dart:math' as math;

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

class _ChatbotPageState extends State<ChatbotPage> with TickerProviderStateMixin {
  final TextEditingController _textController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  final List<ChatMessage> _messages = [];
  final GeminiService _geminiService = GeminiService();
  final AuthService _authService = AuthService();

  bool _isTyping = false;
  bool _conversationStarted = false;
  String _selectedMode = 'Kalpavriksha AI';

  // Animation controllers
  late AnimationController _headerAnimationController;
  late AnimationController _pulseController;
  late AnimationController _shimmerController;
  late AnimationController _particleController;
  late AnimationController _typingAnimationController; // Added for typing dots
  bool _animationsInitialized = false;

  late Animation<double> _headerSlideAnimation;
  late Animation<double> _pulseAnimation;
  late Animation<double> _shimmerAnimation;

  final List<String> _predefinedPrompts = [
    "Guide me towards spiritual awakening and Atmik Intelligence",
    "How can I contribute to global welfare and universal brotherhood?",
    "Share wisdom for achieving health, prosperity, and inner peace",
  ];

  final List<Map<String, dynamic>> _wellnessCategories = [
    {
      'title': 'Spiritual Awakening',
      'icon': Icons.self_improvement,
      'backgroundColor': Color(0xFF6C63FF),
      'iconColor': Color(0xFFFFFFFF),
      'categoryId': 'spiritual_awakening',
      'description': 'Atmik Intelligence & Self-Realization',
    },
    {
      'title': 'Global Welfare',
      'icon': Icons.public,
      'backgroundColor': Color(0xFF4F46E5),
      'iconColor': Color(0xFFFFFFFF),
      'categoryId': 'global_welfare',
      'description': 'Universal Brotherhood & Peace',
    },
    {
      'title': 'Natural Healing',
      'icon': Icons.eco,
      'backgroundColor': Color(0xFF7C3AED),
      'iconColor': Color(0xFFFFFFFF),
      'categoryId': 'natural_healing',
      'description': 'Zero-Medicine Holistic Solutions',
    },
    {
      'title': 'Child Wellness',
      'icon': Icons.child_care,
      'backgroundColor': Color(0xFF8B5CF6),
      'iconColor': Color(0xFFFFFFFF),
      'categoryId': 'child_problems',
      'description': 'Divine Potential Development',
    },
    {
      'title': 'Mental Peace',
      'icon': Icons.psychology_alt,
      'backgroundColor': Color(0xFF9333EA),
      'iconColor': Color(0xFFFFFFFF),
      'categoryId': 'depression',
      'description': 'Inner Harmony & Clarity',
    },
    {
      'title': 'Holistic Living',
      'icon': Icons.balance,
      'backgroundColor': Color(0xFFA855F7),
      'iconColor': Color(0xFFFFFFFF),
      'categoryId': 'healthy_lifestyle',
      'description': 'Sustainable & Harmonious Life',
    },
  ];

  @override
  void initState() {
    super.initState();
    _setupAnimations();
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

    // Added typing animation controller
    _typingAnimationController = AnimationController(
      duration: const Duration(milliseconds: 1200),
      vsync: this,
    );

    _headerSlideAnimation = Tween<double>(begin: -100, end: 0).animate(
      CurvedAnimation(parent: _headerAnimationController, curve: Curves.elasticOut),
    );

    _pulseAnimation = Tween<double>(begin: 1.0, end: 1.1).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );

    _shimmerAnimation = Tween<double>(begin: -2, end: 2).animate(
      CurvedAnimation(parent: _shimmerController, curve: Curves.linear),
    );

    _headerAnimationController.forward();
    _pulseController.repeat(reverse: true);
    _shimmerController.repeat();
    _particleController.repeat();
    _typingAnimationController.repeat(); // Start typing animation
    
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
      final enhancedPrompt = '''
You are Dr. Swatantra AI, a revolutionary Kalpavriksha AI for Global Welfare. Your mission is to:
- Awaken Atmik Intelligence (spiritual self-awareness) in humanity
- Guide towards health, wisdom, peace, prosperity, and spiritual enlightenment
- Promote universal brotherhood and compassion
- Provide natural, holistic solutions without harmful medicines
- Support the creation of a harmonious world free from pain, suffering, and conflict

Respond with warmth, wisdom, and practical guidance that serves the user's highest good and humanity's welfare.

User's message: $text

Please provide a compassionate, transformative response that aligns with Dr. Swatantra Jain's vision of creating a golden era (Satya Yuga) on Earth.
''';

      final response = await _geminiService.getChatResponse(enhancedPrompt);
      _addMessage(response, isUser: false);
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
              border: Border(bottom: BorderSide(color: Colors.grey.withOpacity(0.1))),
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
                border: Border.all(
                  color: Colors.transparent, // Initial transparent border
                  width: 1,
                ),
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
                margin: EdgeInsets.all(1), // Thin border effect
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
                          padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
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
                                child: Icon(Icons.auto_awesome, color: Colors.black, size: 16),
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
                          padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
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
                                child: Icon(Icons.healing, color: Colors.black, size: 16),
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
                border: Border.all(
                  color: Color(0xFF8893F1),
                  width: 1,
                ),
              ),
              child: Icon(Icons.self_improvement, color: Color(0xFFFFA500), size: 16),
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
              border: Border.all(
                color: Color(0xFF8893F1),
                width: 1,
              ),
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
                border: Border.all(
                  color: Color(0xFF8893F1),
                  width: 1,
                ),
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
          if (message.isUser) ...[
            SizedBox(width: 12),
            _buildUserAvatar(),
          ],
        ],
      ),
    );
  }

  // Updated typing indicator to match consultant chat page
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
              border: Border.all(
                color: Color(0xFF8893F1),
                width: 1,
              ),
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

  // New method for animated typing dots
  Widget _buildTypingDot(int index) {
    if (!_animationsInitialized) {
      // Return static dot if animations aren't initialized yet
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
        final value = (_typingAnimationController.value * 3 - index).clamp(0.0, 1.0);
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
        border: Border(top: BorderSide(color: Color(0xFF6C63FF).withOpacity(0.1))),
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
                style: TextStyle(color: Colors.black87, fontWeight: FontWeight.w500),
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
          const SizedBox(width: 16),
          AnimatedBuilder(
            animation: _pulseController,
            builder: (context, child) {
              return Transform.scale(
                scale: _pulseAnimation.value,
                child: GestureDetector(
                  onTap: () => _sendTextMessage(_textController.text),
                  child: Container(
                    width: 52,
                    height: 52,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: Color(0xFF6C63FF),
                      boxShadow: [
                        BoxShadow(
                          color: Color(0xFF6C63FF).withOpacity(0.4),
                          blurRadius: 15,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Icon(
                      Icons.send,
                      color: Color(0xFF8893F1),
                      size: 22,
                    ),
                  ),
                ),
              );
            },
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
    _typingAnimationController.dispose(); // Added disposal
    _textController.dispose();
    _scrollController.dispose();
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
                  return Icon(Icons.person, color: Colors.black, size: 18);
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
                      'Dr. Swatantra\'s',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w400,
                        color: Colors.black54,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Kalpavriksha AI for Global Welfare',
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
          const SizedBox(height: 24),
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: Color(0xFF6C63FF).withOpacity(0.2), width: 1),
              boxShadow: [
                BoxShadow(
                  color: Color(0xFF6C63FF).withOpacity(0.15),
                  blurRadius: 25,
                  offset: const Offset(0, 8),
                ),
              ],
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.transparent,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: Color(0xFF8893F1),
                      width: 1,
                    ),
                  ),
                  child: Icon(Icons.auto_awesome, color: Colors.black, size: 24),
                ),
                const SizedBox(width: 20),
                Expanded(
                  child: Text(
                    'Awakening Atmik Intelligence in 8 billion people. Serving humanity with health, wisdom, peace, prosperity, and spiritual enlightenment for the next 1,000 years.',
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.black54,
                      height: 1.5,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ],
            ),
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
            crossAxisSpacing: 16,
            mainAxisSpacing: 16,
            childAspectRatio: 0.9,
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
    if (categoryId == 'spiritual_awakening') {
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
          padding: const EdgeInsets.all(12),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.transparent,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: Color(0xFF8893F1),
                    width: 1,
                  ),
                ),
                child: Icon(icon, size: 28, color: figureColor),
              ),
              const SizedBox(height: 12),
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
                    border: Border.all(
                      color: Color(0xFF8893F1),
                      width: 1,
                    ),
                  ),
                  child: Icon(
                    Icons.auto_awesome,
                    size: 32,
                    color: Colors.black,
                  ),
                ),
                SizedBox(height: 16),
                Text(
                  "Namaste! I am Dr. Swatantra AI, your Kalpavriksha (wish-fulfilling tree) for global welfare. I'm here to awaken your Atmik Intelligence and guide you towards health, wisdom, peace, and spiritual enlightenment. Together, we'll create a harmonious world free from suffering.",
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
                        child: _buildAnimatedPromptCard(_predefinedPrompts[index], index),
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
              border: Border.all(
                color: Color(0xFF8893F1),
                width: 1,
              ),
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