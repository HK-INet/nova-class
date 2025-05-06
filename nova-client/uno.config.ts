// uno.config.ts
import { defineConfig, presetUno } from 'unocss'

export default defineConfig({
  presets: [presetUno()],
  theme: {
    colors: {
      bg: 'var(--bg',
      fg: 'var(--fg)',
      primary: 'var(--primary)',
    }
  }
})
