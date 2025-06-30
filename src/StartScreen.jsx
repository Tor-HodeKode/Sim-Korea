import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // Husk å importere useNavigate
import "./StartScreen.css";


function StartScreen({ onSettings, onLanguage, onSaves }) {
  const [language, setLanguage] = useState("no");
  const [showLanguages, setShowLanguages] = useState(false);
  const navigate = useNavigate();  // Bruk useNavigate

  const switchLanguage = (lang) => {
    setLanguage(lang);
    setShowLanguages(false); 
  };

  const texts = {
    no: {
      welcome: "Velkommen Til Tronen!",
      play: "Play",
      saves: "Saves",
      language: "Language",
      settings: "Settings",
    },
    en: {
      welcome: "Welcome to CityBuilder!",
      play: "Play",
      saves: "Saves",
      language: "Language",
      settings: "Settings",
    },
    de: {
      welcome: "Willkommen bei CityBuilder!",
      play: "Spielen",
      saves: "Speichern",
      language: "Sprache",
      settings: "Einstellungen",
    },
  };

  const startGame = () => {
    navigate("/startscreen");  // Ruter til CityBuilderDemo
  };
  

  return (
    <div className="start-screen">
      <h1>{texts[language].welcome}</h1>
      
      {!showLanguages ? (
        <div className="start-buttons">
          <button onClick={startGame}>{texts[language].play}</button>
          <button onClick={onSaves}>{texts[language].saves}</button>
          <button onClick={() => setShowLanguages(true)}>{texts[language].language}</button>
          <button onClick={onSettings}>{texts[language].settings}</button>
        </div>
      ) : (
        <div className="language-switcher">
          <button onClick={() => switchLanguage("no")}>Norsk</button>
          <button onClick={() => switchLanguage("en")}>English</button>
          <button onClick={() => switchLanguage("de")}>Deutsch</button>
          <button onClick={() => setShowLanguages(false)}>⬅ Tilbake</button>
        </div>
      )}
    </div>
  );
}

export default StartScreen;


