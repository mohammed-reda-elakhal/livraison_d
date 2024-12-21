import { Link as ScrollLink } from 'react-scroll';
import { CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

function Navbar({ languageOptions, languageSelected, handleLanguageChange, setToggleMenu, toogleMenu }) {
  const Menu = () => {
    setToggleMenu((prev) => !prev);
  };

  const navigate = useNavigate()

  const handleLinkClick = () => {
    setToggleMenu(false); // Close the menu on link click
  };

  return (
    <div className={`navbar ${toogleMenu ? 'open' : ''}`}>
      <div className="navbar-header">
        <img src="/image/logo_2.png" alt="" style={{ width: '50px' }} />
        <div className="close-navbar-icon" onClick={Menu}>
          <CloseOutlined />
        </div>
      </div>
      <div className="navbar-groupe-link">
        <ScrollLink
          style={{cursor:'pointer'}}
          to="home"
          smooth={true}
          duration={500}
          offset={-70} // Adjust based on fixed header height
          className="navbar-link"
          onClick={handleLinkClick} // Close menu when clicked
        >
          Accueil
        </ScrollLink>
        <ScrollLink
          to="about"
          smooth={true}
          duration={500}
          offset={-70}
          className="navbar-link"
          style={{cursor:'pointer'}}
          onClick={handleLinkClick}
        >
          A propos
        </ScrollLink>
        <ScrollLink
          to="service"
          smooth={true}
          duration={500}
          offset={-70}
          className="navbar-link"
          style={{cursor:'pointer'}}
          onClick={handleLinkClick}
        >
          Service
        </ScrollLink>
        <ScrollLink
          to="contact"
          smooth={true}
          duration={500}
          offset={-70}
          className="navbar-link"
          style={{cursor:'pointer'}}
          onClick={handleLinkClick}
        >
          Contact
        </ScrollLink>
        <ScrollLink
          to="tarif"
          smooth={true}
          duration={500}
          offset={-70}
          className="navbar-link"
          style={{cursor:'pointer'}}
          onClick={handleLinkClick}
        >
          Tarif
        </ScrollLink>
      </div>
      <div className="navbar-footer">
        <button onClick={() => {navigate("/register"); handleLinkClick();}} className="header-bottom-link">
          Devenir Client
        </button>
        <button onClick={() => {navigate("/register/livreur"); handleLinkClick();}} className="header-bottom-link">
          Devenir Livreur
        </button>
        <button onClick={() => {navigate("/login"); handleLinkClick();}} className="header-bottom-link">
          Connexion
        </button>
      </div>
    </div>
  );
}

export default Navbar;
