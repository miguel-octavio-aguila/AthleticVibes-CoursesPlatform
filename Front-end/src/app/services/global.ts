export var GLOBAL = {
    url: 'http://backend-rest.com/api/',
    url_front: 'http://localhost:4200/',
    htmlEntities: (str: string): string => {
        // Usar un objeto para mapear entidades (más mantenible)
        const entities: { [key: string]: string } = {
            '&amp;': '&',  // Primero reemplazar &amp; para evitar doble procesamiento
            '&ntilde;': 'ñ',
            '&Ntilde;': 'Ñ',
            '&Agrave;': 'À',
            '&Aacute;': 'Á',
            '&Acirc;': 'Â',
            '&Atilde;': 'Ã',
            '&Auml;': 'Ä',
            '&Aring;': 'Å',
            '&AElig;': 'Æ',
            '&Ccedil;': 'Ç',
            '&Egrave;': 'È',
            '&Eacute;': 'É',
            '&Ecirc;': 'Ê',
            '&Euml;': 'Ë',
            '&Igrave;': 'Ì',
            '&Iacute;': 'Í',
            '&Icirc;': 'Î',
            '&Iuml;': 'Ï',
            '&ETH;': 'Ð',
            // Removed duplicate '&Ntilde;' entry as it was already defined above
            '&Ograve;': 'Ò',
            '&Oacute;': 'Ó',
            '&Ocirc;': 'Ô',
            '&Otilde;': 'Õ',
            '&Ouml;': 'Ö',
            '&Oslash;': 'Ø',
            '&Ugrave;': 'Ù',
            '&Uacute;': 'Ú',
            '&Ucirc;': 'Û',
            '&Uuml;': 'Ü',
            '&Yacute;': 'Ý',
            '&THORN;': 'Þ',
            '&szlig;': 'ß',
            '&agrave;': 'à',
            '&aacute;': 'á',
            '&acirc;': 'â',
            '&atilde;': 'ã',
            '&auml;': 'ä',
            '&aring;': 'å',
            '&aelig;': 'æ',
            '&ccedil;': 'ç',
            '&egrave;': 'è',
            '&eacute;': 'é',
            '&ecirc;': 'ê',
            '&euml;': 'ë',
            '&igrave;': 'ì',
            '&iacute;': 'í',
            '&icirc;': 'î',
            '&iuml;': 'ï',
            '&eth;': 'ð',
            // Removed duplicate '&ntilde;' entry as it was already defined above
            '&ograve;': 'ò',
            '&oacute;': 'ó',
            '&ocirc;': 'ô',
            '&otilde;': 'õ',
            '&ouml;': 'ö',
            '&oslash;': 'ø',
            '&ugrave;': 'ù',
            '&uacute;': 'ú',
            '&ucirc;': 'û',
            '&uuml;': 'ü',
            '&yacute;': 'ý',
            '&thorn;': 'þ',
            '&yuml;': 'ÿ',
            '&nbsp;': ' ',
            'nbsp;': ' ' // No estándar, pero por si acaso
        };

        // Crear una expresión regular global para todas las entidades
        const regex = new RegExp(Object.keys(entities).join('|'), 'g');
        
        return str.replace(regex, (match) => entities[match]);
    }
};