import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StartScreen from "./StartScreen";
import CityBuilder from "./CityBuilder";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartScreen />} />
        <Route path="/startscreen" element={<StartScreen />} />
        <Route path="/citybuilder" element={<CityBuilder />} />
      </Routes>
    </Router>
  );
}

export default App;






