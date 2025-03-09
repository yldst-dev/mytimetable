<script lang="ts">
  // 교수별 색상 정보
  const professorColors = {
    '김경희': 'bg-red-500',
    '김은태': 'bg-green-500',
    '김용숙': 'bg-blue-500',
    '최유석': 'bg-purple-500',
    '박현수': 'bg-orange-500',
    '김정연': 'bg-cyan-500',
    '김민영': 'bg-violet-500',
    'none': 'bg-gray-400'
  };
  
  // 서비스인성 관련 날짜 정보
  const davinci: string[] = ['3/26', '4/2', '4/9'];
  const serviceAcademy: string[] = ['4/23', '4/30', '5/7', '5/14', '5/21', '5/28'];
  
  // 현재 날짜를 'M/D' 형식으로 변환하는 함수
  function formatCurrentDate(): string {
    const now = new Date();
    const month = now.getMonth() + 1; // getMonth()는 0부터 시작하므로 1을 더함
    const day = now.getDate();
    return `${month}/${day}`;
  }
  
  import { onMount } from 'svelte';
  
  // 현재 날짜 상태 (기본값은 오늘 날짜)
  let currentDate: string = formatCurrentDate();
  
  // 날짜 변경 함수
  function setCurrentDate(date: string): void {
    currentDate = date;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('currentDate', date);
    }
  }
  
  // 날짜 초기화 함수
  function resetCurrentDate(): void {
    currentDate = formatCurrentDate();
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('currentDate');
    }
  }
  
  // 모바일 화면 여부 확인
  let isMobile = false;
  
  onMount(() => {
    // localStorage에서 저장된 날짜 가져오기
    const savedDate = localStorage.getItem('currentDate');
    if (savedDate) {
      currentDate = savedDate;
    }
    
    // 콘솔에서 접근할 수 있도록 전역 객체에 함수 추가
    (window as any).setCurrentDate = setCurrentDate;
    (window as any).resetCurrentDate = resetCurrentDate;
    
    // 초기 화면 크기 확인
    checkMobileScreen();
    
    // 화면 크기 변경 시 이벤트 리스너 추가
    window.addEventListener('resize', checkMobileScreen);
    
    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('resize', checkMobileScreen);
    };
  });
  
  // 화면 크기에 따라 모바일 여부 확인
  function checkMobileScreen() {
    isMobile = window.innerWidth < 768;
  }
  
  // 토글 상태
  let showNotice = false;
  let showDetails = false;
  
  // 서비스인성 수업 여부 확인 함수
  function isServiceClass(date: string): boolean {
    return davinci.includes(date) || serviceAcademy.includes(date);
  }
</script>

<div class="max-w-5xl mx-auto my-3 md:my-5 p-3 md:p-5 bg-white rounded-xl">
  <h1 class="text-center text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-5">주간 강의 시간표</h1>
  
  <!-- 모바일 화면에서 날짜 선택 옵션 -->
  <div class="md:hidden mb-4">
    <div class="flex justify-center gap-2 mb-3">
      <button 
        class="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg text-sm transition-colors"
        on:click={() => resetCurrentDate()}
      >
        오늘 날짜로 보기
      </button>
      
      <select 
        class="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded-lg text-sm"
        on:change={(e) => {
          const target = e.target as HTMLSelectElement;
          if (target && target.value) {
            setCurrentDate(target.value);
          }
        }}
        value={currentDate}
      >
        <option disabled>날짜 선택</option>
        <optgroup label="다빈치아카데미">
          {#each davinci as date}
            <option value={date}>{date} (다빈치)</option>
          {/each}
        </optgroup>
        <optgroup label="서비스인성아카데미">
          {#each serviceAcademy as date}
            <option value={date}>{date} (서비스인성)</option>
          {/each}
        </optgroup>
      </select>
    </div>
    
    <div class="text-center text-sm text-gray-600 mb-2">
      현재 선택된 날짜: <span class="font-semibold">{currentDate}</span>
      {#if isServiceClass(currentDate)}
        <span class="text-amber-600 ml-1">
          ({davinci.includes(currentDate) ? '다빈치아카데미' : '서비스인성아카데미'})
        </span>
      {/if}
    </div>
  </div>
  
  <div class="overflow-x-auto rounded-xl">
    <table class="w-full border-separate border-spacing-0 mb-3 md:mb-5 text-center overflow-hidden">
      <thead>
        <tr>
          <th class="bg-blue-500 text-white p-2 md:p-3 border-[0.5px] border-blue-400 w-1/6 rounded-tl-lg text-xs md:text-base">교시</th>
          <th class="bg-blue-500 text-white p-2 md:p-3 border-[0.5px] border-blue-400 w-1/6 text-xs md:text-base">월</th>
          <th class="bg-blue-500 text-white p-2 md:p-3 border-[0.5px] border-blue-400 w-1/6 text-xs md:text-base">화</th>
          <th class="bg-blue-500 text-white p-2 md:p-3 border-[0.5px] border-blue-400 w-1/6 text-xs md:text-base">수</th>
          <th class="bg-blue-500 text-white p-2 md:p-3 border-[0.5px] border-blue-400 w-1/6 text-xs md:text-base">목</th>
          <th class="bg-blue-500 text-white p-2 md:p-3 border-[0.5px] border-blue-400 w-1/6 rounded-tr-lg text-xs md:text-base">금</th>
        </tr>
      </thead>
      <tbody>
        <!-- 1교시 -->
        <tr>
          <td class="bg-gray-100 p-1.5 md:p-3 border-[0.5px] border-gray-200 text-center">
            <span class="text-xs md:text-sm font-medium">1교시</span>
            <span class="block text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1">9:00~9:50</span>
          </td>
          <td class="p-1.5 md:p-3 border-[0.5px] border-gray-200"></td>
          <td class="p-1.5 md:p-3 border-[0.5px] border-gray-200"></td>
          <td class="p-1.5 md:p-3 border-[0.5px] border-gray-200"></td>
          <td class="p-1.5 md:p-3 border-[0.5px] border-gray-200"></td>
          <td class="p-1.5 md:p-3 border-[0.5px] border-gray-200"></td>
        </tr>
        
        <!-- 2교시 -->
        <tr>
          <td class="bg-gray-100 p-1.5 md:p-3 border-[0.5px] border-gray-200 text-center">
            <span class="text-xs md:text-sm font-medium">2교시</span>
            <span class="block text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1">10:00~10:50</span>
          </td>
          <td class="p-1.5 md:p-3 border-[0.5px] border-gray-200 text-center"></td>
          <td class="p-1.5 md:p-3 border-[0.5px] border-gray-200 text-center">
            <div class="text-[11px] md:text-sm text-center">데이터베이스실무(A)</div>
            <div class="flex items-center justify-center mt-0.5 md:mt-1">
              <span class="text-[10px] md:text-xs bg-blue-50 text-gray-600 px-1 md:px-2 py-0.5 rounded-full border border-blue-100">창조관 전산712</span>
              <span class="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-red-500 ml-1"></span>
            </div>
          </td>
          <td class="p-1.5 md:p-3 border-[0.5px] border-gray-200 text-center">
            <div class="text-[11px] md:text-sm text-center">성서의지혜(A)</div>
            <div class="flex items-center justify-center mt-0.5 md:mt-1">
              <span class="text-[10px] md:text-xs bg-blue-50 text-gray-600 px-1 md:px-2 py-0.5 rounded-full border border-blue-100">창조관 미디610</span>
              <span class="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500 ml-1"></span>
            </div>
          </td>
          <td class="p-1.5 md:p-3 border-[0.5px] border-gray-200 text-center">
            <div class="text-[11px] md:text-sm text-center">UI/UX실무(A)</div>
            <div class="flex items-center justify-center mt-0.5 md:mt-1">
              <span class="text-[10px] md:text-xs bg-blue-50 text-gray-600 px-1 md:px-2 py-0.5 rounded-full border border-blue-100">창조관 702</span>
              <span class="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-blue-500 ml-1"></span>
            </div>
          </td>
          <td class="p-1.5 md:p-3 border-[0.5px] border-gray-200 text-center">
            <div class="text-[11px] md:text-sm text-center">파이썬(A)</div>
            <div class="flex items-center justify-center mt-0.5 md:mt-1">
              <span class="text-[10px] md:text-xs bg-blue-50 text-gray-600 px-1 md:px-2 py-0.5 rounded-full border border-blue-100">창조관 전산712</span>
              <span class="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-red-500 ml-1"></span>
            </div>
          </td>
        </tr>
        
        <!-- 3교시 -->
        <tr>
          <td class="bg-gray-100 p-1.5 md:p-3 border-[0.5px] border-gray-200 text-center">
            <span class="text-xs md:text-sm font-medium">3교시</span>
            <span class="block text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1">11:00~11:50</span>
          </td>
          <td class="p-1.5 md:p-3 border-[0.5px] border-gray-200 text-center"></td>
          <td class="p-1.5 md:p-3 border-[0.5px] border-gray-200 text-center">
            <div class="text-[11px] md:text-sm text-center">데이터베이스실무(A)</div>
            <div class="flex items-center justify-center mt-0.5 md:mt-1">
              <span class="text-[10px] md:text-xs bg-blue-50 text-gray-600 px-1 md:px-2 py-0.5 rounded-full border border-blue-100">창조관 전산712</span>
              <span class="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-red-500 ml-1"></span>
            </div>
          </td>
          <td class="p-1.5 md:p-3 border-[0.5px] border-gray-200 text-center">
            <div class="text-[11px] md:text-sm text-center">
              채플(A)
              <span class="text-[10px] md:text-xs bg-amber-50 text-gray-600 px-1 md:px-2 py-0.5 rounded-full border border-amber-100 ml-1">G 050</span>
            </div>
            <div class="flex items-center justify-center mt-0.5 md:mt-1">
              <span class="text-[10px] md:text-xs bg-blue-50 text-gray-600 px-1 md:px-2 py-0.5 rounded-full border border-blue-100">백석홀(대)</span>
              <span class="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-purple-500 ml-1"></span>
            </div>
          </td>
          <td class="p-1.5 md:p-3 border-[0.5px] border-gray-200 text-center">
            <div class="text-[11px] md:text-sm text-center">UI/UX실무(A)</div>
            <div class="flex items-center justify-center mt-0.5 md:mt-1">
              <span class="text-[10px] md:text-xs bg-blue-50 text-gray-600 px-1 md:px-2 py-0.5 rounded-full border border-blue-100">창조관 702</span>
              <span class="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-blue-500 ml-1"></span>
            </div>
          </td>
          <td class="p-1.5 md:p-3 border-[0.5px] border-gray-200 text-center">
            <div class="text-[11px] md:text-sm text-center">파이썬(A)</div>
            <div class="flex items-center justify-center mt-0.5 md:mt-1">
              <span class="text-[10px] md:text-xs bg-blue-50 text-gray-600 px-1 md:px-2 py-0.5 rounded-full border border-blue-100">창조관 전산712</span>
              <span class="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-red-500 ml-1"></span>
            </div>
          </td>
        </tr>
        
        <!-- 4교시 -->
        <tr>
          <td class="bg-gray-100 p-1.5 md:p-3 border-[0.5px] border-gray-200 text-center">
            <span class="text-xs md:text-sm font-medium">4교시</span>
            <span class="block text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1">12:00~12:50</span>
          </td>
          <td class="p-1.5 md:p-3 border-[0.5px] border-gray-200 text-center"></td>
          <td class="p-1.5 md:p-3 border-[0.5px] border-gray-200 text-center">
            <div class="text-[11px] md:text-sm text-center">데이터베이스실무(A)</div>
            <div class="flex items-center justify-center mt-0.5 md:mt-1">
              <span class="text-[10px] md:text-xs bg-blue-50 text-gray-600 px-1 md:px-2 py-0.5 rounded-full border border-blue-100">창조관 전산712</span>
              <span class="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-red-500 ml-1"></span>
            </div>
          </td>
          <td class="p-1.5 md:p-3 border-[0.5px] border-gray-200 text-center"></td>
          <td class="p-1.5 md:p-3 border-[0.5px] border-gray-200 text-center">
            <div class="text-[11px] md:text-sm text-center">UI/UX실무(A)</div>
            <div class="flex items-center justify-center mt-0.5 md:mt-1">
              <span class="text-[10px] md:text-xs bg-blue-50 text-gray-600 px-1 md:px-2 py-0.5 rounded-full border border-blue-100">창조관 702</span>
              <span class="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-blue-500 ml-1"></span>
            </div>
          </td>
          <td class="p-1.5 md:p-3 border-[0.5px] border-gray-200 text-center">
            <div class="text-[11px] md:text-sm text-center">파이썬(A)</div>
            <div class="flex items-center justify-center mt-0.5 md:mt-1">
              <span class="text-[10px] md:text-xs bg-blue-50 text-gray-600 px-1 md:px-2 py-0.5 rounded-full border border-blue-100">창조관 전산712</span>
              <span class="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-red-500 ml-1"></span>
            </div>
          </td>
        </tr>
        
        <!-- 5교시 -->
        <tr>
          <td class="bg-gray-100 p-1.5 md:p-3 border-[0.5px] border-gray-200 text-center">
            <span class="text-xs md:text-sm font-medium">5교시</span>
            <span class="block text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1">13:00~13:50</span>
          </td>
          <td class="p-1.5 md:p-3 border-[0.5px] border-gray-200 text-center"></td>
          <td class="p-1.5 md:p-3 border-[0.5px] border-gray-200 text-center"></td>
          <td class="p-1.5 md:p-3 border-[0.5px] border-gray-200 text-center">
            {#if isServiceClass(currentDate)}
              <div class="text-[11px] md:text-sm text-center">서비스인성(A)</div>
              <div class="flex items-center justify-center mt-0.5 md:mt-1">
                <span class="text-[10px] md:text-xs bg-blue-50 text-gray-600 px-1 md:px-2 py-0.5 rounded-full border border-blue-100">
                  {davinci.includes(currentDate) ? '백석홀 소강당' : '창조관 610'}
                </span>
                <span class="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gray-400 ml-1"></span>
              </div>
              <div class="text-[10px] md:text-xs text-amber-600 mt-0.5 md:mt-1">
                {davinci.includes(currentDate) ? '다빈치' : '서비스인성'}
              </div>
            {:else}
              <div class="text-[11px] md:text-sm text-gray-400 text-center">/</div>
            {/if}
          </td>
          <td class="p-1.5 md:p-3 border-[0.5px] border-gray-200 text-center"></td>
          <td class="p-1.5 md:p-3 border-[0.5px] border-gray-200 text-center"></td>
        </tr>
        
        <!-- 6교시 -->
        <tr>
          <td class="bg-gray-100 p-1.5 md:p-3 border-[0.5px] border-gray-200 text-center">
            <span class="text-xs md:text-sm font-medium">6교시</span>
            <span class="block text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1">14:00~14:50</span>
          </td>
          <td class="p-1.5 md:p-3 border-[0.5px] border-gray-200 text-center"></td>
          <td class="p-1.5 md:p-3 border-[0.5px] border-gray-200 text-center">
            <div class="text-[11px] md:text-sm text-center">자바기초(A)</div>
            <div class="flex items-center justify-center mt-0.5 md:mt-1">
              <span class="text-[10px] md:text-xs bg-blue-50 text-gray-600 px-1 md:px-2 py-0.5 rounded-full border border-blue-100">창조관 그래픽707</span>
              <span class="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-orange-500 ml-1"></span>
            </div>
          </td>
          <td class="p-1.5 md:p-3 border-[0.5px] border-gray-200 text-center"></td>
          <td class="p-1.5 md:p-3 border-[0.5px] border-gray-200 text-center">
            <div class="text-[11px] md:text-sm text-center">하드웨어실습(A)</div>
            <div class="flex items-center justify-center mt-0.5 md:mt-1">
              <span class="text-[10px] md:text-xs bg-blue-50 text-gray-600 px-1 md:px-2 py-0.5 rounded-full border border-blue-100">창조관 OS706</span>
              <span class="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-violet-500 ml-1"></span>
            </div>
          </td>
          <td class="p-1.5 md:p-3 border-[0.5px] border-gray-200 text-center"></td>
        </tr>
        
        <!-- 7교시 -->
        <tr>
          <td class="bg-gray-100 p-1.5 md:p-3 border-[0.5px] border-gray-200 text-center">
            <span class="text-xs md:text-sm font-medium">7교시</span>
            <span class="block text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1">15:00~15:50</span>
          </td>
          <td class="p-1.5 md:p-3 border-[0.5px] border-gray-200 text-center"></td>
          <td class="p-1.5 md:p-3 border-[0.5px] border-gray-200 text-center">
            <div class="text-[11px] md:text-sm text-center">자바기초(A)</div>
            <div class="flex items-center justify-center mt-0.5 md:mt-1">
              <span class="text-[10px] md:text-xs bg-blue-50 text-gray-600 px-1 md:px-2 py-0.5 rounded-full border border-blue-100">창조관 그래픽707</span>
              <span class="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-orange-500 ml-1"></span>
            </div>
          </td>
          <td class="p-1.5 md:p-3 border-[0.5px] border-gray-200 text-center">
            <div class="text-[11px] md:text-sm text-center">자기개발(A)</div>
            <div class="flex items-center justify-center mt-0.5 md:mt-1">
              <span class="text-[10px] md:text-xs bg-blue-50 text-gray-600 px-1 md:px-2 py-0.5 rounded-full border border-blue-100">창조관 미디610</span>
              <span class="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-cyan-500 ml-1"></span>
            </div>
          </td>
          <td class="p-1.5 md:p-3 border-[0.5px] border-gray-200 text-center">
            <div class="text-[11px] md:text-sm text-center">하드웨어실습(A)</div>
            <div class="flex items-center justify-center mt-0.5 md:mt-1">
              <span class="text-[10px] md:text-xs bg-blue-50 text-gray-600 px-1 md:px-2 py-0.5 rounded-full border border-blue-100">창조관 OS706</span>
              <span class="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-violet-500 ml-1"></span>
            </div>
          </td>
          <td class="p-1.5 md:p-3 border-[0.5px] border-gray-200 text-center"></td>
        </tr>
        
        <!-- 8교시 -->
        <tr>
          <td class="bg-gray-100 p-1.5 md:p-3 border-[0.5px] border-gray-200 text-center rounded-bl-lg">
            <span class="text-xs md:text-sm font-medium">8교시</span>
            <span class="block text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1">16:00~16:50</span>
          </td>
          <td class="p-1.5 md:p-3 border-[0.5px] border-gray-200 text-center"></td>
          <td class="p-1.5 md:p-3 border-[0.5px] border-gray-200 text-center">
            <div class="text-[11px] md:text-sm text-center">자바기초(A)</div>
            <div class="flex items-center justify-center mt-0.5 md:mt-1">
              <span class="text-[10px] md:text-xs bg-blue-50 text-gray-600 px-1 md:px-2 py-0.5 rounded-full border border-blue-100">창조관 그래픽707</span>
              <span class="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-orange-500 ml-1"></span>
            </div>
          </td>
          <td class="p-1.5 md:p-3 border-[0.5px] border-gray-200 text-center"></td>
          <td class="p-1.5 md:p-3 border-[0.5px] border-gray-200 text-center">
            <div class="text-[11px] md:text-sm text-center">하드웨어실습(A)</div>
            <div class="flex items-center justify-center mt-0.5 md:mt-1">
              <span class="text-[10px] md:text-xs bg-blue-50 text-gray-600 px-1 md:px-2 py-0.5 rounded-full border border-blue-100">창조관 OS706</span>
              <span class="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-violet-500 ml-1"></span>
            </div>
          </td>
          <td class="p-1.5 md:p-3 border-[0.5px] border-gray-200 text-center rounded-br-lg"></td>
        </tr>
      </tbody>
    </table>
  </div>
  
  <!-- 데스크톱에서만 보이는 버튼 -->
  <div class="hidden md:flex justify-center gap-4 mb-5">
    <button 
      class="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg transition-colors"
      on:click={() => showNotice = !showNotice}
    >
      {showNotice ? '서비스인성 공지 숨기기' : '서비스인성 공지 보기'}
    </button>
    
    <button 
      class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
      on:click={() => showDetails = !showDetails}
    >
      {showDetails ? '강의 상세 정보 숨기기' : '강의 상세 정보 보기'}
    </button>
  </div>
  
  <!-- 모바일에서 보이는 아코디언 스타일 버튼 -->
  <div class="md:hidden mb-3">
    <button 
      class="w-full px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg transition-colors mb-2 flex justify-between items-center"
      on:click={() => showNotice = !showNotice}
    >
      <span>{showNotice ? '서비스인성 공지 숨기기' : '서비스인성 공지 보기'}</span>
      <span class="text-lg">{showNotice ? '▲' : '▼'}</span>
    </button>
    
    <button 
      class="w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors flex justify-between items-center"
      on:click={() => showDetails = !showDetails}
    >
      <span>{showDetails ? '강의 상세 정보 숨기기' : '강의 상세 정보 보기'}</span>
      <span class="text-lg">{showDetails ? '▲' : '▼'}</span>
    </button>
  </div>
  
  <!-- 서비스인성 관련 공지 -->
  {#if showNotice}
    <div class="bg-amber-50 border-[0.5px] border-amber-200 p-3 md:p-4 rounded-xl mb-3 md:mb-5 transition-all duration-300 text-sm md:text-base">
      <h3 class="font-bold text-md md:text-lg text-gray-800 mb-2">서비스인성 관련 공지 정리</h3>
      
      <p class="mb-2"><strong>수요일 5교시</strong>: 서비스인성 교과목 진행</p>
      
      <h4 class="font-bold text-sm md:text-md text-amber-800 mt-2 md:mt-3 mb-1">다빈치아카데미 일정 (총 3회)</h4>
      <ul class="list-disc pl-5 mb-2 md:mb-3">
        <li><strong>날짜</strong>: 3/26, 4/2, 4/9</li>
        <li><strong>장소</strong>: 백석홀 소강당</li>
        <li><strong>시간</strong>: 13:30까지 도착</li>
      </ul>
      
      <h4 class="font-bold text-sm md:text-md text-amber-800 mt-2 md:mt-3 mb-1">서비스인성아카데미 일정 (총 6회)</h4>
      <ul class="list-disc pl-5">
        <li><strong>날짜</strong>: 4/23, 4/30, 5/7, 5/14, 5/21, 5/28</li>
        <li><strong>장소</strong>: 창조관 610호</li>
      </ul>
    </div>
  {/if}
  
  <!-- 강의 상세 정보 -->
  {#if showDetails}
    <div class="bg-gray-50 border-[0.5px] border-gray-200 p-3 md:p-4 rounded-xl transition-all duration-300 text-sm md:text-base">
      <h3 class="font-bold text-md md:text-lg text-gray-800 mb-2 md:mb-3">강의 상세 정보</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-2">
        <div class="flex items-center">
          <span class="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-red-500 mr-1 md:mr-2"></span>
          <span>데이터베이스실무(A) - 교수: 김경희</span>
        </div>
        
        <div class="flex items-center">
          <span class="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500 mr-1 md:mr-2"></span>
          <span>성서의지혜(A) - 교수: 김은태</span>
        </div>
        
        <div class="flex items-center">
          <span class="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-blue-500 mr-1 md:mr-2"></span>
          <span>UI/UX실무(A) - 교수: 김용숙</span>
        </div>
        
        <div class="flex items-center">
          <span class="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-purple-500 mr-1 md:mr-2"></span>
          <span>채플(A) - 교수: 최유석</span>
        </div>
        
        <div class="flex items-center">
          <span class="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-orange-500 mr-1 md:mr-2"></span>
          <span>자바기초(A) - 교수: 박현수</span>
        </div>
        
        <div class="flex items-center">
          <span class="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-cyan-500 mr-1 md:mr-2"></span>
          <span>자기개발(A) - 교수: 김정연</span>
        </div>
        
        <div class="flex items-center">
          <span class="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-violet-500 mr-1 md:mr-2"></span>
          <span>하드웨어실습(A) - 교수: 김민영</span>
        </div>
      </div>
      
      <div class="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-200">
        <div class="font-bold mb-1 md:mb-2">교수별 색상 구분</div>
        <div class="flex flex-wrap gap-2 md:gap-3">
          <div class="flex items-center"><span class="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-red-500 mr-1"></span> 김경희</div>
          <div class="flex items-center"><span class="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500 mr-1"></span> 김은태</div>
          <div class="flex items-center"><span class="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-blue-500 mr-1"></span> 김용숙</div>
          <div class="flex items-center"><span class="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-purple-500 mr-1"></span> 최유석</div>
          <div class="flex items-center"><span class="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-orange-500 mr-1"></span> 박현수</div>
          <div class="flex items-center"><span class="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-cyan-500 mr-1"></span> 김정연</div>
          <div class="flex items-center"><span class="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-violet-500 mr-1"></span> 김민영</div>
          <div class="flex items-center"><span class="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gray-400 mr-1"></span> 미지정</div>
        </div>
      </div>
    </div>
  {/if}
</div> 