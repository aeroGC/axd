// Function to display weather information on the webpage
function displayWeatherInfo(data) {
    const { name: city, sys: { country }, main: { temp, temp_min, temp_max, humidity, feels_like, pressure }, wind: { speed, deg }, weather, timezone } = data;
    const weatherCondition = weather[0].description; // Get the weather description
    const iconCode = weather[0].icon; //Get the weather condition icon

    // Get local date and time of the city
    const now = new Date(Date.now() + (timezone * 1000)); // Convert to milliseconds
    const formattedDate = now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }); // Adjust for timezone

    // Display city, country, date, and time
    const weatherCity = document.querySelector('.weather_city');
    const weatherDate = document.querySelector('.weather_date');
    const weatherTime = document.querySelector('.weather_time');
    const weatherDegrees = document.querySelector('.weather_degrees');
    const weatherVisualizer = document.querySelector('.weather_visualizer'); // Get weather icon background element
    const weatherIcon = document.querySelector('.weather_icon'); // Get weather condition icon

    weatherCity.innerHTML = `${city}, ${country}`;

    const celsiusTemp_max = Math.round((temp_max - 273.15).toFixed(1));
    const celsiusTemp_min = Math.round((temp_min - 273.15).toFixed(1));
    weatherDate.innerHTML = formattedDate;
    weatherTime.innerHTML = formattedTime;

    // Display temperature
    const celsiusTemp = Math.round((temp - 273.15).toFixed(1));
    weatherDegrees.innerHTML = `${celsiusTemp}°C`;

    //Fetch the weather icon information
    weatherIcon.src = `http://openweathermap.org/img/wn/${iconCode}@2x.png`; // Using 2x size for better resolution

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
                                         <p>Max/Min: ${celsiusTemp_max}°/${celsiusTemp_min}°</p>`;

    // Display hourly temperature chart
    fetchAndDisplayHourlyTemperature(city);
}

async function fetchAndDisplayHourlyTemperature(city) {
    try {
        const hourlyData = await fetchHourlyTemperatureData(city);
        if (hourlyData) {
            displayHourlyTemperatureChart(hourlyData);
        } else {
            console.error("Failed to fetch the correct amount of hourly temperature data.");
        }
    } catch (error) {
        console.error("Error fetching hourly temperature data:", error);
    }
}


function displayHourlyTemperatureChart(hourlyData) {
    const hourlyTemperaturesCelsius = hourlyData.map(data => Math.round(data.temp - 273.15));
    const labels = getCurrentHourLabels(hourlyData);

    const box1 = document.getElementById('box1');
    const canvas = document.createElement('canvas');
    canvas.id = 'hourlyChart';
    canvas.width = 500; // Adjust width as needed
    canvas.height = 200; // Adjust height as needed
    box1.innerHTML = ''; // Clear existing content
    box1.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '48-hour Temperature',
                data: hourlyTemperaturesCelsius,
                fill: true,
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Light blue fill
                borderColor: 'rgba(75, 192, 192, 1)', // Blue border
                borderWidth: 2, // Width of the line
                tension: 0.4, // Smoothing of the line
                pointBackgroundColor: 'rgba(75, 192, 192, 1)', // Color of the points
                pointBorderColor: '#fff', // Border color of the points
                pointHoverBackgroundColor: '#fff', // Color of the points when hovered
                pointHoverBorderColor: 'rgba(75, 192, 192, 1)' // Border color of the points when hovered
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
                    },
                    ticks: {
                        autoSkip: false, // Ensure that all labels are displayed
                        maxRotation: 0, // No rotation for labels
                        minRotation: 0 // No rotation for labels
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        font: {
                            size: 12,
                            family: 'Arial, sans-serif'
                        },
                        color: '#333' // Legend text color
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Tooltip background color
                    titleFont: {
                        size: 14,
                        family: 'Arial, sans-serif'
                    },
                    bodyFont: {
                        size: 12,
                        family: 'Arial, sans-serif'
                    },
                    bodySpacing: 4,
                    padding: 10,
                    cornerRadius: 4
                }
            }
        }
    });
}
