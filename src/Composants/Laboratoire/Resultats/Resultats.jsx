import React, { useEffect, useRef, useState } from 'react';
import { afficherSexe, extraireCode, filtrerListe, formaterNombre, mois, nomDns } from '../../../shared/Globals';
import { CButton, CFormInput, CFormSwitch, CFormTextarea, CModal, CModalBody, CModalHeader, CModalTitle, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react';
import ReactToPrint from 'react-to-print';
import ImprimerResultats from './ImprimerResultats';

export default function Resultats() {

  const componentRef = useRef();

  const [listeDesExamens, setListeDesExamens] = useState([]);
  const [modalResultats, setModalResultats] = useState(false);
  const [examenSelectionne, setExamenSelectionne] = useState({});
  const [detailsExamenSelectionne, setDetailsExamenSelectionne] = useState([]);
  const [valeurRecherche, setValeurRecherche] = useState('');
  const [editerResultats, setEditerResultats] = useState(false);

  const vueListeDesExamens = filtrerListe('nom', valeurRecherche, listeDesExamens);

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
        if (examen.id === id) {
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
        if (examen.id === id) {
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

  return (
    <div>
      <h2 className='text-center bg-dark text-light'>Résultats des examens</h2>
      <CFormInput
        type='text'
        placeholder='Rechercher un patient'
        className='w-50 mx-auto'
        onChange={rechercherUnPatient}
      />
      {vueListeDesExamens.length === 0 ? <p className='text-center h2'>Aucun examen enregistré</p> :
      <CTable striped>
        <CTableHead>
          <CTableRow>
          <CTableHeaderCell scope='col'>code labo</CTableHeaderCell>
            <CTableHeaderCell scope='col'>patient</CTableHeaderCell>
            <CTableHeaderCell scope='col'>service</CTableHeaderCell>
            <CTableHeaderCell scope='col'>prescripteur</CTableHeaderCell>
            <CTableHeaderCell scope='col'>date</CTableHeaderCell>
            <CTableHeaderCell scope='col'>heure</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {vueListeDesExamens.map(item => (
            <CTableRow key={item.id} id={item.id_fac_exam} onClick={(afficherExamens)} role='button'>
              <CTableDataCell>{item.code_labo}</CTableDataCell>
              <CTableDataCell>{item.nom}</CTableDataCell>
              <CTableDataCell>{item.service_patient}</CTableDataCell>
              <CTableDataCell>{item.prescripteur}</CTableDataCell>
              <CTableDataCell>{mois(item.date_heure?.slice(0, 10))}</CTableDataCell>
              <CTableDataCell>{item.date_heure?.slice(11, 19)}</CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
      }
      <CModal size='xl' backdrop='static' scrollable visible={modalResultats} onClose={fermerModalResultats}>
        <CModalHeader>
            <CModalTitle>Fiche des résultats</CModalTitle>          
        </CModalHeader>
        <CModalBody>
          <p className=''>
            <ReactToPrint
              trigger={() => <button className='bootstrap-btn valider' style={{marginTop: '8px', color: '#f1f1f1', height: '6vh', width: '20%', cursor: 'pointer', fontSize: 'large', fontWeight: '600'}}>Imprimer</button>}
              content={() => componentRef.current}
              onBeforePrint={enregistrerLesResultats}
              onAfterPrint={fermerModalResultats}
            />
          </p>
          <p>
            Code labo <strong>{examenSelectionne?.code_labo}</strong>
          </p>
          <p>
            Nom <strong>{examenSelectionne?.nom}</strong>
          </p>
          <p>
            Service <strong>{examenSelectionne?.service_patient}</strong>
          </p>
          <p>
            Age <strong>{examenSelectionne?.age + ' ans'}</strong>
          </p>
          <p>
            Sexe <strong>{afficherSexe(examenSelectionne?.sexe)}</strong>
          </p>
          {/* <p>
            Montant <strong>{formaterNombre(examenSelectionne?.montant)}</strong>
          </p> */}
          <p>
            <CFormSwitch
              id='editerResultats'
              name='editerResultats'
              label='Editer'
              onChange={() => setEditerResultats(!editerResultats)}
              defaultChecked={editerResultats}
            />
          </p>
          {
            detailsExamenSelectionne?.map(item => (
              <CTable>
                <CTableHead>
                  <CTableRow color='dark'>
                    <CTableHeaderCell scope='col'>{item?.specialite?.toUpperCase()}</CTableHeaderCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell scope='col'>examens</CTableHeaderCell>
                    <CTableHeaderCell scope='col'>résultats</CTableHeaderCell>
                    <CTableHeaderCell scope='col'>valeurs usuelles</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {item?.examens?.map(examen => (
                    <CTableRow key={examen.id}>
                      <CTableDataCell>{extraireCode(examen?.designation)}</CTableDataCell>
                      <CTableDataCell>
                        <CFormTextarea
                          rows={4}
                          id={examen?.id} 
                          defaultValue={examen?.resultat}
                          onChange={handleResultatChange}
                          readOnly={editerResultats ? false : true}
                        ></CFormTextarea>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormTextarea
                          rows={4}
                          id={examen?.id} 
                          defaultValue={examen?.remarque}
                          onChange={handleRemarqueChange}
                          readOnly={editerResultats ? false : true}
                        ></CFormTextarea>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            ))
          }
        </CModalBody>
      </CModal>
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
