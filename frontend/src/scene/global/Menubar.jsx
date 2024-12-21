import React, { useContext, useState, useEffect } from 'react';
import { Badge, Button, Drawer, Menu } from 'antd';
import { Link } from 'react-router-dom';
import './global.css';
import { ThemeContext } from '../ThemeContext';
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaCity, FaUser, FaTachometerAlt, FaClipboardList } from "react-icons/fa";
import { IoWalletSharp } from "react-icons/io5";
import { LuBox, LuScanLine } from "react-icons/lu";
import { BiNote, BiTagAlt } from "react-icons/bi";
import { BsFillFileEarmarkSpreadsheetFill, BsFillInboxesFill } from "react-icons/bs";
import { CgDanger } from "react-icons/cg";
import StoreDown from './StoreDown'; // Ensure this component is correctly implemented
import { MdEditNotifications, MdFactCheck } from "react-icons/md";
import Solde from '../components/portfeuille/components/SoldeCart';
import DemandeRetrait from '../components/portfeuille/components/DemandeRetrait';
import { useDispatch , useSelector } from 'react-redux';
import { FaUserFriends } from "react-icons/fa"
import { FaBoxesPacking, FaFileInvoiceDollar, FaRegSquarePlus } from "react-icons/fa6";
import { MdPayment } from "react-icons/md";
import { RiDiscountPercentLine } from "react-icons/ri";
import { CiMenuFries } from 'react-icons/ci';
import { IoIosAdd } from 'react-icons/io';
import { getColisATRToday, getColisExpidée, getColisPret, getColisRamasser, getDemandeRetraitToday, getReclamationToday } from '../../redux/apiCalls/missionApiCalls';


const colorBadge = "rgb(0, 106, 177)"

function Menubar() {
  const { theme } = useContext(ThemeContext);
  const [collapsed, setCollapsed] = useState(JSON.parse(localStorage.getItem('menuCollapsed')) || false);
  const [isNewReclamation, setIsNewReclamation] = useState(false);
  const [openWallet, setOpenWallet] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [userData , setUserData] = useState({})
  const {user} = useSelector(state => state.auth );
  

    const { demandeRetrait, colis, reclamations , colisExp , colisPret , client , colisR } = useSelector((state) => ({
          demandeRetrait: state.mission.demandeRetrait,
          colis: state.mission.colis,
          colisR: state.mission.colisR,
          colisExp: state.mission.colisExp,
          colisPret: state.mission.colisPret,
          reclamations: state.mission.reclamations,
          client : state.mission.client,
      }));

      let totaleColisAdmin = colis.length + colisR.length; 
      let totaleCompteAdmin = client.length ; 
      let totalRetrait = demandeRetrait.length ;
      let totalReclamation = reclamations.length 
  
      const dispatch = useDispatch();
  
      // Function to dispatch actions based on the user role
      const getData = () => {
          if(user?.role === "admin"){
              dispatch(getDemandeRetraitToday());
              dispatch(getReclamationToday());
              dispatch(getColisATRToday());
              dispatch(getColisRamasser());
          }else if(user?.role === "livreur"){
              dispatch(getColisExpidée())
              dispatch(getColisPret())
          } 
      };

  useEffect(()=>{
    setUserData(user)
    getData()
  },[dispatch])

  
 

  const toggleCollapsed = () => {
    const newCollapsedState = !collapsed;
    setCollapsed(newCollapsedState);
    localStorage.setItem('menuCollapsed', JSON.stringify(newCollapsedState));
  };
  const toggleMenu = () =>{
    setOpenMenu(prev => !prev)
    if(!openMenu){
      setCollapsed(true)
    }
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // On mobile devices, keep it collapsed
        setCollapsed(true);
        localStorage.setItem('menuCollapsed', JSON.stringify(true));
      } else {
        // On laptop/desktop devices, force it open
        setOpenMenu(true);
        setCollapsed(false);
        localStorage.setItem('menuCollapsed', JSON.stringify(false));
      }
    };
  
    handleResize(); // Set the initial state on load
    window.addEventListener('resize', handleResize);
  
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={openMenu ? 'menu-bar-open' : 'menu-bar'}>
      <Menu
        mode="inline"
        theme={theme === 'dark' ? 'dark' : 'light'}
        inlineCollapsed={collapsed}
        className='menu'
      >
        <div className= {collapsed ?  'open-menu' : 'open-menu-c'}>
          <Button type='primary' icon={<CiMenuFries />} onClick={toggleMenu}>
          </Button>
        </div>
        <div className={`header-menu reclamation-item`}>
         
            <img
              src={theme === 'dark' ? '/image/logo.png' : '/image/logo-light.png'}
              alt=""
              style={{ width: "50px" }}
              onClick={toggleCollapsed}
            />
        </div>

   

        {/* admin menu items  */}

        <Menu.Item icon={<FaTachometerAlt />}>
          <Link to="/dashboard/home">Accueil</Link>
        </Menu.Item>

        {
          (userData.role === "admin" || userData.role === "team") && (
            <Menu.SubMenu
              icon={<LuBox />}
              title={
                <span>
                  Colis {totaleColisAdmin > 0 ? <Badge count={totaleColisAdmin} color={colorBadge} /> : ""}
                </span>
              }
            >
              <Menu.Item icon={<IoIosAdd />}>
                <Link to="/dashboard/ajouter/colis/admin/simple">Ajouter Colis</Link>
              </Menu.Item>
              <Menu.Item icon={<BiTagAlt />}>
                <Link to="/dashboard/list-colis">List Colis</Link>
              </Menu.Item>
              <Menu.Item icon={<BiTagAlt />}>
                <Link to="/dashboard/colis-ar">
                  Colis Pour Ramassage {colis.length > 0 ? <Badge count={colis.length} color={colorBadge} /> : ""}
                </Link>
              </Menu.Item>
              <Menu.Item icon={<BiTagAlt />}>
                <Link to="/dashboard/colis-r">
                  Colis Ramasse {colisR.length > 0 ? <Badge count={colisR.length} color={colorBadge} /> : ""}
                </Link>
              </Menu.Item>
              <Menu.Item icon={<BiTagAlt />}>
                <Link to="/dashboard/ameex">
                  Colis Ameex 
                </Link>
              </Menu.Item>
              <Menu.Item icon={<MdFactCheck />}>
                <Link to="/dashboard/facture/globale">Fichier</Link>
              </Menu.Item>
            </Menu.SubMenu>
          )
        }


        {
          userData.role ==="admin" && (
            <Menu.Item icon={<LuScanLine />}>
              <Link to="/dashboard/scan">Scan</Link>
            </Menu.Item>
          )
        } 
         {
          userData.role ==="admin" && (
            <Menu.SubMenu 
              icon={<MdPayment />} 
              title={
                <span>
                  Payements {totalRetrait > 0 ? <Badge count={totalRetrait} color={colorBadge} /> : ""}
                </span>
              }
            >
              <Menu.Item icon={<BiTagAlt />} className={isNewReclamation ? "change-color-animation" : ""}>
                <Link to="/dashboard/demande-retrait">
                  Demande retrait {demandeRetrait.length > 0 ? <Badge count={demandeRetrait.length} color={colorBadge} /> : ""}
                </Link>
              </Menu.Item>
              <Menu.Item icon={<BiTagAlt />}>
                <Link to={'/dashboard/transaction'}>
                  List transactions
                </Link>
              </Menu.Item>
              <Menu.Item icon={<BiTagAlt />} className={isNewReclamation ? "change-color-animation" : ""}>
                <Link to="/dashboard/payement/list">
                  List Methode Payement
                </Link>
              </Menu.Item>
            </Menu.SubMenu>
          )
        }
        {
          userData.role === "admin" &&(
            <Menu.SubMenu icon={<FaFileInvoiceDollar />} title="Facture">
                  <Menu.Item icon={<BiTagAlt />}>
                    <Link to="/dashboard/facture/client">Facture ( client )</Link>
                  </Menu.Item>
                  <Menu.Item icon={<BiTagAlt />}>
                    <Link to="/dashboard/facture/retour">Bon Retour</Link>
                  </Menu.Item>
                  <Menu.Item icon={<BiTagAlt />}>
                    <Link to="/dashboard/facture/livreur">Facture ( Livreur )</Link>
                  </Menu.Item>
            </Menu.SubMenu>
          )
        }
        {
          userData.role ==="admin" && (
            <Menu.SubMenu icon={<FaUserFriends />} title={
              <span>
                Compte {totaleCompteAdmin > 0 ? <Badge count={totaleCompteAdmin} color={colorBadge} /> : ""}
              </span>
            }>
              <Menu.Item icon={<BiTagAlt />}>
                <Link to="/dashboard/compte/client">Client {client.length > 0 ? <Badge count={client.length} color={colorBadge} /> : ""}</Link>
              </Menu.Item>
              <Menu.Item icon={<BiTagAlt />}>
                <Link to="/dashboard/compte/livreur">Livreur</Link>
              </Menu.Item>
              {
                userData.type ==="super" && (
                  <Menu.Item icon={<BiTagAlt />}>
                    <Link to="/dashboard/compte/admin">Admin</Link>
                  </Menu.Item>
                )
              }
            </Menu.SubMenu>
          )
        }
        {
          userData.role ==="admin" && (
            <Menu.Item icon={<RiDiscountPercentLine />}>
              <Link to="/dashboard/promotion">Promotions</Link>
            </Menu.Item>
          )
        }

        {
          userData.role ==="admin" && (
            <Menu.SubMenu 
              icon={<CgDanger />} 
              title={
                <span>
                  Reclamations {reclamations.length > 0 ? <Badge count={totalReclamation} color={colorBadge} /> : ""}
                </span>
              }
            >
              <Menu.Item icon={<BiTagAlt />} className={isNewReclamation ? "change-color-animation" : ""}>
                <Link to="/dashboard/reclamation">
                  Reclamation Non Complete {reclamations.length > 0 ? <Badge count={reclamations.length} color={colorBadge} /> : ""}
                </Link>
              </Menu.Item>
              <Menu.Item icon={<BiTagAlt />} className={isNewReclamation ? "change-color-animation" : ""}>
                <Link to="/dashboard/reclamation-complete">List Reclamation</Link>
              </Menu.Item>
            </Menu.SubMenu>
          )
        }

       

        
        
        {
          userData.role ==="admin" && (
              <Menu.Item icon={<BiNote />}>
                <Link to="/dashboard/gnotification">Notifications</Link>
              </Menu.Item>
          )
        }
        {
          userData.role ==="admin" && (
            <Menu.Item icon={<FaCity />}>
              <Link to="/dashboard/ville">Villes</Link>
            </Menu.Item>
          )
        }
        {
          userData.role ==="client" && (
            <>
              <Menu.SubMenu icon={<IoWalletSharp />} title="Portfeuille">
                <Menu.Item icon={<BiTagAlt />}>
                  <Link to={"/dashboard/portfeuille"}>Portfeuille</Link>
                </Menu.Item>
                <Menu.Item icon={<BiTagAlt />}>
                  <Link to={'/dashboard/transaction'}>List transactions</Link>
                </Menu.Item>
              </Menu.SubMenu>
              <Drawer
                title="Portfeuille"
                open={openWallet}
                onClose={() => setOpenWallet(prev => !prev)}
              >
                <Solde />
                <DemandeRetrait setOpenWallet = {setOpenWallet} theme={theme} />
              </Drawer>
            </>
          )
        }

       

        


        {
          userData.role ==="client" && (
            <Menu.SubMenu icon={<LuBox />} title="Gestion colis">
              <Menu.Item icon={<IoIosAdd />}>
                <Link to="/dashboard/ajouter-colis/simple">Ajouter Colis</Link>
              </Menu.Item>
              <Menu.Item icon={<FaClipboardList />}>
                <Link to="/dashboard/list-colis">List Colis</Link>
              </Menu.Item>
              <Menu.Item icon={<FaBoxesPacking />}>
                <Link to="/dashboard/colis-ar">Colis Pour Ramassage</Link>
              </Menu.Item>
              <Menu.Item icon={<BsFillFileEarmarkSpreadsheetFill />}>
                <Link to="/dashboard/import-colis">Import Colis</Link>
              </Menu.Item>
              <Menu.Item icon={<MdFactCheck />}>
                <Link to="/dashboard/facture/globale">Fichier</Link>
              </Menu.Item>
            </Menu.SubMenu>
          )
        }
        {
          userData.role ==="livreur" && (
            <Menu.Item icon={<LuScanLine />}>
              <Link to="/dashboard/scan">Scan</Link>
            </Menu.Item>
          )
        }

        {
          userData.role ==="livreur" && (
            <Menu.SubMenu icon={<LuBox />} title="Espace Livreur">
              <Menu.Item icon={<BiTagAlt />}>
                <Link to="/dashboard/list-colis">List Colis</Link>
              </Menu.Item>
              <Menu.Item icon={<BiTagAlt />}>
                <Link to="/dashboard/colis-ex">Colis Expidée</Link>
              </Menu.Item>
              <Menu.Item icon={<BiTagAlt />}>
                <Link to="/dashboard/colis-rc">Colis Reçu</Link>
              </Menu.Item>
              <Menu.Item icon={<BiTagAlt />}>
                <Link to="/dashboard/colis-md">Colis Mise en distrubution</Link>
              </Menu.Item>
              <Menu.Item icon={<BiTagAlt />}>
                <Link to="/dashboard/colis-l">Colis Livrée</Link>
              </Menu.Item>
            </Menu.SubMenu>
          )
        }

        {
          userData.role === "client" || userData.role==="livreur" && (
            <Menu.SubMenu icon={<FaFileInvoiceDollar />} title="Facture">
              {
                (userData.role === "client" ) && (
                  <Menu.Item icon={<BiTagAlt />}>
                    <Link to="/dashboard/facture/client">Facture ( client )</Link>
                  </Menu.Item>
                )
              }
                  <Menu.Item icon={<BiTagAlt />}>
                    <Link to="/dashboard/facture/retour">Bon Retour</Link>
                  </Menu.Item>
              
              {
                (userData.role === "livreur") && (
                  <Menu.Item icon={<BiTagAlt />}>
                    <Link to="/dashboard/facture/livreur">Facture ( Livreur )</Link>
                  </Menu.Item>
                )
              }
            </Menu.SubMenu>
          )
        }

      </Menu>
      
    </div>
  );
}

export default Menubar;