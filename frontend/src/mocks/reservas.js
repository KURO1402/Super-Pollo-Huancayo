export const reservasDatos = [
  {
    idReservacion: 1,
    fechaReservacion: "2024-01-15",
    horaReservacion: "19:00:00",
    cantidadPersonas: 4,
    estadoReservacion: "pagado",
    fechaCreacion: "2024-01-10 14:30:00",
    nombresUsuario: "Juan Pérez",
    numeroMesa: 5,
    montoTotal: 120.50,
    productos: [
      { nombre: "Pollo a la Brasa", cantidad: 2, precio: 45.00 },
      { nombre: "Coca Cola 1L", cantidad: 2, precio: 8.00 },
      { nombre: "Ensalada Mixta", cantidad: 1, precio: 14.50 }
    ]
  },
  {
    idReservacion: 2,
    fechaReservacion: "2024-01-16",
    horaReservacion: "20:30:00",
    cantidadPersonas: 2,
    estadoReservacion: "pendiente",
    fechaCreacion: "2024-01-11 10:15:00",
    nombresUsuario: "María García",
    numeroMesa: 3,
    montoTotal: 65.00,
    productos: [
      { nombre: "1/4 Pollo", cantidad: 2, precio: 25.00 },
      { nombre: "Inca Kola 500ml", cantidad: 2, precio: 5.00 }
    ]
  },
  {
    idReservacion: 3,
    fechaReservacion: "2024-01-14",
    horaReservacion: "18:00:00",
    cantidadPersonas: 6,
    estadoReservacion: "cancelado",
    fechaCreacion: "2024-01-09 16:45:00",
    nombresUsuario: "Carlos López",
    numeroMesa: 8,
    montoTotal: 0.00,
    productos: []
  }
];