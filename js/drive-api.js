import { CONFIG } from "./config.js";

/**
 * Extraemos el ID del archivo de Google Drive desde varias formas comunes
 */
export function extractDriveFileId(url) {
  if (!url) return null;

  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /[?&]id=([a-zA-Z0-9_-]+)/,
    /\/d\/([a-zA-Z0-9_-]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }

  return null;
}

/**
 * Extrae la resource key cuando Google Drive la incluye
 * en el enlace compartido.
 */
export function extractDriveResourceKey(url) {
  if (!url) return "";

  try {
    const parsedUrl = new URL(url);
    return parsedUrl.searchParams.get("resourcekey") || "";
  } catch {
    return "";
  }
}

/**
 * Construimos la URL de vista previa de Google Drive.
 * Esta URL será utilizada dentro de un iframe.
 */
export function buildDrivePreviewUrl(fileId, resourceKey = "") {
  const previewUrl = new URL(
    `https://drive.google.com/file/d/${encodeURIComponent(fileId)}/preview`,
  );

  if (resourceKey) {
    previewUrl.searchParams.set("resourcekey", resourceKey);
  }

  return previewUrl.toString();
}

/**
 * Eliminamos la extensión del archivo sin alterar nombres.
 */
export function removeFileExtension(fileName = "") {
  return fileName.replace(/\.[^/.]+$/, "");
}

/**
 * Devolvemos la información necesaria para construir la card.
 */
export async function getVideoMetadata() {
  if (CONFIG.USE_DEMO_DATA) {
    return {
      ...CONFIG.DEMO_FILE,
      title: removeFileExtension(CONFIG.DEMO_FILE.name),
    };
  }

  const fileId = extractDriveFileId(CONFIG.DRIVE_FILE_URL);

  const resourceKeyFromUrl = extractDriveResourceKey(CONFIG.DRIVE_FILE_URL);

  if (!fileId) {
    throw new Error("No se pudo obtener el ID del archivo de Google Drive.");
  }

  if (
    !CONFIG.GOOGLE_API_KEY ||
    CONFIG.GOOGLE_API_KEY === "API_KEY_DE_RELLENO"
  ) {
    throw new Error("La clave de Google Drive API todavía no fue configurada.");
  }

  // Integración preparada para Google Drive API v3.

  const endpoint = new URL(
    `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}`,
  );
  endpoint.searchParams.set("key", CONFIG.GOOGLE_API_KEY);
  endpoint.searchParams.set(
    "fields",
    "id,name,mimeType,thumbnailLink,resourceKey",
  );

  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error(
      `Google Drive API respondió con el estado ${response.status}.`,
    );
  }

  const data = await response.json();

  if (!data.mimeType?.startsWith("video/")) {
    throw new Error("El archivo configurado en Google Drive no es un video.");
  }

  const resourceKey = data.resourceKey || resourceKeyFromUrl || "";

  return {
    id: data.id,
    name: data.name,
    title: removeFileExtension(data.name),
    mimeType: data.mimeType,

    thumbnailUrl:
      improveThumbnailUrl(data.thumbnailLink) ||
      "./assets/images/video-placeholder.svg",

    playbackUrl: buildDrivePreviewUrl(data.id, resourceKey),

    resourceKey,
  };
}

/**
 * Obtiene la URL de reproducción para player.html.
 */
export async function getPlaybackData(requestedId) {
  const metadata = await getVideoMetadata();

  if (!CONFIG.USE_DEMO_DATA && requestedId && metadata.id !== requestedId) {
    throw new Error(
      "El identificador solicitado no coincide con el video configurado.",
    );
  }

  return metadata;
}

function improveThumbnailUrl(url = "") {
  if (!url) return "";

  return url.replace(/=s\d+$/, "=s1200");
}
