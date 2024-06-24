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

async function getWeatherDataByCityID(cityID) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?id=${cityID}&appid=${apiKey}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
        throw new Error("Could not fetch weather data");
    }

    return await response.json();
}



// Get weather Overview
async function getWeatherOverview(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/3.0/onecall/overview?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error("Unable to fetch weather overview.");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching weather overview:", error);
        return null;
    }
}

async function getDailyForecast(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error("Could not fetch daily forecast.");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching daily forecast:", error);
        return null;
    }
}



async function fetchHourlyTemperatureDataByCityID(cityID) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?id=${cityID}&appid=${apiKey}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
        throw new Error("Could not fetch hourly temperature data");
    }

    const data = await response.json();
    const timezoneOffset = data.city.timezone;

    // Extract the next 48 hours of data and adjust the time for the city's timezone
    return data.list.slice(0, 16).map(current => ({
        temp: current.main.temp,
        time: current.dt + timezoneOffset
    }));
}

async function getSunMoonTimes(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&appid=${apiKey}`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error("Unable to fetch sun and moon times.");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching sun and moon times:", error);
        return null;
    }
}
