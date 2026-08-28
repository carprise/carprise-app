import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

/**
 * Web document shell — cream page so short screens do not flash a dark body.
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en-GB">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const responsiveBackground = `
html, body, #root {
  height: 100%;
  margin: 0;
  background-color: #ece5dc;
  color: #08090b;
}
body {
  overflow: hidden;
}
`;
