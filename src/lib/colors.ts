// GERADO AUTOMATICAMENTE - NAO EDITAR
// Fonte: src/index.css
// Gerado em: 2026-01-27T11:05:20.485Z
// Script: scripts/extract-colors.js

/**
 * Cores do tema extraidas do CSS
 * Para usar em templates de email e outros contextos onde CSS vars nao funcionam
 */
export const colors = {
  /**
   * Cores do tema claro (light mode) em formato HEX
   */
  light: {
    'background': '#F6F8F8',
    'foreground': '#172625',
    'card': '#FFFFFF',
    'muted': '#EDF2F1',
    'mutedForeground': '#577573',
    'border': '#DAE7E6',
    'primary': '#21A196',
    'primaryLight': '#37BEB2',
    'primaryDark': '#157971',
    'warning': '#F2AD0D',
    'danger': '#DD3C3C',
    'autumn': '#E67919',
    'scope1': '#CB4D8C',
    'scope2': '#CAAA2B',
    'scope3': '#2E95B8',
    'statusPending': '#97A3B4',
    'statusContacted': '#E9590C',
    'statusInterested': '#F59F0A',
    'statusRegistered': '#93B83D',
    'statusProgress': '#37BEB2',
    'statusComplete': '#21A196',
    'medalGold': '#FFD900',
    'medalSilver': '#BFBFBF',
    'medalBronze': '#CB8034'
},

  /**
   * Cores do tema escuro (dark mode) em formato HEX
   */
  dark: {
    'background': '#0F1A19',
    'foreground': '#F0F4F4',
    'card': '#182524',
    'muted': '#1F2E2D',
    'mutedForeground': '#8AA8A3',
    'border': '#293D3B',
    'primary': '#2EB8AC',
    'primaryLight': '#4DCBC1',
    'primaryDark': '#1F938A',
    'warning': '#EEB32B',
    'danger': '#DA4E4E',
    'autumn': '#E28736',
    'scope1': '#D16199',
    'scope2': '#D7B942',
    'scope3': '#33A6CC',
    'statusPending': '#7588A3',
    'statusContacted': '#EE6F2B',
    'statusInterested': '#EEA62B',
    'statusRegistered': '#A1C059',
    'statusProgress': '#4DCBC1',
    'statusComplete': '#2EB8AC',
    'medalGold': '#FFD900',
    'medalSilver': '#BFBFBF',
    'medalBronze': '#CB8034'
},

  /**
   * Cores em formato HSL string (para CSS inline)
   */
  hsl: {
    'background': 'hsl(170, 15%, 97%)',
    'foreground': 'hsl(175, 25%, 12%)',
    'card': 'hsl(0, 0%, 100%)',
    'muted': 'hsl(170, 15%, 94%)',
    'mutedForeground': 'hsl(175, 15%, 40%)',
    'border': 'hsl(175, 20%, 88%)',
    'primary': 'hsl(175, 66%, 38%)',
    'primaryLight': 'hsl(175, 55%, 48%)',
    'primaryDark': 'hsl(175, 70%, 28%)',
    'warning': 'hsl(42, 90%, 50%)',
    'danger': 'hsl(0, 70%, 55%)',
    'autumn': 'hsl(28, 80%, 50%)',
    'scope1': 'hsl(330, 55%, 55%)',
    'scope2': 'hsl(48, 65%, 48%)',
    'scope3': 'hsl(195, 60%, 45%)',
    'statusPending': 'hsl(215, 16%, 65%)',
    'statusContacted': 'hsl(21, 90%, 48%)',
    'statusInterested': 'hsl(38, 92%, 50%)',
    'statusRegistered': 'hsl(78, 50%, 48%)',
    'statusProgress': 'hsl(175, 55%, 48%)',
    'statusComplete': 'hsl(175, 66%, 38%)',
    'medalGold': 'hsl(51, 100%, 50%)',
    'medalSilver': 'hsl(0, 0%, 75%)',
    'medalBronze': 'hsl(30, 59%, 50%)'
}
} as const;

/**
 * Cores especificas para templates de email
 * Mapeamento semantico das cores CSS para uso em emails
 */
export const emailColors = {
  'text': '#172625',
  'textSecondary': '#577573',  // = mutedForeground (tom esverdeado)
  'textMuted': '#577573',
  'textLight': '#5E7E7C',      // Tom esverdeado mais claro
  'textLighter': '#708E8B',    // Tom esverdeado para footer
  'background': '#FFFFFF',
  'backgroundMuted': '#EDF2F1',
  'backgroundSubtle': '#f5f5f5',
  'backgroundAlt': '#f8f9fa',
  'primary': '#21A196',
  'primaryDark': '#157971',
  'primaryLight': '#37BEB2',
  'warning': '#F2AD0D',
  'danger': '#DD3C3C',
  'border': '#DAE7E6',
  'borderLight': '#e5e5e5',
  'borderLighter': '#f0f0f0'
} as const;

/**
 * Helper para criar cor com opacidade (retorna HSL string)
 * Util para backgrounds subtis em emails
 * @param color - Nome da cor em colors.hsl
 * @param opacity - Valor de 0 a 1
 */
export function withOpacity(color: keyof typeof colors.hsl, opacity: number): string {
  const hsl = colors.hsl[color];
  // Converte "hsl(h, s%, l%)" para "hsl(h s% l% / opacity)"
  const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!match) return hsl;
  return `hsl(${match[1]} ${match[2]}% ${match[3]}% / ${opacity})`;
}

/**
 * Tipo das cores disponiveis
 */
export type ColorName = keyof typeof colors.light;
export type EmailColorName = keyof typeof emailColors;
