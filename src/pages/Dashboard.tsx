import { useEffect, useState } from "react";
import { getAppointmentsByEmployeeRequest, getAppointmentsByLocationRequest } from "../api/citas";
import axios from "axios";
import { CitasByEmployee } from "../types/responseAppointmentByEmployee";
import Cookies from "js-cookie";
import CitasCard from "../components/dashboards/CitasCard";
import AdminDashboard from "../components/dashboards/admin/AdminDashboard";
import {location} from "../api/locations";

//Filtrado
import FilterBar, {Filters} from "../components/ui/FilterBar";

const Dashboard = () => {
  const [appointments, setAppointments] = useState<CitasByEmployee[]>([]);
  const [error, setError] = useState<string | null>(null);
 
  const role = Cookies.get("role");
  console.log("Un log para saber si se están guardando las cookies en dashboard:", role);
  const employeeId = Cookies.get("userId") || "";
  const [filters, setFilters] = useState<Filters>({ date: undefined, page: 1, limit: 10 });

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        if (role === "employee") {
          const res = await getAppointmentsByEmployeeRequest(employeeId);
          setAppointments(res.data.data);
        }
        if (role === "manager") {
          const res: any = await getAppointmentsByLocationRequest(location, filters);
          setAppointments(res.data.appointments);
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data.message || "Error al cargar citas");
        } else {
          setError("Error desconocido al cargar citas");
        }
      }
    };

    fetchAppointments();
  }, [filters]);

  if (error) {
    return <p className="text-red-600 text-center mt-6 text-lg font-semibold">{error}</p>;
  }

  if (!["employee", "manager", "admin"].includes(role || "")) {
    return <p className="text-red-600 text-center mt-6 text-lg font-semibold">No autorizado</p>;
  }

  return (
    <div className="px-6 py-8 max-w-6xl mx-auto min-h-[75vh]">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
        {role === "employee" && "Panel de Empleado"}
        {role === "manager" && "Panel de Gerente de sede"}
        {role === "admin" && "Panel de Administrador"}
      </h2>

      <div className="flex flex-col items-center mb-8">
        <p>¿Necesitas un descanso?</p>
        <a
          href="/citas"
          className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          Agenda tu cita
        </a>
      </div>

      {role === "admin" && <AdminDashboard />}

      {(role === "employee" || role === "manager") && (
        <>
          {role === "manager" && (
<>
<h3 className="text-2xl font-bold text-gray-800 my-4">Citas de su sede</h3>
<FilterBar initial={filters} onApply={setFilters} managerFilters />
</>

            
            
          )}
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {appointments.map((cita, i) => (
              <CitasCard key={i} cita={cita} hasLocation={role === "employee"} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;