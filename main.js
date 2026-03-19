// 상황별 점심 메뉴 데이터
const lunchDatabase = {
  quick: ["샌드위치", "김밥", "토스트", "컵라면 & 삼각김밥", "샐러드", "햄버거"],
  team: ["부대찌개", "제육볶음", "돈가스", "중국집(짜장/짬뽕)", "김치찜", "닭갈비"],
  healthy: ["포케", "샤브샤브", "보리밥 비빔밥", "생선구이", "순두부찌개", "월남쌈"],
  cheat: ["스테이크", "파스타", "수제버거", "초밥", "텐동", "마라탕"]
};

const recommendBtn = document.getElementById('recommend-btn');
const display = document.getElementById('recommendation-display');
const categorySelect = document.getElementById('category-select');
const mapLinkContainer = document.getElementById('map-link-container');

// 테마 토글 로직
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

const updateToggleButton = (theme) => {
  themeToggle.textContent = theme === 'dark' ? '라이트 모드' : '다크 모드';
};

const savedTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', savedTheme);
updateToggleButton(savedTheme);

themeToggle.addEventListener('click', () => {
  const currentTheme = htmlElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  htmlElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateToggleButton(newTheme);
});

// 추천 로직
recommendBtn.addEventListener('click', () => {
  const category = categorySelect.value;
  const options = lunchDatabase[category];
  const selected = options[Math.floor(Math.random() * options.length)];
  
  display.style.opacity = 0;
  
  setTimeout(() => {
    display.innerHTML = `오늘의 추천: <strong>${selected}</strong>`;
    display.style.opacity = 1;
    
    // 주변 식당 검색 링크 생성
    const searchQuery = encodeURIComponent(selected + " 맛집");
    mapLinkContainer.innerHTML = `
      <a href="https://www.google.com/maps/search/${searchQuery}" target="_blank" class="map-btn">
        📍 주변 ${selected} 매장 찾기
      </a>
    `;
  }, 150);
});

// 페이드 효과를 위한 트랜지션
display.style.transition = 'opacity 0.2s';
