/* Projeto TRT na Escola — interações do site */
(() => {
  'use strict';

  document.documentElement.classList.add('js');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Menu mobile ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('menu');

  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    nav.classList.toggle('is-open', open);
  };

  if (toggle && nav) {
    toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setMenu(false);
        toggle.focus();
      }
    });
  }

  /* ---------- Cabeçalho e botão "voltar ao topo" ---------- */
  const header = document.querySelector('.site-header');
  const toTop = document.querySelector('.to-top');

  const onScroll = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', y > 8);
    if (toTop) toTop.classList.toggle('is-visible', y > 600);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- Sumário lateral: destaca a seção visível ---------- */
  const tocLinks = [...document.querySelectorAll('.toc a[href^="#"]')];
  if (tocLinks.length && 'IntersectionObserver' in window) {
    const byId = new Map(tocLinks.map((a) => [a.getAttribute('href').slice(1), a]));
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        tocLinks.forEach((l) => l.classList.remove('is-active'));
        const link = byId.get(entry.target.id);
        if (!link) return;
        link.classList.add('is-active');
        // No celular o sumário é uma faixa horizontal: mantém o item ativo à vista
        if (window.innerWidth < 1024) {
          link.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'auto' });
        }
      });
    }, { rootMargin: '-25% 0px -65% 0px' });
    byId.forEach((_, id) => {
      const el = document.getElementById(id);
      if (el) spy.observe(el);
    });
  }

  /* ---------- Animações de entrada ---------- */
  const reveals = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach((el) => io.observe(el));
  }

  /* ---------- Ano no rodapé ---------- */
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Quiz ---------- */
  const QUESTIONS = [
    {
      q: 'Uma piada racista deixa de ser racismo se a pessoa disser que “era brincadeira”?',
      options: ['Sim, se foi só uma brincadeira', 'Não, continua sendo racismo'],
      answer: 1,
      explain: 'Isso é racismo recreativo. A Lei nº 7.716/1989, com alterações da Lei nº 14.532/2023, prevê consequências inclusive quando o crime é praticado em contexto recreativo.'
    },
    {
      q: 'A noção de raça é:',
      options: ['Uma característica biológica', 'Uma construção social e histórica', 'A mesma coisa que etnia'],
      answer: 1,
      explain: 'Raça descreve a forma como a sociedade classifica e hierarquiza pessoas por traços físicos. É uma construção social e histórica, não biológica.'
    },
    {
      q: 'Qual é a idade mínima para trabalhar no Brasil, fora da aprendizagem profissional?',
      options: ['14 anos', '16 anos', '18 anos'],
      answer: 1,
      explain: 'A regra geral é trabalho a partir dos 16 anos. Como aprendiz, o adolescente pode começar aos 14, conforme a legislação.'
    },
    {
      q: 'Para existir trabalho análogo à escravidão, é preciso haver correntes?',
      options: ['Sim', 'Não'],
      answer: 1,
      explain: 'Condições degradantes, jornada exaustiva, trabalho forçado ou servidão por dívida podem caracterizá-lo (art. 149 do Código Penal).'
    },
    {
      q: 'Preconceito, discriminação e racismo são a mesma coisa?',
      options: [
        'Sim, são sinônimos',
        'Não: preconceito é ideia ou atitude, discriminação é prática e racismo é também um sistema',
        'Não, e só o preconceito é grave'
      ],
      answer: 1,
      explain: 'Preconceito é uma ideia ou atitude; discriminação é uma prática de tratamento desigual; racismo é também um sistema que produz e mantém desigualdades.'
    },
    {
      q: 'O assédio moral só acontece de um chefe para um subordinado?',
      options: ['Sim', 'Não'],
      answer: 1,
      explain: 'Também pode ocorrer entre colegas do mesmo nível ou de subordinados para um superior. O que importa são as características da conduta.'
    }
  ];

  const quiz = document.getElementById('quiz');
  if (quiz) {
    const result = document.getElementById('quiz-result');
    const scoreEl = document.getElementById('quiz-score');
    const msgEl = document.getElementById('quiz-message');
    const resetBtn = document.getElementById('quiz-reset');
    const letters = 'ABCDE';
    let answered = 0;
    let correct = 0;

    const render = () => {
      answered = 0;
      correct = 0;
      result.hidden = true;
      quiz.innerHTML = '';

      QUESTIONS.forEach((item, qi) => {
        const card = document.createElement('div');
        card.className = 'quiz-item';
        const qid = `quiz-q${qi + 1}`;
        card.innerHTML = `
          <p class="quiz-step">Pergunta ${qi + 1} de ${QUESTIONS.length}</p>
          <h3 id="${qid}">${item.q}</h3>
          <div class="quiz-options${item.options.length === 2 ? ' is-binary' : ''}" role="group" aria-labelledby="${qid}"></div>
          <p class="quiz-feedback" aria-live="polite"></p>`;
        const group = card.querySelector('.quiz-options');
        const feedback = card.querySelector('.quiz-feedback');

        item.options.forEach((label, oi) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'quiz-option';
          btn.innerHTML = `<span class="mark" aria-hidden="true">${letters[oi]}</span><span>${label}</span>`;
          btn.addEventListener('click', () => {
            const buttons = group.querySelectorAll('button');
            const ok = oi === item.answer;
            buttons.forEach((b) => { b.disabled = true; });
            buttons[item.answer].classList.add('is-correct');
            if (!ok) btn.classList.add('is-wrong');
            feedback.innerHTML = `<strong>${ok ? 'Correto!' : 'Não é bem assim.'}</strong> ${item.explain}`;
            answered += 1;
            if (ok) correct += 1;
            if (answered === QUESTIONS.length) showResult();
          });
          group.appendChild(btn);
        });

        quiz.appendChild(card);
      });
    };

    const showResult = () => {
      scoreEl.textContent = `Você acertou ${correct} de ${QUESTIONS.length}.`;
      msgEl.textContent = correct === QUESTIONS.length
        ? 'Excelente! Agora compartilhe esse conhecimento com colegas e familiares.'
        : 'Bom começo! Revise os temas da cartilha e tente de novo.';
      result.hidden = false;
      result.scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' });
    };

    resetBtn.addEventListener('click', () => {
      render();
      quiz.scrollIntoView({ block: 'start', behavior: reduceMotion ? 'auto' : 'smooth' });
    });

    render();
  }
})();
