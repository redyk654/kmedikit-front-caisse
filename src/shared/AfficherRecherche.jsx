import React from 'react';
import { CListGroup, CListGroupItem } from '@coreui/react'

export default function AfficherRecherche(props) {
    const { liste, selectionnerItem, valeur, cle } = props;

    const execSelectionnerItem = (e) => {
        e.preventDefault();
        selectionnerItem(e);
    }

  return (
    <>
      {liste?.length > 0 ? 
        <CListGroup className='w-75' flush>
            {liste.map(item => (
                <CListGroupItem color='primary' id={item[cle]} component="button" onClick={execSelectionnerItem}>
                    {item[valeur]}
                </CListGroupItem>
            ))}
        </CListGroup>
        : null}
    </>
  )
}