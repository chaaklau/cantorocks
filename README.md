# CantoRocks

A mini-game that helps you practise spelling Cantonese words using Jyutping romanisation and reinforce your basic Cantonese vocabulary.

## Project Structure

```
cantorocks/
├── index.html              # Main game HTML file
├── src/                    # Source code
│   ├── js/                 # JavaScript files
│   │   ├── game.js         # Main game logic (consolidated from multiple files)
│   │   ├── question.js     # Question bank data (BANK array)
│   │   ├── audiospritelist.js  # Audio sprite definitions
│   │   └── examples.js     # UI helper functions
│   ├── css/                # Stylesheets
│   │   ├── shared.css      # Shared styles
│   │   └── examples.css    # Example/demo styles
│   └── data/               # (Reserved for future data files)
├── libs/                   # Third-party libraries
│   ├── easeljs-NEXT.min.js
│   ├── preloadjs-NEXT.min.js
│   ├── soundjs-NEXT.min.js
│   └── tweenjs-NEXT.min.js
├── images/                 # Game images and sprites
├── sounds/                 # Audio files
└── fonts/                  # Font files

```

## Game Features

- **Multiple Game Modes:**
  - Normal Mode (LSHK romanization)
  - Full Mode (Jyutping with tones)
  - Initials Only
  - Finals Only
  - Tones Only

- **Progressive Difficulty:** Level up as you improve
- **Combo System:** Build combos for higher scores
- **Audio Playback:** Click rocks to hear pronunciations again

## Technology Stack

- **CreateJS Suite:** EaselJS, PreloadJS, SoundJS, TweenJS
- **ES6 JavaScript:** Modern class-based architecture
- **HTML5 Canvas:** Game rendering

## Recent Refactoring (Nov 2025)

The codebase was modernized with the following improvements:

1. **Code Consolidation:** 
   - Merged 5 separate JS files into a single `game.js` module
   - Removed: `gameconfig.js`, `gamestate.js`, `msgbox.js`, `rock.js`
   - Kept `question.js` for the BANK data array only

2. **Modern JavaScript:**
   - Converted to ES6 classes for `GameState` and `Question`
   - Used CreateJS patterns for `Rock` and `MsgBox` (required for proper CreateJS integration)
   - Replaced `var` with `let`/`const` throughout
   - Implemented `Promise.all()` for asset loading

3. **Better Organization:**
   - Centralized configuration in `GameConfig` object
   - Improved naming conventions (camelCase)
   - Cleaner folder structure with `src/` directory

4. **Code Quality:**
   - Reduced code duplication
   - Better error handling
   - More maintainable architecture

## Getting Started

1. Open `index.html` in a modern web browser
2. Select a game mode using arrow keys (← →)
3. Press Enter to start
4. Type what you hear to destroy the falling rocks!

## Controls

- **Arrow Keys (← →):** Select game mode on home screen
- **Enter:** Start game / Continue after messages
- **Type letters/numbers:** Answer questions
- **Backspace:** Delete last character
- **Click on rocks:** Replay audio

## Development Notes

The game uses CreateJS's inheritance pattern (`createjs.extend()` and `createjs.promote()`) for game entities like `Rock` and `MsgBox` to ensure proper integration with the CreateJS framework. Regular ES6 classes are used for pure JavaScript objects like `GameState` and `Question`.

## License

See project repository for license information.
