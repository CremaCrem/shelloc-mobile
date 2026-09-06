import React, { useState, useRef } from 'react';
import { 
  View, 
  ScrollView, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator,
  Pressable,
  StyleSheet
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Sparkles, Send, Bot, User, ArrowLeft } from 'lucide-react-native';
import { Typography } from '@/components/core/Typography';
import { useChatHistory, useSendMessage } from '@/hooks/useChat';
import Markdown from 'react-native-markdown-display';

const markdownStyles = StyleSheet.create({
  body: {
    color: '#F8FAFC',
    fontSize: 16,
    lineHeight: 24,
  },
  strong: {
    fontWeight: 'bold',
  },
  paragraph: {
    marginTop: 0,
    marginBottom: 8,
  },
});

export default function ChatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: chatHistory, isLoading, isError } = useChatHistory();
  const sendMessageMutation = useSendMessage();
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const messages = chatHistory || [];

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleSend = () => {
    if (!inputText.trim() || sendMessageMutation.isPending) return;
    
    sendMessageMutation.mutate(inputText, {
      onSuccess: () => {
        setInputText('');
      }
    });
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Header */}
        <View className="flex-row items-center px-4 py-3 bg-surface border-b border-surfaceBorder z-10">
          <Pressable
            onPress={handleBack}
            className="p-2 mr-2 rounded-xl bg-surfaceElevated border border-surfaceBorder active:opacity-70"
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <ArrowLeft size={20} color="#F8FAFC" />
          </Pressable>
          <View className="p-2 rounded-xl bg-brandMuted border border-brand/30 mr-3">
            <Sparkles size={20} color="#00F2FE" />
          </View>
          <View>
            <Typography variant="h2" color="ink" className="font-bold">
              Gemini AI
            </Typography>
            <Typography variant="caption" color="inkMuted">
              TELEMETRY & WATER QUALITY ASSISTANT
            </Typography>
          </View>
        </View>

        {/* Chat History */}
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-4 py-4"
          contentContainerStyle={{ paddingBottom: 24 }}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {isLoading ? (
            <View className="flex-1 items-center justify-center py-20">
              <ActivityIndicator color="#00F2FE" />
            </View>
          ) : isError ? (
            <View className="flex-1 items-center justify-center py-20">
              <Bot size={48} color="#EF4444" className="mb-4 opacity-70" />
              <Typography variant="body" color="danger" className="text-center px-8">
                Unable to load chat history. Please check your connection and try again.
              </Typography>
            </View>
          ) : messages.length === 0 ? (
            <View className="flex-1 items-center justify-center py-20">
              <Bot size={48} color="#1A253A" className="mb-4" />
              <Typography variant="body" color="inkMuted" className="text-center px-8">
                Hi, I'm the SHELLOC AI. Ask me to interpret water quality readings, explain flocculation logs, or provide remediation advice!
              </Typography>
            </View>
          ) : (
            messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <View 
                  key={msg.id} 
                  className={`w-full flex-row mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <View className="w-8 h-8 rounded-full bg-surfaceElevated border border-surfaceBorder items-center justify-center mr-3 mt-1">
                      <Bot size={14} color="#00F2FE" />
                    </View>
                  )}
                  
                  <View
                    className={`max-w-[75%] rounded-2xl p-4 ${
                      isUser 
                        ? 'bg-brand rounded-tr-sm' 
                        : 'bg-surfaceElevated border border-surfaceBorder rounded-tl-sm'
                    }`}
                    style={isUser ? {
                      shadowColor: '#00F2FE',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.3,
                      shadowRadius: 4,
                      elevation: 2,
                    } : undefined}
                  >
                    {isUser ? (
                      <Typography 
                        variant="body" 
                        color="dark"
                        className="font-medium"
                      >
                        {msg.message}
                      </Typography>
                    ) : (
                      <Markdown style={markdownStyles}>
                        {msg.message}
                      </Markdown>
                    )}
                    <Typography 
                      variant="caption" 
                      color={isUser ? 'dark' : 'inkSubtle'} 
                      className="text-[10px] mt-2 text-right"
                      style={isUser ? { opacity: 0.7 } : undefined}
                    >
                      {formatTime(msg.timestamp)}
                    </Typography>
                  </View>

                  {isUser && (
                    <View className="w-8 h-8 rounded-full bg-surfaceElevated border border-brand/40 items-center justify-center ml-3 mt-1">
                      <User size={14} color="#00F2FE" />
                    </View>
                  )}
                </View>
              );
            })
          )}
          
          {/* Pending indicator when mutation is loading */}
          {sendMessageMutation.isPending && (
            <View className="w-full flex-row mb-6 justify-start">
              <View className="w-8 h-8 rounded-full bg-surfaceElevated border border-surfaceBorder items-center justify-center mr-3 mt-1">
                <Bot size={14} color="#00F2FE" />
              </View>
              <View className="bg-surfaceElevated border border-surfaceBorder rounded-2xl rounded-tl-sm p-4">
                <ActivityIndicator size="small" color="#00F2FE" />
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View 
          className="p-4 bg-surface border-t border-surfaceBorder flex-row items-end"
          style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        >
          <View className="flex-1 bg-[#050914] border border-surfaceBorder rounded-3xl flex-row items-center px-4 py-3 mr-3 min-h-[48px] max-h-[120px]">
            <TextInput
              className="flex-1 text-ink font-normal text-base"
              placeholder="Ask about water quality..."
              placeholderTextColor="#475569"
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
          </View>
          <Pressable
            onPress={handleSend}
            disabled={!inputText.trim() || sendMessageMutation.isPending}
            className={`w-12 h-12 rounded-full items-center justify-center ${
              inputText.trim() && !sendMessageMutation.isPending 
                ? 'bg-brand' 
                : 'bg-surfaceElevated border border-surfaceBorder'
            }`}
            style={inputText.trim() && !sendMessageMutation.isPending ? {
              shadowColor: '#00F2FE',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.4,
              shadowRadius: 8,
              elevation: 4,
            } : undefined}
          >
            <Send 
              size={18} 
              color={inputText.trim() && !sendMessageMutation.isPending ? '#0B111E' : '#475569'} 
              className={inputText.trim() && !sendMessageMutation.isPending ? 'ml-1' : ''}
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
