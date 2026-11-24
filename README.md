# Matheus Yoshida Dias — Portfólio

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-663399?logo=css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![GSAP](https://img.shields.io/badge/GSAP-0AE448?logo=greensock&logoColor=black)

> **Resumo:** portfólio pessoal de página única de um estudante de Sistemas para Internet (SENAC), desenvolvedor freelancer e entusiasta de automações com IA, em São Paulo/SP. O site começa com uma carteira de identidade em preto e branco; ao rolar, a página dá zoom na foto 3x4 até ela virar um card onde a assinatura se desenha sozinha. Os projetos vêm ao vivo do GitHub.

---

## O que acontece ao rolar

| Seção | Efeito |
|---|---|
| **Início** | Fundo preto com uma carteira de identidade ilustrativa. A rolagem amplia a foto 3x4, que perde a cor até virar um card; então a assinatura se desenha traço por traço, com faixas de texto correndo ao fundo. |
| **Sobre** | A frase de apresentação "acende" palavra por palavra e o fundo do site passa de escuro para claro. |
| **Projetos** | A página trava e os cards andam na horizontal: loja Kōbo, app DrunkRats e intranet VoltHub, cada um com o print do projeto. Linguagem e data de atualização vêm dos repositórios no GitHub. |
| **Habilidades** | Duas faixas de tecnologias correm em sentidos opostos. |
| **Experiência** | A linha do tempo se preenche conforme a leitura. |
| **Certificados** | As imagens se abrem em formato oval, com zoom suave. |
| **Contato** | A assinatura se desenha de novo ao chegar no fim da página. |

Quem ativa "reduzir movimento" no sistema (ou se as bibliotecas não carregarem) vê a página parada, com todo o conteúdo visível e a assinatura já desenhada.

## Tecnologias

| Ferramenta | Uso |
|---|---|
| HTML, CSS e JavaScript puros | Estrutura, layout (cores em OKLCH) e lógica. Sem etapa de build. |
| [GSAP 3.13](https://gsap.com) + ScrollTrigger | Animações presas à posição do scroll. |
| DrawSVG (plugin do GSAP) | Desenho da assinatura a partir de traços SVG. |
| [Lenis 1.1](https://lenis.darkroom.engineering) | Scroll suave. |
| API do GitHub | Dados do perfil e, nos projetos ligados a um repositório, linguagem e data de atualização. |

As bibliotecas são carregadas por CDN (jsDelivr) e são gratuitas.

## Como ver localmente

Basta abrir o `index.html` no navegador. Para testar como num servidor, qualquer servidor estático serve (por exemplo, a extensão Live Server do VS Code).

## Estrutura

```
index.html      conteúdo do site (a assinatura fica em SVG inline no topo)
css/style.css   estilos e a carteira de identidade
js/main.js      scroll suave, animações, assinatura e projetos do GitHub
assets/         foto, assinatura (PNG original + SVG), prints dos projetos e certificados
```

## Personalização

- **Projetos exibidos:** são os cards `.projeto` em `index.html` (prints em `assets/projetos/`). Para ligar um card a um repositório, use `data-repo="nome-do-repositório"`; nenhum outro repositório é puxado.
- **Ordem do desenho da assinatura:** é a ordem dos `<path>` dentro do SVG do topo em `index.html`.
- **Trocar a foto:** substitua `assets/matheus.jpeg` (de preferência na vertical). A carteira e o card usam o mesmo recorte.
- **Cores:** os tokens ficam no início de `css/style.css` (`--lima` é a cor da assinatura).

## Publicar

Como é um site estático, pode ir direto para o GitHub Pages: em **Settings → Pages**, escolha a branch `main` e a pasta raiz.

## Observação

A carteira de identidade do topo é **ilustrativa**: os campos são de exemplo, não há dados pessoais e o cabeçalho traz "sem valor legal" no lugar dos símbolos oficiais.

## Contato

- E-mail: [matheusyoshida10@gmail.com](mailto:matheusyoshida10@gmail.com)
- GitHub: [github.com/myoshida-dev](https://github.com/myoshida-dev)
