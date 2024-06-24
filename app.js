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
            const filteredCities = cities.filter(city => city.name.toLowerCase().includes(query.toLowerCase()));

            filteredCities.sort((a, b) => {
                const nameA = a.name.toLowerCase();
                const nameB = b.name.toLowerCase();
                if (nameA.startsWith(query.toLowerCase()) && !nameB.startsWith(query.toLowerCase())) {
                    return -1;
                }
                if (!nameA.startsWith(query.toLowerCase()) && nameB.startsWith(query.toLowerCase())) {
                    return 1;
                }
                return nameA.localeCompare(nameB);
            });

            const uniqueCities = [];
            const cityNames = new Set();
            for (const city of filteredCities) {
                if (!cityNames.has(city.name)) {
                    uniqueCities.push(city);
                    cityNames.add(city.name);
                }
            }

            return uniqueCities.slice(0, 10);
        } catch (error) {
            console.error("Error fetching cities:", error);
            return [];
        }
    }

    function renderSuggestions(citySuggestions) {
        const fragment = document.createDocumentFragment();
        suggestionsList.innerHTML = '';

        citySuggestions.forEach(suggestion => {
            const listItem = document.createElement('li');
            listItem.textContent = `${suggestion.name}, ${suggestion.state ? suggestion.state + ', ' : ''}${suggestion.country}`;
            listItem.addEventListener('click', () => {
                cityInput.value = listItem.textContent;
                suggestionsList.innerHTML = '';
                fetchWeatherByCityID(suggestion.id);
            });
            fragment.appendChild(listItem);
        });

        suggestionsList.appendChild(fragment);
    }

    async function fetchWeatherByCityID(cityID) {
        try {
            const weatherData = await getWeatherDataByCityID(cityID);
            displayWeatherInfo(weatherData);
            
            // Fetch and display the 5-day forecast
            const city = weatherData.name;
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
    }

    function initializeAutocomplete() {
        cityInput.addEventListener('input', debounce(async function () {
            const query = cityInput.value.trim();
            if (query.length >= 3) {
                const citySuggestions = await fetchCities(query);
                renderSuggestions(citySuggestions);
            } else {
                suggestionsList.innerHTML = '';
            }
        }, 300));

        // Select all text on focus
        cityInput.addEventListener('focus', function () {
            cityInput.select();
        });
    }

    locationButton.addEventListener('click', function () {
        cityInput.value=``;
        suggestionsList.innerHTML = ``;
        getWeatherForCurrentLocation();
    });

    initializeAutocomplete();
    getWeatherForCurrentLocation();
    initEventListeners();
});
