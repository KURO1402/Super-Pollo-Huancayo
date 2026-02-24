const company = {
  ruc: 10400956974,
  razonSocial: "FELEN NAJERA ANTONIO IVAN",
  nombreComercial: "SUPER POLLO",
  address: {
    direccion: "Jr. Ica 324",
    provincia: "HUANCAYO",
    departamento: "JUNIN",
    distrito: "HUANCAYO",
    ubigueo: "120101",
  },
};

const IGV = 0.18;

const TIPO_COMPROBANTE_CODIGO = {
    boleta: "03",
    factura: "01",
};

const TIPO_DOCUMENTO_CODIGO = {
    dni: "1",
    ruc: "6",
    "carnet de extranjeria": "4",
    "carnet de extranjería": "4",
    pasaporte: "7",
};


module.exports = {
    company,
    IGV,
    TIPO_COMPROBANTE_CODIGO,
    TIPO_DOCUMENTO_CODIGO
}