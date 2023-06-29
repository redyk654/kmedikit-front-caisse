import React, { Component } from 'react';
import EnteteHopital from '../../shared/EnteteHopital';
import CorpsFacture from './CorpsFacture';

const stylesDuContainer = {
    fontSize: 8, 
    backgroundColor: '#fff', 
    height: '32vh', 
    marginLeft: '440px', 
    transform: 'rotate(90deg)'
}

export default class Facture extends Component {

    render() {
        return (
            <div className='' style={{overflow: 'hidden', width: '96vw', display: 'flex', flexDirection: 'column'}}>
                <div style={stylesDuContainer}>
                    <EnteteHopital />
                    <CorpsFacture
                        assurance={this.props.assurance}
                        type_assurance={this.props.type_assurance}
                        medocCommandes={this.props.medocCommandes}
                        idFacture={this.props.idFacture}
                        patient={this.props.patient}
                        codePatient={this.props.codePatient}
                        prixTotal={this.props.prixTotal}
                        reduction={this.props.reduction}
                        aPayer={this.props.aPayer}
                        montantVerse={this.props.montantVerse}
                        relicat={this.props.relicat}
                        resteaPayer={this.props.resteaPayer}
                        nomConnecte={this.props.nomConnecte}
                        montantFrais={this.props.montantFrais}
                    />
                </div>
                <div style={stylesDuContainer}>
                    <EnteteHopital />
                    <CorpsFacture
                        assurance={this.props.assurance}
                        type_assurance={this.props.type_assurance}
                        medocCommandes={this.props.medocCommandes}
                        idFacture={this.props.idFacture}
                        patient={this.props.patient}
                        codePatient={this.props.codePatient}
                        prixTotal={this.props.prixTotal}
                        reduction={this.props.reduction}
                        aPayer={this.props.aPayer}
                        montantVerse={this.props.montantVerse}
                        relicat={this.props.relicat}
                        resteaPayer={this.props.resteaPayer}
                        nomConnecte={this.props.nomConnecte}
                        montantFrais={this.props.montantFrais}
                    />
                </div>
                <div style={stylesDuContainer}>
                    <EnteteHopital />
                    <CorpsFacture
                        assurance={this.props.assurance}
                        type_assurance={this.props.type_assurance}
                        medocCommandes={this.props.medocCommandes}
                        idFacture={this.props.idFacture}
                        patient={this.props.patient}
                        codePatient={this.props.codePatient}
                        prixTotal={this.props.prixTotal}
                        reduction={this.props.reduction}
                        aPayer={this.props.aPayer}
                        montantVerse={this.props.montantVerse}
                        relicat={this.props.relicat}
                        resteaPayer={this.props.resteaPayer}
                        nomConnecte={this.props.nomConnecte}
                        montantFrais={this.props.montantFrais}
                    />
                </div>
            </div>
        )
    }
}
