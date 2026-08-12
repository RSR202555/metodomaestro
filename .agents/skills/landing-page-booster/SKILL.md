---
name: landing-page-booster
description: Diretrizes e padrões para otimização de landing pages de alta conversão para o Método Maestro. Ative esta skill para criar ou aprimorar componentes visuais, calculadoras de retorno, micro-animações, provas sociais e estruturas de alta conversão.
---

# Landing Page Booster - Método Maestro

Esta skill define as melhores práticas de design, copywriting e engenharia de conversão para o projeto **Método Maestro**.

## 1. Identidade Visual e Estética Premium (Gold & Dark Glassmorphism)
- **Cores Predominantes**: Fundo escuro profundo (`#131313`, `#0A0A0A`, `#050505`) com acentos dourados (`#f2ca50`, `#d4af37`, `#ffe088`).
- **Efeitos de Vidro (Glassmorphism)**: Usar a classe `.glass-card` (`bg-[#1A1A1A] border border-white/5 backdrop-blur-md`).
- **Glow & Destaque**: Usar `.gold-glow` (`box-shadow: 0 0 30px rgba(212,175,55,0.15)`) para elementos principais de conversão.

## 2. Elementos Interativos Obrigatórios para Alta Conversão
- **Calculadora de Faturamento (Income Simulator)**: Permitir que o personal trainer simule quanto faturará cobrando o valor justo por hora-aula / consultoria.
- **Relógio de Escassez em Tempo Real (Countdown Timer)**: Manter o senso de oportunidade com contagem regressiva de virada de lote.
- **Modais de Checkout e Vídeo**: Experiência fluida sem redirecionamentos bruscos.
- **Provas Sociais Dinâmicas com Lightbox**: Permitir ampliar resultados e depoimentos.

## 3. Diretrizes de UX & Animações (Framer Motion)
- Suavidade nas transições (`whileHover={{ scale: 1.02 }}`, `whileTap={{ scale: 0.98 }}`).
- Revelação progressiva dos elementos ao rolar a página (`reveal-on-scroll`).
