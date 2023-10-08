import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Message = ({ data }) => {
  const isUser = data.sender === 'Moi';
  return (
    <View style={[styles.messageContainer, isUser ? styles.userMessageContainer : styles.botMessageContainer]}>
      <Text style={styles.messageContent}>{data.content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    maxWidth: '80%',
    borderRadius: 12,
    marginVertical: 20,
    marginHorizontal: 20, // Ajouter un espace horizontal
    paddingHorizontal: 12,
    paddingVertical: 8,
    
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#808fe3', // Couleur de fond pour les messages de l'utilisateur
  },
  botMessageContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#1a2541', // Couleur de fond grise pour les messages du bot
  },
  messageContent: {
    color: 'white',
    fontSize: 14,
  },
});


export default Message;
