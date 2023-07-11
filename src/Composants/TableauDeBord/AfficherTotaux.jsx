import React from 'react'
import { formaterNombre } from '../../shared/Globals'

export default function AfficherTotaux(props) {
    const { total, recetteTotal, materiel } = props;
  return (
    <div style={{marginTop: '50px', textAlign: 'center'}}>
        <div>
            Total : <span style={{fontWeight: '600'}}>{total ? formaterNombre(total) + '' : '0'}</span>
        </div>
        <div>
            Recette : <span style={{fontWeight: '600'}}>{recetteTotal ? formaterNombre(recetteTotal) + '' : '0'}</span>
        </div>
        <div>
            Materiel : <span style={{fontWeight: '600'}}>{recetteTotal ? formaterNombre(materiel) + '' : '0'}</span>
        </div>
    </div>
  )
}
