import React, { useEffect, useState, useContext, useRef, Fragment } from 'react';
import './Apercu.css';
import { ContextChargement } from '../../Context/Chargement';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import ReactToPrint from 'react-to-print';
import ImprimerHistorique from '../ImprimerHistorique/ImprimerHistorique';
import { extraireCode, getDateTime, nomDns, recupererDateJour, recupererHeureJour, sauvegarderBd } from '../../shared/Globals';
import { CFormSwitch } from '@coreui/react';


export default function Apercu(props) {

    const date_e = new Date('2025-02-15');
    const date_j = new Date();

    const componentRef = useRef();

    let date_select1 = useRef();
    let date_select2 = useRef();
    let heure_select1 = useRef();
    let heure_select2 = useRef();

    const {chargement, stopChargement, startChargement} = useContext(ContextChargement);

    const [historique, sethistorique] = useState([]);
    const [listeComptes, setListeComptes] = useState([]);
    // const [dateJour, setdateJour] = useState('');
    const [total, setTotal] = useState('');
    const [reccetteTotal, setRecetteTotal] = useState(false);
    const [dette, setDette] = useState(false);
    const [dateDepart, setdateDepart] = useState('');
    const [dateFin, setdateFin] = useState('');
    const [caissier, setCaissier] = useState('');
    const [assurance, setAssurance] = useState('non');
    const [messageErreur, setMessageErreur] = useState('');
    const [filtre, setFiltre] = useState(true);
    const [currentDate, setCurrentDate] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const execGetDateTime = async () => {
        const dateTime = await getDateTime();
        setCurrentDate(dateTime.date);
    }

    useEffect(() => {

        if (date_j.getTime() <= date_e.getTime()) {
            
        } else {
            setTimeout(() => {
                props.setOnglet(25);
            }, 3000);
        }

        if (dateDepart.length > 0 && dateFin.length > 0) {
            
            setIsLoading(true)
    
            let dateD = dateDepart;
            let dateF = dateFin;

            const data = new FormData();
            data.append('dateD', dateD);
            data.append('dateF', dateF);
            data.append('caissier', caissier.toLowerCase());
            data.append('assurance', assurance);
    
            const req = new XMLHttpRequest();
    
            req.open('POST', `${nomDns}apercu.php`);
    
            req.addEventListener('load', () => {
                execGetDateTime();
                setMessageErreur('');
                // console.log(JSON.parse(req.responseText));
                // console.log(req.responseText);
                recupererRecetteTotal(data);
                const result = JSON.parse(req.responseText);
                sethistorique(result);
                
                let t = 0;
                result.forEach(item => {
                    t += parseInt(item.prix_total);
                })

                setTotal(t);

                stopChargement();
            });
    
            req.addEventListener("error", function () {
                // La requête n'a pas réussi à atteindre le serveur
                setMessageErreur('Erreur réseau');
            });
    
            req.send(data);
        }

    }, [dateDepart, dateFin, caissier, assurance]);

    useEffect(() => {
        // Récupération des comptes

        recupererHeureDernierService();
        recupererDateJour('date-f-listing');
        recupererHeureJour('heure-f-listing');

        const req = new XMLHttpRequest();
        req.open('GET', `${nomDns}recuperer_caissier.php`);

        req.addEventListener('load', () => {
            if(req.status >= 200 && req.status < 400) {
                setMessageErreur('');
                let result = JSON.parse(req.responseText);
                result = result.filter(item => (item.rol === "caissier"))
                setListeComptes(result);
            }
        });

        req.addEventListener("error", function () {
            // La requête n'a pas réussi à atteindre le serveur
            setMessageErreur('Erreur réseau');
        });

        req.send();
    }, []);

    const recupererRecetteTotal = (data) => {
        const req = new XMLHttpRequest();
        req.open('POST', `${nomDns}recuperer_recette.php`);

        req.addEventListener('load', () => {
            if(req.status >= 200 && req.status < 400) {
                setMessageErreur('');
                let result = JSON.parse(req.responseText);

                if (props.role.toLowerCase() === "caissier") {
                    result = result.filter(item => (item.caissier.toLowerCase() == props.nomConnecte.toLowerCase()));
                } else {
                    if (filtre) {
                        result = result.filter(item => (item.caissier.toLowerCase() == caissier.toLowerCase()));
                    }
                }
                
                let recette = 0, resteAPayer = 0;
                if (assurance === "non") {
                    result.forEach(item => {
                        if (item.assurance.toUpperCase() === "aucune".toUpperCase()) {
                            recette += parseInt(item.a_payer);
                            resteAPayer += parseInt(item.reste_a_payer)
                        }
                    });
                } else {
                    result.forEach(item => {
                        if (item.assurance.toUpperCase() !== "aucune".toUpperCase()) {
                            recette += parseInt(item.a_payer);
                            resteAPayer += parseInt(item.reste_a_payer)
                        }
                    });
                }
                recette -= resteAPayer
                setRecetteTotal(recette);
                setDette(resteAPayer);
                setIsLoading(false)
            }
        });

        req.addEventListener("error", function () {
            // La requête n'a pas réussi à atteindre le serveur
            setMessageErreur('Erreur réseau');
        });

        req.send(data);
    }

    const rechercherHistorique = () => {
        setdateDepart(date_select1.current.value + ' ' + heure_select1.current.value + ':00');
        setdateFin(date_select2.current.value + ' ' + heure_select2.current.value + ':59');
        if (filtre) {
            setCaissier(document.getElementById('caissier').value.toLowerCase());
        } else {
            setCaissier('tout');
        }
    }

    const enregistrerHeureFin = () => {
        let dateDuJour = new Date();
        
        let dateDuJourFormate = dateDuJour.getFullYear() + '-' + ('0' + (dateDuJour.getMonth() + 1)).slice(-2) + '-' + ('0' + dateDuJour.getDate()).slice(-2);
        if (dateDuJourFormate === dateFin.slice(0, 10)) {
            const req = new XMLHttpRequest();
            req.open('GET', `${nomDns}horaire_caisse.php?heure_fin=${dateFin}`);
    
            req.addEventListener('load', () => {
                if(req.status >= 200 && req.status < 400) {
                    sauvegarderBd();
                    // console.log(req.responseText);
                }
            });
    
            req.addEventListener("error", function () {
                // La requête n'a pas réussi à atteindre le serveur
                setMessageErreur('Erreur réseau');
            });
    
            req.send();
        }
    }

    const recupererHeureDernierService = () => {
        const req = new XMLHttpRequest();
        req.open('GET', `${nomDns}horaire_caisse.php?recup_heure`);

        req.addEventListener('load', () => {
            if(req.status >= 200 && req.status < 400) {
                const result = JSON.parse(req.response);
                document.querySelector('#date-d-listing').value = result.date_heure.slice(0, 10);
                document.querySelector('#heure-d-listing').value = result.date_heure.slice(11, 16);
            }
        });

        req.addEventListener("error", function () {
            // La requête n'a pas réussi à atteindre le serveur
            setMessageErreur('Erreur réseau');
        });

        req.send();
    }

    return (
        <section className="historique">
            <h1>Listing des caissiers</h1>
            <div className="container-historique">
                <div className="table-commandes">
                    <div className="entete-historique">
                        <div className='erreur-message'>{messageErreur}</div>
                        <div>
                            <p>
                                <label htmlFor="">Du : </label>
                                <input id='date-d-listing' type="date" ref={date_select1} />
                                <input id='heure-d-listing' type="time" ref={heure_select1} />
                            </p>
                            <p>
                                <label htmlFor="">Au : </label>
                                <input id='date-f-listing' type="date" ref={date_select2} />
                                <input id='heure-f-listing' type="time" ref={heure_select2} />
                            </p>

                            <p>
                                {
                                props.role === "admin" && 
                                <Fragment>
                                    <CFormSwitch
                                        label="Filtrer"
                                        id="formSwitchCheckDefault"
                                        checked={filtre}
                                        reverse={true}
                                        onChange={(e) => setFiltre(!filtre)}
                                    />
                                </Fragment>
                                }
                            </p>
                            <p>
                                {/* <label htmlFor="assure">Categorie : </label>
                                <select name="" id="assure" onChange={(e) => setAssurance(e.target.value)}>
                                    <option value="non">non assuré</option>
                                    <option value="oui">assuré</option>
                                </select> */}
                            </p>
                            <p>
                                <label htmlFor="">Caissier : </label>
                                <select name="caissier" id="caissier">
                                    {props.role === "caissier" ? 
                                    <option value={props.nomConnecte.toLowerCase()}>{props.nomConnecte.toUpperCase()}</option> :
                                    listeComptes.map(item => (
                                        <option value={item.nom_user.toLowerCase()}>{item.nom_user.toUpperCase()}</option>
                                    ))}
                                </select>
                            </p>
                        </div>
                        <button className='bootstrap-btn valider' onClick={rechercherHistorique}>rechercher</button>
                        <div>Total : <span style={{fontWeight: '700'}}>{total ? total + ' Fcfa' : '0 Fcfa'}</span></div>
                        {/* <div>Dette : <span style={{fontWeight: '700'}}>{dette ? dette + ' Fcfa' : '0 Fcfa'}</span></div> */}
                        <div>Recette : <span style={{fontWeight: '700'}}>{reccetteTotal + ' Fcfa'}</span></div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <td>Désignation</td>
                                <td>Total</td>
                            </tr>
                        </thead>
                        <tbody>
                            {!isLoading ? historique.length > 0 ? historique.map(item => (
                                <tr>
                                    <td>{extraireCode(item.designation) + ' (' + item.qte + ')'}</td>
                                    <td>{item.prix_total + ' Fcfa'}</td>
                                </tr>
                            )) :
                                <div className='fw-bold text-center w-100'>
                                    {'Aucune donnée correspondante'}
                                </div>
                                :
                                <div className='fw-bold text-center w-100'>
                                    {'Chargement... '}
                                </div>
                            }
                        </tbody>
                    </table>
                </div>
                {historique.length > 0 && (
                    <div style={{textAlign: 'center'}}>
                        <ReactToPrint
                            trigger={() => <button className='bootstrap-btn valider' style={{marginTop: '8px', color: '#f1f1f1', height: '5vh', width: '20%', cursor: 'pointer', fontSize: 'large', fontWeight: '600'}}>Imprimer</button>}
                            content={() => componentRef.current}
                            onAfterPrint={enregistrerHeureFin}
                        />
                    </div>
                )}
            </div>
            <div style={{display: 'none'}}>
                <ImprimerHistorique
                    ref={componentRef}
                    historique={historique}
                    recetteTotal={reccetteTotal}
                    listing={assurance}
                    total={total}
                    nomConnecte={caissier}
                    dateDepart={dateDepart}
                    dateFin={dateFin}
                    dateDuJour={currentDate}
                    filtre={filtre}
                />
            </div>
        </section>
    )
}
