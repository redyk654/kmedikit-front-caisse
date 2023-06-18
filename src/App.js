import './App.css';
import { Fragment, useEffect, useState } from 'react';
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
import { FaChartBar, FaClipboardList, FaLayerGroup, FaPlusSquare, FaReceipt, FaStore, FaTr, FaPlusSquareuck, FaUsers } from 'react-icons/fa';



function App() {

  const admin = "admin";
  const caissier = "caissier";
  const regisseur = "regisseur";
  const secretaire = "secretaire";

  const [onglet, setOnglet] = useState(1);
  const [connecter, setConnecter] = useState(false);
  const [nomConnecte, setNomConnecte] = useState('');
  const [role, setRole] = useState('');

  const date_e = new Date('2022-08-26');
  const date_j = new Date();

  useEffect(() => {

    // if (date_j.getTime() >= date_e.getTime()) {
    //   setConnecter(false);
    // }

    if(role === regisseur) {
      setOnglet(5);
    } else if (role === admin) {
      setOnglet(3);
    } else if (role === secretaire) {
      setOnglet(9);
    } else {
      setOnglet(1);
    }
  }, [role, connecter]);

  let contenu;
  switch(onglet) {
    case 1:
      contenu = <Commande nomConnecte={nomConnecte} setConnecter={setConnecter} setOnglet={setOnglet} />
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
      contenu = <GestionRecette nomConnecte={nomConnecte} role={role} setConnecter={setConnecter} setOnglet={setOnglet} />
      break;
    case 6:
      contenu = <VueRecettes nomConnecte={nomConnecte} role={role} />
      break;
    case 7:
      contenu = <Pharmacie nomConnecte={nomConnecte} />
      break;
    case 8:
      contenu = <Apercu nomConnecte={nomConnecte} role={role} />
      break;
    case 9:
      contenu = <Assurance nomConnecte={nomConnecte} />
      break;
    case 10:
      contenu = <FacturesAssurances nomConnecte={nomConnecte} />
      break;
    case 11:
      contenu = <Modifier nomConnecte={nomConnecte} />
      break;
  }

  if (connecter) {
    if(role === admin) {
      return (
        <main className='app'>
          <Entete nomConnecte={nomConnecte} setConnecter={setConnecter} setOnglet={setOnglet} role={role} />
          <section className="conteneur-onglets">
            <div className="onglets-blocs" style={{width: '95%'}}>
              <div className={`tab ${onglet === 3 ? 'active' : ''}`} onClick={ () => {setOnglet(3)}}>Historique</div>
              <div className={`tab ${onglet === 8 ? 'active' : ''}`} onClick={ () => {setOnglet(8)}}>Listing</div>
              <div className={`tab ${onglet === 5 ? 'active' : ''}`} onClick={ () => {setOnglet(5)}}>Les états</div>
              <div className={`tab ${onglet === 11 ? 'active' : ''}`} onClick={ () => {setOnglet(11)}}>Modifier</div>
              <div className={`tab ${onglet === 4 ? 'active' : ''}`} onClick={ () => {setOnglet(4)}}>Comptes</div>
              <div className={`tab ${onglet === 2 ? 'active' : ''}`} onClick={ () => {setOnglet(2)}}>Factures-services</div>
            </div>
            <div className="onglets-contenu">
                {contenu}
            </div>
          </section>
        </main>
      );
    } else if (role === caissier) {
      return (
        <main className='app'>
          <Entete nomConnecte={nomConnecte} setConnecter={setConnecter} setOnglet={setOnglet} role={role} />
          <section className="conteneur-onglets">
            <div className="onglets-blocs" style={{width: '83%', fontSize: '14px'}}>
              <div className={`tab ${onglet === 1 ? 'active' : ''}`} onClick={ () => {setOnglet(1)}}>
                <FaStore size={22} />
                &nbsp;
                Services
              </div>
              <div className={`tab ${onglet === 7 ? 'active' : ''}`} onClick={ () => {setOnglet(7)}}>
                <FaPlusSquare size={24} />
                &nbsp;
                Pharmacie
              </div>
              <div className={`tab ${onglet === 8 ? 'active' : ''}`} onClick={ () => {setOnglet(8)}}>
                <FaClipboardList size={22} />
                &nbsp;
                Listing
              </div>
              <div className={`tab ${onglet === 2 ? 'active' : ''}`} onClick={ () => {setOnglet(2)}}>
                <FaReceipt size={22} />
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
    } else if (role === regisseur) {
      return (
        <main className='app'>
          <Entete nomConnecte={nomConnecte} setConnecter={setConnecter} setOnglet={setOnglet} role={role} />
          <section className="conteneur-onglets">
            <div className="onglets-blocs" style={{width: '95%'}}>
              <div className={`tab ${onglet === 5 ? 'active' : ''}`} onClick={ () => {setOnglet(5)}}>Les états</div>
              <div className={`tab ${onglet === 8 ? 'active' : ''}`} onClick={ () => {setOnglet(8)}}>Listing</div>
              <div className={`tab ${onglet === 3 ? 'active' : ''}`} onClick={ () => {setOnglet(3)}}>Historique</div>
              <div className={`tab ${onglet === 11 ? 'active' : ''}`} onClick={ () => {setOnglet(11)}}>Modifier</div>
              <div className={`tab ${onglet === 4 ? 'active' : ''}`} onClick={ () => {setOnglet(4)}}>Comptes</div>
              <div className={`tab ${onglet === 2 ? 'active' : ''}`} onClick={ () => {setOnglet(2)}}>Factures-services</div>
            </div>
            <div className="onglets-contenu">
                {contenu}
            </div>
          </section>
        </main>
      );
    } else if(role === secretaire) {
      return (
        <main className='app'>
          <Entete nomConnecte={nomConnecte} setConnecter={setConnecter} setOnglet={setOnglet} role={role} />
          <section className="conteneur-onglets">
            <div className="onglets-blocs" style={{width: '35%'}}>
            <div className={`tab ${onglet === 9 ? 'active' : ''}`} onClick={ () => {setOnglet(9)}}>Etats assurances</div>
            <div className={`tab ${onglet === 10 ? 'active' : ''}`} onClick={ () => {setOnglet(10)}}>Factures</div>
            </div>
            <div className="onglets-contenu">
                {contenu}
            </div>
          </section>
        </main>
      )
    } else {
      return (
        <main className='app'>
          vous n'avez pas le droit d'accéder à cette application
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
      />
    )
  }
}

export default App;