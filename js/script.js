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

  // EVENTI

  // Aggiungo un evento al click sul bottone.
  $("#search-button").click(
    function () {

      // Svuoto la lista di film.
      $("#movies-list").html("");

      // Creo una variabile con il contenuto dell'input.
      var searchInput = $("#search-films").val();

      // Pulisco il campo di input.
      $("#search-films").val("");

      // Effettuo la chiamata ajax all'API del movie database, per ottenere
      // le schede dei film.
      $.ajax(
        {
          "url":"https://api.themoviedb.org/3/search/movie",
          "data": {
            "api_key": "04bbabd51c895f6f8040168aa7e1cd41",
            "query": searchInput,
            "language": "it-IT",
            "include_adult": false
          },
          "method": "GET",
          "success": function (data) {

            // Salvo la lista dei film in un array.
            var listaFilm = data.results;

            // Genero il template con handlebars.
            var source = $("#film-template").html();
            var template = Handlebars.compile(source);

            // Eseguo un ciclo sull'array dei film per stamparli a schermo.
            for (var i = 0; i < listaFilm.length; i++) {

              // Genero l'oggetto context da stampare.
              var context = {
                "title": listaFilm[i].title,
                "original_title": listaFilm[i].original_title,
                "original_language": listaFilm[i].original_language,
                "vote_average": listaFilm[i].vote_average
              };

              // Compilo il template e lo aggiungo nella lista film.
              var html = template(context);
              $("#movies-list").append(html);
            }
          },
          "error": function (err) {
            alert("Errore!");
          }
        }
      );

    }
  );

});
