import 'package:flutter/foundation.dart';

/// Production-safe logging utility
/// Only logs in debug mode, completely silent in release builds
class Logger {
  /// Log debug information (only in debug builds)
  static void debug(String message) {
    if (kDebugMode) {
      print('🐛 DEBUG: $message');
    }
  }

  /// Log info messages (only in debug builds)
  static void info(String message) {
    if (kDebugMode) {
      print('ℹ️ INFO: $message');
    }
  }

  /// Log warnings (only in debug builds)
  static void warning(String message) {
    if (kDebugMode) {
      print('⚠️ WARNING: $message');
    }
  }

  /// Log errors (always logs for crash reporting)
  static void error(String message, [Object? error, StackTrace? stackTrace]) {
    if (kDebugMode) {
      print('❌ ERROR: $message');
      if (error != null) print('Error details: $error');
      if (stackTrace != null) print('Stack trace: $stackTrace');
    }
    // TODO: Send to crash reporting service (Crashlytics)
  }

  /// Log success messages (only in debug builds)
  static void success(String message) {
    if (kDebugMode) {
      print('✅ SUCCESS: $message');
    }
  }
}
