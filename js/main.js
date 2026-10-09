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
    // mensaje de WhatsApp distinto según desde dónde escriben
    if (url && el.getAttribute("data-link") === "whatsapp" && el.getAttribute("data-msg")) {
      url = "https://wa.me/" + d.whatsapp.replace(/\D/g, "") + "?text=" + encodeURIComponent(el.getAttribute("data-msg"));
    }
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
          (t.horas > 1 ? '<span class="t-hora-eq">Te sale ' + plata(t.web / t.horas) + ' la hora</span>' : '') +
          (i === mejor ? '<span class="t-mejor">Mejor precio por hora</span>' : '') + '</td>' +
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

  // Cantidad de reseñas de Google: solo si está cargada
  var cant = document.querySelector(".google-cant");
  if (cant && d.googleResenas) cant.hidden = false;

  /* --- Calendly: el calendario se abre encima de la página, sin salir de la web --- */
  var abrirCalendly = function (e) {
    if (!d.calendly) return;
    var url = d.calendly + (d.calendly.indexOf("?") > -1 ? "&" : "?") + "hide_gdpr_banner=1";
    if (window.Calendly && window.Calendly.initPopupWidget) { e.preventDefault(); window.Calendly.initPopupWidget({ url: url }); return; }
    // si el widget no cargó (o estamos en la vista previa), se abre en una pestaña nueva
    if (window.PIMENTA_VISTA_PREVIA || e.currentTarget.getAttribute("data-calendly") === "directo") { e.preventDefault(); window.open(url, "_blank", "noopener"); }
  };
  document.querySelectorAll("[data-calendly]").forEach(function (a) { a.addEventListener("click", abrirCalendly); });

  /* --- Tour 360°: se carga recién cuando lo piden, para que la web sea rápida --- */
  var tourBoton = document.getElementById("tour-boton");
  var tourAbierto = false;
  function abrirTour() {
    if (!d.tour360) return;
    if (window.PIMENTA_VISTA_PREVIA) { window.open(d.tour360, "_blank"); return; }
    if (tourAbierto) { window.open(d.tour360, "_blank"); return; }
    var f = document.createElement("iframe");
    f.src = d.tour360;
    f.title = "Tour virtual 360° de PIMENTA Estudios";
    f.allow = "xr-spatial-tracking; gyroscope; accelerometer; fullscreen";
    f.allowFullscreen = true;
    var marco = document.getElementById("tour-marco");
    marco.innerHTML = "";
    marco.classList.add("tour-marco--activo");
    marco.appendChild(f);
    tourAbierto = true;
    if (tourBoton) tourBoton.textContent = "Abrir en pantalla completa ↗";
  }
  if (tourBoton && d.tour360) {
    tourBoton.addEventListener("click", abrirTour);
    // si llegan desde otra página con #tour, se abre solo
    if (location.hash === "#tour" && !window.PIMENTA_VISTA_PREVIA) setTimeout(abrirTour, 900);
    var paradas = document.getElementById("paradas");
    if (paradas) { paradas.style.cursor = "pointer"; paradas.addEventListener("click", abrirTour); }
    // accesos al tour desde otras partes de la web
    document.querySelectorAll("[data-tour]").forEach(function (a) {
      if (window.PIMENTA_VISTA_PREVIA) { a.href = d.tour360; a.target = "_blank"; a.rel = "noopener"; return; }
      a.addEventListener("click", function (e) {
        e.preventDefault();
        document.getElementById("tour").scrollIntoView({ behavior: "smooth", block: "start" });
        setTimeout(abrirTour, 600);
      });
    });
  } else if (tourBoton) {
    document.getElementById("tour").hidden = true;
    document.querySelectorAll("[data-tour]").forEach(function (a) { a.remove(); });
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
    // las fotos de la portada también se ven en grande
    document.querySelectorAll(".hf").forEach(function (f) {
      f.setAttribute("role", "button"); f.tabIndex = 0; f.setAttribute("aria-label", "Ver la foto en grande");
      var abrir = function () { var img = f.querySelector("img"); visorImg.src = img.currentSrc || img.src; visorImg.alt = img.alt; visor.showModal(); };
      f.addEventListener("click", abrir);
      f.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); abrir(); } });
    });
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

  /* --- Portada: entra despacio cuando cargaron las tipografías --- */
  var entrar = function () { requestAnimationFrame(function () { document.documentElement.classList.add("in"); }); };
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(entrar, entrar); }
  else { window.addEventListener("load", entrar); }
  setTimeout(entrar, 900);
  var fecha = document.getElementById("hero-fecha");
  if (fecha) { var hoy = new Date(); fecha.textContent = hoy.getFullYear() + "/" + ("0" + (hoy.getMonth() + 1)).slice(-2); }

  /* --- Barra: se aclara cuando pasa por encima del bloque oscuro de contacto --- */
  var barra = document.querySelector(".barra");
  var oscuras = document.querySelectorAll(".oscura");
  if (barra && oscuras.length) {
    var ocupado = false;
    var pintarBarra = function () {
      var clara = false;
      oscuras.forEach(function (s) {
        var r = s.getBoundingClientRect();
        if (r.top <= 40 && r.bottom >= 40) clara = true;
      });
      barra.classList.toggle("barra--clara", clara);
      ocupado = false;
    };
    window.addEventListener("scroll", function () {
      if (ocupado) return;
      ocupado = true;
      requestAnimationFrame(pintarBarra);
    }, { passive: true });
    pintarBarra();
  }

  /* --- Flechas de botones y links: se separan en un span para moverse al pasar el mouse --- */
  document.querySelectorAll(".btn, .link, .hero-cta, .pie-datos a, .hero-pie .p4, .menu a").forEach(function (el) {
    if (el.querySelector(".fl")) return;
    var n = el.lastChild;
    if (!n || n.nodeType !== 3) return;
    var m = n.nodeValue.match(/^([\s\S]*?)\s*([→↗↑])\s*([)\]])?\s*$/);
    if (!m) return;
    n.nodeValue = m[1] + (m[1] && !/\s$/.test(m[1]) ? " " : "");
    var s = document.createElement("span");
    s.className = "fl" + (m[2] === "↗" ? " fl-ne" : m[2] === "↑" ? " fl-n" : "");
    s.textContent = m[2];
    el.appendChild(s);
    if (m[3]) el.appendChild(document.createTextNode(" " + m[3]));
  });

  /* --- Con mouse: la portada sigue al puntero, las fotos se inclinan y hay un cursor propio --- */
  var conMouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (conMouse && !reduce) {
    // portada: las fotos y las palabras se corren apenas según dónde está el mouse
    var stage = document.querySelector(".hero-stage");
    var heroVisible = true;
    if (stage && "IntersectionObserver" in window) {
      new IntersectionObserver(function (es) { heroVisible = es[0].isIntersecting; }).observe(stage);
    }
    if (stage) {
      window.addEventListener("mousemove", function (e) {
        if (!heroVisible) return;
        stage.style.setProperty("--mx", (e.clientX / window.innerWidth - .5).toFixed(3));
        stage.style.setProperty("--my", (e.clientY / window.innerHeight - .5).toFixed(3));
      }, { passive: true });
    }
    // fotos que se inclinan hacia el mouse
    document.querySelectorAll(".hf-img, .ficha .foto, .galeria button").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        el.style.setProperty("--ry", (x * 7).toFixed(2) + "deg");
        el.style.setProperty("--rx", (-y * 7).toFixed(2) + "deg");
      }, { passive: true });
      el.addEventListener("mouseleave", function () { el.style.setProperty("--ry", "0deg"); el.style.setProperty("--rx", "0deg"); });
    });
    // cursor propio: punto + el ° de PIMENTA que lo sigue con un poco de retraso
    var cur = document.createElement("div");
    cur.className = "cursor"; cur.setAttribute("aria-hidden", "true");
    cur.innerHTML = '<span class="cursor-punto"></span><span class="cursor-aro" data-texto="+"></span>';
    document.body.appendChild(cur);
    document.documentElement.classList.add("cursor-propio");
    var punto = cur.firstChild, aro = cur.lastChild, mx = -100, my = -100, ax = -100, ay = -100;
    document.addEventListener("mousemove", function (e) {
      mx = e.clientX; my = e.clientY;
      punto.style.transform = "translate(" + mx + "px," + my + "px)";
      cur.classList.add("cursor--visible");
      var t = e.target;
      var sobre = t.closest ? t.closest("a, button, summary, [role=tab], [role=button], .galeria figure, .paradas li, .g-card, .marcas-lista li, .p-amb") : null;
      var foto = t.closest ? t.closest(".galeria figure, .hf, .paradas li") : null;
      cur.classList.toggle("cursor--sobre", !!sobre);
      cur.classList.toggle("cursor--foto", !!foto);
      cur.classList.toggle("cursor--oculto", t.tagName === "IFRAME");
      if (foto) aro.setAttribute("data-texto", foto.closest(".paradas") ? "360°" : "+");
    }, { passive: true });
    document.documentElement.addEventListener("mouseleave", function () { cur.classList.remove("cursor--visible"); });
    (function seguir() {
      ax += (mx - ax) * .16; ay += (my - ay) * .16;
      aro.style.transform = "translate(" + ax.toFixed(1) + "px," + ay.toFixed(1) + "px)";
      requestAnimationFrame(seguir);
    })();
  }

  /* --- Año del pie --- */
  var anio = document.getElementById("anio");
  if (anio) anio.textContent = new Date().getFullYear();
})();
