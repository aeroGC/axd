document.addEventListener("DOMContentLoaded", function () {
    const cityInput = document.querySelector(".cityInput");
    const suggestionsList = document.querySelector(".suggestions");
    const locationButton = document.querySelector(".locationButton");

    async function getWeatherForCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async function (position) {
                const { latitude, longitude } = position.coords;
                try {
                    const weatherData = await getWeatherDataByCoordinates(latitude, longitude);
                    displayWeatherInfo(weatherData);

                    const city = weatherData.name; // Extract city name
                    const dailyForecast = await getDailyForecast(city);
                    if (dailyForecast) {
                        displayDailyForecast(dailyForecast);
                    } else {
                        displayError("Could not fetch daily forecast. Please try again later.");
                    }
                } catch (error) {
                    console.error(error);
                    displayError("Could not fetch weather data. Please try again later.");
                }
            });
        } else {
            displayError("Geolocation is not supported by this browser.");
        }
    }

    async function fetchCities(query) {
        try {
            const response = await fetch('/axd/city.list.json');
            const cities = await response.json();
            return cities.filter(city => city.name.toLowerCase().startsWith(query.toLowerCase()));
        } catch (error) {
            console.error("Error fetching cities:", error);
            return [];
        }
    }
    
    function renderSuggestions(citySuggestions) {
        suggestionsList.innerHTML = ''; // Clear previous suggestions

        citySuggestions.forEach(suggestion => {
            const listItem = document.createElement('li');
            listItem.textContent = `${suggestion.name}, ${suggestion.state ? suggestion.state + ', ' : ''}${suggestion.country}`;
            listItem.addEventListener('click', () => {
                cityInput.value = listItem.textContent;
                suggestionsList.innerHTML = '';
                fetchWeatherByCityID(suggestion.id);
            });
            suggestionsList.appendChild(listItem);
        });
    }

    async function fetchWeatherByCityID(cityID) {
        try {
            const weatherData = await getWeatherDataByCityID(cityID);
            displayWeatherInfo(weatherData);
        } catch (error) {
            console.error(error);
            displayError("Could not fetch weather data. Please try again later.");
        }
    }

    function initializeAutocomplete() {
        cityInput.addEventListener('input', async function () {
            const query = cityInput.value.trim();
            if (query.length >= 3) {
                const citySuggestions = await fetchCities(query);
                renderSuggestions(citySuggestions);
            } else {
                suggestionsList.innerHTML = '';
            }
        });
    }

    locationButton.addEventListener('click', function () {
        getWeatherForCurrentLocation();
    });

    initializeAutocomplete();
    getWeatherForCurrentLocation();
    initEventListeners();
});
