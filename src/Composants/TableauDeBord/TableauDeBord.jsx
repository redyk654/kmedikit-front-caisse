import React, { Fragment, useEffect, useState, useRef } from 'react';
import Modal from "react-modal";
import { extraireCode, nomDns, CATEGORIES, soustraireUnNombreAUneDate, leMoisDernier, ceMoisCi, formaterNombre, regrouperParDate } from '../../shared/Globals';
import { CCard, CCardBody, CCardText, CCardTitle, CCol, CContainer, CFormCheck, CRow } from '@coreui/react';
import { CChart } from '@coreui/react-chartjs';
import AfficherCategorie from './AfficherCategorie';
import AfficherOptions from './AfficherOptions';
import AfficherTotaux from './AfficherTotaux';
import AfficherLesDetails from './AfficherLesDetails';

const customStyles1 = {
    content: {
      top: '42%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      transform: 'translate(-50%, -50%)',
      width: '50vw',
      height: '80vh',
    },
};

export default function TableauDeBord(props) {

    Modal.defaultStyles.overlay.backgroundColor = '#18202ed3';

    const [historique, sethistorique] = useState([]);
    const [recetteTotal, setRecetteTotal] = useState(0);
    const [total, setTotal] = useState('');
    const [services, setServices] = useState([]);
    const [servicesSauvegarde, setServicesSauvegarde] = useState([]);
    const [categorieSelectionne, setCategorieSelectionne] = useState('');
    const [modalConfirmation, setModalConfirmation] = useState(false);
    const [idRadio, setIdRadio] = useState('1');
    const [labelsChart, setLabelsChart] = useState([]);
    const [data1ChartTotal, setData1ChartTotal] = useState([]);
    const [data2ChartRecette, setData2ChartRecette] = useState([]);

    const changerCategorie = (e) => {
        setServices(servicesSauvegarde.filter(item => item.categorie.toLowerCase().includes(e.target.value.toLowerCase())));
        setCategorieSelectionne(e.target.value.toUpperCase());
    }

    const fermerModalConfirmation = () => {
        setModalConfirmation(false);
        setServices(servicesSauvegarde);
        setCategorieSelectionne('');
    }

    const handleChangeRadio = (e) => {
        setIdRadio(e.target.id);
        const id = e.target.id;
        let date1;
        let date2;

        switch(id) {
            case "1":
                date1 = soustraireUnNombreAUneDate(0) + ' 23:59:59';
                date2 = soustraireUnNombreAUneDate(0) + ' 00:00:00';
                rechercheParPeriode(date2, date1);
                break;
            case "4":
                date1 = soustraireUnNombreAUneDate(0) + ' 23:59:59';
                date2 = soustraireUnNombreAUneDate(3) + ' 00:00:00';
                rechercheParPeriode(date2, date1);
                break;
            case "7":
                date1 = soustraireUnNombreAUneDate(0) + ' 23:59:59';
                date2 = soustraireUnNombreAUneDate(6) + ' 00:00:00';
                rechercheParPeriode(date2, date1);
                break;
            case "10":
                date1 = soustraireUnNombreAUneDate(0) + ' 23:59:59';
                date2 = soustraireUnNombreAUneDate(9) + ' 00:00:00';
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

    const recupererRecetteParCategories = (pharmacie, date1, date2) => {
        // Récupération des recettes par catégories
        if (date1 !== '' && date2 !== '') {
            const data = new FormData();
            data.append('date1', date1);
            data.append('date2', date2);

            const req = new XMLHttpRequest();
            req.open('POST', `${nomDns}recette_par_periode.php?par_categories`);

            req.addEventListener('load', () => {
                if(req.status >= 200 && req.status < 400) {
                    let result = JSON.parse(req.responseText);
                    result = result.map(item => {
                        return {
                            ...item,
                            total_reel: Math.round(parseFloat(item.total_reel)),
                        }
                    })
                    sethistorique([...result, pharmacie]);
                }
            });

            req.send(data);
        }
    }

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
                    recettePharmacieParPeriode(res, date1, date2);
                    recupDetailsParPeriode(date1, date2);
                }
            });

            req.send(data);
        }
    }

    const recettePharmacieParPeriode = (responseCaisse, date1, date2) => {
        // Récupération des recettes de la pharmacie par période
        if (date1 !== '' && date2 !== '') {
            const data = new FormData();
            data.append('date1', date1);
            data.append('date2', date2);

            const req = new XMLHttpRequest();
            req.open('POST', `${nomDns}recette_par_periode.php?recette_pharmacie`);

            req.addEventListener('load', () => {
                if(req.status >= 200 && req.status < 400) {
                    let result = JSON.parse(req.responseText);
                    majDonneesFinales(responseCaisse, result, date1, date2);

                }
            });

            req.send(data);
        }
    }

    const majDonneesFinales = (responseCaisse, responsePharmacie, date1, date2) => {

        let totalPharmacie = responsePharmacie.reduce((acc, item) => acc + parseInt(item.recette), 0);

        let total = responseCaisse.reduce((acc, item) => {
            return acc + parseInt(item.total);
        }, 0);
        setTotal(total + totalPharmacie);

        let recette = responseCaisse.reduce((acc, item) => acc + parseInt(item.recette), 0);
        setRecetteTotal(recette + totalPharmacie);

        const donneesRegroupees = regrouperParDate(responseCaisse, responsePharmacie);
        
        let labelsC= donneesRegroupees.map(item => {
            return item.date_vente;
        });

        let data1C = donneesRegroupees.map(item => {
            return parseInt(item.total);
        });

        let data2C = donneesRegroupees.map(item => {
            return parseInt(item.recette);
        });

        setData1ChartTotal(data1C);
        setData2ChartRecette(data2C);
        setLabelsChart(labelsC);
        recupererRecetteParCategories({categorie: "pharmacie", total_reel: totalPharmacie}, date1, date2);
    }

    return (
        <div className="">
            <Modal
                isOpen={modalConfirmation}
                onRequestClose={fermerModalConfirmation}
                style={customStyles1}
                contentLabel=""
            >
                <AfficherLesDetails
                    services={services}
                    categorieSelectionne={categorieSelectionne}
                    changerCategorie={changerCategorie}
                    fermerModalConfirmation={fermerModalConfirmation}
                />
            </Modal>
            <p className='h3 fw-bold px-4 bg-light text-center'>Rapport Global</p>
            <div className="p-0">
                <CContainer>
                    <CRow>
                        <AfficherOptions
                            idRadio={idRadio}
                            handleChangeRadio={handleChangeRadio}
                        />
                    </CRow>
                    <CRow>
                        {/* {historique.length > 0 && historique.map(item => (                            
                            <CCol xs={3} className='pt-3'>
                                <AfficherCategorie 
                                    categorie={item?.categorie} 
                                    total={item?.total_reel} />
                            </CCol>
                        ))} */}
                    </CRow>
                </CContainer>
                <div className="px-5 text-center">
                    {/* <a role='button' className='' onClick={() => {setModalConfirmation(true);}}>
                        Voir les détails
                    </a> */}
                </div>
                <AfficherTotaux
                    total={total}
                    recetteTotal={recetteTotal}
                />
                <CContainer>                    
                    <CRow className='pb-4'>
                        <CCol>
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
                        </CCol>
                    </CRow>
                </CContainer>
            </div>
        </div>
    )
}
