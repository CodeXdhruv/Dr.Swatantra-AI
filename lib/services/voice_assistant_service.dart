import 'package:speech_to_text/speech_to_text.dart' as stt;
import 'package:flutter_tts/flutter_tts.dart';
import 'package:google_generative_ai/google_generative_ai.dart';
import 'gemini_service.dart';

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
  final GeminiService _gemini = GeminiService();

  bool isActive = false;
  String userTranscript = '';
  String aiTranscript = '';

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

  // Constructor
  VoiceAssistantService() {
    _initializeTTS();
  }

  /// Initialize and configure TTS with voice parameters
  Future<void> _initializeTTS() async {
    try {
      // Get available voices
      _availableVoices = await _tts.getVoices;

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
      print('Error initializing TTS: $e');
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
      print('Platform specific TTS configuration error: $e');
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
            (!name.contains('female') && !name.contains('woman') && !name.contains('girl'));
      } else {
        // Force male voice only - no female voices allowed
        matchesGender =
            name.contains('male') ||
            name.contains('man') ||
            name.contains('boy') ||
            name.contains('deep') ||
            name.contains('bass') ||
            (!name.contains('female') && !name.contains('woman') && !name.contains('girl'));
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

    final voiceToUse = deepVoices.isNotEmpty ? deepVoices.first : 
                      (filteredVoices.isNotEmpty ? filteredVoices.first : null);

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
          (!name.contains('female') && !name.contains('woman') && !name.contains('girl'));
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
      pitch: 0.7,        // Lower pitch for deeper voice
      speechRate: 0.35,  // Slower for calm delivery
      volume: 0.8,       // Clear but not overwhelming
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
      pitch: 0.75,  // Slightly lower for male narrator
      speechRate: 0.4,
      volume: 0.8,
      gender: 'male',
    );
  }

  /// Apply an energetic male voice preset
  Future<void> setEnergeticVoice() async {
    await configureAdvancedVoice(
      pitch: 1.1,        // Slightly higher but still male range
      speechRate: 0.6, 
      volume: 0.9,
      gender: 'male',
    );
  }

  /// Apply a soothing therapeutic voice preset - Updated for male voice
  Future<void> setTherapeuticVoice() async {
    await configureAdvancedVoice(
      pitch: 0.75,       // Slightly deeper than default
      speechRate: 0.3,   // Very slow and calming
      volume: 0.75,      // Gentle volume
      gender: 'male',
    );
  }

  /// Apply a professional deep male voice preset - NEW
  Future<void> setProfessionalDeepVoice() async {
    await configureAdvancedVoice(
      pitch: 0.65,       // Very deep
      speechRate: 0.45,  // Professional pace
      volume: 0.85,      // Clear and authoritative
      gender: 'male',
      useDeepVoice: true,
    );
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

      // 2. Send to Gemini
      aiTranscript = '';

      // Use the pre-configured chat session from GeminiService
      final responseStream = _gemini.chat.sendMessageStream(
        Content.text(userTranscript),
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

      onAIResult(aiTranscript);

      // 3. After speaking, loop continues → back to listening
    }
  }

  /// Stop everything (loop, listening, TTS)
  void stopVoiceLoop() {
    isActive = false;
    _speech.stop();
    _tts.stop();
  }

  Future<void> speakText(String text) async {
    await _tts.awaitSpeakCompletion(true);
    await _tts.speak(text);
  }
}