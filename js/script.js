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
        let url = "https://api.meteo-concept.com/api/forecast/daily/0?token=" + apitoken + "&insee=" + city;
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
        let tMinCard = document.createElement("div");
        let tMaxCard = document.createElement("div");
        let sunCard = document.createElement("div");
        let rainCard = document.createElement("div");

        tMinCard.textContent = `Température minimale : ${data["forecast"]["tmin"]}°C`;
        tMaxCard.textContent = `Température maximale : ${data["forecast"]["tmax"]}°C`;
        sunCard.textContent = `Ensoleillement : ${data["forecast"]["sun_hours"]}h`;
        rainCard.textContent = `Probabilité de pluie : ${data["forecast"]["probarain"]}%`;

        let request = document.getElementById("request");
        let weather = document.getElementById("weather");

        weather.appendChild(tMinCard);
        weather.appendChild(tMaxCard);
        weather.appendChild(sunCard);
        weather.appendChild(rainCard);

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

