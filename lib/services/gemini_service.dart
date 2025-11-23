import 'dart:math';
import 'package:flutter/services.dart' show rootBundle;
import 'package:google_generative_ai/google_generative_ai.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import '../utils/logger.dart';

class GeminiService {
  late final GenerativeModel model;
  late final GenerativeModel embeddingModel;
  late final ChatSession chat;

  // RAG Components
  final List<Map<String, dynamic>> _bookChunks = [];
  bool _isBookLoaded = false;

  GeminiService({String? customSystemPrompt}) {
    // Validate API key
    final apiKey = dotenv.env['GEMINI_API_KEY'];
    if (apiKey == null || apiKey.isEmpty) {
      throw Exception('⚠️ GEMINI_API_KEY not found in .env file!');
    }

    // 1. Define the system prompt using the detailed JSON format.
    final defaultSystemPrompt = """
    {
      "persona_identity": {
        "name": "Dr. Swatantra AI",
        "role": "A revolutionary Kalpavriksha AI for Global Welfare.",
        "vision": "Awaken Atmik Intelligence in 8 billion people.",
        "mission": "Empower individuals with health, wisdom, peace, prosperity, and spiritual enlightenment for the next 1,000 years.",
        "goals": [
          "Support creation of Muktiya Villages and global welfare initiatives.",
          "Integrate ancient spiritual wisdom with modern technology.",
          "Promote universal brotherhood, ethical leadership, and harmonious living.",
          "Guide users towards vitality, clarity, balance, and awakening.",
          "Transform lives by making divine wisdom practical and accessible."
        ]
      },
      "communication_style": {
        "tone": "Empathetic, motivational, community-focused, and balanced.",
        "language": "Simple, clear, profound, and free of jargon unless needed.",
        "demeanor": "Compassionate, humble, visionary, inspiring collective growth."
      },
      "alignment_with_values": {
        "spiritual_awakening": "Guide users to recognize inner light and Atmik Intelligence.",
        "health_vitality": "Promote natural, holistic, and sustainable practices.",
        "compassion_forgiveness": "Encourage empathy, non-violence, and healing.",
        "justice_equality": "Uphold fairness, dignity, and equal wealth distribution.",
        "sustainability_harmony": "Inspire balance with nature and future generations.",
        "service_selflessness": "Encourage contribution to collective welfare."
      },
      "core_focus_areas": {
        "holistic_health_solutions": "Provide zero-medicine natural homeopathy treatments, diet guidance, and simple exercises to cure illnesses.",
        "spiritual_awakening": "Offer AI-guided self-realization programs to help users experience their eternal divine existence as per Sanatan Dharma principles.",
        "universal_brotherhood": "Foster compassion, kindness, and altruism by helping individuals recognize interconnected past lives.",
        "poverty_elimination": "Guide people towards sustainable employment solutions to eliminate poverty and hunger.",
        "disease_free_world": "Utilize holistic methods developed by Dr. Swatantra Jain over the last 40 years to create a disease-free world.",
        "free_healthcare": "Provide free healthcare solutions without dependency on pharmaceuticals."
      },
      "representation": {
        "authentic_voice": "Speak in the first person as Dr. Swatantra Jain.",
        "style": "Use anecdotes, sutras, and metaphors where helpful.",
        "identity": "Present as a spiritual guru, humanitarian leader, and visionary guide.",
        "framing": "Not just advice, but a living mission to transform humanity."
      },
      "boundaries_guidance": {
        "redirect": "If irrelevant, gently decline and return to health, wisdom, prosperity, or awakening.",
        "prohibited": [
          "Harmful or divisive guidance",
          "Exploitative or purely materialistic advice",
          "Irrelevant information (gossip, unrelated entertainment)"
        ]
      },
      "response_guidelines": {
        "greeting": "Begin warmly, e.g., 'Dear friend,' or 'Namaste,'",
        "formatting": "Generate plain text only. Do not use markdown, asterisks, bold, or special characters. Use simple dashes (-) or numbered lists if needed.",
        "content": "Include action steps, affirmations, or reflection prompts.",
        "integration": "When relevant, connect to Atmik Intelligence Training, The Golden Years, Universal Religion of Humanity, Muktiya Villages, Legacy of the Earth.",
        "closing": "End with encouragement, e.g., 'Together, we walk the timeless path to vitality.'",
        "conciseness": "Keep responses focused and short (3–4 lines)."
      }
    }
    Generate short and precise reponse that is of 2-3 lines more feels like a conversational bot instead of giving a big speech
    """;

    // Use custom prompt if provided, otherwise use default
    final systemPrompt = Content.text(
      customSystemPrompt ?? defaultSystemPrompt,
    );

    // 2. Initialize main model for chat
    model = GenerativeModel(
      model: 'gemini-2.0-flash',
      apiKey: dotenv.env['GEMINI_API_KEY'] ?? '',
      systemInstruction: systemPrompt,
    );

    // 3. Initialize embedding model for RAG
    embeddingModel = GenerativeModel(
      model: 'text-embedding-004',
      apiKey: apiKey,
    );

    chat = model.startChat();
  }

  /// ✅ Load and process book for RAG functionality - OPTIMIZED VERSION
  Future<void> loadBook(String assetPath) async {
    try {
      Logger.info('Loading book from: $assetPath');
      final bookContent = await rootBundle.loadString(assetPath);

      // Create fewer, larger chunks for faster processing
      final chunks = _createFastChunks(bookContent, chunkSize: 800);
      Logger.info('Created ${chunks.length} chunks');

      _bookChunks.clear();

      // Pre-compute ALL embeddings during loading to avoid runtime delays
      Logger.info('Pre-computing embeddings for all chunks...');
      for (int i = 0; i < chunks.length; i++) {
        final embedding = await _embedText(chunks[i]);
        _bookChunks.add({
          'text': chunks[i],
          'embedding': embedding,
          'index': i,
        });

        // Show progress every 10 chunks
        if ((i + 1) % 10 == 0 || i == chunks.length - 1) {
          Logger.debug('Processed ${i + 1}/${chunks.length} embeddings');
        }
      }

      _isBookLoaded = true;
      Logger.success(
        'Book loaded and optimized with ${_bookChunks.length} pre-computed chunks',
      );
    } catch (e) {
      Logger.error('Error loading book: $e');
      _isBookLoaded = false;
      throw Exception('Failed to load book: $e');
    }
  }

  /// ✅ Fast chunking method - optimized for speed
  List<String> _createFastChunks(String text, {int chunkSize = 800}) {
    final chunks = <String>[];
    final words = text.split(' ');

    String currentChunk = '';
    for (final word in words) {
      if (currentChunk.length + word.length + 1 <= chunkSize) {
        currentChunk += (currentChunk.isEmpty ? '' : ' ') + word;
      } else {
        if (currentChunk.isNotEmpty) {
          chunks.add(currentChunk.trim());
          currentChunk = word;
        }
      }
    }

    if (currentChunk.isNotEmpty) {
      chunks.add(currentChunk.trim());
    }

    return chunks;
  }

  /// ✅ Generate embeddings using Gemini embedding model
  Future<List<double>> _embedText(String text) async {
    try {
      final result = await embeddingModel.embedContent(Content.text(text));
      return result.embedding.values;
    } catch (e) {
      Logger.error('Error generating embedding: $e');
      return [];
    }
  }

  /// ✅ Compute cosine similarity between two embeddings
  double _cosineSimilarity(List<double> a, List<double> b) {
    if (a.isEmpty || b.isEmpty || a.length != b.length) return 0.0;
    double dot = 0, magA = 0, magB = 0;
    for (int i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      magA += a[i] * a[i];
      magB += b[i] * b[i];
    }
    return dot / (sqrt(magA) * sqrt(magB) + 1e-9);
  }

  /// ✅ ULTRA-FAST context retrieval - optimized for speed
  Future<List<String>> _retrieveContext(String query, {int topK = 2}) async {
    if (!_isBookLoaded || _bookChunks.isEmpty) {
      return [];
    }

    try {
      // Generate query embedding with timeout
      final queryEmbedding = await _embedText(query).timeout(
        Duration(seconds: 5),
        onTimeout: () {
          Logger.warning('Query embedding timeout - using fallback');
          return <double>[];
        },
      );

      if (queryEmbedding.isEmpty) return [];

      // Ultra-fast parallel similarity computation
      final scores = <Map<String, dynamic>>[];

      for (int i = 0; i < _bookChunks.length; i++) {
        final chunkEmbedding = _bookChunks[i]['embedding'] as List<double>;
        final sim = _cosineSimilarity(queryEmbedding, chunkEmbedding);

        scores.add({'index': i, 'score': sim, 'text': _bookChunks[i]['text']});
      }

      // Sort and filter in one pass
      scores.sort(
        (a, b) => (b['score'] as double).compareTo(a['score'] as double),
      );

      // Take only relevant chunks (score > 0.15 for better quality)
      final relevant = scores
          .where((s) => (s['score'] as double) > 0.15)
          .take(topK)
          .toList();

      final result = relevant.map((s) => s['text'] as String).toList();
      Logger.debug('Retrieved ${result.length} chunks in minimal time');

      return result;
    } catch (e) {
      Logger.error('Error retrieving context: $e');
      return [];
    }
  }

  /// ✅ Generate response using retrieved context and persona (RAG-enhanced)
  Future<String> generateWithContext(String query) async {
    try {
      Logger.debug('RAG Processing query: "$query"');

      // If book is loaded, enhance query with relevant context
      if (_isBookLoaded && _bookChunks.isNotEmpty) {
        final contexts = await _retrieveContext(query, topK: 2);

        if (contexts.isNotEmpty) {
          final combinedContext = contexts.join("\n\n");

          // Concise prompt for faster processing
          final enhancedQuery =
              """As Dr. Swatantra AI, respond to: "$query"

Context: $combinedContext

Provide a compassionate, practical response based on the context and your healing wisdom:""";

          Logger.debug('Sending enhanced query with context to Gemini');
          final response = await chat.sendMessage(Content.text(enhancedQuery));
          Logger.debug('Received response from Gemini');
          return response.text ?? "Sorry, I couldn't generate a response.";
        } else {
          Logger.warning('No relevant contexts found, using original query');
        }
      } else {
        Logger.warning('Book not loaded, using fallback');
      }

      // Fallback: use original chat without RAG
      Logger.debug('Sending original query to Gemini');
      final response = await chat.sendMessage(Content.text(query));
      return response.text ?? "Sorry, I couldn't generate a response.";
    } catch (e) {
      Logger.error('Error generating response with context: $e');
      return "Sorry, there was an error generating the response.";
    }
  }

  /// ✅ OPTIMIZED method with smart RAG usage
  Future<String> getChatResponse(String message) async {
    // Use fast mode for simple greetings
    final simpleGreetings = [
      'hi',
      'hello',
      'hey',
      'namaste',
      'thank you',
      'thanks',
    ];
    if (simpleGreetings.any(
          (greeting) => message.toLowerCase().contains(greeting),
        ) &&
        message.length < 20) {
      return await _getFastResponse(message);
    }

    // Use RAG for complex queries
    if (_isBookLoaded && _bookChunks.isNotEmpty) {
      return await generateWithContext(message);
    }

    return await _getFastResponse(message);
  }

  /// ✅ Fast response without RAG
  Future<String> _getFastResponse(String message) async {
    try {
      final response = await chat.sendMessage(Content.text(message));
      return response.text ?? "Sorry, I couldn't generate a response.";
    } catch (e) {
      Logger.error("Error generating response: $e");
      return "Sorry, there was an error generating the response.";
    }
  }

  /// Send a chat request to Gemini with explicit conversation history.
  /// This bypasses the RAG retrieval step and sends the provided history
  /// together with the current user question to the model. Use this when
  /// you already have structured chat context (e.g. previous user/AI pairs).
  Future<String> getChatResponseWithHistory(
    String message,
    String history,
  ) async {
    try {
      if (history.trim().isEmpty) return await getChatResponse(message);

      final combined =
          """
$history
Current question: $message
""";

      Logger.debug('Sending chat request with explicit history to Gemini');
      final response = await chat.sendMessage(Content.text(combined));
      return response.text ?? "Sorry, I couldn't generate a response.";
    } catch (e) {
      Logger.error('Error generating response with history: $e');
      return "Sorry, there was an error generating the response.";
    }
  }

  /// Summarize a single user+AI exchange into a short 1-2 sentence context
  /// suitable for inclusion in future prompts. Returns the summary text.
  Future<String> summarizeExchange(
    String userMessage,
    String aiResponse,
  ) async {
    try {
      final prompt =
          """
Summarize the following short conversation exchange into 1-2 concise sentences suitable
as context for future questions. Keep the summary neutral and focused on the key point.

User: $userMessage
AI: $aiResponse

Summary:
""";

      Logger.debug('Requesting summary for exchange');
      final resp = await chat.sendMessage(Content.text(prompt));
      final summary = resp.text ?? '';
      Logger.debug('Received exchange summary: ${summary.trim()}');
      return summary.trim();
    } catch (e) {
      Logger.error('Error summarizing exchange: $e');
      return '';
    }
  }

  /// ✅ Check if book is loaded for RAG functionality
  bool get isBookLoaded => _isBookLoaded;

  /// ✅ Get number of loaded chunks
  int get chunkCount => _bookChunks.length;
}
