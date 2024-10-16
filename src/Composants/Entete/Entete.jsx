import React, { useState, useRef, Fragment } from 'react';
import './Entete.css';
import ReactToPrint from 'react-to-print';
import Modal from 'react-modal';
import Loader from "react-loader-spinner";
import { FaSignOutAlt } from 'react-icons/fa';
import { nomDns } from '../../shared/Globals';

const customStyles1 = {
    content: {
      top: '32%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      background: '#0e771a',
    },
};

const customStyles2 = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        background: '#0e771a',
      },
};

export default function Entete(props) {

    const servicesInit = [
        {code: 'PHA', service: 'Pharmacie', recette: 0, pourcentage: 0, recetteRestante: 0},
        {code: 'MA', service: 'Maternité', recette: 0, pourcentage: 0, recetteRestante: 0},
        {code: 'RX', service: 'Radiologie', recette: 0, pourcentage: 0, recetteRestante: 0},
        {code: 'LAB', service: 'Laboratoire', recette: 0, pourcentage: 0, recetteRestante: 0},
        {code: 'ECHO', service: 'Echographie', recette: 0, pourcentage: 0, recetteRestante: 0},
        {code: 'MED', service: 'Médécine', recette: 0, pourcentage: 0, recetteRestante: 0},
        {code: 'CHR', service: 'Petite chirurgie', recette: 0, pourcentage: 0, recetteRestante: 0},
        {code: 'UPEC', service: 'Upec', recette: 0, pourcentage: 0, recetteRestante: 0},
        {code: 'CO', service: 'Consultation', recette: 0, pourcentage: 0, recetteRestante: 0},
    ];

    const componentRef = useRef();

    const utilisateur = {
        ancien: '',
        nouveau: '',
        confirmation: ''
    }

    const [slide, setSlide] = useState(false);
    const [nouveauMdp, setNouveauMdp] = useState(utilisateur);
    const [modalConfirmation, setModalConfirmation] = useState(false);
    const [msgErreur, setMsgErreur] = useState('');
    const [mdpReussi, setMdpReussi] = useState(false);
    const [modalReussi, setModalReussi] = useState(false);
    const [encours, setenCours] = useState(true);

    const { ancien, nouveau, confirmation } = nouveauMdp;

    const handleChange = (e) => {
        setNouveauMdp({...nouveauMdp, [e.target.name]: e.target.value});
    }

    const modifierMotDePasse = (e) => {
        // Modification du mot de passe

        e.preventDefault();

        if (nouveau.length > 0 && nouveau === confirmation) {
            setMsgErreur('');
            const data = new FormData();
            data.append('nom', props.nomConnecte);
            data.append('ancien', ancien);
            data.append('nouveau', nouveau);

            const req = new XMLHttpRequest();
            req.open('POST', `${nomDns}modif_pass_caisse.php`);

            req.addEventListener('load', () => {
                if (req.status >= 200 && req.status < 400) {
                    if (req.responseText == "L'ancien mot de passe ne corresppond pas") {
                        setMsgErreur("L'ancien mot de passe ne corresppond pas");
                    } else  {
                        setNouveauMdp(utilisateur);
                        fermerModalConfirmation();
                        setenCours(true);
                        setMdpReussi(true);
                        setModalReussi(true);
                    }
                } else {
                    console.log(req.status + " " + req.statusText);
                }
            });

            req.send(data);

        } else {
            setMsgErreur('Le mot de passe et le mot passe de confirmation doivent être identique')
        }
    }

    const deconnection = () => {
        props.setConnecter(false);
        props.setOnglet(1);
        setModalReussi(false);
    }

    const fermerModalConfirmation = () => {
        setModalConfirmation(false);
        setMsgErreur('');
        setNouveauMdp(utilisateur);
    }

    const fermerModalReussi = () => {
        setModalReussi(false);
    }

    return (
        <header className="entete" style={{height: `${slide ? '18vh' : '18vh'}`}}>
            <Modal
                isOpen={modalReussi}
                style={customStyles2}
                contentLabel="Recette jour"
            >
                {mdpReussi ? '' : <h2 style={{color: '#fff'}}>Imprimez votre fiche de recette du jour</h2>}
                {!encours ? (
                    <Fragment>
                        <ReactToPrint
                            trigger={() => <button style={{color: '#303031', marginRight: '15px', height: '5vh', width: '7vw', cursor: 'pointer', fontSize: 'large', fontWeight: '600'}}>Imprimer</button>}
                            content={() => componentRef.current}
                        />
                        <button style={{width: '20%', height: '5vh', cursor: 'pointer', fontSize: 'large'}} onClick={deconnection}>Fermer</button>
                    </Fragment>) :
                    (   
                        <div className='loader'>
                            {mdpReussi ? 
                                (
                                <div>
                                    <h2 style={{color: '#fff'}}>Mot de passe modifié avec succès✔️ !</h2>
                                    <button style={{width: '20%', height: '5vh', cursor: 'pointer', fontSize: 'large'}} onClick={fermerModalReussi}>Fermer</button>
                                </div>
                                ) :
                                (<Loader type="Circles" color="#fff" height={100} width={100}/>)
                            }
                        </div>
                    )
                }
            </Modal>
            <Modal
                isOpen={modalConfirmation}
                onRequestClose={fermerModalConfirmation}
                style={customStyles1}
                contentLabel=""
            >
                <form action="" className="form-compte">
                    <h3>Modifier mot de passe</h3>
                    <div className="box-input">
                        <p className="input-zone">
                            <label htmlFor="">Ancien mot de passe</label>
                            <input type="password" name="ancien" value={ancien} onChange={handleChange} autoComplete="off" />
                        </p>
                        <p className="input-zone">
                            <label htmlFor="">Nouveau mot de passe</label>
                            <input type="password" name="nouveau" value={nouveau} onChange={handleChange} autoComplete="off" />
                        </p>
                        <p className="input-zone">
                            <label htmlFor="">Confirmer nouveau mot de passe</label>
                            <input type="password" name="confirmation" value={confirmation} onChange={handleChange} autoComplete="off" />
                        </p>
                    </div>
                    <div style={{color: '#fff53b'}}>{msgErreur}</div>
                    <div className="btn-control">
                        <button type="reset" onClick={fermerModalConfirmation}>annuler</button>
                        <button type="submit" onClick={modifierMotDePasse}>valider</button>
                    </div>
                </form>
            </Modal>
            <div className="box-entete">
                <h1 style={{textAlign: 'center', width: '98vw', fontSize: '29px'}}>
                    Caisse
                </h1>
                <h3 className='ms-4' onClick={() => setSlide(!slide)}>{props.nomConnecte.toUpperCase()}</h3>
                <div className='deconnection' style={{display: `${slide ? 'flex' : 'flex'}`,}}>
                    <div style={{cursor: 'pointer'}} onClick={deconnection} title="deconnection" >
                        <FaSignOutAlt size={24} />
                    </div>
                    <div>
                        <button style={{display: `${slide ? 'inline' : 'inline'}`}} onClick={() => {setModalConfirmation(true);}} >Modifier</button>
                    </div>
                </div>
            </div>
        </header>
    )
}
