<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500">
    <div class="container mx-auto px-4 py-8">
      <!-- Back Button -->
      <button 
        @click="goBack"
        class="mb-6 flex items-center text-white hover:text-gray-200 transition-all duration-300 hover:transform hover:-translate-x-1 animate-fadeInUp"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
        Back to Home
      </button>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="loading-spinner h-16 w-16 animate-pulse-glow"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center animate-fadeInScale">
        <div class="glass-card text-white p-6 rounded-2xl max-w-md mx-auto">
          <div class="text-red-400 mb-4">
            <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <p class="font-semibold text-lg mb-2">Error loading weather data</p>
          <p class="text-sm text-gray-300 mb-4">{{ error }}</p>
          <button 
            @click="fetchWeatherData" 
            class="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>

      <!-- Weather Content -->
      <div v-else-if="currentWeather">
        <!-- Current Weather Card -->
        <div class="glass-card rounded-2xl p-8 mb-8 animate-fadeInScale">
          <div class="text-center mb-6">
            <h1 class="text-4xl md:text-5xl font-bold text-white mb-2 text-shadow-lg">{{ currentWeather.name }}</h1>
            <p class="text-purple-100 text-lg md:text-xl">{{ currentWeather.country }}</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Main Temperature -->
            <div class="text-center animate-fadeInUp">
              <img 
                :src="weatherService.getWeatherIconUrl(currentWeather.icon)" 
                :alt="currentWeather.description"
                class="w-24 h-24 mx-auto mb-4 drop-shadow-lg"
              />
              <div class="text-6xl font-bold text-white mb-2 text-shadow-lg">{{ currentWeather.temp }}°C</div>
              <p class="text-purple-100 text-xl capitalize">{{ currentWeather.description }}</p>
              <p class="text-purple-200 text-sm mt-2">Feels like {{ currentWeather.feels_like }}°C</p>
            </div>

            <!-- Weather Details -->
            <div class="space-y-4 animate-fadeInUp" style="animation-delay: 0.1s">
              <h3 class="text-xl font-semibold text-white mb-4 text-shadow">Weather Details</h3>
              <div class="space-y-3 text-purple-100">
                <div class="flex justify-between items-center bg-white/10 rounded-lg p-3">
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h4a1 1 0 011 1v2"></path>
                    </svg>
                    High / Low:
                  </span>
                  <span class="font-medium">{{ currentWeather.temp_max }}° / {{ currentWeather.temp_min }}°</span>
                </div>
                <div class="flex justify-between items-center bg-white/10 rounded-lg p-3">
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"></path>
                    </svg>
                    Humidity:
                  </span>
                  <span class="font-medium">{{ currentWeather.humidity }}%</span>
                </div>
                <div class="flex justify-between items-center bg-white/10 rounded-lg p-3">
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                    Pressure:
                  </span>
                  <span class="font-medium">{{ currentWeather.pressure }} hPa</span>
                </div>
                <div class="flex justify-between items-center bg-white/10 rounded-lg p-3">
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    Visibility:
                  </span>
                  <span class="font-medium">{{ Math.round(currentWeather.visibility / 1000) }} km</span>
                </div>
              </div>
            </div>

            <!-- Wind & Sun -->
            <div class="space-y-4 animate-fadeInUp" style="animation-delay: 0.2s">
              <h3 class="text-xl font-semibold text-white mb-4 text-shadow">Wind & Sun</h3>
              <div class="space-y-3 text-purple-100">
                <div class="flex justify-between items-center bg-white/10 rounded-lg p-3">
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h4a1 1 0 011 1v2"></path>
                    </svg>
                    Wind Speed:
                  </span>
                  <span class="font-medium">{{ currentWeather.wind_speed }} m/s</span>
                </div>
                <div class="flex justify-between items-center bg-white/10 rounded-lg p-3">
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Wind Direction:
                  </span>
                  <span class="font-medium">{{ currentWeather.wind_deg }}°</span>
                </div>
                <div class="flex justify-between items-center bg-white/10 rounded-lg p-3">
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                    Sunrise:
                  </span>
                  <span class="font-medium">{{ weatherService.formatTime(currentWeather.sunrise) }}</span>
                </div>
                <div class="flex justify-between items-center bg-white/10 rounded-lg p-3">
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                    </svg>
                    Sunset:
                  </span>
                  <span class="font-medium">{{ weatherService.formatTime(currentWeather.sunset) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 5-Day Forecast -->
        <div class="glass-card rounded-2xl p-8 animate-fadeInUp" style="animation-delay: 0.3s">
          <h2 class="text-2xl font-bold text-white mb-6 text-shadow">5-Day Forecast</h2>
          
          <!-- Forecast Loading -->
          <div v-if="forecastLoading" class="flex justify-center items-center h-32">
            <div class="loading-spinner h-8 w-8"></div>
          </div>

          <!-- Forecast Error -->
          <div v-else-if="forecastError" class="text-center text-purple-200">
            <div class="bg-red-500/20 backdrop-blur-sm rounded-lg p-4 border border-red-400/30">
              <p class="mb-2">Unable to load 5-day forecast</p>
              <button 
                @click="fetchForecast" 
                class="btn-primary text-sm"
              >
                Try Again
              </button>
            </div>
          </div>

          <!-- Forecast Content -->
          <div v-else-if="forecast.length > 0" class="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div 
              v-for="(day, index) in forecast" 
              :key="day.dt"
              class="bg-white/10 rounded-xl p-4 text-center transition-all duration-300 hover:bg-white/20 hover:scale-105 animate-fadeInUp"
              :style="{ animationDelay: `${index * 0.1}s` }"
            >
              <p class="text-purple-100 text-sm mb-2 font-medium">
                {{ index === 0 ? 'Today' : weatherService.formatDate(day.dt) }}
              </p>
              <img 
                :src="weatherService.getWeatherIconUrl(day.weather[0].icon)" 
                :alt="day.weather[0].description"
                class="w-12 h-12 mx-auto mb-2 drop-shadow-lg"
              />
              <div class="text-white font-semibold text-lg">{{ day.main.temp_max }}°</div>
              <div class="text-purple-200 text-sm">{{ day.main.temp_min }}°</div>
              <p class="text-purple-200 text-xs mt-1 capitalize">{{ day.weather[0].description }}</p>
              <div class="text-purple-200 text-xs mt-1 flex items-center justify-center">
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"></path>
                </svg>
                {{ Math.round(day.pop * 100) }}% rain
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import weatherService, { type WeatherData, type ForecastData } from '../services/weatherService';

interface Props {
  cityId: string;
}

const props = defineProps<Props>();
const router = useRouter();

const currentWeather = ref<WeatherData | null>(null);
const forecast = ref<ForecastData[]>([]);
const loading = ref(false);
const forecastLoading = ref(false);
const error = ref<string | null>(null);
const forecastError = ref<string | null>(null);

const fetchWeatherData = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const cityId = parseInt(props.cityId);
    currentWeather.value = await weatherService.getCurrentWeather(cityId);
    await fetchForecast();
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to fetch weather data';
    console.error('Error fetching weather data:', err);
  } finally {
    loading.value = false;
  }
};

const fetchForecast = async () => {
  forecastLoading.value = true;
  forecastError.value = null;
  
  try {
    const cityId = parseInt(props.cityId);
    forecast.value = await weatherService.get5DayForecast(cityId);
  } catch (err) {
    forecastError.value = err instanceof Error ? err.message : 'Failed to fetch forecast data';
    console.error('Error fetching forecast data:', err);
  } finally {
    forecastLoading.value = false;
  }
};

const goBack = () => {
  router.push('/');
};

onMounted(() => {
  fetchWeatherData();
});
</script> 