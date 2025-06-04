import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Platform, KeyboardAvoidingView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiUrl, setApiUrl] = useState(''); // Will be set from config file

  // Read IP address from config file
  useEffect(() => {
    const readConfig = async () => {
      try {
        // For development, use a default IP
        const defaultIP = '192.168.1.151';
        setApiUrl(`http://${defaultIP}:3000/api`);
        console.log('Using default IP:', defaultIP);


      } catch (error) {
        console.error('Error reading config:', error);
      }
    };
    readConfig();
  }, []);

  // Add initial welcome message
  useEffect(() => {
    setChatHistory([
      {
        id: Date.now(),
        text: 'Welcome to the Supply Chain ChatBot! How can I help you today?',
        isUser: false,
      },
    ]);
  }, []);

  const handleSend = async () => {
    if (!message.trim()) return;

    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      text: message,
      isUser: true,
    };
    setChatHistory(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const lowerMessage = message.toLowerCase();
      let response;

      // Handle different commands
      if (lowerMessage.includes('list pending purchase orders')) {
        const pendingResponse = await fetch(`${apiUrl}/purchase-orders/pending`);
        const pendingData = await pendingResponse.json();
        
        if (pendingData.status === 'success') {
          const poList = pendingData.data.map(po => 
            `PO: ${po.poNumber} - Status: ${po.status}`
          ).join('\n');
          
          response = {
            status: 'success',
            text: 'Here are the pending purchase orders:\n' + poList,
            data: pendingData.data
          };
        } else {
          response = {
            status: 'error',
            text: 'Error fetching pending purchase orders'
          };
        }
      }
      else if (lowerMessage.includes('get details for po')) {
        const match = lowerMessage.match(/get details for po (\d{5,})/);
        if (match) {
          const poNumber = match[1];
          // Use existing REST API to get PO details
          const poResponse = await fetch(`${apiUrl}/purchase-orders/${poNumber}`);
          const poData = await poResponse.json();
          
          if (poData.status === 'success') {
            // Format all fields except _id and __v
            const details = Object.entries(poData.data)
              .filter(([key]) => !['_id', '__v'].includes(key))
              .map(([key, value]) => {
                // Format the key name (capitalize and add spaces)
                const formattedKey = key
                  .replace(/([A-Z])/g, ' $1') // Add space before capital letters
                  .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
                
                // Format the value based on its type
                let formattedValue = value;
                if (value instanceof Date) {
                  formattedValue = new Date(value).toLocaleString();
                } else if (typeof value === 'object' && value !== null) {
                  formattedValue = JSON.stringify(value, null, 2);
                }
                
                return `${formattedKey}: ${formattedValue}`;
              })
              .join('\n');
            
            response = {
              status: 'success',
              text: `Details for PO ${poNumber}:\n${details}`,
              data: poData.data
            };
          } else {
            response = {
              status: 'error',
              text: `Couldn't find PO: ${poNumber}`
            };
          }
        } else {
          response = {
            status: 'error',
            text: 'Invalid PO number format. Use: Get details for PO [number]'
          };
        }
      }
      else if (lowerMessage.match(/^mark po \d{5,} as (pending|approved|delivered|cancelled)$/)) {
        const match = lowerMessage.match(/^mark po (\d{5,}) as (pending|approved|delivered|cancelled)$/);
        if (match) {
          const poNumber = match[1];
          const newStatus = match[2].charAt(0).toUpperCase() + match[2].slice(1);
          
          // Use existing REST API to update PO status
          const updateResponse = await fetch(`${apiUrl}/purchase-orders/${poNumber}/status`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus })
          });
          const updateData = await updateResponse.json();
          
          if (updateData.status === 'success') {
            response = {
              status: 'success',
              text: `Purchase order ${poNumber} status updated to ${newStatus}`,
              data: updateData.data
            };
          } else {
            response = {
              status: 'error',
              text: `Error updating PO ${poNumber}: ${updateData.message}`
            };
          }
        } else {
          response = {
            status: 'error',
            text: 'Invalid command format. Use: Mark PO [number] as [status]'
          };
        }
      }
      else {
        response = {
          status: 'error',
          text: 'Invalid command. Use:\n' +
                '- List pending purchase orders\n' +
                '- Get details for PO [number]\n' +
                '- Mark PO [number] as [status]'
        };
      }

      // Add bot response to chat
      const botMessage = {
        id: Date.now() + 1,
        text: response.text,
        isUser: false,
      };
      setChatHistory(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, something went wrong. Please try again.',
        isUser: false,
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
    >
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Text style={styles.headerText}>Supply Chain ChatBot</Text>
      </View>
      
      <ScrollView 
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContent}
      >
        {chatHistory.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.messageBubble,
              msg.isUser ? styles.userBubble : styles.botBubble,
            ]}
          >
            <Text style={[
              styles.messageText,
              msg.isUser ? styles.userMessageText : styles.botMessageText
            ]}>{msg.text}</Text>
          </View>
        ))}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#007AFF" />
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type your message..."
          placeholderTextColor="#999"
          multiline
        />
        <TouchableOpacity 
          style={styles.sendButton}
          onPress={handleSend}
          disabled={isLoading}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  chatContainer: {
    flex: 1,
    padding: 10,
  },
  chatContent: {
    paddingBottom: 20,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 15,
    borderRadius: 20,
    marginVertical: 5,
  },
  userBubble: {
    backgroundColor: '#4A90E2',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 5,
  },
  botBubble: {
    backgroundColor: 'white',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
  },
  userMessageText: {
    color: 'white',
  },
  botMessageText: {
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    padding: 10,
    alignItems: 'center',
  },
});
