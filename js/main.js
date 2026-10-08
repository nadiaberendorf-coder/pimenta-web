(function () {
  var d = window.PIMENTA || {};

  /* --- Datos de contacto (vienen de js/datos.js) --- */
  var links = {
    whatsapp: d.whatsapp ? "https://wa.me/" + d.whatsapp.replace(/\D/g, "") + "?text=" + encodeURIComponent(d.mensajeWhatsapp || "") : "",
    instagram: d.instagram ? "https://instagram.com/" + d.instagram.replace(/^@/, "") : "",
    mail: d.mail ? "mailto:" + d.mail : ""
  };
  var textos = {
    whatsapp: d.whatsapp ? "+" + d.whatsapp.replace(/\D/g, "") : "",
    instagram: d.instagram ? "@" + d.instagram.replace(/^@/, "") : "",
    mail: d.mail || ""
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

  /* --- Fotos que todavía no se subieron: mostrar un aviso en su lugar --- */
  document.querySelectorAll("img[data-foto]").forEach(function (img) {
    function falta() { img.parentNode.classList.add("sin-foto"); }
    if (img.complete && img.naturalWidth === 0) falta();
    img.addEventListener("error", falta);
  });

  /* --- Galería: ver foto grande --- */
  var visor = document.getElementById("visor");
  var visorImg = document.getElementById("visor-img");
  if (visor && visor.showModal) {
    document.querySelectorAll(".galeria button").forEach(function (b) {
      b.addEventListener("click", function () {
        var img = b.querySelector("img");
        if (b.classList.contains("sin-foto")) return;
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
  if (boton) {
    boton.addEventListener("click", function () {
      var abierto = menu.classList.toggle("abierto");
      boton.setAttribute("aria-expanded", abierto);
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        menu.classList.remove("abierto");
        boton.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* --- Año del pie --- */
  var anio = document.getElementById("anio");
  if (anio) anio.textContent = new Date().getFullYear();
})();
