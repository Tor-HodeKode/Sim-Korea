import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faBuilding,
  faTree,
  faSchool,
  faHospital,
  faRoad,
  faCar,
  faCity,
  faSeedling,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useCallback, useMemo, React } from "react";
import Particles from "react-tsparticles";
import "./CityBuilder.css";

const coinSound = "/Sounds/Cash.mp3";
const gridSize = 10;

// Achievement definitions
const achievements = [
  {
    id: "first_building",
    name: "Første Bygning",
    description: "Bygg din første bygning",
    icon: "🏠",
    requirement: 1,
    type: "buildings_built",
  },
  {
    id: "house_master",
    name: "Husmester",
    description: "Bygg 5 hus",
    icon: "🏘️",
    requirement: 5,
    type: "house_count",
  },
  {
    id: "rich_player",
    name: "Rik Spiller",
    description: "Samle 10,000 kroner",
    icon: "💰",
    requirement: 10000,
    type: "money_earned",
  },
  {
    id: "upgrade_expert",
    name: "Oppgraderingsekspert",
    description: "Oppgrader 3 bygninger",
    icon: "⬆️",
    requirement: 3,
    type: "upgrades_done",
  },
  {
    id: "happy_city",
    name: "Lykkelig By",
    description: "Nå 100% lykke",
    icon: "😊",
    requirement: 100,
    type: "max_happiness",
  },
  {
    id: "builder_pro",
    name: "Byggemester",
    description: "Bygg 20 bygninger",
    icon: "🏗️",
    requirement: 20,
    type: "buildings_built",
  },
  {
    id: "millionaire",
    name: "Millionær",
    description: "Samle 1,000,000 kroner",
    icon: "💎",
    requirement: 1000000,
    type: "money_earned",
  },
];

// Daily quests
const dailyQuests = [
  {
    id: "daily_build",
    name: "Daglig Bygger",
    description: "Bygg 3 bygninger i dag",
    icon: "🏗️",
    requirement: 3,
    type: "buildings_built",
    reward: 500,
  },
  {
    id: "daily_income",
    name: "Daglig Inntekt",
    description: "Samle 5000 kroner i dag",
    icon: "💰",
    requirement: 5000,
    type: "money_collected",
    reward: 200,
  },
  {
    id: "daily_upgrade",
    name: "Daglig Oppgradering",
    description: "Oppgrader 2 bygninger i dag",
    icon: "⬆️",
    requirement: 2,
    type: "upgrades_done",
    reward: 300,
  },
];

// New building types
const newBuildings = [
  {
    type: "factory",
    name: "Fabrikk",
    cost: 500,
    income: 60,
    resources: { water: 80, power: 100, materials: 120 },
    icon: faBuilding,
    unlockLevel: 5,
  },
  {
    type: "park",
    name: "Park",
    cost: 200,
    income: 0,
    resources: { water: 20, power: 0, materials: 40 },
    icon: faTree,
    unlockLevel: 3,
    happinessBonus: 25,
  },
  {
    type: "powerplant",
    name: "Kraftverk",
    cost: 1000,
    income: 80,
    resources: { water: 50, power: -200, materials: 200 },
    icon: faBuilding,
    unlockLevel: 8,
  },
];

// Optimalisert partikkel konfigurasjon for bedre performance
const particleOptions = {
  background: { color: { value: "transparent" } },
  fpsLimit: 30, // Redusert FPS for bedre performance
  particles: {
    color: { value: ["#667eea", "#764ba2", "#ffffff"] }, // Færre farger
    links: {
      color: "#667eea",
      distance: 120, // Kortere avstand
      enable: true,
      opacity: 0.2, // Lavere opacity
      width: 1,
    },
    move: {
      direction: "none",
      enable: true,
      outModes: { default: "bounce" },
      random: false,
      speed: 0.5, // Langsommere bevegelse
      straight: false,
    },
    number: { density: { enable: true, area: 1000 }, value: 20 }, // Færre partikler
    opacity: { value: 0.3 },
    shape: { type: "circle" },
    size: { value: { min: 1, max: 3 } }, // Mindre partikler
  },
  detectRetina: false, // Deaktiver retina for bedre performance
};

const buildings = [
  {
    type: "house",
    name: "Hus",
    cost: 50,
    income: 0,
    resources: { water: 10, power: 5, materials: 20 },
    icon: faHouse,
  },
  {
    type: "office",
    name: "Kontor",
    cost: 100,
    income: 20,
    resources: { water: 20, power: 20, materials: 40 },
    icon: faBuilding,
  },
  {
    type: "school",
    name: "Skole",
    cost: 150,
    income: 30,
    resources: { water: 30, power: 20, materials: 50 },
    icon: faSchool,
  },
  {
    type: "hospital",
    name: "Sykehus",
    cost: 250,
    income: 40,
    resources: { water: 50, power: 60, materials: 70 },
    icon: faHospital,
  },
  {
    type: "road",
    name: "Vei",
    cost: 75,
    income: 0,
    resources: { water: 0, power: 0, materials: 20 },
    icon: faRoad,
    upgrade: "highway",
  },
  {
    type: "highway",
    name: "Motorvei",
    cost: 150,
    income: 0,
    resources: { water: 0, power: 0, materials: 50 },
    icon: faCar,
    upgrade: "luxury-road",
  },
  {
    type: "luxury-road",
    name: "Luksusvei",
    cost: 250,
    income: 0,
    resources: { water: 0, power: 0, materials: 100 },
    icon: faCity,
    upgrade: null,
  },
  {
    type: "seed",
    name: "Seed",
    cost: 50,
    income: 0,
    resources: { water: 0, power: 0, materials: 100 },
    icon: faSeedling,
    upgrade: "tree",
  },
  {
    type: "tree",
    name: "Tree",
    cost: 50,
    income: 0,
    resources: { water: 0, power: 0, materials: 100 },
    icon: faTree,
    upgrade: null,
  },
];

function CityBuilder() {
  // Language system
  const [language, setLanguage] = useState(
    () => localStorage.getItem("gameLanguage") || "no"
  );
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  // Language switcher function
  const switchLanguage = (lang) => {
    setLanguage(lang);
    setShowLanguageMenu(false);
  };

  // Translations
  const translations = {
    no: {
      title: "🏰 Bygg din by! 🏙️",
      money: "💰 Penger",
      happiness: "💖 Lykke",
      streak: "🔥 Streak",
      level: "⭐ Nivå",
      xp: "🎯 XP",
      water: "💧 Vann",
      power: "⚡ Strøm",
      materials: "🏗️ Materialer",
      buildingsBuilt: "Bygninger bygget",
      totalEarned: "Total tjent",
      achievements: "Prestasjoner",
      upgrades: "Oppgraderinger",
      dailyQuests: "📋 Daglige Oppgaver",
      reward: "Belønning",
      collectIncome: "💰 Samle inntekt",
      prestige: "🌟 Prestisje - Reset for permanente bonuser!",
      achievementsTitle: "🏆 Prestasjoner",
      close: "✕ Lukk",
      completed: "✅ Fullført!",
      levelUp: "🎉 Level Up! Nivå",
      streakBonus: "🔥 Streak Bonus!",
      notEnoughResources: "❌ Ikke nok ressurser!",
      upgraded: "⬆️ Oppgradert!",
      notEnoughForUpgrade: "❌ Ikke nok ressurser til oppgradering!",
      prestigeConfirm:
        "Er du sikker på at du vil prestisje? Dette vil tilbakestille byen din, men gi deg permanente bonuser!",
      prestigeSuccess: "🌟 Prestisje! +{points} poeng!",
      prestigeNeed: "❌ Du trenger minst 100,000 kroner for å prestisje!",
      unlockLevel: "🔒 Nivå",
      // Buildings
      house: "Hus",
      office: "Kontor",
      school: "Skole",
      hospital: "Sykehus",
      road: "Vei",
      highway: "Motorvei",
      luxuryRoad: "Luksusvei",
      seed: "Seed",
      tree: "Tree",
      factory: "Fabrikk",
      park: "Park",
      powerplant: "Kraftverk",
      // Achievements
      firstBuilding: "Første Bygning",
      firstBuildingDesc: "Bygg din første bygning",
      houseMaster: "Husmester",
      houseMasterDesc: "Bygg 5 hus",
      richPlayer: "Rik Spiller",
      richPlayerDesc: "Samle 10,000 kroner",
      upgradeExpert: "Oppgraderingsekspert",
      upgradeExpertDesc: "Oppgrader 3 bygninger",
      happyCity: "Lykkelig By",
      happyCityDesc: "Nå 100% lykke",
      builderPro: "Byggemester",
      builderProDesc: "Bygg 20 bygninger",
      millionaire: "Millionær",
      millionaireDesc: "Samle 1,000,000 kroner",
      // Daily quests
      dailyBuilder: "Daglig Bygger",
      dailyBuilderDesc: "Bygg 3 bygninger i dag",
      dailyIncome: "Daglig Inntekt",
      dailyIncomeDesc: "Samle 5000 kroner i dag",
      dailyUpgrade: "Daglig Oppgradering",
      dailyUpgradeDesc: "Oppgrader 2 bygninger i dag",
    },
    en: {
      title: "🏰 Build Your City! 🏙️",
      money: "💰 Money",
      happiness: "💖 Happiness",
      streak: "🔥 Streak",
      level: "⭐ Level",
      xp: "🎯 XP",
      water: "💧 Water",
      power: "⚡ Power",
      materials: "🏗️ Materials",
      buildingsBuilt: "Buildings Built",
      totalEarned: "Total Earned",
      achievements: "Achievements",
      upgrades: "Upgrades",
      dailyQuests: "📋 Daily Quests",
      reward: "Reward",
      collectIncome: "💰 Collect Income",
      prestige: "🌟 Prestige - Reset for permanent bonuses!",
      achievementsTitle: "🏆 Achievements",
      close: "✕ Close",
      completed: "✅ Completed!",
      levelUp: "🎉 Level Up! Level",
      streakBonus: "🔥 Streak Bonus!",
      notEnoughResources: "❌ Not enough resources!",
      upgraded: "⬆️ Upgraded!",
      notEnoughForUpgrade: "❌ Not enough resources for upgrade!",
      prestigeConfirm:
        "Are you sure you want to prestige? This will reset your city but give you permanent bonuses!",
      prestigeSuccess: "🌟 Prestige! +{points} points!",
      prestigeNeed: "❌ You need at least 100,000 money to prestige!",
      unlockLevel: "🔒 Level",
      // Buildings
      house: "House",
      office: "Office",
      school: "School",
      hospital: "Hospital",
      road: "Road",
      highway: "Highway",
      luxuryRoad: "Luxury Road",
      seed: "Seed",
      tree: "Tree",
      factory: "Factory",
      park: "Park",
      powerplant: "Power Plant",
      // Achievements
      firstBuilding: "First Building",
      firstBuildingDesc: "Build your first building",
      houseMaster: "House Master",
      houseMasterDesc: "Build 5 houses",
      richPlayer: "Rich Player",
      richPlayerDesc: "Collect 10,000 money",
      upgradeExpert: "Upgrade Expert",
      upgradeExpertDesc: "Upgrade 3 buildings",
      happyCity: "Happy City",
      happyCityDesc: "Reach 100% happiness",
      builderPro: "Builder Pro",
      builderProDesc: "Build 20 buildings",
      millionaire: "Millionaire",
      millionaireDesc: "Collect 1,000,000 money",
      // Daily quests
      dailyBuilder: "Daily Builder",
      dailyBuilderDesc: "Build 3 buildings today",
      dailyIncome: "Daily Income",
      dailyIncomeDesc: "Collect 5000 money today",
      dailyUpgrade: "Daily Upgrade",
      dailyUpgradeDesc: "Upgrade 2 buildings today",
    },
    de: {
      title: "🏰 Baue deine Stadt! 🏙️",
      money: "💰 Geld",
      happiness: "💖 Glück",
      streak: "🔥 Serie",
      level: "⭐ Level",
      xp: "🎯 XP",
      water: "💧 Wasser",
      power: "⚡ Strom",
      materials: "🏗️ Materialien",
      buildingsBuilt: "Gebäude gebaut",
      totalEarned: "Gesamt verdient",
      achievements: "Erfolge",
      upgrades: "Upgrades",
      dailyQuests: "📋 Tägliche Aufgaben",
      reward: "Belohnung",
      collectIncome: "💰 Einkommen sammeln",
      prestige: "🌟 Prestige - Reset für permanente Boni!",
      achievementsTitle: "🏆 Erfolge",
      close: "✕ Schließen",
      completed: "✅ Abgeschlossen!",
      levelUp: "🎉 Level Up! Level",
      streakBonus: "🔥 Serie Bonus!",
      notEnoughResources: "❌ Nicht genug Ressourcen!",
      upgraded: "⬆️ Aufgewertet!",
      notEnoughForUpgrade: "❌ Nicht genug Ressourcen für Upgrade!",
      prestigeConfirm:
        "Bist du sicher, dass du Prestige willst? Dies wird deine Stadt zurücksetzen, aber dir permanente Boni geben!",
      prestigeSuccess: "🌟 Prestige! +{points} Punkte!",
      prestigeNeed: "❌ Du brauchst mindestens 100.000 Geld für Prestige!",
      unlockLevel: "🔒 Level",
      // Buildings
      house: "Haus",
      office: "Büro",
      school: "Schule",
      hospital: "Krankenhaus",
      road: "Straße",
      highway: "Autobahn",
      luxuryRoad: "Luxusstraße",
      seed: "Samen",
      tree: "Baum",
      factory: "Fabrik",
      park: "Park",
      powerplant: "Kraftwerk",
      // Achievements
      firstBuilding: "Erstes Gebäude",
      firstBuildingDesc: "Baue dein erstes Gebäude",
      houseMaster: "Hausmeister",
      houseMasterDesc: "Baue 5 Häuser",
      richPlayer: "Reicher Spieler",
      richPlayerDesc: "Sammle 10.000 Geld",
      upgradeExpert: "Upgrade-Experte",
      upgradeExpertDesc: "Upgrade 3 Gebäude",
      happyCity: "Glückliche Stadt",
      happyCityDesc: "Erreiche 100% Glück",
      builderPro: "Baumeister",
      builderProDesc: "Baue 20 Gebäude",
      millionaire: "Millionär",
      millionaireDesc: "Sammle 1.000.000 Geld",
      // Daily quests
      dailyBuilder: "Täglicher Baumeister",
      dailyBuilderDesc: "Baue heute 3 Gebäude",
      dailyIncome: "Tägliches Einkommen",
      dailyIncomeDesc: "Sammle heute 5000 Geld",
      dailyUpgrade: "Tägliches Upgrade",
      dailyUpgradeDesc: "Upgrade heute 2 Gebäude",
    },
  };

  // Get translated achievements
  const getTranslatedAchievements = () => [
    {
      id: "first_building",
      name: t.firstBuilding,
      description: t.firstBuildingDesc,
      icon: "🏠",
      requirement: 1,
      type: "buildings_built",
    },
    {
      id: "house_master",
      name: t.houseMaster,
      description: t.houseMasterDesc,
      icon: "🏘️",
      requirement: 5,
      type: "house_count",
    },
    {
      id: "rich_player",
      name: t.richPlayer,
      description: t.richPlayerDesc,
      icon: "💰",
      requirement: 10000,
      type: "money_earned",
    },
    {
      id: "upgrade_expert",
      name: t.upgradeExpert,
      description: t.upgradeExpertDesc,
      icon: "⬆️",
      requirement: 3,
      type: "upgrades_done",
    },
    {
      id: "happy_city",
      name: t.happyCity,
      description: t.happyCityDesc,
      icon: "😊",
      requirement: 100,
      type: "max_happiness",
    },
    {
      id: "builder_pro",
      name: t.builderPro,
      description: t.builderProDesc,
      icon: "🏗️",
      requirement: 20,
      type: "buildings_built",
    },
    {
      id: "millionaire",
      name: t.millionaire,
      description: t.millionaireDesc,
      icon: "💎",
      requirement: 1000000,
      type: "money_earned",
    },
  ];

  // Get translated daily quests
  const getTranslatedDailyQuests = () => [
    {
      id: "daily_build",
      name: t.dailyBuilder,
      description: t.dailyBuilderDesc,
      icon: "🏗️",
      requirement: 3,
      type: "buildings_built",
      reward: 500,
    },
    {
      id: "daily_income",
      name: t.dailyIncome,
      description: t.dailyIncomeDesc,
      icon: "💰",
      requirement: 5000,
      type: "money_collected",
      reward: 200,
    },
    {
      id: "daily_upgrade",
      name: t.dailyUpgrade,
      description: t.dailyUpgradeDesc,
      icon: "⬆️",
      requirement: 2,
      type: "upgrades_done",
      reward: 300,
    },
  ];

  // Get translated buildings
  const getTranslatedBuildings = () => [
    {
      type: "house",
      name: t.house,
      cost: 50,
      income: 0,
      resources: { water: 10, power: 5, materials: 20 },
      icon: faHouse,
    },
    {
      type: "office",
      name: t.office,
      cost: 100,
      income: 20,
      resources: { water: 20, power: 20, materials: 40 },
      icon: faBuilding,
    },
    {
      type: "school",
      name: t.school,
      cost: 150,
      income: 30,
      resources: { water: 30, power: 20, materials: 50 },
      icon: faSchool,
    },
    {
      type: "hospital",
      name: t.hospital,
      cost: 250,
      income: 40,
      resources: { water: 50, power: 60, materials: 70 },
      icon: faHospital,
    },
    {
      type: "road",
      name: t.road,
      cost: 75,
      income: 0,
      resources: { water: 0, power: 0, materials: 20 },
      icon: faRoad,
      upgrade: "highway",
    },
    {
      type: "highway",
      name: t.highway,
      cost: 150,
      income: 0,
      resources: { water: 0, power: 0, materials: 50 },
      icon: faCar,
      upgrade: "luxury-road",
    },
    {
      type: "luxury-road",
      name: t.luxuryRoad,
      cost: 250,
      income: 0,
      resources: { water: 0, power: 0, materials: 100 },
      icon: faCity,
      upgrade: null,
    },
    {
      type: "seed",
      name: t.seed,
      cost: 50,
      income: 0,
      resources: { water: 0, power: 0, materials: 100 },
      icon: faSeedling,
      upgrade: "tree",
    },
    {
      type: "tree",
      name: t.tree,
      cost: 50,
      income: 0,
      resources: { water: 0, power: 0, materials: 100 },
      icon: faTree,
      upgrade: null,
    },
  ];

  // Get translated new buildings
  const getTranslatedNewBuildings = () => [
    {
      type: "factory",
      name: t.factory,
      cost: 500,
      income: 60,
      resources: { water: 80, power: 100, materials: 120 },
      icon: faBuilding,
      unlockLevel: 5,
    },
    {
      type: "park",
      name: t.park,
      cost: 200,
      income: 0,
      resources: { water: 20, power: 0, materials: 40 },
      icon: faTree,
      unlockLevel: 3,
      happinessBonus: 25,
    },
    {
      type: "powerplant",
      name: t.powerplant,
      cost: 1000,
      income: 80,
      resources: { water: 50, power: -200, materials: 200 },
      icon: faBuilding,
      unlockLevel: 8,
    },
  ];
  const [grid, setGrid] = useState(
    () =>
      JSON.parse(localStorage.getItem("cityGrid")) ||
      Array(gridSize)
        .fill(null)
        .map(() => Array(gridSize).fill(null))
  );
  const [money, setMoney] = useState(
    () => JSON.parse(localStorage.getItem("money")) || 500
  );
  const [happiness, setHappiness] = useState(
    () => JSON.parse(localStorage.getItem("happiness")) || 100
  );
  const [resources, setResources] = useState(
    () =>
      JSON.parse(localStorage.getItem("resources")) || {
        water: 500,
        power: 500,
        materials: 500,
      }
  );

  // Translation function
  const t = translations[language];

  // Save language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("gameLanguage", language);
  }, [language]);

  // Initialize selectedBuilding after translation functions are defined
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  // Set initial building when component mounts
  useEffect(() => {
    if (!selectedBuilding) {
      setSelectedBuilding(getTranslatedBuildings()[0]);
    }
  }, [language]);

  const [showFloatingText, setShowFloatingText] = useState(false);
  const [floatingTextValue, setFloatingTextValue] = useState("");
  const [buildingAnimations, setBuildingAnimations] = useState({});
  const [multiplier, setMultiplier] = useState(1);
  const [streak, setStreak] = useState(0);

  // Achievement system states
  const [unlockedAchievements, setUnlockedAchievements] = useState(
    () => JSON.parse(localStorage.getItem("unlockedAchievements")) || []
  );
  const [achievementNotification, setAchievementNotification] = useState(null);
  const [showAchievements, setShowAchievements] = useState(false);

  // Level system states
  const [playerLevel, setPlayerLevel] = useState(
    () => JSON.parse(localStorage.getItem("playerLevel")) || 1
  );
  const [experience, setExperience] = useState(
    () => JSON.parse(localStorage.getItem("experience")) || 0
  );
  const [totalMoneyEarned, setTotalMoneyEarned] = useState(
    () => JSON.parse(localStorage.getItem("totalMoneyEarned")) || 0
  );

  // Statistics
  const [stats, setStats] = useState(
    () =>
      JSON.parse(localStorage.getItem("stats")) || {
        buildingsBuilt: 0,
        upgradesDone: 0,
        totalMoneyEarned: 0,
        timePlayedMinutes: 0,
        houseCount: 0,
        maxHappinessReached: 0,
      }
  );

  // Daily quests
  const [dailyProgress, setDailyProgress] = useState(
    () =>
      JSON.parse(localStorage.getItem("dailyProgress")) || {
        buildings_built: 0,
        money_collected: 0,
        upgrades_done: 0,
        lastReset: new Date().toDateString(),
      }
  );

  // Available buildings (unlocked by level)
  const [availableBuildings, setAvailableBuildings] = useState(buildings);

  // Optimalisert localStorage save med debouncing
  const saveToLocalStorage = useCallback(() => {
    const saveData = {
      cityGrid: grid,
      money: money,
      happiness: happiness,
      resources: resources,
      unlockedAchievements: unlockedAchievements,
      playerLevel: playerLevel,
      experience: experience,
      totalMoneyEarned: totalMoneyEarned,
      stats: stats,
      dailyProgress: dailyProgress,
    };

    Object.entries(saveData).forEach(([key, value]) => {
      localStorage.setItem(key, JSON.stringify(value));
    });
  }, [
    grid,
    money,
    happiness,
    resources,
    unlockedAchievements,
    playerLevel,
    experience,
    totalMoneyEarned,
    stats,
    dailyProgress,
  ]);

  // Debounced save - spar kun hver 2. sekund
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveToLocalStorage();
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [saveToLocalStorage]);

  // Check and unlock new buildings based on level
  useEffect(() => {
    const allBuildings = [
      ...getTranslatedBuildings(),
      ...getTranslatedNewBuildings(),
    ];
    const unlocked = allBuildings.filter(
      (building) => !building.unlockLevel || building.unlockLevel <= playerLevel
    );
    setAvailableBuildings(unlocked);
  }, [playerLevel, language]);

  // Reset daily quests
  useEffect(() => {
    const today = new Date().toDateString();
    if (dailyProgress.lastReset !== today) {
      setDailyProgress({
        buildings_built: 0,
        money_collected: 0,
        upgrades_done: 0,
        lastReset: today,
      });
    }
  }, []);

  // Optimalisert achievement checking med throttling
  useEffect(() => {
    const checkAchievements = () => {
      getTranslatedAchievements().forEach((achievement) => {
        if (!unlockedAchievements.includes(achievement.id)) {
          let completed = false;

          switch (achievement.type) {
            case "buildings_built":
              completed = stats.buildingsBuilt >= achievement.requirement;
              break;
            case "house_count":
              completed = stats.houseCount >= achievement.requirement;
              break;
            case "money_earned":
              completed = stats.totalMoneyEarned >= achievement.requirement;
              break;
            case "upgrades_done":
              completed = stats.upgradesDone >= achievement.requirement;
              break;
            case "max_happiness":
              completed = happiness >= achievement.requirement;
              break;
          }

          if (completed) {
            setUnlockedAchievements((prev) => [...prev, achievement.id]);
            setAchievementNotification(achievement);
            setTimeout(() => setAchievementNotification(null), 3000);

            // Award XP for achievement
            addExperience(100);
          }
        }
      });
    };

    // Throttle achievement checking to every 3 seconds
    const timeoutId = setTimeout(checkAchievements, 3000);
    return () => clearTimeout(timeoutId);
  }, [stats, happiness, unlockedAchievements, language]);

  // Level up system
  const addExperience = (xp) => {
    const newXP = experience + xp;
    const xpNeeded = playerLevel * 100; // 100 XP per level

    if (newXP >= xpNeeded) {
      setPlayerLevel((prev) => prev + 1);
      setExperience(newXP - xpNeeded);
      showFloatingTextEffect(`${t.levelUp} ${playerLevel + 1}`);
    } else {
      setExperience(newXP);
    }
  };

  // Optimalisert auto-samle inntekt (idle game mekanikk)
  useEffect(() => {
    const autoCollectInterval = setInterval(() => {
      const allBuildings = [
        ...getTranslatedBuildings(),
        ...getTranslatedNewBuildings(),
      ];
      const income = grid.flat().reduce((total, cell) => {
        const building = allBuildings.find((b) => b.type === cell);
        return total + (building ? building.income * 0.1 : 0); // 10% av inntekt automatisk
      }, 0);

      if (income > 0) {
        setMoney((prev) => prev + Math.floor(income * multiplier * 0.1));
      }
    }, 10000); // Økt til hver 10. sekund for bedre performance

    return () => clearInterval(autoCollectInterval);
  }, [grid, multiplier, language]);

  // Optimalisert ressurs regenerering
  useEffect(() => {
    const resourceRegenInterval = setInterval(() => {
      setResources((prev) => ({
        water: Math.min(prev.water + 10, 1000), // Økt regen men sjeldnere
        power: Math.min(prev.power + 6, 1000),
        materials: Math.min(prev.materials + 4, 1000),
      }));
    }, 6000); // Økt til hver 6. sekund

    return () => clearInterval(resourceRegenInterval);
  }, []);

  const placeBuilding = (row, col) => {
    if (
      money >= selectedBuilding.cost &&
      !grid[row][col] &&
      resources.water >= selectedBuilding.resources.water &&
      resources.power >= selectedBuilding.resources.power &&
      resources.materials >= selectedBuilding.resources.materials
    ) {
      const newGrid = [...grid];
      newGrid[row][col] = selectedBuilding.type;
      setGrid(newGrid);
      setMoney(money - selectedBuilding.cost);

      setResources((prev) => ({
        water: prev.water - selectedBuilding.resources.water,
        power: prev.power - selectedBuilding.resources.power,
        materials: prev.materials - selectedBuilding.resources.materials,
      }));

      // Update statistics
      setStats((prev) => ({
        ...prev,
        buildingsBuilt: prev.buildingsBuilt + 1,
        houseCount:
          selectedBuilding.type === "house"
            ? prev.houseCount + 1
            : prev.houseCount,
      }));

      // Update daily progress
      setDailyProgress((prev) => ({
        ...prev,
        buildings_built: prev.buildings_built + 1,
      }));

      // Add XP for building
      addExperience(20);

      // Animasjonseffekt
      const cellKey = `${row}-${col}`;
      setBuildingAnimations((prev) => ({ ...prev, [cellKey]: "building" }));
      setTimeout(() => {
        setBuildingAnimations((prev) => {
          const newAnimations = { ...prev };
          delete newAnimations[cellKey];
          return newAnimations;
        });
      }, 1200);

      // Streak system
      setStreak((prev) => prev + 1);
      if (streak > 0 && streak % 5 === 0) {
        setMultiplier((prev) => Math.min(prev + 0.1, 3));
        showFloatingTextEffect(
          `${t.streakBonus} x${(multiplier + 0.1).toFixed(1)}`
        );
      }

      updateHappiness(selectedBuilding.type);

      // Spill byggelyd
      const audio = new Audio(coinSound);
      audio.volume = 0.3;
      audio.play();
    } else {
      // Reset streak på feil
      setStreak(0);
      setMultiplier(1);
      showFloatingTextEffect(t.notEnoughResources);
    }
  };

  const upgradeBuilding = (row, col) => {
    const currentType = grid[row][col];
    const allBuildings = [
      ...getTranslatedBuildings(),
      ...getTranslatedNewBuildings(),
    ];
    const currentBuilding = allBuildings.find((b) => b.type === currentType);

    if (currentBuilding && currentBuilding.upgrade) {
      const nextBuilding = allBuildings.find(
        (b) => b.type === currentBuilding.upgrade
      );

      if (
        money >= nextBuilding.cost &&
        resources.materials >= nextBuilding.resources.materials
      ) {
        const newGrid = [...grid];
        newGrid[row][col] = nextBuilding.type;
        setGrid(newGrid);
        setMoney(money - nextBuilding.cost);

        setResources((prev) => ({
          ...prev,
          materials: prev.materials - nextBuilding.resources.materials,
        }));

        // Update statistics
        setStats((prev) => ({
          ...prev,
          upgradesDone: prev.upgradesDone + 1,
        }));

        // Update daily progress
        setDailyProgress((prev) => ({
          ...prev,
          upgrades_done: prev.upgrades_done + 1,
        }));

        // Add XP for upgrade
        addExperience(50);

        showFloatingTextEffect(t.upgraded);
      } else {
        showFloatingTextEffect(t.notEnoughForUpgrade);
      }
    }
  };

  const collectIncome = () => {
    const allBuildings = [
      ...getTranslatedBuildings(),
      ...getTranslatedNewBuildings(),
    ];
    const income = grid.flat().reduce((total, cell) => {
      const building = allBuildings.find((b) => b.type === cell);
      return total + (building ? building.income : 0);
    }, 0);

    if (income > 0) {
      const finalIncome = Math.floor(income * multiplier);
      setMoney(money + finalIncome);

      // Update statistics
      setStats((prev) => ({
        ...prev,
        totalMoneyEarned: prev.totalMoneyEarned + finalIncome,
      }));
      setTotalMoneyEarned((prev) => prev + finalIncome);

      // Update daily progress
      setDailyProgress((prev) => ({
        ...prev,
        money_collected: prev.money_collected + finalIncome,
      }));

      // Add XP for collecting income
      addExperience(10);

      // Flytende tekst effekt
      showFloatingTextEffect(`+$${finalIncome} 💰`);

      // Penge-animasjon
      const topPanel = document.querySelector(".top-panel");
      if (topPanel) {
        topPanel.classList.add("money-animate");
        setTimeout(() => topPanel.classList.remove("money-animate"), 1000); // Match CSS animation duration
      }

      const audio = new Audio(coinSound);
      audio.volume = 0.5;
      audio.play();
    }
  };

  const showFloatingTextEffect = (text) => {
    setFloatingTextValue(text);
    setShowFloatingText(true);
    setTimeout(() => setShowFloatingText(false), 2000);
  };

  const updateHappiness = (buildingType) => {
    let happinessChange = 0;

    switch (buildingType) {
      case "school":
        happinessChange = 10;
        break;
      case "hospital":
        happinessChange = 15;
        break;
      case "office":
        happinessChange = -5;
        break;
      case "park":
        happinessChange = 25;
        break;
      default:
        happinessChange = 0;
        break;
    }

    const newHappiness = Math.min(
      100,
      Math.max(0, happiness + happinessChange)
    );
    setHappiness(newHappiness);

    // Update max happiness reached stat
    setStats((prev) => ({
      ...prev,
      maxHappinessReached: Math.max(prev.maxHappinessReached, newHappiness),
    }));
  };

  // Optimalisert grid rendering med memoization
  const renderedGrid = useMemo(() => {
    const allBuildings = [
      ...getTranslatedBuildings(),
      ...getTranslatedNewBuildings(),
    ];

    return grid.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        const building = allBuildings.find((b) => b.type === cell);
        return (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`cell ${building ? `building ${building.type}` : ""} ${
              buildingAnimations[`${rowIndex}-${colIndex}`] || ""
            }`}
            onClick={() =>
              building && building.upgrade
                ? upgradeBuilding(rowIndex, colIndex)
                : placeBuilding(rowIndex, colIndex)
            }
          >
            {building ? <FontAwesomeIcon icon={building.icon} /> : "⬜"}
            {building && building.upgrade && (
              <div className="upgrade-indicator">⬆️</div>
            )}
          </div>
        );
      })
    );
  }, [grid, buildingAnimations, language]);

  // Prestige system
  const prestige = () => {
    if (window.confirm(t.prestigeConfirm)) {
      // Calculate prestige points based on total money earned
      const prestigePoints = Math.floor(totalMoneyEarned / 100000);

      if (prestigePoints > 0) {
        // Reset everything except prestige bonuses
        setGrid(
          Array(gridSize)
            .fill(null)
            .map(() => Array(gridSize).fill(null))
        );
        setMoney(500);
        setHappiness(100);
        setResources({ water: 500, power: 500, materials: 500 });
        setPlayerLevel(1);
        setExperience(0);
        setTotalMoneyEarned(0);
        setMultiplier(1 + prestigePoints * 0.1); // 10% bonus per prestige point

        showFloatingTextEffect(
          t.prestigeSuccess.replace("{points}", prestigePoints)
        );
      } else {
        showFloatingTextEffect(t.prestigeNeed);
      }
    }
  };

  return (
    <div className="city-container">
      {/* Partikkel bakgrunn */}
      <Particles options={particleOptions} />

      {/* Flytende tekst effekt */}
      {showFloatingText && (
        <div className="floating-text">{floatingTextValue}</div>
      )}

      <h1>{t.title}</h1>

      {/* Language Switcher */}
      <div className="language-switcher">
        <button
          className="language-button"
          onClick={() => setShowLanguageMenu(!showLanguageMenu)}
        >
          � {language.toUpperCase()}
        </button>
        {showLanguageMenu && (
          <div className="language-menu">
            <button onClick={() => switchLanguage("no")}>🇳🇴 Norsk</button>
            <button onClick={() => switchLanguage("en")}>�🇧 English</button>
            <button onClick={() => switchLanguage("de")}>🇩🇪 Deutsch</button>
          </div>
        )}
      </div>

      {/* Achievement notification */}
      {achievementNotification && (
        <div className="achievement-notification">
          <strong>
            {achievementNotification.icon} {achievementNotification.name}
          </strong>
          <div>{achievementNotification.description}</div>
        </div>
      )}

      <div className="top-panel">
        <div>
          {t.money}: ${money.toLocaleString()}
        </div>
        <div>
          {t.happiness}: {happiness}%
        </div>
        <div>
          {t.streak}: {streak} (x{multiplier.toFixed(1)})
        </div>
        <div>
          {t.level}: {playerLevel}
        </div>
      </div>

      {/* Level progress bar */}
      <div className="level-progress">
        <div>
          {t.xp}: {experience}/{playerLevel * 100}
        </div>
        <div className="level-bar">
          <div
            className="level-fill"
            style={{ width: `${(experience / (playerLevel * 100)) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="resource-panel">
        <div>
          {t.water}: {resources.water}
        </div>
        <div>
          {t.power}: {resources.power}
        </div>
        <div>
          {t.materials}: {resources.materials}
        </div>
      </div>

      {/* Statistics panel */}
      <div className="stats-panel">
        <div className="stat-item">
          <div className="stat-value">{stats.buildingsBuilt}</div>
          <div>{t.buildingsBuilt}</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">
            ${stats.totalMoneyEarned.toLocaleString()}
          </div>
          <div>{t.totalEarned}</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">
            {unlockedAchievements.length}/{getTranslatedAchievements().length}
          </div>
          <div>{t.achievements}</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{stats.upgradesDone}</div>
          <div>{t.upgrades}</div>
        </div>
      </div>

      {/* Daily quests */}
      <div className="stats-panel" style={{ marginTop: "30px" }}>
        <h3 style={{ margin: "0 0 15px 0", color: "white" }}>
          {t.dailyQuests}
        </h3>
        {getTranslatedDailyQuests().map((quest) => {
          const progress = dailyProgress[quest.type] || 0;
          const completed = progress >= quest.requirement;
          return (
            <div
              key={quest.id}
              className={`stat-item ${completed ? "completed" : ""}`}
            >
              <div>
                {quest.icon} {quest.name}
              </div>
              <div>
                {progress}/{quest.requirement}
              </div>
              <div>
                {t.reward}: ${quest.reward}
              </div>
            </div>
          );
        })}
      </div>

      <div className="building-selector">
        {availableBuildings.map((building) => {
          const isLocked =
            building.unlockLevel && building.unlockLevel > playerLevel;
          return (
            <button
              key={building.type}
              onClick={() => !isLocked && setSelectedBuilding(building)}
              className={`${
                selectedBuilding?.type === building.type ? "selected" : ""
              } ${isLocked ? "locked" : ""}`}
              disabled={isLocked}
            >
              <FontAwesomeIcon icon={building.icon} /> {building.name} ($
              {building.cost})
              {isLocked && (
                <div>
                  {t.unlockLevel} {building.unlockLevel}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="grid">{renderedGrid}</div>

      <button className="collect-btn" onClick={collectIncome}>
        {t.collectIncome} (x{multiplier.toFixed(1)})
      </button>

      {/* Prestige button - only show if player has enough money */}
      {totalMoneyEarned >= 100000 && (
        <button className="prestige-button" onClick={prestige}>
          {t.prestige}
        </button>
      )}

      {/* Achievements panel */}
      {showAchievements && (
        <div className="achievements-panel">
          <h3>{t.achievementsTitle}</h3>
          <button onClick={() => setShowAchievements(false)}>{t.close}</button>
          {getTranslatedAchievements().map((achievement) => {
            const unlocked = unlockedAchievements.includes(achievement.id);
            return (
              <div
                key={achievement.id}
                className={`achievement-item ${unlocked ? "completed" : ""}`}
              >
                <div>{achievement.icon}</div>
                <div>
                  <div>
                    <strong>{achievement.name}</strong>
                  </div>
                  <div>{achievement.description}</div>
                  {unlocked && <div>{t.completed}</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Achievement toggle button */}
      <button
        className="achievement-toggle"
        onClick={() => setShowAchievements(!showAchievements)}
      >
        🏆 {t.achievements} ({unlockedAchievements.length}/
        {getTranslatedAchievements().length})
      </button>
    </div>
  );
}

export default CityBuilder;
