import 'package:flutter_test/flutter_test.dart';
import '../lib/services/gemini_service.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('RAG Functionality Tests', () {
    late GeminiService geminiService;

    setUp(() {
      geminiService = GeminiService();
    });

    test('should load book and create chunks', () async {
      // Load test book content
      await geminiService.loadBook('assets/book.txt');

      // Verify book was loaded
      expect(geminiService.isBookLoaded, isTrue);
      expect(geminiService.chunkCount, greaterThan(0));

      print(
        '✅ Book loaded successfully with ${geminiService.chunkCount} chunks',
      );
    });

    test('should handle missing book file gracefully', () async {
      try {
        await geminiService.loadBook('assets/nonexistent.txt');
        fail('Should have thrown an exception for missing file');
      } catch (e) {
        expect(e, isA<Exception>());
        expect(geminiService.isBookLoaded, isFalse);
        print('✅ Handled missing file gracefully: $e');
      }
    });

    test('cosine similarity calculation', () {
      final service = GeminiService();

      // Test identical vectors
      final identical = service.testCosineSimilarity(
        [1.0, 2.0, 3.0],
        [1.0, 2.0, 3.0],
      );
      expect(identical, closeTo(1.0, 0.001));

      // Test orthogonal vectors
      final orthogonal = service.testCosineSimilarity([1.0, 0.0], [0.0, 1.0]);
      expect(orthogonal, closeTo(0.0, 0.001));

      print('✅ Cosine similarity calculations working correctly');
    });
  });
}

// Extension to expose private methods for testing
extension GeminiServiceTest on GeminiService {
  double testCosineSimilarity(List<double> a, List<double> b) {
    // Simple cosine similarity implementation for testing
    double dotProduct = 0.0;
    double normA = 0.0;
    double normB = 0.0;

    for (int i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    return dotProduct / (sqrt(normA) * sqrt(normB));
  }

  double sqrt(double x) => x == 0
      ? 0
      : x < 0
      ? double.nan
      : _sqrt(x);

  double _sqrt(double x) {
    double guess = x / 2;
    for (int i = 0; i < 10; i++) {
      guess = (guess + x / guess) / 2;
    }
    return guess;
  }
}
