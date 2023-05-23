import React, { Component } from 'react';
import { extraireCode, mois, mois2, styleEntete } from '../../shared/Globals';
import logo from '../../images/logo-minsante.png';

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

export default class ImprimerHistorique extends Component {

    render() {
        return (
            <div style={{backgroundColor: '#f1f1f1', height: '100vh', marginTop: '70px'}}>
                <div className='logo-minsante'>
                    <img src={logo} alt="" width={80} height={80} />
                </div>
                <div style={{textTransform: 'uppercase', padding: '15px 135px', fontSize: 7, marginBottom: '12px', width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                    <div style={{ lineHeight: '20px'}}>
                        <div style={styleEntete}><strong>Republique du Cameroun <br/><em style={{textTransform: 'capitalize'}}>Paix-Travail-Patrie</em></strong></div>
                        <div style={styleEntete}><strong>Ministere de la sante publique</strong></div>
                        <div style={styleEntete}><strong>Delegation regionale du Littoral</strong></div>
                        <div style={styleEntete}><strong>District sante de Mbanga</strong></div>
                    </div>
                    <div style={{ lineHeight: '20px'}}>
                        <div style={styleEntete}><strong>Republic of Cameroon <br/><em style={{textTransform: 'capitalize'}}>Peace-Work-Fatherland</em></strong></div>
                        <div style={styleEntete}><strong>Minister of Public Health</strong></div>
                        <div style={styleEntete}><strong>Littoral regional delegation</strong></div>
                        <div style={styleEntete}><strong>Mbanga Health District</strong></div>
                    </div>
                </div>
                <div style={{fontSize: 9, display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '10px',}}>
                    <div style={{textAlign: 'center', width: '410px'}}>
                        <div style={{marginTop: 5, fontSize: 14}}>Fiche de recette des <strong>{this.props.listing === 'non' ? 'non assurés' : 'assurés'}</strong> </div>
                        <div style={{marginTop: 5}}>
                            tiré le &nbsp;
                            <span style={{fontWeight: '600', marginTop: '15px'}}>{this.props.infoRecette ? mois(this.props.infoRecette[0].date_heure.substring(0, 11)) : (mois(new Date().toLocaleDateString()) + ' ')} à {this.props.infoRecette ? this.props.infoRecette[0].date_heure.substring(11,) : (' ' + new Date().getHours() + 'h' + new Date().getMinutes() + 'min')}</span>
                        </div>
                        <div style={{marginTop: 5}}>Service fait par <span style={{fontWeight: '600', marginTop: '15px'}}>{this.props.nomConnecte}</span></div>
                        <div style={{marginTop: 5}}>Du <span style={{fontWeight: '600', marginTop: '15px'}}>{mois2(this.props.dateDepart)} à {this.props.dateDepart.substring(10, 13)}h{this.props.dateDepart.substring(14, 16)}min</span> Au <strong>{mois2(this.props.dateFin)} à {this.props.dateFin.substring(10, 13)}h{this.props.dateFin.substring(14, 16)}min</strong></div>
                        <div style={{textAlign: 'center', marginBottom: 15}}>
                            <table style={table_styles}>
                                <thead>
                                    <th style={table_styles1}>Actes</th>
                                    <th style={table_styles2}>Recettes</th>
                                </thead>
                                <tbody>
                                    {this.props.historique.length > 0  ? this.props.historique.map(item => (
                                        <tr>
                                            <td style={table_styles1}>{extraireCode(item.designation)}</td>
                                            <td style={table_styles2}>{item.prix_total}</td>
                                        </tr>
                                    )) : null
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div style={{marginTop: 5}}>Total : <strong>{this.props.recetteTotal ? (this.props.total + this.props.montantFrais) + ' Fcfa' : 0 + ' Fcfa'}</strong></div>
                        <div style={{marginTop: 5}}>Matériel : <strong>{this.props.montantFrais ? this.props.montantFrais + ' Fcfa' : 0 + ' Fcfa'}</strong></div>
                        <div style={{marginTop: 5}}>Recette : <strong>{this.props.recetteTotal ? this.props.recetteTotal + ' Fcfa' : 0 + ' Fcfa'}</strong></div>
                    </div>
                </div>
            </div>    
        )
    }
}
