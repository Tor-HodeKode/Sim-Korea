import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./CityBuilderInfo.css";

function CityBuilderInfo({
  selectedBuilding,
  language,
  playerLevel,
  resources,
  money,
  onClose,
}) {
  const translations = {
    no: {
      buildingInfo: "📋 Bygningsinformasjon",
      cost: "💰 Kostnad",
      income: "📈 Inntekt per samling",
      resourcesNeeded: "🔧 Ressurser som trengs",
      resourcesProduced: "⚡ Ressurser produsert",
      water: "💧 Vann",
      power: "⚡ Strøm",
      materials: "🏗️ Materialer",
      unlockLevel: "🔒 Låses opp på nivå",
      happinessBonus: "😊 Lykkebonus",
      canAfford: "✅ Du har råd til denne bygningen",
      cannotAfford: "❌ Du har ikke råd til denne bygningen",
      hasResources: "✅ Du har nok ressurser",
      needsMoreResources: "❌ Du trenger mer ressurser",
      upgrade: "⬆️ Kan oppgraderes til",
      specialAbility: "⭐ Spesialferdighet",
      perSecond: "per 6 sekunder",
      none: "Ingen",
      close: "✕ Lukk",
      currentResources: "📦 Dine ressurser",
      required: "Nødvendig",
      available: "Tilgjengelig",
      buildingStats: "📊 Bygningsstatistikk",
      efficiency: "⚙️ Effektivitet",
      maintenanceCost: "🔧 Vedlikeholdskostnad",
    },
    en: {
      buildingInfo: "📋 Building Information",
      cost: "💰 Cost",
      income: "📈 Income per collection",
      resourcesNeeded: "🔧 Resources needed",
      resourcesProduced: "⚡ Resources produced",
      water: "💧 Water",
      power: "⚡ Power",
      materials: "🏗️ Materials",
      unlockLevel: "🔒 Unlocks at level",
      happinessBonus: "😊 Happiness bonus",
      canAfford: "✅ You can afford this building",
      cannotAfford: "❌ You cannot afford this building",
      hasResources: "✅ You have enough resources",
      needsMoreResources: "❌ You need more resources",
      upgrade: "⬆️ Can be upgraded to",
      specialAbility: "⭐ Special ability",
      perSecond: "per 6 seconds",
      none: "None",
      close: "✕ Close",
      currentResources: "📦 Your resources",
      required: "Required",
      available: "Available",
      buildingStats: "📊 Building stats",
      efficiency: "⚙️ Efficiency",
      maintenanceCost: "🔧 Maintenance cost",
    },
    de: {
      buildingInfo: "📋 Gebäudeinformation",
      cost: "💰 Kosten",
      income: "📈 Einkommen pro Sammlung",
      resourcesNeeded: "🔧 Benötigte Ressourcen",
      resourcesProduced: "⚡ Produzierte Ressourcen",
      water: "💧 Wasser",
      power: "⚡ Strom",
      materials: "🏗️ Materialien",
      unlockLevel: "🔒 Freischaltung auf Level",
      happinessBonus: "😊 Glücksbonus",
      canAfford: "✅ Du kannst dir dieses Gebäude leisten",
      cannotAfford: "❌ Du kannst dir dieses Gebäude nicht leisten",
      hasResources: "✅ Du hast genug Ressourcen",
      needsMoreResources: "❌ Du brauchst mehr Ressourcen",
      upgrade: "⬆️ Kann aufgewertet werden zu",
      specialAbility: "⭐ Spezialfähigkeit",
      perSecond: "pro 6 Sekunden",
      none: "Keine",
      close: "✕ Schließen",
      currentResources: "📦 Deine Ressourcen",
      required: "Benötigt",
      available: "Verfügbar",
      buildingStats: "📊 Gebäudestatistiken",
      efficiency: "⚙️ Effizienz",
      maintenanceCost: "🔧 Wartungskosten",
    },
  };

  const t = translations[language];

  if (!selectedBuilding) {
    return null;
  }

  const canAfford = money >= selectedBuilding.cost;
  const hasEnoughWater = resources.water >= selectedBuilding.resources.water;
  const hasEnoughPower = resources.power >= selectedBuilding.resources.power;
  const hasEnoughMaterials =
    resources.materials >= selectedBuilding.resources.materials;
  const hasAllResources =
    hasEnoughWater && hasEnoughPower && hasEnoughMaterials;

  const isUnlocked =
    !selectedBuilding.unlockLevel ||
    selectedBuilding.unlockLevel <= playerLevel;

  // Calculate efficiency based on income vs cost
  const efficiency =
    selectedBuilding.income > 0
      ? Math.round((selectedBuilding.income / selectedBuilding.cost) * 100)
      : 0;

  return (
    <div className="building-info-overlay">
      <div className="building-info-panel">
        <div className="info-header">
          <h2>
            <FontAwesomeIcon icon={selectedBuilding.icon} />
            {selectedBuilding.name}
          </h2>
          <button className="close-btn" onClick={onClose}>
            {t.close}
          </button>
        </div>

        <div className="info-content">
          {/* Basic building info */}
          <div className="info-section">
            <h3>{t.buildingInfo}</h3>

            <div className="info-row">
              <span className="info-label">{t.cost}:</span>
              <span
                className={`info-value ${
                  canAfford ? "affordable" : "expensive"
                }`}
              >
                ${selectedBuilding.cost.toLocaleString()}
              </span>
            </div>

            {selectedBuilding.income > 0 && (
              <div className="info-row">
                <span className="info-label">{t.income}:</span>
                <span className="info-value income">
                  ${selectedBuilding.income.toLocaleString()}
                </span>
              </div>
            )}

            {selectedBuilding.unlockLevel && (
              <div className="info-row">
                <span className="info-label">{t.unlockLevel}:</span>
                <span
                  className={`info-value ${isUnlocked ? "unlocked" : "locked"}`}
                >
                  {selectedBuilding.unlockLevel}
                </span>
              </div>
            )}

            {selectedBuilding.happinessBonus && (
              <div className="info-row">
                <span className="info-label">{t.happinessBonus}:</span>
                <span className="info-value happiness">
                  +{selectedBuilding.happinessBonus}%
                </span>
              </div>
            )}
          </div>

          {/* Resources needed */}
          <div className="info-section">
            <h3>{t.resourcesNeeded}</h3>

            <div className="resource-comparison">
              <div className="resource-item">
                <span className="resource-icon">💧</span>
                <span className="resource-name">{t.water}:</span>
                <span
                  className={`resource-amount ${
                    hasEnoughWater ? "sufficient" : "insufficient"
                  }`}
                >
                  {selectedBuilding.resources.water}
                </span>
                <span className="resource-available">
                  ({resources.water} {t.available})
                </span>
              </div>

              <div className="resource-item">
                <span className="resource-icon">⚡</span>
                <span className="resource-name">{t.power}:</span>
                <span
                  className={`resource-amount ${
                    hasEnoughPower ? "sufficient" : "insufficient"
                  }`}
                >
                  {selectedBuilding.resources.power}
                </span>
                <span className="resource-available">
                  ({resources.power} {t.available})
                </span>
              </div>

              <div className="resource-item">
                <span className="resource-icon">🏗️</span>
                <span className="resource-name">{t.materials}:</span>
                <span
                  className={`resource-amount ${
                    hasEnoughMaterials ? "sufficient" : "insufficient"
                  }`}
                >
                  {selectedBuilding.resources.materials}
                </span>
                <span className="resource-available">
                  ({resources.materials} {t.available})
                </span>
              </div>
            </div>
          </div>

          {/* Resources produced (if any) */}
          {selectedBuilding.resourceProduction && (
            <div className="info-section">
              <h3>{t.resourcesProduced}</h3>
              <div className="production-info">
                {Object.entries(selectedBuilding.resourceProduction).map(
                  ([resource, amount]) => (
                    <div key={resource} className="production-item">
                      <span className="production-icon">
                        {resource === "water"
                          ? "💧"
                          : resource === "power"
                          ? "⚡"
                          : "🏗️"}
                      </span>
                      <span className="production-name">
                        {resource === "water"
                          ? t.water
                          : resource === "power"
                          ? t.power
                          : t.materials}
                        :
                      </span>
                      <span className="production-amount">
                        +{amount} {t.perSecond}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Building stats */}
          {selectedBuilding.income > 0 && (
            <div className="info-section">
              <h3>{t.buildingStats}</h3>

              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-label">{t.efficiency}:</span>
                  <span
                    className={`stat-value ${
                      efficiency > 20
                        ? "good"
                        : efficiency > 10
                        ? "average"
                        : "poor"
                    }`}
                  >
                    {efficiency}%
                  </span>
                </div>

                <div className="stat-item">
                  <span className="stat-label">{t.maintenanceCost}:</span>
                  <span className="stat-value">
                    ${Math.round(selectedBuilding.cost * 0.1)} {t.perSecond}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Upgrade info */}
          {selectedBuilding.upgrade && (
            <div className="info-section">
              <h3>{t.upgrade}</h3>
              <div className="upgrade-info">
                <span className="upgrade-name">{selectedBuilding.upgrade}</span>
              </div>
            </div>
          )}

          {/* Status summary */}
          <div className="info-section status-section">
            <div
              className={`status-item ${canAfford ? "positive" : "negative"}`}
            >
              {canAfford ? t.canAfford : t.cannotAfford}
            </div>
            <div
              className={`status-item ${
                hasAllResources ? "positive" : "negative"
              }`}
            >
              {hasAllResources ? t.hasResources : t.needsMoreResources}
            </div>
            {!isUnlocked && (
              <div className="status-item negative">
                🔒 {t.unlockLevel} {selectedBuilding.unlockLevel}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CityBuilderInfo;
