// =========================================
// CHANGEMENT THEME ESP32
// =========================================


const darkMode =

document.getElementById("darkMode");





if(darkMode){



// récupérer état actuel depuis ESP32


fetch("/get-settings")


.then(response=>response.json())


.then(data=>{



darkMode.checked =

data.theme === "dark";



})


.catch(error=>{


console.error(

"Erreur récupération thème ESP32 :",

error

);


});






darkMode.addEventListener(

"change",

function(){



let theme =

this.checked

?

"dark"

:

"light";






// appliquer immédiatement


if(theme==="dark"){



document.documentElement.classList.add(

"dark-mode"

);



}

else{



document.documentElement.classList.remove(

"dark-mode"

);



}







// sauvegarder dans ESP32


fetch("/save-settings",

{


method:"POST",


headers:

{

"Content-Type":

"application/json"

},



body:JSON.stringify({

theme:theme

})




})


.then(response=>response.json())


.then(data=>{


console.log(

"Thème sauvegardé ESP32 :",

data

);


})


.catch(error=>{


console.error(

"Erreur sauvegarde thème ESP32 :",

error

);


});



});



}









// =========================================
// CHANGEMENT LANGUE ESP32
// =========================================



const language =

document.getElementById("language");





if(language){





// récupérer langue depuis ESP32


fetch("/get-settings")


.then(response=>response.json())


.then(data=>{



if(data.language){


language.value =

data.language;


}



})



.catch(error=>{


console.error(

"Erreur récupération langue ESP32 :",

error

);


});









language.addEventListener(

"change",

function(){





fetch("/save-settings",

{


method:"POST",


headers:

{

"Content-Type":

"application/json"

},



body:JSON.stringify({

language:this.value

})



})



.then(response=>response.json())


.then(data=>{


console.log(

"Langue sauvegardée ESP32 :",

data

);


})



.catch(error=>{


console.error(

"Erreur sauvegarde langue ESP32 :",

error

);


});







// appliquer directement


currentLanguage =

this.value;



applyLanguage();





});



}