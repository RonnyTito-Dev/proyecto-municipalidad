// App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import PublicHomeLayout from './layouts/PublicHomeLayout';
import LoginPage from './pages/Public/LoginPage';
import CreateRequestPage from './pages/Public/CreateRequestPage';
import TrackRequestPage from './pages/Public/TrackRequestPage';

import DashboardLayout from './layouts/DashboardLayout';

import InicioPage from './pages/Private/InicioPage';

import AsistentPage from './pages/Private/AsistentePage';
import TodasSolicitudesPage from './pages/Private/TodasSolitudesPages';
import RegistrarSolicitudPage from './pages/Private/RegistrarSolicitudPage';
import AreasPage from './pages/Private/AreasPage';
import UsuariosPage from './pages/Private/UsuariosPage';
import RolesPage from './pages/Private/RolesPage';
import MiCuentaPage from './pages/Private/MiCuentaPage';
import LogsPage from './pages/Private/LogsPage';

const App = () => (
    <Router>
        <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<PublicHomeLayout />}>
                <Route index element={<CreateRequestPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="track-request" element={<TrackRequestPage />} />
            </Route>

            {/* Rutas privadas: Dashboard */}
            <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<InicioPage />} />
                <Route path="areas" element={<AreasPage />} />
                <Route path="usuarios" element={<UsuariosPage />} />
                <Route path="roles" element={<RolesPage />} />
                <Route path="logs" element={<LogsPage />} />
                <Route path="asistente" element={<AsistentPage />} />
                <Route path="mi-cuenta" element={<MiCuentaPage />} />

                {/* Rutas para solicitudes */}
                <Route path="solicitudes/todas" element={<TodasSolicitudesPage />} />
                <Route path="solicitudes/crear" element={<RegistrarSolicitudPage />} />

                {/* Agrupación de rutas bajo "configuracion" */}

            </Route>

        </Routes>
    </Router>
);

export default App;

