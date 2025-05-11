#!/bin/bash

# Download Source
curl -fsSL -o argonfetch.tar.gz https://github.com/ArgonFetch/ArgonFetch/archive/refs/heads/main.tar.gz

# Unpack Source, remove tar and cd into the source directory
tar -xzf argonfetch.tar.gz
rm argonfetch.tar.gz
cd ArgonFetch-main # Or the name of the extracted folder

# Make the script executable
chmod +x setup.sh

# Run interactively
./setup.sh
