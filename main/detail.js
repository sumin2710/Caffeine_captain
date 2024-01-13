import options from "./apikey.js";
const url = "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1";

// 리뷰를 저장하고 새로고침하면 영화 정보를 가져오지 못하는 에러 해결:
// 정확힌 영화 정보는 제대로 가져오고 있는데, cardID를 url에서 가져오지 못하고 있네요
// cardID가 null이라서 null과 가져온 영화들의 id를 비교하면 당연히 matchingData가 없겠지요
// 문제 : 리뷰를 저장하면 url에서 cardID 파라미터가 사라지고 있어요
// event 받아와서 event.preventDefault()로 해결했습니당
// 아이디를 가지고 TMDB에서 영화정보를 가져와 상세 페이지에 뿌려주는 함수
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

// 승원님이 짜신 코드(원래는 익명 함수였는데)를 함수로 옮겨보았어요
// 사용자 입력을 받아 리뷰를 생성하여 localStorage에 저장하는 함수
function saveReview(event) {
  event.preventDefault();
  const cardID = findCardIdFromUrl();
  const userNickName = document.querySelector(".username");
  const userPassWord = document.querySelector(".password");
  const userReview = document.querySelector(".review");

  let usersInfo = JSON.parse(localStorage.getItem(`movieId:${cardID}`)) || [];

  let newUserInfo = {
    nickname: userNickName.value,
    passWord: userPassWord.value,
    review: userReview.value
  };

  usersInfo.push(newUserInfo);
  localStorage.setItem(`movieId:${cardID}`, JSON.stringify(usersInfo));
  alert("리뷰가 성공적으로 저장되었습니다.");
  location.reload();
  displayReviews();
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

// 수정 버튼을 누르면
const editReview = (event, idx) => {
  event.preventDefault();
  const cardID = findCardIdFromUrl();
  const reviewList = JSON.parse(localStorage.getItem(`movieId:${cardID}`));
  const review = reviewList[idx];

  const password = prompt("Enter password.");
  if (password !== review.passWord) {
    alert("Wrong password!!!");
    return;
  } else {
    const reviewContent = prompt("Edit your review~~", review.review);
    // 유효성 검사 -> 수정한 내용이 없거나 공백인지 검사
    if (reviewContent !== null && reviewContent.trim() !== "") {
      review.review = reviewContent; // update!
      localStorage.setItem(`movieId:${cardID}`, JSON.stringify(reviewList));
      alert("Your review's been successfully edited.");
      location.reload();
      displayReviews(); // 업데이트된 리뷰 리스트 보여주기
    } else {
      alert("wrong input.");
    }
  }
};

// 삭제
const deleteReview = (event, idx) => {
  event.preventDefault();
  const cardID = findCardIdFromUrl();
  const reviewList = JSON.parse(localStorage.getItem(`movieId:${cardID}`));
  const review = reviewList[idx];

  const password = prompt("Enter password.");
  if (password !== review.passWord) {
    alert("Wrong password!!!");
    return;
  } else {
    reviewList.splice(idx, 1); // idx부터 1개 요소 자르기
    localStorage.setItem(`movieId:${cardID}`, JSON.stringify(reviewList));
    alert("Your review's been successfully deleted.");
    location.reload();
    displayReviews(); // 업데이트된 리뷰 리스트 보여주기
  }
};

// DOM TREE가 로드되면, 할 작업들~~
document.addEventListener("DOMContentLoaded", async function () {
  const userSubmit = document.querySelector(".reviewBtn");
  userSubmit.addEventListener("click", saveReview); // 만약 submit 버튼을 클릭하면, 리뷰를 저장한다.
  APIid(); // 화면에 영화 정보 뿌려주고,
  displayReviews(); // 리뷰들 보여주기
});
