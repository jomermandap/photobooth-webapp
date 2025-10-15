# Underwater Photobooth Web App 🐠

An underwater-themed photobooth web application built with vanilla HTML, CSS, and JavaScript. Add cute sea creatures and bubbles to your photos and download them as a photo strip🐡

## Features
- Live camera preview and photo capture
- Upload custom photos
- Add + drag and drop stickers 
- Download your decorated photo strip
- Fully responsive design

## Demo
[http://photobooth.nashallery.com](http://photobooth.nashallery.com)

## Getting Started
**Important:** This app uses your camera. You cannot open the HTML file directly in a browser due to camera permissions. You need to serve it with a local server.

### Requirements
- Node.js installed (for `npx serve`)

### How to run the project locally
1. Open a terminal in your project folder:
   ```bash
   cd path/to/photobooth-github-tutorial
   npx serve
2. Open the URL shown in the terminal (usually http://localhost:3000) in a browser.

3. Allow camera access when prompted.


## Project Structure
photobooth-webapp/
├── Assets/
│   └── fish-photobooth/
├── Javascripts/
│   ├── bubbles.js
│   ├── camera.js
│   ├── final.js
│   └── upload.js
├── StyleSheets/
│   ├── camera.css
│   ├── final.css
│   └── home.css
├── .DS_Store
├── camera.html
├── final.html
├── index.html
├── menu.html
└── upload.html
