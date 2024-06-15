document.addEventListener("DOMContentLoaded", function () {
    // Function to get weather data of the user's current location
    async function getWeatherForCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async function (position) {
                const { latitude, longitude } = position.coords;
                try {
                    const weatherData = await getWeatherDataByCoordinates(latitude, longitude);
                    displayWeatherInfo(weatherData);
                } catch (error) {
                    console.error(error);
                    displayError("Could not fetch weather data. Please try again later.");
                }
            });
        } else {
            displayError("Geolocation is not supported by this browser.");
        }
    }
    

    // Function to initialize event listeners
    function initEventListeners() {
        // Event listener for manual city search
        const searchBar = document.querySelector(".searchBar");
        searchBar.addEventListener("submit", async function (event) {
            event.preventDefault();
            const city = document.querySelector(".cityInput").value;
            if (city) {
                try {
                    const weatherData = await getWeatherDataByCity(city);
                    displayWeatherInfo(weatherData);
                } catch (error) {
                    console.error(error);
                    displayError("Could not fetch weather data. Please try again later.");
                }
            } else {
                displayError("Please enter a city");
            }
        });

        // Event listener for current location button
        const locationButton = document.querySelector(".locationButton");
        locationButton.addEventListener("click", function () {
            getWeatherForCurrentLocation();
        });
    }

    // Call the function to get weather for the user's current location when the page loads
    getWeatherForCurrentLocation();
    initEventListeners();
});
