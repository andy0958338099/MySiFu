#!/bin/bash

# Display current directory
echo "Current directory: $(pwd)"

# Install dependencies
echo "Installing dependencies..."
npm install

# Build application
echo "Building application..."
CI=false npm run build

# Copy _redirects file to build directory
echo "Copying _redirects file to build directory..."
cp public/_redirects build/

# Create a Vercel-specific _routes.json file
echo "Creating Vercel-specific routing file..."
echo '{
  "version": 1,
  "routes": [
    {
      "src": "^/static/(.*)",
      "dest": "/static/$1"
    },
    {
      "src": "^/(.*\\.(js|json|css|ico|png|jpg|jpeg|svg|webp|gif))$",
      "dest": "/$1"
    },
    {
      "src": "^/(.*)",
      "dest": "/index.html"
    }
  ]
}' > build/_routes.json

echo "Build completed successfully!"
