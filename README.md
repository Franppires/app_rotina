# App Rotina - Franciane e Oliver

App web simples em HTML/CSS/JS para uso no celular, com foco em rotina diaria.

## Recursos

- Funciona offline (PWA com service worker)
- Checklist com salvamento local
- Historico diario do checklist (por data)
- Modo de edicao direto no app (sem editar codigo)
- Backup e restauracao dos dados em JSON

## Publicacao (GitHub Pages)

O deploy e automatico via GitHub Actions no push da branch `main`.

Depois de habilitar o Pages no repositorio, o app pode ser aberto no celular e instalado na tela inicial.

## Estrutura principal

- `index.html`
- `franciane_oliver_v3.html`
- `styles/main.css`
- `scripts/storage.js`
- `scripts/checklist.js`
- `scripts/ui.js`
- `scripts/pwa.js`
- `scripts/app.js`
- `manifest.webmanifest`
- `service-worker.js`
- `.github/workflows/pages.yml`
