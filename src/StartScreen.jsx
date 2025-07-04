import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./StartScreen.css";

function StartScreen({ onSettings, onLanguage, onSaves }) {
  const [language, setLanguage] = useState("no");
  const [showLanguages, setShowLanguages] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [audioRef, setAudioRef] = useState(null);
  const navigate = useNavigate();

  const translations = {
    no: {
      title: "Sim-Korea",
      subtitle: "Bygg din egen nordkoreanske by",
      play: "Spill",
      settings: "Innstillinger",
      language: "Språk",
      saves: "Lagrede spill",
      musicToggle: "Musikk",
    },
    en: {
      title: "Sim-Korea",
      subtitle: "Build your own North Korean city",
      play: "Play",
      settings: "Settings",
      language: "Language",
      saves: "Saved Games",
      musicToggle: "Music",
    },
    de: {
      title: "Sim-Korea",
      subtitle: "Baue deine eigene nordkoreanische Stadt",
      play: "Spielen",
      settings: "Einstellungen",
      language: "Sprache",
      saves: "Gespeicherte Spiele",
      musicToggle: "Musik",
    },
  };

  const languages = [
    { code: "no", name: "Norsk", flag: "🇳🇴" },
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
  ];

  useEffect(() => {
    // Auto-play propaganda music
    const audio = new Audio("/Sounds/Propaganda.mp3");
    audio.loop = true;
    audio.volume = 0.3;

    const playAudio = async () => {
      if (musicEnabled) {
        try {
          await audio.play();
        } catch (error) {
          console.log("Auto-play was prevented:", error);
        }
      }
    };

    playAudio();
    setAudioRef(audio);

    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [musicEnabled]);

  const handleLanguageChange = (langCode) => {
    setLanguage(langCode);
    setShowLanguages(false);
    if (onLanguage) {
      onLanguage(langCode);
    }
  };

  const handlePlay = () => {
    navigate("/citybuilder");
  };

  const toggleMusic = () => {
    setMusicEnabled(!musicEnabled);
    if (audioRef) {
      if (musicEnabled) {
        audioRef.pause();
      } else {
        audioRef.play().catch(console.error);
      }
    }
  };

  const currentTranslation = translations[language];

  return (
    <div className="start-screen">
      <div className="background-overlay"></div>

      <div className="content-container">
        <div className="title-section">
          <h1 className="game-title">{currentTranslation.title}</h1>
          <p className="game-subtitle">{currentTranslation.subtitle}</p>
        </div>

        <div className="menu-section">
          <button className="menu-button primary" onClick={handlePlay}>
            {currentTranslation.play}
          </button>

          <button className="menu-button" onClick={onSettings}>
            {currentTranslation.settings}
          </button>

          <div className="language-selector">
            <button
              className="menu-button language-toggle"
              onClick={() => setShowLanguages(!showLanguages)}
            >
              {currentTranslation.language}{" "}
              {languages.find((l) => l.code === language)?.flag}
            </button>

            {showLanguages && (
              <div className="language-dropdown">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    className={`language-option ${
                      language === lang.code ? "active" : ""
                    }`}
                    onClick={() => handleLanguageChange(lang.code)}
                  >
                    <span className="flag">{lang.flag}</span>
                    <span className="lang-name">{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="menu-button" onClick={onSaves}>
            {currentTranslation.saves}
          </button>

          <button
            className={`menu-button music-toggle ${
              musicEnabled ? "enabled" : "disabled"
            }`}
            onClick={toggleMusic}
            title={currentTranslation.musicToggle}
          >
            {musicEnabled ? "🔊" : "🔇"} {currentTranslation.musicToggle}
          </button>
        </div>
      </div>
    </div>
  );
}

export default StartScreen;
