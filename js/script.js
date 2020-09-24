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

// Milestone 2
// Trasformiamo il voto da 1 a 10 decimale in un numero intero da 1 a 5, così da
// permetterci di stampare a schermo un numero di stelle piene che vanno da 1 a 5,
// lasciando le restanti vuote (troviamo le icone in FontAwesome).
// Arrotondiamo sempre per eccesso all’unità successiva, non gestiamo icone mezze
// piene (o mezze vuote :P)
// Trasformiamo poi la stringa statica della lingua in una vera e propria bandiera
// della nazione corrispondente, gestendo il caso in cui non abbiamo la bandiera
// della nazione ritornata dall’API (le flag non ci sono in FontAwesome).
// Allarghiamo poi la ricerca anche alle serie tv. Con la stessa azione di
// ricerca dovremo prendere sia i film che corrispondono alla query, sia le
// serie tv, stando attenti ad avere alla fine dei valori simili (le serie e i
// film hanno campi nel JSON di risposta diversi, simili ma non sempre identici).
// Qui un esempio di chiamata per le serie tv:
// https://api.themoviedb.org/3/search/tv?api_key=e99307154c6dfb0b4750f6603256716d&language=it_IT&query=scrubs

// Milestone 3
// In questa milestone come prima cosa aggiungiamo la copertina del film o
// della serie al nostro elenco.
// Ci viene passata dall’API solo la parte finale dell’URL, questo perché
// poi potremo generare da quella porzione di URL tante dimensioni diverse.
// Dovremo prendere quindi l’URL base delle immagini di TMDB:
// https://image.tmdb.org/t/p/ per poi aggiungere la dimensione che vogliamo
// generare (troviamo tutte le dimensioni possibili a questo link:
// https://www.themoviedb.org/talk/53c11d4ec3a3684cf4006400) per poi aggiungere
// la parte finale dell’URL passata dall’API.
// Esempio di URL che torna la copertina di PEPPA PIG:
// https://image.tmdb.org/t/p/w185/tZgQ76hS9RFIwFyUxzctp1Pkz0N.jpg


$(document).ready(function () {

  // FUNZIONI

  // FUNZIONE CHE GENERA L'URL DEL POSTER DEL MEDIA.
  function printUrl(string) {

    // Salvo la parte iniziale dell'URL dei poster.
    var inizioUrl = "https://image.tmdb.org/t/p/";

    // Stabilisco la dimensione del poster.
    var dimensionePoster = "w154";

    // Acquisisco la parte finale dell'URL che mi viene passata dal database.
    var fineUrl = string;

    // Compongo l'URL completo.
    var urlCompleto = inizioUrl + dimensionePoster + fineUrl;

    return urlCompleto;
  }

  // FUNZIONE DI STAMPA DEL MESSAGGIO ASSENZA DI RISULTATI.
  function printError(string) {

    // Seleziono il tipo di media.
    if (string == film) {

      var sezioneMedia = $("#movies-list");

    } else if (string == serie) {

      var sezioneMedia = $("#series-list");
    }

    // Stampo un messaggio di mancanza di risultati.
    sezioneMedia.html("<strong>La ricerca non ha dato risultati nella sezione " + string + ".</strong>");
  }

  // FUNZIONE DI PULIZIA DEL CAMPO INPUT E DELLE LISTE FILM E SERIE.
  function resetSearch() {

    // Svuoto la lista di film e serie.
    $("#movies-list").html("");
    $("#series-list").html("");

    // Pulisco il campo di input.
    $("#search-media").val("");
  }

  // FUNZIONE CHE STAMPA LA BANDIERINA DELLA LINGUA.
  function printFlags(lang) {

    // Se la lingua è inclusa fra le bandiere presenti, ritorno la bandierina.
    if (bandierePresenti.includes(lang)) {
      return '<img src="img/' + lang + '.png" class="flag" alt="bandiera lingua">';

    // Altrimenti ritorno la lingua.
    } else {
      return lang;
    }
  }

  // FUNZIONE CHE STAMPA IL VOTO IN STELLINE.
  function printStars(num) {

    // Converto il voto in scala da 1 a 5 arrotondando per eccesso.
    var num = Math.ceil(num / 2);

    // Definisco una stringa vuota.
    var stelline = "";

    // Con un ciclo stampo cinque stelle.
    for (var i = 1; i <= 5; i++) {

      // Se i minore del numero, aggiungo una stella piena.
      if (i <= num) {
        stelline += '<i class="fas fa-star"></i>';

        // Altrimenti aggiungo una stella vuota.
      } else {
        stelline += '<i class="far fa-star"></i>';
      }
    }

    return stelline;
  }

  // FUNZIONE CHE STAMPA A SCHERMO I RISULTATI DI UNA RICHIESTA.
  function renderMedia(arrayDatabase, mediaString) {

    // Genero il template con handlebars.
    var source = $("#media-template").html();
    var template = Handlebars.compile(source);

    // Eseguo un ciclo sull'array dei media per stamparli a schermo.
    for (var i = 0; i < arrayDatabase.length; i++) {

      // Genero l'URL del poster.
      var posterUrl = printUrl(arrayDatabase[i].poster_path);

      // Eseguo un controllo sul tipo di media, generando diverse variabili.
      if (mediaString == film) {
        var title = arrayDatabase[i].title;
        var originalTitle = arrayDatabase[i].original_title;
        var sezioneMedia = $("#movies-list");

      } else if (mediaString == serie) {
        var title = arrayDatabase[i].name;
        var originalTitle = arrayDatabase[i].original_name;
        var sezioneMedia = $("#series-list");
      }

      // Genero la bandiera corrispondente alla lingua, se disponibile.
      var lingua = printFlags(arrayDatabase[i].original_language);

      // Genero il voto in stelle, da 1 a 5.
      var voto = printStars(arrayDatabase[i].vote_average);

      // Genero l'oggetto context da stampare.
      var context = {
        "poster_path": posterUrl,
        "title": title,
        "original_title": originalTitle,
        "original_language": lingua,
        "vote_average": voto
      };

      // Compilo il template e lo aggiungo nella sezione media.
      var html = template(context);
      sezioneMedia.append(html);
    }
  }

  // FUNZIONE DI RICERCA E STAMPA DEI MEDIA.
  function getMedia(search, endpointMedia, mediaType) {

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

          // Se la lista media non è vuota, stampo i risultati.
          if (listaMedia.length != 0) {

            // Eseguo la funzione di stampa.
            renderMedia(listaMedia, mediaType);

          // Altrimenti, se è vuota.
          } else {

            printError(mediaType);
          }

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

  // Definisco due variabili contenenti le tipologie di media.
  var film = "Film";
  var serie = "Serie TV";

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
        getMedia(searchInput, endpointFilm, film);

        // Uso la funzione di ricerca e stampa dei risultati delle serie.
        getMedia(searchInput, endpointSerie, serie);
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
          getMedia(searchInput, endpointFilm, film);

          // Uso la funzione di ricerca e stampa dei risultati delle serie.
          getMedia(searchInput, endpointSerie, serie);
        }
      }
    }
  );

  // FINE EVENTI

});
