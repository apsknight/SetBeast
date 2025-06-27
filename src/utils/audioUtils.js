import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';

let beepSound = null;

// Initialize audio system with simplified configuration
export const setupAudioSession = async () => {
  try {
    console.log('🔧 Setting up audio session...');
    console.log('🔧 Checking if beep.mp3 file exists...');
    
    // Simplified audio configuration to avoid iOS errors
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: false,
      playThroughEarpieceAndroid: false,
    });
    
    console.log('🔧 Audio mode set, loading beep sound...');

    // Load the beep sound from your Downloads
    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/beep.mp3'),
      { 
        shouldPlay: false, 
        volume: 0.8,
        isLooping: false 
      }
    );
    
    beepSound = sound;
    console.log('✅ Your custom beep.mp3 loaded successfully!');
    console.log('✅ Audio system ready for workout beeps!');
    return true;
    
  } catch (error) {
    console.log('❌ Audio setup failed:', error.message);
    console.log('❌ Full error details:', error);
    console.log('❌ This might be due to:');
    console.log('   - File format issues');
    console.log('   - iOS audio permissions');
    console.log('   - Audio system conflicts');
    return false;
  }
};

// Play workout beep with your custom sound
export const playWorkoutBeep = async (settings) => {
  console.log('🔊 Playing your custom beep sound...');
  
  try {
    // Ensure audio is set up
    if (!beepSound) {
      console.log('🔧 Beep sound not loaded, setting up audio...');
      await setupAudioSession();
    }

    if (beepSound) {
      // Set volume and play
      await beepSound.setVolumeAsync(settings.beepVolume || 0.8);
      await beepSound.replayAsync();
      console.log('✅ Custom beep played successfully!');
    } else {
      console.log('❌ Still no beep sound available after setup attempt');
    }
    
    // Add haptic feedback as additional notification
    if (settings.vibrationEnabled) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
  } catch (error) {
    console.log('❌ Beep playback error:', error.message);
    console.log('Full playback error:', error);
    
    // Fallback to strong haptic if audio fails
    if (settings.vibrationEnabled) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
  }
};

// Cleanup audio resources
export const cleanupAudio = async () => {
  try {
    if (beepSound) {
      await beepSound.unloadAsync();
      beepSound = null;
      console.log('✅ Audio cleaned up');
    }
  } catch (error) {
    console.log('❌ Audio cleanup error:', error);
  }
};
