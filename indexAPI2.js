document.addEventListener("DOMContentLoaded", function () {
    const weatherContainer = document.querySelector(".weather_container");
    const weatherVisualizer = document.querySelector(".weather_visualizer");
    const weatherText = document.querySelector(".weather_text");
    const weatherDetailsContainer = document.querySelector(".weather_detailscontainer");
    const apiKey = "b9faee0bd1e04c259117cb25d4ac3356";

    // Function to get weather data of the user's current location
    function getWeatherForCurrentLocation() {
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
            }, function () {
                displayError("Unable to retrieve your location.");
            });
        } else {
            displayError("Geolocation is not supported by this browser.");
        }
    }

    // Function to fetch weather data for given coordinates
    async function getWeatherDataByCoordinates(lat, lon) {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error("Could not fetch weather data");
        }

        return await response.json();
    }

    // Function to get weather data by city name
    async function getWeatherDataByCity(city) {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error("Could not fetch weather data");
        }

        return await response.json();
    }

    // Function to map weather conditions to icons
    function getWeatherIcon(condition) {
        const conditionIcons = {
            "clear sky": "/axd/logos_icons/weather_condition/clearSky.jpeg",
            "few clouds": "/axd/logos_icons/weather_condition/fewClouds.jpeg",
            "scattered clouds": "/axd/logos_icons/scatteredClouds.jpeg",
            "overcast clouds": "/axd/logos_icons/weather_condition/overcastClouds.jpg",
            "broken clouds": "/axd/logos_icons/weather_condition/brokenClouds.jpeg",
            "light intensity drizzle|drizzle|heavy intensity drizzle|light intensity drizzle rain|drizzle rain|heavy intensity drizzle rain|shower rain and drizzle|heavy shower rain and drizzle|shower drizzle" : "/axd/logos_icons/weather_condition/rain.jpeg",
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

    // Function to display weather information on the webpage
    function displayWeatherInfo(data) {
        const { name: city, sys: { country }, main: { temp, humidity, feels_like, pressure }, wind: { speed, deg }, weather, timezone } = data;
        const weatherCondition = weather[0].description; // Get the weather description

        // Get local date and time of the city
        const now = new Date(Date.now() + (timezone * 1000)); // Convert to milliseconds
        const formattedDate = now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
        const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }); // Adjust for timezone

        // Display city, country, date, and time
        const weatherCity = document.querySelector('.weather_city');
        const weatherDate = document.querySelector('.weather_date');
        const weatherTime = document.querySelector('.weather_time');
        const weatherDegrees = document.querySelector('.weather_degrees');
        const weatherVisualizer = document.querySelector('.weather_visualizer'); // Get weather icon element

        weatherCity.innerHTML = `${city}, ${country}`;
        weatherDate.innerHTML = formattedDate;
        weatherTime.innerHTML = formattedTime;

        // Display temperature
        const celsiusTemp = Math.round((temp - 273.15).toFixed(1));
        weatherDegrees.innerHTML = `${celsiusTemp}°C`;

        // Set weather icon dynamically
        weatherVisualizer.src = getWeatherIcon(weatherCondition);

        // Display weather details
        const feels_like_celsius = Math.round((feels_like - 273.15).toFixed(1));
        weatherDetailsContainer.innerHTML = `<p>Humidity: ${humidity}%</p>
                                             <p>Feels like: ${feels_like_celsius}°C</p>
                                             <p>Pressure: ${pressure}hPa</p>
                                             <p>Wind: ${speed} m/s at ${deg}°</p>
                                             <p>Weather: ${weatherCondition}</p>`;

        // Display hourly temperature chart
        const cityForHourly = city; // Using the same city for hourly temperature data
        fetchAndDisplayHourlyTemperature(cityForHourly);
    }

    async function fetchAndDisplayHourlyTemperature(city) {
        try {
            const hourlyTemperatures = await fetchHourlyTemperatureData(city);
            if (hourlyTemperatures) {
                displayHourlyTemperatureChart(hourlyTemperatures);
            } else {
                console.error("Failed to fetch hourly temperature data.");
            }
        } catch (error) {
            console.error("Error fetching hourly temperature data:", error);
        }
    }

    async function fetchHourlyTemperatureData(city) {
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            // Extract hourly temperature data from the API response
            const hourlyTemperatures = data.list.map(hour => hour.main.temp);
            return hourlyTemperatures;
        } catch (error) {
            console.error("Error fetching hourly temperature data:", error);
            return null;
        }
    }


    function getCurrentHourLabels() {
        const currentHour = new Date().getHours(); // Get the current hour
        const labels = [];
        for (let i = 0; i < 12; i++) {
            const hour = (currentHour + i) % 24; // Calculate the hour modulo 24 to handle wrapping around midnight
            labels.push(hour + 'h'); // Push the hour label to the array
        }
        return labels;
    }

    function displayHourlyTemperatureChart(hourlyTemperatures) {
        // Convert hourly temperatures from Kelvin to Celsius
        const hourlyTemperaturesCelsius = hourlyTemperatures.map(temp => Math.round((temp - 273.15).toFixed(1)));
        
        const box1 = document.getElementById('box1');
        const canvas = document.createElement('canvas');
        canvas.id = 'hourlyChart';
        canvas.width = 100; // Adjust width as needed
        canvas.height = 50; // Adjust height as needed
        box1.innerHTML = ''; // Clear existing content
        box1.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: getCurrentHourLabels(),
                datasets: [{
                    label: 'Hourly Temperature',
                    data: hourlyTemperaturesCelsius, 
                    fill: true,
                    borderColor: 'rgb(15, 178, 196)',
                    tension: 0.1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: false, // Adjust as needed
                        title: {
                            display: true,
                            text: 'Temperature (°C)', // Y-axis label
                            font: {
                                size: 14
                            }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Hour of the Day', // X-axis label
                            font: {
                                size: 14
                            }
                        }
                    }
                }
            }
        });
    }
    
    
    
    
    // Function to display error messages on the webpage
    function displayError(message) {
        weatherContainer.innerHTML = `<p class="error">${message}</p>`;
    }

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

    // Call the function to get weather for the user's current location when the page loads
    getWeatherForCurrentLocation();

    //hola mundo

    // aja , si 
    //como te va 
    // mejor me voy
    //dormi mal
});