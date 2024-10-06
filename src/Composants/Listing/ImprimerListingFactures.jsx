import React, { Component } from 'react';
import { extraireCode, mois, mois2, styleEntete } from '../../shared/Globals';
import logo from '../../images/logo_hdj.png';
import EnteteHdm from '../../shared/EnteteHdm';
import EnteteHopital from '../../shared/EnteteHopital';

const styles = {
    // display: 'flex',
    // justifyContent: 'center',
    fontWeight: '600',
    marginTop: '7px',
    width: '100%',
    // border: '1px solid #333',
}

const table_styles1 = {
    border: '1px solid #000',
    borderCollapse: 'collapse',
    padding: 10,
    textAlign: 'left'
}

const table_styles2 = {
    border: '1px solid #000',
    borderCollapse: 'collapse',
    padding: 10,
    textAlign: 'right'
}

const table_styles = {
    border: '1px solid #000',
    borderCollapse: 'collapse',
    padding: 10,
    width: '100%',
    marginTop: '15px',
    fontSize: 8
}

export default class ImprimerListingFactures extends Component {

    render() {
        return (
            <div style={{backgroundColor: '#f1f1f1', height: '100vh', marginTop: '0px'}}>
                <div className='w-75 m-auto'>
                    <EnteteHopital />
                </div>
                <div style={{fontSize: 10, color: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '10px',}}>
                    <div style={{textAlign: 'center', width: '410px'}}>
                        <div style={{marginTop: 5, fontSize: 14}}>Fiche de recette de la caisse pour les patients <strong>{this.props.listing === 'non' ? 'non assurés' : 'assurés'}</strong> </div>
                        <div style={{marginTop: 5}}>
                            tiré le &nbsp;
                            <span style={{fontWeight: '600', marginTop: '15px'}}>{this.props.infoRecette ? mois(this.props.dateDuJour.substring(0, 11)) : (mois(this.props.dateDuJour.substring(0, 10)) + ' ')} à {this.props.infoRecette ? this.props.dateDuJour.substring(11,) : (' ' + this.props.dateDuJour.substring(11, 16))}</span>
                        </div>
                        <div style={{marginTop: 5}}>
                            Caissier
                            <span style={{fontWeight: '600', marginTop: '15px'}}>
                                    : {this.props.filtre ? this.props.nomConnecte.toUpperCase() : 'Tous les caissiers'}
                            </span>
                        </div>
                        <div style={{marginTop: 5}}>Du <span style={{fontWeight: '600', marginTop: '15px'}}>{mois2(this.props.dateDepart)} à {this.props.dateDepart.substring(10, 13)}h{this.props.dateDepart.substring(14, 16)}min</span> Au <strong>{mois2(this.props.dateFin)} à {this.props.dateFin.substring(10, 13)}h{this.props.dateFin.substring(14, 16)}min</strong></div>
                        <div style={{textAlign: 'center', marginBottom: 15}}>
                            <table style={table_styles}>
                                <thead>
                                    <th style={table_styles1}>N° facture</th>
                                    <th style={table_styles2}>Patient</th>
                                    <th style={table_styles2}>Montant</th>
                                    <th style={table_styles2}>Heure</th>
                                </thead>
                                <tbody>
                                    {this.props.historique.length > 0  ? this.props.historique.map(item => (
                                        <tr>
                                            <td style={table_styles1}>{item.id}</td>
                                            <td style={table_styles2}>{item.patient}</td>
                                            <td style={table_styles2}>{item.prix_total}</td>
                                            <td style={table_styles2}>{item.date_heure?.substring(11, 16)}</td>
                                        </tr>
                                    )) : null
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div style={{marginTop: 5}}>Total : <strong>{this.props.recetteTotal ? (this.props.total) + ' Fcfa' : 0 + ' Fcfa'}</strong></div>
                        {/* <div style={{marginTop: 5}}>Matériel : <strong>{this.props.montantFrais ? this.props.montantFrais + ' Fcfa' : 0 + ' Fcfa'}</strong></div> */}
                        <div style={{marginTop: 5}}>Recette : <strong>{this.props.recetteTotal ? this.props.recetteTotal + ' Fcfa' : 0 + ' Fcfa'}</strong></div>
                        {/* <div style={{marginTop: 5}}>
                            <h6>
                                ATTENTION AU DECOUPAGE DES DONNÉES LORS DE L'IMPRESSION !
                                CERTAINES DONNÉES PEUVENT NE PAS APPARAITRE SUR LA COPIE IMPRIMÉE
                            </h6>
                        </div> */}
                    </div>
                </div>
            </div>    
        )
    }
}