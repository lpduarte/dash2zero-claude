# Instruções para Claude Code

## Design System

Antes de escrever CSS ou escolher estilos, consulta sempre a página de estilos em `src/pages/StyleGuide.tsx`:

- **Cores**: Usar apenas as variáveis CSS definidas em `src/index.css`
- **Tipografia**: Apenas `font-normal` (400) e `font-bold` (700) — não usar `font-medium` ou `font-semibold`
- **Componentes**: Usar os componentes de `src/components/ui/` sempre que possível
- **Espaçamentos e sombras**: Seguir a escala definida no StyleGuide

## Nomenclatura

- Código e comentários técnicos: Inglês
- Textos visíveis ao utilizador (labels, mensagens, tooltips): Português de Portugal

## Terminologia

- Nunca usar "carbónico/carbónica" — usar sempre "de carbono" (ex: "intensidade de carbono", "pegada de carbono")

## Estrutura do Projeto

```
src/
├── components/     # Componentes React reutilizáveis
├── data/          # Dados estáticos e configurações
├── lib/           # Utilitários e funções
├── pages/         # Páginas da aplicação
└── types/         # Definições TypeScript
```

## Git

No final de cada tarefa concluída, fazer commit e push automaticamente:

### Formato do commit
```
<tipo>: <descrição curta em português>
```

### Tipos
- `feat`: nova funcionalidade
- `fix`: correção de bug
- `refactor`: refatoração sem mudança de comportamento
- `style`: alterações visuais/CSS/UI
- `docs`: documentação
- `chore`: manutenção (dependências, configs)

### Exemplos
- `feat: adicionar filtros avançados à página Incentive`
- `fix: corrigir navegação clusters → incentive`
- `style: ajustar cores dos badges de risco`
- `refactor: extrair lógica de cálculo de risco para utils`
- `chore: atualizar dependências`

### Processo
1. Após concluir uma tarefa, executar:
   ```bash
   git add -A
   git commit -m "<tipo>: <descrição>"
   git push origin main
   ```
2. Informar o utilizador do commit feito (mensagem e hash curto)
3. Não pedir confirmação — fazer automaticamente

### Notas
- Uma tarefa = um commit (não fazer commits por cada ficheiro)
- Descrição em português de Portugal
- Manter descrição curta (<50 caracteres se possível)
- Se houver erro no push, informar o utilizador
