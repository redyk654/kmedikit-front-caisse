// ModalResultats.jsx
import React from 'react';
import { CFormTextarea, CModal, CModalBody, CModalHeader, CModalTitle, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react';
import { afficherSexe, extraireCode } from '../../../shared/Globals';
import ReactToPrint from 'react-to-print';

export default function ModalResultats({ modalResultats, setModalResultats, examenSelectionne, detailsExamenSelectionne, handleRemarqueChange, handleResultatChange, enregistrerLesResultats, fermerModalResultats, componentRef }) {
  return (
    <CModal size='xl' backdrop='static' scrollable visible={modalResultats} onClose={() => setModalResultats(false)}>
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
                        >
                        </CFormTextarea>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormTextarea
                          rows={4}
                          id={examen?.id} 
                          defaultValue={examen?.remarque}
                          onChange={handleRemarqueChange}
                        >
                        </CFormTextarea>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            ))
          }
        </CModalBody>
    </CModal>
  );
}