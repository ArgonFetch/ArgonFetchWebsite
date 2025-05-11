# Download the source using Invoke-WebRequest
Invoke-WebRequest -Uri "https://github.com/ArgonFetch/ArgonFetch/archive/refs/heads/main.tar.gz" -OutFile "argonfetch.tar.gz"

# Extract the tar.gz file (Windows 10 and later include tar)
tar -xzf argonfetch.tar.gz

# Remove the downloaded archive
Remove-Item argonfetch.tar.gz

# Change directory into the extracted folder
Set-Location ArgonFetch-main # Or the name of the extracted folder

# Run interactively
.\setup.ps1
