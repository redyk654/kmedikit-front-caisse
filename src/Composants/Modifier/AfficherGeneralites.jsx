import React from 'react';
import { CListGroup, CListGroupItem, CTooltip } from '@coreui/react';
import { extraireCode } from '../../shared/Globals';
// import { CIcon } from '@coreui/icons-react';
import CIcon from '@coreui/icons-react'
import { cilTrash } from '@coreui/icons';

export default function AfficherGeneralites({ listeDesGeneralites, retirerActeDesGeneralites }) {

  return (
    <div className='afficher-generalites'>
        <h4 className='text-center'>Liste des généralités</h4>
        {listeDesGeneralites.length > 0 
            &&
            <CListGroup flush>
            {listeDesGeneralites.map(item => (
                <CListGroupItem>
                    {extraireCode(item.designation)}
                    <CTooltip
                        content={`Supprimer ${extraireCode(item.designation)} des généralités`}
                    >
                        <CIcon
                            icon={cilTrash}
                            id={item.id}
                            className='float-end text-danger'
                            role='button'
                            size='lg'
                            onClick={retirerActeDesGeneralites}
                        />
                    </CTooltip>
                </CListGroupItem>
            ))}
            </CListGroup>
        }
    </div>
  )
}
