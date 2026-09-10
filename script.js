
// 1. HTML ELEMENTS
const forecastContainer =
    document.getElementById("forecastContainer");

const cityInput =
    document.getElementById("cityInput");

const searchBtn =
    document.getElementById("searchBtn");

const locationBtn =
    document.getElementById("locationBtn");

const loading =
    document.getElementById("loading");

const error =
    document.getElementById("error");

const cityName =
    document.getElementById("cityName");

const country =
    document.getElementById("country");

const weatherIcon =
    document.getElementById("weatherIcon");

const temperature =
    document.getElementById("temperature");

const description =
    document.getElementById("description");

const humidity =
    document.getElementById("humidity");

const wind =
    document.getElementById("wind");

const feelsLike =
    document.getElementById("feelsLike");

const rainProbability =
    document.getElementById("rainProbability");

const dateTime =
    document.getElementById("dateTime");

const hourlyRainContainer =
    document.getElementById(
        "hourlyRainContainer"
    );

const dailyHourlySection =
    document.getElementById(
        "dailyHourlySection"
    );

const dailyHourlyContainer =
    document.getElementById(
        "dailyHourlyContainer"
    );

const selectedDayTitle =
    document.getElementById(
        "selectedDayTitle"
    );

const selectedDayDate =
    document.getElementById(
        "selectedDayDate"
    );

// 2. GLOBAL HOURLY DATA

let hourlyWeatherData = null;

// 3. SEARCH BUTTON

searchBtn.addEventListener(
    "click",
    () => {

        const city =
            cityInput.value.trim();


        if (city === "") {

            showError(
                "Please enter a city name."
            );

            return;
        }


        getWeatherByCity(city);

    }
);
// 4. ENTER KEY SEARCH


cityInput.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Enter") {

            const city =
                cityInput.value.trim();


            if (city === "") {

                showError(
                    "Please enter a city name."
                );

                return;
            }


            getWeatherByCity(city);

        }

    }
);

// 5. LOCATION BUTTON

locationBtn.addEventListener(
    "click",
    () => {

        getCurrentLocation();

    }
);

// 6. LIVE DATE AND TIME

function updateDateTime() {

    const now =
        new Date();


    const date =
        now.toLocaleDateString(
            "en-IN",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );


    const time =
        now.toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }
        );


    dateTime.textContent =
        `${date} | ${time}`;

}


updateDateTime();


setInterval(
    updateDateTime,
    1000
)
// 7. SEARCH CITY


async function getWeatherByCity(city) {

    showLoading();

    clearError();


    try {

        const url =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Unable to search city."
            );

        }


        const data =
            await response.json();


        if (
            !data.results ||
            data.results.length === 0
        ) {

            throw new Error(
                "City not found."
            );

        }


        const location =
            data.results[0];


        const latitude =
            location.latitude;


        const longitude =
            location.longitude;


        const name =
            location.name;


        const countryName =
            location.country ||
            "Unknown";


        await getWeather(
            latitude,
            longitude,
            name,
            countryName
        );


    } catch (err) {

        showError(
            err.message
        );

    } finally {

        hideLoading();

    }

}

// 8. CURRENT LOCATION

function getCurrentLocation() {

    showLoading();

    clearError();


    if (!navigator.geolocation) {

        hideLoading();

        showError(
            "Geolocation is not supported by your browser."
        );

        return;

    }


    navigator.geolocation.getCurrentPosition(

        async (position) => {

            const latitude =
                position.coords.latitude;


            const longitude =
                position.coords.longitude;


            try {

                await getWeatherByCoordinates(
                    latitude,
                    longitude
                );


            } catch (err) {

                showError(
                    err.message
                );


            } finally {

                hideLoading();

            }

        },


        (err) => {

            hideLoading();


            let message =
                "Unable to get your location.";


            if (err.code === 1) {

                message =
                    "Location permission was denied.";

            }


            else if (err.code === 2) {

                message =
                    "Your location could not be determined.";

            }


            else if (err.code === 3) {

                message =
                    "Location request timed out.";

            }


            showError(message);

        },


        {

            enableHighAccuracy: true,

            timeout: 15000,

            maximumAge: 0

        }

    );

}

// 9. WEATHER BY COORDINATES

async function getWeatherByCoordinates(
    latitude,
    longitude
) {


    const reverseURL =
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;


    const response =
        await fetch(reverseURL);


    if (!response.ok) {

        throw new Error(
            "Unable to find your location."
        );

    }


    const locationData =
        await response.json();


    const name =
        locationData.city ||
        locationData.locality ||
        locationData.principalSubdivision ||
        "Your Location";


    const countryName =
        locationData.countryName ||
        "Unknown";


    await getWeather(
        latitude,
        longitude,
        name,
        countryName
    );

}



// 10. GET WEATHER

async function getWeather(
    latitude,
    longitude,
    name,
    countryName
) {


    try{
        // OPEN METEO API

        const weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,rain,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,rain_sum&timezone=auto&forecast_days=5`;


        const response =
            await fetch(weatherURL);


        if (!response.ok) {

            throw new Error(
                "Unable to fetch weather data."
            );

        }


        const data =
            await response.json();
        // SAVE HOURLY DATA
       

        hourlyWeatherData =
            data.hourly;


        
        // CURRENT WEATHER
       

        const current =
            data.current;


        cityName.textContent =
            name;


        country.textContent =
            countryName;


        temperature.textContent =
            `${Math.round(
                current.temperature_2m
            )}°C`;


        humidity.textContent =
            `${current.relative_humidity_2m}%`;


        wind.textContent =
            `${Math.round(
                current.wind_speed_10m
            )} km/h`;


        feelsLike.textContent =
            `${Math.round(
                current.apparent_temperature
            )}°C`;


        // CURRENT WEATHER INFO
     

        const currentWeather =
            getWeatherInfo(
                current.weather_code
            );


        weatherIcon.textContent =
            currentWeather.icon;


        description.textContent =
            currentWeather.description;


       
        // TODAY RAIN PROBABILITY
        

        const todayRainProbability =
            data.daily
                ?.precipitation_probability_max
                ?.[0];


        rainProbability.textContent =
            todayRainProbability != null
                ? `${todayRainProbability}%`
                : "--%";


      
        // TODAY HOURLY
       
        displayTodayHourly(
            data.hourly
        );


       
        // 5 DAY FORECAST
       

        displayForecast(
            data.daily
        );


        // Hide selected day section
        dailyHourlySection.style.display =
            "none";


    } catch (err) {

        showError(
            err.message
        );

    }

}



// 11. WEATHER CODE → ICON


function getWeatherInfo(code) {


    // CLEAR

    if (code === 0) {

        return {
            icon: "☀️",
            description: "Clear Sky"
        };

    }


    // MAINLY CLEAR

    if (code === 1) {

        return {
            icon: "🌤️",
            description: "Mainly Clear"
        };

    }


    // PARTLY CLOUDY

    if (code === 2) {

        return {
            icon: "⛅",
            description: "Partly Cloudy"
        };

    }


    // OVERCAST

    if (code === 3) {

        return {
            icon: "☁️",
            description: "Overcast"
        };

    }


    // FOG

    if (
        code === 45 ||
        code === 48
    ) {

        return {
            icon: "🌫️",
            description: "Fog"
        };

    }


    // DRIZZLE

    if (
        code >= 51 &&
        code <= 57
    ) {

        return {
            icon: "🌦️",
            description: "Drizzle"
        };

    }


    // RAIN

    if (
        code >= 61 &&
        code <= 67
    ) {

        return {
            icon: "🌧️",
            description: "Rain"
        };

    }


    // SNOW

    if (
        code >= 71 &&
        code <= 77
    ) {

        return {
            icon: "❄️",
            description: "Snow"
        };

    }


    // RAIN SHOWERS

    if (
        code >= 80 &&
        code <= 82
    ) {

        return {
            icon: "🌦️",
            description: "Rain Showers"
        };

    }


    // THUNDERSTORM

    if (code === 95) {

        return {
            icon: "⛈️",
            description: "Thunderstorm"
        };

    }


    // THUNDERSTORM + HAIL

    if (
        code === 96 ||
        code === 99
    ) {

        return {
            icon: "⛈️",
            description:
                "Thunderstorm with Hail"
        };

    }


    return {
        icon: "🌡️",
        description: "Unknown Weather"
    };

}



// 12. TODAY'S HOURLY WEATHER


function displayTodayHourly(hourly) {


    hourlyRainContainer.innerHTML =
        "";


    const now =
        new Date();


    const currentHour =
        now.getHours();


    let count = 0;


    for (
        let i = 0;
        i < hourly.time.length;
        i++
    ) {


        const timeString =
            hourly.time[i];


        const datePart =
            timeString.split("T")[0];


        const today =
            now.toLocaleDateString(
                "en-CA"
            );


        // Only today's data

        if (datePart !== today) {

            continue;

        }


        const hourPart =
            timeString.split("T")[1];


        const hour =
            Number(
                hourPart.split(":")[0]
            );


        // Skip passed hours

        if (
            hour < currentHour
        ) {

            continue;

        }


       
        // DATA
       

        const temp =
            hourly
                .temperature_2m?.[i]
                ?? 0;


        const rainChance =
            hourly
                .precipitation_probability?.[i]
                ?? 0;


        const rainAmount =
            hourly
                .precipitation?.[i]
                ?? 0;


        const code =
            hourly
                .weather_code?.[i]
                ?? 0;


        const info =
            getWeatherInfo(code);


        // EXACT TIME
    

        const time =
            formatTime(
                hourPart
            );


        
        // CARD
     

        const card =
            document.createElement("div");


        card.className =
            "hourly-rain-card";


        card.innerHTML = `

            <div class="hourly-time">
                ${time}
            </div>

            <div class="hourly-icon">
                ${info.icon}
            </div>

            <div class="hourly-temperature">
                ${Math.round(temp)}°C
            </div>

            <div class="hourly-rain-probability">
                🌧️ ${rainChance}% rain
            </div>

            <div class="hourly-rain-amount">
                💧 ${Number(rainAmount).toFixed(1)} mm
            </div>

        `;


        hourlyRainContainer.appendChild(
            card
        );


        count++;


        // Show remaining hours
        // Maximum 12

        if (count >= 12) {

            break;

        }

    }


    if (count === 0) {

        hourlyRainContainer.innerHTML = `
            <p>
                No hourly data available.
            </p>
        `;

    }

}


// 13. 5-DAY FORECAST


function displayForecast(daily) {


    forecastContainer.innerHTML =
        "";


    const daysToShow =
        Math.min(
            5,
            daily.time.length
        );


    for (
        let i = 0;
        i < daysToShow;
        i++
    ) {


        // DATE
       

        const date =
            daily.time[i];


        // DAY NAME
    

        let dayName;


        if (i === 0) {

            dayName =
                "Today";

        }


        else if (i === 1) {

            dayName =
                "Tomorrow";

        }


        else {

            const dateObject =
                new Date(
                    date + "T12:00:00"
                );


            dayName =
                dateObject.toLocaleDateString(
                    "en-IN",
                    {
                        weekday: "short"
                    }
                );

        }


        // TEMPERATURE


        const maxTemp =
            Math.round(
                daily.temperature_2m_max[i]
            );


        const minTemp =
            Math.round(
                daily.temperature_2m_min[i]
            );


        // WEATHER
       

        const code =
            daily.weather_code[i];


        const info =
            getWeatherInfo(code);

        // RAIN PROBABILITY
   

        const rainChance =
            daily
                .precipitation_probability_max
                ?.[i]
                ?? 0;

        // PRECIPITATION
       
        const precipitation =
            daily
                .precipitation_sum
                ?.[i]
                ?? 0;

        // RAIN
        

        const rain =
            daily
                .rain_sum
                ?.[i]
                ?? 0;

        // CREATE CARD
        

        const card =
            document.createElement("div");


        card.className =
            "forecast-card";


        card.innerHTML = `

            <div class="forecast-day">
                ${dayName}
            </div>

            <div class="forecast-icon">
                ${info.icon}
            </div>

            <div class="forecast-temp">
                ${maxTemp}° / ${minTemp}°
            </div>

            <div class="forecast-description">
                ${info.description}
            </div>

            <div class="forecast-rain">
                🌧️ ${rainChance}% rain
            </div>

            <div class="forecast-precipitation">
                💧 ${Number(
                    precipitation
                ).toFixed(1)} mm
            </div>

            <div class="forecast-rain-amount">
                🌧️ ${Number(
                    rain
                ).toFixed(1)} mm
            </div>

        `;


        // CLICK
       

        card.addEventListener(
            "click",
            () => {


                // Remove selected

                document
                    .querySelectorAll(
                        ".forecast-card"
                    )
                    .forEach(
                        card => {

                            card.classList.remove(
                                "selected"
                            );

                        }
                    );


                // Select current

                card.classList.add(
                    "selected"
                );


                // Display 24 hours

                displaySelectedDayHourly(
                    date,
                    dayName
                );


                // Scroll

                setTimeout(
                    () => {

                        dailyHourlySection
                            .scrollIntoView(
                                {
                                    behavior:
                                        "smooth",

                                    block:
                                        "start"
                                }
                            );

                    },
                    100
                );

            }
        );


        forecastContainer.appendChild(
            card
        );

    }

}


// 14. SELECTED DAY HOURLY


function displaySelectedDayHourly(
    selectedDate,
    dayName
) {


    if (!hourlyWeatherData) {

        showError(
            "Hourly weather data is not available."
        );

        return;

    }


   
    // SHOW SECTION
    

    dailyHourlySection.style.display =
        "block";


    
    // TITLE
  

    selectedDayTitle.textContent =
        `🌦️ ${dayName} — Hourly Weather`;


    selectedDayDate.textContent =
        `Complete hourly weather for ${selectedDate}`;


    
    // CLEAR
   

    dailyHourlyContainer.innerHTML =
        "";


    let hoursFound = 0;


    
    // LOOP 24 HOURS
   

    for (
        let i = 0;
        i < hourlyWeatherData.time.length;
        i++
    ) {


        const timeString =
            hourlyWeatherData.time[i];


        const datePart =
            timeString.split("T")[0];


        // Only selected date

        if (
            datePart !== selectedDate
        ) {

            continue;

        }


        // TIME
        

        const hourPart =
            timeString.split("T")[1];


        const formattedTime =
            formatTime(
                hourPart
            );


        // TEMPERATURE
        

        const temp =
            hourlyWeatherData
                .temperature_2m?.[i]
                ?? 0;


     
        // FEELS LIKE
       

        const feels =
            hourlyWeatherData
                .apparent_temperature?.[i]
                ?? 0;


       
        // HUMIDITY
        

        const humidityValue =
            hourlyWeatherData
                .relative_humidity_2m?.[i]
                ?? 0;


        // WIND
        
        const windValue =
            hourlyWeatherData
                .wind_speed_10m?.[i]
                ?? 0;


        
        // RAIN PROBABILITY
       

        const rainChance =
            hourlyWeatherData
                .precipitation_probability?.[i]
                ?? 0;


       
        // RAIN AMOUNT
       
        const rainAmount =
            hourlyWeatherData
                .precipitation?.[i]
                ?? 0;


       
        // WEATHER CODE
      

        const code =
            hourlyWeatherData
                .weather_code?.[i]
                ?? 0;


        const info =
            getWeatherInfo(code);


       
        // CREATE CARD
      

        const card =
            document.createElement("div");


        card.className =
            "daily-hour-card";


        card.innerHTML = `

            <div class="daily-hour-time">
                ${formattedTime}
            </div>

            <div class="daily-hour-icon">
                ${info.icon}
            </div>

            <div class="daily-hour-temperature">
                ${Math.round(temp)}°C
            </div>

            <div class="daily-hour-rain">
                🌧️ ${rainChance}% rain
            </div>

            <div class="daily-hour-amount">
                💧 ${Number(
                    rainAmount
                ).toFixed(1)} mm
            </div>

            <div class="daily-hour-humidity">
                💦 Humidity ${humidityValue}%
            </div>

            <div class="daily-hour-wind">
                💨 Wind ${Math.round(
                    windValue
                )} km/h
            </div>

            <div class="daily-hour-wind">
                🌡️ Feels ${Math.round(
                    feels
                )}°C
            </div>

        `;


        dailyHourlyContainer.appendChild(
            card
        );


        hoursFound++;

    }


    
    // NO DATA
  

    if (hoursFound === 0) {

        dailyHourlyContainer.innerHTML = `
            <p>
                Hourly weather data is not
                available for this day.
            </p>
        `;

    }

}



function formatTime(timeString) {


    const parts =
        timeString.split(":");


    let hour =
        Number(parts[0]);


    const minute =
        parts[1];


    const ampm =
        hour >= 12
            ? "PM"
            : "AM";


    hour =
        hour % 12;


    if (hour === 0) {

        hour = 12;

    }


    return `${hour}:${minute} ${ampm}`;

}


function showLoading() {

    loading.style.display =
        "block";

}


function hideLoading() {

    loading.style.display =
        "none";

}



// 17. ERROR


function showError(message) {

    error.textContent =
        message;

}


function clearError() {

    error.textContent =
        "";

}



// 18. DEFAULT CITY


getWeatherByCity(
    "Lucknow"
);