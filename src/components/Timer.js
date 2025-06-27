import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useWorkout } from '../hooks/useWorkout';

// Create animated circle component
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function Timer() {
  const { timeRemaining, intervalDuration, isWorkoutActive, isTimerRunning } = useWorkout();
  const animatedValue = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    // Use the original interval duration for progress calculation
    // to avoid progress bar jumping when interval is changed mid-workout
    const originalDuration = timeRemaining > intervalDuration ? timeRemaining : intervalDuration;
    return ((originalDuration - timeRemaining) / originalDuration) * 100;
  };

  // Animate the progress circle only when timer is running
  useEffect(() => {
    if (isTimerRunning) {
      const progress = getProgress();
      Animated.timing(animatedValue, {
        toValue: progress,
        duration: 300, // Smooth 300ms transition
        useNativeDriver: false,
      }).start();
    }
    // When paused, don't animate - keep current position
  }, [timeRemaining, intervalDuration, isTimerRunning]);

  // Pulse animation for last 10 seconds (only when running)
  useEffect(() => {
    if (timeRemaining <= 10 && timeRemaining > 0 && isWorkoutActive && isTimerRunning) {
      const pulse = Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]);
      
      Animated.loop(pulse).start();
    } else {
      pulseAnimation.setValue(1);
    }
  }, [timeRemaining, isWorkoutActive, isTimerRunning]);

  // Check if interval was changed during workout
  const intervalChanged = isWorkoutActive && timeRemaining > intervalDuration;

  // Circle parameters
  const size = 250;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  // Calculate stroke dash offset for decreasing circle using animated value
  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[
        styles.timerCircle,
        {
          transform: [{ scale: pulseAnimation }]
        }
      ]}>
        {/* SVG Circle Progress */}
        <Svg width={size} height={size} style={styles.svgCircle}>
          {/* Background circle */}
          <Circle
            stroke="#333"
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <AnimatedCircle
            stroke={timeRemaining <= 10 ? "#ff4444" : "#ff6b35"}
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        
        {/* Timer content overlay */}
        <View style={styles.timerContent}>
          <Text style={styles.timeText}>{formatTime(timeRemaining)}</Text>
          <Text style={styles.intervalText}>
            {formatTime(intervalDuration)} intervals
          </Text>
          {intervalChanged && (
            <Text style={styles.changeNotice}>
              Next: {formatTime(intervalDuration)}
            </Text>
          )}
        </View>
      </Animated.View>
      
      {isWorkoutActive && (
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { 
            backgroundColor: timeRemaining <= 10 ? '#ff4444' : '#4CAF50' 
          }]} />
          <Text style={styles.statusText}>
            {timeRemaining <= 10 ? 'Get Ready!' : 'Rest Time'}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 40,
  },
  timerCircle: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  svgCircle: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  timerContent: {
    alignItems: 'center',
    position: 'absolute',
    zIndex: 1,
  },
  timeText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'monospace',
  },
  intervalText: {
    fontSize: 16,
    color: '#888',
    marginTop: 5,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  changeNotice: {
    fontSize: 12,
    color: '#ff6b35',
    marginTop: 5,
    fontWeight: '600',
  },
});
