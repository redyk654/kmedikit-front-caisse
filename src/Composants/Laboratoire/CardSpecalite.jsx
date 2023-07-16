import React, { useEffect, useState } from 'react';
import { CButton, CCard, CCardBody, CCardFooter, CCardHeader, CCardTitle, CForm, CFormInput, CListGroup, CListGroupItem, CRow } from '@coreui/react';
import { useForm, Controller } from 'react-hook-form';
import CIcon from '@coreui/icons-react';
import { cilPlus } from '@coreui/icons';
import { extraireCode, nomDns } from '../../shared/Globals';
import AfficherRecherche from './AfficherRecherche';

export default function CardSpecalite(props) {

    const  { specalite, examens, ajouterUnExamen, retirerUnExamen } = props;
    const { control, handleSubmit, reset, watch } = useForm({
        defaultValues: {
            'designation': ''
        }
    });

    const [listeDesExamens, setListeDesExamens] = useState([]);

    useEffect(() => {
        rechercherUnExamen();
    }, [watch('designation')])

    const rechercherUnExamen = () => {
        const designation = watch('designation').trim();
        if (designation.length === 0) {
            setListeDesExamens([]);
        } else {
            fetch(`${nomDns}specialites_examens.php?rechercher_examen=${designation}`)
            .then(response => response.json())
            .then(data => {
                setListeDesExamens(data);
            })
            .catch(error => console.error('Erreur réseau'));
        }
    }

    const execAjouterExamen = (e) => {
        e.preventDefault();
        const id = e.target.id;
        const examen = listeDesExamens.find(item => item.id === id);
        ajouterUnExamen(examen);
        reset();
        setListeDesExamens([]);
    }

    const execRetirerUnExamen = (e) => {
        e.preventDefault();
        const id = e.target.id;
        const examen = examens.find(item => item.id === id);
        retirerUnExamen(examen);
    }

  return (
    <CRow>
        <CCard className='mb-3'>
            <CCardHeader>
                <CCardTitle>{specalite}</CCardTitle>
            </CCardHeader>
            <CCardBody>
                {examens?.length > 0 ? 
                    <CListGroup className='w-75'>
                        {examens.map(item => (
                                <CListGroupItem className='' onClick={execRetirerUnExamen} id={item?.id}>
                                    {extraireCode(item?.designation)}
                                </CListGroupItem>
                        ))}
                    </CListGroup>
                : null}
                <Controller
                    name='designation'
                    control={control}
                    render={({ field }) => (
                        <CFormInput
                            {...field}
                            type='text'
                            placeholder="saisissez l'examen"
                            className='p-2 w-75 fw-bold mt-4'
                            id='designation'
                            // required
                        />
                    )}
                />
                <AfficherRecherche
                    liste={listeDesExamens}
                    selectionnerItem={execAjouterExamen}
                    valeur='designation'
                    cle='id'
                />
            </CCardBody>
        </CCard>
    </CRow>
  )
}
