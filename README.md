# Vue Weather App

A modern weather application built with Vue 3, TypeScript, TailwindCSS, and Rsbuild. This app displays current weather conditions for multiple cities and provides detailed weather information including a 5-day forecast.

## Features

- 🌤️ **Home Page**: Displays current weather for 7 major cities worldwide
- 📊 **Detail Page**: Shows detailed weather information and 5-day forecast for selected cities
- 🎨 **Modern UI**: Built with TailwindCSS for a clean, responsive design
- ⚡ **Fast Performance**: Powered by Rsbuild for optimal build speed
- 🌡️ **Real-time Data**: Uses OpenWeatherMap API for accurate weather data
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Vue 3** with Composition API
- **TypeScript** for type safety
- **Vue Router** for navigation
- **TailwindCSS** for styling
- **Rsbuild** for build tooling
- **Axios** for API calls
- **OpenWeatherMap API** for weather data

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Yarn or npm package manager
- OpenWeatherMap API key (free at [openweathermap.org](https://openweathermap.org/api))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rs-vue-weather
   ```

2. **Install dependencies**
   ```bash
   yarn install
   # or
   npm install
   ```

3. **Set up environment variables**
   
   **Option A - Quick Setup (Recommended):**
   ```bash
   ./setup-env.sh
   ```
   
   **Option B - Manual Setup:**
   ```bash
   # Create a .env file in the root directory
   touch .env
   
   # Add your OpenWeatherMap API key to .env
   echo "VITE_OPENWEATHER_API_KEY=your_api_key_here" > .env
   ```

4. **Start the development server**
   ```bash
   yarn dev
   # or
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000` to view the app.

## Usage

### Home Page
- View current weather for 7 cities: Ho Chi Minh City, Hanoi, New York, London, Tokyo, Paris, and Sydney
- Each weather card shows:
  - Current temperature
  - Weather description with icon
  - Feels-like temperature
  - Humidity and wind speed
- Click on any card to view detailed information

### Detail Page
- Detailed weather information including:
  - Large weather icon and description
  - High/low temperatures
  - Humidity, pressure, and visibility
  - Wind speed and direction
  - Sunrise and sunset times
- 5-day weather forecast with:
  - Daily high/low temperatures
  - Weather icons and descriptions
  - Precipitation probability

## API Key Setup

1. Sign up for a free account at [OpenWeatherMap](https://openweathermap.org/api)
2. Generate an API key
3. Add it to your `.env` file as `VITE_OPENWEATHER_API_KEY`

**Note**: The app includes a demo API key with limited usage. For production use, please use your own API key.

## Environment Configuration (Rsbuild/Rspack)

This project uses Rsbuild (built on Rspack) for bundling. Environment variables are configured as follows:

### `.env` file format:
```bash
# Weather App Environment Variables
# Get your free API key from: https://openweathermap.org/api
VITE_OPENWEATHER_API_KEY=your_actual_api_key_here
```

### How it works:
- Environment variables are defined in `rsbuild.config.ts` using the `source.define` option
- Variables prefixed with `VITE_` are automatically available in the client-side code
- TypeScript definitions are provided in `src/env.d.ts` for type safety
- The weather service accesses the API key via `process.env.VITE_OPENWEATHER_API_KEY`

## Building for Production

```bash
yarn build
# or
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # Reusable Vue components
├── views/              # Page components
│   ├── Home.vue        # Home page with weather cards
│   └── Detail.vue      # Detail page with forecast
├── services/           # API services
│   └── weatherService.ts
├── router/             # Vue Router configuration
│   └── index.ts
├── App.vue             # Root component
├── index.ts            # Entry point
└── index.css           # Global styles with TailwindCSS
```

## Customization

### Adding New Cities

Edit the `defaultCities` array in `src/services/weatherService.ts`:

```typescript
private defaultCities: CityData[] = [
  { id: 1880252, name: 'Ho Chi Minh City', country: 'VN', coord: { lat: 10.8231, lon: 106.6297 } },
  // Add your cities here
];
```

### Styling

The app uses TailwindCSS for styling. You can customize the design by:
- Modifying the TailwindCSS classes in components
- Extending the theme in `tailwind.config.js`
- Adding custom CSS in `src/index.css`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).
