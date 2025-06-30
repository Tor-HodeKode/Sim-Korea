import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faBuilding, faTree, faSchool, faHospital, faRoad, faCar, faCity, faSeedling } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import Particles from "react-tsparticles"; // Importer Particles
import "./CityBuilder.css";

const coinSound = "/Sounds/Cash.mp3";
const gridSize = 10;

const buildings = [
  { type: "house", name: "Hus", cost: 50, income: 0, resources: { water: 10, power: 5, materials: 20 }, icon: faHouse },
  { type: "office", name: "Kontor", cost: 100, income: 20, resources: { water: 20, power: 20, materials: 40 }, icon: faBuilding },
  { type: "school", name: "Skole", cost: 150, income: 30, resources: { water: 30, power: 20, materials: 50 }, icon: faSchool },
  { type: "hospital", name: "Sykehus", cost: 250, income: 40, resources: { water: 50, power: 60, materials: 70 }, icon: faHospital },
  { type: "road", name: "Vei", cost: 75, income: 0, resources: { water: 0, power: 0, materials: 20 }, icon: faRoad, upgrade: "highway" },
  { type: "highway", name: "Motorvei", cost: 150, income: 0, resources: { water: 0, power: 0, materials: 50 }, icon: faCar, upgrade: "luxury-road" },
  { type: "luxury-road", name: "Luksusvei", cost: 250, income: 0, resources: { water: 0, power: 0, materials: 100 }, icon: faCity, upgrade: null },
  { type: "seed", name: "Seed", cost: 50, income: 0, resources: { water: 0, power: 0, materials: 100 }, icon: faSeedling, upgrade: "tree" },
  { type: "tree", name: "Tree", cost: 50, income: 0, resources: { water: 0, power: 0, materials: 100 }, icon: faTree, upgrade: null }
];


function CityBuilder() {
  const [grid, setGrid] = useState(
    () => JSON.parse(localStorage.getItem("cityGrid")) ||
    Array(gridSize).fill(null).map(() => Array(gridSize).fill(null))
  );
  const [money, setMoney] = useState(() => JSON.parse(localStorage.getItem("money")) || 500);
  const [happiness, setHappiness] = useState(() => JSON.parse(localStorage.getItem("happiness")) || 100);
  const [resources, setResources] = useState(() => JSON.parse(localStorage.getItem("resources")) || {
    water: 500,
    power: 500,
    materials: 500
  });

  const [selectedBuilding, setSelectedBuilding] = useState(buildings[0]);

  useEffect(() => {
    localStorage.setItem("cityGrid", JSON.stringify(grid));
    localStorage.setItem("money", JSON.stringify(money));
    localStorage.setItem("happiness", JSON.stringify(happiness));
    localStorage.setItem("resources", JSON.stringify(resources));
  }, [grid, money, happiness, resources]);

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
        materials: prev.materials - selectedBuilding.resources.materials
      }));

      updateHappiness(selectedBuilding.type);
    } else {
      alert("Du har ikke nok ressurser til å bygge denne bygningen.");
    }
  };

  const upgradeBuilding = (row, col) => {
    const currentType = grid[row][col];
    const currentBuilding = buildings.find((b) => b.type === currentType);

    if (currentBuilding && currentBuilding.upgrade) {
      const nextBuilding = buildings.find((b) => b.type === currentBuilding.upgrade);

      if (money >= nextBuilding.cost && resources.materials >= nextBuilding.resources.materials) {
        const newGrid = [...grid];
        newGrid[row][col] = nextBuilding.type;
        setGrid(newGrid);
        setMoney(money - nextBuilding.cost);

        setResources((prev) => ({
          ...prev,
          materials: prev.materials - nextBuilding.resources.materials
        }));
      } else {
        alert("Du har ikke nok ressurser til å oppgradere denne bygningen.");
      }
    }
  };

  const collectIncome = () => {
    const income = grid.flat().reduce((total, cell) => {
      const building = buildings.find((b) => b.type === cell);
      return total + (building ? building.income : 0);
    }, 0);

    if (income > 0) {
      setMoney(money + income);
      const audio = new Audio(coinSound); // Spill av myntlyd
      audio.play();
    }
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
      default:
        happinessChange = 0;
        break;
    }

    setHappiness((prevHappiness) => Math.min(100, Math.max(0, prevHappiness + happinessChange)));
  };

  return (
    <div className="city-container">
      {/* Legg til partikler */}
      <Particles
        options={{
          particles: {
            number: {
              value: 100,
              density: {
                enable: true,
                value_area: 800
              }
            },
            shape: {
              type: "circle"
            },
            size: {
              value: 3
            },
            move: {
              speed: 1
            }
          }
        }}
      />
      
      <h1>Bygg din by! 🏙️</h1>
      <p>💰 Penger: {money}</p>
      <p>💖 Lykke: {happiness}%</p>
      <p>💧 Vann: {resources.water} | ⚡ Strøm: {resources.power} | 🏗️ Materialer: {resources.materials}</p>

      <div className="building-selector">
        {buildings.map((building) => (
          <button
            key={building.type}
            onClick={() => setSelectedBuilding(building)}
            className={selectedBuilding.type === building.type ? "selected" : ""}
          >
            <FontAwesomeIcon icon={building.icon} /> {building.name} (${building.cost})
          </button>
        ))}
      </div>

      <div className="grid">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const building = buildings.find((b) => b.type === cell);
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`cell ${building ? `building ${building.type}` : ""}`}
                onClick={() => (building && building.upgrade ? upgradeBuilding(rowIndex, colIndex) : placeBuilding(rowIndex, colIndex))}
              >
                {building ? <FontAwesomeIcon icon={building.icon} /> : "⬜"}
              </div>
            );
          })
        )}
      </div>

      <button className="collect-btn" onClick={collectIncome}>💰 Samle inntekt</button>
    </div>
  );
}

export default CityBuilder;






