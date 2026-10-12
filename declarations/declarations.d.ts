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

declare module "sunda.js" {
  export const toSundanese: (input: string) => string;
  export const toLatin: (input: string) => string;
  export class SundaHelper {
    static getMain(char: string | null | undefined): string;
    static getSonorant(char: string | null | undefined): string;
    static getRarangken(char: string | null | undefined): string;
    static getFinal(char: string | null | undefined): string;
    static getNumber(char: string | null | undefined): string;
  }
  export class LatinHelper {
    static getMain(char: string | null | undefined): string;
    static getSonorant(char: string | null | undefined): string;
    static getRarangken(char: string | null | undefined): string;
    static getFinal(char: string | null | undefined): string;
    static getNumber(char: string | null | undefined): string;
  }
}

