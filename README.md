# Yingjian Liu — personal academic website

English academic homepage with a bouldering-themed publication wall, academic updates, a concise CV, and a personal photo journal. Built with React and Vinext; exported as a static website.

Public website: https://eugeneliu2000.github.io/

Source: https://github.com/EugeneLIU2000/eugeneliu2000.github.io

## 日常维护

- **学术动态**：编辑 `content/updates.json`。每条记录包含 `label`（显示日期）、`date`（可选机器日期）、`type`、`text` 和可选 `url`。最新动态放在最前面。预印本首次上 arXiv 和期刊正式发表是两个不同事件，请分别记载。
- **论文列表**：编辑 `content/publications.json` 中的 `publications`。保留准确作者顺序、论文标题、arXiv 编号和 DOI。没有正式发表的论文不要填写 `venue` 或 `publicationDate`。文字列表按正式发表日期或首次上传日期排序。攀岩路线按首次上传 arXiv 的时间从下向上排列；岩点对应关系和位置在 `components/bouldering-research.tsx` 的 `route` 中维护。原始核实来源记录在 `sources`。
- **个人介绍、经历和教学**：编辑 `app/page.tsx`。
- **主页照片**：`public/photos/yingjian-liu.jpg` 使用本人提供的原图，以 4:3 比例展示；桌面位于介绍区右侧，手机位于姓名与简介之间。
- **Moments 相册**：照片位于 `public/photos/moments/`，记录在 `content/photos.json`。按年份从早到晚排列，同一年保留提供顺序。缩略图统一为 4:3，`objectPosition` 可调整取景；点击后显示完整照片，Esc 关闭。`width` 和 `height` 为照片实际像素尺寸。主页照片和日常相册分别维护。
- **Footprints**：编辑 `content/footprints.json` 的地点和国家代码。当前按本人提供名单标记十二个国家，中国记录同时高亮大陆和台湾。地图使用 Natural Earth 的公开领域数据，几何保存在 `content/world-map.json`，不依赖外部地图服务。原始数据来源及转换方法见 `scripts/prepare-world-map.py`。

相册记录示例（仅文档示例，不会显示在网站上）：

```json
[
  {
    "src": "/photos/your-photo.jpg",
    "alt": "Describe what is visible in the photograph",
    "caption": "Your caption",
    "location": "Optional location",
    "date": "2026",
    "width": 1600,
    "height": 1200,
    "objectPosition": "50% 50%"
  }
]
```

建议先缩小照片尺寸，最长边约 1600–2000 像素。本版相册通过文件维护，没有增加访客上传入口。

## Verification and source notes

Publications were checked against arXiv and publisher/institutional records on 8 September 2026. Google Scholar could not be fetched directly; the eight entries are a verified list, not a claim of a complete Scholar export. Author links and news items lead to their primary sources. Historical education and employment dates follow the CV supplied by Yingjian.

The Communications Physics article is listed as an advance online publication without an unverified article number. The ISCA publication date is known to month precision, not a specific day. Research-assistant dates follow the supplied CV (December 2023 to October 2024), despite a different month in an older lab biography.

Main sources:

- https://www.universiteitleiden.nl/en/staffmembers/yingjian-liu
- https://jtura.cat/index.php?page=group
- https://stefanopolla.com/
- Individual arXiv and publisher links in `content/publications.json`

Content updates are manual. The site does not claim to synchronize automatically with Google Scholar or arXiv.

## Development

```sh
npm ci
npm run dev
npm run lint
npm run build
node scripts/verify-static.mjs
npm start
```

`npm run lint` checks the authored source; unchanged generated UI primitives and their mobile hook are excluded from lint because the starter ships existing lint findings. `npx tsc --noEmit` checks all TypeScript, including those primitives. The build exports to `dist/client`; no server is needed in production. Credentials are not stored in this repository. The earlier Sites project identity remains in `.openai/hosting.json` for reference.

## GitHub Pages deployment

Push changes to `main`. `.github/workflows/deploy-pages.yml` installs dependencies, checks source, builds and verifies the static output, and publishes to GitHub Pages. The repository uses **GitHub Actions** as its Pages source. A failed build leaves the previous deployment available.

To use a different domain, update the metadata URL in `app/layout.tsx` and the corresponding assertion in `scripts/verify-static.mjs`. This is a root-level user site; hosting under a repository subpath would also require an asset base-path configuration.

## Illustration assets

Original illustrations were generated with the built-in image generation tool, using the supplied climbing illustration as a style reference. They are decorative artwork, not scientific figures or a portrait of Yingjian.

- `public/artwork/quantum-holds.png`: eight holds, four columns and two rows. Each has a simple pattern related to its paper topic.
- `public/artwork/climbing-poses.png`: four back-view poses of the same climber, one row. The scene uses the fourth frame, with the climber fixed at the highest colored hold.
- `public/artwork/climbing-wall.png`: a blue-gray wall with broad flat facets, generated with the built-in image tool. The complete prompt is saved in `content/climbing-wall-prompt.txt`.
- Generation and transparency-extraction prompts: `content/artwork-prompts.json` and `content/climbing-poses-prompts.json`.

The wall extends beyond the text column and uses a taller canvas. The climber remains 125px wide on desktop, 104px on narrow screens, and 93px below 381px; enlarging the wall does not scale the person.

A translucent gray-green gradient blends the original wall into the page palette. Colored holds occupy the lower 57% of the wall, with the highest grip at 43% from the top; the body sits near the middle, below the gray future holds. Desktop text uses a larger reading scale above 900px, while mobile type sizes stay unchanged.

The Footprints map follows the compact visited-country idea from https://jtura.cat/index.php?page=map. Geographic data: https://www.naturalearthdata.com/about/terms-of-use/ (public domain). The map is rendered locally as SVG; country names appear on hover and the visited places are also listed as text.

Colored holds select real papers. Gray holds provide contact points and space for future papers; they do not claim that additional projects exist. Colored holds have no visible text labels. Hover, tap, or keyboard activation opens a card with publication details and links; Yingjian Liu is bolded in the author list. Escape or the close button dismisses the card. The climber remains fixed at the highest colored hold. The page respects reduced-motion preferences and provides a collapsible text list.
