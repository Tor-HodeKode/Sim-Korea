import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Husk å importere useNavigate
import "./StartScreen.css";

function StartScreen({ onSettings, onLanguage, onSaves }) {
  const [language, setLanguage] = useState("no");
  const [showLanguages, setShowLanguages] = useState(false);
  const navigate = useNavigate(); // Bruk useNavigate

  const switchLanguage = (lang) => {
    setLanguage(lang);
    setShowLanguages(false);
    if (onLanguage) {
      onLanguage(lang);
    }
  };

  const texts = {
    no: {
      welcome: "🏰 Sim-Korea: Bygg Din Fremtid! 🚀",
      play: "🎮 Start Byggeoppdraget",
      saves: "💾 Lagrede Byer",
      language: "🌍 Språk",
      settings: "⚙️ Systemkontroller",
      subtitle: "Den ultimate city-builder opplevelsen",
      buildFuture: "Bygg fremtidens megaby med avansert teknologi",
      backToMenu: "⬅ Tilbake til Hovedmenyen",
    },
    en: {
      welcome: "🏰 Sim-Korea: Build Your Future! 🚀",
      play: "🎮 Launch Building Mission",
      saves: "💾 Saved Cities",
      language: "🌍 Language",
      settings: "⚙️ System Controls",
      subtitle: "The ultimate city-builder experience",
      buildFuture: "Build the megacity of tomorrow with advanced technology",
      backToMenu: "⬅ Back to Main Menu",
    },
    de: {
      welcome: "🏰 Sim-Korea: Baue Deine Zukunft! 🚀",
      play: "🎮 Baumission Starten",
      saves: "💾 Gespeicherte Städte",
      language: "🌍 Sprache",
      settings: "⚙️ Systemsteuerung",
      subtitle: "Das ultimative Städtebau-Erlebnis",
      buildFuture:
        "Baue die Megastadt von morgen mit fortschrittlicher Technologie",
      backToMenu: "⬅ Zurück zum Hauptmenü",
    },
    ko: {
      welcome: "🏰 Sim-Korea: 미래를 건설하세요! 🚀",
      play: "🎮 건설 미션 시작",
      saves: "💾 저장된 도시들",
      language: "🌍 언어",
      settings: "⚙️ 시스템 제어",
      subtitle: "궁극의 도시 건설 체험",
      buildFuture: "첨단 기술로 내일의 메가시티를 건설하세요",
      backToMenu: "⬅ 메인 메뉴로 돌아가기",
    },
    fr: {
      welcome: "🏰 Sim-Korea: Construisez Votre Avenir! 🚀",
      play: "🎮 Lancer la Mission de Construction",
      saves: "💾 Villes Sauvegardées",
      language: "🌍 Langue",
      settings: "⚙️ Contrôles Système",
      subtitle: "L'expérience ultime de construction de ville",
      buildFuture:
        "Construisez la mégalopole de demain avec une technologie avancée",
      backToMenu: "⬅ Retour au Menu Principal",
    },
  };

  const startGame = () => {
    navigate("/citybuilder"); // Ruter til CityBuilder
  };

  return (
    <div className="start-screen">
      <div className="title-section">
        <h1>{texts[language].welcome}</h1>
        <p className="subtitle">{texts[language].subtitle}</p>
        <p className="description">{texts[language].buildFuture}</p>
      </div>

      {!showLanguages ? (
        <div className="start-buttons">
          <button onClick={startGame} className="primary-button">
            {texts[language].play}
          </button>
          <button onClick={onSaves} className="secondary-button">
            {texts[language].saves}
          </button>
          <button
            onClick={() => setShowLanguages(true)}
            className="secondary-button"
          >
            {texts[language].language}
          </button>
          <button onClick={onSettings} className="secondary-button">
            {texts[language].settings}
          </button>
        </div>
      ) : (
        <div className="language-switcher">
          <h3
            style={{
              color: "white",
              marginBottom: "20px",
              textShadow: "0 0 10px rgba(102, 126, 234, 0.8)",
            }}
          >
            {texts[language].language}
          </h3>
          <div className="language-grid">
            <button
              onClick={() => switchLanguage("no")}
              className={language === "no" ? "active" : ""}
            >
              🇳🇴 Norsk
            </button>
            <button
              onClick={() => switchLanguage("en")}
              className={language === "en" ? "active" : ""}
            >
              🇺🇸 English
            </button>
            <button
              onClick={() => switchLanguage("de")}
              className={language === "de" ? "active" : ""}
            >
              🇩🇪 Deutsch
            </button>
            <button
              onClick={() => switchLanguage("ko")}
              className={language === "ko" ? "active" : ""}
            >
              🇰🇷 한국어
            </button>
            <button
              onClick={() => switchLanguage("fr")}
              className={language === "fr" ? "active" : ""}
            >
              🇫🇷 Français
            </button>
          </div>
          <button
            onClick={() => setShowLanguages(false)}
            className="back-button"
          >
            {texts[language].backToMenu}
          </button>
        </div>
      )}
    </div>
  );
}

export default StartScreen;
