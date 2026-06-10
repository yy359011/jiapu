<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { SURNAMES, BOOKS, type Surname, type Book } from './data';
import { 
  Search, 
  ArrowRight, 
  Document
} from '@element-plus/icons-vue';
import BookReader from './components/BookReader.vue';

// App tabs: 'home' | 'browse'
const currentTab = ref<'home' | 'browse'>('home');

// Selected surname on Home Page
const selectedSurnameName = ref<string>('陈');
const selectedSurname = computed(() => {
  return SURNAMES.find(s => s.name === selectedSurnameName.value) || SURNAMES[0];
});

// Surname list letter filter
const selectedLetter = ref<string>('全');
const letters = ['全', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

// Surnames filtered by letter
const filteredSurnames = computed(() => {
  if (selectedLetter.value === '全') {
    return SURNAMES;
  }
  return SURNAMES.filter(s => s.key === selectedLetter.value);
});

// Surname list letter filter for browse tab
const browseLetter = ref<string>('全');
const browseLetters = letters;
const browseFilteredSurnames = computed(() => {
  if (browseLetter.value === '全') {
    return SURNAMES;
  }
  return SURNAMES.filter(s => s.key === browseLetter.value);
});

// Search inputs
const searchInput = ref('');

// List of books for the active browse state
const activeSurnameSearch = ref<string>('陈');
const activeBookId = ref<string>('lc-chen-2003');

// List of books matching the clicked or searched surname
const browseBooks = computed(() => {
  let list = BOOKS.filter(b => b.surname === activeSurnameSearch.value);
  if (list.length === 0) {
    const sName = activeSurnameSearch.value;
    list = [{
      id: `gen-${sName}-book`,
      surname: sName,
      title: `${sName === '古籍' ? '' : sName + '氏'}历代宗谱`,
      revision: "2006年续修版",
      volumes: "全 8 册",
      location: `${sName}氏开基祖地`,
      compiler: `${sName}文渊 / ${sName}德成`,
      time: "公元2006年 (岁次丙戌)",
      format: "线装 (Thread-bound)",
      library: `省档案馆地方藏书部 / ${sName === '古籍' ? '古籍馆' : sName + '氏宗祠'}`,
      serialNo: `YW-GEN-${sName}-2006-08`,
      abstract: `本谱叙述了${sName}氏氏族自唐宋祖居以来的繁衍迁徙历史与源流。内容包含：先祖源流考、世系图、家训家规、历代贤达传略。此次重修在大德古本基础上进行了大量的勘误与增补，重点收录了世代流向江南及沿海各省市的族人分支信息。全书纸张考究，采用手工宣纸印制，具有极高的文献研究与宗族传承价值。`,
      pages: [
        "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=600"
      ]
    }];
  }
  return list;
});

// Selected book
const activeBook = computed(() => {
  return browseBooks.value.find(b => b.id === activeBookId.value) || browseBooks.value[0];
});

// Search action
const handleSearch = () => {
  if (!searchInput.value.trim()) return;
  
  const query = searchInput.value.trim();
  // Find matching surname or book
  const foundSurname = SURNAMES.find(s => 
    s.name.includes(query) || 
    s.fullName.includes(query) || 
    s.pinyin.includes(query.toLowerCase())
  );
  
  if (foundSurname) {
    selectedSurnameName.value = foundSurname.name;
    activeSurnameSearch.value = foundSurname.name;
    // Find first book of this surname
    const firstBook = browseBooks.value.find(b => b.surname === foundSurname.name);
    if (firstBook) {
      activeBookId.value = firstBook.id;
    }
  } else {
    // Search in book titles
    const foundBook = BOOKS.find(b => b.title.includes(query) || b.abstract.includes(query));
    if (foundBook) {
      activeSurnameSearch.value = foundBook.surname;
      activeBookId.value = foundBook.id;
      selectedSurnameName.value = foundBook.surname;
    }
  }
  
  // Transition
  currentTab.value = 'browse';
};

// Select surname and browse
const navigateToBrowse = (surnameName: string) => {
  activeSurnameSearch.value = surnameName;
  const firstBook = browseBooks.value.find(b => b.surname === surnameName);
  if (firstBook) {
    activeBookId.value = firstBook.id;
  }
  currentTab.value = 'browse';
};

// Toggle index filtering list and select appropriate surname
const selectLetterFilter = (letter: string) => {
  selectedLetter.value = letter;
  const results = SURNAMES.filter(s => letter === '全' ? true : s.key === letter);
  if (results.length > 0) {
    selectedSurnameName.value = results[0].name;
  }
};

// Selecting a surname in home grid lists
const selectSurnameHome = (surname: Surname) => {
  selectedSurnameName.value = surname.name;
};

// Interactive Digitized Viewer Modal State
const viewerVisible = ref(false);
const activePage = ref(1);
const zoomLevel = ref(100);
const viewerTheme = ref<'sepia' | 'cream' | 'dark'>('sepia');

// Standard digital images page items (calligraphy style contents for vertical writing)
const mockAncientTexts = [
  {
    title: "龙川陈氏宗谱 · 序言",
    content: "粤稽水木之源，人伦之始。木有根而枝叶茂，水有源而溪流长。夫人不本于祖宗，则乌知其所自出？陈氏大宗，自颍川分迁以来，历宋、元、明、清数百载。代有贤能，功勋彪炳，忠考传家，振振君子。今岁重修，敬叙世系，承古励今，庶后之子孙，知创业之维艰，而克勤克俭，克孝克顺，是以序焉。"
  },
  {
    title: "太丘陈氏家规十章",
    content: "一曰孝顺父母：凡我族人，立身以孝为本。无忤逆，无犯上。\n二曰和睦乡里：同气连枝，周急继匮，勿以小嫌害大义。\n三曰勤学敦行：子弟必令读书，成才报国，明理守信。\n四曰敬姜守法：奉公守国章，毋陷刑辟，毋伤宗规。\n五曰戒奢从俭：婚丧祭祀，一从简朴，毋以此倾家荡产。\n六曰谨行慎言：行端表正，不议人非，言行一致，光前裕后。"
  },
  {
    title: "颍川分迁江南考",
    content: "晋永嘉之乱，中原衣冠南渡。吾陈氏始祖太丘公之裔，自中原辗转南下，大部由豫省经赣、闽，终择浙中龙川落足。龙川此地，山峦拱秀，带水萦回，田野沃野。自始祖结庐以来，耕读并重，历十余代，瓜瓿绵延，分支浙东二十余村，蔚为江南大族。皆由先贤德泽，后嗣守成之报也。"
  },
  {
    title: "世系一世祖至五世祖",
    content: "一世：胡公妫满。配大姬氏，生封公。居陈地。\n二世：申公。配高氏，生突公。继绍大业。\n三世：武公。居太丘，立德立言，天下陈氏尊焉。\n四世：完公。避齐居姜，以大才辅国，后世齐相也。\n五世：昌公。迁颍川，世守家声。至南宋时，裔孙陈兴，为龙川始迁祖，举家适于义乌之南，修竹茂林，立业家焉。"
  }
];

const totalViewerPages = 4;

const openViewer = () => {
  activePage.value = 1;
  viewerVisible.value = true;
};

const nextPage = () => {
  if (activePage.value < totalViewerPages) {
    activePage.value++;
  }
};

const prevPage = () => {
  if (activePage.value > 1) {
    activePage.value--;
  }
};

// Lineage tree visualization state
const lineageModalVisible = ref(false);
const selectedNodeIndex = ref<number | null>(null);

const lineageNodes = ref([
  { name: "太丘开基祖", gen: "第1代", life: "晋代大中大夫", detail: "陈实公。德高望重，荀慈明、韩元长等皆尊师之。世称‘太丘德星’。" },
  { name: "中原南迁祖", gen: "第12代", life: "唐末建武将军", detail: "陈迈公。率部置义乌，筑龙川祖居，遂为义乌开基之始迁祖。" },
  { name: "义乌龙川一世祖", gen: "第21代", life: "宋翰林侍读", detail: "陈兴公。南宋建炎年间避金兵自北迁浙中，兴义塾、兴水利，功在桑梓。" },
  { name: "东阳义门分派祖", gen: "第28代", life: "元代经学大家", detail: "陈德新公。建义门陈氏高节，百口同伙共食，立规百余条，闻名江浙。" },
  { name: "重修理事长", gen: "第35代", life: "2003年主修者", detail: "陈德兴先生。博古通今，四方奔走五年，汇集陈氏20余个村落文献修成此谱。" }
]);

const openLineageModal = () => {
  selectedNodeIndex.value = 2; // Default select active ancestor
  lineageModalVisible.value = true;
};

// Home Page banner background slideshow/carousel references
const bannerSlides = [
  {
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=1600",
    title: "藏书古阁"
  },
  {
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=1600",
    title: "古籍书海"
  },
  {
    image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=1600",
    title: "宗谱文献"
  },
  {
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=1600",
    title: "翰墨丹青"
  }
];
const currentBannerIndex = ref(0);
let bannerIntervalId: any = null;

onMounted(() => {
  bannerIntervalId = setInterval(() => {
    currentBannerIndex.value = (currentBannerIndex.value + 1) % bannerSlides.length;
  }, 4000); // Transition every 4 seconds
});

onUnmounted(() => {
  if (bannerIntervalId) {
    clearInterval(bannerIntervalId);
  }
});

const getSurnameKinds = (surname: Surname) => {
  const count = BOOKS.filter(b => b.surname === surname.name).length;
  return count > 0 ? count : 1;
};

const TONE_PINYIN_MAP: Record<string, string> = {
  "陈": "chén",
  "张": "zhāng",
  "赵": "zhào",
  "钱": "qián",
  "孙": "sūn",
  "李": "lǐ",
  "周": "zhōu",
  "吴": "wú",
  "郑": "zhèng",
  "王": "wáng",
  "冯": "féng",
  "卫": "wèi",
  "蒋": "jiǎng",
  "沈": "shěn",
  "韩": "hán",
  "杨": "yáng",
  "朱": "zhū",
  "秦": "qín",
  "尤": "yóu",
  "许": "xǔ",
  "何": "hé",
  "吕": "lǚ",
  "施": "shī",
  "孔": "kǒng",
  "曹": "cáo",
  "严": "yán",
  "华": "huà",
  "金": "jīn",
  "魏": "wèi",
  "陶": "táo",
  "姜": "jiāng",
  "戚": "qī",
  "谢": "xiè",
  "邹": "zōu",
  "喻": "yù",
  "柏": "bǎi",
  "水": "shuǐ",
  "窦": "dòu",
  "章": "zhāng",
  "云": "yún",
  "苏": "sū",
  "潘": "pān",
  "葛": "gě",
  "奚": "xī",
  "范": "fàn",
  "彭": "péng",
  "郎": "láng",
  "鲁": "lǔ",
  "韦": "wéi",
  "昌": "chāng",
  "马": "mǎ",
  "苗": "miáo",
  "凤": "fèng",
  "花": "huā",
  "方": "fāng",
  "俞": "yú",
  "任": "rèn",
  "袁": "yuán",
  "柳": "liǔ",
  "唐": "táng",
  "薛": "xuē",
  "雷": "léi",
  "贺": "hè",
  "罗": "luó",
  "毕": "bì",
  "郝": "hǎo",
  "邬": "wū",
  "顾": "gù",
  "孟": "mèng",
  "黄": "huáng",
  "萧": "xiāo",
  "姚": "yáo",
  "梁": "liáng",
  "杜": "dù",
  "阮": "ruǎn",
  "蓝": "lán",
  "季": "jì",
  "古籍": "gǔ jí",
  "村志": "cūn zhì"
};

const getPinyinWithTone = (name: string, defaultPinyin: string) => {
  return TONE_PINYIN_MAP[name] || defaultPinyin.toLowerCase();
};
</script>

<template>
  <div class="min-h-screen bg-archive-pulp text-[#2C2621] font-sans antialiased selection:bg-[#8B3E1F] selection:text-white pb-16">
    <!-- Header -->
    <header class="sticky top-0 z-40 bg-[#FFF] border-b border-[#F0EBE5] shadow-xs px-6 py-4 flex items-center justify-between">
      <div 
        class="flex items-center gap-3 cursor-pointer group"
        @click="currentTab = 'home'"
        id="header-logo"
      >
        <span class="text-2xl font-bold tracking-widest text-[#5C2E16] font-serif transition group-hover:text-[#8B3E1F]">
          家谱档案馆
        </span>
        <div class="h-4 w-[1px] bg-[#E0D8CE]" />
        <span class="text-xs text-[#8A7E72] tracking-wider uppercase font-mono mt-1 hidden sm:inline-block">
          Genealogy Archive & Digital Library
        </span>
      </div>

      <nav class="flex items-center gap-8" id="header-nav">
        <button 
          @click="currentTab = 'home'"
          :class="[
            'text-[15px] font-medium py-1 px-1 relative transition-all duration-300',
            currentTab === 'home' 
              ? 'text-[#8B3E1F] font-bold' 
              : 'text-[#61554C] hover:text-[#8B3E1F]'
          ]"
          id="nav-home"
        >
          首页
          <span 
            v-if="currentTab === 'home'" 
            class="absolute bottom-[-17px] left-0 right-0 h-[3px] bg-[#8B3E1F] rounded-full" 
          />
        </button>
        <button 
          @click="currentTab = 'browse'"
          :class="[
            'text-[15px] font-medium py-1 px-1 relative transition-all duration-300',
            currentTab === 'browse' 
              ? 'text-[#8B3E1F] font-bold' 
              : 'text-[#61554C] hover:text-[#8B3E1F]'
          ]"
          id="nav-browse"
        >
          家谱浏览
          <span 
            v-if="currentTab === 'browse'" 
            class="absolute bottom-[-17px] left-0 right-0 h-[3px] bg-[#8B3E1F] rounded-full" 
          />
        </button>
      </nav>
    </header>

    <!-- Main Content Panel -->
    <main class="w-full">
      <!-- ==================== HOME TAB ==================== -->
      <div v-if="currentTab === 'home'" class="animate-fadeIn">
        
        <!-- Hero/Banner Section with floating portrait elements and carousel background -->
        <section 
          class="relative w-full py-16 md:py-24 border-b border-[#F0E5D3] overflow-hidden flex flex-col items-center justify-center px-4"
          id="hero-banner"
        >
          <!-- Background Slideshow Carousel -->
          <div class="absolute inset-0 z-0 overflow-hidden">
            <div 
              v-for="(slide, idx) in bannerSlides" 
              :key="idx"
              class="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
              :style="{
                backgroundImage: `url(${slide.image})`,
                opacity: currentBannerIndex === idx ? '0.22' : '0'
              }"
            />
            <!-- Classic Warm Paper Textured Overlay to preserve contrast and thematic styling -->
            <div class="absolute inset-0 bg-gradient-to-b from-[#EFE8D9]/75 via-[#E8DEC9]/85 to-[#FDFBF7] mix-blend-multiply" />
          </div>

          <!-- Classical Chinese Landscape Background / Ambient overlay -->
          <div class="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay z-0">
            <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <filter id="noise">
                <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.07 0"/>
              </filter>
              <rect width="100%" height="100%" filter="url(#noise)"/>
            </svg>
          </div>

          <!-- Abstract mountains drawing behind elements -->
          <div class="absolute bottom-0 inset-x-0 h-40 pointer-events-none opacity-20">
            <svg viewBox="0 0 1440 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full object-cover">
              <path d="M0 200 L300 80 L600 160 L900 40 L1200 140 L1440 60 L1440 200 Z" fill="#5C2E16"/>
            </svg>
          </div>



          <!-- Central translucent query container -->
          <div 
            class="relative w-full max-w-3xl bg-[#F7F2E7]/90 backdrop-blur-md rounded-2xl border border-white/60 p-8 md:p-10 shadow-xl"
            id="search-container-box"
          >
            <div class="text-center mb-8">
              <h1 class="text-4xl md:text-5xl font-extrabold text-[#4F2511] font-serif tracking-widest mt-2">
                寻根问祖 · 续脉传家
              </h1>
              <p class="text-[14px] leading-relaxed text-[#736357] max-w-xl mx-auto mt-4 font-normal">
                收录历代家谱文献，数字化呈现家族迁徙史、功德录与世系脉络，让每一份血缘记忆都有迹可循。
              </p>
            </div>

            <!-- Search input bar -->
            <div class="flex items-center bg-[#FFF] rounded-xl overflow-hidden shadow-md border border-[#E0D1B5] p-1.5 focus-within:border-[#8B3E1F] focus-within:ring-2 focus-within:ring-[#8B3E1F]/20 transition-all">
              <el-input
                v-model="searchInput"
                placeholder="输入您的姓氏，如“陈”、“张”..."
                class="flex-1 custom-el-input-large"
                :input-style="{ border: 'none', boxShadow: 'none', fontSize: '16px', color: '#2C2621' }"
                @keyup.enter="handleSearch"
                id="search-surname-input"
              />
              <el-button 
                type="primary"
                @click="handleSearch"
                class="!bg-[#8B3E1F] !border-[#8B3E1F] hover:!bg-[#732F15] !text-white !font-bold !px-8 !py-6 !rounded-lg !text-[15px] flex items-center gap-2 transition"
                id="search-button-action"
               >
                <el-icon><Search /></el-icon>
                搜索
              </el-button>
            </div>
          </div>

          <!-- Carousel Slideshow Indicators -->
          <div class="absolute bottom-4 flex gap-2.5 z-10" id="hero-carousel-indicators">
            <button
              v-for="(slide, idx) in bannerSlides"
              :key="idx"
              @click="currentBannerIndex = idx"
              class="w-2.5 h-2.5 rounded-full transition-all duration-300 relative group"
              :class="currentBannerIndex === idx ? 'bg-[#8B3E1F] w-7' : 'bg-[#8B3E1F]/20 hover:bg-[#8B3E1F]/50'"
            >
              <span class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#4F2511] text-white text-[10px] font-medium py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none shadow-md">
                {{ slide.title }}
              </span>
            </button>
          </div>
        </section>

        <!-- Dynamic Alphabet Index selector -->
        <section class="max-w-7xl mx-auto px-6 mt-12" id="alphabet-filter-section">
          <div class="flex items-center flex-wrap gap-x-3 gap-y-4 py-4 border-b border-[#F0EBE5]">
            <!-- Circle of Selected element -->
            <button
              v-for="letter in letters"
              :key="letter"
              @click="selectLetterFilter(letter)"
              :class="[
                'text-[14px] font-medium w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300',
                selectedLetter === letter 
                  ? 'bg-[#8B3E1F] text-white font-bold shadow-md scale-105' 
                  : 'text-[#6C5F54] hover:text-[#8B3E1F] hover:bg-[#F0EAE1]'
              ]"
            >
              {{ letter }}
            </button>
          </div>
        </section>

        <!-- Main Cards Grid Section -->
        <section class="max-w-7xl mx-auto px-6 mt-10 md:mt-12" id="home-cards-grid-section">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            <!-- Highlight Main Card (Left Column) -->
            <div class="lg:col-span-7" id="highlight-surname-card">
              <div class="relative bg-highlight-traditional border border-[#E0D9CE] rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-300 min-h-[420px] flex flex-col justify-between overflow-hidden">
                <!-- Background stamp watermark (1:1 visual style tag stamp) -->
                <div class="absolute bottom-6 right-6 opacity-8 pointer-events-none w-52 h-52 text-[#8B3E1F]/10">
                  <svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z" />
                  </svg>
                </div>

                <!-- Card Content -->
                <div>
                  <div class="flex items-center justify-between mb-4">
                    <h2 class="text-3xl font-bold text-[#5C2E16] font-serif">
                      {{ selectedSurname.fullName }}
                    </h2>
                    <span class="text-[24px] font-bold font-serif tracking-wide text-[#8B3E1F] dark:text-amber-500 lowercase">
                      {{ getPinyinWithTone(selectedSurname.name, selectedSurname.pinyin) }}
                    </span>
                  </div>

                  <p class="text-[15px] leading-relaxed text-[#5C5045] mb-8 max-w-xl font-normal">
                    {{ selectedSurname.desc }}
                  </p>

                  <div class="grid grid-cols-2 gap-6 border-t border-[#F2EDE6] pt-6 mr-10">
                    <div>
                      <span class="text-xs text-[#8A7E72] block uppercase tracking-wider mb-1">
                        收藏册数
                      </span>
                      <span class="text-3xl font-bold text-[#8B3E1F] font-serif">
                        {{ selectedSurname.name === '古籍' ? '48' : '128' }} 册
                      </span>
                    </div>
                    <div>
                      <span class="text-xs text-[#8A7E72] block uppercase tracking-wider mb-1">
                        撰修时间
                      </span>
                      <span class="text-xl font-bold text-[#3B3026]">
                        {{ selectedSurname.revisionTime }}
                      </span>
                    </div>
                  </div>
                </div>

                <div class="pt-8 flex items-center gap-4">
                  <el-button 
                    @click="navigateToBrowse(selectedSurname.name)"
                    class="!bg-[#8B3E1F] !border-[#8B3E1F] hover:!bg-[#732F15] !text-white !font-bold !px-6 !py-5.5 !rounded-lg !text-[14px] flex items-center gap-2 shadow-xs transition"
                    id="find-clan-button"
                  >
                    查询世系表
                    <el-icon><ArrowRight /></el-icon>
                  </el-button>
                </div>
              </div>
            </div>

            <!-- Smaller Surname List Cards (Right Column - 1:1 layout) -->
            <div class="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4 content-start max-h-[620px] overflow-y-auto pr-2 [*::-webkit-scrollbar]:w-1.5 [*::-webkit-scrollbar-track]:bg-transparent [*::-webkit-scrollbar-thumb]:bg-[#D8CBB6] [*::-webkit-scrollbar-thumb]:rounded-full hover:[*::-webkit-scrollbar-thumb]:bg-[#8B3E1F]" id="secondary-surnames-list">
              <div 
                v-for="surname in filteredSurnames" 
                :key="surname.name"
                @click="selectSurnameHome(surname)"
                :class="[
                  'group border rounded-xl p-4 cursor-pointer flex items-center justify-between transition-all duration-300 hover:shadow-md hover:border-[#8B3E1F]/60 hover:bg-[#FAF8F5]/85 hover:-translate-y-0.5',
                  selectedSurnameName === surname.name
                    ? 'bg-card-selected-traditional border-[#8B3E1F] ring-1 ring-[#8B3E1F] shadow-xs' 
                    : 'bg-card-traditional border-[#E0D9CE]'
                ]"
              >
                <div class="flex items-center gap-3 min-w-0">
                  <!-- Styled Square Emblem matching logo -->
                  <div 
                    :class="[
                      'w-10 h-10 rounded-lg flex items-center justify-center font-serif text-base font-bold transition-all duration-300 shrink-0 group-hover:scale-105',
                      selectedSurnameName === surname.name
                        ? 'bg-[#8B3E1F] text-white'
                        : 'bg-[#F2ECE1] text-[#5C2E16] group-hover:bg-[#8B3E1F]/15 group-hover:text-[#8B3E1F]'
                    ]"
                  >
                    {{ surname.charBadge }}
                  </div>
                  <div class="min-w-0">
                    <div class="flex items-center gap-1.5 min-w-0">
                      <h3 class="text-sm font-bold text-[#44382E] truncate" :title="surname.fullName">
                        {{ surname.fullName }}
                      </h3>
                      <span 
                        v-if="surname.subtext.includes('常见姓氏')" 
                        class="px-1 py-0.5 text-[9px] scale-90 origin-left border border-[#8B3E1F]/20 bg-[#FBF8F3] text-[#8B3E1F] rounded-xs font-serif shrink-0 font-semibold"
                      >
                        常见
                      </span>
                    </div>
                    <p class="text-[11px] text-[#8A7E72] font-mono mt-0.5 truncate">
                      {{ surname.pinyin }}
                    </p>
                  </div>
                </div>

                <div class="text-right border-l border-[#F0EBE5] pl-3 min-w-[85px] shrink-0">
                  <span class="text-xs text-[#8B3E1F] font-bold block">
                    {{ getSurnameKinds(surname) }} 种
                  </span>
                  <span class="text-[10px] text-[#8A7E72] font-mono mt-0.5 block truncate">
                    {{ surname.population }}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </section>

      </div>

      <!-- ==================== BROWSE TAB ==================== -->
      <div v-else class="max-w-7xl mx-auto px-6 py-8 animate-fadeIn" id="browse-data-viewer">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <!-- Left Column: Search Result Navigation list (1:1 with image 2) -->
          <div class="lg:col-span-4 flex flex-col gap-6" id="left-results-navigation">
            
            <!-- Family Badge Indicator on top -->
            <div class="bg-[#F6EFE2] rounded-xl border border-[#DFD3BA] p-6 flex items-center gap-5">
              <div class="w-[56px] h-[56px] bg-[#8B3E1F] text-white rounded-lg flex items-center justify-center font-serif text-2xl font-bold shadow-sm">
                {{ activeSurnameSearch }}
              </div>
              <div>
                <h2 class="text-lg font-bold text-[#432313] font-serif">
                  姓氏：{{ activeSurnameSearch }}氏
                </h2>
                <p class="text-xs text-[#8A7E72] font-mono mt-0.5">
                  共检索到 {{ browseBooks.length }} 条记录
                </p>
              </div>
            </div>

            <!-- List container item -->
            <div class="bg-white border border-[#E0D9CE] rounded-xl overflow-hidden shadow-xs">
              <div class="bg-[#FDFBF7] px-5 py-3 border-b border-[#F0EBE5]">
                <span class="text-xs font-bold text-[#8A7E72] uppercase tracking-wider">
                  检索结果列表
                </span>
              </div>

              <div class="divide-y divide-[#F2EDE6]" id="book-items-list-container">
                <div
                  v-for="book in browseBooks"
                  :key="book.id"
                  @click="activeBookId = book.id"
                  :class="[
                    'p-5 cursor-pointer flex gap-4 transition-all duration-200 border-l-[4px]',
                    activeBookId === book.id 
                      ? 'bg-[#FCFAF2] border-[#8B3E1F] font-bold' 
                      : 'border-transparent hover:bg-[#FAF9F5]'
                  ]"
                >
                  <!-- Classy small icon of a classical book -->
                  <div class="mt-1 text-[#8A7E72]">
                    <svg class="w-5 h-5 select-none" :class="activeBookId === book.id ? 'text-[#8B3E1F]' : 'text-stone-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <h4 
                      :class="[
                        'text-[15px] font-medium leading-normal mb-1.5 transition-colors',
                        activeBookId === book.id ? 'text-[#8B3E1F] font-bold' : 'text-[#44382E]'
                      ]"
                    >
                      {{ book.title }}
                    </h4>
                    <p class="text-xs text-[#8A7E72] tracking-wider leading-relaxed">
                      {{ book.volumes }} <span class="mx-1">|</span> {{ book.revision }}
                    </p>
                  </div>
                </div>

                <!-- If filtered result list empty, offer search input reset -->
                <div v-if="browseBooks.length === 0" class="p-8 text-center text-[#8A7E72] text-sm">
                  暂无匹配的结果，
                  <button @click="activeSurnameSearch = '陈'" class="text-[#8B3E1F] underline font-bold">
                    返回浏览陈氏
                  </button>
                </div>
              </div>
            </div>

            <!-- Easy toggle sidebar to other surnames to ensure quick view changes -->
            <div class="bg-white border border-[#E0D9CE] rounded-xl p-5 shadow-xs">
              <div class="flex items-center justify-between mb-3 border-b border-[#F2EDE6] pb-2">
                <span class="text-xs font-bold text-[#8A7E72] uppercase tracking-wider">
                  按姓氏拼音首字母切换
                </span>
                <span class="text-[10px] text-[#A69784] font-serif font-semibold">首字母选择</span>
              </div>

              <!-- Compact Alphabet bar inside the sidebar -->
              <div class="flex gap-1.5 flex-wrap mb-4" id="browse-alphabet-bar">
                <button
                  v-for="letter in browseLetters"
                  :key="letter"
                  @click="browseLetter = letter"
                  :class="[
                    'text-[10px] w-5.5 h-5.5 font-bold rounded-full flex items-center justify-center transition-all duration-200 font-mono',
                    browseLetter === letter
                      ? 'bg-[#8B3E1F] text-white shadow-xs'
                      : 'text-[#6C5F54] bg-[#FDFBF7] border border-[#E8DFC9] hover:text-[#8B3E1F] hover:bg-[#F5EFE4]'
                  ]"
                >
                  {{ letter }}
                </button>
              </div>

              <!-- Filtered Surnames under the letter -->
              <div class="flex gap-2 flex-wrap max-h-[160px] overflow-y-auto pr-1 select-none [*::-webkit-scrollbar]:w-1 [*::-webkit-scrollbar-track]:bg-transparent [*::-webkit-scrollbar-thumb]:bg-[#D8CBB6] [*::-webkit-scrollbar-thumb]:rounded-full hover:[*::-webkit-scrollbar-thumb]:bg-[#8B3E1F]">
                <button
                  v-for="s in browseFilteredSurnames"
                  :key="s.name"
                  @click="navigateToBrowse(s.name)"
                  :class="[
                    'text-xs px-3 py-1.5 rounded-lg border transition font-medium border-[#E0D9CE]',
                    activeSurnameSearch === s.name
                      ? 'bg-[#8B3E1F] text-white border-[#8B3E1F]'
                      : 'bg-[#FDFBF7] text-[#5C5045] hover:text-[#8B3E1F] hover:bg-[#F2ECE1]'
                  ]"
                >
                  {{ s.name }}{{ s.name === "古籍" ? "" : "氏" }}
                </button>
                <div v-if="browseFilteredSurnames.length === 0" class="text-xs text-[#8A7E72] py-2 w-full text-center font-serif">
                  该首字母下暂无家谱
                </div>
              </div>
            </div>

          </div>

          <!-- Right Column: Detail description screen (1:1 with image 2) -->
          <div class="lg:col-span-8 flex flex-col gap-6" id="right-results-details">
            
            <div class="bg-highlight-traditional border border-[#E0D9CE] rounded-xl p-8 shadow-xs relative">
              
              <!-- Title and subtitle tag summary header (1:1 representation) -->
              <div class="flex items-start justify-between flex-wrap gap-4 border-b border-[#F2EDE6] pb-6 mb-8">
                <div>
                  <h1 class="text-3xl font-bold font-serif text-[#432313] tracking-wide mb-3">
                    {{ activeBook.title }}
                  </h1>
                  <div class="flex items-center gap-3">
                    <span class="bg-[#F0E5D3] text-[#7A5034] text-xs font-bold px-2.5 py-1 rounded">
                      {{ activeBook.revision }}
                    </span>
                    <span class="text-sm text-[#87786B]">|</span>
                    <span class="text-[14px] text-[#4F4236] font-medium">
                      {{ activeBook.volumes }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Cover image panel view & meta parameters table -->
              <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-8">
                
                <!-- Left 3D wire-bound old styled book mock model -->
                <div class="md:col-span-5 flex flex-col items-center">
                  <div 
                    class="relative w-52 h-72 rounded-sm bg-[#1A385C] border border-[#0D1D30] shadow-2l mx-auto transition duration-500 hover:scale-103 p-1"
                    style="box-shadow: 10px 15px 25px rgba(0, 0, 0, 0.25), inset -5px -5px 15px rgba(0, 0, 0, 0.4), inset 5px 5px 15px rgba(255, 255, 255, 0.1);"
                  >
                    <!-- Thread wire lines of a real traditional thread-bound wire book -->
                    <div class="absolute inset-y-0 left-4 w-[1px] bg-yellow-600/35" />
                    <!-- Binding points thread lines -->
                    <div class="absolute top-4 left-0 w-4 h-[1px] bg-yellow-500/50" />
                    <div class="absolute top-20 left-0 w-4 h-[1px] bg-yellow-500/50" />
                    <div class="absolute bottom-20 left-0 w-4 h-[1px] bg-yellow-500/50" />
                    <div class="absolute bottom-4 left-0 w-4 h-[1px] bg-yellow-500/50" />
                    
                    <!-- Cover Text Box (vertical Chinese lettering tag) -->
                    <div class="absolute top-8 right-6 bg-white border border-[#8B3E1F]/20 px-3.5 py-6 flex flex-col items-center shadow-md">
                      <span class="text-lg font-serif font-extrabold text-[#3A2214] tracking-[0.35em]" style="writing-mode: vertical-rl;">
                        {{ activeBook.title }}
                      </span>
                    </div>

                    <!-- Small sticker tag at bottom left -->
                    <div class="absolute bottom-5 left-8 bg-[#EFECDF] border border-stone-400/30 px-1 py-1.5 text-[8px] text-stone-600 font-mono scale-90">
                      {{ activeBook.serialNo.split('-')[2] || '珍' }}
                    </div>

                    <!-- Realistic paper stack edge border mock on right -->
                    <div class="absolute inset-y-0 right-0 w-[4px] bg-stone-300 opacity-60 rounded-r-xs" />
                  </div>

                  <!-- Button below cover - opens the interactive digitized viewer modal -->
                  <el-button
                    type="primary"
                    @click="openViewer"
                    class="!bg-[#8B3E1F] !border-[#8B3E1F] hover:!bg-[#732F15] !text-white !font-bold !w-full !mt-6 !py-5.5 !rounded-lg !text-[14px] flex items-center justify-center gap-2 shadow-xs transition"
                    id="view-digitized-button"
                  >
                    <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    浏览数字化影像
                  </el-button>
                </div>

                <!-- Right Metadata parameters table (1:1 matching Image 2) -->
                <div class="md:col-span-7 flex flex-col gap-4">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-[14px]">
                    
                    <!-- Left Column -->
                    <div class="flex flex-col gap-4">
                      <div>
                        <span class="text-[#8A7E72] block font-medium mb-1">居地</span>
                        <strong class="text-[#3B3026] text-[15px] font-semibold">{{ activeBook.location }}</strong>
                      </div>

                      <div>
                        <span class="text-[#8A7E72] block font-medium mb-1">责任者</span>
                        <strong class="text-[#3B3026] text-[15px] font-semibold">{{ activeBook.compiler }}</strong>
                      </div>

                      <div>
                        <span class="text-[#8A7E72] block font-medium mb-1">撰修时间</span>
                        <strong class="text-[#3B3026] text-[15px] font-semibold">{{ activeBook.time }}</strong>
                      </div>
                    </div>

                    <!-- Right Column -->
                    <div class="flex flex-col gap-4">
                      <div>
                        <span class="text-[#8A7E72] block font-medium mb-1">装订样式</span>
                        <strong class="text-[#3B3026] text-[15px] font-semibold">{{ activeBook.format }}</strong>
                      </div>

                      <div>
                        <span class="text-[#8A7E72] block font-medium mb-1">馆藏信息</span>
                        <strong class="text-[#3B3026] text-[15px] font-semibold">{{ activeBook.library }}</strong>
                      </div>

                      <div class="mt-1">
                        <span class="text-[#8A7E72] block font-medium mb-1.5">索书号</span>
                        <span class="inline-block bg-[#F5F2EA] border border-[#DCDEC6] text-[#8B3E1F] font-mono text-xs font-bold px-3 py-1 rounded">
                          {{ activeBook.serialNo }}
                        </span>
                      </div>
                    </div>

                  </div>
                </div>

              </div>

              <!-- Content Abstract block matching Image 2 perfectly -->
              <div class="relative bg-[#FAFAF7] border border-[#EBE6DC] rounded-xl p-6 overflow-hidden mr-2">
                <!-- Large Quote stamp sign -->
                <span class="absolute top-1 left-2 text-[100px] text-[#8B3E1F]/5 font-serif select-none pointer-events-none transform -translate-y-8">
                  “
                </span>
                
                <div class="relative flex items-center gap-1.5 text-xs font-bold text-[#8B3E1F] tracking-wider mb-3">
                  <el-icon class="text-sm"><Document /></el-icon>
                  <span>摘要</span>
                </div>

                <p class="relative text-[14px] leading-relaxed text-[#5C5045] font-normal tracking-wide whitespace-pre-line">
                  {{ activeBook.abstract }}
                </p>
              </div>

            </div>

          </div>

        </div>
      </div>
    </main>

    <!-- ==================== DIALOG 1: DIGITIZED READER (HIGH FIDELITY OPTION) ==================== -->
    <el-dialog
      v-model="viewerVisible"
      :title="activeBook?.title"
      width="95%"
      max-width="1120px"
      destroy-on-close
      align-center
      class="custom-reader-dialog !bg-[#FAF3E8] !rounded-xl shadow-2xl border-2 border-[#8B3E1F]/30"
    >
      <div class="flex flex-col gap-4">
        
        <!-- Dynamic Content Display: Interactive 3D Book Page Flipping -->
        <BookReader :book="activeBook" :theme="viewerTheme" />

      </div>
    </el-dialog>


    <!-- ==================== DIALOG 2: INTERACTIVE LINEAGE MAP (BONUS HIGHLIGHT) ==================== -->
    <el-dialog
      v-model="lineageModalVisible"
      title="结构化祖宗世系脉络图"
      width="85%"
      max-width="880px"
      destroy-on-close
      align-center
      class="lineage-map-dialog !bg-[#FCFAF5] !rounded-2xl"
    >
      <div class="flex flex-col gap-5">
        <div class="bg-[#F6EFE2]/60 p-4 rounded-lg border border-[#DFD3BA] text-xs text-[#6C5F54] leading-relaxed">
          <strong>颍川陈氏始祖世系支流图</strong>：本图谱基于民国三十八年及2003年龙川陈氏宗谱档案整理，记录了自太丘公分房以来的核心大宗迁徙流向。
          <span class="text-[#8B3E1F] font-bold block mt-1">💡 提示：点击下方的年代世系板块可查看各位世祖、功勋或重大历史迁徙详情！</span>
        </div>

        <!-- Tree Line Graph flow (Beautiful custom styled SVG interactive map) -->
        <div class="border border-[#E5DFD0] rounded-xl bg-white p-6 relative min-h-[220px] flex flex-col justify-center">
          
          <!-- Connections background pipeline -->
          <div class="absolute top-[88px] left-[10%] right-[10%] h-[2px] bg-dashed border-t-2 border-stone-200" />
          
          <div class="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div 
              v-for="(node, index) in lineageNodes" 
              :key="node.name"
              @click="selectedNodeIndex = index"
              :class="[
                'cursor-pointer w-full md:w-[15%] p-3 border rounded-xl flex flex-col items-center text-center transition-all duration-300 relative',
                selectedNodeIndex === index 
                  ? 'border-[#8B3E1F] bg-[#FCFAF2] shadow-md scale-105 ring-1 ring-[#8B3E1F]' 
                  : 'border-[#E0D9CE] bg-[#FDFBF7] hover:border-[#8B3E1F]/50 hover:bg-[#FCFAF2]/50'
              ]"
            >
              <!-- Pin connector loop -->
              <div 
                :class="[
                  'w-3 h-3 rounded-full mb-2 border transition-colors',
                  selectedNodeIndex === index ? 'bg-[#8B3E1F] border-[#813518]' : 'bg-stone-300 border-white'
                ]"
              />

              <span class="text-[11px] text-[#8A7E72] font-semibold font-mono block mb-1">
                {{ node.gen }}
              </span>
              <h4 class="text-xs font-bold text-[#44382E] leading-snug">
                {{ node.name }}
              </h4>
              <span class="text-[10px] text-[#A69784] font-medium block mt-1">
                {{ node.life.slice(0, 6) }}
              </span>

              <!-- Focus indicator top underline highlight -->
              <div v-if="selectedNodeIndex === index" class="absolute bottom-[-1px] left-1/4 right-1/4 h-[3px] bg-[#8B3E1F] rounded-t-full" />
            </div>
          </div>

        </div>

        <!-- Selected Node Detail panel -->
        <div 
          v-if="selectedNodeIndex !== null" 
          class="bg-[#FCFAF2] border border-[#8B3E1F]/30 rounded-xl p-5 animate-fadeIn"
        >
          <div class="flex items-center gap-3 mb-2">
            <span class="bg-[#8B3E1F] text-white text-[10px] font-bold font-mono px-2 py-0.5 rounded">
              {{ lineageNodes[selectedNodeIndex].gen }}
            </span>
            <h3 class="text-base font-bold text-[#5C2E16] font-serif">
              {{ lineageNodes[selectedNodeIndex].name }}
            </h3>
            <span class="text-xs text-[#8A7E72] font-medium">|</span>
            <span class="text-xs text-[#6C5F54] font-medium">
              生平记录: {{ lineageNodes[selectedNodeIndex].life }}
            </span>
          </div>
          <p class="text-xs leading-relaxed text-[#5C5045] mb-0 pt-1.5 border-t border-[#F2EDE6]">
            {{ lineageNodes[selectedNodeIndex].detail }}
          </p>
        </div>

        <div class="text-right mt-2 flex justify-end">
          <el-button 
            type="primary" 
            @click="lineageModalVisible = false"
            class="!bg-[#8B3E1F] !border-[#8B3E1F] hover:!bg-[#732F15] !text-white !font-bold !px-6"
          >
            确认并关闭
          </el-button>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<style>
/* Clean styles & custom Element Plus resets */
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Noto+Serif+SC:wght@500;700&family=Space+Grotesk:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap');

/* Dynamic entry animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fadeIn {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Customized el-input layout overrides */
.custom-el-input-large .el-input__wrapper {
  background-color: transparent !important;
  box-shadow: none !important;
  border: none !important;
  padding-left: 12px;
}

.custom-el-input-large .el-input__inner {
  font-family: inherit;
  font-weight: 500;
  height: 48px;
}

.custom-el-input-large .el-input__inner::placeholder {
  color: #A3968A;
  font-weight: 400;
}

/* Custom overlay class styling for antiquity */
.custom-reader-dialog {
  background-color: #FAF4E9 !important;
  background-image: radial-gradient(#F3E9D8 1.5px, transparent 1.5px) !important;
  background-size: 24px 24px !important;
  box-shadow: 0 25px 50px -12px rgba(139, 62, 31, 0.35) !important;
}

.custom-reader-dialog .el-dialog__header {
  border-bottom: 2px dashed #8B3E1F/30 !important;
  margin-right: 0 !important;
  padding-bottom: 16px;
  position: relative;
}

.custom-reader-dialog .el-dialog__header::before {
  content: "印";
  position: absolute;
  left: 12px;
  top: -6px;
  font-family: 'Noto Serif SC', serif;
  font-size: 9px;
  font-weight: 900;
  color: #FFFDF9;
  background-color: #8B3E1F;
  border-radius: 4px;
  width: 14px;
  height: 14px;
  line-height: 14px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(139, 62, 31, 0.3);
  transform: rotate(-5deg);
}

.lineage-map-dialog .el-dialog__header {
  border-bottom: 1px solid #F0EBE5;
  margin-right: 0 !important;
  padding-bottom: 16px;
}

.custom-reader-dialog .el-dialog__title {
  font-family: 'Noto Serif SC', 'Cinzel', serif !important;
  font-weight: 900 !important;
  font-size: 19px !important;
  color: #8B3E1F !important;
  letter-spacing: 0.1em;
  padding-left: 12px;
}

.lineage-map-dialog .el-dialog__title {
  font-family: 'Noto Serif SC', 'Cinzel', serif !important;
  font-weight: 700 !important;
  font-size: 18px !important;
  color: #3A2214 !important;
}

@theme {
  --font-serif: "Noto Serif SC", "Cinzel", "Playfair Display", Georgia, serif;
  --font-sans: "Space Grotesk", "Inter", system-ui, -apple-system, sans-serif;
  --font-mono: "JetBrains Mono", monospace;
}
</style>
