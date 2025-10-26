# 🎯 Guia de Fontes - Primordial Duck Hunter

## 📋 Estratégia de Legibilidade

### 🔤 Fontes Disponíveis

1. **Orbitron** (Militar/Títulos)
   - Uso: Títulos, cabeçalhos, labels importantes
   - Variável CSS: `--theme-font-family`

2. **Inter** (Legível/Conteúdo)
   - Uso: Textos longos, tabelas, formulários
   - Variável CSS: `--theme-font-readable`

3. **Courier New** (Monospace/Técnico)
   - Uso: Códigos, dados técnicos, IDs
   - Variável CSS: `--theme-font-mono`

### 🎨 Classes Utilitárias

```scss
// Aplicar fonte militar
.font-military { font-family: var(--theme-font-family); }

// Aplicar fonte legível
.font-readable { font-family: var(--theme-font-readable); }

// Aplicar fonte monospace
.font-mono { font-family: var(--theme-font-mono); }

// Texto legível com espaçamento otimizado
.readable-text { 
  font-family: var(--theme-font-readable);
  line-height: 1.6;
  letter-spacing: 0.01em;
}

// Título militar com efeitos
.military-title {
  font-family: var(--theme-font-family);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-shadow: 0 0 10px var(--theme-primary-alpha-medium);
}
```

### 📊 Contextos de Uso

#### ✅ Use Orbitron para:
- Títulos de páginas
- Labels de formulários
- Cabeçalhos de tabelas
- Botões importantes
- Status badges
- Navegação

#### ✅ Use Inter para:
- Conteúdo de tabelas
- Textos longos
- Descrições
- Inputs de formulário
- Modais de conteúdo
- Parágrafos

#### ✅ Use Courier New para:
- IDs de drones
- Códigos de série
- Coordenadas GPS
- Dados técnicos
- Logs do sistema

### 🔧 Implementação nos Componentes

```vue
<template>
  <!-- Título militar -->
  <h1 class="military-title">OPERAÇÃO PATO PRIMORDIAL</h1>
  
  <!-- Conteúdo legível -->
  <p class="readable-text">
    Descrição detalhada da missão...
  </p>
  
  <!-- Dados técnicos -->
  <code class="technical-data">DRN-001-USA</code>
</template>
```

### 📱 Responsividade

- Mobile: Priorizar Inter para melhor legibilidade
- Desktop: Manter equilíbrio entre Orbitron e Inter
- Tablets: Ajustar tamanhos conforme necessário

### 🎯 Benefícios

1. **Legibilidade**: Inter melhora leitura de dados
2. **Identidade**: Orbitron mantém tema militar
3. **Funcionalidade**: Courier para dados técnicos
4. **Performance**: Fontes otimizadas com fallbacks
5. **Acessibilidade**: Melhor contraste e espaçamento