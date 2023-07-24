import React from 'react';
import { styleEntete } from '../../shared/Globals';
import logo from '../../images/logo-minsante.png';

export default function EnteteFicheResultat() {
  return (
    <div style={{textTransform: 'uppercase', padding: '20px', marginBottom: '12px', width: '100%', display: 'flex', justifyContent: 'space-between'}}>
        <div style={{ lineHeight: '30px'}}>
            <div style={{...styleEntete, fontSize: '12px'}}><strong>Republique du Cameroun <br/><em style={{textTransform: 'capitalize'}}>Paix-Travail-Patrie</em></strong></div>
            <div style={{...styleEntete, fontSize: '12px'}}><strong>Ministere de la sante publique</strong></div>
            <div style={{...styleEntete, fontSize: '12px'}}><strong>Delegation regionale du Littoral</strong></div>
            <div style={{...styleEntete, fontSize: '12px'}}><strong>District sante de Mbanga</strong></div>
            <div style={{...styleEntete, fontSize: '12px'}}><strong>Hôpital de District de Mbanga</strong></div>
            <div style={{...styleEntete, lineHeight: '18px', fontSize: '12px'}}>
                <strong>
                    B.P. 29 Mbanga <br />
                    Tel: 243 53 62 60 / 243 53 62 61 <br />
                    hdmbanga@yahoo.com
                </strong>
            </div>
        </div>
        <div style={{paddingTop: '80px'}}>
            <img src={logo} alt="" width={90} height={90} />
        </div>
        <div style={{ lineHeight: '30px'}}>
            <div style={{...styleEntete, fontSize: '12px'}}><strong>Republic of Cameroon <br/><em style={{textTransform: 'capitalize'}}>Peace-Work-Fatherland</em></strong></div>
            <div style={{...styleEntete, fontSize: '12px'}}><strong>Minister of Public Health</strong></div>
            <div style={{...styleEntete, fontSize: '12px'}}><strong>Littoral regional delegation</strong></div>
            <div style={{...styleEntete, fontSize: '12px'}}><strong>Health District of Mbanga</strong></div>
            <div style={{...styleEntete, fontSize: '12px'}}><strong>District Hospital of Mbanga</strong></div>
            <div style={{...styleEntete, lineHeight: '18px', fontSize: '12px'}}>
                <strong>
                    P.O BOX 29 Mbanga <br />
                    Tel: 243 53 62 60 / 243 53 62 61 <br />
                    hdmbanga@yahoo.com
                </strong>
            </div>
        </div>
    </div>
  )
}
