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