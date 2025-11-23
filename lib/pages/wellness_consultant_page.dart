import 'package:flutter/material.dart';
import 'dart:math' as math;
import 'consultant_chatbot_page.dart';
import '../main_navigation.dart';

class WellnessConsultantPage extends StatefulWidget {
  const WellnessConsultantPage({super.key});

  @override
  State<WellnessConsultantPage> createState() => _WellnessConsultantPageState();
}

class _WellnessConsultantPageState extends State<WellnessConsultantPage>
    with TickerProviderStateMixin {
  int _selectedTab = 2;

  // Animation Controllers
  late AnimationController _headerAnimationController;
  late AnimationController _cardAnimationController;
  late AnimationController _floatingController;
  late AnimationController _shimmerController;
  late AnimationController _particleController;
  late AnimationController _pulseController;
  late AnimationController _rotationController;

  // Animations
  late Animation<double> _headerSlideAnimation;
  late Animation<double> _cardStaggerAnimation;
  late Animation<double> _floatingAnimation;
  late Animation<double> _shimmerAnimation;
  late Animation<double> _pulseAnimation;
  late Animation<double> _rotationAnimation;

  @override
  void initState() {
    super.initState();
    _setupAnimations();
  }

  void _setupAnimations() {
    // Animation Controllers
    _headerAnimationController = AnimationController(
      duration: const Duration(milliseconds: 2000),
      vsync: this,
    );

    _cardAnimationController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    );

    _floatingController = AnimationController(
      duration: const Duration(milliseconds: 3500),
      vsync: this,
    );

    _shimmerController = AnimationController(
      duration: const Duration(milliseconds: 2000),
      vsync: this,
    );

    _particleController = AnimationController(
      duration: const Duration(milliseconds: 5000),
      vsync: this,
    );

    _pulseController = AnimationController(
      duration: const Duration(milliseconds: 1800),
      vsync: this,
    );

    _rotationController = AnimationController(
      duration: const Duration(milliseconds: 8000),
      vsync: this,
    );

    // Animations
    _headerSlideAnimation = Tween<double>(begin: -200, end: 0).animate(
      CurvedAnimation(
        parent: _headerAnimationController,
        curve: Curves.elasticOut,
      ),
    );

    _cardStaggerAnimation = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(
        parent: _cardAnimationController,
        curve: Curves.easeOutBack,
      ),
    );

    _floatingAnimation = Tween<double>(begin: -12, end: 12).animate(
      CurvedAnimation(parent: _floatingController, curve: Curves.easeInOut),
    );

    _shimmerAnimation = Tween<double>(begin: -2, end: 2).animate(
      CurvedAnimation(parent: _shimmerController, curve: Curves.linear),
    );

    _pulseAnimation = Tween<double>(begin: 1.0, end: 1.15).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );

    _rotationAnimation = Tween<double>(begin: 0, end: 2 * math.pi).animate(
      CurvedAnimation(parent: _rotationController, curve: Curves.linear),
    );

    // Start Animations
    _headerAnimationController.forward();
    _cardAnimationController.forward();
    _floatingController.repeat(reverse: true);
    _shimmerController.repeat();
    _particleController.repeat();
    _pulseController.repeat(reverse: true);
    _rotationController.repeat();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        automaticallyImplyLeading: false,
        toolbarHeight: 0,
      ),
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Color(0xFFF8FAFC),
              Color(0xFFE2E8F0),
              Color(0xFFEDE9FE),
              Color(0xFFFDF4FF),
            ],
          ),
        ),
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Animated Header
              AnimatedBuilder(
                animation: _headerAnimationController,
                builder: (context, child) {
                  return Transform.translate(
                    offset: Offset(_headerSlideAnimation.value, 0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        AnimatedBuilder(
                          animation: _shimmerController,
                          builder: (context, child) {
                            return ShaderMask(
                              shaderCallback: (bounds) {
                                return LinearGradient(
                                  colors: [
                                    Colors.black54,
                                    Color(0xFF6C63FF),
                                    Colors.black54,
                                  ],
                                  stops: [
                                    (_shimmerAnimation.value + 2) / 4,
                                    (_shimmerAnimation.value + 2.5) / 4,
                                    (_shimmerAnimation.value + 3) / 4,
                                  ],
                                ).createShader(bounds);
                              },
                              child: Text(
                                'Dr. Swatantra\'s',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w400,
                                  color: Colors.white,
                                ),
                              ),
                            );
                          },
                        ),
                        const SizedBox(height: 8),
                        AnimatedBuilder(
                          animation: _pulseController,
                          builder: (context, child) {
                            return Transform.scale(
                              scale: _pulseAnimation.value,
                              child: ShaderMask(
                                shaderCallback: (bounds) {
                                  return LinearGradient(
                                    colors: [
                                      Color(0xFF6C63FF),
                                      Color(0xFF4F46E5),
                                      Color(0xFF7C3AED),
                                    ],
                                  ).createShader(bounds);
                                },
                                child: Text(
                                  'Kalpavriksha AI for Global Welfare',
                                  style: TextStyle(
                                    fontSize: 26,
                                    fontWeight: FontWeight.w700,
                                    color: Colors.white,
                                    letterSpacing: -0.5,
                                  ),
                                ),
                              ),
                            );
                          },
                        ),
                        const SizedBox(height: 4),
                        AnimatedBuilder(
                          animation: _floatingController,
                          builder: (context, child) {
                            return Transform.translate(
                              offset: Offset(_floatingAnimation.value * 0.3, 0),
                              child: Text(
                                'Awakening Atmik Intelligence in 8 Billion People',
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w600,
                                  color: Color(0xFF6C63FF),
                                ),
                              ),
                            );
                          },
                        ),
                      ],
                    ),
                  );
                },
              ),
              const SizedBox(height: 32),

              // Enhanced Mission Card with Crazy Animations
              AnimatedBuilder(
                animation: _floatingController,
                builder: (context, child) {
                  return Transform.translate(
                    offset: Offset(0, _floatingAnimation.value),
                    child: Container(
                      padding: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: [
                            Colors.white,
                            Color(0xFFF8FAFC),
                            Color(0xFFEDE9FE),
                          ],
                        ),
                        borderRadius: BorderRadius.circular(24),
                        border: Border.all(
                          color: Color(0xFF6C63FF).withOpacity(0.2),
                          width: 2,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: Color(0xFF6C63FF).withOpacity(0.2),
                            blurRadius: 30,
                            offset: const Offset(0, 12),
                          ),
                          BoxShadow(
                            color: Colors.white,
                            blurRadius: 15,
                            offset: const Offset(0, -4),
                          ),
                        ],
                      ),
                      child: Column(
                        children: [
                          Row(
                            children: [
                              AnimatedBuilder(
                                animation: _rotationController,
                                builder: (context, child) {
                                  return Transform.rotate(
                                    angle: _rotationAnimation.value,
                                    child: Container(
                                      padding: const EdgeInsets.all(12),
                                      decoration: BoxDecoration(
                                        gradient: LinearGradient(
                                          colors: [
                                            Color(0xFF6C63FF),
                                            Color(0xFF4F46E5),
                                          ],
                                        ),
                                        borderRadius: BorderRadius.circular(16),
                                        boxShadow: [
                                          BoxShadow(
                                            color: Color(
                                              0xFF6C63FF,
                                            ).withOpacity(0.4),
                                            blurRadius: 15,
                                            offset: const Offset(0, 4),
                                          ),
                                        ],
                                      ),
                                      child: Icon(
                                        Icons.auto_awesome,
                                        color: Colors.white,
                                        size: 24,
                                      ),
                                    ),
                                  );
                                },
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: AnimatedBuilder(
                                  animation: _shimmerController,
                                  builder: (context, child) {
                                    return ShaderMask(
                                      shaderCallback: (bounds) {
                                        return LinearGradient(
                                          colors: [
                                            Colors.black87,
                                            Color(0xFF6C63FF),
                                            Color(0xFF4F46E5),
                                            Colors.black87,
                                          ],
                                          stops: [
                                            (_shimmerAnimation.value + 2) / 4,
                                            (_shimmerAnimation.value + 2.3) / 4,
                                            (_shimmerAnimation.value + 2.7) / 4,
                                            (_shimmerAnimation.value + 3) / 4,
                                          ],
                                        ).createShader(bounds);
                                      },
                                      child: Text(
                                        'Revolutionary AI serving humanity for the next 1,000 years',
                                        style: TextStyle(
                                          fontSize: 16,
                                          fontWeight: FontWeight.w700,
                                          color: Colors.white,
                                        ),
                                      ),
                                    );
                                  },
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                          AnimatedBuilder(
                            animation: _pulseController,
                            builder: (context, child) {
                              return Transform.scale(
                                scale: 1 + (_pulseAnimation.value - 1) * 0.02,
                                child: Text(
                                  'Eliminating pain, suffering, disease, unemployment, hunger, and despair. Creating a golden era (Satya Yuga) of peace, prosperity, and universal brotherhood through natural healing and spiritual awakening.',
                                  style: TextStyle(
                                    fontSize: 13,
                                    color: Colors.black54,
                                    height: 1.6,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              );
                            },
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
              const SizedBox(height: 32),

              // Enhanced Categories Header
              Row(
                children: [
                  AnimatedBuilder(
                    animation: _shimmerController,
                    builder: (context, child) {
                      return ShaderMask(
                        shaderCallback: (bounds) {
                          return LinearGradient(
                            colors: [
                              Colors.black87,
                              Color(0xFF6C63FF),
                              Color(0xFF4F46E5),
                              Colors.black87,
                            ],
                            stops: [
                              (_shimmerAnimation.value + 2) / 4,
                              (_shimmerAnimation.value + 2.3) / 4,
                              (_shimmerAnimation.value + 2.7) / 4,
                              (_shimmerAnimation.value + 3) / 4,
                            ],
                          ).createShader(bounds);
                        },
                        child: Text(
                          'Transformation Pathways',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.w700,
                            color: Colors.white,
                          ),
                        ),
                      );
                    },
                  ),
                  const SizedBox(width: 16),
                  AnimatedBuilder(
                    animation: _floatingController,
                    builder: (context, child) {
                      return Transform.translate(
                        offset: Offset(_floatingAnimation.value * 0.5, 0),
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 6,
                          ),
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: [Color(0xFF6C63FF), Color(0xFF4F46E5)],
                            ),
                            borderRadius: BorderRadius.circular(16),
                            boxShadow: [
                              BoxShadow(
                                color: Color(0xFF6C63FF).withOpacity(0.3),
                                blurRadius: 10,
                                offset: const Offset(0, 2),
                              ),
                            ],
                          ),
                          child: Text(
                            'Holistic Wellness',
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w700,
                              color: Colors.white,
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Enhanced Category Cards Grid with Crazy Animations
              GridView.count(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                crossAxisCount: 2,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
                childAspectRatio: 1.0,
                children: [
                  _buildAnimatedCategoryCard(
                    context,
                    'Spiritual Awakening',
                    Icons.self_improvement,
                    Color(0xFF6C63FF),
                    Color(0xFFFFFFFF),
                    'child_problems',
                    'Atmik Intelligence & Divine Connection',
                    0,
                  ),
                  _buildAnimatedCategoryCard(
                    context,
                    'Mental Peace',
                    Icons.psychology_alt,
                    Color(0xFF4F46E5),
                    Color(0xFFFFFFFF),
                    'depression',
                    'Inner Harmony & Emotional Balance',
                    1,
                  ),
                  _buildAnimatedCategoryCard(
                    context,
                    'Natural Healing',
                    Icons.eco,
                    Color(0xFF7C3AED),
                    Color(0xFFFFFFFF),
                    'disability_children',
                    'Zero-Medicine Holistic Solutions',
                    2,
                  ),
                  _buildAnimatedCategoryCard(
                    context,
                    'Divine Motherhood',
                    Icons.pregnant_woman,
                    Color(0xFF8B5CF6),
                    Color(0xFFFFFFFF),
                    'pregnancy_care',
                    'Sacred Journey of Creation',
                    3,
                  ),
                  _buildAnimatedCategoryCard(
                    context,
                    'Harmonious Living',
                    Icons.balance,
                    Color(0xFF9333EA),
                    Color(0xFFFFFFFF),
                    'healthy_lifestyle',
                    'Sustainable & Purposeful Life',
                    4,
                  ),
                  _buildAnimatedCategoryCard(
                    context,
                    'Global Welfare',
                    Icons.public,
                    Color(0xFFA855F7),
                    Color(0xFFFFFFFF),
                    'general_health',
                    'Universal Brotherhood & Service',
                    5,
                  ),
                ],
              ),
              const SizedBox(height: 32),

              // Enhanced Vision Statement Card
              AnimatedBuilder(
                animation: _cardAnimationController,
                builder: (context, child) {
                  return Transform.scale(
                    scale: _cardStaggerAnimation.value,
                    child: AnimatedBuilder(
                      animation: _floatingController,
                      builder: (context, child) {
                        return Transform.translate(
                          offset: Offset(0, _floatingAnimation.value * 0.7),
                          child: Container(
                            width: double.infinity,
                            padding: const EdgeInsets.all(24),
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                                colors: [
                                  Color(0xFF6C63FF).withOpacity(0.1),
                                  Color(0xFF4F46E5).withOpacity(0.1),
                                  Color(0xFF7C3AED).withOpacity(0.1),
                                ],
                              ),
                              borderRadius: BorderRadius.circular(24),
                              border: Border.all(
                                color: Color(0xFF6C63FF).withOpacity(0.3),
                                width: 1,
                              ),
                              boxShadow: [
                                BoxShadow(
                                  color: Color(0xFF6C63FF).withOpacity(0.2),
                                  blurRadius: 25,
                                  offset: const Offset(0, 8),
                                ),
                              ],
                            ),
                            child: Column(
                              children: [
                                AnimatedBuilder(
                                  animation: _rotationController,
                                  builder: (context, child) {
                                    return Transform.rotate(
                                      angle: _rotationAnimation.value * 0.5,
                                      child: Container(
                                        padding: EdgeInsets.all(16),
                                        decoration: BoxDecoration(
                                          gradient: LinearGradient(
                                            colors: [
                                              Color(0xFF6C63FF),
                                              Color(0xFF4F46E5),
                                            ],
                                          ),
                                          borderRadius: BorderRadius.circular(
                                            20,
                                          ),
                                          boxShadow: [
                                            BoxShadow(
                                              color: Color(
                                                0xFF6C63FF,
                                              ).withOpacity(0.4),
                                              blurRadius: 15,
                                              offset: const Offset(0, 4),
                                            ),
                                          ],
                                        ),
                                        child: Icon(
                                          Icons.emoji_nature,
                                          size: 36,
                                          color: Colors.white,
                                        ),
                                      ),
                                    );
                                  },
                                ),
                                const SizedBox(height: 16),
                                AnimatedBuilder(
                                  animation: _pulseController,
                                  builder: (context, child) {
                                    return Transform.scale(
                                      scale: _pulseAnimation.value,
                                      child: ShaderMask(
                                        shaderCallback: (bounds) {
                                          return LinearGradient(
                                            colors: [
                                              Color(0xFF6C63FF),
                                              Color(0xFF4F46E5),
                                              Color(0xFF7C3AED),
                                            ],
                                          ).createShader(bounds);
                                        },
                                        child: Text(
                                          'Creating Muktiya Villages',
                                          style: TextStyle(
                                            fontSize: 18,
                                            fontWeight: FontWeight.w700,
                                            color: Colors.white,
                                          ),
                                          textAlign: TextAlign.center,
                                        ),
                                      ),
                                    );
                                  },
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  'Building sustainable communities rooted in compassion, justice, and spiritual enlightenment. Join the movement towards a world free from suffering.',
                                  style: TextStyle(
                                    fontSize: 13,
                                    color: Colors.black54,
                                    height: 1.5,
                                    fontWeight: FontWeight.w500,
                                  ),
                                  textAlign: TextAlign.center,
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
                  );
                },
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
      bottomNavigationBar: _buildAnimatedBottomNavigation(),
    );
  }

  Widget _buildAnimatedCategoryCard(
    BuildContext context,
    String title,
    IconData icon,
    Color backgroundColor,
    Color iconColor,
    String categoryId,
    String description,
    int index,
  ) {
    return AnimatedBuilder(
      animation: _cardAnimationController,
      builder: (context, child) {
        double delay = index * 0.1;
        double animationValue = Curves.elasticOut.transform(
          math.max(
            0,
            math.min(1, (_cardStaggerAnimation.value - delay) / (1 - delay)),
          ),
        );

        return Transform.scale(
          scale: animationValue,
          child: AnimatedBuilder(
            animation: _floatingController,
            builder: (context, child) {
              double floatOffset = _floatingAnimation.value * (1 + index * 0.2);

              return Transform.translate(
                offset: Offset(0, floatOffset),
                child: GestureDetector(
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
                  child: AnimatedBuilder(
                    animation: _pulseController,
                    builder: (context, child) {
                      return Transform.scale(
                        scale: 1 + (_pulseAnimation.value - 1) * 0.02,
                        child: Container(
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                              colors: [
                                backgroundColor,
                                backgroundColor.withOpacity(0.8),
                                backgroundColor.withOpacity(0.9),
                              ],
                            ),
                            borderRadius: BorderRadius.circular(24),
                            boxShadow: [
                              BoxShadow(
                                color: backgroundColor.withOpacity(0.4),
                                blurRadius: 25,
                                offset: const Offset(0, 8),
                              ),
                              BoxShadow(
                                color: Colors.white.withOpacity(0.2),
                                blurRadius: 15,
                                offset: const Offset(0, -4),
                              ),
                            ],
                          ),
                          child: Stack(
                            children: [
                              // Floating particles
                              ...List.generate(3, (particleIndex) {
                                return AnimatedBuilder(
                                  animation: _particleController,
                                  builder: (context, child) {
                                    double particleAngle =
                                        (_particleController.value +
                                            particleIndex * 0.3) *
                                        2 *
                                        math.pi;
                                    return Positioned(
                                      top: 20 + 15 * math.sin(particleAngle),
                                      right:
                                          20 +
                                          20 * math.cos(particleAngle * 1.2),
                                      child: Transform.scale(
                                        scale:
                                            0.5 +
                                            0.3 * math.sin(particleAngle * 2),
                                        child: Container(
                                          width: 8,
                                          height: 8,
                                          decoration: BoxDecoration(
                                            color: Colors.white.withOpacity(
                                              0.6,
                                            ),
                                            shape: BoxShape.circle,
                                            boxShadow: [
                                              BoxShadow(
                                                color: Colors.white.withOpacity(
                                                  0.3,
                                                ),
                                                blurRadius: 4,
                                                offset: const Offset(0, 1),
                                              ),
                                            ],
                                          ),
                                        ),
                                      ),
                                    );
                                  },
                                );
                              }),

                              Padding(
                                padding: const EdgeInsets.all(20),
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    AnimatedBuilder(
                                      animation: _rotationController,
                                      builder: (context, child) {
                                        return Transform.rotate(
                                          angle: _rotationAnimation.value * 0.3,
                                          child: Container(
                                            padding: const EdgeInsets.all(16),
                                            decoration: BoxDecoration(
                                              color: Colors.white.withOpacity(
                                                0.2,
                                              ),
                                              borderRadius:
                                                  BorderRadius.circular(20),
                                              border: Border.all(
                                                color: Colors.white.withOpacity(
                                                  0.4,
                                                ),
                                                width: 2,
                                              ),
                                              boxShadow: [
                                                BoxShadow(
                                                  color: Colors.white
                                                      .withOpacity(0.3),
                                                  blurRadius: 15,
                                                  offset: const Offset(0, 4),
                                                ),
                                              ],
                                            ),
                                            child: Icon(
                                              icon,
                                              size: 32,
                                              color: iconColor,
                                            ),
                                          ),
                                        );
                                      },
                                    ),
                                    const SizedBox(height: 16),
                                    AnimatedBuilder(
                                      animation: _shimmerController,
                                      builder: (context, child) {
                                        return ShaderMask(
                                          shaderCallback: (bounds) {
                                            return LinearGradient(
                                              colors: [
                                                Colors.white,
                                                Colors.white.withOpacity(0.8),
                                                Colors.white,
                                              ],
                                              stops: [
                                                (_shimmerAnimation.value + 2) /
                                                    4,
                                                (_shimmerAnimation.value +
                                                        2.5) /
                                                    4,
                                                (_shimmerAnimation.value + 3) /
                                                    4,
                                              ],
                                            ).createShader(bounds);
                                          },
                                          child: Text(
                                            title,
                                            style: TextStyle(
                                              fontSize: 14,
                                              fontWeight: FontWeight.w700,
                                              color: Colors.white,
                                            ),
                                            textAlign: TextAlign.center,
                                          ),
                                        );
                                      },
                                    ),
                                    const SizedBox(height: 8),
                                    Text(
                                      description,
                                      style: TextStyle(
                                        fontSize: 11,
                                        fontWeight: FontWeight.w500,
                                        color: Colors.white.withOpacity(0.9),
                                      ),
                                      textAlign: TextAlign.center,
                                      maxLines: 2,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                    const SizedBox(height: 12),
                                    AnimatedBuilder(
                                      animation: _pulseController,
                                      builder: (context, child) {
                                        return Transform.scale(
                                          scale: _pulseAnimation.value,
                                          child: Container(
                                            padding: const EdgeInsets.symmetric(
                                              horizontal: 12,
                                              vertical: 6,
                                            ),
                                            decoration: BoxDecoration(
                                              gradient: LinearGradient(
                                                colors: [
                                                  Colors.white.withOpacity(0.3),
                                                  Colors.white.withOpacity(0.2),
                                                ],
                                              ),
                                              borderRadius:
                                                  BorderRadius.circular(12),
                                              border: Border.all(
                                                color: Colors.white.withOpacity(
                                                  0.4,
                                                ),
                                                width: 1,
                                              ),
                                            ),
                                            child: Text(
                                              'Transform',
                                              style: TextStyle(
                                                fontSize: 10,
                                                fontWeight: FontWeight.w700,
                                                color: Colors.white,
                                              ),
                                            ),
                                          ),
                                        );
                                      },
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),
              );
            },
          ),
        );
      },
    );
  }

  Widget _buildAnimatedBottomNavigation() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 15),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [Colors.white, Color(0xFFF8FAFC)],
        ),
        border: Border(
          top: BorderSide(color: Color(0xFF6C63FF).withOpacity(0.1), width: 1),
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
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildAnimatedTabItem(
            icon: Icons.home_rounded,
            label: 'Home',
            isSelected: _selectedTab == 1,
            onTap: () {
              setState(() => _selectedTab = 1);
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(
                  builder: (context) => const MainNavigation(initialIndex: 0),
                ),
              );
            },
            index: 0,
          ),
          _buildAnimatedTabItem(
            icon: Icons.explore_rounded,
            label: 'Explore',
            isSelected: _selectedTab == 0,
            onTap: () {
              setState(() => _selectedTab = 0);
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(
                  builder: (context) => const MainNavigation(initialIndex: 1),
                ),
              );
            },
            index: 1,
          ),
          _buildAnimatedTabItem(
            icon: Icons.radio_button_checked_rounded,
            label: 'Kalpavriksha',
            isSelected: _selectedTab == 4,
            onTap: () {
              setState(() => _selectedTab = 4);
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(
                  builder: (context) => const MainNavigation(initialIndex: 2),
                ),
              );
            },
            index: 2,
          ),
          _buildAnimatedTabItem(
            icon: Icons.healing_rounded,
            label: 'Wellness',
            isSelected: _selectedTab == 2,
            onTap: () => setState(() => _selectedTab = 2),
            index: 3,
          ),
          _buildAnimatedTabItem(
            icon: Icons.auto_awesome_rounded,
            label: 'AI Chat',
            isSelected: _selectedTab == 3,
            onTap: () {
              setState(() => _selectedTab = 3);
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(
                  builder: (context) => const MainNavigation(initialIndex: 3),
                ),
              );
            },
            index: 4,
          ),
        ],
      ),
    );
  }

  Widget _buildAnimatedTabItem({
    required IconData icon,
    required String label,
    required bool isSelected,
    required VoidCallback onTap,
    required int index,
  }) {
    return AnimatedBuilder(
      animation: _floatingController,
      builder: (context, child) {
        double offset =
            _floatingAnimation.value * 0.3 * (index % 2 == 0 ? 1 : -1);

        return Transform.translate(
          offset: Offset(0, offset),
          child: GestureDetector(
            onTap: onTap,
            child: AnimatedBuilder(
              animation: _pulseController,
              builder: (context, child) {
                return Transform.scale(
                  scale: isSelected ? _pulseAnimation.value : 1.0,
                  child: Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      gradient: isSelected
                          ? LinearGradient(
                              colors: [Color(0xFF6C63FF), Color(0xFF4F46E5)],
                            )
                          : null,
                      color: isSelected ? null : Colors.transparent,
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: isSelected
                          ? [
                              BoxShadow(
                                color: Color(0xFF6C63FF).withOpacity(0.4),
                                blurRadius: 15,
                                offset: const Offset(0, 4),
                              ),
                            ]
                          : null,
                    ),
                    child: AnimatedBuilder(
                      animation: _rotationController,
                      builder: (context, child) {
                        return Transform.rotate(
                          angle: isSelected
                              ? _rotationAnimation.value * 0.1
                              : 0,
                          child: Icon(
                            icon,
                            size: 24,
                            color: isSelected ? Colors.white : Colors.grey[600],
                          ),
                        );
                      },
                    ),
                  ),
                );
              },
            ),
          ),
        );
      },
    );
  }

  @override
  void dispose() {
    _headerAnimationController.dispose();
    _cardAnimationController.dispose();
    _floatingController.dispose();
    _shimmerController.dispose();
    _particleController.dispose();
    _pulseController.dispose();
    _rotationController.dispose();
    super.dispose();
  }
}
