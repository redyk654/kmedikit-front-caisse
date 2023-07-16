import React, { useEffect, useState } from 'react';
import { CButton, CCol, CContainer, CForm, CFormInput, CFormSelect, CRow } from '@coreui/react';
import { nomDns } from '../../../shared/Globals';
import AfficherRecherche from '../AfficherRecherche';
import { IMaskMixin } from 'react-imask';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import CardSpecalite from '../CardSpecalite';

const schema = yup.object({
    'code-examen': yup.string().required(),
    'noms-examen': yup.string().required(),
    'age-examen': yup.number().min(0).required(),
    'sexe-examen': yup.string().required(),
    'quartier-examen': yup.string().required(),
    'profession-examen': yup.string().required(),
    'telephone-examen': yup.string().required(),
    'service': yup.string().required(),
    'prescripteur': yup.string().required(),
    'num-recu': yup.string().required(),
    'montant': yup.number().min(0).required(),
}).required();

export default function EnregExamens() {

    const [msgErreur, setMsgErreur] = useState('');
    const [listePatients, setListePatients] = useState([]);
    const [listeServices, setListeServices] = useState([]);
    const [listePrescripteurs, setListePrescripteurs] = useState([]);
    const [listeRecu, setListeRecu] = useState([]);
    const [listeSpecialites, setListeSpecialites] = useState([]);

    const { control, watch, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            'code-examen': '',
            'noms-examen': '',
            'age-examen': '',
            'sexe-examen': '',
            'quartier-examen': '',
            'profession-examen': '',
            'telephone-examen': '',
            'service': '',
            'prescripteur': '',
            'num-recu': '',
            'montant': '',
        },
        resolver: yupResolver(schema),
    })

    useEffect(() => {
        recupererListeSpecialites();
    }, [])

    const recupererListeSpecialites = () => {
        fetch(`${nomDns}specialites_examens.php?recuperer`)
        .then(response => response.json())
        .then(data => {
            formaterSpecialites(data);
        })
        .catch(error => setMsgErreur('Erreur réseau'));
    }

    const formaterSpecialites = (data) => {
        const specialites = data?.map(item => {
            return {
                key: item.id,
                specialite: item.designation,
                examens: []
            }
        });
        setListeSpecialites(specialites);
    }

    useEffect(() => {
        rechercherPatientParCode();
    }, [watch('code-examen')])

    useEffect(() => {
        rechercherService();
    }, [watch('service')])

    useEffect(() => {
        rechercherPrescripteur();
    }, [watch('prescripteur')])

    useEffect(() => {
        rechercherRecu();
    }, [watch('num-recu')])
    
    const rechercherPatientParCode = () => {
        const code = watch('code-examen').trim();
        if (code.length === 0) {
            setListePatients([]);
            setMsgErreur('');
        } else {
            fetch(`${nomDns}rechercher_patient.php?code=${code}`)
            .then(response => response.json())
            .then(data => {
                setListePatients(data);
            })
            .catch(error => setMsgErreur('Erreur réseau'));
        }
    }

    const selectionnerPatient = (e) => {
        const patient = listePatients.filter(item => item.code === e.target.id)[0];
        setValue('code-examen', patient.code);
        setValue('noms-examen', patient.nom);
        setValue('age-examen', patient.age);
        setValue('sexe-examen', patient.sexe);
        setValue('quartier-examen', patient.quartier);
        setValue('profession-examen', patient.profession);
        setValue('telephone-examen', patient.telephone);

        setListePatients([]);
    }

    const rechercherService = () => {
        const designationService = watch('service').trim();
        if (designationService.length === 0) {
            setListeServices([]);
            setMsgErreur('');
        } else {
            fetch(`${nomDns}rechercher_par_chaine.php?designation_service=${designationService}`)
            .then(response => response.json())
            .then(data => {
                setListeServices(data);
            })
            .catch(error => setMsgErreur('Erreur réseau'));
        }
    }

    const selectionnerService = (e) => {
        const service = listeServices.filter(item => item.id === e.target.id)[0];
        setValue('service', service.designation);
        setListeServices([]);
    }

    const rechercherPrescripteur = () => {
        const prescripteur = watch('prescripteur').trim();
        if (prescripteur.length === 0) {
            setListePrescripteurs([]);
            setMsgErreur('');
        } else {
            fetch(`${nomDns}rechercher_par_chaine.php?designation_prescripteur=${prescripteur}`)
            .then(response => response.json())
            .then(data => {
                setListePrescripteurs(data);
            })
            .catch(error => setMsgErreur('Erreur réseau'));
        }
    }

    const selectionnerPrescripteur = (e) => {
        const prescripteur = listePrescripteurs.filter(item => item.id === e.target.id)[0];
        setValue('prescripteur', prescripteur.designation);
        setListePrescripteurs([]);
    }

    const rechercherRecu = () => {
        const numRecu = watch('num-recu').trim();
        if (numRecu.length === 0) {
            setListeRecu([]);
            setMsgErreur('');
        } else {
            fetch(`${nomDns}rechercher_par_chaine.php?num_recu=${numRecu}`)
            .then(response => response.json())
            .then(data => {
                setListeRecu(data);
            })
            .catch(error => setMsgErreur('Erreur réseau'));
        }
    }

    const selectionnerRecu = (e) => {
        const recu = listeRecu.filter(item => item.id === e.target.id)[0];
        setValue('num-recu', recu.id);
        setValue('montant', recu.prix_total);
        setListeRecu([]);
    }

    const enregistrerExamens = (data) => {
        console.log(data);
    }

    const CFormInputTelephone = IMaskMixin(({ inputRef, ...props }) => (
        <Controller
            name='telephone-examen'
            control={control}
            render={({ field }) => (
                <CFormInput
                    {...field}
                    type='text'
                    label='Téléphone'
                    placeholder='Téléphone'
                    id='telephone-examen'
                    className='p-2 w-75 fw-bold'
                    {...props}
                    ref={inputRef} // bind internal input
                    required
                />
            )}
        />
    ))

  return (
    <div>
        <h2 className='text-center bg-dark text-light'>Enregistrer examens</h2>
        <p className='text-danger text-center fw-bold'>{msgErreur}</p>
        <CForm onSubmit={handleSubmit(enregistrerExamens)}>
            <CContainer fluid className='px-4'>
                <CRow>
                    <CCol>
                        <CContainer>
                            <h4>infos du patients</h4>
                            <CRow className='mt-2'>
                                <Controller
                                    name='code-examen'
                                    control={control}
                                    render={({ field }) => (
                                        <CFormInput
                                            {...field}
                                            type='text'
                                            label='code'
                                            placeholder="code"
                                            className='p-2 w-75 fw-bold'
                                            id='code-examen'
                                            required
                                        />
                                    )}
                                />
                                <AfficherRecherche
                                    liste={listePatients}
                                    selectionnerItem={selectionnerPatient}
                                    valeur='nom'
                                    cle='code'
                                />
                            </CRow>
                            <CRow className='mt-2'>
                                <Controller
                                    name='noms-examen'
                                    control={control}
                                    render={({ field }) => (
                                        <CFormInput
                                            {...field}
                                            type='text'
                                            label='noms prénoms'
                                            placeholder="noms prénoms"
                                            className='p-2 w-75 fw-bold'
                                            id='noms-examen'
                                            required
                                        />
                                    )}
                                />
                            </CRow>
                            <CRow className='mt-2'>
                                <Controller
                                    name='age-examen'
                                    control={control}
                                    render={({ field }) => (
                                        <CFormInput
                                            {...field}
                                            type='number'
                                            label='age'
                                            placeholder="age"
                                            className='p-2 w-75 fw-bold'
                                            id='age-examen'
                                            required
                                        />
                                    )}
                                />
                                {/* <p className='text-danger fw-bold'>{errors['age-examen']?.message}</p> */}
                            </CRow>
                            <CRow className='mt-2'>
                                <Controller
                                    name='sexe-examen'
                                    control={control}
                                    render={({ field }) => (
                                        <CFormSelect
                                            {...field}
                                            label='sexe'
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
                                    name='quartier-examen'
                                    control={control}
                                    render={({ field }) => (
                                        <CFormInput
                                            {...field}
                                            type='text'
                                            label='quartier'
                                            placeholder="quartier"
                                            className='p-2 w-75 fw-bold'
                                            id='quartier-examen'
                                            required
                                        />
                                    )}
                                />
                            </CRow>
                            <CRow className='mt-2'>
                                <Controller
                                    name='profession-examen'
                                    control={control}
                                    render={({ field }) => (
                                        <CFormInput
                                            {...field}
                                            type='text'
                                            label='profession'
                                            placeholder="profession"
                                            className='p-2 w-75 fw-bold'
                                            id='profession-examen'
                                            required
                                        />
                                    )}
                                />
                            </CRow>
                            <CRow className='mt-2'>
                                <CFormInputTelephone
                                    mask='+237 6 00 00 00 00'
                                />
                            </CRow>
                        </CContainer>
                    </CCol>
                    <CCol>
                        <CContainer>
                            <h4>infos générales</h4>
                            <CRow>
                                <Controller
                                    name='service'
                                    control={control}
                                    render={({ field }) => (
                                        <CFormInput
                                            {...field}
                                            type='text'
                                            label='service'
                                            placeholder="service"
                                            className='p-2 w-75 fw-bold'
                                            id='service'
                                            required
                                        />
                                    )}
                                />
                                <AfficherRecherche
                                    liste={listeServices}
                                    selectionnerItem={selectionnerService}
                                    valeur='designation'
                                    cle='id'
                                />
                            </CRow>
                            <CRow>
                                <Controller
                                    name='prescripteur'
                                    control={control}
                                    render={({ field }) => (
                                        <CFormInput
                                            {...field}
                                            type='text'
                                            label='prescripteur'
                                            placeholder="prescripteur"
                                            className='p-2 w-75 fw-bold'
                                            id='prescripteur'
                                            required
                                        />
                                    )}
                                />
                                <AfficherRecherche
                                    liste={listePrescripteurs}
                                    selectionnerItem={selectionnerPrescripteur}
                                    valeur='designation'
                                    cle='id'
                                />
                            </CRow>
                            <CRow>
                                <Controller
                                    name='num-recu'
                                    control={control}
                                    render={({ field }) => (
                                        <CFormInput
                                            {...field}
                                            type='text'
                                            label='numéro recu'
                                            placeholder="numéro recu"
                                            className='p-2 w-75 fw-bold'
                                            id='num-recu'
                                            required
                                        />
                                    )}
                                />
                                <AfficherRecherche
                                    liste={listeRecu}
                                    selectionnerItem={selectionnerRecu}
                                    valeur='id'
                                    cle='id'
                                />
                            </CRow>
                            <CRow>
                                <Controller
                                    name='montant'
                                    control={control}
                                    render={({ field }) => (
                                        <CFormInput
                                            {...field}
                                            type='number'
                                            label='montant'
                                            placeholder="montant"
                                            className='p-2 w-75 fw-bold'
                                            id='montant'
                                            required
                                        />
                                    )}
                                />
                            </CRow>
                        </CContainer>
                    </CCol>
                    <CCol>
                        <h4>liste des examens</h4>
                        <CContainer className='h-25 overflow-scroll'>
                            {listeSpecialites.map(item => (
                                <CardSpecalite
                                    key={item.key}
                                    specalite={item.specialite}
                                    examens={item.examens}
                                />
                            ))}
                        </CContainer>
                    </CCol>
                </CRow>
                <CRow className='mt-4 pb-3 float-end'>
                    <CCol xs={12}>
                        <CButton
                            color="dark" 
                            type="submit" 
                        >
                            Enregister
                        </CButton>
                    </CCol>
                </CRow>
            </CContainer>
        </CForm>
    </div>
  )
}
