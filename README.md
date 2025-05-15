# SnovaTech Solar Simulation

## About the Map Integration

This application uses Leaflet.js for interactive maps. Leaflet is an open-source JavaScript library for mobile-friendly interactive maps that doesn't require an API key, making it easier to deploy and maintain.

## Features

- **Interactive Map**: Click on the map to select your location
- **Address Search**: Search for addresses using OpenStreetMap's Nominatim service
- **Responsive Design**: Works on both desktop and mobile devices
- **Solar Simulation**: Calculate potential solar panel installation based on your location and inputs

## Development Setup

1. **Install Dependencies**:
   \`\`\`
   npm install
   \`\`\`

2. **Run Development Server**:
   \`\`\`
   npm run dev
   \`\`\`

3. **Build for Production**:
   \`\`\`
   npm run build
   \`\`\`

## Mobile Responsiveness

The application is fully responsive and works on all device sizes:

- **Desktop**: Full sidebar with form always visible
- **Mobile**: Toggle between map view and form view
- **Tablet**: Adaptive layout based on screen size

## Troubleshooting

If you encounter issues with the map:

1. Check your internet connection as Leaflet requires access to tile servers
2. Ensure all dependencies are correctly installed
3. Clear your browser cache if you're seeing outdated styles

## Technologies Used

- Next.js for the frontend framework
- Leaflet.js for interactive maps
- Recharts for data visualization
- Tailwind CSS for styling
\`\`\`

Let's also update the .env files to remove Google Maps references:

```plaintext file=".env.local"
# No API keys needed for Leaflet
