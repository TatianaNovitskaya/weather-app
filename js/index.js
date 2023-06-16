document.addEventListener("DOMContentLoaded", () => {
    let currentTempInCelsius = document.querySelector(".show-temperature");
    let apiKey = "a9573fb89158f89d83ceea2936963385";
    let mainDiv = document.querySelector(".main");
    let currentCity = document.querySelector(".city");
    let currentCountry = document.querySelector(".country");
    let weatherIcon = document.querySelector(".weather-pic")
    let weatherDiscription = document.querySelector(".weather-temp-description");
    let feelsLikeTemperature = document.querySelector(".feels-like")
    let humidity = document.querySelector(".humidity")
    let wind = document.querySelector(".wind");
    let celsiusTemperature = null;
    setCity();
    groupEvents();
    getCurrentLocation();

    function getCurrentLocation() {
        navigator.geolocation.getCurrentPosition(getPosition);
    }

    function groupEvents() {
        let buttonCurrentLocation = document.querySelector(".current-position");
        buttonCurrentLocation.addEventListener("click", () => {
            getCurrentLocation()
        });
    }

    function setCity() {
        let inputSearch = document.querySelector(".input-search");
        let btnSearch = document.querySelector(".btn-search");
        inputSearch.addEventListener("keyup", (e) => {
            if (e.key === "Enter") {
                let inputValue = inputSearch.value.toLowerCase();
                inputSearch.value = "";
                let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&units=metric&appid=${apiKey}`
                getAxiosUrl(apiUrl);
            }

        })
        btnSearch.addEventListener("click", function () {
            let inputValue = inputSearch.value.toLowerCase();
            inputSearch.value = "";
            let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&units=metric&appid=${apiKey}`;
            getAxiosUrl(apiUrl);

        });
    }

    function getCurrentTemperature(response) {
        celsiusTemperature = Math.floor(response.data.main.temp);
        currentTempInCelsius.innerText = `${celsiusTemperature}°`;
    }

    function changeBackground(response) {
        let [weatherCondition] = response.data.weather;
        let weatherConditionLowercase = weatherCondition.main.toLowerCase()
        let currentWeatherCondition = weatherConditionsBg[weatherConditionLowercase];
        let currentWeatherConditionIcon = weatherConditionsIcons[weatherConditionLowercase];
        mainDiv.style.backgroundImage = currentWeatherCondition;
        weatherIcon.src = currentWeatherConditionIcon;
        weatherDiscription.innerText = weatherCondition.main;
    }

    function getWeatherInfo(response) {
        let feelsLikeCurrentTemp = Math.floor(response.data.main.feels_like);
        let windSpeed = Math.floor(response.data.wind.speed);

        feelsLikeTemperature.innerText = `${feelsLikeCurrentTemp}°`;
        humidity.innerText = `${response.data.main.humidity}%`;
        wind.innerText = `${windSpeed} km/h`;

    }

    function getPosition(position) {
        let currentLatitude = position.coords.latitude;
        let currentLongitude = position.coords.longitude;
        let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${currentLatitude}&lon=${currentLongitude}&appid=${apiKey}&units=metric`;
        getAxiosUrl(apiUrl);

    }

    function displayForecast(coordinates){
        console.log(coordinates)
        let apiKey = "0df6a9dd1987o3afdebba40233td58aa";
        let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.lon}&lat=${coordinates.lat}&key=${apiKey}`;
        axios.get(apiUrl).then(displayForecastHTML)
    }

    const myModal = new bootstrap.Modal(document.getElementById('myModal'), {
        keyboard: false
    })


    function setCurrentCity(response) {
        currentCity.innerText = `${response.data.name}, `;
        currentCountry.innerText = response.data.sys.country;
    }

    const weatherConditionsBg = {
        clear: "url('./images/clear-sky.jpg')",
        clouds: "url('./images/clouds.jpg')",
        rain: "url('./images/shower-rain2.jpg')",
        drizzle: "url('./images/rain-drops.jpg')",
        thunderstorm: "url('./images/lightning.jpg')",
        snow: "url('./images/snowing.jpg')",
        mist: "url('./images/mist.jpg')",
    }

    const weatherConditionsIcons = {
        clear: "./images/sunny.png",
        clouds: "./images/clouds.png",
        rain: "./images/rain.png",
        drizzle: "./images/drizzle.png",
        thunderstorm: "./images/storm.png",
        snow: "./images/snow.png",
        mist: "./images/fog.png",
    }

    function changeToFahrengeit() {
        let fahrengeitTemperature = Math.round((celsiusTemperature * 9 / 5) + 32);
        currentTempInCelsius.innerText = `${fahrengeitTemperature}°`;
        celsiusElement.classList.remove("active-convert");
        fahrenheitElement.classList.add("active-convert");
    }
    function changeToCelsius() {
        currentTempInCelsius.innerText = `${celsiusTemperature}°`;
        celsiusElement.classList.add("active-convert");
        fahrenheitElement.classList.remove("active-convert");
    }


    function displayForecastHTML(response) {
        console.log(response);

        let forecastElement = document.querySelector(".forecast");
        let forecastHTML = "";
        let countForecastDays = 7;
        for (let i = 1; i <= countForecastDays; i++) {
            forecastHTML = forecastHTML + `<div class="col-1 forecast-item ">
                        <div class="forecast-item-day">
                            <p>Tue</p>
                        </div>
                        <div class="forecast-item-icon">
                            <img src="images/clouds.png" alt="">
                        </div>
                        <div class="forecast-item-temp-max">
                            <p>8 <span>&#176</span></p>
                        </div>
                        <div class="forecast-item-temp-min">
                            <p>2 <span>&#176</span></p>
                        </div>
                    </div>`;
            forecastElement.innerHTML = forecastHTML;
        }

    }

    let fahrenheitElement = document.querySelector(".fahrenheit");
    fahrenheitElement.addEventListener("click", changeToFahrengeit)
    let celsiusElement = document.querySelector(".celsius");
    celsiusElement.addEventListener("click", changeToCelsius);


    function getAxiosUrl(apiUrl) {
        axios.get(apiUrl).then((response) => {
            getCurrentTemperature(response);
            setCurrentCity(response);
            changeBackground(response);
            getWeatherInfo(response);
            displayForecastHTML(response);
            displayForecast(response.data.coord)
        })
            .catch(function (error) {
                myModal.show()
            })
    }
})
