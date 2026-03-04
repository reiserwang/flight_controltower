## Feature: FlightRadar24 Webview Mac App

### Overview
A lightweight macOS native-feeling application (built with Electron) that displays two specific FlightRadar24 views. The primary view is a live flight tracker map focused on Taiwan (`https://www.flightradar24.com/25.08,121.22/14`). A secondary hidden view plays live background Air Traffic Control (ATC) audio (`https://www.flightradar24.com/25.15,121.10/10`).

### User Stories
- As an aviation enthusiast, I want to view live flights over my region in a dedicated app window.
- As a user, I want the session to remain active indefinitely without being blocked by FlightRadar24's 30-minute subscription timeout modal.
- As a user listening to ATC, I want to easily mute or unmute the background tower communications directly from the app's UI.

### Functional Requirements
1. **Application Shell**: An Electron app with a frameless or minimal window style displaying a primary `BrowserView` or `webview`.
2. **Primary View**: Loads `https://www.flightradar24.com/25.08,121.22/14` (Flight Map).
3. **Session Management (Anti-Timeout)**: App must inject a script into the primary view that detects and aggressively removes DOM elements associated with the session timeout modal and its overlay.
4. **Background Audio View**: A hidden `BrowserView` or `webview` that loads `https://www.flightradar24.com/25.15,121.10/10` to stream ATC audio.
5. **Audio Controls**: A UI control (button/toggle) overlaid on the main window or integrated into a custom title bar that mutes/unmutes the hidden audio webview.
6. **UI/UX Themes**: The app UI (like the mute button and custom titlebar) must support both **Day and Night views**, automatically adapting to system preferences.
7. **Zero-Interaction Execution**: The deployment and iteration process must be fully streamlined to require minimal to zero user prompts, leveraging autonomous workflows.
8. **Testing Specifications**: Comprehensive Unit and System tests must be planned and executed to ensure stability.
9. **Documentation**: Ensure `README.md`, `SCRATCHPAD.md`, and `STANDARDS.md` (lessons learned) are updated every iteration.

### Acceptance Criteria
- [ ] App launches and immediately displays the flight map centered on the specified coordinates.
- [ ] Left running for > 35 minutes, the app does not show the "Session Timeout" modal.
- [ ] Background ATC audio plays upon app launch.
- [ ] Clicking the mute/unmute button successfully toggles the ATC audio stream without interrupting the visual map tracking.
- [ ] App can be packaged into a standalone macOS `.app` bundle.
