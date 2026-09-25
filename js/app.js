import { CONFIG } from "./config.js";
import { getVideoMetadata } from "./drive-api.js";
import { initializeQrModal, openQrModal } from "./qr.js";

const cardContainer = document.getElementById("video-card-container");
const statusMessage = document.getElementById("status-message");

function buildPlayerUrl(videoId) {
  const origin = window.location.origin;
  const currentPath = window.location.pathname;

  // Permite ejecutar el proyecto dentro de una subcarpeta durante pruebas.
  const basePath = currentPath.endsWith("/")
    ? currentPath
    : currentPath.substring(0, currentPath.lastIndexOf("/") + 1);

  const url = new URL(`${basePath}player.html`, origin);
  url.searchParams.set("id", videoId);
  return url.toString();
}

function createVideoCard(video) {
  const article = document.createElement("article");
  article.className =
    "group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 transition duration-300 hover:-translate-y-1 hover:shadow-2xl";

  article.innerHTML = `
    <div class="relative aspect-video overflow-hidden bg-slate-100">
      <img
  id="video-thumbnail"
  src="${video.thumbnailUrl}"
  alt="Miniatura de ${video.title}"
  referrerpolicy="no-referrer"
  class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
/>
      <div class="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent"></div>
      <div class="absolute bottom-4 left-4 rounded-full bg-slate-950/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">
        ${video.mimeType || "video"}
      </div>
    </div>

    <div class="p-6 sm:p-7">
      <p class="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-indigo-600">
        Video disponible
      </p>
      <h2 class="text-2xl font-bold tracking-tight text-slate-900">
        ${video.title}
      </h2>
      <p class="mt-3 text-sm leading-6 text-slate-500">
        Genera un código QR para abrir este video directamente en otro dispositivo.
      </p>

      <button
        id="generate-qr-button"
        type="button"
        class="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="h-5 w-5">
          <path d="M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3z" />
          <path d="M15 15h2v2h-2zM19 15h2v2h-2zM15 19h2v2h-2zM19 19h2v2h-2z" />
        </svg>
        Generar código QR
      </button>
    </div>
  `;

  const thumbnail =
  article.querySelector('#video-thumbnail');

thumbnail?.addEventListener('error', () => {
  console.warn(
    'No fue posible cargar la miniatura proporcionada por Google Drive.'
  );

  thumbnail.src =
    './assets/images/video-placeholder.svg';
});

  article
    .querySelector("#generate-qr-button")
    ?.addEventListener("click", () => {
      openQrModal({
        title: video.title,
        url: buildPlayerUrl(video.id),
      });
    });

  return article;
}

async function initializeApp() {
  initializeQrModal();

  try {
    statusMessage.textContent = "Cargando información del video...";
    const video = await getVideoMetadata();

    cardContainer.innerHTML = "";
    cardContainer.appendChild(createVideoCard(video));
    statusMessage.textContent = CONFIG.USE_DEMO_DATA
      ? "Modo demostración activo. La información real se conectará posteriormente mediante Google Drive API."
      : "Información obtenida desde Google Drive.";
  } catch (error) {
    console.error(error);
    statusMessage.textContent =
      "No fue posible cargar la información del video.";
    cardContainer.innerHTML = `
      <div class="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-800">
        <p class="font-semibold">Ocurrió un problema</p>
        <p class="mt-2 text-sm">${error.message}</p>
      </div>
    `;
  }
}

initializeApp();
