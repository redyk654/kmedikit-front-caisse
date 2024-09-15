import { CCol, CFormCheck } from '@coreui/react';
import React, { Fragment } from 'react';

export default function AfficherOptions(props) {
    const { dateDebut, handleChangeDateDebut, dateFin, handleChangeDateFin } = props;
  return (
    // <Fragment>
    //     <CCol className='cursor-pointer'>
    //         <CFormCheck onChange={handleChangeRadio} checked={idRadio === "1" ? true : false} type="radio" name="radioRecette" id="1" label="aujourd'hui" />
    //     </CCol>
    //     <CCol>
    //         <CFormCheck onChange={handleChangeRadio} checked={idRadio === "4" ? true : false} type="radio" name="radioRecette" id="4" label="4 derniers jours" />
    //     </CCol>
    //     <CCol>
    //         <CFormCheck onChange={handleChangeRadio} checked={idRadio === "7" ? true : false} type="radio" name="radioRecette" id="7" label="7 derniers jours" />
    //     </CCol>
    //     <CCol>
    //         <CFormCheck onChange={handleChangeRadio} checked={idRadio === "10" ? true : false} type="radio" name="radioRecette" id="10" label="10 derniers jours"/>
    //     </CCol>
    //     <CCol>
    //         <CFormCheck onChange={handleChangeRadio} checked={idRadio === "0" ? true : false} type="radio" name="radioRecette" id="0" label="ce mois ci"/>
    //     </CCol>
    //     <CCol>
    //         <CFormCheck onChange={handleChangeRadio} checked={idRadio === "30" ? true : false} type="radio" name="radioRecette" id="30" label="le mois dernier"/>
    //     </CCol>
    // </Fragment>
    <div>
        <div>
            <label htmlFor="dateD">Date début</label>
            <input
                type="date"
                name="dateD"
                id="dateD"
                value={dateDebut}
                onChange={handleChangeDateDebut}
            />
        </div>
        <div>
            <label htmlFor="dateF">Date fin</label>
            <input
                type="date"
                name="dateF"
                id="dateF"
                value={dateFin}
                onChange={handleChangeDateFin}
            />
        </div>
    </div>
  )
}