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
        // No celular o sumário é uma faixa horizontal: rola só a faixa (scrollIntoView
        // também rolaria a página inteira de volta para o sumário)
        const strip = link.closest('ol');
        if (window.innerWidth < 1024 && strip) {
          strip.scrollLeft = link.offsetLeft - (strip.clientWidth - link.offsetWidth) / 2;
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
  // Quiz elaborado pelo Prof. Carlos Pimentel, com a fundamentação de cada resposta
  const QUESTIONS = [
    {
      tema: "Racismo",
      q: "Segundo a Constituição Federal, a prática do racismo é classificada como:",
      options: [
        "Contravenção penal e prescritível.",
        "Crime afiançável e prescritível.",
        "Crime inafiançável e imprescritível.",
        "Infração exclusivamente administrativa.",
        "Ato sem previsão constitucional."
      ],
      answer: 2,
      explain: "A Constituição Federal, art. 5º, XLII, estabelece que a prática do racismo constitui crime inafiançável e imprescritível, sujeito à pena de reclusão."
    },
    {
      tema: "Racismo",
      q: "Uma empresa recusa a contratação de uma pessoa exclusivamente por causa de sua cor. Essa conduta:",
      options: [
        "É permitida pela liberdade empresarial.",
        "Pode configurar discriminação racial e gerar responsabilização jurídica.",
        "Só é ilegal se houver violência física.",
        "É apenas uma questão ética, sem consequência jurídica.",
        "É válida se a empresa alegar preferência pessoal."
      ],
      answer: 1,
      explain: "A Constituição Federal proíbe discriminação e, no art. 7º, XXX, veda diferença de critérios de admissão por motivo de cor. A Lei nº 7.716/1989 também prevê crimes de discriminação racial em relações de trabalho."
    },
    {
      tema: "Racismo",
      q: "A Constituição Federal estabelece como objetivo fundamental da República:",
      options: [
        "Promover privilégios por origem social.",
        "Promover o bem de todos, sem preconceitos e formas de discriminação.",
        "Permitir discriminação quando praticada por particulares.",
        "Restringir direitos conforme raça.",
        "Priorizar apenas a igualdade econômica."
      ],
      answer: 1,
      explain: "O art. 3º, IV, da Constituição determina que o Estado deve promover o bem de todos, sem preconceitos de origem, raça, sexo, cor, idade e outras formas de discriminação."
    },
    {
      tema: "Racismo",
      q: "Negar atendimento em estabelecimento comercial a uma pessoa por motivo racial pode:",
      options: [
        "Ser sempre lícito.",
        "Ser apenas uma falta contratual.",
        "Configurar crime previsto na legislação antirracista.",
        "Ser crime somente se houver agressão física.",
        "Não produzir nenhuma consequência jurídica."
      ],
      answer: 2,
      explain: "A Lei nº 7.716/1989 tipifica diversas condutas discriminatórias, inclusive relacionadas ao acesso e atendimento em estabelecimentos comerciais."
    },
    {
      tema: "Injúria racial",
      q: "De acordo com o art. 2º-A da Lei nº 7.716/1989, a injúria racial ocorre quando alguém:",
      options: [
        "Ofende a dignidade ou o decoro de alguém em razão de raça, cor, etnia ou procedência nacional.",
        "Critica uma política pública.",
        "Discorda de uma opinião política.",
        "Recusa uma proposta comercial.",
        "Faz qualquer comentário desagradável, independentemente do motivo."
      ],
      answer: 0,
      explain: "O art. 2º-A descreve a conduta de injuriar alguém, ofendendo-lhe a dignidade ou o decoro, em razão de raça, cor, etnia ou procedência nacional."
    },
    {
      tema: "Injúria racial",
      q: "A Lei nº 14.532/2023 foi importante porque:",
      options: [
        "Revogou a legislação contra o racismo.",
        "Retirou a injúria racial do sistema penal.",
        "Alterou a Lei nº 7.716/1989 para tratar expressamente da injúria racial.",
        "Criou apenas normas trabalhistas.",
        "Eliminou a proteção penal contra discriminação racial."
      ],
      answer: 2,
      explain: "A Lei nº 14.532/2023 promoveu mudanças relevantes na Lei nº 7.716/1989, incluindo a previsão expressa da injúria racial em seu art. 2º-A."
    },
    {
      tema: "Injúria racial",
      q: "Qual é a principal diferença, em termos didáticos, entre injúria racial e racismo?",
      options: [
        "Injúria racial nunca envolve raça.",
        "Injúria racial está relacionada à ofensa dirigida à dignidade ou ao decoro de alguém por motivo racial; o racismo abrange condutas discriminatórias previstas na legislação.",
        "Racismo é sempre apenas uma ofensa verbal.",
        "Os dois conceitos são juridicamente idênticos em todos os casos.",
        "Nenhum dos dois possui previsão legal."
      ],
      answer: 1,
      explain: "O art. 2º-A da Lei nº 7.716/1989 trata da injúria racial, enquanto a própria Lei nº 7.716/1989 prevê diversas condutas discriminatórias. A classificação depende dos fatos concretos."
    },
    {
      tema: "LGBTfobia",
      q: "A LGBTfobia pode atingir uma pessoa por motivo relacionado:",
      options: [
        "Somente à profissão.",
        "Somente à idade.",
        "À orientação sexual ou à identidade de gênero.",
        "Somente ao patrimônio.",
        "Apenas à nacionalidade."
      ],
      answer: 2,
      explain: "A LGBTfobia compreende práticas discriminatórias relacionadas à orientação sexual e à identidade de gênero, conforme a compreensão constitucional e jurisprudencial consolidada pelo STF."
    },
    {
      tema: "LGBTfobia",
      q: "Recusar atendimento a uma pessoa exclusivamente por ela ser LGBT pode:",
      options: [
        "Ser sempre permitido.",
        "Configurar discriminação e, conforme o caso, receber enquadramento penal reconhecido pelo STF.",
        "Ser apenas uma opinião.",
        "Ser irrelevante juridicamente.",
        "Ser permitido se o estabelecimento for privado."
      ],
      answer: 1,
      explain: "A proteção contra discriminação não se limita ao espaço público. O STF reconheceu a incidência da proteção penal antirracista sobre condutas homofóbicas e transfóbicas nos termos de sua decisão."
    },
    {
      tema: "LGBTfobia",
      q: "A liberdade de expressão, no ordenamento brasileiro:",
      options: [
        "É absoluta e autoriza qualquer discurso discriminatório.",
        "Não possui qualquer proteção constitucional.",
        "É protegida constitucionalmente, mas deve conviver com outros direitos fundamentais e não constitui autorização para práticas ilícitas.",
        "Só existe na internet.",
        "Só protege agentes públicos."
      ],
      answer: 2,
      explain: "O art. 5º, IX, protege a liberdade de expressão, mas os direitos fundamentais devem ser harmonizados. O art. 5º, XLI, determina punição para discriminações atentatórias a direitos e liberdades fundamentais."
    },
    {
      tema: "LGBTfobia",
      q: "Segundo a decisão do STF sobre homofobia e transfobia, é correto afirmar que:",
      options: [
        "O STF criou uma nova lei penal por decreto.",
        "O STF declarou que nenhuma proteção jurídica existe.",
        "O STF reconheceu a aplicação da legislação antirracista às condutas homofóbicas e transfóbicas, até que haja legislação específica nos termos da decisão.",
        "O STF retirou a proteção constitucional à igualdade.",
        "A decisão trata exclusivamente de relações trabalhistas."
      ],
      answer: 2,
      explain: "A decisão da ADO 26 e do MI 4.733 reconheceu a proteção penal contra homofobia e transfobia mediante enquadramento na Lei nº 7.716/1989, conforme os limites estabelecidos pelo STF."
    },
    {
      tema: "LGBTfobia",
      q: "Um homem e seu filho adolescente caminham de mãos dadas pela rua. Um grupo de jovens, acreditando que os dois são um casal homoafetivo, passa a insultá-los, ameaçá-los e agredi-los por supostamente serem gays. Considerando a legislação brasileira e o entendimento do STF, essa conduta pode ser considerada LGBTfobia?",
      options: [
        "Não. Como as vítimas não são um casal LGBT, não existe LGBTfobia.",
        "Não. A LGBTfobia somente existe quando a vítima declara formalmente sua orientação sexual.",
        "Sim. A conduta pode caracterizar homofobia/LGBTfobia, pois o STF reconheceu a proteção penal também para condutas homofóbicas ou transfóbicas dirigidas contra pessoas reais ou supostas.",
        "Não. A conduta somente seria crime se houvesse agressão física, não bastando os insultos e ameaças.",
        "Não. A liberdade de expressão permite que qualquer pessoa manifeste sua opinião sobre a orientação sexual de terceiros, mesmo com insultos."
      ],
      answer: 2,
      explain: "O fato de as vítimas não serem efetivamente um casal LGBT não afasta, por si só, a possibilidade de caracterização da LGBTfobia. O STF, no julgamento da ADO 26 e do MI 4.733, estabeleceu que as condutas homofóbicas e transfóbicas “reais ou supostas”, quando envolvem aversão odiosa à orientação sexual ou à identidade de gênero, enquadram-se, nos termos da decisão, nos tipos penais da Lei nº 7.716/1989, enquanto não houver legislação autônoma específica."
    },
    {
      tema: "Assédio moral",
      q: "O assédio moral no trabalho pode ser caracterizado por:",
      options: [
        "Uma única divergência profissional necessariamente.",
        "Condutas abusivas que atentem contra a dignidade do trabalhador, especialmente quando reiteradas e capazes de causar humilhação ou constrangimento.",
        "Qualquer cobrança de produtividade.",
        "Toda crítica feita pelo superior.",
        "Somente agressão física."
      ],
      answer: 1,
      explain: "O assédio moral é compreendido juridicamente a partir de condutas abusivas que violam a dignidade e podem gerar danos. A caracterização depende da análise do caso concreto."
    },
    {
      tema: "Assédio moral",
      q: "Qual situação pode ser exemplo de assédio moral?",
      options: [
        "Feedback profissional respeitoso.",
        "Distribuição regular de tarefas.",
        "Humilhações reiteradas de um trabalhador perante colegas.",
        "Cumprimento de horário.",
        "Cobrança legítima feita de forma respeitosa."
      ],
      answer: 2,
      explain: "Humilhações reiteradas podem atingir a dignidade, honra e integridade psíquica do trabalhador e fundamentar responsabilização, inclusive por danos morais, conforme o caso."
    },
    {
      tema: "Assédio moral",
      q: "O assédio moral pode ocorrer:",
      options: [
        "Somente entre chefe e subordinado.",
        "Somente entre trabalhadores do mesmo nível.",
        "Em diferentes relações no ambiente de trabalho, inclusive de forma vertical ou horizontal.",
        "Somente fora do trabalho.",
        "Apenas no serviço público."
      ],
      answer: 2,
      explain: "A configuração do assédio moral não depende necessariamente de uma única posição hierárquica. Pode ocorrer em relações verticais ou entre colegas, conforme as circunstâncias."
    },
    {
      tema: "Assédio moral",
      q: "Uma cobrança de metas feita de forma respeitosa e dentro dos limites legais:",
      options: [
        "É automaticamente assédio moral.",
        "Não é, por si só, assédio moral.",
        "É sempre crime.",
        "É proibida pela Constituição.",
        "Dispensa qualquer regra trabalhista."
      ],
      answer: 1,
      explain: "A gestão e a cobrança profissional não configuram automaticamente assédio moral. O problema surge quando há abuso, humilhação, constrangimento ou violação da dignidade."
    },
    {
      tema: "Assédio moral",
      q: "A Constituição Federal protege, entre outros, a honra e a imagem da pessoa. Essa proteção pode ser relevante em casos de assédio moral porque:",
      options: [
        "Impede qualquer avaliação profissional.",
        "Pode fundamentar proteção contra condutas abusivas e reparação por danos.",
        "Permite descumprimento de regras trabalhistas.",
        "Só vale fora do trabalho.",
        "Não possui relação com dignidade."
      ],
      answer: 1,
      explain: "O art. 5º, X, da Constituição protege intimidade, vida privada, honra e imagem e assegura indenização por dano material ou moral decorrente de sua violação."
    },
    {
      tema: "Assédio sexual",
      q: "O crime de assédio sexual está previsto no Código Penal no:",
      options: [
        "Art. 121.",
        "Art. 129.",
        "Art. 149.",
        "Art. 216-A.",
        "Art. 312."
      ],
      answer: 3,
      explain: "O art. 216-A do Código Penal tipifica o crime de assédio sexual."
    },
    {
      tema: "Assédio sexual",
      q: "Para a configuração do crime do art. 216-A do Código Penal, a conduta envolve, em regra:",
      options: [
        "Constranger alguém com intuito de obter vantagem ou favorecimento sexual, valendo-se o agente de sua condição de superior hierárquico ou ascendência inerente ao exercício de emprego, cargo ou função.",
        "Apenas uma discussão entre colegas.",
        "Somente violência física.",
        "Qualquer elogio.",
        "Apenas conduta praticada fora do ambiente profissional."
      ],
      answer: 0,
      explain: "O art. 216-A exige constrangimento com finalidade sexual e aproveitamento de superioridade hierárquica ou ascendência relacionada ao emprego, cargo ou função."
    },
    {
      tema: "Assédio sexual",
      q: "Para a configuração do crime de assédio sexual do art. 216-A:",
      options: [
        "É indispensável contato físico.",
        "Pode haver assédio sexual mesmo sem contato físico, se presentes os demais elementos do tipo penal.",
        "É necessário casamento entre as partes.",
        "A vítima precisa sofrer lesão corporal.",
        "Só mensagens presenciais são consideradas."
      ],
      answer: 1,
      explain: "O tipo penal não exige contato físico. A conduta pode ocorrer por palavras, mensagens ou outras formas de constrangimento, desde que presentes os elementos do art. 216-A."
    },
    {
      tema: "Assédio sexual",
      q: "Condicionar uma promoção profissional à aceitação de uma proposta sexual pode:",
      options: [
        "Ser apenas uma brincadeira.",
        "Configurar assédio sexual, se presentes os elementos legais.",
        "Ser sempre permitido pelo empregador.",
        "Ser apenas questão privada.",
        "Não produzir qualquer consequência."
      ],
      answer: 1,
      explain: "A utilização da posição profissional para obter favorecimento sexual pode preencher os elementos do art. 216-A do Código Penal, além de gerar outras consequências jurídicas."
    },
    {
      tema: "Assédio sexual",
      q: "A relação professor-aluno pode, em determinadas circunstâncias, ser relevante para a análise de assédio sexual porque:",
      options: [
        "O crime exige exclusivamente relação entre empregados da mesma empresa.",
        "A lei nunca alcança relações educacionais.",
        "Pode existir ascendência decorrente da função, conforme o caso concreto e a interpretação jurisprudencial.",
        "Professor e aluno são sempre considerados colegas de trabalho.",
        "Toda relação professor-aluno é automaticamente crime."
      ],
      answer: 2,
      explain: "A jurisprudência admite análise da ascendência funcional em relações educacionais, conforme as circunstâncias. Isso não significa que toda relação professor-aluno seja automaticamente criminosa."
    },
    {
      tema: "Trabalho infantil",
      q: "Segundo a Constituição Federal, a idade mínima geral para o trabalho é:",
      options: [
        "10 anos.",
        "12 anos.",
        "14 anos.",
        "16 anos, salvo aprendizagem a partir dos 14.",
        "18 anos em qualquer hipótese."
      ],
      answer: 3,
      explain: "O art. 7º, XXXIII, da Constituição proíbe qualquer trabalho a menores de 16 anos, salvo na condição de aprendiz a partir dos 14 anos."
    },
    {
      tema: "Trabalho infantil",
      q: "A partir de que idade é admitida a aprendizagem profissional, observados os requisitos legais?",
      options: [
        "10 anos.",
        "12 anos.",
        "14 anos.",
        "16 anos.",
        "18 anos."
      ],
      answer: 2,
      explain: "A Constituição, art. 7º, XXXIII, admite o trabalho do adolescente a partir dos 14 anos na condição de aprendiz, observadas as regras legais."
    },
    {
      tema: "Trabalho infantil",
      q: "Para menores de 18 anos, a Constituição proíbe:",
      options: [
        "Todo e qualquer estudo.",
        "Trabalho noturno, perigoso ou insalubre.",
        "Toda atividade de aprendizagem.",
        "Trabalho exclusivamente aos domingos.",
        "Qualquer atividade remunerada, mesmo aprendizagem."
      ],
      answer: 1,
      explain: "O art. 7º, XXXIII, da Constituição proíbe trabalho noturno, perigoso ou insalubre a menores de 18 anos."
    },
    {
      tema: "Trabalho infantil",
      q: "A proteção contra o trabalho infantil busca preservar principalmente:",
      options: [
        "Apenas a renda familiar.",
        "Desenvolvimento, educação, saúde e proteção integral de crianças e adolescentes.",
        "Somente o mercado de trabalho adulto.",
        "Apenas o direito empresarial.",
        "Exclusivamente a arrecadação tributária."
      ],
      answer: 1,
      explain: "A Constituição e o Estatuto da Criança e do Adolescente asseguram proteção especial à criança e ao adolescente, incluindo educação, saúde, desenvolvimento e proteção contra exploração."
    },
    {
      tema: "Trabalho infantil",
      q: "Um adolescente de 15 anos trabalhando em atividade perigosa:",
      options: [
        "Pode trabalhar normalmente porque tem mais de 14 anos.",
        "Pode trabalhar se receber salário mínimo.",
        "Não pode exercer trabalho perigoso, pois menores de 18 anos possuem essa proteção constitucional.",
        "Pode trabalhar se houver autorização dos pais.",
        "Pode trabalhar somente aos fins de semana."
      ],
      answer: 2,
      explain: "Mesmo quando o adolescente está na faixa etária permitida para trabalho, a Constituição mantém a proibição de trabalho noturno, perigoso ou insalubre para menores de 18 anos."
    },
    {
      tema: "Trabalho escravo",
      q: "O crime de redução à condição análoga à de escravo está previsto no:",
      options: [
        "Art. 121 do Código Penal.",
        "Art. 149 do Código Penal.",
        "Art. 155 do Código Penal.",
        "Art. 216-A do Código Penal.",
        "Art. 244 do Código Penal."
      ],
      answer: 1,
      explain: "O art. 149 do Código Penal tipifica a redução de alguém à condição análoga à de escravo."
    },
    {
      tema: "Trabalho escravo",
      q: "Segundo o art. 149 do Código Penal, pode caracterizar redução à condição análoga à de escravo:",
      options: [
        "Somente prisão física com correntes.",
        "Trabalho forçado, jornada exaustiva, condições degradantes ou restrição da locomoção por dívida, conforme o tipo penal.",
        "Apenas salário baixo.",
        "Qualquer atraso salarial isolado.",
        "Somente trabalho rural."
      ],
      answer: 1,
      explain: "O art. 149 contempla modalidades como trabalho forçado, jornada exaustiva, condições degradantes e restrição de locomoção em razão de dívida, além de condutas equiparadas previstas no próprio artigo."
    },
    {
      tema: "Trabalho escravo",
      q: "É correto afirmar que, para caracterizar trabalho análogo ao escravo:",
      options: [
        "É indispensável o uso de correntes.",
        "É indispensável a existência de cárcere físico.",
        "A ausência de liberdade física por correntes não impede a caracterização quando presentes as hipóteses do art. 149.",
        "Só existe crime quando o trabalhador não recebe salário.",
        "Só existe em fazendas."
      ],
      answer: 2,
      explain: "O art. 149 não exige necessariamente correntes ou cárcere físico. A submissão a trabalho forçado, jornada exaustiva, condições degradantes ou outras hipóteses legais pode caracterizar o crime."
    },
    {
      tema: "Trabalho escravo",
      q: "A existência de pagamento de salário:",
      options: [
        "Sempre impede o reconhecimento de trabalho análogo ao escravo.",
        "Não impede, por si só, a caracterização do crime.",
        "Torna o trabalho automaticamente regular.",
        "Elimina qualquer responsabilidade penal.",
        "Impede fiscalização trabalhista."
      ],
      answer: 1,
      explain: "O art. 149 não exige ausência de salário como requisito único. Outras circunstâncias previstas no tipo penal podem caracterizar a redução à condição análoga à de escravo."
    },
    {
      tema: "Trabalho escravo",
      q: "A restrição da liberdade de locomoção por dívida contraída com o empregador ou preposto:",
      options: [
        "É permitida em contratos rurais.",
        "Pode integrar a conduta prevista no art. 149 do Código Penal.",
        "É apenas questão civil.",
        "Só é ilícita se houver violência física.",
        "Não possui previsão penal."
      ],
      answer: 1,
      explain: "O art. 149 expressamente prevê a restrição, por qualquer meio, da locomoção em razão de dívida contraída com o empregador ou preposto."
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
          <p class="quiz-step">${item.tema} · Pergunta ${qi + 1} de ${QUESTIONS.length}</p>
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
