#!/bin/bash

# Display current directory
echo "Current directory: $(pwd)"

# Build application
echo "Building application..."
CI=false npm run build

echo "Build completed successfully!"
