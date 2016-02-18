Nemo Web App
================

Nemo Web Applicaion User Dashboard

## Prerequisites

1. Node.js v5.6.0
2. NPM Modules defined in packages.json

Run `npm i` to download dependencies for application.
Run 'npm run build' to convert src/ es6 files to client/ es5 files

## Usage

The application can be started via `npm run dev`. The application will start using the settings defined in `config/dev.json`. To access the web app open a page in your browser pointing at `localhost:3000`.

## About
This is for User Story 2.02

Uses Es6 javaScript version

## Main files that are being used
1. nemo/web-app/models/*
2. nemoAPI.js
3. nemo/web-app/src/pages/dashboard-user.js
4. nemo/web-app/src/pages/base.js
5. nemo/web-app/src/partials/*

## Project Requirements Coverage

User authentication and privileges still need to be implemented for all calls.

2.02: User poses question via web application
- Database calls are in nemoApi.js
- Web client GUI is composed for this
- Max number of questions not implemented yet
- Unit Test(s): 2.2

Handling for duplicate question has not been written yet (As in Requirement 2.03)

2.04: User deletes a question
- Database calls are in nemoApi.js
- Web client GUI is not yet composed for this
- Unit Test(s): 2.4


Currently data is not retained as in the requirement, may discuss this requirement with client

2.06: User does a soft edit of question
- Database calls are in nemoApi.js
- Web client GUI is not yet fully composed for this, but the create question partial will be adapted for it
- Unit Tests: 2.6


Handling for duplicate question has not been written yet
