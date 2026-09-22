---
title: "Portfolio V2 — Simple Home / Static About"
status: implemented
priority: P1
tags: [frontend, design, simplification]
blockedBy: []
blocks: []
---

# Portfolio V2 — Home đơn giản, About tĩnh

## 1. Quyết định mới của user — ưu tiên cao nhất

- Bỏ architecture overview khỏi **trang chủ**.
- Thiết kế Home đơn giản, không thêm visual phức tạp để thay chỗ vừa bỏ.
- Bỏ motion của About, đặc biệt SELF / FRAGMENT và scroll-scrub.
- Lượt hiện tại chỉ **lập lại plan**, không triển khai code.

**Plan này thay thế hoàn toàn bản visual-revision-plan trước đó.** Không làm lại polygon, không storyboard fragment, không chỉnh keyframes, không yêu cầu screenshot mới để hoàn thành Home. Yêu cầu About “10/10 experimental” và SELF / FRAGMENT trong brief/plan gốc đã được user thay đổi; không dùng yêu cầu cũ để giữ hiệu ứng dưới tên khác.

Kế thừa website vanilla hiện có, không rebuild. Giữ màu bạc ấm, ink tối, đỏ trầm, Bodoni, script tiết chế, chữ Nhật và hero T’NGUYEN. Giữ engineering content thật và đường dẫn case study.

### Ngoại lệ mới — portrait image do user cung cấp (đã tách nền)

User yêu cầu thay portrait video ở About bằng ảnh `profie.png`, giữ đường polygon trắng + bốn node hình học, nhưng bỏ chữ và nền xám. Đây là xử lý static cutout, không đưa lại DOM fragment, sticky scene hay scroll-scrub.

- Xử lý: Vision PersonSegmentation (macOS native) tách người trung tâm và hai bàn tay tiền cảnh; composite trên đúng màu nền trang `#d8d7d4`; vẽ lại polygon/node để đường hình học liên tục sau khi tách nền.
- File web: `assets/about-focus.webp`, 941×1672, khoảng 69 KB. Source `profie.png` giữ ở root để tái xử lý và loại khỏi Vercel deployment.
- Bố cục: ảnh dọc nổi trực tiếp trên nền trang, không video, không khung đen, không caption phụ; polygon/node là điểm nhấn thị giác.
- Đã bỏ `js/about-video.js` và asset video/poster cũ sau khi migrate markup.
- Opening About dùng curtain reveal vanilla với panel ink hiện `ABOUT` + chữ ký, lift sau ~620ms; About chạy lại mỗi lần reload để tạo opening rõ ràng. Reduced-motion và no-JS vào thẳng nội dung.
- Đã verify desktop/mobile ở bước smoke sau khi asset được mount; chưa test Safari/iOS thật.

## 2. Định hướng thiết kế

**Đơn giản nhưng không sơ sài:** ít thành phần, cỡ chữ có phân cấp, khoảng trắng vừa đủ, canh lề nhất quán. Không lấy “editorial” làm lý do để mọi section đều có heading khổng lồ hoặc padding cả màn hình.

- Home: hero có cá tính; phần dưới ngắn, rõ, giúp người xem chọn project và liên hệ.
- About: hồ sơ cá nhân tĩnh, một portrait và nội dung chọn lọc; không sân khấu hiệu ứng.
- Case studies: tiếp tục giải thích kỹ thuật ở đúng chỗ. Architecture trong detail **giữ nguyên phạm vi**, user chỉ yêu cầu bỏ khỏi Home.
- Không font mới, framework, animation library, video, WebGL hoặc generated visuals.

## 3. Home — giữ hero, đơn giản hóa phần dưới

### 3.1 Hero

Giữ concept hiện tại: wordmark lớn, portrait, solid/person/outline, Japanese display và chữ ký. Không mở rộng yêu cầu “bỏ About motion” thành xóa motion hero Home.

Chỉ sửa các điểm rõ ràng:

- Nav desktop không nằm trên tóc/đầu: đặt trong vùng trống phía phải, dưới signature; tablet/mobile cho một hàng riêng nếu cần.
- Không thêm halo/shadow để chữa chữ nằm sai vị trí.
- Canh metadata và khoảng cách; mobile không kéo dài header bằng nhiều hàng trống.
- Bảo toàn mask và stacking. Không thêm hiệu ứng mới.

### 3.2 Selected Work — hai hàng project mở, không ảnh/sơ đồ

**Xóa hẳn khỏi Home:**

- Hai `.chapter-visual` figure chứa `mowstudio-architecture.svg` và `chat-architecture.svg`.
- Caption “Architecture overview”, image links và alt tương ứng thuộc những figure bị bỏ.
- Grid flip và cột visual trống không còn dùng.

**Không thay bằng** diagram tối giản, screenshot bắt buộc, mockup, placeholder, card màu hoặc typography poster.

Bố cục desktop dự kiến:

```text
SELECTED WORK                                      01—02

01   MowStudio                       Booking infrastructure
     Personal project · July 2026 — Sep 2026             for creative studios.
                                     Next.js · TypeScript · PostgreSQL
                                     View project →

02   Chat Server                     Real-time messaging across
     Microservices                   distributed services.
     Team project · 2026             Java · Spring Boot · gRPC
                                     View project →
```

- Hai project cùng một logic bố cục, không zig-zag chỉ để tạo hiệu ứng.
- Tên project khoảng 42–64px desktop, 30–40px mobile; đây là điểm bắt đầu tuning, không kích thước cố định.
- Mỗi project có một câu mô tả, role/year, stack ngắn, CTA vào case study. Nếu cần nói đóng góp cá nhân, tối đa một câu ngắn; phần sâu đã có ở detail.
- Một đường phân cách mảnh giữa project, không border box, background card hoặc shadow.
- Bỏ kicker/title lặp và `/ two builds`; giữ một heading ngữ nghĩa rõ.
- Mobile: số/year → tên → premise → stack → CTA. Khoảng 24–40px giữa nhóm, không dành chỗ cho media đã bỏ.
- Không đưa lại hai đoạn mô tả CV dài từ V1.

**Acceptance:** Home không còn architecture figure/caption hoặc request hai SVG đó; project vẫn có đủ thông tin để hiểu và mở detail. Không cột rỗng sau khi xóa hình.

### 3.3 Capabilities và Stack

Giữ thông tin, giảm độ phô trương và độ dài:

- Capabilities: ba mục Web Systems / Microservices / AI-Assisted Engineering; heading vừa phải, mỗi mô tả khoảng 1–2 dòng.
- Stack: bốn hàng compact, tên khoảng 24–36px; tech detail rõ, không phần title cao riêng như một hero.
- Dùng cùng lề nhưng khác cấp chữ; không hai section liên tiếp cùng heading 80px + padding lớn.
- Bỏ chuyển động nhích chữ ở hàng Stack không phải link; link thật có màu/underline/focus.
- Giữ các technology đang có, không xóa thông tin chỉ để đạt chiều cao định trước.

### 3.4 About teaser

Thay composition chữ quá lớn + portrait toàn thân lặp bằng một đoạn dẫn gọn:

```text
ABOUT
Software engineering student at UIT,
building web systems and exploring AI-assisted development.

More about me →
```

Copy cuối cùng phải đúng CV/nội dung hiện có. Không bắt buộc THINK / SEE / ACT thành poster nữa; các ý tương ứng có thể nằm trong About Practice. Không ảnh thứ hai trên Home ngoài hero, không fragment tĩnh trá hình.

### 3.5 Contact

Giữ Let's talk, email, GitHub, LinkedIn, phone, résumé. Giảm khoảng trống dư khi nối với teaser. Không contact form, giant CTA bổ sung hay chuyển động chữ mới.

## 4. About — bỏ scene, không chỉ tắt animation

### 4.1 Gỡ sạch SELF / FRAGMENT

Trong `about/index.html`:

- Xóa toàn bộ section `#fragments[data-scene]`, runway, stage, năm portrait duplicate, labels, chữ Fragment và mô tả screen-reader riêng cho hiệu ứng.
- Xóa `<script src="/js/about.js">`.
- Không thay section bị bỏ bằng poster fragment, carousel hoặc portrait toàn thân thứ hai.

Trong `css/about.css`:

- Xóa `.chapter--scene`, `.scene-*`, `.frag*`, label positioning, `data-motion`, `.scene--live`, will-change và media/reduced-motion rules chỉ phục vụ scene.
- Xóa sticky height/runway; không để khoảng trắng 240svh sau cutover.
- Giữ các rule identity/practice/context còn dùng; chỉnh trực tiếp rule gốc, không chồng override vô hiệu hóa tạm thời.

Trong JavaScript:

- Xóa `js/about.js` sau khi đã bỏ toàn bộ references. File hiện chỉ sở hữu fragment controller, không cần giữ empty module.
- Không giữ FRAG_KEYS, ResizeObserver, IO hoặc passive scroll listeners cho scene đã bỏ.
- Không tắt global motion của Home qua `effects.js`.

### 4.2 About không có content motion

- Bỏ `data-reveal` trên nội dung About: heading, ảnh, paragraph, list và contact hiện đầy đủ ngay từ đầu.
- Không entrance animation, scroll fade, parallax, sticky text hay chữ tách ra.
- Các trạng thái link/focus thông thường vẫn được giữ; không dùng transform để di chuyển nội dung.
- Có thể tiếp tục dùng `effects.js` chung cho footer year; không viết script mới cho trang tĩnh. Hero branch hiện chỉ chạy nếu có `.hero`; reveal không có target About thì không cần motion content.
- No-JS và reduced-motion có cùng bố cục/nội dung, không hai bản thiết kế riêng.

### 4.3 Bố cục About mới

```text
Header / navigation

TÔ THÀNH NGUYÊN              Một portrait tĩnh
Software Engineering        crop vừa phải, không phân mảnh
UIT · Ho Chi Minh City

Giới thiệu ngắn

Practice
Software / Frontend / AI-assisted engineering
Vision — Exploring

Education & selected milestones

Contact / résumé
```

**Identity + intro:** tên Bodoni lớn vừa phải, tối đa 2–3 dòng có chủ đích; một portrait bên phải desktop. Nội dung giới thiệu khoảng 2–3 câu, không một section khác cao cả viewport. Mobile xếp tên → ảnh → intro, giới hạn ảnh bằng tỷ lệ phù hợp, không ép hero full-screen.

**Practice:** list tĩnh có mô tả ngắn và link project thật. Gộp ý Systems/Interfaces/Agents từ introduction vào đây, tránh giải thích hai lần. “Vision — Exploring” xuất hiện rõ một lần; không claim kinh nghiệm chưa có.

**Context:** giữ UIT 2024–2028 expected, hai project, Top 9 Student Leaders 2026. Timeline đơn giản date + nội dung, không heading `/ from the résumé`, không progress bar hoặc skills card.

**Contact:** link trực tiếp, không closing scene. Không cố đạt mức độ “experimental 10/10” cũ.

**Acceptance:** cuộn About như một trang tài liệu/editorial bình thường. Chỉ một portrait, không fragment, không scroll giữ hình, không chữ/ảnh chuyển động theo scroll, không vùng trống do scene cũ.

## 5. File map

| File | Thay đổi khi triển khai |
|---|---|
| `index.html` | Bỏ hai architecture figure/caption; project text layout; teaser ngắn; các chỉnh hierarchy cần thiết |
| `css/sections.css` | Bỏ `.chapter-visual`/flip/media grid không còn dùng; project rows và spacing compact; bỏ teaser portrait rules nếu không còn caller |
| `css/hero.css` | Nav placement/alignment tối thiểu; giữ hero concept và motion hiện tại |
| `css/base.css` | Chỉ chỉnh shared type/spacing nếu cần; không rewrite, không tắt Home motion |
| `about/index.html` | Bỏ fragment section, script và content reveal; giữ identity/practice/context/contact tĩnh |
| `css/about.css` | Xóa scene CSS và fallback liên quan; layout About tĩnh, responsive |
| `js/about.js` | Xóa sau khi bỏ caller |
| `js/effects.js` | Dự kiến giữ; chỉ sửa nếu có dependency thực sự được phát hiện, không refactor ngoài scope |
| `projects/*/index.html`, `css/project.css` | Giữ nội dung/architecture; chỉ kiểm không bị shared CSS làm hỏng |
| `assets/projects/*.svg` | Giữ nếu case study còn tham chiếu; không xóa vì Home đã bỏ |
| Portrait assets / résumé | Giữ |

Trước khi xóa selector/script/asset, kiểm tất cả references trong repo. Không giữ code scene vô dụng, nhưng cũng không xóa diagram hoặc portrait còn dùng ở route khác.

## 6. Thứ tự triển khai

### P1 — Bỏ About motion, hoàn thiện trang tĩnh

- [x] Gỡ fragment HTML, about.js reference và file controller.
- [x] Gỡ scene CSS, runway và fragment fallback.
- [x] Bỏ content reveal trên About, giữ trạng thái focus/link.
- [x] Sắp identity + intro + practice + context + contact thành flow tĩnh.
- [x] Kiểm không link nội bộ nào còn trỏ tới fragment section đã bỏ; sửa caller về nội dung thích hợp nếu có, không giữ dummy fragment anchor.

### P2 — Home đơn giản, không architecture visual

- [x] Bỏ hai figure/caption, bỏ flip layout/cột media trống.
- [x] Dựng hai project rows với hierarchy và CTA rõ.
- [x] Thu gọn Capabilities/Stack, bỏ teaser portrait/slogan poster để dùng intro ngắn.
- [x] Chỉnh nav khỏi portrait, giữ hero/mask.
- [x] Contact gọn, giữ mọi contact link hiện có.

### P3 — Kiểm chứng visual và hành vi

- [x] Xem trực tiếp Home/About ở 1440×900, 1280×720, 768px và 390×844; kiểm thêm 320px và landscape. (qa-rev2: 40/40 pass, overflow sạch 5 viewport)
- [x] Chụp trước/sau cùng viewport; đánh giá cỡ chữ, khoảng cách, ngắt dòng, không chỉ kiểm overflow. (qa/rev2-*.jpg so với bộ qa/ trước đó)
- [x] Home không architecture figure/caption và không request các SVG đã bỏ khỏi Home. (network assert: 0 request)
- [x] Case studies vẫn mở được, diagrams còn hiển thị và source links còn nguyên. (svg request 200 sau scroll)
- [x] About không request `about.js`, không fragment nodes/runway, không scene RAF/scroll handler; không 404 từ script bị xóa. (file đã xóa, 0 request, 0 node)
- [x] About default/reduced-motion/no-JS đều đọc được; content không bị giấu để đợi scroll. (0 [data-reveal] trên About; no-JS/reduced-motion 100% visible)
- [x] Keyboard/focus/zoom 200%; navigation Home ↔ About ↔ project detail không gãy. (Tab → nav link focus solid, outline đỏ; focus-visible CSS chung)
- [x] Home hero giữ text/person/outline và motion riêng, không bị shared CSS ảnh hưởng. (rev2-home-1440.jpg)

Không thêm permanent test suite cho thay đổi trình bày này. Browser smoke + screenshot và network inspection là bằng chứng. Chỉ thêm regression test nếu phát hiện lỗi hành vi cụ thể đáng giữ.

## 7. Definition of Done

1. Home sạch và ngắn hơn; không architecture overview, không diagram thay thế, không placeholder media.
2. Hai project vẫn dễ hiểu, có role/year/stack và đường vào case study.
3. About hoàn toàn bỏ SELF / FRAGMENT, không chỉ giảm biên độ hoặc tắt scrub bằng CSS.
4. About có một portrait tĩnh; giới thiệu và practice không lặp thành nhiều màn hình dài.
5. Không còn about.js/dead scene CSS/caller bị bỏ sót.
6. Hero Home và nhận diện cũ được giữ, không thêm visual system mới.
7. Architecture trong case studies và asset còn dùng không bị xóa ngoài scope.
8. Desktop/mobile/keyboard/no-JS/reduced-motion đều dùng được.

## Bước tiếp theo

**Đã triển khai P1 → P2 → P3 ngày 2026-09-17.** Bằng chứng: `qa/qa-rev2.log` (40/40 checks), ảnh `qa/rev2-*.jpg` so với bộ "before" cũ trong `qa/`. Zoom 200% đã kiểm gián tiếp qua 320px; Safari/iOS thật vẫn là giới hạn ghi nhận. Source đã thay đổi đúng scope: `about.js` xóa, scene CSS gỡ sạch, Home không còn architecture figure; case studies và SVG giữ nguyên.
