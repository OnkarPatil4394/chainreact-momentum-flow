
// Sound utility functions for the app
// These functions handle playing different notification sounds

/**
 * Play a notification sound for settings changes
 */
export const playSettingsSound = () => {
  const audio = new Audio('/sounds/notification.mp3');
  audio.volume = 0.5; // 50% volume
  audio.play().catch(error => {
    console.error('Error playing settings sound:', error);
  });
};

/**
 * Play a celebratory sound for habit completion
 */
export const playCompletionSound = () => {
  const audio = new Audio('/sounds/complete.mp3');
  audio.volume = 0.7; // 70% volume
  audio.play().catch(error => {
    console.error('Error playing completion sound:', error);
  });
};

/**
 * Play a cheering sound for XP increase
 */
export const playXpSound = () => {
  const audio = new Audio('/sounds/levelup.mp3');
  audio.volume = 0.6; // 60% volume
  audio.play().catch(error => {
    console.error('Error playing XP sound:', error);
  });
};

/**
 * Play a streak milestone achievement sound
 */
export const playStreakSound = () => {
  const audio = new Audio('/sounds/streak.mp3');
  audio.volume = 0.8; // 80% volume
  audio.play().catch(error => {
    console.error('Error playing streak sound:', error);
  });
};
