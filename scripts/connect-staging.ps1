param(
  [string]$HostAddress = '100.62.20.61',
  [string]$KeyPath = 'C:\Users\chris\DeprecatedOneDrive\Desktop\datacenter-impact-staging-ssh.pem'
)

if (-not (Test-Path -LiteralPath $KeyPath)) {
  throw "SSH key not found: $KeyPath"
}

$sshArgs = @('-o', 'BatchMode=yes', '-o', 'ConnectTimeout=15', '-o', 'ServerAliveInterval=15', '-o', 'ServerAliveCountMax=3', '-o', 'IdentitiesOnly=yes', '-i', $KeyPath, "ubuntu@$HostAddress")
& ssh @sshArgs
$exitCode = $LASTEXITCODE
if ($exitCode -ne 0) {
  Write-Host "SSH exited with code $exitCode. The window will remain open so you can read the error."
}
Read-Host 'Press Enter to close'
exit $exitCode
