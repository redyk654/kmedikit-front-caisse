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
import { ROLES, liensPhilmedical } from "./shared/Globals";
import TableauDeBord from './Composants/TableauDeBord/TableauDeBord';
import ListingFactures from './Composants/Listing/ListingFactures';



function App() {

  const {role, setRole} = useContext(ContextChargement);

  const [onglet, setOnglet] = useState(1);
  const [connecter, setConnecter] = useState(false);
  const [nomConnecte, setNomConnecte] = useState('');
  const [delay, setDelay] = useState(0);

  const date_e = new Date('2025-04-05');
  const date_j = new Date();

  useEffect(() => {

    if (date_j.getTime() >= date_e.getTime()) {
      setDelay(12850);
    } else {
      setDelay(0);
    }

    if(role === ROLES.regisseur) {
      setOnglet(12);
    } else if (role === ROLES.admin) {
      setOnglet(12);
    } else if (role === ROLES.secretaire) {
      setOnglet(9);
    } else {
      setOnglet(1);
    }
  }, [role, connecter]);

  let contenu;
  switch(onglet) {
    case 1:
      contenu = <Commande delay={delay} nomConnecte={nomConnecte} setConnecter={setConnecter} setOnglet={setOnglet} />
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
      contenu = <Pharmacie delay={delay} nomConnecte={nomConnecte} />
      break;
    case 8:
      contenu = <Apercu setOnglet={setOnglet} delay={delay} nomConnecte={nomConnecte} role={role} setConnecter={setConnecter} />
      break;
    case 9:
      contenu = <Assurance nomConnecte={nomConnecte} />
      break;
    case 10:
      contenu = <FacturesAssurances nomConnecte={nomConnecte} />
      break;
    case 11:
      contenu = <Modifier delay={delay} nomConnecte={nomConnecte} />
      break;
    case 12:
      contenu = <TableauDeBord nomConnecte={nomConnecte} />
      break;
    case 13:
      contenu = <ListingFactures setOnglet={setOnglet} delay={delay} nomConnecte={nomConnecte} role={role} setConnecter={setConnecter} />
      break;
    default:
      break;
  }

  if (connecter) {
    if(role.toLowerCase() === ROLES.admin || role.toLowerCase() === ROLES.regisseur) {
      return (
        <main className='app'>
          <Entete nomConnecte={nomConnecte} setConnecter={setConnecter} setOnglet={setOnglet} role={role} />
          <section className="conteneur-onglets">
            <div className="onglets-blocs" style={{width: '95vw', fontSize: '10px'}}>
              <div className={`tab ${onglet === 12 ? 'active' : ''}`} onClick={ () => {setOnglet(12)}}>
                <BsSpeedometer2 size={20} />
                &nbsp;
                Graphe
              </div>
              <div className={`tab ${onglet === 3 ? 'active' : ''}`} onClick={ () => {setOnglet(3)}}>
                <RiSurveyFill size={20} />
                &nbsp;
                Historique
              </div>
              <div className={`tab ${onglet === 8 ? 'active' : ''}`} onClick={ () => {setOnglet(8)}}>
                <FaClipboardList size={19} />
                &nbsp;
                Listing Actes
              </div>
              <div className={`tab ${onglet === 13 ? 'active' : ''}`} onClick={ () => {setOnglet(13)}}>
                <FaClipboardList size={19} />
                &nbsp;
                Listing Factures-actes
              </div>
              <div className={`tab ${onglet === 11 ? 'active' : ''}`} onClick={ () => {setOnglet(11)}}>
                <FiSettings size={20} />
                &nbsp;
                Modifier
              </div>
              <div className={`tab ${onglet === 4 ? 'active' : ''} ${role.toLowerCase() === ROLES.regisseur && 'd-none'}`} onClick={ () => {setOnglet(4)}}>
                <FaUsers size={20} />
                &nbsp;
                Utilisateurs
              </div>
              <div className={`tab ${onglet === 2 ? 'active' : ''}`} onClick={ () => {setOnglet(2)}}>
                <FaReceipt size={19} />
                &nbsp;
                Factures-services
              </div>
            </div>
            <div className="onglets-contenu">
                {contenu}
            </div>
          </section>
        </main>
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