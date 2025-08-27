<script lang="ts">
  // 타입 정의
  interface ClassInfo {
    name: string;
    room: string;
    professor: string;
    code?: string;
  }

  interface SchedulePeriod {
    period: string;
    time: string;
    classes: {
      mon: ClassInfo | null;
      tue: ClassInfo | null;
      wed: ClassInfo | null;
      thu: ClassInfo | null;
      fri: ClassInfo | null;
    };
  }

  // 교수별 색상 정보
  const professorColors = {
    '김경희': 'bg-red-500',
    '채미혜': 'bg-green-500',
    '윤영미': 'bg-blue-500',
    '최유석': 'bg-purple-500',
    '박현수': 'bg-orange-500',
    '김민영': 'bg-violet-500',
    '최낙윤': 'bg-pink-500',
    'none': 'bg-gray-400'
  };

  // 시간표 데이터 구조화
  const scheduleData: SchedulePeriod[] = [
    {
      period: '1교시',
      time: '9:00~9:50',
      classes: {
        mon: null,
        tue: { name: '캡스톤디자인(A)', room: '창조관 그래픽707', professor: '채미혜' },
        wed: { name: 'SNS시대와빅데이터의활용(A)', room: '창조관 전산711', professor: '윤영미' },
        thu: null,
        fri: null
      }
    },
    {
      period: '2교시',
      time: '10:00~10:50',
      classes: {
        mon: { name: '빅데이터분석활용(A)', room: '창조관 전산713', professor: '김경희' },
        tue: { name: '캡스톤디자인(A)', room: '창조관 그래픽707', professor: '채미혜' },
        wed: { name: 'SNS시대와빅데이터의활용(A)', room: '창조관 전산711', professor: '윤영미' },
        thu: null,
        fri: null
      }
    },
    {
      period: '3교시',
      time: '11:00~11:50',
      classes: {
        mon: { name: '빅데이터분석활용(A)', room: '창조관 전산713', professor: '김경희' },
        tue: { name: '캡스톤디자인(A)', room: '창조관 그래픽707', professor: '채미혜' },
        wed: { name: '채플(A)', room: '백석홀 백석홀(대)', professor: '최유석', code: 'G 050' },
        thu: null,
        fri: null
      }
    },
    {
      period: '4교시',
      time: '12:00~12:50',
      classes: {
        mon: { name: '빅데이터분석활용(A)', room: '창조관 전산713', professor: '김경희' },
        tue: null,
        wed: { name: '취업·창업멘토링(B)', room: '창조관 콘텐츠701', professor: '박현수' },
        thu: null,
        fri: null
      }
    },
    {
      period: '5교시',
      time: '13:00~13:50',
      classes: {
        mon: null,
        tue: { name: 'IT기술창업(A)', room: '창조관 무선인터넷702', professor: '박현수' },
        wed: null,
        thu: null,
        fri: null
      }
    },
    {
      period: '6교시',
      time: '14:00~14:50',
      classes: {
        mon: { name: '서버구축(A)', room: '창조관 OS706', professor: '김민영' },
        tue: { name: '자바실무(A)', room: '창조관 전산713', professor: '김경희' },
        wed: { name: '대중문화와소통(A)', room: '자유관 미디414', professor: '최낙윤' },
        thu: null,
        fri: null
      }
    },
    {
      period: '7교시',
      time: '15:00~15:50',
      classes: {
        mon: { name: '서버구축(A)', room: '창조관 OS706', professor: '김민영' },
        tue: { name: '자바실무(A)', room: '창조관 전산713', professor: '김경희' },
        wed: null,
        thu: null,
        fri: null
      }
    },
    {
      period: '8교시',
      time: '16:00~16:50',
      classes: {
        mon: { name: '서버구축(A)', room: '창조관 OS706', professor: '김민영' },
        tue: { name: '자바실무(A)', room: '창조관 전산713', professor: '김경희' },
        wed: null,
        thu: null,
        fri: null
      }
    }
  ];

  const dayNames = ['월', '화', '수', '목', '금'];
  const dayKeys = ['mon', 'tue', 'wed', 'thu', 'fri'];

  function getProfessorColor(professor: string): string {
    return (professorColors as Record<string, string>)[professor] || professorColors['none'];
  }

  // 요일별 데이터를 위한 함수
  function getClassesByDay(dayKey: 'mon' | 'tue' | 'wed' | 'thu' | 'fri') {
    return scheduleData
      .map(period => ({
        period: period.period,
        time: period.time,
        class: period.classes[dayKey]
      }))
      .filter(item => item.class !== null)
      .map(item => ({
        ...item,
        class: item.class!
      }));
  }
  
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
  let showDetails = false;
</script>

<div class="w-full {isMobile ? 'p-0 m-0 bg-transparent' : 'max-w-5xl mx-auto my-3 md:my-5 p-3 md:p-5 bg-white rounded-xl'}">
  <h1 class="text-center text-xl md:text-2xl font-bold text-gray-800 mb-2 md:mb-5">주간 강의 시간표</h1>
  
  <!-- 모바일 뷰 - 요일별 -->
  {#if isMobile}
    <div class="space-y-4 px-2">
      {#each dayNames as dayName, dayIndex}
        {@const dayKey = dayKeys[dayIndex] as 'mon' | 'tue' | 'wed' | 'thu' | 'fri'}
        {@const dayClasses = getClassesByDay(dayKey)}
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="bg-blue-500 text-white px-4 py-3 rounded-t-lg">
            <div class="flex justify-between items-center">
              <span class="font-bold text-lg">{dayName}요일</span>
              <span class="text-sm opacity-90">{dayClasses.length}개 수업</span>
            </div>
          </div>
          <div class="p-3">
            {#if dayClasses.length > 0}
              <div class="space-y-3">
                {#each dayClasses as item}
                  <div class="p-3 bg-gray-50 rounded-lg border-l-4 {getProfessorColor(item.class.professor).replace('bg-', 'border-')}">
                    <div class="flex justify-between items-start mb-2">
                      <div class="flex items-center gap-2">
                        <span class="text-xs font-medium text-gray-600 bg-white px-2 py-1 rounded">{item.period}</span>
                        <span class="text-xs text-gray-500">{item.time}</span>
                      </div>
                      <div class="w-3 h-3 rounded-full {getProfessorColor(item.class.professor)}"></div>
                    </div>
                    <div class="text-sm font-semibold text-gray-900 mb-1">{item.class.name}</div>
                    <div class="text-xs text-gray-600 mb-1">{item.class.room}</div>
                    {#if item.class.code}
                      <div class="text-xs text-amber-600 font-medium">{item.class.code}</div>
                    {/if}
                    <div class="text-xs text-gray-500 mt-1">교수: {item.class.professor}</div>
                  </div>
                {/each}
              </div>
            {:else}
              <div class="text-center text-gray-400 py-6">
                <div class="text-lg">📅</div>
                <div class="text-sm mt-1">이 날은 수업이 없습니다</div>
              </div>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <!-- 데스크톱 뷰 (기존 테이블) -->
    <div class="overflow-x-auto rounded-xl">
      <table class="w-full border-separate border-spacing-0 mb-2 md:mb-5 text-center overflow-hidden">
      <thead>
        <tr>
          <th class="bg-blue-500 text-white p-1 md:p-3 border-[0.5px] border-blue-400 w-[16%] rounded-tl-lg text-[10px] md:text-base">교시</th>
          <th class="bg-blue-500 text-white p-1 md:p-3 border-[0.5px] border-blue-400 w-[16%] text-[10px] md:text-base">월</th>
          <th class="bg-blue-500 text-white p-1 md:p-3 border-[0.5px] border-blue-400 w-[16%] text-[10px] md:text-base">화</th>
          <th class="bg-blue-500 text-white p-1 md:p-3 border-[0.5px] border-blue-400 w-[16%] text-[10px] md:text-base">수</th>
          <th class="bg-blue-500 text-white p-1 md:p-3 border-[0.5px] border-blue-400 w-[16%] text-[10px] md:text-base">목</th>
          <th class="bg-blue-500 text-white p-1 md:p-3 border-[0.5px] border-blue-400 w-[16%] rounded-tr-lg text-[10px] md:text-base">금</th>
        </tr>
      </thead>
      <tbody>
        <!-- 1교시 -->
        <tr>
          <td class="bg-gray-100 p-1 md:p-3 border-[0.5px] border-gray-200 text-center">
            <span class="text-[10px] md:text-sm font-medium">1교시</span>
            <span class="block text-[8px] md:text-xs text-gray-500 mt-0.5 md:mt-1">9:00~9:50</span>
          </td>
          <td class="p-1 md:p-3 border-[0.5px] border-gray-200"></td>
          <td class="p-1 md:p-3 border-[0.5px] border-gray-200 text-center">
            <div class="text-[9px] md:text-sm text-center">캡스톤디자인(A)</div>
            <div class="flex items-center justify-center mt-0.5 md:mt-1">
              <span class="text-[8px] md:text-xs bg-blue-50 text-gray-600 px-1 md:px-2 py-0.5 rounded-full border border-blue-100">창조관 그래픽707</span>
              <span class="w-1 h-1 md:w-2 md:h-2 rounded-full bg-green-500 ml-0.5 md:ml-1"></span>
            </div>
          </td>
          <td class="p-1 md:p-3 border-[0.5px] border-gray-200 text-center">
            <div class="text-[9px] md:text-sm text-center">SNS시대와빅데이터의활용(A)</div>
            <div class="flex items-center justify-center mt-0.5 md:mt-1">
              <span class="text-[8px] md:text-xs bg-blue-50 text-gray-600 px-1 md:px-2 py-0.5 rounded-full border border-blue-100">창조관 전산711</span>
              <span class="w-1 h-1 md:w-2 md:h-2 rounded-full bg-blue-500 ml-0.5 md:ml-1"></span>
            </div>
          </td>
          <td class="p-1 md:p-3 border-[0.5px] border-gray-200"></td>
          <td class="p-1 md:p-3 border-[0.5px] border-gray-200"></td>
        </tr>
        
        <!-- 2교시 -->
        <tr>
          <td class="bg-gray-100 p-1 md:p-3 border-[0.5px] border-gray-200 text-center">
            <span class="text-[10px] md:text-sm font-medium">2교시</span>
            <span class="block text-[8px] md:text-xs text-gray-500 mt-0.5 md:mt-1">10:00~10:50</span>
          </td>
          <td class="p-1 md:p-3 border-[0.5px] border-gray-200 text-center">
            <div class="text-[9px] md:text-sm text-center">빅데이터분석활용(A)</div>
            <div class="flex items-center justify-center mt-0.5 md:mt-1">
              <span class="text-[8px] md:text-xs bg-blue-50 text-gray-600 px-1 md:px-2 py-0.5 rounded-full border border-blue-100">창조관 전산713</span>
              <span class="w-1 h-1 md:w-2 md:h-2 rounded-full bg-red-500 ml-0.5 md:ml-1"></span>
            </div>
          </td>
          <td class="p-1 md:p-3 border-[0.5px] border-gray-200 text-center">
            <div class="text-[9px] md:text-sm text-center">캡스톤디자인(A)</div>
            <div class="flex items-center justify-center mt-0.5 md:mt-1">
              <span class="text-[8px] md:text-xs bg-blue-50 text-gray-600 px-1 md:px-2 py-0.5 rounded-full border border-blue-100">창조관 그래픽707</span>
              <span class="w-1 h-1 md:w-2 md:h-2 rounded-full bg-green-500 ml-0.5 md:ml-1"></span>
            </div>
          </td>
          <td class="p-1 md:p-3 border-[0.5px] border-gray-200 text-center">
            <div class="text-[9px] md:text-sm text-center">SNS시대와빅데이터의활용(A)</div>
            <div class="flex items-center justify-center mt-0.5 md:mt-1">
              <span class="text-[8px] md:text-xs bg-blue-50 text-gray-600 px-1 md:px-2 py-0.5 rounded-full border border-blue-100">창조관 전산711</span>
              <span class="w-1 h-1 md:w-2 md:h-2 rounded-full bg-blue-500 ml-0.5 md:ml-1"></span>
            </div>
          </td>
          <td class="p-1 md:p-3 border-[0.5px] border-gray-200"></td>
          <td class="p-1 md:p-3 border-[0.5px] border-gray-200"></td>
        </tr>
        
        <!-- 3교시 -->
        <tr>
          <td class="bg-gray-100 p-1 md:p-3 border-[0.5px] border-gray-200 text-center">
            <span class="text-[10px] md:text-sm font-medium">3교시</span>
            <span class="block text-[8px] md:text-xs text-gray-500 mt-0.5 md:mt-1">11:00~11:50</span>
          </td>
          <td class="p-1 md:p-3 border-[0.5px] border-gray-200 text-center">
            <div class="text-[9px] md:text-sm text-center">빅데이터분석활용(A)</div>
            <div class="flex items-center justify-center mt-0.5 md:mt-1">
              <span class="text-[8px] md:text-xs bg-blue-50 text-gray-600 px-1 md:px-2 py-0.5 rounded-full border border-blue-100">창조관 전산713</span>
              <span class="w-1 h-1 md:w-2 md:h-2 rounded-full bg-red-500 ml-0.5 md:ml-1"></span>
            </div>
          </td>
          <td class="p-1 md:p-3 border-[0.5px] border-gray-200 text-center">
            <div class="text-[9px] md:text-sm text-center">캡스톤디자인(A)</div>
            <div class="flex items-center justify-center mt-0.5 md:mt-1">
              <span class="text-[8px] md:text-xs bg-blue-50 text-gray-600 px-1 md:px-2 py-0.5 rounded-full border border-blue-100">창조관 그래픽707</span>
              <span class="w-1 h-1 md:w-2 md:h-2 rounded-full bg-green-500 ml-0.5 md:ml-1"></span>
            </div>
          </td>
          <td class="p-1 md:p-3 border-[0.5px] border-gray-200 text-center">
            <div class="text-[9px] md:text-sm text-center">
              채플(A)
              <span class="text-[8px] md:text-xs bg-amber-50 text-gray-600 px-1 md:px-2 py-0.5 rounded-full border border-amber-100 ml-1">G 050</span>
            </div>
            <div class="flex items-center justify-center mt-0.5 md:mt-1">
              <span class="text-[8px] md:text-xs bg-blue-50 text-gray-600 px-1 md:px-2 py-0.5 rounded-full border border-blue-100">백석홀 백석홀(대)</span>
              <span class="w-1 h-1 md:w-2 md:h-2 rounded-full bg-purple-500 ml-0.5 md:ml-1"></span>
            </div>
          </td>
          <td class="p-1 md:p-3 border-[0.5px] border-gray-200"></td>
          <td class="p-1 md:p-3 border-[0.5px] border-gray-200"></td>
        </tr>
        
        <!-- 4교시 -->
        <tr>
          <td class="bg-gray-100 p-1 md:p-3 border-[0.5px] border-gray-200 text-center">
            <span class="text-[10px] md:text-sm font-medium">4교시</span>
            <span class="block text-[8px] md:text-xs text-gray-500 mt-0.5 md:mt-1">12:00~12:50</span>
          </td>
          <td class="p-1 md:p-3 border-[0.5px] border-gray-200 text-center">
            <div class="text-[9px] md:text-sm text-center">빅데이터분석활용(A)</div>
            <div class="flex items-center justify-center mt-0.5 md:mt-1">
              <span class="text-[8px] md:text-xs bg-blue-50 text-gray-600 px-1 md:px-2 py-0.5 rounded-full border border-blue-100">창조관 전산713</span>
              <span class="w-1 h-1 md:w-2 md:h-2 rounded-full bg-red-500 ml-0.5 md:ml-1"></span>
            </div>
          </td>
          <td class="p-1 md:p-3 border-[0.5px] border-gray-200"></td>
          <td class="p-1 md:p-3 border-[0.5px] border-gray-200 text-center">
            <div class="text-[9px] md:text-sm text-center">취업·창업멘토링(B)</div>
            <div class="flex items-center justify-center mt-0.5 md:mt-1">
              <span class="text-[8px] md:text-xs bg-blue-50 text-gray-600 px-1 md:px-2 py-0.5 rounded-full border border-blue-100">창조관 콘텐츠701</span>
              <span class="w-1 h-1 md:w-2 md:h-2 rounded-full bg-orange-500 ml-0.5 md:ml-1"></span>
            </div>
          </td>
          <td class="p-1 md:p-3 border-[0.5px] border-gray-200"></td>
          <td class="p-1 md:p-3 border-[0.5px] border-gray-200"></td>
        </tr>
        
        <!-- 5교시 -->
        <tr>
          <td class="bg-gray-100 p-1 md:p-3 border-[0.5px] border-gray-200 text-center">
            <span class="text-[10px] md:text-sm font-medium">5교시</span>
            <span class="block text-[8px] md:text-xs text-gray-500 mt-0.5 md:mt-1">13:00~13:50</span>
          </td>
          <td class="p-1 md:p-3 border-[0.5px] border-gray-200"></td>
          <td class="p-1 md:p-3 border-[0.5px] border-gray-200 text-center">
            <div class="text-[9px] md:text-sm text-center">IT기술창업(A)</div>
            <div class="flex items-center justify-center mt-0.5 md:mt-1">
              <span class="text-[8px] md:text-xs bg-blue-50 text-gray-600 px-1 md:px-2 py-0.5 rounded-full border border-blue-100">창조관 무선인터넷702</span>
              <span class="w-1 h-1 md:w-2 md:h-2 rounded-full bg-orange-500 ml-0.5 md:ml-1"></span>
            </div>
          </td>
          <td class="p-1 md:p-3 border-[0.5px] border-gray-200"></td>
          <td class="p-1 md:p-3 border-[0.5px] border-gray-200"></td>
          <td class="p-1 md:p-3 border-[0.5px] border-gray-200"></td>
        </tr>
        
        <!-- 6교시 -->
        <tr>
          <td class="bg-gray-100 p-1 md:p-3 border-[0.5px] border-gray-200 text-center">
            <span class="text-[10px] md:text-sm font-medium">6교시</span>
            <span class="block text-[8px] md:text-xs text-gray-500 mt-0.5 md:mt-1">14:00~14:50</span>
          </td>
          <td class="p-1 md:p-3 border-[0.5px] border-gray-200 text-center">
            <div class="text-[9px] md:text-sm text-center">서버구축(A)</div>
            <div class="flex items-center justify-center mt-0.5 md:mt-1">
              <span class="text-[8px] md:text-xs bg-blue-50 text-gray-600 px-1 md:px-2 py-0.5 rounded-full border border-blue-100">창조관 OS706</span>
              <span class="w-1 h-1 md:w-2 md:h-2 rounded-full bg-violet-500 ml-0.5 md:ml-1"></span>
            </div>
          </td>
          <td class="p-1 md:p-3 border-[0.5px] border-gray-200 text-center">
            <div class="text-[9px] md:text-sm text-center">자바실무(A)</div>
            <div class="flex items-center justify-center mt-0.5 md:mt-1">
              <span class="text-[8px] md:text-xs bg-blue-50 text-gray-600 px-1 md:px-2 py-0.5 rounded-full border border-blue-100">창조관 전산713</span>
              <span class="w-1 h-1 md:w-2 md:h-2 rounded-full bg-red-500 ml-0.5 md:ml-1"></span>
            </div>
          </td>
          <td class="p-1 md:p-3 border-[0.5px] border-gray-200 text-center">
            <div class="text-[9px] md:text-sm text-center">대중문화와소통(A)</div>
            <div class="flex items-center justify-center mt-0.5 md:mt-1">
              <span class="text-[8px] md:text-xs bg-blue-50 text-gray-600 px-1 md:px-2 py-0.5 rounded-full border border-blue-100">자유관 미디414</span>
              <span class="w-1 h-1 md:w-2 md:h-2 rounded-full bg-pink-500 ml-0.5 md:ml-1"></span>
            </div>
          </td>
          <td class="p-1 md:p-3 border-[0.5px] border-gray-200"></td>
          <td class="p-1 md:p-3 border-[0.5px] border-gray-200"></td>
        </tr>
        
        <!-- 7교시 -->
        <tr>
          <td class="bg-gray-100 p-1 md:p-3 border-[0.5px] border-gray-200 text-center">
            <span class="text-[10px] md:text-sm font-medium">7교시</span>
            <span class="block text-[8px] md:text-xs text-gray-500 mt-0.5 md:mt-1">15:00~15:50</span>
          </td>
          <td class="p-1 md:p-3 border-[0.5px] border-gray-200 text-center">
            <div class="text-[9px] md:text-sm text-center">서버구축(A)</div>
            <div class="flex items-center justify-center mt-0.5 md:mt-1">
              <span class="text-[8px] md:text-xs bg-blue-50 text-gray-600 px-1 md:px-2 py-0.5 rounded-full border border-blue-100">창조관 OS706</span>
              <span class="w-1 h-1 md:w-2 md:h-2 rounded-full bg-violet-500 ml-0.5 md:ml-1"></span>
            </div>
          </td>
          <td class="p-1 md:p-3 border-[0.5px] border-gray-200 text-center">
            <div class="text-[9px] md:text-sm text-center">자바실무(A)</div>
            <div class="flex items-center justify-center mt-0.5 md:mt-1">
              <span class="text-[8px] md:text-xs bg-blue-50 text-gray-600 px-1 md:px-2 py-0.5 rounded-full border border-blue-100">창조관 전산713</span>
              <span class="w-1 h-1 md:w-2 md:h-2 rounded-full bg-red-500 ml-0.5 md:ml-1"></span>
            </div>
          </td>
          <td class="p-1 md:p-3 border-[0.5px] border-gray-200"></td>
          <td class="p-1 md:p-3 border-[0.5px] border-gray-200"></td>
          <td class="p-1 md:p-3 border-[0.5px] border-gray-200"></td>
        </tr>
        
        <!-- 8교시 -->
        <tr>
          <td class="bg-gray-100 p-1 md:p-3 border-[0.5px] border-gray-200 text-center rounded-bl-lg">
            <span class="text-[10px] md:text-sm font-medium">8교시</span>
            <span class="block text-[8px] md:text-xs text-gray-500 mt-0.5 md:mt-1">16:00~16:50</span>
          </td>
          <td class="p-1 md:p-3 border-[0.5px] border-gray-200 text-center">
            <div class="text-[9px] md:text-sm text-center">서버구축(A)</div>
            <div class="flex items-center justify-center mt-0.5 md:mt-1">
              <span class="text-[8px] md:text-xs bg-blue-50 text-gray-600 px-1 md:px-2 py-0.5 rounded-full border border-blue-100">창조관 OS706</span>
              <span class="w-1 h-1 md:w-2 md:h-2 rounded-full bg-violet-500 ml-0.5 md:ml-1"></span>
            </div>
          </td>
          <td class="p-1 md:p-3 border-[0.5px] border-gray-200 text-center">
            <div class="text-[9px] md:text-sm text-center">자바실무(A)</div>
            <div class="flex items-center justify-center mt-0.5 md:mt-1">
              <span class="text-[8px] md:text-xs bg-blue-50 text-gray-600 px-1 md:px-2 py-0.5 rounded-full border border-blue-100">창조관 전산713</span>
              <span class="w-1 h-1 md:w-2 md:h-2 rounded-full bg-red-500 ml-0.5 md:ml-1"></span>
            </div>
          </td>
          <td class="p-1 md:p-3 border-[0.5px] border-gray-200"></td>
          <td class="p-1 md:p-3 border-[0.5px] border-gray-200"></td>
          <td class="p-1 md:p-3 border-[0.5px] border-gray-200 text-center rounded-br-lg"></td>
        </tr>
      </tbody>
    </table>
    </div>
  {/if}
  
  <!-- 데스크톱에서만 보이는 버튼 -->
  <div class="hidden md:flex justify-center gap-4 mb-5">
    <button 
      class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
      on:click={() => showDetails = !showDetails}
    >
      {showDetails ? '강의 상세 정보 숨기기' : '강의 상세 정보 보기'}
    </button>
  </div>
  
  <!-- 모바일에서 보이는 아코디언 스타일 버튼 -->
  <div class="md:hidden flex justify-center gap-1 {isMobile ? 'mb-3 mt-4' : 'mb-2'}">
    <button 
      class="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors text-sm flex items-center"
      on:click={() => showDetails = !showDetails}
    >
      <span>{showDetails ? '상세 숨기기' : '상세 보기'}</span>
      <span class="ml-1">{showDetails ? '▲' : '▼'}</span>
    </button>
  </div>
  
  <!-- 강의 상세 정보 -->
  {#if showDetails && !isMobile}
    <!-- 데스크톱 상세 정보 -->
    <div class="bg-gray-50 border-[0.5px] border-gray-200 p-4 rounded-xl transition-all duration-300">
      <h3 class="font-bold text-lg text-gray-800 mb-3">강의 상세 정보</h3>
      
      <div class="grid grid-cols-2 gap-2">
        <div class="flex items-center">
          <span class="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
          <span>빅데이터분석활용(A) - 교수: 김경희</span>
        </div>
        
        <div class="flex items-center">
          <span class="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
          <span>캡스톤디자인(A) - 교수: 채미혜</span>
        </div>
        
        <div class="flex items-center">
          <span class="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
          <span>SNS시대와빅데이터의활용(A) - 교수: 윤영미</span>
        </div>
        
        <div class="flex items-center">
          <span class="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
          <span>채플(A) - 교수: 최유석</span>
        </div>
        
        <div class="flex items-center">
          <span class="w-2 h-2 rounded-full bg-orange-500 mr-2"></span>
          <span>취업·창업멘토링(B) - 교수: 박현수</span>
        </div>
        
        <div class="flex items-center">
          <span class="w-2 h-2 rounded-full bg-orange-500 mr-2"></span>
          <span>IT기술창업(A) - 교수: 박현수</span>
        </div>
        
        <div class="flex items-center">
          <span class="w-2 h-2 rounded-full bg-violet-500 mr-2"></span>
          <span>서버구축(A) - 교수: 김민영</span>
        </div>
        
        <div class="flex items-center">
          <span class="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
          <span>자바실무(A) - 교수: 김경희</span>
        </div>
        
        <div class="flex items-center">
          <span class="w-2 h-2 rounded-full bg-pink-500 mr-2"></span>
          <span>대중문화와소통(A) - 교수: 최낙윤</span>
        </div>
      </div>
      
      <div class="mt-4 pt-4 border-t border-gray-200">
        <div class="font-bold mb-2">교수별 색상 구분</div>
        <div class="flex flex-wrap gap-3">
          <div class="flex items-center"><span class="w-2 h-2 rounded-full bg-red-500 mr-1"></span> 김경희</div>
          <div class="flex items-center"><span class="w-2 h-2 rounded-full bg-green-500 mr-1"></span> 채미혜</div>
          <div class="flex items-center"><span class="w-2 h-2 rounded-full bg-blue-500 mr-1"></span> 윤영미</div>
          <div class="flex items-center"><span class="w-2 h-2 rounded-full bg-purple-500 mr-1"></span> 최유석</div>
          <div class="flex items-center"><span class="w-2 h-2 rounded-full bg-orange-500 mr-1"></span> 박현수</div>
          <div class="flex items-center"><span class="w-2 h-2 rounded-full bg-violet-500 mr-1"></span> 김민영</div>
          <div class="flex items-center"><span class="w-2 h-2 rounded-full bg-pink-500 mr-1"></span> 최낙윤</div>
          <div class="flex items-center"><span class="w-2 h-2 rounded-full bg-gray-400 mr-1"></span> 미지정</div>
        </div>
      </div>
    </div>
  {/if}
  
  <!-- 모바일 상세 정보 -->
  {#if showDetails && isMobile}
    <div class="bg-gray-50 border-[0.5px] border-gray-200 p-3 rounded-lg transition-all duration-300 mx-2">
      <h3 class="font-bold text-base text-gray-800 mb-3">강의 상세 정보</h3>
      
      <div class="space-y-2">
        <div class="flex items-center p-2 bg-white rounded-lg">
          <span class="w-3 h-3 rounded-full bg-red-500 mr-3"></span>
          <span class="text-sm">빅데이터분석활용(A) - 교수: 김경희</span>
        </div>
        
        <div class="flex items-center p-2 bg-white rounded-lg">
          <span class="w-3 h-3 rounded-full bg-green-500 mr-3"></span>
          <span class="text-sm">캡스톤디자인(A) - 교수: 채미혜</span>
        </div>
        
        <div class="flex items-center p-2 bg-white rounded-lg">
          <span class="w-3 h-3 rounded-full bg-blue-500 mr-3"></span>
          <span class="text-sm">SNS시대와빅데이터의활용(A) - 교수: 윤영미</span>
        </div>
        
        <div class="flex items-center p-2 bg-white rounded-lg">
          <span class="w-3 h-3 rounded-full bg-purple-500 mr-3"></span>
          <span class="text-sm">채플(A) - 교수: 최유석</span>
        </div>
        
        <div class="flex items-center p-2 bg-white rounded-lg">
          <span class="w-3 h-3 rounded-full bg-orange-500 mr-3"></span>
          <span class="text-sm">취업·창업멘토링(B) - 교수: 박현수</span>
        </div>
        
        <div class="flex items-center p-2 bg-white rounded-lg">
          <span class="w-3 h-3 rounded-full bg-orange-500 mr-3"></span>
          <span class="text-sm">IT기술창업(A) - 교수: 박현수</span>
        </div>
        
        <div class="flex items-center p-2 bg-white rounded-lg">
          <span class="w-3 h-3 rounded-full bg-violet-500 mr-3"></span>
          <span class="text-sm">서버구축(A) - 교수: 김민영</span>
        </div>
        
        <div class="flex items-center p-2 bg-white rounded-lg">
          <span class="w-3 h-3 rounded-full bg-red-500 mr-3"></span>
          <span class="text-sm">자바실무(A) - 교수: 김경희</span>
        </div>
        
        <div class="flex items-center p-2 bg-white rounded-lg">
          <span class="w-3 h-3 rounded-full bg-pink-500 mr-3"></span>
          <span class="text-sm">대중문화와소통(A) - 교수: 최낙윤</span>
        </div>
      </div>
      
      <div class="mt-4 pt-4 border-t border-gray-200">
        <div class="font-bold mb-3 text-sm">교수별 색상 구분</div>
        <div class="flex flex-wrap gap-2">
          <div class="flex items-center px-2 py-1 bg-white rounded text-xs"><span class="w-2 h-2 rounded-full bg-red-500 mr-2"></span> 김경희</div>
          <div class="flex items-center px-2 py-1 bg-white rounded text-xs"><span class="w-2 h-2 rounded-full bg-green-500 mr-2"></span> 채미혜</div>
          <div class="flex items-center px-2 py-1 bg-white rounded text-xs"><span class="w-2 h-2 rounded-full bg-blue-500 mr-2"></span> 윤영미</div>
          <div class="flex items-center px-2 py-1 bg-white rounded text-xs"><span class="w-2 h-2 rounded-full bg-purple-500 mr-2"></span> 최유석</div>
          <div class="flex items-center px-2 py-1 bg-white rounded text-xs"><span class="w-2 h-2 rounded-full bg-orange-500 mr-2"></span> 박현수</div>
          <div class="flex items-center px-2 py-1 bg-white rounded text-xs"><span class="w-2 h-2 rounded-full bg-violet-500 mr-2"></span> 김민영</div>
          <div class="flex items-center px-2 py-1 bg-white rounded text-xs"><span class="w-2 h-2 rounded-full bg-pink-500 mr-2"></span> 최낙윤</div>
          <div class="flex items-center px-2 py-1 bg-white rounded text-xs"><span class="w-2 h-2 rounded-full bg-gray-400 mr-2"></span> 미지정</div>
        </div>
      </div>
    </div>
  {/if}
</div> 