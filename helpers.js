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

// Function to map weather conditions to icons
function getWeatherConditionIcon(iconCode) {
    const Icons = {
        "01d": "/axd/logos_icons/weather_condition_icons/clear_sky.svg",
        "01n": "/axd/logos_icons/weather_condition_icons/clear_sky.svg",
        "02d": "/axd/logos_icons/weather_condition_icons/few_clouds.svg",
        "02n": "/axd/logos_icons/weather_condition_icons/few_clouds.svg",
        "03d": "/axd/logos_icons/weather_condition_icons/cloudy.svg",
        "03n": "/axd/logos_icons/weather_condition_icons/cloudy.svg",
        "04d": "/axd/logos_icons/weather_condition_icons/cloudy.svg",
        "04n": "/axd/logos_icons/weather_condition_icons/cloudy.svg",
        "09d": "/axd/logos_icons/weather_condition_icons/shower_rain.svg",
        "09n": "/axd/logos_icons/weather_condition_icons/shower_rain.svg",
        "10d": "/axd/logos_icons/weather_condition_icons/rain.svg",
        "10n": "/axd/logos_icons/weather_condition_icons/rain.svg",
        "11d": "/axd/logos_icons/weather_condition_icons/thunderstorm.svg",
        "11n": "/axd/logos_icons/weather_condition_icons/thunderstorm.svg",
        "13d": "/axd/logos_icons/weather_condition_icons/snow.svg",
        "13n": "/axd/logos_icons/weather_condition_icons/snow.svg",
        "50d": "/axd/logos_icons/weather_condition_icons/snow.svg",
        "50n": "/axd/logos_icons/weather_condition_icons/snow.svg"
    };
    return Icons[iconCode] || "/axd/logos_icons/weather_condition/default.png";
}


// Function to get the time of the city and display it on the chart.
function getCurrentHourLabels(hourlyData) {
    return hourlyData.map(data => {
        const date = new Date(data.time * 1000); // Convert to milliseconds
        const hours = date.getUTCHours(); // Get the hour in 24-hour format (UTC)
        return `${hours}h`;
    });
}

// Debounce function to limit the rate at which a function can fire.
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

