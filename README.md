# Portfólio — Matheus Yoshida Dias

Site pessoal de página única (TI & Automação), com efeitos presos ao scroll: a foto do topo encolhe até virar um card enquanto a assinatura se desenha, o fundo alterna entre escuro e claro por seção e os projetos correm na horizontal.

Feito em HTML, CSS e JavaScript puros, sem etapa de build. As bibliotecas vêm por CDN:

- [GSAP](https://gsap.com) 3.13 com ScrollTrigger e DrawSVG — animações ligadas ao scroll e desenho da assinatura
- [Lenis](https://lenis.darkroom.engineering) 1.1 — scroll suave

Os repositórios públicos de [github.com/myoshida-dev](https://github.com/myoshida-dev) são carregados ao vivo pela API do GitHub. Se a API não responder, fica a versão estática escrita no HTML.

Quem usa "reduzir movimento" no sistema (ou se as bibliotecas não carregarem) vê a página parada, com todo o conteúdo visível.

## Ver localmente

Abra o `index.html` no navegador.

## Estrutura

```
index.html      conteúdo do site (a assinatura fica em SVG inline no topo)
css/style.css   estilos (tokens de cor em OKLCH)
js/main.js      scroll suave, animações, assinatura e projetos do GitHub
assets/         foto, assinatura (PNG original + SVG), certificados (PDF) e prévias
```

## Ajustes comuns

- **Esconder um repositório:** adicione o nome à lista `OCULTAR` no início de `js/main.js`.
- **Ordem do desenho da assinatura:** é a ordem dos `<path>` dentro do SVG do topo em `index.html`.
