$FRONTEND_PORT = 5173
$BACKEND_PORT = 8080

function Stop-Processes {
    param ($prompt, $ProcessName)
    $res = Read-Host -Prompt $prompt

    if ($res -eq "Y" -or $res -eq "")  {
        Stop-Process -Name $ProcessName
        Write-Host "`n$ProcessName has been stopped successfully.`n"
    } elseif ($res -eq "N") {
        Write-Host "$ProcessName is still running.`n"
    } else {
        Write-Host "Input must be Y(y) or N(n)" -ForegroundColor Red
        Stop-Processes -prompt $prompt -process $process
    }
}

if (Get-Process "Docker Desktop" -ErrorAction SilentlyContinue)
{
    Write-Host "`nDocker Desktop " -ForegroundColor Blue -NoNewline
    Write-Host "already running.`n"
}  else {
    Start-Process "Docker Desktop" -WorkingDirectory "C:\Program Files\Docker\Docker\"
    Write-Host "`nDocker Desktop" -ForegroundColor Blue -NoNewline
    Write-Host " starting..."
    Read-Host "`nPress Enter if Docker Desktop is ready (else it will result in an error)"
}

docker restart gtd-database > nul
Write-Host "Docker container " -ForegroundColor Blue -NoNewline
Write-Host "has been restarted."


Start-Process pwsh { -Command go run main.go } -WorkingDirectory .\server -WindowStyle Hidden

Start-Process pwsh { -Command pnpm run dev } -WorkingDirectory .\client -WindowStyle Hidden

Write-Host "`nWait until the process is fully loaded before using Ctrl-C to surely end the process..."


Get-NetTCPConnection -LocalPort $FRONTEND_PORT -ErrorAction SilentlyContinue > nul
while ($? -eq $false) {
    Get-NetTCPConnection -LocalPort $FRONTEND_PORT -ErrorAction SilentlyContinue > nul
}

Write-Host "`n-------------------------------------"

Write-Host "`nFRONTEND: " -ForegroundColor Green -NoNewLine
Write-Host "http://localhost:$FRONTEND_PORT" -ForegroundColor DarkYellow

Get-NetTCPConnection -LocalPort $BACKEND_PORT -ErrorAction SilentlyContinue > nul
    while ($? -eq $false) {
    Get-NetTCPConnection -LocalPort $BACKEND_PORT -ErrorAction SilentlyContinue > nul
}

Write-Host "`nBACKEND: " -ForegroundColor Cyan -NoNewLine
Write-Host "http://localhost:$BACKEND_PORT" -ForegroundColor DarkYellow

Write-Host "`n-------------------------------------"

$FRONTEND_PID = (Get-NetTCPConnection -LocalPort $FRONTEND_PORT).OwningProcess

$BACKEND_PID = (Get-NetTCPConnection -LocalPort $BACKEND_PORT).OwningProcess

try {
    while ($true) {

    }
}

finally {

# Servers cannot be stopped without -Confirm when the app is open in browser
    Stop-Process -Id $FRONTEND_PID -Confirm
    Stop-Process -Id $BACKEND_PID -Confirm

    Write-Host "`nServers are now offline." -ForegroundColor Magenta

    docker stop gtd-database > nul
    Write-Host "Docker container "  -ForegroundColor Blue -NoNewline
    Write-Host "has been stopped.`n"

    Stop-Processes -prompt 'Would you like to stop Docker Desktop? [Y] Yes [N] No (default is "Y")' -process "Docker Desktop"
}