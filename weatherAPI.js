const apiKey = "b9faee0bd1e04c259117cb25d4ac3356";

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




// Function to fetch hourly temperature data for a city
async function fetchHourlyTemperatureData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
        throw new Error("Could not fetch hourly temperature data");
    }

    const data = await response.json();
    return data.list.map(hour => hour.main.temp);
}
