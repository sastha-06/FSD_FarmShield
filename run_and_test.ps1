$proc = Start-Process -FilePath "node" -ArgumentList "server/src/server.js" -PassThru

# Wait for server to be responsive
$ready = $false
for ($i = 0; $i -lt 15; $i++) {
  Start-Sleep -Milliseconds 800
  try {
    $res = Invoke-WebRequest -Uri "http://127.0.0.1:5000/api/health" -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
    if ($res.StatusCode -eq 200) {
      $ready = $true
      break
    }
  } catch {
    # not ready yet
  }
}

if (-not $ready) {
  Write-Host "Server failed to start within timeout"
  Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
  exit 1
}

try {
  node test_location_e2e.js
} finally {
  Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
}
