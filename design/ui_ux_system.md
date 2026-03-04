## Design System: FlightRadar Webview Mac App

### Style
**Minimalist macOS Glassmorphism** (Blends with native macOS aesthetics)

### Color Palette (Day/Light Mode)
| Role | Hex | Contrast |
|------|-----|----------|
| Primary | #007AFF | 4.5:1 ✓ |
| Background | #FFFFFF | - |
| Panel/Glass | #F9F9F9DD | - |
| Text | #1C1C1E | 16:1 ✓ |
| Border | #E5E5EA | - |

### Color Palette (Night/Dark Mode)
| Role | Hex | Contrast |
|------|-----|----------|
| Primary | #0A84FF | 4.5:1 ✓ |
| Background | #000000 | - |
| Panel/Glass | #1C1C1EDD | - |
| Text | #F2F2F7 | 15:1 ✓ |
| Border | #38383A | - |

### Typography
| Element | Font | Weight | Size |
|---------|------|--------|------|
| Title | -apple-system (SF Pro) | 600 | 14px |
| Body | -apple-system (SF Pro) | 400 | 12px |
| Icon | sf-symbols | 400 | 16px |

### Components
| Component | Radius | Shadow | Hover |
|-----------|--------|--------|-------|
| Titlebar | 0px | none | none |
| Mute Button | 6px | none | bg-opacity/glass |
| Glass Panel | 10px | sm | none |

### Layout & UI
- **Titlebar**: Frameless with macOS traffic lights (top left). Drag region enabled.
- **Controls**: A simple, elegant glassmorphic floating control panel or integrated titlebar icon for the Mute/Unmute toggle. 
- **Theme Auto-Switching**: UI elements automatically respond to macOS system appearance via CSS `@media (prefers-color-scheme: dark)`.
