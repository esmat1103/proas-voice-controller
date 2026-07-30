console.log("JS apprentissage chargé");


// =====================================
// CLICK SUR BOUTON APPRENTISSAGE
// =====================================

document.querySelectorAll(".learn-button")
.forEach(button => {


button.addEventListener("click",()=>{


console.log(
"bouton choisi :",
button.dataset.command
);



fetch("/save-selected-command",
{

method:"POST",

headers:
{
"Content-Type":"application/json"
},

body:JSON.stringify({

command:button.dataset.command

})

})


.then(response=>response.json())


.then(()=>{


window.location.href =
"apprendre-commande.html";


});


});


});




// =====================================
// CHANGER ETAT BOUTON
// =====================================

function mettreAJourEtatBouton(command, appris){



const bouton =
document.querySelector(
`[data-command="${command}"]`
);



if(!bouton)
return;



bouton.classList.remove(
"appris",
"non-appris"
);



bouton.classList.add(

appris
?
"appris"
:
"non-appris"

);





fetch("/save-commande",
{

method:"POST",

headers:
{
"Content-Type":"application/json"
},


body:JSON.stringify({

nom:command,

codeIR:"En attente",

voiceSaved:appris

})

})


.then(response=>response.json())


.then(data=>{


console.log(
"Commande enregistrée ESP32 :",
data
);


})


.catch(error=>{


console.error(
"Erreur ESP32 :",
error
);


});



calculerStatistiques();


}





// =====================================
// RESTAURATION ETATS BOUTONS
// =====================================


function restaurerEtatBoutons(){


fetch("/commandes")


.then(response=>response.json())


.then(commandes=>{


document.querySelectorAll(".learn-button")

.forEach(button=>{


let cmd =
commandes.find(

c=>c.nom===button.dataset.command

);



button.classList.remove(

"appris",

"non-appris"

);



if(cmd && cmd.voiceSaved===true)

{


button.classList.add(
"appris"
);


}

else{


button.classList.add(
"non-appris"
);


}



});


})


.catch(error=>{


console.error(

"Erreur chargement ESP32 :",

error

);


});


}





// =====================================
// STATISTIQUES
// =====================================


function calculerStatistiques(){



const TOTAL_COMMANDES=13;



fetch("/commandes")


.then(response=>response.json())


.then(commandes=>{


let commandesApprises =

commandes.filter(

cmd=>cmd.voiceSaved===true

).length;



let commandesRestantes =

TOTAL_COMMANDES-commandesApprises;



let total =
document.getElementById(
"totalCommandes"
);


let appris =
document.getElementById(
"commandesApprises"
);



let restant =
document.getElementById(
"commandesRestantes"
);



if(total)

total.textContent =
TOTAL_COMMANDES;



if(appris)

appris.textContent =
commandesApprises;



if(restant)

restant.textContent =
commandesRestantes;



});


}





// =====================================
// TEST RECEPTION ESP32
// =====================================

function recevoirESP32(data){



console.log(
"Données ESP32 reçues :",
data
);



data.command =
data.command
.trim()
.toLowerCase();




const commandesAutorisees=[


"power",
"back",
"channel-up",
"channel-down",
"up",
"down",
"left",
"right",
"ok",
"volume-up",
"volume-down",
"exit",
"home"


];




if(
!commandesAutorisees.includes(data.command)

){


console.error(
"Commande refusée :",
data.command
);


return;

}





if(
typeof data.voiceSaved !== "boolean"

){


console.error(
"Etat vocal invalide"
);


return;

}





if(!data.codeIR)

{


console.error(
"Code IR absent"
);


return;


}






fetch("/save-commande",
{


method:"POST",


headers:
{
"Content-Type":"application/json"
},


body:JSON.stringify({

nom:data.command,

codeIR:data.codeIR,

voiceSaved:data.voiceSaved

})


})


.then(response=>response.json())


.then(result=>{


console.log(

"Commande sauvegardée ESP32 :",

result

);


mettreAJourEtatBouton(

data.command,

data.voiceSaved

);


})


.catch(error=>{


console.error(
"Erreur sauvegarde :",
error
);


});



}





// =====================================
// DEMARRAGE PAGE
// =====================================


restaurerEtatBoutons();

calculerStatistiques();



// accessible console navigateur

window.mettreAJourEtatBouton =
mettreAJourEtatBouton;


window.recevoirESP32 =
recevoirESP32;