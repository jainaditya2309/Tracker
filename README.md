# Health Tracker PWA 🏃‍♀️

A fully functional Progressive Web App for tracking daily health progress including calories, protein, water intake, and skincare routines.

## Features ✨

### Core Functionality
- **Daily Goal Setup**: Set personalized goals for calories, protein, water, and skincare timing
- **Real-time Progress Tracking**: Visual progress bars and remaining amounts
- **Multi-entry Logging**: Add multiple intakes throughout the day
- **Skincare Reminders**: Timed notifications for morning and evening routines
- **Data Persistence**: All data saved locally with localStorage
- **Offline Support**: Works completely offline as a PWA

### PWA Features
- **Installable**: Can be installed on mobile and desktop
- **Offline Caching**: Service worker caches all files for offline use
- **Native App Experience**: Standalone display mode
- **Push Notifications**: Browser notifications for reminders
- **Responsive Design**: Works on all screen sizes

### UI/UX Features
- **Dark/Light Mode**: Toggle between themes
- **Smooth Animations**: Polished user experience
- **Toast Notifications**: Instant feedback for user actions
- **Auto-save**: Data saves automatically on every input
- **Midnight Reset**: Automatically resets daily progress

## Installation 📱

### Desktop
1. Open the app in Chrome, Edge, or Firefox
2. Look for the install icon in the address bar
3. Click "Install" to add to your desktop

### Mobile
1. Open the app in your mobile browser
2. Tap the browser menu (⋮)
3. Select "Add to Home Screen"
4. Confirm installation

### Local Development
1. Clone or download the project files
2. Ensure all files are in the same directory:
   - `index.html`
   - `style.css` 
   - `script.js`
   - `manifest.json`
   - `service-worker.js`
   - Icon files (see Icons section below)

3. Serve the files using a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

4. Open `http://localhost:8000` in your browser

## Icons 🎨

The app requires the following icon files for full PWA functionality:
- `icon-72x72.png`
- `icon-96x96.png`
- `icon-128x128.png`
- `icon-144x144.png`
- `icon-152x152.png`
- `icon-192x192.png`
- `icon-384x384.png`
- `icon-512x512.png`

### Creating Icons
1. Use the provided `icon-template.svg` as a base
2. Convert to PNG files at different sizes using:
   - Online tools like [PWA Builder Image Generator](https://www.pwabuilder.com/imageGenerator)
   - Design software like Photoshop, GIMP, or Figma
   - Command line tools like ImageMagick

## Usage Guide 📋

### Setting Up Goals
1. Enter your daily targets for calories, protein, and water
2. Set your preferred skincare reminder times
3. Click "Save Goals" to store your preferences

### Tracking Progress
1. Use the "Add Intake" section to log your consumption
2. View real-time progress in the dashboard
3. Check off skincare tasks as you complete them

### Notifications
1. Click "Enable Notifications" to receive reminders
2. You'll get alerts for:
   - Skincare routine times
   - Goal completion milestones
   - Progress reminders

### Daily Management
- **Reset Today**: Manually reset all daily progress
- **Check Reminders**: Get instant summary of remaining tasks
- **Auto Reset**: App automatically resets at midnight

## Technical Details 🛠️

### Data Storage
- **localStorage**: All user data and preferences
- **Automatic Backup**: Data persists across browser sessions
- **Daily Reset**: Progress resets automatically at midnight

### Offline Capability
- **Service Worker**: Caches all app files for offline use
- **Background Sync**: Syncs data when connection is restored
- **Cache Strategy**: Cache-first for static files, network-first for data

### Browser Compatibility
- **Chrome/Edge**: Full PWA support
- **Firefox**: Most features supported
- **Safari**: Basic PWA support (iOS 11.3+)
- **Mobile**: Optimized for all mobile browsers

### Notifications
- **Web Notifications API**: Browser-based notifications
- **Skincare Reminders**: Time-based alerts
- **Progress Notifications**: Goal completion alerts
- **Permission Required**: User must grant notification permission

## File Structure 📁

```
health-tracker-pwa/
├── index.html          # Main app interface
├── style.css           # Styling with light/dark themes
├── script.js           # App logic and functionality
├── manifest.json       # PWA configuration
├── service-worker.js   # Offline caching and background tasks
├── icon-template.svg   # Template for creating icons
├── generate-icons.html # Utility for generating icons
├── icon-*.png         # App icons (various sizes)
└── README.md          # This file
```

## Customization 🎨

### Adding New Features
- Extend the `HealthTracker` class in `script.js`
- Add new UI elements to `index.html`
- Style new components in `style.css`

### Modifying Goals
- Edit the default goals in the `HealthTracker` constructor
- Add new goal types by extending the data structure
- Update the UI to include new goal inputs

### Styling Changes
- Modify CSS variables in `:root` for color schemes
- Adjust responsive breakpoints for different screen sizes
- Add new animations by extending the CSS animations

## Browser Support 🌐

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| PWA Install | ✅ | ✅ | ⚠️ | ✅ |
| Service Worker | ✅ | ✅ | ✅ | ✅ |
| Notifications | ✅ | ✅ | ❌ | ✅ |
| localStorage | ✅ | ✅ | ✅ | ✅ |
| Offline Mode | ✅ | ✅ | ✅ | ✅ |

## Troubleshooting 🔧

### Common Issues
1. **Icons not loading**: Ensure icon PNG files are in the correct directory
2. **Notifications not working**: Check browser notification permissions
3. **PWA not installing**: Ensure HTTPS or localhost serving
4. **Data not saving**: Check browser localStorage permissions

### Browser Console
- Press F12 to open developer tools
- Check Console tab for any error messages
- Look for Service Worker registration status

## License 📄

This project is open source and available under the MIT License.

## Contributing 🤝

Feel free to submit issues, feature requests, or pull requests to improve the Health Tracker PWA!

---

**Enjoy tracking your health goals! 🌟**
