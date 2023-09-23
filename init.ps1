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

docker run --name gtd-database --mount source=gtd-data,target=/go-todo  -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres

Start-Sleep -Milliseconds 3000

docker exec -ti gtd-database createdb -U user database

npm install -g pnpm

$workdir = Get-Location

Set-Location $workdir\client && pnpm install

Set-Location $workdir\server && go mod download

Set-Location $workdir