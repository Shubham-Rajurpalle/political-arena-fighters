# Political Arena Fighters

A fast-paced 2D fighting game featuring strategic combat with multiple characters, weapons, and special abilities.

## 🎮 Features

- **3 Unique Characters**: Strategist (Balanced), Swift (Speed), Iron Wall (Tank)
- **Multiple Weapons**: Hand Blaster, Guided Missile, Rapid Fire Gun
- **Special Abilities**: Each character has unique special moves and ultimate attacks
- **Smart AI**: Adaptive AI that counters your playstyle
- **Combo System**: Build combos for bonus damage
- **Strategic Combat**: Mix melee, ranged, and special attacks

## 🚀 Quick Start

### Installation

1. **Install Dependencies**
```bash
npm install
```

2. **Run Development Server**
```bash
npm run dev
```

3. **Open Browser**
The game will automatically open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist/` folder.

## 🎯 Controls

### Movement
- **Arrow Left/Right**: Move
- **Arrow Up**: Jump (press twice for double jump)
- **Shift**: Dash

### Combat
- **Z**: Light Attack
- **X**: Heavy Attack
- **C**: Ranged Weapon Attack
- **A**: Block

### Special Moves
- **S**: Special Ability (character-specific)
- **D**: Ultimate (when meter is full)

### System
- **ESC**: Pause game
- **M**: Return to main menu (when paused)

## 🎪 Characters

### The Strategist (Balanced)
- **Health**: 100
- **Special**: Speech Shockwave - Radial attack that pushes enemies away
- **Ultimate**: Mega Rally - Massive stat boosts for 10 seconds

### The Swift (Speed)
- **Health**: 85
- **Special**: Debate Flurry - Rapid multi-hit attack
- **Ultimate**: Media Blitz - Rain of projectiles from above

### Iron Wall (Tank)
- **Health**: 130
- **Special**: Ground Slam - Area stun attack
- **Ultimate**: Fortress Mode - Increased defense and damage reflection

## 🔫 Weapons

### Hand Blaster
- Balanced energy pistol
- Damage: 8 | Ammo: 20 | Range: 400px

### Guided Missile
- Tracking missile with explosion
- Damage: 35 | Ammo: 5 | Explosion Radius: 100px

### Rapid Fire Gun
- High rate of fire
- Damage: 4 | Ammo: 50 | Fire Rate: Very Fast

## 🎨 Game Mechanics

### Combo System
- Hit multiple attacks without getting hit back
- 3+ hits: 10% damage bonus
- 5+ hits: 20% damage bonus
- 8+ hits: 30% damage bonus
- 10+ hits: 50% damage bonus

### Ultimate Meter
- Builds by dealing damage, taking damage, and over time
- Use powerful ultimate abilities when full
- Can turn the tide of battle

### Block & Defense
- Block reduces damage by 80%
- Chip damage still applies
- Perfect blocking requires timing

## 📁 Project Structure

```
political-arena-fighters/
├── src/
│   ├── main.js                 # Game entry point
│   ├── config.js              # Game configuration
│   ├── components/            # Reusable components
│   │   ├── HealthComponent.js
│   │   ├── MovementComponent.js
│   │   ├── HitboxComponent.js
│   │   └── UltimateComponent.js
│   ├── entities/              # Game entities
│   │   ├── Fighter.js
│   │   ├── PlayerController.js
│   │   ├── AIController.js
│   │   └── Projectile.js
│   ├── scenes/                # Game scenes
│   │   ├── BootScene.js
│   │   ├── MainMenuScene.js
│   │   ├── CharacterSelectScene.js
│   │   ├── WeaponSelectScene.js
│   │   ├── BattleScene.js
│   │   └── ResultScene.js
│   ├── systems/               # Game systems
│   │   └── CombatSystem.js
│   ├── ui/                    # UI components
│   │   ├── HealthBar.js
│   │   ├── UltimateBar.js
│   │   └── ComboDisplay.js
│   └── data/                  # Game data
│       ├── characters.json
│       └── weapons.json
├── index.html
├── package.json
└── vite.config.js
```

## 🛠️ Technology

- **Phaser 3**: Game engine
- **Vite**: Build tool and dev server
- **JavaScript ES6+**: Modern JavaScript

## 🎯 Tips & Strategies

1. **Master Movement**: Use dash to dodge attacks and close gaps
2. **Combo Management**: Build combos for maximum damage
3. **Weapon Choice**: Match weapons to your playstyle
4. **Ultimate Timing**: Save ultimates for crucial moments
5. **Mix It Up**: Combine melee, ranged, and special attacks
6. **Watch Ammo**: Reload at safe moments
7. **Block Smart**: Don't over-block, chip damage adds up

## 🐛 Troubleshooting

### Game won't start
- Make sure you ran `npm install`
- Check console for errors (F12 in browser)
- Try `npm run dev` again

### Performance issues
- Close other browser tabs
- Disable browser extensions
- Try a different browser (Chrome recommended)

### Controls not working
- Click on the game window to focus
- Check if another window is capturing keyboard input

## 📝 License

This is a demonstration project. Feel free to modify and use for learning purposes.

## 🎮 Have Fun!

Enjoy the battle and may the best strategist win!
