# Design Review (Think-Twice)

## Architecture Choice (Electron)
- **Review:** Is Electron the most elegant and minimal path?
- **Conclusion:** Yes. Wrapping two separate browser views (visual and hidden audio) natively on macOS is complex and less flexible for DOM injection than Electron. Electron's `BrowserView` gives us isolated sandboxes to run the Map and Audio, and `executeJavaScript` provides an easy bridge to nuke the timeout modal asynchronously.

## Session Timeout Mitigation
- **Review:** Would simulating user inputs or refreshing every 25min be better?
- **Conclusion:** No. A refresh interrupts tracking and kills active flight selections. Simulating clicks is brittle if the UI changes. Injecting a `MutationObserver` that zaps `.premium-popup` elements is the least intrusive and most aggressive way to maintain the session uninterrupted.

## UI/UX Themes (Day/Night)
- **Review:** Do we need IPC for theme switching?
- **Conclusion:** No. We can directly read the macOS appearance natively or via Chromium's native CSS media queries `(prefers-color-scheme: dark)`. This reduces IPC overhead.

## Testing Strategy
- **Review:** How to verify without a long 30-min wait?
- **Conclusion:** Our system tests can manually emit mutations matching the FlightRadar popup to verify the script removes them instantly.
