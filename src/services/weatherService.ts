import axios from 'axios';

// OpenMeteo API - Free weather API without API key requirement
const BASE_URL = 'https://api.open-meteo.com/v1';

export interface WeatherData {
  id: number;
  name: string;
  country: string;
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  pressure: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  description: string;
  icon: string;
  sunrise: number;
  sunset: number;
  dt: number;
  coord: {
    lat: number;
    lon: number;
  };
}

export interface ForecastData {
  dt: number;
  dt_txt: string;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  pop: number;
}

export interface CityData {
  id: number;
  name: string;
  country: string;
  coord: {
    lat: number;
    lon: number;
  };
}

class WeatherService {
  private defaultCities: CityData[] = [
    { id: 1880252, name: 'Ho Chi Minh City', country: 'VN', coord: { lat: 10.8231, lon: 106.6297 } },
    { id: 1566083, name: 'Hanoi', country: 'VN', coord: { lat: 21.0245, lon: 105.8412 } },
    { id: 5128581, name: 'New York', country: 'US', coord: { lat: 40.7128, lon: -74.0060 } },
    { id: 2643743, name: 'London', country: 'GB', coord: { lat: 51.5074, lon: -0.1278 } },
    { id: 1850147, name: 'Tokyo', country: 'JP', coord: { lat: 35.6762, lon: 139.6503 } },
    { id: 2988507, name: 'Paris', country: 'FR', coord: { lat: 48.8566, lon: 2.3522 } },
    { id: 2147714, name: 'Sydney', country: 'AU', coord: { lat: -33.8688, lon: 151.2093 } }
  ];

  // Weather code to description mapping for OpenMeteo
  private getWeatherDescription(code: number): { description: string; icon: string } {
    const weatherCodes: { [key: number]: { description: string; icon: string } } = {
      0: { description: 'Clear sky', icon: '01d' },
      1: { description: 'Mainly clear', icon: '01d' },
      2: { description: 'Partly cloudy', icon: '02d' },
      3: { description: 'Overcast', icon: '03d' },
      45: { description: 'Fog', icon: '50d' },
      48: { description: 'Depositing rime fog', icon: '50d' },
      51: { description: 'Light drizzle', icon: '09d' },
      53: { description: 'Moderate drizzle', icon: '09d' },
      55: { description: 'Dense drizzle', icon: '09d' },
      56: { description: 'Light freezing drizzle', icon: '09d' },
      57: { description: 'Dense freezing drizzle', icon: '09d' },
      61: { description: 'Slight rain', icon: '10d' },
      63: { description: 'Moderate rain', icon: '10d' },
      65: { description: 'Heavy rain', icon: '10d' },
      66: { description: 'Light freezing rain', icon: '13d' },
      67: { description: 'Heavy freezing rain', icon: '13d' },
      71: { description: 'Slight snow fall', icon: '13d' },
      73: { description: 'Moderate snow fall', icon: '13d' },
      75: { description: 'Heavy snow fall', icon: '13d' },
      77: { description: 'Snow grains', icon: '13d' },
      80: { description: 'Slight rain showers', icon: '09d' },
      81: { description: 'Moderate rain showers', icon: '09d' },
      82: { description: 'Violent rain showers', icon: '09d' },
      85: { description: 'Slight snow showers', icon: '13d' },
      86: { description: 'Heavy snow showers', icon: '13d' },
      95: { description: 'Thunderstorm', icon: '11d' },
      96: { description: 'Thunderstorm with slight hail', icon: '11d' },
      99: { description: 'Thunderstorm with heavy hail', icon: '11d' }
    };

    return weatherCodes[code] || { description: 'Unknown', icon: '01d' };
  }

  async getCurrentWeather(cityId: number): Promise<WeatherData> {
    try {
      const city = this.defaultCities.find(c => c.id === cityId);
      if (!city) throw new Error('City not found');

      const response = await axios.get(`${BASE_URL}/forecast`, {
        params: {
          latitude: city.coord.lat,
          longitude: city.coord.lon,
          current: 'temperature_2m,relative_humidity_2m,apparent_temperature,surface_pressure,wind_speed_10m,wind_direction_10m,weather_code',
          daily: 'sunrise,sunset,temperature_2m_max,temperature_2m_min',
          timezone: 'auto',
          forecast_days: 1
        }
      });

      const current = response.data.current;
      const daily = response.data.daily;
      const weather = this.getWeatherDescription(current.weather_code);

      return {
        id: city.id,
        name: city.name,
        country: city.country,
        temp: Math.round(current.temperature_2m),
        feels_like: Math.round(current.apparent_temperature),
        temp_min: Math.round(daily.temperature_2m_min[0]),
        temp_max: Math.round(daily.temperature_2m_max[0]),
        humidity: current.relative_humidity_2m,
        pressure: Math.round(current.surface_pressure),
        visibility: 10000, // OpenMeteo doesn't provide visibility, using default
        wind_speed: current.wind_speed_10m,
        wind_deg: current.wind_direction_10m,
        description: weather.description,
        icon: weather.icon,
        sunrise: new Date(daily.sunrise[0]).getTime() / 1000,
        sunset: new Date(daily.sunset[0]).getTime() / 1000,
        dt: new Date(current.time).getTime() / 1000,
        coord: city.coord
      };
    } catch (error) {
      console.error('Error fetching current weather:', error);
      throw error;
    }
  }

  async get5DayForecast(cityId: number): Promise<ForecastData[]> {
    try {
      const city = this.defaultCities.find(c => c.id === cityId);
      if (!city) throw new Error('City not found');

      const response = await axios.get(`${BASE_URL}/forecast`, {
        params: {
          latitude: city.coord.lat,
          longitude: city.coord.lon,
          daily: 'weather_code,temperature_2m_max,temperature_2m_min,relative_humidity_2m,surface_pressure,wind_speed_10m_max,wind_direction_10m_dominant,precipitation_probability_max',
          timezone: 'auto',
          forecast_days: 5
        }
      });

      const daily = response.data.daily;
      const forecasts: ForecastData[] = [];

      for (let i = 0; i < 5; i++) {
        const weather = this.getWeatherDescription(daily.weather_code[i]);
        const date = new Date(daily.time[i]);
        
        forecasts.push({
          dt: date.getTime() / 1000,
          dt_txt: date.toISOString(),
          main: {
            temp: Math.round((daily.temperature_2m_max[i] + daily.temperature_2m_min[i]) / 2),
            temp_min: Math.round(daily.temperature_2m_min[i]),
            temp_max: Math.round(daily.temperature_2m_max[i]),
            humidity: daily.relative_humidity_2m[i] || 50,
            pressure: Math.round(daily.surface_pressure[i] || 1013),
          },
          weather: [{
            id: daily.weather_code[i],
            main: weather.description.split(' ')[0],
            description: weather.description,
            icon: weather.icon
          }],
          wind: {
            speed: daily.wind_speed_10m_max[i] || 0,
            deg: daily.wind_direction_10m_dominant[i] || 0,
          },
          pop: (daily.precipitation_probability_max[i] || 0) / 100
        });
      }

      return forecasts;
    } catch (error) {
      console.error('Error fetching 5-day forecast:', error);
      throw error;
    }
  }

  async getMultipleCitiesWeather(): Promise<WeatherData[]> {
    try {
      const promises = this.defaultCities.map(city => this.getCurrentWeather(city.id));
      return await Promise.all(promises);
    } catch (error) {
      console.error('Error fetching multiple cities weather:', error);
      throw error;
    }
  }

  getWeatherIconUrl(icon: string): string {
    // Using OpenWeatherMap icons for consistency (they work without API key)
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  }

  formatDate(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  }

  formatTime(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

export default new WeatherService(); 