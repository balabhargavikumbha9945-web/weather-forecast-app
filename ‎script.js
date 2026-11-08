function weatherInfo(code) {
    if (code === 0) return ["Clear Sky", "☀️"];
    if ([1, 2, 3].includes(code)) return ["Partly Cloudy", "⛅"];
    if ([45, 48].includes(code)) return ["Foggy", "🌫️"];
    if ([51, 53, 55, 56, 57].includes(code)) return ["Drizzle", "🌦️"];
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code))
        return ["Rainy", "🌧️"];
    if ([71, 73, 75, 77, 85, 86].includes(code))
        return ["Snowy", "❄️"];
    if ([95, 96, 99].includes(code))
        return ["Thunderstorm", "⛈️"];

    return ["Unknown", "🌤️"];
}

// Get weather information
async function getWeather() {

    const city = document.getElementById("city").value.trim();
    const message = document.getElementById("message");
    const result = document.getElementById("weather-result");

    if (city === "") {
        message.innerText = "Please enter a city name!";
        return;
    }

    message.innerText = "Loading weather...";
    result.classList.add("hidden");

    try {
        const response = await fetch(
            `/weather?city=${encodeURIComponent(city)}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Weather not available");
        }

        const current = data.current;
        const daily = data.daily;

        const info = weatherInfo(current.weather_code);

        // Display city
        document.getElementById("city-name").innerText =
            data.city + ", " + data.country;

        // Display temperature
        document.getElementById("temperature").innerText =
            current.temperature_2m + "°C";

        // Display weather condition
        document.getElementById("weather-icon").innerText = info[1];

        document.getElementById("condition").innerText = info[0];

        // Display weather details
        document.getElementById("feels").innerText =
            current.apparent_temperature;

        document.getElementById("humidity").innerText =
            current.relative_humidity_2m;

        document.getElementById("wind").innerText =
            current.wind_speed_10m;

        // Display 7-day forecast
        const forecast = document.getElementById("forecast");

        forecast.innerHTML = "";

        daily.time.forEach((date, index) => {

            const dayInfo = weatherInfo(
                daily.weather_code[index]
            );

            const day = new Date(date + "T00:00:00")
                .toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric"
                });

            const card = document.createElement("div");

            card.className = "forecast-card";

            card.innerHTML = `
                <h3>${day}</h3>
                <h2>${dayInfo[1]}</h2>
                <p>${dayInfo[0]}</p>
                <p>Max: ${daily.temperature_2m_max[index]}°C</p>
                <p>Min: ${daily.temperature_2m_min[index]}°C</p>
                <p>Rain: ${
                    daily.precipitation_probability_max[index] ?? "N/A"
                }%</p>
            `;

            forecast.appendChild(card);
        });

        message.innerText = "";
        result.classList.remove("hidden");

    } catch (error) {

        message.innerText = error.message;

    }
}

// Search weather when pressing Enter
document.getElementById("city").addEventListener(
    "keydown",
    function(event) {
        if (event.key === "Enter") {
            getWeather();
        }
    }
);
