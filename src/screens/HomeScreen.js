import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Modal,
} from 'react-native';
import { useWorkout } from '../hooks/useWorkout';
import Timer from '../components/Timer';
import WorkoutControls from '../components/WorkoutControls';
import SettingsModal from '../components/SettingsModal';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const [showSettings, setShowSettings] = useState(false);
  const { 
    isWorkoutActive, 
    totalSets, 
    workoutDuration
  } = useWorkout();

  const getWorkoutDuration = () => {
    const minutes = Math.floor(workoutDuration / 60);
    const seconds = workoutDuration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appTitle}>SetBeast</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => setShowSettings(true)}
        >
          <Ionicons name="settings-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {isWorkoutActive && (
          <View style={styles.workoutStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Sets Completed</Text>
              <Text style={styles.statValue}>{totalSets}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Workout Time</Text>
              <Text style={styles.statValue}>{getWorkoutDuration()}</Text>
            </View>
          </View>
        )}

        <Timer />
        <WorkoutControls />

        {!isWorkoutActive && (
          <View style={styles.instructions}>
            <Text style={styles.instructionTitle}>How it works:</Text>
            <Text style={styles.instructionText}>
              • Start a workout session{'\n'}
              • Timer beeps every interval to remind you{'\n'}
              • Beeps won't interrupt your music/podcasts{'\n'}
              • Track your sets and workout time
            </Text>
          </View>
        )}
      </View>

      <Modal
        visible={showSettings}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SettingsModal onClose={() => setShowSettings(false)} />
      </Modal>
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
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ff6b35',
  },
  settingsButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  workoutStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
    paddingVertical: 20,
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  instructions: {
    marginTop: 40,
    padding: 20,
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff6b35',
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 16,
    color: '#ccc',
    lineHeight: 24,
  },
});
