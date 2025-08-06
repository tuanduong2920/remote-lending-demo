#!/bin/bash

echo "🌤️  Setting up Weather App Environment..."
echo ""

# Create .env file
cat > .env << EOL
# Weather App Environment Variables
# Get your free API key from: https://openweathermap.org/api
VITE_OPENWEATHER_API_KEY=73c28f2ad03fc2bb37b4b29c8b41e1d6
EOL

echo "✅ Created .env file with demo API key"
echo ""
echo "📝 To use your own API key:"
echo "   1. Visit https://openweathermap.org/api"
echo "   2. Sign up for a free account"
echo "   3. Get your API key"
echo "   4. Replace the value in .env file"
echo ""
echo "🚀 Now run: yarn dev"
echo "" 