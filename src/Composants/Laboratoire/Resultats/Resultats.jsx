import React, { useEffect, useRef, useState } from 'react';
import { afficherSexe, extraireCode, filtrerListe, formaterNombre, mois, nomDns } from '../../../shared/Globals';
import { CButton, CFormCheck, CFormInput, CFormSwitch, CFormTextarea, CModal, CModalBody, CModalHeader, CModalTitle, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react';
import ReactToPrint from 'react-to-print';
import ImprimerResultats from './ImprimerResultats';
import AfficherListeDesExamens from './AfficherListeDesExamens';
import ModalResultats from './ModalResultats';

export default function Resultats() {

  const componentRef = useRef();

  const [listeDesExamens, setListeDesExamens] = useState([]);
  const [modalResultats, setModalResultats] = useState(false);
  const [examenSelectionne, setExamenSelectionne] = useState({});
  const [detailsExamenSelectionne, setDetailsExamenSelectionne] = useState([]);
  const [valeurRecherche, setValeurRecherche] = useState('');
  const [critereRecherche, setCritereRecherche] = useState('nom');
  const [editerResultats, setEditerResultats] = useState(true);

  const vueListeDesExamens = filtrerListe(critereRecherche, valeurRecherche, listeDesExamens);

  useEffect(() => {
    recuperLesExamens();
  }, [])

  const recuperLesExamens = () => {
    fetch(`${nomDns}examens_labo.php?recuperer_examens`)
    .then(response => response.json())
    .then(data => {
      // console.log(data);
      setListeDesExamens(data);
    })
    .catch(error => console.error('Erreur réseau'));
  }

  const regrouperExamensParSpecialite = (examens) => {
    const examensParSpecialite = [];
    examens.forEach(examen => {
      const index = examensParSpecialite.findIndex(item => item.specialite === examen.specialite);
      if (index === -1) {
        examensParSpecialite.push({
          specialite: examen.specialite,
          examens: [examen]
        })
      } else {
        examensParSpecialite[index].examens.push(examen);
      }
    });
    // console.log(examensParSpecialite);
    setDetailsExamenSelectionne(examensParSpecialite);
  }

  const afficherExamens = (e) => {
    ouvriModalResultats();
    const id = e.target.parentNode.id;
    const examen = listeDesExamens.find(item => item.id_fac_exam === id); // {id: "1", code_patient: "P0001", nom: "MARTIN", service_patient: "cardiologie", prescripteur: "Dr DUPONT", …}
    setExamenSelectionne(examen);

    fetch(`${nomDns}examens_labo.php?id_fac_exam=${examen.id_fac_exam}`)
    .then(response => response.json())
    .then(data => {
      regrouperExamensParSpecialite(data);
    })
    .catch(error => console.error('Erreur réseau'));
  }

  const handleResultatChange = (e) => {
    const id = e.target.id;
    const details = [...detailsExamenSelectionne]
    details.forEach(item => {
      item.examens.forEach(examen => {
        if (parseInt(examen.id) === parseInt(id)) {
          examen.resultat = e.target.value;
        }
      })
    })
    setDetailsExamenSelectionne(details);
    // console.log(detailsExamenSelectionne[0].examens);
  }

  const handleRemarqueChange = (e) => {
    const id = e.target.id;
    const details = [...detailsExamenSelectionne]
    details.forEach(item => {
      item.examens.forEach(examen => {
        if (parseInt(examen.id) === parseInt(id)) {
          examen.remarque = e.target.value;
        }
      })
    });
    
    setDetailsExamenSelectionne(details);
    // console.log(detailsExamenSelectionne);
  }

  const enregistrerLesResultats = () => {
    // Enlever les examens dont le résultat est vide
    const resultats = [...detailsExamenSelectionne];
    resultats.forEach(item => {
      item.examens = item.examens.filter(examen => examen.resultat !== '' || examen.remarque !== '');
    });

    // console.log(resultats);
    const data = new FormData();
    data.append('resultats', JSON.stringify(resultats));
    
    const req = new XMLHttpRequest();
    req.open('POST', `${nomDns}examens_labo.php?enregistrer_resultats`);

    req.addEventListener('load', () => {
      if (req.status >= 200 && req.status < 400) {
       
      } 
    })

    req.send(data);
  }

  const rechercherUnPatient = (e) => {
    setValeurRecherche(e.target.value.trim());
  }

  const ouvriModalResultats = () => {
    setModalResultats(true);
  }

  const fermerModalResultats = () => {
    setModalResultats(false);
    setEditerResultats(false);
  }

  const changerCritereRecherche = (e) => {
    setCritereRecherche(e.target.id);
  }
  
  return (
    <div>
      <h2 className='text-center bg-dark text-light'>Résultats des examens</h2>
      <CFormInput
        type='text'
        placeholder='Rechercher un patient'
        className='w-50 mx-auto'
        onChange={rechercherUnPatient}
      />
      <p className='d-flex justify-content-center'>
        <CFormCheck
          type="radio"
          id="nom"
          name="radios"
          label="par nom"
          onChange={changerCritereRecherche}
          checked={critereRecherche === 'nom'}
        />
        <CFormCheck
          type="radio"
          id="code_labo"
          name="radios"
          label="par code labo"
          onChange={changerCritereRecherche}
          checked={critereRecherche === 'code_labo'}
        />
      </p>
      <AfficherListeDesExamens
        vueListeDesExamens={vueListeDesExamens}
        afficherExamens={afficherExamens}
        valeurRecherche={valeurRecherche}
      />
      <ModalResultats
        modalResultats={modalResultats}
        fermerModalResultats={fermerModalResultats}
        setModalResultats={setModalResultats}
        examenSelectionne={examenSelectionne}
        detailsExamenSelectionne={detailsExamenSelectionne}
        handleResultatChange={handleResultatChange}
        handleRemarqueChange={handleRemarqueChange}
        enregistrerLesResultats={enregistrerLesResultats}
        editerResultats={editerResultats}
        componentRef={componentRef}
      />
      <div style={{display: 'none'}}>
          <ImprimerResultats
            ref={componentRef}
            examenSelectionne={examenSelectionne}
            detailsExamenSelectionne={detailsExamenSelectionne}
          />
      </div>
    </div>
  )
}
