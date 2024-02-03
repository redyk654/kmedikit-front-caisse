import { cilChevronBottom, cilChevronTop } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CBadge, CButton, CCard, CCardBody, CCardHeader, CCardText, CCardTitle, CCol, CCollapse, CContainer, CForm, CFormInput, CRow, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { extraireCode, fusionnerStatsExamens, nomDns } from '../../../shared/Globals';

export default function StatsLabo() {
    const [moisChoisi, setMoisChoisi] = useState(new Date().toISOString().substring(0, 7));
    const [isDerouler, setIsDerouler] = useState(false);
    const [statsExamens, setStatsExamens] = useState([]);

    useEffect(() => {
        recupererStats();
    }, [moisChoisi]);

    const changerMois = (e) => {
        setMoisChoisi(e.target.value);
    }

    const recupererStats = () => {
        fetch(`${nomDns}examens_labo.php?stats=examens&mois=${moisChoisi}`)
        .then(response => response.json())
        .then(data => {
            const result = fusionnerStatsExamens(data);
            console.log(result);
            setStatsExamens(result);
        })
        .catch(error => console.error('Erreur réseau'));
    }

    const derouler = (e) => {
        e.preventDefault()
        setIsDerouler(!isDerouler);
    }
    
  return (
    <div>
        <h2 className='text-center bg-dark text-light'>Statistiques du laboratoire</h2>
        <CContainer className='py-4'>
            <CRow className='py-1'>
                <CForm>
                    <CFormInput
                        type="month"
                        className='w-25 mx-auto'
                        value={moisChoisi}
                        onChange={changerMois}
                    />
                </CForm>
            </CRow>
            <CRow className='py-1'>
                {statsExamens.map((examen, index) => (
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
                                <CButton href="#" onClick={derouler} color='light'>
                                    Derouler &nbsp;
                                    {isDerouler ? <CIcon icon={cilChevronTop} /> : <CIcon icon={cilChevronBottom} />} 
                                </CButton>
                                <CCollapse visible={isDerouler}>
                                    <CTable>
                                        <CTableHead>
                                            <CTableRow>
                                            <CTableHeaderCell scope="col">#</CTableHeaderCell>
                                            <CTableHeaderCell scope="col">Nom</CTableHeaderCell>
                                            <CTableHeaderCell scope="col">Sexe</CTableHeaderCell>
                                            <CTableHeaderCell scope="col">Age</CTableHeaderCell>
                                            </CTableRow>
                                        </CTableHead>
                                        <CTableBody>
                                            <CTableRow>
                                            <CTableHeaderCell scope="row">1</CTableHeaderCell>
                                            <CTableDataCell>Mark</CTableDataCell>
                                            <CTableDataCell>Homme</CTableDataCell>
                                            <CTableDataCell>25ans</CTableDataCell>
                                            </CTableRow>
                                            <CTableRow>
                                            <CTableHeaderCell scope="row">2</CTableHeaderCell>
                                            <CTableDataCell>Jacob</CTableDataCell>
                                            <CTableDataCell>Homme</CTableDataCell>
                                            <CTableDataCell>39ans</CTableDataCell>
                                            </CTableRow>
                                            <CTableRow>
                                            <CTableHeaderCell scope="row">3</CTableHeaderCell>
                                            <CTableDataCell>Reina</CTableDataCell>
                                            <CTableDataCell>Femme</CTableDataCell>
                                            <CTableDataCell>22ans</CTableDataCell>
                                            </CTableRow>
                                        </CTableBody>
                                    </CTable>
                                </CCollapse>
                            </CCardBody>
                        </CCard>
                    </CCol>
                ))}
            </CRow>
        </CContainer>
    </div>
  )
}
