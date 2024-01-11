const url = "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1";
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZTYzYjdjMWU5ZTIyZDAwM2ZjNjc5OWZlNjhmZWIxZCIsInN1YiI6IjY1OGViOWUxY2EwZTE3MDhmNGJhNzVkMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.h4S8wIqJ0DxjJ9506Hrj3F5AfsavVajdG9cVybz_RnM"
  }
};

fetch(url, options)
  .then((response) => response.json())
  .then((response) => {
    const rows = response["results"][0]; //누른 번호값 알아내기
    console.log(rows);

    const title = rows["title"];
    const id = rows["id"];
    const overview = rows["overview"];
    const vote = rows["vote_average"];
    const path = rows["poster_path"];

    let temp_html = `
      <div class="card mb-3" id="card-${id}" style="margin: 15px">
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
