import { CalendarOutlined } from "@ant-design/icons";
import '../styles/pages/Home.scss'
function Home() {
  return (
    <div className="Home">
        <div className="container">
            <div className="Home__user">
                <div className="Home__user-info">
                     <img src="/imgs/user.svg" alt="" />
                    <p>Shunchaki</p>
                </div>
                <button className="calendar"><CalendarOutlined style={{ fontSize: "24px", color: "#735CD8" }} classID="calendar-icon" />
                </button>
            </div>
        </div>
    </div>
  )
}

export default Home