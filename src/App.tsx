import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Reinvest from "./pages/reinvest";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1>✅ Home is working</h1>} />
        <Route path="/reinvest" element={<Reinvest />} />
      </Routes>
    </Router>
  );
}
