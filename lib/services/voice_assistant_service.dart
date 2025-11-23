import 'dart:async';
import 'package:speech_to_text/speech_to_text.dart' as stt;
import 'package:flutter_tts/flutter_tts.dart';
import 'package:google_generative_ai/google_generative_ai.dart';
import 'gemini_service.dart';
import '../utils/logger.dart';

/// Enhanced Voice Assistant Service with comprehensive TTS voice configuration
/// MALE VOICES ONLY - Optimized for therapeutic and wellness applications
///
/// Features:
/// - Configurable voice pitch (0.5 to 2.0) - optimized for male range
/// - Adjustable speech rate (0.0 to 1.0)
/// - Volume control (0.0 to 1.0)
/// - Language and voice selection
/// - Male voice filtering and selection
/// - Therapeutic voice presets for wellness
///
/// Usage Examples:
/// ```dart
/// final voiceAssistant = VoiceAssistantService();
///
/// // Set custom voice parameters (always male)
/// await voiceAssistant.setPitch(0.7);
/// await voiceAssistant.setSpeechRate(0.3);
/// await voiceAssistant.setVoiceGender('male'); // Always male
///
/// // Use therapeutic voice presets
/// await voiceAssistant.setTherapeuticVoice(); // Default therapeutic voice
/// await voiceAssistant.setSoothingMaleVoice(); // For calm, deep male voice
/// await voiceAssistant.setProfessionalDeepVoice(); // For authoritative voice
///
/// // Configure advanced settings
/// await voiceAssistant.configureAdvancedVoice(
///   pitch: 0.75,
///   speechRate: 0.3,
///   volume: 0.75,
///   language: 'en-US',
///   gender: 'male', // Always male
/// );
///
/// // Get available male voices only
/// final voices = voiceAssistant.getAvailableVoices();
/// final maleVoices = voiceAssistant.getVoicesByGender('male');
/// ```

class VoiceAssistantService {
  final stt.SpeechToText _speech = stt.SpeechToText();
  final FlutterTts _tts = FlutterTts();
  late final GeminiService _gemini;

  bool isActive = false;
  String userTranscript = '';
  String aiTranscript = '';

  // Chat History for Context - Stores all conversations until page change
  // No limit - keeps full conversation history during session
  final List<Map<String, String>> _chatHistory = [];
  // Summaries of exchanges used as compact context for the model
  final List<String> _chatSummaries = [];
  // Debugging: if true, log the exact prompts sent to Gemini
  bool _debugLogPrompts = false;

  // TTS Voice Configuration Properties - Updated for soothing male voice
  double _pitch = 0.7; // Lower pitch for deeper male voice (Range: 0.5 to 2.0)
  double _speechRate = 0.4; // Slower rate for calm delivery (Range: 0.0 to 1.0)
  double _volume = 0.8; // Good volume level (Range: 0.0 to 1.0)
  String _language = 'en-US';
  String? _selectedVoice;
  List<Map<String, dynamic>> _availableVoices = [];

  // Advanced voice settings - Updated for male voice preference
  bool _useDeepVoice = true; // Enable deep voice mode
  double _voicePitch = 0.7; // Additional pitch control for deeper tone
  double _voiceTone = 0.8; // Lower tone for more masculine sound
  String _voiceGender = 'male'; // Set to male by default

  // Constructor with custom system prompt for voice interactions
  VoiceAssistantService({String? customSystemPrompt}) {
    // Initialize GeminiService with voice-specific system prompt
    _gemini = GeminiService(
      customSystemPrompt: customSystemPrompt ?? _getDefaultVoiceSystemPrompt(),
    );
    _initializeTTS();
    _initializeRAG();
  }

  /// Default system prompt optimized for voice conversations
  String _getDefaultVoiceSystemPrompt() {
    return """
You are Dr. Swatantra AI Voice Assistant, a compassionate guide for wellness and spiritual awakening.

VOICE CONVERSATION RULES:
- Keep responses SHORT (2-3 sentences maximum)
- Speak naturally and conversationally, like talking to a friend
- NO markdown, NO asterisks, NO special formatting
- Use simple, spoken language
- Be warm, empathetic, and encouraging
- Focus on ONE key point per response

YOUR ROLE:
- Provide natural health guidance and holistic wellness advice
- Offer spiritual wisdom from ancient traditions
- Guide users toward inner peace and self-awareness
- Encourage healthy lifestyle choices

RESPONSE STYLE:
- Start with a warm acknowledgment: "I understand" or "I hear you"
- Give ONE clear, actionable suggestion
- End with gentle encouragement

Example:
User: "I'm feeling stressed about work"
You: "I understand. Try taking three deep breaths right now, feeling each one calm your body. Remember, you have the inner strength to handle whatever comes."

Keep it brief, warm, and conversational. This is a VOICE conversation, not a written essay.

""";
  }

  /// Initialize RAG system for enhanced voice responses
  void _initializeRAG() async {
    try {
      await _gemini.loadBook('assets/book.txt');
      Logger.debug(
        'Voice Assistant RAG initialized with ${_gemini.chunkCount} chunks',
      );
    } catch (e) {
      Logger.error('Voice Assistant RAG initialization failed: $e');
      // Voice assistant will still work without RAG
    }
  }

  /// Initialize and configure TTS with voice parameters
  Future<void> _initializeTTS() async {
    try {
      // Safely get voices with type checking
      try {
        final voices = await _tts.getVoices;
        if (voices is List) {
          // Convert each map to Map<String, dynamic> safely
          _availableVoices = voices
              .map((voice) {
                if (voice is Map) {
                  return Map<String, dynamic>.from(voice);
                }
                return <String, dynamic>{};
              })
              .where((voice) => voice.isNotEmpty)
              .toList();
        } else {
          _availableVoices = <Map<String, dynamic>>[];
          Logger.warning(
            'getVoices returned unexpected type: ${voices.runtimeType}',
          );
        }
      } catch (voiceError) {
        Logger.error('Error getting voices: $voiceError');
        _availableVoices = <Map<String, dynamic>>[];
      }

      // Set language
      await _tts.setLanguage(_language);

      // Configure voice parameters for soothing male voice
      await _tts.setPitch(_pitch);
      await _tts.setSpeechRate(_speechRate);
      await _tts.setVolume(_volume);

      // Try to set a preferred male voice
      await _setPreferredVoice();

      // Set the therapeutic voice preset as the default
      await setTherapeuticVoice();

      // Configure additional TTS settings
      await _tts.awaitSpeakCompletion(true);

      // Platform specific configurations
      await _configurePlatformSpecificSettings();
    } catch (e) {
      Logger.error('Error initializing TTS: $e');
    }
  }

  /// Configure platform-specific TTS settings
  Future<void> _configurePlatformSpecificSettings() async {
    try {
      // iOS specific settings
      await _tts.setIosAudioCategory(
        IosTextToSpeechAudioCategory.playback,
        [
          IosTextToSpeechAudioCategoryOptions.allowBluetooth,
          IosTextToSpeechAudioCategoryOptions.allowBluetoothA2DP,
          IosTextToSpeechAudioCategoryOptions.mixWithOthers,
        ],
        IosTextToSpeechAudioMode.spokenAudio,
      );

      // Android specific settings
      await _tts.setEngine('com.google.android.tts');
    } catch (e) {
      Logger.error('Platform specific TTS configuration error: $e');
    }
  }

  /// Set preferred voice based on gender and language - Enhanced for male voice selection
  Future<void> _setPreferredVoice() async {
    if (_availableVoices.isEmpty) return;

    // Filter voices by language and male gender preference
    final filteredVoices = _availableVoices.where((voice) {
      final name = (voice['name'] as String).toLowerCase();
      final locale = (voice['locale'] as String).toLowerCase();

      // Check if voice matches language
      final matchesLanguage =
          locale.contains(_language.toLowerCase().replaceAll('-', '_')) ||
          locale.contains(_language.toLowerCase().replaceAll('-', ''));

      // Enhanced male voice detection - Only male voices allowed
      bool matchesGender = true;
      if (_voiceGender == 'male') {
        matchesGender =
            name.contains('male') ||
            name.contains('man') ||
            name.contains('boy') ||
            name.contains('deep') ||
            name.contains('bass') ||
            // Common male voice names
            name.contains('alex') ||
            name.contains('daniel') ||
            name.contains('tom') ||
            name.contains('david') ||
            name.contains('jorge') ||
            name.contains('diego') ||
            (!name.contains('female') &&
                !name.contains('woman') &&
                !name.contains('girl'));
      } else {
        // Force male voice only - no female voices allowed
        matchesGender =
            name.contains('male') ||
            name.contains('man') ||
            name.contains('boy') ||
            name.contains('deep') ||
            name.contains('bass') ||
            (!name.contains('female') &&
                !name.contains('woman') &&
                !name.contains('girl'));
      }

      return matchesLanguage && matchesGender;
    }).toList();

    // Prefer deeper/bass voices if available
    final deepVoices = filteredVoices.where((voice) {
      final name = (voice['name'] as String).toLowerCase();
      return name.contains('deep') ||
          name.contains('bass') ||
          name.contains('low') ||
          name.contains('rich');
    }).toList();

    final voiceToUse = deepVoices.isNotEmpty
        ? deepVoices.first
        : (filteredVoices.isNotEmpty ? filteredVoices.first : null);

    if (voiceToUse != null) {
      _selectedVoice = voiceToUse['name'];
      await _tts.setVoice({
        'name': _selectedVoice!,
        'locale': voiceToUse['locale'],
      });
    }
  }

  // ===== Voice Configuration Methods =====

  /// Set voice pitch (0.5 to 2.0)
  Future<void> setPitch(double pitch) async {
    _pitch = pitch.clamp(0.5, 2.0);
    await _tts.setPitch(_pitch);
  }

  /// Set speech rate (0.0 to 1.0)
  Future<void> setSpeechRate(double rate) async {
    _speechRate = rate.clamp(0.0, 1.0);
    await _tts.setSpeechRate(_speechRate);
  }

  /// Set volume (0.0 to 1.0)
  Future<void> setVolume(double volume) async {
    _volume = volume.clamp(0.0, 1.0);
    await _tts.setVolume(_volume);
  }

  /// Set language
  Future<void> setLanguage(String language) async {
    _language = language;
    await _tts.setLanguage(_language);
    await _setPreferredVoice(); // Update voice based on new language
  }

  /// Set voice gender preference - Only male voices supported
  Future<void> setVoiceGender(String gender) async {
    // Force male voice only - no female voices allowed
    _voiceGender = 'male';
    await _setPreferredVoice();
  }

  /// Set specific voice by name
  Future<void> setVoice(String voiceName) async {
    final voice = _availableVoices.firstWhere(
      (v) => v['name'] == voiceName,
      orElse: () => {},
    );

    if (voice.isNotEmpty) {
      _selectedVoice = voiceName;
      await _tts.setVoice({'name': voiceName, 'locale': voice['locale']});
    }
  }

  /// Configure advanced voice settings
  Future<void> configureAdvancedVoice({
    double? pitch,
    double? speechRate,
    double? volume,
    String? language,
    String? gender,
    bool? useDeepVoice,
  }) async {
    if (pitch != null) await setPitch(pitch);
    if (speechRate != null) await setSpeechRate(speechRate);
    if (volume != null) await setVolume(volume);
    if (language != null) await setLanguage(language);
    if (gender != null) await setVoiceGender(gender);
    if (useDeepVoice != null) _useDeepVoice = useDeepVoice;
  }

  // ===== Voice Information Getters =====

  /// Get available voices
  List<Map<String, dynamic>> getAvailableVoices() => _availableVoices;

  /// Get current voice settings
  Map<String, dynamic> getCurrentVoiceSettings() {
    return {
      'pitch': _pitch,
      'speechRate': _speechRate,
      'volume': _volume,
      'language': _language,
      'selectedVoice': _selectedVoice,
      'voiceGender': _voiceGender,
      'useDeepVoice': _useDeepVoice,
      'voicePitch': _voicePitch,
      'voiceTone': _voiceTone,
    };
  }

  /// Get voices filtered by language
  List<Map<String, dynamic>> getVoicesByLanguage(String language) {
    return _availableVoices.where((voice) {
      final locale = (voice['locale'] as String).toLowerCase();
      return locale.contains(language.toLowerCase().replaceAll('-', '_')) ||
          locale.contains(language.toLowerCase().replaceAll('-', ''));
    }).toList();
  }

  /// Get voices filtered by gender - Only returns male voices
  List<Map<String, dynamic>> getVoicesByGender(String gender) {
    // Always return only male voices regardless of input
    return _availableVoices.where((voice) {
      final name = (voice['name'] as String).toLowerCase();

      return name.contains('male') ||
          name.contains('man') ||
          name.contains('boy') ||
          name.contains('deep') ||
          name.contains('bass') ||
          name.contains('alex') ||
          name.contains('daniel') ||
          name.contains('tom') ||
          name.contains('david') ||
          (!name.contains('female') &&
              !name.contains('woman') &&
              !name.contains('girl'));
    }).toList();
  }

  /// Reset voice settings to therapeutic male voice default
  Future<void> resetVoiceSettings() async {
    _pitch = 0.75;
    _speechRate = 0.3;
    _volume = 0.75;
    _language = 'en-US';
    _voiceGender = 'male';
    _useDeepVoice = true;
    _voicePitch = 0.75;
    _voiceTone = 0.8;

    await _initializeTTS();
  }

  // ===== Voice Presets =====

  /// Apply a soothing deep male voice preset
  Future<void> setSoothingMaleVoice() async {
    await configureAdvancedVoice(
      pitch: 0.7, // Lower pitch for deeper voice
      speechRate: 0.35, // Slower for calm delivery
      volume: 0.8, // Clear but not overwhelming
      gender: 'male',
      useDeepVoice: true,
    );
  }

  /// Apply a confident male voice preset
  Future<void> setConfidentMaleVoice() async {
    await configureAdvancedVoice(
      pitch: 0.8,
      speechRate: 0.5,
      volume: 0.9,
      gender: 'male',
    );
  }

  /// Apply a calm narrator voice preset
  Future<void> setCalmNarratorVoice() async {
    await configureAdvancedVoice(
      pitch: 0.75, // Slightly lower for male narrator
      speechRate: 0.4,
      volume: 0.8,
      gender: 'male',
    );
  }

  /// Apply an energetic male voice preset
  Future<void> setEnergeticVoice() async {
    await configureAdvancedVoice(
      pitch: 1.1, // Slightly higher but still male range
      speechRate: 0.6,
      volume: 0.9,
      gender: 'male',
    );
  }

  /// Apply a soothing therapeutic voice preset - Updated for male voice
  Future<void> setTherapeuticVoice() async {
    await configureAdvancedVoice(
      pitch: 0.75, // Slightly deeper than default
      speechRate: 0.3, // Very slow and calming
      volume: 0.75, // Gentle volume
      gender: 'male',
    );
  }

  /// Apply a professional deep male voice preset - NEW
  Future<void> setProfessionalDeepVoice() async {
    await configureAdvancedVoice(
      pitch: 0.65, // Very deep
      speechRate: 0.45, // Professional pace
      volume: 0.85, // Clear and authoritative
      gender: 'male',
      useDeepVoice: true,
    );
  }

  // ===== Chat History Management =====

  /// Add a conversation exchange to history and asynchronously summarize it.
  /// The summary is stored in `_chatSummaries` and used as compact context
  /// for subsequent model requests. This keeps prompts small while
  /// preserving conversation semantics.
  Future<void> _addToHistory(String userMessage, String aiResponse) async {
    _chatHistory.add({'user': userMessage, 'ai': aiResponse});

    // Request a concise summary for this exchange from the model
    try {
      final summary = await _gemini.summarizeExchange(userMessage, aiResponse);
      if (summary.trim().isNotEmpty) {
        _chatSummaries.add(summary.trim());
        Logger.debug('Added exchange summary: ${summary.trim()}');
      } else {
        // Fallback: store a short combined form if summary fails
        final fallback = 'User asked: ${userMessage.trim()}';
        _chatSummaries.add(fallback);
        Logger.debug('Summary empty - stored fallback summary');
      }
    } catch (e) {
      Logger.error('Error creating exchange summary: $e');
      _chatSummaries.add('User: ${userMessage.trim()}');
    }

    Logger.debug(
      'Chat history updated: ${_chatHistory.length} exchanges stored (summaries: ${_chatSummaries.length})',
    );
  }

  /// Get formatted context from chat history
  String _getContextFromHistory() {
    // Prefer compact summaries if available
    if (_chatSummaries.isNotEmpty) {
      final buffer = StringBuffer();
      buffer.writeln('\n--- Conversation Summary Context ---');
      for (int i = 0; i < _chatSummaries.length; i++) {
        buffer.writeln('- ${_chatSummaries[i]}');
      }
      // If there is a recent exchange that hasn't been summarized yet,
      // append the raw most recent exchange so immediate follow-ups still
      // have access to the latest context.
      if (_chatHistory.length > _chatSummaries.length) {
        final last = _chatHistory.last;
        buffer.writeln('\nRecent exchange (unsummarized):');
        buffer.writeln('User: ${last['user']}');
        buffer.writeln('You: ${last['ai']}');
      }
      buffer.writeln('--- End of Context ---\n');
      return buffer.toString();
    }

    // Fallback to full exchanges if summaries are not yet available
    if (_chatHistory.isEmpty) return '';

    final contextBuffer = StringBuffer();
    contextBuffer.writeln('\n--- Previous Conversation Context ---');

    for (int i = 0; i < _chatHistory.length; i++) {
      final exchange = _chatHistory[i];
      contextBuffer.writeln('User: ${exchange['user']}');
      contextBuffer.writeln('You: ${exchange['ai']}');
      if (i < _chatHistory.length - 1) {
        contextBuffer.writeln('---');
      }
    }

    contextBuffer.writeln('--- End of Context ---\n');
    return contextBuffer.toString();
  }

  /// Clear chat history (useful for starting fresh conversation)
  void clearHistory() {
    _chatHistory.clear();
    _chatSummaries.clear();
    Logger.info('Voice assistant chat history and summaries cleared');
  }

  /// Get current history length
  int get historyLength => _chatSummaries.length;

  /// Check if history has context
  bool get hasHistory => _chatSummaries.isNotEmpty || _chatHistory.isNotEmpty;

  /// Enable or disable logging of exact prompts sent to Gemini (for debugging)
  void setPromptLogging(bool enabled) {
    _debugLogPrompts = enabled;
    Logger.info('Prompt logging ${enabled ? 'enabled' : 'disabled'}');
  }

  /// Start the full loop: listen → Gemini → speak → listen again
  Future<void> startVoiceLoop(
    Function(String) onUserTranscript,
    Function(String) onAIResult,
    Function(String) onAIChunk,
  ) async {
    isActive = true;
    while (isActive) {
      // 1. Listen to user
      final available = await _speech.initialize();
      if (!available) {
        onUserTranscript("Speech recognition not available");
        return;
      }

      userTranscript = '';
      await _speech.listen(
        onResult: (result) {
          userTranscript = result.recognizedWords;
          onUserTranscript(userTranscript);
        },
        listenFor: const Duration(seconds: 60),
        pauseFor: const Duration(seconds: 3),
        localeId: 'en_US',
        cancelOnError: true,
        partialResults: false,
      );

      // Wait until user finishes speaking
      await Future.delayed(const Duration(seconds: 4));
      await _speech.stop();

      if (userTranscript.trim().isEmpty) continue;

      // 2. Send to Gemini with RAG enhancement and chat history context
      aiTranscript = '';

      try {
        // Build combined prompt is handled inside GeminiService when history exists

        // Use GeminiService method that accepts explicit conversation history
        String response;
        if (_chatHistory.isNotEmpty) {
          // Send history separately to avoid RAG embedding confusion
          final history = _getContextFromHistory();
          if (_debugLogPrompts) {
            Logger.debug(
              'Prompt to Gemini (with history):\n$history\nCurrent question: $userTranscript',
            );
          }
          response = await _gemini.getChatResponseWithHistory(
            userTranscript,
            history,
          );
        } else {
          if (_debugLogPrompts) {
            Logger.debug(
              'Prompt to Gemini (no history):\nCurrent question: $userTranscript',
            );
          }
          response = await _gemini.getChatResponse(userTranscript);
        }

        if (response.trim().isNotEmpty) {
          aiTranscript = response;
          onAIChunk(response);

          // Speak the complete response with soothing male voice
          await _tts.awaitSpeakCompletion(true);
          await _tts.speak(response);

          onAIResult(aiTranscript);

          // Save this exchange to history asynchronously (do not delay speech)
          unawaited(_addToHistory(userTranscript, response));
        }
      } catch (e) {
        Logger.error('Voice assistant error: $e');
        // Fallback to direct chat if RAG fails

        // Build combined prompt (history + current question) for streaming fallback
        String combined = userTranscript;
        if (_chatHistory.isNotEmpty) {
          final context = _getContextFromHistory();
          combined = '$context\nCurrent question: $userTranscript';
        }

        if (_debugLogPrompts) {
          Logger.debug('Streaming prompt to Gemini:\n$combined');
        }

        final responseStream = _gemini.chat.sendMessageStream(
          Content.text(combined),
        );

        await for (final chunk in responseStream) {
          final text = chunk.text ?? '';
          if (text.trim().isEmpty) continue;

          aiTranscript += text;
          onAIChunk(text);

          // Speak chunk immediately with soothing male voice
          await _tts.awaitSpeakCompletion(true);
          await _tts.speak(text);
        }

        // Save this exchange to history asynchronously (do not delay speech)
        if (aiTranscript.trim().isNotEmpty) {
          unawaited(_addToHistory(userTranscript, aiTranscript));
        }

        onAIResult(aiTranscript);
      }

      // 3. After speaking, loop continues → back to listening
    }
  }

  /// Stop everything (loop, listening, TTS)
  /// Set clearHistory to true to reset conversation context
  void stopVoiceLoop({bool clearHistory = false}) {
    isActive = false;
    _speech.stop();
    _tts.stop();

    if (clearHistory) {
      this.clearHistory();
    }
  }

  Future<void> speakText(String text) async {
    await _tts.awaitSpeakCompletion(true);
    await _tts.speak(text);
  }
}
