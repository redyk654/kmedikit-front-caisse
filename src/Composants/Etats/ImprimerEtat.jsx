import React, { Component } from 'react';
import { getDateTime, mois, mois2, styleEntete } from "../../shared/Globals";
import EnteteHopital from '../../shared/EnteteHopital';
import EnteteHdm from '../../shared/EnteteHdm';

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

export default class ImprimerEtat extends Component {

    state = {
        currentDate: ''
    }

    componentDidMount() {
        this.execGetDateTime();
    }

     execGetDateTime = async () => {
        const dateTime = await getDateTime();
        this.setState({currentDate: dateTime.date});
    }

    render() {
        return (
            <div style={{backgroundColor: '#f1f1f1', height: '100vh', marginTop: '0px'}}>
                <div className='w-75 m-auto'>
                    {/* <EnteteHdm /> */}
                    <EnteteHopital />
                </div>
                    <div style={{fontSize: 9, display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '10px',}}>
                        <div style={{textAlign: 'center', width: '410px'}}>
                            <p className='text-center h4'>Fiche des recettes de la pharmacie</p>
                            <div style={{marginTop: 5}}>
                                tiré le &nbsp;
                                <span style={{fontWeight: '600', marginTop: '15px'}}>{this.props.infoRecette ? mois(this.props.infoRecette[0].date_heure.substring(0, 11)) : (mois(this.state.currentDate.substring(0, 10)) + ' ')} à {this.props.infoRecette ? this.props.infoRecette[0].date_heure.substring(11,) : (' ' + this.state.currentDate.substring(11, 16))}</span>
                            </div>
                            {this.props.filtre ? 
                                <div style={{marginTop: 5}}>Service fait par <span style={{fontWeight: '600', marginTop: '15px'}}>{this.props.caissier.toUpperCase()}</span></div>
                                : null
                            }
                            <div style={{marginTop: 5}}>Du <span style={{fontWeight: '600', marginTop: '15px'}}>{mois2(this.props.dateDepart)} à {this.props.dateDepart.substring(10, 13)}h{this.props.dateDepart.substring(14, 16)}min</span> Au <strong>{mois2(this.props.dateFin)} à {this.props.dateFin.substring(10, 13)}h{this.props.dateFin.substring(14, 16)}min</strong></div>
                            <div style={{textAlign: 'center', marginBottom: 15}}>
                                <table style={table_styles}>
                                    <thead>
                                        <th style={table_styles1}>Désignation</th>
                                        <th style={table_styles1}>Qte sortie</th>
                                        <th style={table_styles1}>Total</th>
                                    </thead>
                                    <tbody>
                                        {this.props.historique.length > 0  ? this.props.historique.map(item => (
                                            <tr>
                                                <td style={table_styles1}>{item.designation}</td>
                                                <td style={table_styles1}>{item.quantite}</td>
                                                <td style={table_styles1}>{item.prix_total}</td>
                                            </tr>
                                        )) : null
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <div style={{marginTop: 10}}>Génériques : <strong>{this.props.total ? this.props.recetteGenerique + ' Fcfa' : 0 + ' Fcfa'}</strong></div>
                            <div style={{marginTop: 10}}>Specialités : <strong>{this.props.total ? this.props.recetteSp + ' Fcfa' : 0 + ' Fcfa'}</strong></div>
                            <div style={{marginTop: 10}}>Total : <strong>{this.props.total ? this.props.total + ' Fcfa' : 0 + ' Fcfa'}</strong></div>
                            {/* <div style={{marginTop: 5}}>
                                <h5>
                                    ATTENTION AU DECOUPAGE DES DONNÉES LORS DE L'IMPRESSION !
                                    CERTAINES DONNÉES PEUVENT NE PAS APPARAITRE SUR LA COPIE IMPRIMÉE
                                </h5>
                            </div> */}
                            {/* <div style={{marginTop: 15}}>Recette : <strong>{this.props.total ? this.props.recetteReel + ' Fcfa' : 0 + ' Fcfa'}</strong></div> */}
                        </div>
                </div>
            </div>
        )
    }
}
