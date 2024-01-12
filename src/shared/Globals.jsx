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

export const formaterNombre = (nombre) => {
    return nombre.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

export const soustraireUnNombreAUneDate = (nombre) => {
    // Fonction pour soustraire un nombre à une date
    const date1 = new Date();
    const date2 = new Date(date1.getTime() - nombre * 24 * 3600 * 1000);
    return date2.getFullYear() + '-' + (date2.getMonth() + 1) + '-' + date2.getDate();
}

export const leMoisDernier = () => {
    // Retourne le mois dernier
    const date1 = new Date();
    return date1.getFullYear() + '-' + (date1.getMonth());
}

export const ceMoisCi = () => {
    // retourne le mois en cours
    const date1 = new Date();
    return date1.getFullYear() + '-' + (date1.getMonth() + 1);
}

export const regrouperParDate = (tableau1, tableau2) => {
    // Créer un objet Map pour regrouper les objets par date
    const mapParDate = new Map();

    // Parcourir les objets du premier tableau
    for (const objet of tableau1) {
        const { date_vente, total, recette } = objet;

        // Vérifier si la date existe déjà dans le Map
        if (mapParDate.has(date_vente)) {
            // Récupérer l'objet existant pour cette date
            const objetExistant = mapParDate.get(date_vente);

            // Additionner les propriétés total et recette avec l'objet existant
            objetExistant.total = parseInt(objetExistant.total) + parseInt(total);
            objetExistant.recette = parseInt(objetExistant.recette) + parseInt(recette);
        } else {
            // Créer un nouvel objet avec les propriétés total et recette pour cette date
            mapParDate.set(date_vente, { date_vente, total, recette });
        }
    }

    // Parcourir les objets du deuxième tableau
    for (const objet of tableau2) {
        const { date_vente, total, recette } = objet;

        // Vérifier si la date existe déjà dans le Map
        if (mapParDate.has(date_vente)) {
            // Récupérer l'objet existant pour cette date
            const objetExistant = mapParDate.get(date_vente);

            // Additionner les propriétés total et recette avec l'objet existant
            objetExistant.total = parseInt(objetExistant.total) + parseInt(total);
            objetExistant.recette = parseInt(objetExistant.recette) + parseInt(recette);
        } else {
            // Créer un nouvel objet avec les propriétés total et recette pour cette date
            mapParDate.set(date_vente, { date_vente, total, recette });
        }
    }

    // Créer un tableau final regroupé par date
    let tableauRegroupe = Array.from(mapParDate.values());

    tableauRegroupe = tableauRegroupe.map(item => {
        return {
            date_vente: convertirFormatDateMJA(item.date_vente),
            total: item.total,
            recette: item.recette
        }
    })

    // Trier le tableau par ordre croissant des dates
    tableauRegroupe.sort((a, b) => new Date(a.date_vente) - new Date(b.date_vente));

    tableauRegroupe = tableauRegroupe.map(item => {
        return {
            date_vente: convertirFormatDateJMA(item.date_vente),
            total: item.total,
            recette: item.recette
        }
    })

    return tableauRegroupe;
}

export const convertirFormatDateMJA = (date) => {
    // Séparer le jour, le mois et l'année
    const [jour, mois, annee] = date.split('/');

    // Réorganiser les éléments de la date pour obtenir le format "mm/jj/aaaa"
    const formattedDate = `${mois}/${jour}/${annee}`;

    return formattedDate;
}

export const convertirFormatDateJMA = (date) => {
    const [mois, jour, annee] = date.split('/');

    const formattedDate = `${jour}/${mois}/${annee}`;

    return formattedDate;
}

export const ROLES = {
    caissier: "caissier",
    secretaire: "secretaire",
    regisseur: "regisseur",
    admin: "admin",
    laborantin: "laborantin",
}

export const SEXES = {
    h: 'H',
    f: 'F'
}

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
            val = ''
    }

    return val.toUpperCase();
}

export function afficherStatusMatrimonial (statu) {
    let val;
    switch(statu) {
        case 'C':
            val = 'célibataire';
            break;
        case 'M':
            val = 'marié(e)';
            break;
        case 'D':
            val = 'divorcé(e)';
            break;
        case 'V':
            val = 'veuf(ve)';
            break;
        default:
            val = '';
    }

    return val.toUpperCase();
}

export function calculerAge(dateDeNaissance) {
    if (dateDeNaissance !==  "" && !isNaN(new Date(dateDeNaissance))) {
        const dateNaissance = new Date(dateDeNaissance);
        const dateActuelle = new Date();

        return dateActuelle.getFullYear() - dateNaissance.getFullYear();
    }
}

export function filtrerListe (liste, champRecherche, valeurRecherche) {
    if (liste.length > 0) {
        if (valeurRecherche === '')
            return [];
        else
            return liste.filter(patient => patient[champRecherche].toLowerCase().includes(valeurRecherche.toLowerCase()));
    }
}


export function afficherAge (age) {
    if (parseInt(age) > 1) 
        return age + "ans"
    else
        return "";
}

export function dateEnLettre (str) {

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

export const CATEGORIES = ['IMAGERIE', 'MATERNITÉ', 'LABORATOIRE',
                            'BIOCHIMIE', 'CARNET', 'MEDECINE', 'CHIRURGIE',
                            'UPEC', 'CONSULTATION SPÉCIALISTE']

const dnsServeur = "serveur";
const dnsLocal = "localhost";
const ipServeur = "192.168.100.6";

export const serveurNodeProd = `http://${dnsLocal}:3015`;
export const nomDns = `http://${dnsLocal}/backend-cmab/`;