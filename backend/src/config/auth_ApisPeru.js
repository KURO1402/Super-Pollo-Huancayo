const axios = require('axios');

let token = null;
let tokenExpiraEn = null;

const obtenerTokenApisPeru = async () => {
    const ahora = Date.now();

    if (token && tokenExpiraEn && ahora < tokenExpiraEn) {
        return token;
    }

    console.log('Generando nuevo token APISPERU...');

    const response = await axios.post(
        `${process.env.APISPERU_URL}/auth/login`,
        {
            username: process.env.APISPERU_USER,
            password: process.env.APISPERU_PASS
        }
    );

    token = response.data.token;

    tokenExpiraEn = ahora + (response.data.expires_in * 1000);

    return token;
};

module.exports = {
    obtenerTokenApisPeru
};