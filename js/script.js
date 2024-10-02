let apiMeteo = "https://api.meteo-concept.com/api/"
let token = "?token=3bf02307c9507740afd22f335bd933f37a124a0339002c93881295f35d3e3fdd"
let codeInsee = "14341";
let labtmax = document.getElementById("tmax");
let labtmin = document.getElementById("tmin");
let labville = document.getElementById("ville")
let labsoleil = document.getElementById("dSoleil")
let labpluie = document.getElementById("pPluie")
window.onload = afficheInfoMeteo;

async function recupInfoMeteo(){
    let info = apiMeteo + "forecast/daily/0" + token + "&insee=" + codeInsee;
    //console.log(info);
    try{
        const reponse = await fetch(info);
        const tabMeteo = await reponse.json();
        console.log(tabMeteo);
        return tabMeteo
    } catch (error){
        console.error("Erreur de requête : ", error);
        throw error;
    }
}

async function afficheInfoMeteo(){
    let meteo = await recupInfoMeteo();
    labville.textContent = meteo["city"]["name"];
    labtmin.textContent = meteo["forecast"]["tmin"]
    labtmax.textContent = meteo["forecast"]["tmax"]
    labsoleil.textContent = meteo["forecast"]["sun_hours"]
    labpluie.textContent = meteo["forecast"]["probarain"]
}

