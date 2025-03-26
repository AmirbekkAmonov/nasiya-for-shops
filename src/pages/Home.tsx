import { useState } from "react";
import { Drawer } from "antd";
import {
    CalendarOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
    WalletOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/uz-latn";
import "../styles/pages/Home.scss";

dayjs.locale("uz");

function Home() {
    const [isVisible, setIsVisible] = useState(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(dayjs());

    return (
        <div className="Home">
            <div className="container">
                <div className="Home__user">
                    <div className="Home__user-info">
                        <img src="/imgs/user.svg" alt="" />
                        <p>Shunchaki</p>
                    </div>
                    <button className="calendar" onClick={() => {
                        setSelectedDate(dayjs());
                        setIsDrawerOpen(true);
                    }}>
                        <CalendarOutlined style={{ fontSize: "24px", color: "#735CD8" }} />
                    </button>
                </div>

                <Drawer
                    title="📅 Kalendar"
                    placement="right"
                    closable={true}
                    onClose={() => setIsDrawerOpen(false)}
                    open={isDrawerOpen}
                    width={350}
                    className="drawer"
                >
                    <div className="drawer-price">
                        <p>Oylik jami:</p>
                        <h3>50 125 000 so'm</h3>
                    </div>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="uz-latn">
                        <DemoItem>
                            <DateCalendar
                                value={selectedDate}
                                views={["year", "month", "day"]}
                                onChange={(date) => setSelectedDate(date)}
                            />
                        </DemoItem>
                    </LocalizationProvider>
                    <div className="drawer-content">
                        <h3>{selectedDate ? `${dayjs(selectedDate).locale("uz-latn").format("D MMMM")} kuni to'lov kutilmoqda` : "Sana tanlanmagan"}</h3>
                        <div className="drawer-content__cards">
                            <div className="drawer-content__cards-item">
                                <h4>Avazbek Jahongirov</h4>
                                <p>UZS 1 000 000</p>
                            </div>
                            <div className="drawer-content__cards-item">
                                <h4>Otabek Sulaymonov</h4>
                                <p>UZS 1 000 000</p>
                            </div>
                            <div className="drawer-content__cards-item">
                                <h4>Sardor Murodov</h4>
                                <p>UZS 1 000 000</p>
                            </div>
                        </div>
                    </div>
                </Drawer>
                <div className="Home__cards">
                    <div className="prices">
                        <div className="prices-item">
                            <h3>{isVisible ? "1.000.000 so'm" : "******"}</h3>
                            <p>Umumiy nasiya:</p>
                        </div>
                        <button className="toggle-btn" onClick={() => setIsVisible(!isVisible)}>
                            {isVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                        </button>
                    </div>
                    <div className="cards">
                        <div className="cards-item">
                            <h2>Kechiktirilgan to'lovlar</h2>
                            <p className="cards-item__amount">26</p>
                        </div>
                        <div className="cards-item">
                            <h2>Mijozlar soni</h2>
                            <p className="cards-item__amount2">151</p>
                        </div>
                    </div>
                </div>

                <div className="Home__wallet">
                    <h2>Hamyoningiz</h2>
                    <div className="Home__wallet-info">
                        <div className="wallet">
                            <div className="wallet-icon">
                                <WalletOutlined style={{ fontSize: "24px", color: "#735CD8"}} className="wallet-icon2"  />
                            </div>
                            <div className="wallet-amount">
                                <p>Hisobingizda</p>
                                <h3>300 000 so'm</h3>
                            </div>
                        </div>
                        <button className="wallet-btn">
                            <PlusOutlined style={{ fontSize: "24px", color: "#FFF" }} />
                        </button>
                    </div>
                    <div className="Home__wallet-history">
                        <p>Bu oy uchun to'lov:</p>
                        <h3>To'lov qilingan</h3>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
