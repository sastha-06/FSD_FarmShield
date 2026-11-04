import { spawn } from 'child_process';
import process from 'process';

console.log('====================================================');
console.log('🌾 FarmShield - Starting Full-Stack Development Mode');
console.log('====================================================');

const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';
const nodeCmd = isWin ? 'node.exe' : 'node';

// 1. Start Server
const server = spawn(nodeCmd, ['server/src/server.js'], {
  stdio: 'inherit',
  shell: true,
});

// 2. Start Vite Client
const client = spawn(npmCmd, ['run', 'dev', '--prefix', 'client'], {
  stdio: 'inherit',
  shell: true,
});

const cleanup = () => {
  console.log('\n🛑 Stopping FarmShield services...');
  server.kill();
  client.kill();
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
