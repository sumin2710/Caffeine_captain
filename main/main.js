import options from "./apikey.js";
const url =
  "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1";

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
      <div class="card mb-3">
      <a href="../detail/detail.html?id=${id}">
       <img src="https://image.tmdb.org/t/p/w300${path}" class="card-img-top" alt="...">
      </a>
      <div class="card-body">
        <h5 class="card-title">${title}</h5>
        <p class="card-text">${overview}</p>
        <p class="text-body-secondary">(${vote}/10)</p>
      </div>
    </div>`;
      let cardElement = document.getElementById("main");
      cardElement.innerHTML += temp_html;
    });
  });

// onclick으로 했더니 moveDetail is not defined 에러가 나서 a 태그를 이미지 바깥에 감싸는 식으로 해결했습니다
// function moveDetail(event) {
//   let idd = event.currentTarget.id;
//   let idx = idd.split("-");
//   let id = idx[1];
//   location.href = `../detail/detail.html?id=${id}`;
// }
