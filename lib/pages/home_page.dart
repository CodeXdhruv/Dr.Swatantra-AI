import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/auth_service.dart';

class QuoteService {
  static const String _quotesKey = 'daily_quotes';
  static const String _lastFetchKey = 'last_fetch_date';
  static const String _batchIndexKey = 'quote_batch_index';
  static const String _jsonFilePath =
      'assets/quotes.json'; // Path to your JSON file

  static Future<List<Map<String, String>>> _fetchQuotesFromFile() async {
    try {
      // Load the JSON file from assets
      final String jsonString = await rootBundle.loadString(_jsonFilePath);
      final List<dynamic> jsonData = json.decode(jsonString);

      // Convert to the required format
      List<Map<String, String>> allQuotes = jsonData.map<Map<String, String>>((
        item,
      ) {
        return {
          'quote': item['quote'].toString(),
          'author': item['author'].toString(),
        };
      }).toList();

      // Get current batch index from SharedPreferences
      final prefs = await SharedPreferences.getInstance();
      int currentBatchIndex = prefs.getInt(_batchIndexKey) ?? 0;

      // Calculate how many complete batches we can make
      int totalBatches = (allQuotes.length / 5).ceil();

      // Ensure batch index is within bounds (loop back to 0 if needed)
      if (currentBatchIndex >= totalBatches) {
        currentBatchIndex = 0;
      }

      // Calculate start and end indices for current batch
      int startIndex = currentBatchIndex * 5;
      int endIndex = (startIndex + 5).clamp(0, allQuotes.length);

      // Get the current batch of quotes
      List<Map<String, String>> batchQuotes = allQuotes.sublist(
        startIndex,
        endIndex,
      );

      // If we don't have 5 quotes in this batch (last batch might be smaller),
      // fill remaining with quotes from the beginning
      if (batchQuotes.length < 5 && allQuotes.length > 5) {
        int remaining = 5 - batchQuotes.length;
        List<Map<String, String>> additionalQuotes = allQuotes
            .take(remaining)
            .toList();
        batchQuotes.addAll(additionalQuotes);
      }

      // Update batch index for next day (move to next batch)
      int nextBatchIndex = currentBatchIndex + 1;
      if (nextBatchIndex >= totalBatches) {
        nextBatchIndex = 0; // Loop back to beginning
      }
      await prefs.setInt(_batchIndexKey, nextBatchIndex);

      return batchQuotes.take(5).toList();
    } catch (e) {
      // Error handled silently in production
      return _getFallbackQuotes();
    }
  }

  static List<Map<String, String>> _getFallbackQuotes() {
    return [
      {
        "quote":
            "The true measure of progress is not wealth or power, but the wellness of every soul on Earth.",
        "author": "Dr. Swatantra Jain",
      },
      {
        "quote":
            "When compassion becomes the foundation of governance, the whole world flourishes in peace.",
        "author": "Dr. Swatantra Jain",
      },
      {
        "quote":
            "Wellness is not a privilege for a few — it is the birthright of humanity.",
        "author": "Dr. Swatantra Jain",
      },
      {
        "quote":
            "Global welfare begins with inner awakening; a healthy world starts with a conscious heart.",
        "author": "Dr. Swatantra Jain",
      },
      {
        "quote":
            "To heal the planet, we must first heal the spirit of humanity.",
        "author": "Dr. Swatantra Jain",
      },
    ];
  }

  static Future<List<Map<String, String>>> getDailyQuotes() async {
    final prefs = await SharedPreferences.getInstance();
    final today = DateTime.now().toIso8601String().split('T')[0];
    final lastFetch = prefs.getString(_lastFetchKey);

    // Check if we need to fetch new quotes (24 hours have passed)
    if (lastFetch != today) {
      try {
        final quotes = await _fetchQuotesFromFile();
        final quotesJson = quotes.map((q) => json.encode(q)).toList();
        await prefs.setStringList(_quotesKey, quotesJson);
        await prefs.setString(_lastFetchKey, today);
        return quotes;
      } catch (e) {
        // Error handled silently in production
        return _getStoredQuotes();
      }
    } else {
      return _getStoredQuotes();
    }
  }

  // Method to force refresh quotes (useful for development/testing)
  static Future<List<Map<String, String>>> forceRefreshQuotes() async {
    final prefs = await SharedPreferences.getInstance();
    try {
      final quotes = await _fetchQuotesFromFile();
      final quotesJson = quotes.map((q) => json.encode(q)).toList();
      await prefs.setStringList(_quotesKey, quotesJson);
      await prefs.setString(
        _lastFetchKey,
        DateTime.now().toIso8601String().split('T')[0],
      );
      // Quotes refreshed successfully
      return quotes;
    } catch (e) {
      // Error handled silently in production
      return _getStoredQuotes();
    }
  }

  // Method to clear quotes cache completely
  static Future<void> clearQuotesCache() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_quotesKey);
    await prefs.remove(_lastFetchKey);
    await prefs.remove(_batchIndexKey);
    // Cache cleared
  }

  static Future<List<Map<String, String>>> _getStoredQuotes() async {
    final prefs = await SharedPreferences.getInstance();
    final quotesJson = prefs.getStringList(_quotesKey);

    if (quotesJson != null) {
      return quotesJson.map<Map<String, String>>((q) {
        final decoded = json.decode(q);
        return {
          'quote': decoded['quote'] as String,
          'author': decoded['author'] as String,
        };
      }).toList();
    }
    return _getFallbackQuotes();
  }
}

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final PageController _pageController = PageController();
  final TextEditingController _journalController = TextEditingController();
  final TextEditingController _habitController = TextEditingController();
  Timer? _timer;
  Timer? _greetingTimer;
  int _currentPage = 0;
  final AuthService _authService = AuthService();

  List<Map<String, String>> _dailyQuotes = [];
  bool _isLoadingQuotes = true;
  bool _isEditingJournal = false;

  List<Map<String, dynamic>> _habits = [];
  String? _cachedUserName; // Cache user name to avoid repeated processing

  @override
  void initState() {
    super.initState();
    _refreshUserData();
    _loadDailyQuotes();
    _loadJournalEntry();
    _loadHabits();
    _greetingTimer = Timer.periodic(
      const Duration(minutes: 1),
      (_) => setState(() {}),
    );

    _journalController.addListener(() {
      setState(() {
        _isEditingJournal = _journalController.text.isNotEmpty;
      });
    });
  }

  Future<void> _refreshUserData() async {
    try {
      // Force refresh the current user to get latest data
      await _authService.currentUser?.reload();
      // Clear cached user name so it gets regenerated with fresh data
      _cachedUserName = null;
    } catch (e) {
      // Silently handle Firebase auth reload errors in production
    }
    if (mounted) {
      setState(() {
        // This will trigger a rebuild and call _getUserName() again
      });
    }
  }

  Future<void> _loadDailyQuotes() async {
    try {
      // For development: Force refresh quotes to always get latest from JSON
      // Comment this line and uncomment the next line for production
      final quotes = await QuoteService.getDailyQuotes();
      // final quotes = await QuoteService.getDailyQuotes();

      setState(() {
        _dailyQuotes = quotes;
        _isLoadingQuotes = false;
      });
      _startAutoSlider();
    } catch (e) {
      setState(() => _isLoadingQuotes = false);
    }
  }

  void _startAutoSlider() {
    _timer = Timer.periodic(const Duration(seconds: 4), (timer) {
      if (_dailyQuotes.isNotEmpty) {
        if (_currentPage < _dailyQuotes.length - 1) {
          _currentPage++;
        } else {
          _currentPage = 0;
        }
        if (_pageController.hasClients) {
          _pageController.animateToPage(
            _currentPage,
            duration: const Duration(milliseconds: 350),
            curve: Curves.easeIn,
          );
        }
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    _greetingTimer?.cancel();
    _pageController.dispose();
    _journalController.dispose();
    _habitController.dispose();
    super.dispose();
  }

  String _getUserName() {
    // Return cached name if available to avoid repeated processing
    if (_cachedUserName != null) {
      return _cachedUserName!;
    }

    final user = _authService.currentUser;

    String name = 'Friend'; // Default name

    if (user != null) {
      if (user.displayName != null && user.displayName!.isNotEmpty) {
        String displayName = user.displayName!.trim();

        // If the display name contains '@', it's likely an email-based name
        if (displayName.contains('@')) {
          String emailName = displayName.split('@').first;
          name = emailName[0].toUpperCase() + emailName.substring(1);
        } else {
          // For proper full names from sign-up form, extract the first name
          String firstName = displayName.split(' ').first.trim();
          if (firstName.isNotEmpty) {
            name =
                firstName[0].toUpperCase() +
                firstName.substring(1).toLowerCase();
          } else {
            // If display name doesn't have spaces, use it as is (properly capitalized)
            name =
                displayName[0].toUpperCase() +
                displayName.substring(1).toLowerCase();
          }
        }
      } else if (user.email != null) {
        // Fallback to email-based name
        String emailName = user.email!.split('@').first;
        name =
            emailName[0].toUpperCase() + emailName.substring(1).toLowerCase();
      } else if (user.isAnonymous) {
        name = 'Guest';
      }
    }

    // Cache the result to avoid repeated processing
    _cachedUserName = name;
    return name;
  }

  static const String _journalKey = 'daily_journal_entry';
  static const String _journalDateKey = 'daily_journal_date';
  String _dailyJournalEntry = '';

  Future<void> _loadJournalEntry() async {
    final prefs = await SharedPreferences.getInstance();
    final today = DateTime.now().toIso8601String().split('T')[0];
    final lastEntryDate = prefs.getString(_journalDateKey);

    if (lastEntryDate == today) {
      _dailyJournalEntry = prefs.getString(_journalKey) ?? '';
      _journalController.text = _dailyJournalEntry;
    } else {
      await prefs.remove(_journalKey);
      await prefs.setString(_journalDateKey, today);
      _dailyJournalEntry = '';
      _journalController.clear();
    }
    setState(() {});
  }

  Future<void> _saveJournalEntry() async {
    final entry = _journalController.text;
    if (entry.trim().isEmpty) return;
    final prefs = await SharedPreferences.getInstance();
    final today = DateTime.now().toIso8601String().split('T')[0];
    await prefs.setString(_journalKey, entry);
    await prefs.setString(_journalDateKey, today);
    setState(() {
      _dailyJournalEntry = entry;
      _isEditingJournal = false;
    });
    FocusScope.of(context).unfocus();
  }

  static const String _habitsKey = 'user_habits';
  static const String _habitsDateKey = 'habits_last_reset_date';

  Future<void> _loadHabits() async {
    final prefs = await SharedPreferences.getInstance();
    final today = DateTime.now().toIso8601String().split('T')[0];
    final lastResetDate = prefs.getString(_habitsDateKey);
    final habitsData = prefs.getStringList(_habitsKey);

    if (habitsData != null) {
      _habits = habitsData
          .map((e) => json.decode(e) as Map<String, dynamic>)
          .toList();

      if (lastResetDate != today) {
        for (var habit in _habits) {
          habit['isCompleted'] = false;
        }
        await _saveHabits();
        await prefs.setString(_habitsDateKey, today);
      }
    }
    setState(() {});
  }

  Future<void> _saveHabits() async {
    final prefs = await SharedPreferences.getInstance();
    final habitsData = _habits.map((e) => json.encode(e)).toList();
    await prefs.setStringList(_habitsKey, habitsData);
  }

  void _addHabit(String newHabit) {
    if (newHabit.isNotEmpty) {
      setState(() {
        _habits.add({'title': newHabit, 'isCompleted': false});
      });
      _saveHabits();
      _habitController.clear();
    }
  }

  void _toggleHabitCompletion(int index) {
    setState(() {
      _habits[index]['isCompleted'] = !_habits[index]['isCompleted'];
    });
    _saveHabits();
  }

  void _deleteHabit(int index) {
    setState(() {
      _habits.removeAt(index);
    });
    _saveHabits();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F5F5),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Welcome text
              Text(
                'Welcome back, ${_getUserName()}!',
                style: const TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.w600,
                  color: Colors.black87,
                  letterSpacing: -0.5,
                ),
              ),
              const SizedBox(height: 12),

              // How are you feeling text
              const Text(
                'How are you feeling today?',
                style: TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.w300,
                  color: Colors.black87,
                  height: 1.2,
                ),
              ),
              const SizedBox(height: 32),

              // AI Daily Quotes slider with page indicators
              Column(
                children: [
                  SizedBox(
                    height: 200,
                    child: _isLoadingQuotes
                        ? const Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                CircularProgressIndicator(
                                  valueColor: AlwaysStoppedAnimation<Color>(
                                    Color(0xFF667EEA),
                                  ),
                                ),
                                SizedBox(height: 16),
                                Text(
                                  'Loading daily inspiration...',
                                  style: TextStyle(
                                    color: Colors.black54,
                                    fontSize: 14,
                                  ),
                                ),
                              ],
                            ),
                          )
                        : _dailyQuotes.isEmpty
                        ? Center(
                            child: Container(
                              padding: const EdgeInsets.all(24),
                              decoration: BoxDecoration(
                                gradient: const LinearGradient(
                                  begin: Alignment.topLeft,
                                  end: Alignment.bottomRight,
                                  colors: [
                                    Color(0xFF667EEA),
                                    Color(0xFF764BA2),
                                  ],
                                ),
                                borderRadius: BorderRadius.circular(24),
                              ),
                              child: const Text(
                                'Unable to load quotes. Please check your quotes file.',
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 16,
                                ),
                              ),
                            ),
                          )
                        : PageView.builder(
                            controller: _pageController,
                            itemCount: _dailyQuotes.length,
                            onPageChanged: (page) =>
                                setState(() => _currentPage = page),
                            itemBuilder: (context, index) {
                              return Container(
                                margin: const EdgeInsets.symmetric(
                                  horizontal: 4,
                                ),
                                padding: const EdgeInsets.all(24),
                                decoration: BoxDecoration(
                                  gradient: const LinearGradient(
                                    begin: Alignment.topLeft,
                                    end: Alignment.bottomRight,
                                    colors: [
                                      Color(0xFF667EEA),
                                      Color(0xFF764BA2),
                                    ],
                                  ),
                                  borderRadius: BorderRadius.circular(24),
                                  boxShadow: [
                                    BoxShadow(
                                      color: const Color(
                                        0xFF667EEA,
                                      ).withOpacity(0.3),
                                      blurRadius: 20,
                                      offset: const Offset(0, 10),
                                    ),
                                  ],
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Row(
                                      children: [
                                        Text(
                                          'Daily Inspiration',
                                          style: TextStyle(
                                            color: Colors.white.withOpacity(
                                              0.8,
                                            ),
                                            fontSize: 14,
                                            fontWeight: FontWeight.w500,
                                          ),
                                        ),
                                        const SizedBox(width: 8),
                                        Icon(
                                          Icons.psychology,
                                          size: 16,
                                          color: Colors.white.withOpacity(0.8),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 16),
                                    Text(
                                      _dailyQuotes[index]['quote']!,
                                      style: const TextStyle(
                                        color: Colors.white,
                                        fontSize: 16,
                                        fontWeight: FontWeight.w400,
                                        height: 1.5,
                                        fontStyle: FontStyle.italic,
                                        letterSpacing: 0.3,
                                      ),
                                    ),
                                    const SizedBox(height: 16),
                                    Text(
                                      '— ${_dailyQuotes[index]['author']!}',
                                      style: TextStyle(
                                        color: Colors.white.withOpacity(0.8),
                                        fontSize: 14,
                                        fontStyle: FontStyle.italic,
                                      ),
                                    ),
                                  ],
                                ),
                              );
                            },
                          ),
                  ),

                  // Page indicators (dots)
                  if (!_isLoadingQuotes && _dailyQuotes.isNotEmpty)
                    Padding(
                      padding: const EdgeInsets.only(top: 16),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: List.generate(
                          _dailyQuotes.length,
                          (index) => Container(
                            margin: const EdgeInsets.symmetric(horizontal: 4),
                            width: _currentPage == index ? 24 : 8,
                            height: 8,
                            decoration: BoxDecoration(
                              color: _currentPage == index
                                  ? const Color(0xFF667EEA)
                                  : Colors.grey.shade300,
                              borderRadius: BorderRadius.circular(4),
                            ),
                          ),
                        ),
                      ),
                    ),
                ],
              ),
              const SizedBox(height: 32),

              // Habit Tracker Card
              _buildHabitTrackerCard(),
              const SizedBox(height: 24),

              // Journal reflection
              _buildJournalPrompt(),
              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHabitTrackerCard() {
    final completedHabits = _habits.where((h) => h['isCompleted']).length;
    final progress = _habits.isEmpty ? 0.0 : completedHabits / _habits.length;

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFFF0F9FF),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFF29B6F6).withOpacity(0.2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: const [
                  Icon(
                    Icons.check_circle_outline,
                    color: Color(0xFF00B0FF),
                    size: 20,
                  ),
                  SizedBox(width: 8),
                  Text(
                    'Daily Habits',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: Colors.black87,
                    ),
                  ),
                ],
              ),
              IconButton(
                icon: const Icon(
                  Icons.add_circle_outline,
                  color: Color(0xFF00B0FF),
                ),
                onPressed: _showAddHabitDialog,
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Habits list
          if (_habits.isEmpty)
            Center(
              child: Column(
                children: [
                  const Text(
                    'No habits added yet.',
                    style: TextStyle(fontSize: 14, color: Colors.black54),
                  ),
                  const SizedBox(height: 8),
                  GestureDetector(
                    onTap: _showAddHabitDialog,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 8,
                      ),
                      decoration: BoxDecoration(
                        color: const Color(0xFF00B0FF).withOpacity(0.1),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: const Text(
                        'Add your first habit',
                        style: TextStyle(
                          color: Color(0xFF00B0FF),
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            )
          else
            Column(
              children: [
                ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: _habits.length,
                  itemBuilder: (context, index) {
                    final habit = _habits[index];
                    return Padding(
                      padding: const EdgeInsets.symmetric(vertical: 8.0),
                      child: Row(
                        children: [
                          GestureDetector(
                            onTap: () => _toggleHabitCompletion(index),
                            child: Container(
                              width: 24,
                              height: 24,
                              decoration: BoxDecoration(
                                color: habit['isCompleted']
                                    ? const Color(0xFF00B0FF)
                                    : Colors.white,
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(
                                  color: habit['isCompleted']
                                      ? Colors.transparent
                                      : Colors.grey.shade300,
                                ),
                              ),
                              child: habit['isCompleted']
                                  ? const Icon(
                                      Icons.check,
                                      size: 16,
                                      color: Colors.white,
                                    )
                                  : null,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              habit['title'],
                              style: TextStyle(
                                fontSize: 16,
                                color: habit['isCompleted']
                                    ? Colors.black54
                                    : Colors.black87,
                                decoration: habit['isCompleted']
                                    ? TextDecoration.lineThrough
                                    : null,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                          IconButton(
                            icon: const Icon(
                              Icons.delete_outline,
                              color: Colors.red,
                            ),
                            onPressed: () => _deleteHabit(index),
                          ),
                        ],
                      ),
                    );
                  },
                ),

                const SizedBox(height: 20),

                // Progress bar and text below habits
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(20),
                      child: LinearProgressIndicator(
                        value: progress,
                        minHeight: 6, // thinner bar
                        backgroundColor: Colors.grey.shade200,
                        color: const Color(0xFF00B0FF),
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      '$completedHabits/${_habits.length} completed',
                      style: const TextStyle(
                        fontSize: 12,
                        color: Colors.black54,
                      ),
                    ),
                  ],
                ),
              ],
            ),
        ],
      ),
    );
  }

  void _showAddHabitDialog() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          backgroundColor: Colors.white,
          title: const Text(
            'Add New Habit',
            style: TextStyle(color: Colors.black87),
          ),
          content: TextField(
            controller: _habitController,
            autofocus: true,
            style: const TextStyle(color: Colors.black),
            decoration: const InputDecoration(
              hintText: 'e.g., Drink 8 glasses of water',
              hintStyle: TextStyle(color: Colors.black54),
              enabledBorder: UnderlineInputBorder(
                borderSide: BorderSide(color: Colors.black38),
              ),
              focusedBorder: UnderlineInputBorder(
                borderSide: BorderSide(color: Color(0xFF00B0FF)),
              ),
            ),
            onSubmitted: (value) {
              _addHabit(value);
              Navigator.of(context).pop();
            },
          ),
          actions: [
            TextButton(
              child: const Text(
                'Cancel',
                style: TextStyle(color: Colors.black54),
              ),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
            TextButton(
              child: const Text(
                'Add',
                style: TextStyle(color: Color(0xFF00B0FF)),
              ),
              onPressed: () {
                _addHabit(_habitController.text);
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }

  Widget _buildJournalPrompt() {
    final prompts = [
      "What am I grateful for today?",
      "What challenged me today and how did I handle it?",
      "What brought me joy this week?",
      "How can I show myself compassion today?",
    ];

    final randomPrompt = prompts[DateTime.now().day % prompts.length];

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFFFFF8E1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFFFB74D).withOpacity(0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  const Icon(
                    Icons.edit_note,
                    color: Color(0xFFFF9800),
                    size: 20,
                  ),
                  const SizedBox(width: 8),
                  const Text(
                    'Journal Reflection',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: Colors.black87,
                    ),
                  ),
                ],
              ),
              if (_isEditingJournal)
                GestureDetector(
                  onTap: _saveJournalEntry,
                  child: Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: Colors.grey.shade300),
                    ),
                    child: const Icon(
                      Icons.check,
                      size: 20,
                      color: Color(0xFF4CAF50),
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            randomPrompt,
            style: const TextStyle(
              fontSize: 15,
              color: Colors.black87,
              fontStyle: FontStyle.italic,
              height: 1.4,
            ),
          ),
          const SizedBox(height: 16),
          TextField(
            controller: _journalController,
            onTap: () {
              setState(() {
                _isEditingJournal = true;
              });
            },
            decoration: InputDecoration(
              hintText: 'Write your thoughts here...',
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide.none,
              ),
              filled: true,
              fillColor: Colors.white,
            ),
            style: const TextStyle(color: Colors.black),
            maxLines: null,
            onSubmitted: (value) => _saveJournalEntry(),
          ),
        ],
      ),
    );
  }
}
