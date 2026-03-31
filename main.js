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

// 4. 자산 관리 로직 (money.html)
const assetForm = document.getElementById('asset-form');
if (assetForm) {
  const assetListContainer = document.getElementById('asset-list-container');
  const totalAssetValue = document.getElementById('total-asset-value');
  const summaryGeneral = document.getElementById('summary-general');
  const summarySavings = document.getElementById('summary-savings');
  const summarySecurities = document.getElementById('summary-securities');

  let assets = JSON.parse(localStorage.getItem('userAssets')) || [];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원';
  };

  const renderAssets = () => {
    if (assets.length === 0) {
      assetListContainer.innerHTML = '<p style="text-align: center; opacity: 0.5; margin: 40px 0;">아직 입력된 자산 정보가 없습니다.</p>';
      totalAssetValue.textContent = '0원';
      summaryGeneral.textContent = '0원';
      summarySavings.textContent = '0원';
      summarySecurities.textContent = '0원';
      return;
    }

    const totals = { '입출금': 0, '저축': 0, '증권': 0 };
    let grandTotal = 0;

    // 유형별로 그룹화
    const grouped = assets.reduce((acc, asset) => {
      if (!acc[asset.type]) acc[asset.type] = [];
      acc[asset.type].push(asset);
      totals[asset.type] += Number(asset.balance);
      grandTotal += Number(asset.balance);
      return acc;
    }, {});

    let html = '';
    for (const type in grouped) {
      html += `
        <div class="asset-group">
          <h4 class="asset-type-header">${type} (${formatCurrency(totals[type])})</h4>
          <table class="asset-table">
            <tbody>
              ${grouped[type].map(asset => `
                <tr>
                  <td>
                    <strong>${asset.bank}</strong><br>
                    <small style="opacity: 0.6;">${asset.name || '-'}</small>
                  </td>
                  <td class="amount">${formatCurrency(asset.balance)}</td>
                  <td style="width: 40px; text-align: right;">
                    <button class="delete-btn" data-id="${asset.id}">삭제</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    assetListContainer.innerHTML = html;
    totalAssetValue.textContent = formatCurrency(grandTotal);
    summaryGeneral.textContent = formatCurrency(totals['입출금']);
    summarySavings.textContent = formatCurrency(totals['저축']);
    summarySecurities.textContent = formatCurrency(totals['증권']);

    // 삭제 이벤트 연결
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        assets = assets.filter(a => a.id !== id);
        localStorage.setItem('userAssets', JSON.stringify(assets));
        renderAssets();
      });
    });
  };

  assetForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newAsset = {
      id: Date.now().toString(),
      type: document.getElementById('asset-type').value,
      bank: document.getElementById('bank-name').value,
      name: document.getElementById('account-name').value,
      balance: document.getElementById('asset-balance').value
    };

    assets.push(newAsset);
    localStorage.setItem('userAssets', JSON.stringify(assets));
    assetForm.reset();
    renderAssets();
  });

  renderAssets();
}

// 5. 스케줄 & 알람 로직 (schedule.html)
const scheduleForm = document.getElementById('schedule-form');
if (scheduleForm) {
  const scheduleListContainer = document.getElementById('schedule-list-container');
  let schedules = JSON.parse(localStorage.getItem('userSchedules')) || [];

  const renderSchedules = () => {
    if (schedules.length === 0) {
      scheduleListContainer.innerHTML = '<p style="text-align: center; opacity: 0.5; margin: 40px 0;">등록된 일정이 없습니다.</p>';
      return;
    }

    // 시간순 정렬
    schedules.sort((a, b) => new Date(a.time) - new Date(b.time));

    let html = `
      <table class="asset-table">
        <thead>
          <tr>
            <th>일정 내용</th>
            <th>시간</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${schedules.map(item => {
            const isPast = new Date(item.time) < new Date();
            return `
              <tr style="${isPast ? 'opacity: 0.5;' : ''}">
                <td>
                  <strong>${item.title}</strong>
                  ${isPast ? ' <small>(종료)</small>' : ''}
                </td>
                <td>${item.time.replace('T', ' ')}</td>
                <td style="text-align: right;">
                  <button class="delete-schedule-btn" data-id="${item.id}" style="background:none; border:none; color:#ef4444; cursor:pointer;">삭제</button>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;
    scheduleListContainer.innerHTML = html;

    // 삭제 이벤트
    document.querySelectorAll('.delete-schedule-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        schedules = schedules.filter(s => s.id !== id);
        localStorage.setItem('userSchedules', JSON.stringify(schedules));
        renderSchedules();
      });
    });
  };

  scheduleForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newSchedule = {
      id: Date.now().toString(),
      title: document.getElementById('schedule-title').value,
      time: document.getElementById('schedule-time').value,
      notified: false
    };

    schedules.push(newSchedule);
    localStorage.setItem('userSchedules', JSON.stringify(schedules));
    scheduleForm.reset();
    renderSchedules();
    
    // 알림 권한 요청 (브라우저 알림)
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  });

  // 알람 체크 (1분마다)
  setInterval(() => {
    const now = new Date();
    let updated = false;

    schedules.forEach(s => {
      const scheduleTime = new Date(s.time);
      // 예약 시간이 지났고 아직 알림을 보내지 않았으며, 5분 이내의 일정인 경우
      if (scheduleTime <= now && !s.notified && (now - scheduleTime) < 300000) {
        if (Notification.permission === 'granted') {
          new Notification('📅 오피스 헬퍼 일정 알림', {
            body: `일정: ${s.title}`,
            icon: '/favicon.ico'
          });
        } else {
          alert(`⏰ 알람: ${s.title}`);
        }
        s.notified = true;
        updated = true;
      }
    });

    if (updated) {
      localStorage.setItem('userSchedules', JSON.stringify(schedules));
      renderSchedules();
    }
  }, 10000); // 10초마다 체크

  renderSchedules();
}
