import React, { Fragment } from 'react';
import { CListGroup, CListGroupItem } from '@coreui/react'
import { extraireCode } from '../../shared/Globals';

export default function AfficherRecherche(props) {
    const { liste, selectionnerItem, valeur, cle } = props;

  return (
    <>
      {liste?.length > 0 ? 
        <CListGroup className='w-75'>
            {liste.map(item => (
                <CListGroupItem color='primary' id={item[cle]} component="button" onClick={selectionnerItem}>
                    {extraireCode(item[valeur])}
                </CListGroupItem>
            ))}
        </CListGroup>
        : null}
    </>
  )
}
