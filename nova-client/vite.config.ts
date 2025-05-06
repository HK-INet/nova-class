import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { fileURLToPath, URL } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), UnoCSS(),
  AutoImport({
    imports: [
      'vue',
      'vue-router',
      'pinia', // 视情况加入
    ],
    dts: 'src/auto-imports.d.ts', // 自动生成的类型声明文件
    eslintrc: {
      enabled: true, // 如果你配置了 eslint，推荐开启
      filepath: './.eslintrc-auto-import.json',
      globalsPropValue: true
    }
  }),

  // 自动导入组件
  Components({
    dirs: ['src/components'], // 可自行调整组件目录
    extensions: ['vue'],
    deep: true,
    dts: 'src/components.d.ts'
  })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: true,
    port: 5173,
  }
})
