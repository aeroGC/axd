// Function to map weather conditions to icons
function getWeatherIcon(condition) {
    const conditionIcons = {
        "clear sky": "/axd/logos_icons/weather_condition/clearSky.jpeg",
        "few clouds": "/axd/logos_icons/weather_condition/fewClouds.jpeg",
        "scattered clouds": "/axd/logos_icons/weather_condition/scatteredClouds.jpeg",
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

// Function to get the time of the city and display it on the chart.
function getCurrentHourLabels(hourlyData) {
    const labels = hourlyData.map(data => {
        const date = new Date(data.time * 1000); // Convert to milliseconds
        const hours = date.getUTCHours(); // Get the hour in 24-hour format (UTC)
        return `${hours}h`;
    });
    return labels;
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

// Funciones existentes para obtener y mostrar el clima
async function getWeatherDataByCity(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
        throw new Error("Could not fetch weather data");
    }

    return await response.json();

    //lol
}


function initializeAutocomplete() {
    const cityInput = document.querySelector(".cityInput");
    const suggestions = document.querySelector(".suggestions");

    const autocomplete = new google.maps.places.Autocomplete(cityInput, {
        types: ['(cities)']
    });

    autocomplete.addListener('place_changed', function () {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
            console.log("No details available for input: '" + place.name + "'");
            return;
        }
        // Clear the existing suggestions
        suggestions.innerHTML = '';
        // Display the selected place
        cityInput.value = place.name; 
        getWeatherDataByCity(place.name); // Call function to get weather
    });

    cityInput.addEventListener('input', function () {
        if (cityInput.value.length < 3) {
            suggestions.innerHTML = ''; // Clear suggestions if input is less than 3 characters
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    initializeAutocomplete();
});
