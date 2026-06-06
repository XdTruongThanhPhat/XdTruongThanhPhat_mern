import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Import vite-plugin-prerender qua require() vì package dùng CJS internally
const vitePrerender = require('vite-plugin-prerender')
const PuppeteerRenderer = vitePrerender.PuppeteerRenderer


// Danh sách tất cả các route TĨNH cần prerender
// (Route dynamic như /hang-muc/cong-trinh-chi-tiet/:id không prerender ở đây
//  vì nội dung phụ thuộc Database – chúng vẫn dùng react-helmet-async để SEO)
const STATIC_ROUTES = [
  '/',
  '/hang-muc-cong-trinh',
  '/hang-muc-cong-trinh/noi-that',
  '/hang-muc-cong-trinh/biet-thu',
  '/hang-muc-cong-trinh/can-ho',
  '/hang-muc-cong-trinh/nha-pho',
  '/hang-muc-cong-trinh/cong-trinh-thuc-te',
  '/bao-gia',
  '/lien-he',
  '/ve-ttp',
  '/ve-ttp/doi-ngu-nhan-su',
  '/tin-tuc',
]

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    // PRERENDER: Tạo HTML tĩnh cho các trang không phụ thuộc DB
    // Chạy tự động sau khi `npm run build` hoàn tất
    vitePrerender({
      // Thư mục chứa file build đầu ra
      staticDir: path.join(__dirname, 'dist'),
      // Danh sách route cần render thành HTML
      routes: STATIC_ROUTES,
      renderer: new PuppeteerRenderer({
        // Đợi React render xong (tín hiệu từ main.jsx)
        renderAfterDocumentEvent: 'render-event',
        headless: true,
        // Dùng Chrome tùy theo môi trường (Docker Linux hoặc Local Windows)
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      }),
    }),
  ],
  build: {
    // Tối ưu: Tách vendor libraries thành chunk riêng để browser cache lâu dài
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/') || id.includes('node_modules/react-router')) {
            return 'vendor';
          }
        },
      },
    },
  },
  // Loại bỏ console.log và debugger trong production (Vite 8 dùng oxc)
  oxc: {
    drop: ['console', 'debugger'],
  },
})