// Vite raw-text imports used by the stand-alone page build.
declare module "*.md?raw" {
  const text: string;
  export default text;
}
