import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'dart:async';
import 'auth_wrapper.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with TickerProviderStateMixin {
  late AnimationController _fadeController;
  late AnimationController _scaleController;
  late AnimationController _pulseController;
  late AnimationController _illustrationController;
  late AnimationController _dotsController;

  late Animation<double> _fadeAnimation;
  late Animation<double> _scaleAnimation;
  late Animation<double> _pulseAnimation;
  late Animation<double> _illustrationAnimation;

  @override
  void initState() {
    super.initState();

    SystemChrome.setSystemUIOverlayStyle(
      const SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: Brightness.dark,
      ),
    );

    _fadeController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    );
    _scaleController = AnimationController(
      duration: const Duration(milliseconds: 1200),
      vsync: this,
    );
    _pulseController = AnimationController(
      duration: const Duration(milliseconds: 2000),
      vsync: this,
    );
    _illustrationController = AnimationController(
      duration: const Duration(milliseconds: 2500),
      vsync: this,
    );

    _dotsController = AnimationController(
      duration: const Duration(milliseconds: 1200),
      vsync: this,
    )..repeat();

    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _fadeController, curve: Curves.easeInOut),
    );
    _scaleAnimation = Tween<double>(begin: 0.5, end: 1.0).animate(
      CurvedAnimation(parent: _scaleController, curve: Curves.elasticOut),
    );
    _pulseAnimation = Tween<double>(begin: 1.0, end: 1.1).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );
    _illustrationAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _illustrationController, curve: Curves.easeInOut),
    );

    _startAnimations();

    Timer(const Duration(milliseconds: 3500), () {
      _navigateToApp();
    });
  }

  void _startAnimations() async {
    _fadeController.forward();
    await Future.delayed(const Duration(milliseconds: 300));
    _scaleController.forward();
    await Future.delayed(const Duration(milliseconds: 500));
    _pulseController.repeat(reverse: true);
    await Future.delayed(const Duration(milliseconds: 800));
    _illustrationController.forward();
  }

  void _navigateToApp() {
    Navigator.of(context).pushReplacement(
      PageRouteBuilder(
        pageBuilder: (context, animation, secondaryAnimation) =>
            const AuthWrapper(),
        transitionDuration: const Duration(milliseconds: 500),
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          return FadeTransition(opacity: animation, child: child);
        },
      ),
    );
  }

  @override
  void dispose() {
    _fadeController.dispose();
    _scaleController.dispose();
    _pulseController.dispose();
    _illustrationController.dispose();
    _dotsController.dispose();
    super.dispose();
  }

  Widget _buildDot(int index) {
    return AnimatedBuilder(
      animation: _dotsController,
      builder: (context, child) {
        double value = (_dotsController.value * 3 - index).clamp(0.0, 1.0);
        double offsetY = -8 * (1 - (value - 0.5).abs() * 2); // bounce effect
        return Transform.translate(offset: Offset(0, offsetY), child: child);
      },
      child: Container(
        margin: EdgeInsets.symmetric(horizontal: 6.w),
        width: 12.w,
        height: 12.h,
        decoration: const BoxDecoration(
          color: Color(0xFF667EEA),
          shape: BoxShape.circle,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Stack(
        children: [
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [Colors.white, Color(0xFFF8F9FF), Color(0xFFF5F7FF)],
              ),
            ),
          ),
          Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // App Logo
                FadeTransition(
                  opacity: _fadeAnimation,
                  child: ScaleTransition(
                    scale: _scaleAnimation,
                    child: AnimatedBuilder(
                      animation: _pulseAnimation,
                      builder: (context, child) {
                        return Transform.scale(
                          scale: _pulseAnimation.value,
                          child: Image.asset(
                            'assets/splash.png',
                            width: 220.w,
                            height: 220.h,
                            fit: BoxFit.contain,
                          ),
                        );
                      },
                    ),
                  ),
                ),

                SizedBox(height: 40.h),

                // App Name + Tagline grouped
                FadeTransition(
                  opacity: _fadeAnimation,
                  child: Transform.scale(
                    scale: _scaleAnimation.value,
                    child: Column(
                      children: [
                        ShaderMask(
                          shaderCallback: (bounds) => const LinearGradient(
                            begin: Alignment.centerLeft,
                            end: Alignment.centerRight,
                            colors: [Color(0xFF667EEA), Color(0xFF764BA2)],
                          ).createShader(bounds),
                          blendMode: BlendMode.srcIn,
                          child: const Text(
                            'Dr.Swatantra AI',
                            textAlign: TextAlign.center,
                            softWrap: false,
                            overflow: TextOverflow.visible,
                            style: TextStyle(
                              fontSize: 56,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                              letterSpacing: 2.0,
                              fontFamily: 'Roboto',
                            ),
                          ),
                        ),
                        SizedBox(height: 15.h),
                        Text(
                          'One Humanity, One Shared Destiny',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 26.sp,
                            color: const Color(0xFF667EEA),
                            letterSpacing: 1.3,
                            fontWeight: FontWeight.w600,
                            height: 1.4,
                          ),
                        ),
                        Container(
                          margin: EdgeInsets.only(top: 12.h),
                          height: 3.h,
                          width: 140.w,
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(
                              colors: [Color(0xFF667EEA), Color(0xFF764BA2)],
                            ),
                            borderRadius: BorderRadius.circular(2.r),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

                SizedBox(height: 70.h),

                // Three Dots Loading
                FadeTransition(
                  opacity: _fadeAnimation,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [_buildDot(0), _buildDot(1), _buildDot(2)],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
