// 데이터베이스
const lunchDatabase = {
  team: ["부대찌개", "제육볶음", "돈가스", "중국집", "김치찜", "닭갈비", "칼국수", "쌈밥"],
  quick: ["샌드위치", "김밥", "토스트", "편의점 도시락", "샐러드", "햄버거", "국수"],
  healthy: ["포케", "샤브샤브", "비빔밥", "생선구이", "순두부찌개", "월남쌈", "곤약막국수"],
  cheat: ["스테이크", "파스타", "수제버거", "초밥", "텐동", "마라탕", "양꼬치"]
};

const officeHacks = [
  "엑셀: Ctrl + T를 누르면 범위를 즉시 표로 변환할 수 있습니다.",
  "이메일: 제목 앞에 [보고], [요청], [공지] 등 말머리를 달면 회신율이 올라갑니다.",
  "크롬: 실수로 닫은 탭은 Ctrl + Shift + T로 다시 살릴 수 있습니다.",
  "메모: 윈도우 키 + V를 누르면 클립보드 히스토리를 볼 수 있습니다.",
  "회의: 회의록은 결론부터 적는 것이 나중에 확인하기 좋습니다.",
  "보고: 상사에게 보고할 때는 '결론-이유-방법' 순서로 말해보세요."
];

// 공통: 테마 토글
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  const htmlElement = document.documentElement;
  const updateToggleButton = (theme) => {
    themeToggle.textContent = theme === 'dark' ? '☀️ 라이트 모드' : '🌙 다크 모드';
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
}

// 1. 점심 추천 로직 (lunch.html 전용)
const recommendBtn = document.getElementById('recommend-btn');
if (recommendBtn) {
  const display = document.getElementById('recommendation-display');
  const categorySelect = document.getElementById('category-select');
  const mapLinkContainer = document.getElementById('map-link-container');

  recommendBtn.addEventListener('click', () => {
    const category = categorySelect.value;
    const options = lunchDatabase[category];
    const selected = options[Math.floor(Math.random() * options.length)];
    
    display.style.opacity = 0;
    setTimeout(() => {
      display.innerHTML = `오늘의 추천: <strong>${selected}</strong>`;
      display.style.opacity = 1;
      
      const searchQuery = encodeURIComponent(selected);
      mapLinkContainer.innerHTML = `
        <a href="https://map.kakao.com/?q=${searchQuery}" target="_blank" class="map-btn">
          💛 카카오맵에서 주변 '${selected}' 찾기
        </a>
      `;
    }, 150);
  });
  display.style.transition = 'opacity 0.2s';
}

// 2. 업무 꿀팁 로직 (office.html 전용)
const hackBtn = document.getElementById('hack-btn');
if (hackBtn) {
  const infoDisplay = document.getElementById('info-display');
  hackBtn.addEventListener('click', () => {
    const hack = officeHacks[Math.floor(Math.random() * officeHacks.length)];
    infoDisplay.textContent = hack;
  });
  // 초기 팁 로드
  hackBtn.click();
}
