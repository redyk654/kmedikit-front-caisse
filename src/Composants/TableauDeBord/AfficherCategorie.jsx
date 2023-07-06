import React from 'react';
import { CCard, CCardBody, CCardText, CCardTitle } from '@coreui/react';
import { formaterNombre } from '../../shared/Globals';

export default function AfficherCategorie(props) {

    const { categorie, total } = props;

  return (
    <CCard className='shadow p-3 mb-4 bg-white rounded'>
        <CCardBody>
            <CCardText>{categorie.toLowerCase()}</CCardText>
            <CCardTitle className='fw-bold'>{formaterNombre(total)}</CCardTitle>
        </CCardBody>
    </CCard>
  )
}
