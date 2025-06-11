document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('.formulario-inscripcion');
  if (!form) return;

  // Determinar la URL base según el entorno
  const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const baseUrl = isDevelopment ? 'http://localhost:3000' : window.location.origin;

  form.addEventListener('submit', function(event) {
    event.preventDefault();
    const data = {
      nombre: form.nombre.value,
      email: form.email.value,
      mensaje: 'Inscripción a la lista de espera'
    };

    fetch(`${baseUrl}/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(res => res.text())
    .then(msg => {
      alert(msg);
      if (msg.includes('correctamente')) {
        form.reset(); // Limpiar el formulario si el envío fue exitoso
      }
    })
    .catch(err => alert('Error: ' + err));
  });
}); 