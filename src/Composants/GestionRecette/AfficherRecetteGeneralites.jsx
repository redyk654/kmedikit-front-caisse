import React from 'react';
import { CListGroup, CListGroupItem, CBadge } from '@coreui/react';
import { extraireCode } from '../../shared/Globals';

export default function AfficherRecetteGeneralites({ recetteGeneralites }) {
  return (
    <div className='afficher-generalites'>
        <h4 className='text-center'>Liste des généralités</h4>
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
