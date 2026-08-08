@echo off
cd /d "%~dp0"
npm install react-router-dom axios
npm install --save-dev tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
echo Done.
