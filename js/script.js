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
let latitue = document.getElementById("latitude");
let longitude = document.getElementById("longitude");
let rainfall = document.getElementById("rainfall");
let windSpeed = document.getElementById("windSpeed");
let windDirection = document.getElementById("windDirection");


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
        console.log(pickedCityValue);
        if (pickedCityValue != null) {
            try {
                let data = await fetchWeatherByCity(pickedCityValue);
                createWeatherCard(data);
                console.table(data);
            } catch (err) {
                console.error("Une erreur est survenue lors de la recherche d'informations météo. Erreur :", err);
                throw err;
            }
        }
    });

    async function createWeatherCard(data) {
        let cityInfo = document.getElementById("cityInfo");
        cityInfo.id = "cityName";
        let cityCard = document.createElement("div");
        cityCard.textContent = `Nom de la ville : ${data["city"]["name"]}`;
        cityInfo.appendChild(cityCard);

        //latitude is check
        if(latitue.checked){
            let latitudeCard = document.createElement("div");
            latitudeCard.textContent = `Latitude :  ${data["city"]["latitude"]}`;
            cityInfo.appendChild(latitudeCard);
        }

        //longitude is check
        if(longitude.checked){
            let longitudeCard = document.createElement("div");
            longitudeCard.textContent = `longitude :  ${data["city"]["longitude"]}`;
            cityInfo.appendChild(longitudeCard);
        }

        for(let i = 0; i < ndays.value; i++){
            let card = document.createElement("div");
            card.className = "weatherCard";
            
            
            let tMinCard = document.createElement("div");
            let tMaxCard = document.createElement("div");
            let sunCard = document.createElement("div");
            let rainCard = document.createElement("div");
            let separator = document.createElement("div");
    
            tMinCard.textContent = `Température minimale : ${data["forecast"][i]["tmin"]}°C`;
            tMaxCard.textContent = `Température maximale : ${data["forecast"][i]["tmax"]}°C`;
            sunCard.textContent = `Ensoleillement : ${data["forecast"][i]["sun_hours"]}h`;
            rainCard.textContent = `Probabilité de pluie : ${data["forecast"][i]["probarain"]}%`;
            separator.textContent = "--------------------------------";

            let request = document.getElementById("request");
            let weather = document.getElementById("weather");
            
            weather.appendChild(card);
            card.appendChild(tMinCard);
            card.appendChild(tMaxCard);
            card.appendChild(sunCard);
            card.appendChild(rainCard);

            

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

