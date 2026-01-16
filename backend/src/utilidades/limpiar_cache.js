 cache = require('.././config/node_cache');

const limpiarCachePorPrefijo = (prefijo) => {
    cache.keys()
        .filter(key => key.startsWith(prefijo))
        .forEach(key => cache.del(key));
};
module.exports = limpiarCachePorPrefijo;
