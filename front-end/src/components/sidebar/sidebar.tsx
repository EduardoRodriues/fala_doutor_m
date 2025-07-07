import { useState } from "react";
import { FaUserMd, FaFileMedicalAlt, FaUser, FaChartBar, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { LuLogOut, LuSettings } from "react-icons/lu";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

export function Sidebar() {
  const location = useLocation();
  const [relatoriosAberto, setRelatoriosAberto] = useState(false);

  const toggleRelatorios = () => {
    setRelatoriosAberto(!relatoriosAberto);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="avatar-wrapper">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png"
            alt="Avatar Médico"
            className="avatar"
          />
          <h2>Fala Doutor</h2>
        </div>
      </div>

      <nav className="menu">
        <ul>
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>
            <li>
              <FaUserMd className="icon" />
              <span>Médicos</span>
            </li>
          </Link>

          <Link
            to="/pacientes"
            className={location.pathname === "/pacientes" ? "active" : ""}
          >
            <li>
              <FaUser className="icon" />
              <span>Pacientes</span>
            </li>
          </Link>

          <Link
            to="/planos"
            className={location.pathname === "/planos" ? "active" : ""}
          >
            <li>
              <FaFileMedicalAlt className="icon" />
              <span>Planos</span>
            </li>
          </Link>

          <li
            className="relatorios-toggle"
            onClick={toggleRelatorios}
            style={{ cursor: "pointer" }}
          >
            <FaChartBar className="icon" />
            <span>Relatórios</span>
            {relatoriosAberto ? (
              <FaChevronUp className="chevron-icon" />
            ) : (
              <FaChevronDown className="chevron-icon" />
            )}
          </li>

          {relatoriosAberto && (
            <div className="submenu-relatorios">
              <Link
                to="/relatorio-medicos"
                className={location.pathname === "/relatorio-medicos" ? "active" : ""}
              >
                <li>Médicos</li>
              </Link>
              <Link
                to="/relatorio-pacientes"
                className={location.pathname === "/relatorio-pacientes" ? "active" : ""}
              >
                <li>Pacientes</li>
              </Link>
              <Link
                to="/relatorio-planos"
                className={location.pathname === "/relatorio-planos" ? "active" : ""}
              >
                <li>Planos</li>
              </Link>
            </div>
          )}
        </ul>
      </nav>

      <div className="bottom-buttons">
        <LuSettings className="settings-icon" />
        <LuLogOut className="logout-icon" />
      </div>
    </aside>
  );
}
