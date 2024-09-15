import React from 'react'
import { formaterNombre } from '../../shared/Globals'

export default function AfficherTotaux(props) {
    const { total, recetteTotal, recettePharmacie, calculerRecetteGlobal } = props;
  return (
    <div style={{marginTop: '50px', textAlign: 'center'}}>
        <div>
            Total Caisse : <span style={{fontWeight: '600'}}>{total ? formaterNombre(total) + '' : '0'}</span>
        </div>
        <div>
            Recette Caisse : <span style={{fontWeight: '600'}}>{recetteTotal ? formaterNombre(recetteTotal) + '' : '0'}</span>
        </div>
        <div>
            Recette Pharmacie : <span style={{fontWeight: '600'}}>{recettePharmacie ? formaterNombre(recettePharmacie) + '' : '0'}</span>
        </div>
        <div>
            Recette Global : <span style={{fontWeight: '600'}}>{recettePharmacie ? formaterNombre(calculerRecetteGlobal()) + '' : '0'}</span>
        </div>
    </div>
  )
}
