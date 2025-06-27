import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  TextInput,
  Alert,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { useWorkout } from '../hooks/useWorkout';
import { playWorkoutBeep } from '../utils/audioUtils';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsModal({ onClose }) {
  const { settings, saveSettings } = useWorkout();
  const [localSettings, setLocalSettings] = useState(settings);
  const [customInterval, setCustomInterval] = useState('');

  const handleSave = () => {
    saveSettings(localSettings);
    onClose();
  };

  const initializeAudio = async () => {
    console.log('🔧 Manual audio initialization requested');
    try {
      const success = await setupAudioSession();
      Alert.alert(
        'Audio Initialization',
        success ? 'Audio system initialized successfully!' : 'Audio initialization failed. Check console for details.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.log('🔧 Manual audio init error:', error);
      Alert.alert('Audio Error', `Failed to initialize: ${error.message}`);
    }
  };

  const testBeep = async () => {
    console.log('🧪 Test beep button pressed');
    console.log('🧪 Current settings:', localSettings);
    
    try {
      await playWorkoutBeep(localSettings);
      console.log('🧪 Test beep function completed');
      
      // Show success message
      Alert.alert(
        'Audio Test', 
        'Beep test completed! Did you hear the sound?\n\n• Check your volume\n• Make sure phone isn\'t on silent\n• Try adjusting beep volume',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.log('🧪 Test beep error:', error);
      Alert.alert(
        'Audio Test Error', 
        `Test failed: ${error.message}\n\nCheck console for details.`,
        [{ text: 'OK' }]
      );
    }
  };

  const addCustomInterval = () => {
    const interval = parseInt(customInterval);
    if (interval && interval >= 10 && interval <= 600) {
      const newIntervals = [...localSettings.intervalOptions, interval]
        .sort((a, b) => a - b)
        .filter((value, index, array) => array.indexOf(value) === index);
      
      setLocalSettings({
        ...localSettings,
        intervalOptions: newIntervals,
      });
      setCustomInterval('');
    } else {
      Alert.alert('Invalid Interval', 'Please enter a value between 10 seconds and 10 minutes (600 seconds)');
    }
  };

  const removeInterval = (interval) => {
    if (localSettings.intervalOptions.length <= 3) {
      Alert.alert('Cannot Remove', 'You must have at least 3 interval options');
      return;
    }
    
    const newIntervals = localSettings.intervalOptions.filter(i => i !== interval);
    setLocalSettings({
      ...localSettings,
      intervalOptions: newIntervals,
    });
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    if (secs === 0) return `${mins}m`;
    return `${mins}m ${secs}s`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Audio & Notifications</Text>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Test Beep Sound</Text>
            <TouchableOpacity style={styles.testButton} onPress={testBeep}>
              <Ionicons name="volume-high" size={20} color="#fff" />
              <Text style={styles.testButtonText}>Test</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Beep Volume</Text>
            <View style={styles.sliderContainer}>
              <Slider
                style={styles.slider}
                minimumValue={0.1}
                maximumValue={1.0}
                value={localSettings.beepVolume}
                onValueChange={(value) =>
                  setLocalSettings({ ...localSettings, beepVolume: value })
                }
                minimumTrackTintColor="#ff6b35"
                maximumTrackTintColor="#333"
                thumbStyle={{ backgroundColor: '#ff6b35' }}
              />
              <Text style={styles.volumeText}>
                {Math.round(localSettings.beepVolume * 100)}%
              </Text>
            </View>
          </View>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Vibration (Additional)</Text>
            <Switch
              value={localSettings.vibrationEnabled}
              onValueChange={(value) =>
                setLocalSettings({ ...localSettings, vibrationEnabled: value })
              }
              trackColor={{ false: '#333', true: '#ff6b35' }}
              thumbColor="#fff"
            />
          </View>
          
          <Text style={styles.audioNote}>
            💡 Beep plays alongside your music/podcasts without interrupting them
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interval Options</Text>
          
          <View style={styles.intervalGrid}>
            {localSettings.intervalOptions.map((interval) => (
              <View key={interval} style={styles.intervalChip}>
                <Text style={styles.intervalChipText}>
                  {formatDuration(interval)}
                </Text>
                <TouchableOpacity
                  onPress={() => removeInterval(interval)}
                  style={styles.removeButton}
                >
                  <Ionicons name="close-circle" size={20} color="#ff4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={styles.addIntervalContainer}>
            <TextInput
              style={styles.customIntervalInput}
              placeholder="Add custom interval (seconds)"
              placeholderTextColor="#888"
              value={customInterval}
              onChangeText={setCustomInterval}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={addCustomInterval}
            >
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>
            SetBeast helps you maintain consistent rest intervals during your workouts. 
            The beep notifications are designed to work alongside your music or podcasts 
            without interrupting them.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  saveButton: {
    fontSize: 16,
    color: '#ff6b35',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff6b35',
    marginBottom: 15,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  settingLabel: {
    fontSize: 16,
    color: '#fff',
    flex: 1,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 20,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  volumeText: {
    color: '#ccc',
    fontSize: 14,
    marginLeft: 10,
    minWidth: 40,
  },
  intervalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  intervalChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  intervalChipText: {
    color: '#fff',
    fontSize: 14,
    marginRight: 8,
  },
  removeButton: {
    marginLeft: 4,
  },
  addIntervalContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  customIntervalInput: {
    flex: 1,
    backgroundColor: '#333',
    color: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#ff6b35',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aboutText: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff6b35',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  testButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  audioNote: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 10,
    textAlign: 'center',
  },
});
