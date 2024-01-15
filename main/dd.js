// 평점순 정렬 시작
function ratingSort() {
  // 상위 부모 요소 선택
  const $movieContainer = document.querySelector("#main");

  // 영화 평점 선택
  const selectVote = (element) => {
    const ratingElements = element
      .querySelector("div")
      .querySelector(".text-body-secondary");
    return ratingElements.innerText;
  };

  // card div 선택
  const cardArr = [...document.querySelectorAll(".card")];
  cardArr.sort((a, b) => {
    const elementA = selectVote(a);
    const elementB = selectVote(b);
    if (elementA < elementB) {
      return 1;
    }
    if (elementA > elementB) {
      return -1;
    }
    // 이름 같을 때
    return 0;
  });

  // 정렬 전 기존 카드 삭제
  $movieContainer.innerHTML = "";
  // card 정렬 후 해당 순서를 반영하여 $movieContainer에 다시 추가
  cardArr.forEach((element) => $movieContainer.appendChild(element));
}
