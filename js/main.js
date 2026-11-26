// Portfólio: scroll suave (Lenis) + animações presas ao scroll (GSAP ScrollTrigger)
// + assinatura que se desenha (DrawSVG) + repositórios do GitHub carregados ao vivo.
(function () {
  'use strict';

  var root = document.documentElement;

  // ---------------------------------------------------------------------------
  // Configuração do GitHub
  // ---------------------------------------------------------------------------
  // Os projetos exibidos são os cards do HTML. Só os que têm data-repo="nome-do-repositório"
  // recebem dados do GitHub (linguagem e data de atualização); nenhum outro repositório é listado.
  var GH_USUARIO = 'myoshida-dev';
  var CORES_LINGUAGEM = {
    JavaScript: '#f1e05a', TypeScript: '#3178c6', HTML: '#e34c26', CSS: '#663399',
    Python: '#3572A5', Java: '#b07219', PHP: '#4F5D95', Shell: '#89e051', 'Jupyter Notebook': '#DA5B0B'
  };

  // ---------------------------------------------------------------------------
  // Prints de cada projeto (abertos ao clicar no card com data-galeria="chave").
  // Cada item: [arquivo, legenda]. As miniaturas ficam em <pasta>/mini/ com o mesmo nome.
  // ---------------------------------------------------------------------------
  var GALERIAS = {
    kobo: {
      titulo: 'Kōbo — loja de streetwear',
      pasta: 'assets/projetos/kobo/',
      itens: [
        ['01-inicio.jpg', 'Página inicial com o drop da coleção'],
        ['02-mais-vendidos.jpg', 'Mais vendidos, com preço, parcelamento e botão de adicionar'],
        ['03-sacola.jpg', 'Sacola lateral com os itens, quantidades e total'],
        ['04-sobre.jpg', 'Sobre a marca e chamada para a lista de e-mails'],
        ['05-newsletter.jpg', 'Newsletter e rodapé'],
        ['06-celular-inicio.jpg', 'Versão para celular'],
        ['07-celular-menu.jpg', 'Menu no celular']
      ]
    },
    drunkrats: {
      titulo: 'DrunkRats — o Strava do rolê',
      pasta: 'assets/projetos/drunkrats/',
      nota: 'Prints com dados de exemplo e nomes fictícios.',
      itens: [
        ['01-entrar.jpg', 'Entrada: cada um escolhe o próprio perfil'],
        ['02-inicio.jpg', 'Início: os lançamentos da noite e quem está liderando'],
        ['03-ranking.jpg', 'Ranking da noite, mentira da noite e prêmios'],
        ['04-desafios.jpg', 'Desafios da noite, cada um com sua pontuação'],
        ['05-conversa.jpg', 'Conversa fiada com reações em emoji'],
        ['06-lancar.jpg', 'Lançar: foto, frase e o que rolou'],
        ['07-membros.jpg', 'Membros e backup dos dados no aparelho']
      ]
    },
    volthub: {
      titulo: 'VoltHub — intranet corporativa',
      pasta: 'assets/projetos/volthub/',
      nota: 'Empresa, pessoas e dados fictícios.',
      itens: [
        ['01-login.jpg', 'Login'],
        ['02-meu-dia.jpg', 'Meu dia: pendências, agenda, metas e aniversariantes'],
        ['03-comunicados.jpg', 'Comunicados'],
        ['04-comunicado-detalhe.jpg', 'Comunicado com confirmação de leitura'],
        ['05-nova-solicitacao.jpg', 'Nova solicitação'],
        ['06-chamado-conversa.jpg', 'Chamados de TI'],
        ['07-reservas-calendario.jpg', 'Reservas de sala no calendário'],
        ['08-pessoas.jpg', 'Pessoas: diretório da empresa'],
        ['09-documentos.jpg', 'Documentos'],
        ['10-meu-perfil.jpg', 'Meu perfil'],
        ['11-aprovacoes-gestor.jpg', 'Aprovações do gestor'],
        ['12-decisao-ferias.jpg', 'Decisão sobre um pedido de férias'],
        ['13-fila-ti.jpg', 'Fila de atendimento da TI'],
        ['14-gestao-rh.jpg', 'Gestão de RH'],
        ['15-admin.jpg', 'Administração'],
        ['16-admin-metas-ramais.jpg', 'Administração: metas e ramais'],
        ['17-celular-meu-dia.jpg', 'Celular: Meu dia'],
        ['18-celular-menu.jpg', 'Celular: menu'],
        ['19-celular-login.jpg', 'Celular: login']
      ]
    }
  };

  // Instância do scroll suave (fica nula sem animações); a galeria pausa o Lenis enquanto está aberta.
  var lenisAtual = null;

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
  iniciarGaleria();

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
    lenisAtual = lenis;
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

      // Parallax do print dentro de cada card enquanto ele atravessa a tela
      trilho.querySelectorAll('[data-parallax]').forEach(function (img) {
        gsap.fromTo(img, { xPercent: -5 }, {
          xPercent: 5, ease: 'none',
          scrollTrigger: {
            trigger: img.closest('.projeto'), containerAnimation: trilhoTween,
            start: 'left right', end: 'right left', scrub: true
          }
        });
      });
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
  // Atualiza o perfil e, nos cards com data-repo, a linguagem e a data do último push.
  // Se a API não responder, ficam os valores escritos no HTML.
  function carregarGitHub() {
    var cards = document.querySelectorAll('[data-repo]');
    if (!window.fetch) return;

    var api = 'https://api.github.com/users/' + GH_USUARIO;
    var pegar = function (url) {
      return fetch(url, { headers: { Accept: 'application/vnd.github+json' } })
        .then(function (r) { if (!r.ok) throw new Error('GitHub respondeu ' + r.status); return r.json(); });
    };

    Promise.all([pegar(api), pegar(api + '/repos?per_page=100')])
      .then(function (res) {
        var perfil = res[0];
        var porNome = {};
        res[1].forEach(function (r) { porNome[r.name] = r; });

        preencher('[data-gh="nome"]', perfil.name || perfil.login);
        preencher('[data-gh="repos"]', String(perfil.public_repos));

        Array.prototype.forEach.call(cards, function (card) {
          var repo = porNome[card.dataset.repo];
          if (!repo) return;
          var ling = card.querySelector('[data-gh-ling]');
          if (ling && repo.language) {
            ling.textContent = repo.language;
            ling.style.setProperty('--cor', CORES_LINGUAGEM[repo.language] || 'var(--sage)');
          }
          var data = card.querySelector('[data-gh-atualizado]');
          if (data) data.textContent = 'Atualizado ' + dataCurta(repo.pushed_at);
        });
      })
      .catch(function (erro) {
        console.info('GitHub indisponível: mantendo os dados do HTML.', erro.message);
      });
  }

  // ===========================================================================
  // GALERIA DE PRINTS
  // ===========================================================================
  function iniciarGaleria() {
    var dialogo = document.querySelector('.galeria');
    if (!dialogo || typeof dialogo.showModal !== 'function') return;

    var el = function (sel) { return dialogo.querySelector(sel); };
    var tela = el('[data-galeria-tela]'), img = el('[data-galeria-img]');
    var miniaturas = el('[data-galeria-miniaturas]');
    var ant = el('[data-galeria-ant]'), prox = el('[data-galeria-prox]');
    var atual = null, indice = 0;

    // Quantidade de prints no selo de cada card
    document.querySelectorAll('.projeto[data-galeria]').forEach(function (card) {
      var g = GALERIAS[card.dataset.galeria];
      var qtd = card.querySelector('[data-qtd-prints]');
      if (!g) { card.removeAttribute('data-galeria'); return; }
      if (qtd) qtd.textContent = '(' + g.itens.length + ')';

      // Clicar em qualquer parte do card abre a galeria (menos nos links "Ver site"/"Código")
      card.addEventListener('click', function (e) {
        if (e.target.closest('a')) return;
        abrir(card.dataset.galeria);
      });
    });

    function abrir(chave) {
      atual = GALERIAS[chave];
      el('[data-galeria-titulo]').textContent = atual.titulo;
      el('[data-galeria-nota]').textContent = atual.nota || '';

      miniaturas.textContent = '';
      atual.itens.forEach(function (item, i) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'galeria__mini';
        b.setAttribute('aria-label', (i + 1) + '. ' + item[1]);
        var m = document.createElement('img');
        m.src = atual.pasta + 'mini/' + item[0];
        m.alt = '';
        m.loading = 'lazy';
        b.appendChild(m);
        b.addEventListener('click', function () { mostrar(i); });
        miniaturas.appendChild(b);
      });

      root.classList.add('galeria-aberta');
      if (lenisAtual) lenisAtual.stop();
      dialogo.showModal();
      mostrar(0);
    }

    function mostrar(i) {
      indice = Math.max(0, Math.min(atual.itens.length - 1, i));
      var item = atual.itens[indice];
      tela.classList.add('is-carregando');
      img.src = atual.pasta + item[0];
      img.alt = item[1];
      tela.scrollTop = 0;
      el('[data-galeria-legenda]').textContent = item[1];
      el('[data-galeria-contador]').textContent = (indice + 1) + ' / ' + atual.itens.length;
      ant.disabled = indice === 0;
      prox.disabled = indice === atual.itens.length - 1;
      Array.prototype.forEach.call(miniaturas.children, function (b, j) {
        if (j === indice) {
          b.setAttribute('aria-current', 'true');
          b.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
        } else {
          b.removeAttribute('aria-current');
        }
      });
      // Já carrega o próximo para a troca ficar instantânea
      if (atual.itens[indice + 1]) new Image().src = atual.pasta + atual.itens[indice + 1][0];
    }

    // Print em pé (celular) ou muito alto: decide se cabe inteiro ou se rola na vertical
    img.addEventListener('load', function () {
      var proporcao = img.naturalHeight / img.naturalWidth;
      var celular = proporcao > 1.3;
      tela.classList.toggle('is-celular', celular);
      tela.classList.toggle('is-rolar', celular ? proporcao > 2.4 : proporcao > 0.8);
      tela.classList.remove('is-carregando');
    });

    // Fecha e já devolve o scroll da página (não depende do evento "close",
    // que alguns navegadores atrasam ou não disparam)
    function fechar() {
      if (dialogo.open) dialogo.close();
      liberarPagina();
    }
    function liberarPagina() {
      root.classList.remove('galeria-aberta');
      if (lenisAtual) lenisAtual.start();
      img.removeAttribute('src');
    }

    ant.addEventListener('click', function () { mostrar(indice - 1); });
    prox.addEventListener('click', function () { mostrar(indice + 1); });
    el('[data-galeria-fechar]').addEventListener('click', fechar);

    dialogo.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); mostrar(indice - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); mostrar(indice + 1); }
      if (e.key === 'Escape') { e.preventDefault(); fechar(); }
    });

    // Clique fora do conteúdo (no fundo escurecido) fecha
    dialogo.addEventListener('click', function (e) { if (e.target === dialogo) fechar(); });

    // Arrastar para o lado no celular troca o print
    var inicioX = null;
    tela.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') inicioX = e.clientX; });
    tela.addEventListener('pointerup', function (e) {
      if (inicioX === null) return;
      var dx = e.clientX - inicioX;
      inicioX = null;
      if (Math.abs(dx) > 50) mostrar(indice + (dx < 0 ? 1 : -1));
    });

    dialogo.addEventListener('close', liberarPagina);
  }

  function preencher(seletor, texto) {
    var el = document.querySelector(seletor);
    if (el && texto) el.textContent = texto;
  }

  function dataCurta(iso) {
    try {
      return new Intl.DateTimeFormat('pt-BR', { month: 'short', year: 'numeric' }).format(new Date(iso));
    } catch (e) {
      return iso.slice(0, 10);
    }
  }
})();
