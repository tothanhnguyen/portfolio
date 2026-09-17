# QA Report — Portfolio V2 (P6)

Ngày chạy: 2026-09-17 · Tooling: Puppeteer (Chromium) + Lighthouse CLI · Server: python3 http.server :4173

## 1. Kết quả chạy tự động (run8)

16 lượt route×viewport: `/`, `/about/`, `/projects/mowstudio/`, `/projects/chat-server/` × 1440×900, 768×1024, 390×844, 320×568.

| Check | Kết quả |
|---|---|
| Status 200 cho direct route (không 404) | ✓ tất cả |
| scrollWidth == viewport (4 viewport × 4 route) | ✓ tất cả, không phần tử vượt viewport không được clip |
| Console/pageerror/requestfailed | ✓ sạch trên mọi route |
| No-JS: không có class `js`, toàn bộ `[data-reveal]` opacity 1 | ✓ (progressive reveal đúng contract) |
| Reduced-motion từ load: reveal đọc được (0/28 hidden) | ✓ |
| Reduced-motion: scene static, runway 900px (không runway 240svh) | ✓ |
| Mobile 390: scene `data-motion=null` (bố cục dọc 3 mảng) | ✓ |
| Desktop 1440: scene live, runway 2160px (= 240svh) | ✓ |
| Scrub tại p = 0 / .2 / .5 / .75 / 1 + screenshot | ✓ (xem `about-p0…png`, `about-p05.jpg`) |

### Fail duy nhất của run8 — là lỗi đo của script, không phải bug site

`about scroll-back reconstructs — frag5 offset=518.4px`: so sánh `frag--5.top − scene-frame.top` mà không tính vị trí tĩnh tự nhiên của frag5 (80% chiều cao frame = 0.8 × 648px = **518.4px** — khớp chính xác giá trị đo được). frag1 offset = 0 ✓. Xác nhận bằng ảnh: `about-back-to-zero.jpg` giống hệt `about-p0.jpg` → đảo chiều scroll tái tạo đúng, không tích lũy transform.

## 2. Lighthouse (lab — mobile simulated, throttling simulate, 150ms RTT)

| | Home | About |
|---|---|---|
| Performance | 0.85 | 0.83 |
| Accessibility | 1.0 | 1.0 |
| Best Practices | 1.0 | 1.0 |
| SEO | 1.0 | 1.0 |
| LCP | 4.1s | 3.6s |
| CLS | 0.003 | 0 |
| TBT | 0ms | 0ms |

- **LCP** do chuỗi webfont render-blocking (Bodoni 3 file + Noto Serif JP + Great Vibes ≈ 200KB transfer tổng) trên simulated mobile. Không regression của V2 — baseline có cùng cơ chế. Giữ nguyên theo plan (không thêm font family; hardcode preload woff2 rủi ro subset sai). Ghi nhận là điểm cần profile tiếp trên field thật.
- CLS 0–0.003 ✓ (≤0.1). TBT 0 ✓ — không long task từ JS.

## 3. Ngân sách JS (P6: ≤20KB gzip)

| File | raw | gzip |
|---|---|---|
| js/effects.js | 8.7KB | 2.85KB |
| js/about.js | 8.0KB | 2.75KB |
| **Tổng JS** | 16.7KB | **5.6KB** ✓ |

CSS gzip tổng (~10.5KB cho 5 file). Không framework/runtime mới, không video/frame-sequence, không per-frame filter/blur.

## 4. Scene SELF/FRAGMENT — bằng chứng bằng ảnh

- `about-p0.jpg` / `about-back-to-zero.jpg`: 5 mảnh ghép hoàn chỉnh, nhận diện cùng một người; scroll ngược cho hình giống hệt (reconstruction thuần hàm progress).
- `about-p05.jpg`: separation lớn nhất — mặt trong mảnh trung tâm ổn định, word FRAGMENT mờ, labels SOFTWARE/FRONTEND/AI/VISION có thứ bậc, VISION đỏ (Exploring).
- `about-p075.jpg`/`about-p1.jpg`: mảnh trở về, stage nhường chỗ cho Practice.

## 5. Sửa lỗi trong pass này (từ code review + QA)

- CSS reveal fallback khóa trên `.js.reveal-ready` (controller init thành công) thay vì `.js` — tránh site ẩn nếu script fail.
- Trả `pointer: fine` gate cho scroll-drift hero (touch không drift, tránh chồng nội dung).
- `.scene[data-motion="on"]` → `[data-scene][data-motion="on"]` (selector không khớp class thật — sticky scene từng không bật).
- `heroH` init đúng lúc, `startEntrance()` khi bật lại motion, IO exit bỏ `will-change` scene, cache `.scene-line`.
- Fallback `vh` cho mọi `svh` mới; `<picture>` WebP→PNG cho teaser/about/fragments; `aria-current="true"` cho Work trên case pages; nav + page-head wrap ≤360px; bỏ CSS chết (`contact-links`, `h2 .thin`); bỏ mốc "June 2026" không có nguồn trên điểm Chat.
- Hero nav halo nhẹ để đọc trên portrait.

## 6. Giới hạn (ghi đúng, không suy diễn)

- Chưa test Safari/WebKit và thiết bị iOS thật; chưa đo trên mobile thật — kết quả trên là Chromium desktop emulation.
- Lighthouse = lab metrics, không phải field INP/LCP.
- Reduced-motion đổi giữa phiên đã được code theo contract (JS listener reset + QA ở mức load-time); chưa có test tự động cho việc đổi giữa phiên.
- Screenshots là Chromium; không có trace frame-time M1 — chấp nhận theo plan (dùng instrumentation tạm, không giữ suite).
