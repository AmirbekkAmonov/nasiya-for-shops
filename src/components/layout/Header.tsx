import { useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Switch, ConfigProvider, theme, Select } from "antd";
import { MoonOutlined, SunOutlined, HomeOutlined, UserOutlined, FileTextOutlined, SettingOutlined } from "@ant-design/icons";
import { useStore } from "../../hooks/useStore";
import "../../styles/components/Header.scss";

function Header() {
  const { darkMode, setDarkMode, language, setLanguage } = useStore();

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <div className="Header">
        <div className="container">
          <Link to="/">
            <img src="/imgs/LOGO.svg" alt="Logo" className="Header__logo" />
          </Link>
          <div className="Header__links">
            <NavLink to="/" className="Header__link">
              <HomeOutlined style={{ fontSize: "18px", transition: "all 0.2s ease-in-out" }} className="Header__icon" />
              <p>Asosiy</p>
            </NavLink>
            <NavLink to="/customers" className="Header__link">
              <UserOutlined style={{ fontSize: "18px", transition: "all 0.2s ease-in-out" }} className="Header__icon" />
              <p>Mijozlar</p>
            </NavLink>
            <NavLink to="/reports" className="Header__link">
              <FileTextOutlined style={{ fontSize: "18px", transition: "all 0.2s ease-in-out" }} className="Header__icon" />
              <p>Hisobot</p>
            </NavLink>
            <NavLink to="/settings" className="Header__link">
              <SettingOutlined style={{ fontSize: "18px", transition: "all 0.2s ease-in-out" }} className="Header__icon" />
              <p>Sozlamalar</p>
            </NavLink>
          </div>

          <div className="Header__content">
            <Switch
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              checkedChildren={<MoonOutlined />}
              unCheckedChildren={<SunOutlined />}
            />
            <Select
              value={language}
              onChange={setLanguage}
              style={{ width: 100, marginLeft: "10px" }}
              options={[
                { value: "uz", label: "🇺🇿 UZ" },
                { value: "en", label: "🇬🇧 EN" },
                { value: "ru", label: "🇷🇺 RU" },
              ]}
            />
          </div>


        </div>
      </div>
    </ConfigProvider>
  );
}

export default Header;
