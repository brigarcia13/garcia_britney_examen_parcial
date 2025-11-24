const API_BASE = 'http://localhost:5000/api/contacts';
 


const contactForm = document.getElementById('contactForm');
const contactIdInput = document.getElementById('contactId');
const nombreInput = document.getElementById('nombre');
const apellidoInput = document.getElementById('apellido');
const emailInput = document.getElementById('email');
const telefonoInput = document.getElementById('telefono');
const notaInput = document.getElementById('nota');
const contactsList = document.getElementById('contactsList');
const resetBtn = document.getElementById('resetBtn');

document.addEventListener('DOMContentLoaded', () => {
  loadContacts();
});

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = contactIdInput.value.trim();
  const payload = {
    nombre: nombreInput.value.trim(),
    apellido: apellidoInput.value.trim(),
    email: emailInput.value.trim(),
    telefono: telefonoInput.value.trim(),
    nota: notaInput.value.trim()
  };

  try {
    if (id) {
      
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Error al actualizar');
      showToast('Contacto actualizado');
    } else {
      
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.status !== 201) throw new Error('Error al crear');
      showToast('Contacto creado');
    }
    contactForm.reset();
    contactIdInput.value = '';
    await loadContacts();
  } catch (err) {
    console.error(err);
    alert('Ocurrió un error: ' + err.message);
  }
});

resetBtn.addEventListener('click', () => {
  contactForm.reset();
  contactIdInput.value = '';
});


async function loadContacts() {
  try {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error('No se pudieron cargar los contactos');
    const contacts = await res.json();
    renderContacts(contacts);
  } catch (err) {
    console.error(err);
    contactsList.innerHTML = `<div class="col-12 text-danger">Error al cargar contactos</div>`;
  }
}

function renderContacts(contacts) {
  if (!contacts.length) {
    contactsList.innerHTML = `<div class="col-12 text-muted">No hay contactos. Crea el primero con el formulario.</div>`;
    return;
  }

  contactsList.innerHTML = '';
  contacts.forEach(c => {
    const div = document.createElement('div');
    div.className = 'col-12 col-md-6';
    div.innerHTML = `
      <div class="contact-card d-flex justify-content-between align-items-start">
        <div>
          <h5>${escapeHtml(c.nombre)} ${escapeHtml(c.apellido)}</h5>
          <p class="mb-1"><strong>Email:</strong> ${escapeHtml(c.email)}</p>
          <p class="mb-1"><strong>Tel:</strong> ${escapeHtml(c.telefono || '')}</p>
          <p class="mb-0 text-muted">${escapeHtml(c.nota || '')}</p>
        </div>
        <div class="contact-actions d-flex flex-column gap-2">
          <button class="btn btn-sm btn-outline-primary" data-id="${c._id}" onclick="editContact('${c._id}')">Editar</button>
          <button class="btn btn-sm btn-outline-danger" data-id="${c._id}" onclick="deleteContact('${c._id}')">Eliminar</button>
        </div>
      </div>
    `;
    contactsList.appendChild(div);
  });
}

window.editContact = async function(id) {
  try {
    const res = await fetch(`${API_BASE}/${id}`);
    if (!res.ok) throw new Error('No se encontró el contacto');
    const c = await res.json();
    contactIdInput.value = c._id;
    nombreInput.value = c.nombre;
    apellidoInput.value = c.apellido;
    emailInput.value = c.email;
    telefonoInput.value = c.telefono || '';
    notaInput.value = c.nota || '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    console.error(err);
    alert('Error al cargar contacto para editar');
  }
};

window.deleteContact = async function(id) {
  if (!confirm('¿Eliminar este contacto?')) return;
  try {
    const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.msg || 'Error al eliminar');
    }
    showToast('Contacto eliminado');
    await loadContacts();
  } catch (err) {
    console.error(err);
    alert('Error al eliminar: ' + err.message);
  }
};


function escapeHtml(text = '') {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function showToast(message) {
  
  const el = document.createElement('div');
  el.className = 'toast align-items-center show';
  el.style.position = 'fixed';
  el.style.right = '20px';
  el.style.bottom = '20px';
  el.style.background = '#1f2937';
  el.style.color = 'white';
  el.style.padding = '10px 14px';
  el.style.borderRadius = '8px';
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2000);
}
