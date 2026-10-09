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
  calendly: "https://calendly.com/pimentaestudios",
  // Link para agendar una visita al estudio (15 min)
  visita: "https://calendly.com/pimentaestudios/visita",
  // Link para una reunión virtual de 15 min sobre el servicio de fotografía
  reunion: "https://calendly.com/pimentaestudios/reunion",
  // WhatsApp: SOLO números, con 54 9 adelante y sin el 15. Ejemplo: "5491123456789"
  whatsapp: "5491124845148",
  // Instagram, sin la @
  instagram: "pimentaestudios",
  // Mail de contacto
  mail: "holapimenta@gmail.com",
  // Link del tour virtual 360°
  tour360: "https://kuula.co/share/collection/7Dlsd?logo=-1&info=0&fs=1&vr=0&zoom=1&gyro=0&initload=0&thumbs=1&inst=es",
  // ---------- GOOGLE ----------
  // Link a tus reseñas de Google (el de "Escribir una reseña" o el de Maps)
  google: "https://maps.app.goo.gl/WNk3tJEqBnYM6PEH6",
  // Puntaje y cantidad de reseñas, como aparecen en tu ficha de Google. Ejemplo: "4,9" y "150"
  googlePuntaje: "4,9",
  googleResenas: "",
  // Mensaje que aparece escrito cuando alguien toca el botón de WhatsApp
  mensajeWhatsapp: "¡Hola PIMENTA! Quiero consultar por el alquiler del estudio.",

  // ---------- RESERVA ----------
  // Seña para confirmar. Ejemplo: "50%" o "$40.000"
  sena: "70%",

  // ---------- PRECIOS ----------
  // Una sola tarifa, todo incluido.
  // "web" = precio reservando online (el que se destaca).
  // "lista" = precio de lista (aparece tachado si es mayor al precio web).
  // Escribí los números SIN puntos ni signos.
  tarifas: [
    { horas: 1,  lista: 99000,  web: 79000 },
    { horas: 2,  lista: 169000, web: 159000 },
    { horas: 3,  lista: 229000, web: 219000 },
    { horas: 4,  lista: 299000, web: 279000 },
    { horas: 5,  lista: 359000, web: 339000 },
    { horas: 6,  lista: 399000, web: 389000 },
    { horas: 8,  lista: 499000, web: 459000 },
    { horas: 10, lista: 549000, web: 499000 },
    { horas: 12, lista: 579000, web: 539000 }
  ],

  // Fecha límite del precio web (opcional). Si la completás, aparece
  // una cuenta regresiva "El precio web termina en X días".
  // Formato AAAA-MM-DD. Ejemplo: "2026-10-31". Vacío = sin cuenta regresiva.
  precioWebHasta: ""
};
