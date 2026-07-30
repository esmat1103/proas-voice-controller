let currentLanguage = "fr";



// =====================================
// RECUPERER LANGUE DEPUIS ESP32
// =====================================


fetch("/get-settings")


.then(response => response.json())


.then(data => {



    if(data.language){


        currentLanguage = data.language;



        // sauvegarde locale

        localStorage.setItem(

            "language",

            currentLanguage

        );


    }



    applyLanguage();



})


.catch(error => {



    console.error(

        "Erreur récupération langue ESP32 :",

        error

    );



    // utiliser langue locale si ESP32 indisponible


    currentLanguage =

    localStorage.getItem("language")

    ||

    "fr";



    applyLanguage();



});








// =====================================
// APPLICATION TRADUCTION
// =====================================


function applyLanguage(){



    // Traduction textes


    document

    .querySelectorAll("[data-i18n]")

    .forEach(element => {



        let key =

        element.dataset.i18n;



        if(

        translations[currentLanguage]

        &&

        translations[currentLanguage][key]

        ){



            element.textContent =

            translations[currentLanguage][key];



        }



    });








    // Traduction placeholders


    document

    .querySelectorAll("[data-i18n-placeholder]")

    .forEach(element => {



        let key =

        element.dataset.i18nPlaceholder;



        if(

        translations[currentLanguage]

        &&

        translations[currentLanguage][key]

        ){



            element.placeholder =

            translations[currentLanguage][key];



        }



    });








    // Traduction titre navigateur


    document

    .querySelectorAll("title[data-i18n]")

    .forEach(element => {



        let key =

        element.dataset.i18n;



        if(

        translations[currentLanguage]

        &&

        translations[currentLanguage][key]

        ){



            element.textContent =

            translations[currentLanguage][key];



        }



    });



}