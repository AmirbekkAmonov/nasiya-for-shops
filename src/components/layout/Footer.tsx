// import { FacebookOutlined, InstagramOutlined, SendOutlined } from "@ant-design/icons";
import '../../styles/components/Footer.scss'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__content">
        <p>© {new Date().getFullYear()} <b>Nasiya Savdo</b> | Barcha huquqlar himoyalangan.</p>
        {/* <p>
          <b>Biz bilan bog‘lanish:</b> 
          <a href="tel:+998901234567"> +998 90 123 45 67</a> |  
          <a href="mailto:support@nasiyasavdo.uz"> support@nasiyasavdo.uz</a>
        </p>
        <div className="footer__social">
          <a href="https://t.me/nasiyasavdo" target="_blank" rel="noopener noreferrer">
            <SendOutlined /> Telegram
          </a>
          <a href="https://facebook.com/nasiyasavdo" target="_blank" rel="noopener noreferrer">
            <FacebookOutlined /> Facebook
          </a>
          <a href="https://instagram.com/nasiyasavdo" target="_blank" rel="noopener noreferrer">
            <InstagramOutlined /> Instagram
          </a>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;
