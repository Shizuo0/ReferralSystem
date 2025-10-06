import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="/register" element={<Register />} />
        {/* Outras rotas serão adicionadas nas próximas issues */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
