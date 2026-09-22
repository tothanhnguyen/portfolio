---
title: "Portfolio V2 — Editorial / Self–Fragment"
description: "Nâng cấp portfolio vanilla hiện có: bảo toàn hero, thêm About thực nghiệm và đưa sản phẩm thật thành trọng tâm Home."
status: implemented
priority: P1
tags: [frontend, experimental, accessibility, performance]
created: 2026-09-17
implemented: 2026-09-17
blockedBy: []
blocks: []
---

# Portfolio V2 — Editorial / Self–Fragment

> **Quyết định mới của user — thay thế hướng experimental cũ:** Home bỏ architecture overview và dùng project layout đơn giản; About bỏ hoàn toàn SELF / FRAGMENT, scroll-scrub và content motion. Kế hoạch hiện hành: [visual-revision-plan.md](visual-revision-plan.md) — **Simple Home / Static About**, trạng thái pending. Các yêu cầu fragment/experimental và kiểm thử tương ứng bên dưới chỉ là lịch sử V2, không được triển khai lại. Architecture trong project detail vẫn giữ.

## 1. Phạm vi và quyết định

Đây là **plan triển khai**, chưa thay đổi HTML/CSS/JS. Giữ HTML + CSS + JavaScript thuần, không framework, build pipeline, GSAP, WebGL hoặc video. Website tiếp tục hoạt động bằng static hosting.

- Home: editorial 7/10, chứng minh năng lực bằng sản phẩm thật.
- About: experimental 10/10 **về art direction**, không phải mật độ chuyển động. Một scene chủ đạo SELF / FRAGMENT.
- Project detail: technical 4/10, đọc được quyết định kỹ thuật và đóng góp cá nhân.
- Giữ khoảng 80% ý tưởng hero: T’NGUYEN, portrait, solid → person → outline, Bodoni, script, chữ Nhật, nền bạc ấm và đỏ trầm.
- Thứ tự Home: Hero → Selected Work → Capabilities → Stack → About teaser → Contact.
- Nội dung website tiếp tục bằng tiếng Anh; tên riêng tiếng Việt giữ dấu. Plan bằng tiếng Việt.

Không mở rộng sang CMS, contact form/backend, cursor tùy biến, SPA navigation, analytics hoặc design-system framework.

## 2. Bằng chứng từ repository và runtime

Đã đọc toàn bộ `index.html`, ba stylesheet, hai script, plan cũ, README, `.vercelignore`, favicon, CV; kiểm tra kích thước ảnh và xem portrait/reference. Repo không có project detail, About route, package/build/test setup hay screenshot sản phẩm trong assets.

| Hiện trạng | Bằng chứng | Hệ quả cho V2 |
|---|---|---|
| Token nhận diện rõ | `css/base.css:2–10`: #d8d7d4, #cfceca, #101010, #3a3a3a, #a33122; Bodoni Moda / Great Vibes / Noto Serif JP | Dùng tiếp, không đổi palette/font để tạo cảm giác mới |
| Hero có mask đúng ngôn ngữ thiết kế | `css/hero.css:54–116`, `js/effects.js:23–46` | Không tạo stacking context mới trên wordmark; bảo toàn đồng bộ portrait/outline |
| Responsive đã được chủ động xử lý | Hero ≤760px, landscape riêng, tablet 761–1024px; section ≤860px | Giữ breakpoint có lý do, không đồng loạt thay bằng bộ breakpoint mới |
| Selected Work có 2 project, chỉ text | `index.html:95–123` | Thiết kế 2 chapter đủ mạnh; không bịa project thứ ba |
| Focus là 3 card border + shadow + tilt | `css/sections.css:82–109`, `js/hero-extras.js:24–39` | Thay bằng list; xóa CSS/JS tilt tương ứng |
| Reveal mặc định ẩn | `css/base.css:40–46` | Chuyển sang progressive enhancement: nội dung mặc định hiển thị |
| Reduced-motion chưa bao phủ hover | Base chỉ rút animation duration; Focus/Stack vẫn transition | Tắt cả transition gây dịch chuyển; xử lý thay đổi preference khi trang đang mở |
| Hero chưa được IO-gate | Scroll listener trong `effects.js` tiếp tục gọi apply/mask sau khi hero ra ngoài viewport | IO chỉ kích hoạt scene còn liên quan; một lịch RAF cho mỗi controller |
| Thiếu main/nav/skip link, chưa có focus-visible riêng | Markup và styles hiện tại | Bổ sung semantics/navigation nhỏ gọn; không biến hero thành header dashboard |

### Baseline đã chạy

Static preview bằng Python HTTP server và Chromium:

- Desktop 1440×1000: xem hero và Selected Work; wordmark/portrait/outline giữ cá tính, project bên dưới có nhịp như CV.
- Mobile 390×844, touch/coarse pointer: xem hero sau entrance; viewport và scrollWidth đều 390px; hero cao 920px. Không ép hero về một màn hình làm mất metadata.
- Tablet 768×1024 và 1024×1024: scrollWidth bằng viewport; portrait tương ứng khoảng 553px / 650px; Focus chuyển một / ba cột theo breakpoint hiện tại.
- Tắt JavaScript: project có computed opacity 0, xác nhận nội dung bị ẩn.
- Reduced-motion khi load: toàn bộ reveal đọc được; Focus vẫn transition translate 0.45s, Stack vẫn transition padding-left 0.4s.
- Chưa profile frame-time, chưa test Safari/iOS hay thiết bị mobile thật; không coi các phép đo viewport trên là chứng nhận performance.

### Quan hệ plan cũ

`plans/260816-1228-portfolio-from-design/plan.md` đã đánh dấu xong phần implementation; deploy thủ công còn ghi chưa hoàn tất. V2 kế thừa mã hiện có, không phụ thuộc việc deploy cũ, không sửa lại lịch sử hay giả định website production đang ở trạng thái nào.

## 3. Những điểm cần điều chỉnh trong brief

1. **Không ép PROJECT 03.** Hiện có hai project được trình bày và chứng minh bằng CV. Nhịp full-width có thể đặt ở About teaser hoặc hình chi tiết của project, không tạo mục giả.
2. **“AI SYSTEMS / VISION” không đồng nghĩa kinh nghiệm production.** CV chứng minh AI-assisted engineering/agent orchestration; chưa có bằng chứng computer vision. Giữ THINK / SEE / ACT như hướng khám phá, dùng nhãn rõ “Exploring” ở Vision. Không thêm thành tích/model/project không có nguồn.
3. **10/10 không phải animation ở mọi viewport.** About có một sticky scene, phần practice/timeline là khoảng nghỉ đọc được. Không biến sáu chapter thành sáu màn hình bị giữ scroll.
4. **Không phóng cutout vô hạn.** Asset hiện tại 515×1115; crop cận mặt hoặc phóng quá lớn sẽ mềm trên màn hình Retina. Giới hạn kích thước/crop trước; chỉ xuất bản cutout lớn hơn từ `person.png` nếu kiểm tra thực tế cần.
5. **Không giữ magnetic link chỉ vì đã có.** Chuyển động link Contact không làm rõ depth/hierarchy; ưu tiên underline/focus ổn định. Đề xuất bỏ magnetic cùng card tilt, sau đó xóa `hero-extras.js` khi không còn chức năng hoặc caller.

## 4. Hệ thống dùng chung

- Giữ màu/font hiện tại; script chỉ ở chữ ký hoặc một closing accent, không dùng làm body.
- Bổ sung token khoảng cách, gutter, content measure, duration/easing tối thiểu trong `base.css`; tận dụng `clamp` và khoảng trắng hiện có.
- Display Bodoni lớn; metadata nhỏ nhưng đọc được; body khoảng 16–20px, dòng 1.6–1.8, measure 60–68ch trên trang kỹ thuật.
- Link underline/arrow nhẹ; `:focus-visible` rõ, không dựa vào màu riêng. Touch target quan trọng tối thiểu 44×44px.
- Shared metadata/section/footer/link styles đặt trong `base.css` khi thực sự dùng ở nhiều route; `sections.css` giữ layout Home. Không load CSS hero lên About/case study nếu không dùng.
- `effects.js`: reveal và footer dùng chung; hero-specific branch chỉ chạy khi có hero. About scene nằm riêng trong `about.js`, không dựng animation framework.
- `nav` đơn giản với Work / About / Contact; Home đặt gọn ngoài vùng portrait/wordmark, kiểm tra cân bằng với UIT/signature. About/case study có Home/Work và current-page state.
- `main`, skip link, một h1 mỗi route; section heading có thứ bậc. “SELECTED WORK” là heading thật, không chỉ kicker rồi nhảy h1→h3.
- Có nội dung HTML đầy đủ ngay khi JS không chạy. Chỉ thêm trạng thái chờ reveal sau khi controller đã khởi tạo thành công; fallback khi thiếu IO trả nội dung hiển thị.

## 5. Phases triển khai

Tất cả phase bên dưới **đã triển khai ngày 2026-09-17** (trạng thái ban đầu: pending). Thứ tự giữ theo priority của brief; phần nền dùng chung được làm tối thiểu ngay trước scene About. Bằng chứng kiểm thử: `qa/report.md` + thư mục `qa/`.

### P1 — About và SELF / FRAGMENT

**Files:** tạo `about/index.html`, `css/about.css`, `js/about.js`; sửa tối thiểu `css/base.css`, `js/effects.js`, navigation Home.

**Narrative:**

1. IDENTITY — `TÔ / THÀNH / NGUYÊN`, SOFTWARE ENGINEERING; portrait cùng nguồn với Home nhưng bố cục mới.
2. INTRODUCTION — “I BUILD SOFTWARE” và THINK / SEE / ACT; câu phụ phân biệt kinh nghiệm thực tế với hướng khám phá.
3. FRAGMENTS — một scene ảnh/typography, practice labels SOFTWARE / FRONTEND / AI / VISION.
4. PRACTICE — bốn mục ngắn trong luồng tài liệu bình thường, có dự án/nguồn liên quan; AI section phân biệt workflow Orca + OMP đang dùng với Laplace Demon — agent runtime Python đang phát triển, có provider tương thích OpenAI, tool boundary được validate, context/session memory hữu hạn và Telegram runtime; Vision gắn “Exploring”.
5. CONTEXT — timeline từ CV: UIT 2024–2028 (expected), Chat Jan–Jun 2026, MowStudio Jul–Sep 2026, Top 9 Student Leaders 2026; không bịa việc làm.
6. CONTACT — closing gọn, email, GitHub, résumé, đường về Selected Work.

**Composition:** năm mảnh portrait lớn + một mảnh typography; tối đa sáu fragment. Các mảnh ảnh dùng chung một hệ tọa độ canvas và cùng source để ghép lại thật sự khớp. Clip polygon tĩnh, không morph clip-path mỗi frame. Không nhân sáu crop độc lập tới mức mất khả năng reconstruction. Vùng mặt nằm trong mảnh trung tâm, chuyển động ít nhất.

- Desktop >1024px và viewport đủ cao: stage sticky, scene ban đầu khoảng 220–260svh, tinh chỉnh theo nhịp đọc; không scroll-jacking.
- Tablet 761–1024px: ít nhất giữ mặt và chữ đọc được; giảm translation còn khoảng một nửa, rotation tối đa khoảng 2°; không lệ thuộc hover.
- Mobile ≤760px hoặc viewport quá thấp: bố cục dọc, khoảng ba mảng ảnh tĩnh, không sticky runway dài; reveal một lần nếu cho phép motion. Không dùng pointer type để quyết định duy nhất độ phức tạp scene.
- Toàn bộ fragment trang trí `aria-hidden`; một ảnh ngữ nghĩa hoặc mô tả portrait duy nhất. Labels/thông tin quan trọng tồn tại trong heading/practice, không chỉ trong ảnh hoặc trạng thái scroll.

**Scroll choreography:**

| Progress | Hình ảnh | Typography |
|---|---|---|
| 0–0.15 | Chân dung gần ghép hoàn chỉnh | SELF / identity |
| 0.15–0.45 | Mở khe giữa mảnh, tâm mặt ổn định | Practice labels bắt đầu hiện |
| 0.45–0.65 | Separation lớn nhất, không “nổ” | SOFTWARE / FRONTEND / AI / VISION có thứ bậc |
| 0.65–0.85 | Mảnh bắt đầu trở về; chữ nổi bật hơn | Một câu kết nối các practice |
| 0.85–1 | Reconstruction rõ, stage nhường chỗ cho Practice | Nội dung tiếp theo không bị đè |

Dùng interpolation piecewise + smoothstep giữa keyframe; scroll ngược phải đảo hoàn toàn, không tích lũy transform. Có thể dùng word-line reveal với overflow wrapper và translateY; không animate từng paragraph.

**Controller contract:**

- State tối thiểu: active, enabled, pending RAF id, geometry, last progress.
- IO kích hoạt scene; passive scroll chỉ queue tối đa một RAF khi active. Không có self-scheduling loop lúc idle.
- Read geometry trước, write transform/opacity sau. Cache bounds ổn định, invalidate qua resize/ResizeObserver, image decode, fonts ready; initial frame dùng đúng vị trí scroll hiện tại, kể cả hash link/history restore.
- `p = clamp((scrollY - sceneTop) / max(sceneHeight - stageHeight, 1), 0, 1)`.
- Per-fragment translate3d/rotate/scale nhỏ, opacity khi cần. CSS custom properties scope ở stage/fragment, không root toàn site.
- IO exit: bỏ will-change, hủy frame thừa; trạng thái boundary xác định được khi cuộn nhanh qua scene rồi quay lại. `visibilitychange` dừng công việc khi tab ẩn.
- Reduced-motion có từ đầu **và đổi trong phiên**: cancel RAF, tháo scrub listener, reset inline motion, bỏ sticky height, hiển thị composition đọc được và toàn bộ practice. Khi bật lại, đo geometry và render vị trí hiện tại.
- Không có IO/clip-path hoặc JS fail: portrait + text trong layout tĩnh, không để sáu ảnh chồng sai hay section trắng.

**Acceptance:** mở trực tiếp `/about/`, refresh/back/hash đều đúng; screenshot tại p=0/.2/.5/.75/1 và scroll ngược; vẫn nhận diện cùng một người; không che CTA; mobile và reduced-motion không cần scrub để đọc hết.

### P2 — Selected Work và project detail

**Files:** sửa `index.html`, `css/sections.css`; tạo `projects/mowstudio/index.html`, `projects/chat-server/index.html`, `css/project.css`; thêm media thật vào `assets/projects/` khi đã kiểm nguồn.

**Home:**

- Chapter 01: text trái, visual lớn phải; `01 / July 2026 — Sep 2026`, MOWSTUDIO, một câu “Booking infrastructure for creative studios.”, khoảng ba stack labels, VIEW PROJECT.
- Chapter 02: visual trái, text phải; Chat Server Microservices, một câu giải thích real-time/distributed system, team context và personal contribution ngắn.
- Không box/card/shadow; dùng grid bất đối xứng, khoảng trắng, caption nhỏ. Visual có thể vượt grid text nhưng không vượt viewport.
- Mobile DOM reading order nhất quán: số/tên → premise → visual/caption → links. Desktop đổi grid placement, không đảo tab order.
- Technical detail dài chuyển sang case study; giữ link source repo riêng, không đánh đồng VIEW PROJECT với GitHub.

**Nguồn media và content gate:**

- Portfolio local chưa có screenshot sản phẩm. Trước khi final layout: tìm screenshot trong repository/README/public deployment của hai dự án; nếu cần capture, dùng app thật và dữ liệu demo an toàn.
- MowStudio có tài liệu kỹ thuật và SVG thật: [overview](https://github.com/tothanhnguyen/studio-booking-web/blob/main/docs/reports/mowstudio-project-overview.md), [architecture](https://github.com/tothanhnguyen/studio-booking-web/blob/main/docs/reports/mowstudio-architecture.svg).
- Chat có [README architecture và module list](https://github.com/Ncyntrq/ChatServerMicroservices). Có thể biên tập thành SVG tĩnh giản lược đúng nguồn, caption “Architecture overview”, không giả làm screenshot sản phẩm.
- Ưu tiên Mow booking/calendar screenshot và Chat client/file-service diagram. Không dùng stock studio photo làm bằng chứng frontend đã build.
- Nếu không truy cập được UI thật: dùng diagram xác thực, không fake dashboard và không placeholder. Thiếu quyền truy cập ảnh không chặn About. Ghi rõ nguồn/phạm vi sơ đồ và đóng góp cá nhân.
- Media copy local, tối ưu WebP, kích thước/srcset nếu cần, width/height hoặc aspect-ratio, lazy-load dưới fold. Screenshot không được lộ PII, token, thông tin thanh toán thật.

**Case study 4/10:** title/premise → metadata (role, team, period, stack) → problem → solution/architecture → personal contribution → trade-offs → evidence → source/next project. Typography nhỏ hơn Home, body có measure, sơ đồ đọc được; không portrait scrub, parallax hay các con số thành tích không kiểm chứng.

Mow: modular monolith, service/repository boundaries, booking concurrency, payments. Chat: common-lib/contracts, file-service/MinIO, event-driven logging và phần team ownership. Số test/score chỉ ghi nếu khớp nguồn và có mốc, không đổi test-file count thành số tests.

**Acceptance:** hai chapter khác nhịp, có visual chứng thực; hai detail route có nội dung thật và navigation hai chiều; mọi external/source link hoạt động; refresh direct route không 404 trên static preview.

### P3 — Capabilities thay Focus cards

**Files:** sửa `index.html`, `css/sections.css`, loại bỏ card tilt trong `js/hero-extras.js`.

- Heading CAPABILITIES / 03; ba hàng WEB SYSTEMS, MICROSERVICES, AI-ASSISTED ENGINEERING.
- Mỗi hàng có số, tên lớn, rule mảnh, mô tả luôn đọc được. Không floating card, percentage bar hoặc badge cloud.
- AI mô tả orchestration/review/testing hiện có, không nâng thành claim AI product production.
- Mặc định không cần panel động: hover/focus-within chỉ đổi accent/underline, có thể nhích phần chữ vài px bằng transform. Nếu thêm visual đổi theo hàng, chỉ là bổ trợ; liên kết tới case study/practice là phần tử focusable thật, không thêm tabindex lên text thuần.
- Bỏ `.focus-grid`, `.focus-card`, tilt listeners và shadow/lift tương ứng sau cutover; giữ/sửa anchor `#focus` hợp lý, không để link cũ bị mất đích.

**Acceptance:** nhìn như một editorial index, cả ba description có trên touch/keyboard/no-JS; không có thông tin chỉ xuất hiện khi hover.

### P4 — About teaser trên Home

**Files:** sửa `index.html`, `css/sections.css`.

- Bỏ biography dài khỏi Home và chuyển dữ kiện cần thiết sang About Context.
- Teaser dùng negative space + crop portrait hiện có + “SOFTWARE ENGINEER / EXPLORING SYSTEMS THAT / THINK / SEE / ACT”.
- CTA rõ “ENTER PROFILE →” tới `/about/`; phần chữ là HTML, không bake vào ảnh.
- Full-width editorial composition ở đây cung cấp nhịp thứ ba mà không cần bịa project.
- Chỉ một reveal nhẹ; không tạo fragment scene thứ hai trên Home.
- Chuyển scroll-hint hero từ `#about` sang `#projects`; teaser có thể giữ id `about` để các anchor cũ còn ý nghĩa.

**Acceptance:** Home không còn hai đoạn biography dài; link About đọc được ngay, portrait không che text ở 320px; nội dung không chỉ là ảnh crop trang trí.

### P5 — Stack, Contact và hero polish

**Files:** sửa `index.html`, `css/base.css`, `css/hero.css`, `css/sections.css`, `js/effects.js`; xóa `js/hero-extras.js` và script reference sau khi không còn caller.

- Stack giữ list lớn: tên trái, 01–04 phải, technology description dòng dưới; nhóm Java / TypeScript / C#–.NET / DevOps. Giữ thông tin PHP/Laravel/SQL ở dòng phụ phù hợp, không vô tình mất nội dung đang có.
- Bỏ hover animate padding-left gây layout; dùng transform trên nội dung hoặc màu/rule. Không khiến list tĩnh trông như nút bấm nếu không có action.
- Contact giữ email/GitHub/LinkedIn/phone/résumé; một CTA email chính, secondary links nhẹ. Có wrap cho email dài, touch area, focus-visible; không form.
- Hero chỉ chỉnh khoảng cách/alignment/metadata và entrance nhỏ. Không transform/opacity/filter parent của wordmark khiến outline rơi sau portrait; giữ text/person/outline invariant trên desktop lẫn mobile.
- IO-gate hero parallax/mask; một RAF scheduler hợp nhất mouse và scroll để không apply hai lần cùng frame. Parse depth coefficients một lần, không mỗi frame.
- Thay timer mask 24×150ms bằng đồng bộ theo load/decode/fonts/resize và RAF hữu hạn trong entrance nếu đo cần; dừng khi entrance/parallax ổn định. Không bỏ mask sync khiến outline lệch lúc ảnh/font tải chậm.
- Đổi motion preference trong phiên phải reset translate/opacity; pointer rời hero đưa offset về neutral bằng animation hữu hạn.
- Tắt wheel hint vô hạn hoặc đổi thành cue tĩnh; không giữ animation chỉ để trang luôn chuyển động.

**Acceptance:** hero vẫn nhận ra là bản gốc, mask theo sát người; liên kết không chạy khỏi con trỏ; khi hero ngoài viewport không còn layout/mask write do scroll.

### P6 — Responsive / performance / accessibility pass

Không thêm permanent test suite chỉ để chứng minh visual change. Dùng browser thật + smoke script tạm cho các invariant; regression test chỉ giữ nếu bảo vệ một lỗi state/behavior có khả năng tái phát.

**Ma trận:**

- Desktop: 1280×800, 1440×900, 1920×1080.
- Tablet: 768×1024, 1024×768; kiểm các cạnh 760/761 và 860/861.
- Mobile: 320×568, 390×844, 430×932; portrait/landscape, touch/coarse.
- Chromium + Safari/WebKit; iOS thật nếu có. Nếu không có thiết bị, ghi đúng giới hạn, không suy ra “smooth mobile” từ desktop resize.
- Default / reduced-motion trước load / đổi preference trong phiên / JavaScript off / font hoặc ảnh tải chậm / zoom 200% / keyboard-only.

**Visual:** Home hero không bị thay identity; không crop mất mặt/chữ; chapter nhịp trái-phải; About tại các mốc progress và scroll ngược; không blank space quá dài ở mobile/reduced-motion; project detail thực sự dễ đọc.

**Behavior:** navigation/skip/back/anchor/direct route; CTA luôn click/focus được; không duplicate accessible portrait/heading; tab order theo reading order; ảnh có alt/caption đúng loại. Đo contrast 4.5:1 body, 3:1 large text; kiểm clipping chứ không chỉ scrollWidth vì overflow hidden có thể che lỗi.

**Performance acceptance targets — phải đo, không hứa trước:**

- Không tăng số font family, không có framework/motion-library runtime mới, không video/frame sequence.
- Tối đa sáu fragment desktop, mobile giản lược; không per-frame filter, blur, shadow hay animate geometry.
- Không outstanding/scheduled animation work khi scene idle sau settle hoặc offscreen; kiểm Performance trace và RAF callback count bằng instrumentation tạm.
- Ưu tiên work của animation dưới khoảng 4ms/frame trên M1; không recurring long task >50ms do scene. Nếu vượt, giảm vùng layer/khoảng dịch chuyển/filter trước khi cân nhắc thư viện.
- Ngân sách định hướng JS riêng toàn site ≤20KB gzip; đo và báo actual, không dùng budget này để bỏ chức năng.
- LCP ≤2.5s / CLS ≤0.1 là mục tiêu lab với cấu hình network/CPU được ghi lại; không coi Lighthouse là field INP hay chứng minh mọi điện thoại đều mượt.
- Audit network cho portrait dùng chung cache, ảnh dưới fold lazy và kích thước được giữ chỗ. Font Nhật, fixed grain và hero drop-shadow hiện có là điểm cần profile trước khi kết luận nhẹ.

**Acceptance:** lưu screenshot/trace kết quả thực thi; link/console/network không có lỗi do thay đổi; mọi hạn chế kiểm chứng ghi rõ. Không hoàn tất V2 chỉ vì HTML render được.

## 6. File map và ownership

| File | Thao tác | Trách nhiệm |
|---|---|---|
| `index.html` | Sửa | Giữ hero; reorder Home, chapter/list/teaser/nav/semantics |
| `css/base.css` | Sửa | Token/shared type/links/focus/reveal fallback/grain |
| `css/hero.css` | Sửa ít | Hero responsive/entrance polish, giữ mask layering |
| `css/sections.css` | Sửa | Home editorial layout; bỏ card styles |
| `js/effects.js` | Sửa | Shared reveal/year, hero-only motion có lifecycle |
| `js/hero-extras.js` | Xóa khi đã cutover | Magnetic/tilt không còn cần; remove script caller |
| `about/index.html` | Tạo | Sáu chapter profile, static route |
| `css/about.css` | Tạo | Fragment/sticky/mobile/static compositions |
| `js/about.js` | Tạo | Scene progress, interpolation, lifecycle |
| `projects/mowstudio/index.html` | Tạo | Case study thật |
| `projects/chat-server/index.html` | Tạo | Case study thật |
| `css/project.css` | Tạo | Readable technical layout dùng chung hai case |
| `assets/projects/*` | Thêm có kiểm nguồn | Screenshot/diagram thật, tối ưu local |

Không cần `common.js`, component registry, JSON content engine, router hoặc CSS framework. Shared header/footer ngắn có thể viết HTML trực tiếp ở bốn page. Root-relative route/resource URLs theo domain-root deployment; verify Vercel trailing-slash/direct access, không thêm rewrite fallback SPA.

Nếu chia việc: chốt shared CSS/reveal contract trước; About và thu thập media/case content có thể độc lập. `index.html`, `base.css`, `sections.css`, `effects.js` có một integration owner, tránh cùng sửa và cùng chạy validation giữa chừng.

## 7. Asset inventory / không xóa mù

| Asset | Kích thước xấp xỉ | Trạng thái |
|---|---|---|
| `assets/pose-cutout.webp` | 53.4KB, 515×1115 | Đang dùng picture source và CSS mask; giữ |
| `assets/pose-cutout.png` | 532.4KB, 515×1115 | Đang dùng fallback img và OG; giữ, không gọi là unused |
| `person.png` | 1.7MB, 1024×1536 | Source portrait, không referenced runtime; đã loại khỏi Vercel deploy |
| `pose.png` | 853.5KB, 1920×1080 | Design reference, không referenced runtime; đã loại khỏi deploy |
| `assets/uit-logo.png` | 8.1KB, 116×94 | Đang dùng logo; giữ |
| `assets/favicon.svg` | 266B | Đang dùng; giữ |
| `ttnguyen_resume.pdf` | 28.2KB | Đang link; giữ |

Không có asset nào được xóa trong lượt lập plan. Chỉ đề xuất chuyển/xóa source PNG sau khi báo và được đồng ý. Các PNG source không tăng network payload hiện tại vì không referenced/deployed. Nếu đổi OG image, cập nhật mọi route và xác nhận crawler support trước khi bàn bỏ PNG fallback.

## 8. Dependencies và điểm chưa biết

- **Không có blocker kiến trúc:** About và shared improvements dùng được asset hiện tại.
- **Media:** chưa xác minh screenshot nào đủ chất lượng để làm chapter hero, chưa capture app live. Đã tìm được nguồn diagram thật; phase P2 phải đóng content gate trước khi bàn giao, không để placeholder.
- **Computer vision:** chưa có evidence trong repo/CV; plan chọn nhãn khám phá, không cần chặn triển khai để hỏi thêm.
- **Hosting:** cấu trúc và `.vercelignore` hướng Vercel static, nhưng chưa xác minh deployment hiện tại. Không deploy/push trong scope plan.
- **Plan cũ:** không có dependency bắt buộc; các ghi chú lịch sử không thay cho bằng chứng runtime hiện tại.

## 9. Checklist Definition of Done

- [x] T’NGUYEN và text/person/outline được bảo toàn, hero chỉ polish. (qa/home-desktop-1440.png, home-hero-final.png)
- [x] Home chuyển từ résumé layout sang editorial chapters với media thật. (2 chapter, SVG xác thực từ repo)
- [x] `/about/` có SELF / FRAGMENT bằng DOM/CSS/vanilla JS, không video/WebGL. (qa/about-p0…p1.png)
- [x] Motion phục vụ depth/fragmentation/reconstruction/typography, không generic effects. (scrub 5 mốc + đảo chiều khớp chính xác)
- [x] Không runtime framework mới; performance được đo, scene dừng đúng lifecycle. (JS 5.6KB gzip; TBT 0; IO-gate; qa/report.md)
- [x] Mobile có composition riêng, không thu nhỏ sticky desktop. (3 mảng dọc, data-motion=null ở 390/320)
- [x] Reduced-motion và no-JS đọc đủ thông tin, không khoảng trống scrub dài. (QA tự động ✓)
- [x] Real engineering work, team/personal contribution và claim AI/Vision được phân biệt. (case studies; Vision gắn "Exploring")
- [x] Website tự chứng minh frontend craft bằng typography, motion và khả năng truy cập. (Lighthouse a11y 1.0 mọi route)
- [x] Không clone branding khác, HUD/cinema UI, fake product visual hoặc template card grid. (chỉ diagram xác thực + caption ghi nguồn)

## 10. Bước tiếp theo

**Đã hoàn thành P1 → P6 ngày 2026-09-17.** LCP lab (mobile simulated) 3.6–4.1s do chuỗi webfont — giữ làm điểm profile tiếp; chưa test Safari/iOS/thiết bị thật. Không deploy/push trong scope plan. Bằng chứng: `qa/report.md`, thư mục `qa/` (screenshots).
