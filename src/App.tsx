import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Reinvest from "./pages/reinvest";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/reinvest" element={<Reinvest />} />
        <Route path="/" element={<h1>✅ Home Works</h1>} />
      </Routes>
    </Router>
  );
}
