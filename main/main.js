import options from "./asset/apiKey.js";
const url =
  "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1";

// 제목순 정렬 시작
function nameSort() {
  // 상위 부모 요소 선택
  const $movieContainer = document.querySelector("#main");

  // 영화 제목 선택
  const selectTitle = (element) => {
    const titleElements = element.querySelector("div").querySelector("h5");
    console.log(titleElements);
    return titleElements.innerText; // titleElements에 저장된 영화 제목들을 innerText를 통해 반환

    // title이 입력되지 않은 card일 경우를 대비한 if문. 일단은 코드의 단순화를 위해 삭제
    // if (titleElements.length > 0) { // titleElements에 h4 요소가 하나이상 있는지 확인
    //   return titleElements[0].innerText; // titleElements에서 첫번째 영화 제목 반환
    // } else {
    //   return "제목이 없습니다"; // title이 없는 경우 반환
    // }
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
  const $cards = document.querySelectorAll("#card");
  $cards.forEach(($card) => {
    const title = $card.querySelector("div").querySelector("h5").innerText;
    if (movie_title_list.includes(title)) {
      $card.style.display = "block";
    } else {
      $card.style.display = "none";
    }
  });
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
        // localStorage에 "genreId:32" : "[제목,제목,제목]" 이런식으로 저장되요
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

  // 카테고리에 해당하는 카드만 보여주기
  getCategoryItems();

  // 정렬 옵션 클릭 이벤트
  // select option의 경우 click 이벤트가 아니라 change 이벤트
  const $selectSort = document.querySelector(".sort");
  $selectSort.addEventListener("change", (e) => {
    if (e.target.value === "제목순") {
      nameSort();
    } else if (e.target.value === "평점순") {
      location.reload();
    }
  });
});
