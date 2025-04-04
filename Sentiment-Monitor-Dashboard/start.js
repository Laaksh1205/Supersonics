const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Paths to server and client directories
const serverDir = path.join(__dirname, 'server');
const clientDir = path.join(__dirname, 'src');

// Check if directories exist
if (!fs.existsSync(serverDir)) {
  console.error('Server directory not found!');
  process.exit(1);
}

if (!fs.existsSync(clientDir)) {
  console.error('Client directory not found!');
  process.exit(1);
}

// Function to start a process
function startProcess(name, command, args, cwd) {
  console.log(`Starting ${name}...`);
  
  const proc = spawn(command, args, {
    cwd,
    shell: true,
    stdio: 'pipe',
    env: { ...process.env, FORCE_COLOR: true }
  });
  
  // Configure output
  proc.stdout.on('data', (data) => {
    console.log(`[${name}] ${data.toString().trim()}`);
  });
  
  proc.stderr.on('data', (data) => {
    console.error(`[${name}] ${data.toString().trim()}`);
  });
  
  proc.on('close', (code) => {
    console.log(`${name} process exited with code ${code}`);
  });
  
  return proc;
}

// Start the server
const server = startProcess(
  'Server',
  'npm',
  ['run', 'dev'],
  serverDir
);

// Start the client (if using React)
const client = startProcess(
  'Client',
  'npm',
  ['start'],
  clientDir
);

// Handle process exit
process.on('SIGINT', () => {
  console.log('Shutting down...');
  server.kill();
  client.kill();
  process.exit(0);
});

console.log(`
🚀 Development environment started!
    
    Server running at: http://localhost:5000
    Client running at: http://localhost:3000
    
Press Ctrl+C to stop both processes.
`); 