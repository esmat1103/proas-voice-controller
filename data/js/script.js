/* =========================================
   ELEMENTS HTML
========================================= */


const passwordInput =

document.getElementById("password");



const togglePassword =

document.getElementById("togglePassword");



const eyeIcon =

document.getElementById("eyeIcon");





/* =========================================
   AFFICHER / CACHER MOT DE PASSE
========================================= */


if(togglePassword){



togglePassword.addEventListener(

"click",

function(){



if(passwordInput.type === "password"){



passwordInput.type = "text";



eyeIcon.className =
"bi bi-eye";



}


else{



passwordInput.type = "password";



eyeIcon.className =
"bi bi-eye-slash";



}



}

);



}







/* =========================================
   FORMULAIRE CONNEXION ESP32
========================================= */


const loginForm =

document.getElementById("loginForm");





if(loginForm){



loginForm.addEventListener(

"submit",

function(event){



event.preventDefault();





const username =


document

.getElementById("username")

.value

.trim();





const password =


document

.getElementById("password")

.value

.trim();







if(

username === "" ||

password === ""

){



alert(

"Veuillez remplir tous les champs."

);



return;



}







// Envoi vers ESP32


fetch("/login",

{


method:"POST",


headers:

{

"Content-Type":

"application/json"

},



body:JSON.stringify({

username:username,

password:password

})



})



.then(response=>response.json())



.then(data=>{





if(data.success){





// sauvegarde locale


localStorage.setItem(

"isLogged",

"true"

);



localStorage.setItem(

"username",

username

);






// page ESP32


window.location.href =

"dashboard.html";



}




else{



alert(

"Identifiant ou mot de passe incorrect."

);



}




})



.catch(error=>{



console.error(

"Erreur serveur ESP32 :",

error

);



alert(

"ESP32 inaccessible."

);



});



}



);



}









/* =========================================
   DECONNEXION ESP32
========================================= */


function logout(){



fetch("/logout")



.then(response=>response.json())



.then(data=>{



if(data.success){



localStorage.removeItem(

"isLogged"

);



localStorage.removeItem(

"username"

);



window.location.href =

"index.html";



}



})



.catch(error=>{



console.error(

"Erreur déconnexion ESP32 :",

error

);



});



}