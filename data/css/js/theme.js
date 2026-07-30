// =========================================
// THEME GLOBAL DEPUIS ESP32
// =========================================


function appliquerTheme(theme){



    if(theme === "dark"){



        document.documentElement.classList.add(
            "dark-mode"
        );



    }

    else{



        // supprimer le mode sombre

        document.documentElement.classList.remove(
            "dark-mode"
        );



    }



}







// =========================================
// CHARGEMENT THEME AU DEMARRAGE
// =========================================



fetch("/get-settings")


.then(response => response.json())


.then(data => {



    if(data.theme){



        appliquerTheme(
            data.theme
        );



    }

    else{


        // thème par défaut

        appliquerTheme(
            "light"
        );


    }



})


.catch(error=>{



    console.error(

        "Erreur chargement thème ESP32 :",

        error

    );



    // Si ESP32 inaccessible

    appliquerTheme(

        localStorage.getItem("theme")

        ||

        "light"

    );



});