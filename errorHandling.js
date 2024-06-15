// Function to display error messages on the webpage
function displayError(message) {
    const weatherContainer = document.querySelector(".weather_container");
    weatherContainer.innerHTML = `<p class="error">${message}</p>`;
}
