const decoupURL = "https://geo.api.gouv.fr/communes?codePostal=" //add the post code at the end
const apitoken = "3bf02307c9507740afd22f335bd933f37a124a0339002c93881295f35d3e3fdd";
const pickedPostCode = document.getElementById("postcode");
const pickedCity = document.getElementById("pickedCity");
const submit = document.getElementById("submit");
let labTmax = document.getElementById("tmax");
let labTmin = document.getElementById("tmin");
let labCity = document.getElementById("city");
let labSun = document.getElementById("dSun");
let labRain = document.getElementById("pRain");
let ndays = document.getElementById("nDays");


//get checkbox
let latitude = document.getElementById("latitude");
let longitude = document.getElementById("longitude");
let rainfall = document.getElementById("rainfall");
let windSpeed = document.getElementById("windSpeed");
let windDirection = document.getElementById("windDirection");


let forecast;


//get the prev and next btn and hide them
let prevBtn = document.getElementById("prev");
let nextBtn = document.getElementById("next");
prevBtn.style.display = "none";
nextBtn.style.display = "none";
document.addEventListener("DOMContentLoaded", function () {


    async function fetchCities(postCode) {
        let url = decoupURL + postCode;
        try {
            const response = await fetch(url);
            const data = await response.json();
            console.table(data);
            return data;
        } catch (err) {
            console.error("Une rreur est surveune lors de la requête API. Erreur :", err);
            throw err;
        }
    }


    function displayCities(data) {
        pickedCity.innerHTML = "";
        data.forEach(city => {
            const option = document.createElement("option");
            option.value = city.code;
            option.textContent = city.nom;
            pickedCity.appendChild(option);
        });
        pickedCity.style.display = "block";
        submit.style.display = "block";

    }


    async function fetchWeatherByCity(city) {
        let url = "https://api.meteo-concept.com/api/forecast/daily?token=" + apitoken + "&insee=" + city;
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (err) {
            console.error("Une erreur est survenue lors de la requête API de récupération d'infos météo. Erreur :", err);
            throw err;
        }
    }

    pickedPostCode.addEventListener("input", async function () {
        let postCodeValue = pickedPostCode.value;
        pickedCity.style.display = "none";
        submit.style.display = "none";

        if (/^\d{5}$/.test(postCodeValue)) {
            try {
                let data = await fetchCities(postCodeValue);
                displayCities(data);
            } catch (err) {
                console.error("Une erreur est survenue lors de la recherche de commune. Erreur :", err);
                throw err;
            }
        }
    });



    submit.addEventListener("click", async function () {
        let pickedCityValue = pickedCity.value;
        if (pickedCityValue != null) {
            try {
                let data = await fetchWeatherByCity(pickedCityValue);
                createWeatherCard(data);
                console.log(data);
                forecast = data.forecast;
            } catch (err) {
                console.error("Une erreur est survenue lors de la recherche d'informations météo. Erreur :", err);
                throw err;
            }
        }
    });

    async function createWeatherCard(data) {
        let request = document.getElementById("request");
        let weather = document.getElementById("weather");

        //get the city infos div
        let cityInfo = document.getElementById("cityInfo");
        cityInfo.id = "cityName";

        //create a div for the city name
        let cityCard = document.createElement("div");
        cityCard.classList.add("city-card");
        cityCard.textContent = `${data["city"]["name"]}`;
        //add the div to the city infos card
        cityInfo.appendChild(cityCard);

        //lat and long card
        let latLongCard = document.createElement("div");
        latLongCard.classList.add("lat-lon-card");
        //latitude is check
        if(latitude.checked){
            let latitudeCard = document.createElement("div");
            latitudeCard.classList.add("lat-lon-item");
            latitudeCard.textContent = `Latitude :  ${data["city"]["latitude"]}`;
            latLongCard.appendChild(latitudeCard);
        }

        //longitude is check
        if(longitude.checked){
            let longitudeCard = document.createElement("div");
            longitudeCard.classList.add("lat-lon-item");
            longitudeCard.textContent = `Longitude :  ${data["city"]["longitude"]}`;
            latLongCard.appendChild(longitudeCard);
        }
        //
        cityInfo.appendChild(latLongCard);

        for(let i = 0; i < ndays.value; i++){
            let card = document.createElement("div");
            card.className = "weatherCard";
            
            
            let tMinCard = document.createElement("div");
            let tMaxCard = document.createElement("div");
            let sunCard = document.createElement("div");
            let rainCard = document.createElement("div");

            let meteo = data.forecast[i].weather;
            let picIcon = document.createElement("img");
            if (meteo == 0){
                //soleil
                picIcon.src = "ressources/animated/day.svg";
            } else if (meteo >= 3 && meteo <= 5){
                //nuages
                picIcon.src = "ressources/animated/cloudy.svg";
            } else if (meteo >= 10 && meteo <= 16){
                //pluie
                picIcon.src = "ressources/animated/rainy-1.svg";
            } else if (meteo >= 20 && meteo <= 32){
                //neige
                picIcon.src = "ressources/animated/snowy-1.svg";
            } else if (meteo >= 40 && meteo <= 48){
                //averse
                picIcon.src = "ressources/animated/rainy-6.svg";
            } else if (meteo >= 60 && meteo <= 78){
                //averse neige
                picIcon.src = "ressources/animated/snowy-6.svg";
            } else if (meteo >= 100 && meteo <= 138){
                //orage
                picIcon.src = "ressources/animated/thunder.svg";
            }
    
            //add the info in each div
            tMinCard.textContent = `Température minimale : ${data["forecast"][i]["tmin"]}°C`;
            tMaxCard.textContent = `Température maximale : ${data["forecast"][i]["tmax"]}°C`;
            sunCard.textContent = `Ensoleillement : ${data["forecast"][i]["sun_hours"]}h`;
            rainCard.textContent = `Probabilité de pluie : ${data["forecast"][i]["probarain"]}%`;

            //rainfall is check
            if(rainfall.checked){
                let rainfallCard = document.createElement("div");
                rainfallCard.textContent = `cumul de pluie sur la journee en mm :  ${data["forecast"][i]["rr10"]}`;
                card.appendChild(rainfallCard);
            }

            //windSpeed is check
            if(windSpeed.checked){
                let windSpeedCard = document.createElement("div");
                windSpeedCard.textContent = `Vent moyen à 10 mètres en km/h :  ${data["forecast"][i]["wind10m"]}`;
                card.appendChild(windSpeedCard);
            }

            //windDirection is check
            if(windDirection.checked){
                let windDirectionCard = document.createElement("div");
                windDirectionCard.textContent = `Direction du vent en degrés (0 à 360°) :  ${data["forecast"][i]["dirwind10m"]}`;
                card.appendChild(windDirectionCard);
            }

            //add the element to the card
            card.appendChild(picIcon);
            card.appendChild(tMinCard);
            card.appendChild(tMaxCard);
            card.appendChild(sunCard);
            card.appendChild(rainCard);

            //add the card to the weather section
            weather.appendChild(card);
            
        }

        
        

        let newSearchButton = document.createElement("div");
        newSearchButton.textContent = "Nouvelle recherche";
        newSearchButton.classList.add("newSearchButton");
        document.body.appendChild(newSearchButton);

        newSearchButton.addEventListener("click", function () {
            window.location.reload();
        });


        request.style.display = "none";
        weather.style.display = "block";
    }

});

