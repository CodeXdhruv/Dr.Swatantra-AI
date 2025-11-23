// import 'package:flutter/material.dart';
// import '../../services/auth_service.dart';
// import '../../main_navigation.dart';
// import 'signup_page.dart';
// import 'forgot_password_page.dart';
// import 'google_user_details_page.dart';

// class LoginPage extends StatefulWidget {
//   const LoginPage({super.key});

//   @override
//   State<LoginPage> createState() => _LoginPageState();
// }

// class _LoginPageState extends State<LoginPage> with TickerProviderStateMixin {
//   final TextEditingController _emailController = TextEditingController();
//   final TextEditingController _passwordController = TextEditingController();
//   final AuthService _authService = AuthService();

//   bool _isLoading = false;
//   bool _obscurePassword = true;
//   String _errorMessage = '';

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

//   Future<void> _signInWithEmail() async {
//     if (_emailController.text.trim().isEmpty ||
//         _passwordController.text.isEmpty) {
//       setState(() => _errorMessage = 'Please enter both email and password');
//       return;
//     }

//     setState(() {
//       _isLoading = true;
//       _errorMessage = '';
//     });

//     try {
//       final result = await _authService.signInWithEmailPassword(
//         _emailController.text.trim(),
//         _passwordController.text,
//       );

//       if (result != null || _authService.isLoggedIn) {
//         print("✅ Sign-in successful!");

//         if (mounted) {
//           await Future.delayed(const Duration(milliseconds: 100));
//           Navigator.pushReplacement(
//             context,
//             MaterialPageRoute(builder: (context) => const MainNavigation()),
//           );
//         }
//       }
//     } catch (e) {
//       setState(() {
//         _errorMessage = e.toString().replaceAll('Exception: ', '');
//       });
//     } finally {
//       if (mounted) {
//         setState(() => _isLoading = false);
//       }
//     }
//   }

//   Future<void> _signInWithGoogle() async {
//     setState(() {
//       _isLoading = true;
//       _errorMessage = '';
//     });

//     try {
//       final result = await _authService.signInWithGoogleEnhanced();
//       if (result != null) {
//         print("✅ Google sign-in successful!");

//         if (mounted) {
//           await Future.delayed(const Duration(milliseconds: 100));

//           if (result['isNewUser'] == true) {
//             Navigator.pushReplacement(
//               context,
//               MaterialPageRoute(
//                 builder: (context) =>
//                     GoogleUserDetailsPage(user: result['user']),
//               ),
//             );
//           } else {
//             Navigator.pushReplacement(
//               context,
//               MaterialPageRoute(builder: (context) => const MainNavigation()),
//             );
//           }
//         }
//       }
//     } catch (e) {
//       setState(() {
//         _errorMessage = e.toString().replaceAll('Exception: ', '');
//       });
//     } finally {
//       if (mounted) {
//         setState(() => _isLoading = false);
//       }
//     }
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
//                       child: Column(
//                         crossAxisAlignment: CrossAxisAlignment.center,
//                         children: [
//                           // App Logo/Icon
//                           Container(
//                             width: 80,
//                             height: 80,
//                             decoration: BoxDecoration(
//                               gradient: const LinearGradient(
//                                 begin: Alignment.topLeft,
//                                 end: Alignment.bottomRight,
//                                 colors: [
//                                   Color(0xFF6C63FF),
//                                   Color(0xFF4F46E5),
//                                 ],
//                               ),
//                               borderRadius: BorderRadius.circular(20),
//                               boxShadow: [
//                                 BoxShadow(
//                                   color: const Color(0xFF6C63FF).withOpacity(0.3),
//                                   blurRadius: 20,
//                                   offset: const Offset(0, 10),
//                                 ),
//                               ],
//                             ),
//                             child: const Icon(
//                               Icons.eco,
//                               color: Colors.white,
//                               size: 40,
//                             ),
//                           ),

//                           const SizedBox(height: 32),

//                           // Welcome Text
//                           ShaderMask(
//                             shaderCallback: (bounds) {
//                               return const LinearGradient(
//                                 colors: [
//                                   Colors.white,
//                                   Color(0xFF6C63FF),
//                                 ],
//                               ).createShader(bounds);
//                             },
//                             child: const Text(
//                               'Welcome Back!',
//                               style: TextStyle(
//                                 fontSize: 32,
//                                 fontWeight: FontWeight.w700,
//                                 color: Colors.white,
//                                 letterSpacing: -0.5,
//                               ),
//                             ),
//                           ),

//                           const SizedBox(height: 12),

//                           Text(
//                             'Sign in to continue your wellness journey',
//                             textAlign: TextAlign.center,
//                             style: TextStyle(
//                               fontSize: 16,
//                               color: Colors.white.withOpacity(0.7),
//                               letterSpacing: 0.3,
//                             ),
//                           ),

//                           const SizedBox(height: 32),

//                           // Error Message
//                           if (_errorMessage.isNotEmpty)
//                             Container(
//                               width: double.infinity,
//                               padding: const EdgeInsets.all(16),
//                               margin: const EdgeInsets.only(bottom: 20),
//                               decoration: BoxDecoration(
//                                 color: Colors.red.withOpacity(0.1),
//                                 borderRadius: BorderRadius.circular(16),
//                                 border: Border.all(
//                                   color: Colors.red.withOpacity(0.3),
//                                   width: 1,
//                                 ),
//                               ),
//                               child: Text(
//                                 _errorMessage,
//                                 style: const TextStyle(
//                                   color: Colors.red,
//                                   fontSize: 14,
//                                 ),
//                                 textAlign: TextAlign.center,
//                               ),
//                             ),

//                           // Email Field
//                           Container(
//                             decoration: BoxDecoration(
//                               color: Colors.white.withOpacity(0.1),
//                               borderRadius: BorderRadius.circular(16),
//                               border: Border.all(
//                                 color: Colors.white.withOpacity(0.2),
//                                 width: 1,
//                               ),
//                             ),
//                             child: TextField(
//                               controller: _emailController,
//                               keyboardType: TextInputType.emailAddress,
//                               style: const TextStyle(
//                                 color: Colors.white,
//                                 fontSize: 16,
//                               ),
//                               decoration: InputDecoration(
//                                 hintText: 'Email',
//                                 hintStyle: TextStyle(
//                                   color: Colors.white.withOpacity(0.5),
//                                   fontSize: 16,
//                                 ),
//                                 prefixIcon: Icon(
//                                   Icons.email_outlined,
//                                   color: Colors.white.withOpacity(0.7),
//                                   size: 20,
//                                 ),
//                                 border: InputBorder.none,
//                                 contentPadding: const EdgeInsets.symmetric(
//                                   horizontal: 20,
//                                   vertical: 16,
//                                 ),
//                               ),
//                             ),
//                           ),

//                           const SizedBox(height: 16),

//                           // Password Field
//                           Container(
//                             decoration: BoxDecoration(
//                               color: Colors.white.withOpacity(0.1),
//                               borderRadius: BorderRadius.circular(16),
//                               border: Border.all(
//                                 color: Colors.white.withOpacity(0.2),
//                                 width: 1,
//                               ),
//                             ),
//                             child: TextField(
//                               controller: _passwordController,
//                               obscureText: _obscurePassword,
//                               style: const TextStyle(
//                                 color: Colors.white,
//                                 fontSize: 16,
//                               ),
//                               decoration: InputDecoration(
//                                 hintText: 'Password',
//                                 hintStyle: TextStyle(
//                                   color: Colors.white.withOpacity(0.5),
//                                   fontSize: 16,
//                                 ),
//                                 prefixIcon: Icon(
//                                   Icons.lock_outlined,
//                                   color: Colors.white.withOpacity(0.7),
//                                   size: 20,
//                                 ),
//                                 suffixIcon: IconButton(
//                                   onPressed: () {
//                                     setState(() {
//                                       _obscurePassword = !_obscurePassword;
//                                     });
//                                   },
//                                   icon: Icon(
//                                     _obscurePassword
//                                         ? Icons.visibility_outlined
//                                         : Icons.visibility_off_outlined,
//                                     color: Colors.white.withOpacity(0.7),
//                                     size: 20,
//                                   ),
//                                 ),
//                                 border: InputBorder.none,
//                                 contentPadding: const EdgeInsets.symmetric(
//                                   horizontal: 20,
//                                   vertical: 16,
//                                 ),
//                               ),
//                             ),
//                           ),

//                           const SizedBox(height: 16),

//                           // Forgot Password
//                           Align(
//                             alignment: Alignment.centerRight,
//                             child: TextButton(
//                               onPressed: () {
//                                 Navigator.push(
//                                   context,
//                                   MaterialPageRoute(
//                                     builder: (context) => const ForgotPasswordPage(),
//                                   ),
//                                 );
//                               },
//                               child: Text(
//                                 'Forgot Password?',
//                                 style: TextStyle(
//                                   color: const Color(0xFF6C63FF).withOpacity(0.8),
//                                   fontSize: 14,
//                                   fontWeight: FontWeight.w500,
//                                 ),
//                               ),
//                             ),
//                           ),

//                           const SizedBox(height: 24),

//                           // Sign In Button
//                           SizedBox(
//                             width: double.infinity,
//                             height: 56,
//                             child: ElevatedButton(
//                               onPressed: _isLoading ? null : _signInWithEmail,
//                               style: ElevatedButton.styleFrom(
//                                 backgroundColor: const Color(0xFF6C63FF),
//                                 foregroundColor: Colors.white,
//                                 elevation: 0,
//                                 shape: RoundedRectangleBorder(
//                                   borderRadius: BorderRadius.circular(16),
//                                 ),
//                                 shadowColor: const Color(0xFF6C63FF).withOpacity(0.3),
//                               ),
//                               child: _isLoading
//                                   ? const SizedBox(
//                                       width: 24,
//                                       height: 24,
//                                       child: CircularProgressIndicator(
//                                         strokeWidth: 2,
//                                         valueColor: AlwaysStoppedAnimation<Color>(
//                                           Colors.white,
//                                         ),
//                                       ),
//                                     )
//                                   : const Text(
//                                       'Sign In',
//                                       style: TextStyle(
//                                         fontSize: 18,
//                                         fontWeight: FontWeight.w600,
//                                       ),
//                                     ),
//                             ),
//                           ),

//                           const SizedBox(height: 24),

//                           // OR Divider
//                           Row(
//                             children: [
//                               Expanded(
//                                 child: Container(
//                                   height: 1,
//                                   color: Colors.white.withOpacity(0.2),
//                                 ),
//                               ),
//                               Padding(
//                                 padding: const EdgeInsets.symmetric(horizontal: 16),
//                                 child: Text(
//                                   'OR',
//                                   style: TextStyle(
//                                     color: Colors.white.withOpacity(0.5),
//                                     fontSize: 14,
//                                     fontWeight: FontWeight.w500,
//                                   ),
//                                 ),
//                               ),
//                               Expanded(
//                                 child: Container(
//                                   height: 1,
//                                   color: Colors.white.withOpacity(0.2),
//                                 ),
//                               ),
//                             ],
//                           ),

//                           const SizedBox(height: 24),

//                           // Google Sign In Button
//                           SizedBox(
//                             width: double.infinity,
//                             height: 56,
//                             child: OutlinedButton(
//                               onPressed: _isLoading ? null : _signInWithGoogle,
//                               style: OutlinedButton.styleFrom(
//                                 side: BorderSide(
//                                   color: Colors.white.withOpacity(0.2),
//                                   width: 1.5,
//                                 ),
//                                 shape: RoundedRectangleBorder(
//                                   borderRadius: BorderRadius.circular(16),
//                                 ),
//                                 backgroundColor: Colors.white.withOpacity(0.05),
//                               ),
//                               child: Row(
//                                 mainAxisAlignment: MainAxisAlignment.center,
//                                 children: [
//                                   Container(
//                                     width: 24,
//                                     height: 24,
//                                     decoration: BoxDecoration(
//                                       color: Colors.white,
//                                       borderRadius: BorderRadius.circular(4),
//                                     ),
//                                     child: const Icon(
//                                       Icons.g_mobiledata,
//                                       color: Color(0xFF4285F4),
//                                       size: 20,
//                                     ),
//                                   ),
//                                   const SizedBox(width: 12),
//                                   const Text(
//                                     'Continue with Google',
//                                     style: TextStyle(
//                                       fontSize: 16,
//                                       fontWeight: FontWeight.w600,
//                                       color: Colors.white,
//                                     ),
//                                   ),
//                                 ],
//                               ),
//                             ),
//                           ),

//                           const SizedBox(height: 32),

//                           // Sign Up Link
//                           Row(
//                             mainAxisAlignment: MainAxisAlignment.center,
//                             children: [
//                               Text(
//                                 'Don\'t have an account? ',
//                                 style: TextStyle(
//                                   color: Colors.white.withOpacity(0.7),
//                                   fontSize: 16,
//                                 ),
//                               ),
//                               GestureDetector(
//                                 onTap: () {
//                                   Navigator.pushReplacement(
//                                     context,
//                                     MaterialPageRoute(
//                                       builder: (context) => const SignupPage(),
//                                     ),
//                                   );
//                                 },
//                                 child: const Text(
//                                   'Sign Up',
//                                   style: TextStyle(
//                                     color: Color(0xFF6C63FF),
//                                     fontSize: 16,
//                                     fontWeight: FontWeight.w600,
//                                   ),
//                                 ),
//                               ),
//                             ],
//                           ),
//                         ],
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
//     _passwordController.dispose();
//     super.dispose();
//   }
// }
import 'package:flutter/material.dart';
import '../../services/auth_service.dart';
import '../../main_navigation.dart';
import 'signup_page.dart';
import 'forgot_password_page.dart';
import 'google_user_details_page.dart';
import '../../utils/logger.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> with TickerProviderStateMixin {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final AuthService _authService = AuthService();

  bool _isLoading = false;
  bool _obscurePassword = true;
  String _errorMessage = '';

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

  Future<void> _signInWithEmail() async {
    if (_emailController.text.trim().isEmpty ||
        _passwordController.text.isEmpty) {
      setState(() => _errorMessage = 'Please enter both email and password');
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = '';
    });

    try {
      final result = await _authService.signInWithEmailPassword(
        _emailController.text.trim(),
        _passwordController.text,
      );

      if (result != null || _authService.isLoggedIn) {
        Logger.success("Sign-in successful!");

        if (mounted) {
          await Future.delayed(const Duration(milliseconds: 100));
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (context) => const MainNavigation()),
          );
        }
      }
    } catch (e) {
      setState(() {
        _errorMessage = e.toString().replaceAll('Exception: ', '');
      });
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  Future<void> _signInWithGoogle() async {
    setState(() {
      _isLoading = true;
      _errorMessage = '';
    });

    try {
      final result = await _authService.signInWithGoogleEnhanced();
      if (result != null) {
        Logger.success("Google sign-in successful!");

        if (mounted) {
          await Future.delayed(const Duration(milliseconds: 100));

          if (result['isNewUser'] == true) {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(
                builder: (context) =>
                    GoogleUserDetailsPage(user: result['user']),
              ),
            );
          } else {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (context) => const MainNavigation()),
            );
          }
        }
      }
    } catch (e) {
      setState(() {
        _errorMessage = e.toString().replaceAll('Exception: ', '');
      });
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
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
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          // App Logo/Icon
                          Container(
                            width: 80,
                            height: 80,
                            decoration: BoxDecoration(
                              gradient: const LinearGradient(
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                                colors: [Color(0xFF6C63FF), Color(0xFF4F46E5)],
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
                              Icons.eco,
                              color: Colors.white,
                              size: 40,
                            ),
                          ),

                          const SizedBox(height: 32),

                          // Welcome Text
                          ShaderMask(
                            shaderCallback: (bounds) {
                              return const LinearGradient(
                                colors: [Color(0xFF2D2D2D), Color(0xFF6C63FF)],
                              ).createShader(bounds);
                            },
                            child: const Text(
                              'Welcome Back!',
                              style: TextStyle(
                                fontSize: 32,
                                fontWeight: FontWeight.w700,
                                color: Colors.white,
                                letterSpacing: -0.5,
                              ),
                            ),
                          ),

                          const SizedBox(height: 12),

                          Text(
                            'Sign in to continue your wellness journey',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontSize: 16,
                              color: Colors.grey.shade600,
                              letterSpacing: 0.3,
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
                            child: TextField(
                              controller: _emailController,
                              keyboardType: TextInputType.emailAddress,
                              style: const TextStyle(
                                color: Colors.black87,
                                fontSize: 16,
                              ),
                              decoration: InputDecoration(
                                hintText: 'Email',
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
                            ),
                          ),

                          const SizedBox(height: 16),

                          // Password Field
                          Container(
                            decoration: BoxDecoration(
                              color: Colors.grey.shade50,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(
                                color: Colors.grey.shade200,
                                width: 1,
                              ),
                            ),
                            child: TextField(
                              controller: _passwordController,
                              obscureText: _obscurePassword,
                              style: const TextStyle(
                                color: Colors.black87,
                                fontSize: 16,
                              ),
                              decoration: InputDecoration(
                                hintText: 'Password',
                                hintStyle: TextStyle(
                                  color: Colors.grey.shade500,
                                  fontSize: 16,
                                ),
                                prefixIcon: Icon(
                                  Icons.lock_outlined,
                                  color: Colors.grey.shade600,
                                  size: 20,
                                ),
                                suffixIcon: IconButton(
                                  onPressed: () {
                                    setState(() {
                                      _obscurePassword = !_obscurePassword;
                                    });
                                  },
                                  icon: Icon(
                                    _obscurePassword
                                        ? Icons.visibility_outlined
                                        : Icons.visibility_off_outlined,
                                    color: Colors.grey.shade600,
                                    size: 20,
                                  ),
                                ),
                                border: InputBorder.none,
                                contentPadding: const EdgeInsets.symmetric(
                                  horizontal: 20,
                                  vertical: 16,
                                ),
                              ),
                            ),
                          ),

                          const SizedBox(height: 16),

                          // Forgot Password
                          Align(
                            alignment: Alignment.centerRight,
                            child: TextButton(
                              onPressed: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (context) =>
                                        const ForgotPasswordPage(),
                                  ),
                                );
                              },
                              child: const Text(
                                'Forgot Password?',
                                style: TextStyle(
                                  color: Color(0xFF6C63FF),
                                  fontSize: 14,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ),
                          ),

                          const SizedBox(height: 24),

                          // Sign In Button
                          SizedBox(
                            width: double.infinity,
                            height: 56,
                            child: ElevatedButton(
                              onPressed: _isLoading ? null : _signInWithEmail,
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
                                      'Sign In',
                                      style: TextStyle(
                                        fontSize: 18,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                            ),
                          ),

                          const SizedBox(height: 24),

                          // OR Divider
                          Row(
                            children: [
                              Expanded(
                                child: Container(
                                  height: 1,
                                  color: Colors.grey.shade300,
                                ),
                              ),
                              Padding(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 16,
                                ),
                                child: Text(
                                  'OR',
                                  style: TextStyle(
                                    color: Colors.grey.shade500,
                                    fontSize: 14,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ),
                              Expanded(
                                child: Container(
                                  height: 1,
                                  color: Colors.grey.shade300,
                                ),
                              ),
                            ],
                          ),

                          const SizedBox(height: 24),

                          // Google Sign In Button
                          SizedBox(
                            width: double.infinity,
                            height: 56,
                            child: OutlinedButton(
                              onPressed: _isLoading ? null : _signInWithGoogle,
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
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Container(
                                    width: 24,
                                    height: 24,
                                    decoration: BoxDecoration(
                                      color: Colors.white,
                                      borderRadius: BorderRadius.circular(4),
                                    ),
                                    child: const Icon(
                                      Icons.g_mobiledata,
                                      color: Color(0xFF4285F4),
                                      size: 20,
                                    ),
                                  ),
                                  const SizedBox(width: 12),
                                  const Text(
                                    'Continue with Google',
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w600,
                                      color: Colors.black87,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),

                          const SizedBox(height: 32),

                          // Sign Up Link
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                'Don\'t have an account? ',
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
                                      builder: (context) => const SignupPage(),
                                    ),
                                  );
                                },
                                child: const Text(
                                  'Sign Up',
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
    _passwordController.dispose();
    super.dispose();
  }
}
