# Metodologia v2.0 — Relatório de Optimização

## Estado Actual

- **Ficheiro:** `src/pages/Methodology.tsx`
- **Linhas:** ~3.500
- **Secções:** 22 (vs 14 anteriores)
- **Versão:** v2.0.0
- **Build:** Sem erros TypeScript, sem warnings relevantes

---

## Optimizações Recomendadas

### 1. Dividir o ficheiro em componentes (Prioridade Alta)

O ficheiro tem ~3.500 linhas num único componente. Isto afecta:
- Legibilidade e manutenção
- Performance de HMR (Hot Module Replacement) durante o desenvolvimento
- Dificuldade em encontrar secções específicas

**Proposta:** Extrair cada secção para um componente dedicado:

```
src/pages/Methodology/
├── index.tsx                    # Layout (sidebar + main)
├── Sidebar.tsx                  # Navegação lateral
├── sections/
│   ├── VisaoGeral.tsx
│   ├── TiposUtilizador.tsx
│   ├── Glossario.tsx
│   ├── PotencialMelhoria.tsx
│   ├── CalculoEmissoes.tsx
│   ├── Indicadores.tsx
│   ├── SetoresActividade.tsx
│   ├── FatoresIntensidade.tsx
│   ├── DadosRecolher.tsx
│   ├── FluxoOnboarding.tsx
│   ├── GestaoClusters.tsx
│   ├── Dashboard.tsx
│   ├── GraficosAnalises.tsx
│   ├── PlanosAccao.tsx
│   ├── Medidas.tsx
│   ├── Financiamento.tsx
│   ├── Incentivos.tsx
│   ├── TemplatesEmail.tsx
│   ├── BoasPraticasEmail.tsx
│   ├── PainelControlo.tsx
│   ├── Permissoes.tsx
│   ├── Infraestruturas.tsx
│   └── Bibliografia.tsx
```

**Impacto:** Cada secção fica isolada, mais fácil de editar e testar.

---

### 2. Lazy loading de secções (Prioridade Alta)

Com 22 secções, o bundle da página é grande. Usar `React.lazy()` + `Suspense` para carregar secções sob demanda à medida que o utilizador faz scroll.

```tsx
const VisaoGeral = React.lazy(() => import('./sections/VisaoGeral'));
// Usar Intersection Observer para trigger do lazy load
```

**Impacto:** Redução significativa do TTI (Time to Interactive).

---

### 3. Virtualização de listas grandes (Prioridade Média)

As tabelas de setores (18 itens), intensidades (~18 itens), subsetores (13 itens) e glossário (15 itens) são pequenas. Mas a tabela de permissões e a lista de templates podem crescer.

**Proposta:** Monitorizar o crescimento. Se ultrapassar 50+ itens, usar `react-window` ou similar.

---

### 4. Scroll spy com Intersection Observer (Prioridade Média)

O scroll spy actual usa `window.scrollY` + loop manual sobre todas as secções. Isto corre a cada evento scroll (alta frequência).

**Proposta:** Substituir por `IntersectionObserver`:

```tsx
useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    },
    { rootMargin: '-100px 0px -60% 0px' }
  );

  allSections.forEach(section => {
    const el = document.getElementById(section.id);
    if (el) observer.observe(el);
  });

  return () => observer.disconnect();
}, []);
```

**Impacto:** Melhor performance de scroll, especialmente em mobile.

---

### 5. Memoização de dados derivados (Prioridade Baixa)

Os `.sort()` e `.map()` nas listas de emissões são recalculados a cada render. Com `useMemo`:

```tsx
const sortedFactors = useMemo(
  () => [...sectorEmissionFactors].sort((a, b) => b.intensity - a.intensity),
  []
);
```

**Impacto:** Negligível com os volumes actuais, mas boa prática.

---

### 6. Acessibilidade (Prioridade Média)

- Adicionar `aria-current="true"` ao item activo da sidebar
- Adicionar `role="navigation"` à sidebar
- Os grupos colapsáveis devem ter `aria-expanded`
- As tabelas devem ter `<caption>` para screen readers
- Os badges de cor devem ter texto alternativo (não depender apenas da cor)

---

### 7. Responsividade da sidebar (Prioridade Alta)

A sidebar está fixa com `w-64` e `fixed`. Em mobile não colapsa. Implementar:
- Drawer/sheet em mobile (< 768px) com botão hamburger
- Overlay ao abrir
- Fechar ao clicar numa secção

---

### 8. Permalink / Deep linking (Prioridade Baixa)

Ao clicar numa secção, actualizar o hash da URL (`#visao-geral`). Permite:
- Partilhar links directos para secções
- Navegação browser (back/forward)

```tsx
const scrollToSection = (id: string) => {
  window.history.replaceState(null, '', `#${id}`);
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};
```

---

### 9. Search/filtro no glossário (Prioridade Baixa)

Com 15+ termos, um campo de pesquisa no glossário melhoraria a experiência:

```tsx
const [search, setSearch] = useState('');
const filtered = glossary.filter(item =>
  item.term.toLowerCase().includes(search.toLowerCase()) ||
  item.definition.toLowerCase().includes(search.toLowerCase())
);
```

---

### 10. Exportação para PDF (Prioridade Baixa)

A página de metodologia é um documento de referência. Permitir exportar como PDF seria útil para partilhar offline com stakeholders.

Opções:
- `react-to-print` (mais simples)
- `@react-pdf/renderer` (mais controlo)
- CSS `@media print` (mais leve)

---

## Métricas Actuais

| Métrica | Valor |
|---------|-------|
| Linhas de código | ~3.500 |
| Secções | 22 |
| Grupos de navegação | 5 |
| Imports de ícones | ~40 |
| Ficheiros de dados importados | 3 |
| Bundle JS (gzip) | ~444 KB (total app) |
| Bundle CSS (gzip) | ~19 KB (total app) |

---

## Ordem Sugerida de Implementação

1. **Dividir em componentes** — maior impacto na manutenção
2. **Responsividade mobile** — impacto directo nos utilizadores
3. **Intersection Observer** — melhoria de performance
4. **Acessibilidade** — cumprimento de normas
5. **Lazy loading** — performance (quando houver mais conteúdo)
6. **Deep linking** — UX improvement
7. **Restantes** — conforme necessidade

---

*Relatório gerado em 28 de janeiro de 2026*
