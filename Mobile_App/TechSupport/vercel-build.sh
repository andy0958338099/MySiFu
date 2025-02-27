#!/bin/bash

# Display current directory
echo "Current directory: $(pwd)"

# Build application with CI=false to ignore warnings
echo "Building application..."
CI=false npm run build

# Copy _redirects file to build directory
echo "Copying _redirects file to build directory..."
cp public/_redirects build/

# Create a routes.json file for SPA routing
echo "Creating routes.json for SPA routing..."
echo '{
  "routes": [
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}' > build/routes.json

echo "Build completed successfully!"
