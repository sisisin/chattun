/// <reference types="vite/client" />
/// <reference types="vite-plus/test/globals" />

declare namespace JSX {
  interface IntrinsicElements {
    'em-emoji': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & { id?: string; size?: string; native?: string },
      HTMLElement
    >;
  }
}
