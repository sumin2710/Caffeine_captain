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
      console.log(response);

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
      let cardElement = document.getElementById("card");
      cardElement.innerHTML += temp_html;
    });
  });

//url parameter로 ID값을 전달
//ID를 상세페이지로 전달
//TMDB에서 그 ID를 찾아와서 뺴내기

function moveDetail(event) {
  let idd = event.currentTarget.id;
  let idx = idd.split("-");
  let id = idx[1];
  location.href = `detail.html?id=${id}`;
  //자바스크립트에서 사용되는 입력된 주소로 이동, href는 현재 페이지 정보를 갖고있음
}

// function moveDetail(id, title, overview, vote, path) {
//   const queryParams = `?id=${id}&title=${encodeURIComponent(title)}&overview=${encodeURIComponent(
//     overview
//   )}&vote=${vote}&path=${encodeURIComponent(path)}`;
//   location.href = `detail.html?card=${queryParams}`;
// }
