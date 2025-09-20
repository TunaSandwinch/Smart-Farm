import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Analytics from "./pages/Analytics";
import Logs from "./pages/Logs";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";


export default function App() {
  return (
    <Router basename="/Smart-Farm">
      <Header />
      <Routes>
        {/* Default route = Dashboard */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/logs" element={<Logs />} />

        {/* Catch-all -> Dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
