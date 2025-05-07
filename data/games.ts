import type { Game } from "../types/game"

// 随机获取图片的函数
const getRandomImage = (index: number) => {
  const images = [
    "https://cdn.akamai.steamstatic.com/steam/apps/1172470/header.jpg",
    "https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg",
    "https://cdn.akamai.steamstatic.com/steam/apps/578080/header.jpg",
    "https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg",
    "https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg",
    "https://cdn.akamai.steamstatic.com/steam/apps/1517290/header.jpg",
    "https://cdn.akamai.steamstatic.com/steam/apps/582010/header.jpg",
    "https://cdn.akamai.steamstatic.com/steam/apps/814380/header.jpg",
    "https://cdn.akamai.steamstatic.com/steam/apps/601150/header.jpg",
    "https://cdn.akamai.steamstatic.com/steam/apps/1174180/header.jpg",
    "https://cdn.akamai.steamstatic.com/steam/apps/1551360/header.jpg",
    "https://cdn.akamai.steamstatic.com/steam/apps/990080/header.jpg",
    "https://cdn.akamai.steamstatic.com/steam/apps/1817070/header.jpg",
    "https://cdn.akamai.steamstatic.com/steam/apps/1593500/header.jpg",
    "https://cdn.akamai.steamstatic.com/steam/apps/2050650/header.jpg",
    "https://cdn.akamai.steamstatic.com/steam/apps/1172620/header.jpg",
    "https://cdn.akamai.steamstatic.com/steam/apps/1938090/header.jpg",
    "https://cdn.akamai.steamstatic.com/steam/apps/1716740/header.jpg",
  ]
  return images[index % images.length]
}

// 游戏视频
const gameVideos = [
  "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt778f65cedfee54fd/63bcad5b08dfb21202a7794d/VAL_EP_6_1_TRAILER_16x9_27s.mp4",
  "https://cdn.akamai.steamstatic.com/steam/apps/256919876/movie480_vp9.webm",
  "https://cdn.akamai.steamstatic.com/steam/apps/256705156/movie480.webm",
  "https://cdn.akamai.steamstatic.com/steam/apps/256658589/movie480.webm",
  "https://cdn.akamai.steamstatic.com/steam/apps/256801252/movie480_vp9.webm",
  "https://cdn.akamai.steamstatic.com/steam/apps/256820713/movie480_vp9.webm",
  "https://cdn.akamai.steamstatic.com/steam/apps/256743972/movie480.webm",
  "https://cdn.akamai.steamstatic.com/steam/apps/256814567/movie480_vp9.webm",
  "https://cdn.akamai.steamstatic.com/steam/apps/256757119/movie480.webm",
]

// 游戏图标
const gameIcons = [
  "https://cdn.akamai.steamstatic.com/steam/apps/1172470/capsule_231x87.jpg",
  "https://cdn.akamai.steamstatic.com/steam/apps/1091500/capsule_231x87.jpg",
  "https://cdn.akamai.steamstatic.com/steam/apps/578080/capsule_231x87.jpg",
  "https://cdn.akamai.steamstatic.com/steam/apps/730/capsule_231x87.jpg",
  "https://cdn.akamai.steamstatic.com/steam/apps/1245620/capsule_231x87.jpg",
  "https://cdn.akamai.steamstatic.com/steam/apps/1517290/capsule_231x87.jpg",
  "https://cdn.akamai.steamstatic.com/steam/apps/582010/capsule_231x87.jpg",
  "https://cdn.akamai.steamstatic.com/steam/apps/814380/capsule_231x87.jpg",
  "https://cdn.akamai.steamstatic.com/steam/apps/601150/capsule_231x87.jpg",
]

// 游戏截图
const gameScreenshots = [
  [
    "https://cdn.akamai.steamstatic.com/steam/apps/1172470/ss_8b58b1c3b055e34d013d2b44d3d5ab72c3d35a97.jpg",
    "https://cdn.akamai.steamstatic.com/steam/apps/1172470/ss_c142f4069fd7cadf9c4d6be4b03564c7bf9781a9.jpg",
    "https://cdn.akamai.steamstatic.com/steam/apps/1172470/ss_c5c5f826d886d0f54eed1c50d1d0e4ca4f0c1051.jpg",
    "https://cdn.akamai.steamstatic.com/steam/apps/1172470/ss_d09106060fb7de9008b97c3c0424cd2f3b5dd7d0.jpg",
  ],
  [
    "https://cdn.akamai.steamstatic.com/steam/apps/1091500/ss_9868ee40f39749a4c8222701c3b4507012a0b4ec.jpg",
    "https://cdn.akamai.steamstatic.com/steam/apps/1091500/ss_c5b19aad9b8d6d0caa95ce1d9b1167a0e6c1cc3f.jpg",
    "https://cdn.akamai.steamstatic.com/steam/apps/1091500/ss_d09ef8b3c0d561a7bcc9ab173a6f6b5845456b3a.jpg",
    "https://cdn.akamai.steamstatic.com/steam/apps/1091500/ss_f7ebc9ba5d2f0911c33425d2a45fef0a3e539557.jpg",
  ],
  [
    "https://cdn.akamai.steamstatic.com/steam/apps/578080/ss_6d9ef45b0aac1ebf8c6c6d1a63289fcdd1c0b0c0.jpg",
    "https://cdn.akamai.steamstatic.com/steam/apps/578080/ss_2be9153a2633e671c283e2dbcca7fa54c7cee5c0.jpg",
    "https://cdn.akamai.steamstatic.com/steam/apps/578080/ss_0ab772d0dfc7a5a84f58861a193c2c61e9d5a305.jpg",
    "https://cdn.akamai.steamstatic.com/steam/apps/578080/ss_cd83d21b82e4c4e9a6c8b9a3a6c2a5d4c3c6b6a5.jpg",
  ],
]

// 游戏数据
export const allGames: Game[] = [
  {
    id: 1,
    title: "无畏契约",
    description: "《无畏契约》是一款5v5角色战术射击游戏，每个角色都有独特的能力，精准的枪法是取胜的关键。",
    longDescription:
      '《无畏契约》是一款由Riot Games开发的免费多人第一人称射击游戏。游戏设定在不久的将来的地球，玩家将扮演来自世界各地的特工，每个特工都有独特的能力和技能。游戏的主要模式是5v5的团队对抗，一方需要放置炸弹（称为"尖峰"），而另一方则需要阻止他们或拆除已放置的炸弹。游戏结合了《反恐精英》的战术射击元素和《守望先锋》的英雄能力，创造了独特的游戏体验。精准的枪法和战术思维是成功的关键，而特工的能力则可以提供额外的战术选择。',
    imageUrl: getRandomImage(0),
    videoUrl: gameVideos[0],
    iconUrl: gameIcons[0],
    rating: 4.8,
    platform: "PC",
    categories: ["射击", "战术", "多人在线", "竞技"],
    trendingScore: 95,
    downloadUrl: "https://playvalorant.com/",
    screenshots: gameScreenshots[0],
    requirements: {
      minimum: {
        os: "Windows 7/8/10 (64位)",
        processor: "Intel Core 2 Duo E8400",
        memory: "4 GB RAM",
        graphics: "Intel HD 4000",
        storage: "20 GB可用空间",
      },
      recommended: {
        os: "Windows 10 (64位)",
        processor: "Intel Core i3-4150",
        memory: "8 GB RAM",
        graphics: "NVIDIA GeForce GT 730",
        storage: "20 GB可用空间",
      },
    },
  },
  {
    id: 2,
    title: "赛博朋克2077",
    description: "《赛博朋克2077》是一款开放世界动作冒险RPG游戏，设定在夜之城，一个充满暴力和科技的未来都市。",
    longDescription:
      "《赛博朋克2077》是由CD Projekt Red开发的一款开放世界动作冒险角色扮演游戏。游戏设定在2077年的夜之城，一个由六大区域组成的巨型都市，充满了先进科技、犯罪和社会不平等。玩家将扮演V，一名雇佣兵，追求一种独特的植入物，这种植入物是获得永生的关键。游戏提供了丰富的角色定制选项，包括性格背景、外观、能力和技能。玩家可以通过不同的方式完成任务，包括非暴力的黑客方式、直接的战斗方式或社交互动。游戏世界充满了各种活动、任务和发现，提供了数百小时的游戏体验。",
    imageUrl: getRandomImage(1),
    videoUrl: gameVideos[1],
    iconUrl: gameIcons[1],
    rating: 4.5,
    platform: "PC/PS5/Xbox",
    categories: ["角色扮演", "开放世界", "动作", "冒险"],
    trendingScore: 88,
    downloadUrl: "https://www.cyberpunk.net/",
    screenshots: gameScreenshots[1],
    requirements: {
      minimum: {
        os: "Windows 10 (64位)",
        processor: "Intel Core i5-3570K或AMD FX-8310",
        memory: "8 GB RAM",
        graphics: "NVIDIA GeForce GTX 780或AMD Radeon RX 470",
        storage: "70 GB可用空间",
      },
      recommended: {
        os: "Windows 10 (64位)",
        processor: "Intel Core i7-4790或AMD Ryzen 3 3200G",
        memory: "12 GB RAM",
        graphics: "NVIDIA GeForce GTX 1060或AMD Radeon R9 Fury",
        storage: "70 GB可用空间 SSD",
      },
    },
  },
  {
    id: 3,
    title: "绝地求生",
    description: "《绝地求生》是一款大逃杀类游戏，100名玩家在一个不断缩小的地图上战斗，直到最后一人或一队存活。",
    longDescription:
      "《绝地求生》（PUBG）是由PUBG公司开发的一款大逃杀类游戏。游戏开始时，最多100名玩家跳伞降落到一个岛屿上，搜集武器和装备，并在一个不断缩小的区域内战斗，直到只剩下一名玩家或一支队伍。游戏提供了多种模式，包括单人、双人和四人小队模式，以及各种限时活动模式。玩家需要管理自己的装备、弹药和医疗用品，同时应对敌人和不断缩小的安全区。游戏强调战术思维、定位感和射击技巧，提供了紧张刺激的游戏体验。",
    imageUrl: getRandomImage(2),
    videoUrl: gameVideos[2],
    iconUrl: gameIcons[2],
    rating: 4.2,
    platform: "PC/Mobile",
    categories: ["射击", "大逃杀", "多人在线", "战术"],
    trendingScore: 82,
    downloadUrl: "https://www.pubg.com/",
    screenshots: gameScreenshots[2],
    requirements: {
      minimum: {
        os: "Windows 7/8/10 (64位)",
        processor: "Intel Core i5-4430或AMD FX-6300",
        memory: "8 GB RAM",
        graphics: "NVIDIA GeForce GTX 960或AMD Radeon R7 370",
        storage: "30 GB可用空间",
      },
      recommended: {
        os: "Windows 10 (64位)",
        processor: "Intel Core i5-6600K或AMD Ryzen 5 1600",
        memory: "16 GB RAM",
        graphics: "NVIDIA GeForce GTX 1060或AMD Radeon RX 580",
        storage: "30 GB可用空间 SSD",
      },
    },
  },
  {
    id: 4,
    title: "CS:GO",
    description: "《CS:GO》是一款经典的5v5战术射击游戏，分为恐怖分子和反恐精英两队，以完成目标或消灭对方为胜利条件。",
    longDescription:
      "《反恐精英：全球攻势》（CS:GO）是由Valve开发的一款多人第一人称射击游戏，是《反恐精英》系列的第四部作品。游戏保持了系列一贯的5v5团队对抗模式，玩家分为恐怖分子和反恐精英两队，在多种地图上进行对抗。游戏模式包括爆破模式、军备竞赛、死亡竞赛等。在最受欢迎的爆破模式中，恐怖分子需要放置炸弹或消灭所有反恐精英，而反恐精英则需要阻止炸弹放置、拆除已放置的炸弹或消灭所有恐怖分子。游戏强调团队合作、战术执行和精准射击，是电子竞技的重要项目之一。",
    imageUrl: getRandomImage(3),
    videoUrl: gameVideos[3],
    iconUrl: gameIcons[3],
    rating: 4.7,
    platform: "PC",
    categories: ["射击", "战术", "多人在线", "竞技"],
    trendingScore: 90,
    downloadUrl: "https://store.steampowered.com/app/730/CounterStrike_Global_Offensive/",
    screenshots: gameScreenshots[0],
    requirements: {
      minimum: {
        os: "Windows 7/Vista/XP",
        processor: "Intel Core 2 Duo E6600或AMD Phenom X3 8750",
        memory: "2 GB RAM",
        graphics: "DirectX 9兼容显卡，256MB显存",
        storage: "15 GB可用空间",
      },
      recommended: {
        os: "Windows 7/Vista/XP",
        processor: "Intel Core 2 Duo E8400或AMD Phenom II X3 705",
        memory: "4 GB RAM",
        graphics: "DirectX 9兼容显卡，1GB显存",
        storage: "15 GB可用空间",
      },
    },
  },
  {
    id: 5,
    title: "艾尔登法环",
    description:
      "《艾尔登法环》是一款开放世界动作角色扮演游戏，由宫崎英高和乔治·R·R·马丁合作创作，提供了广阔的世界和挑战性的战斗。",
    longDescription:
      '《艾尔登法环》是由FromSoftware开发的一款开放世界动作角色扮演游戏，由《黑暗之魂》系列的创作者宫崎英高和《权力的游戏》作者乔治·R·R·马丁合作创作。游戏设定在一个名为"交界地"的奇幻世界，玩家扮演一名"褪色者"，目标是收集所有的艾尔登法环碎片，成为新的艾尔登之王。游戏结合了FromSoftware标志性的挑战性战斗和复杂的世界设计，同时引入了开放世界元素，允许玩家自由探索广阔的地图。游戏提供了多种武器、魔法和召唤物，以及丰富的角色定制选项，让玩家可以根据自己的喜好打造独特的游戏体验。',
    imageUrl: getRandomImage(4),
    videoUrl: gameVideos[4],
    iconUrl: gameIcons[4],
    rating: 4.9,
    platform: "PC/PS5/Xbox",
    categories: ["角色扮演", "开放世界", "动作", "黑暗奇幻"],
    trendingScore: 98,
    downloadUrl: "https://www.eldenring.com/",
    screenshots: gameScreenshots[1],
    requirements: {
      minimum: {
        os: "Windows 10 (64位)",
        processor: "Intel Core i5-8400或AMD Ryzen 3 3300X",
        memory: "12 GB RAM",
        graphics: "NVIDIA GeForce GTX 1060或AMD Radeon RX 580",
        storage: "60 GB可用空间",
      },
      recommended: {
        os: "Windows 10/11 (64位)",
        processor: "Intel Core i7-8700K或AMD Ryzen 5 3600X",
        memory: "16 GB RAM",
        graphics: "NVIDIA GeForce GTX 1070或AMD Radeon RX Vega 56",
        storage: "60 GB可用空间 SSD",
      },
    },
  },
  {
    id: 6,
    title: "死亡搁浅",
    description:
      "《死亡搁浅》是小岛秀夫的作品，玩家扮演一名快递员，在灾后的美国重新连接分散的社区，同时应对超自然威胁。",
    longDescription:
      '《死亡搁浅》是由小岛秀夫设计的一款动作冒险游戏。游戏设定在一个灾后的美国，一场名为"死亡搁浅"的神秘现象导致了超自然生物的出现和社会的崩溃。玩家扮演山姆·波特·布里吉斯，一名快递员，任务是将分散的人类聚居地重新连接起来，恢复美国的通信网络。游戏强调连接和合作的主题，玩家需要在危险的环境中运送货物，建立基础设施，并与其他玩家间接互动。游戏结合了开放世界探索、潜行、战斗和资源管理元素，提供了独特的游戏体验和深刻的故事情节。',
    imageUrl: getRandomImage(5),
    videoUrl: gameVideos[5],
    iconUrl: gameIcons[5],
    rating: 4.6,
    platform: "PC/PS5",
    categories: ["动作", "冒险", "开放世界", "科幻"],
    trendingScore: 85,
    downloadUrl: "https://www.kojimaproductions.jp/en/death-stranding",
    screenshots: gameScreenshots[2],
    requirements: {
      minimum: {
        os: "Windows 10 (64位)",
        processor: "Intel Core i5-3470或AMD Ryzen 3 1200",
        memory: "8 GB RAM",
        graphics: "NVIDIA GeForce GTX 1050或AMD Radeon RX 560",
        storage: "80 GB可用空间",
      },
      recommended: {
        os: "Windows 10 (64位)",
        processor: "Intel Core i7-3770或AMD Ryzen 5 1600",
        memory: "16 GB RAM",
        graphics: "NVIDIA GeForce GTX 1060或AMD Radeon RX 590",
        storage: "80 GB可用空间 SSD",
      },
    },
  },
  {
    id: 7,
    title: "怪物猎人世界",
    description: "《怪物猎人世界》是一款动作角色扮演游戏，玩家扮演猎人，追踪和狩猎各种巨大的怪物，收集材料制作装备。",
    longDescription:
      '《怪物猎人世界》是由卡普空开发的一款动作角色扮演游戏，是《怪物猎人》系列的第五部主要作品。游戏设定在一个被称为"新世界"的生态系统中，玩家扮演一名猎人，加入调查团探索这片未知的土地，追踪和狩猎各种巨大的怪物。游戏的核心玩法围绕着狩猎怪物、收集材料和制作装备的循环。玩家可以使用14种不同类型的武器，每种武器都有独特的战斗风格和技能。游戏支持单人和多人合作模式，最多可有四名玩家一起狩猎。游戏还提供了丰富的环境互动和生态系统，怪物之间会相互争斗，环境可以被用作战术优势。',
    imageUrl: getRandomImage(6),
    videoUrl: gameVideos[6],
    iconUrl: gameIcons[6],
    rating: 4.7,
    platform: "PC/PS4/Xbox",
    categories: ["动作", "角色扮演", "多人在线", "狩猎"],
    trendingScore: 87,
    downloadUrl: "https://www.monsterhunter.com/world/",
    screenshots: gameScreenshots[0],
    requirements: {
      minimum: {
        os: "Windows 7/8/8.1/10 (64位)",
        processor: "Intel Core i5-4460或AMD FX-6300",
        memory: "8 GB RAM",
        graphics: "NVIDIA GeForce GTX 760或AMD Radeon R7 260x",
        storage: "20 GB可用空间",
      },
      recommended: {
        os: "Windows 7/8/8.1/10 (64位)",
        processor: "Intel Core i7-3770或AMD Ryzen 5 1500X",
        memory: "8 GB RAM",
        graphics: "NVIDIA GeForce GTX 1060或AMD Radeon RX 570X",
        storage: "20 GB可用空间",
      },
    },
  },
  {
    id: 8,
    title: "只狼：影逝二度",
    description: '《只狼：影逝二度》是一款动作冒险游戏，玩家扮演忍者"狼"，在战国时代的日本拯救自己的主人并寻求复仇。',
    longDescription:
      '《只狼：影逝二度》是由FromSoftware开发的一款动作冒险游戏。游戏设定在16世纪末的战国时代日本，玩家扮演一名名为"狼"的忍者，他的任务是保护一位年轻的贵族，这位贵族是一个神秘血统的后裔。当这位贵族被敌对氏族绑架，狼失去了一只手臂后，他被一位神秘的雕刻师救起，获得了一个名为"义手"的假肢，开始了拯救主人并寻求复仇的旅程。游戏强调剑术对决和潜行元素，引入了"姿态"系统，玩家需要通过连续的攻击和格挡打破敌人的姿态，然后进行致命一击。游戏还包含了复活机制，允许玩家在死亡后立即复活，但会对游戏世界和NPC产生影响。',
    imageUrl: getRandomImage(7),
    videoUrl: gameVideos[7],
    iconUrl: gameIcons[7],
    rating: 4.8,
    platform: "PC/PS4/Xbox",
    categories: ["动作", "冒险", "忍者", "黑暗奇幻"],
    trendingScore: 92,
    downloadUrl: "https://www.sekirothegame.com/",
    screenshots: gameScreenshots[1],
    requirements: {
      minimum: {
        os: "Windows 7/8/10 (64位)",
        processor: "Intel Core i3-2100或AMD FX-6300",
        memory: "4 GB RAM",
        graphics: "NVIDIA GeForce GTX 760或AMD Radeon HD 7950",
        storage: "25 GB可用空间",
      },
      recommended: {
        os: "Windows 10 (64位)",
        processor: "Intel Core i5-2500K或AMD Ryzen 5 1400",
        memory: "8 GB RAM",
        graphics: "NVIDIA GeForce GTX 970或AMD Radeon RX 570",
        storage: "25 GB可用空间",
      },
    },
  },
  {
    id: 9,
    title: "鬼泣5",
    description: "《鬼泣5》是一款动作冒险游戏，玩家可以控制三位不同的角色，使用各种武器和能力与恶魔战斗。",
    longDescription:
      "《鬼泣5》是由卡普空开发的一款动作冒险游戏，是《鬼泣》系列的第五部主要作品。游戏设定在前作几年后，一个神秘人物在红墓市召唤了一棵巨大的恶魔树，引发了恶魔入侵。玩家可以控制三位不同的角色：但丁、尼禄和新角色V，每个角色都有独特的战斗风格和能力。游戏保持了系列标志性的快节奏战斗和连击系统，同时引入了新的游戏机制和武器。游戏强调风格化的战斗，鼓励玩家通过多样化的攻击和连击获得更高的评分。游戏还提供了丰富的角色定制选项，允许玩家根据自己的喜好调整战斗风格。",
    imageUrl: getRandomImage(8),
    videoUrl: gameVideos[8],
    iconUrl: gameIcons[8],
    rating: 4.6,
    platform: "PC/PS4/Xbox",
    categories: ["动作", "冒险", "黑暗奇幻", "连击"],
    trendingScore: 86,
    downloadUrl: "https://www.devilmaycry5.com/",
    screenshots: gameScreenshots[2],
    requirements: {
      minimum: {
        os: "Windows 7/8/10 (64位)",
        processor: "Intel Core i5-4460或AMD FX-6300",
        memory: "8 GB RAM",
        graphics: "NVIDIA GeForce GTX 760或AMD Radeon R7 260x",
        storage: "35 GB可用空间",
      },
      recommended: {
        os: "Windows 10 (64位)",
        processor: "Intel Core i7-3770或AMD FX-9590",
        memory: "16 GB RAM",
        graphics: "NVIDIA GeForce GTX 1060或AMD Radeon RX 480",
        storage: "35 GB可用空间",
      },
    },
  },
]

// 推荐游戏
export const featuredGames = [
  allGames[4], // 艾尔登法环
  allGames[1], // 赛博朋克2077
  allGames[5], // 死亡搁浅
  allGames[7], // 只狼：影逝二度
  allGames[0], // 无畏契约
]

// 新游预告
export const newReleases = [
  {
    ...allGames[2],
    releaseDate: "2023-12-15",
  },
  {
    ...allGames[6],
    releaseDate: "2023-11-30",
  },
  {
    ...allGames[8],
    releaseDate: "2024-01-20",
  },
  {
    ...allGames[3],
    releaseDate: "2023-12-05",
  },
]

// 游戏排行榜
export const topGames = [
  allGames[4], // 艾尔登法环
  allGames[0], // 无畏契约
  allGames[7], // 只狼：影逝二度
  allGames[3], // CS:GO
  allGames[6], // 怪物猎人世界
  allGames[1], // 赛博朋克2077
  allGames[8], // 鬼泣5
  allGames[5], // 死亡搁浅
  allGames[2], // 绝地求生
]
