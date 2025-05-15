import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet, Switch,
  ScrollView, Platform, Pressable, Modal, TouchableOpacity
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@user_profile';

export default function ProfileScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [preferredGenre, setPreferredGenre] = useState('action');
  const [profileVisibility, setProfileVisibility] = useState('public');
  const [showGenrePicker, setShowGenrePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const genres = [
    { label: 'Action', value: 'action' },
    { label: 'Horror', value: 'horror' },
    { label: 'Documentary', value: 'documentary' },
    { label: 'Comedy', value: 'comedy' },
    { label: 'Drama', value: 'drama' },
    { label: 'Sci-Fi', value: 'scifi' },
    { label: 'Animation', value: 'animation' }
  ];

  const validateInputs = () => {
    const errors = [];
    
    // Trim the values to check for only whitespace
    if (!name || name.trim() === '') {
      errors.push('Name is required');
    }
    
    if (!email || email.trim() === '') {
      errors.push('Email is required');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      // Basic email format validation
      errors.push('Please enter a valid email address');
    }
    
    return errors;
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const savedProfile = await AsyncStorage.getItem(STORAGE_KEY);
      console.log('Loaded profile:', savedProfile); // Debug log
      
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        setName(profile.name);
        setEmail(profile.email);
        setNotificationsEnabled(profile.notificationsEnabled);
        setPreferredGenre(profile.preferredGenre);
        setProfileVisibility(profile.profileVisibility);
        console.log('Profile loaded successfully:', profile); // Debug log
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      // Validate inputs before saving
      const validationErrors = validateInputs();
      
      if (validationErrors.length > 0) {
        // Show all validation errors in a single alert
        alert('Please fix the following errors:\n\n' + validationErrors.join('\n'));
        return;
      }

      const profile = {
        name: name.trim(), // Save trimmed values
        email: email.trim(),
        notificationsEnabled,
        preferredGenre,
        profileVisibility,
      };
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      console.log('Profile saved successfully:', profile);
      alert('Profile saved successfully!');
      
      // Verify the save by reading it back
      const savedProfile = await AsyncStorage.getItem(STORAGE_KEY);
      console.log('Verification - Read back saved profile:', savedProfile);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile');
    }
  };

  const clearProfile = async () => {
    try {
      // Clear the AsyncStorage
      await AsyncStorage.removeItem(STORAGE_KEY);
      
      // Reset all state values to defaults
      setName('');
      setEmail('');
      setNotificationsEnabled(false);
      setPreferredGenre('action');
      setProfileVisibility('public');
      
      alert('Profile cleared successfully!');
    } catch (error) {
      console.error('Error clearing profile:', error);
      alert('Failed to clear profile');
    }
  };

  const RadioButton = ({ selected, onPress, label }) => (
    <Pressable style={styles.radioContainer} onPress={onPress}>
      <View style={[styles.radioButton, selected && styles.radioButtonSelected]} />
      <Text style={styles.radioLabel}>{label}</Text>
    </Pressable>
  );

  const getGenreLabel = (value) => {
    const genre = genres.find(g => g.value === value);
    return genre ? genre.label : '';
  };

  return (
    <ScrollView style={styles.container}>
      {isLoading ? (
        <Text style={[styles.label, { textAlign: 'center', marginTop: 20 }]}>Loading...</Text>
      ) : (
        <>
          <Text style={styles.label}>Name *</Text>
          <TextInput
            style={[
              styles.input,
              !name && styles.inputError
            ]}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor="rgba(228, 18, 18, 0.5)"
          />

          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={[
              styles.input,
              !email && styles.inputError
            ]}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholder="you@example.com"
            placeholderTextColor="rgba(228, 18, 18, 0.5)"
            autoCapitalize="none"
          />

          <View style={styles.switchContainer}>
            <Text style={styles.label}>Enable Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
            />
          </View>

          <Text style={styles.label}>Preferred Genre</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowGenrePicker(true)}
          >
            <Text style={styles.dropdownButtonText}>{getGenreLabel(preferredGenre)}</Text>
          </TouchableOpacity>

          <Modal
            visible={showGenrePicker}
            transparent={true}
            animationType="slide"
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select Genre</Text>
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => setShowGenrePicker(false)}
                  >
                    <Text style={styles.closeButtonText}>Done</Text>
                  </TouchableOpacity>
                </View>
                <Picker
                  selectedValue={preferredGenre}
                  onValueChange={(value) => {
                    setPreferredGenre(value);
                    setShowGenrePicker(false);
                  }}
                  style={{ color: '#fff' }}
                >
                  {genres.map((genre) => (
                    <Picker.Item 
                      key={genre.value} 
                      label={genre.label} 
                      value={genre.value}
                      color="#fff"
                    />
                  ))}
                </Picker>
              </View>
            </View>
          </Modal>

          <Text style={styles.label}>Profile Visibility</Text>
          <View style={styles.radioGroup}>
            <RadioButton
              selected={profileVisibility === 'public'}
              onPress={() => setProfileVisibility('public')}
              label="Public"
            />
            <RadioButton
              selected={profileVisibility === 'private'}
              onPress={() => setProfileVisibility('private')}
              label="Private"
            />
            <RadioButton
              selected={profileVisibility === 'friends'}
              onPress={() => setProfileVisibility('friends')}
              label="Friends Only"
            />
          </View>

          <View style={styles.buttonContainer}>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.button, styles.buttonFlex]} onPress={handleSave}>
                <Text style={styles.buttonText}>Save Profile</Text>
              </TouchableOpacity>
              <View style={styles.buttonSpacer} />
              <TouchableOpacity style={[styles.button, styles.buttonFlex]} onPress={clearProfile}>
                <Text style={styles.buttonText}>Clear Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'transparent',
  },
  label: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    fontSize: 16,
    backgroundColor: '#fafafa',
    color: 'black',
  },
  inputError: {
    borderColor: '#ff0000',
    borderWidth: 1,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 15,
    marginBottom: 15,
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    marginBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#333',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 0,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  radioGroup: {
    marginTop: 8,
    marginBottom: 15,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
    marginRight: 10,
  },
  radioButtonSelected: {
    backgroundColor: '#fff',
  },
  radioLabel: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 25,
    marginBottom: 40,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonFlex: {
    flex: 1,
  },
  buttonSpacer: {
    width: 10,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
