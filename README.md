# MADHAV - The-web-guide 
# A Smart Voice Web Assistant

## Project Status
This project is currently under development and represents a partial implementation of the Smart Voice Web Assistant.

## Overview
Smart Voice Web Assistant is a Chrome Extension that allows users to interact with websites using voice commands.  
The assistant listens to spoken commands and guides the user to the correct element on the webpage using both visual highlighting and voice instructions.

The goal of this project is to improve accessibility and make website navigation easier through voice interaction.

---

## Features

### Voice Command Recognition
The extension uses the browser Speech Recognition API to listen for user commands in real time.

### Visual Guidance
When a command is detected, the assistant highlights the relevant element on the webpage with a red outline and scrolls it into view.

### Voice Feedback
The assistant gives spoken guidance using the browser Speech Synthesis API.

### Smart Navigation
The assistant helps users locate common website features such as:

- Search bars
- Subscribe buttons
- Login forms
- Profile menu options

### Profile Menu Assistance
The assistant can guide users to profile menu options such as:

- Sign out
- Switch account
- Settings
- Help
- Data

---

## Example Voice Commands

search  
subscribe  
login  
sign out  
switch account  
settings  
help  
data  

The assistant analyzes the webpage and guides the user to the appropriate element.

---

## Project Structure

Smart-Voice-Web-Assistant

manifest.json – Chrome extension configuration  
content.js – Main logic of the voice assistant  
popup.html – Extension popup interface  
popup.js – Handles popup button interaction  

---

## How It Works

1. The user clicks **Start Assistant** in the extension popup.
2. Speech recognition begins listening for commands.
3. The spoken command is processed.
4. The assistant searches the webpage for matching elements.
5. The element is highlighted and the assistant speaks instructions.

---

## Technologies Used

JavaScript  
Chrome Extension API  
Web Speech API  
DOM Manipulation  

---

## Current Status

This project is currently under development and represents a partial implementation of a voice-guided web assistant.

Future improvements may include:

- More advanced voice command understanding
- Better AI-based navigation
- Support for more websites
- Improved user interface guidance

---

## Author

Anmol Tyagi 
Aaryan Chawla
Yasharth Nagda

---

## Note
This repository is created for educational and project demonstration purposes.
