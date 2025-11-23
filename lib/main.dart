import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_crashlytics/firebase_crashlytics.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'splash_screen.dart';
import 'utils/logger.dart';

// Custom page transition builder that removes animation
class _NoTransitionPageTransitionsBuilder extends PageTransitionsBuilder {
  const _NoTransitionPageTransitionsBuilder();

  @override
  Widget buildTransitions<T extends Object?>(
    PageRoute<T> route,
    BuildContext context,
    Animation<double> animation,
    Animation<double> secondaryAnimation,
    Widget child,
  ) {
    return child; // No animation, just return the child widget
  }
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Load environment variables
  await dotenv.load(fileName: ".env");

  // Initialize Firebase
  await Firebase.initializeApp();

  // Initialize Crashlytics for error reporting
  if (!kDebugMode) {
    // Only enable Crashlytics in release builds
    FlutterError.onError = FirebaseCrashlytics.instance.recordFlutterFatalError;
    PlatformDispatcher.instance.onError = (error, stack) {
      FirebaseCrashlytics.instance.recordError(error, stack, fatal: true);
      return true;
    };
    Logger.info('Crashlytics initialized for production error tracking');
  }

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ScreenUtilInit(
      designSize: const Size(392, 844), // Base design size (standard mobile)
      minTextAdapt: true,
      splitScreenMode: true,
      builder: (context, child) {
        return MaterialApp(
          title: 'Dr.Swatantra AI',
          theme: ThemeData.light().copyWith(
            scaffoldBackgroundColor: const Color(0xFFE86D4C),
            primaryColor: const Color(0xFFFF8F6E),
            pageTransitionsTheme: const PageTransitionsTheme(
              builders: {
                TargetPlatform.android: _NoTransitionPageTransitionsBuilder(),
                TargetPlatform.iOS: _NoTransitionPageTransitionsBuilder(),
                TargetPlatform.windows: _NoTransitionPageTransitionsBuilder(),
                TargetPlatform.macOS: _NoTransitionPageTransitionsBuilder(),
                TargetPlatform.linux: _NoTransitionPageTransitionsBuilder(),
              },
            ),
          ),
          home: const SplashScreen(),
        );
      },
    );
  }
}
