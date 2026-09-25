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

## Modo demostración

El proyecto se entrega con:

```js
USE_DEMO_DATA: true
```

De esta forma puede probarse sin Google Drive API.

La card utiliza datos simulados y el reproductor usa temporalmente un video público de demostración.

## Ejecutar localmente

Debido a que JavaScript utiliza módulos ES (`type="module"`), se recomienda usar un servidor local en lugar de abrir `index.html` directamente.

### Python

```bash
python3 -m http.server 5500
```

Luego abrir:

```text
http://localhost:5500
```

### VS Code

También puede usarse la extensión Live Server.

## Datos que se configurarán después

Archivo:

```text
js/config.js
```

Campos principales:

```js
DRIVE_FILE_URL: 'https://drive.google.com/file/d/ID_REAL/view?usp=sharing'
GOOGLE_API_KEY: 'API_KEY_REAL'
USE_DEMO_DATA: false
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

## Próximo paso

Configurar Google Cloud Console y Google Drive API para reemplazar los datos de demostración por la información real del archivo.
