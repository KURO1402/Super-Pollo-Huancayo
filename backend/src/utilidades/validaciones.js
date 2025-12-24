const validarCorreo = (correo) => {

  if (!correo || typeof correo !== "string") {
    throw Object.assign(new Error("El correo es necesario y debe estar en formato de texto."), { status: 400 });
  }

  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  return regex.test(correo);

};

module.exports = {
    validarCorreo
}