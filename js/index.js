document.addEventListener("DOMContentLoaded", () => {
    let currentTempInCelsius = document.querySelector(".show-temperature");
    let apiKey = "a9573fb89158f89d83ceea2936963385";
    let mainDiv = document.querySelector(".main");
    let currentCity = document.querySelector(".city");
    let currentCountry = document.querySelector(".country");

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
        let newCurrentTemperature = Math.floor(response.data.main.temp);
        currentTempInCelsius.innerText = newCurrentTemperature;
    }

    function changeBackground(response) {
        let [weatherCondition] = response.data.weather;
        let weatherConditionLowercase = weatherCondition.main.toLowerCase()
        let currentWeatherCondition = weatherConditions[weatherConditionLowercase];
        mainDiv.style.backgroundImage = currentWeatherCondition;
    }

    function getPosition(position) {
        let currentLatitude = position.coords.latitude;
        let currentLongitude = position.coords.longitude;
        let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${currentLatitude}&lon=${currentLongitude}&appid=${apiKey}&units=metric`;
        getAxiosUrl(apiUrl);
    }

    const myModal = new bootstrap.Modal(document.getElementById('myModal'), {
        keyboard: false
    })

    function getAxiosUrl(apiUrl) {
        axios.get(apiUrl).then((response) => {
            getCurrentTemperature(response);
            setCurrentCity(response);
            changeBackground(response)
        })
            .catch(function (error) {
                myModal.show()
            })
    }


    function setCurrentCity(response) {
        currentCity.innerText = `${response.data.name}, `;
        currentCountry.innerText = response.data.sys.country;
    }

    const weatherConditions = {
        clear: "url('./images/clear-sky.jpg')",
        clouds: "url('./images/clouds.jpg')",
        rain: "url('./images/shower-rain2.jpg')",
        drizzle: "url('./images/rain-drops.jpg')",
        thunderstorm: "url('./images/lightning.jpg')",
        snow: "url('./images/snowing.jpg')",
        mist: "url('./images/mist.jpg')",
    }
})
