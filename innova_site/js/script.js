function toast(message){
  let el=document.querySelector('.toast');
  if(!el){el=document.createElement('div');el.className='toast';document.body.appendChild(el)}
  el.textContent=message;el.classList.add('show');clearTimeout(window.__toastTimer);window.__toastTimer=setTimeout(()=>el.classList.remove('show'),2600);
}

function esc(value){return String(value||'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}

document.addEventListener('DOMContentLoaded',()=>{
  const menuBtn=document.querySelector('.menu-btn');
  const nav=document.querySelector('.nav');
  if(menuBtn&&nav){menuBtn.addEventListener('click',()=>{nav.classList.toggle('open');menuBtn.setAttribute('aria-expanded',nav.classList.contains('open'))})}

  const dateInput=document.querySelector('#fechaCita');
  if(dateInput){
    const today=new Date();const local=new Date(today.getTime()-today.getTimezoneOffset()*60000).toISOString().split('T')[0];dateInput.min=local;
  }

  const appointment=document.querySelector('#formReserva');
  const modal=document.querySelector('#appointmentModal');
  if(appointment&&modal){
    appointment.addEventListener('submit',e=>{
      e.preventDefault();
      if(!appointment.reportValidity()) return;
      const data=new FormData(appointment);
      document.querySelector('#appointmentSummary').innerHTML=`
        <div><strong>Paciente:</strong> ${esc(data.get('nombre'))}</div>
        <div><strong>Sede:</strong> ${esc(data.get('sede'))}</div>
        <div><strong>Especialidad:</strong> ${esc(data.get('especialidad'))}</div>
        <div><strong>Fecha:</strong> ${esc(data.get('fecha'))}</div>
        <div><strong>Hora:</strong> ${esc(data.get('hora'))}</div>`;
      modal.classList.add('show');
    });
    document.querySelector('#confirmAppointment')?.addEventListener('click',()=>{modal.classList.remove('show');appointment.reset();toast('Cita registrada correctamente. Te esperamos en InnovaSalud.')});
    document.querySelector('#cancelAppointment')?.addEventListener('click',()=>modal.classList.remove('show'));
    modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('show')});
  }

  document.querySelectorAll('[data-specialty]').forEach(btn=>btn.addEventListener('click',()=>{
    const value=btn.dataset.specialty;
    document.querySelectorAll('.filter').forEach(x=>x.classList.remove('activo'));btn.classList.add('activo');
    document.querySelectorAll('.specialty').forEach(card=>card.classList.toggle('hidden',value!=='all'&&card.dataset.type!==value));
  }));

  document.querySelectorAll('[data-book]').forEach(link=>link.addEventListener('click',()=>{
    sessionStorage.setItem('especialidadSeleccionada',link.dataset.book||'');
  }));
  const specialtySelect=document.querySelector('#especialidadCita');
  const saved=sessionStorage.getItem('especialidadSeleccionada');
  if(specialtySelect&&saved){specialtySelect.value=saved;sessionStorage.removeItem('especialidadSeleccionada')}

  const resultForm=document.querySelector('#formResultados');
  if(resultForm){
    resultForm.addEventListener('submit',e=>{
      e.preventDefault();const dni=document.querySelector('#dni').value.trim();const ticket=document.querySelector('#ticket').value.trim();const state=document.querySelector('#resultState');
      if(/^\d{8}$/.test(dni)&&ticket.length>=6){
        state.className='result-state show ok';
        state.innerHTML='<strong>Resultado encontrado.</strong><br>Paciente verificado. La vista previa está disponible para impresión.';
        document.querySelector('#downloadResult')?.removeAttribute('disabled');
      }else{
        state.className='result-state show error';
        state.innerHTML='<strong>No pudimos validar los datos.</strong><br>Ingresa un DNI de 8 dígitos y un código de ticket válido.';
      }
    });
  }
  document.querySelector('#downloadResult')?.addEventListener('click',()=>toast('Demo académica: la descarga real requeriría conexión con una base de datos.'));
});
