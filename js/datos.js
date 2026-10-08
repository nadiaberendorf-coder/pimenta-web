/*
  ============================================================
  DATOS DE PIMENTA — el único archivo que hay que tocar
  para cambiar contacto, precios y promo.
  Escribí cada dato ENTRE LAS COMILLAS y guardá el archivo.
  Si un dato queda vacío (""), la web muestra [completar].
  ============================================================
*/
window.PIMENTA = {
  // ---------- CONTACTO ----------
  // Link de tu Calendly. Ejemplo: "https://calendly.com/pimenta-estudios/reserva"
  calendly: "",
  // WhatsApp: SOLO números, con 54 9 adelante y sin el 15. Ejemplo: "5491123456789"
  whatsapp: "",
  // Instagram, sin la @
  instagram: "pimentaestudios",
  // Mail de contacto
  mail: "",
  // Link del tour virtual 360°
  tour360: "",
  // Mensaje que aparece escrito cuando alguien toca el botón de WhatsApp
  mensajeWhatsapp: "¡Hola PIMENTA! Quiero consultar por el alquiler del estudio.",

  // ---------- RESERVA ----------
  // Seña para confirmar. Ejemplo: "50%" o "$40.000"
  sena: "",

  // ---------- PRECIOS ----------
  // "web" = precio reservando online (el que se destaca).
  // "habil" y "noHabil" = precio de lista (aparece tachado si es mayor al precio web).
  // Escribí los números SIN puntos ni signos.
  tarifas: [
    { horas: 1,  habil: 89000,  noHabil: 99000,  web: 79000 },
    { horas: 2,  habil: 159000, noHabil: 169000, web: 159000 },
    { horas: 3,  habil: 219000, noHabil: 229000, web: 219000 },
    { horas: 4,  habil: 289000, noHabil: 299000, web: 279000 },
    { horas: 5,  habil: 349000, noHabil: 359000, web: 339000 },
    { horas: 6,  habil: 389000, noHabil: 399000, web: 389000 },
    { horas: 8,  habil: 489000, noHabil: 499000, web: 459000 },
    { horas: 10, habil: 549000, noHabil: 549000, web: 499000 },
    { horas: 12, habil: 579000, noHabil: 579000, web: 539000 }
  ],

  // Fecha límite del precio web (opcional). Si la completás, aparece
  // una cuenta regresiva "El precio web termina en X días".
  // Formato AAAA-MM-DD. Ejemplo: "2026-10-31". Vacío = sin cuenta regresiva.
  precioWebHasta: ""
};
