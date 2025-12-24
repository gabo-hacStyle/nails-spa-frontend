  import { useNavigate } from 'react-router-dom';
import nailsLogo from '../assets/logo.svg';
import './styles/Navbar.css'; 
import { logoutAccount } from '../api/auth';
import axios from 'axios';
import { useContext } from 'react';
import { isAuthenticatedContext } from '../context/IsAuthenticatedContext';
import toast from 'react-hot-toast';
import Cookies from "js-cookie";

function Navbar() {
   const role = Cookies.get("role");
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useContext(isAuthenticatedContext);

  const handleLogout = async () => {
    try {
      const response = await logoutAccount();
      toast.success(response.data.message || "Sesión cerrada correctamente");
      setIsAuthenticated(false);
      navigate("/");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.error || "Error al cerrar sesión");
      } else {
        toast.error("Error inesperado al cerrar sesión");
      }
    }
  };

  return (
    <header className="sticky top-0 w-full bg-white/95 backdrop-blur-sm border-b border-pink-200 shadow-sm z-50">
      <div className="flex items-center justify-between px-10 py-3 max-w-7xl mx-auto">
        <section className="flex items-center gap-3 flex-1 justify-start">
          <a href="/about" className="text-gray-700 hover:text-pink-600 font-medium px-3 py-2 rounded-lg transition-colors">Sobre nosotros</a>
          <a href="/sedes" className="text-gray-700 hover:text-pink-600 font-medium px-3 py-2 rounded-lg transition-colors">Nuestras sedes</a>
          <a href="/services" className="text-gray-700 hover:text-pink-600 font-medium px-3 py-2 rounded-lg transition-colors">Nuestros servicios</a>
        </section>
        
        <section className="flex items-center justify-center">
          <a href="/" rel="noopener noreferrer">
              <img src={nailsLogo} className="logo" alt="NailSpa logo" />
          </a>
        </section>
        
        <section className="flex items-center gap-3 flex-1 justify-end">
         {(role === "customer" || role === undefined) && <a href="/citas" className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm">Agenda tu cita</a>}
          {isAuthenticated ? (
            <>
              <a href="/mis-citas" className="text-gray-700 hover:text-pink-600 font-medium px-3 py-2 rounded-lg transition-colors">Mis citas</a>
              {/* {
                role !== "customer" && (
                 <a href="/dashboard" className="text-gray-700 hover:text-pink-600 font-medium px-3 py-2 rounded-lg transition-colors">Dashboard</a>
                )
              } */}
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-pink-600 font-medium px-3 py-2 rounded-lg transition-colors"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <a
              href="/login"
              className="text-gray-700 hover:text-pink-600 font-medium px-3 py-2 rounded-lg transition-colors"
            >
              Iniciar Sesión
            </a>
          )}
        </section>
      </div>
    </header>
  )
}

export default Navbar;