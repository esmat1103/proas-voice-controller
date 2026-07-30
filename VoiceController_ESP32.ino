#include <WiFi.h>
#include <WebServer.h>
#include <ArduinoJson.h>
#include "LittleFS.h"


const char* ssid = "VoiceController_ESP32";
const char* password = "12345678";


WebServer server(80);


// =======================
// DONNEES SIMULEES
// =======================


String utilisateur = "";


String selectedCommand = "";


JsonDocument settings;

JsonDocument commandes;


void setup() {


  Serial.begin(115200);


  // LittleFS

  if (!LittleFS.begin(true)) {

    Serial.println("Erreur LittleFS");

  }


  // WiFi ESP32

  WiFi.softAP(
    ssid,
    password
  );


  Serial.println(
    WiFi.softAPIP()
  );


  // Paramètres par défaut

  settings["theme"] = "light";
  settings["language"] = "fr";


  // Commandes par défaut

  JsonArray array = commandes.to<JsonArray>();


  JsonObject c1 = array.createNestedObject();
  c1["nom"] = "power";
  c1["codeIR"] = "En attente";
  c1["voiceSaved"] = false;


  JsonObject c2 = array.createNestedObject();
  c2["nom"] = "ok";
  c2["codeIR"] = "En attente";
  c2["voiceSaved"] = false;


  JsonObject c3 = array.createNestedObject();
  c3["nom"] = "home";
  c3["codeIR"] = "En attente";
  c3["voiceSaved"] = false;



  // =======================
  // TEST
  // =======================


  server.on("/test", HTTP_GET, []() {

    server.send(
      200,
      "application/json",
      "{\"message\":\"ESP32 OK\"}"
    );

  });


  // =======================
  // GET USER
  // =======================


  server.on("/get-user", HTTP_GET, []() {

    DynamicJsonDocument doc(256);

    doc["username"] = utilisateur;


    String response;

    serializeJson(doc, response);


    server.send(
      200,
      "application/json",
      response
    );


  });





  // =======================
  // LOGOUT
  // =======================

  server.on("/logout", HTTP_GET, []() {

    utilisateur = "";


    server.send(
      200,
      "application/json",
      "{\"success\":true}"
    );

  });

  // =======================
  // GET COMMANDES
  // =======================

  server.on("/commandes", HTTP_GET, []() {


    String json;


    serializeJson(
      commandes,
      json
    );


    server.send(
      200,
      "application/json",
      json
    );


  });


  // =======================
  // SAVE COMMANDE
  // =======================

  server.on("/save-commande", HTTP_POST, []() {


    DynamicJsonDocument cmd(256);


    deserializeJson(
      cmd,
      server.arg("plain")
    );


    String nom = cmd["nom"];



    JsonArray array = commandes.as<JsonArray>();


    bool trouve = false;



    for (JsonObject c : array)
    {

      if (c["nom"] == nom)
      {

        c["codeIR"] = cmd["codeIR"];

        c["voiceSaved"] = cmd["voiceSaved"];

        trouve = true;

      }

    }



    if (!trouve)
    {

      JsonObject nouveau =
        array.createNestedObject();


      nouveau["nom"] = cmd["nom"];

      nouveau["codeIR"] = cmd["codeIR"];

      nouveau["voiceSaved"] = cmd["voiceSaved"];

    }



    server.send(
      200,
      "application/json",
      "{\"success\":true}"
    );


  });



  // =======================
  // DELETE COMMANDE
  // =======================

  server.on("/delete-commande", HTTP_POST, []() {


    DynamicJsonDocument req(256);


    deserializeJson(
      req,
      server.arg("plain")
    );


    String nom = req["nom"];



    JsonArray array = commandes.as<JsonArray>();


    for (int i = array.size() - 1; i >= 0; i--)
    {

      if (array[i]["nom"] == nom)
      {

        array.remove(i);

      }

    }



    server.send(
      200,
      "application/json",
      "{\"success\":true}"
    );


  });


  // =======================
  // SAVE SELECTED COMMAND
  // =======================

  server.on("/save-selected-command", HTTP_POST, []() {


    DynamicJsonDocument request(256);


    deserializeJson(
      request,
      server.arg("plain")
    );



    selectedCommand =
      request["command"].as<String>();



    server.send(
      200,
      "application/json",
      "{\"success\":true}"
    );


  });






  // =======================
  // GET SELECTED COMMAND
  // =======================

  server.on("/selected-command", HTTP_GET, []() {


    DynamicJsonDocument response(256);


    response["command"] =
      selectedCommand;



    String json;


    serializeJson(
      response,
      json
    );


    server.send(
      200,
      "application/json",
      json
    );


  });




  // =======================
  // GET SETTINGS
  // =======================

  server.on("/get-settings", HTTP_GET, []() {


    String json;


    serializeJson(
      settings,
      json
    );


    server.send(
      200,
      "application/json",
      json
    );


  });



  // =======================
  // SAVE SETTINGS
  // =======================

  server.on("/save-settings", HTTP_POST, []() {


    DynamicJsonDocument request(256);


    deserializeJson(
      request,
      server.arg("plain")
    );



    if (request.containsKey("theme"))
    {

      settings["theme"] =
        request["theme"];

    }



    if (request.containsKey("language"))
    {

      settings["language"] =
        request["language"];

    }



    server.send(
      200,
      "application/json",
      "{\"success\":true}"
    );


  });



  // =======================
  // IMPORT DATA
  // =======================

  server.on("/import-data", HTTP_POST, []() {


    DynamicJsonDocument data(4096);


    deserializeJson(
      data,
      server.arg("plain")
    );



    if (data.containsKey("commandes"))
    {

      commandes.clear();


      commandes =
        data["commandes"];

    }



    if (data.containsKey("settings"))
    {

      settings =
        data["settings"];

    }



    server.send(
      200,
      "application/json",
      "{\"success\":true,\"message\":\"Import reussi\"}"
    );


  });


  server.on("/login", HTTP_POST, []() {

    DynamicJsonDocument request(256);

    deserializeJson(
      request,
      server.arg("plain")
    );


    String username =
      request["username"];


    String password =
      request["password"];



    DynamicJsonDocument response(256);



    if (username == "iris" && password == "78910")
    {

      utilisateur = username;


      response["success"] = true;

    }

    else
    {

      response["success"] = false;

    }
   

    String json;

    serializeJson(
      response,
      json
    );


    server.send(
      200,
      "application/json",
      json
    );


  });



  server.begin();

  Serial.println("Serveur ESP32 actif");

}   // <-- fermeture de setup



// =======================
// LOOP
// =======================

void loop()
{

  server.handleClient();

}