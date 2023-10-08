import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, TouchableOpacity, StyleSheet, FlatList, SafeAreaView, KeyboardAvoidingView,Platform, StatusBar } from 'react-native';
import Message from './components/Message.jsx';
import botResponses from './DATA/messages.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [inputText, setInputText] = useState('');
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const storedMessages = await AsyncStorage.getItem('chatMessages');
        if (storedMessages) {
          setChatMessages(JSON.parse(storedMessages));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des messages depuis le stockage local :', error);
      }
    };

    loadMessages();
  }, []);

  useEffect(() => {
    const saveMessagesToStorage = async () => {
      try {
        await AsyncStorage.setItem('chatMessages', JSON.stringify(chatMessages));
      } catch (error) {
        console.error('Erreur lors de l\'enregistrement des messages dans le stockage local :', error);
      }
    };

    saveMessagesToStorage();
  }, [chatMessages]);

  const getRandomResponse = () => {
    const responseKeys = Object.keys(botResponses.answers);
    const randomResponseId = responseKeys[Math.floor(Math.random() * responseKeys.length)];
    return botResponses.answers[randomResponseId];
  };

  const handleSendMessage = () => {
    if (inputText.trim() !== '') {
      const userMessage = {
        id: chatMessages.length + 1,
        sender: 'Moi',
        content: inputText,
      };

      const botResponse = {
        id: chatMessages.length + 2,
        sender: 'Test bot',
        content: getRandomResponse() || "Je ne comprends pas la question.",
      };

      const updatedMessages = [...chatMessages, userMessage, botResponse];
      setChatMessages(updatedMessages);
      setInputText('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -StatusBar.currentHeight}
      >
        <FlatList
          data={chatMessages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <Message data={item} />}
        />
        <View style={styles.subContainer}>
          <TextInput
            style={[styles.input, { marginBottom: 8 }]}
            placeholder="Posez votre question..."
            value={inputText}
            onChangeText={(text) => setInputText(text)}
          />
          <TouchableOpacity style={[styles.sendButton, { marginBottom: 8 }]} onPress={handleSendMessage}>
            <Text style={styles.sendButtonText}>Envoyer</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
    paddingHorizontal: 16,
    justifyContent: 'flex-end',
  },
  keyboardAvoidingContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  subContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#808fe3',
    marginHorizontal: 20,
  },
  sendButton: {
    backgroundColor: '#808fe3',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
});
