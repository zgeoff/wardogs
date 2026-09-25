import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import appCSS from '../app.css?url';
import { NotFound } from './-root/not-found';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      // oxlint-disable-next-line unicorn/text-encoding-identifier-case -- the HTML attribute value, not a Node encoding name
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'wardogs ❤️' },
      { name: 'description', content: 'Tools for Wardogs, starting with a FOB planner.' },
      { name: 'theme-color', content: '#10110d' },
    ],
    links: [
      { rel: 'stylesheet', href: appCSS },
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFound,
  shellComponent: RootDocument,
});

function RootComponent() {
  return <Outlet />;
}

interface RootDocumentProps {
  readonly children: ReactNode;
}

function RootDocument(props: RootDocumentProps) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {props.children}
        <Scripts />
      </body>
    </html>
  );
}
