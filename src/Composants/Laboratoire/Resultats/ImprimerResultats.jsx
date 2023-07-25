import React, { Component } from 'react';
import EnteteFicheResultat from '../EnteteFicheResultat';
import { afficherSexe, extraireCode, mois, mois2 } from '../../../shared/Globals';
import { CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react';

const stylesDuContainer = {
    fontSize: 8, 
    backgroundColor: '#fff', 
    height: '32vh', 
    marginLeft: '440px', 
    transform: 'rotate(90deg)'
}

export default class ImprimerResultats extends Component {

    render() {
        return (
            <div className='' style={{overflow: 'hidden'}}>
                <EnteteFicheResultat />
                <h2 className='text-center text-uppercase'>Fiche des resultats des examens</h2>
                <div className='px-4'>
                    <p className='text-center'>
                        Date &nbsp;
                        <strong>
                            {mois((new Date().toLocaleDateString()))}
                        </strong>
                    </p>
                    <p>
                        Code labo <strong>{this.props.examenSelectionne?.code_labo}</strong>
                    </p>
                    <p>
                        Nom <strong>{this.props.examenSelectionne?.nom}</strong>
                    </p>
                    <p>
                        Service <strong>{this.props.examenSelectionne?.service_patient}</strong>
                    </p>
                    <p>
                        Age <strong>{this.props.examenSelectionne?.age + ' ans'}</strong>
                    </p>
                    <p>
                        Sexe <strong>{afficherSexe(this.props.examenSelectionne?.sexe)}</strong>
                    </p>
                </div>
                <div className='px-4'>
                    {
                        this.props.detailsExamenSelectionne?.map(item => (
                            <CTable>
                                <CTableHead>
                                    <CTableRow color='dark'>
                                        <CTableHeaderCell scope='col'>{item?.specialite?.toUpperCase()}</CTableHeaderCell>
                                    </CTableRow>
                                    <CTableRow>
                                        <CTableHeaderCell scope='col'>examens</CTableHeaderCell>
                                        <CTableHeaderCell scope='col'>résultats</CTableHeaderCell>
                                        <CTableHeaderCell scope='col'>observations</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {item?.examens?.map(examen => (
                                        <CTableRow key={examen.id}>
                                            <CTableDataCell>{extraireCode(examen?.designation)}</CTableDataCell>
                                            <CTableDataCell>
                                                <pre>
                                                    {`${examen?.resultat}`}
                                                </pre>
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <pre>
                                                    {`${examen?.remarque}`}
                                                </pre>
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))}
                                </CTableBody>
                            </CTable>
                        ))
                    }
                </div>
                <div className='px-4 text-end'>
                    <p>
                        <strong>Cachet et Signature</strong>
                    </p>
                </div>
            </div>
        )
    }
}
