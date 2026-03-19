// 오피스 헬퍼 - 메인 스크립트 (카카오맵 API 안정화 버전)

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

// 2. 점심 추천 로직 (lunch.html)
const recommendBtn = document.getElementById('recommend-btn');
if (recommendBtn) {
  recommendBtn.addEventListener('click', () => {
    // 카카오맵 SDK 로드 여부 확인 및 명시적 로드
    if (typeof kakao !== 'undefined' && kakao.maps) {
      kakao.maps.load(() => {
        startRecommendation();
      });
    } else {
      alert('카카오맵 API가 로드되지 않았습니다. 도메인 등록 및 키를 확인해주세요.');
    }
  });
}

function startRecommendation() {
  const loadingSpinner = document.getElementById('loading-spinner');
  const resultContainer = document.getElementById('result-container');
  const category = document.getElementById('category-select').value;

  loadingSpinner.style.display = 'block';
  resultContainer.style.display = 'none';

  if (!navigator.geolocation) {
    alert('이 브라우저는 위치 정보를 지원하지 않습니다.');
    loadingSpinner.style.display = 'none';
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      try {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const userLocation = new kakao.maps.LatLng(lat, lng);

        // 장소 검색 서비스 객체 생성
        const ps = new kakao.maps.services.Places();

        // 카테고리에 따른 그룹 코드 설정 (음식점: FD6, 카페: CE7)
        const categoryGroupCode = (category === '카페') ? 'CE7' : 'FD6';

        // 키워드 검색 (10km 반경)
        ps.keywordSearch(category, (data, status) => {
          loadingSpinner.style.display = 'none';

          if (status === kakao.maps.services.Status.OK) {
            const randomIndex = Math.floor(Math.random() * data.length);
            const selectedPlace = data[randomIndex];
            displayResult(selectedPlace);
          } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
            alert('주변 10km 이내에 해당 메뉴의 식당을 찾을 수 없습니다.');
          } else {
            alert('검색 중 오류가 발생했습니다. (상태코드: ' + status + ')');
          }
        }, {
          location: userLocation,
          radius: 10000,
          category_group_code: categoryGroupCode,
          sort: kakao.maps.services.SortBy.DISTANCE
        });
      } catch (e) {
        console.error(e);
        loadingSpinner.style.display = 'none';
        alert('추천 기능을 실행하는 중 오류가 발생했습니다: ' + e.message);
      }
    },
    (err) => {
      loadingSpinner.style.display = 'none';
      let errorMsg = '위치 정보를 가져올 수 없습니다.';
      if (err.code === 1) errorMsg += ' (위치 권한이 거부되었습니다)';
      else if (err.code === 2) errorMsg += ' (위치 확인 불가)';
      else if (err.code === 3) errorMsg += ' (시간 초과)';
      alert(errorMsg + ': ' + err.message);
    },
    { enableHighAccuracy: false, timeout: 10000 }
  );
}

let map = null;
let marker = null;

function displayResult(place) {
  const container = document.getElementById('result-container');
  const mapContainer = document.getElementById('mini-map');
  
  document.getElementById('recommendation-display').innerHTML = `오늘의 메뉴: <strong>${place.place_name}</strong>`;
  document.getElementById('place-address').textContent = place.road_address_name || place.address_name;
  document.getElementById('place-phone').textContent = place.phone || '전화번호 정보 없음';
  document.getElementById('place-category').textContent = place.category_name;
  
  document.getElementById('map-link-container').innerHTML = `
    <a href="${place.place_url}" target="_blank" class="map-btn">
      💛 카카오맵에서 상세 정보 & 메뉴 확인
    </a>
  `;

  container.style.display = 'block';

  const position = new kakao.maps.LatLng(place.y, place.x);
  const options = { center: position, level: 3 };

  // 지도가 이미 생성되어 있으면 위치만 이동, 없으면 새로 생성
  if (!map) {
    map = new kakao.maps.Map(mapContainer, options);
    marker = new kakao.maps.Marker({ position: position, map: map });
  } else {
    map.setCenter(position);
    marker.setPosition(position);
    setTimeout(() => { map.relayout(); map.setCenter(position); }, 100);
  }
}

// 3. 업무 꿀팁 로직 (office.html)
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
