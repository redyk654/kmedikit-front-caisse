import './App.css';
import { useContext, useEffect, useState } from 'react';
import '@coreui/coreui/dist/css/coreui.min.css'
import Entete from './Composants/Entete/Entete';
import Connexion from './Composants/Connexion/Connexion';
import Commande from './Composants/Commande/Commande';
import Historique from './Composants/Historique/Historique';
import Comptes from './Composants/Comptes/Comptes';
import GestionFactures from './Composants/GestionFactures/GestionFactures';
import GestionRecette from './Composants/GestionRecette/GestionRecette';
import VueRecettes from './Composants/VueRecettes/VueRecettes';
import Pharmacie from './Composants/Pharmacie/Pharmacie';
import Apercu from './Composants/Apercu/Apercu';
import Assurance from './Composants/Assurance/Assurance';
import FacturesAssurances from './Composants/FacturesAssurances/FacturesAssurances';
import Modifier from './Composants/Modifier/Modifier';
import { FaUsers, FaCoins, FaClipboardList, FaPlusSquare, FaReceipt, FaStore } from 'react-icons/fa';
import { RiSurveyFill } from "react-icons/ri";
import { FiSettings } from "react-icons/fi";
import { BsSpeedometer2 } from "react-icons/bs";

import { ContextChargement } from './Context/Chargement';
import { ROLES, liensPhilmedical, nomDns } from "./shared/Globals";
import TableauDeBord from './Composants/TableauDeBord/TableauDeBord';
import ListingFactures from './Composants/Listing/ListingFactures';


function App() {

  const {role, setRole} = useContext(ContextChargement);

  const [onglet, setOnglet] = useState(1);
  const [connecter, setConnecter] = useState(false);
  const [nomConnecte, setNomConnecte] = useState('');
  const [delayLoad, setDelay] = useState(0);

  useEffect(() => {
    // Initialisation depuis localStorage
    const user = localStorage.getItem('user');
    if (user) {
      const { nom_user, rol } = JSON.parse(user);
      setNomConnecte(nom_user);
      setRole(rol);
      setConnecter(true);
    }
  }, []);

  useEffect(() => {
    if(role === ROLES.regisseur) {
      setOnglet(5);
    } else {
      setOnglet(1);
    }
  }, [role, connecter]);

  let contenu;
  switch(onglet) {
    case 1:
      contenu = <Commande delayLoad={delayLoad} nomConnecte={nomConnecte} setConnecter={setConnecter} setOnglet={setOnglet} />
      break;
    case 2:
      contenu = <GestionFactures nomConnecte={nomConnecte} role={role} />;
      break;
    case 3:
      contenu = <Historique nomConnecte={nomConnecte} setConnecter={setConnecter} setOnglet={setOnglet} />
      break;
    case 4:
      contenu = <Comptes nomConnecte={nomConnecte} role={role} />
      break;
    case 5:
      contenu = <GestionRecette nomConnecte={nomConnecte} setConnecter={setConnecter} setOnglet={setOnglet} />
      break;
    case 6:
      contenu = <VueRecettes nomConnecte={nomConnecte} role={role} />
      break;
    case 7:
      contenu = <Pharmacie delayLoad={delayLoad} nomConnecte={nomConnecte} />
      break;
    case 8:
      contenu = <Apercu setOnglet={setOnglet} delayLoad={delayLoad} nomConnecte={nomConnecte} setConnecter={setConnecter} role={role} />
      break;
    case 9:
      contenu = <Assurance nomConnecte={nomConnecte} />
      break;
    case 10:
      contenu = <FacturesAssurances nomConnecte={nomConnecte} />
      break;
    case 11:
      contenu = <Modifier delayLoad={delayLoad} nomConnecte={nomConnecte} />
      break;
    case 12:
      contenu = <TableauDeBord nomConnecte={nomConnecte} />
      break;
    case 13:
      contenu = <ListingFactures setOnglet={setOnglet} delayLoad={delayLoad} nomConnecte={nomConnecte} setConnecter={setConnecter} role={role} />
      break;
    default:
      break;
  }

  if (connecter) {
    if (role.toLowerCase() === ROLES.caissier || role.toLowerCase() === ROLES.regisseur) {
      return (
        <div className="layout">
          <aside className="sidebar">
            <Entete nomConnecte={nomConnecte} setConnecter={setConnecter} setOnglet={setOnglet} role={role} sidebar />
            <nav className="sidebar-nav">
              {role.toLowerCase() === ROLES.caissier ? (
                <>
                  <div className={`tab ${onglet === 1 ? 'active' : ''}`} onClick={ () => {setOnglet(1)}}>
                    <FaStore size={22} />
                    <span>Actes Caisse</span>
                  </div>
                  <div className={`tab ${onglet === 11 ? 'active' : ''}`} onClick={ () => {setOnglet(11)}}>
                    <FiSettings size={20} />
                    <span>Modifier Actes</span>
                  </div>
                  <div className={`tab ${onglet === 7 ? 'active' : ''}`} onClick={ () => {setOnglet(7)}}>
                    <FaPlusSquare size={24} />
                    <span>Factures Pharmacie</span>
                  </div>
                  <div className={`tab ${onglet === 8 ? 'active' : ''}`} onClick={ () => {setOnglet(8)}}>
                    <FaClipboardList size={22} />
                    <span>Listing Actes</span>
                  </div>
                  <div className={`tab ${onglet === 13 ? 'active' : ''}`} onClick={ () => {setOnglet(13)}}>
                    <FaReceipt size={22} />
                    <span>Listing Factures</span>
                  </div>
                  <div className={`tab ${onglet === 2 ? 'active' : ''}`} onClick={ () => {setOnglet(2)}}>
                    <FaReceipt size={22} />
                    <span>Factures Actes</span>
                  </div>
                </>
              ) : (
                <>
                  <div className={`tab ${onglet === 8 ? 'active' : ''}`} onClick={ () => {setOnglet(8)}}>
                    <FaClipboardList size={19} />
                    <span>Listing</span>
                  </div>
                  <div className={`tab ${onglet === 5 ? 'active' : ''}`} onClick={ () => {setOnglet(5)}}>
                    <FaCoins size={18} />
                    <span>Recettes</span>
                  </div>
                  <div className={`tab ${onglet === 11 ? 'active' : ''}`} onClick={ () => {setOnglet(11)}}>
                    <FiSettings size={20} />
                    <span>Modifier</span>
                  </div>
                  <div className={`tab ${onglet === 4 ? 'active' : ''}`} onClick={ () => {setOnglet(4)}}>
                    <FaUsers size={20} />
                    <span>Comptes</span>
                  </div>
                </>
              )}
            </nav>
          </aside>
          <main className="main-content">
            {contenu}
          </main>
        </div>
      );
    } else {
      return (
        <main className='app text-center'>
          <div className='float-start px-3'>
                <a href={`${liensPhilmedical.acceuil}`} className='link-dark' role='button'>
                    retour à l'accueil
                </a>
          </div>
          <strong className='text-bg-danger text-light'>
            Vous n'avez pas les droits pour accéder à cette page.
          </strong>
        </main>
      )
    }
  } else {
    return (
      <Connexion
        connecter={connecter}
        setConnecter={setConnecter}
        nomConnecte={nomConnecte}
        setNomConnecte={setNomConnecte}
        role={role}
        setRole={setRole}
        setOnglet={setOnglet}
      />
    )
  }
}

export default App;