// Initialize AOS
AOS.init({
    duration: 1000,  // Animation duration
    once: true,  // Animation should happen only once - while scrolling down
    mirror: false  // Whether elements should animate out while scrolling past them
});

const apiKey = '524e7639f7db962d50b175dc66132873'; // OpenWeatherMap API key
let isCelsius = true; // Temperature unit state

function fetchWeatherByCoords(lat, lon) {
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            updateWeatherDisplay(data);
        })
        .catch(error => {
            alert('sorry Unable to retrieve weather data at the moment.');
        });
}

function fetchWeather(city = 'London') {
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            updateWeatherDisplay(data);
        })
        .catch(error => {
            alert('City not found. Please try again.');
        });
}

function updateWeatherDisplay(data) {
    const { main, weather, wind, sys, name, dt } = data;
    const temp = isCelsius ? main.temp : (main.temp * 9/5) + 32;
    const currentTime = new Date(dt * 1000).toLocaleTimeString(); // Convert UNIX timestamp to time

    document.getElementById('weather').innerHTML = `
        <h3>${name}</h3>
        <img src="https://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="${weather[0].description}">
        <p>Temperature: ${Math.round(temp)}°${isCelsius ? 'C' : 'F'}</p>
        <p id="current-time">Time: ${currentTime}</p>
    `;

    // Update additional info
    document.getElementById('wind-speed').innerText = `Wind Speed: ${wind.speed} m/s`;
    document.getElementById('humidity').innerText = `Humidity: ${main.humidity} %`;
    document.getElementById('sunrise').innerText = `Sunrise: ${new Date(sys.sunrise * 1000).toLocaleTimeString()}`;
    document.getElementById('sunset').innerText = `Sunset: ${new Date(sys.sunset * 1000).toLocaleTimeString()}`;

    // Change background based on weather
    changeBackground(weather[0].main);
}

function changeBackground(weatherCondition) {
    const currentSection = document.getElementById('current');
    let backgroundImage = '';

    switch (weatherCondition) {
        case 'Clear':
            backgroundImage = 'url("./photos/clear.jpg")';
            break;
        case 'Clouds':
            backgroundImage = 'url("./photos/clouds.jpg")';
            break;
        case 'Rain':
            backgroundImage = 'url("./photos/rain.jpg")';
            break;
        case 'Snow':
            backgroundImage = 'url("./photos/snowy.jpg")';
            break;
        case 'Drizzle':
            backgroundImage = 'url("./photos/drizzles.jpg")';
            break;
        case 'Thunderstorm':
            backgroundImage = 'url("./photos/thunder.jpg")';
            break;
        default:
            backgroundImage = 'url("./photos/default.jpg")';
            break;
    }
    currentSection.style.backgroundImage = backgroundImage;
}

document.getElementById('search').addEventListener('click', () => {
    const city = document.getElementById('city').value;
    fetchWeather(city);
});

document.getElementById('toggle-temp').addEventListener('click', () => {
    isCelsius = !isCelsius;
    document.getElementById('toggle-temp').innerText = `Convert to °${isCelsius ? 'F' : 'C'}`;
    const tempElement = document.querySelector('.weather-box p');
    const tempText = tempElement.innerText;
    const tempValue = parseFloat(tempText.match(/-?\d+(\.\d+)?/)[0]);
    const newTemp = isCelsius ? (tempValue - 32) * 5/9 : (tempValue * 9/5) + 32;
    tempElement.innerText = `Temperature: ${Math.round(newTemp)}°${isCelsius ? 'C' : 'F'}`;
});

// Handle burger menu
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

burger.addEventListener('click', () => {
    nav.classList.toggle('active');
});

// Get user's location
navigator.geolocation.getCurrentPosition(position => {
    fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
}, () => {
    fetchWeather(); // Fallback to default city
});

document.getElementById('fiveDayForecastLink').addEventListener('click', () => {
    const city = document.getElementById('city').value || 'London';  // Use 'London' if no city entered
    window.location.href = `forecast.html?city=${city}`;
});


let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

function showSlide(index) {
    const slider = document.querySelector('.about-slider');
    slider.style.transform = `translateX(-${index * 100}%)`;
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}

// Auto-slide every 3 seconds
setInterval(nextSlide, 3000);


