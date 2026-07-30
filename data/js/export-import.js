// =========================================
// EXPORT / IMPORT DES DONNEES ESP32
// =========================================



// Boutons

const exportButton =
document.getElementById("exportData");


const importButton =
document.getElementById("importData");


const importFile =
document.getElementById("importFile");





// =========================================
// EXPORT JSON DEPUIS ESP32
// =========================================


if(exportButton){


exportButton.addEventListener(
"click",
()=>{


Promise.all([


fetch("/commandes")

.then(response=>response.json()),



fetch("/get-settings")

.then(response=>response.json())



])


.then(result=>{



let sauvegarde = {


commandes:
result[0],



settings:
result[1]



};





let fichier =

new Blob(


[

JSON.stringify(

sauvegarde,

null,

4

)

],


{

type:"application/json"

}


);





let lien =

document.createElement("a");





lien.href =

URL.createObjectURL(fichier);





lien.download =

"voice-controller-backup.json";





lien.click();





})


.catch(error=>{


console.error(

"Erreur export ESP32 :",

error

);


});



});


}





// =========================================
// OUVRIR SELECTEUR FICHIER IMPORT
// =========================================


if(importButton){



importButton.addEventListener(

"click",

()=>{


importFile.click();


});


}







// =========================================
// IMPORT JSON VERS ESP32
// =========================================


if(importFile){



importFile.addEventListener(

"change",

function(){



let fichier =

this.files[0];



if(!fichier)

return;





let lecteur =

new FileReader();





lecteur.onload =

function(e){



let donnees;



try{


donnees =

JSON.parse(

e.target.result

);



}

catch(error){


alert(
"Fichier JSON invalide"
);


return;


}





console.log(

"Données importées :",

donnees

);






fetch("/import-data",

{


method:"POST",


headers:

{

"Content-Type":

"application/json"

},



body:

JSON.stringify(donnees)



})


.then(response=>response.json())


.then(result=>{



console.log(

"Réponse ESP32 :",

result

);



alert(

"Import terminé"

);



location.reload();



})


.catch(error=>{



console.error(

"Erreur import ESP32 :",

error

);



});



};





lecteur.readAsText(fichier);



});



}