import React, { useContext, useEffect, useRef, useState } from 'react';
import { ContextChargement } from '../../Context/Chargement';
import { useForm, Controller, set } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { afficherAge, afficherSexe, calculerAge, filtrerListe } from '../../shared/Globals';
import { ROLES, SEXES, nomDns } from "../../shared/Globals";
import CustomLoader from '../../shared/CustomLoader';
import { CBadge, CButton, CContainer, CForm, CFormInput, CFormSelect, CModalBody, CModalHeader, CModalTitle, CRow } from '@coreui/react';
import { IMaskMixin } from 'react-imask';
import AfficherRecherche from '../../shared/AfficherRecherche';

const schema = yup.object({
    'noms-prenoms': yup.string().required(),
    'date-naissance': yup.string().required(),
    'age-patient': yup.number().min(0).required(),
    'sexe-patient': yup.string().required(),
    'profession-patient': yup.string(),
    'telephone-patient': yup.string(),
    'matrimoniale-patient': yup.string(),
}).required();

export default function ModalPatient({ ajouterPatient }) {

    const boutonEnreg = useRef();
    const champNom = useRef();
    const {role} = useContext(ContextChargement);
    const [listePatients, setListePatients] = useState([]);
    const [enCours, setEnCours] = useState(false);
    const [messageErreur, setMessageErreur] = useState('');
    const { control, watch, handleSubmit, setValue, reset, formState: { errors } } = useForm({
        defaultValues: {
            'noms-prenoms': '',
            'date-naissance': '',
            'age-patient': '',
            'sexe-patient': '',
            'profession-patient': '',
            'telephone-patient': '',
            'matrimoniale-patient': '',
        },
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        if (watch('noms-prenoms') == '')
            setListePatients([]);
        else
            filtrerListe();
    }, [watch('noms-prenoms')])
    
    useEffect(() => {
        setValue('age-patient', calculerAge(watch('date-naissance')));
    }, [watch('date-naissance')])

    const execAjouterNouveauPatient =  (data) => {
        // console.log(data);
        boutonEnreg.current.disabled = true;
        const req = new XMLHttpRequest();
        const dataPost = new FormData();
        
        dataPost.append('infos_patient', JSON.stringify(data));
        req.open('POST', `${nomDns}gestion_patients.php?enreg_patient`);

        req.addEventListener('load', () => {
            reset();
            boutonEnreg.current.disabled = false;
            // console.log(req.responseText);
            ajouterPatient(data['noms-prenoms']);
        })

        req.send(dataPost);
    }

    const filtrerListe = () => {
        // rechercher un patient dans la base de données
        champNom.current.disabled = true;
        const req = new XMLHttpRequest();
        req.open('GET', `${nomDns}gestion_patients.php?rechercher_patient&nom=${watch('noms-prenoms')}`);

        req.addEventListener('load', () => {
            setMessageErreur('');
            const result = JSON.parse(req.responseText);
            setListePatients(result);
            champNom.current.disabled = false;
            champNom.current.focus();
        });

        req.addEventListener("error", function () {
            // La requête n'a pas réussi à atteindre le serveur
            setMessageErreur('Erreur réseau');
        });

        req.send();
    }

    const selectionnerPatient = (e) => {
        const patient = listePatients.filter(item => parseInt(item.id) === parseInt(e.target.id))[0];
        setValue('noms-prenoms', patient.nom);
        setValue('date-naissance', patient.date_naissance);
        setValue('age-patient', patient.age);
        setValue('sexe-patient', patient.sexe);
        setValue('profession-patient', patient.profession);
        setValue('telephone-patient', patient.telephone);
        setValue('matrimoniale-patient', patient.matrimoniale);

        setListePatients([]);
    }

    const CFormInputTelephone = IMaskMixin(({ inputRef, ...props }) => (
        <Controller
            name='telephone-patient'
            control={control}
            render={({ field }) => (
                <CFormInput
                    {...field}
                    type='text'
                    label='téléphone'
                    placeholder='téléphone'
                    id='telephone-patient'
                    className='p-2 w-75 fw-bold'
                    {...props}
                    ref={inputRef} // bind internal input
                />
            )}
        />
    ));

  return (
    <>
        <CModalHeader>
            <CModalTitle>Informations du patient</CModalTitle>          
        </CModalHeader>
        <CModalBody>
            <CForm onSubmit={handleSubmit(execAjouterNouveauPatient)}>
                <CContainer>
                    <h4 className='fw-bold'>infos du patients</h4>
                    <CRow className='mt-2'>
                        <Controller
                            name='noms-prenoms'
                            control={control}
                            render={({ field }) => (
                                <CFormInput
                                    {...field}
                                    type='text'
                                    label='noms prénoms'
                                    placeholder="noms prénoms"
                                    className='p-2 w-75 fw-bold'
                                    id='noms-prenoms'
                                    required
                                    ref={champNom}
                                />
                            )}
                        />
                        <AfficherRecherche
                            liste={listePatients}
                            selectionnerItem={selectionnerPatient}
                            valeur='nom'
                            cle='id'
                        />
                    </CRow>
                    <CRow className='mt-2'>
                        <label>date de naissance</label>
                        <Controller
                            name='date-naissance'
                            control={control}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    type='date'
                                    label='code'
                                    placeholder="code"
                                    className='p-2 w-75 fw-bold'
                                    id='date-naissance'
                                    required
                                />
                            )}
                        />
                    </CRow>
                    <CRow className='mt-2'>
                        <Controller
                            name='age-patient'
                            control={control}
                            render={({ field }) => (
                                <CFormInput
                                    {...field}
                                    type='number'
                                    label='age'
                                    placeholder="age"
                                    className='p-2 w-75 fw-bold'
                                    id='age-patient'
                                    required
                                    disabled
                                />
                            )}
                        />
                        {/* <p className='text-danger fw-bold'>{errors['age-patient']?.message}</p> */}
                        {/* <CBadge className='' color={errors['age-patient']?.message ? 'danger' : 'success'}>k</CBadge> */}
                    </CRow>
                    <CRow className='mt-2'>
                        <Controller
                            name='sexe-patient'
                            control={control}
                            render={({ field }) => (
                                <CFormSelect
                                    {...field}
                                    label='sexe'
                                    id='sexe-patient'
                                    className='p-2 w-75 fw-bold'
                                    options={[
                                        "choisir le sexe",
                                        {value: 'H', label: 'homme'},
                                        {value: 'F', label: 'femme'},
                                    ]}
                                    required
                                />
                            )}
                        />
                    </CRow>
                    <CRow className='mt-2'>
                        <Controller
                            name='profession-patient'
                            control={control}
                            render={({ field }) => (
                                <CFormInput
                                    {...field}
                                    type='text'
                                    label='profession'
                                    placeholder="profession"
                                    className='p-2 w-75 fw-bold'
                                    id='profession-patient'
                                />
                            )}
                        />
                    </CRow>
                    <CRow className='mt-2'>
                        <CFormInputTelephone
                            mask='+237 6 00 00 00 00'
                        />
                    </CRow>
                    <CRow className='mt-2'>
                        <Controller
                            name='matrimoniale-patient'
                            control={control}
                            render={({ field }) => (
                                <CFormSelect
                                    {...field}
                                    type='text'
                                    label='situation matrimoniale'
                                    options={[
                                        "situation matrimoniale",
                                        {value: 'C', label: 'celibataire'},
                                        {value: 'M', label: 'Marié(e)'},
                                        {value: 'D', label: 'Divorcé(e)'},
                                        {value: 'V', label: 'Veuf(ve)'},
                                    ]}
                                    className='p-2 w-75 fw-bold'
                                    id='matrimoniale-patient'
                                />
                            )}
                        />
                    </CRow>
                </CContainer>
                {enCours ? 
                    <CustomLoader
                        styles={{textAlign: 'center'}}
                        color="#03ca7e"
                        height={80}
                        width={80}
                    />
                        :
                    <CButton
                        color="dark"
                        type="submit"
                        ref={boutonEnreg}
                        className='mt-2'
                    >
                        Enregistrer
                    </CButton>
                }
            </CForm>
        </CModalBody>
    </>
  )
}