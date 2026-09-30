const cfg=globalThis.siteConfig;
const content=globalThis.siteContent;
const wa=message=>'https://wa.me/'+cfg.whatsapp+'?text='+encodeURIComponent(message);
const generic='Hola, encontré Excelencia Funeraria en Internet y necesito información sobre sus servicios funerarios.';
window.dataLayer=window.dataLayer||[];
function gtag(){window.dataLayer.push(arguments);}
gtag('set',{page_location:location.origin+location.pathname,page_referrer:''});
function event(name,parameters={}){if(cfg.gtm)window.dataLayer.push({event:name,...parameters});else if(cfg.ga||cfg.ads)gtag('event',name,parameters);if(cfg.ads&&cfg.adsLabel&&['click_phone','click_whatsapp','generate_lead'].includes(name))gtag('event','conversion',{send_to:cfg.ads+'/'+cfg.adsLabel});}
function script(src){const tag=document.createElement('script');tag.async=true;tag.src=src;document.head.append(tag);}
if(cfg.gtm){window.dataLayer.push({'gtm.start':Date.now(),event:'gtm.js'});script('https://www.googletagmanager.com/gtm.js?id='+encodeURIComponent(cfg.gtm));}else if(cfg.ga||cfg.ads){script('https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(cfg.ga||cfg.ads));gtag('js',new Date());if(cfg.ga)gtag('config',cfg.ga,{send_page_view:false});if(cfg.ads)gtag('config',cfg.ads);if(cfg.ga)gtag('event','page_view',{page_location:location.origin+location.pathname,page_title:document.title,page_referrer:''});}
document.querySelectorAll('[data-phone]').forEach(a=>{a.href='tel:'+cfg.phoneE164;a.addEventListener('click',()=>event('click_phone'));});
document.querySelectorAll('[data-wa]').forEach(a=>{a.href=wa(generic);a.target='_blank';a.rel='noopener noreferrer';a.addEventListener('click',()=>event('click_whatsapp'));});
const select=document.querySelector('#service-select');
document.querySelectorAll('[data-package]').forEach(a=>a.addEventListener('click',()=>{const item=content.packages.find(p=>p.id===a.dataset.package);select.value='Paquete '+item.name;event('select_package',{package:item.id});}));
document.querySelectorAll('[data-service]').forEach(a=>a.addEventListener('click',()=>{select.value=a.dataset.service;event('select_service',{service:a.dataset.service});}));
document.querySelector('#year').textContent=new Date().getFullYear();
if(cfg.showTestimonials&&content.testimonials.length){document.querySelector('#testimonials').hidden=false;for(const t of content.testimonials){const quote=document.createElement('blockquote');quote.textContent=t.quote+' — '+t.name;document.querySelector('#testimonial-list').append(quote);}}
const form=document.querySelector('#contact-form'),status=document.querySelector('#form-status'),button=document.querySelector('#submit-button');
if(cfg.endpoint){button.textContent='Solicitar información';document.querySelector('#form-intro').textContent='Comparte tus datos para que podamos orientarte.';}
const campaign={};for(const key of ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid']){const value=new URLSearchParams(location.search).get(key);if(value)campaign[key]=value.slice(0,200);}
form.addEventListener('submit',async e=>{e.preventDefault();if(!form.reportValidity())return;const values=Object.fromEntries(new FormData(form));if(values.website)return;if(values.phone.replace(/\D/g,'').length<10){status.textContent='Revisa tu teléfono: escribe al menos 10 dígitos.';return;}const message=`Hola, soy ${values.name.trim()}. Me interesa: ${values.service}. Mi teléfono: ${values.phone}. Ubicación: ${values.location.trim()}. ${values.message.trim()}`;
if(!cfg.endpoint){window.open(wa(message),'_blank','noopener,noreferrer');event('click_whatsapp',{source:'contact_form'});status.textContent='Tu mensaje está preparado. Para compartirlo, revisa y pulsa Enviar en WhatsApp.';return;}
button.disabled=true;button.textContent='Enviando…';status.textContent='';
try{const response=await fetch(cfg.endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:values.name.trim(),phone:values.phone,service:values.service,location:values.location.trim(),message:values.message.trim(),consent:true,campaign}),signal:AbortSignal.timeout(15000)});if(!response.ok)throw Error();event('generate_lead',{source:'contact_form'});form.reset();status.textContent='Recibimos tu solicitud. Gracias por contactarnos.';}catch{status.textContent='No se pudo enviar tu solicitud. Puedes continuar por WhatsApp: ';const link=document.createElement('a');link.href=wa(message);link.target='_blank';link.rel='noopener noreferrer';link.textContent='Abrir mi mensaje';link.style.textDecoration='underline';link.addEventListener('click',()=>event('click_whatsapp',{source:'form_fallback'}));status.append(link);}finally{button.disabled=false;button.textContent='Solicitar información';}});
