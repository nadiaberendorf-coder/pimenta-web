(function () {
  var d = window.PIMENTA || {};

  // 5491124845148 -> +54 9 11 2484-5148
  function lindoTel(n) {
    var x = n.match(/^549(11)(\d{4})(\d{4})$/);
    return x ? "+54 9 " + x[1] + " " + x[2] + "-" + x[3] : "+" + n;
  }

  /* --- Datos de contacto (vienen de js/datos.js) --- */
  var links = {
    whatsapp: d.whatsapp ? "https://wa.me/" + d.whatsapp.replace(/\D/g, "") + "?text=" + encodeURIComponent(d.mensajeWhatsapp || "") : "",
    instagram: d.instagram ? "https://www.instagram.com/" + d.instagram.replace(/^@/, "") + "/" : "",
    mail: d.mail ? "mailto:" + d.mail : "",
    tour360: d.tour360 || "",
    visita: d.visita || "",
    reunion: d.reunion || "",
    google: d.google || ""
  };
  var textos = {
    whatsapp: d.whatsapp ? lindoTel(d.whatsapp.replace(/\D/g, "")) : "",
    instagram: d.instagram ? "@" + d.instagram.replace(/^@/, "") : "",
    mail: d.mail || "",
    sena: d.sena || "",
    googlePuntaje: d.googlePuntaje || "",
    googleResenas: d.googleResenas || ""
  };

  // Links: si el dato está cargado, el link apunta ahí; si no, lleva a Contacto
  document.querySelectorAll("[data-link]").forEach(function (el) {
    var url = links[el.getAttribute("data-link")];
    if (url) {
      el.href = url;
      if (url.indexOf("http") === 0) { el.target = "_blank"; el.rel = "noopener"; }
    }
  });
  // Textos visibles: reemplazan el [completar]
  document.querySelectorAll("[data-texto]").forEach(function (el) {
    var t = textos[el.getAttribute("data-texto")];
    if (t) { el.textContent = t; el.classList.remove("completar"); }
  });
  // Avisos que se ocultan cuando el dato ya está cargado
  document.querySelectorAll("[data-si-falta]").forEach(function (el) {
    if (links[el.getAttribute("data-si-falta")]) el.remove();
  });

  /* --- Tabla de precios --- */
  var plata = function (n) { return "$" + Math.round(n).toLocaleString("es-AR"); };
  var cuerpo = document.getElementById("tabla-precios");
  var tarifas = d.tarifas || [];
  // la fila con mejor precio por hora se destaca sola
  var mejor = tarifas.reduce(function (m, t, i) {
    return (m < 0 || t.web / t.horas < tarifas[m].web / tarifas[m].horas) ? i : m;
  }, -1);

  function dibujarTabla() {
    if (!cuerpo) return;
    cuerpo.innerHTML = tarifas.map(function (t, i) {
      var lista = t.lista;
      var ahorro = lista - t.web;
      return '<tr' + (i === mejor ? ' class="fila-top"' : '') + '>' +
        '<td class="t-horas">' + t.horas + '<small>' + (t.horas === 1 ? 'hora' : 'horas') + '</small></td>' +
        '<td>' + (ahorro > 0 ? '<span class="t-lista">Lista ' + plata(lista) + '</span>' : '') +
          '<span class="t-web">' + plata(t.web) + '</span>' +
          (ahorro > 0 ? '<span class="t-ahorro">Ahorrás ' + plata(ahorro) + '</span>' : '') +
          (i === mejor ? '<span class="t-mejor">Mejor precio por hora</span>' : '') + '</td>' +
        '<td class="t-hora col-hora">' + plata(t.web / t.horas) + ' / h</td>' +
      '</tr>';
    }).join("");
  }
  dibujarTabla();

  // Cuenta regresiva del precio web (solo si se cargó una fecha)
  var cuenta = document.getElementById("cuenta");
  if (cuenta && d.precioWebHasta) {
    var fin = new Date(d.precioWebHasta + "T23:59:59-03:00");
    var dias = Math.ceil((fin - new Date()) / 86400000);
    if (dias > 0) {
      cuenta.textContent = dias === 1 ? "El precio web termina hoy" : "El precio web termina en " + dias + " días";
      cuenta.hidden = false;
    }
  }

  /* --- Calendly --- */
  var cal = document.getElementById("calendly");
  if (cal && d.calendly && window.PIMENTA_VISTA_PREVIA) {
    // en la vista previa de Claude no se pueden mostrar calendarios embebidos
    cal.innerHTML = '<p>Acá aparece tu calendario de Calendly en la web publicada.</p>' +
      '<a class="btn" href="' + d.calendly + '" target="_blank" rel="noopener">Abrir Calendly</a>';
  } else if (cal && d.calendly) {
    var iframe = document.createElement("iframe");
    iframe.src = d.calendly + (d.calendly.indexOf("?") > -1 ? "&" : "?") +
      "hide_gdpr_banner=1&embed_type=Inline&embed_domain=" + location.hostname;
    iframe.title = "Calendario de reservas de PIMENTA Estudios";
    iframe.loading = "lazy";
    cal.innerHTML = "";
    cal.appendChild(iframe);
    cal.classList.add("calendly--activo");
  }

  /* --- Tour 360°: se carga recién cuando lo tocan, para que la web sea rápida --- */
  var tourBoton = document.getElementById("tour-boton");
  if (tourBoton && d.tour360 && window.PIMENTA_VISTA_PREVIA) {
    // en la vista previa de Claude el tour se abre en otra pestaña
    var a = document.createElement("a");
    a.className = tourBoton.className; a.innerHTML = tourBoton.innerHTML;
    a.href = d.tour360; a.target = "_blank"; a.rel = "noopener";
    tourBoton.replaceWith(a);
  } else if (tourBoton && d.tour360) {
    tourBoton.addEventListener("click", function () {
      var f = document.createElement("iframe");
      f.src = d.tour360;
      f.title = "Tour virtual 360° de PIMENTA Estudios";
      f.allow = "xr-spatial-tracking; gyroscope; accelerometer; fullscreen";
      f.allowFullscreen = true;
      var marco = document.getElementById("tour-marco");
      marco.innerHTML = "";
      marco.appendChild(f);
    });
  } else if (tourBoton) {
    document.getElementById("tour").hidden = true;
  }

  /* --- Pestañas de "Todo incluido" --- */
  var tabs = document.querySelectorAll('.pestanas [role="tab"]');
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) {
        var activo = t === tab;
        t.setAttribute("aria-selected", activo);
        t.tabIndex = activo ? 0 : -1;
        document.getElementById(t.getAttribute("aria-controls")).hidden = !activo;
      });
    });
  });

  /* --- Galería: ver foto grande --- */
  var visor = document.getElementById("visor");
  var visorImg = document.getElementById("visor-img");
  if (visor && visor.showModal) {
    document.querySelectorAll(".galeria button").forEach(function (b) {
      b.addEventListener("click", function () {
        var img = b.querySelector("img");
        visorImg.src = img.currentSrc || img.src;
        visorImg.alt = img.alt;
        visor.showModal();
      });
    });
    visor.addEventListener("click", function () { visor.close(); });
  }

  /* --- Menú del celular --- */
  var boton = document.getElementById("menu-boton");
  var menu = document.getElementById("menu");
  function cerrarMenu() {
    menu.classList.remove("abierto");
    boton.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    boton.textContent = "Menú";
  }
  if (boton) {
    boton.addEventListener("click", function () {
      var abierto = menu.classList.toggle("abierto");
      boton.setAttribute("aria-expanded", abierto);
      boton.textContent = abierto ? "Cerrar" : "Menú";
      document.body.style.overflow = abierto ? "hidden" : "";
    });
    menu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", cerrarMenu); });
  }

  /* --- Aparición suave al hacer scroll (solo lo que está más abajo de la primera pantalla) --- */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revelables = document.querySelectorAll(".cab, .presenta-texto, .presenta-acciones, .specs, .ficha, .plano-bloque > *, .tour, .luz, .panel, .pestanas, .tarifas > *, .condiciones, .evento, .galeria figure, .pasos li, .calendly, .visita, .faq, .ubicacion > *, .contacto");
  if ("IntersectionObserver" in window && !reduce) {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -6% 0px" });
    revelables.forEach(function (el) {
      if (el.getBoundingClientRect().top > window.innerHeight) { el.classList.add("pre"); obs.observe(el); }
    });
  }

  /* --- Portada: la foto se acomoda suave al bajar --- */
  var hero = document.querySelector(".hero");
  if (hero && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var pendiente = false;
    window.addEventListener("scroll", function () {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(function () {
        var s = Math.min(1, window.scrollY / (hero.offsetHeight || 1));
        hero.style.setProperty("--s", s.toFixed(3));
        pendiente = false;
      });
    }, { passive: true });
  }

  /* --- Año del pie --- */
  var anio = document.getElementById("anio");
  if (anio) anio.textContent = new Date().getFullYear();
})();
