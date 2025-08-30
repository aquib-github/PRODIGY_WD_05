const cities = {
    "Mumbai": { lat: 19.076, lon: 72.8777 },
    "Pune": { lat: 18.5204, lon: 73.8567 },
    "Delhi": { lat: 28.7041, lon: 77.1025 },
    "Bangalore": { lat: 12.9716, lon: 77.5946 },
    "Lucknow": { lat: 26.8467, lon: 80.9462 },
    "Kerala": { lat: 10.8505, lon: 76.2711 }
};

document.getElementById("currentLocationBtn").addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            pos => fetchWeather(pos.coords.latitude, pos.coords.longitude, "Your Location"),
            () => alert("Location access denied.")
        );
    } else {
        alert("Geolocation not supported.");
    }
});

document.getElementById("getWeather").addEventListener("click", () => {
    const city = document.getElementById("citySelect").value;
    if (!city) return;
    fetchWeather(cities[city].lat, cities[city].lon, city);
});

function fetchWeather(lat, lon, cityName) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max&current_weather=true&timezone=auto`;

    fetch(url)
        .then(res => res.json())
        .then(data => displayWeather(data, cityName))
        .catch(() => alert("Unable to fetch weather data"));
}

function displayWeather(data, cityName) {
    const weatherDiv = document.getElementById("weatherDisplay");
    weatherDiv.classList.remove("hidden");

    const current = data.current_weather;
    const currentCard = `
        <h2>📍 ${cityName}</h2>
        <p>🌡️ Temperature: ${current.temperature}°C</p>
        <p>💨 Windspeed: ${current.windspeed} km/h</p>
        <p>🌥 Condition: ${current.weathercode ? mapWeatherCode(current.weathercode) : "Not available"}</p>
    `;
    document.getElementById("currentWeather").innerHTML = currentCard;

    const forecastDiv = document.getElementById("forecast");
    forecastDiv.innerHTML = "";

    data.daily.time.forEach((date, i) => {
        const card = `
            <div class="card">
                <p>📅 ${date}</p>
                <p>🌡️ Max: ${data.daily.temperature_2m_max[i]}°C</p>
                <p>🌡️ Min: ${data.daily.temperature_2m_min[i]}°C</p>
                <p>💧 Rain: ${data.daily.precipitation_sum[i]} mm</p>
                <p>💨 Wind: ${data.daily.windspeed_10m_max[i]} km/h</p>
            </div>
        `;
        forecastDiv.innerHTML += card;
    });
}

function mapWeatherCode(code) {
    const codes = {
        0: "Clear Sky", 1: "Mainly Clear", 2: "Partly Cloudy", 3: "Overcast",
        45: "Fog", 48: "Depositing Rime Fog", 51: "Light Drizzle", 61: "Rain",
        71: "Snowfall", 80: "Rain Showers", 95: "Thunderstorm"
    };
    return codes[code] || "Not available";
}