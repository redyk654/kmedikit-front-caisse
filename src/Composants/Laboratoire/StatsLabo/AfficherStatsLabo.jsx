import CIcon from '@coreui/icons-react'
import { CBadge, CButton, CCard, CCardBody, CCardTitle, CCol, CCollapse, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import React from 'react'
import { afficherAge, afficherSexe, extraireCode } from '../../../shared/Globals'
import { cilChevronBottom, cilChevronTop } from '@coreui/icons'

export default function AfficherStatsLabo({ statsExamens, derouler }) {
    if(statsExamens.length === 0) {
        return <p className='text-center h2'>Aucun résultat pour le moment</p>
    }
  return (
    <>
        {statsExamens && statsExamens.map((examen, index) => (
            <CCol xs={6} className='p-1'>
                <CCard>
                    <CCardBody>
                            <div key={index}>
                                <CCardTitle><strong>{extraireCode(examen.designation)}</strong> <CBadge color='primary'>{examen.nbre_examens}</CBadge></CCardTitle>
                                <div className='d-flex justify-content-between flex-wrap w-50'>
                                    {examen.resultats.map((resultat) => (
                                        <p className='fw-bold'>{resultat.resultat} <CBadge color='dark'>{resultat.nbre_resultats}</CBadge></p>
                                    ))}
                                </div>
                            </div>
                        <CButton onClick={derouler} color='light' id={`${examen.designation}`}>
                            Derouler &nbsp;
                            {examen?.derouler ? <CIcon icon={cilChevronTop} /> : <CIcon icon={cilChevronBottom} />}
                        </CButton>
                        <CCollapse visible={examen?.derouler}>
                                <CTable>
                                    <CTableHead>
                                        <CTableRow>
                                        <CTableHeaderCell scope="col">#</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Nom</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Sexe</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Age</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">resultat</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {examen.patients && examen.patients.map((patient, index) => (
                                            <CTableRow>
                                                <CTableHeaderCell>{index + 1}</CTableHeaderCell>
                                                <CTableDataCell>{patient.nom}</CTableDataCell>
                                                <CTableDataCell>{afficherSexe(patient.sexe)}</CTableDataCell>
                                                <CTableDataCell>{afficherAge(patient.age)}</CTableDataCell>
                                                <CTableDataCell>{patient.resultat}</CTableDataCell>
                                            </CTableRow>
                                        ))}
                                    </CTableBody>
                                </CTable>
                        </CCollapse>
                    </CCardBody>
                </CCard>
            </CCol>
        ))}
    </>
  )
}
