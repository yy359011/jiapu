<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { type Book } from '../data';

const props = defineProps<{
  book: Book;
  theme: 'sepia' | 'cream' | 'dark';
}>();

// Tool toggles requested by user
const showThumbnails = ref(false);
const showVolumes = ref(false);
const showToc = ref(false);
const isPlaying = ref(false);
const isFullScreen = ref(false);

const toggleToc = () => {
  showToc.value = !showToc.value;
};

const toggleVolumes = () => {
  showVolumes.value = !showVolumes.value;
};

const zoomScale = ref(1);
const activeSheet = ref(0);
const totalSheets = 4; // 0 (Cover), 1 (Preface/Source), 2 (Rules/Lineage), 3 (Record/Backcover), 4 (End)

const handlePageInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  let val = parseInt(target.value);
  if (isNaN(val)) return;
  if (val < 1) val = 1;
  if (val > totalSheets + 1) val = totalSheets + 1;
  activeSheet.value = val - 1;
  target.value = String(val);
};

// Volumes (册次) Selection data
const currentVolume = ref(1);
const isVolumeLoading = ref(false);
const volumesList = [
  { no: 1, title: '第一册 (卷首 · 谱序源流)', desc: '谱叙氏族渊源，辑明代清代古序与褒奖。' },
  { no: 2, title: '第二册 (卷二 · 迁徙图考)', desc: '考证中原避乱分异，南渡分支及耕读居地。' },
  { no: 3, title: '第三册 (卷三 · 家规家训)', desc: '传家训修德，立身齐家、戒奢劝勉合录。' },
  { no: 4, title: '第四册 (卷四 · 世系功德志)', desc: '列历世始祖昭穆行状，及续谱祠庙功德。' }
];

// Multi-level Table of Contents (目录) data structure
interface TocNode {
  id: string;
  label: string;
  desc?: string;
  sheet?: number;       // only leaf nodes navigate to a sheet
  volumeNo?: number;    // volume-level nodes switch volume
  children?: TocNode[];
}

const tocTree = computed<TocNode[]>(() => {
  const vi = currentVolume.value - 1;
  const vName = ['谱序源流', '迁徙图考', '家规家训', '世系功德志'][vi];
  const sectionNames = [
    ['序言源流', '族史考证'],
    ['迁徙图考', '居地述略'],
    ['家规家训', '处世箴言'],
    ['世系昭穆', '功德名册']
  ][vi];
  return [
    {
      id: `vol-${vi}-cover`,
      label: '古籍封面',
      desc: '古籍题签 · 封面',
      sheet: 0,
      volumeNo: vi + 1
    },
    {
      id: `vol-${vi}-body`,
      label: `正文 · ${vName}`,
      desc: sectionNames.join(' / '),
      children: [
        {
          id: `vol-${vi}-p1`,
          label: `首叶 · ${sectionNames[0]}`,
          desc: '影印大宗序跋',
          sheet: 1,
          volumeNo: vi + 1
        },
        {
          id: `vol-${vi}-p2`,
          label: `次叶 · ${sectionNames[1]}`,
          desc: '考证祠庙遗风',
          sheet: 2,
          volumeNo: vi + 1
        },
        {
          id: `vol-${vi}-p3`,
          label: '终叶 · 跋文功德',
          desc: '跋跋功贤功德',
          sheet: 3,
          volumeNo: vi + 1
        }
      ]
    },
    {
      id: `vol-${vi}-back`,
      label: '古籍封底',
      desc: '古籍装帧 · 封底',
      sheet: 4,
      volumeNo: vi + 1
    }
  ];
});

// Track which TOC tree nodes are expanded
const expandedTocNodes = ref<Set<string>>(new Set(['vol-0-body']));
const toggleTocNode = (id: string) => {
  const s = new Set(expandedTocNodes.value);
  if (s.has(id)) s.delete(id); else s.add(id);
  expandedTocNodes.value = s;
};
const isTocExpanded = (id: string) => expandedTocNodes.value.has(id);

// Navigate to a leaf node
const navigateToTocLeaf = (node: TocNode) => {
  if (node.sheet === undefined) return;
  activeSheet.value = node.sheet;
};

// Autoplay Slideshow logic
let playTimer: ReturnType<typeof setInterval> | null = null;
const toggleAutoplay = () => {
  if (isPlaying.value) {
    stopAutoplay();
  } else {
    startAutoplay();
  }
};

const startAutoplay = () => {
  isPlaying.value = true;
  playTimer = setInterval(() => {
    if (activeSheet.value < totalSheets) {
      activeSheet.value++;
    } else {
      activeSheet.value = 0; // Wrap around
    }
  }, 3000);
};

const stopAutoplay = () => {
  isPlaying.value = false;
  if (playTimer) {
    clearInterval(playTimer);
    playTimer = null;
  }
};

// Fullscreen wrapper reference
const readerWrapperRef = ref<HTMLElement | null>(null);

const toggleFullScreen = () => {
  isFullScreen.value = !isFullScreen.value;
  if (isFullScreen.value) {
    const elem = readerWrapperRef.value || document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(() => {});
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  }
};

const handleFullscreenChange = () => {
  isFullScreen.value = !!document.fullscreenElement;
};

// Change volumes handler
const selectVolume = (volNo: number) => {
  if (currentVolume.value === volNo) return;
  isVolumeLoading.value = true;
  currentVolume.value = volNo;
  activeSheet.value = 0; // Reset to cover
  // Auto-expand the body section for the new volume
  const vi = volNo - 1;
  expandedTocNodes.value = new Set([`vol-${vi}-body`]);

  setTimeout(() => {
    isVolumeLoading.value = false;
  }, 600);
};

// Setup and teardown
onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange);
});

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange);
  stopAutoplay();
});

// Flip page handlers
const turnNext = () => {
  if (activeSheet.value < totalSheets) {
    activeSheet.value++;
  }
};

const turnPrev = () => {
  if (activeSheet.value > 0) {
    activeSheet.value--;
  }
};

// Reset book state
const resetBook = () => {
  activeSheet.value = 0;
};

// Compute ancient text values based on active volume
const generatedPages = computed(() => {
  const s = props.book.surname;
  const t = props.book.title;
  
  // Custom antique high-quality paper scans (from Unsplash)
  const images = [
    "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=600"
  ];

  if (currentVolume.value === 2) {
    // Volume 2: 迁徙图考
    return {
      cover: {
        title: `${t}`,
        subtitle: `卷二 · 迁徙图考`,
        authority: `氏族源流编校组`,
        image: images[1],
        seal: `${s}氏`
      },
      page1: {
        title: `${s === '古籍' ? '华夏百家' : s + '氏郡望'} · 避乱避迁`,
        content: `谱牒之纪，起于周汉。我族自秦咸阳播迁关中，其后避东晋五胡之乱，南渡大江。于大唐大顺年间，定居于此。山明水秀，负山抱水，遂在此生息繁衍凡三十余代，分派列支，极江南钟灵毓秀之最。`,
        image: images[2],
        seal: `避地龙溪`,
        pageNo: "第一叶"
      },
      page2: {
        title: `${s === '古籍' ? '古居遗图' : s + '氏故园'} · 祭田图说`,
        content: `夫家之有庙，犹国有郊社也。宗祠落成于前清，雕梁画栋，威仪赫赫。祠旁置上熟祭田三十六亩，充岁时冬至祭祀之资。本卷附载祠宇地基方位图，里闾水利形势。凡子孙咸宜岁岁护持，勿使寸土流变！`,
        image: images[3],
        seal: `宗庙千秋`,
        pageNo: "第二叶"
      },
      page3: {
        title: `${s === '古籍' ? '世流分布' : s + '氏分迁'} · 各县谱考`,
        content: `自江左分支，子孙散处各县：分在桐庐者，以耕读自洁；分在嵊州者，以文墨传世。今日新谱辑校，凡我远客异地至海外之分支合众，能在此卷一查便明。骨肉虽远而音气相通，不至湮没！`,
        image: images[4],
        seal: `同气连枝`,
        pageNo: "第三叶"
      },
      page4: {
        title: `${s === '古籍' ? '地理述略' : s + '氏世泽'} · 名胜功德`,
        content: `本支迁此千余载，多赖山川之庇佑。龙峰叠起，笔砚双生。名下耕稼桑麻，历代无兵火之灾，诚避秦之宝地。故将山水胜景、先贤茔地方位悉数载明，子孙登高眺望，当知先人卜居之勤劳，创业之万难！`,
        image: images[0],
        seal: `山高水长`,
        pageNo: "第四叶"
      },
      page5: {
        title: `${s === '古籍' ? '校勘跋文' : s + '氏校勘'} · 重订跋`,
        content: `岁次己丑新修。重绘祭田、祠宇等图卷。族人校阅备极辛劳。纂修负责人：${props.book.compiler}。凡族中有志之士，宜常展卷，以继先祖耕读之风，修省本身之德！`,
        image: images[5],
        seal: `百代簪缨`,
        pageNo: "第五叶"
      },
      back: {
        title: `《${t} · 卷二》`,
        subtitle: `国家档案馆 · 地方特藏部`,
        serial: `${props.book.serialNo}`,
        image: images[1]
      }
    };
  } else if (currentVolume.value === 3) {
    // Volume 3: 家规家训
    return {
      cover: {
        title: `${t}`,
        subtitle: `卷三 · 家规家训`,
        authority: `氏族重修理事会`,
        image: images[2],
        seal: `${s}氏`
      },
      page1: {
        title: `${s === '古籍' ? '明德修身' : s + '氏传家'} · 祖训十章`,
        content: `家之有规，如国之有律。家规严整，则后代秀杰；规约废弛，则放辟邪侈。为此，重编十字贞规：一孝敬，二和睦，三自立，四读书，五廉洁，六勤俭，七守法，八济人，九慎行，十崇祖。必共敬修。`,
        image: images[3],
        seal: `敬修祖训`,
        pageNo: "第一叶"
      },
      page2: {
        title: `${s === '古籍' ? '立身警言' : s + '氏严诫'} · 劝学戒非`,
        content: `子弟无论愚贤，皆宜早岁令之入塾读书。纵不能博取科名，亦当明圣贤礼义，为正直之人。最忌博弈游手、口角是非、凌弱陵单、贪杯无度。犯此者轻则由父母训诫，重则鸣鼓削谱，勿使辱我门风！`,
        image: images[4],
        seal: `耕学励志`,
        pageNo: "第二叶"
      },
      page3: {
        title: `${s === '古籍' ? '戒奢行俭' : s + '氏修心'} · 齐家至道`,
        content: `一曰戒游手：游手好闲，为盗之源。二曰戒铺张：婚娶丧葬，一从简朴，毋以虚饰倾家财、负重债。三曰济孤弱：宗族之中，若有孤儿寡母或残疾，众人当均摊周口，毋令失所，同姓情深。`,
        image: images[5],
        seal: `敦本聚族`,
        pageNo: "第三叶"
      },
      page4: {
        title: `${s === '古籍' ? '处世名箴' : s + '氏乡评'} · 和睦邻里`,
        content: `凡居里闾，人皆我之乡邻。人犯我、我宽之，人少我、我助之。无起诉讼之端，无动戈矛之气。退一步海阔天空，让三分神清气爽。乡平清正，骨肉均安。世守和气，百福自骈，家道自彰。`,
        image: images[0],
        seal: `积善之家`,
        pageNo: "第四叶"
      },
      page5: {
        title: `${s === '古籍' ? '重申祖命' : s + '氏戒铭'} · 跋后启`,
        content: `家训十规，字字泣血。凡我子孙，生旦展阅，死而无愧。篡修校核：${props.book.compiler}。馆藏特记。愿族众遵奉规诫，立德于世，天必佑我门庭昌盛！`,
        image: images[1],
        seal: `天理福善`,
        pageNo: "第五叶"
      },
      back: {
        title: `《${t} · 卷三》`,
        subtitle: `国家档案馆 · 地方特藏部`,
        serial: `${props.book.serialNo}`,
        image: images[2]
      }
    };
  } else if (currentVolume.value === 4) {
    // Volume 4: 世系功德
    return {
      cover: {
        title: `${t}`,
        subtitle: `卷四 · 世系功德`,
        authority: `修谱理事会纂`,
        image: images[3],
        seal: `${s}氏`
      },
      page1: {
        title: `${s === '古籍' ? '贤勋碑表' : s + '氏先贤'} · 功烈志`,
        content: `宗族繁茂，必有德业标榜于天壤。大唐迁祖，以武功授节度使；宋神宗朝，本支有进士公在朝廷，犯颜直谏，朝野推崇。前有义士散财抗倭救孤，后有乡贤设学校厚泽寒梓。诸行状像赞历历，昭垂千古。`,
        image: images[4],
        seal: `垂法昭兹`,
        pageNo: "第一叶"
      },
      page2: {
        title: `${s === '古籍' ? '世系昭穆' : s + '氏定名'} · 派语编录`,
        content: `派字（字辈）乃辨昭穆、别尊卑之至宝。我宗自五代重定八十字派，代代相沿：“德业昌明，传家孝敬，清廉守正，忠信传薪...”。今日新修本谱，重申派语，凡命名当严守序齿，毋得错乱犯尊！`,
        image: images[5],
        seal: `昭穆有序`,
        pageNo: "第二叶"
      },
      page3: {
        title: `${s === '古籍' ? '功德贞珉' : s + '氏重修'} · 捐款名册`,
        content: `木千枝出一源，水万派同其川。此次大典，族人感戴宗功，踊跃奉献。其出千金者、出百资者、校对寒暑不言劳者，名载此叶。德辉普照，受祖列考之冥佑。名字传于碑石，垂之长远。`,
        image: images[0],
        seal: `德载贞珉`,
        pageNo: "第三叶"
      },
      page4: {
        title: `${s === '古籍' ? '昭穆考证' : s + '氏大宗'} · 历代祭仪`,
        content: `春秋享祀，礼之大者。冬至祭祖，族内老幼咸集宗祠，三献厥礼。奉先祖神主牌，香烛馨香，金石齐鸣。祭毕全族会宴，辨尊卑，叙骨肉。凡礼仪执事、祭品规格，本卷皆录述严备，不使遗漏！`,
        image: images[1],
        seal: `饮水思源`,
        pageNo: "第四叶"
      },
      page5: {
        title: `${s === '古籍' ? '总纂跋言' : s + '氏宗谱'} · 全卷成语`,
        content: `岁次庚寅，新编总纂。经霜涉暑，全谱印装在几。纂修：${props.book.compiler}。馆藏记。凡后世子孙，保藏此谱，莫忘本源，报德崇远，愿我族世世忠良，繁衍昌炽！`,
        image: images[2],
        seal: `百代长隆`,
        pageNo: "第五叶"
      },
      back: {
        title: `《${t} · 卷四》`,
        subtitle: `国家档案馆 · 地方特藏部`,
        serial: `${props.book.serialNo}`,
        image: images[3]
      }
    };
  }

  // Volume 1 (Default): 谱序源流
  return {
    cover: {
      title: `${t}`,
      subtitle: `${props.book.revision}`,
      authority: `氏族重修理事会 敬校`,
      image: props.book.pages[0] || images[0],
      seal: `${s}氏`
    },
    page1: {
      title: `${s === '古籍' ? '古籍珍藏' : s + '氏历代'} · 序言`,
      content: `粤稽水木之源，人伦之始。木有根而枝叶茂，水有源而溪流长。夫人不本于祖宗，则乌知其所自出？${s === '古籍' ? '中华' : s + '氏'}大宗自古繁衍，代有贤能，功勋彪炳，忠孝传家。今岁修重撰本谱，敬叙世系，承古励今，庶后之子孙，知创业之万难，而克勤克俭，同心克孝！`,
      image: props.book.pages[1] || images[1],
      seal: `源远流长`,
      pageNo: "第一叶"
    },
    page2: {
      title: `${s === '古籍' ? '华夏百家' : s + '氏迁徙'} · 源流考`,
      content: `本谱载自中原肇基以来，族人历尽沧桑。晋代永嘉南渡，迁于浙中。避黄巢之乱而卜居于此，依山傍水，耕读为业。历经二三十代，其子孙繁衍江南，脉络清晰。今重加钩考，定世系，修家庙，正其本而清其源，以诏后昆，光前裕后！`,
      image: props.book.pages[2] || images[2],
      seal: `耕读传家`,
      pageNo: "第二叶"
    },
    page3: {
      title: `${s === '古籍' ? '传家修德' : s + '氏家族'} · 家规十章`,
      content: `一曰孝敬父母：立身孝为本。无忤逆，无克扣。\n二曰和睦乡里：同气连枝，周急继匮，无结私怨。\n三曰勤学励志：子弟必令读书，明理守信，报效社稷。\n四曰戒奢从俭：婚丧祭礼，一从简朴，毋以虚荣倾家荡产。\n五曰积德行善：扶弱怜孤，修桥筑路，德留乡梓。`,
      image: props.book.pages[0] || images[3],
      seal: `克勤克俭`,
      pageNo: "第三叶"
    },
    page4: {
      title: `${s === '古籍' ? '重修记事' : s + '氏世系'} · 功德志`,
      content: `世系昭穆，乃一族之经纬。自始迁祖入塞，瓜瓿连绵。列位高曾祖耋，名勋显赫，有的立言于杏坛，有的效忠于行阵，皆我族之光荣。此次修撰，合各宗支之老谱，辨明讹误，录写极精，以使千秋万代之下，族人能相认、能相敬，骨肉不失！`,
      image: props.book.pages[1] || images[4],
      seal: `追远崇德`,
      pageNo: "第四叶"
    },
    page5: {
      title: `${s === '古籍' ? '考证书序' : s + '氏纂校'} · 后跋`,
      content: `岁次丙戌，季夏修撰竣工。全谱线装八册，纸黑字香，宣纸手工印制。纂修负责人：${props.book.compiler}。馆藏号：${props.book.serialNo}。凡我族人，当敬置案头，常加温习，遵家训之规矩，行正人君子之道。前贤德泽，后嗣发祥！`,
      image: props.book.pages[2] || images[5],
      seal: `正气长存`,
      pageNo: "第五叶"
    },
    back: {
      title: `《${t}》`,
      subtitle: `国家档案馆 · 地方特藏部`,
      serial: `${props.book.serialNo}`,
      image: props.book.pages[0] || images[0]
    }
  };
});

// Thumbnails setup matching pages
const thumbnailsList = computed(() => {
  return [
    { sheet: 0, label: '封面', desc: '古籍衣', image: generatedPages.value.cover.image },
    { sheet: 1, label: '一叶', desc: '序幅', image: generatedPages.value.page1.image },
    { sheet: 2, label: '二叶', desc: '源考', image: generatedPages.value.page3.image },
    { sheet: 3, label: '三叶', desc: '后跋', image: generatedPages.value.page5.image },
    { sheet: 4, label: '封底', desc: '古籍背', image: generatedPages.value.back.image }
  ];
});
</script>

<template>
  <div 
    ref="readerWrapperRef" 
    :class="[
      'w-full flex flex-col items-center select-none transition-all duration-500',
      isFullScreen 
        ? 'fixed inset-0 z-[99999] bg-[#F7F4EA] dark:bg-[#1A1816] overflow-y-auto p-4 md:p-[2rem] flex flex-col items-center justify-start border-none rounded-none' 
        : 'relative'
    ]"
  >
    
    <!-- Immersive Title Header Bar when in simulated Fullscreen -->
    <div 
      v-if="isFullScreen" 
      class="w-full max-w-[1200px] flex items-center justify-between bg-[#8B3E1F] text-[#FDFCF7] px-6 py-3.5 rounded-xl shadow-lg mb-4 animate-fade-in border border-[#703016]"
    >
      <div class="flex items-center gap-3">
        <span class="bg-amber-100/15 text-amber-100 border border-amber-300/20 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest font-serif">
          国家古籍珍特数字化殿
        </span>
        <h2 class="font-serif font-extrabold text-[15px] tracking-widest">
          《{{ book.title }}》 · {{ volumesList[currentVolume - 1].title }}
        </h2>
      </div>
      <el-button 
        @click="toggleFullScreen" 
        class="!bg-[#5C2E16] hover:!bg-[#4D230C] !border-none !text-[#FDFCF7] !font-bold !text-xs !py-1 px-4 !rounded-md transition shadow-md"
      >
        退出全屏
      </el-button>
    </div>

    <!-- Enhanced System Toolbar (TOC, Volumes, Thumbnails, Autoplay, Fullscreen, Zoom) -->
    <div 
      class="flex flex-col gap-3 w-full border border-[#8B3E1F]/20 bg-[#FAF6EE] p-4 rounded-xl mb-4 shadow-sm relative overflow-hidden"
      id="reader-system-toolbar"
    >
      <!-- Corner Decorative Lines for Classical Look -->
      <div class="absolute top-0.5 left-0.5 w-2 h-2 border-t border-l border-[#8B3E1F]/50 pointer-events-none" />
      <div class="absolute top-0.5 right-0.5 w-2 h-2 border-t border-r border-[#8B3E1F]/50 pointer-events-none" />
      <div class="absolute bottom-0.5 left-0.5 w-2 h-2 border-b border-l border-[#8B3E1F]/50 pointer-events-none" />
      <div class="absolute bottom-0.5 right-0.5 w-2 h-2 border-b border-r border-[#8B3E1F]/50 pointer-events-none" />

      <!-- Row 1: Flip & Scale (Requested at top) -->
      <div class="flex flex-wrap items-center justify-between gap-3 w-full pb-3 border-b border-[#EAE3D2]">
        <div class="flex items-center gap-2">
          <el-button 
            @click="turnPrev" 
            :disabled="activeSheet === 0"
            class="!bg-[#FFFDF9] !border-[#DECFBD] hover:!bg-[#F7F2E7] !text-[#5C5045] !font-bold !px-4 shadow-xs transition flex items-center gap-1"
          >
            <span>←</span> 上一页
          </el-button>

          <el-button 
            v-if="activeSheet > 0"
            @click="resetBook"
            class="!bg-[#FAF4E9] !border-[#DECFBD] hover:!bg-[#F2ECE1] !text-[#8B3E1F] !font-semibold !px-3 shadow-xs transition"
            title="回封面"
          >
            重置封面
          </el-button>
        </div>

        <div class="flex items-center gap-3">
          <!-- Page Select Jumper (matching reference image total/current input design) -->
          <div class="flex items-center gap-2 select-none">
            <span class="font-mono text-xs font-bold text-[#8A7E72] italic">
              {{ totalSheets + 1 }}/{{ activeSheet + 1 }}
            </span>
            <div class="relative bg-[#FFFDF9] border border-[#DECFBE] rounded px-3 py-1 w-12 flex items-center justify-center shadow-xs focus-within:border-[#8B3E1F]">
              <input
                type="number"
                min="1"
                :max="totalSheets + 1"
                :value="activeSheet + 1"
                @input="handlePageInput"
                class="w-full text-center bg-transparent border-none text-[#8B3E1F] text-xs font-bold font-mono focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none p-0"
              />
            </div>
          </div>

          <!-- Zoom sliders -->
          <span class="text-[11px] text-[#8A7E72] font-mono uppercase hidden sm:inline">比例:</span>
          <div class="flex items-center gap-1 bg-[#FFFDF9] px-2 py-1 rounded-md border border-[#DECFBE]">
            <button @click="zoomScale = Math.max(0.7, zoomScale - 0.05)" class="text-xs hover:text-[#8B3E1F] font-bold px-1.5 transition" title="缩小">
              -
            </button>
            <span class="font-mono text-[10px] min-w-10 text-center select-none font-bold text-[#5C5045]">
               {{ Math.round(zoomScale * 100) }}%
            </span>
            <button @click="zoomScale = Math.min(1.2, zoomScale + 0.05)" class="text-xs hover:text-[#8B3E1F] font-bold px-1.5 transition" title="放大">
              +
            </button>
          </div>

          <el-button 
            @click="turnNext" 
            :disabled="activeSheet === totalSheets"
            class="!bg-[#8B3E1F] !border-[#8B3E1F] hover:!bg-[#732F15] !text-white !font-bold !px-4 shadow-xs transition flex items-center gap-1"
          >
            下一页 <span>→</span>
          </el-button>
        </div>
      </div>

      <!-- Row 2: User-requested interactive modules (Thumbnails, Volumes, TOC, Autoplay, Fullscreen) -->
      <div class="flex flex-wrap items-center justify-between gap-2.5 w-full pt-1.5">
        <div class="flex flex-wrap items-center gap-2">
          <!-- Table of Contents Toggle -->
          <button 
            @click="toggleToc"
            :class="[
              'px-3 py-1.5 rounded-lg border text-xs font-semibold font-serif flex items-center gap-1.5 transition shadow-xs',
              showToc 
                ? 'bg-[#8B3E1F] text-[#FFFDF4] border-[#8B3E1F]' 
                : 'border border-[#8B3E1F]/20 bg-[#FFFDF9] text-[#7A3F26] hover:bg-[#FDF9F0]'
            ]"
          >
            <svg class="w-3.5 h-3.5 stroke-current" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span>{{ showToc ? '收起目录' : '打开目录' }}</span>
          </button>

          <!-- Volumes Selector Toggle -->
          <button 
            @click="toggleVolumes"
            :class="[
              'px-3 py-1.5 rounded-lg border text-xs font-semibold font-serif flex items-center gap-1.5 transition shadow-xs',
              showVolumes 
                ? 'bg-[#8B3E1F] text-[#FFFDF4] border-[#8B3E1F]' 
                : 'border border-[#8B3E1F]/20 bg-[#FFFDF9] text-[#7A3F26] hover:bg-[#FDF9F0]'
            ]"
          >
            <svg class="w-3.5 h-3.5 stroke-current" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <rect x="4" y="4" width="16" height="16" rx="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M9 4v16M14 4v16" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span>{{ showVolumes ? '收起册次' : '选择册次' }}</span>
          </button>

          <!-- Thumbnails Drawer Toggle -->
          <button 
            @click="showThumbnails = !showThumbnails"
            :class="[
              'px-3 py-1.5 rounded-lg border text-xs font-semibold font-serif flex items-center gap-1.5 transition shadow-xs',
              showThumbnails 
                ? 'bg-[#8B3E1F] text-[#FFFDF4] border-[#8B3E1F]' 
                : 'border border-[#8B3E1F]/20 bg-[#FFFDF9] text-[#7A3F26] hover:bg-[#FDF9F0]'
            ]"
          >
            <svg class="w-3.5 h-3.5 stroke-current" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7" rx="1" stroke-linecap="round" stroke-linejoin="round" />
              <rect x="14" y="3" width="7" height="7" rx="1" stroke-linecap="round" stroke-linejoin="round" />
              <rect x="14" y="14" width="7" height="7" rx="1" stroke-linecap="round" stroke-linejoin="round" />
              <rect x="3" y="14" width="7" height="7" rx="1" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span>{{ showThumbnails ? '关闭缩略图' : '打开缩略图' }}</span>
          </button>
        </div>

        <div class="flex items-center gap-2">
          <!-- Autoplay slide button -->
          <button 
            @click="toggleAutoplay"
            :class="[
              'px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition shadow-xs',
              isPlaying 
                ? 'bg-amber-900 border border-amber-800 text-white animate-pulse' 
                : 'border border-[#8B3E1F]/20 bg-[#FFFDF9] text-[#7A3F26] hover:bg-[#FDF9F0]'
            ]"
          >
            <svg v-if="isPlaying" class="w-3.5 h-3.5 stroke-current animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else class="w-3.5 h-3.5 stroke-current" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ isPlaying ? '播放中 (4.5s)' : '自动播放' }}</span>
          </button>

          <!-- Fullscreen toggle -->
          <button
            @click="toggleFullScreen"
            class="px-3 py-1.5 border border-[#8B3E1F]/20 bg-[#FFFDF9] text-[#7A3F26] rounded-lg text-xs font-semibold hover:bg-[#FDF9F0] flex items-center gap-1.5 transition shadow-xs"
          >
            <svg v-if="isFullScreen" class="w-3.5 h-3.5 stroke-current" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 14h6v6M20 14h-6v6M4 10h6V4M20 10h-6V4" />
            </svg>
            <svg v-else class="w-3.5 h-3.5 stroke-current" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 8V4h4M20 8V4h-4M4 16v4h4M20 16v4h-4" />
            </svg>
            <span>{{ isFullScreen ? '退出全屏' : '沉浸全屏' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Core Interactive Area Grid Layout -->
    <div class="flex flex-col lg:flex-row items-stretch justify-center w-full gap-4 max-w-[1240px] relative z-10">
      
      <!-- ==================== INDEPENDENT SIDEBAR PANELS: TOC & Volumes ==================== -->

      <!-- Panel 1: Table of Contents (目录) -->
      <div 
        v-if="showToc" 
        class="w-full lg:w-[260px] bg-[#FAF4E8] border border-[#8B3E1F]/20 rounded-xl p-4 flex flex-col shrink-0 shadow-md transition-all animate-fade-in relative"
      >
        <!-- Corner Decorative Accents -->
        <div class="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-[#8B3E1F]/35 pointer-events-none" />
        <div class="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r border-[#8B3E1F]/35 pointer-events-none" />
        <div class="absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l border-[#8B3E1F]/35 pointer-events-none" />
        <div class="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-[#8B3E1F]/35 pointer-events-none" />

        <div class="font-serif text-sm font-bold text-[#8B3E1F] border-b border-[#EBE2D0]/60 pb-2 mb-4 tracking-wider text-center">
          {{ volumesList[currentVolume - 1].title.split(' (')[0] }} · 目录
        </div>

        <!-- TOC TREE (filtered by current volume) -->
        <div class="flex flex-col flex-1 gap-1 overflow-y-auto max-h-[calc(100vh-220px)] pr-1 toc-scroll">
          <template v-for="node in tocTree" :key="node.id">
            <!-- Branch node (has children) -->
            <div v-if="node.children">
              <div
                @click="toggleTocNode(node.id)"
                class="cursor-pointer px-2 py-1.5 rounded-lg border transition-all duration-200 select-none flex items-center gap-1.5 bg-[#8B3E1F]/8 border-[#8B3E1F]/40 text-[#8B3E1F]"
              >
                <span class="text-[10px] transition-transform duration-200" :class="{ 'rotate-90': isTocExpanded(node.id) }">▶</span>
                <span class="text-[11px] font-serif font-extrabold tracking-wide flex-1">{{ node.label }}</span>
              </div>
              <!-- Leaf pages -->
              <div v-if="isTocExpanded(node.id)" class="ml-2 flex flex-col gap-0.5 border-l border-[#D9CFBF] pl-1.5">
                <div
                  v-for="leaf in node.children"
                  :key="leaf.id"
                  @click="navigateToTocLeaf(leaf)"
                  :class="[
                    'cursor-pointer px-1.5 py-1 rounded-md transition-all duration-200 select-none flex items-center justify-between',
                    activeSheet === leaf.sheet
                      ? 'bg-[#8B3E1F]/10 text-[#8B3E1F] font-bold'
                      : 'hover:bg-[#F2ECE0]/80 text-[#7A6B5B]'
                  ]"
                >
                  <span class="text-[10.5px] font-serif tracking-wide">{{ leaf.label }}</span>
                  <span v-if="activeSheet === leaf.sheet" class="text-[8px] text-[#8B3E1F]">●</span>
                </div>
              </div>
            </div>
            <!-- Leaf node (cover, back) -->
            <div
              v-else
              @click="navigateToTocLeaf(node)"
              :class="[
                'cursor-pointer px-2 py-1.5 rounded-lg border transition-all duration-200 select-none flex items-center justify-between',
                activeSheet === node.sheet
                  ? 'bg-[#8B3E1F]/10 border-[#8B3E1F]/40 text-[#8B3E1F] font-bold'
                  : 'bg-[#FFFDF9]/60 border-[#E8DFD0]/70 hover:bg-[#F2ECE0] text-[#705D4D]'
              ]"
            >
              <span class="text-[11px] font-serif tracking-wide">{{ node.label }}</span>
              <span v-if="activeSheet === node.sheet" class="text-[8px] text-[#8B3E1F]">●</span>
            </div>
          </template>
        </div>

      </div>

      <!-- Panel 2: Volumes (册次) -->
      <div 
        v-if="showVolumes" 
        class="w-full lg:w-[260px] bg-[#FAF4E8] border border-[#8B3E1F]/20 rounded-xl p-4 flex flex-col shrink-0 shadow-md transition-all animate-fade-in relative"
      >
        <!-- Corner Decorative Accents -->
        <div class="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-[#8B3E1F]/35 pointer-events-none" />
        <div class="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r border-[#8B3E1F]/35 pointer-events-none" />
        <div class="absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l border-[#8B3E1F]/35 pointer-events-none" />
        <div class="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-[#8B3E1F]/35 pointer-events-none" />

        <div class="font-serif text-sm font-bold text-[#8B3E1F] border-b border-[#EBE2D0]/60 pb-2 mb-4 tracking-wider text-center">
          卷帙选册
        </div>

        <!-- VOLUME LIST -->
        <div class="flex flex-col flex-1 gap-2.5 overflow-y-auto max-h-[calc(100vh-220px)] pr-1 toc-scroll">
          <div class="flex flex-col gap-2 rounded-lg">
            <div 
              v-for="vol in volumesList"
              :key="vol.no"
              @click="selectVolume(vol.no)"
              :class="[
                'cursor-pointer p-2 rounded-lg border transition-all duration-300 flex flex-col relative overflow-hidden',
                currentVolume === vol.no
                  ? 'bg-[#8B3E1F] text-white border border-[#8B3E1F] shadow-sm'
                  : 'bg-[#FFFDF9]/90 border border-[#DECFBD]/85 text-[#5C5045] hover:bg-[#F2ECE0]'
              ]"
            >
              <!-- Sealed visual indicator -->
              <div 
                v-if="currentVolume === vol.no" 
                class="absolute -right-2 -bottom-2 bg-[#FFFDF4]/10 text-white rounded-full p-3 font-serif text-[18px] tracking-tighter opacity-15 rotate-12 font-extrabold"
              >
                藏
              </div>

              <span class="text-xs font-serif font-extrabold flex items-center gap-1">
                <span class="text-[9.5px] opacity-75">#{{"一二三四"[vol.no - 1]}}册</span>
                <span>{{ vol.title.split(' (')[0] }}</span>
              </span>
              <p 
                :class="[
                  'text-[9.5px] mt-1 font-sans leading-relaxed',
                  currentVolume === vol.no ? 'text-amber-100/90' : 'text-stone-500'
                ]"
              >
                {{ vol.desc }}
              </p>
            </div>
          </div>
        </div>

      </div>

      <!-- ==================== MIDDLE MAIN PANEL: 3D Animated Flipbook ==================== -->
      <div class="flex-1 flex flex-col items-center justify-center relative bg-gradient-to-b from-[#F5EFE2] via-[#EFE6D5] to-[#E3D7BF] border-2 border-[#8B3E1F]/20 rounded-xl p-2 md:p-6 min-h-[460px] shadow-xl relative overflow-hidden">
        <!-- Bamboo slips / classical texture watermarks on desk -->
        <div class="absolute inset-0 bg-[radial-gradient(#C4B296_0.8px,transparent_0.8px)] bg-[size:18px_18px] opacity-25 pointer-events-none" />
        
        <!-- Volume Swapping Overlay Spinner -->
        <div 
          v-if="isVolumeLoading" 
          class="absolute inset-0 bg-[#FAF4E9]/95 z-40 rounded-xl flex flex-col items-center justify-center p-6 animate-fade-in border border-[#DECFBD]/60"
        >
          <div class="relative w-16 h-16 mb-4 flex items-center justify-center">
            <!-- Simulated old-fashioned layout wax stamp spinner -->
            <div class="absolute inset-0 rounded-full border-4 border-[#8B3E1F]/20 border-t-[#8B3E1F] animate-spin" />
            <span class="text-red-800 font-serif font-extrabold text-sm scale-90">正印</span>
          </div>
          <h4 class="font-serif font-bold text-[#5C2E16] text-sm tracking-widest">
            正在解封调阅古本 · {{ volumesList[currentVolume - 1].title }}
          </h4>
          <p class="text-[10px] text-stone-400 mt-2 font-mono">
            * 数字化高精度数字典阁 · 宣纸载入中...
          </p>
        </div>
 
        <!-- Outermost Interactive 3D Book Grid -->
        <div 
          class="perspective-container relative w-full flex items-center justify-center my-4 md:my-8"
          id="3d-book-perspective-area"
        >
          <!-- Desktop scaling support -->
          <div 
            class="relative w-full max-w-[800px] aspect-[1.48/1] rounded-2xl p-1 transition-all duration-500 ease-out flex items-center justify-center"
            :style="{ transform: `scale(${zoomScale})` }"
          >
            <!-- Desktop reflection desk shadow -->
            <div class="absolute inset-x-4 -bottom-4 h-8 bg-black/15 blur-xl pointer-events-none rounded-full" />
 
            <!-- 3D Open Book Base Wrapper object -->
            <div 
              class="book-3d relative w-full h-full bg-transparent rounded-sm transition-all duration-500"
            >
              <!-- Left Hardcover Outer Case (visible when cover is open or back cover is shown) -->
              <div 
                v-if="activeSheet > 0"
                class="absolute left-0 top-0 bottom-0 right-[50%] bg-[#3B2516] rounded-l-xs transition-all duration-300 pointer-events-none"
                :style="{
                  borderWidth: activeSheet === totalSheets ? '2px' : '2px 0 2px 2px',
                  borderColor: '#4d321f',
                  borderStyle: 'solid',
                  boxShadow: activeSheet === totalSheets 
                    ? '0 30px 45px -12px rgba(26, 15, 6, 0.45), inset 0 0 35px rgba(0,0,0,0.65)' 
                    : '0 30px 45px -15px rgba(26, 15, 6, 0.45), inset -10px 0 25px rgba(0,0,0,0.5), inset 15px 0 25px rgba(0,0,0,0.4)',
                  borderRadius: activeSheet === totalSheets ? '4px' : '4px 0 0 4px'
                }"
              />
 
              <!-- Right Hardcover Outer Case (visible when cover is shown or book is open) -->
              <div 
                v-if="activeSheet < totalSheets"
                class="absolute right-0 top-0 bottom-0 left-[50%] bg-[#3B2516] rounded-r-xs transition-all duration-300 pointer-events-none"
                :style="{
                  borderWidth: activeSheet === 0 ? '2px' : '2px 2px 2px 0',
                  borderColor: '#4d321f',
                  borderStyle: 'solid',
                  boxShadow: activeSheet === 0 
                    ? '0 30px 45px -12px rgba(26, 15, 6, 0.45), inset 0 0 35px rgba(0,0,0,0.65)' 
                    : '0 30px 45px -15px rgba(26, 15, 6, 0.45), inset 10px 0 25px rgba(0,0,0,0.5), inset -15px 0 25px rgba(0,0,0,0.4)',
                  borderRadius: activeSheet === 0 ? '4px' : '0 4px 4px 0'
                }"
              />
 
              <!-- Left hardcover outer spine center crease vertical lines -->
              <div class="absolute left-[calc(50%-1px)] inset-y-0 w-[2px] bg-[#1d1008] z-[32] opacity-80" />
              <div class="absolute left-[calc(50%-6px)] inset-y-0 w-[12px] bg-gradient-to-r from-transparent via-[#200f05] to-transparent z-[32] pointer-events-none" />
 
              <!-- Antique stacked paper bundle lines on extreme bounds -->
              <div v-if="activeSheet > 0" class="absolute inset-y-2 left-1 tracking-[-2px] w-[5px] bg-gradient-to-r from-[#DFDBC5] to-[#C8BFA2] border-r border-[#6B5A40]/30 z-[22] rounded-l-xs opacity-75" />
              <div v-if="activeSheet < totalSheets" class="absolute inset-y-2 right-1 tracking-[-2px] w-[5px] bg-gradient-to-l from-[#DFDBC5] to-[#C8BFA2] border-l border-[#6B5A40]/30 z-[22] rounded-r-xs opacity-75" />
 
              <!-- STATIC INNER PAGES (Shown as fallback background when flipping covers) -->
              <div v-if="activeSheet > 0" class="absolute left-1.5 right-[50%] inset-y-1.5 bg-[#FAF6E8] border border-[#DECFBE]/40 rounded-l-sm overflow-hidden z-10 pointer-events-none shadow-inner">
                <div 
                  class="absolute inset-0 bg-cover bg-center brightness-[0.7] contrast-[1.1] opacity-65" 
                  :style="{ backgroundImage: `url(${generatedPages.cover.image})` }"
                />
                <div class="absolute inset-0 bg-[#4F3014]/30 mix-blend-multiply" />
                <div class="absolute inset-8 border-4 border-[#8B3E1F]/15 rounded-sm flex items-center justify-center">
                  <span class="text-[10px] text-[#EAE4CE]/80 font-serif tracking-widest text-center leading-[3] block" style="writing-mode: vertical-rl;">
                    高精数字化宗谱古籍珍藏
                  </span>
                </div>
              </div>
 
              <!-- STATIC RIGHT DEEP BACK COVER -->
              <div v-if="activeSheet < totalSheets" class="absolute right-1.5 left-[50%] inset-y-1.5 bg-[#f6eee0] border border-[#DECFBE]/40 rounded-r-sm overflow-hidden z-10 pointer-events-none shadow-inner">
                <div 
                  class="absolute inset-0 bg-cover bg-center brightness-[0.7] contrast-[1.1] opacity-55" 
                  :style="{ backgroundImage: `url(${generatedPages.back.image})` }"
                />
                <div class="absolute inset-8 border-2 border-[#8B3E1F]/10 rounded-sm flex flex-col justify-end items-center p-4 text-center">
                  <div class="bg-[#8B3E1F]/80 text-[#FFF9EB] px-3 py-1 rounded-sm text-[9px] font-bold tracking-widest uppercase">
                    终 (FIN)
                  </div>
                </div>
              </div>
 
              <!-- ==================== Interactive Flip Sheets ==================== -->
 
              <!-- SHEET 0: Cover Paper -->
              <div 
                class="sheet absolute right-1.5 top-1.5 bottom-1.5 left-[50%] transform-gpu"
                :class="[activeSheet > 0 ? 'flipped' : 'z-[29]']"
                style="transform-origin: left center; transform-style: preserve-3d;"
                @click="activeSheet === 0 ? turnNext() : (activeSheet === 1 ? turnPrev() : null)"
              >
                <!-- Cover Front -->
                <div class="page-side bg-[#FAF6E8] shadow-md rounded-r-xs p-4 flex flex-col justify-between overflow-hidden cursor-pointer hover:brightness-105 transition-colors">
                  <div 
                    class="absolute inset-0 bg-cover bg-center brightness-[0.93] contrast-[1.1]" 
                    :style="{ backgroundImage: `url(${generatedPages.cover.image})` }" 
                    referrerpolicy="no-referrer"
                  />
                  <div class="absolute inset-0 bg-gradient-to-r from-black/15 via-transparent to-black/[0.04]" />
                  
                  <div class="relative h-full border border-[#8B3E1F]/20 flex flex-col justify-between items-center py-7 px-3">
                    <div class="w-7 h-7 rounded-full border border-red-700/30 flex items-center justify-center font-serif text-red-700 text-[10px] font-bold bg-red-50/70 shadow-inner">
                      {{ generatedPages.cover.seal }}
                    </div>
 
                    <div class="bg-white/95 border border-[#5C2E16] px-4 py-6 my-auto flex flex-col items-center justify-center shadow-md rounded-sm max-w-[170px]">
                      <h1 class="text-xl font-serif font-extrabold text-[#3B2214] tracking-[0.35em] text-center leading-[1.6]" style="writing-mode: vertical-rl;">
                        {{ generatedPages.cover.title }}
                      </h1>
                    </div>
 
                    <div class="flex flex-col items-center">
                      <span class="text-[9px] text-amber-900/60 font-mono tracking-widest uppercase mb-1">
                        {{ generatedPages.cover.subtitle }}
                      </span>
                      <p class="text-[10px] font-medium text-[#5C2E16] font-serif tracking-widest mt-0.5">
                        {{ generatedPages.cover.authority }}
                      </p>
                    </div>
                  </div>
                </div>
 
                <!-- Cover Back Inside -->
                <div class="page-side bg-[#F6EFE2] rounded-l-xs p-5 flex flex-col justify-between overflow-hidden cursor-pointer" style="transform: rotateY(180deg);">
                  <div 
                    class="absolute inset-0 bg-cover bg-center brightness-[0.98] contrast-[1.05]" 
                    :style="{ backgroundImage: `url(${generatedPages.page1.image})` }" 
                    referrerpolicy="no-referrer"
                  />
                  <div class="absolute inset-0 bg-gradient-to-l from-black/20 via-transparent to-black/[0.03]" />
                  
                  <div class="relative h-full flex flex-col justify-between border border-dashed border-[#8B3E1F]/15 p-5 select-none font-serif">
                    <div class="text-center my-auto">
                      <h2 class="text-lg font-serif font-extrabold text-[#5C2E16] tracking-widest mb-3">
                        文献开标 · 影印卷折
                      </h2>
                      <div class="w-8 h-[1px] bg-[#8B3E1F]/30 mx-auto mb-3" />
                      <p class="text-[10.5px] text-[#7A6046] leading-relaxed max-w-[200px] mx-auto tracking-widest">
                        国家宗谱古籍数字化馆<br/>
                        第三次重修善本宗谱古籍<br/>
                        点击右侧进入正文
                      </p>
                    </div>
                    <div class="text-center text-[8.5px] text-[#A2876E] tracking-widest font-mono uppercase">
                      Traditional Book Craftsmanship
                    </div>
                  </div>
                </div>
              </div>
 
              <!-- SHEET 1: Page 1 Front & Page 2 Back -->
              <div 
                class="sheet absolute right-1.5 top-1.5 bottom-1.5 left-[50%] transform-gpu"
                :class="[
                  activeSheet > 1 ? 'flipped z-10' : '',
                  activeSheet === 1 ? 'z-[28]' : 'z-[5]'
                ]"
                style="transform-origin: left center; transform-style: preserve-3d;"
                @click="activeSheet === 1 ? turnNext() : (activeSheet === 2 ? turnPrev() : null)"
              >
                <!-- Sheet 1 Front -->
                <div class="page-side bg-[#FAF6E8] rounded-r-xs p-5 flex flex-col justify-between overflow-hidden cursor-pointer">
                  <div 
                    class="absolute inset-0 bg-cover bg-center brightness-[0.92] contrast-[1.08] opacity-75" 
                    :style="{ backgroundImage: `url(${generatedPages.page1.image})` }" 
                    referrerpolicy="no-referrer"
                  />
                  <div class="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/[0.03]" />
                  
                  <div class="relative h-full border border-red-800/15 p-3 flex flex-col justify-between">
                    <div class="absolute inset-0.5 border border-red-800/5 pointer-events-none" />
 
                    <div class="flex flex-col items-center h-full pt-1">
                      <h3 class="text-xs font-serif font-extrabold text-red-900 tracking-[0.2em] mb-3 text-center border-b border-red-800/20 pb-1.5">
                        {{ generatedPages.page1.title }}
                      </h3>
 
                      <div class="flex justify-center h-[68%] md:h-[72%] max-h-[250px] overflow-hidden select-none my-auto py-1">
                        <p class="font-serif text-[10px] sm:text-[11px] md:text-[11.5px] leading-[2] text-justify tracking-[0.22em] text-[#2F2116] font-medium" style="writing-mode: vertical-rl;">
                          {{ generatedPages.page1.content }}
                        </p>
                      </div>
                    </div>
 
                    <div class="flex items-center justify-between text-[8px] text-[#8C765C] border-t border-red-800/10 pt-1.5">
                      <span>{{ book.title }} · 卷一</span>
                      <div class="text-[8px] text-red-700/60 font-serif font-bold tracking-tighter border border-red-700/30 scale-90 px-1 py-0.5 rounded-xs transform rotate-2">
                        {{ generatedPages.page1.seal }}
                      </div>
                      <span>{{ generatedPages.page1.pageNo }}</span>
                    </div>
                  </div>
                </div>
 
                <!-- Sheet 1 Back -->
                <div class="page-side bg-[#FAF6E8] rounded-l-xs p-5 flex flex-col justify-between overflow-hidden cursor-pointer" style="transform: rotateY(180deg);">
                  <div 
                    class="absolute inset-0 bg-cover bg-center brightness-[0.93] contrast-[1.07] opacity-75" 
                    :style="{ backgroundImage: `url(${generatedPages.page2.image})` }" 
                    referrerpolicy="no-referrer"
                  />
                  <div class="absolute inset-0 bg-gradient-to-l from-black/20 via-transparent to-black/[0.03]" />
                  
                  <div class="relative h-full border border-red-800/15 p-3 flex flex-col justify-between">
                    <div class="absolute inset-0.5 border border-red-800/5 pointer-events-none" />
 
                    <div class="flex flex-col items-center h-full pt-1">
                      <h3 class="text-xs font-serif font-extrabold text-red-900 tracking-[0.2em] mb-3 text-center border-b border-red-800/20 pb-1.5">
                        {{ generatedPages.page2.title }}
                      </h3>
 
                      <div class="flex justify-center h-[68%] md:h-[72%] max-h-[250px] overflow-hidden select-none my-auto py-1">
                        <p class="font-serif text-[10px] sm:text-[11px] md:text-[11.5px] leading-[2] text-justify tracking-[0.22em] text-[#2F2116] font-medium" style="writing-mode: vertical-rl;">
                          {{ generatedPages.page2.content }}
                        </p>
                      </div>
                    </div>
 
                    <div class="flex items-center justify-between text-[8px] text-[#8C765C] border-t border-red-800/10 pt-1.5">
                      <span>{{ book.title }} · 卷二</span>
                      <div class="text-[8px] text-red-700/60 font-serif font-bold tracking-tighter border border-red-700/30 scale-90 px-1 py-0.5 rounded-xs transform -rotate-2">
                        {{ generatedPages.page2.seal }}
                      </div>
                      <span>{{ generatedPages.page2.pageNo }}</span>
                    </div>
                  </div>
                </div>
              </div>
 
              <!-- SHEET 2: Page 3 Front & Page 4 Back -->
              <div 
                class="sheet absolute right-1.5 top-1.5 bottom-1.5 left-[50%] transform-gpu"
                :class="[
                  activeSheet > 2 ? 'flipped z-10' : '',
                  activeSheet === 2 ? 'z-[27]' : 'z-[4]'
                ]"
                style="transform-origin: left center; transform-style: preserve-3d;"
                @click="activeSheet === 2 ? turnNext() : (activeSheet === 3 ? turnPrev() : null)"
              >
                <!-- Sheet 2 Front -->
                <div class="page-side bg-[#FAF6E8] rounded-r-xs p-5 flex flex-col justify-between overflow-hidden cursor-pointer">
                  <div 
                    class="absolute inset-0 bg-cover bg-center brightness-[0.93] contrast-[1.07] opacity-75" 
                    :style="{ backgroundImage: `url(${generatedPages.page3.image})` }" 
                    referrerpolicy="no-referrer"
                  />
                  <div class="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/[0.03]" />
                  
                  <div class="relative h-full border border-red-800/15 p-3 flex flex-col justify-between">
                    <div class="absolute inset-0.5 border border-red-800/5 pointer-events-none" />
 
                    <div class="flex flex-col items-center h-full pt-1">
                      <h3 class="text-xs font-serif font-extrabold text-red-900 tracking-[0.2em] mb-3 text-center border-b border-red-800/20 pb-1.5">
                        {{ generatedPages.page3.title }}
                      </h3>
 
                      <div class="flex justify-center h-[68%] md:h-[72%] max-h-[250px] overflow-hidden select-none my-auto py-1">
                        <p class="font-serif text-[9.5px] sm:text-[10px] md:text-[11px] leading-[1.95] text-justify tracking-[0.18em] text-[#2F2116] font-medium" style="writing-mode: vertical-rl;">
                          {{ generatedPages.page3.content }}
                        </p>
                      </div>
                    </div>
 
                    <div class="flex items-center justify-between text-[8px] text-[#8C765C] border-t border-red-800/10 pt-1.5">
                      <span>{{ book.title }} · 卷三</span>
                      <div class="text-[8px] text-red-700/60 font-serif font-bold tracking-tighter border border-red-700/30 scale-90 px-1 py-0.5 rounded-xs transform rotate-2">
                        {{ generatedPages.page3.seal }}
                      </div>
                      <span>{{ generatedPages.page3.pageNo }}</span>
                    </div>
                  </div>
                </div>
 
                <!-- Sheet 2 Back -->
                <div class="page-side bg-[#FAF6E8] rounded-l-xs p-5 flex flex-col justify-between overflow-hidden cursor-pointer" style="transform: rotateY(180deg);">
                  <div 
                    class="absolute inset-0 bg-cover bg-center brightness-[0.94] contrast-[1.06] opacity-75" 
                    :style="{ backgroundImage: `url(${generatedPages.page4.image})` }" 
                    referrerpolicy="no-referrer"
                  />
                  <div class="absolute inset-0 bg-gradient-to-l from-black/20 via-transparent to-black/[0.03]" />
                  
                  <div class="relative h-full border border-red-800/15 p-3 flex flex-col justify-between">
                    <div class="absolute inset-0.5 border border-red-800/5 pointer-events-none" />
 
                    <div class="flex flex-col items-center h-full pt-1">
                      <h3 class="text-xs font-serif font-extrabold text-red-900 tracking-[0.2em] mb-3 text-center border-b border-red-800/20 pb-1.5">
                        {{ generatedPages.page4.title }}
                      </h3>
 
                      <div class="flex justify-center h-[68%] md:h-[72%] max-h-[250px] overflow-hidden select-none my-auto py-1">
                        <p class="font-serif text-[10px] sm:text-[11px] md:text-[11.5px] leading-[2] text-justify tracking-[0.22em] text-[#2F2116] font-medium" style="writing-mode: vertical-rl;">
                          {{ generatedPages.page4.content }}
                        </p>
                      </div>
                    </div>
 
                    <div class="flex items-center justify-between text-[8px] text-[#8C765C] border-t border-red-800/10 pt-1.5">
                      <span>{{ book.title }} · 卷四</span>
                      <div class="text-[8px] text-red-700/60 font-serif font-bold tracking-tighter border border-red-700/30 scale-90 px-1 py-0.5 rounded-xs transform -rotate-2">
                        {{ generatedPages.page4.seal }}
                      </div>
                      <span>{{ generatedPages.page4.pageNo }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <!-- SHEET 2 END -->

              <!-- SHEET 3: Page 5 Front & Back Cover Back -->
              <div 
                class="sheet absolute right-1.5 top-1.5 bottom-1.5 left-[50%] transform-gpu"
                :class="[
                  activeSheet > 3 ? 'flipped z-10' : '',
                  activeSheet === 3 ? 'z-[26]' : 'z-[3]'
                ]"
                style="transform-origin: left center; transform-style: preserve-3d;"
                @click="activeSheet === 3 ? turnNext() : (activeSheet === 4 ? turnPrev() : null)"
              >
                <!-- Sheet 3 Front (Page 5) -->
                <div class="page-side bg-[#FAF6E8] rounded-r-xs p-5 flex flex-col justify-between overflow-hidden cursor-pointer">
                  <div 
                    class="absolute inset-0 bg-cover bg-center brightness-[0.93] contrast-[1.07] opacity-75" 
                    :style="{ backgroundImage: `url(${generatedPages.page5.image})` }" 
                    referrerpolicy="no-referrer"
                  />
                  <div class="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/[0.03]" />
                  
                  <div class="relative h-full border border-red-800/15 p-3 flex flex-col justify-between">
                    <div class="absolute inset-0.5 border border-red-800/5 pointer-events-none" />
 
                    <div class="flex flex-col items-center h-full pt-1">
                      <h3 class="text-xs font-serif font-extrabold text-red-900 tracking-[0.2em] mb-3 text-center border-b border-red-800/20 pb-1.5">
                        {{ generatedPages.page5.title }}
                      </h3>
 
                      <div class="flex justify-center h-[68%] md:h-[72%] max-h-[250px] overflow-hidden select-none my-auto py-1">
                        <p class="font-serif text-[9.5px] sm:text-[10px] md:text-[11px] leading-[1.95] text-justify tracking-[0.2em] text-[#2F2116] font-medium" style="writing-mode: vertical-rl;">
                          {{ generatedPages.page5.content }}
                        </p>
                      </div>
                    </div>
 
                    <div class="flex items-center justify-between text-[8px] text-[#8C765C] border-t border-red-800/10 pt-1.5">
                      <span>{{ book.title }} · 后跋</span>
                      <div class="text-[8px] text-red-700/65 font-serif font-bold tracking-tighter border border-red-700/30 scale-90 px-1 py-0.5 rounded-xs transform rotate-2">
                        {{ generatedPages.page5.seal }}
                      </div>
                      <span>{{ generatedPages.page5.pageNo }}</span>
                    </div>
                  </div>
                </div>
 
                <!-- Sheet 3 Back (Back Cover) -->
                <div class="page-side bg-[#FAF6E8] rounded-l-xs p-4 flex flex-col justify-between overflow-hidden cursor-pointer" style="transform: rotateY(180deg);">
                  <div 
                    class="absolute inset-0 bg-cover bg-center brightness-[0.88] contrast-[1.1] saturate-[0.85]" 
                    :style="{ backgroundImage: `url(${generatedPages.back.image})` }" 
                    referrerpolicy="no-referrer"
                  />
                  <div class="absolute inset-0 bg-[#A2876E]/15 mix-blend-color-burn" />
                  <div class="absolute inset-0 bg-gradient-to-l from-black/35 via-transparent to-black/[0.05]" />
                  
                  <div class="relative h-full border border-stone-800/20 flex flex-col justify-between items-center py-8 text-center bg-transparent">
                    <span class="text-[10px] uppercase tracking-widest text-[#E3D9C9] font-serif">印装竣工 · 卷终</span>
                    
                    <div class="flex flex-col items-center">
                      <h3 class="text-xs font-serif font-extrabold text-[#FFFDF4] tracking-widest leading-relaxed">
                        {{ generatedPages.back.title }}
                      </h3>
                      <div class="h-[1px] w-5 bg-[#8B3E1F]/50 my-2.5" />
                      <p class="text-[9px] text-[#EADDC9] opacity-85 leading-normal font-serif">{{ generatedPages.back.subtitle }}</p>
                      <p class="font-mono text-[8px] text-stone-300 bg-white/10 px-1.5 py-0.5 rounded-md mt-1">{{ generatedPages.back.serial }}</p>
                    </div>
 
                    <span class="text-[8px] text-stone-300 opacity-60 font-mono tracking-wider">
                      © 钦定华夏地方历史谱编会
                    </span>
                  </div>
                </div>
              </div>

              <!-- Spine bound overlay (string thread simulation) -->
              <div 
                class="central-crease absolute inset-y-1.5 left-1/2 w-[18px] transform -translate-x-1/2 pointer-events-none z-[35]"
                style="background: linear-gradient(90deg, rgba(35,20,10,0.18) 0%, rgba(35,20,10,0.3) 35%, rgba(0,0,0,0) 45%, rgba(0,0,0,0) 55%, rgba(35,20,10,0.3) 65%, rgba(35,20,10,0.18) 100%);"
                v-if="activeSheet > 0 && activeSheet < totalSheets"
              >
                <!-- Vintage string threads -->
                <div class="absolute left-1/2 top-4 w-[1.5px] h-4 bg-[#7a572a]/50 transform -translate-x-1/2" />
                <div class="absolute left-1/2 top-1/4 w-[1.5px] h-4 bg-[#7a572a]/55 transform -translate-x-1/2" />
                <div class="absolute left-1/2 top-1/2 w-[1.5px] h-4 bg-[#7a572a]/55 transform -translate-x-1/2 bg-[#7a572a]/55" />
                <div class="absolute left-1/2 top-3/4 w-[1.5px] h-4 bg-[#7a572a]/55 transform -translate-x-1/2" />
                <div class="absolute left-1/2 bottom-4 w-[1.5px] h-4 bg-[#7a572a]/50 transform -translate-x-1/2" />
              </div>

            </div>
          </div>
        </div>


      </div>


              <!-- Spine bound overlay (string thread simulation) -->

    </div>

    <!-- ==================== BOTTOM COLLAPSIBLE PANEL: Horizontal Filmstrip Thumbnails ==================== -->
    <div 
      v-if="showThumbnails" 
      class="w-full max-w-[1240px] mt-4 border border-[#8B3E1F]/20 bg-[#FAF4E9] p-4 rounded-xl shadow-sm animate-fade-in relative"
    >
      <!-- Corner Decorative Accents -->
      <div class="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-[#8B3E1F]/35 pointer-events-none" />
      <div class="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r border-[#8B3E1F]/35 pointer-events-none" />
      <div class="absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l border-[#8B3E1F]/35 pointer-events-none" />
      <div class="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-[#8B3E1F]/35 pointer-events-none" />

      <div class="flex items-center justify-between border-b border-[#EBE2D0]/60 pb-2 mb-3">
        <h4 class="font-serif font-bold text-[#8B3E1F] text-xs tracking-wider flex items-center gap-1.5 align-middle">
          <span>🖼️</span> 高清纸页缩略透卷 (Thumbnails / Grid)
        </h4>
        <span class="text-[8.5px] text-[#A2876E] tracking-widest font-mono uppercase">
          Digital Pagination Slider Strip
        </span>
      </div>

      <div class="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-thin">
        <div 
          v-for="item in thumbnailsList" 
          :key="item.sheet"
          @click="activeSheet = item.sheet"
          :class="[
            'flex-shrink-0 cursor-pointer w-[120px] rounded-lg border p-1 border-dashed relative group transition hover:shadow-md flex flex-col gap-1 items-center bg-[#FFFDF9]',
            activeSheet === item.sheet
              ? 'ring-2 ring-[#8B3E1F] border-transparent'
              : 'border-[#DECFBD]/80 hover:border-[#8B3E1F]'
          ]"
        >
          <!-- Miniature Paper Render Box -->
          <div class="relative w-full aspect-[1.3/1] rounded overflow-hidden shadow-xs">
            <div 
              class="absolute inset-0 bg-cover bg-center brightness-[0.93] transition group-hover:scale-105"
              :style="{ backgroundImage: `url(${item.image})` }"
            />
            <div class="absolute inset-0 bg-black/5" />
            <span class="absolute right-1 top-1 bg-black/60 text-white rounded text-[8px] font-serif px-1 scale-95 py-0.5 leading-none shadow-sm">
              {{ item.label }}
            </span>
          </div>

          <span class="text-[9.5px] font-serif font-bold tracking-tight text-[#4C3F35] dark:text-stone-300">
            {{ item.desc }}
          </span>
        </div>
      </div>
    </div>

    <!-- Brief note description -->
    <p class="text-[9.5px] text-stone-400 dark:text-stone-500 text-center mt-3 font-mono">
      * 阅览印迹: 3D页卷支持直接点击页面两侧边缘进行纸质回弹互动，或使用快捷目录及册次系统快速检阅。
    </p>

  </div>
</template>

<style scoped>
.perspective-container {
  perspective: 1600px;
}

.book-3d {
  transform-style: preserve-3d;
}

.sheet {
  width: calc(50% - 1.5px);
  height: calc(100% - 3px);
  pointer-events: auto;
  transform-style: preserve-3d;
  /* Ultra-smooth, elegant ease-in-out curve resembling actual heavy book paper folding but faster and silkier */
  transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
}

/* Page base properties - updated value for softer, layered antique paper shadowing */
.page-side {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid rgba(139, 62, 31, 0.15);
  box-shadow: 
    0 2px 5px rgba(60, 40, 20, 0.05),
    0 10px 20px -5px rgba(60, 40, 20, 0.12),
    inset -1px 0 0 rgba(255, 255, 255, 0.5);
  transition: box-shadow 0.8s cubic-bezier(0.25, 1, 0.5, 1);
}

/* Dynamic overlay element for soft shadow/shading transitions during book flips */
.page-side::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(to right, rgba(0, 0, 0, 0.08) 0%, rgba(0, 0, 0, 0) 20%, rgba(0, 0, 0, 0) 80%, rgba(0, 0, 0, 0.05) 100%);
  mix-blend-mode: multiply;
  opacity: 0.8;
  z-index: 10;
  transition: opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1);
}

/* Front Page base crease shading - spine is on the left, so left shadow is slightly deeper */
.sheet:not(.flipped) .page-side:first-child::after {
  background: linear-gradient(to right, rgba(0, 0, 0, 0.18) 0%, rgba(0, 0, 0, 0.02) 12%, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.04) 100%);
}

/* Front Page hover lift effect styling for delicate, deep shadowing */
.sheet:not(.flipped):hover .page-side:first-child {
  box-shadow: 
    0 4px 8px rgba(60, 40, 20, 0.08),
    0 22px 30px -8px rgba(60, 40, 20, 0.18),
    inset -1px 0 0 rgba(255, 255, 255, 0.5);
}

/* When hovered, soft shine/crease shadow sweeps across the curled page */
.sheet:not(.flipped):hover .page-side:first-child::after {
  background: linear-gradient(to right, rgba(0, 0, 0, 0.22) 0%, rgba(0, 0, 0, 0.04) 10%, rgba(0, 0, 0, 0) 35%, rgba(0, 0, 0, 0.12) 100%);
  opacity: 1;
}

/* Flipped dynamic state (sitting on left page, spine crease is on the right) */
.sheet.flipped .page-side:last-child {
  box-shadow: 
    0 2px 5px rgba(60, 40, 20, 0.05),
    0 10px 20px -5px rgba(60, 40, 20, 0.12),
    inset 1px 0 0 rgba(255, 255, 255, 0.5);
}

.sheet.flipped .page-side:last-child::after {
  background: linear-gradient(to left, rgba(0, 0, 0, 0.18) 0%, rgba(0, 0, 0, 0.02) 12%, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.04) 100%);
}

/* Back page hover lift effect styling */
.sheet.flipped:hover .page-side:last-child {
  box-shadow: 
    0 4px 8px rgba(60, 40, 20, 0.08),
    0 22px 30px -8px rgba(60, 40, 20, 0.18),
    inset 1px 0 0 rgba(255, 255, 255, 0.5);
}

.sheet.flipped:hover .page-side:last-child::after {
  background: linear-gradient(to left, rgba(0, 0, 0, 0.22) 0%, rgba(0, 0, 0, 0.04) 10%, rgba(0, 0, 0, 0) 35%, rgba(0, 0, 0, 0.12) 100%);
  opacity: 1;
}

/* Flipped animation triggers 3D Rotations */
.flipped {
  transform: rotateY(-180deg) !important;
  z-index: 30 !important;
}

/* Page lifting hover near borders */
.sheet:not(.flipped):hover {
  transform: rotateY(-8deg);
}

.sheet.flipped:hover {
  transform: rotateY(-172deg) !important;
}

/* Scrollbar styling */
.scrollbar-thin::-webkit-scrollbar {
  height: 4px;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgba(139, 62, 31, 0.2);
  border-radius: 9px;
}

.toc-scroll::-webkit-scrollbar {
  width: 3px;
}
.toc-scroll::-webkit-scrollbar-thumb {
  background-color: rgba(139, 62, 31, 0.15);
  border-radius: 9px;
}
.toc-scroll::-webkit-scrollbar-track {
  background: transparent;
}

/* Animations */
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
