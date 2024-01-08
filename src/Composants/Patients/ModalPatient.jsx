import React, { useContext, useEffect, useRef, useState } from 'react';
import { ContextChargement } from '../../Context/Chargement';
import { useForm, Controller, set } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { afficherAge, afficherSexe, calculerAge, dateEnLettre, filtrerListe } from '../../shared/Globals';
import { ROLES, SEXES, nomDns } from "../../shared/Globals";
import CustomLoader from '../../shared/CustomLoader';
import { CBadge, CButton, CCol, CContainer, CForm, CFormInput, CFormSelect, CModalBody, CModalHeader, CModalTitle, CRow } from '@coreui/react';
import { IMaskMixin } from 'react-imask';
import AfficherRecherche from '../../shared/AfficherRecherche';

const schema = yup.object({
    'noms-prenoms': yup.string().required(),
    'sexe-patient': yup.string().required(),
    'date-naissance': yup.string(),
    'age-patient': yup.number(),
    'profession-patient': yup.string(),
    'telephone-patient': yup.string(),
    'matrimoniale-patient': yup.string(),
}).required();

export default function ModalPatient({ ajouterPatient }) {

    const PATIENTEXISTE = 'Ce patient existe déjà dans la base de données';

    const boutonEnreg = useRef();
    const erreurBox = useRef();
    const champNom = useRef();
    const {role} = useContext(ContextChargement);
    const [listePatients, setListePatients] = useState([]);
    const [patientSelectionne, setPatientSelectionne] = useState({
        nom: '',
        sexe: '',
        date_naissance: '',
        age: '',
        profession: '',
        telephone: '',
        matrimoniale: '',
    });
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
        if (watch('date-naissance') == '')
            setValue('age-patient', 0);
        else
            setValue('age-patient', calculerAge(watch('date-naissance')));
    }, [watch('date-naissance')])

    const creerNouveauPatient =  (data) => {
        // console.log(data);
        boutonEnreg.current.disabled = true;
        const req = new XMLHttpRequest();
        const dataPost = new FormData();
        
        dataPost.append('infos_patient', JSON.stringify(data));
        req.open('POST', `${nomDns}gestion_patients.php?enreg_patient`);

        req.addEventListener('load', () => {
            const result = JSON.parse(req.responseText);
            
            if (result['status'] === PATIENTEXISTE) {
                setMessageErreur(result['status']);
                erreurBox.current.scrollIntoView();
                boutonEnreg.current.disabled = false;
                return;
            }

            setMessageErreur('');
            reset();
            ajouterPatient(data['noms-prenoms']);
            boutonEnreg.current.disabled = false;
        })

        req.send(dataPost);
    }

    const validerSelection = () => {
        if(patientSelectionne.nom === '') {
            setMessageErreur("Aucun patient n'est selectionné");
            erreurBox.current.scrollIntoView();
            return;
        }
        if(patientSelectionne.sexe === '') {
            setMessageErreur("Le sexe du patient n'est pas renseigné");
            erreurBox.current.scrollIntoView();
            return;
        }
        setMessageErreur('');
        ajouterPatient(patientSelectionne.nom);
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
        setPatientSelectionne(patient);
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
                    // placeholder='téléphone'
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
            <CModalTitle className=' text-uppercase fw-bold'>Informations du patient</CModalTitle>
        </CModalHeader>
        <CModalBody>
            <CContainer>
                <CRow>
                    <CCol xs={8}>
                        <p ref={erreurBox}>
                            {messageErreur !== '' && <CBadge color='danger'>{messageErreur}</CBadge>}
                        </p>
                        <CForm onSubmit={handleSubmit(creerNouveauPatient)}>
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
                                    Creer un patient
                                </CButton>
                            }
                            <CContainer>
                                {/* <h5 className='fw-bold'>infos du patients</h5> */}
                                <CRow className='mt-2'>
                                    <Controller
                                        name='noms-prenoms'
                                        control={control}
                                        render={({ field }) => (
                                            <CFormInput
                                                {...field}
                                                type='text'
                                                label='noms et prénoms'
                                                // placeholder="noms prénoms"
                                                className='p-2 w-75 fw-bold'
                                                id='noms-prenoms'
                                                required
                                                ref={champNom}
                                                autoComplete='off'
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
                                    <label>date de naissance</label>
                                    <Controller
                                        name='date-naissance'
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                type='date'
                                                label='date de naissance'
                                                // placeholder="date de naissance"
                                                className='p-2 w-75 fw-bold'
                                                id='date-naissance'
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
                                                // placeholder="age"
                                                className='p-2 w-75 fw-bold'
                                                id='age-patient'
                                                disabled
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
                                                // placeholder="profession"
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
                        </CForm>
                    </CCol>
                    <CCol xs={4}>
                        <CContainer>
                            <CRow>
                                <CCol>
                                    <h5 className='fw-bold'>Patient selectionné</h5>
                                </CCol>
                            </CRow>
                            
                            <CRow className='mt-1'>
                                <CButton
                                    color="dark"
                                    onClick={validerSelection}
                                >
                                    valider la selection
                                </CButton>
                            </CRow>
                            <CRow className='mt-1'>
                                <CCol>
                                    <p >Nom(s) et prénom(s)</p>
                                    <p className='fw-bold'>
                                        {patientSelectionne.nom}
                                    </p>
                                </CCol>
                            </CRow>
                            <CRow className='mt-1'>
                                <CCol>
                                    <p >Sexe</p>
                                    <p className='fw-bold'>
                                        {afficherSexe(patientSelectionne.sexe)}
                                    </p>
                                </CCol>
                            </CRow>
                            <CRow className='mt-1'>
                                <CCol>
                                    <p >Date de naissance</p>
                                    <p className='fw-bold'>
                                        {dateEnLettre(patientSelectionne.date_naissance)}
                                    </p>
                                </CCol>
                            </CRow>
                            <CRow className='mt-1'>
                                <CCol>
                                    <p >Age</p>
                                    <p className='fw-bold'>
                                        {patientSelectionne.age}
                                    </p>
                                </CCol>
                            </CRow>
                            <CRow className='mt-1'>
                                <CCol>
                                    <p >Profession</p>
                                    <p className='fw-bold'>
                                        {patientSelectionne.profession}
                                    </p>
                                </CCol>
                            </CRow>
                            <CRow className='mt-1'>
                                <CCol>
                                    <p >Téléphone</p>
                                    <p className='fw-bold'>
                                        {patientSelectionne.telephone}
                                    </p>
                                </CCol>
                            </CRow>
                            <CRow className='mt-1'>
                                <CCol>
                                    <p ></p>
                                    <p className='fw-bold'>
                                        {patientSelectionne.matrimoniale}
                                    </p>
                                </CCol>
                            </CRow>
                        </CContainer>
                    </CCol>
                </CRow>
            </CContainer>
        </CModalBody>
    </>
  )
}