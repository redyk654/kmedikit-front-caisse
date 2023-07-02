export function extraireCode (designation) {
    let designation_extrait = '';
    const codes = ['RX ', 'LAB ', 'MA ', 'MED ', 'CHR ', 'CO ', 'UPEC ', 'SP ', 'CA '];

    codes.forEach(item => {
        if(designation.indexOf(item) === 0) {
            designation_extrait =  designation.slice(item.length);
        } else if (designation.toUpperCase().indexOf('ECHO') === 0)  {
            designation_extrait = designation;
        }
    });

    if (designation_extrait === '') designation_extrait = designation;

    return designation_extrait.toUpperCase();
}

export const ServiceExiste = "Ce service existe déjà";	

export function afficherSexe (sexe) {
    let val;
    switch(sexe) {
        case 'H':
            val = 'homme';
            break;
        case 'F':
            val = 'femme';
            break;
        default:
            val = 'non renseigné'
    }

    return val.toUpperCase();
}

export function afficherAge (age) {
    if (parseInt(age) > 1) 
        return age + "ans"
    else
        return "non renseigné".toUpperCase();
}

export const ROLES = {
    caissier: "caissier",
    secretaire: "secretaire",
    regisseur: "regisseur",
    admin: "admin",
}

export const SEXES = {
    h: 'H',
    f: 'F'
}

export const MONTANTMATERIEL = 500;

export function mois (str) {

    switch(parseInt(str.substring(3, 5))) {
        case 1:
            return str.substring(0, 2) + " janvier " + str.substring(6, 10);
        case 2:
            return str.substring(0, 2) + " fevrier " + str.substring(6, 10);
        case 3:
            return str.substring(0, 2) + " mars " + str.substring(6, 10);
        case 4:
            return str.substring(0, 2) + " avril " +  str.substring(6, 10);
        case 5:
            return str.substring(0, 2) + " mai " + str.substring(6, 10);
        case 6:
            return str.substring(0, 2) + " juin " + str.substring(6, 10);
        case 7:
            return str.substring(0, 2) + " juillet " + str.substring(6, 10);
        case 8:
            return str.substring(0, 2) + " août " + str.substring(6, 10);
        case 9:
            return str.substring(0, 2) + " septembre " + str.substring(6, 10);
        case 10:
            return str.substring(0, 2) + " octobre " + str.substring(6, 10);
        case 11:
            return str.substring(0, 2) + " novembre " + str.substring(6, 10);
        case 12:
            return str.substring(0, 2) + " décembre " + str.substring(6, 10);
    }
}

export function mois2 (str) {

    switch(parseInt(str.substring(5, 7))) {
        case 1:
            return str.substring(8, 10) + " janvier " + str.substring(0, 4);
        case 2:
            return str.substring(8, 10) + " fevrier " + str.substring(0, 4);
        case 3:
            return str.substring(8, 10) + " mars " + str.substring(0, 4);
        case 4:
            return str.substring(8, 10) + " avril " +  str.substring(0, 4);
        case 5:
            return str.substring(8, 10) + " mai " + str.substring(0, 4);
        case 6:
            return str.substring(8, 10) + " juin " + str.substring(0, 4);
        case 7:
            return str.substring(8, 10) + " juillet " + str.substring(0, 4);
        case 8:
            return str.substring(8, 10) + " août " + str.substring(0, 4);
        case 9:
            return str.substring(8, 10) + " septembre " + str.substring(0, 4);
        case 10:
            return str.substring(8, 10) + " octobre " + str.substring(0, 4);
        case 11:
            return str.substring(8, 10) + " novembre " + str.substring(0, 4);
        case 12:
            return str.substring(8, 10) + " décembre " + str.substring(0, 4);
    }
}

export const styleEntete = {
    color: 'black',
    borderBottom: '1px dotted #000',
    letterSpacing: '1px',
    fontSize: 5
}

export const recupererDateJour = (idElement) => {
    var today = new Date();

    document.querySelector(`#${idElement}`).value = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
}

export const recupererHeureJour = (idElement) => {
    let today = new Date();

    document.querySelector(`#${idElement}`).value = ('0' + (today.getHours())).slice(-2) +  ":" + ('0' + (today.getMinutes())).slice(-2);
}

export const nomDns = 'http://serveur/hdmbanga/';
export const nomServeur = 'serveur';

export const CATEGORIES = ["MATERNITE", "CHIRURGIE", "LABORATOIRE", "MEDECINE", "CARNET",
                            "CONSULTATION", "ECHOGRAPHIE", "MORGUE", "PEDIATRIE", "KIT", "CONSULTATION SPÉCIALISTE"]
