// Portfólio: scroll suave (Lenis) + animações presas ao scroll (GSAP ScrollTrigger)
// + assinatura que se desenha (DrawSVG) + repositórios do GitHub carregados ao vivo.
(function () {
  'use strict';

  var root = document.documentElement;

  // ---------------------------------------------------------------------------
  // Configuração do GitHub
  // ---------------------------------------------------------------------------
  var GH_USUARIO = 'myoshida-dev';
  // Repositórios que não devem aparecer no portfólio (forks também ficam de fora).
  var OCULTAR = ['teste1'];
  var CORES_LINGUAGEM = {
    JavaScript: '#f1e05a', TypeScript: '#3178c6', HTML: '#e34c26', CSS: '#663399',
    Python: '#3572A5', Java: '#b07219', PHP: '#4F5D95', Shell: '#89e051', 'Jupyter Notebook': '#DA5B0B'
  };

  // Chamado quando a lista de projetos muda (a parte animada se registra aqui).
  var aoAtualizarProjetos = function () {};

  // A assinatura do topo é copiada para o contato (um único SVG no HTML).
  var sigTopo = document.querySelector('.hero__assinatura svg');
  var alvoRodape = document.querySelector('[data-assinatura-rodape]');
  if (sigTopo && alvoRodape) {
    var copia = sigTopo.cloneNode(true);
    copia.setAttribute('aria-hidden', 'true');
    copia.removeAttribute('role');
    copia.removeAttribute('aria-label');
    alvoRodape.appendChild(copia);
  }

  carregarGitHub();

  var temBibliotecas = window.gsap && window.ScrollTrigger && window.DrawSVGPlugin && window.Lenis;
  if (!temBibliotecas || !root.classList.contains('anim')) {
    root.classList.remove('anim');
    return;
  }

  iniciarAnimacoes();

  // ===========================================================================
  // ANIMAÇÕES
  // ===========================================================================
  function iniciarAnimacoes() {
    gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

    // --- Scroll suave: o Lenis anda no mesmo relógio do GSAP ---
    var lenis = new Lenis({ lerp: 0.09 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);

    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        var alvo = id.length > 1 && document.querySelector(id);
        if (!alvo) return;
        e.preventDefault();
        lenis.scrollTo(alvo, { duration: 1.6 });
      });
    });

    // --- Tema: o fundo do site muda conforme a seção que está no meio da tela ---
    gsap.utils.toArray('section[data-tema]').forEach(function (secao) {
      ScrollTrigger.create({
        trigger: secao,
        start: 'top 50%',
        end: 'bottom 50%',
        onToggle: function (st) { if (st.isActive) root.dataset.tema = secao.dataset.tema; }
      });
    });

    var mm = gsap.matchMedia();

    // --- HERO: identidade no centro -> zoom na foto 3x4 -> card com a assinatura ---
    var palco = document.querySelector('.hero__palco');
    var rg = document.querySelector('.rg');
    var rgFoto = rg.querySelector('.rg__foto');
    var cardFinal = document.querySelector('.hero__foto');

    // Posição de um elemento dentro do palco pelo layout (offset* ignora os transforms do GSAP)
    var posicaoNoPalco = function (el) {
      var x = 0, y = 0;
      while (el && el !== palco) { x += el.offsetLeft; y += el.offsetTop; el = el.offsetParent; }
      return { x: x, y: y };
    };

    // Quanto e para onde ampliar a carteira para a foto 3x4 virar o card final.
    // A origem do zoom é o centro da foto: ela cresce sem sair do lugar e depois vai ao centro da tela.
    var zoom = function () {
      var foto = posicaoNoPalco(rgFoto), carteira = posicaoNoPalco(rg);
      var cx = foto.x + rgFoto.offsetWidth / 2;
      var cy = foto.y + rgFoto.offsetHeight / 2;
      var escala = cardFinal.offsetHeight / rgFoto.offsetHeight;
      return {
        origem: (cx - carteira.x) + 'px ' + (cy - carteira.y) + 'px',
        x: palco.clientWidth / 2 - cx,
        y: palco.clientHeight / 2 - cy,
        escala: escala,
        raio: (18 / escala) + 'px'   // depois de ampliado, o canto fica igual ao do card (18px)
      };
    };
    var valor = function (chave) { return function () { return zoom()[chave]; }; };

    mm.add('(min-width: 0px)', function () {
      var tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom bottom', scrub: 0.6, invalidateOnRefresh: true }
      });

      tl
        // 1. Zoom: a carteira cresce em direção à foto 3x4
        .fromTo(rg,
          { x: 0, y: 0, scale: 1, transformOrigin: valor('origem') },
          { x: valor('x'), y: valor('y'), scale: valor('escala'), transformOrigin: valor('origem'), duration: 3, ease: 'power2.inOut' }, 0)
        .fromTo(rgFoto, { borderRadius: '4px' }, { borderRadius: valor('raio'), duration: 3, ease: 'power2.inOut' }, 0)
        .fromTo('.hero__sobre, .hero__dica', { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.5 }, 0)
        // A foto perde a cor junto com o zoom, do primeiro movimento até virar o card
        .fromTo(rgFoto.querySelector('img'), { filter: 'grayscale(0) contrast(1)' }, { filter: 'grayscale(1) contrast(1.15)', duration: 2.9 }, 0)
        // 2. O resto da carteira some
        .fromTo('.rg__fundo, .rg__topo, .rg__dados, .rg__assinatura', { autoAlpha: 1 }, { autoAlpha: 0, duration: 1.1 }, 1.7)
        // 3. Troca pelo card final (mesmo tamanho, posição e recorte), que fica nítido
        .fromTo(cardFinal, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, 2.99)
        .fromTo(rg, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.01 }, 3)
        // 4. Faixas ao fundo e a assinatura se desenhando
        .fromTo('.hero__faixas', { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.2 }, 2.6)
        .fromTo('.faixa--1', { xPercent: 0 }, { xPercent: -28, duration: 10 }, 0)
        .fromTo('.faixa--2', { xPercent: -28 }, { xPercent: 0, duration: 10 }, 0)
        .add(desenharAssinatura(sigTopo).duration(5.2), 3.4)
        .fromTo('.hero__legenda', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.7 }, 8.8)
        .to({}, { duration: 0.5 });
    });

    // Entrada da carteira ao carregar a página (não depende do scroll)
    gsap.from('.hero__entrada', { y: 48, autoAlpha: 0, duration: 1.3, ease: 'power3.out', delay: 0.1 });

    // --- Títulos: letras sobem de dentro de uma "janela" ---
    document.querySelectorAll('[data-revelar-letras]').forEach(function (el) {
      var letras = dividirLetras(el);
      gsap.fromTo(letras, { yPercent: 115 }, {
        yPercent: 0, stagger: 0.02, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 92%', end: 'top 58%', scrub: true }
      });
    });

    // --- Sobre: palavras "acendem" conforme o scroll ---
    document.querySelectorAll('[data-revelar-palavras]').forEach(function (el) {
      var palavras = dividirPalavras(el);
      gsap.fromTo(palavras, { opacity: 0.14 }, {
        opacity: 1, stagger: 0.05, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 50%', scrub: true }
      });
    });

    // --- Projetos: trilho horizontal preso na tela ---
    var secH = document.querySelector('.horizontal');
    var trilho = secH && secH.querySelector('.horizontal__trilho');
    if (trilho) {
      var distancia = function () { return Math.max(0, trilho.scrollWidth - window.innerWidth); };
      var ajustarAltura = function () { secH.style.height = (distancia() + window.innerHeight) + 'px'; };
      ajustarAltura();
      ScrollTrigger.addEventListener('refreshInit', ajustarAltura);

      var trilhoTween = gsap.to(trilho, {
        x: function () { return -distancia(); },
        ease: 'none',
        scrollTrigger: { trigger: secH, start: 'top top', end: 'bottom bottom', scrub: 0.8, invalidateOnRefresh: true }
      });

      // Parallax dentro de cada card enquanto ele atravessa a tela
      var parallaxCards = [];
      var montarParallax = function () {
        parallaxCards.forEach(function (t) { t.scrollTrigger && t.scrollTrigger.kill(); t.kill(); });
        parallaxCards = [];
        trilho.querySelectorAll('.cartao__midia img, .cartao__arte').forEach(function (alvo) {
          parallaxCards.push(gsap.fromTo(alvo, { xPercent: -6 }, {
            xPercent: 6, ease: 'none',
            scrollTrigger: {
              trigger: alvo.closest('.cartao'), containerAnimation: trilhoTween,
              start: 'left right', end: 'right left', scrub: true
            }
          }));
        });
      };
      montarParallax();

      aoAtualizarProjetos = function () {
        montarParallax();
        ScrollTrigger.refresh();
      };
    }

    // --- Habilidades: faixas correm em sentidos opostos ---
    document.querySelectorAll('[data-esteira]').forEach(function (linha) {
      var paraEsquerda = Number(linha.dataset.esteira) < 0;
      gsap.fromTo(linha, { xPercent: paraEsquerda ? 0 : -30 }, {
        xPercent: paraEsquerda ? -30 : 0, ease: 'none',
        scrollTrigger: { trigger: '.habilidades', start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
    gsap.utils.toArray('.grupo').forEach(function (grupo, i) {
      gsap.fromTo(grupo, { y: 40, autoAlpha: 0 }, {
        y: 0, autoAlpha: 1, ease: 'power2.out',
        scrollTrigger: { trigger: grupo, start: 'top 95%', end: 'top 72%', scrub: true }
      });
    });

    // --- Experiência: linha que se preenche + itens que deslizam ---
    gsap.fromTo('.linha-tempo__progresso', { scaleY: 0 }, {
      scaleY: 1, ease: 'none',
      scrollTrigger: { trigger: '.linha-tempo', start: 'top 70%', end: 'bottom 60%', scrub: true }
    });
    gsap.utils.toArray('.linha-tempo__item, .formacao__item').forEach(function (item) {
      gsap.fromTo(item, { x: -40, autoAlpha: 0 }, {
        x: 0, autoAlpha: 1, ease: 'power2.out',
        scrollTrigger: { trigger: item, start: 'top 90%', end: 'top 65%', scrub: true }
      });
    });

    // --- Certificados: abertura oval (clip-path) + zoom/parallax da imagem ---
    gsap.utils.toArray('[data-revelar-oval]').forEach(function (janela) {
      gsap.fromTo(janela, { clipPath: 'ellipse(75% 0% at 50% 0%)' }, {
        clipPath: 'ellipse(75% 150% at 50% 0%)', ease: 'none',
        scrollTrigger: { trigger: janela, start: 'top 92%', end: 'bottom 55%', scrub: true }
      });
      gsap.fromTo(janela.querySelector('img'), { scale: 1.3, yPercent: -5 }, {
        scale: 1, yPercent: 5, ease: 'none',
        scrollTrigger: { trigger: janela, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    // --- Contato: a assinatura se desenha de uma vez ao aparecer ---
    var sigRodape = alvoRodape && alvoRodape.querySelector('svg');
    if (sigRodape) {
      var tlRodape = desenharAssinatura(sigRodape).duration(2.8).pause();
      ScrollTrigger.create({
        trigger: sigRodape, start: 'top 88%',
        onEnter: function () { tlRodape.restart(); },
        onLeaveBack: function () { tlRodape.pause(0); }
      });
    }

    // Fontes e imagens mudam medidas: recalcula tudo quando terminarem de carregar
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }

  // Desenha os traços da assinatura em sequência, com velocidade constante de "caneta".
  function desenharAssinatura(svg) {
    var tracos = Array.prototype.slice.call(svg.querySelectorAll('path'));
    var comprimentos = tracos.map(function (p) { return p.getTotalLength(); });
    var total = comprimentos.reduce(function (a, b) { return a + b; }, 0);
    var tl = gsap.timeline({ defaults: { ease: 'none' } });

    gsap.set(tracos, { drawSVG: '0%', opacity: 0 });
    tracos.forEach(function (traco, i) {
      tl.set(traco, { opacity: 1 })
        .to(traco, { drawSVG: '100%', duration: Math.max(comprimentos[i] / total, 0.012) });
      // "levantar a caneta" entre um traço e outro
      if (i < tracos.length - 1) tl.to({}, { duration: 0.03 });
    });
    return tl;
  }

  // ===========================================================================
  // DIVISÃO DE TEXTO
  // ===========================================================================
  function dividirLetras(el) {
    var texto = el.textContent.trim();
    if (!el.hasAttribute('aria-label') && !el.closest('[aria-label]')) el.setAttribute('aria-label', texto);
    el.textContent = '';
    var letras = [];
    texto.split(/\s+/).forEach(function (palavra, i, arr) {
      var caixa = document.createElement('span');
      caixa.className = 'palavra';
      caixa.setAttribute('aria-hidden', 'true');
      Array.from(palavra).forEach(function (ch) {
        var l = document.createElement('span');
        l.className = 'letra';
        l.textContent = ch;
        caixa.appendChild(l);
        letras.push(l);
      });
      el.appendChild(caixa);
      if (i < arr.length - 1) el.appendChild(document.createTextNode(' '));
    });
    return letras;
  }

  // Mantém <em>/<strong> e embrulha cada palavra num <span class="pal">.
  function dividirPalavras(el) {
    var palavras = [];
    (function processar(no) {
      Array.prototype.slice.call(no.childNodes).forEach(function (filho) {
        if (filho.nodeType === 3) {
          var frag = document.createDocumentFragment();
          filho.textContent.split(/(\s+)/).forEach(function (parte) {
            if (!parte) return;
            if (/^\s+$/.test(parte)) { frag.appendChild(document.createTextNode(' ')); return; }
            var s = document.createElement('span');
            s.className = 'pal';
            s.textContent = parte;
            frag.appendChild(s);
            palavras.push(s);
          });
          filho.parentNode.replaceChild(frag, filho);
        } else if (filho.nodeType === 1) {
          processar(filho);
        }
      });
    })(el);
    return palavras;
  }

  // ===========================================================================
  // GITHUB AO VIVO
  // ===========================================================================
  function carregarGitHub() {
    var alvo = document.querySelector('[data-repos]');
    if (!alvo || !window.fetch) return;

    var api = 'https://api.github.com/users/' + GH_USUARIO;
    var pegar = function (url) {
      return fetch(url, { headers: { Accept: 'application/vnd.github+json' } })
        .then(function (r) { if (!r.ok) throw new Error('GitHub respondeu ' + r.status); return r.json(); });
    };

    Promise.all([pegar(api), pegar(api + '/repos?sort=pushed&per_page=100')])
      .then(function (res) {
        var perfil = res[0];
        var repos = res[1]
          .filter(function (r) { return !r.fork && !r.archived && OCULTAR.indexOf(r.name) === -1; })
          .sort(function (a, b) {
            return (b.stargazers_count - a.stargazers_count) || (new Date(b.pushed_at) - new Date(a.pushed_at));
          });

        preencher('[data-gh="nome"]', perfil.name || perfil.login);
        preencher('[data-gh="repos"]', String(perfil.public_repos));

        if (repos.length) {
          alvo.textContent = '';
          repos.forEach(function (r) { alvo.appendChild(cartaoRepo(r)); });
        }
        aoAtualizarProjetos();
      })
      .catch(function (erro) {
        // Sem internet ou limite da API atingido: fica a versão estática do HTML.
        console.info('Projetos do GitHub: usando a versão estática.', erro.message);
      });
  }

  function preencher(seletor, texto) {
    var el = document.querySelector(seletor);
    if (el && texto) el.textContent = texto;
  }

  function cartaoRepo(r) {
    var a = criar('a', 'cartao');
    a.href = r.html_url;
    a.target = '_blank';
    a.rel = 'noopener';

    var midia = criar('div', 'cartao__midia');
    var img = criar('img');
    img.src = 'https://opengraph.githubassets.com/1/' + GH_USUARIO + '/' + encodeURIComponent(r.name);
    img.alt = '';
    img.width = 1200;
    img.height = 600;
    img.loading = 'lazy';
    img.addEventListener('error', function () { midia.remove(); });
    midia.appendChild(img);
    a.appendChild(midia);

    var corpo = criar('div', 'cartao__corpo');
    var meta = criar('p', 'cartao__meta');
    if (r.language) {
      var ling = criar('span', 'ling', r.language);
      ling.style.setProperty('--cor', CORES_LINGUAGEM[r.language] || 'var(--sage)');
      meta.appendChild(ling);
    }
    meta.appendChild(criar('span', '', 'Atualizado ' + dataCurta(r.pushed_at)));
    if (r.stargazers_count) meta.appendChild(criar('span', '', '★ ' + r.stargazers_count));
    corpo.appendChild(meta);
    corpo.appendChild(criar('h3', 'cartao__titulo', r.name));
    if (r.description) corpo.appendChild(criar('p', 'cartao__desc', r.description));
    if (r.topics && r.topics.length) {
      var ul = criar('ul', 'cartao__topicos');
      r.topics.slice(0, 4).forEach(function (t) { ul.appendChild(criar('li', '', t)); });
      corpo.appendChild(ul);
    }
    corpo.appendChild(criar('span', 'cartao__link', 'Ver repositório ↗'));
    a.appendChild(corpo);
    return a;
  }

  function criar(tag, classe, texto) {
    var el = document.createElement(tag);
    if (classe) el.className = classe;
    if (texto) el.textContent = texto;
    return el;
  }

  function dataCurta(iso) {
    try {
      return new Intl.DateTimeFormat('pt-BR', { month: 'short', year: 'numeric' }).format(new Date(iso));
    } catch (e) {
      return iso.slice(0, 10);
    }
  }
})();
