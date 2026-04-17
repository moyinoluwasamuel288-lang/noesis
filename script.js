// Your updated script.js code
setTimeout(() => {
 const section = document.getElementById(page);
 if (!section) { window.scrollTo({ top:0, behavior:'smooth' }); return; }
 section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}, 100);