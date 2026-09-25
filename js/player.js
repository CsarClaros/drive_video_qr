import { getPlaybackData } from './drive-api.js';

const titleElement =
  document.getElementById('player-title');

const videoElement =
  document.getElementById('video-player');

const stateElement =
  document.getElementById('player-state');


async function initializePlayer() {
  const params =
    new URLSearchParams(window.location.search);

  const requestedId =
    params.get('id');

  try {

    stateElement.textContent =
      'Preparando reproductor...';

    const video =
      await getPlaybackData(requestedId);


    // Título de la pestaña
    document.title =
      `${video.title} | Reproductor`;


    // Título visible
    titleElement.textContent =
      video.title;


    if (!video.playbackUrl) {
      throw new Error(
        'No existe una URL de reproducción disponible.'
      );
    }


    // Cargar Google Drive Preview
    videoElement.title =
      `Reproductor de ${video.title}`;

    videoElement.src =
      video.playbackUrl;


    // Cuando Drive termina de cargar
    videoElement.addEventListener(
      'load',
      () => {

        stateElement.textContent =
          'Listo para reproducir';

      },
      { once: true }
    );

  } catch (error) {

    console.error(error);

    titleElement.textContent =
      'Video no disponible';

    stateElement.textContent =
      error.message;

    videoElement.classList.add('hidden');
  }
}


initializePlayer();