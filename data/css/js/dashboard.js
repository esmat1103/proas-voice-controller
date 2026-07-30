// =====================================
// AFFICHAGE UTILISATEUR CONNECTE ESP32
// =====================================


document.addEventListener(
"DOMContentLoaded",
function(){



fetch("/get-user")


.then(response=>response.json())


.then(data=>{


const usernameDisplay =

document.getElementById(
"username-display"
);



if(
usernameDisplay &&
data.username
){



usernameDisplay.textContent =

data.username.charAt(0).toUpperCase()

+

data.username.slice(1).toLowerCase();



}



})


.catch(error=>{


console.error(

"Erreur récupération utilisateur ESP32 :",

error

);



});



});




// =====================================
// STATISTIQUES COMMANDES
// =====================================


const TOTAL_COMMANDES = 13;




function actualiserStatistiques(){



fetch("/commandes")


.then(response=>response.json())


.then(commandes=>{



let commandesApprises =


commandes.filter(


cmd=>cmd.voiceSaved === true


).length;



let commandesRestantes =


TOTAL_COMMANDES - commandesApprises;





const total =

document.getElementById(
"totalCommandes"
);



const enregistrees =

document.getElementById(
"commandesEnregistrees"
);



const nonEnregistrees =

document.getElementById(
"commandesNonEnregistrees"
);





if(total)

total.textContent =
TOTAL_COMMANDES;



if(enregistrees)

enregistrees.textContent =
commandesApprises;



if(nonEnregistrees)

nonEnregistrees.textContent =
commandesRestantes;



})


.catch(error=>{


console.error(

"Erreur récupération commandes ESP32 :",

error

);



});



}




// =====================================
// CHARGEMENT INITIAL
// =====================================


actualiserStatistiques();