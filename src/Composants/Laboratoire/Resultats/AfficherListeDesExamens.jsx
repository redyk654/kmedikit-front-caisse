import { CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import React from 'react'
import { filtrerListe, mois } from '../../../shared/Globals'

export default function AfficherListeDesExamens({ afficherExamens, valeurRecherche, listeDesExamens }) {
  const vueListeDesExamens = filtrerListe('nom', valeurRecherche, listeDesExamens);

  return (
    <>
      {vueListeDesExamens?.length === 0 ? <p className='text-center h2'>Chargement...</p> :
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
              {vueListeDesExamens?.map(item => (
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
    </>
  )
}
