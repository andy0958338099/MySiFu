// Simple build script for Vercel
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting Vercel build process...');

// Display current directory
console.log(`Current directory: ${process.cwd()}`);

try {
  // Build the React app
  console.log('Building React application...');
  execSync('CI=false npx react-scripts build', { stdio: 'inherit' });

  // Copy _redirects file
  console.log('Copying _redirects file to build directory...');
  try {
    fs.copyFileSync(
      path.join(process.cwd(), 'public', '_redirects'),
      path.join(process.cwd(), 'build', '_redirects')
    );
    console.log('_redirects file copied successfully');
  } catch (err) {
    console.error('Error copying _redirects file:', err.message);
    // Create _redirects file if it doesn't exist
    fs.writeFileSync(
      path.join(process.cwd(), 'build', '_redirects'),
      '/* /index.html 200\n'
    );
    console.log('Created new _redirects file');
  }

  // Create routes.json for SPA routing
  console.log('Creating routes.json for SPA routing...');
  const routesConfig = {
    version: 1,
    routes: [
      { handle: "filesystem" },
      { src: "/(.*)", dest: "/index.html" }
    ]
  };
  
  fs.writeFileSync(
    path.join(process.cwd(), 'build', 'routes.json'),
    JSON.stringify(routesConfig, null, 2)
  );
  console.log('routes.json created successfully');

  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
