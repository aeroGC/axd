const cityInput = document.querySelector(".cityInput");
const suggestions = document.querySelector(".suggestions");

// Function to map weather conditions to icons
function getWeatherIcon(condition) {
    const conditionIcons = {
        "clear sky": "/axd/logos_icons/weather_condition/clearSky.jpeg",
        "few clouds": "/axd/logos_icons/weather_condition/fewClouds.jpeg",
        "scattered clouds": "axd/logos_icons/weather_condition/scatteredClouds.jpeg",
        "overcast clouds": "/axd/logos_icons/weather_condition/overcastClouds.jpg",
        "broken clouds": "/axd/logos_icons/weather_condition/brokenClouds.jpeg",
        "light intensity drizzle|drizzle|heavy intensity drizzle|light intensity drizzle rain|drizzle rain|heavy intensity drizzle rain|shower rain and drizzle|heavy shower rain and drizzle|shower drizzle": "/axd/logos_icons/weather_condition/rain.jpeg",
        "light rain|moderate rain|heavy intensity rain|very heavy rain|extreme rain|freezing rain|light intensity shower rain|shower rain|heavy intensity shower rain|ragged shower rain": "/axd/logos_icons/weather_condition/rain.jpeg",
        "thunderstorm with light rain|thunderstorm with rain|thunderstorm with heavy rain|light thunderstorm|thunderstorm|heavy thunderstorm|ragged thunderstorm|thunderstorm with light drizzle|thunderstorm with drizzle|thunderstorm with heavy drizzle": "/axd/logos_icons/weather_condition/thunderstorm.jpeg",
        "light snow|snow|heavy snow|sleet|light shower sleet|shower sleet|light rain and snow|rain and snow|light shower snow|shower snow|heavy shower snow": "/axd/logos_icons/weather_condition/snow.jpeg",
        "mist|smoke|haze|fog": "/axd/logos_icons/weather_condition/mist.jpg",
        "sand/dust whirls|sand|dust": "/axd/logos_icons/weather_condition/sand.jpeg",
        "volcanic ash": "/axd/logos_icons/weather_condition/volcanicAsh.jpeg",
        "squalls|tornado": "/axd/logos_icons/weather_condition/tornado.jpeg"
    };
    const conditionKey = condition.toLowerCase();
    for (const key in conditionIcons) {
        if (key.includes(conditionKey)) {
            return conditionIcons[key];
        }
    }
}

// Function to get current hour labels
function getCurrentHourLabels() {
    const currentHour = new Date().getHours(); // Get the current hour
    const labels = [];
    for (let i = 0; i < 12; i++) {
        const hour = (currentHour + i) % 24; // Calculate the hour modulo 24 to handle wrapping around midnight
        labels.push(hour + 'h'); // Push the hour label to the array
    }
    return labels;
}

// Función para obtener sugerencias de lugares
async function getSuggestions(query) {
    const apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
        throw new Error("No se pudieron obtener las sugerencias");
    }

    return await response.json();
}

// Mostrar sugerencias debajo del campo de entrada
async function showSuggestions(suggestionsData) {
    suggestions.innerHTML = '';
    // Fetch full country names
    const countries = await fetchCountryNames();
    suggestionsData.forEach(location => {
        const suggestionItem = document.createElement('li');
        const countryFullName = countries[location.country] || location.country; // Use full country name if available, otherwise use country code
        const suggestionText = `${location.name}, ${countryFullName}`;
        suggestionItem.textContent = suggestionText;
        suggestionItem.title = suggestionText; // Set title attribute to display full text on hover
        suggestionItem.addEventListener('click', () => {
            cityInput.value = suggestionText; // Set input value to the complete suggestion
            suggestions.innerHTML = ''; // Clear suggestions
            getWeatherDataByCity(location.name); // Call function to get weather
        });
        suggestions.appendChild(suggestionItem);
    });
}

// Function to fetch full country names
async function fetchCountryNames() {
    const response = await fetch('https://restcountries.com/v3.1/all');
    if (!response.ok) {
        throw new Error('Failed to fetch country data');
    }
    const countriesData = await response.json();
    const countries = {};
    countriesData.forEach(country => {
        if (country.cca2) {
            countries[country.cca2] = country.name.common;
        }
    });
    return countries;
}


// Event listener para el campo de entrada
cityInput.addEventListener('input', async function () {
    const query = cityInput.value;
    if (query.length >= 3) {
        try {
            const suggestionsData = await getSuggestions(query);
            showSuggestions(suggestionsData);
        } catch (error) {
            console.error(error);
        }
    } else {
        suggestions.innerHTML = '';
    }
});

// Funciones existentes para obtener y mostrar el clima
async function getWeatherDataByCity(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
        throw new Error("Could not fetch weather data");
    }

    return await response.json();
}