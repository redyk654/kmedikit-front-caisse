import React, { useState } from 'react';
import EnregExamens from './EnregExamens/EnregExamens';
import Resultats from './Resultats/Resultats';
import { cilArrowBottom, cilArrowTop, cilFolderOpen, cilZoom } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import StatsLabo from './StatsLabo/StatsLabo';

export default function Laboratoire(props) {

  const [onglet, setOnglet] = useState(1);

  let contenu;

    switch (onglet) {
        case 1:
            contenu = <EnregExamens nomConnecte={props.nomConnecte} />
            break;
        case 2:
            contenu = <Resultats nomConnecte={props.nomConnecte} />
            break;
        case 3:
            contenu = <StatsLabo nomConnecte={props.nomConnecte} />
            break;
        default:
            break;
    }

  return (
    <section className="conteneur-sous-onglets">
        <div className="onglets-blocs" style={{width: '28vw', fontSize: '10px'}}>
            <div className={`tab ${onglet === 1 ? 'active' : ''}`} onClick={ () => {setOnglet(1)}}>
                <CIcon icon={cilZoom} size={'sm'} />
                &nbsp;
                Examens
            </div>
            <div className={`tab ${onglet === 2 ? 'active' : ''}`} onClick={ () => {setOnglet(2)}}>
                <CIcon icon={cilFolderOpen} size={'sm'} />
                &nbsp;
                Résultats
            </div>
            <div className={`tab ${onglet === 3 ? 'active' : ''}`} onClick={ () => {setOnglet(3)}}>
                {/* <CIcon icon={cilFolderOpen} size={'sm'} /> */}
                &nbsp;
                Statistiques
            </div>
        </div>
        <div className="onglets-contenu">
            {contenu}
        </div>
    </section>
  )
}
