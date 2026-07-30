// =====================================
// PROTECTION DES PAGES ESP32
// =====================================


fetch("/get-user")

.then(response => response.json())


.then(data => {


    if(!data.username){


        window.location.href="index.html";


    }


})


.catch(error=>{


    console.error(
        "Erreur connexion ESP32 :",
        error
    );


});





// =====================================
// DECONNEXION ESP32
// =====================================


function logout(){



    fetch("/logout")

    .then(response=>response.json())


    .then(data=>{


        if(data.success){



            // supprimer informations locales

            localStorage.removeItem(
                "isLogged"
            );


            localStorage.removeItem(
                "username"
            );



            // retour page connexion

            window.location.href =
            "index.html";


        }


    })


    .catch(error=>{


        console.error(
            "Erreur déconnexion :",
            error
        );


    });


}