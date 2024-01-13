import config from "./apiKey.js";

// ============================================================ //
// 전역 변수
// ============================================================ //
const API_KEY = config.API_KEY;
const AUTH = config.AUTHORIZATION;
const OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: AUTH
  }
};

// ============================================================ //
// 렌더링
// ============================================================ //

// 영화 하나 당 카드 하나 생성하기
const createCard = (movie, container) => {
  const card = document.createElement("div");
  card.className = "card";

  // card 클릭하면 id alert창에 띄우기
  card.addEventListener("click", () => showId(movie.id));

  const img = document.createElement("img");
  img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  img.alt = `${movie.title} Poster`;
  img.className = "img";

  const title = document.createElement("h4");
  title.className = "title";
  title.textContent = movie.title;

  const overview = document.createElement("p");
  overview.className = "overview";
  overview.textContent = movie.overview;

  const voteAvg = document.createElement("small");
  voteAvg.className = "voteAvg";
  voteAvg.textContent = `Rating: ${movie.vote_average}`;

  card.appendChild(img);
  card.appendChild(title);
  card.appendChild(overview);
  card.appendChild(voteAvg);

  container.appendChild(card);
};

// ============================================================ //
// 이벤트
// ============================================================ //

const searchMovie = async () => {
  const $movieContainer = document.querySelector("#movie-container");
  $movieContainer.innerHTML = ""; // 전의 카드들 지우기
  const $searchInput = document.querySelector("#search-input").value.toLowerCase(); // 대소문자 관계없이 검색 가능하게 하기

  // 빈 문자열이면,
  if ($searchInput === "") {
    $movieContainer.textContent = "You haven't entered movie title yet.";
    return;
  }

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent($searchInput)}`
    );
    const data = await res.json();

    if (data.results.length !== 0) {
      data.results.forEach((movie) => {
        createCard(movie, $movieContainer);
      });
    } else {
      $movieContainer.textContent = "NO RESULTS";
    }
  } catch (err) {
    console.error("Error fetching data: ", err);
    $movieContainer.textContent = "ERROR FETCHING DATA";
  }
};
// filter로 검색기능 구현해봄
const searchMovie2 = async () => {
  const $movieContainer = document.querySelector("#movie-container");
  $movieContainer.innerHTML = ""; // 전의 카드들 지우기
  const $searchInput = document.querySelector("#search-input").value.trim().toLowerCase(); // 대소문자 관계없이 검색 가능하게 하기

  // 빈 문자열이면,
  if ($searchInput === "") {
    $movieContainer.textContent = "You haven't entered movie title yet.";
    return;
  }

  try {
    const res = await fetch(`https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1`, OPTIONS);
    const data = await res.json();

    if (data.results.length !== 0) {
      let filteredMovies = data.results.filter((v) => v.title.toLowerCase().includes($searchInput));
      if (filteredMovies.length === 0) $movieContainer.textContent = "NO RESULTS";

      filteredMovies.forEach((movie) => {
        createCard(movie, $movieContainer);
      });
    } else {
      $movieContainer.textContent = "NO RESULTS";
    }
  } catch (err) {
    console.error("Error fetching data: ", err);
    $movieContainer.textContent = "ERROR FETCHING DATA";
  }
};
// fetch할 필요 없는 검색 기능 구현
const searchMovie3 = () => {
  const $movieCards = document.querySelectorAll(".card");
  const $searchInput = document.querySelector("#search-input").value.toLowerCase();

  // 빈 문자열이면,
  if ($searchInput === "") {
    alert("You haven't entered movie title yet.");
    return;
  }

  $movieCards.forEach((card) => {
    const title = card.querySelector(".title").textContent.toLowerCase();

    if (title.includes($searchInput)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
};

// card 클릭하면 id alert창에 띄우기
const showId = (id) => {
  alert(`영화 id: ${id}`);
};

// init 함수 -> 기본 영화들을 불러오기
const initMovie = async () => {
  const $movieContainer = document.querySelector("#movie-container");
  try {
    const res = await fetch(`https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1`, OPTIONS);
    const data = await res.json();

    if (data.results) {
      data.results.forEach((movie) => {
        createCard(movie, $movieContainer);
      });
    } else {
      $movieContainer.textContent = "NO MOVIES FOUND";
    }
  } catch (err) {
    console.error("Error fetching data: ", err);
    $movieContainer.textContent = "ERROR FETCHING DATA";
  }
};

// ============================================================ //
// 함수 진입점
// ============================================================ //

// 로드가 완료되면 전체 함수 진입
document.addEventListener("DOMContentLoaded", async function () {
  // 검색 버튼을 클릭하면 searchMovie나 searchMovie2나 searchMovie3 수행
  document.getElementById("search-btn").addEventListener("click", searchMovie2);

  // 엔터를 누르면 검색 버튼을 누른것과 동일한 효과를 주자
  document.getElementById("search-input").addEventListener("keyup", function (event) {
    if (event.key === "Enter") searchMovie2();
  });

  await initMovie();
});





// ============================================================
// 정렬 구현 시작

// 상위 부모 요소 선택
const $movieContainer = document.querySelector('#movie-container');

// 제목순

// 정렬 버튼 클릭 이벤트
const nameSortBtn = document.querySelector('#name-sort-btn');
nameSortBtn.addEventListener('click', (e) => {
  nameSort();
});


// 제목순 정렬 시작
function nameSort() {

  // 영화 제목 선택
  const selectTitle = element => {
    const titleElements = element.querySelector('.title');
    return titleElements.innerText; // titleElements에 저장된 영화 제목들을 innerText를 통해 반환
    
    // title이 입력되지 않은 card일 경우를 대비한 if문. 일단은 코드의 단순화를 위해 삭제
    // if (titleElements.length > 0) { // titleElements에 h4 요소가 하나이상 있는지 확인
    //   return titleElements[0].innerText; // titleElements에서 첫번째 영화 제목 반환
    // } else {
    //   return "제목이 없습니다"; // title이 없는 경우 반환
    // }
  };
  

  // card div 선택
  const cardArr = [...document.querySelectorAll('.card')];


  cardArr.sort((a, b) => {
    const elementA = selectTitle(a);
    const elementB = selectTitle(b);
    if (elementA < elementB) {
      return -1;
    }
    if (elementA > elementB) {
      return 1;
    }
    // 이름 같을 때
    return 0;
  })
  
  // 정렬 전 기존 카드 삭제
  $movieContainer.innerHTML = "";
  // card 정렬 후 해당 순서를 반영하여 $movieContainer에 다시 추가
  cardArr.forEach(element => $movieContainer.appendChild(element));

}



// ============================================================
// 정렬 구현 시작
// 평점순

// 정렬 버튼 클릭 이벤트
const ratingSortBtn = document.querySelector('#rating-sort-btn');
ratingSortBtn.addEventListener('click', (e) => {
  ratingSort();
});

// 평점순 정렬 시작
function ratingSort() {

  // 영화 평점 선택
  const selectVote = element => {
    const ratingElements = element.querySelector('.voteAvg');
    return ratingElements.innerText;
  };
  

  // card div 선택
  const cardArr = [...document.querySelectorAll('.card')];


  cardArr.sort((a, b) => {
    const elementA = selectVote(a);
    const elementB = selectVote(b);
    if (elementA < elementB) {
      return -1;
    }
    if (elementA > elementB) {
      return 1;
    }
    // 이름 같을 때
    return 0;
  })
  
  // 정렬 전 기존 카드 삭제
  $movieContainer.innerHTML = "";
  // card 정렬 후 해당 순서를 반영하여 $movieContainer에 다시 추가
  cardArr.forEach(element => $movieContainer.appendChild(element));
}