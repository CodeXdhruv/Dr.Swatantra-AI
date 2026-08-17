import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
} from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Settings2, Mic, Send, Info } from "lucide-react-native";
import { ChatService } from "../../api";
import Svg, {
  Path,
  Circle,
  Defs,
  RadialGradient,
  Stop,
} from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  interpolate,
  Easing,
  withSpring,
  runOnJS,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");
const GOLD = "#D9A05B";
const NAVY = "#1C2A3A";
const BG = "#FCFAF8";

const LotusIcon = ({ size = 120, color = GOLD }) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Center line */}
      <Path d="M50 25 L50 95" />
      {/* Left curve */}
      <Path d="M15 90 C 35 85, 48 60, 48 25" />
      {/* Right curve */}
      <Path d="M85 90 C 65 85, 52 60, 52 25" />
      {/* Top dot */}
      <Circle cx="50" cy="12" r="3.5" fill={color} stroke="none" />
    </Svg>
  );
};

const ChatBubbleIcon = () => (
  <Svg
    width="80"
    height="80"
    viewBox="0 0 100 100"
    fill="none"
    stroke={GOLD}
    strokeWidth="1.5"
    style={{ marginBottom: -5 }}
  >
    <Path d="M 15 40 C 15 15, 85 15, 85 40 C 85 60, 65 70, 55 70 L 50 85 L 45 70 C 35 70, 15 60, 15 40 Z" />
    <Circle cx="35" cy="40" r="3" fill={GOLD} stroke="none" />
    <Circle cx="50" cy="40" r="3" fill={GOLD} stroke="none" />
    <Circle cx="65" cy="40" r="3" fill={GOLD} stroke="none" />
  </Svg>
);

export default function ChatScreen({ isBackground = false }: { isBackground?: boolean }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  const [messages, setMessages] = useState<{ id: string; text: string; role: "user" | "ai" }[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const pulse = useSharedValue(0);
  const ringRotate = useSharedValue(0);

  // Slide animation
  const translateX = useSharedValue(params.fromSwipe ? width : 0);

  useEffect(() => {
    if (!isBackground) {
      pulse.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true,
      );

      ringRotate.value = withRepeat(
        withTiming(360, { duration: 20000, easing: Easing.linear }),
        -1,
        false,
      );
    }

    // Slide in on mount if from swipe
    if (params.fromSwipe && !isBackground) {
      translateX.value = withSpring(0, { damping: 22, stiffness: 250, mass: 0.5, overshootClamping: true });
    }
  }, [isBackground]);

  const animatedGlow = useAnimatedStyle(() => {
    return {
      opacity: interpolate(pulse.value, [0, 1], [0.4, 0.8]),
      transform: [{ scale: interpolate(pulse.value, [0, 1], [0.95, 1.05]) }],
    };
  });

  const animatedRing = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${ringRotate.value}deg` }],
    };
  });

  const panGesture = Gesture.Pan()
    .onChange((event) => {
      if (event.translationX > 0) {
        translateX.value = event.translationX;
      }
    })
    .onEnd((event) => {
      if (event.translationX > width / 4 || event.velocityX > 500) {
        translateX.value = withSpring(width, { damping: 22, stiffness: 250, mass: 0.5, overshootClamping: true }, () => {
          runOnJS(router.replace)({
            pathname: "/voice",
            params: { fromSwipe: "true" },
          });
        });
      } else {
        translateX.value = withSpring(0, { damping: 22, stiffness: 250, mass: 0.5 });
      }
    });

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;
    
    const userMessage = { id: Date.now().toString(), text: inputText.trim(), role: "user" as const };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);
    Keyboard.dismiss();

    try {
      const response = await ChatService.sendTextChatMessage(userMessage.text, "test-user-123");
      const aiMessage = { 
        id: (Date.now() + 1).toString(), 
        text: response.response || "Sorry, I couldn't understand that.", 
        role: "ai" as const 
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = { 
        id: (Date.now() + 1).toString(), 
        text: "Oops, something went wrong. Please try again.", 
        role: "ai" as const 
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = ({ item }: { item: { id: string; text: string; role: "user" | "ai" } }) => {
    const isUser = item.role === "user";
    return (
      <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.aiBubble]}>
        <Text style={[styles.messageText, isUser ? styles.userMessageText : styles.aiMessageText]}>
          {item.text}
        </Text>
      </View>
    );
  };

  const animatedScreenStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const screenContent = (
    <Animated.View
      style={[
        styles.container,
        { paddingTop: insets.top + 10 },
        !isBackground && animatedScreenStyle,
        isBackground && { position: 'absolute', width, height, zIndex: -1 }
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.iconButton}
        >
          <ArrowLeft color={NAVY} size={24} strokeWidth={1.5} />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>AI Chat</Text>
        </View>

        <TouchableOpacity style={styles.iconButton}>
          <Settings2 color={NAVY} size={24} strokeWidth={1.5} />
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, justifyContent: "space-between" }}>
        {messages.length === 0 ? (
          <View style={{ flex: 1, justifyContent: "center" }}>
            {/* Main Orbital UI */}
            <View style={styles.orbContainer}>
              <Animated.View
                style={[styles.outerCircle, { width: 380, height: 380 }]}
              />
              <Animated.View
                style={[styles.outerCircle, { width: 320, height: 320 }]}
              />

              <Animated.View style={[styles.dottedRingContainer, animatedRing]}>
                <Svg width={260} height={260}>
                  <Circle
                    cx="130"
                    cy="130"
                    r="129"
                    stroke={GOLD}
                    strokeWidth="1"
                    strokeDasharray="2, 6"
                    fill="none"
                    opacity="0.5"
                  />
                  <Circle cx="130" cy="1" r="3" fill="#FFF" />
                  <Circle cx="130" cy="1" r="5" fill={GOLD} opacity="0.5" />
                  <Circle cx="1" cy="130" r="3" fill="#FFF" />
                  <Circle cx="1" cy="130" r="5" fill={GOLD} opacity="0.5" />
                  <Circle cx="259" cy="130" r="3" fill="#FFF" />
                  <Circle cx="259" cy="130" r="5" fill={GOLD} opacity="0.5" />
                  <Circle cx="130" cy="259" r="3" fill="#FFF" />
                  <Circle cx="130" cy="259" r="5" fill={GOLD} opacity="0.5" />
                </Svg>
              </Animated.View>

              <Animated.View style={[styles.centerGlow, animatedGlow]}>
                <Svg width="200" height="200">
                  <Defs>
                    <RadialGradient
                      id="grad"
                      cx="50%"
                      cy="50%"
                      r="50%"
                      fx="50%"
                      fy="50%"
                    >
                      <Stop offset="0%" stopColor="#FFF" stopOpacity="1" />
                      <Stop offset="50%" stopColor={GOLD} stopOpacity="0.4" />
                      <Stop offset="100%" stopColor={BG} stopOpacity="0" />
                    </RadialGradient>
                  </Defs>
                  <Circle cx="100" cy="100" r="100" fill="url(#grad)" />
                </Svg>
              </Animated.View>

              {/* Central Art */}
              <View style={styles.artWrapper}>
                <ChatBubbleIcon />
                <LotusIcon size={120} color={GOLD} />
                <View style={styles.reflection}>
                  <LotusIcon size={120} color={GOLD} />
                </View>
              </View>
            </View>

            {/* Text Section */}
            <View style={styles.textSection}>
              <Text style={styles.assistTitle}>
                How can I assist you today?
              </Text>
              <Text style={styles.assistSubtitle}>
                Ask anything • Learn anything • Grow together
              </Text>

              <View style={styles.swipeHint}>
                <Info size={12} color={GOLD} />
                <Text style={styles.swipeHintText}>Swipe right for Voice</Text>
              </View>

              <View style={styles.separator}>
                <View style={styles.line} />
                <LotusIcon size={20} color={GOLD} />
                <View style={styles.line} />
              </View>
            </View>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={item => item.id}
            renderItem={renderMessage}
            contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 20, flexGrow: 1 }}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
            keyboardShouldPersistTaps="handled"
          />
        )}

        {/* Input Box */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "padding"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
          enabled={!isBackground}
        >
          <View
            style={[
              styles.inputWrapper,
              { paddingBottom: Math.max(24, insets.bottom + 20) },
            ]}
          >
            <View style={styles.inputBox}>
              <TextInput
                style={styles.textInput}
                placeholder="Type your message..."
                placeholderTextColor="#A0A0A0"
                editable={!isBackground}
                value={inputText}
                onChangeText={setInputText}
                onSubmitEditing={handleSend}
              />
              <TouchableOpacity style={styles.micButton}>
                <Mic color={GOLD} size={22} strokeWidth={1.5} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  <Send
                    color="#FFF"
                    size={16}
                    strokeWidth={2}
                    style={{ marginLeft: 2 }}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Animated.View>
  );

  if (isBackground) {
    return (
      <View style={[StyleSheet.absoluteFill, { zIndex: -1 }]} pointerEvents="none">
        {screenContent}
      </View>
    );
  }

  const VoiceScreen = require('../voice').default;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={panGesture}>
        <View style={{ flex: 1 }}>
          <View style={[StyleSheet.absoluteFill, { zIndex: -1 }]}>
            <VoiceScreen isBackground />
          </View>
          {screenContent}
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 4,
  },
  iconButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitleContainer: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: NAVY,
    fontFamily: "Georgia", // using serif-like standard for premium feel
  },
  headerSubtitle: {
    fontSize: 12,
    color: GOLD,
    fontWeight: "500",
    letterSpacing: 0.5,
    marginTop: 4,
  },
  orbContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    minHeight: 380,
  },
  outerCircle: {
    position: "absolute",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: GOLD,
    opacity: 0.15,
  },
  dottedRingContainer: {
    position: "absolute",
    width: 260,
    height: 260,
    justifyContent: "center",
    alignItems: "center",
  },
  centerGlow: {
    position: "absolute",
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  artWrapper: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  reflection: {
    opacity: 0.2,
    transform: [{ scaleY: -0.4 }, { translateY: -60 }],
    marginTop: -40,
  },
  textSection: {
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  assistTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: NAVY,
    fontFamily: "Georgia",
    marginBottom: 8,
  },
  assistSubtitle: {
    fontSize: 13,
    color: "#8C8C8C",
    letterSpacing: 0.2,
  },
  swipeHint: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    opacity: 0.6,
  },
  swipeHintText: {
    fontSize: 12,
    color: GOLD,
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  separator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    gap: 12,
  },
  line: {
    height: 1,
    width: 40,
    backgroundColor: GOLD,
    opacity: 0.3,
  },
  inputWrapper: {
    paddingHorizontal: 24,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 30,
    paddingLeft: 20,
    paddingRight: 8,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#F2E8D9",
    shadowColor: GOLD,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: NAVY,
    minHeight: 40,
  },
  micButton: {
    padding: 10,
    marginRight: 4,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: GOLD,
    justifyContent: "center",
    alignItems: "center",
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 20,
    marginBottom: 16,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: GOLD,
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#F2E8D9",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userMessageText: {
    color: "#FFF",
  },
  aiMessageText: {
    color: NAVY,
  },
});
