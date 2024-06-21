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

async function getWeatherOverview(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/3.0/onecall/overview?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error("Unable to fetch weather overview.");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching weather overview:", error);
        return null;
    }
}


async function getDailyForecast(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error("No se pudo obtener el pronóstico diario.");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al obtener el pronóstico diario:", error);
        return null;
    }
}


async function fetchHourlyTemperatureData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
        throw new Error("Could not fetch hourly temperature data");
    }

    const data = await response.json();
    const timezoneOffset = data.city.timezone; // Get the timezone offset of the city

    // Extract the next 12 hours of data and adjust the time for the city's timezone
    const hourlyData = data.list.slice(0, 16).map(current => ({
        temp: current.main.temp,
        time: current.dt + timezoneOffset // Adjust the time for the city's timezone
    }));

    return hourlyData;
}