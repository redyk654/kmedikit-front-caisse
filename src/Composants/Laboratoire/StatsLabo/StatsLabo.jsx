import { cilChevronBottom, cilChevronTop } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CBadge, CButton, CCard, CCardBody, CCardHeader, CCardText, CCardTitle, CCol, CCollapse, CContainer, CForm, CFormInput, CRow, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { afficherAge, afficherSexe, extraireCode, fusionnerStatsExamens, nomDns } from '../../../shared/Globals';
import AfficherStatsLabo from './AfficherStatsLabo';

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
            if(data) {
                let result = fusionnerStatsExamens(data);
                result = recuperListePatientPourUnExamen(result);
                setStatsExamens(result);
            }
            // console.log(result);
        })
        .catch(error => console.error('Erreur réseau'));
    }

    const recuperListePatientPourUnExamen = (examens) => {
        const tab = [];
        if(examens.length > 0) {
            examens.forEach((examen, index) => {
                fetch(`${nomDns}examens_labo.php?stats=patients&examen=${examen.designation}&mois=${moisChoisi}`)
                .then(response => response.json())
                .then(data => {;
                    examen.patients = data;
                    examen.derouler = false;
                })
                .catch(error => console.error('Erreur réseau'));
            })
            return examens;
        }

    }

    const derouler = (e) => {
        e.preventDefault();
    
        const updatedStatsExamens = [...statsExamens]; // Créez une copie du tableau
    
        const index = updatedStatsExamens.findIndex(examen => examen.designation.toLowerCase() === e.target.id.toLowerCase()); // Trouvez l'index de l'objet à modifier
    
        if (index !== -1) {
            // Si l'objet existe dans le tableau
            updatedStatsExamens[index] = { ...updatedStatsExamens[index], derouler: !updatedStatsExamens[index].derouler }; // Modifiez l'objet spécifique à cet index
            setStatsExamens(updatedStatsExamens); // Mettez à jour l'état avec le nouveau tableau
        }
    };
    
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
                <AfficherStatsLabo 
                    statsExamens={statsExamens}
                    derouler={derouler}
                />
            </CRow>
        </CContainer>
    </div>
  )
}
