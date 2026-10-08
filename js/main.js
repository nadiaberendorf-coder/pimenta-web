(function () {
  var d = window.PIMENTA || {};

  /* --- Datos de contacto (vienen de js/datos.js) --- */
  var links = {
    whatsapp: d.whatsapp ? "https://wa.me/" + d.whatsapp.replace(/\D/g, "") + "?text=" + encodeURIComponent(d.mensajeWhatsapp || "") : "",
    instagram: d.instagram ? "https://www.instagram.com/" + d.instagram.replace(/^@/, "") + "/" : "",
    mail: d.mail ? "mailto:" + d.mail : "",
    tour360: d.tour360 || ""
  };
  var textos = {
    whatsapp: d.whatsapp ? "+" + d.whatsapp.replace(/\D/g, "") : "",
    instagram: d.instagram ? "@" + d.instagram.replace(/^@/, "") : "",
    mail: d.mail || "",
    sena: d.sena || ""
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

  function dibujarTabla(dia) {
    if (!cuerpo) return;
    cuerpo.innerHTML = tarifas.map(function (t, i) {
      var lista = t[dia];
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
  dibujarTabla("habil");
  document.querySelectorAll(".selector button").forEach(function (b) {
    b.addEventListener("click", function () {
      document.querySelectorAll(".selector button").forEach(function (x) { x.setAttribute("aria-checked", "false"); });
      b.setAttribute("aria-checked", "true");
      dibujarTabla(b.getAttribute("data-dia"));
    });
  });

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
  if (cal && d.calendly) {
    var iframe = document.createElement("iframe");
    iframe.src = d.calendly + (d.calendly.indexOf("?") > -1 ? "&" : "?") +
      "hide_gdpr_banner=1&embed_type=Inline&embed_domain=" + location.hostname;
    iframe.title = "Calendario de reservas de PIMENTA Estudios";
    iframe.loading = "lazy";
    cal.innerHTML = "";
    cal.appendChild(iframe);
    cal.classList.add("calendly--activo");
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
  }
  if (boton) {
    boton.addEventListener("click", function () {
      var abierto = menu.classList.toggle("abierto");
      boton.setAttribute("aria-expanded", abierto);
      document.body.style.overflow = abierto ? "hidden" : "";
    });
    menu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", cerrarMenu); });
  }

  /* --- Aparecer suave al hacer scroll --- */
  var aparecen = document.querySelectorAll(".aparecer");
  if ("IntersectionObserver" in window) {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    aparecen.forEach(function (el) { obs.observe(el); });
  } else {
    aparecen.forEach(function (el) { el.classList.add("visible"); });
  }

  /* --- Año del pie --- */
  var anio = document.getElementById("anio");
  if (anio) anio.textContent = new Date().getFullYear();
})();
