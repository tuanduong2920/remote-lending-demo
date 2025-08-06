<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="text-center mb-8 animate-fadeInUp">
        <h1 class="text-4xl md:text-5xl font-bold text-white mb-2 text-shadow-lg">Weather App</h1>
        <p class="text-blue-100 text-lg md:text-xl">Current weather conditions around the world</p>
      </div>

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

      <!-- Weather Cards Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div 
          v-for="(weather, index) in weatherData" 
          :key="weather.id"
          @click="goToDetail(weather.id)"
          class="weather-card animate-fadeInUp"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <!-- City Info -->
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-xl font-semibold text-white text-shadow">{{ weather.name }}</h3>
              <p class="text-blue-100 text-sm">{{ weather.country }}</p>
            </div>
            <img 
              :src="weatherService.getWeatherIconUrl(weather.icon)" 
              :alt="weather.description"
              class="w-12 h-12 drop-shadow-lg"
            />
          </div>

          <!-- Temperature -->
          <div class="mb-4">
            <div class="text-3xl font-bold text-white text-shadow-lg">{{ weather.temp }}°C</div>
            <p class="text-blue-100 text-sm capitalize">{{ weather.description }}</p>
          </div>

          <!-- Additional Info -->
          <div class="space-y-2 text-sm text-blue-100">
            <div class="flex justify-between items-center">
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h4a1 1 0 011 1v2m-6 4a2 2 0 100 4m0-4a2 2 0 000 4m6-4a2 2 0 100 4m0-4a2 2 0 000 4"></path>
                </svg>
                Feels like:
              </span>
              <span class="font-medium">{{ weather.feels_like }}°C</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"></path>
                </svg>
                Humidity:
              </span>
              <span class="font-medium">{{ weather.humidity }}%</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h4a1 1 0 011 1v2"></path>
                </svg>
                Wind:
              </span>
              <span class="font-medium">{{ weather.wind_speed }} m/s</span>
            </div>
          </div>

          <!-- View Details Button -->
          <div class="mt-4 pt-4 border-t border-white/20">
            <span class="text-white text-sm font-medium flex items-center justify-center">
              Click for 5-day forecast 
              <svg class="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </span>
          </div>
        </div>
      </div>

      <!-- Refresh Button -->
      <div class="text-center mt-12 animate-fadeInUp" style="animation-delay: 0.5s">
        <button 
          @click="fetchWeatherData"
          :disabled="loading"
          class="btn-primary group"
        >
          <span v-if="loading" class="flex items-center">
            <div class="loading-spinner w-4 h-4 mr-2"></div>
            Loading...
          </span>
          <span v-else class="flex items-center">
            <svg class="w-5 h-5 mr-2 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Refresh Data
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import weatherService, { type WeatherData } from '../services/weatherService';

const router = useRouter();
const weatherData = ref<WeatherData[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const fetchWeatherData = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    weatherData.value = await weatherService.getMultipleCitiesWeather();
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to fetch weather data';
    console.error('Error fetching weather data:', err);
  } finally {
    loading.value = false;
  }
};

const goToDetail = (cityId: number) => {
  router.push(`/detail/${cityId}`);
};

onMounted(() => {
  fetchWeatherData();
});
</script> 