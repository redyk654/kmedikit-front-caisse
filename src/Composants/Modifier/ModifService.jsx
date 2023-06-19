import React, { useRef } from 'react';
import { CFormInput, CFormSwitch } from '@coreui/react';
import { CATEGORIES } from '../../shared/Globals';

export default function ModifService({ designation, prix, categorie, generalite, handleChange, enregistrerModif }) {
    const refBtn = useRef();

    // console.log(designation, prix, categorie);
    const excuterEnregistrerModif = async () => {
        refBtn.current.disabled = true;
        await enregistrerModif();
        refBtn.current.disabled = false;
    }

  return (
    <div>
        {/* <CFormInput
            type="password"
            id="floatingPassword"
            floatingLabel="Password"
            placeholder="Password"
            size='400px'
        /> */}
        <p className='ps-3 pt-2'>
            <input name='designation' onChange={handleChange} value={designation} type="text" className='d-block w-100' placeholder='modifier la désignation' />
        </p>
        <p className='ps-3'>
            <input name='prix' onChange={handleChange} value={prix} type="number" className='d-block w-100' placeholder='modifier le prix' />
        </p>
        <p className='ps-3'>
            <select name="categorie" id="categorie" onChange={handleChange} value={categorie}>
                {CATEGORIES.map(item => (
                    <option value={item}>{item}</option>
                ))}
            </select>
        </p>
        <p className='ps-3'>
            <CFormSwitch onChange={handleChange} checked={parseInt(generalite) ? true : false} size='xl' name="generalite" id="generalite" label="Généralité"/>
        </p>
        <p className='ps-3'>
            <button ref={refBtn} className='bootstrap-btn valider w-75' role='button' onClick={excuterEnregistrerModif}>Enregistrer</button>
        </p>
    </div>
  )
}
