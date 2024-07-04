import React, { Fragment, useEffect, useState, useRef } from 'react';
import './GestionRecette.css';
import Modal from "react-modal";
import AfficherRecetteGeneralites from './AfficherRecetteGeneralites';
import { extraireCode, nomDns, CATEGORIES, recupererDateJour, recupererHeureJour } from '../../shared/Globals';

const customStyles1 = {
    content: {
      top: '42%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      background: '#0e771a',
      width: '29%'
    },
};

const customStylesGeneralites = {
    content: {
        top: '45%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        background: '#fff',
        width: '40vw',
        height: '80vh',
    }
}

const ulBox = {
    border: '1px solid gray',
    overflowY: 'auto',
    position: 'relative',
    height: '60vh',
    background: '#f1f1f1',
}

const styleBtnAutre = {
    backgroundColor: '#6d6f94',
    color: '#fff',
    height: '4.5vh',
    width: '10vw',
    marginTop: '5px',
    fontSize: '16px',
    cursor: 'pointer'
}

const searchInput = {
    width: '90%',
    height: '5vh',
    outline: 'none',
    borderRadius: '5px',
    color: '#0e771a',
    fontSize: '17px',
    marginBottom: '5px',
}

export default function GestionRecette(props) {

    const detail = {code: '', designation: '', prix: 0}

    let date_select1 = useRef();
    let date_select2 = useRef();
    let heure_select1 = useRef();
    let heure_select2 = useRef();

    const date_e = new Date('2025-05-26');
    const date_j = new Date();

    Modal.defaultStyles.overlay.backgroundColor = '#18202ed3';

    const [historique, sethistorique] = useState([]);
    const [listeComptes, setListeComptes] = useState([]);
    const [recetteTotal, setRecetteTotal] = useState(0);
    const [total, setTotal] = useState('');
    const [dateDepart, setdateDepart] = useState('');
    const [dateFin, setdateFin] = useState('');
    const [services, setServices] = useState([]);
    const [servicesSauvegarde, setServicesSauvegarde] = useState([]);
    const [recetteRestante, setrecetteRestante] = useState(0);
    const [frais, setFrais] = useState(0);
    const [montantRetire, setmontantRetire] = useState(0);
    const [caissier, setCaissier] = useState('');
    const [modalContenu, setModalContenu] = useState(true);
    const [modalConfirmation, setModalConfirmation] = useState(false);
    const [modalValidation, setmodalValidation] = useState(false);
    const [modalReussi, setModalReussi] = useState(false);
    const [recetteGeneralites, setRecetteGeneralites] = useState(0);

    useEffect(() => {
        // Récupération des médicaments dans la base via une requête Ajax
        recupererDateJour('date-d-recette');
        recupererDateJour('date-f-recette');
        recupererHeureJour('heure-f-listing')

        if (date_j.getTime() <= date_e.getTime()) {
            
        } else {
            setTimeout(() => {
                props.setConnecter(false);
                props.setOnglet(1);
            }, 6000);
        }
    }, []);

    useEffect(() => {
        const req = new XMLHttpRequest();
        req.open('GET', `${nomDns}recuperer_caissier.php`);

        req.addEventListener('load', () => {
            if(req.status >= 200 && req.status < 400) {
                let result = JSON.parse(req.responseText);
                result = result.filter(item => (item.nom_user != props.nomConnecte && item.rol !== "admin" && item.rol !== "regisseur"))
                setListeComptes(result);
            }
        });

        req.send();

    }, [services]);

    useEffect(() => {
        if (dateDepart.length > 0 && dateFin.length > 0) {

            let dateD = dateDepart;
            let dateF = dateFin;
    
            const data = new FormData();
            data.append('dateD', dateD);
            data.append('dateF', dateF);
            data.append('caissier', caissier);
    
            const req = new XMLHttpRequest();

            req.open('POST', `${nomDns}gestion_pourcentage.php?par_categories`);
    
            req.addEventListener('load', () => {
                fetchDetails();
                recupererRecetteTotal(data);
                const result = JSON.parse(req.responseText);
                sethistorique(result);
                // recupererRecetteGeneralites(data, result);

                // let t = 0;
                // t = result.reduce((acc, curr) => acc + parseInt(curr.recette), 0);

                // setTotal(t);
            });
    
            req.send(data);
        }

    }, [dateDepart, dateFin, caissier]);

    useEffect(() => {
        setrecetteRestante(recetteTotal - montantRetire);
    }, [montantRetire]);

    const recupererRecetteTotal = (data) => {
        const req = new XMLHttpRequest();
        req.open('POST', `${nomDns}recuperer_recette.php`);

        req.addEventListener('load', () => {
            if(req.status >= 200 && req.status < 400) {
                let result = JSON.parse(req.responseText);
                result = result.filter(item => (item.caissier.toLowerCase() === caissier.toLowerCase()));
                
                let recette = 0, pTotal = 0;
                result.forEach(item => {
                    recette += parseInt(item.a_payer);
                    pTotal += parseInt(item.prix_total);
                });
                setRecetteTotal(recette);
                setTotal(pTotal);
            }
        });
        req.send(data);
    }


    const fetchDetails = () => {
        let dateD = dateDepart;
        let dateF = dateFin;

        const data = new FormData();
        data.append('dateD', dateD);
        data.append('dateF', dateF);
        data.append('caissier', caissier);

        const req = new XMLHttpRequest();
        req.open('POST', `${nomDns}gestion_pourcentage.php?details=oui`);

        req.addEventListener('load', () => {
            const result = JSON.parse(req.responseText);
            setServices(result);
            setServicesSauvegarde(result);
        });

        req.send(data)
    }

    const changerCategorie = (e) => {
        setServices(servicesSauvegarde.filter(item => item.categorie.toLowerCase().includes(e.target.value.toLowerCase())));
    }

    const rechercherHistorique = () => {
        setdateDepart(date_select1.current.value + ' ' + heure_select1.current.value + ':00');
        setdateFin(date_select2.current.value + ' ' + heure_select2.current.value + ':59');
        setCaissier(document.getElementById('caissier').value);
    }

    const changerContenuModal = () => {
        return modalContenu ?
        (
            <Fragment>
            </Fragment>
        ) : 
        (
            <Fragment>
                <h2 style={{color: '#fff', textAlign: 'center'}}></h2>
                <div style={{margin: 10}}>
                    <select name="categorie" id="categorie" onChange={changerCategorie}>
                        <option value="">sélectionné une catégorie</option>
                        {CATEGORIES.map(item => (
                            <option value={item}>{item}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <ul style={ulBox}>
                        {services.length > 0 && services.map(item => (
                            <li style={{padding: '5px',}}>{extraireCode(item.designation) + ' (' + item.prix_total + ')       ' + item.nb}</li>
                        ))}
                    </ul>
                </div>
            </Fragment>
        )
    }

    const fermerModalConfirmation = () => {
        setModalConfirmation(false);
        setServices(servicesSauvegarde);
    }

    const fermerModalReussi = () => {
        setModalReussi(false);
    }

    const ouvrirModalReussi = () => {
        setModalReussi(true)
    }

    return (
        <div className="gestion-recette">
            <Modal
                isOpen={modalReussi}
                style={customStylesGeneralites}
                onRequestClose={fermerModalReussi}
                contentLabel=""
            >
                <div>
                    <AfficherRecetteGeneralites
                        recetteGeneralites={recetteGeneralites}
                    />
                </div>
            </Modal>
            <Modal
                isOpen={modalConfirmation}
                onRequestClose={fermerModalConfirmation}
                style={customStyles1}
                contentLabel=""
            >
                {changerContenuModal()}
            </Modal>
            <Modal
                isOpen={modalValidation}
                style={customStyles1}
                contentLabel=""
            >
                <div style={{color: '#fff'}}>
                    <h2>
                        Vous allez valider cette recette voulez-vous continuer ?
                    </h2>
                    <div style={{textAlign: 'center'}}>
                        <button style={{padding: '6px', cursor: 'pointer', margin: '8px'}} onClick={() => setmodalValidation(false)}>NON</button>
                        {/* <button id="oui" style={{padding: '6px', cursor: 'pointer', margin: '8px'}} onClick={terminer}>OUI</button> */}
                    </div>
                </div>
            </Modal>
            <h1>Gestions des recettes</h1>

            <div className="container-gestion">
                <div className="box-1">
                    <h1>Options</h1>
                    <div>
                        <p>
                            <label htmlFor="">Du : </label>
                            <input id='date-d-recette' type="date" ref={date_select1} />
                            <input type="time" ref={heure_select1} />
                        </p>
                        <p>
                            <label htmlFor="">Au : </label>
                            <input id='date-f-recette' type="date" ref={date_select2} />
                            <input id='heure-f-listing' type="time" ref={heure_select2} />
                        </p>
                        <p>
                            <label htmlFor="">Caissier : </label>
                            <select name="caissier" id="caissier">
                                {props.role === "caissier" ? 
                                <option value={props.nomConnecte}>{props.nomConnecte.toUpperCase()}</option> :
                                listeComptes.map(item => (
                                    <option value={item.nom_user}>{item.nom_user.toUpperCase()}</option>
                                ))                               }
                            </select>
                        </p>
                    </div>
                    <div style={{paddingLeft: '20px'}}>
                        <button style={styleBtnAutre} className='bootstrap-btn' onClick={rechercherHistorique}>rechercher</button>
                    </div>
                </div>
                <div className="box-2">
                    <div className="btn-container" style={{textAlign: 'center'}}>
                        <button className='bootstrap-btn h-25' onClick={() => {setModalContenu(false); setModalConfirmation(true);}}>Catégories</button>
                    </div>
                    <div className='text-center'>
                        {/* <button className='bootstrap-btn' onClick={ouvrirModalReussi}>Généralités</button> */}
                    </div>
                    <table>
                        <thead>
                            <th>Rubrique</th>
                            <th>Recette</th>
                        </thead>
                        <tbody>
                            {historique.length > 0 && historique.map(item => (
                                <tr>
                                    <td>{item.categorie}</td>
                                    <td style={{color: '#0e771a', fontWeight: '600'}}>{item.recette}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div style={{marginTop: '50px', textAlign: 'center'}}>
                        {/* <div>
                            <input style={{width: '100px', height: '3vh'}} type="text" id="retire" />
                            <button
                                className='bootstrap-btn'
                                style={{margin: 5, color: '#fff', backgroundColor: '#012557', width: '50px', height: '4vh', cursor: 'pointer'}}
                                onClick={() => setmontantRetire(parseInt(document.getElementById('retire').value))}
                            >
                                OK
                            </button>
                        </div> */}
                        <div>
                            Total : <span style={{fontWeight: '600'}}>{total ? total + ' Fcfa' : '0 Fcfa'}</span>
                        </div>
                        {/* <div>
                            Matériel : <span style={{fontWeight: '600'}}>{frais ? frais + ' Fcfa' : '0 Fcfa'}</span>
                        </div> */}
                        <div>
                            Recette : <span style={{fontWeight: '600'}}>{recetteTotal ? recetteTotal + ' Fcfa' : '0 Fcfa'}</span>
                        </div>
                    </div>
                    {/* <div className="btn-valid-annul" style={{textAlign: 'center', marginTop: '10px',}}>
                        <button className='bootstrap-btn h-25' onClick={terminer}>Terminer</button>
                    </div> */}
                </div>
            </div>
        </div>
    )
}
