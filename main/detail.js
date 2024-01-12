const url = "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1";
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZTYzYjdjMWU5ZTIyZDAwM2ZjNjc5OWZlNjhmZWIxZCIsInN1YiI6IjY1OGViOWUxY2EwZTE3MDhmNGJhNzVkMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.h4S8wIqJ0DxjJ9506Hrj3F5AfsavVajdG9cVybz_RnM"
  }
};

document.addEventListener("DOMContentLoaded", function () {
  const searchParams = new URLSearchParams(window.location.search);
  const cardID = searchParams.get("id");

  APIid(cardID);
});

function APIid(cardID) {
  fetch(url, options)
    .then((response) => response.json())
    .then((response) => {
      const rows = response["results"];
      const matchingData = rows.find((data) => data.id.toString() === cardID);

      if (matchingData) {
        const title = matchingData["title"];
        const id = matchingData["id"];

        const vote = matchingData["vote_average"];
        const path = matchingData["poster_path"];

        let temp_html = `
        <div class="card mb-3" id="card-${id}"  >
        <img src="https://image.tmdb.org/t/p/w300${path}" class="card-img-top" alt="..." onclick="moveDetail(event)">
        <div class="card-body">
          <h5 class="card-title">${title}</h5>
         
          <p class="card-text"><small class="text-body-secondary">(${vote}/10)</small></p>
        </div>
      </div>`;

        let cardElement = document.getElementById("card");
        cardElement.innerHTML += temp_html;
      }
    });
}
