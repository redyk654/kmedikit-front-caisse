import React from 'react';
import { CListGroup, CListGroupItem, CBadge } from '@coreui/react';
import { extraireCode } from '../../shared/Globals';
import { CCloseButton } from '@coreui/react';

export default function AfficherRecetteGeneralites({ recetteGeneralites, totalGeneralites, fermerModalReussi }) {
  return (
    <div className='afficher-generalites'>
        <div className="text-end">
            <CCloseButton onClick={fermerModalReussi} />
        </div>
        <h4 className='text-center'>Liste des généralités</h4>
        <h6 className='text-center fw-bold'>Total: {totalGeneralites + ' Fcfa'}</h6>
        {recetteGeneralites.length > 0 
            &&
            <CListGroup flush>
            {recetteGeneralites.map(item => (
                <CListGroupItem>
                    {extraireCode(item.designation) + ' (' + item.recette + ')'}
                    <CBadge className='float-end' color='info'>
                        {item.nb}
                    </CBadge>
                </CListGroupItem>
            ))}
            </CListGroup>
        }
    </div>
  )
}
