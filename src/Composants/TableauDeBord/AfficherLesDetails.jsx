import React, { Fragment } from 'react';
import { CATEGORIES, extraireCode, formaterNombre } from '../../shared/Globals';
import { CBadge, CCloseButton, CListGroup, CListGroupItem } from '@coreui/react';

export default function AfficherLesDetails(props) {

    const { services, categorieSelectionne, changerCategorie, fermerModalConfirmation } = props;

    const calculerTotalCategorie = () => {
        return services.reduce((acc, item) => acc + parseInt(item.prix_total), 0);
    }

  return (
    <div className='afficher-generalites'>
        <div className='text-end'>
            <CCloseButton onClick={fermerModalConfirmation} />
        </div>
        <h3
            className='text-center' 
            style={{top: 0,}}
        >
            {categorieSelectionne.length === 0 ? 'Total ' : categorieSelectionne}:
            &nbsp;
            {formaterNombre(calculerTotalCategorie())}
        </h3>
        <div style={{margin: 10}}>
            <select name="categorie" id="categorie" onChange={changerCategorie}>
                <option value="">sélectionné une catégorie</option>
                {CATEGORIES.map(item => (
                    <option value={item}>{item}</option>
                ))}
            </select>
        </div>
        <div>
            <CListGroup flush>
                {services.length > 0 && services.map(item => (
                    <CListGroupItem>
                        {extraireCode(item.designation) + ' (' + item.prix_total + ')'}
                        <CBadge className='float-end' color='dark'>
                            {item.nb}
                        </CBadge>
                    </CListGroupItem>
                ))}
            </CListGroup>
        </div>
    </div>
  )
}
