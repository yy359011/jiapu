export interface Surname {
  name: string;      // "陈", "张", "赵"
  fullName: string;  // "陈氏", "張 [张]"
  pinyin: string;
  charBadge: string; // "陈", "张"
  key: string;       // Index letter "C", "Z", etc.
  desc: string;
  volCount: string;
  revisionTime: string;
  population: string;
  subtext: string;
}

export interface Book {
  id: string;
  surname: string;
  title: string;
  revision: string;
  volumes: string;
  location: string;
  compiler: string;
  time: string;
  format: string;
  library: string;
  serialNo: string;
  abstract: string;
  pages: string[];
}

export const SURNAMES: Surname[] = [
  {
    name: "陈",
    fullName: "陈[陳]",
    pinyin: "chen",
    charBadge: "陈",
    key: "C",
    desc: "颍川世泽，太丘家声。陈氏系出妫姓，始祖胡公妫满。明清两代人杰地灵、谱牒完备，其家规严格，重视读书及崇孝行善。",
    volCount: "12 册",
    revisionTime: "2003年重修",
    population: "约7000万人",
    subtext: "1 种 [常见姓氏]"
  },
  {
    name: "张",
    fullName: "張 [张]",
    pinyin: "zhang",
    charBadge: "张",
    key: "Z",
    desc: "清河堂上，百忍家风。张氏始祖挥公发明弓矢，受封张氏。分支世系繁茂，历代推崇百忍古训，记录了自中原迁江南之辉煌史实。",
    volCount: "15 册",
    revisionTime: "1999年重修",
    population: "约0.954亿人",
    subtext: "2 种 [常见姓氏]"
  },
  {
    name: "赵",
    fullName: "趙 [赵]",
    pinyin: "zhao",
    charBadge: "赵",
    key: "Z",
    desc: "天水世家，半部论语。赵氏多起源于甘肃天水，因赵国而得姓。宋代大姓之首，世系昭穆清晰，流传有宋室南迁之大量珍贵文献。",
    volCount: "14 册",
    revisionTime: "2001年续修",
    population: "约2670万人",
    subtext: "2 种 [常见姓氏]"
  },
  {
    name: "钱",
    fullName: "錢 [钱]",
    pinyin: "qian",
    charBadge: "钱",
    key: "Q",
    desc: "彭城世泽，吴越王风。钱氏源自籛铿（彭祖），五代吴越国时期繁衍最盛，历代崇文重教，家训著名，科学家、文学家人才辈出。",
    volCount: "8 册",
    revisionTime: "2005年重修",
    population: "约260万人",
    subtext: "常见姓氏"
  },
  {
    name: "孙",
    fullName: "孫 [孙]",
    pinyin: "sun",
    charBadge: "孙",
    key: "S",
    desc: "乐安名门，兵学世家。孙氏源于姬姓，以春秋孙武、孙膑最著。江南支脉繁盛，家史具有极其深厚的军事与典籍底蕴。",
    volCount: "10 册",
    revisionTime: "2002年重修",
    population: "约1830万人",
    subtext: "常见姓氏"
  },
  {
    name: "李",
    fullName: "李 [李]",
    pinyin: "li",
    charBadge: "李",
    key: "L",
    desc: "陇西世家，桃李成荫。李氏为华夏第一大姓之一，源于理官，代有名臣骁将及文坛宗师。李唐皇室后裔宗支遍布海内外，谱传千卷。",
    volCount: "18 册",
    revisionTime: "2000年重修",
    population: "约1.01亿人",
    subtext: "常见姓氏"
  },
  {
    name: "周",
    fullName: "周 [周]",
    pinyin: "zhou",
    charBadge: "周",
    key: "Z",
    desc: "爱莲家声，细柳名家。周氏源于姬姓，以周王朝国号为氏，历代重文崇儒。苏浙一带周氏谱系详尽，多崇尚爱莲说清正廉洁之风。",
    volCount: "12 册",
    revisionTime: "2004年续修",
    population: "约2500万人",
    subtext: "常见姓氏"
  },
  {
    name: "吴",
    fullName: "吳 [吴]",
    pinyin: "wu",
    charBadge: "吴",
    key: "W",
    desc: "延陵世泽，至德家声。吴氏始祖为吴泰伯，以延陵季子最为著名，江浙、江南一带繁衍极盛。吴氏家训崇尚谦让，族谱卷帙繁浩。",
    volCount: "11 册",
    revisionTime: "2001年重修",
    population: "约2460万人",
    subtext: "常见姓氏"
  },
  {
    name: "郑",
    fullName: "鄭 [郑]",
    pinyin: "zheng",
    charBadge: "郑",
    key: "Z",
    desc: "荥阳世泽，书带世家。郑氏起源于周王室姬姓，郑国之后。世称荥阳郑氏，世家礼乐，以笃行孝道、博学治国名扬史册。",
    volCount: "9 册",
    revisionTime: "1998年重修",
    population: "约1200万人",
    subtext: "常见姓氏"
  },
  {
    name: "王",
    fullName: "王 [王]",
    pinyin: "wang",
    charBadge: "王",
    key: "W",
    desc: "三槐世第，太原名门。王氏人口极众，源自姬姓、子姓等多支，以三槐堂、太原堂最盛。族谱著录极大，家风清朗，历代宰辅不绝。",
    volCount: "20 册",
    revisionTime: "2006年续修",
    population: "约1.015亿人",
    subtext: "常见姓氏"
  },
  {
    name: "冯",
    fullName: "馮 [冯]",
    pinyin: "feng",
    charBadge: "冯",
    key: "F",
    desc: "始平世家，万石家风。冯氏源自姬姓，因周代魏国冯城得姓，以忠厚传家闻名，支脉分布平坦，记录了华夏文明的历次大迁徙。",
    volCount: "8 册",
    revisionTime: "2003年修",
    population: "约860万人",
    subtext: "常见姓氏"
  },
  {
    name: "卫",
    fullName: "衛 [卫]",
    pinyin: "wei",
    charBadge: "卫",
    key: "W",
    desc: "河东名门，风骨秀逸。卫氏源自康叔之后，以河东堂最为著名。江南一代卫氏多出文人雅士，族谱记载历代学问渊博之贤嗣。",
    volCount: "6 册",
    revisionTime: "2002年重修",
    population: "约120万人",
    subtext: "传统大姓"
  },
  {
    name: "蒋",
    fullName: "蔣 [蒋]",
    pinyin: "jiang",
    charBadge: "蒋",
    key: "J",
    desc: "乐安世泽，钟山风骨。蒋氏源自周公姬姓，蒋国之后，后繁衍为江南名门。苏浙粤一带蒋氏文献保存极其完好，世系严整。",
    volCount: "10 册",
    revisionTime: "2005年续修",
    population: "约650万人",
    subtext: "传统大姓"
  },
  {
    name: "沈",
    fullName: "沈 [沈]",
    pinyin: "shen",
    charBadge: "沈",
    key: "S",
    desc: "吴兴望族，竹溪家声。沈氏以吴兴堂为中心，源自周文王季子。江南水乡一脉沈氏文渊深厚，书画泰斗、藏书名家连绵不绝。",
    volCount: "12 册",
    revisionTime: "2000年重修",
    population: "约600万人",
    subtext: "传统大姓"
  },
  {
    name: "韩",
    fullName: "韓 [韩]",
    pinyin: "han",
    charBadge: "韩",
    key: "H",
    desc: "南阳世家，昌黎文风。韩氏源自姬姓，因战国韩非、唐代韩愈等文坛泰斗名扬天下，宗族修谱讲究文脉传承，文风昌盛。",
    volCount: "10 册",
    revisionTime: "2004年重修",
    population: "约820万人",
    subtext: "传统大姓"
  },
  {
    name: "杨",
    fullName: "楊 [杨]",
    pinyin: "yang",
    charBadge: "杨",
    key: "Y",
    desc: "四知世泽，书香传家。杨氏以关西‘四知堂’最著，世评‘清白廉洁’家风。族派繁衍生息，世系图绘大度，具有极高收藏价值。",
    volCount: "16 册",
    revisionTime: "2002年重修",
    population: "约4200万人",
    subtext: "常见姓氏"
  },
  {
    name: "朱",
    fullName: "朱 [朱]",
    pinyin: "zhu",
    charBadge: "朱",
    key: "Z",
    desc: "紫阳世泽，考亭名门。朱氏以理学家朱熹为核心，世家礼乐，书香不绝。明代皇室朱氏家乘世系尤其浩繁高贵，谱系井然。",
    volCount: "14 册",
    revisionTime: "2001年续修",
    population: "约1700万人",
    subtext: "常见姓氏"
  },
  {
    name: "秦",
    fullName: "秦 [秦]",
    pinyin: "qin",
    charBadge: "秦",
    key: "Q",
    desc: "乐安名门，古风犹存。秦氏源自嬴姓，秦国之后。修谱历史久远，江浙及川蜀一带分支保留有多幅珍贵的先祖木刻画像。",
    volCount: "7 册",
    revisionTime: "1999年重修",
    population: "约350万人",
    subtext: "百家姓氏"
  },
  {
    name: "尤",
    fullName: "尤 [尤]",
    pinyin: "you",
    charBadge: "尤",
    key: "Y",
    desc: "吴郡名门，归真反璞。尤氏源自沈氏避讳，江浙一带为主要聚居地。宗支虽小而英才众多，江南世系与藏书谱录均极为精致。",
    volCount: "5 册",
    revisionTime: "2003年重修",
    population: "约100万人",
    subtext: "百家姓氏"
  },
  {
    name: "许",
    fullName: "許 [许]",
    pinyin: "xu",
    charBadge: "许",
    key: "X",
    desc: "太岳世泽，高阳名家。许氏源自神农氏，许国之后。世称高阳许氏，礼乐传家，家谱广泛印制于闽浙及台湾等沿海省份。",
    volCount: "12 册",
    revisionTime: "2004年后续",
    population: "约880万人",
    subtext: "传统大姓"
  },
  {
    name: "何",
    fullName: "何 [何]",
    pinyin: "he",
    charBadge: "何",
    key: "H",
    desc: "庐江望族，水木清华。何氏多由韩氏音转而来，江淮两岸、岭南闽中分布极广。其谱牒常含有南迁地图与祠堂平面考证图像。",
    volCount: "11 册",
    revisionTime: "2001年修谱",
    population: "约1400万人",
    subtext: "常见姓氏"
  },
  {
    name: "吕",
    fullName: "呂 [吕]",
    pinyin: "lv",
    charBadge: "吕",
    key: "L",
    desc: "渭水家声，东平望族。吕氏源于姜姓，以吕尚（姜子牙）为始祖。清规严整，家声显耀，沿长江流域家乘古籍极为醇厚。",
    volCount: "10 册",
    revisionTime: "2005年合修",
    population: "约7000万人",
    subtext: "常见姓氏"
  },
  {
    name: "施",
    fullName: "施 [施]",
    pinyin: "shi",
    charBadge: "施",
    key: "S",
    desc: "临濮望族，寻源名家。施氏源自姬姓，春秋鲁大夫施父之后。门风优雅，江南世家常保留有详尽的文会记录与清代私塾考题。",
    volCount: "8 册",
    revisionTime: "2002年重修",
    population: "约200万人",
    subtext: "百家姓氏"
  },
  {
    name: "孔",
    fullName: "孔 [孔]",
    pinyin: "kong",
    charBadge: "孔",
    key: "K",
    desc: "阙里家风，圣人后裔。孔氏以至圣先师孔子为始祖，万世尊崇。其大宗世系谱（即《孔子世家谱》）誉为‘天下第一皇谱’。",
    volCount: "24 册",
    revisionTime: "2009年大修",
    population: "约330万人",
    subtext: "圣裔门第"
  },
  {
    name: "曹",
    fullName: "曹 [曹]",
    pinyin: "cao",
    charBadge: "曹",
    key: "C",
    desc: "谯国望族，文华荟萃。曹氏源于姬姓、子姓，以三国曹魏一脉最为显赫，文采飞扬。明清刻本家乘具有极其华美之辞章。",
    volCount: "13 册",
    revisionTime: "2001年重修",
    population: "约730万人",
    subtext: "传统大姓"
  },
  {
    name: "严",
    fullName: "严 [严]",
    pinyin: "yan",
    charBadge: "严",
    key: "Y",
    desc: "富春山高，天水流芳。严氏源自庄氏避东汉明帝刘庄之名讳而改姓。以东汉隐士严子陵最著，其家风高洁孤傲，备受推崇。",
    volCount: "6 册",
    revisionTime: "2004年后续",
    population: "约220万人",
    subtext: "百家姓氏"
  },
  {
    name: "华",
    fullName: "華 [华]",
    pinyin: "hua",
    charBadge: "华",
    key: "H",
    desc: "武陵名门，医学世家。华氏源于子姓，春秋宋国戴公之后。其谱牒常含有历代中医古方、本草图绘，富含科技史价值。",
    volCount: "7 册",
    revisionTime: "2000年重修",
    population: "约70万人",
    subtext: "百家姓氏"
  },
  {
    name: "金",
    fullName: "金 [金]",
    pinyin: "jin",
    charBadge: "金",
    key: "J",
    desc: "彭城望族，钟鼎家声。金氏多源自少昊金天氏。江浙一带金氏族谱保存多部，以世代簪缨、忠义传家为豪。",
    volCount: "9 册",
    revisionTime: "2005年修",
    population: "约380万人",
    subtext: "传统大姓"
  },
  {
    name: "魏",
    fullName: "魏 [魏]",
    pinyin: "wei",
    charBadge: "魏",
    key: "W",
    desc: "巨鹿世家，贞观之治。魏氏源自姬姓，因战国魏国得氏。以唐代谏臣魏征最著名，后裔谱中皆保留《十思疏》全文作为家训。",
    volCount: "10 册",
    revisionTime: "2003年续修",
    population: "约600万人",
    subtext: "传统大姓"
  },
  {
    name: "陶",
    fullName: "陶 [陶]",
    pinyin: "tao",
    charBadge: "陶",
    key: "T",
    desc: "彭泽家声，五柳高风。陶氏以五柳先生陶渊明为宗，崇尚自然与隐逸文化。谱系中往往刊登有多幅田园世居图卷。",
    volCount: "8 册",
    revisionTime: "1999年重修",
    population: "约300万人",
    subtext: "传统大姓"
  },
  {
    name: "姜",
    fullName: "姜 [姜]",
    pinyin: "jiang",
    charBadge: "姜",
    key: "J",
    desc: "天水堂上，神农后裔。姜氏为华夏最古老的八大姓氏之一，源自神农氏姜水，历史底蕴冠绝。历代崇拜齐国一脉文明。",
    volCount: "12 册",
    revisionTime: "2002年重修",
    population: "约550万人",
    subtext: "传统大姓"
  },
  {
    name: "戚",
    fullName: "戚 [戚]",
    pinyin: "qi",
    charBadge: "戚",
    key: "Q",
    desc: "东海望族，将门风骨。戚氏起源于周朝，以明代抗倭名将戚继光家风最为忠烈。其谱牒中多记载军事谋略与强身家规。",
    volCount: "5 册",
    revisionTime: "2006年修",
    population: "约50万人",
    subtext: "百家姓氏"
  },
  {
    name: "谢",
    fullName: "謝 [谢]",
    pinyin: "xie",
    charBadge: "谢",
    key: "X",
    desc: "陈郡世泽，东山高风。谢氏以东晋谢安、谢玄等为中心，世人仰慕乌衣巷底、东山再起之雅人深致，江南谱乘皆登谢公林泉图。",
    volCount: "15 册",
    revisionTime: "2000年大修",
    population: "约1000万人",
    subtext: "常见姓氏"
  },
  {
    name: "邹",
    fullName: "鄒 [邹]",
    pinyin: "zou",
    charBadge: "邹",
    key: "Z",
    desc: "范阳世泽，古风醇厚。邹氏源自子姓，春秋宋国人之后。崇尚儒教，规矩精细，多出贤德官吏、鸿儒学者。",
    volCount: "8 册",
    revisionTime: "2004年续修",
    population: "约450万人",
    subtext: "传统大姓"
  },
  {
    name: "喻",
    fullName: "喻 [喻]",
    pinyin: "yu",
    charBadge: "喻",
    key: "Y",
    desc: "江夏堂内，崇儒世家。喻氏源于姬姓或谕黄氏，以严谨治学、重教兴文闻名。宗谱刻印常含大量先贤著作、诗集集锦。",
    volCount: "6 册",
    revisionTime: "2003年重修",
    population: "约110万人",
    subtext: "百家姓氏"
  },
  {
    name: "柏",
    fullName: "柏 [柏]",
    pinyin: "bai",
    charBadge: "柏",
    key: "B",
    desc: "魏京堂名，芝兰玉树。柏氏源自远古柏皇氏，历史极其古老。族谱多有深修，展现一幅幅精美的中古神话及地理迁徙图画。",
    volCount: "5 册",
    revisionTime: "2001年修",
    population: "约60万人",
    subtext: "百家姓氏"
  },
  {
    name: "水",
    fullName: "水 [水]",
    pinyin: "shui",
    charBadge: "水",
    key: "S",
    desc: "吴兴望族，源远流长。水氏源自水工守官，长于水利与堪舆，江南多见。家乘内容多富含地方水文规划与农事年历书札。",
    volCount: "4 册",
    revisionTime: "1998年重修",
    population: "约10万人",
    subtext: "罕见名门"
  },
  {
    name: "窦",
    fullName: "竇 [窦]",
    pinyin: "dou",
    charBadge: "窦",
    key: "D",
    desc: "扶风望族，诗书门第。窦氏源自姒姓，夏帝少康之后。历代名臣大儒不绝，其世系中尤多才媛名女之传略，十分特殊。",
    volCount: "8 册",
    revisionTime: "2002年重修",
    population: "约100万人",
    subtext: "百家姓氏"
  },
  {
    name: "章",
    fullName: "章 [章]",
    pinyin: "zhang",
    charBadge: "章",
    key: "Z",
    desc: "豫章世泽，太公后裔。章氏源自姜姓，齐国大夫后裔，豫章一脉最为昌盛。宗谱修撰多用极其上等之宣纸，装帧大气。",
    volCount: "7 册",
    revisionTime: "2005年续修",
    population: "约210万人",
    subtext: "百家姓氏"
  },
  {
    name: "云",
    fullName: "云 [云]",
    pinyin: "yun",
    charBadge: "云",
    key: "Y",
    desc: "琅琊望族，浩气长存。云氏源自祝融氏，以忠肝义胆、坚贞不屈家风著称。谱中多记载保家卫国、不仕僭伪之志节。",
    volCount: "5 册",
    revisionTime: "2004年续修",
    population: "约35万人",
    subtext: "百家姓氏"
  },
  {
    name: "苏",
    fullName: "苏 [苏]",
    pinyin: "su",
    charBadge: "苏",
    key: "S",
    desc: "眉山望族，三苏文海。苏氏以三苏（苏洵、苏轼、苏辙）最著，文采甲天下，德泽后世。眉山苏氏宗谱为历朝流传之神品文文献。",
    volCount: "14 册",
    revisionTime: "2002年续修",
    population: "约630万人",
    subtext: "传统大姓"
  },
  {
    name: "潘",
    fullName: "潘 [潘]",
    pinyin: "pan",
    charBadge: "潘",
    key: "P",
    desc: "荥阳世泽，美名远扬。潘氏起源于周王室，在江浙及中原繁衍，名流汇聚。家训讲究德言容功，族人温雅，守规守矩。",
    volCount: "10 册",
    revisionTime: "2003年重修",
    population: "约680万人",
    subtext: "传统大姓"
  },
  {
    name: "葛",
    fullName: "葛 [葛]",
    pinyin: "ge",
    charBadge: "葛",
    key: "G",
    desc: "顿丘名门，医学名医。葛氏以葛洪（抱朴子）最为著名，擅长长生医药之术。其谱传多含有独家养生规训及名山考寻图鉴。",
    volCount: "8 册",
    revisionTime: "2002年修谱",
    population: "约140万人",
    subtext: "百家姓氏"
  },
  {
    name: "奚",
    fullName: "奚 [奚]",
    pinyin: "xi",
    charBadge: "奚",
    key: "X",
    desc: "谯国名门，百工始祖。奚氏源自任姓，夏车正奚仲之后，多精巧名匠。家谱记录甚多有关古代造车、造楼、规划之百工技术图解。",
    volCount: "6 册",
    revisionTime: "2000年重修",
    population: "约30万人",
    subtext: "百家姓氏"
  },
  {
    name: "范",
    fullName: "范 [范]",
    pinyin: "fan",
    charBadge: "范",
    key: "F",
    desc: "高平世家，先忧后乐。范氏以范仲淹（文正公）为主轴，其义庄、义田之管理制度与范氏家规十条广为传诵，世称高平范氏。",
    volCount: "13 册",
    revisionTime: "2004年续修",
    population: "约460万人",
    subtext: "传统大姓"
  },
  {
    name: "彭",
    fullName: "彭 [彭]",
    pinyin: "peng",
    charBadge: "彭",
    key: "P",
    desc: "淮阳望族，长寿世家。彭氏以彭祖（籛铿）为始祖。崇尚养生、安贫乐道、敬老尊贤，家乘以大红笺色、宣纸折本最为经典。",
    volCount: "11 册",
    revisionTime: "2001年修",
    population: "约730万人",
    subtext: "传统大姓"
  },
  {
    name: "郎",
    fullName: "郎 [郎]",
    pinyin: "lang",
    charBadge: "郎",
    key: "L",
    desc: "中大夫堂，清誉远播。郎氏源自姬姓，鲁懿公之子费伯筑郎城之后。其家族成员历代为官清正，家乘文字隽永、不阿权贵。",
    volCount: "5 册",
    revisionTime: "2003年大修",
    population: "约40万人",
    subtext: "百家姓氏"
  },
  {
    name: "鲁",
    fullName: "鲁 [鲁]",
    pinyin: "lu",
    charBadge: "鲁",
    key: "L",
    desc: "扶风堂上，周公后代。鲁氏源自鲁国姬姓。家谱多含极其考究之周礼祭祀规程与鲁乐五音曲谱刻本，具有极其深刻的礼文化。",
    volCount: "8 册",
    revisionTime: "1999年续修",
    population: "约120万人",
    subtext: "百家姓氏"
  },
  {
    name: "韦",
    fullName: "韦 [韦]",
    pinyin: "wei",
    charBadge: "韦",
    key: "W",
    desc: "京兆世泽，文武双全。韦氏以关中京兆堂最著，唐代宰相家族，世家显贵。其家乘包含大量的唐代制诰复原影像与名相遗墨。",
    volCount: "12 册",
    revisionTime: "2005年大修",
    population: "约430万人",
    subtext: "传统大姓"
  },
  {
    name: "昌",
    fullName: "昌 [昌]",
    pinyin: "chang",
    charBadge: "昌",
    key: "C",
    desc: "汝南堂下，源自昌意。昌氏起源于黄帝之子昌意，世代有大功德于天下。虽族员分布极散，却秉承‘古烈高勋’家风不坠。",
    volCount: "4 册",
    revisionTime: "2002年重修",
    population: "约20万人",
    subtext: "百家姓氏"
  },
  {
    name: "马",
    fullName: "马 [马]",
    pinyin: "ma",
    charBadge: "马",
    key: "M",
    desc: "扶风世家，铜柱家声。马氏起源于赵国马服君赵奢，后裔以扶风为郡望。人丁繁衍极广，历代涌现伏波将军马援之浩大军威。",
    volCount: "15 册",
    revisionTime: "2001年重修",
    population: "约1800万人",
    subtext: "常见姓氏"
  },
  {
    name: "苗",
    fullName: "苗 [苗]",
    pinyin: "miao",
    charBadge: "苗",
    key: "M",
    desc: "东阳望族，楚风汉韵。苗氏源于芈姓，楚国大夫伯棼之后，后繁衍于西北及江南一隅。谱书考订极精，插图精良雅致。",
    volCount: "6 册",
    revisionTime: "2003年修",
    population: "约110万人",
    subtext: "百家姓氏"
  },
  {
    name: "凤",
    fullName: "凤 [凤]",
    pinyin: "feng",
    charBadge: "凤",
    key: "F",
    desc: "平阳望族，吉祥承福。凤氏起源极古，以古帝神鸟图腾为氏。族规温文典雅，自封‘神瑞之家’，祈求世代吉祥富贵。",
    volCount: "4 册",
    revisionTime: "1998年续修",
    population: "约10万人",
    subtext: "百家姓氏"
  },
  {
    name: "花",
    fullName: "花 [花]",
    pinyin: "hua",
    charBadge: "花",
    key: "H",
    desc: "东平望族，英勇巾帼。花氏以木兰代父从军最为家喻户晓，英勇忠贞之气势宏大。其家史往往重忠、勇，宗祠武风长存。",
    volCount: "5 册",
    revisionTime: "2006年续修",
    population: "约40万人",
    subtext: "百家姓氏"
  },
  {
    name: "方",
    fullName: "方 [方]",
    pinyin: "fang",
    charBadge: "方",
    key: "F",
    desc: "河南堂前，正气长存。方氏起源于神农氏姜雷，以方回为始祖。江南大族，宗谱往往含有丰富的理学教案、徽雕建筑考证图示。",
    volCount: "12 册",
    revisionTime: "2004年大修",
    population: "约430万人",
    subtext: "传统大姓"
  },
  {
    name: "俞",
    fullName: "俞 [俞]",
    pinyin: "yu",
    charBadge: "俞",
    key: "Y",
    desc: "河东世泽，医道流芳。俞氏起源于黄帝神医俞跗。历代多名医高士、鸿儒大才，苏浙一带有极其繁多的藏书楼家藏谱书。",
    volCount: "9 册",
    revisionTime: "2002年重修",
    population: "约280万人",
    subtext: "传统大姓"
  },
  {
    name: "任",
    fullName: "任 [任]",
    pinyin: "ren",
    charBadge: "任",
    key: "R",
    desc: "东安名门，先秦之风。任氏起源极其古老，为黄帝十二姓之一。家史秉承信誉无双、大德不仕、修身立德之儒家极境。",
    volCount: "10 册",
    revisionTime: "2001年重修",
    population: "约530万人",
    subtext: "传统大姓"
  },
  {
    name: "袁",
    fullName: "袁 [袁]",
    pinyin: "yuan",
    charBadge: "袁",
    key: "Y",
    desc: "陈郡望族，四世三公。袁氏起源于妫姓，世家显赫。陈郡袁氏名望至高，其家乘中常含晋代门阀、南朝制命、清代考证等宏篇大疏。",
    volCount: "11 册",
    revisionTime: "2005年后续",
    population: "约700万人",
    subtext: "传统大姓"
  },
  {
    name: "柳",
    fullName: "柳 [柳]",
    pinyin: "liu",
    charBadge: "柳",
    key: "L",
    desc: "河东世泽，和风细柳。柳氏以柳宗元、柳公权最为天下知名。族谱书法极度考究，常用手绘柳公骨法楷书录写世系谱图。",
    volCount: "8 册",
    revisionTime: "2003年修",
    population: "约1400万人",
    subtext: "传统大姓"
  },
  {
    name: "唐",
    fullName: "唐 [唐]",
    pinyin: "tang",
    charBadge: "唐",
    key: "T",
    desc: "晋阳世泽，桐叶封弟。唐氏源自陶唐氏，尧祖之后，其重教兴农之本章深刻持久。家乘谱系以大同、大和之世界文明图最称绝妙。",
    volCount: "12 册",
    revisionTime: "2002年续修",
    population: "约910万人",
    subtext: "传统大姓"
  },
  {
    name: "薛",
    fullName: "薛 [薛]",
    pinyin: "xue",
    charBadge: "薛",
    key: "X",
    desc: "三白堂上，河东名家。薛氏起源于任姓，古法深奥。其谱牒常重纪律，定有‘族规十戒’与大中至正一脉。版刻优良。",
    volCount: "9 册",
    revisionTime: "1999年重修",
    population: "约500万人",
    subtext: "传统大姓"
  },
  {
    name: "雷",
    fullName: "雷 [雷]",
    pinyin: "lei",
    charBadge: "雷",
    key: "L",
    desc: "豫章世家，丰功伟业。雷氏源自黄帝重臣雷公，以豫章堂最为显达。自古以来忠臣孝子众多，族规崇尚行善立业、造福一方。",
    volCount: "8 册",
    revisionTime: "2005年修谱",
    population: "约350万人",
    subtext: "传统大姓"
  },
  {
    name: "贺",
    fullName: "贺 [贺]",
    pinyin: "he",
    charBadge: "贺",
    key: "H",
    desc: "会稽望族，四明狂客。贺氏源于庆氏避讳，以唐代贺知章名扬天下。贺公风骨洒脱、寄情山水。其家规倡导子孙淡泊名利。",
    volCount: "7 册",
    revisionTime: "2002年续修",
    population: "约280万人",
    subtext: "传统大姓"
  },
  {
    name: "罗",
    fullName: "罗 [罗]",
    pinyin: "luo",
    charBadge: "罗",
    key: "L",
    desc: "豫章世泽，匡扶社稷。罗氏起源于大罗氏，南方罗氏繁衍极盛。族谱世系详明，常存世居南迁之路书考据，极具地方志史料价值。",
    volCount: "14 册",
    revisionTime: "2001年大修",
    population: "约1340万人",
    subtext: "常见姓氏"
  },
  {
    name: "毕",
    fullName: "毕 [毕]",
    pinyin: "bi",
    charBadge: "毕",
    key: "B",
    desc: "河南望族，科技之光。毕氏起源于姬姓，以北宋毕昇发明活字印刷术公推于世。其家史重发明创造、技艺守成，思想高超独立。",
    volCount: "6 册",
    revisionTime: "2004年修谱",
    population: "约110万人",
    subtext: "传统大姓"
  },
  {
    name: "郝",
    fullName: "郝 [郝]",
    pinyin: "hao",
    charBadge: "郝",
    key: "H",
    desc: "太原望族，行善积德。郝氏起源于子姓，帝乙封于郝。治家以严、待人以宽为主因，谱牒刊印风格素雅古朴，名气广播。",
    volCount: "8 册",
    revisionTime: "2002年大修",
    population: "约340万人",
    subtext: "传统大姓"
  },
  {
    name: "邬",
    fullName: "邬 [邬]",
    pinyin: "wu",
    charBadge: "邬",
    key: "W",
    desc: "太原堂上，古晋贤者。邬氏源自姬姓晋大夫之后。江南邬氏族员虽少，皆守行端正、世代书香。其谱书刻画精细、极利辨识。",
    volCount: "5 册",
    revisionTime: "2003年重修",
    population: "约80万人",
    subtext: "百家姓氏"
  },
  {
    name: "顾",
    fullName: "顾 [顾]",
    pinyin: "gu",
    charBadge: "顾",
    key: "G",
    desc: "会稽名门，江左大族。顾氏为江南四大名门之冠，以顾恺之、顾炎武最为耀眼。门第高深，族谱中收藏之文书字画印章极显珍贵。",
    volCount: "12 册",
    revisionTime: "2005年续修",
    population: "约280万人",
    subtext: "传统大姓"
  },
  {
    name: "孟",
    fullName: "孟 [孟]",
    pinyin: "meng",
    charBadge: "孟",
    key: "M",
    desc: "亚圣门第，母仪天下。孟氏以孟子为始祖，孟母三迁家喻户晓。其自古家风修齐，治国安邦，大宗分支遍及山东各地、华北江南。",
    volCount: "16 册",
    revisionTime: "2008年大修",
    population: "约380万人",
    subtext: "圣裔名门"
  },
  {
    name: "黄",
    fullName: "黄 [黄]",
    pinyin: "huang",
    charBadge: "黄",
    key: "H",
    desc: "江夏世泽，宽厚传家。黄氏起源于嬴姓。以江夏黄氏最著名，名贯楚天。明清时代南方大举涉海谋生，多留南洋开拓图考。",
    volCount: "18 册",
    revisionTime: "2000年重修",
    population: "约3300万人",
    subtext: "常见姓氏"
  },
  {
    name: "萧",
    fullName: "萧 [萧]",
    pinyin: "xiao",
    charBadge: "萧",
    key: "X",
    desc: "兰陵名门，规随家风。萧氏以西汉萧何、南朝齐梁两代皇室为傲，代有名相大师。兰陵一脉之世家宗谱被视为华夏宗谱典范。",
    volCount: "14 册",
    revisionTime: "2004年重修",
    population: "约960万人",
    subtext: "常见姓氏"
  },
  {
    name: "姚",
    fullName: "姚 [姚]",
    pinyin: "yao",
    charBadge: "姚",
    key: "Y",
    desc: "历山世泽，虞舜后裔。姚氏起源于虞舜大帝。古朴高雅、世守祖茔。门风以儒雅著称，江浙世居分支谱系完整，行止端庄。",
    volCount: "10 册",
    revisionTime: "2002年续修",
    population: "约420万人",
    subtext: "传统大姓"
  },
  {
    name: "梁",
    fullName: "梁 [梁]",
    pinyin: "liang",
    charBadge: "梁",
    key: "L",
    desc: "安定堂前，文经武纬。梁氏起源于嬴姓。安定梁氏在历史上极度隆厚，代出名将武勋，其谱牒重信爱。图阵画卷极其宏伟。",
    volCount: "13 册",
    revisionTime: "2001年续修",
    population: "约1100万人",
    subtext: "常见姓氏"
  },
  {
    name: "杜",
    fullName: "杜 [杜]",
    pinyin: "du",
    charBadge: "杜",
    key: "D",
    desc: "京兆望族，诗圣高风。杜氏起源于祁姓。以诗圣杜甫、大儒杜预最受后世尊尚。儒雅传家，世系繁厚，治谱具有古典格调。",
    volCount: "11 册",
    revisionTime: "2003年新修",
    population: "约520万人",
    subtext: "传统大姓"
  },
  {
    name: "阮",
    fullName: "阮 [阮]",
    pinyin: "ruan",
    charBadge: "阮",
    key: "R",
    desc: "陈留望族，竹林啸声。阮氏起源于商代阮国。魏晋著名才子竹林七贤阮籍后裔，家风高雅离尘、诗酒名重，多有玄学手书录。",
    volCount: "6 册",
    revisionTime: "2002年重修",
    population: "约120万人",
    subtext: "百家姓氏"
  },
  {
    name: "蓝",
    fullName: "蓝 [蓝]",
    pinyin: "lan",
    charBadge: "蓝",
    key: "L",
    desc: "汝南堂前，山林瑞祥。蓝氏多见于江闽、粤桂客家地带，秉持勤俭自立、忠勇拼搏规祖。谱乘常记有源于汉代之精美图语。",
    volCount: "7 册",
    revisionTime: "2004年大修",
    population: "约130万人",
    subtext: "客家名门"
  },
  {
    name: "季",
    fullName: "季 [季]",
    pinyin: "ji",
    charBadge: "季",
    key: "J",
    desc: "渤海名望，季路一言。季氏起源极古，以守信重诺闻名天下（黄金百斤、不如季路一诺）。苏皖一代季氏宗谱修撰风格规整。",
    volCount: "8 册",
    revisionTime: "2002年大修",
    population: "约150万人",
    subtext: "传统大姓"
  },
  {
    name: "古籍",
    fullName: "古籍 [古籍/典藏]",
    pinyin: "guji",
    charBadge: "博",
    key: "G",
    desc: "馆藏历代地方文献与珍稀善本，非特定单姓家谱，涵括《三字经》、《百家姓》、《千字文》以及明清刻本工艺等，具有极高研究价值。",
    volCount: "48 册",
    revisionTime: "明清刻本",
    population: "典藏秘籍",
    subtext: "2 种"
  },
  {
    name: "村志",
    fullName: "村志 [地方史志]",
    pinyin: "cunzhi",
    charBadge: "志",
    key: "C",
    desc: "记载一村一落之历史变迁、风土人情、宗族分布、自然地理与生息状况之珍贵地方史志文献，具有极高的人文学术与寻根价值。",
    volCount: "16 册",
    revisionTime: "现代新修",
    population: "地方文献",
    subtext: "2 种"
  }
];

export const BOOKS: Book[] = [
  {
    id: "lc-chen-2003",
    surname: "陈",
    title: "龙川陈氏宗谱",
    revision: "2003年重修版",
    volumes: "全 12 册",
    location: "龙川",
    compiler: "陈德兴",
    time: "公元2003年 (岁次癸未)",
    format: "线装 (Thread-bound)",
    library: "义乌市图书馆 地方文献室",
    serialNo: "YW-GEN-C-2003-12",
    abstract: "本谱叙述了龙川陈氏自唐宋以来的繁衍迁徙历史。内容包含：源流考、世系图、家训家规、历代贤达传略以及明清时期的各类敕命复印件。此次2003年重修，在清光绪版基础上进行了大量的勘误与增补，重点收录了近代以来流向海外及各省市的族人分支信息。全书纸张考究，采用手工宣纸印制，具有极高的文献研究与宗族传承价值。",
    pages: [
      "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=600"
    ]
  },
  {
    id: "jw-chen-1998",
    surname: "陈",
    title: "江湾陈氏家谱",
    revision: "1998年续修版",
    volumes: "全 5 册",
    location: "义乌江湾",
    compiler: "陈荣华",
    time: "公元1998年 (岁次戊寅)",
    format: "线装 (Thread-bound)",
    library: "义乌市档案馆",
    serialNo: "YW-GEN-C-1998-05",
    abstract: "江湾陈氏系出颍川，自元末明初因避战乱迁至义乌江湾村。本谱重新修撰详载了江湾祖基、宗祠、支系分布，记录了清同治年间的祠堂重建及义乌近代著名工匠、乡贤的事迹，是研究浙东乡村社会变迁的珍贵纸质史料。",
    pages: [
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=600"
    ]
  },
  {
    id: "yc-chen-1999",
    surname: "陈",
    title: "颖川郡陈氏族谱",
    revision: "1999年续修版",
    volumes: "全 6 册",
    location: "颖川",
    compiler: "陈万松",
    time: "公元1999年 (岁次己卯)",
    format: "线装 (Thread-bound)",
    library: "义乌山村文化站",
    serialNo: "YW-GEN-C-1999-06",
    abstract: "颍川郡陈氏多出南宋，明清两代人才辈出，其谱牒保存最为完备，涉及二十余个自然村落。本谱全面记载了颍川郡大宗世系，重点厘清了明代嘉靖年间分派迁徙的流派走向，录有先人画像十二幅，流传有序。",
    pages: [
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=600"
    ]
  },
  {
    id: "dy-chen-2008",
    surname: "陈",
    title: "东阳义门陈氏",
    revision: "2008年重修版",
    volumes: "全 10 册",
    location: "东阳",
    compiler: "陈自立",
    time: "公元2008年 (岁次戊子)",
    format: "合订精装 (Hardcase-bound)",
    library: "东阳市博物馆",
    serialNo: "DY-GEN-C-2008-10",
    abstract: "本谱详实梳理了号称‘江南第一家’的东阳义门陈氏之分迁历史。全卷以严苛的家规家训著称，收录了著名的《义门陈氏家规百余条》，对现代家族管理与良好家风建设有深远的借鉴 and 教育意义。",
    pages: [
      "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=600"
    ]
  },
  {
    id: "sx-zhang-1999",
    surname: "张",
    title: "张氏世谱",
    revision: "1999年重修版",
    volumes: "全 8 册",
    location: "苏溪",
    compiler: "张敬轩",
    time: "公元1999年 (岁次己卯)",
    format: "线装 (Thread-bound)",
    library: "义乌市图书馆",
    serialNo: "YW-GEN-Z-1999-08",
    abstract: "清河百忍，厚德载物。苏溪张氏自明代中叶入塞入迁，开枝散叶。本谱详尽记载了苏溪张氏自一世祖以来的全部分支世系，重点收录了清代中后期张氏巨商行商沪上的事迹与契约文书，具有极高的地方志价值。",
    pages: [
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=600"
    ]
  },
  {
    id: "es-zhang-2005",
    surname: "张",
    title: "张氏忠孝堂家乘",
    revision: "2005年重修版",
    volumes: "全 14 册",
    location: "廿三里",
    compiler: "张培林",
    time: "公元2005年 (岁次乙酉)",
    format: "线装 (Thread-bound)",
    library: "张氏宗祠",
    serialNo: "YW-GEN-Z-2005-14",
    abstract: "本谱遵循‘忠孝传家’之宗旨，收录了数百年来的先贤功德录、精美的廿三里张氏祠堂图解、考究之祭祀礼仪。此次重修特别补录了辛亥革命以来流寓海外及各省市的同胞之详细族籍，脉络分明。",
    pages: [
      "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=600"
    ]
  },
  {
    id: "qc-zhao-2001",
    surname: "赵",
    title: "赵氏琴川族谱",
    revision: "2001年续修版",
    volumes: "全 14 册",
    location: "琴川",
    compiler: "赵国祥",
    time: "公元2001年 (岁次辛巳)",
    format: "线装 (Thread-bound)",
    library: "常熟图书馆分馆",
    serialNo: "CS-GEN-Z-2001-14",
    abstract: "琴川赵氏多为宋室南渡后之遗臣、皇戚后裔。本谱不仅高等级载列宋皇室大宗系，更保存了大量明清两代江南文人的序言、题词、祭文及宋廷遗墨之画影复刻，具有绝佳之文史和书法研究价值。",
    pages: [
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=600"
    ]
  },
  {
    id: "yw-zhao-2010",
    surname: "赵",
    title: "赵氏宗谱",
    revision: "2010年重修版",
    volumes: "全 10 册",
    location: "义乌赵宅",
    compiler: "赵建国",
    time: "公元2010年 (岁次庚寅)",
    format: "宣纸线装 (Rice Paper Bound)",
    library: "义乌档案馆",
    serialNo: "YW-GEN-Z-2010-10",
    abstract: "义乌赵宅赵氏族人世代聚居，贤良辈出。本谱完好保存了康熙、乾嘉及光绪历次大修的书序凡例。全谱通过详尽的迁徙地图，生动再现了赵氏族人在东南沿海的发展轨迹及忠义之家风流传。",
    pages: [
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=600"
    ]
  },
  {
    id: "xh-guji-001",
    surname: "古籍",
    title: "宣和博古图",
    revision: "仿宋木刻雕版重印本",
    volumes: "全 16 册",
    location: "古籍馆珍藏部",
    compiler: "王黼 等 (宋)",
    time: "宋宣和初年 (原纂)",
    format: "宣纸金色绢面线装",
    library: "古籍珍藏阁",
    serialNo: "GJ-XHBG-001",
    abstract: "《宣和博古图》三十卷，由宋代王黼、徽宗朝群臣奉敕纂修。该书著录了宋代皇室所藏商代至唐代的精美青铜器数千件。全书图形逼真，注解极其详尽，是研究古代礼乐器制度、文字、金石学以及宋代仿照高古工艺的大型绝美参考书。",
    pages: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600"
    ]
  },
  {
    id: "ts-guji-002",
    surname: "古籍",
    title: "钦定古今图书集成",
    revision: "雍正活字铜板仿影本",
    volumes: "精选 32 册",
    location: "国家级珍品特藏",
    compiler: "陈梦雷 / 蒋廷锡 (清)",
    time: "清雍正四年修成",
    format: "蓝绢面宣纸线装",
    library: "省图书馆特藏部",
    serialNo: "GJ-TSJC-108",
    abstract: "《古今图书集成》为我国现存规模最大、体例最完善、被誉为‘康熙百科全书’的巨大典籍类书。该馆藏珍藏了该巨著关于‘家谱世系考’及‘氏族迁徙考’相关的核心三十二册精校卷，系统编纂了中古至近古百家大姓源流。",
    pages: [
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=600"
    ]
  },
  {
    id: "cz-yantou-2012",
    surname: "村志",
    title: "岩头古村落历史志",
    revision: "2012年重修版",
    volumes: "全 8 册",
    location: "岩头村",
    compiler: "陈山泉",
    time: "公元2012年",
    format: "宣纸蓝面线装",
    library: "岩头村文史馆",
    serialNo: "CZ-YT-2012-08",
    abstract: "岩头村为浙东千年文化古村，本志书系统记录了岩头村自唐宋建村以来的地理风貌、乡绅名流、特色农桑工艺以及历代宗族的分迁生息，是极具研究价值的微观乡土历史。",
    pages: [
      "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=600"
    ]
  },
  {
    id: "cz-huanshan-2015",
    surname: "村志",
    title: "环山村落历史文化志",
    revision: "2015年新修版",
    volumes: "全 8 册",
    location: "环山",
    compiler: "张环林",
    time: "公元2015年",
    format: "合订精装影印",
    library: "地方文史书斋",
    serialNo: "CZ-HS-2015-08",
    abstract: "环山村地处群山怀抱，本志详尽考证了该村特色徽派建筑群之由来、百年私塾文脉之传承、及近代辛亥前后进步志士的事迹。图文并茂，具有强烈的地方特色。",
    pages: [
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=600"
    ]
  }
];
