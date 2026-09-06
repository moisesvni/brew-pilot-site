# Brew Pilot Marketing Site

Marketing site do Brew Pilot em Vue 3, TypeScript e Vite SSG. As páginas públicas são pré-renderizadas para que conteúdo, H1 e metadata estejam no HTML inicial.

## Desenvolvimento

```bash
npm install
cp .env.example .env.local
npm run dev
```

`VITE_BREW_PILOT_APP_URL` aponta para o aplicativo. Login, cadastro, planos e documentos legais são resolvidos pelo `BrewPilotAppConnector`. O site não mantém preços nem checkout locais.

## Build

```bash
npm run build
npm run preview
```

O build gera 30 páginas localizadas em `dist`, além de `sitemap.xml`, `robots.txt` e uma página 404. Comparativos específicos são pré-renderizados como rascunhos `noindex`, fora do sitemap.

## Rotas

Português usa a raiz, inglês usa `/en/` e espanhol usa `/es/`. Cada seletor de idioma preserva a página atual.
