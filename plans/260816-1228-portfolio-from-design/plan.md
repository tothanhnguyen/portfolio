# Portfolio từ ảnh thiết kế (pose.png)

## Mục tiêu
Single-page portfolio tĩnh tái hiện hero editorial trong `pose.png`, hiệu ứng cơ bản, deploy Vercel. KHÔNG git push.

## Phân tích thiết kế
- Nền xám nhạt (#d9d9d9), typography serif display cực lớn "T'NGUYEN" + outline "GUYEN" đè lên người
- Chữ Nhật フルスタックデベロッパー, script "Software", chữ ký đỏ "Thành Nguyên", ngày 01-01-2006
- UIT logo/top-left, info block (role/location/focus/stack/mindset) bottom-left, contact bottom-right
- Nội dung: Full-stack Developer & AI Agent Orchestrator, Vietnam, Web Systems + Desktop Apps, Java/C#/.NET/JS, github.com/tothanhnguyen, tothanhnguyen2006@gmail.com, 0383993152

## Stack (KISS)
Static HTML + CSS + vanilla JS (không framework, không build). Deploy Vercel static.

## Cấu trúc
```
index.html
styles.css
script.js
assets/pose-cutout.png  (rmbg từ pose.png)
assets/pose.png
vercel.json (optional)
```

## Sections
1. Hero — tái hiện layout ảnh: text HTML + ảnh người đã tách nền, layer: bg → solid T'NGUYEN → person → outline GUYEN + script Software
2. About/Focus — editorial 2 cột từ info block
3. Skills/Stack — Java, C#/.NET, JavaScript
4. Contact/Footer — email, phone, github
5. Hiệu ứng: fade/slide-in on load, scroll reveal (IntersectionObserver), parallax nhẹ hero, hover links, marquee text

## Steps
- [x] Plan
- [x] Tách nền person (rembg py39 venv + lọc alpha component, webp 75KB)
- [x] Dựng HTML/CSS/JS (index.html, css/base|hero|sections.css, js/effects.js)
- [x] Verify local: screenshot desktop 1920 + mobile 390 + full sections — OK
- [x] Code review — 0 critical; đã fix: img width/height (CLS), OG meta + favicon, tel:+84, lang="ja", marquee hover-pause, uit font floor, html overflow-x clip, gộp nhánh JS thừa
- [x] Thay ảnh sạch user cung cấp: person.png → cutout 515x1115 (không dính chữ), crop ống chân theo khung thiết kế
- [x] Logo UIT thật (assets/uit-logo.png, đã bỏ nền trắng) thay SVG tự vẽ
- [x] Fix responsive: person neo theo hero `min(100vh,100vw)` (không bao giờ cắt đầu), mobile hero-top xếp cột
- [x] Verify: 1920/1440/1280/500 — OK. Lưu ý: headless Chrome ép min-width 500px nên shot 390 bị cắt giả
- [x] Outline wordmark đúng cơ chế thiết kế: bản sao T'NGUYEN trùng khít, mask theo cutout người (chỉ hiện chỗ bị che), JS sync mask khi load/resize/parallax/scroll
- [x] Hiệu ứng bổ sung (user chọn): preloader đếm 0→100% trượt lên, scroll-out parallax hero (data-scroll per layer + fade), magnetic contact links, focus card tilt 3D. File mới: js/hero-extras.js
- [~] Deploy Vercel — user tự deploy (CLI đã cài, chưa login). Lệnh: `vercel login && vercel --prod`

## Rủi ro
- Text baked trên áo (outline GUYEN, script Software) còn dính trên cutout → che bằng overlay text CSS cùng vị trí
- Responsive: hero chuyển stack dọc trên mobile
