# Setup Android build environment for PowerShell
Write-Host "Setting up Android build environment..." -ForegroundColor Green

$env:JAVA_HOME = "C:\Program Files\Java\jdk-24"
$env:ANDROID_HOME = "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk"
$env:PATH += ";$env:ANDROID_HOME\platform-tools"

Write-Host "JAVA_HOME set to: $env:JAVA_HOME" -ForegroundColor Yellow
Write-Host "ANDROID_HOME set to: $env:ANDROID_HOME" -ForegroundColor Yellow
Write-Host "ADB added to PATH" -ForegroundColor Yellow

Write-Host "Environment variables set successfully!" -ForegroundColor Green
Write-Host "You can now run: .\gradlew.bat assembleDebug" -ForegroundColor Cyan

# Reset ADB if needed
Write-Host "Resetting ADB server..." -ForegroundColor Yellow
try {
    adb kill-server
    Start-Sleep -Seconds 2
    adb start-server
    Write-Host "ADB server reset successfully!" -ForegroundColor Green
} catch {
    Write-Host "ADB reset failed. Make sure emulator is running." -ForegroundColor Red
} 