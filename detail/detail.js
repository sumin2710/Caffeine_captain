import options from "../main/apikey.js";
const url =
  "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1";

function APIid() {
  let cardElement = document.getElementById("card");
  cardElement.innerHTML = ""; // 기존 내용 지우기
  const cardID = findCardIdFromUrl();
  console.log(cardID);
  fetch(url, options)
    .then((response) => response.json())
    .then((response) => {
      const rows = response["results"];
      console.log(rows);
      console.log(cardID);
      const matchingData = rows.find((data) => data.id.toString() === cardID);
      console.log(matchingData);
      if (matchingData) {
        const title = matchingData["title"];
        const id = matchingData["id"];

        const vote = matchingData["vote_average"];
        const path = matchingData["poster_path"];

        let temp_html = `
        <div class="card mb-3" id="card-${id}"  >
        <img src="https://image.tmdb.org/t/p/w300${path}" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">${title}</h5>
         
          <p class="card-text"><small class="text-body-secondary">(${vote}/10)</small></p>
        </div>
      </div>`;

        cardElement.innerHTML += temp_html;
      }
    });
}

// 다른 함수에서도 많이 사용할 것 같아서 따로 함수로 빼보았어요
// 카드 아이디를 url에서 가져오는 함수
function findCardIdFromUrl() {
  const searchParams = new URLSearchParams(window.location.search);
  const cardID = searchParams.get("id");
  return cardID;
}

function displayReviews() {
  const $board = document.querySelector(".board");
  $board.innerHTML = "";

  const cardID = findCardIdFromUrl();

  const reviews = JSON.parse(localStorage.getItem(`movieId:${cardID}`)) || [];

  if (reviews.length === 0) {
    $board.textContent = "리뷰가 아직 없습니다.";
    return;
  }

  reviews.forEach((review, idx) => {
    createReviewCard(review, idx, $board);
  });
}

// 리뷰 카드 만들기
const createReviewCard = (review, idx, container) => {
  const reviewCard = document.createElement("div");
  reviewCard.className = "reviewCard";

  const reviewUserName = document.createElement("p");
  reviewUserName.className = "reviewUserName";
  reviewUserName.textContent = `닉네임: ${review.nickname}`;

  const reviewContent = document.createElement("p");
  reviewContent.className = "reviewContent";
  reviewContent.textContent = `내용: ${review.review}`;

  const btns = document.createElement("div");
  btns.className = "btns";

  // 수정 버튼
  const editBtn = document.createElement("button");
  editBtn.className = "editBtn";
  editBtn.textContent = "수정";
  editBtn.addEventListener("click", (event) => editReview(event, idx));

  // 삭제 버튼
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "deleteBtn";
  deleteBtn.textContent = "삭제";
  deleteBtn.addEventListener("click", (event) => deleteReview(event, idx));

  btns.appendChild(editBtn);
  btns.appendChild(deleteBtn);

  reviewCard.appendChild(reviewUserName);
  reviewCard.appendChild(reviewContent);
  reviewCard.appendChild(btns);

  container.appendChild(reviewCard);
};

// 리뷰 수정
const editReview = (event, idx) => {
  event.preventDefault();
  const cardID = findCardIdFromUrl();
  const reviewList = JSON.parse(localStorage.getItem(`movieId:${cardID}`));
  const review = reviewList[idx];

  const password = prompt("비밀번호를 입력하세요.");
  if (password !== review.passWord) {
    alert("잘못된 비밀번호입니다!!!");
    return;
  } else {
    const reviewContent = prompt("리뷰를 수정하세요~~", review.review);
    // 유효성 검사 -> 수정한 내용이 없거나 공백인지 검사
    if (reviewContent !== null && reviewContent.trim() !== "") {
      review.review = reviewContent; // update!
      localStorage.setItem(`movieId:${cardID}`, JSON.stringify(reviewList));
      alert("리뷰가 성공적으로 수정되었습니다.");
      location.reload();
      displayReviews(); // 업데이트된 리뷰 리스트 보여주기
    } else {
      alert("wrong input.");
    }
  }
};

// 리뷰 삭제
const deleteReview = (event, idx) => {
  event.preventDefault();
  const cardID = findCardIdFromUrl();
  const reviewList = JSON.parse(localStorage.getItem(`movieId:${cardID}`));
  const review = reviewList[idx];

  const password = prompt("비밀번호를 입력하세요.");
  if (password !== review.passWord) {
    alert("잘못된 비밀번호입니다!!!");
    return;
  } else {
    reviewList.splice(idx, 1); // idx부터 1개 요소 자르기
    localStorage.setItem(`movieId:${cardID}`, JSON.stringify(reviewList));
    alert("리뷰가 성공적으로 삭제되었습니다.");
    location.reload();
    displayReviews(); // 업데이트된 리뷰 리스트 보여주기
  }
};

// DOM TREE가 로드되면, 할 작업들
document.addEventListener("DOMContentLoaded", async function () {
  const userSubmit = document.querySelector(".reviewBtn");
  userSubmit.addEventListener("click", (event) => {
    event.preventDefault();
    const cardID = findCardIdFromUrl();
    const userNickName = document.querySelector(".username");
    const userPassWord = document.querySelector(".password");
    const userReview = document.querySelector(".review");

    let usersInfo = JSON.parse(localStorage.getItem(`movieId:${cardID}`)) || [];

    let newUserInfo = {
      nickname: userNickName.value,
      passWord: userPassWord.value,
      review: userReview.value,
    };

    usersInfo.push(newUserInfo);
    localStorage.setItem(`movieId:${cardID}`, JSON.stringify(usersInfo));
    alert("리뷰가 성공적으로 저장되었습니다.");
    location.reload();
    displayReviews();
  });

  document.querySelector("header").addEventListener("click", () => {
    this.location.href = "../main/main.html";
  });

  APIid(); // 영화 정보 보여주기
  displayReviews(); // 리뷰들 보여주기
});
