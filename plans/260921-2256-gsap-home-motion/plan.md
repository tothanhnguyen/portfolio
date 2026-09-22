---
title: "GSAP trial — Home entrance choreography (A/B spike)"
status: implemented
priority: P2
tags: [frontend, motion, performance, experimental]
created: 2026-09-21
blockedBy: []
blocks: []
---

# GSAP trial — Home entrance choreography (A/B spike)

## 1. Câu hỏi quyết định

User hỏi: *nếu dùng thư viện GSAP để cải thiện hoạt ảnh trang chủ — các section đầu tiên — thì sao?*

Đây là **plan thử nghiệm có cổng quyết định**, không phải quyết định adopt. Kết thúc plan phải trả lời được:

1. GSAP có làm section entrance của Home **đẹp hơn đáng kể** so với bản nâng cấp vanilla cùng hiệu ứng không?
2. Chi phí ~46KB gz + dependency ngoài có xứng đáng mức cải thiện đó không?
3. Giữ hay bỏ, với bằng chứng đo được?

## 2. Bằng chứng hiện tại (đo ngày 2026-09-21)

| Hạng mục | Số đo |
|---|---|
| `gsap.min.js` 3.13.0 (CDN, gzip -9) | 28.182 bytes |
| `ScrollTrigger.min.js` 3.13.0 (gzip -9) | 17.841 bytes |
| Tổng bộ GSAP tối thiểu cho scroll work | **~46 KB gz** |
| `js/effects.js` (current) | **~3.4 KB gz** |
| About portrait JS | **0 bytes gz** (static image; previous `about-video.js` removed) |
| JS toàn site hiện tại | **~3.4 KB gz** |

Hệ quả: thêm GSAP làm JS site tăng từ ~3.4KB lên ~49KB gz, vượt ngân sách ≤20KB gz đã ghi trong plan V2 gốc. Đây là thay đổi căn bản bản chất "lightweight vanilla" của portfolio — phải trả lời bằng chất lượng chuyển động thật, không bằng cảm giác "thư viện chắc chuyên nghiệp hơn".

### Trạng thái motion của Home hiện tại

- **Hero**: entrance CSS keyframes + mouse/scroll parallax vanilla, IO-gated, một RAF scheduler — đã tốt, là bản sắc. **Không nằm trong scope thử nghiệm này** (brief gốc: giữ ~80% hero).
- **Selected Work / Capabilities / Stack / teaser / Contact**: mỗi phần tử có `data-reveal` fade-up đồng nhất `translateY(34px)` + opacity, threshold 0.15. Tất cả chuyển động giống nhau — **điểm yếu thật là thiếu choreography, không phải thiếu engine**.
- Không có stagger, không line-reveal, không nhịp giữa các phần tử trong cùng section.

## 3. Phân tích trade-off

### GSAP + ScrollTrigger mang lại gì thật sự

| Lợi ích | Đánh giá trung thực |
|---|---|
| Timeline stagger: từng dòng chữ/dòng list lệch nhịp 60–90ms | Đúng, viết nhanh. Nhưng cũng làm được bằng `transition-delay` theo index hoặc IO stagger — ~40 dòng vanilla |
| `gsap.matchMedia()` cho reduced-motion/pointer | Gọn, nhưng site đã có pattern MQL + `data-motion` tự viết hoạt động ổn ở 2 controller hiện có |
| ScrollTrigger scrub/refresh: xử lý resize, mobile URL-bar, pinning chắc tay hơn hand-rolled | **Lợi ích thật nhất** — nếu cần scrub-linked scene. Hiện tại Home không có scene nào cần scrub |
| Easing/rich interpolation | CSS `cubic-bezier` + 1 hàm smoothstep đã đủ cho entrance |

### Chi phí

- **+~46KB gz JS** (block hoặc thêm 1–2 request; deferred vẫn chiếm parse/compile trên mobile).
- Dependency ngoài (CDN) hoặc vendored file phải maintain — site hiện tại **zero dependency**, đây là một selling point của portfolio ("website tự chứng minh frontend craft không cần framework").
- Brief gốc V2 từng ghi rõ "Do NOT introduce GSAP immediately" — vanilla path chưa được push đến giới hạn thì chưa có căn cứ kết luận vanilla không đủ.
- Rủi ro motion creep: có ScrollTrigger sẵn thì rất dễ thêm pin/scrub → trượt về scroll-jacking đã cấm.

### Nhận định sơ bộ (chưa phải kết luận)

90% giá trị cải thiện nằm ở **choreography** (line-mask reveal, stagger theo hàng, nhịp giữa section), không nằm ở engine. Vanilla có thể đạt ~85% cùng hiệu ứng với ~2KB thêm vào. GSAP chỉ thắng rõ nếu spike cho thấy timeline orchestration tiết kiệm effort đáng kể HOẶC cần scrub scene mà hand-rolled đạt không nổi độ ổn định.

Vì vậy plan này **không chọn trước kết quả**: làm A/B spike cùng một bộ hiệu ứng trên hai engine, đo, rồi quyết.

## 4. Bộ hiệu ứng dùng cho thử nghiệm (giống nhau ở cả hai nhánh)

Chỉ áp cho **các section đầu Home** (Selected Work, Capabilities; Stack + teaser + Contact chỉ nhận mức nhẹ):

1. **Line-mask reveal** cho `section-title`, `project-name`, `cap-name`: mỗi dòng bọc trong wrapper `overflow:hidden`, chữ vào từ dưới bằng `translateY(100%) → 0`, stagger 70ms — đúng "typography motion" của brief gốc.
2. **Row stagger**: `project-row`, `cap-row` vào bằng y+opacity lệch nhịp 80ms, thay fade-up đồng loạt hiện tại.
3. **Meta fade-after**: num/meta/stack/CTA fade sau title 150ms — tạo phân cấp thời gian.
4. **Không làm**: pin, scrub scene, snap, parallax scrub trên text-only rows, counter, marquee, bất kỳ hiệu ứng nào không thuộc 3 điểm trên. Hero không đụng.

Ràng buộc chung cả hai nhánh:

- Transform/opacity chỉ; không animate layout property.
- Reduced-motion: mọi thứ hiện tĩnh (pattern `.js.reveal-ready` hiện có hoặc `gsap.matchMedia`).
- No-JS: nội dung hiển thị đầy đủ (progressive enhancement giữ nguyên).
- Mobile nhận stagger nhẹ hơn (≤2 bậc) nhưng không bị tắt motion.
## 4b. Opening experience — tham khảo huyml.co (quan sát trực tiếp 2026-09-21, 1440×900)

### Chuỗi mở đầu quan sát được

| Thời điểm | Trạng thái |
|---|---|
| 0 – ~1.5s | Nền trắng trống (tài nguyên đang tải) |
| ~2.1s | Bảng đen phủ toàn màn, khe trắng mỏnh bên trái |
| ~2.4 – 3.2s+ | Mascot vẽ tay (cậu bé đội mũ ngược, áo hoa sao) **đẩy mép rèm đen mở ra**, có vệt nỗ lực — animation Rive canvas |
| Mid-transition | Splash chữ đỏ display serif khổ lớn + mascot |
| Settled | Hero: wordmark dọc "HUYML ©" sống lề trái, thác ảnh card nghiêng, micro-typography UI thưa |

Tổng thời gian chặn: **~3–4s**. Stack: **Rive (2 canvas) + JS module tự viết — không GSAP, không Lenis, không Three**.

### Nguyên lý chuyển được (bản dịch, không clone)

1. **Threshold moment:** trang cảm giác "đóng" rồi "mở" — hiện Home load thẳng vào hero, entrance chữ đã có stagger nhưng thiếu nhịp "cửa mở".
2. **Agent of reveal:** huyml dùng mascot đẩy rèm; DNA của mình là **person + wordmark** — rèm ink trượt mở, để chuỗi entrance hiện có (letter-rise 0.55–1.04s, person-in, outline fade) đóng vai reveal. Không dựng mascot, không vẽ nhân vật mới.
3. **Splash → handoff:** chữ hiệu lớn trên/gần rèm rồi giao lại cho hero — T'NGUYEN wordmark hoặc chữ ký script đỏ làm dấu trên rèm.

### Ràng buộc opening (cả hai nhánh A/B)

- Rèm **ink `--ink`**, tối đa **1.5s** (huyml chặn 3–4s vì phải đợi Rive; mình không có media nặng — không kéo dài giả tạo).
- **Không fake loading counter** — không có gì thật sự cần đếm.
- `sessionStorage`: nhịp đầy chỉ lần đầu mỗi session, lần sau vào thẳng (rèm không lặp lại gây khó chịu).
- Reduced-motion: **không có rèm**, vào thẳng nội dung.
- No-JS: không bao giờ có rèm (rèm phải do JS gắn sau load, không nằm sẵn trong CSS chặn nội dung).
- Ảnh person (LCP) tải bình thường bên dưới rèm; rèm chỉ là overlay transform, không delay network.

### Tác động đến câu hỏi GSAP

Tham chiếu user chọn **không dùng GSAP cho opening** — nó dùng Rive canvas + JS tự viết. Một rèm curtain + staged reveal là 2 overlay transform + keyframes hiện có, ~1KB vanilla. Opening experience thuộc **nhánh P-A baseline**, không phải lý do adopt GSAP.

## 5. Phases

### P-A — Nhánh vanilla (làm trước, là baseline)

**Files:** `js/effects.js`, `css/base.css`, `css/sections.css` (markup wrapper dòng nếu cần).

- [x] Mở rộng controller reveal hiện có: stagger theo `data-reveal-group` + `--i` index, line-mask wrapper class.
- [x] Bộ hiệu ứng mục 4, cả 3 điểm.
- [x] Opening curtain (mục 4b): rèm ink ≤1.5s do JS gắn sau load, sessionStorage một lần/session, reduced-motion + no-JS bỏ qua; chụp chuỗi 0/0.4/0.8/1.2/1.5s.
- [x] Chụp 1440×900 + 390×844 lúc scroll qua từng section; ghi cảm nhận nhịp.
- [x] Đo: JS gz thêm vào, long task khi khởi tạo, RAF đỉnh khi cuộn qua section.

**Gate P-A:** Vanilla đạt nhịp mong muốn trong smoke test desktop/mobile → **đóng plan, không chạy P-B/không thêm GSAP**. Đây là kết quả rẻ nhất.

**Kết quả P-A (2026-09-21):** Vanilla đủ nhu cầu; không chạy P-B/không thêm GSAP.

- Home opening: ink curtain có `sessionStorage`, lift qua transform, hero entrance chạy sau curtain; bug selector root/panel đã sửa bằng `curtain-active`.
- Selected Work/Capabilities/Stack: title mask + row stagger + meta fade; native wheel scroll xác nhận các row nhận `.is-visible`, delay 0/90/180ms.
- Payload: `effects.js` 3.402 bytes gz; About portrait không cần JS; tổng JS hiện khoảng **3.4KB gz**. CSS: base 2.875, hero 3.044, sections 1.642 bytes gz.
- Verification: desktop 1440×900 + native wheel section scroll; mobile 390×844 reduced-motion (0 MP4 request, 0 hidden reveals), no-JS (no curtain, 0 hidden reveals), Home/About HTTP 200, runtime page errors 0.
- Không đo được long-task/RAF peak ổn định trong hidden headless tab; dùng native wheel và runtime smoke thay thế. Chưa test Safari/iOS thật.

### P-B — Nhánh GSAP (chỉ chạy nếu P-A chưa đạt)

**Files:** `index.html` (script tag hoặc dynamic import), `js/home-motion.js` mới (tự viết, không đụng `effects.js`).

- [ ] Load GSAP+ScrollTrigger **deferred, chỉ ở Home**, đăng ký plugin, `gsap.matchMedia()` cho reduced-motion.
- [ ] Cùng bộ hiệu ứng mục 4 bằng timeline + ScrollTrigger `toggleActions` (không scrub).
- [ ] Không xóa nhánh vanilla — tách nhánh/flag để so sánh cùng lúc.

**Gate P-B (kill criteria rõ ràng):**
- Nếu JS gz toàn site vượt **20KB** → chấp nhận chỉ khi user duyệt explicitly mức vượt (viết vào plan kết quả).
- Nếu frame time khi cuộn qua section > ~8ms trung bình hoặc có long task >50ms khởi tạo → fail.
- Nếu hiệu ứng GSAP không khác biệt thị giác với P-A ở screenshot đối chiếu cùng viewport → **chọn vanilla, gỡ GSAP sạch**.

### P-C — Đo đối chiếu và quyết định

- [ ] Bảng so sánh: bytes gz, requests, TBT/long task, số dòng code maintain, chất lượng thị giác (screenshot từng mốc stagger).
- [ ] Kiểm reduced-motion + no-JS + mobile 390 ở nhánh thắng.
- [ ] Quyết định ghi lại ở plan này: nhánh nào giữ, lý do, metric.
- [ ] Nhánh thua bị gỡ hoàn toàn (file + script tag + CSS riêng), không để dead code.
- [ ] Hero xác nhận không đổi trên cả hai nhánh.

## 6. File map

| File | P-A (vanilla) | P-B (GSAP) |
|---|---|---|
| `js/effects.js` | Mở rộng stagger/line-reveal | Không đổi |
| `js/home-motion.js` | — | Tạo (GSAP timelines) |
| `css/base.css` / `css/sections.css` | Line-mask wrapper, stagger var | Ít hơn (GSAP tự inline style) |
| `index.html` | Markup wrapper dòng | + script GSAP (CDN defer hoặc vendor `assets/vendor/`) |
| `css/hero.css`, hero markup | Không đụng | Không đụng |

CDN vs vendor: nếu P-B thắng, **vendor file vào repo** (`assets/vendor/gsap*.min.js`) thay vì CDN — portfolio không nên có runtime dependency mạng; ghi rõ version và license (GSAP standard license, dùng miễn phí).

## 7. Definition of Done

1. Có bảng số liệu P-A vs P-B vs baseline cùng bộ hiệu ứng.
2. Section đầu Home có nhịp entrance có chủ đích (stagger + line reveal), giảm cảm giác "mọi thứ fade alike".
3. Quyết định keep/kill được ghi với metric, nhánh thua gỡ sạch.
4. JS gz kết quả nằm trong ngân sách hoặc có ghi nhận vượt ngân sách được user duyệt.
5. Reduced-motion/no-JS/mobile không regress so với hiện tại.
6. Hero không đổi.

Chạy `/ck:cook plans/260921-2256-gsap-home-motion/plan.md` — **đã hoàn tất P-A vanilla**. P-B GSAP không chạy vì không vượt qua gate hiệu quả/chi phí.
