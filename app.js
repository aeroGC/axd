document.addEventListener("DOMContentLoaded", function () {
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

    function initEventListeners() {
        const searchBar = document.querySelector(".searchBar");
        searchBar.addEventListener("submit", async function (event) {
            event.preventDefault();
            const city = document.querySelector(".cityInput").value;
            if (city) {
                try {
                    const weatherData = await getWeatherDataByCity(city);
                    displayWeatherInfo(weatherData);

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
            } else {
                displayError("Please enter a city");
            }
        });

        const locationButton = document.querySelector(".locationButton");
        locationButton.addEventListener("click", function () {
            getWeatherForCurrentLocation();
        });
    }

    getWeatherForCurrentLocation();
    initEventListeners();
});
