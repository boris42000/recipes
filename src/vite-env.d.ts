/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

declare module 'virtual:recipes' {
  const recipes: import('./lib/schema').Recipe[]
  export default recipes
}
