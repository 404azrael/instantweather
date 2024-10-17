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

let forecast;


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

        for(let i = 0; i < ndays.value; i++){
            let card = document.createElement("div");
            
            let cityCard = document.createElement("div");
            let tMinCard = document.createElement("div");
            let tMaxCard = document.createElement("div");
            let sunCard = document.createElement("div");
            let rainCard = document.createElement("div");
            let separator = document.createElement("div");

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
    
            cityCard.textContent = `Nom de la ville : ${data["city"]["name"]}`;
            tMinCard.textContent = `Température minimale : ${data["forecast"][i]["tmin"]}°C`;
            tMaxCard.textContent = `Température maximale : ${data["forecast"][i]["tmax"]}°C`;
            sunCard.textContent = `Ensoleillement : ${data["forecast"][i]["sun_hours"]}h`;
            rainCard.textContent = `Probabilité de pluie : ${data["forecast"][i]["probarain"]}%`;
            separator.textContent = "--------------------------------";

            let request = document.getElementById("request");
            let weather = document.getElementById("weather");
            
            weather.appendChild(card);
            card.appendChild(picIcon);
            card.appendChild(cityCard);
            card.appendChild(tMinCard);
            card.appendChild(tMaxCard);
            card.appendChild(sunCard);
            card.appendChild(rainCard);
            if (i != ndays.value - 1) {
                card.appendChild(separator);
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


    function getWeather(){
        
    }


});

