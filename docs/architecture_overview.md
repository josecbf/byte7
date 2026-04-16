# Arquitetura Byte7 — visão simples + fases

> Documento voltado para **público não-técnico** (parceiros, sócios,
> investidores, clientes de apresentação). Descreve em linguagem
> direta como a plataforma é organizada e quais são as fases até
> operação em regime.

---

## 1. A plataforma em uma página

Pense na Byte7 como um **prédio de atendimento**. Cada andar tem uma
função clara, e eles conversam entre si com regras bem definidas.

```
                    ┌──────────────────────┐
                    │   Usuários (web)     │   ← visitante, investidor, admin
                    └──────────┬───────────┘
                               │
                               ▼
      ┌────────────────────────────────────────────┐
      │  VITRINE · o que o usuário vê na tela      │
      │  · Site institucional (home, sobre…)       │
      │  · Blog                                    │
      │  · Portal do investidor                    │
      │  · Ambiente administrativo                 │
      └──────────────────────┬─────────────────────┘
                             │
                             ▼
      ┌────────────────────────────────────────────┐
      │  PORTARIA · confere quem pode entrar       │
      │  · Autenticação (login)                    │
      │  · Regra de acesso (admin × investidor)    │
      └──────────────────────┬─────────────────────┘
                             │
                             ▼
      ┌────────────────────────────────────────────┐
      │  ATENDIMENTO · recebe pedidos e responde   │
      │  · Regras de negócio                       │
      │  · Cálculos (rentabilidade, evolução)      │
      │  · Comparativos (CDI, Ibovespa…)           │
      └─────────┬──────────────┬──────────┬────────┘
                │              │          │
        ┌───────▼─────┐ ┌──────▼─────┐ ┌──▼────────┐
        │  ARQUIVO    │ │  COFRE     │ │ MENSAGERIA│
        │  PRINCIPAL  │ │ DE DOCS    │ │           │
        │             │ │            │ │           │
        │ Cadastros,  │ │ Contratos, │ │ E-mails   │
        │ aportes,    │ │ PDFs, imag │ │ de boas   │
        │ posts, usin.│ │ de blog    │ │ vindas e  │
        │             │ │            │ │ avisos    │
        └─────────────┘ └────────────┘ └───────────┘

      ┌────────────────────────────────────────────┐
      │  CÂMERAS · monitoria e auditoria           │
      │  · Erros em tempo real                     │
      │  · Registro de quem viu/alterou o quê      │
      │  · Métricas de uso                         │
      └────────────────────────────────────────────┘
```

### O que cada parte faz (em português claro)

| Parte | Analogia | Função |
|---|---|---|
| **Vitrine** | A fachada e os balcões | Tudo que o usuário enxerga no navegador ou celular |
| **Portaria** | Recepção com crachá | Confere quem pode entrar e em qual área |
| **Atendimento** | Os atendentes nos balcões | Processa o pedido, faz o cálculo, decide o que mostrar |
| **Arquivo principal** | Arquivo físico da empresa | Guarda cadastros, aportes, posts, usinas |
| **Cofre de documentos** | Cofre separado e auditado | Guarda contratos e outros arquivos que têm peso jurídico |
| **Mensageria** | Malote de correspondência | Envia e-mails transacionais (boas-vindas, acesso, avisos) |
| **Câmeras** | CFTV + livro de visitas | Registra o que aconteceu, para segurança e melhoria contínua |

Essa estrutura **não muda** com o crescimento. O que muda são os
**equipamentos** de cada andar — um arquivo maior, mais atendentes,
mais câmeras. A planta do prédio continua a mesma.

---

## 2. Fases até a operação em regime

Cada fase tem: **quando aplicar**, **time necessário**, **infraestrutura**,
**entregas de produto** e **riscos**.

| Fase | Contexto | Usuários | Time | Duração | Infra / mês | Entregas principais | Risco |
|---|---|---|---|---|---|---|---|
| **0 · Demo** | Hoje | 0 reais · apresentações | 1 dev (meio período) | — (já feito) | R\$ 0 | Site institucional, blog, portal investidor, admin, demo banner | Baixo — escopo demonstrativo |
| **1 · Go-live controlado** | Primeira operação real com poucos investidores-âncora | até 200 | 1 dev (full) + produto parcial | 3–4 semanas | R\$ 300–600 | Banco de dados real, login profissional, LGPD, logs de auditoria, backups, monitoramento | Médio — primeira vez em produção |
| **2 · Expansão** | Operação aberta comercialmente | 200 → 2.000 | 1–2 devs + produto + atendimento parcial | 3–6 meses | R\$ 1.000–2.000 | Cache de páginas pesadas, e-mails automáticos, relatórios do investidor, melhorias de UX baseadas em uso real | Médio — crescimento demanda processo |
| **3 · Escala** | Plataforma consolidada | 2.000 → 20.000 | 2–3 devs + produto + CS + DPO | 6–12 meses | R\$ 3.000–6.000 | Banco com réplica de leitura, tarefas em segundo plano (recalcular saldos, relatórios), painel de BI interno, SLA e suporte formal | Alto — erro afeta muita gente |
| **4 · Maturidade** | Operação regulada / multi-região | 20.000+ | 3+ devs, produto dedicado, ops, jurídico, compliance, DPO | 12+ meses | R\$ 10.000–30.000 | Separação backend/frontend, proteção reforçada de dados (RLS, vault), integrações (CVM, custódia, liquidação), auditorias externas | Alto — exige governança formal |

**Leitura rápida:**
- O salto mais importante é **Fase 0 → 1**: não é de capacidade, é de
  *postura*. É quando a Byte7 passa a guardar dados reais de pessoas
  reais e, por isso, assume obrigações reais (LGPD, auditoria, backup).
- Fases 2 e 3 são de **ajuste fino e maturação**: mesma estrutura,
  mais robustez e mais gente cuidando.
- Fase 4 só faz sentido quando o volume ou a regulação exigirem.
  Antes disso, é complexidade desnecessária.

---

## 3. O que já está pronto hoje (Fase 0)

- Site institucional (home, sobre, valores, produtos, blog)
- Blog com ambiente administrativo (listar, criar, editar, excluir)
- Gestão administrativa de cadastros de investidores
- Portal do investidor (apenas consulta):
  - Posição consolidada e rentabilidade
  - Gráfico comparativo (Byte7 × CDI × Ibovespa)
  - Tabela comparativa mensal (Byte7, Poupança, IPCA, CDI, Ibovespa)
  - Mapa das usinas vinculadas
  - Contrato com emissão de cópia
- Dashboard administrativo de resultados, com filtro por investidor
  ou visão consolidada
- Aviso de versão demonstrativa em todas as páginas

Tudo funcionando ponta a ponta, com dados ilustrativos.

---

## 4. Primeiro passo para ir do Fase 0 ao Fase 1

Três frentes, **em paralelo**, numa única sprint de 3–4 semanas:

1. **Substituir o arquivo ilustrativo por arquivo real.**
   Implantar banco de dados profissional e migrar os cadastros e
   operações para ele. A experiência do usuário não muda.
2. **Instalar a portaria profissional.**
   Trocar o controle de acesso atual (simplificado) por um sistema de
   login padrão de mercado, com segurança em dois fatores para o
   administrador.
3. **Ligar as câmeras.**
   Monitoramento de erros, registro de auditoria e política de
   backup. Sem isso, qualquer operação real é temerária.

Essas três frentes têm custo combinado inferior a **R\$ 600/mês** em
infraestrutura e liberam a plataforma para atender até **2.000
usuários** sem nenhuma mudança estrutural adicional.

---

*Documento mantido em `docs/architecture_overview.md`. Atualizar sempre
que a fase atual avançar.*
