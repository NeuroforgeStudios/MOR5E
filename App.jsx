import React, { useState, useEffect, useRef, useReducer, createContext, useContext } from 'react';
import { 
  Play, Pause, Volume2, Settings, Activity, Book, 
  Home, Award, Calendar, Clock, CheckCircle, Circle,
  RotateCcw, ArrowRight, AlertCircle, HelpCircle, Zap,
  Star, Lock, Unlock, PlusCircle, Vibrate, Headphones,
  Volume1, VolumeX, Ear, Info
} from 'lucide-react';

// Create context for global state
const AppContext = createContext();

// Define the Morse code for each character using the LCWO.net character progression
const morseCodeMap = {
  'K': '-.-', 'M': '--', 'U': '..-', 'R': '.-.', 'E': '.', 
  'S': '...', 'N': '-.', 'A': '.-', 'P': '.--.', 'T': '-', 
  'L': '.-..', 'W': '.--', 'I': '..', '.': '.-.-.-', 'J': '.---', 
  'Z': '--..', '=': '-...-', 'F': '..-.', 'O': '---', 'Y': '-.--', 
  ',': '--..--', 'V': '...-', 'G': '--.', '5': '.....', '/': '-..-.',
  'Q': '--.-', '9': '----.', '2': '..---', 'H': '....', '3': '...--',
  '8': '---..',  'B': '-...', '?': '..--..', '4': '....-', '7': '--...',
  'C': '-.-.', '1': '.----', 'D': '-..', '6': '-....', '0': '-----', 'X': '-..-'
};

// LCWO.net character progression
const characterProgression = [
  'K', 'M', 'U', 'R', 'E', 'S', 'N', 'A', 'P', 'T', 
  'L', 'W', 'I', '.', 'J', 'Z', '=', 'F', 'O', 'Y', 
  ',', 'V', 'G', '5', '/', 'Q', '9', '2', 'H', '3', 
  '8', 'B', '?', '4', '7', 'C', '1', 'D', '6', '0', 'X'
];

// Helper function to get standardized display version of morse code
const getDisplayMorse = (char) => {
  return morseCodeMap[char]?.replace(/\./g, '•').replace(/\-/g, '−') || '';
};

// Group characters into logical families based on Koch method pedagogy
const patternFamilies = [];
const familySize = 5; // Number of characters per family

// Create pattern families from the character progression
for (let i = 0; i < characterProgression.length; i += familySize) {
  const familyChars = characterProgression.slice(i, i + familySize);
  patternFamilies.push({
    name: `Group ${Math.floor(i/familySize) + 1}`,
    description: `Characters ${i+1}-${Math.min(i+familySize, characterProgression.length)}`,
    characters: familyChars.map(char => ({
      char,
      morse: getDisplayMorse(char),
      audio: `/${char.toLowerCase()}-sound.mp3`,
      pattern: morseCodeMap[char].replace(/\./g, 'short').replace(/\-/g, 'long').split('').join('-')
    }))
  });
}

// Generate daily lessons dynamically based on the character progression
const generateDailyLessons = () => {
  const lessons = [];
  
  // Day 1: Introduction and first character
  lessons.push({
    day: 1,
    title: `Introduction to Morse & Letter ${characterProgression[0]}`,
    description: `Learn the basics of Morse code and your first letter: ${characterProgression[0]} (${getDisplayMorse(characterProgression[0])})`,
    duration: 15,
    exercises: [
      {
        type: "intro",
        title: "Welcome to Morse for AuDHD",
        content: "Today we'll learn about Morse code and master your first character. Morse code uses dots and dashes to represent letters and numbers. We'll focus on training your ear to recognize these patterns.",
        duration: 2
      },
      {
        type: "technique",
        title: "The 'Listening Mindset'",
        content: "Instead of counting dots and dashes, try to hear patterns as whole sounds. Focus on the rhythm and the overall pattern.",
        duration: 1
      },
      {
        type: "character",
        char: characterProgression[0],
        morse: getDisplayMorse(characterProgression[0]),
        mnemonic: `${characterProgression[0]} sounds like '${morseCodeMap[characterProgression[0]].replace(/\./g, 'di').replace(/\-/g, 'dah')}'`,
        duration: 3
      },
      {
        type: "flashPractice",
        char: characterProgression[0],
        reps: 10,
        interval: 3,
        duration: 3
      },
      {
        type: "comprehension",
        chars: [characterProgression[0]],
        sets: 5,
        duration: 4
      },
      {
        type: "reward",
        title: "First Letter Unlocked!",
        content: `You've learned your first Morse code character: ${characterProgression[0]}`,
        points: 10,
        badge: "first_letter",
        duration: 1
      },
      {
        type: "audio_recognition",
        title: "Sound Recognition Training",
        content: `Close your eyes and focus on the sound of ${characterProgression[0]}. Listen for its distinctive pattern.`,
        duration: 1
      }
    ],
    totalPoints: 25
  });
  
  // For each subsequent character, create a lesson
  for (let i = 1; i < characterProgression.length; i++) {
    const currentChar = characterProgression[i];
    const previousChars = characterProgression.slice(0, i);
    const lastChar = previousChars[previousChars.length - 1];
    
    const exercises = [];
    
    // Review previous character(s)
    exercises.push({
      type: "review",
      chars: i <= 4 ? previousChars : previousChars.slice(-4),
      reps: 5,
      duration: 2
    });
    
    // Introduce new character
    exercises.push({
      type: "character",
      char: currentChar,
      morse: getDisplayMorse(currentChar),
      mnemonic: `${currentChar} sounds like '${morseCodeMap[currentChar].replace(/\./g, 'di').replace(/\-/g, 'dah')}'`,
      duration: 3
    });
    
    // Flash practice with new character
    exercises.push({
      type: "flashPractice",
      char: currentChar,
      reps: 10,
      interval: 3,
      duration: 3
    });
    
    // Contrast practice with new and previously learned characters
    exercises.push({
      type: "contrastPractice",
      chars: [currentChar, lastChar],
      sets: 5,
      duration: 3
    });
    
    // Multi-character practice with all learned characters
    exercises.push({
      type: "multiCharPractice",
      chars: [...previousChars, currentChar],
      sets: 3,
      duration: 3
    });
    
    // Reward
    exercises.push({
      type: "reward",
      title: `Character ${i+1} Mastered!`,
      content: `You've learned ${currentChar} and can now recognize ${i+1} Morse code characters!`,
      points: 10 + i,
      badge: `character_${i+1}`,
      duration: 1
    });
    
    lessons.push({
      day: i + 1,
      title: `Letter ${currentChar} & Practice`,
      description: `Learn ${currentChar} (${getDisplayMorse(currentChar)}) and practice with previously learned characters`,
      duration: 15,
      exercises,
      totalPoints: 20 + i
    });
  }
  
  return lessons;
};

const dailyLessons = generateDailyLessons();

// State reducer for character mastery
const characterMasteryReducer = (state, action) => {
  switch (action.type) {
    case 'INTRODUCE_CHAR':
      return {
        ...state,
        [action.char]: {
          ...state[action.char],
          introduced: true
        }
      };
    case 'UPDATE_MASTERY':
      return {
        ...state,
        [action.char]: {
          ...state[action.char],
          mastery: action.mastery,
          attempts: (state[action.char]?.attempts || 0) + 1,
          correct: (state[action.char]?.correct || 0) + (action.correct ? 1 : 0)
        }
      };
    case 'LOAD_STATE':
      return action.state;
    default:
      return state;
  }
};

// Initialize character mastery state based on the progression
const initCharacterMastery = () => {
  const initialState = {};
  characterProgression.forEach(char => {
    initialState[char] = { introduced: false, correct: 0, attempts: 0, mastery: 0 };
  });
  return initialState;
};

// Preferences reducer
const preferencesReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_PREFERENCE':
      return {
        ...state,
        [action.key]: action.value
      };
    case 'LOAD_PREFERENCES':
      return action.preferences;
    default:
      return state;
  }
};

// Main App Component
const MorseCodeApp = () => {
  // Main state
  const [currentTab, setCurrentTab] = useState('home');
  const [currentDay, setCurrentDay] = useState(1);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [streakDays, setStreakDays] = useState(0);
  const [lastCompleted, setLastCompleted] = useState(null);
  const [isExerciseActive, setIsExerciseActive] = useState(false);
  const [sessionProgress, setSessionProgress] = useState(0);
  const [points, setPoints] = useState(0);
  const [rewards, setRewards] = useState([]);
  
  // Complex state with reducers
  const [characterMastery, dispatchMastery] = useReducer(characterMasteryReducer, initCharacterMastery());
  
  const [preferences, dispatchPreferences] = useReducer(preferencesReducer, {
    colorMode: 'dark',
    soundPitch: 600,
    soundVolume: 70,
    hapticEnabled: false,
    visualStyle: 'high-contrast',
    sessionLength: 15,
    charSpeed: 20, // Character speed in WPM (fixed for Koch method)
    effectiveSpeed: 15, // Effective speed in WPM (adjustable for Farnsworth timing)
    reinforcementStyle: 'points',
  });
  
  // Refs for audio context, oscillator, and exercise intervals
  const audioContext = useRef(null);
  const oscillator = useRef(null);
  const gainNode = useRef(null);
  const timerRef = useRef(null);
  const exerciseIntervalRef = useRef(null);
  
  // ARIA live region ref for accessibility
  const ariaLiveRef = useRef(null);
  
  // Load saved state from localStorage
  useEffect(() => {
    try {
      const savedMastery = localStorage.getItem('characterMastery');
      if (savedMastery) {
        dispatchMastery({ type: 'LOAD_STATE', state: JSON.parse(savedMastery) });
      }
      
      const savedPreferences = localStorage.getItem('preferences');
      if (savedPreferences) {
        dispatchPreferences({ type: 'LOAD_PREFERENCES', preferences: JSON.parse(savedPreferences) });
      }
      
      const savedDay = localStorage.getItem('currentDay');
      if (savedDay) {
        setCurrentDay(parseInt(savedDay));
      }
      
      const savedStreak = localStorage.getItem('streakDays');
      if (savedStreak) {
        setStreakDays(parseInt(savedStreak));
      }
      
      const savedLastCompleted = localStorage.getItem('lastCompleted');
      if (savedLastCompleted) {
        setLastCompleted(savedLastCompleted);
      }
      
      const savedPoints = localStorage.getItem('points');
      if (savedPoints) {
        setPoints(parseInt(savedPoints));
      }
      
      const savedRewards = localStorage.getItem('rewards');
      if (savedRewards) {
        setRewards(JSON.parse(savedRewards));
      }
    } catch (error) {
      console.error('Error loading saved state:', error);
    }
  }, []);
  
  // Save state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('characterMastery', JSON.stringify(characterMastery));
  }, [characterMastery]);
  
  useEffect(() => {
    localStorage.setItem('preferences', JSON.stringify(preferences));
  }, [preferences]);
  
  useEffect(() => {
    localStorage.setItem('currentDay', currentDay.toString());
  }, [currentDay]);
  
  useEffect(() => {
    localStorage.setItem('streakDays', streakDays.toString());
  }, [streakDays]);
  
  useEffect(() => {
    if (lastCompleted) {
      localStorage.setItem('lastCompleted', lastCompleted);
    }
  }, [lastCompleted]);
  
  useEffect(() => {
    localStorage.setItem('points', points.toString());
  }, [points]);
  
  useEffect(() => {
    localStorage.setItem('rewards', JSON.stringify(rewards));
  }, [rewards]);
  
  // Initialize Audio context only when needed (on first user interaction)
  // This addresses autoplay policy restrictions in modern browsers
  const initializeAudioContext = () => {
    if (audioContext.current) return; // Already initialized
    
    try {
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
      gainNode.current = audioContext.current.createGain();
      gainNode.current.gain.value = 0;
      gainNode.current.connect(audioContext.current.destination);
      console.log("Audio context initialized successfully");
    } catch (e) {
      console.error("Web Audio API not supported:", e);
    }
  };
  
  // Set up event listeners for initializing audio on first user interaction
  useEffect(() => {
    const initOnUserAction = () => {
      initializeAudioContext();
      // Remove event listeners after first initialization
      document.removeEventListener('click', initOnUserAction);
      document.removeEventListener('touchstart', initOnUserAction);
      document.removeEventListener('keydown', initOnUserAction);
    };
    
    document.addEventListener('click', initOnUserAction);
    document.addEventListener('touchstart', initOnUserAction);
    document.addEventListener('keydown', initOnUserAction);
    
    // Clean up on component unmount
    return () => {
      if (oscillator.current) {
        try {
          oscillator.current.stop();
          oscillator.current.disconnect();
        } catch (e) {
          // Ignore errors if oscillator was already stopped
        }
      }
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (exerciseIntervalRef.current) {
        clearInterval(exerciseIntervalRef.current);
      }
      
      // Clean up event listeners
      document.removeEventListener('click', initOnUserAction);
      document.removeEventListener('touchstart', initOnUserAction);
      document.removeEventListener('keydown', initOnUserAction);
    };
  }, []);
  
  // Function to convert WPM to timing parameters
  const getTimingParameters = (charSpeed, effectiveSpeed) => {
    // Standard PARIS timing (50 dots per PARIS)
    // At 20 WPM, a dot is 60 ms
    const dotDuration = 1.2 / charSpeed; // In seconds

    // Timing relationships
    const dashDuration = dotDuration * 3;
    const symbolGap = dotDuration; // Gap between elements within a character (standard)
    
    // Calculate extended character gap for Farnsworth timing
    // For Farnsworth, we modify the gaps between characters, not the character speed
    const standardCharGap = dotDuration * 3; // Standard gap is 3 dot lengths
    
    // If effectiveSpeed is less than charSpeed, calculate extended gap
    let charGap = standardCharGap;
    if (effectiveSpeed < charSpeed) {
      // Calculate how much extra time we need per character
      const speedRatio = charSpeed / effectiveSpeed;
      // Extend the character gap to achieve the desired effective speed
      charGap = standardCharGap * speedRatio;
    }
    
    // Word gap is 7 dot lengths in standard timing
    const wordGap = dotDuration * 7;
    
    return { dotDuration, dashDuration, symbolGap, charGap, wordGap };
  };
  
  // Function to play Morse code sound following Modified Koch method and Farnsworth timing
  const playMorseSound = (pattern) => {
    if (!audioContext.current) {
      try {
        audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
        gainNode.current = audioContext.current.createGain();
        gainNode.current.gain.value = 0;
        gainNode.current.connect(audioContext.current.destination);
      } catch (e) {
        console.error("Failed to initialize Web Audio API:", e);
        return;
      }
    }
    
    // Resume audio context if it's suspended (needed for some browsers)
    if (audioContext.current.state === 'suspended') {
      audioContext.current.resume().catch(e => console.error("Failed to resume audio context:", e));
    }
    
    // Clean up previous oscillator if it exists
    if (oscillator.current) {
      try {
        oscillator.current.stop();
        oscillator.current.disconnect();
      } catch (e) {
        // Ignore errors if oscillator was already stopped
      }
      oscillator.current = null;
    }
    
    // Create a new oscillator for this sound
    try {
      oscillator.current = audioContext.current.createOscillator();
      oscillator.current.type = 'sine';
      oscillator.current.frequency.setValueAtTime(preferences.soundPitch, audioContext.current.currentTime);
      oscillator.current.connect(gainNode.current);
      oscillator.current.start();
    } catch (e) {
      console.error("Failed to create oscillator:", e);
      return;
    }
    
    // Get timing parameters based on WPM settings
    const { dotDuration, dashDuration, symbolGap, charGap, wordGap } = getTimingParameters(
      preferences.charSpeed, 
      preferences.effectiveSpeed
    );
    
    let currentTime = audioContext.current.currentTime;
    
    // Apply smooth gain ramps to prevent clicks
    const rampTime = Math.min(0.003, dotDuration / 3); // 3ms ramp time, but not more than 1/3 of a dot
    
    // Make sure the gain is at 0 when we start
    gainNode.current.gain.cancelScheduledValues(currentTime);
    gainNode.current.gain.setValueAtTime(0, currentTime);
    
    // Standardize pattern format - convert visual dots/dashes to standard ones
    const standardPattern = typeof pattern === 'string' 
      ? pattern.replace(/•/g, '.').replace(/−/g, '-') 
      : '';
    
    // Parse pattern and schedule gain changes
    [...standardPattern].forEach((symbol) => {
      if (symbol === '.') {
        // Dot with smooth onset and offset
        gainNode.current.gain.linearRampToValueAtTime(preferences.soundVolume / 100, currentTime + rampTime);
        gainNode.current.gain.setValueAtTime(preferences.soundVolume / 100, currentTime + dotDuration - rampTime);
        gainNode.current.gain.linearRampToValueAtTime(0, currentTime + dotDuration);
        currentTime += dotDuration + symbolGap;
      } else if (symbol === '-') {
        // Dash with smooth onset and offset
        gainNode.current.gain.linearRampToValueAtTime(preferences.soundVolume / 100, currentTime + rampTime);
        gainNode.current.gain.setValueAtTime(preferences.soundVolume / 100, currentTime + dashDuration - rampTime);
        gainNode.current.gain.linearRampToValueAtTime(0, currentTime + dashDuration);
        currentTime += dashDuration + symbolGap;
      } else if (symbol === ' ') {
        // Space between characters - extended in Farnsworth
        currentTime += charGap;
      } else if (symbol === '/') {
        // Space between words
        currentTime += wordGap;
      }
    });
    
    // Schedule cleanup of the oscillator
    setTimeout(() => {
      if (oscillator.current) {
        try {
          oscillator.current.stop();
          oscillator.current.disconnect();
          oscillator.current = null;
        } catch (e) {
          // Ignore errors if oscillator was already stopped
        }
      }
    }, (currentTime - audioContext.current.currentTime) * 1000 + 100); // Add a small buffer
  };
  
  // Function to simulate haptic feedback using Web Vibration API if available
  const triggerHaptic = (pattern) => {
    if (!preferences.hapticEnabled) return;
    
    // Feature detection for Vibration API
    if (typeof navigator === 'undefined' || !navigator.vibrate) {
      console.log("Vibration API not supported");
      return;
    }
    
    try {
      // Get timing parameters based on WPM settings
      const { dotDuration, dashDuration, symbolGap } = getTimingParameters(
        preferences.charSpeed, 
        preferences.effectiveSpeed
      );
      
      // Convert to milliseconds
      const dotMs = Math.round(dotDuration * 1000);
      const dashMs = Math.round(dashDuration * 1000);
      const gapMs = Math.round(symbolGap * 1000);
      
      const vibrationPattern = [];
      
      // Standardize pattern format - convert visual dots/dashes to standard ones
      const standardPattern = typeof pattern === 'string' 
        ? pattern.replace(/•/g, '.').replace(/−/g, '-') 
        : '';
      
      [...standardPattern].forEach((symbol, idx) => {
        // Add appropriate vibration duration
        if (symbol === '.') {
          vibrationPattern.push(dotMs);
        } else if (symbol === '-') {
          vibrationPattern.push(dashMs);
        }
        
        // Add gap after symbol (except for the last one)
        if (idx < standardPattern.length - 1) {
          vibrationPattern.push(gapMs);
        }
      });
      
      // Only vibrate if we have a pattern
      if (vibrationPattern.length > 0) {
        navigator.vibrate(vibrationPattern);
      }
    } catch (e) {
      console.error("Error triggering haptic feedback:", e);
    }
  };
  
  // Function to start a lesson
  const startLesson = (day) => {
    const lesson = dailyLessons.find(l => l.day === day);
    if (lesson) {
      setCurrentLesson(lesson);
      setCurrentExercise(0);
      setSessionProgress(0);
      
      // Announce lesson start for screen readers
      if (ariaLiveRef.current) {
        ariaLiveRef.current.textContent = `Starting lesson: Day ${day} - ${lesson.title}`;
      }
    }
  };
  
  // Function to handle exercise completion
  const completeExercise = () => {
    if (!currentLesson) return;
    
    const nextExercise = currentExercise + 1;
    
    // Update progress
    const totalExercises = currentLesson.exercises.length;
    const newProgress = Math.round((nextExercise / totalExercises) * 100);
    setSessionProgress(newProgress);
    
    // Check if reward exercise
    const currentEx = currentLesson.exercises[currentExercise];
    if (currentEx.type === 'reward') {
      setPoints(prev => prev + currentEx.points);
      setRewards(prev => [...prev, currentEx.badge]);
      
      // Announce reward for screen readers
      if (ariaLiveRef.current) {
        ariaLiveRef.current.textContent = `You earned ${currentEx.points} points and the ${currentEx.badge} badge!`;
      }
    }
    
    // Check if lesson is complete
    if (nextExercise >= totalExercises) {
      completeDailyLesson();
      return;
    }
    
    setCurrentExercise(nextExercise);
  };
  
  // Function to complete a daily lesson
  const completeDailyLesson = () => {
    const today = new Date().toISOString().split('T')[0];
    setLastCompleted(today);
    setStreakDays(prev => prev + 1);
    setPoints(prev => prev + currentLesson.totalPoints);
    
    // Reset exercise view
    setCurrentLesson(null);
    setCurrentExercise(0);
    
    // Update character mastery for characters in this lesson
    const chars = new Set();
    currentLesson.exercises.forEach(ex => {
      if (ex.char) chars.add(ex.char);
      if (ex.chars) ex.chars.forEach(c => chars.add(c));
    });
    
    chars.forEach(char => {
      const charData = characterMastery[char];
      if (charData) {
        dispatchMastery({ 
          type: 'UPDATE_MASTERY',
          char,
          mastery: Math.min(charData.mastery + 0.2, 1),
          correct: true
        });
        
        dispatchMastery({
          type: 'INTRODUCE_CHAR',
          char
        });
      }
    });
    
    // Advance the current day
    setCurrentDay(prevDay => prevDay + 1);
    
    // Announce lesson completion for screen readers
    if (ariaLiveRef.current) {
      ariaLiveRef.current.textContent = `Lesson complete! You earned ${currentLesson.totalPoints} points.`;
    }
  };
  
  // Function to update preferences
  const updatePreference = (key, value) => {
    dispatchPreferences({ 
      type: 'UPDATE_PREFERENCE',
      key,
      value
    });
  };
  
  // Render exercise content based on type
  const renderExerciseContent = () => {
    if (!currentLesson || currentExercise >= currentLesson.exercises.length) return null;
    
    const exercise = currentLesson.exercises[currentExercise];
    
    switch (exercise.type) {
      case 'intro':
      case 'technique':
      case 'patternIntro':
      case 'audio_recognition':
        return (
          <div className="bg-gray-800 rounded-xl p-6 text-center">
            <h3 className="text-xl font-bold mb-4 text-white">{exercise.title}</h3>
            <p className="text-gray-200 mb-6">{exercise.content}</p>
            <button 
              onClick={completeExercise}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              aria-label="Continue to next exercise"
            >
              Continue
            </button>
          </div>
        );
        
      case 'character':
        return (
          <div className="bg-gray-800 rounded-xl p-6 text-center">
            <h3 className="text-xl font-bold mb-2 text-white">New Character: {exercise.char}</h3>
            
            <div className="flex justify-center items-center my-6">
              <div className="text-6xl font-mono font-bold text-white mr-8">{exercise.char}</div>
              <div className="text-5xl text-indigo-400">{exercise.morse}</div>
            </div>
            
            <div className="flex justify-center space-x-2 my-6">
              {[...exercise.morse].map((symbol, idx) => (
                <button 
                  key={idx} 
                  className={`flex items-center justify-center ${
                    symbol === '•' ? 'w-8 h-8 rounded-full' : 'w-16 h-8 rounded-lg'
                  } bg-indigo-500`}
                  aria-label={symbol === '•' ? 'dot' : 'dash'}
                  onClick={() => {
                    initializeAudioContext();
                    playMorseSound(symbol);
                    triggerHaptic(symbol);
                  }}
                />
              ))}
            </div>
            
            <p className="text-gray-200 mb-6">{exercise.mnemonic}</p>
            
            <div className="flex justify-center space-x-4 mb-6">
              <button 
                onClick={() => {
                  initializeAudioContext();
                  playMorseSound(morseCodeMap[exercise.char]);
                  triggerHaptic(morseCodeMap[exercise.char]);
                }}
                className="px-3 py-2 bg-indigo-600 text-white rounded-lg flex items-center"
                aria-label={`Listen to Morse code for ${exercise.char}`}
              >
                <Volume2 size={18} className="mr-2" />
                <span>Listen</span>
              </button>
              
              <button 
                onClick={() => triggerHaptic(morseCodeMap[exercise.char])}
                className="px-3 py-2 bg-indigo-600 text-white rounded-lg flex items-center"
                disabled={!preferences.hapticEnabled}
                aria-label={`Feel haptic pattern for ${exercise.char}`}
              >
                <Vibrate size={18} className="mr-2" />
                <span>Feel</span>
              </button>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-lg mb-6">
              <div className="flex items-center justify-center mb-2">
                <Headphones size={24} className="text-indigo-400 mr-2" />
                <h4 className="font-bold text-white">Training Your Ear</h4>
              </div>
              <p className="text-sm text-gray-300">
                Listen to this character multiple times to train your brain to recognize the 
                sound pattern automatically. Press the Listen button several times and close your eyes
                while listening to focus on the sound.
              </p>
            </div>
            
            <button 
              onClick={completeExercise}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              aria-label="Confirm you understand the character and continue"
            >
              Got it!
            </button>
          </div>
        );
        
      case 'flashPractice':
        return (
          <div className="bg-gray-800 rounded-xl p-6 text-center">
            <h3 className="text-xl font-bold mb-4 text-white">
              Flash Practice: {exercise.char || exercise.chars?.join(', ')}
            </h3>
            
            <p className="text-gray-300 mb-6">
              I'll play these characters {exercise.reps} times with {exercise.interval} second intervals.
              Characters are played at full speed using Koch/Farnsworth methods.
            </p>
            
            <div className="flex justify-center mb-2">
              <div className="p-4 bg-gray-700 rounded-lg mb-4 inline-block">
                <h4 className="text-white font-bold mb-2">Koch Method with Farnsworth Timing</h4>
                <p className="text-sm text-gray-300 text-left">
                  Characters are played at <span className="text-green-400">{preferences.charSpeed} WPM</span> to train your brain 
                  to recognize the true sound patterns. The <span className="text-yellow-400">gaps between characters</span> are 
                  extended to give an effective speed of <span className="text-green-400">{preferences.effectiveSpeed} WPM</span>.
                </p>
              </div>
            </div>
            
            <div className="flex justify-center mb-6">
              <button 
                onClick={() => {
                  // Initialize audio context on user interaction
                  initializeAudioContext();
                  
                  // Clear any existing interval to prevent overlapping exercises
                  if (exerciseIntervalRef.current) {
                    clearInterval(exerciseIntervalRef.current);
                    exerciseIntervalRef.current = null;
                  }
                  
                  setIsExerciseActive(true);
                  
                  // Get the characters to practice
                  const charsToPractice = exercise.char ? [exercise.char] : exercise.chars;
                  const morsePatterns = charsToPractice.map(c => 
                    morseCodeMap[c]
                  ).filter(Boolean);
                  
                  // Announce for screen readers
                  if (ariaLiveRef.current) {
                    ariaLiveRef.current.textContent = `Starting flash practice for ${charsToPractice.join(', ')}`;
                  }
                  
                  let rep = 0;
                  const runExercise = () => {
                    if (rep >= exercise.reps) {
                      if (exerciseIntervalRef.current) {
                        clearTimeout(exerciseIntervalRef.current);
                        exerciseIntervalRef.current = null;
                      }
                      setIsExerciseActive(false);
                      
                      // Announce completion for screen readers
                      if (ariaLiveRef.current) {
                        ariaLiveRef.current.textContent = 'Flash practice complete';
                      }
                      return;
                    }
                    
                    // Play a random pattern from the available ones
                    const randomIndex = Math.floor(Math.random() * morsePatterns.length);
                    const randomPattern = morsePatterns[randomIndex];
                    const randomChar = charsToPractice[randomIndex];
                    
                    // Play the sound and trigger haptic feedback
                    playMorseSound(randomPattern);
                    triggerHaptic(randomPattern);
                    
                    // Announce for screen readers
                    if (ariaLiveRef.current) {
                      ariaLiveRef.current.textContent = `Playing ${randomChar}`;
                    }
                    
                    rep++;
                    // Schedule next repetition
                    exerciseIntervalRef.current = setTimeout(runExercise, exercise.interval * 1000);
                  };
                  
                  // Start the exercise
                  runExercise();
                }}
                disabled={isExerciseActive}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  isExerciseActive ? 'bg-gray-600 text-gray-400' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                } transition-colors`}
                aria-label={isExerciseActive ? "Flash practice in progress" : "Start flash practice"}
              >
                {isExerciseActive ? (
                  <>
                    <Pause size={18} className="mr-2" />
                    <span>In Progress...</span>
                  </>
                ) : (
                  <>
                    <Play size={18} className="mr-2" />
                    <span>Start Flash Practice</span>
                  </>
                )}
              </button>
            </div>
            
            <button 
              onClick={() => {
                // Clear any ongoing exercise before continuing
                if (exerciseIntervalRef.current) {
                  clearTimeout(exerciseIntervalRef.current);
                  exerciseIntervalRef.current = null;
                }
                setIsExerciseActive(false);
                completeExercise();
              }}
              disabled={isExerciseActive}
              className={`px-4 py-2 rounded-lg ${
                isExerciseActive ? 'bg-gray-600 text-gray-400' : 'bg-green-600 text-white hover:bg-green-700'
              } transition-colors`}
              aria-label="Complete exercise and continue"
            >
              Complete
            </button>
          </div>
        );
      
      case 'comprehension':
      case 'contrastPractice':
      case 'multiCharPractice':
        return (
          <div className="bg-gray-800 rounded-xl p-6 text-center">
            <h3 className="text-xl font-bold mb-4 text-white">
              Practice: {exercise.chars.join(' vs ')}
            </h3>
            
            <p className="text-gray-300 mb-6">
              I'll play a random sequence of {exercise.chars.join(', ')}. Try to identify each character by sound.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {exercise.chars.map(char => {
                const morse = getDisplayMorse(char);
                return (
                  <button
                    key={char}
                    onClick={() => {
                      // Initialize audio context on user interaction
                      initializeAudioContext();
                      playMorseSound(morseCodeMap[char]);
                      triggerHaptic(morseCodeMap[char]);
                    }}
                    className="p-4 bg-gray-900 rounded-lg hover:bg-gray-700 transition-colors"
                    aria-label={`Play Morse code for letter ${char}`}
                  >
                    <div className="text-4xl font-mono font-bold text-white mb-2">{char}</div>
                    <div className="text-xl text-indigo-400">{morse}</div>
                  </button>
                );
              })}
            </div>
            
            <div className="bg-gray-700 p-4 rounded-lg mb-6">
              <div className="flex items-center justify-center mb-2">
                <Ear size={24} className="text-indigo-400 mr-2" />
                <h4 className="font-bold text-white">Sound Identification Challenge</h4>
              </div>
              <p className="text-sm text-gray-300">
                When you start the practice, close your eyes and try to identify each character 
                by sound BEFORE looking at the answers. This trains your ear to recognize Morse patterns.
              </p>
            </div>
            
            <div className="flex justify-center mb-6">
              <button 
                onClick={() => {
                  // Initialize audio context on user interaction
                  initializeAudioContext();
                  
                  // Clear any existing timers to prevent overlapping exercises
                  if (exerciseIntervalRef.current) {
                    clearTimeout(exerciseIntervalRef.current);
                    exerciseIntervalRef.current = null;
                  }
                  
                  // Clear all pending timeouts to be safe
                  let timeouts = [];
                  
                  setIsExerciseActive(true);
                  
                  // Get the characters to practice (using original morse code map)
                  const morsePatterns = exercise.chars.map(c => morseCodeMap[c]).filter(Boolean);
                  
                  // Announce for screen readers
                  if (ariaLiveRef.current) {
                    ariaLiveRef.current.textContent = `Starting practice with ${exercise.chars.join(', ')}`;
                  }
                  
                  let setCount = 0;
                  const playSet = () => {
                    if (setCount >= exercise.sets) {
                      // Clear all timeouts
                      timeouts.forEach(id => clearTimeout(id));
                      timeouts = [];
                      
                      setIsExerciseActive(false);
                      
                      // Announce completion for screen readers
                      if (ariaLiveRef.current) {
                        ariaLiveRef.current.textContent = 'Practice complete';
                      }
                      return;
                    }
                    
                    // Play 3 random patterns with 1.5 second gaps
                    for (let i = 0; i < 3; i++) {
                      const timeoutId = setTimeout(() => {
                        const randomIndex = Math.floor(Math.random() * morsePatterns.length);
                        const randomPattern = morsePatterns[randomIndex];
                        const randomChar = exercise.chars[randomIndex];
                        
                        playMorseSound(randomPattern);
                        triggerHaptic(randomPattern);
                        
                        // Announce for screen readers
                        if (ariaLiveRef.current) {
                          ariaLiveRef.current.textContent = `Playing ${randomChar}`;
                        }
                      }, i * 1500);
                      
                      timeouts.push(timeoutId);
                    }
                    
                    setCount++;
                    if (setCount < exercise.sets) {
                      exerciseIntervalRef.current = setTimeout(() => {
                        exerciseIntervalRef.current = null;
                        playSet();
                      }, 5000); // 5 seconds between sets
                      
                      timeouts.push(exerciseIntervalRef.current);
                    } else {
                      const finalTimeout = setTimeout(() => {
                        setIsExerciseActive(false);
                      }, 3000);
                      
                      timeouts.push(finalTimeout);
                    }
                  };
                  
                  playSet();
                }}
                disabled={isExerciseActive}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  isExerciseActive ? 'bg-gray-600 text-gray-400' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                } transition-colors`}
                aria-label={isExerciseActive ? "Practice in progress" : "Start practice sets"}
              >
                {isExerciseActive ? (
                  <>
                    <Pause size={18} className="mr-2" aria-hidden="true" />
                    <span>Playing Sets...</span>
                  </>
                ) : (
                  <>
                    <Play size={18} className="mr-2" aria-hidden="true" />
                    <span>Start Practice Sets</span>
                  </>
                )}
              </button>
            </div>
            
            <button 
              onClick={() => {
                // Clean up any ongoing exercises
                if (exerciseIntervalRef.current) {
                  clearTimeout(exerciseIntervalRef.current);
                  exerciseIntervalRef.current = null;
                }
                setIsExerciseActive(false);
                completeExercise();
              }}
              disabled={isExerciseActive}
              className={`px-4 py-2 rounded-lg ${
                isExerciseActive ? 'bg-gray-600 text-gray-400' : 'bg-green-600 text-white hover:bg-green-700'
              } transition-colors`}
              aria-label="Complete exercise and continue"
            >
              Complete
            </button>
          </div>
        );
      
      case 'review':
      case 'spaceRep':
        return (
          <div className="bg-gray-800 rounded-xl p-6 text-center">
            <h3 className="text-xl font-bold mb-4 text-white">
              Review: {exercise.chars.join(', ')}
            </h3>
            
            <p className="text-gray-300 mb-6">
              Let's quickly review these characters before learning new ones.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {exercise.chars.map(char => {
                const morse = getDisplayMorse(char);
                return (
                  <button
                    key={char}
                    onClick={() => {
                      initializeAudioContext();
                      playMorseSound(morseCodeMap[char]);
                      triggerHaptic(morseCodeMap[char]);
                    }}
                    className="p-4 bg-gray-900 rounded-lg hover:bg-gray-700 transition-colors"
                    aria-label={`Play Morse code for letter ${char}`}
                  >
                    <div className="text-4xl font-mono font-bold text-white mb-2">{char}</div>
                    <div className="text-xl text-indigo-400">{morse}</div>
                  </button>
                );
              })}
            </div>
            
            <div className="bg-gray-700 p-4 rounded-lg mb-6">
              <div className="flex items-center justify-center mb-2">
                <Zap size={24} className="text-indigo-400 mr-2" />
                <h4 className="font-bold text-white">Spaced Repetition Boost</h4>
              </div>
              <p className="text-sm text-gray-300">
                Reviewing these characters now strengthens your neural pathways. 
                Spaced repetition is proven to be highly effective for AuDHD learners!
              </p>
            </div>
            
            <button 
              onClick={completeExercise}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              aria-label="Continue to next exercise"
            >
              Continue
            </button>
          </div>
        );
      
      case 'rhythm_tapping':
        return (
          <div className="bg-gray-800 rounded-xl p-6 text-center">
            <h3 className="text-xl font-bold mb-4 text-white">{exercise.title}</h3>
            <p className="text-gray-200 mb-6">{exercise.content}</p>
            
            <div className="flex justify-center space-x-8 mb-6">
              <div className="text-center">
                <div className="text-4xl font-mono font-bold text-white mb-2">E = •</div>
                <button
                  onClick={() => {
                    initializeAudioContext();
                    playMorseSound('.');
                    triggerHaptic('.');
                  }}
                  className="w-16 h-16 mx-auto rounded-full border-4 border-indigo-400 flex items-center justify-center hover:bg-indigo-900 transition-colors"
                  aria-label="Tap rhythm for E"
                >
                  <div className="w-4 h-4 bg-indigo-400 rounded-full"></div>
                </button>
                <p className="text-gray-300 mt-2">Tap once quickly</p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-mono font-bold text-white mb-2">T = −</div>
                <button
                  onClick={() => {
                    initializeAudioContext();
                    playMorseSound('-');
                    triggerHaptic('-');
                  }}
                  className="w-16 h-16 mx-auto rounded-lg border-4 border-indigo-500 flex items-center justify-center hover:bg-indigo-900 transition-colors"
                  aria-label="Tap rhythm for T"
                >
                  <div className="w-12 h-4 bg-indigo-500 rounded-lg"></div>
                </button>
                <p className="text-gray-300 mt-2">Press and hold</p>
              </div>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-lg mb-6">
              <div className="flex items-center justify-center mb-2">
                <Headphones size={24} className="text-indigo-400 mr-2" />
                <h4 className="font-bold text-white">Rhythm is Key to Morse Code</h4>
              </div>
              <p className="text-sm text-gray-300">
                Feeling the rhythm of dots and dashes helps your brain process the patterns 
                more efficiently. Tap along with the sounds to strengthen these neural connections.
              </p>
            </div>
            
            <button 
              onClick={completeExercise}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              aria-label="Confirm you understand and continue"
            >
              Got it!
            </button>
          </div>
        );
      
      case 'reward':
        return (
          <div className="bg-gray-800 rounded-xl p-6 text-center">
            <div className="text-yellow-300 text-4xl mb-4">🎉</div>
            <h3 className="text-xl font-bold mb-2 text-white">{exercise.title}</h3>
            <p className="text-gray-200 mb-4">{exercise.content}</p>
            
            <div className="bg-gray-700 rounded-lg p-4 mb-6 inline-block">
              <div className="flex items-center">
                <Star size={20} className="text-yellow-400 mr-2" />
                <span className="text-yellow-100">+{exercise.points} points</span>
              </div>
              <div className="flex items-center mt-2">
                <Award size={20} className="text-indigo-400 mr-2" />
                <span className="text-indigo-200">New badge: {exercise.badge}</span>
              </div>
            </div>
            
            <button 
              onClick={completeExercise}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              aria-label="Continue to next exercise"
            >
              Continue
            </button>
          </div>
        );
      
      default:
        return (
          <div className="bg-gray-800 rounded-xl p-6 text-center">
            <p className="text-gray-200 mb-4">Unknown exercise type</p>
            <button 
              onClick={completeExercise}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              aria-label="Skip this exercise"
            >
              Skip
            </button>
          </div>
        );
    }
  };

  // Main render
  return (
    <AppContext.Provider value={{ 
      characterMastery, 
      dispatchMastery, 
      preferences, 
      dispatchPreferences,
      points,
      setPoints,
      rewards,
      setRewards 
    }}>
      <div className={`flex flex-col h-screen ${
        preferences.colorMode === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-800'
      }`}>
        {/* ARIA live region for screen reader announcements */}
        <div 
          ref={ariaLiveRef} 
          className="sr-only" 
          aria-live="polite"
          aria-atomic="true"
        ></div>
        
        {/* App Header */}
        <header className={`${
          preferences.colorMode === 'dark' ? 'bg-gray-800' : 'bg-indigo-600'
        } text-white p-4 shadow-md`}>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Morse for AuDHD</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-opacity-25 bg-black rounded-full px-3 py-1">
                <Star size={16} className="text-yellow-400 mr-1" aria-hidden="true" />
                <span aria-label={`${points} points`}>{points}</span>
              </div>
              
              <div className="flex items-center bg-opacity-25 bg-black rounded-full px-3 py-1">
                <Calendar size={16} className="mr-1" aria-hidden="true" />
                <span aria-label={`${streakDays} day streak`}>Streak: {streakDays}</span>
              </div>
              
              <button 
                className="p-2 rounded-full hover:bg-opacity-20 hover:bg-black transition-colors"
                onClick={() => setCurrentTab('settings')}
                aria-label="Settings"
              >
                <Settings size={22} aria-hidden="true" />
              </button>
            </div>
          </div>
        </header>
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4">
          {currentTab === 'home' && (
            <div className="space-y-6">
              <div className={`${
                preferences.colorMode === 'dark' ? 'bg-gray-800' : 'bg-white'
              } rounded-xl shadow-md p-6`}>
                <h2 className="text-xl font-bold mb-4">Your Morse Journey</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className={`p-4 rounded-lg ${
                    preferences.colorMode === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    <h3 className="font-bold mb-1">Daily Streak</h3>
                    <div className="flex items-center">
                      <div className="text-3xl font-bold mr-2">{streakDays}</div>
                      <div className="text-sm">days</div>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${
                    preferences.colorMode === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    <h3 className="font-bold mb-1">Characters Learned</h3>
                    <div className="flex items-center">
                      <div className="text-3xl font-bold mr-2">
                        {Object.values(characterMastery).filter(char => char.introduced).length}
                      </div>
                      <div className="text-sm">of {characterProgression.length}</div>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${
                    preferences.colorMode === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    <h3 className="font-bold mb-1">Points Earned</h3>
                    <div className="flex items-center">
                      <div className="text-3xl font-bold mr-2">{points}</div>
                      <div className="text-sm">points</div>
                    </div>
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg mb-4 ${
                  preferences.colorMode === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <h3 className="font-bold mb-2">Today's Goal</h3>
                  <p className="mb-3">Complete your daily {preferences.sessionLength}-minute Morse session</p>
                  <div className="flex justify-between">
                    <button
                      onClick={() => {
                        setCurrentTab('learn');
                        const nextLesson = lastCompleted === new Date().toISOString().split('T')[0]
                          ? currentDay + 1 
                          : currentDay;
                        startLesson(nextLesson);
                      }}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      aria-label="Start today's lesson"
                    >
                      Start Today's Lesson
                    </button>
                    
                    <button
                      onClick={() => setCurrentTab('practice')}
                      className={`px-4 py-2 rounded-lg ${
                        preferences.colorMode === 'dark'
                          ? 'bg-gray-600 text-white hover:bg-gray-500'
                          : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
                      } transition-colors`}
                      aria-label="Go to quick practice"
                    >
                      Quick Practice
                    </button>
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg mb-6 ${
                  preferences.colorMode === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <div className="flex items-center mb-3">
                    <Info size={18} className="text-indigo-400 mr-2" />
                    <h3 className="font-bold">About the Koch Method</h3>
                  </div>
                  <p className="text-sm mb-2">
                    This app uses the Koch method, which introduces characters one at a time at full speed 
                    ({preferences.charSpeed} WPM). The spacing between characters is extended to achieve an effective 
                    speed of {preferences.effectiveSpeed} WPM (Farnsworth timing).
                  </p>
                  <p className="text-sm">
                    Research shows this approach is highly effective for developing auditory pattern 
                    recognition, especially for AuDHD learners who benefit from consistent, structured learning.
                  </p>
                </div>
                
                <h3 className="font-bold mb-3">Learning Path</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {dailyLessons.slice(0, Math.min(dailyLessons.length, 10)).map((lesson) => (
                    <div 
                      key={lesson.day} 
                      className={`flex items-center p-3 rounded-lg ${
                        lesson.day < currentDay
                          ? preferences.colorMode === 'dark' 
                            ? 'bg-indigo-900 bg-opacity-30' 
                            : 'bg-indigo-100'
                          : lesson.day === currentDay
                            ? preferences.colorMode === 'dark'
                              ? 'bg-indigo-800 border border-indigo-500'
                              : 'bg-indigo-200 border border-indigo-400'
                            : preferences.colorMode === 'dark'
                              ? 'bg-gray-700 opacity-70'
                              : 'bg-gray-100 opacity-70'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        lesson.day < currentDay
                          ? 'bg-green-500 text-white'
                          : lesson.day === currentDay
                            ? 'bg-indigo-600 text-white'
                            : preferences.colorMode === 'dark'
                              ? 'bg-gray-600 text-gray-300'
                              : 'bg-gray-300 text-gray-700'
                      }`}>
                        {lesson.day < currentDay ? (
                          <CheckCircle size={16} aria-hidden="true" />
                        ) : (
                          lesson.day
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="font-bold">{lesson.title}</div>
                        <div className="text-sm">
                          {lesson.description}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => {
                          setCurrentTab('learn');
                          startLesson(lesson.day);
                        }}
                        disabled={lesson.day > currentDay}
                        className={`ml-2 px-3 py-1 rounded-lg ${
                          lesson.day <= currentDay
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                            : preferences.colorMode === 'dark'
                              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                        aria-label={lesson.day < currentDay ? `Review day ${lesson.day}` : 
                                   lesson.day === currentDay ? `Start day ${lesson.day}` : 
                                   `Day ${lesson.day} locked`}
                      >
                        {lesson.day < currentDay ? 'Review' : lesson.day === currentDay ? 'Start' : 'Locked'}
                      </button>
                    </div>
                  ))}
                  {dailyLessons.length > 10 && (
                    <div className="text-center text-sm text-gray-400 py-2">
                      {dailyLessons.length - 10} more lessons will unlock as you progress
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {currentTab === 'learn' && !currentLesson && (
            <div className="space-y-6">
              <div className={`${
                preferences.colorMode === 'dark' ? 'bg-gray-800' : 'bg-white'
              } rounded-xl shadow-md p-6`}>
                <h2 className="text-xl font-bold mb-4">Daily Lessons</h2>
                
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {dailyLessons.map((lesson) => (
                    <div 
                      key={lesson.day} 
                      className={`border rounded-lg p-4 ${
                        preferences.colorMode === 'dark' 
                          ? 'border-gray-700 bg-gray-700' 
                          : 'border-gray-200 bg-gray-50'
                      } ${lesson.day > currentDay ? 'opacity-60' : ''}`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-bold">Day {lesson.day}: {lesson.title}</h3>
                          <p className={`text-sm ${
                            preferences.colorMode === 'dark' ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {lesson.description}
                          </p>
                          <div className="flex items-center mt-1 text-sm">
                            <Clock size={14} className="mr-1" aria-hidden="true" />
                            <span>{lesson.duration} minutes</span>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => startLesson(lesson.day)}
                          disabled={lesson.day > currentDay}
                          className={`px-3 py-1 rounded-lg ${
                            lesson.day <= currentDay 
                              ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                              : preferences.colorMode === 'dark'
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                          }`}
                          aria-label={`Start day ${lesson.day} lesson`}
                        >
                          {lesson.day <= currentDay ? 'Start' : 'Locked'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className={`${
                preferences.colorMode === 'dark' ? 'bg-gray-800' : 'bg-white'
              } rounded-xl shadow-md p-6`}>
                <h2 className="text-xl font-bold mb-4">Character Mastery</h2>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-h-64 overflow-y-auto pr-2">
                  {Object.entries(characterMastery).map(([char, data]) => (
                    <div 
                      key={char}
                      className={`p-4 rounded-lg ${
                        data.introduced 
                          ? preferences.colorMode === 'dark' 
                            ? 'bg-gray-700' 
                            : 'bg-gray-100'
                          : preferences.colorMode === 'dark'
                            ? 'bg-gray-900 opacity-40'
                            : 'bg-gray-200 opacity-40'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-2xl font-mono font-bold">{char}</span>
                        {data.introduced ? (
                          <Unlock size={16} className="text-green-400" aria-hidden="true" />
                        ) : (
                          <Lock size={16} className="text-gray-500" aria-hidden="true" />
                        )}
                      </div>
                      
                      <div className="w-full bg-gray-600 rounded-full h-2 mb-1" 
                           role="progressbar" 
                           aria-valuenow={Math.round(data.mastery * 100)}
                           aria-valuemin="0"
                           aria-valuemax="100"
                           aria-label={`Character ${char} mastery level ${Math.round(data.mastery * 100)}%`}>
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${data.mastery * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-right">
                        {Math.round(data.mastery * 100)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {currentTab === 'learn' && currentLesson && (
            <div className="space-y-6">
              <div className={`${
                preferences.colorMode === 'dark' ? 'bg-gray-800' : 'bg-white'
              } rounded-xl shadow-md p-4`}>
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-bold">Day {currentLesson.day}: {currentLesson.title}</h2>
                  <div className="flex items-center">
                    <Clock size={18} className="mr-1" aria-hidden="true" />
                    <span>{currentLesson.duration} min</span>
                  </div>
                </div>
                
                <div className="w-full bg-gray-700 rounded-full h-2 mb-1"
                     role="progressbar"
                     aria-valuenow={sessionProgress}
                     aria-valuemin="0"
                     aria-valuemax="100"
                     aria-label={`Lesson progress: ${sessionProgress}%`}>
                  <div 
                    className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${sessionProgress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Exercise {currentExercise + 1} of {currentLesson.exercises.length}</span>
                  <span>{sessionProgress}% complete</span>
                </div>
              </div>
              
              {renderExerciseContent()}
            </div>
          )}
          
          {currentTab === 'practice' && (
            <div className="space-y-6">
              <div className={`${
                preferences.colorMode === 'dark' ? 'bg-gray-800' : 'bg-white'
              } rounded-xl shadow-md p-6`}>
                <h2 className="text-xl font-bold mb-4">Spaced Repetition Practice</h2>
                <p className={`mb-4 ${
                  preferences.colorMode === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Quick practice sessions use spaced repetition to help cement your Morse code knowledge. Sessions are timed for your optimal learning period.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className={`p-4 rounded-lg ${
                    preferences.colorMode === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    <h3 className="font-bold mb-3">Micro-Burst Practice</h3>
                    <p className="text-sm mb-3">3-5 second bursts of Morse code with immediate feedback. Great for maintaining focus and active recall.</p>
                    <div className="flex justify-between items-center">
                      <div className="text-sm">3 minutes</div>
                      <button
                        className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        aria-label="Start micro-burst practice"
                        onClick={() => {
                          initializeAudioContext();
                          // In a full implementation, this would start a micro-burst exercise
                          if (ariaLiveRef.current) {
                            ariaLiveRef.current.textContent = "Starting micro-burst practice";
                          }
                        }}
                      >
                        Start
                      </button>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${
                    preferences.colorMode === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    <h3 className="font-bold mb-3">Sound Recognition</h3>
                    <p className="text-sm mb-3">Focus on distinguishing between similar sound patterns. Builds neural pathways for faster recognition.</p>
                    <div className="flex justify-between items-center">
                      <div className="text-sm">5 minutes</div>
                      <button
                        className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        aria-label="Start sound recognition drill"
                        onClick={() => {
                          initializeAudioContext();
                          // In a full implementation, this would start a pattern recognition exercise
                          if (ariaLiveRef.current) {
                            ariaLiveRef.current.textContent = "Starting sound recognition drill";
                          }
                        }}
                      >
                        Start
                      </button>
                    </div>
                  </div>
                </div>
                
                <h3 className="font-bold mb-3">Characters to Practice</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-6 max-h-64 overflow-y-auto pr-2">
                  {Object.entries(characterMastery)
                    .filter(([_, data]) => data.introduced)
                    .map(([char, data]) => (
                      <button 
                        key={char}
                        className={`p-2 rounded-lg text-center ${
                          preferences.colorMode === 'dark' 
                            ? 'bg-gray-700 hover:bg-gray-600 cursor-pointer' 
                            : 'bg-gray-100 hover:bg-gray-200 cursor-pointer'
                        }`}
                        onClick={() => {
                          initializeAudioContext();
                          playMorseSound(morseCodeMap[char]);
                          triggerHaptic(morseCodeMap[char]);
                        }}
                        aria-label={`Practice letter ${char}`}
                      >
                        <div className="flex justify-center items-center">
                          <div className="text-2xl font-mono font-bold">{char}</div>
                          <div className="ml-2 w-2 h-2 rounded-full" style={{
                            backgroundColor: data.mastery > 0.8 ? '#10B981' : 
                                            data.mastery > 0.5 ? '#FBBF24' : '#EF4444'
                          }} aria-hidden="true"></div>
                        </div>
                        <div className="text-xs mt-1 text-indigo-300">
                          {getDisplayMorse(char)}
                        </div>
                      </button>
                    ))}
                </div>
                
                <h3 className="font-bold mb-3">Audio Training Drills</h3>
                <div className="space-y-3">
                  <div className={`p-4 rounded-lg ${
                    preferences.colorMode === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                  } flex justify-between items-center`}>
                    <div>
                      <h4 className="font-bold">Audio → Visual Drill</h4>
                      <p className="text-sm">Hear a character, then identify its visual representation</p>
                    </div>
                    <button
                      className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      aria-label="Start audio to visual drill"
                      onClick={() => {
                        initializeAudioContext();
                        // In a full implementation, this would start an audio-to-visual drill
                        if (ariaLiveRef.current) {
                          ariaLiveRef.current.textContent = "Starting audio to visual drill";
                        }
                      }}
                    >
                      Start
                    </button>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${
                    preferences.colorMode === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                  } flex justify-between items-center`}>
                    <div>
                      <h4 className="font-bold">Ear Training Challenge</h4>
                      <p className="text-sm">Identify characters by sound only, without visual aids</p>
                    </div>
                    <button
                      className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      aria-label="Start ear training challenge"
                      onClick={() => {
                        initializeAudioContext();
                        // In a full implementation, this would start an audio-only drill
                        if (ariaLiveRef.current) {
                          ariaLiveRef.current.textContent = "Starting ear training challenge";
                        }
                      }}
                    >
                      Start
                    </button>
                  </div>
                  
                  {preferences.hapticEnabled && (
                    <div className={`p-4 rounded-lg ${
                      preferences.colorMode === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                    } flex justify-between items-center`}>
                      <div>
                        <h4 className="font-bold">Haptic Drill</h4>
                        <p className="text-sm">Feel a pattern, then identify the character</p>
                      </div>
                      <button
                        className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        aria-label="Start haptic drill"
                        onClick={() => {
                          // In a full implementation, this would start a haptic exercise
                          if (ariaLiveRef.current) {
                            ariaLiveRef.current.textContent = "Starting haptic drill";
                          }
                        }}
                      >
                        Start
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {currentTab === 'progress' && (
            <div className="space-y-6">
              <div className={`${
                preferences.colorMode === 'dark' ? 'bg-gray-800' : 'bg-white'
              } rounded-xl shadow-md p-6`}>
                <h2 className="text-xl font-bold mb-4">Your Learning Progress</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className={`p-4 rounded-lg ${
                    preferences.colorMode === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    <h3 className="font-bold mb-1">Course Progress</h3>
                    <div className="text-3xl font-bold mb-2">{Math.round((currentDay - 1) / dailyLessons.length * 100)}%</div>
                    <div className="w-full bg-gray-600 rounded-full h-2 mb-1"
                         role="progressbar"
                         aria-valuenow={Math.round((currentDay - 1) / dailyLessons.length * 100)}
                         aria-valuemin="0"
                         aria-valuemax="100">
                      <div 
                        className="bg-indigo-500 h-2 rounded-full"
                        style={{ width: `${(currentDay - 1) / dailyLessons.length * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-sm">Day {currentDay - 1} of {dailyLessons.length}</div>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${
                    preferences.colorMode === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    <h3 className="font-bold mb-1">Character Mastery</h3>
                    <div className="text-3xl font-bold mb-2">
                      {Math.round(Object.values(characterMastery).reduce((sum, char) => sum + char.mastery, 0) / 
                      Object.values(characterMastery).length * 100)}%
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2 mb-1"
                         role="progressbar"
                         aria-valuenow={Math.round(Object.values(characterMastery).reduce((sum, char) => sum + char.mastery, 0) / 
                           Object.values(characterMastery).length * 100)}
                         aria-valuemin="0"
                         aria-valuemax="100">
                      <div 
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${Object.values(characterMastery).reduce((sum, char) => sum + char.mastery, 0) / 
                          Object.values(characterMastery).length * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-sm">{Object.values(characterMastery).filter(char => char.mastery > 0.8).length} characters mastered</div>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${
                    preferences.colorMode === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    <h3 className="font-bold mb-1">Practice Consistency</h3>
                    <div className="text-3xl font-bold mb-2">{streakDays}</div>
                    <div className="flex justify-between">
                      {[...Array(7)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-8 h-8 rounded-md flex items-center justify-center ${
                            i < streakDays % 7
                              ? 'bg-indigo-600 text-white'
                              : preferences.colorMode === 'dark'
                                ? 'bg-gray-600 text-gray-400'
                                : 'bg-gray-300 text-gray-600'
                          }`}
                          aria-hidden="true"
                        >
                          {i < streakDays % 7 ? <CheckCircle size={16} /> : ""}
                        </div>
                      ))}
                    </div>
                    <div className="text-sm mt-1">Current streak</div>
                  </div>
                </div>
                
                <h3 className="font-bold mb-3">Character Mastery Details</h3>
                <div className="space-y-3 mb-6 max-h-96 overflow-y-auto pr-2">
                  {patternFamilies.map((family, idx) => (
                    <div 
                      key={idx}
                      className={`p-4 rounded-lg ${
                        preferences.colorMode === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                      }`}
                    >
                      <h4 className="font-bold mb-2">{family.name}</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {family.characters.map((char) => {
                          const charData = characterMastery[char.char];
                          return (
                            <div key={char.char} className="flex items-center">
                              <div className="text-xl font-mono font-bold mr-2">{char.char}</div>
                              <div className="flex-1">
                                <div className="w-full bg-gray-600 rounded-full h-2 mb-1"
                                     role="progressbar"
                                     aria-valuenow={Math.round((charData?.mastery || 0) * 100)}
                                     aria-valuemin="0"
                                     aria-valuemax="100"
                                     aria-label={`Character ${char.char} mastery level ${Math.round((charData?.mastery || 0) * 100)}%`}>
                                  <div 
                                    className={`h-2 rounded-full ${
                                      charData?.mastery > 0.8 ? 'bg-green-500' : 
                                      charData?.mastery > 0.5 ? 'bg-yellow-500' : 
                                      charData?.mastery > 0 ? 'bg-red-500' : 'bg-gray-500'
                                    }`}
                                    style={{ width: `${(charData?.mastery || 0) * 100}%` }}
                                  ></div>
                                </div>
                                <div className="text-xs">
                                  {charData?.introduced ? `${Math.round((charData?.mastery || 0) * 100)}%` : 'Locked'}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                
                <h3 className="font-bold mb-3">Unlocked Achievements</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {rewards.map((badge, idx) => (
                    <div 
                      key={idx}
                      className={`p-3 rounded-lg text-center ${
                        preferences.colorMode === 'dark' ? 'bg-indigo-900 bg-opacity-30' : 'bg-indigo-100'
                      }`}
                    >
                      <div className="text-2xl mb-1" aria-hidden="true">🏆</div>
                      <div className="font-bold">{badge}</div>
                    </div>
                  ))}
                  
                  {/* Placeholder for locked achievements */}
                  {[...Array(Math.max(0, 4 - rewards.length))].map((_, idx) => (
                    <div 
                      key={`locked-${idx}`}
                      className={`p-3 rounded-lg text-center ${
                        preferences.colorMode === 'dark' ? 'bg-gray-700 opacity-50' : 'bg-gray-200 opacity-50'
                      }`}
                      aria-hidden="true"
                    >
                      <div className="text-2xl mb-1">🔒</div>
                      <div className="font-bold">???</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {currentTab === 'settings' && (
            <div className={`${
              preferences.colorMode === 'dark' ? 'bg-gray-800' : 'bg-white'
            } rounded-xl shadow-md p-6`}>
              <h2 className="text-xl font-bold mb-6">Settings & Preferences</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="font-bold mb-3">Visual Preferences</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Color Mode</label>
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => updatePreference('colorMode', 'light')}
                          className={`px-3 py-1 rounded-lg text-sm ${
                            preferences.colorMode === 'light' 
                              ? 'bg-indigo-600 text-white' 
                              : preferences.colorMode === 'dark'
                                ? 'bg-gray-700 text-gray-300'
                                : 'bg-gray-200 text-gray-700'
                          }`}
                          aria-label="Set light color mode"
                        >
                          Light
                        </button>
                        <button 
                          onClick={() => updatePreference('colorMode', 'dark')}
                          className={`px-3 py-1 rounded-lg text-sm ${
                            preferences.colorMode === 'dark' 
                              ? 'bg-indigo-600 text-white' 
                              : preferences.colorMode === 'dark'
                                ? 'bg-gray-700 text-gray-300'
                                : 'bg-gray-200 text-gray-700'
                          }`}
                          aria-label="Set dark color mode"
                        >
                          Dark
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Visual Style</label>
                      <div className="flex flex-wrap gap-2">
                        <button 
                          onClick={() => updatePreference('visualStyle', 'standard')}
                          className={`px-3 py-1 rounded-lg text-sm ${
                            preferences.visualStyle === 'standard' 
                              ? 'bg-indigo-600 text-white' 
                              : preferences.colorMode === 'dark'
                                ? 'bg-gray-700 text-gray-300'
                                : 'bg-gray-200 text-gray-700'
                          }`}
                          aria-label="Set standard visual style"
                        >
                          Standard
                        </button>
                        <button 
                          onClick={() => updatePreference('visualStyle', 'high-contrast')}
                          className={`px-3 py-1 rounded-lg text-sm ${
                            preferences.visualStyle === 'high-contrast' 
                              ? 'bg-indigo-600 text-white' 
                              : preferences.colorMode === 'dark'
                                ? 'bg-gray-700 text-gray-300'
                                : 'bg-gray-200 text-gray-700'
                          }`}
                          aria-label="Set high contrast visual style"
                        >
                          High Contrast
                        </button>
                        <button 
                          onClick={() => updatePreference('visualStyle', 'dyslexia-friendly')}
                          className={`px-3 py-1 rounded-lg text-sm ${
                            preferences.visualStyle === 'dyslexia-friendly' 
                              ? 'bg-indigo-600 text-white' 
                              : preferences.colorMode === 'dark'
                                ? 'bg-gray-700 text-gray-300'
                                : 'bg-gray-200 text-gray-700'
                          }`}
                          aria-label="Set dyslexia friendly visual style"
                        >
                          Dyslexia Friendly
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-bold mb-3">Audio Preferences</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Sound Volume</label>
                      <div className="flex items-center space-x-2">
                        <VolumeX size={18} aria-hidden="true" />
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={preferences.soundVolume} 
                          onChange={(e) => updatePreference('soundVolume', parseInt(e.target.value))}
                          className="w-48"
                          aria-label="Sound volume slider"
                        />
                        <Volume2 size={18} aria-hidden="true" />
                        <span className="w-8 text-right">{preferences.soundVolume}%</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Sound Pitch (Hz)</label>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="range" 
                          min="300" 
                          max="1000" 
                          step="20"
                          value={preferences.soundPitch} 
                          onChange={(e) => updatePreference('soundPitch', parseInt(e.target.value))}
                          className="w-48"
                          aria-label="Sound pitch slider"
                        />
                        <span className="w-12 text-right">{preferences.soundPitch}Hz</span>
                      </div>
                      <p className={`text-xs mt-1 ${
                        preferences.colorMode === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Find a pitch that works best for your hearing sensitivity
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Morse Code Timing</label>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm">Character Speed (Fixed for Koch method)</p>
                          <div className="flex items-center space-x-2">
                            <input 
                              type="range" 
                              min="15" 
                              max="25" 
                              step="1"
                              value={preferences.charSpeed} 
                              onChange={(e) => updatePreference('charSpeed', parseInt(e.target.value))}
                              className="w-48"
                              aria-label="Character speed slider"
                              disabled
                            />
                            <span className="w-16 text-right">{preferences.charSpeed} WPM</span>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm">Effective Speed (Farnsworth spacing)</p>
                          <div className="flex items-center space-x-2">
                            <input 
                              type="range" 
                              min="5" 
                              max={preferences.charSpeed} 
                              step="1"
                              value={preferences.effectiveSpeed} 
                              onChange={(e) => updatePreference('effectiveSpeed', parseInt(e.target.value))}
                              className="w-48"
                              aria-label="Effective speed slider"
                            />
                            <span className="w-16 text-right">{preferences.effectiveSpeed} WPM</span>
                          </div>
                          <p className={`text-xs mt-1 ${
                            preferences.colorMode === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            Lower effective speed means more time between characters
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-bold mb-3">Haptic Feedback</h3>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="haptic-toggle"
                      checked={preferences.hapticEnabled}
                      onChange={(e) => updatePreference('hapticEnabled', e.target.checked)}
                      className="h-4 w-4 rounded"
                      aria-label="Enable haptic feedback"
                    />
                    <label htmlFor="haptic-toggle" className="text-sm">
                      Enable haptic feedback (requires compatible device)
                    </label>
                  </div>
                  
                  <p className={`text-sm mt-2 ${
                    preferences.colorMode === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Connect to a haptic device or use phone vibration for tactile learning.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-bold mb-3">Session Settings</h3>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Daily Session Length</label>
                    <div className="flex items-center space-x-3">
                      <input 
                        type="range" 
                        min="5" 
                        max="25" 
                        step="5" 
                        value={preferences.sessionLength} 
                        onChange={(e) => updatePreference('sessionLength', parseInt(e.target.value))}
                        className="w-48"
                        aria-label="Session length slider"
                      />
                      <span className="w-16">{preferences.sessionLength} min</span>
                    </div>
                    <p className={`text-xs mt-1 ${
                      preferences.colorMode === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Research shows 10-20 minutes daily is optimal for AuDHD learners
                    </p>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <button 
                    onClick={() => setCurrentTab('learn')} 
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    aria-label="Save settings and go to learn tab"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
        
        {/* Bottom Navigation */}
        <nav className={`${
          preferences.colorMode === 'dark' ? 'bg-gray-800' : 'bg-white'
        } border-t ${
          preferences.colorMode === 'dark' ? 'border-gray-700' : 'border-gray-200'
        } p-3`}>
          <div className="flex justify-around">
            <button 
              onClick={() => {
                setCurrentTab('home');
                setCurrentLesson(null);
              }}
              className={`flex flex-col items-center p-1 ${
                currentTab === 'home' 
                  ? 'text-indigo-500' 
                  : preferences.colorMode === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}
              aria-label="Home tab"
              aria-current={currentTab === 'home' ? 'page' : undefined}
            >
              <Home size={24} aria-hidden="true" />
              <span className="text-xs mt-1">Home</span>
            </button>
            <button 
              onClick={() => {
                setCurrentTab('learn');
                setCurrentLesson(null);
              }}
              className={`flex flex-col items-center p-1 ${
                currentTab === 'learn' 
                  ? 'text-indigo-500' 
                  : preferences.colorMode === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}
              aria-label="Learn tab"
              aria-current={currentTab === 'learn' ? 'page' : undefined}
            >
              <Book size={24} aria-hidden="true" />
              <span className="text-xs mt-1">Learn</span>
            </button>
            <button 
              onClick={() => setCurrentTab('practice')}
              className={`flex flex-col items-center p-1 ${
                currentTab === 'practice' 
                  ? 'text-indigo-500' 
                  : preferences.colorMode === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}
              aria-label="Practice tab"
              aria-current={currentTab === 'practice' ? 'page' : undefined}
            >
              <Activity size={24} aria-hidden="true" />
              <span className="text-xs mt-1">Practice</span>
            </button>
            <button 
              onClick={() => setCurrentTab('progress')}
              className={`flex flex-col items-center p-1 ${
                currentTab === 'progress' 
                  ? 'text-indigo-500' 
                  : preferences.colorMode === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}
              aria-label="Progress tab"
              aria-current={currentTab === 'progress' ? 'page' : undefined}
            >
              <Award size={24} aria-hidden="true" />
              <span className="text-xs mt-1">Progress</span>
            </button>
            <button 
              onClick={() => setCurrentTab('settings')}
              className={`flex flex-col items-center p-1 ${
                currentTab === 'settings' 
                  ? 'text-indigo-500' 
                  : preferences.colorMode === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}
              aria-label="Settings tab"
              aria-current={currentTab === 'settings' ? 'page' : undefined}
            >
              <Settings size={24} aria-hidden="true" />
              <span className="text-xs mt-1">Settings</span>
            </button>
          </div>
        </nav>
      </div>
    </AppContext.Provider>
  );
};

export default MorseCodeApp;