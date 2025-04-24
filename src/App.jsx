import React, { useState, useEffect, useRef, useReducer, createContext, useContext } from 'react';
import { 
  Play, Pause, Volume2, Settings, Activity, Book, 
  Home, Award, Calendar, Clock, CheckCircle, Circle,
  RotateCcw, ArrowRight, AlertCircle, HelpCircle, Zap,
  Star, Lock, Unlock, PlusCircle, Vibrate, Headphones,
  Volume1, VolumeX, Ear, Info, MessageCircle, Lightbulb,
  RefreshCw, BookOpen
} from 'lucide-react';

// Create context for global state
const AppContext = createContext();

// Define the Morse code for each character
const morseCodeMap = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 
  'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 
  'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 
  'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 
  'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 
  'Z': '--..', '0': '-----', '1': '.----', '2': '..---', 
  '3': '...--', '4': '....-', '5': '.....', '6': '-....', 
  '7': '--...', '8': '---..', '9': '----.', '.': '.-.-.-',
  ',': '--..--', '?': '..--..'
};

// AuDHD-Optimized Learning Sequence - exactly as specified in requirements
const auDHDOptimizedProgression = [
  'E',                // The simplest element; foundation building
  'T',                // Complete contrast to E; reinforces basic elements
  'A',                // Combines learned elements; high frequency
  'N',                // Mirror image of A; creates pattern recognition
  // Review cycle #1
  'I',                // Pattern extension of E; distinct rhythm
  'M',                // Pattern extension of T; auditory contrast to I
  'S',                // Rhythmic progression from I; distinctive pattern
  'O',                // Rhythmic progression from M; contrasts with S
  // Review cycle #2
  'R',                // Symmetric pattern; builds on A
  'K',                // Mirror of R; creates pattern relationship
  'D',                // Builds on N; frequent letter
  // Review cycle #3
  'U',                // Builds on I; distinctive ending
  'G',                // Builds on M; opposite ending to U
  'W',                // Extension of A; distinctive pattern
  // Review cycle #4
  'H',                // Pure rhythm; extension of S
  'B',                // Opposite structure to H
  'L',                // Complex pattern; high frequency
  // Review cycle #5
  'F',                // Internal symmetry; builds on U
  'P',                // Symmetrical pattern; contrasts with F
  'V',                // Builds on H; distinctive ending
  // Review cycle #6
  'J',                // Extension of W; rhythmic pattern
  'C',                // Symmetrical pattern; related to K
  'Y',                // Related to C; distinctive ending
  // Review cycle #7
  'Q',                // Complex pattern; less common
  'X',                // Symmetrical pattern; distinctive sound
  'Z',                // Final letter; distinctive pattern
  // Review cycle #8
  '5', '0',           // Pattern extremes
  '1', '9',           // Opposites with one element changed
  '2', '8',           // Opposites with two elements changed
  '3', '7',           // Opposites with three elements changed
  '4', '6',           // Opposites with four elements changed
  '.', ',', '?'       // Essential punctuation
];

// Define review cycle points - exactly matching the specified review points
const reviewPoints = [
  3,   // After E,T,A,N
  7,   // After I,M,S,O
  10,  // After R,K,D
  13,  // After U,G,W
  16,  // After H,B,L
  19,  // After F,P,V
  22,  // After J,C,Y
  25,  // After Q,X,Z
  27,  // After 5,0
  29,  // After 1,9
  31,  // After 2,8
  33,  // After 3,7
  36   // After 4,6,.,,,?
];

// Traditional Koch method progression
const kochMethodProgression = [
  'K', 'M', 'U', 'R', 'E', 'S', 'N', 'A', 'P', 'T', 
  'L', 'W', 'I', '.', 'J', 'Z', '=', 'F', 'O', 'Y', 
  ',', 'V', 'G', '5', '/', 'Q', '9', '2', 'H', '3', 
  '8', 'B', '?', '4', '7', 'C', '1', 'D', '6', '0', 'X'
];

// Logical learning path progression (original)
const logicalMethodProgression = [
  'T', 'E', 'A', 'N', 'I', 'M', 'S', 'O', 'R', 'K',
  'L', 'U', 'D', 'G', 'F', 'Y', 'C', 'Q', 'B', 'X',
  'Z', 'H', '1', '2', '3', '4', '5', '6', '7', '8',
  '9', '0'
];

// Helper function to get standardized display version of morse code
const getDisplayMorse = (char) => {
  return morseCodeMap[char]?.replace(/\./g, '•').replace(/\-/g, '−') || '';
};

// Group characters into logical families based on pattern relationships
const generatePatternFamilies = (progression) => {
  const patternFamilies = [];
  const familySize = 4; // Number of characters per family

  // Create pattern families from the character progression
  for (let i = 0; i < progression.length; i += familySize) {
    const familyChars = progression.slice(i, i + familySize);
    patternFamilies.push({
      name: `Group ${Math.floor(i/familySize) + 1}`,
      description: `Characters ${i+1}-${Math.min(i+familySize, progression.length)}`,
      characters: familyChars.map(char => ({
        char,
        morse: getDisplayMorse(char),
        audio: `/${char.toLowerCase()}-sound.mp3`,
        pattern: morseCodeMap[char].replace(/\./g, 'short').replace(/\-/g, 'long').split('').join('-')
      }))
    });
  }
  return patternFamilies;
};

// Generate daily lessons dynamically based on the character progression with review cycles
const generateDailyLessons = (progression, learningMethod) => {
  const lessons = [];
  let lessonDay = 1;
  let prevLearnedChars = [];

  // Day 1: Introduction and first character
  lessons.push({
    day: lessonDay++,
    title: `Introduction to Morse & Letter ${progression[0]}`,
    description: `Learn the basics of Morse code and your first letter: ${progression[0]} (${getDisplayMorse(progression[0])})`,
    duration: 15,
    exercises: [
      {
        type: "intro",
        title: `Welcome to Morse for AuDHD (${learningMethod} Method)`,
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
        char: progression[0],
        morse: getDisplayMorse(progression[0]),
        mnemonic: `${progression[0]} sounds like '${morseCodeMap[progression[0]].replace(/\./g, 'di').replace(/\-/g, 'dah')}'`,
        duration: 3
      },
      {
        type: "flashPractice",
        char: progression[0],
        reps: 10,
        interval: 3,
        duration: 3
      },
      {
        type: "comprehension",
        chars: [progression[0]],
        sets: 5,
        duration: 4
      },
      {
        type: "reward",
        title: "First Letter Unlocked!",
        content: `You've learned your first Morse code character: ${progression[0]}`,
        points: 10,
        badge: "first_letter",
        duration: 1
      },
      {
        type: "audio_recognition",
        title: "Sound Recognition Training",
        content: `Close your eyes and focus on the sound of ${progression[0]}. Listen for its distinctive pattern.`,
        duration: 1
      }
    ],
    totalPoints: 25
  });
  
  prevLearnedChars.push(progression[0]);
  
  // For each subsequent character, create a lesson
  for (let i = 1; i < progression.length; i++) {
    const currentChar = progression[i];
    const previousChars = progression.slice(0, i);
    const lastChar = previousChars[previousChars.length - 1];
    
    // Check if we need a review cycle before this character
    const needsReview = reviewPoints.includes(i - 1);
    
    // If a review is needed, add a review lesson
    if (needsReview) {
      // Determine which characters to review (last 4 or all if fewer than 4)
      const reviewChars = prevLearnedChars.slice(-Math.min(prevLearnedChars.length, 4));
      
      // Create review lesson
      lessons.push({
        day: lessonDay++,
        title: `Review Cycle #${reviewPoints.indexOf(i - 1) + 1}`,
        description: `Reinforce your knowledge of ${reviewChars.join(', ')}`,
        duration: 15,
        exercises: [
          {
            type: "intro",
            title: "Review Cycle",
            content: `Research shows that strategic review is crucial for AuDHD learners. Today we'll reinforce your knowledge of ${reviewChars.join(', ')} before learning new characters.`,
            duration: 2
          },
          {
            type: "review",
            chars: reviewChars,
            reps: 8,
            duration: 3
          },
          {
            type: "contrastPractice",
            chars: reviewChars,
            sets: 6,
            duration: 4
          },
          {
            type: "multiCharPractice",
            chars: reviewChars,
            sets: 5,
            duration: 4
          },
          {
            type: "reward",
            title: "Review Completed!",
            content: `You've reinforced your knowledge of ${reviewChars.join(', ')}`,
            points: 15,
            badge: `review_cycle_${reviewPoints.indexOf(i - 1) + 1}`,
            duration: 2
          }
        ],
        totalPoints: 20
      });
    }
    
    // Add the regular lesson for the current character
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
    
    // Add pattern explanation for this character
    let patternExplanation = "";
    if (currentChar === 'T') {
      patternExplanation = "T (−) is a single dash, the complete opposite of E (•). This contrast helps your brain distinguish between the two basic elements.";
    } else if (currentChar === 'A') {
      patternExplanation = "A (•−) combines the dot from E with the dash from T, creating a new pattern that builds on what you've learned.";
    } else if (currentChar === 'N') {
      patternExplanation = "N (−•) is the mirror image of A (•−), creating a pattern relationship that's easier for AuDHD brains to recognize.";
    } else if (['I', 'M'].includes(currentChar)) {
      patternExplanation = `${currentChar} is a pattern extension of ${currentChar === 'I' ? 'E' : 'T'}, repeating the same element twice.`;
    } else if (['S', 'O'].includes(currentChar)) {
      patternExplanation = `${currentChar} extends the pattern of ${currentChar === 'S' ? 'I' : 'M'} to three elements, creating a distinctive rhythm.`;
    } else if (['R', 'K'].includes(currentChar)) {
      patternExplanation = `${currentChar} has a symmetric pattern that ${currentChar === 'R' ? 'builds on A' : 'mirrors R'}, helping with pattern recognition.`;
    }
    
    if (patternExplanation) {
      exercises.push({
        type: "patternIntro",
        title: "Pattern Relationship",
        content: patternExplanation,
        duration: 2
      });
    }
    
    // Contrast practice with new and previously learned characters
    exercises.push({
      type: "contrastPractice",
      chars: [currentChar, lastChar],
      sets: 5,
      duration: 3
    });
    
    // Multi-character practice with previously learned characters
    exercises.push({
      type: "multiCharPractice",
      chars: [...previousChars.slice(-3), currentChar],
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
      day: lessonDay++,
      title: `Letter ${currentChar} & Practice`,
      description: `Learn ${currentChar} (${getDisplayMorse(currentChar)}) and practice with previously learned characters`,
      duration: 15,
      exercises,
      totalPoints: 20 + i
    });
    
    prevLearnedChars.push(currentChar);
  }
  
  // Add a final comprehensive review at the end
  const finalReviewChars = progression.slice(-10);
  lessons.push({
    day: lessonDay++,
    title: "Final Comprehensive Review",
    description: "Master all characters through comprehensive practice",
    duration: 20,
    exercises: [
      {
        type: "intro",
        title: "Congratulations on Your Progress!",
        content: "You've learned all the characters in the AuDHD-Optimized sequence. Now let's reinforce your knowledge with comprehensive practice.",
        duration: 2
      },
      {
        type: "review",
        chars: finalReviewChars,
        reps: 10,
        duration: 4
      },
      {
        type: "multiCharPractice",
        chars: finalReviewChars,
        sets: 8,
        duration: 6
      },
      {
        type: "comprehension",
        chars: finalReviewChars,
        sets: 6,
        duration: 5
      },
      {
        type: "reward",
        title: "Morse Code Mastery Achieved!",
        content: "You've completed the AuDHD-Optimized Morse code learning sequence. Continue practicing to increase your speed and fluency.",
        points: 50,
        badge: "morse_master",
        duration: 3
      }
    ],
    totalPoints: 100
  });
  
  return lessons;
};

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
    case 'RESET_MASTERY':
      return action.initialState;
    default:
      return state;
  }
};

// Initialize character mastery state based on the progression
const initCharacterMastery = (progression) => {
  const initialState = {};
  progression.forEach(char => {
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
  // Path selection state
  const [showPathSelection, setShowPathSelection] = useState(false);
  
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
  const [microBurstActive, setMicroBurstActive] = useState(false);
  const [microBurstChar, setMicroBurstChar] = useState('');
  
  // Complex state with reducers
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
    learningMethod: 'AuDHD', // Default to AuDHD-Optimized method
  });
  
  // Determine which character progression to use based on user preference
  const characterProgression = preferences.learningMethod === 'Koch' 
    ? kochMethodProgression 
    : preferences.learningMethod === 'Logical'
      ? logicalMethodProgression
      : auDHDOptimizedProgression;
  
  // Generate lessons based on selected method
  const [dailyLessons, setDailyLessons] = useState(
    generateDailyLessons(characterProgression, preferences.learningMethod)
  );
  
  const [characterMastery, dispatchMastery] = useReducer(
    characterMasteryReducer, 
    initCharacterMastery(characterProgression)
  );
  
  // Pattern families based on current progression
  const [patternFamilies, setPatternFamilies] = useState(
    generatePatternFamilies(characterProgression)
  );
  
  // Refs for audio context, oscillator, and exercise intervals
  const audioContext = useRef(null);
  const oscillator = useRef(null);
  const gainNode = useRef(null);
  const timerRef = useRef(null);
  const exerciseIntervalRef = useRef(null);
  const microBurstIntervalRef = useRef(null);
  
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
      } else {
        // If no preferences are saved, show path selection on first load
        setShowPathSelection(true);
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
  
  // Update daily lessons when learning method changes
  useEffect(() => {
    // Determine which character progression to use based on user preference
    const newProgression = preferences.learningMethod === 'Koch' 
      ? kochMethodProgression 
      : preferences.learningMethod === 'Logical'
        ? logicalMethodProgression
        : auDHDOptimizedProgression;
        
    // Generate lessons based on the selected method
    const newLessons = generateDailyLessons(newProgression, preferences.learningMethod);
    setDailyLessons(newLessons);
    
    // Update pattern families based on the current progression
    const newPatternFamilies = generatePatternFamilies(newProgression);
    setPatternFamilies(newPatternFamilies);
    
    // Reset mastery when switching methods if necessary
    if (Object.keys(characterMastery).some(char => !newProgression.includes(char))) {
      const newMasteryState = initCharacterMastery(newProgression);
      dispatchMastery({ 
        type: 'RESET_MASTERY', 
        initialState: newMasteryState
      });
    }
  }, [preferences.learningMethod]);
  
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
  
  // Clean up timers when the component unmounts
  useEffect(() => {
    return () => {
      // Clean up all intervals/timeouts to prevent memory leaks
      if (timerRef.current) clearTimeout(timerRef.current);
      if (exerciseIntervalRef.current) clearInterval(exerciseIntervalRef.current);
      if (microBurstIntervalRef.current) clearInterval(microBurstIntervalRef.current);
      
      // Stop and disconnect oscillator if it exists
      if (oscillator.current) {
        try {
          oscillator.current.stop();
          oscillator.current.disconnect();
        } catch (e) {
          // Ignore errors if oscillator was already stopped
        }
      }
    };
  }, []);
  
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
      
      if (microBurstIntervalRef.current) {
        clearInterval(microBurstIntervalRef.current);
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
  
  // Function to start Micro-Burst practice
  const startMicroBurstPractice = () => {
    // Initialize audio context on user interaction
    initializeAudioContext();
    
    // Clear any existing interval to prevent overlapping exercises
    if (microBurstIntervalRef.current) {
      clearInterval(microBurstIntervalRef.current);
      microBurstIntervalRef.current = null;
    }
    
    setMicroBurstActive(true);
    
    // Get the introduced characters to practice
    const availableChars = Object.entries(characterMastery)
      .filter(([_, data]) => data.introduced)
      .map(([char, _]) => char);
    
    if (availableChars.length === 0) {
      // If no characters are introduced yet, use the first character from the progression
      availableChars.push(characterProgression[0]);
    }
    
    // Announce for screen readers
    if (ariaLiveRef.current) {
      ariaLiveRef.current.textContent = 'Starting micro-burst practice';
    }
    
    let burstCount = 0;
    const totalBursts = 20; // 20 micro-bursts in a session
    
    const runMicroBurst = () => {
      if (burstCount >= totalBursts) {
        if (microBurstIntervalRef.current) {
          clearInterval(microBurstIntervalRef.current);
          microBurstIntervalRef.current = null;
        }
        setMicroBurstActive(false);
        setMicroBurstChar('');
        
        // Announce completion for screen readers
        if (ariaLiveRef.current) {
          ariaLiveRef.current.textContent = 'Micro-burst practice complete';
        }
        return;
      }
      
      // Select a random character from the available ones
      const randomIndex = Math.floor(Math.random() * availableChars.length);
      const randomChar = availableChars[randomIndex];
      
      // Set the current character for display
      setMicroBurstChar(randomChar);
      
      // Play the sound and trigger haptic feedback
      playMorseSound(morseCodeMap[randomChar]);
      triggerHaptic(morseCodeMap[randomChar]);
      
      // Announce for screen readers
      if (ariaLiveRef.current) {
        ariaLiveRef.current.textContent = `Playing ${randomChar}`;
      }
      
      burstCount++;
    };
    
    // Run the first burst immediately
    runMicroBurst();
    
    // Schedule the rest of the bursts at random intervals between 1.5 and 3 seconds
    microBurstIntervalRef.current = setInterval(() => {
      runMicroBurst();
    }, 2000); // 2 seconds between bursts for consistency
  };
  
  // Function to stop Micro-Burst practice
  const stopMicroBurstPractice = () => {
    if (microBurstIntervalRef.current) {
      clearInterval(microBurstIntervalRef.current);
      microBurstIntervalRef.current = null;
    }
    setMicroBurstActive(false);
    setMicroBurstChar('');
    
    // Announce for screen readers
    if (ariaLiveRef.current) {
      ariaLiveRef.current.textContent = 'Micro-burst practice stopped';
    }
  };
  
  // Function to select learning method and close path selection UI
  const selectLearningMethod = (method) => {
    updatePreference('learningMethod', method);
    setShowPathSelection(false);
  };
  
  // Function to get theme-based class names
  const getThemeClasses = (element) => {
    const mode = preferences.colorMode;
    
    switch (element) {
      case 'mainBg':
        return mode === 'dark' ? 'bg-gray-900 text-gray-100' : 
               mode === 'light' ? 'bg-gray-100 text-gray-800' : 
               mode === 'pipboy' ? 'bg-black text-green-400' : 
               'bg-gray-900 text-gray-100';
      
      case 'header':
        return mode === 'dark' ? 'bg-gray-800' : 
               mode === 'light' ? 'bg-indigo-600' : 
               mode === 'pipboy' ? 'bg-green-900 bg-opacity-50' :
               'bg-gray-800';
      
      case 'card':
        return mode === 'dark' ? 'bg-gray-800' : 
               mode === 'light' ? 'bg-white' : 
               mode === 'pipboy' ? 'bg-black border border-green-500' :
               'bg-gray-800';
      
      case 'panel':
        return mode === 'dark' ? 'bg-gray-700' : 
               mode === 'light' ? 'bg-gray-100' : 
               mode === 'pipboy' ? 'bg-green-900 bg-opacity-30' :
               'bg-gray-700';
      
      case 'button':
        return mode === 'dark' ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 
               mode === 'light' ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 
               mode === 'pipboy' ? 'bg-green-800 text-green-300 hover:bg-green-700' :
               'bg-indigo-600 text-white hover:bg-indigo-700';
      
      case 'secondaryButton':
        return mode === 'dark' ? 'bg-gray-600 text-white hover:bg-gray-500' : 
               mode === 'light' ? 'bg-gray-300 text-gray-800 hover:bg-gray-400' : 
               mode === 'pipboy' ? 'bg-green-900 text-green-300 hover:bg-green-800' :
               'bg-gray-600 text-white hover:bg-gray-500';
      
      case 'navLink':
        return mode === 'dark' ? 'text-gray-400' : 
               mode === 'light' ? 'text-gray-500' : 
               mode === 'pipboy' ? 'text-green-600' :
               'text-gray-400';
      
      case 'navLinkActive':
        return mode === 'dark' ? 'text-indigo-500' : 
               mode === 'light' ? 'text-indigo-500' : 
               mode === 'pipboy' ? 'text-green-400' :
               'text-indigo-500';
      
      case 'border':
        return mode === 'dark' ? 'border-gray-700' : 
               mode === 'light' ? 'border-gray-200' : 
               mode === 'pipboy' ? 'border-green-800' :
               'border-gray-700';
      
      case 'highlight':
        return mode === 'dark' ? 'text-indigo-400' : 
               mode === 'light' ? 'text-indigo-600' : 
               mode === 'pipboy' ? 'text-green-300' :
               'text-indigo-400';
      
      case 'progressBar':
        return mode === 'dark' ? 'bg-indigo-500' : 
               mode === 'light' ? 'bg-indigo-500' : 
               mode === 'pipboy' ? 'bg-green-500' :
               'bg-indigo-500';
      
      case 'muted':
        return mode === 'dark' ? 'text-gray-400' : 
               mode === 'light' ? 'text-gray-600' : 
               mode === 'pipboy' ? 'text-green-700' :
               'text-gray-400';
      
      default:
        return '';
    }
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
          <div className={`${getThemeClasses('card')} rounded-xl p-6 text-center`}>
            <h3 className="text-xl font-bold mb-4">{exercise.title}</h3>
            <p className={`${preferences.colorMode === 'pipboy' ? 'text-green-400' : 'text-gray-200'} mb-6`}>{exercise.content}</p>
            <button 
              onClick={completeExercise}
              className={`px-4 py-2 ${getThemeClasses('button')} rounded-lg transition-colors`}
              aria-label="Continue to next exercise"
            >
              Continue
            </button>
          </div>
        );
        
      case 'character':
        // Determine character description based on which character it is in the progression
        let characterDescription = "";
        if (exercise.char === 'E') {
          characterDescription = "The simplest element; foundation building - a single dot.";
        } else if (exercise.char === 'T') {
          characterDescription = "Complete contrast to E; reinforces basic elements - a single dash.";
        } else if (exercise.char === 'A') {
          characterDescription = "Combines learned elements; high frequency - dot followed by dash.";
        } else if (exercise.char === 'N') {
          characterDescription = "Mirror image of A; creates pattern recognition - dash followed by dot.";
        } else if (exercise.char === 'I') {
          characterDescription = "Pattern extension of E; distinct rhythm - two dots.";
        } else if (exercise.char === 'M') {
          characterDescription = "Pattern extension of T; auditory contrast to I - two dashes.";
        } else if (exercise.char === 'S') {
          characterDescription = "Rhythmic progression from I; distinctive pattern - three dots.";
        } else if (exercise.char === 'O') {
          characterDescription = "Rhythmic progression from M; contrasts with S - three dashes.";
        } else if (exercise.char === 'R') {
          characterDescription = "Symmetric pattern; builds on A - dot, dash, dot.";
        } else if (exercise.char === 'K') {
          characterDescription = "Mirror of R; creates pattern relationship - dash, dot, dash.";
        } else if (exercise.char === 'D') {
          characterDescription = "Builds on N; frequent letter - dash, dot, dot.";
        }
      
        return (
          <div className={`${getThemeClasses('card')} rounded-xl p-6 text-center`}>
            <h3 className="text-xl font-bold mb-2">New Character: {exercise.char}</h3>
            
            <div className="flex justify-center items-center my-6">
              <div className="text-6xl font-mono font-bold mr-8">{exercise.char}</div>
              <div className={`text-5xl ${getThemeClasses('highlight')}`}>{exercise.morse}</div>
            </div>
            
            <div className="flex justify-center space-x-2 my-6">
              {[...exercise.morse].map((symbol, idx) => (
                <button 
                  key={idx} 
                  className={`flex items-center justify-center ${
                    symbol === '•' ? 'w-8 h-8 rounded-full' : 'w-16 h-8 rounded-lg'
                  } ${preferences.colorMode === 'pipboy' ? 'bg-green-700' : 'bg-indigo-500'}`}
                  aria-label={symbol === '•' ? 'dot' : 'dash'}
                  onClick={() => {
                    initializeAudioContext();
                    playMorseSound(symbol);
                    triggerHaptic(symbol);
                  }}
                />
              ))}
            </div>
            
            {characterDescription && (
              <div className={`${getThemeClasses('panel')} mb-4 p-3 rounded-lg pattern-bg`}>
                <p className={`${preferences.colorMode === 'pipboy' ? 'text-green-300' : 'text-indigo-200'}`}>
                  {characterDescription}
                </p>
              </div>
            )}
            
            <p className={`${preferences.colorMode === 'pipboy' ? 'text-green-400' : 'text-gray-200'} mb-6`}>{exercise.mnemonic}</p>
            
            <div className="flex justify-center space-x-4 mb-6">
              <button 
                onClick={() => {
                  initializeAudioContext();
                  playMorseSound(morseCodeMap[exercise.char]);
                  triggerHaptic(morseCodeMap[exercise.char]);
                }}
                className={`px-3 py-2 ${getThemeClasses('button')} rounded-lg flex items-center`}
                aria-label={`Listen to Morse code for ${exercise.char}`}
              >
                <Volume2 size={18} className="mr-2" />
                <span>Listen</span>
              </button>
              
              <button 
                onClick={() => triggerHaptic(morseCodeMap[exercise.char])}
                className={`px-3 py-2 ${getThemeClasses('button')} rounded-lg flex items-center`}
                disabled={!preferences.hapticEnabled}
                aria-label={`Feel haptic pattern for ${exercise.char}`}
              >
                <Vibrate size={18} className="mr-2" />
                <span>Feel</span>
              </button>
            </div>
            
            <div className={`${getThemeClasses('panel')} p-4 rounded-lg mb-6`}>
              <div className="flex items-center justify-center mb-2">
                <Headphones size={24} className={`${getThemeClasses('highlight')} mr-2`} />
                <h4 className="font-bold">Training Your Ear</h4>
              </div>
              <p className={`text-sm ${preferences.colorMode === 'pipboy' ? 'text-green-500' : 'text-gray-300'}`}>
                Listen to this character multiple times to train your brain to recognize the 
                sound pattern automatically. Press the Listen button several times and close your eyes
                while listening to focus on the sound.
              </p>
            </div>
            
            <button 
              onClick={completeExercise}
              className={`px-4 py-2 ${preferences.colorMode === 'pipboy' ? 'bg-green-600 text-green-200 hover:bg-green-500' : 'bg-green-600 text-white hover:bg-green-700'} rounded-lg transition-colors`}
              aria-label="Confirm you understand the character and continue"
            >
              Got it!
            </button>
          </div>
        );
        
      case 'flashPractice':
        return (
          <div className={`${getThemeClasses('card')} rounded-xl p-6 text-center`}>
            <h3 className="text-xl font-bold mb-4">
              Flash Practice: {exercise.char || exercise.chars?.join(', ')}
            </h3>
            
            <p className={`${preferences.colorMode === 'pipboy' ? 'text-green-400' : 'text-gray-300'} mb-6`}>
              I'll play these characters {exercise.reps} times with {exercise.interval} second intervals.
              Characters are played at full speed using Koch/Farnsworth methods.
            </p>
            
            <div className="flex justify-center mb-2">
              <div className={`p-4 ${getThemeClasses('panel')} rounded-lg mb-4 inline-block`}>
                <h4 className="font-bold mb-2">Koch Method with Farnsworth Timing</h4>
                <p className={`text-sm ${preferences.colorMode === 'pipboy' ? 'text-green-500' : 'text-gray-300'} text-left`}>
                  Characters are played at <span className="text-green-400">{preferences.charSpeed} WPM</span> to train your brain 
                  to recognize the true sound patterns. The <span className={preferences.colorMode === 'pipboy' ? 'text-green-300' : 'text-yellow-400'}>gaps between characters</span> are 
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
                  isExerciseActive 
                    ? preferences.colorMode === 'pipboy' 
                      ? 'bg-green-900 text-green-600' 
                      : 'bg-gray-600 text-gray-400' 
                    : getThemeClasses('button')
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
                isExerciseActive 
                  ? preferences.colorMode === 'pipboy' 
                    ? 'bg-green-900 text-green-600' 
                    : 'bg-gray-600 text-gray-400' 
                  : preferences.colorMode === 'pipboy'
                    ? 'bg-green-600 text-green-200 hover:bg-green-500'
                    : 'bg-green-600 text-white hover:bg-green-700'
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
          <div className={`${getThemeClasses('card')} rounded-xl p-6 text-center`}>
            <h3 className="text-xl font-bold mb-4">
              Practice: {exercise.chars.join(' vs ')}
            </h3>
            
            <p className={`${preferences.colorMode === 'pipboy' ? 'text-green-400' : 'text-gray-300'} mb-6`}>
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
                    className={`p-4 ${preferences.colorMode === 'pipboy' ? 'bg-black border border-green-600' : 'bg-gray-900'} rounded-lg ${preferences.colorMode === 'pipboy' ? 'hover:bg-green-900 hover:bg-opacity-20' : 'hover:bg-gray-700'} transition-colors`}
                    aria-label={`Play Morse code for letter ${char}`}
                  >
                    <div className="text-4xl font-mono font-bold mb-2">{char}</div>
                    <div className={`text-xl ${getThemeClasses('highlight')}`}>{morse}</div>
                  </button>
                );
              })}
            </div>
            
            <div className={`${getThemeClasses('panel')} p-4 rounded-lg mb-6`}>
              <div className="flex items-center justify-center mb-2">
                <Ear size={24} className={`${getThemeClasses('highlight')} mr-2`} />
                <h4 className="font-bold">Sound Identification Challenge</h4>
              </div>
              <p className={`text-sm ${preferences.colorMode === 'pipboy' ? 'text-green-500' : 'text-gray-300'}`}>
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
                  isExerciseActive 
                    ? preferences.colorMode === 'pipboy' 
                      ? 'bg-green-900 text-green-600' 
                      : 'bg-gray-600 text-gray-400' 
                    : getThemeClasses('button')
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
                isExerciseActive 
                  ? preferences.colorMode === 'pipboy' 
                    ? 'bg-green-900 text-green-600' 
                    : 'bg-gray-600 text-gray-400' 
                  : preferences.colorMode === 'pipboy'
                    ? 'bg-green-600 text-green-200 hover:bg-green-500'
                    : 'bg-green-600 text-white hover:bg-green-700'
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
          <div className={`${getThemeClasses('card')} rounded-xl p-6 text-center`}>
            <h3 className="text-xl font-bold mb-4">
              Review: {exercise.chars.join(', ')}
            </h3>
            
            <p className={`${preferences.colorMode === 'pipboy' ? 'text-green-400' : 'text-gray-300'} mb-6`}>
              Let's reinforce your knowledge of these characters through strategic review.
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
                    className={`p-4 ${preferences.colorMode === 'pipboy' ? 'bg-black border border-green-600' : 'bg-gray-900'} rounded-lg ${preferences.colorMode === 'pipboy' ? 'hover:bg-green-900 hover:bg-opacity-20' : 'hover:bg-gray-700'} transition-colors`}
                    aria-label={`Play Morse code for letter ${char}`}
                  >
                    <div className="text-4xl font-mono font-bold mb-2">{char}</div>
                    <div className={`text-xl ${getThemeClasses('highlight')}`}>{morse}</div>
                  </button>
                );
              })}
            </div>
            
            <div className={`${getThemeClasses('panel')} p-4 rounded-lg mb-6`}>
              <div className="flex items-center justify-center mb-2">
                <RefreshCw size={24} className={`${getThemeClasses('highlight')} mr-2`} />
                <h4 className="font-bold">AuDHD-Optimized Review Cycle</h4>
              </div>
              <p className={`text-sm ${preferences.colorMode === 'pipboy' ? 'text-green-500' : 'text-gray-300'}`}>
                Strategic review cycles are crucial for neurodivergent learners. This method reinforces pattern recognition
                and helps build stronger neural pathways for long-term retention.
              </p>
            </div>
            
            <button 
              onClick={completeExercise}
              className={`px-4 py-2 ${preferences.colorMode === 'pipboy' ? 'bg-green-600 text-green-200 hover:bg-green-500' : 'bg-green-600 text-white hover:bg-green-700'} rounded-lg transition-colors`}
              aria-label="Continue to next exercise"
            >
              Continue
            </button>
          </div>
        );
      
      case 'rhythm_tapping':
        return (
          <div className={`${getThemeClasses('card')} rounded-xl p-6 text-center`}>
            <h3 className="text-xl font-bold mb-4">{exercise.title}</h3>
            <p className={`${preferences.colorMode === 'pipboy' ? 'text-green-400' : 'text-gray-200'} mb-6`}>{exercise.content}</p>
            
            <div className="flex justify-center space-x-8 mb-6">
              <div className="text-center">
                <div className="text-4xl font-mono font-bold mb-2">E = •</div>
                <button
                  onClick={() => {
                    initializeAudioContext();
                    playMorseSound('.');
                    triggerHaptic('.');
                  }}
                  className={`w-16 h-16 mx-auto rounded-full border-4 ${preferences.colorMode === 'pipboy' ? 'border-green-400' : 'border-indigo-400'} flex items-center justify-center ${preferences.colorMode === 'pipboy' ? 'hover:bg-green-900 hover:bg-opacity-30' : 'hover:bg-indigo-900'} transition-colors`}
                  aria-label="Tap rhythm for E"
                >
                  <div className={`w-4 h-4 ${preferences.colorMode === 'pipboy' ? 'bg-green-400' : 'bg-indigo-400'} rounded-full`}></div>
                </button>
                <p className={`${preferences.colorMode === 'pipboy' ? 'text-green-400' : 'text-gray-300'} mt-2`}>Tap once quickly</p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-mono font-bold mb-2">T = −</div>
                <button
                  onClick={() => {
                    initializeAudioContext();
                    playMorseSound('-');
                    triggerHaptic('-');
                  }}
                  className={`w-16 h-16 mx-auto rounded-lg border-4 ${preferences.colorMode === 'pipboy' ? 'border-green-500' : 'border-indigo-500'} flex items-center justify-center ${preferences.colorMode === 'pipboy' ? 'hover:bg-green-900 hover:bg-opacity-30' : 'hover:bg-indigo-900'} transition-colors`}
                  aria-label="Tap rhythm for T"
                >
                  <div className={`w-12 h-4 ${preferences.colorMode === 'pipboy' ? 'bg-green-500' : 'bg-indigo-500'} rounded-lg`}></div>
                </button>
                <p className={`${preferences.colorMode === 'pipboy' ? 'text-green-400' : 'text-gray-300'} mt-2`}>Press and hold</p>
              </div>
            </div>
            
            <div className={`${getThemeClasses('panel')} p-4 rounded-lg mb-6`}>
              <div className="flex items-center justify-center mb-2">
                <Headphones size={24} className={`${getThemeClasses('highlight')} mr-2`} />
                <h4 className="font-bold">Rhythm is Key to Morse Code</h4>
              </div>
              <p className={`text-sm ${preferences.colorMode === 'pipboy' ? 'text-green-500' : 'text-gray-300'}`}>
                Feeling the rhythm of dots and dashes helps your brain process the patterns 
                more efficiently. Tap along with the sounds to strengthen these neural connections.
              </p>
            </div>
            
            <button 
              onClick={completeExercise}
              className={`px-4 py-2 ${preferences.colorMode === 'pipboy' ? 'bg-green-600 text-green-200 hover:bg-green-500' : 'bg-green-600 text-white hover:bg-green-700'} rounded-lg transition-colors`}
              aria-label="Confirm you understand and continue"
            >
              Got it!
            </button>
          </div>
        );
      
      case 'reward':
        return (
          <div className={`${getThemeClasses('card')} rounded-xl p-6 text-center`}>
            <div className="text-yellow-300 text-4xl mb-4">🎉</div>
            <h3 className="text-xl font-bold mb-2">{exercise.title}</h3>
            <p className={`${preferences.colorMode === 'pipboy' ? 'text-green-400' : 'text-gray-200'} mb-4`}>{exercise.content}</p>
            
            <div className={`${getThemeClasses('panel')} rounded-lg p-4 mb-6 inline-block`}>
              <div className="flex items-center">
                <Star size={20} className={`${preferences.colorMode === 'pipboy' ? 'text-green-300' : 'text-yellow-400'} mr-2`} />
                <span className={preferences.colorMode === 'pipboy' ? 'text-green-300' : 'text-yellow-100'}>+{exercise.points} points</span>
              </div>
              <div className="flex items-center mt-2">
                <Award size={20} className={`${getThemeClasses('highlight')} mr-2`} />
                <span className={preferences.colorMode === 'pipboy' ? 'text-green-400' : 'text-indigo-200'}>New badge: {exercise.badge}</span>
              </div>
            </div>
            
            <button 
              onClick={completeExercise}
              className={`px-4 py-2 ${preferences.colorMode === 'pipboy' ? 'bg-green-600 text-green-200 hover:bg-green-500' : 'bg-green-600 text-white hover:bg-green-700'} rounded-lg transition-colors`}
              aria-label="Continue to next exercise"
            >
              Continue
            </button>
          </div>
        );
      
      default:
        return (
          <div className={`${getThemeClasses('card')} rounded-xl p-6 text-center`}>
            <p className={`${preferences.colorMode === 'pipboy' ? 'text-green-400' : 'text-gray-200'} mb-4`}>Unknown exercise type</p>
            <button 
              onClick={completeExercise}
              className={`px-4 py-2 ${getThemeClasses('button')} rounded-lg transition-colors`}
              aria-label="Skip this exercise"
            >
              Skip
            </button>
          </div>
        );
    }
  };

  // Render path selection dialog
  const renderPathSelection = () => {
    if (!showPathSelection) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
        <div className={`${getThemeClasses('card')} rounded-xl p-6 w-full max-w-2xl`}>
          <h2 className="text-2xl font-bold mb-4 text-center">Choose Your Learning Path</h2>
          
          <p className={`${preferences.colorMode === 'pipboy' ? 'text-green-400' : 'text-gray-300'} mb-6 text-center`}>
            Select a learning method to get started with Morse code. You can change this later in settings.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <button
              onClick={() => selectLearningMethod('AuDHD')}
              className={`p-6 rounded-lg text-left ${preferences.colorMode === 'pipboy' ? 
                'bg-green-900 bg-opacity-30 border-2 border-green-500 hover:bg-green-800 hover:bg-opacity-50' : 
                'bg-indigo-900 bg-opacity-20 border-2 border-indigo-400 hover:bg-indigo-800 hover:bg-opacity-30'} transition-colors`}
            >
              <div className="absolute -top-2 -right-2 bg-green-500 text-black text-xs px-2 py-1 rounded-full">Recommended</div>
              <h3 className="text-xl font-bold mb-2 flex items-center">
                <BookOpen size={24} className="mr-2" />
                AuDHD-Optimized
              </h3>
              <p className={`${preferences.colorMode === 'pipboy' ? 'text-green-400' : 'text-gray-300'} mb-4`}>
                Specially designed progression with strategic review cycles and pattern-based learning for neurodivergent learners.
              </p>
              <div className={`mb-3 ${preferences.colorMode === 'pipboy' ? 'text-green-300' : 'text-indigo-300'}`}>
                <strong>Best for:</strong> AuDHD learners who benefit from pattern recognition and reduced cognitive load
              </div>
              <div className="flex items-center text-sm">
                <div className={`mr-2 px-2 py-1 rounded ${preferences.colorMode === 'pipboy' ? 'bg-green-800' : 'bg-indigo-800'}`}>E, T</div>
                <div className={`mr-2 px-2 py-1 rounded ${preferences.colorMode === 'pipboy' ? 'bg-green-800' : 'bg-indigo-800'}`}>A, N</div>
                <div className={`px-2 py-1 rounded ${preferences.colorMode === 'pipboy' ? 'bg-green-800' : 'bg-indigo-800'}`}>Review...</div>
              </div>
            </button>
            
            <button
              onClick={() => selectLearningMethod('Koch')}
              className={`p-6 rounded-lg text-left ${preferences.colorMode === 'pipboy' ? 
                'bg-green-900 bg-opacity-30 border border-green-600 hover:bg-green-800 hover:bg-opacity-50' : 
                'bg-indigo-900 bg-opacity-20 border border-indigo-500 hover:bg-indigo-800 hover:bg-opacity-30'} transition-colors`}
            >
              <h3 className="text-xl font-bold mb-2 flex items-center">
                <MessageCircle size={24} className="mr-2" />
                Koch Method
              </h3>
              <p className={`${preferences.colorMode === 'pipboy' ? 'text-green-400' : 'text-gray-300'} mb-4`}>
                Start with distinctive characters (K, M) and learn to distinguish between similar sounding patterns. Traditional approach used by LCWO.net.
              </p>
              <div className={`mb-3 ${preferences.colorMode === 'pipboy' ? 'text-green-300' : 'text-indigo-300'}`}>
                <strong>Best for:</strong> Those focused on auditory pattern recognition
              </div>
              <div className="flex items-center text-sm">
                <div className={`mr-2 px-2 py-1 rounded ${preferences.colorMode === 'pipboy' ? 'bg-green-800' : 'bg-indigo-800'}`}>K, M</div>
                <div className={`mr-2 px-2 py-1 rounded ${preferences.colorMode === 'pipboy' ? 'bg-green-800' : 'bg-indigo-800'}`}>U, R</div>
                <div className={`px-2 py-1 rounded ${preferences.colorMode === 'pipboy' ? 'bg-green-800' : 'bg-indigo-800'}`}>E, S...</div>
              </div>
            </button>
            
            <button
              onClick={() => selectLearningMethod('Logical')}
              className={`p-6 rounded-lg text-left ${preferences.colorMode === 'pipboy' ? 
                'bg-green-900 bg-opacity-30 border border-green-600 hover:bg-green-800 hover:bg-opacity-50' : 
                'bg-indigo-900 bg-opacity-20 border border-indigo-500 hover:bg-indigo-800 hover:bg-opacity-30'} transition-colors`}
            >
              <h3 className="text-xl font-bold mb-2 flex items-center">
                <Lightbulb size={24} className="mr-2" />
                Logical Method
              </h3>
              <p className={`${preferences.colorMode === 'pipboy' ? 'text-green-400' : 'text-gray-300'} mb-4`}>
                Start with the simplest characters (T, E) and progressively learn more complex ones. Characters are grouped in logical pairs.
              </p>
              <div className={`mb-3 ${preferences.colorMode === 'pipboy' ? 'text-green-300' : 'text-indigo-300'}`}>
                <strong>Best for:</strong> Beginners who prefer a structured, logical progression
              </div>
              <div className="flex items-center text-sm">
                <div className={`mr-2 px-2 py-1 rounded ${preferences.colorMode === 'pipboy' ? 'bg-green-800' : 'bg-indigo-800'}`}>T, E</div>
                <div className={`mr-2 px-2 py-1 rounded ${preferences.colorMode === 'pipboy' ? 'bg-green-800' : 'bg-indigo-800'}`}>A, N</div>
                <div className={`px-2 py-1 rounded ${preferences.colorMode === 'pipboy' ? 'bg-green-800' : 'bg-indigo-800'}`}>I, M...</div>
              </div>
            </button>
          </div>
          
          <div className={`${getThemeClasses('panel')} p-4 rounded-lg mb-6`}>
            <div className="flex items-center">
              <Info size={20} className={`${getThemeClasses('highlight')} mr-2`} />
              <p className={`text-sm ${preferences.colorMode === 'pipboy' ? 'text-green-400' : 'text-gray-300'}`}>
                All methods use the same learning principles (Koch method with Farnsworth timing) but differ in the order characters are introduced and how review is structured.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
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
      <div className={`flex flex-col h-screen ${getThemeClasses('mainBg')} ${
        preferences.colorMode === 'pipboy' ? 'pipboy-theme' : ''
      }`}>
        {/* ARIA live region for screen reader announcements */}
        <div 
          ref={ariaLiveRef} 
          className="sr-only" 
          aria-live="polite"
          aria-atomic="true"
        ></div>
        
        {/* Render path selection dialog */}
        {renderPathSelection()}
        
        {/* App Header */}
        <header className={`${getThemeClasses('header')} text-white p-4 shadow-md`}>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Morse for AuDHD</h1>
            <div className="flex items-center space-x-4">
              <div className={`flex items-center bg-opacity-25 bg-black rounded-full px-3 py-1 ${preferences.colorMode === 'pipboy' ? 'text-green-300' : ''}`}>
                <Star size={16} className={preferences.colorMode === 'pipboy' ? 'text-green-400 mr-1' : 'text-yellow-400 mr-1'} aria-hidden="true" />
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
          {/* Micro-Burst Practice Overlay */}
          {microBurstActive && (
            <div className={`fixed inset-0 flex flex-col items-center justify-center z-40 bg-opacity-90 ${
              preferences.colorMode === 'pipboy' ? 'bg-black' : 'bg-gray-900'
            }`}>
              <div className={`text-center p-6 rounded-xl ${
                preferences.colorMode === 'pipboy' ? 'border-4 border-green-700' : ''
              }`}>
                <h2 className="text-2xl font-bold mb-2">Micro-Burst Practice</h2>
                <p className={`mb-8 ${preferences.colorMode === 'pipboy' ? 'text-green-400' : 'text-gray-300'}`}>
                  Listen to the character and try to identify it instantly
                </p>
                
                <div className={`text-9xl font-mono font-bold mb-12 ${microBurstChar ? 'visible' : 'invisible'}`}>
                  {microBurstChar}
                </div>
                
                <div className="mb-8">
                  <p className={`text-lg ${preferences.colorMode === 'pipboy' ? 'text-green-300' : 'text-gray-200'}`}>
                    Recognize the sound before seeing the character
                  </p>
                </div>
                
                <button
                  onClick={stopMicroBurstPractice}
                  className={`px-6 py-3 rounded-lg ${
                    preferences.colorMode === 'pipboy' ? 'bg-green-700 text-green-100 hover:bg-green-600' : 'bg-red-600 text-white hover:bg-red-700'
                  } transition-colors`}
                  aria-label="Stop micro-burst practice"
                >
                  Stop Practice
                </button>
              </div>
            </div>
          )}
        
          {/* Learning Content */}
          {currentLesson ? (
            <div className="space-y-6">
              <div className={`${getThemeClasses('card')} rounded-xl shadow-md p-6`}>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xl font-bold">Day {currentLesson.day}: {currentLesson.title}</h2>
                    <p className={getThemeClasses('muted')}>{currentLesson.description}</p>
                  </div>
                  <div className="flex items-center">
                    <Clock size={18} className="mr-1" aria-hidden="true" />
                    <span>{currentLesson.duration} min</span>
                  </div>
                </div>
                
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden mb-6">
                  <div 
                    className={`h-2 ${getThemeClasses('progressBar')} rounded-full`}
                    style={{ width: `${sessionProgress}%` }}
                    aria-label={`Lesson progress: ${sessionProgress}%`}
                  ></div>
                </div>
                
                {renderExerciseContent()}
              </div>
            </div>
          ) : currentTab === 'home' ? (
            <div className="space-y-6">
              <div className={`${getThemeClasses('card')} rounded-xl shadow-md p-6`}>
                <h2 className="text-xl font-bold mb-4">Your Morse Journey</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className={`p-4 rounded-lg ${getThemeClasses('panel')}`}>
                    <h3 className="font-bold mb-1">Daily Streak</h3>
                    <div className="flex items-center">
                      <div className="text-3xl font-bold mr-2">{streakDays}</div>
                      <div className="text-sm">days</div>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${getThemeClasses('panel')}`}>
                    <h3 className="font-bold mb-1">Characters Learned</h3>
                    <div className="flex items-center">
                      <div className="text-3xl font-bold mr-2">
                        {Object.values(characterMastery).filter(char => char.introduced).length}
                      </div>
                      <div className="text-sm">of {characterProgression.length}</div>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${getThemeClasses('panel')}`}>
                    <h3 className="font-bold mb-1">Points Earned</h3>
                    <div className="flex items-center">
                      <div className="text-3xl font-bold mr-2">{points}</div>
                      <div className="text-sm">points</div>
                    </div>
                  </div>
