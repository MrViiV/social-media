#!/bin/bash

# Social Media Downloader Setup Script
echo "🚀 Setting up Social Media Downloader..."

# Check Node.js version
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20+"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt "18" ]; then
    echo "❌ Node.js version 18+ required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p downloads
mkdir -p uploads
mkdir -p logs

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "🔧 Creating .env file..."
    cat > .env << EOL
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/social_downloader

# Add your API keys here when implementing real backends
# TIKTOK_API_KEY=your_key_here
# INSTAGRAM_API_KEY=your_key_here
# YOUTUBE_API_KEY=your_key_here
# TWITTER_API_KEY=your_key_here
EOL
    echo "✅ Created .env file. Please update with your credentials."
else
    echo "✅ .env file already exists"
fi

# Set up Git hooks (if .git exists)
if [ -d ".git" ]; then
    echo "🔗 Setting up Git hooks..."
    cat > .git/hooks/pre-commit << 'EOL'
#!/bin/bash
# Run linting before commit
npm run lint 2>/dev/null || echo "No lint script found"
EOL
    chmod +x .git/hooks/pre-commit
    echo "✅ Git hooks configured"
fi

# Check for Python (needed for yt-dlp)
if command -v python3 &> /dev/null; then
    echo "✅ Python3 found: $(python3 --version)"
    echo "📦 Installing yt-dlp (for future backend implementation)..."
    pip3 install yt-dlp 2>/dev/null || echo "⚠️  yt-dlp installation failed. Install manually when implementing backend."
else
    echo "⚠️  Python3 not found. Install Python3 when implementing backend."
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env with your database credentials"
echo "2. Run 'npm run dev' to start development server"
echo "3. Visit http://localhost:5000 to see your app"
echo "4. Check README.md for backend implementation guide"
echo ""
echo "For deployment:"
echo "1. Follow DEPLOYMENT.md for step-by-step instructions"
echo "2. Use 'npm start' for production"
echo ""