// Function to display weather information on the webpage
function displayWeatherInfo(data) {
    const { name: city, sys: { country }, main: { temp, temp_min, temp_max, humidity, feels_like, pressure }, wind: { speed, deg }, weather, timezone,} = data;
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
    const weatherMax = document.querySelector(`.weather_minmax`)
    const weatherVisualizer = document.querySelector('.weather_visualizer'); // Get weather icon element

    weatherCity.innerHTML = `${city}, ${country}`;

    const celsiusTemp_max = Math.round((temp_max - 273.15).toFixed(1))
    const celsiusTemp_min = Math.round((temp_min - 273.15).toFixed(1))
    weatherDate.innerHTML = formattedDate;
    weatherTime.innerHTML = formattedTime;

    // Display temperature
    const celsiusTemp = Math.round((temp - 273.15).toFixed(1));
    weatherDegrees.innerHTML = `${celsiusTemp}°C`;

    // Set weather icon dynamically
    weatherVisualizer.src = getWeatherIcon(weatherCondition);

    // Display weather details
    const feels_like_celsius = Math.round((feels_like - 273.15).toFixed(1));
    const weatherDetailsContainer = document.querySelector('.weather_detailscontainer');
    weatherDetailsContainer.innerHTML = `<p>Humidity: ${humidity}%</p>
                                         <p>Feels like: ${feels_like_celsius}°C</p>
                                         <p>Pressure: ${pressure} hPa</p>
                                         <p>Wind: ${speed} m/s at ${deg}°</p>
                                         <p>Weather: ${weatherCondition}</p>
                                         <p>Max/Min: ${celsiusTemp_max}°/${celsiusTemp_min}°`;

    // Display hourly temperature chart
    fetchAndDisplayHourlyTemperature(city);
}

// Function to fetch and display hourly temperature data
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



// Function to display hourly temperature chart
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
    new Chart(ctx, {
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
