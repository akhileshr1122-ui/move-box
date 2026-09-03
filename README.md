# MoveBox for Windows

A native Windows build of the MoveBox motion games. It runs the game in its own window at your display's refresh rate, with body tracking on a background thread and everything bundled for offline use.

## Get the .exe without installing anything

1. Push this folder to a GitHub repository.
2. Open the **Actions** tab; the "Build MoveBox for Windows" workflow runs on every push.
3. Download the `MoveBox-windows` artifact. It contains an installer (`MoveBox Setup 3.0.0.exe`) and a portable `MoveBox 3.0.0.exe` that runs from anywhere.

Windows SmartScreen will warn on first run because the build isn't code-signed; choose *More info → Run anyway*.

## Build locally

    npm install
    npm run dist

Needs Node 18+. The model files are downloaded by the workflow; for a local build fetch them with the same commands from `.github/workflows/build-windows.yml`, or run once online and the app will fetch them itself.

## Keys

F11 toggles fullscreen, Esc leaves fullscreen, Alt+F4 quits.

## Layout

    main.js            Electron shell: local server, camera permission, fullscreen window
    www/index.html     the game (same file as the web version, pointed at local libraries)
    www/vendor/        TensorFlow.js + MoveNet pose detection
    www/models/        MoveNet weights (added by the build)
