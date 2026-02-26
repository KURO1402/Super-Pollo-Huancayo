const numeroALetras = (numero) => {
    const unidades = ['', 'UN', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
    const decenas = ['', 'DIEZ', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
    const especiales = ['ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISEIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'];
    const centenas = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];

    const convertirCentenas = (n) => {
        if (n === 100) return 'CIEN';
        let resultado = '';
        resultado += centenas[Math.floor(n / 100)];
        const resto = n % 100;
        if (resto > 0) resultado += (resultado ? ' ' : '') + convertirDecenas(resto);
        return resultado;
    };

    const convertirDecenas = (n) => {
        if (n < 10) return unidades[n];
        if (n >= 11 && n <= 19) return especiales[n - 11];
        if (n === 10) return 'DIEZ';
        if (n === 20) return 'VEINTE';
        if (n >= 21 && n <= 29) return 'VEINTI' + unidades[n - 20];
        const decena = decenas[Math.floor(n / 10)];
        const unidad = unidades[n % 10];
        return unidad ? `${decena} Y ${unidad}` : decena;
    };

    const convertirMiles = (n) => {
        if (n === 0) return '';
        if (n === 1000) return 'MIL';
        const miles = Math.floor(n / 1000);
        const resto = n % 1000;
        let resultado = '';
        if (miles > 0) resultado += (miles === 1 ? 'MIL' : convertirCentenas(miles) + ' MIL');
        if (resto > 0) resultado += ' ' + convertirCentenas(resto);
        return resultado.trim();
    };

    const convertirMillones = (n) => {
        if (n >= 1000000) {
            const millones = Math.floor(n / 1000000);
            const resto = n % 1000000;
            const strMillones = millones === 1 ? 'UN MILLON' : convertirCentenas(millones) + ' MILLONES';
            const strResto = resto > 0 ? ' ' + convertirMiles(resto) : '';
            return strMillones + strResto;
        }
        return convertirMiles(n);
    };

    const partes = parseFloat(numero).toFixed(2).split('.');
    const entero = parseInt(partes[0]);
    const centavos = partes[1];

    const letras = entero === 0 ? 'CERO' : convertirMillones(entero);

    return `${letras} CON ${centavos}/100 SOLES`;
};

module.exports = numeroALetras;