// 오피스 헬퍼 - 메인 스크립트 (카카오맵 API 연동 버전)

// 1. 공통 기능: 테마 토글
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

// 2. 점심 추천 로직 (lunch.html 전용 - 카카오맵 API 사용)
const recommendBtn = document.getElementById('recommend-btn');
if (recommendBtn && typeof kakao !== 'undefined') {
  const ps = new kakao.maps.services.Places(); // 장소 검색 객체
  let miniMap = null;
  let marker = null;

  recommendBtn.addEventListener('click', () => {
    const category = document.getElementById('category-select').value;
    const loadingSpinner = document.getElementById('loading-spinner');
    const resultContainer = document.getElementById('result-container');

    loadingSpinner.style.display = 'block';
    resultContainer.style.display = 'none';

    // 사용자의 현재 위치 가져오기 (Geolocation)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude; // 위도
          const lng = position.coords.longitude; // 경도
          const userLocation = new kakao.maps.LatLng(lat, lng);

          // 장소 검색 옵션: 카테고리(음식점), 반경 10km (10000m)
          const searchOptions = {
            location: userLocation,
            radius: 10000, // 10km
            sort: kakao.maps.services.SortBy.DISTANCE
          };

          // 키워드로 장소 검색 (예: "강남역 한식")
          ps.keywordSearch(category, (data, status) => {
            loadingSpinner.style.display = 'none';

            if (status === kakao.maps.services.Status.OK) {
              // 검색된 식당 중 하나를 랜덤하게 선택
              const randomIndex = Math.floor(Math.random() * data.length);
              const selectedPlace = data[randomIndex];

              // 결과 표시
              displayRecommendation(selectedPlace);
            } else {
              alert('주변 10km 이내에 해당 조건의 식당을 찾을 수 없습니다.');
            }
          }, searchOptions);
        },
        () => {
          loadingSpinner.style.display = 'none';
          alert('위치 정보를 가져올 수 없습니다. 브라우저의 위치 권한을 확인해주세요.');
        }
      );
    } else {
      alert('이 브라우저는 위치 정보를 지원하지 않습니다.');
    }
  });

  // 추천 결과 화면 표시 함수
  function displayRecommendation(place) {
    const resultContainer = document.getElementById('result-container');
    const display = document.getElementById('recommendation-display');
    const addr = document.getElementById('place-address');
    const phone = document.getElementById('place-phone');
    const cate = document.getElementById('place-category');
    const mapLinkContainer = document.getElementById('map-link-container');

    display.innerHTML = `<strong>${place.place_name}</strong>`;
    addr.textContent = place.road_address_name || place.address_name;
    phone.textContent = place.phone || '전화번호 정보 없음';
    cate.textContent = place.category_name;
    
    mapLinkContainer.innerHTML = `
      <a href="${place.place_url}" target="_blank" class="map-btn">
        💛 카카오맵에서 상세보기 / 메뉴 확인
      </a>
    `;

    resultContainer.style.display = 'block';

    // 미니맵 생성 및 마커 표시
    const mapContainer = document.getElementById('mini-map');
    const placePosition = new kakao.maps.LatLng(place.y, place.x);

    const mapOption = {
      center: placePosition,
      level: 3 // 확대 레벨
    };

    if (!miniMap) {
      miniMap = new kakao.maps.Map(mapContainer, mapOption);
      marker = new kakao.maps.Marker({
        position: placePosition,
        map: miniMap
      });
    } else {
      miniMap.setCenter(placePosition);
      marker.setPosition(placePosition);
      miniMap.relayout(); // 지도가 정상적으로 표시되도록 재배치
    }
  }
}

// 3. 업무 꿀팁 로직 (office.html 전용)
const officeHackBtn = document.getElementById('hack-btn');
if (officeHackBtn) {
  const officeHacks = [
    "엑셀: Ctrl + T를 누르면 범위를 즉시 표로 변환할 수 있습니다.",
    "이메일: 제목 앞에 [보고], [요청], [공지] 등 말머리를 달면 회신율이 올라갑니다.",
    "크롬: 실수로 닫은 탭은 Ctrl + Shift + T로 다시 살릴 수 있습니다.",
    "메모: 윈도우 키 + V를 누르면 클립보드 히스토리를 볼 수 있습니다.",
    "회의: 회의록은 결론부터 적는 것이 나중에 확인하기 좋습니다.",
    "보고: 상사에게 보고할 때는 '결론-이유-방법' 순서로 말해보세요."
  ];
  const infoDisplay = document.getElementById('info-display');
  officeHackBtn.addEventListener('click', () => {
    const hack = officeHacks[Math.floor(Math.random() * officeHacks.length)];
    infoDisplay.textContent = hack;
  });
  officeHackBtn.click();
}
