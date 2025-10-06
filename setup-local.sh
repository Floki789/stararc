#!/bin/bash

# Stararc.one Development Setup Script (No Docker)
# This script sets up the development environment without Docker

set -e

echo "🚀 Setting up Stararc.one Development Environment (No Docker)"
echo "============================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node --version) found"

# Check if PostgreSQL is installed locally
if command -v psql &> /dev/null; then
    echo "✅ PostgreSQL found locally"
    DB_AVAILABLE=true
else
    echo "⚠️  PostgreSQL not found locally"
    echo "   You can:"
    echo "   1. Install PostgreSQL: https://postgresql.org/download/"
    echo "   2. Use a cloud PostgreSQL service (like Neon, Supabase, etc.)"
    echo "   3. Install Docker and use docker-compose"
    DB_AVAILABLE=false
fi

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Create environment files if they don't exist
if [ ! -f backend/.env ]; then
    echo "📝 Creating backend .env file..."
    cp backend/.env.example backend/.env
    
    # Update database URL for local development
    if [ "$DB_AVAILABLE" = true ]; then
        # Try to create a local database
        echo "🗄️  Setting up local PostgreSQL database..."
        createdb stararc 2>/dev/null || echo "   Database 'stararc' may already exist"
        
        # Update the .env file with local database URL
        sed -i '' 's|postgresql://stararc_user:stararc_password@localhost:5432/stararc|postgresql://'"$USER"'@localhost:5432/stararc|g' backend/.env
    fi
fi

if [ ! -f frontend/.env ]; then
    echo "📝 Creating frontend .env file..."
    cp frontend/.env.example frontend/.env
fi

# Try to run database migrations if PostgreSQL is available
if [ "$DB_AVAILABLE" = true ]; then
    echo "🗄️  Running database migrations..."
    cd backend
    npm run migrate 2>/dev/null || echo "   ⚠️  Migration failed - please check your database connection"
    cd ..
fi

echo ""
echo "✅ Development environment setup complete!"
echo ""

if [ "$DB_AVAILABLE" = true ]; then
    echo "🚀 To start the development servers:"
    echo "   npm run dev"
else
    echo "🚀 To start the development servers (after setting up database):"
    echo "   npm run dev"
    echo ""
    echo "📋 Database setup options:"
    echo "   1. Install PostgreSQL locally:"
    echo "      brew install postgresql (macOS)"
    echo "      sudo apt-get install postgresql (Ubuntu)"
    echo ""
    echo "   2. Use a cloud database service:"
    echo "      - Neon: https://neon.tech"
    echo "      - Supabase: https://supabase.com"
    echo "      - Railway: https://railway.app"
    echo ""
    echo "   3. Install Docker Desktop:"
    echo "      https://www.docker.com/products/docker-desktop"
    echo "      Then run: docker-compose up -d postgres"
fi

echo ""
echo "🌐 URLs (when running):"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001"
echo ""
echo "📚 Next steps:"
echo "   1. Update .env files with your configuration"
echo "   2. Set up database connection"
echo "   3. Configure Stripe keys for payments"
echo "   4. Run 'npm run dev' to start development"
echo ""
echo "🔐 Swiss Privacy-by-Design ready!"