import React, { useEffect, useRef, useState } from 'react';
import { CButton, CCol, CContainer, CForm, CFormInput, CFormSelect, CRow } from '@coreui/react';
import { nomDns } from '../../../shared/Globals';
import AfficherRecherche from '../AfficherRecherche';
import { IMaskMixin } from 'react-imask';
import { useForm, Controller, set } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import CardSpecalite from '../CardSpecalite';
import { Toaster, toast } from "react-hot-toast";

const schema = yup.object({
    'code-patient-examen': yup.string().required(),
    'noms-patient-examen': yup.string().required(),
    'age-patient-examen': yup.number().min(0).required(),
    'sexe-patient-examen': yup.string().required(),
    'quartier-patient-examen': yup.string().required(),
    'profession-patient-examen': yup.string().required(),
    'telephone-patient-examen': yup.string().required(),
    'service': yup.string().required(),
    'prescripteur': yup.string().required(),
    'num-recu': yup.string().required(),
    'montant': yup.number().min(0).required(),
}).required();

export default function EnregExamens() {

    const boutonEnreg = useRef();

    const [msgErreur, setMsgErreur] = useState('');
    const [listePatients, setListePatients] = useState([]);
    const [listeServices, setListeServices] = useState([]);
    const [listePrescripteurs, setListePrescripteurs] = useState([]);
    const [listeRecu, setListeRecu] = useState([]);
    const [listeSpecialites, setListeSpecialites] = useState([]);

    const { control, watch, handleSubmit, setValue, reset, formState: { errors } } = useForm({
        defaultValues: {
            'code-patient-examen': '',
            'noms-patient-examen': '',
            'age-patient-examen': '',
            'sexe-patient-examen': '',
            'quartier-patient-examen': '',
            'profession-patient-examen': '',
            'telephone-patient-examen': '',
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
                id: item.id,
                specialite: item.designation,
                examens: []
            }
        });
        setListeSpecialites(specialites);
    }

    const ajouterUnExamen = (examen, idSpecialite) => {
        const specialites = listeSpecialites.map(item => {
            if (item.id === idSpecialite) {
                item.examens.push(examen);
            }
            return item;
        });
        setListeSpecialites(specialites);
    }

    const retirerUnExamen = (examen, idSpecialite) => {
        const specialites = listeSpecialites.map(item => {
            if (item.id === idSpecialite) {
                item.examens = item.examens.filter(item => item.id !== examen.id);
            }
            return item;
        });
        setListeSpecialites(specialites);
    }

    useEffect(() => {
        rechercherPatientParCode();
    }, [watch('code-patient-examen')])

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
        const code = watch('code-patient-examen').trim();
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
        setValue('code-patient-examen', patient.code);
        setValue('noms-patient-examen', patient.nom);
        setValue('age-patient-examen', patient.age);
        setValue('sexe-patient-examen', patient.sexe);
        setValue('quartier-patient-examen', patient.quartier);
        setValue('profession-patient-examen', patient.profession);
        setValue('telephone-patient-examen', patient.telephone);

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

    const verifierAuMoinsUnExamenAEteAjouter = () => {
        let resultat = 0;
        listeSpecialites.forEach(item => {
            if (item.examens.length > 0) {
                resultat++;
            }
        })

        return resultat > 0;
    }

    const creerIdFactureExamen = () => {
        const date = new Date();
        const annee = date.getFullYear();
        const mois = date.getMonth() + 1;
        const jour = date.getDate();

        const heure = date.getHours();
        const minute = date.getMinutes();
        const seconde = date.getSeconds();

        const id = `${annee}${mois}${jour}${heure}${minute}${seconde}`;

        return id;
    }

    const enregistrerExamens = (data) => {
        if (verifierAuMoinsUnExamenAEteAjouter()) {
            setMsgErreur('');
            boutonEnreg.current.disabled = true;

            const req = new XMLHttpRequest();
            const dataPost = new FormData();
            const idFactureExam = creerIdFactureExamen();

            dataPost.append('id_facture_exam', idFactureExam);
            dataPost.append('infos_generales', JSON.stringify(data));
            dataPost.append('examens', JSON.stringify(listeSpecialites));
            req.open('POST', `${nomDns}examens_labo.php?enregistrer_examens`);

            req.addEventListener('load', () => {
                reset();
                recupererListeSpecialites();
                boutonEnreg.current.disabled = false;
                toast.success('Enregistrement effectué avec succès');
            })

            req.send(dataPost);

        } else {
            setMsgErreur('Veuillez ajouter au moins un examen');
        }
    }

    const CFormInputTelephone = IMaskMixin(({ inputRef, ...props }) => (
        <Controller
            name='telephone-patient-examen'
            control={control}
            render={({ field }) => (
                <CFormInput
                    {...field}
                    type='text'
                    label='Téléphone'
                    placeholder='Téléphone'
                    id='telephone-patient-examen'
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
        <div><Toaster/></div>
        <h2 className='text-center bg-dark text-light'>Enregistrer examens</h2>
        <p className='text-danger text-center fw-bold'>{msgErreur}</p>
        <CForm onSubmit={handleSubmit(enregistrerExamens)}>
            <CContainer fluid className='px-4'>
            <CRow className='mt-4 pb-3 text-end'>
                    <CCol xs={12}>
                        <CButton
                            color="dark"
                            type="submit"
                            ref={boutonEnreg}
                        >
                            Enregister
                        </CButton>
                    </CCol>
                </CRow>
                <CRow className='mb-4'>
                    <CCol>
                        <CContainer>
                            <h4 className='fw-bold'>infos du patients</h4>
                            <CRow className='mt-2'>
                                <Controller
                                    name='code-patient-examen'
                                    control={control}
                                    render={({ field }) => (
                                        <CFormInput
                                            {...field}
                                            type='text'
                                            label='code'
                                            placeholder="code"
                                            className='p-2 w-75 fw-bold'
                                            id='code-patient-examen'
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
                                    name='noms-patient-examen'
                                    control={control}
                                    render={({ field }) => (
                                        <CFormInput
                                            {...field}
                                            type='text'
                                            label='noms prénoms'
                                            placeholder="noms prénoms"
                                            className='p-2 w-75 fw-bold'
                                            id='noms-patient-examen'
                                            required
                                        />
                                    )}
                                />
                            </CRow>
                            <CRow className='mt-2'>
                                <Controller
                                    name='age-patient-examen'
                                    control={control}
                                    render={({ field }) => (
                                        <CFormInput
                                            {...field}
                                            type='number'
                                            label='age'
                                            placeholder="age"
                                            className='p-2 w-75 fw-bold'
                                            id='age-patient-examen'
                                            required
                                        />
                                    )}
                                />
                                {/* <p className='text-danger fw-bold'>{errors['age-patient-examen']?.message}</p> */}
                            </CRow>
                            <CRow className='mt-2'>
                                <Controller
                                    name='sexe-patient-examen'
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
                                    name='quartier-patient-examen'
                                    control={control}
                                    render={({ field }) => (
                                        <CFormInput
                                            {...field}
                                            type='text'
                                            label='quartier'
                                            placeholder="quartier"
                                            className='p-2 w-75 fw-bold'
                                            id='quartier-patient-examen'
                                            required
                                        />
                                    )}
                                />
                            </CRow>
                            <CRow className='mt-2'>
                                <Controller
                                    name='profession-patient-examen'
                                    control={control}
                                    render={({ field }) => (
                                        <CFormInput
                                            {...field}
                                            type='text'
                                            label='profession'
                                            placeholder="profession"
                                            className='p-2 w-75 fw-bold'
                                            id='profession-patient-examen'
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
                            <h4 className='fw-bold'>infos générales</h4>
                            <CRow className='mt-2'>
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
                            <CRow className='mt-2'>
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
                            <CRow className='mt-2'>
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
                            <CRow className='mt-2'>
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
                    <CCol style={{ height: '70vh'}} className=''>
                        <h4 className='fw-bold'>liste des examens</h4>
                        <CContainer className='h-75 overflow-auto'>
                            {listeSpecialites.map(item => (
                                <CardSpecalite
                                    key={item.id}
                                    specalite={item.specialite}
                                    examens={item.examens}
                                    ajouterUnExamen={(examen) => ajouterUnExamen(examen, item.id)}
                                    retirerUnExamen={(examen) => retirerUnExamen(examen, item.id)}
                                />
                            ))}
                        </CContainer>
                    </CCol>
                </CRow>
            </CContainer>
        </CForm>
    </div>
  )
}
