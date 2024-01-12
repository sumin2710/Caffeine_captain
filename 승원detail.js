import { options } from "./apikey.js";
const url =
  "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1";

document.addEventListener("DOMContentLoaded", function () {
  const searchParams = new URLSearchParams(window.location.search);
  const cardID = searchParams.get("id");

  const userNickName = document.getElementById("nickName");
  const userPassWord = document.getElementById("passWord");
  const userSubmit = document.getElementById("submit");
  const userReview = document.getElementById("review");

  APIid(cardID);
  console.log(cardID);
  userSubmit.addEventListener("click", () => {
    let usersInfo = JSON.parse(localStorage.getItem(`movieId:${cardID}`)) || [];

    let newUserInfo = {
      nickname: userNickName.value,
      passWord: userPassWord.value,
      review: userReview.value,
    };

    usersInfo.push(newUserInfo);

    localStorage.setItem(`movieId:${cardID}`, JSON.stringify(usersInfo));
    console.log(cardID);

    location.reload();
  });
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
        const overview = matchingData["overview"];
        const vote = matchingData["vote_average"];
        const path = matchingData["poster_path"];

        let temp_html = `
        <div class="card mb-3" id="card-${id}"  onclick="moveDetail(event)">
        <img src="https://image.tmdb.org/t/p/w300${path}" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">${title}</h5>
          <p class="card-text">${overview}</p>
          <p class="card-text"><small class="text-body-secondary">(${vote}/10)</small></p>
        </div>
      </div>`;

        let cardElement = document.getElementById("carD");
        cardElement.innerHTML += temp_html;
      }
    });
}

//form태그로 인한 새로고침을 막고 alert창 띄우기
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  alert("리뷰가 작성되었습니다.");
});
