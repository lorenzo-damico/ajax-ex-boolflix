// Milestone 1
// Creare un layout base con una searchbar (una input e un button) in cui
// possiamo scrivere completamente o parzialmente il nome di un film.
// Possiamo, cliccando il bottone, cercare sull’API tutti i film che contengono
// ciò che ha scritto l’utente.
// Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori
// per ogni film trovato:
// 1. Titolo
// 2. Titolo Originale
// 3. Lingua
// 4. Voto

$(document).ready(function () {

  // FUNZIONI

  // FUNZIONE DI PULIZIA DEL CAMPO INPUT E DELLE LISTE FILM E SERIE.
  function resetSearch() {

    // Svuoto la lista di film e serie.
    $("#movies-list").html("");
    $("#series-list").html("");

    // Pulisco il campo di input.
    $("#search-media").val("");
  }

  // FUNZIONE CHE DEFINISCE LA BANDIERINA DELLA LINGUA.
  function flagGenerator(languageProperty) {

    if (bandierePresenti.includes(languageProperty)) {
      return "img/"+ languageProperty + ".png";

    // Altrimenti definisco una bandiera trasparente.
    } else {
      return "img/trasparente.png";
    }

  }
  // FUNZIONE CHE CONVERTE IL VOTO IN STELLINE.
  function voteConversion(mediaObject) {

    // Salvo il voto in una variabile.
    var voto = mediaObject.vote_average;

    // Converto il voto in scala da 1 a 5 arrotondando per eccesso.
    var votoArrotondato = Math.ceil(voto / 2);

    // Con un ciclo stampo un numero di stelle piene pari al voto.
    var stelline = "";
    for (var i = 0; i < votoArrotondato; i++) {
      stelline += '<i class="fas fa-star"></i>';
    }

    // Con un ciclo stampo un numero di stelle vuote pari alle rimanenti
    // per arrivare a 5.
    for (var i = 0; i < (5 - votoArrotondato); i++) {
      stelline += '<i class="far fa-star"></i>';
    }
    return stelline;
  }

  // FUNZIONE CHE STAMPA A SCHERMO I RISULTATI DI UNA RICHIESTA.
  function renderMedia(arrayDatabase, sezioneMedia) {

    // Genero il template con handlebars.
    var source = $("#media-template").html();
    var template = Handlebars.compile(source);

    // Eseguo un ciclo sull'array dei media per stamparli a schermo.
    for (var i = 0; i < arrayDatabase.length; i++) {

      // Genero la bandierina da associare alla lingua.
      var bandieraLingua = flagGenerator(arrayDatabase[i].original_language);

      // Converto il voto in quinti e genero le stelle.
      var votoStellato = voteConversion(arrayDatabase[i]);

      // Genero l'oggetto context da stampare.
      var context = {
        "title": arrayDatabase[i].title,
        "name": arrayDatabase[i].name,
        "original_title": arrayDatabase[i].original_title,
        "original_name": arrayDatabase[i].original_name,
        "original_language": arrayDatabase[i].original_language,
        "flag_icon": bandieraLingua,
        "vote_average": arrayDatabase[i].vote_average / 2,
        "voto_stellato": votoStellato
      };

      // Compilo il template e lo aggiungo nella sezione media.
      var html = template(context);
      sezioneMedia.append(html);
    }
  }

  // FUNZIONE DI RICERCA E STAMPA DEI MEDIA.
  function getMedia(search, endpointMedia, sezioneMedia) {

    // Effettuo la chiamata ajax all'API del movie database, per ottenere
    // le schede dei media.
    $.ajax(
      {
        "url": endpointMedia,
        "data": {
          "api_key": "04bbabd51c895f6f8040168aa7e1cd41",
          "query": search,
          "language": "it-IT",
          "include_adult": false
        },
        "method": "GET",
        "success": function (data) {

          // Salvo la lista dei media in un array.
          var listaMedia = data.results;

          // Eseguo la funzione di stampa.
          renderMedia(listaMedia, sezioneMedia);

        },
        "error": function (err) {
          alert("Errore!");
        }
      }
    );
  }


  // FINE FUNZIONI


  // CODICE

  // Definisco un array contenente le bandiere disponibili.
  var bandierePresenti = ["en", "it", "de", "es", "fr", "ja"];

  // Definisco un endpoint per i film e uno per le serie.
  var endpointFilm = "https://api.themoviedb.org/3/search/movie";
  var endpointSerie = "https://api.themoviedb.org/3/search/tv";

  // Definisco la sezione dei film e quella delle serie.
  var sezioneFilm = $("#movies-list");
  var sezioneSerie = $("#series-list");

  // FINE CODICE


  // EVENTI

  // 1. Aggiungo un evento al click sul bottone.
  $("#search-button").click(
    function () {

      // Creo una variabile con il contenuto dell'input.
      var searchInput = $("#search-media").val();

      if (searchInput != "") {

        // Pulisco input e liste.
        resetSearch();

        // Uso la funzione di ricerca e stampa dei risultati dei film.
        getMedia(searchInput, endpointFilm, sezioneFilm);

        // Uso la funzione di ricerca e stampa dei risultati delle serie.
        getMedia(searchInput, endpointSerie, sezioneSerie);
      }
    }
  );

  // 2. Aggiungo un evento alla pressione del tasto invio.
  $("#search-media").keyup(
    function () {

      // Se premo il tasto invio, cerco e stampo.
      if (event.which == 13) {

        // Creo una variabile con il contenuto dell'input.
        var searchInput = $("#search-media").val();

        if (searchInput != "") {

          // Pulisco input e lista.
          resetSearch();

          // Uso la funzione di ricerca e stampa dei risultati.
          getMedia(searchInput, endpointFilm, sezioneFilm);

          // Uso la funzione di ricerca e stampa dei risultati delle serie.
          getMedia(searchInput, endpointSerie, sezioneSerie);
        }
      }
    }
  );

  // FINE EVENTI

});
