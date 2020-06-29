import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  /* Remove all margins, paddings and use border-box as a default box sizing */
  *,
  *::before,
  *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background-repeat: no-repeat;
  }

  /* Set core body defaults */
  body {
    line-height: 1.5;
    min-height: 100vh;
    word-break: break-word;
    scroll-behavior: smooth;
    text-rendering: optimizeLegibility;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif, 'Apple Color Emoji',
      'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  }

  /* Remove list styles on ul, ol elements with a class attribute */
  ul,
  ol {
    list-style: none;
  }

  /* Remove default anchor styles */
  a,
  a:active,
  a:focus {
    text-decoration: none;
  }

  /* Make images easier to work with */
  img {
    max-width: 100%;
    display: block;
  }

  /* Natural flow and rhythm in articles by default */
  article > * + * {
    margin-top: 1em;
  }

  /* Inherit fonts for inputs and buttons */
  input,
  button,
  textarea,
  select {
    font: inherit;
  }

  /* Helper hidden attribute */
  [hidden] {
    display: none;
  }

  /* Helper disabled attribute */
  [disabled] {
    cursor: not-allowed;
    pointer-events: none;
  }

  /* Main container class */
  .container {
    width: 100%;
    margin: 0 auto;
    max-width: 996px;
  }

  /* Main grid class */
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  }

  /* Remove all animations and transitions for people that prefer not to see them */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;
