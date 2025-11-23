# 🌳 Dr. Swatantra AI - Kalpvraksha App
## Complete Technical Documentation & Project Overview

---

## 📋 Table of Contents
1. [App Architecture & Technology Stack](#1-app-architecture--technology-stack)
2. [Current Features in Phase 1](#2-current-features-in-phase-1)
3. [Planned Enhancements for Phase 2](#3-planned-enhancements-for-phase-2)
4. [UI/UX References](#4-uiux-references)
5. [Testing & Deployment Information](#5-testing--deployment-information)
6. [API & Data Integrations](#6-api--data-integrations)

---

## 🧩 1. App Architecture & Technology Stack

### **Framework & Development Platform**
- **Mobile Framework**: Flutter (SDK >=3.8.0 <4.0.0)
- **Programming Language**: Dart
- **Development Environment**: Android Studio / VS Code
- **Version Control**: Git (GitHub repository: `CodeXdhruv/Kalpvraksha`)
- **Current Branch**: `newUI`

### **Backend Platform & Services**
| Service | Technology | Purpose |
|---------|-----------|---------|
| **Authentication** | Firebase Authentication | User login, Google Sign-In, account management |
| **Database** | Cloud Firestore | User profiles, preferences, chat history storage |
| **Error Tracking** | Firebase Crashlytics | Production crash reporting and analytics |
| **Voice Processing** | Python Flask Server | Real-time voice interaction backend |
| **API Management** | RESTful APIs | Communication between Flutter and backend services |

### **AI Engine & Machine Learning**
| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Primary AI Model** | Google Gemini 2.0 Flash | Latest | Chat responses, conversational AI |
| **Embedding Model** | Google Generative AI Embedding | Latest | RAG (Retrieval Augmented Generation) |
| **Voice AI** | Gemini Live API | Latest | Real-time voice conversations |
| **NLP Processing** | Google Generative AI | v0.4.7 | Natural language understanding |

**Key AI Features:**
- **RAG Implementation**: 360+ pre-computed embeddings from knowledge base (assets/book.txt - 281KB)
- **Contextual Memory**: Chat summarization for maintaining conversation context
- **Dual System Prompts**: Separate optimized prompts for voice vs text chat
- **Streaming Responses**: Real-time AI response generation

### **Database Architecture**
**Type**: NoSQL (Cloud Firestore)

**Collections Structure:**
```
users/
├── {userId}
│   ├── email: string
│   ├── displayName: string
│   ├── photoURL: string
│   ├── createdAt: timestamp
│   ├── lastLogin: timestamp
│   └── preferences/
│       ├── theme: string (light/dark)
│       ├── voiceGender: string
│       ├── voicePitch: number
│       └── voiceRate: number
```

### **Core Technology Dependencies**
```yaml
Core Framework:
- flutter (SDK)
- flutter_screenutil: ^5.9.0        # Responsive UI

Firebase Services:
- firebase_core: ^3.1.1             # Firebase initialization
- firebase_auth: ^5.1.0             # User authentication
- cloud_firestore: ^5.0.2           # Database
- firebase_crashlytics: ^4.1.4      # Error tracking
- google_sign_in: ^6.2.1            # Google OAuth

AI & Machine Learning:
- google_generative_ai: ^0.4.7      # Gemini AI integration
- http: ^1.2.1                       # API communication

Voice Features:
- speech_to_text: ^7.3.0            # Speech recognition
- flutter_tts: ^4.1.0               # Text-to-speech

State Management:
- provider: ^6.1.2                  # State management pattern

UI & Utilities:
- cached_network_image: ^3.4.1      # Image caching
- url_launcher: ^6.3.0              # External links
- image_picker: ^1.1.2              # Profile photos
- flutter_dotenv: ^5.2.1            # Environment variables
- shared_preferences: ^2.3.2        # Local storage
```

### **Python Backend Stack**
```python
# Voice Processing Server (server/app.py)
Flask                    # Web server framework
google-generativeai      # Gemini API client
pyaudio                  # Audio I/O
sounddevice             # Audio recording
numpy                   # Audio processing
```

### **Project File Structure**
```
Kalpvraksha/
├── lib/                              # Flutter application code
│   ├── main.dart                     # App entry point
│   ├── auth_wrapper.dart             # Authentication routing
│   ├── main_navigation.dart          # Bottom navigation (5 tabs)
│   ├── splash_screen.dart            # App launch screen
│   │
│   ├── pages/                        # UI Screens
│   │   ├── auth/                     # Authentication pages
│   │   │   ├── login_page.dart
│   │   │   ├── signup_page.dart
│   │   │   ├── forgot_password_page.dart
│   │   │   └── google_user_details_page.dart
│   │   ├── home_page.dart            # Dashboard & daily quotes
│   │   ├── explore_page.dart         # Content discovery
│   │   ├── voice_page.dart           # Voice assistant interface
│   │   ├── chatbot_page.dart         # Text chat interface
│   │   ├── profile_page.dart         # User profile & settings
│   │   ├── consultant_chatbot_page.dart  # Specialized consultant
│   │   └── wellness_consultant_page.dart # Wellness guidance
│   │
│   ├── services/                     # Backend integration
│   │   ├── auth_service.dart         # Firebase auth wrapper
│   │   ├── gemini_service.dart       # AI chat & RAG engine
│   │   ├── voice_assistant_service.dart  # Voice orchestration
│   │   └── youtube_service.dart      # Video content integration
│   │
│   ├── providers/                    # State management
│   │   └── theme_provider.dart       # Dark/light theme
│   │
│   ├── widgets/                      # Reusable UI components
│   │   ├── custom_button.dart
│   │   ├── message_bubble.dart
│   │   └── voice_visualizer.dart
│   │
│   └── utils/                        # Utilities
│       ├── logger.dart               # Production-safe logging
│       └── constants.dart            # App constants
│
├── server/                           # Python backend
│   └── app.py                        # Flask voice server
│
├── android/                          # Android-specific config
│   ├── app/
│   │   ├── build.gradle.kts          # Build configuration
│   │   ├── google-services.json      # Firebase config
│   │   └── src/main/AndroidManifest.xml
│   └── key.properties               # Release signing config
│
├── assets/                           # Application assets
│   ├── app_logo.png                  # App icon (229KB)
│   ├── splash.png                    # Splash screen (163KB)
│   ├── book.txt                      # RAG knowledge base (281KB)
│   ├── quotes.json                   # Daily inspirational quotes
│   └── [content images]              # UI content assets
│
├── .env                              # Environment variables (API keys)
├── pubspec.yaml                      # Flutter dependencies
└── README.md                         # Project documentation
```

---

## 🚀 2. Current Features in Phase 1

### ✅ **Implemented & Functional Features**

#### **1. Authentication & User Management**
| Feature | Status | Technology |
|---------|--------|-----------|
| Email/Password Login | ✅ Live | Firebase Auth |
| Google Sign-In | ✅ Live | Firebase Auth + Google OAuth |
| Anonymous Access | ✅ Live | Firebase Anonymous Auth |
| Password Reset | ✅ Live | Firebase Auth Email |
| User Profile Management | ✅ Live | Firestore + Firebase Storage |
| Profile Photo Upload | ✅ Live | Image Picker + Firebase Storage |

#### **2. AI-Powered Chatbot (Dr. Swatantra AI)**
| Feature | Status | Details |
|---------|--------|---------|
| Text-based Chat | ✅ Live | Gemini 2.0 Flash model |
| RAG (Knowledge Base) | ✅ Live | 360 pre-computed embeddings from book.txt |
| Context Persistence | ✅ Live | Session-based chat history with summarization |
| Streaming Responses | ✅ Live | Real-time AI response generation |
| Custom System Prompt | ✅ Live | Dr. Swatantra AI personality (spiritual guide) |
| Multi-turn Conversations | ✅ Live | Maintains context across exchanges |
| Conversation Reset | ✅ Live | Clear history and start fresh |

**Chatbot Capabilities:**
- Holistic health guidance (medicine-free approach)
- Spiritual awakening and self-realization guidance
- Mental wellness and stress management
- Natural healing recommendations
- Diet and lifestyle advice
- Atmik Intelligence Training concepts
- Muktiya Villages initiative information

#### **3. Voice Assistant**
| Feature | Status | Technology |
|---------|--------|-----------|
| Speech-to-Text (STT) | ✅ Live | speech_to_text plugin |
| Text-to-Speech (TTS) | ✅ Live | flutter_tts plugin |
| Voice Interaction Loop | ✅ Live | Custom voice service |
| Real-time Voice AI | ✅ Live | Gemini Live API (Python backend) |
| Voice Customization | ✅ Live | Pitch, rate, volume, gender selection |
| Language Support | ✅ Live | English (en-US) default |
| Conversation History | ✅ Live | Session-based memory with summarization |

**Voice Features:**
- Hands-free interaction
- Natural conversation flow
- Interrupt and resume capability
- Voice feedback visualization
- Customizable voice parameters

#### **4. Home Dashboard**
| Feature | Status | Details |
|---------|--------|---------|
| Daily Quotes | ✅ Live | Rotates inspirational wellness quotes from quotes.json |
| Welcome Banner | ✅ Live | Personalized greeting based on user profile |
| Quick Actions | ✅ Live | Fast access to chat, voice, explore |
| Theme Toggle | ✅ Live | Dark/light mode switching |

#### **5. Explore Section**
| Feature | Status | Content Type |
|---------|--------|-------------|
| Wellness Articles | ✅ Live | Curated health & spiritual content |
| Featured Content | ✅ Live | Book recommendations, videos |
| YouTube Integration | ✅ Live | Embedded video player for Dr. Swatantra's content |
| Content Categories | ✅ Live | Health, Spirituality, Prosperity, Peace |

**Content Themes:**
- The Golden Years (book by Dr. Swatantra Jain)
- Universal Religion of Humanity
- Muktiya Villages concept
- Atmik Intelligence Training
- Natural healing practices

#### **6. Profile & Settings**
| Feature | Status | Details |
|---------|--------|---------|
| Profile Viewing | ✅ Live | Display name, email, photo |
| Profile Editing | ✅ Live | Update personal information |
| Photo Management | ✅ Live | Upload/change profile picture |
| Theme Preferences | ✅ Live | Dark/light theme toggle |
| Voice Settings | ✅ Live | TTS customization (pitch, rate, volume, gender) |
| Sign Out | ✅ Live | Secure logout with session cleanup |

#### **7. UI/UX Features**
| Feature | Status | Implementation |
|---------|--------|---------------|
| Responsive Design | ✅ Live | flutter_screenutil (392x844 base) |
| Dark/Light Theme | ✅ Live | Provider-based theme switching |
| Smooth Animations | ✅ Live | Flutter animations & transitions |
| Bottom Navigation | ✅ Live | 5-tab navigation with icons |
| Glassmorphism Effects | ✅ Live | Backdrop blur for modern UI |
| Gradient Backgrounds | ✅ Live | Soothing color schemes |
| Loading States | ✅ Live | Shimmer effects, progress indicators |
| Error Handling | ✅ Live | User-friendly error messages |

#### **8. Performance & Optimization**
| Feature | Status | Details |
|---------|--------|---------|
| Image Caching | ✅ Live | cached_network_image for performance |
| Asset Optimization | ✅ Live | Optimized images (total: ~2.8MB) |
| Code Obfuscation | ✅ Live | ProGuard/R8 enabled for release |
| Crashlytics | ✅ Live | Production error tracking |
| Production Logging | ✅ Live | Debug logs disabled in release builds |

---

## 🔮 3. Planned Enhancements for Phase 2

### **🎯 Priority Enhancements (Q1-Q2 2026)**

#### **1. Enhanced AI Capabilities**
| Feature | Status | Timeline | Details |
|---------|--------|----------|---------|
| Multi-language Support | 🔄 Planned | Q1 2026 | Hindi, Sanskrit, regional Indian languages |
| Voice Language Switching | 🔄 Planned | Q1 2026 | Real-time language detection & switching |
| Emotion Detection | 🔄 Planned | Q2 2026 | Analyze user emotion from voice tone |
| Personalized AI Training | 🔄 Planned | Q2 2026 | Adapt AI to individual user wellness journey |
| Offline AI Mode | 🔄 Planned | Q2 2026 | Basic AI functionality without internet |

#### **2. 3D Avatar Integration**
| Feature | Status | Timeline | Technology |
|---------|--------|----------|-----------|
| 3D Dr. Swatantra Avatar | 🔄 Planned | Q1 2026 | Unity/Rive animation |
| Lip-sync Animation | 🔄 Planned | Q1 2026 | Real-time TTS lip-sync |
| Gesture Recognition | 🔄 Planned | Q2 2026 | Avatar gestures during conversation |
| Avatar Customization | 🔄 Planned | Q2 2026 | User choice of avatar appearance |

#### **3. Community & Social Features**
| Feature | Status | Timeline | Details |
|---------|--------|----------|---------|
| Discussion Forum | 🔄 Planned | Q1 2026 | Community wellness discussions |
| User Groups | 🔄 Planned | Q1 2026 | Join interest-based wellness groups |
| Success Stories | 🔄 Planned | Q2 2026 | Share healing journeys |
| Expert Sessions | 🔄 Planned | Q2 2026 | Live Q&A with wellness experts |
| Peer Support Network | 🔄 Planned | Q2 2026 | Connect with fellow wellness seekers |

#### **4. Wellness Tracking & Analytics**
| Feature | Status | Timeline | Details |
|---------|--------|----------|---------|
| Health Journal | 🔄 Planned | Q1 2026 | Daily wellness tracking |
| Mood Tracker | 🔄 Planned | Q1 2026 | Emotional wellness monitoring |
| Progress Dashboard | 🔄 Planned | Q1 2026 | Visual analytics of wellness journey |
| Goal Setting | 🔄 Planned | Q2 2026 | Set and track wellness goals |
| Habit Tracker | 🔄 Planned | Q2 2026 | Build healthy habits |
| AI Insights | 🔄 Planned | Q2 2026 | Personalized wellness recommendations |

#### **5. Meditation & Mindfulness**
| Feature | Status | Timeline | Details |
|---------|--------|----------|---------|
| Guided Meditation | 🔄 Planned | Q1 2026 | Audio meditation sessions |
| Breathing Exercises | 🔄 Planned | Q1 2026 | Pranayama guided sessions |
| Yoga Routines | 🔄 Planned | Q2 2026 | Video yoga instruction |
| Meditation Timer | 🔄 Planned | Q1 2026 | Customizable meditation timer |
| Calming Sounds | 🔄 Planned | Q1 2026 | Nature sounds, chants |

#### **6. Donation & Support System**
| Feature | Status | Timeline | Technology |
|---------|--------|----------|-----------|
| Donation Page | 🔄 Planned | Q1 2026 | Razorpay/PayPal integration |
| Subscription Plans | 🔄 Planned | Q1 2026 | Premium features access |
| Sponsor a Village | 🔄 Planned | Q2 2026 | Support Muktiya Villages initiative |
| Charitable Giving | 🔄 Planned | Q2 2026 | Donate to wellness causes |

#### **7. WhatsApp Bot Integration**
| Feature | Status | Timeline | Technology |
|---------|--------|----------|-----------|
| WhatsApp Dr. Swatantra Bot | 🔄 Planned | Q2 2026 | WhatsApp Business API |
| Daily Wellness Tips | 🔄 Planned | Q2 2026 | Scheduled WhatsApp messages |
| Voice Notes Support | 🔄 Planned | Q2 2026 | Voice interaction via WhatsApp |
| Group Wellness Chats | 🔄 Planned | Q2 2026 | Community WhatsApp groups |

#### **8. Content Expansion**
| Feature | Status | Timeline | Details |
|---------|--------|----------|---------|
| Video Library | 🔄 Planned | Q1 2026 | Extended wellness video content |
| Podcast Integration | 🔄 Planned | Q1 2026 | Dr. Swatantra's audio talks |
| Book Library | 🔄 Planned | Q2 2026 | Digital books, PDFs |
| Newsletter | 🔄 Planned | Q1 2026 | Weekly wellness newsletter |

#### **9. Advanced RAG & Knowledge Base**
| Feature | Status | Timeline | Details |
|---------|--------|----------|---------|
| Multi-source RAG | 🔄 Planned | Q1 2026 | Retrieve from multiple books/sources |
| Dynamic KB Updates | 🔄 Planned | Q2 2026 | Update knowledge base without app update |
| Citation Support | 🔄 Planned | Q1 2026 | AI cites sources in responses |
| Knowledge Graph | 🔄 Planned | Q2 2026 | Visual knowledge connections |

#### **10. Platform Expansion**
| Platform | Status | Timeline | Details |
|----------|--------|----------|---------|
| iOS App | 🔄 Planned | Q2 2026 | iPhone/iPad support |
| Web App | 🔄 Planned | Q2 2026 | Browser-based access |
| Desktop Apps | 🔄 Planned | Q3 2026 | Windows/Mac/Linux |
| Wearable Integration | 🔄 Planned | Q3 2026 | Smartwatch companion app |

### **📅 Development Roadmap**

**Q1 2026 (Jan-Mar):**
- Multi-language support (Hindi, Sanskrit)
- 3D Avatar initial release
- Discussion Forum launch
- Guided meditation library
- Donation page & payment integration
- Advanced RAG with citations

**Q2 2026 (Apr-Jun):**
- Emotion detection in voice
- Wellness tracking dashboard
- WhatsApp bot launch
- iOS app release
- Web app beta
- Avatar gestures & customization

**Q3 2026 (Jul-Sep):**
- Desktop apps (Windows, Mac, Linux)
- Wearable integration
- Knowledge graph visualization
- Advanced analytics
- Expert session platform

---

## 🎨 4. UI/UX References

### **Design System**
| Aspect | Implementation |
|--------|---------------|
| **Design Framework** | Custom design with Material Design 3 principles |
| **UI Library** | Flutter Material UI components |
| **Responsive System** | flutter_screenutil (base: 392x844 pixels) |
| **Animation Library** | Flutter Animation API |
| **Icon Set** | Cupertino Icons + Custom SVG icons |

### **Branding & Colors**

#### **Primary Color Palette**
```dart
Light Theme:
- Primary: #6B4BFF (Purple) - Spirituality, wisdom
- Secondary: #FF6B9D (Pink) - Compassion, love
- Accent: #4BFF8F (Green) - Health, vitality
- Background: #FFFFFF (White)
- Surface: #F8F9FA (Light gray)
- Text: #212529 (Dark gray)

Dark Theme:
- Primary: #8B6BFF (Light purple)
- Secondary: #FF8BB9 (Light pink)
- Accent: #6BFFAB (Light green)
- Background: #1A1A2E (Dark blue-black)
- Surface: #16213E (Navy)
- Text: #F8F9FA (Off-white)
```

#### **Gradient Schemes**
```dart
Primary Gradient: [#6B4BFF, #8B6BFF] (Purple tones)
Secondary Gradient: [#FF6B9D, #FF8BB9] (Pink tones)
Wellness Gradient: [#4BFF8F, #6BFFAB] (Green tones)
Sunset Gradient: [#FF6B6B, #FFA500] (Warm tones)
Ocean Gradient: [#4B8BFF, #6BAFFF] (Blue tones)
```

#### **Typography**
```dart
Font Family: System Default (Roboto on Android, SF Pro on iOS)

Heading 1: 32sp, Bold
Heading 2: 24sp, SemiBold
Heading 3: 20sp, Medium
Body Large: 16sp, Regular
Body: 14sp, Regular
Body Small: 12sp, Regular
Caption: 10sp, Light
```

### **UI Components Styling**

#### **Bottom Navigation Bar**
- Height: 70px (responsive)
- Shape: Rounded rectangle (30px radius)
- Effect: Glassmorphism (backdrop blur)
- Icons: 24px, custom colors
- Active indicator: Gradient glow effect
- Voice button: Elevated, larger (48px), pulse animation

#### **Chat Interface**
- User messages: Right-aligned, purple gradient bubble
- AI messages: Left-aligned, gray bubble with avatar
- Bubble radius: 20px (rounded corners)
- Padding: 12px horizontal, 8px vertical
- Font: 14sp body text

#### **Voice Assistant UI**
- Microphone button: 80px circular, gradient
- Voice visualizer: Animated wave bars
- Status indicator: Color-coded (listening/processing/speaking)
- Transcript display: Scrollable text area

#### **Profile Page**
- Avatar: 100px circular with border
- Edit button: Floating action button, bottom-right
- Settings cards: Elevated, 16px radius, shadow
- Toggle switches: Material design switches

### **Supported Languages**
| Language | Status | Code | Voice Support |
|----------|--------|------|---------------|
| English (US) | ✅ Live | en-US | ✅ Full |
| Hindi | 🔄 Phase 2 | hi-IN | 🔄 Planned |
| Sanskrit | 🔄 Phase 2 | sa-IN | 🔄 Planned |
| Gujarati | 🔄 Phase 2 | gu-IN | 🔄 Planned |
| Marathi | 🔄 Phase 2 | mr-IN | 🔄 Planned |

**Current Implementation:**
- UI Text: English only
- Voice Input: English (en-US)
- Voice Output: English with customizable voice parameters
- AI Responses: English (can understand some Hindi in input)

### **Accessibility Features**
| Feature | Status |
|---------|--------|
| Screen Reader Support | ✅ Semantic labels |
| Font Scaling | ✅ Respects system settings |
| High Contrast Mode | ✅ Dark theme |
| Voice Control | ✅ Full voice interaction |
| Color Blind Friendly | ✅ Not reliant on color alone |

### **Platform-Specific Design**
- **Android**: Material Design 3 (primary target)
- **iOS**: Cupertino widgets (planned for Phase 2)
- **Adaptive UI**: Automatically adjusts to platform

---

## 🧪 5. Testing & Deployment Information

### **Current Version**
```yaml
App Name: Dr. Swatantra AI - Kalpvraksha
Package Name: com.example.muktiya_new
Version Name: 1.0.0
Version Code: 1
```

### **Android Platform Support**
| Aspect | Value |
|--------|-------|
| **Minimum SDK** | API 21 (Android 5.0 Lollipop) |
| **Target SDK** | API 34 (Android 14) |
| **Compile SDK** | API 36 (Android 15) |
| **NDK Version** | Latest (via Flutter) |

**Supported Android Versions:**
- ✅ Android 5.0+ (Lollipop) - API 21
- ✅ Android 6.0+ (Marshmallow) - API 23
- ✅ Android 7.0+ (Nougat) - API 24
- ✅ Android 8.0+ (Oreo) - API 26
- ✅ Android 9.0+ (Pie) - API 28
- ✅ Android 10+ - API 29
- ✅ Android 11+ - API 30
- ✅ Android 12+ - API 31
- ✅ Android 13+ - API 33
- ✅ Android 14+ - API 34
- ✅ Android 15+ - API 36

**Device Compatibility:**
- Smartphones (4.5" to 7" screens)
- Tablets (7" to 12" screens)
- Foldable devices
- Chromebooks (with Play Store)

### **Build Artifacts**

#### **Current Build Sizes**
```
Release APK:  56.7 MB  ✅ (Under 100MB Play Store limit)
Release AAB:  50.0 MB  ✅ (Under 150MB Play Store limit)
Debug APK:    ~65 MB
```

#### **Build Configurations**
```gradle
Release Build:
- ProGuard/R8: Enabled (code obfuscation)
- Minification: Enabled
- Shrinking: Enabled
- Signing: Release keystore
- Crashlytics: Enabled
- Debug Logging: Disabled

Debug Build:
- ProGuard/R8: Disabled
- Logging: Verbose
- Crashlytics: Disabled
- Signing: Debug keystore
```

### **Testing Status**

#### **Manual Testing**
| Test Category | Status | Coverage |
|---------------|--------|----------|
| Authentication Flow | ✅ Passed | Email, Google Sign-In, Anonymous |
| Chatbot Functionality | ✅ Passed | Text chat, RAG, context memory |
| Voice Assistant | ✅ Passed | STT, TTS, voice loop |
| Navigation | ✅ Passed | All 5 tabs, transitions |
| Profile Management | ✅ Passed | Edit, photo upload, settings |
| Theme Switching | ✅ Passed | Light/dark mode |
| Network Error Handling | ✅ Passed | Offline mode, error states |
| Memory Leaks | ✅ Passed | No leaks detected |

#### **Device Testing**
| Device Type | Status | Test Devices |
|-------------|--------|-------------|
| Physical Devices | ✅ Tested | Samsung, Xiaomi, OnePlus |
| Emulator | ✅ Tested | Pixel 6, Pixel 7 Pro emulators |
| Tablets | 🔄 Pending | Tablet testing in progress |
| Low-end Devices | ✅ Tested | 2GB RAM, Android 7.0 |

#### **Automated Testing**
| Test Type | Status | Details |
|-----------|--------|---------|
| Unit Tests | 🔄 In Progress | Core service tests |
| Widget Tests | 🔄 In Progress | UI component tests |
| Integration Tests | 🔄 Planned | End-to-end flows |
| Performance Tests | 🔄 Planned | Load & stress testing |

**Test Files:**
- `test/rag_test.dart` - RAG functionality tests
- `test/voice_api_test.dart` - Voice service tests
- `test/widget_test.dart` - UI widget tests

### **Beta Testing**
| Phase | Status | Timeline | Testers |
|-------|--------|----------|---------|
| Internal Alpha | ✅ Complete | Oct 2025 | Development team (5 users) |
| Closed Beta | ✅ Complete | Nov 2025 | Selected users (25 users) |
| Open Beta | 🔄 Current | Nov-Dec 2025 | Public testing (target: 100+ users) |
| Public Release | 🔄 Planned | Jan 2026 | Google Play Store |

**Beta Testing Channels:**
- Google Play Internal Testing Track
- Direct APK distribution (for non-Play Store users)
- Firebase App Distribution

### **Distribution Methods**

#### **Current Distribution**
1. **Direct APK Download**: Available via GitHub releases or direct link
2. **Firebase App Distribution**: Beta tester invitations

#### **Planned Distribution**
1. **Google Play Store** (Primary - Jan 2026)
   - Free app with optional donations
   - In-app updates via Play Store
   - Play Store listing optimization

2. **Alternative App Stores** (Phase 2)
   - Amazon Appstore
   - Samsung Galaxy Store
   - Huawei AppGallery

3. **Direct Distribution**
   - Official website download
   - QR code installation

### **Release Management**

#### **Version Naming Convention**
```
Format: MAJOR.MINOR.PATCH+BUILD
Example: 1.0.0+1

MAJOR: Breaking changes, major features
MINOR: New features, non-breaking changes
PATCH: Bug fixes, minor improvements
BUILD: Incremental build number
```

#### **Release Checklist**
- [x] Code review completed
- [x] All tests passing
- [x] ProGuard rules verified
- [x] API keys secured in .env
- [x] Firebase configuration validated
- [x] Crashlytics enabled
- [x] Privacy policy updated
- [x] Release notes prepared
- [x] Keystore configured
- [ ] Play Store assets ready (screenshots, description)
- [ ] Beta testing complete
- [ ] Security audit passed

### **Performance Benchmarks**
| Metric | Target | Current |
|--------|--------|---------|
| Cold Start Time | <3s | ~2.5s ✅ |
| Hot Start Time | <1s | ~0.8s ✅ |
| AI Response Time | <2s | ~1.5s ✅ |
| RAG Retrieval | <500ms | ~400ms ✅ |
| Voice Loop Latency | <1s | ~800ms ✅ |
| Memory Usage | <150MB | ~120MB ✅ |
| APK Size | <100MB | 56.7MB ✅ |

---

## 🔗 6. API & Data Integrations

### **External APIs & Services**

#### **1. Google Generative AI (Gemini)**
```yaml
Service: Google Gemini API
Purpose: Primary AI chat & voice responses
Model: gemini-2.0-flash-exp
Embedding Model: text-embedding-004
API Version: v1beta
Rate Limits: As per Google AI Studio quota
Authentication: API Key (stored in .env)
Endpoint: https://generativelanguage.googleapis.com/
```

**API Usage:**
- Text chat generation
- Voice conversation (Gemini Live API)
- Embedding generation for RAG
- Context-aware responses
- Multi-turn conversations

**Request Flow:**
```
Flutter App → gemini_service.dart → Google Gemini API → Response
```

#### **2. Firebase Services**
```yaml
Firebase Project: muktiya-new
Services Used:
  - Authentication (Email, Google, Anonymous)
  - Cloud Firestore (User data)
  - Crashlytics (Error tracking)
  - Analytics (Usage tracking)
Region: us-central1
```

**Firebase Authentication:**
- Email/Password: Custom user accounts
- Google OAuth: One-tap sign-in
- Anonymous: Try without account
- Password Reset: Email-based recovery

**Firestore Database Structure:**
```
/users/{userId}
  - email: string
  - displayName: string
  - photoURL: string
  - createdAt: timestamp
  - preferences: map
  
/chat_history/{sessionId}  [Planned Phase 2]
  - userId: string
  - messages: array
  - timestamp: timestamp
```

#### **3. YouTube Data API** (Indirect)
```yaml
Service: YouTube video embedding
Purpose: Display wellness videos in Explore
Integration: url_launcher for external links
Authentication: None (public videos)
```

**Video Integration:**
- Embedded YouTube player
- Video metadata fetching
- Playlist integration (Phase 2)

#### **4. Python Flask Backend** (Voice Processing)
```yaml
Service: Local/Cloud Flask server
Purpose: Real-time voice AI processing
Port: 5000 (configurable)
Endpoints:
  - POST /start_voice: Initialize voice loop
  - POST /stop_voice: Stop voice interaction
  - GET /get_transcription: Fetch transcript
Technology: Flask + PyAudio + Gemini Live API
```

### **Authentication & Security**

#### **Authentication Methods**
| Method | Provider | Implementation |
|--------|----------|---------------|
| Email/Password | Firebase Auth | Custom forms with validation |
| Google Sign-In | Firebase Auth + Google OAuth | One-tap sign-in button |
| Anonymous | Firebase Auth | Guest access (limited features) |

**Security Measures:**
```dart
1. API Key Security:
   - Stored in .env file (not committed to Git)
   - Loaded via flutter_dotenv
   - Never hardcoded in source

2. Firebase Security Rules:
   - User data readable only by authenticated users
   - Write access restricted to document owner
   - Admin operations server-side only

3. HTTPS Enforcement:
   - All network traffic over HTTPS
   - Cleartext traffic disabled (network_security_config.xml)
   - Certificate pinning (planned Phase 2)

4. Code Obfuscation:
   - ProGuard/R8 enabled for release builds
   - Class & method name obfuscation
   - Asset encryption (planned Phase 2)

5. Permissions:
   - Minimum required permissions only
   - Runtime permission requests
   - User consent for sensitive operations
```

#### **Required Android Permissions**
```xml
<!-- Essential Permissions -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.WAKE_LOCK" />

<!-- Removed Permissions (security hardening) -->
<!-- WRITE_EXTERNAL_STORAGE - No longer needed -->
```

### **Analytics & Tracking**

#### **Firebase Analytics**
```yaml
Service: Firebase Analytics
Events Tracked:
  - App opens (session_start)
  - Screen views (screen_view)
  - Chat interactions (chat_message_sent)
  - Voice interactions (voice_session_start)
  - Feature usage (feature_used)
  - Errors (app_exception)
  - Conversions (donation_completed) [Phase 2]
Privacy: No PII collected, anonymized data
```

**Key Metrics:**
- Daily Active Users (DAU)
- Monthly Active Users (MAU)
- Session duration
- Feature engagement
- Retention rates
- Crash-free rate

#### **Firebase Crashlytics**
```yaml
Service: Firebase Crashlytics
Purpose: Production error tracking
Features:
  - Automatic crash reporting
  - Custom logging
  - User identification (anonymized)
  - Stack trace analysis
  - Issue prioritization
Enabled: Release builds only (disabled in debug)
```

**Error Tracking:**
```dart
// Production-safe error logging
Logger.error('Error message', error: e, stackTrace: st);

// Crashlytics records all unhandled exceptions
FlutterError.onError = FirebaseCrashlytics.instance.recordFlutterFatalError;
```

### **Data Storage & Caching**

#### **Local Storage (SharedPreferences)**
```yaml
Purpose: User preferences, app state
Data Stored:
  - Theme preference (light/dark)
  - Voice settings (pitch, rate, volume, gender)
  - Onboarding completion status
  - Last login timestamp
  - Language preference [Phase 2]
Encryption: None (non-sensitive data)
```

#### **Image Caching (cached_network_image)**
```yaml
Purpose: Profile photos, content images
Cache Location: App cache directory
Cache Duration: 7 days default
Max Size: 100MB
Eviction: LRU (Least Recently Used)
```

#### **RAG Knowledge Base**
```yaml
File: assets/book.txt
Size: 281KB
Chunks: 360 chunks (pre-computed)
Embeddings: 360 vectors (768 dimensions)
Loading: On app launch or first chat
Storage: In-memory (cached during session)
Update Mechanism: App update (Phase 2: dynamic updates)
```

### **Network Configuration**

#### **Network Security Config**
```xml
<!-- res/xml/network_security_config.xml -->
<network-security-config>
  <!-- Enforce HTTPS only -->
  <base-config cleartextTrafficPermitted="false">
    <trust-anchors>
      <certificates src="system" />
    </trust-anchors>
  </base-config>
  
  <!-- Allow localhost for development -->
  <domain-config cleartextTrafficPermitted="true">
    <domain includeSubdomains="true">localhost</domain>
    <domain includeSubdomains="true">127.0.0.1</domain>
  </domain-config>
</network-security-config>
```

#### **API Endpoints**
```yaml
Primary APIs:
  - Gemini AI: https://generativelanguage.googleapis.com/
  - Firebase Auth: https://identitytoolkit.googleapis.com/
  - Firestore: https://firestore.googleapis.com/
  - Firebase Storage: https://firebasestorage.googleapis.com/
  
Voice Backend (Development):
  - Local: http://localhost:5000
  - Production: https://voice.kalpvraksha.ai [Planned]
```

### **Third-Party Integrations**

#### **Current Integrations**
| Service | Purpose | Status |
|---------|---------|--------|
| Google AI Studio | Gemini API management | ✅ Active |
| Firebase Console | Backend management | ✅ Active |
| GitHub | Version control, CI/CD | ✅ Active |

#### **Planned Integrations (Phase 2)**
| Service | Purpose | Timeline |
|---------|---------|----------|
| Razorpay | Payment processing | Q1 2026 |
| PayPal | International donations | Q1 2026 |
| WhatsApp Business API | Chatbot on WhatsApp | Q2 2026 |
| Twilio | SMS notifications | Q2 2026 |
| SendGrid | Email newsletters | Q2 2026 |
| Google Tag Manager | Advanced analytics | Q2 2026 |

### **Content Delivery**

#### **Static Assets**
```yaml
Delivery: Bundled with app
Location: assets/ directory
Total Size: ~2.8MB
Assets:
  - app_logo.png (229KB)
  - splash.png (163KB)
  - book.txt (281KB)
  - quotes.json (2KB)
  - Content images (~2.1MB)
```

#### **Dynamic Content** (Phase 2)
```yaml
CDN: Firebase Hosting / Cloudflare
Purpose: Dynamic knowledge base updates, videos
Format: JSON, MP4, PDF
Update Frequency: Weekly
Caching: 24 hours
```

### **API Rate Limits & Quotas**

#### **Google Gemini API**
```yaml
Free Tier (Current):
  - 60 requests per minute
  - 1,500 requests per day
  - No cost

Paid Tier (If needed):
  - Higher rate limits
  - Priority support
  - Production SLA
```

#### **Firebase**
```yaml
Spark Plan (Free - Current):
  - Firestore: 50K reads/day, 20K writes/day
  - Authentication: Unlimited
  - Storage: 5GB
  - Hosting: 10GB/month
  
Blaze Plan (Pay-as-you-go - Future):
  - Scales automatically
  - Based on actual usage
```

### **Monitoring & Observability**

#### **Production Monitoring**
```yaml
Tools:
  - Firebase Crashlytics: Crash reporting
  - Firebase Analytics: Usage analytics
  - Firebase Performance: App performance
  - Custom Logger: Production-safe logging

Alerts:
  - Crash rate > 1%
  - API error rate > 5%
  - Response time > 3s
  - Daily active users drop > 20%
```

---

## 📞 Contact & Support

**Development Team:**
- Lead Developer: CodeXdhruv
- Repository: https://github.com/CodeXdhruv/Kalpvraksha
- Branch: newUI

**App Version:** 1.0.0+1  
**Last Updated:** November 2025  
**Status:** Production-Ready (Beta Testing)

---

**Note:** This documentation reflects the current state of the Dr. Swatantra AI - Kalpvraksha app as of November 2025. Features and specifications are subject to change as development progresses.
