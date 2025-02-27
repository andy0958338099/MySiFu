#!/bin/bash

# 顯示當前目錄
echo "Current directory: $(pwd)"

# 安裝依賴
echo "Installing dependencies..."
npm install

# 構建應用
echo "Building application..."
CI=false npm run build

# 複製 _redirects 文件到構建目錄
echo "Copying _redirects file to build directory..."
cp public/_redirects build/

echo "Build completed successfully!"
