import React, { Fragment, useEffect, useState, useRef } from 'react';
import './GestionRecette.css';
import Modal from "react-modal";
import { extraireCode, soustraireUnNombreAUneDate, leMoisDernier, ceMoisCi, nomDns, CATEGORIES } from '../../shared/Globals';
import AfficherRecetteGeneralites from './AfficherRecetteGeneralites';
import { CFormCheck, CContainer, CRow, CCol } from '@coreui/react';
import { CChart } from '@coreui/react-chartjs';

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

    const date_e = new Date('2024-03-19');
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
    const [modalReussi, setModalReussi] = useState(false);
    const [valeur, setValeur] = useState('');
    const [recetteGeneralites, setRecetteGeneralites] = useState(0);
    const [totalGeneralites, setTotalGeneralites] = useState(0);
    const [itemPourcentage, setitemPourcentage] = useState('');
    const [plusOptions, setPlusOptions] = useState(true);
    const [idRadio, setIdRadio] = useState('7');
    const [labelsChart, setLabelsChart] = useState([]);
    const [data1ChartTotal, setData1ChartTotal] = useState([]);
    const [data2ChartRecette, setData2ChartRecette] = useState([]);

    useEffect(() => {
        // Récupération des médicaments dans la base via une requête Ajax
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
                recupererRecetteGeneralites(data, result);

                let t = 0;
                t = result.reduce((acc, curr) => acc + parseInt(curr.recette), 0);

                setTotal(t);
            });
    
            req.send(data);
        }

    }, [dateDepart, dateFin, caissier]);

    const recupererRecetteGeneralites = (data, categories) => {
        const req = new XMLHttpRequest();
        req.open('POST', `${nomDns}gestion_pourcentage.php?recette_generalite`);

        req.addEventListener('load', () => {
            if(req.status >= 200 && req.status < 400) {
                let result = JSON.parse(req.responseText);
                setRecetteGeneralites(result);

                let recetteGen = result.reduce((acc, curr) => acc + parseInt(curr.recette), 0);
                setTotalGeneralites(recetteGen);
                sethistorique([...categories]);
            }
        });

        req.send(data);
    }

    const recupererRecetteTotal = (data) => {
        const req = new XMLHttpRequest();
        req.open('POST', `${nomDns}recuperer_recette.php`);

        req.addEventListener('load', () => {
            if(req.status >= 200 && req.status < 400) {
                let result = JSON.parse(req.responseText);
                result = result.filter(item => (item.caissier.toLowerCase() === caissier.toLowerCase()));
                
                let recette = 0, f = 0;
                result.forEach(item => {
                    recette += parseInt(item.a_payer);
                    f += parseInt(item.frais);
                });
                setRecetteTotal(recette);
                setFrais(f);
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
                <h2 style={{color: '#fff', textAlign: 'center', marginBottom: '10px'}}>{itemPourcentage}</h2>
                <div style={{color: '#fff', textAlign: 'center',}}>Entrez le pourcentage</div>
                <div style={{textAlign: 'center'}} className='modal-button'>
                    <input type="text"value={valeur} onChange={(e) => {if (!isNaN(e.target.value)) {setValeur(e.target.value)}}} style={{width: '40%', height: '3vh', marginBottom: '6px'}} />
                    <button 
                        id='confirmer' 
                        className='btn-confirmation' 
                        style={{width: '15%', height: '3vh', cursor: 'pointer', marginLeft: '5px'}} 
                        onClick={appliquerPourcentage}>
                        OK
                    </button>
                </div>
                <p>
                    <input style={searchInput} type="text" placeholder="recherchez..." autoComplete='off' />
                </p>
                <div>
                    <table>
                        <thead>
                            <th>Services</th>
                            <th>Total</th>
                        </thead>
                        <tbody>
                            {services.length > 0 && services.map(item => (
                                <tr>
                                    <td>{item.designation}</td>
                                    <td style={{color: '#0e771a', fontWeight: '600'}}>{item.prix_total}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Fragment>
        ) : 
        (
            <Fragment>
                <h2 style={{color: '#fff', textAlign: 'center'}}></h2>
                <div style={{margin: 10}}>
                    <select name="categorie" id="categorie" onChange={changerCategorie}>
                        <option value="">Selectionnez une catégorie</option>
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

    const appliquerPourcentage = () => {
        // Application du pourcentage sur un service
        if (valeur.length > 0 && !isNaN(valeur)) {
            const item = services.filter(item => (item.service === itemPourcentage));
            item[0].pourcentage = parseInt(valeur);
            item[0].recetteRestante = parseInt(item[0].recetteRestante) - parseInt(item[0].recetteRestante) * (item[0].pourcentage / 100);

            // On met à jour la recette restante
            let recetteT = 0
            services.map(item => {recetteT += parseInt(item.recetteRestante)});
            setrecetteRestante(recetteT);

            setValeur('');
            fermerModalConfirmation();
        }
        
    }

    // const genererId = () => {
    //     // Fonction pour générer un identifiant unique pour une commande
    //     return Math.floor((1 + Math.random()) * 0x10000)
    //            .toString(16)
    //            .substring(1) + recetteTotal;
    // }

    // const terminer = () => {
    //     // Enregistrement de la recette et de tous les détails
    //     const id_recette = genererId();

    //     const data = new FormData();
    //     data.append('id_recette', id_recette);
    //     data.append('recette_total', recetteTotal);
    //     data.append('montant_retire', montantRetire);
    //     data.append('recette_restante', recetteRestante);
    //     data.append('caissier', caissier);
    //     data.append('regisseur', props.nomConnecte);

    //     const req = new XMLHttpRequest();
    //     req.open('POST', `${nomDns}gestion_pourcentage.php');

    //     req.addEventListener('load', () => {
    //         if(req.status >= 200 && req.status < 400) {
    //             fermerModaValidation();
    //             annuler()
    //         }
    //     })

    //     req.send(data);

    // }

    const rechercheParPeriode = (date1, date2) => {
        // Recherche des recettes par période
        if (date1 !== '' && date2 !== '') {
            const data = new FormData();
            data.append('date1', date1);
            data.append('date2', date2);

            const req = new XMLHttpRequest();
            req.open('POST', `${nomDns}recette_par_periode.php?recette`);

            req.addEventListener('load', () => {
                if(req.status >= 200 && req.status < 400) {
                    const res = JSON.parse(req.responseText);
                    majDonneesFinales(res);
                    recupGeneralitesParPeriode(date1, date2);
                    recupDetailsParPeriode(date1, date2);
                }
            });

            req.send(data);
        }
    }

    const recupGeneralitesParPeriode = (date1, date2) => {
        setRecetteGeneralites([]);
        setTotalGeneralites(0);
        // Récupération des généralités par période
        if (date1 !== '' && date2 !== '') {
            const data = new FormData();
            data.append('date1', date1);
            data.append('date2', date2);

            const req = new XMLHttpRequest();
            req.open('POST', `${nomDns}recette_par_periode.php?generalites`);

            req.addEventListener('load', () => {
                if(req.status >= 200 && req.status < 400) {
                    const result = JSON.parse(req.responseText);
                    setRecetteGeneralites(result);
                    let recetteGen = result.reduce((acc, curr) => acc + parseInt(curr.recette), 0);
                    setTotalGeneralites(recetteGen);
                }
            });

            req.send(data);
        }
    }

    const recupDetailsParPeriode = (date1, date2) => {
        setServices([]);
        setServicesSauvegarde([]);
        // Récupération des détails par période
        if (date1 !== '' && date2 !== '') {
            const data = new FormData();
            data.append('date1', date1);
            data.append('date2', date2);

            const req = new XMLHttpRequest();
            req.open('POST', `${nomDns}recette_par_periode.php?details`);

            req.addEventListener('load', () => {
                if(req.status >= 200 && req.status < 400) {
                    const result = JSON.parse(req.responseText);
                    setServices(result);
                    setServicesSauvegarde(result);
                }
            });

            req.send(data);
        }
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

    const onChangePlusOption = (e) => {
        props.role.toUpperCase() === 'admin'.toUpperCase() && setPlusOptions(!plusOptions);
    }

    const majDonneesFinales = (response) => {
        // Mise à jour de la recette totale
        let total = response.reduce((acc, item) => acc + parseInt(item.total), 0);
        setTotal(total);
        
        let materiel = response.reduce((acc, item) => acc + parseInt(item.materiel), 0);
        setFrais(materiel);

        let recette = response.reduce((acc, item) => acc + parseInt(item.recette), 0);
        setRecetteTotal(recette + materiel);

        let labelsC = response.map(item => {
            return item.date_vente;
        });

        let data1C = response.map(item => {
            return parseInt(item.total) + parseInt(item.materiel);
        });

        let data2C = response.map(item => {
            return parseInt(item.recette) + parseInt(item.materiel);
        });

        setData1ChartTotal(data1C);
        setData2ChartRecette(data2C);
        setLabelsChart(labelsC);
    }

    const handleChangeRadio = (e) => {
        setIdRadio(e.target.id);
        const id = e.target.id;
        let date1;
        let date2;

        switch(id) {
            case "7":
                date1 = soustraireUnNombreAUneDate(1) + ' 23:59:59';
                date2 = soustraireUnNombreAUneDate(7) + ' 00:00:00';
                rechercheParPeriode(date2, date1);
                break;
            case "10":
                date1 = soustraireUnNombreAUneDate(1) + ' 23:59:59';
                date2 = soustraireUnNombreAUneDate(10) + ' 00:00:00';
                rechercheParPeriode(date2, date1);
                break;
            case "0":
                date1 = soustraireUnNombreAUneDate(0) + ' 23:59:59';
                date2 = ceMoisCi() + '-' + '01 00:00:00';
                rechercheParPeriode(date2, date1);
                break;
            case "30":
                date1 = leMoisDernier() + '-' + '31 23:59:59';
                date2 = leMoisDernier() + '-' + '01 00:00:00';
                rechercheParPeriode(date2, date1);
                break;
            default:
                break;
        }
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
                        totalGeneralites={totalGeneralites}
                        fermerModalReussi={fermerModalReussi}
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
            <h1>Gestions des recettes</h1>

            <div className="container-gestion">
                <div className="box-1">
                    <div style={{display: `${plusOptions ? 'none' : 'block'}`}}>
                        <CContainer>
                            <CRow>
                                <CCol>
                                    <CFormCheck onChange={handleChangeRadio} checked={idRadio === "7" ? true : false} type="radio" name="radioRecette" id="7" label="7 derniers jours" />
                                </CCol>
                                <CCol>
                                    <CFormCheck onChange={handleChangeRadio} checked={idRadio === "10" ? true : false} type="radio" name="radioRecette" id="10" label="10 derniers jours"/>
                                </CCol>
                            </CRow>
                            <CRow>
                                <CCol>
                                    <CFormCheck onChange={handleChangeRadio} checked={idRadio === "0" ? true : false} type="radio" name="radioRecette" id="0" label="ce mois ci"/>
                                </CCol>
                                <CCol>
                                    <CFormCheck onChange={handleChangeRadio} checked={idRadio === "30" ? true : false} type="radio" name="radioRecette" id="30" label="le mois dernier"/>
                                </CCol>
                            </CRow>
                        </CContainer>
                    </div>
                    <CFormCheck id="flexCheckDefault" label="plus d'options" checked={plusOptions} onChange={onChangePlusOption} />
                    {plusOptions &&
                        <>
                            <h1>Options</h1>
                            <div>
                                <p>
                                    <label htmlFor="">Du : </label>
                                    <input type="date" ref={date_select1} />
                                    <input type="time" ref={heure_select1} />
                                </p>
                                <p>
                                    <label htmlFor="">Au : </label>
                                    <input type="date" ref={date_select2} />
                                    <input type="time" ref={heure_select2} />
                                </p>
                                <p>
                                    <label htmlFor="">Caissier : </label>
                                    <select name="caissier" id="caissier">
                                        {props.role.toUpperCase() === "caissier".toUpperCase() ? 
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
                        </>
                    }
                </div>
                <div className="box-2">
                    <div className="btn-container" style={{textAlign: 'center'}}>
                        <button className='bootstrap-btn h-25' onClick={() => {setModalContenu(false); setModalConfirmation(true);}}>Catégories</button>
                    </div>
                    <div className='text-center'>
                        <button className='bootstrap-btn' onClick={ouvrirModalReussi}>Généralités</button>
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
                            Total : <span style={{fontWeight: '600'}}>{total ? (total + frais) + ' Fcfa' : '0 Fcfa'}</span>
                        </div>
                        <div>
                            Matériel : <span style={{fontWeight: '600'}}>{frais ? frais + ' Fcfa' : '0 Fcfa'}</span>
                        </div>
                        <div>
                            Recette : <span style={{fontWeight: '600'}}>{recetteTotal ? recetteTotal + ' Fcfa' : '0 Fcfa'}</span>
                        </div>
                        {/* <div className="btn-valid-annul" style={{textAlign: 'center', marginTop: '10px',}}>
                            <button className='bootstrap-btn h-25' onClick={terminer}>Terminer</button>
                        </div> */}
                    </div>
                    <div className='mb-4' style={{display: `${props.role.toUpperCase() === "admin".toUpperCase() ? 'block' : 'none'}`}}>
                        <CChart
                            type="line"
                            data={{
                                labels: labelsChart,
                                datasets: [
                                {
                                    label: "Total",
                                    backgroundColor: "rgba(220, 220, 220, 0.2)",
                                    borderColor: "rgba(220, 220, 220, 1)",
                                    pointBackgroundColor: "#BFC0C0",
                                    pointBorderColor: "#BFC0C0",
                                    data: data1ChartTotal
                                },
                                {
                                    label: "Recette",
                                    backgroundColor: "rgba(151, 187, 205, 0.2)",
                                    borderColor: "rgba(151, 187, 205, 1)",
                                    pointBackgroundColor: "#5A7684",
                                    pointBorderColor: "#5A7684",
                                    data: data2ChartRecette
                                },
                                ],
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
