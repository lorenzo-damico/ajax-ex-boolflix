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

  // Funzione di pulizia del campo input e della lista film.
  function resetSearch() {

    // Svuoto la lista di film.
    $("#movies-list").html("");

    // Pulisco il campo di input.
    $("#search-films").val("");
  }

  // Funzione che converte il voto in stelline.
  function voteConvertion(mediaObject) {

    // Salvo il voto in una variabile.
    var voto = mediaObject.vote_average;

    // Converto il voto in scala da 1 a 5 arrotondando per eccesso.
    var votoArrotondato = Math.ceil(voto / 2);

    // Con un ciclo stampo un numero di stelle piene pari al voto.
    var stelline = "";
    for (var j = 0; j < votoArrotondato; j++) {
      stelline += '<i class="fas fa-star"></i>';
    }

    // Con un ciclo stampo un numero di stelle vuote pari alle rimanenti
    // per arrivare a 5.
    for (var k = 0; k < (5 - votoArrotondato); k++) {
      stelline += '<i class="far fa-star"></i>';
    }
    return stelline;

  }

  // Funzione che stampa a schermo.
  function renderMovies(arrayDatabase) {

    // Genero il template con handlebars.
    var source = $("#film-template").html();
    var template = Handlebars.compile(source);

    // Eseguo un ciclo sull'array dei film per stamparli a schermo.
    for (var i = 0; i < arrayDatabase.length; i++) {

      // Genero l'oggetto context da stampare.
      var context = {
        "title": arrayDatabase[i].title,
        "original_title": arrayDatabase[i].original_title,
        "original_language": arrayDatabase[i].original_language,
        "vote_average": arrayDatabase[i].vote_average / 2,
        "data_result": i
      };

      // Compilo il template e lo aggiungo nella lista film.
      var html = template(context);
      $("#movies-list").append(html);

      // Conversione del voto in stelle e stampa.
      var votoStellato = voteConvertion(arrayDatabase[i]);
      $(".film[data-result='"+ i +"'] .stars").html(votoStellato);
    }
  }

  // Funzione di ricerca e stampa dei film.
  function getMovies(search) {

    // Effettuo la chiamata ajax all'API del movie database, per ottenere
    // le schede dei film.
    $.ajax(
      {
        "url": "https://api.themoviedb.org/3/search/movie",
        "data": {
          "api_key": "04bbabd51c895f6f8040168aa7e1cd41",
          "query": search,
          "language": "it-IT",
          "include_adult": false
        },
        "method": "GET",
        "success": function (data) {

          // Salvo la lista dei film in un array.
          var listaFilm = data.results;

          // Eseguo la funzione di stampa.
          renderMovies(listaFilm);

        },
        "error": function (err) {
          alert("Errore!");
        }
      }
    );
  }


  // FINE FUNZIONI


  // EVENTI

  // 1. Aggiungo un evento al click sul bottone.
  $("#search-button").click(
    function () {

      // Creo una variabile con il contenuto dell'input.
      var searchInput = $("#search-films").val();

      if (searchInput != "") {

        // Pulisco input e lista.
        resetSearch();

        // Uso la funzione di ricerca e stampa dei risultati.
        getMovies(searchInput);
      }
    }
  );

  // 2. Aggiungo un evento alla pressione del tasto invio.
  $("#search-films").keyup(
    function () {

      // Se premo il tasto invio, cerco e stampo.
      if (event.which == 13) {

        // Creo una variabile con il contenuto dell'input.
        var searchInput = $("#search-films").val();

        if (searchInput != "") {

          // Pulisco input e lista.
          resetSearch();

          // Uso la funzione di ricerca e stampa dei risultati.
          getMovies(searchInput);
        }
      }
    }
  );

  // FINE EVENTI

});
