const url = "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1";
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZTYzYjdjMWU5ZTIyZDAwM2ZjNjc5OWZlNjhmZWIxZCIsInN1YiI6IjY1OGViOWUxY2EwZTE3MDhmNGJhNzVkMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.h4S8wIqJ0DxjJ9506Hrj3F5AfsavVajdG9cVybz_RnM"
  }
};

const searchParams = new URLSearchParams(window.location.search);
const id = searchParams.get("id"); //"id"값만 받음 이제 이걸 fetch에서 찾기

fetch(url, options)
  .then((response) => response.json())
  .then((response) => {
    const rows = response["results"]; //여기서 id찾기

    rows.forEach((data) => {
      const title = data["title"];
      const id = data["id"];
      const overview = data["overview"];
      const vote = data["vote_average"];
      const path = data["poster_path"];
      console.log(id);

      let temp_html = `
      <div class="card mb-3" id="card-${id}"  onclick="moveDetail(event)">
      <img src="https://image.tmdb.org/t/p/w300${path}" class="card-img-top" alt="...">
      <div class="card-body">
        <h5 class="card-title">${title}</h5>
        <p class="card-text">${overview}</p>
        <p class="card-text"><small class="text-body-secondary">(${vote}/10)</small></p>
      </div>
    </div>`;

      //1. 바닐라 JS로 api 연동, html 붙여넣기
      let cardElement = document.getElementById("carD");
      cardElement.innerHTML += temp_html;
    });
  });
