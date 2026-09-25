import '../src/styled-system/styles.css';
import '@fontsource/chakra-petch/600.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/600.css';
import type { ReactNode } from 'react';

// Ladle finds this file's exports by walking its AST for `export const` declarations; an
// `export function` crashes that detection
export const Provider = (props: { readonly children: ReactNode }) => (
  <div style={{ padding: '2rem', minHeight: '100vh' }}>{props.children}</div>
);
