declare module "*.css" {
  const styles: { [className: string]: string };
  export = styles;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}

declare module "*.jpeg" {
  const content: string;
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.svg?react" {
  import type React from "react";
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement>
  >;
  const content: string;
  export default content;
}

declare const BACKEND_HOST: string;

/*
  sunda.js ships its own types (dist/types/index.d.ts), but its package.json
  "exports" map has no "types" condition, so TypeScript with
  moduleResolution: "bundler" can't resolve them (error TS7016). This
  declaration supplies the types for the API this app imports.
*/
declare module "sunda.js" {
  export const toSundanese: (input: string) => string;
  export const toLatin: (input: string) => string;
}
