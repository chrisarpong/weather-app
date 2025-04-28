// Weather App with WeatherAPI.com
const API_KEY = 'f7dae6db73b740f0ab0205316252804'; // Replace with your key
const BASE_URL = 'https://api.weatherapi.com/v1';

// DOM Elements
const elements = {
    searchInput: document.getElementById('search-input'),
    searchBtn: document.getElementById('search-btn'),
    city: document.getElementById('city'),
    country: document.getElementById('country'),
    localTime: document.getElementById('local-time'),
    temperature: document.getElementById('temperature'),
    weatherIcon: document.getElementById('weather-icon'),
    weatherDesc: document.getElementById('weather-description'),
    humidity: document.getElementById('humidity'),
    wind: document.getElementById('wind'),
    visibility: document.getElementById('visibility'),
    forecastContainer: document.getElementById('forecast-container'),
    themeBtn: document.getElementById('theme-btn'),
    notification: document.getElementById('notification'),
    celsius: document.getElementById('celsius'),
    fahrenheit: document.getElementById('fahrenheit')
};

// State
let currentData = null;
let isDarkMode = false;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set default city
    fetchWeather('London');
    
    // Event listeners
    elements.searchBtn.addEventListener('click', () => {
        const location = elements.searchInput.value.trim();
        if (location) fetchWeather(location);
    });
    
    elements.searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && elements.searchInput.value.trim()) {
            fetchWeather(elements.searchInput.value.trim());
        }
    });
    
    elements.themeBtn.addEventListener('click', toggleTheme);
    elements.celsius.addEventListener('click', () => toggleUnit('celsius'));
    elements.fahrenheit.addEventListener('click', () => toggleUnit('fahrenheit'));
});

// Fetch weather data
async function fetchWeather(location) {
    try {
        const response = await fetch(`${BASE_URL}/forecast.json?key=${API_KEY}&q=${location}&days=3`);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Failed to fetch weather data');
        }
        
        const data = await response.json();
        currentData = data;
        updateUI(data);
        updateBackground(data.current.is_day);
        showNotification(`Weather data for ${data.location.name} loaded`);
        
    } catch (error) {
        showNotification(error.message, true);
        console.error('Error:', error);
    }
}

// Update UI with weather data
function updateUI(data) {
    const { location, current, forecast } = data;
    
    // Location
    elements.city.textContent = location.name;
    elements.country.textContent = location.country;
    elements.localTime.textContent = new Date(location.localtime).toLocaleString();
    
    // Current weather
    elements.temperature.textContent = current.temp_c;
    elements.weatherIcon.src = current.condition.icon;
    elements.weatherIcon.alt = current.condition.text;
    elements.weatherDesc.textContent = current.condition.text;
    elements.humidity.textContent = current.humidity;
    elements.wind.textContent = current.wind_kph;
    elements.visibility.textContent = current.vis_km;
    
    // Forecast
    elements.forecastContainer.innerHTML = '';
    forecast.forecastday.forEach(day => {
        const forecastDay = document.createElement('div');
        forecastDay.className = 'forecast-day animate__animated animate__fadeIn';
        forecastDay.innerHTML = `
            <p>${new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}</p>
            <img src="${day.day.condition.icon}" alt="${day.day.condition.text}">
            <p>${day.day.maxtemp_c}° / ${day.day.mintemp_c}°</p>
        `;
        elements.forecastContainer.appendChild(forecastDay);
    });
}

// Update background based on day/night
function updateBackground(isDay) {
    if (isDay) {
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');
    } else {
        document.body.classList.remove('light-mode');
        document.body.classList.add('dark-mode');
    }
}

// Toggle dark/light theme
function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode', isDarkMode);
    document.body.classList.toggle('light-mode', !isDarkMode);
    
    // Update icon
    elements.themeBtn.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

// Toggle temperature unit
function toggleUnit(unit) {
    if (!currentData) return;
    
    if (unit === 'celsius' && !elements.celsius.classList.contains('active')) {
        elements.temperature.textContent = currentData.current.temp_c;
        elements.celsius.classList.add('active');
        elements.fahrenheit.classList.remove('active');
    } else if (unit === 'fahrenheit' && !elements.fahrenheit.classList.contains('active')) {
        elements.temperature.textContent = currentData.current.temp_f;
        elements.fahrenheit.classList.add('active');
        elements.celsius.classList.remove('active');
    }
}

// Show notification
function showNotification(message, isError = false) {
    elements.notification.textContent = message;
    elements.notification.style.backgroundColor = isError ? '#ff4444' : '#333';
    elements.notification.classList.add('show');
    
    setTimeout(() => {
        elements.notification.classList.remove('show');
    }, 3000);
}