async function displayWeatherInfo(data) {
    const { name: city, id: cityID, sys: { country }, main: { temp, temp_min, temp_max, humidity, feels_like, pressure }, wind: { speed, deg }, weather, coord: { lon, lat }, timezone } = data;
    const weatherCondition = weather[0].description; // Get the weather description
    const iconCode = weather[0].icon; // Get the weather condition icon

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
    const weatherOverviewElement = document.querySelector('.weather_overview'); // Get weather overview element

    weatherCity.innerHTML = `${city}, ${country}`;

    const celsiusTemp_max = Math.round((temp_max - 273.15).toFixed(1));
    const celsiusTemp_min = Math.round((temp_min - 273.15).toFixed(1));
    weatherDate.innerHTML = formattedDate;
    weatherTime.innerHTML = formattedTime;

    // Display temperature
    const celsiusTemp = Math.round((temp - 273.15).toFixed(1));
    weatherDegrees.innerHTML = `${celsiusTemp}°C`;

    // Fetch the weather icon information
    weatherIcon.src = `http://openweathermap.org/img/wn/${iconCode}@2x.png`; // Using 2x size for better resolution

    // Set weather icon dynamically
    weatherVisualizer.src = getWeatherIcon(weatherCondition);

    // Display weather details
    const feels_like_celsius = Math.round((feels_like - 273.15).toFixed(1));

    // Humidity
    const weatherDetail = document.querySelector(`.humidity_detail`);
    weatherDetail.innerHTML = `Humidity: ${humidity}%`;
    // Feels Like
    const feelsLikeDetail = document.querySelector('.feels_like_detail');
    feelsLikeDetail.innerHTML = `Feels Like: ${feels_like_celsius}°C`;

    // Max/Min
    const maxMinDetail = document.querySelector('.max_min_detail');
    maxMinDetail.innerHTML = `Max/Min: ${celsiusTemp_max}°/${celsiusTemp_min}°`;

    // Box 3 Details
    
    // Fetch and display the weather overview
    const weatherOverviewData = await getWeatherOverview(lat, lon, apiKey);
    if (weatherOverviewData) {
        weatherOverviewElement.innerHTML = weatherOverviewData.weather_overview;
    } else {
        weatherOverviewElement.innerHTML = 'Could not fetch the weather overview.';
    }

    async function fetchAndDisplaySunMoonTimes(lat, lon, timezoneOffset) {
        const sunMoonData = await getSunMoonTimes(lat, lon);
        if (sunMoonData) {
            const convertToCityTime = (utcSeconds) => {
                // Apply the timezone offset correctly
                return new Date((utcSeconds + timezoneOffset - 7200) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            };
    
            const sunriseTime = convertToCityTime(sunMoonData.daily[0].sunrise);
            const sunsetTime = convertToCityTime(sunMoonData.daily[0].sunset);
            const moonriseTime = convertToCityTime(sunMoonData.daily[0].moonrise);
            const moonsetTime = convertToCityTime(sunMoonData.daily[0].moonset);
    
            document.querySelector('.sunrise_time').innerHTML = sunriseTime;
            document.querySelector('.sunset_time').innerHTML = sunsetTime;
            document.querySelector('.moonrise_time').innerHTML = moonriseTime;
            document.querySelector('.moonset_time').innerHTML = moonsetTime;
        } else {
            document.querySelector('.sunrise_time').innerHTML = '--:--';
            document.querySelector('.sunset_time').innerHTML = '--:--';
            document.querySelector('.moonrise_time').innerHTML = '--:--';
            document.querySelector('.moonset_time').innerHTML = '--:--';
        }
    }

    await fetchAndDisplaySunMoonTimes(lat, lon, timezone);

    // Display hourly temperature chart
    fetchAndDisplayHourlyTemperature(cityID);
}



function displayDailyForecast(forecastData) {
    const weeklyForecast = document.querySelectorAll('.day_forecast'); // Get all existing day_forecast divs
    if (weeklyForecast.length !== 5) {
        console.error("There should be exactly 5 '.day_forecast' elements in the HTML.");
        return;
    }
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Set to start of today
    const nextDayTimestamp = now.getTime() + 86400000; // Get timestamp for the start of tomorrow
    // Group forecast data by day
    const daysData = {};
    forecastData.list.forEach(entry => {
        const entryDate = new Date(entry.dt * 1000);
        const entryDay = entryDate.toLocaleDateString('en-US', { weekday: 'long' });
        const entryDayNumber = entryDate.getDate();
        const weatherCondition = entry.weather[0].description;
        const iconCode = entry.weather[0].icon;
        if (entryDate.getTime() >= nextDayTimestamp) {
            if (!daysData[entryDay]) {
                daysData[entryDay] = {
                    dayNumber: entryDayNumber,
                    temps: [],
                    icon: iconCode, // Add icon code
                    condition: weatherCondition // Add weather condition
                };
            }
            daysData[entryDay].temps.push(entry.main.temp);
        }
    });
    // Create an array of 5 days from now
    const forecastDays = [];
    for (let i = 1; i <= 5; i++) {
        const date = new Date(now.getTime() + i * 86400000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        const dayNumber = date.getDate();
        if (daysData[dayName]) {
            forecastDays.push({
                day: dayName,
                dayNumber: dayNumber,
                temps: daysData[dayName].temps,
                icon: daysData[dayName].icon, // Include icon
                condition: daysData[dayName].condition // Include weather condition
            });
        } else {
            // Handle the case where forecast data might not be available for some days
            forecastDays.push({
                day: dayName,
                dayNumber: dayNumber,
                temps: [],
                icon: null, // No icon available
                condition: '' // No condition available
            });
        }
    }
    forecastDays.forEach((dayData, index) => {
        const temps = dayData.temps;
        const maxTemp = temps.length > 0 ? Math.round(Math.max(...temps)) : 'N/A'; // Convert max temp to Celsius and round
        const minTemp = temps.length > 0 ? Math.round(Math.min(...temps)) : 'N/A'; // Convert min temp to Celsius and round
        // Update the existing divs with new data
        const dayForecast = weeklyForecast[index];
        dayForecast.querySelector('.day_name').textContent = dayData.day;
        dayForecast.querySelector('.day_date').textContent = dayData.dayNumber;
        dayForecast.querySelector('.day_temp').textContent = `${maxTemp}°/${minTemp}°`;
        
        // Set the weather condition icon
        const dayIcon = dayForecast.querySelector('.day_icon');
        if (dayData.icon) {
            dayIcon.src = getWeatherConditionIcon(dayData.icon); // Use custom weather icons
        } else {
            dayIcon.src = ''; // Clear icon if not available
        }
    });
}





async function fetchAndDisplayHourlyTemperature(cityID) {
    try {
        const hourlyData = await fetchHourlyTemperatureDataByCityID(cityID);
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
            responsive: true, // Make the chart responsive
            maintainAspectRatio: false, // Do not maintain aspect ratio
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
