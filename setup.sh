#!/bin/bash

echo "🎮 Political Arena Fighters - Setup Script"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js found: $(node --version)"
echo "✓ npm found: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Setup complete!"
    echo ""
    echo "🚀 To start the game, run:"
    echo "   npm run dev"
    echo ""
    echo "🎯 Controls:"
    echo "   Arrow Keys - Move"
    echo "   Z - Light Attack"
    echo "   X - Heavy Attack"
    echo "   C - Ranged Attack"
    echo "   A - Block"
    echo "   S - Special"
    echo "   D - Ultimate"
    echo ""
    echo "Have fun! 🎮"
else
    echo ""
    echo "❌ Installation failed!"
    echo "Please check the error messages above."
    exit 1
fi
