# Drive Video QR

Proyecto universitario elaborado con HTML, CSS, JavaScript y Tailwind CSS.

La aplicación muestra una card con información de un video alojado en Google Drive y permite generar un código QR. Al escanearlo, se abre una página independiente que contiene únicamente el título y el reproductor del video.

## Tecnologías

- HTML5
- CSS3
- JavaScript ES Modules
- Tailwind CSS mediante CDN
- QRCode.js
- Google Drive API v3 (integración preparada, todavía pendiente de configuración)
- GitHub
- Vercel

## Estructura

```text
drive-video-qr/
├── index.html
├── player.html
├── css/
│   └── styles.css
├── js/
│   ├── config.js
│   ├── drive-api.js
│   ├── app.js
│   ├── qr.js
│   └── player.js
├── assets/
│   └── images/
│       └── video-placeholder.svg
├── .gitignore
├── vercel.json
└── README.md
```


## Flujo general

```text
Google Drive
     |
     v
Google Drive API
     |
     +--> nombre
     +--> MIME type
     +--> miniatura
     |
     v
index.html
     |
     +--> card
     +--> generar QR
              |
              v
       player.html?id=...
              |
              v
           video
```
