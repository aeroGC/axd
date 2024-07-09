async function displayWeatherInfo(data) {
    const countryNames = getCountryNames();  
    const { name: city, id: cityID, sys: { country }, main: { temp, temp_min, temp_max, humidity, feels_like, pressure }, wind: { speed, deg }, weather, coord: { lon, lat }, timezone } = data;
    const weatherCondition = weather[0].description; 
    const iconCode = weather[0].icon; 

    
    const now = new Date(Date.now() + (timezone * 1000));
    const formattedDate = now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });

    // Display city, country, date, and time
    const weatherCity = document.querySelector('.weather_city');
    const weatherDate = document.querySelector('.weather_date');
    const weatherTime = document.querySelector('.weather_time');
    const weatherDegrees = document.querySelector('.weather_degrees');
    const weatherVisualizer = document.querySelector('.weather_visualizer');
    const weatherIcon = document.querySelector('.weather_icon');

    const countryName = countryNames[country] || country;
    weatherCity.innerHTML = `${city}, ${countryName}`;

    const celsiusTemp_max = Math.round((temp_max - 273.15).toFixed(1));
    const celsiusTemp_min = Math.round((temp_min - 273.15).toFixed(1));
    weatherDate.innerHTML = formattedDate;
    weatherTime.innerHTML = formattedTime;

    // Display temperature
    const celsiusTemp = Math.round((temp - 273.15).toFixed(1));
    weatherDegrees.innerHTML = `${celsiusTemp}°C`;
    weatherDegrees.dataset.originalTemp = celsiusTemp;

    // Fetch the weather icon information
    weatherIcon.src = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

    // Set weather icon dynamically
    weatherVisualizer.src = getWeatherIcon(weatherCondition);


    // Display weather details

    // Weather Condition
    const weatherConditionDetail = document.querySelector('.weather_description');
    weatherConditionDetail.innerHTML = `Weather Condition: ${weatherCondition}`;

    // Convert from Kelvin to Celsius
    const feels_like_celsius = Math.round((feels_like - 273.15).toFixed(1));
    // Feels Like
    const feelsLikeDetail = document.querySelector('.feels_like_detail');
    feelsLikeDetail.innerHTML = `Feels Like: ${feels_like_celsius}°C`;
    feelsLikeDetail.dataset.originalTemp = feels_like_celsius;


    // Box 3 Details

    // Humidity
    const weatherHumidity = document.querySelector(`.humidity_detail`);
    weatherHumidity.innerHTML = `Humidity: ${humidity}%`;

    // Pressure
    const weatherPressure = document.querySelector(`.pressure_detail`);
    weatherPressure.innerHTML = `Pressure: ${pressure} hPa`;

    // Wind
    const weatherWind = document.querySelector(`.wind_detail`);
    weatherWind.innerHTML = `Wind: ${speed} m/s at ${deg}°`;

    async function fetchAndDisplaySunMoonTimes(lat, lon, timezoneOffset) {
        const sunMoonData = await getSunMoonTimes(lat, lon, timezoneOffset);
        if (sunMoonData) {
            document.querySelector('.sunrise_time').innerHTML = sunMoonData.sunrise;
            document.querySelector('.sunset_time').innerHTML = sunMoonData.sunset;
            document.querySelector('.moonrise_time').innerHTML = sunMoonData.moonrise;
            document.querySelector('.moonset_time').innerHTML = sunMoonData.moonset;
        } else {
            document.querySelector('.sunrise_time').innerHTML = '--:--';
            document.querySelector('.sunset_time').innerHTML = '--:--';
            document.querySelector('.moonrise_time').innerHTML = '--:--';
            document.querySelector('.moonset_time').innerHTML = '--:--';
        }
    }

    try {
        const airPollutionData = await getAirPollutionData(lat, lon);
        const airQualityIndex = airPollutionData.list[0].main.aqi;
        const airQualityDetail = document.querySelector(`.air_detail`);
        airQualityDetail.innerHTML = `Air Quality Index: ${airQualityIndex}`;
    } catch (error) {
        console.error("Error fetching air pollution data:", error);
    }

    await fetchAndDisplaySunMoonTimes(lat, lon, timezone);

    
    fetchAndDisplayHourlyTemperature(cityID);

    const summaryButton = document.getElementById('summaryButton');
    const modal = document.getElementById('summaryModal');
    const closeBtn = document.querySelector('.close');
    const weatherSummary = document.querySelector('.weather_summary');

    summaryButton.onclick = async function() {
    
        weatherSummary.innerHTML = "Loading weather overview...";
        weatherSummary.classList.add('loading');
        modal.style.display = "block";
    
        try {
            const weatherOverview = await getWeatherOverview(lat, lon);
    
            if (weatherOverview) {
                weatherSummary.innerHTML = weatherOverview.weather_overview || "No weather overview available.";
            } else {
                weatherSummary.innerHTML = "No weather overview available.";
            }
        } catch (error) {
            weatherSummary.innerHTML = "Error fetching weather overview.";
        }
    
        weatherSummary.classList.remove('loading'); 
    };
    

    closeBtn.onclick = function() {
        modal.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
}

function displayDailyForecast(forecastData) {
    const weeklyForecast = document.querySelectorAll('.day_forecast'); 
    if (weeklyForecast.length !== 5) {
        console.error("There should be exactly 5 '.day_forecast' elements in the HTML.");
        return;
    }
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const nextDayTimestamp = now.getTime() + 86400000;
    
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
                    icon: iconCode,
                    condition: weatherCondition
                };
            }
            daysData[entryDay].temps.push(entry.main.temp);
        }
    });

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
                icon: daysData[dayName].icon,
                condition: daysData[dayName].condition
            });
        } else {
            forecastDays.push({
                day: dayName,
                dayNumber: dayNumber,
                temps: [],
                icon: null,
                condition: ''
            });
        }
    }

    forecastDays.forEach((dayData, index) => {
        const temps = dayData.temps;
        const maxTemp = temps.length > 0 ? Math.round(Math.max(...temps)) : 'N/A';
        const minTemp = temps.length > 0 ? Math.round(Math.min(...temps)) : 'N/A';
        const dayForecast = weeklyForecast[index];
        dayForecast.querySelector('.day_name').textContent = dayData.day;
        dayForecast.querySelector('.day_date').textContent = dayData.dayNumber;
        dayForecast.querySelector('.day_temp').textContent = `${maxTemp}°/${minTemp}°`;
        dayForecast.querySelector('.day_temp').dataset.originalTemp = `${maxTemp}°/${minTemp}°`;

        const dayIcon = dayForecast.querySelector('.day_icon');
        if (dayData.icon) {
            dayIcon.src = getWeatherConditionIcon(dayData.icon);
        } else {
            dayIcon.src = '';
        }
    });
}

function displayHourlyTemperatureChart(hourlyData) {
    hourlyTemperaturesCelsius = hourlyData.map(data => Math.round(data.temp - 273.15));  // Store original temperatures in Celsius
    const labels = getCurrentHourLabels(hourlyData);
    const icons = hourlyData.map(data => data.icon);

    const box1 = document.getElementById('box1');
    const canvas = document.createElement('canvas');
    canvas.id = 'hourlyChart';
    box1.innerHTML = '';
    box1.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    hourlyTemperatureChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: ' 24-hour Temperature',
                    data: hourlyTemperaturesCelsius,
                    fill: true,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    tension: 0.4,
                    pointRadius: 8,
                    pointHoverRadius: 10,
                    pointStyle: icons.map(icon => {
                        const img = new Image(40, 40);
                        img.src = getWeatherConditionIcon(icon);
                        return img;
                    })
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Temperature (°C)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true
                },
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
                            return `Temperature: ${tooltipItem.raw}°C`;
                        }
                    }
                }
            }
        }
    });
}