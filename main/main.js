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
    const rows = response["results"];

    rows.forEach((data) => {
      const title = data["title"];
      const id = data["id"];
      const overview = data["overview"];
      const vote = data["vote_average"];
      const path = data["poster_path"];

      let temp_html = `
      <div class="card mb-3" id="card-${id}"  onclick="moveDetail(event)">
      <img src="https://image.tmdb.org/t/p/w300${path}" class="card-img-top" alt="...">
      <div class="card-body">
        <h5 class="card-title">${title}</h5>
        <p class="card-text">${overview}</p>
        <p class="card-text"><small class="text-body-secondary">(${vote}/10)</small></p>
      </div>
    </div>`;

      // const card = document.createElement("div");
      // card.className = "card";
      // const mainContainer = document.getElementById("main");
      // mainContainer.appendChild(card);

      let cardElement = document.getElementById("main");
      cardElement.innerHTML += temp_html;
    });
  });

//물어보고싶은것
//html안에서 카드를 생성하면 main 안으로 예쁘게 정렬이 됨.
//그런데 js에서 innerHTML로 카드를 만들면 main 밖으로 튀어나옴
//그래서 주석처리한것처럼 main 안에 div class를 만들어 카드를 생성하는식으로
//하고싶으나 잘 안됨!!

function moveDetail(event) {
  let idd = event.currentTarget.id;
  let idx = idd.split("-");
  let id = idx[1];
  location.href = `detail.html?id=${id}`;
}
