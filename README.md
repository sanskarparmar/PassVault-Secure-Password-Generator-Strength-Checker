# PassVault-Secure-Password-Generator-Strength-Checker
PassVault is a lightweight, privacy-first web app that generates strong random passwords and checks the strength of existing ones. It is built with plain HTML, CSS and JavaScript – no frameworks, no dependencies, no backend. Everything runs in your browser, and no password is ever sent to a server.
Features
Password Generator
Adjustable length from 4 to 64 characters
Character options: uppercase, lowercase, numbers and symbols
Advanced options:
Exclude similar characters (i, l, 1, L, o, 0, O)
Exclude duplicate characters
At least one character from every selected type is included
One-click copy to clipboard
Live strength meter (Weak, Fair, Good, Strong)
Password Checker
Checks a password against 5 requirements: 8+ characters, uppercase, lowercase, number and special character
Suggestions on what to add
Show/Hide toggle for the entered password
Interface
Dark and light theme toggle
Responsive layout for desktop and mobile
Security Notes
Passwords are generated with the Web Crypto API (crypto.getRandomValues), not Math.random().
Rejection sampling avoids modulo bias.
A secure Fisher-Yates shuffle randomizes character positions.
No network requests are made and nothing is stored.
The strength checker is a simple rule-based check (length and character variety). It does not detect common passwords or dictionary words.
Tech Stack
HTML5
CSS3
Vanilla JavaScript (ES6+)
Google Fonts (DM Sans, Outfit)
Project Structure
passvault/
├── index.html
├── style.css
├── script.js
└── assets/
    └── purple-bg.jpg
Getting Started
bash
git clone https://github.com/<your-username>/passvault.git
cd passvault

Open index.html in your browser. No build step or installation is needed.

Usage
Move the slider to choose the password length.
Select the character types you want.
Optionally enable Advanced to exclude similar or duplicate characters.
Click Generate Password.
Click Copy to copy the password.
Use the Password checker to test an existing password.
