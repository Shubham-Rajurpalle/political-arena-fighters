# Installation Guide - Political Arena Fighters

## Quick Start (Easiest Method)

### For Windows Users:
1. **Double-click `setup.bat`**
2. Wait for installation to complete
3. Run `npm run dev` in the terminal
4. Game opens automatically in your browser!

### For Mac/Linux Users:
1. **Open Terminal in this folder**
2. Run: `./setup.sh`
3. Run: `npm run dev`
4. Game opens automatically in your browser!

---

## Manual Installation (Alternative Method)

### Prerequisites
You need Node.js installed on your computer.

**Check if you have Node.js:**
```bash
node --version
```

If you see a version number (like v18.x.x), you're good to go!

**Don't have Node.js?**
- Download from: https://nodejs.org/
- Install the LTS (Long Term Support) version
- Restart your terminal/command prompt after installation

### Step-by-Step Installation

1. **Open Terminal/Command Prompt**
   - Windows: Press `Win + R`, type `cmd`, press Enter
   - Mac: Press `Cmd + Space`, type `terminal`, press Enter
   - Linux: Press `Ctrl + Alt + T`

2. **Navigate to the game folder**
   ```bash
   cd path/to/political-arena-fighters
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```
   
   This will download all required packages. Takes about 1-2 minutes.

4. **Start the game**
   ```bash
   npm run dev
   ```

5. **Play!**
   - Your browser will open automatically
   - If not, go to: http://localhost:3000
   - Select your character and weapon
   - Start fighting!

---

## Troubleshooting

### "npm: command not found" or "node: command not found"
**Problem:** Node.js is not installed or not in your PATH

**Solution:**
1. Install Node.js from https://nodejs.org/
2. Restart your terminal/command prompt
3. Try again

### "Port 3000 is already in use"
**Problem:** Another application is using port 3000

**Solution 1 - Use a different port:**
```bash
npm run dev -- --port 3001
```

**Solution 2 - Stop the other application:**
- Close any other running dev servers
- Check if another Political Arena Fighters instance is running

### "Cannot find module"
**Problem:** Dependencies not installed correctly

**Solution:**
```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Game loads but shows blank screen
**Problem:** Browser compatibility or JavaScript error

**Solution:**
1. Open browser console (Press F12)
2. Check for errors (red text)
3. Try a different browser (Chrome recommended)
4. Clear browser cache (Ctrl+Shift+Delete)

### Controls not working
**Problem:** Game window not focused

**Solution:**
1. Click anywhere inside the game window
2. Make sure no other window is overlapping
3. Try refreshing the page (F5)

### Performance issues / Lag
**Solutions:**
- Close other browser tabs
- Disable browser extensions
- Close other applications
- Try Chrome or Firefox
- Lower your screen resolution

---

## Building for Production

Want to deploy the game to a website?

```bash
npm run build
```

This creates a `dist/` folder with optimized files. Upload this folder to any web hosting service!

---

## File Structure

After installation, your folder should look like this:

```
political-arena-fighters/
├── node_modules/        (created after npm install)
├── src/                 (game source code)
├── index.html          (main HTML file)
├── package.json        (project configuration)
├── vite.config.js      (build configuration)
├── README.md           (game documentation)
├── INSTALL.md          (this file)
├── setup.sh            (Linux/Mac setup)
└── setup.bat           (Windows setup)
```

---

## System Requirements

### Minimum:
- **OS:** Windows 7+, macOS 10.12+, or Linux
- **Node.js:** Version 16 or higher
- **Browser:** Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+
- **RAM:** 2GB
- **Storage:** 200MB free space

### Recommended:
- **Node.js:** Version 18 LTS
- **Browser:** Latest Chrome or Firefox
- **RAM:** 4GB+
- **Connection:** For downloading dependencies (one-time)

---

## Need More Help?

### Common Commands

**Start development server:**
```bash
npm run dev
```

**Build for production:**
```bash
npm run build
```

**Preview production build:**
```bash
npm run preview
```

**Clean installation:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Still Having Issues?

1. Make sure Node.js is properly installed
2. Make sure you're in the correct folder
3. Try the manual installation steps
4. Check the troubleshooting section above
5. Clear your terminal and start fresh

---

## Ready to Play?

Once everything is installed:

1. Run `npm run dev`
2. Browser opens to http://localhost:3000
3. Click "START BATTLE"
4. Choose your character
5. Choose your weapon
6. FIGHT!

**Have fun! 🎮**
