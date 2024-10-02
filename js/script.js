const decoupURL = "https://geo.api.gouv.fr/communes?codePostal=" //add the post code at the end
const apitoken = "3bf02307c9507740afd22f335bd933f37a124a0339002c93881295f35d3e3fdd";

function dataRetrieve(){
    let postCode = document.getElementById("postcodeForm").elements["postcode"].value;
    let url = decoupURL + postCode;
}