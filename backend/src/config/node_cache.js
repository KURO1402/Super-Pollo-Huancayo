const NodeCache = require('node-cache');

const cache = new NodeCache({
    stdTTL: 60,       // 60 segundos
    checkperiod: 120  // limpieza automática
});

module.exports = cache;
