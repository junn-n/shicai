# DNS Monitor - miyun stone website
$domain = "xn--mxtq1a2f4ac5a2en1a6694dthc.com"
$checkInterval = 300
$startTime = Get-Date
$checkCount = 0
$resolved = $false

function Show-Popup {
    param($Title, $Message)
    try {
        $wshell = New-Object -ComObject WScript.Shell
        $wshell.Popup($Message, 0, $Title, 0x40 + 0x1000)
    } catch {
        Write-Host "[POPUP] $Title - $Message" -ForegroundColor Green
    }
}

function Show-Balloon {
    param($Title, $Message)
    try {
        Add-Type -AssemblyName System.Windows.Forms
        $n = New-Object System.Windows.Forms.NotifyIcon
        $n.Icon = [System.Drawing.Icon]::ExtractAssociatedIcon("powershell.exe")
        $n.BalloonTipTitle = $Title
        $n.BalloonTipText = $Message
        $n.Visible = $true
        $n.ShowBalloonTip(15000)
        Start-Sleep -Seconds 16
        $n.Dispose()
    } catch {
        Show-Popup -Title $Title -Message $Message
    }
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  DNS Monitor Started" -ForegroundColor Cyan
Write-Host "  Domain: miyun stone .com" -ForegroundColor Cyan
Write-Host "  Check every 5 minutes" -ForegroundColor Cyan
Write-Host "  Start: $(Get-Date -Format "HH:mm:ss")" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Minimize window, DO NOT close it" -ForegroundColor Yellow

while (-not $resolved) {
    $checkCount++
    $now = Get-Date -Format "HH:mm:ss"
    
    $result = $null
    try {
        $result = Resolve-DnsName $domain -Type A -Server 8.8.8.8 -ErrorAction Stop
    } catch {
        $result = $null
    }
    
    if ($result -ne $null) {
        $ips = ($result | Select-Object -ExpandProperty IPAddress) -join ", "
        
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  DNS RESOLVED!" -ForegroundColor Green
        Write-Host "  IP: $ips" -ForegroundColor Green
        Write-Host "  Time: $now" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        
        Show-Balloon -Title "DNS生效! miyun stone .com" -Message "DNS resolved successfully! IP: $ips"
        Start-Sleep -Seconds 5
        Show-Popup -Title "域名的解析已生效!" -Message "DNS解析成功！请告诉AI助手绑定域名"
        $resolved = $true
    } else {
        Write-Host "[$now] Check #$checkCount - Not resolved yet (waiting...)"
    }
    
    if ($checkCount % 30 -eq 0) {
        $elapsed = [math]::Round(((Get-Date) - $startTime).TotalHours, 1)
        Write-Host "[INFO] $elapsed hours monitored, $checkCount checks done. Press Ctrl+C to stop." -ForegroundColor Yellow
    }
    
    if (-not $resolved) {
        Start-Sleep -Seconds $checkInterval
    }
}

Write-Host "Press Enter to exit..." -ForegroundColor Green
Read-Host
