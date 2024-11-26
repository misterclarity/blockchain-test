$source = "."
$destination = "glitch-project.zip"

# Remove existing zip if it exists
if (Test-Path $destination) {
    Remove-Item $destination
}

# Create a temporary directory
$tempDir = "temp-for-zip"
if (Test-Path $tempDir) {
    Remove-Item $tempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

# Copy files we want to include
Copy-Item "server.js" $tempDir
Copy-Item "package.json" $tempDir
Copy-Item "package-lock.json" $tempDir
Copy-Item "src" $tempDir -Recurse
Copy-Item ".data" $tempDir -Recurse -ErrorAction SilentlyContinue

# Create the zip file
Compress-Archive -Path "$tempDir\*" -DestinationPath $destination

# Clean up
Remove-Item $tempDir -Recurse -Force

Write-Host "Created $destination successfully!"
