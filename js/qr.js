let qrInstance = null;

export function openQrModal({ title, url }) {
  const modal = document.getElementById('qr-modal');
  const backdrop = document.getElementById('qr-backdrop');
  const container = document.getElementById('qr-code');
  const qrTitle = document.getElementById('qr-video-title');
  const qrUrl = document.getElementById('qr-url');

  if (!modal || !container) return;

  qrTitle.textContent = title;
  qrUrl.textContent = url;
  container.innerHTML = '';

  if (typeof window.QRCode === 'undefined') {
    container.innerHTML =
      '<p class="text-sm text-red-600">No se pudo cargar la librería QRCode.js.</p>';
  } else {
    qrInstance = new window.QRCode(container, {
      text: url,
      width: 220,
      height: 220,
      colorDark: '#0f172a',
      colorLight: '#ffffff',
      correctLevel: window.QRCode.CorrectLevel.H,
    });
  }

  modal.classList.remove('hidden');
  backdrop.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');
}

export function closeQrModal() {
  document.getElementById('qr-modal')?.classList.add('hidden');
  document.getElementById('qr-backdrop')?.classList.add('hidden');
  document.body.classList.remove('overflow-hidden');
  qrInstance = null;
}

export function initializeQrModal() {
  document
    .getElementById('close-qr-modal')
    ?.addEventListener('click', closeQrModal);

  document
    .getElementById('qr-backdrop')
    ?.addEventListener('click', closeQrModal);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeQrModal();
  });
}
