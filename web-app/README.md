NEMO Web App
================

## Prerequisites

1. Node.js v5.6.0
2. NPM Modules defined in packages.json

Run `npm i` to download dependencies for application.
Run 'npm run build' to convert src/ files for use

## Installing NPM

NVM is a helpful tool for managing node version on linux

1. `curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash`
2. `nvm install v5.6.0`
3. `nvm use v5.6.0`

This should set your default node version for future use, if it does not you will have to set the command in your bash profile.

## Configuration

NOTE: src/config.js must have apiUrl correctly set

## Usage

The application can be started via `npm start`. The application will start using the settings defined in `config/dev.json`. To access the web app open a page in your browser pointing at `localhost:3030`.
