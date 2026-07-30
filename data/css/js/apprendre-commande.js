const lang =
localStorage.getItem("language") || "fr";


const tableBody =
document.querySelector("#commandTable tbody");


let commandes = [];

let selectedCommand = "";


// ======================================
// CHARGER COMMANDES ESP32
// ======================================


fetch("/commandes")

.then(response => response.json())

.then(data => {

    commandes = data;


    return fetch("/selected-command");


})


.then(response => response.json())


.then(data => {


    selectedCommand = data.command;


    if(selectedCommand){


        let existe = commandes.find(

            c => c.nom === selectedCommand

        );


        if(!existe){


            commandes.push({

                nom:selectedCommand,

                codeIR:"En attente",

                voiceSaved:false

            });


        }


    }


    afficherTable();


})

.catch(error=>{

console.log(
"Erreur chargement commandes :",
error
);

});





// ======================================
// AFFICHAGE TABLEAU
// ======================================


function afficherTable(){


tableBody.innerHTML="";



commandes.forEach((cmd,index)=>{



let tr=document.createElement("tr");



let lang =
localStorage.getItem("language") || "fr";



tr.innerHTML = `


<td>

<strong>${cmd.nom}</strong>

</td>



<td class="ir-code">

${
cmd.codeIR === "En attente"

?

translations[lang].irWaiting

:

cmd.codeIR

}

</td>




<td class="actions-cell">



<button

class="voice-record-btn"

title="${translations[lang].recordCommand}"

>

<i class="bi bi-mic-fill"></i>

</button>




<button

class="edit-btn"

title="${translations[lang].edit}"

>

<i class="bi bi-pencil-fill"></i>

</button>





<button

class="delete-btn"

title="${translations[lang].delete}"

>

<i class="bi bi-trash-fill"></i>

</button>



</td>


`;




// ===============================
// BOUTON MICRO
// ===============================


let recording=false;



const micButton =

tr.querySelector(".voice-record-btn");



const deleteButton =

tr.querySelector(".delete-btn");





micButton.addEventListener("click",()=>{


if(!recording){



recording=true;



micButton.classList.add(
"recording"
);



micButton.innerHTML=

`

<i class="bi bi-stop-fill"></i>

`;



envoyerStartRecording(cmd.nom);



}

else{



recording=false;



micButton.classList.remove(
"recording"
);



micButton.innerHTML=

`

<i class="bi bi-mic-fill"></i>

`;



envoyerStopRecording(cmd.nom);



}



});





// ===============================
// SUPPRESSION COMMANDE
// ===============================


deleteButton.addEventListener("click",()=>{



if(

!confirm(

translations[lang].deleteConfirm

)

){

return;

}



fetch("/delete-commande",

{


method:"POST",


headers:

{

"Content-Type":"application/json"

},


body:JSON.stringify({

nom:cmd.nom

})


})


.then(response=>response.json())


.then(data=>{


if(data.success){



commandes = commandes.filter(

c=>c.nom !== cmd.nom

);



afficherTable();


}



});



});




tableBody.appendChild(tr);



});


}





// ======================================
// RECEVOIR CODE IR ESP32
// ======================================


function recevoirCodeIR(code){



let cmd = commandes.find(

c=>c.nom===selectedCommand

);



if(cmd){



cmd.codeIR = code;



fetch("/save-commande",

{


method:"POST",


headers:

{

"Content-Type":"application/json"

},


body:JSON.stringify({


nom:cmd.nom,


codeIR:cmd.codeIR,


voiceSaved:cmd.voiceSaved


})


})


.then(response=>response.json())


.then(()=>{


afficherTable();


});



}



}





// ======================================
// DEMARRER APPRENTISSAGE VOIX ESP32
// ======================================


function envoyerStartRecording(nom){



console.log(

"Début enregistrement :",

nom

);



fetch("/voice-command",

{


method:"POST",


headers:

{

"Content-Type":"application/json"

},


body:JSON.stringify({


action:"start_record_voice",


button:nom


})


})


.then(response=>response.json())


.then(data=>{


console.log(
"ESP32 :",
data
);


})


.catch(error=>{


console.log(
"Erreur ESP32 :",
error
);


});



}





// ======================================
// ARRETER APPRENTISSAGE VOIX ESP32
// ======================================


function envoyerStopRecording(nom){



console.log(

"Fin enregistrement :",

nom

);



fetch("/voice-command",

{


method:"POST",


headers:

{

"Content-Type":"application/json"

},


body:JSON.stringify({


action:"stop_record_voice",


button:nom


})


})


.then(response=>response.json())


.then(data=>{


console.log(

"ESP32 :",

data

);


})


.catch(error=>{


console.log(

"Erreur ESP32 :",

error

);


});



}