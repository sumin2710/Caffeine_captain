import options from "../asset/apiKey.js";
const url =
  "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1";

// 제목순 정렬 시작
function nameSort() {
  // 상위 부모 요소 선택
  const $movieContainer = document.querySelector("#main");

  // 영화 제목 선택
  const selectTitle = (element) => {
    const titleElements = element.querySelector("div").querySelector("h5");
    return titleElements.innerText; // titleElements에 저장된 영화 제목들을 innerText를 통해 반환
  };

  // card div 선택
  const cardArr = [...document.querySelectorAll("#card")];

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
  });

  // 정렬 전 기존 카드 삭제
  $movieContainer.innerHTML = "";
  // card 정렬 후 해당 순서를 반영하여 $movieContainer에 다시 추가
  cardArr.forEach((element) => $movieContainer.appendChild(element));
}
// 평점순 정렬 시작
function ratingSort() {
  // 상위 부모 요소 선택
  const $movieContainer = document.querySelector("#main");
  // 영화 평점 선택
  const selectVote = (element) => {
    const ratingElements = element
      .querySelector("div")
      .querySelector("#rating");
    return ratingElements.innerText;
  };
  // card div 선택
  const cardArr = [...document.querySelectorAll("#card")];
  cardArr.sort((a, b) => {
    const elementA = selectVote(a);
    const elementB = selectVote(b);
    if (elementA < elementB) {
      return 1;
    }
    if (elementA > elementB) {
      return -1;
    }
    // 평점 같을 때
    return 0;
  });
  // 정렬 전 기존 카드 삭제
  $movieContainer.innerHTML = "";
  // card 정렬 후 해당 순서를 반영하여 $movieContainer에 다시 추가
  cardArr.forEach((element) => $movieContainer.appendChild(element));
}

// 카테고리 기능
const getCategoryItems = () => {
  const $category = document.querySelector(".category");
  const $categoryList = $category.children;

  for (let i = 0; i < $categoryList.length; i++) {
    $categoryList[i].addEventListener("click", () => {
      const genre_id = $categoryList[i].className;
      const movie_title_list =
        JSON.parse(localStorage.getItem(`genreId:${genre_id}`)) || [];
      displayCategoryItems(movie_title_list);
    });
  }
};

const displayCategoryItems = (movie_title_list) => {
  let flag = false;
  const $cards = document.querySelectorAll("#card");
  $cards.forEach(($card) => {
    const title = $card.querySelector("div").querySelector("h5").innerText;
    if (movie_title_list.includes(title)) {
      $card.style.display = "flex";
      flag = true;
    } else {
      $card.style.display = "none";
    }
  });
  if (!flag) {
    alert("해당 장르의 영화가 존재하지 않습니다.");
    location.reload();
  }
};

// 검색 기능
const searchMovie = () => {
  let $movieCards = document.querySelectorAll("#card");
  // querySelectorAll은 array가 아니라 nodeList를 반환한다.
  // 따라서 filter 메소드를 사용하기 위해선 array로 형변환 해줘야 한다.
  $movieCards = Array.prototype.slice.call($movieCards);

  const $searchInput = document
    .querySelector("#search-input")
    .value.toLowerCase();
  // display:flex인 것만 검색하고 싶다(display:none인건 검색하고 싶지 않다)

  const $visibleCards = $movieCards.filter((card) => {
    const displayStyle = window.getComputedStyle(card).display;

    return displayStyle != "none";
  });
  console.log($visibleCards);

  // 빈 문자열이면,
  if ($searchInput === "") {
    alert("제목을 입력하지 않으셨습니다.");
    return;
  }

  let flag = false;
  $visibleCards.forEach((card) => {
    const title = card.querySelector(".card-title").textContent.toLowerCase();

    if (title.includes($searchInput)) {
      card.style.display = "flex";
      flag = true;
    } else {
      card.style.display = "none";
    }
  });
  if (!flag) {
    alert("검색 결과가 없습니다.");
    location.reload();
  }
};

// DOM TREE가 로드되면, 할 작업들
document.addEventListener("DOMContentLoaded", async function () {
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

        //카테고리용으로 추가한 부분이에요
        // localStorage에 "genreId:32" : "[제목,제목,제목]" 이런식으로 저장돼요
        const genre_ids = data["genre_ids"];
        genre_ids.forEach((genre_id) => {
          let existingValue =
            JSON.parse(localStorage.getItem(`genreId:${genre_id}`)) || [];
          existingValue.push(title);
          localStorage.setItem(
            `genreId:${genre_id}`,
            JSON.stringify(existingValue)
          );
        });

        let temp_html = `
      <div class="card mb-3" id="card">
      <a href="../detail/detail.html?id=${id}">
       <img src="https://image.tmdb.org/t/p/w300${path}" class="card-img-top" alt="${title} Poster">
      </a>
      <div class="card-body">
        <h5 class="card-title">${title}</h5>
        <p class="card-text">${overview}</p>
        <p class="text-body-secondary" id="rating">(${vote}/10)</p>
      </div>
    </div>`;
        let cardElement = document.getElementById("main");
        cardElement.innerHTML += temp_html;
      });
    });

  // 카테고리에 해당하는 카드만 보여주기
  getCategoryItems();

  // 정렬 옵션 클릭 이벤트
  // select option의 경우 click 이벤트가 아니라 change 이벤트
  const $selectSort = document.querySelector(".sort");
  $selectSort.addEventListener("change", (e) => {
    if (e.target.value === "제목순") {
      nameSort();
    } else if (e.target.value === "평점순") {
      ratingSort();
    }
  });

  // 검색 버튼 클릭 이벤트
  document.getElementById("search-btn").addEventListener("click", searchMovie);
  // 엔터를 눌러도 검색돼요
  document
    .getElementById("search-input")
    .addEventListener("keyup", function (event) {
      if (event.key === "Enter") searchMovie();
    });
});
