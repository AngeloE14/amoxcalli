// ============================================================
// src/App.jsx — Componente raíz de la aplicación React
// ============================================================
// Este es el "cerebro" de la aplicación. Define:
// 1. El sistema de rutas (qué componente se muestra en cada URL)
// 2. Los proveedores de contexto (Auth y Toast) que dan estado global
// 3. La barra de navegación (Navbar) que aparece en todas las páginas

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProveedorAuth } from './context/AuthContext';
import { ProveedorToast } from './context/ToastContext';
import Navbar from './components/Navbar';
import RutaProtegida from './components/ProtectedRoute';

// Importar todas las páginas de la aplicación
import Inicio from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Planes from './pages/Plans';
import Catalogo from './pages/Catalog';
import DetalleLibro from './pages/BookDetail';
import MiBiblioteca from './pages/MyLibrary';
import Perfil from './pages/Profile';
import AdminLibros from './pages/AdminBooks';
import Pago from './pages/Payment';
import HistorialCompras from './pages/PurchaseHistory';
import LectorPdf from './pages/PdfReader';
import NoEncontrado from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      {/* ProveedorAuth: da acceso global al estado de usuario (logueado/deslogueado) */}
      <ProveedorAuth>
        {/* ProveedorToast: da acceso global al sistema de notificaciones */}
        <ProveedorToast>
          {/* Navbar: barra de navegación que aparece en TODAS las páginas */}
          <Navbar />
          <main className="container">
            <Routes>
              {/* ========== Rutas públicas (accesibles sin login) ========== */}
              <Route path="/" element={<Inicio />} />             {/* Página principal / landing */}
              <Route path="/login" element={<Login />} />         {/* Formulario de inicio de sesión */}
              <Route path="/register" element={<Register />} />   {/* Formulario de registro */}
              <Route path="/plans" element={<Planes />} />        {/* Selección de plan de suscripción */}
              <Route path="/catalog" element={<Catalogo />} />    {/* Catálogo de libros con filtros */}
              <Route path="/books/:id" element={<DetalleLibro />} /> {/* Detalle de un libro específico */}

              {/* ========== Rutas protegidas (requieren estar logueado) ========== */}
              {/* <RutaProtegida> redirige a /login si no hay sesión */}
              <Route path="/books/:id/read" element={<RutaProtegida><LectorPdf /></RutaProtegida>} />       {/* Lector de PDF */}
              <Route path="/payment/:id" element={<RutaProtegida><Pago /></RutaProtegida>} />               {/* Página de pago */}
              <Route path="/library" element={<RutaProtegida><MiBiblioteca /></RutaProtegida>} />           {/* Biblioteca personal */}
              <Route path="/profile" element={<RutaProtegida><Perfil /></RutaProtegida>} />                 {/* Perfil de usuario */}
              <Route path="/purchase-history" element={<RutaProtegida><HistorialCompras /></RutaProtegida>} /> {/* Historial de compras */}
              <Route path="/admin/books" element={<RutaProtegida><AdminLibros /></RutaProtegida>} />        {/* Panel de admin */}

              {/* Ruta 404: cualquier URL no reconocida muestra "No encontrado" */}
              <Route path="*" element={<NoEncontrado />} />
            </Routes>
          </main>
        </ProveedorToast>
      </ProveedorAuth>
    </BrowserRouter>
  );
}

export default App;
