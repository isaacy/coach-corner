# CoachCorner 🏀

A Progressive Web App for managing basketball player rotations in 5x5 games.

## Features

- **Player Management**: Add, edit, and remove players from your team roster
- **Smart Rotations**: Pre-configured rotation patterns for 6-12 players ensuring fair playing time
- **Drag & Drop**: Easily reorder your lineup with touch-friendly drag-and-drop
- **Period Carousel**: Swipe through game periods to see who's on court and on bench
- **Full Chart View**: Toggle to see the complete rotation grid
- **Offline Support**: Works without internet connection (PWA)
- **Install to Home Screen**: Add to your phone's home screen for an app-like experience

## Installation

### As a Progressive Web App (Recommended)

1. Open the app in your mobile browser
2. Tap the **Share** button (iOS) or **Menu** (Android)
3. Select **"Add to Home Screen"**
4. The app will now launch like a native app with no browser UI

### For Development

```bash
npm install
npm run dev
```

## How to Use

1. **Manage Team**: Add players with their name and jersey number
2. **Game Setup**: 
   - Step 1: Select which players are available for the game
   - Step 2: Drag to reorder players and set your starting lineup
3. **Game Plan**: 
   - Swipe through periods to see rotations
   - Click "Full Chart" to view the complete rotation grid
   - Each period shows exactly who should be on court and on bench

## Rotation Logic

- **8 Periods** per game (4 quarters × 2 sessions)
- **Exactly 5 players** on court at all times
- **Fair distribution** of playing time based on team size
- Patterns optimized for 6-12 player rosters

## Tech Stack

- React + Vite
- Vanilla CSS
- @dnd-kit for drag-and-drop
- vite-plugin-pwa for Progressive Web App features

## License

MIT
