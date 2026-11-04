import { spawn } from 'child_process';

async function runCommand(cmd, args) {
  return new Promise((resolve) => {
    const p = spawn(cmd, args, { stdio: 'inherit' });
    p.on('exit', (code) => resolve(code));
  });
}

async function main() {
  console.log('====================================================');
  console.log('🚀 RUNNING ALL FARMSHIELD COMPREHENSIVE SUITES');
  console.log('====================================================\n');

  // Suite 1: Pure Unit/Algorithm Tests (Multi-factor engine & weather baseline)
  console.log('>>> [1/3] Multi-Factor Engine & Agronomic Unit Tests');
  const code1 = await runCommand('node', ['test_multi_factor_crop_system.js']);
  if (code1 !== 0) {
    console.error('Suite 1 failed');
    process.exit(1);
  }

  // Start Server for API suites if not already running
  let server = null;
  let alreadyRunning = false;
  try {
    const healthCheck = await fetch('http://127.0.0.1:5000/api/health', { signal: AbortSignal.timeout(1500) });
    if (healthCheck.ok) {
      alreadyRunning = true;
      console.log('\n>>> Detected existing FarmShield server already active on port 5000.');
    }
  } catch (_) {}

  if (!alreadyRunning) {
    console.log('\n>>> Booting FarmShield Unified Server...');
    server = spawn('node', ['server/src/server.js'], { stdio: ['pipe', 'pipe', 'pipe'] });

    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Server boot timeout')), 35000);
      server.stdout.on('data', (d) => {
        const str = d.toString();
        process.stdout.write(str);
        if (str.includes('FarmShield Server active')) {
          clearTimeout(timeout);
          resolve();
        }
      });
      server.stderr.on('data', (d) => {
        process.stderr.write(d.toString());
      });
    });
  }

  console.log('Server is online!\n');

  try {
    // Suite 2: Multi-Factor REST API E2E
    console.log('>>> [2/3] Multi-Factor REST API E2E Verification');
    const code2 = await runCommand('node', ['test_multifactor_api_e2e.js']);
    if (code2 !== 0) throw new Error('Suite 2 failed');

    // Suite 3: DIGIPIN & Location Map E2E
    console.log('\n>>> [3/3] DIGIPIN & Geospatial E2E Verification');
    const code3 = await runCommand('node', ['test_location_e2e.js']);
    if (code3 !== 0) throw new Error('Suite 3 failed');

    console.log('\n====================================================');
    console.log('🎉 ALL TEST SUITES COMPLETED WITH 100% SUCCESS!');
    console.log('====================================================');
    if (server) server.kill();
    process.exit(0);
  } catch (err) {
    console.error('Test execution error:', err);
    if (server) server.kill();
    process.exit(1);
  }
}

main();
