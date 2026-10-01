const cfg = globalThis.siteConfig;
const content = globalThis.siteContent;
const wa = (message) =>
  "https://wa.me/" + cfg.whatsapp + "?text=" + encodeURIComponent(message);
const generic =
  "Hola, encontré Excelencia Funeraria en Internet y necesito información sobre sus servicios funerarios.";
window.dataLayer = window.dataLayer || [];
function gtag() {
  window.dataLayer.push(arguments);
}
gtag("set", {
  page_location: location.origin + location.pathname,
  page_referrer: "",
});
function event(name, parameters = {}) {
  if (cfg.gtm) window.dataLayer.push({ event: name, ...parameters });
  else if (cfg.ga || cfg.ads) gtag("event", name, parameters);
  if (
    cfg.ads &&
    cfg.adsLabel &&
    ["click_phone", "click_whatsapp", "generate_lead"].includes(name)
  )
    gtag("event", "conversion", { send_to: cfg.ads + "/" + cfg.adsLabel });
}
function script(src) {
  const tag = document.createElement("script");
  tag.async = true;
  tag.src = src;
  document.head.append(tag);
}
if (cfg.gtm) {
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  script(
    "https://www.googletagmanager.com/gtm.js?id=" + encodeURIComponent(cfg.gtm),
  );
} else if (cfg.ga || cfg.ads) {
  script(
    "https://www.googletagmanager.com/gtag/js?id=" +
      encodeURIComponent(cfg.ga || cfg.ads),
  );
  gtag("js", new Date());
  if (cfg.ga) gtag("config", cfg.ga, { send_page_view: false });
  if (cfg.ads) gtag("config", cfg.ads);
  if (cfg.ga)
    gtag("event", "page_view", {
      page_location: location.origin + location.pathname,
      page_title: document.title,
      page_referrer: "",
    });
}
document.querySelectorAll("[data-phone]").forEach((a) => {
  a.href = "tel:" + cfg.phoneE164;
  a.addEventListener("click", () => event("click_phone"));
});
document.querySelectorAll("[data-wa]").forEach((a) => {
  a.href = wa(generic);
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.addEventListener("click", () => event("click_whatsapp"));
});
const select = document.querySelector("#service-select");
function updateInterest(value, focus = false) {
  select.value = value;
  const notice = document.querySelector("#selected-interest");
  notice.hidden = !value;
  notice.textContent = value ? "Tu consulta: " + value : "";
  document.querySelectorAll("[data-wa]").forEach((link) => {
    link.href = wa(
      value
        ? `Hola, me interesa ${value}. Quisiera información y orientación.`
        : generic,
    );
  });
  if (focus) {
    history.replaceState(null, "", "#contacto");
    document.querySelector("#contacto").scrollIntoView({ block: "start" });
    select.focus({ preventScroll: true });
  }
}
document.querySelectorAll("[data-package]").forEach((link) =>
  link.addEventListener("click", (e) => {
    const item = content.packages.find((p) => p.id === link.dataset.package);
    if (!item) return;
    e.preventDefault();
    updateInterest("Paquete " + item.name, true);
    event("select_package", { package: item.id });
  }),
);
document.querySelectorAll("[data-service]").forEach((link) =>
  link.addEventListener("click", (e) => {
    e.preventDefault();
    updateInterest(link.dataset.service, true);
    event("select_service", { service: link.dataset.service });
  }),
);
select.addEventListener("change", () => updateInterest(select.value));
document.querySelector("#year").textContent = new Date().getFullYear();
if (cfg.showTestimonials && content.testimonials.length) {
  document.querySelector("#testimonials").hidden = false;
  for (const t of content.testimonials) {
    const quote = document.createElement("blockquote");
    quote.textContent = t.quote + " — " + t.name;
    document.querySelector("#testimonial-list").append(quote);
  }
}
const form = document.querySelector("#contact-form"),
  status = document.querySelector("#form-status"),
  button = document.querySelector("#submit-button");
document.querySelector("#contact-fields").disabled = false;
form.noValidate = true;
const fields = [...form.querySelectorAll("[required]")];
for (const field of fields) {
  const error = document.createElement("span");
  error.id = "error-" + field.name;
  error.className = "field-error";
  field.setAttribute("aria-describedby", error.id);
  field.closest("label").append(error);
  field.addEventListener("input", () => {
    if (field.getAttribute("aria-invalid") === "true") validateField(field);
  });
}
function validateField(field) {
  let message = "";
  if (field.type === "checkbox" && !field.checked)
    message = "Lee el aviso y confirma tu consentimiento para continuar.";
  else if (field.type !== "checkbox" && !field.value.trim())
    message = "Completa este campo para continuar.";
  else if (
    field.name === "phone" &&
    (!field.validity.valid || field.value.replace(/\D/g, "").length < 10)
  )
    message = "Escribe un teléfono válido con al menos 10 dígitos.";
  else if (!field.validity.valid) message = "Revisa el valor de este campo.";
  document.getElementById("error-" + field.name).textContent = message;
  field.setAttribute("aria-invalid", String(Boolean(message)));
  return !message;
}
form.addEventListener("focusin", (e) => {
  document.body.classList.toggle(
    "editing-form",
    e.target.matches("input:not([type=checkbox]),textarea,select"),
  );
});
form.addEventListener("focusout", (e) => {
  if (!form.contains(e.relatedTarget))
    document.body.classList.remove("editing-form");
});
if (cfg.endpoint) {
  button.textContent = "Solicitar información";
  document.querySelector("#form-intro").textContent =
    "Comparte tus datos para que podamos orientarte.";
}
const campaign = {};
for (const key of [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
]) {
  const value = new URLSearchParams(location.search).get(key);
  if (value) campaign[key] = value.slice(0, 200);
}
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const invalid = fields.filter((field) => !validateField(field));
  if (invalid.length) {
    status.textContent = "Revisa los campos señalados para continuar.";
    invalid[0].focus();
    return;
  }
  const values = Object.fromEntries(new FormData(form));
  if (values.website) return;
  const message = `Hola, soy ${values.name.trim()}. Me interesa: ${values.service}. Mi teléfono: ${values.phone}. Ubicación: ${values.location.trim()}. ${values.message.trim()}`;
  if (!cfg.endpoint) {
    window.open(wa(message), "_blank", "noopener,noreferrer");
    event("click_whatsapp", { source: "contact_form" });
    status.textContent =
      "Tu mensaje está preparado. Para compartirlo, revisa y pulsa Enviar en WhatsApp.";
    return;
  }
  button.disabled = true;
  button.textContent = "Enviando…";
  status.textContent = "";
  try {
    const response = await fetch(cfg.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: values.name.trim(),
        phone: values.phone,
        service: values.service,
        location: values.location.trim(),
        message: values.message.trim(),
        consent: true,
        campaign,
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw Error();
    event("generate_lead", { source: "contact_form" });
    form.reset();
    status.textContent = "Recibimos tu solicitud. Gracias por contactarnos.";
  } catch {
    status.textContent =
      "No se pudo enviar tu solicitud. Puedes continuar por WhatsApp: ";
    const link = document.createElement("a");
    link.href = wa(message);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Abrir mi mensaje";
    link.style.textDecoration = "underline";
    link.addEventListener("click", () =>
      event("click_whatsapp", { source: "form_fallback" }),
    );
    status.append(link);
  } finally {
    button.disabled = false;
    button.textContent = "Solicitar información";
  }
});

form.addEventListener("reset", () => {
  updateInterest("");
  for (const field of fields) {
    field.removeAttribute("aria-invalid");
    document.getElementById("error-" + field.name).textContent = "";
  }
});

if ("IntersectionObserver" in window) {
  const header = document.querySelector("#site-header");
  const headerObserver = new IntersectionObserver(([entry]) => {
    header.classList.toggle("compact", !entry.isIntersecting);
  });
  headerObserver.observe(document.querySelector(".hero"));

  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  if (!motion.matches) {
    // Elements stay visible until observed; a script failure never hides content.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          if (!motion.matches) entry.target.classList.add("reveal");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.08 },
    );
    document
      .querySelectorAll(
        ".section-head,.service,.package,.steps article,.care-image",
      )
      .forEach((element, index) => {
        element.style.setProperty("--delay", (index % 3) * 50 + "ms");
        observer.observe(element);
      });
  }
}
