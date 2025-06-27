import React, { createContext, useContext, useReducer, useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { playWorkoutBeep, setupAudioSession, cleanupAudio } from '../utils/audioUtils';

const WorkoutContext = createContext();

const initialState = {
  isWorkoutActive: false,
  intervalDuration: 90, // 1.5 minutes in seconds
  timeRemaining: 90,
  isTimerRunning: false,
  workoutStartTime: null,
  workoutDuration: 0, // Current workout duration in seconds
  totalSets: 0,
  settings: {
    beepVolume: 0.3, // Low volume to not interfere with music
    vibrationEnabled: true,
    intervalOptions: [60, 90, 120, 180, 240], // 1, 1.5, 2, 3, 4 minutes
  }
};

function workoutReducer(state, action) {
  switch (action.type) {
    case 'START_WORKOUT':
      return {
        ...state,
        isWorkoutActive: true,
        isTimerRunning: true,
        workoutStartTime: new Date(),
        workoutDuration: 0,
        timeRemaining: state.intervalDuration,
        totalSets: 0,
      };
    
    case 'END_WORKOUT':
      return {
        ...state,
        isWorkoutActive: false,
        isTimerRunning: false,
        workoutStartTime: null,
        workoutDuration: 0,
        timeRemaining: state.intervalDuration,
      };
    
    case 'START_TIMER':
      return {
        ...state,
        isTimerRunning: true,
        // Don't update lastResumeTime - workout time runs continuously
      };
    
    case 'PAUSE_TIMER':
      return {
        ...state,
        isTimerRunning: false,
        // Don't update workoutElapsedTime - let workout time continue running
      };
    
    case 'TICK':
      // Always update workout duration (continues even when paused)
      const now = new Date();
      const newWorkoutDuration = state.workoutStartTime 
        ? Math.floor((now - state.workoutStartTime) / 1000)
        : 0;

      // Only update interval timer if it's running (not paused)
      if (state.isTimerRunning) {
        if (state.timeRemaining <= 1) {
          return {
            ...state,
            timeRemaining: state.intervalDuration,
            totalSets: state.totalSets + 1,
            workoutDuration: newWorkoutDuration,
          };
        }
        return {
          ...state,
          timeRemaining: state.timeRemaining - 1,
          workoutDuration: newWorkoutDuration,
        };
      } else {
        // Timer is paused - only update workout duration
        return {
          ...state,
          workoutDuration: newWorkoutDuration,
        };
      }
    
    case 'SET_INTERVAL_DURATION':
      return {
        ...state,
        intervalDuration: action.payload,
        // Only reset timeRemaining if workout is not active
        // During active workout, the change applies to next interval
        timeRemaining: state.isWorkoutActive ? state.timeRemaining : action.payload,
      };
    
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };
    
    case 'LOAD_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
        intervalDuration: action.payload.lastUsedInterval || state.intervalDuration,
        timeRemaining: action.payload.lastUsedInterval || state.intervalDuration,
      };
    
    default:
      return state;
  }
}

export function WorkoutProvider({ children }) {
  const [state, dispatch] = useReducer(workoutReducer, initialState);

  // Load settings on app start
  useEffect(() => {
    loadSettings();
    setupAudioSession();
    
    // Cleanup on unmount
    return () => {
      cleanupAudio();
    };
  }, []);

  // Timer effect - workout time runs continuously, interval timer only when not paused
  useEffect(() => {
    let interval;
    
    if (state.isWorkoutActive) {
      interval = setInterval(() => {
        dispatch({ type: 'TICK' });
      }, 1000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [state.isWorkoutActive]); // Only depend on workout being active, not timer running

  // Beep effect when timer completes
  useEffect(() => {
    if (state.isWorkoutActive && state.timeRemaining === state.intervalDuration && state.totalSets > 0) {
      playWorkoutBeep(state.settings);
    }
  }, [state.totalSets]);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('workoutSettings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        dispatch({ type: 'LOAD_SETTINGS', payload: settings });
      }
    } catch (error) {
      console.log('Load settings error:', error);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      const updatedSettings = { ...state.settings, ...newSettings };
      await AsyncStorage.setItem('workoutSettings', JSON.stringify(updatedSettings));
      dispatch({ type: 'UPDATE_SETTINGS', payload: newSettings });
    } catch (error) {
      console.log('Save settings error:', error);
    }
  };

  const startWorkout = () => {
    dispatch({ type: 'START_WORKOUT' });
  };

  const endWorkout = () => {
    dispatch({ type: 'END_WORKOUT' });
  };

  const pauseTimer = () => {
    dispatch({ type: 'PAUSE_TIMER' });
  };

  const resumeTimer = () => {
    dispatch({ type: 'START_TIMER' });
  };

  const setIntervalDuration = (duration) => {
    dispatch({ type: 'SET_INTERVAL_DURATION', payload: duration });
    saveSettings({ lastUsedInterval: duration });
  };

  const value = {
    ...state,
    startWorkout,
    endWorkout,
    pauseTimer,
    resumeTimer,
    setIntervalDuration,
    saveSettings,
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkout() {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
}
