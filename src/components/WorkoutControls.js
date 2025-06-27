import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useWorkout } from '../hooks/useWorkout';
import { Ionicons } from '@expo/vector-icons';

export default function WorkoutControls() {
  const {
    isWorkoutActive,
    isTimerRunning,
    startWorkout,
    endWorkout,
    pauseTimer,
    resumeTimer,
    intervalDuration,
    setIntervalDuration,
    settings,
  } = useWorkout();

  const handleEndWorkout = () => {
    Alert.alert(
      'End Workout',
      'Are you sure you want to end your workout session?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'End Workout', style: 'destructive', onPress: endWorkout },
      ]
    );
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    if (secs === 0) return `${mins}m`;
    return `${mins}m ${secs}s`;
  };

  const handleIntervalChange = (duration) => {
    if (isWorkoutActive) {
      // Show confirmation for mid-workout changes
      Alert.alert(
        'Change Rest Interval',
        `Change rest time to ${formatDuration(duration)}?\n\nThis will apply to your next rest period.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Change', 
            onPress: () => setIntervalDuration(duration)
          },
        ]
      );
    } else {
      setIntervalDuration(duration);
    }
  };

  if (!isWorkoutActive) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Quick Setup</Text>
        
        <View style={styles.intervalSelector}>
          <Text style={styles.intervalLabel}>Rest Interval:</Text>
          <View style={styles.intervalButtons}>
            {settings.intervalOptions.map((duration) => (
              <TouchableOpacity
                key={duration}
                style={[
                  styles.intervalButton,
                  intervalDuration === duration && styles.intervalButtonActive,
                ]}
                onPress={() => handleIntervalChange(duration)}
              >
                <Text
                  style={[
                    styles.intervalButtonText,
                    intervalDuration === duration && styles.intervalButtonTextActive,
                  ]}
                >
                  {formatDuration(duration)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.startButton} onPress={startWorkout}>
          <Ionicons name="play" size={24} color="#fff" />
          <Text style={styles.startButtonText}>Start Workout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.activeControls}>
        <TouchableOpacity
          style={[styles.controlButton, styles.pauseButton]}
          onPress={isTimerRunning ? pauseTimer : resumeTimer}
        >
          <Ionicons
            name={isTimerRunning ? 'pause' : 'play'}
            size={24}
            color="#fff"
          />
          <Text style={styles.controlButtonText}>
            {isTimerRunning ? 'Pause Timer' : 'Resume Timer'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.endButton]}
          onPress={handleEndWorkout}
        >
          <Ionicons name="stop" size={24} color="#fff" />
          <Text style={styles.controlButtonText}>End Workout</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Interval Adjustment */}
      <View style={styles.quickIntervalSection}>
        <Text style={styles.quickIntervalTitle}>Quick Adjust Rest Time:</Text>
        <View style={styles.quickIntervalButtons}>
          {settings.intervalOptions.map((duration) => (
            <TouchableOpacity
              key={duration}
              style={[
                styles.quickIntervalButton,
                intervalDuration === duration && styles.quickIntervalButtonActive,
              ]}
              onPress={() => handleIntervalChange(duration)}
            >
              <Text
                style={[
                  styles.quickIntervalButtonText,
                  intervalDuration === duration && styles.quickIntervalButtonTextActive,
                ]}
              >
                {formatDuration(duration)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.quickIntervalNote}>
          Changes apply to next interval
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  intervalSelector: {
    marginBottom: 30,
  },
  intervalLabel: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 15,
    textAlign: 'center',
  },
  intervalButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  intervalButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#333',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  intervalButtonActive: {
    backgroundColor: '#ff6b35',
    borderColor: '#ff8c5a',
  },
  intervalButtonText: {
    color: '#ccc',
    fontSize: 14,
    fontWeight: '600',
  },
  intervalButtonTextActive: {
    color: '#fff',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 3,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  activeControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 20,
  },
  controlButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 25,
    elevation: 2,
  },
  pauseButton: {
    backgroundColor: '#ff9800',
  },
  endButton: {
    backgroundColor: '#f44336',
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  quickIntervalSection: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  quickIntervalTitle: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 15,
    textAlign: 'center',
  },
  quickIntervalButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 10,
  },
  quickIntervalButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#333',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 50,
    alignItems: 'center',
  },
  quickIntervalButtonActive: {
    backgroundColor: '#ff6b35',
    borderColor: '#ff8c5a',
  },
  quickIntervalButtonText: {
    color: '#ccc',
    fontSize: 12,
    fontWeight: '600',
  },
  quickIntervalButtonTextActive: {
    color: '#fff',
  },
  quickIntervalNote: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
