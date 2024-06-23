document.addEventListener('DOMContentLoaded', function() {
    const monthButtons = document.querySelectorAll('.month_buttons button');
    const prevMonthButton = document.querySelector('.prevMonth');
    const nextMonthButton = document.querySelector('.nextMonth');
    const currentMonthElement = document.querySelector('.currentMonth');
    const calendarBody = document.querySelector('.calendar tbody');

    let currentMonthIndex = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    const apiKey = "b9faee0bd1e04c259117cb25d4ac3356";
    const city = 'Berlin'; // Default city for now
    
    // Function to fetch weather data from the OpenWeatherMap API (no sirve, help)
    async function fetchWeatherData(month, year) {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const cityURL = `https://api.openweathermap.org/data/2.5/forecast/daily?q=${city}&cnt=${daysInMonth}&units=metric&appid=${apiKey}`;
        const weatherData = {};
    
        try {
            const response = await fetch(cityURL);
            const data = await response.json();
    
            data.list.forEach((day, index) => {
                weatherData[index + 1] = {
                    maxTemp: day.temp.max,
                    minTemp: day.temp.min,
                    icon: `http://openweathermap.org/img/wn/${day.weather[0].icon}.png`
                };
            });
        } catch (error) {
            console.error('Failed to fetch weather data:', error);
        }
    
        return weatherData;
    }

    //  calendar display
    async function updateCalendar(month, year) {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        currentMonthElement.textContent = `${monthNames[month]} ${year}`;
    
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const weatherData = await fetchWeatherData(month, year);
    
        let calendarHTML = '';
        let dayCounter = 1;
    
        for (let i = 0; i < 6; i++) { // 6 rows (weeks)
            let weekHTML = '<tr>';
            for (let j = 0; j < 7; j++) { // 7 days (columns)
                if (i === 0 && j < firstDayOfMonth || dayCounter > daysInMonth) {
                    weekHTML += '<td class="empty"></td>';
                } else {
                    const weather = weatherData[dayCounter] || { maxTemp: 'N/A', minTemp: 'N/A', icon: '/axd/logos_icons/moon1.svg' };
                    weekHTML += `
                        <td>
                            <div class="date_number">${dayCounter}</div>
                            <img src="${weather.icon}" alt="Weather icon" class="weather-icon">
                            <div>${weather.maxTemp}°C / ${weather.minTemp}°C</div>
                        </td>
                    `;
                    dayCounter++;
                }
            }
            weekHTML += '</tr>';
            calendarHTML += weekHTML;
        }
        calendarBody.innerHTML = calendarHTML;
    }
    // month buttons
    monthButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            currentMonthIndex = index;
            updateCalendar(currentMonthIndex, currentYear);
        });
    });

    // previous and next month buttons
    prevMonthButton.addEventListener('click', () => {
        currentMonthIndex--;
        if (currentMonthIndex < 0) {
            currentMonthIndex = 11;
            currentYear--;
        }
        updateCalendar(currentMonthIndex, currentYear);
    });

    nextMonthButton.addEventListener('click', () => {
        currentMonthIndex++;
        if (currentMonthIndex > 11) {
            currentMonthIndex = 0;
            currentYear++;
        }
        updateCalendar(currentMonthIndex, currentYear);
    });

    // Initialize the calendar with the current month and year
    updateCalendar(currentMonthIndex, currentYear);
});