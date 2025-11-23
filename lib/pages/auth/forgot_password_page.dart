// import 'package:flutter/material.dart';
// import '../../services/auth_service.dart';
// import 'login_page.dart';

// class ForgotPasswordPage extends StatefulWidget {
//   const ForgotPasswordPage({super.key});

//   @override
//   State<ForgotPasswordPage> createState() => _ForgotPasswordPageState();
// }

// class _ForgotPasswordPageState extends State<ForgotPasswordPage> with TickerProviderStateMixin {
//   final TextEditingController _emailController = TextEditingController();
//   final AuthService _authService = AuthService();
//   final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

//   bool _isLoading = false;
//   bool _emailSent = false;
//   String _errorMessage = '';
//   String _successMessage = '';

//   late AnimationController _fadeController;
//   late AnimationController _slideController;
//   late Animation<double> _fadeAnimation;
//   late Animation<Offset> _slideAnimation;

//   @override
//   void initState() {
//     super.initState();
//     _setupAnimations();
//   }

//   void _setupAnimations() {
//     _fadeController = AnimationController(
//       duration: const Duration(milliseconds: 1000),
//       vsync: this,
//     );
//     _slideController = AnimationController(
//       duration: const Duration(milliseconds: 800),
//       vsync: this,
//     );

//     _fadeAnimation = Tween<double>(
//       begin: 0.0,
//       end: 1.0,
//     ).animate(CurvedAnimation(
//       parent: _fadeController,
//       curve: Curves.easeInOut,
//     ));

//     _slideAnimation = Tween<Offset>(
//       begin: const Offset(0, 0.3),
//       end: Offset.zero,
//     ).animate(CurvedAnimation(
//       parent: _slideController,
//       curve: Curves.easeOutBack,
//     ));

//     _fadeController.forward();
//     _slideController.forward();
//   }

//   bool _isValidEmail(String email) {
//     return RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(email);
//   }

//   Future<void> _sendPasswordReset() async {
//     setState(() {
//       _errorMessage = '';
//       _successMessage = '';
//     });

//     if (!_formKey.currentState!.validate()) {
//       return;
//     }

//     final email = _emailController.text.trim();

//     setState(() {
//       _isLoading = true;
//     });

//     try {
//       await _authService.resetPassword(email);

//       setState(() {
//         _emailSent = true;
//         _successMessage =
//             'Password reset email sent to $email. Please check your inbox and spam folder.';
//       });
//     } catch (e) {
//       setState(() {
//         String errorMsg = e.toString();
//         if (errorMsg.contains('user-not-found')) {
//           _errorMessage = 'No account found with this email address.';
//         } else if (errorMsg.contains('invalid-email')) {
//           _errorMessage = 'Please enter a valid email address.';
//         } else if (errorMsg.contains('too-many-requests')) {
//           _errorMessage = 'Too many requests. Please try again later.';
//         } else {
//           _errorMessage = errorMsg.replaceAll('Exception: ', '');
//         }
//       });
//     } finally {
//       if (mounted) {
//         setState(() => _isLoading = false);
//       }
//     }
//   }

//   void _resetForm() {
//     setState(() {
//       _emailSent = false;
//       _errorMessage = '';
//       _successMessage = '';
//     });
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       backgroundColor: Colors.white,
//       body: Container(
//         child: SafeArea(
//           child: SingleChildScrollView(
//             padding: const EdgeInsets.all(24),
//             child: FadeTransition(
//               opacity: _fadeAnimation,
//               child: SlideTransition(
//                 position: _slideAnimation,
//                 child: Column(
//                   crossAxisAlignment: CrossAxisAlignment.stretch,
//                   children: [
//                     const SizedBox(height: 20),

//                     // Back button
//                     Align(
//                       alignment: Alignment.centerLeft,
//                       child: Container(
//                         decoration: BoxDecoration(
//                           color: Colors.white.withOpacity(0.1),
//                           borderRadius: BorderRadius.circular(12),
//                           border: Border.all(
//                             color: Colors.white.withOpacity(0.2),
//                             width: 1,
//                           ),
//                         ),
//                         child: IconButton(
//                           icon: const Icon(Icons.arrow_back, color: Colors.white),
//                           onPressed: () => Navigator.of(context).pop(),
//                         ),
//                       ),
//                     ),

//                     const SizedBox(height: 40),

//                     // Main Card Container - Minimalistic Glassmorphism
//                     Container(
//                       width: double.infinity,
//                       padding: const EdgeInsets.all(32),
//                       decoration: BoxDecoration(
//                         gradient: LinearGradient(
//                           begin: Alignment.topLeft,
//                           end: Alignment.bottomRight,
//                           colors: [
//                             Colors.white.withOpacity(0.15),
//                             Colors.white.withOpacity(0.05),
//                           ],
//                         ),
//                         borderRadius: BorderRadius.circular(24),
//                         border: Border.all(
//                           color: Colors.white.withOpacity(0.2),
//                           width: 1,
//                         ),
//                         boxShadow: [
//                           BoxShadow(
//                             color: Colors.black.withOpacity(0.1),
//                             blurRadius: 30,
//                             offset: const Offset(0, 15),
//                           ),
//                         ],
//                       ),
//                       child: Form(
//                         key: _formKey,
//                         child: Column(
//                           crossAxisAlignment: CrossAxisAlignment.center,
//                           children: [
//                             // Icon
//                             Container(
//                               width: 80,
//                               height: 80,
//                               decoration: BoxDecoration(
//                                 gradient: const LinearGradient(
//                                   begin: Alignment.topLeft,
//                                   end: Alignment.bottomRight,
//                                   colors: [
//                                     Color(0xFF6C63FF),
//                                     Color(0xFF4F46E5),
//                                   ],
//                                 ),
//                                 borderRadius: BorderRadius.circular(20),
//                                 boxShadow: [
//                                   BoxShadow(
//                                     color: const Color(0xFF6C63FF).withOpacity(0.3),
//                                     blurRadius: 20,
//                                     offset: const Offset(0, 10),
//                                   ),
//                                 ],
//                               ),
//                               child: const Icon(
//                                 Icons.lock_reset,
//                                 color: Colors.white,
//                                 size: 40,
//                               ),
//                             ),

//                             const SizedBox(height: 32),

//                             if (!_emailSent) ...[
//                               // Title
//                               ShaderMask(
//                                 shaderCallback: (bounds) {
//                                   return const LinearGradient(
//                                     colors: [
//                                       Colors.white,
//                                       Color(0xFF6C63FF),
//                                     ],
//                                   ).createShader(bounds);
//                                 },
//                                 child: const Text(
//                                   'Forgot Password?',
//                                   style: TextStyle(
//                                     fontSize: 28,
//                                     fontWeight: FontWeight.w700,
//                                     color: Colors.white,
//                                     letterSpacing: -0.5,
//                                   ),
//                                 ),
//                               ),

//                               const SizedBox(height: 12),

//                               Text(
//                                 'Enter your email address and we\'ll send you a link to reset your password',
//                                 textAlign: TextAlign.center,
//                                 style: TextStyle(
//                                   fontSize: 16,
//                                   color: Colors.white.withOpacity(0.7),
//                                   height: 1.4,
//                                 ),
//                               ),

//                               const SizedBox(height: 32),

//                               // Error Message
//                               if (_errorMessage.isNotEmpty)
//                                 Container(
//                                   width: double.infinity,
//                                   padding: const EdgeInsets.all(16),
//                                   margin: const EdgeInsets.only(bottom: 20),
//                                   decoration: BoxDecoration(
//                                     color: Colors.red.withOpacity(0.1),
//                                     borderRadius: BorderRadius.circular(16),
//                                     border: Border.all(
//                                       color: Colors.red.withOpacity(0.3),
//                                       width: 1,
//                                     ),
//                                   ),
//                                   child: Text(
//                                     _errorMessage,
//                                     style: const TextStyle(
//                                       color: Colors.red,
//                                       fontSize: 14,
//                                     ),
//                                     textAlign: TextAlign.center,
//                                   ),
//                                 ),

//                               // Email Field
//                               Container(
//                                 decoration: BoxDecoration(
//                                   color: Colors.white.withOpacity(0.1),
//                                   borderRadius: BorderRadius.circular(16),
//                                   border: Border.all(
//                                     color: Colors.white.withOpacity(0.2),
//                                     width: 1,
//                                   ),
//                                 ),
//                                 child: TextFormField(
//                                   controller: _emailController,
//                                   keyboardType: TextInputType.emailAddress,
//                                   style: const TextStyle(
//                                     color: Colors.white,
//                                     fontSize: 16,
//                                   ),
//                                   decoration: InputDecoration(
//                                     hintText: 'Enter your email',
//                                     hintStyle: TextStyle(
//                                       color: Colors.white.withOpacity(0.5),
//                                       fontSize: 16,
//                                     ),
//                                     prefixIcon: Icon(
//                                       Icons.email_outlined,
//                                       color: Colors.white.withOpacity(0.7),
//                                       size: 20,
//                                     ),
//                                     border: InputBorder.none,
//                                     contentPadding: const EdgeInsets.symmetric(
//                                       horizontal: 20,
//                                       vertical: 16,
//                                     ),
//                                   ),
//                                   validator: (value) {
//                                     if (value == null || value.trim().isEmpty) {
//                                       return 'Please enter your email';
//                                     }
//                                     if (!_isValidEmail(value.trim())) {
//                                       return 'Please enter a valid email address';
//                                     }
//                                     return null;
//                                   },
//                                 ),
//                               ),

//                               const SizedBox(height: 32),

//                               // Reset Password Button
//                               SizedBox(
//                                 width: double.infinity,
//                                 height: 56,
//                                 child: ElevatedButton(
//                                   onPressed: _isLoading ? null : _sendPasswordReset,
//                                   style: ElevatedButton.styleFrom(
//                                     backgroundColor: const Color(0xFF6C63FF),
//                                     foregroundColor: Colors.white,
//                                     elevation: 0,
//                                     shape: RoundedRectangleBorder(
//                                       borderRadius: BorderRadius.circular(16),
//                                     ),
//                                     shadowColor: const Color(0xFF6C63FF).withOpacity(0.3),
//                                   ),
//                                   child: _isLoading
//                                       ? const SizedBox(
//                                           width: 24,
//                                           height: 24,
//                                           child: CircularProgressIndicator(
//                                             strokeWidth: 2,
//                                             valueColor: AlwaysStoppedAnimation<Color>(
//                                               Colors.white,
//                                             ),
//                                           ),
//                                         )
//                                       : const Text(
//                                           'Send Reset Link',
//                                           style: TextStyle(
//                                             fontSize: 18,
//                                             fontWeight: FontWeight.w600,
//                                           ),
//                                         ),
//                                 ),
//                               ),
//                             ] else ...[
//                               // Success state
//                               Container(
//                                 width: 100,
//                                 height: 100,
//                                 decoration: BoxDecoration(
//                                   color: Colors.green.withOpacity(0.2),
//                                   borderRadius: BorderRadius.circular(50),
//                                   border: Border.all(
//                                     color: Colors.green.withOpacity(0.3),
//                                     width: 2,
//                                   ),
//                                 ),
//                                 child: const Icon(
//                                   Icons.mark_email_read,
//                                   color: Colors.green,
//                                   size: 50,
//                                 ),
//                               ),

//                               const SizedBox(height: 24),

//                               const Text(
//                                 'Email Sent!',
//                                 style: TextStyle(
//                                   fontSize: 28,
//                                   fontWeight: FontWeight.w700,
//                                   color: Colors.white,
//                                   letterSpacing: -0.5,
//                                 ),
//                               ),

//                               const SizedBox(height: 16),

//                               Text(
//                                 _successMessage,
//                                 textAlign: TextAlign.center,
//                                 style: TextStyle(
//                                   fontSize: 16,
//                                   color: Colors.white.withOpacity(0.7),
//                                   height: 1.4,
//                                 ),
//                               ),

//                               const SizedBox(height: 32),

//                               // Send Another Email Button
//                               SizedBox(
//                                 width: double.infinity,
//                                 height: 56,
//                                 child: OutlinedButton(
//                                   onPressed: _resetForm,
//                                   style: OutlinedButton.styleFrom(
//                                     side: BorderSide(
//                                       color: Colors.white.withOpacity(0.2),
//                                       width: 1.5,
//                                     ),
//                                     shape: RoundedRectangleBorder(
//                                       borderRadius: BorderRadius.circular(16),
//                                     ),
//                                     backgroundColor: Colors.white.withOpacity(0.05),
//                                   ),
//                                   child: const Text(
//                                     'Send Another Email',
//                                     style: TextStyle(
//                                       fontSize: 16,
//                                       fontWeight: FontWeight.w600,
//                                       color: Colors.white,
//                                     ),
//                                   ),
//                                 ),
//                               ),
//                             ],

//                             const SizedBox(height: 24),

//                             // Back to Login Link
//                             Row(
//                               mainAxisAlignment: MainAxisAlignment.center,
//                               children: [
//                                 Text(
//                                   'Remember your password? ',
//                                   style: TextStyle(
//                                     color: Colors.white.withOpacity(0.7),
//                                     fontSize: 16,
//                                   ),
//                                 ),
//                                 GestureDetector(
//                                   onTap: () {
//                                     Navigator.pushReplacement(
//                                       context,
//                                       MaterialPageRoute(
//                                         builder: (context) => const LoginPage(),
//                                       ),
//                                     );
//                                   },
//                                   child: const Text(
//                                     'Sign In',
//                                     style: TextStyle(
//                                       color: Color(0xFF6C63FF),
//                                       fontSize: 16,
//                                       fontWeight: FontWeight.w600,
//                                     ),
//                                   ),
//                                 ),
//                               ],
//                             ),
//                           ],
//                         ),
//                       ),
//                     ),
//                   ],
//                 ),
//               ),
//             ),
//           ),
//         ),
//       ),
//     );
//   }

//   @override
//   void dispose() {
//     _fadeController.dispose();
//     _slideController.dispose();
//     _emailController.dispose();
//     super.dispose();
//   }
// }
import 'package:flutter/material.dart';
import '../../services/auth_service.dart';
import 'login_page.dart';

class ForgotPasswordPage extends StatefulWidget {
  const ForgotPasswordPage({super.key});

  @override
  State<ForgotPasswordPage> createState() => _ForgotPasswordPageState();
}

class _ForgotPasswordPageState extends State<ForgotPasswordPage>
    with TickerProviderStateMixin {
  final TextEditingController _emailController = TextEditingController();
  final AuthService _authService = AuthService();
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  bool _isLoading = false;
  bool _emailSent = false;
  String _errorMessage = '';
  String _successMessage = '';

  late AnimationController _fadeController;
  late AnimationController _slideController;
  late Animation<double> _fadeAnimation;
  late Animation<Offset> _slideAnimation;

  @override
  void initState() {
    super.initState();
    _setupAnimations();
  }

  void _setupAnimations() {
    _fadeController = AnimationController(
      duration: const Duration(milliseconds: 1000),
      vsync: this,
    );
    _slideController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );

    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _fadeController, curve: Curves.easeInOut),
    );

    _slideAnimation =
        Tween<Offset>(begin: const Offset(0, 0.3), end: Offset.zero).animate(
          CurvedAnimation(parent: _slideController, curve: Curves.easeOutBack),
        );

    _fadeController.forward();
    _slideController.forward();
  }

  bool _isValidEmail(String email) {
    return RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(email);
  }

  Future<void> _sendPasswordReset() async {
    setState(() {
      _errorMessage = '';
      _successMessage = '';
    });

    if (!_formKey.currentState!.validate()) {
      return;
    }

    final email = _emailController.text.trim();

    setState(() {
      _isLoading = true;
    });

    try {
      await _authService.resetPassword(email);

      setState(() {
        _emailSent = true;
        _successMessage =
            'Password reset email sent to $email. Please check your inbox and spam folder.';
      });
    } catch (e) {
      setState(() {
        String errorMsg = e.toString();
        if (errorMsg.contains('user-not-found')) {
          _errorMessage = 'No account found with this email address.';
        } else if (errorMsg.contains('invalid-email')) {
          _errorMessage = 'Please enter a valid email address.';
        } else if (errorMsg.contains('too-many-requests')) {
          _errorMessage = 'Too many requests. Please try again later.';
        } else {
          _errorMessage = errorMsg.replaceAll('Exception: ', '');
        }
      });
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  void _resetForm() {
    setState(() {
      _emailSent = false;
      _errorMessage = '';
      _successMessage = '';
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Container(
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: FadeTransition(
              opacity: _fadeAnimation,
              child: SlideTransition(
                position: _slideAnimation,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const SizedBox(height: 20),

                    // Back button
                    Align(
                      alignment: Alignment.centerLeft,
                      child: Container(
                        decoration: BoxDecoration(
                          color: Colors.grey.shade100,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: Colors.grey.shade200,
                            width: 1,
                          ),
                        ),
                        child: IconButton(
                          icon: Icon(
                            Icons.arrow_back,
                            color: Colors.grey.shade700,
                          ),
                          onPressed: () => Navigator.of(context).pop(),
                        ),
                      ),
                    ),

                    const SizedBox(height: 40),

                    // Main Card Container - Enhanced for white background
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(32),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: [
                            const Color(0xFF6C63FF).withOpacity(0.05),
                            const Color(0xFF4F46E5).withOpacity(0.02),
                          ],
                        ),
                        borderRadius: BorderRadius.circular(24),
                        border: Border.all(
                          color: const Color(0xFF6C63FF).withOpacity(0.1),
                          width: 1,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: const Color(0xFF6C63FF).withOpacity(0.1),
                            blurRadius: 30,
                            offset: const Offset(0, 15),
                          ),
                        ],
                      ),
                      child: Form(
                        key: _formKey,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            // Icon
                            Container(
                              width: 80,
                              height: 80,
                              decoration: BoxDecoration(
                                gradient: const LinearGradient(
                                  begin: Alignment.topLeft,
                                  end: Alignment.bottomRight,
                                  colors: [
                                    Color(0xFF6C63FF),
                                    Color(0xFF4F46E5),
                                  ],
                                ),
                                borderRadius: BorderRadius.circular(20),
                                boxShadow: [
                                  BoxShadow(
                                    color: const Color(
                                      0xFF6C63FF,
                                    ).withOpacity(0.3),
                                    blurRadius: 20,
                                    offset: const Offset(0, 10),
                                  ),
                                ],
                              ),
                              child: const Icon(
                                Icons.lock_reset,
                                color: Colors.white,
                                size: 40,
                              ),
                            ),

                            const SizedBox(height: 32),

                            if (!_emailSent) ...[
                              // Title
                              ShaderMask(
                                shaderCallback: (bounds) {
                                  return const LinearGradient(
                                    colors: [
                                      Color(0xFF2D2D2D),
                                      Color(0xFF6C63FF),
                                    ],
                                  ).createShader(bounds);
                                },
                                child: const Text(
                                  'Forgot Password?',
                                  style: TextStyle(
                                    fontSize: 28,
                                    fontWeight: FontWeight.w700,
                                    color: Colors.white,
                                    letterSpacing: -0.5,
                                  ),
                                ),
                              ),

                              const SizedBox(height: 12),

                              Text(
                                'Enter your email address and we\'ll send you a link to reset your password',
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                  fontSize: 16,
                                  color: Colors.grey.shade600,
                                  height: 1.4,
                                ),
                              ),

                              const SizedBox(height: 32),

                              // Error Message
                              if (_errorMessage.isNotEmpty)
                                Container(
                                  width: double.infinity,
                                  padding: const EdgeInsets.all(16),
                                  margin: const EdgeInsets.only(bottom: 20),
                                  decoration: BoxDecoration(
                                    color: Colors.red.withOpacity(0.1),
                                    borderRadius: BorderRadius.circular(16),
                                    border: Border.all(
                                      color: Colors.red.withOpacity(0.3),
                                      width: 1,
                                    ),
                                  ),
                                  child: Text(
                                    _errorMessage,
                                    style: const TextStyle(
                                      color: Colors.red,
                                      fontSize: 14,
                                    ),
                                    textAlign: TextAlign.center,
                                  ),
                                ),

                              // Email Field
                              Container(
                                decoration: BoxDecoration(
                                  color: Colors.grey.shade50,
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(
                                    color: Colors.grey.shade200,
                                    width: 1,
                                  ),
                                ),
                                child: TextFormField(
                                  controller: _emailController,
                                  keyboardType: TextInputType.emailAddress,
                                  style: const TextStyle(
                                    color: Colors.black87,
                                    fontSize: 16,
                                  ),
                                  decoration: InputDecoration(
                                    hintText: 'Enter your email',
                                    hintStyle: TextStyle(
                                      color: Colors.grey.shade500,
                                      fontSize: 16,
                                    ),
                                    prefixIcon: Icon(
                                      Icons.email_outlined,
                                      color: Colors.grey.shade600,
                                      size: 20,
                                    ),
                                    border: InputBorder.none,
                                    contentPadding: const EdgeInsets.symmetric(
                                      horizontal: 20,
                                      vertical: 16,
                                    ),
                                  ),
                                  validator: (value) {
                                    if (value == null || value.trim().isEmpty) {
                                      return 'Please enter your email';
                                    }
                                    if (!_isValidEmail(value.trim())) {
                                      return 'Please enter a valid email address';
                                    }
                                    return null;
                                  },
                                ),
                              ),

                              const SizedBox(height: 32),

                              // Reset Password Button
                              SizedBox(
                                width: double.infinity,
                                height: 56,
                                child: ElevatedButton(
                                  onPressed: _isLoading
                                      ? null
                                      : _sendPasswordReset,
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: const Color(0xFF6C63FF),
                                    foregroundColor: Colors.white,
                                    elevation: 0,
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(16),
                                    ),
                                    shadowColor: const Color(
                                      0xFF6C63FF,
                                    ).withOpacity(0.3),
                                  ),
                                  child: _isLoading
                                      ? const SizedBox(
                                          width: 24,
                                          height: 24,
                                          child: CircularProgressIndicator(
                                            strokeWidth: 2,
                                            valueColor:
                                                AlwaysStoppedAnimation<Color>(
                                                  Colors.white,
                                                ),
                                          ),
                                        )
                                      : const Text(
                                          'Send Reset Link',
                                          style: TextStyle(
                                            fontSize: 18,
                                            fontWeight: FontWeight.w600,
                                          ),
                                        ),
                                ),
                              ),
                            ] else ...[
                              // Success state
                              Container(
                                width: 100,
                                height: 100,
                                decoration: BoxDecoration(
                                  color: Colors.green.withOpacity(0.2),
                                  borderRadius: BorderRadius.circular(50),
                                  border: Border.all(
                                    color: Colors.green.withOpacity(0.3),
                                    width: 2,
                                  ),
                                ),
                                child: const Icon(
                                  Icons.mark_email_read,
                                  color: Colors.green,
                                  size: 50,
                                ),
                              ),

                              const SizedBox(height: 24),

                              const Text(
                                'Email Sent!',
                                style: TextStyle(
                                  fontSize: 28,
                                  fontWeight: FontWeight.w700,
                                  color: Color(0xFF2D2D2D),
                                  letterSpacing: -0.5,
                                ),
                              ),

                              const SizedBox(height: 16),

                              Text(
                                _successMessage,
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                  fontSize: 16,
                                  color: Colors.grey.shade600,
                                  height: 1.4,
                                ),
                              ),

                              const SizedBox(height: 32),

                              // Send Another Email Button
                              SizedBox(
                                width: double.infinity,
                                height: 56,
                                child: OutlinedButton(
                                  onPressed: _resetForm,
                                  style: OutlinedButton.styleFrom(
                                    side: BorderSide(
                                      color: Colors.grey.shade300,
                                      width: 1.5,
                                    ),
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(16),
                                    ),
                                    backgroundColor: Colors.grey.shade50,
                                  ),
                                  child: const Text(
                                    'Send Another Email',
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w600,
                                      color: Colors.black87,
                                    ),
                                  ),
                                ),
                              ),
                            ],

                            const SizedBox(height: 24),

                            // Back to Login Link
                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(
                                  'Remember your password? ',
                                  style: TextStyle(
                                    color: Colors.grey.shade600,
                                    fontSize: 16,
                                  ),
                                ),
                                GestureDetector(
                                  onTap: () {
                                    Navigator.pushReplacement(
                                      context,
                                      MaterialPageRoute(
                                        builder: (context) => const LoginPage(),
                                      ),
                                    );
                                  },
                                  child: const Text(
                                    'Sign In',
                                    style: TextStyle(
                                      color: Color(0xFF6C63FF),
                                      fontSize: 16,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ),
                              ],
                            ),
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
      ),
    );
  }

  @override
  void dispose() {
    _fadeController.dispose();
    _slideController.dispose();
    _emailController.dispose();
    super.dispose();
  }
}
