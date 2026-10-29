# V1 verification · 2026-10-29

## Browser checks

Verified in the Codex in-app browser on the local HTTP preview.

| Viewport width | Layout | Horizontal overflow | Overflowing headings/buttons | Broken images |
| --- | --- | --- | --- | --- |
| 1440 px | Desktop, two-column hero and three-column cards | None | None | None |
| 1024 px | Compact desktop | None | None | None |
| 768 px | Tablet | None | None | None |
| 390 px | Mobile, stacked hero and cards | None | None | None |
| 320 px | Small mobile | None | None | None |

- Inspected the desktop hero and project section visually; captured desktop and responsive screenshots in the ignored `qa/` directory.
- Opened all three project previews and checked each title and description.
- Opened the personal introduction and all three video placeholders; each clearly reports Coming soon.
- Verified project dialogs close with Escape, close buttons work, and focus returns to the trigger.
- Verified mobile Menu expands, navigation becomes visible, and choosing Work closes the menu.
- Verified Email placeholder displays a live status message instead of opening a fabricated email address.
- Checked internal anchor targets; all resolve to existing elements.
- Improved small-text contrast and corrected the narrow-screen spacing of “Currently exploring.”
- Confirmed images reserve their dimensions and use responsive sizing.

## Static checks

- `npm run build` passed without package installation.
- JavaScript syntax checks passed.
- Local SVG files parsed successfully as XML.
- Generated local image, stylesheet, and JavaScript paths resolve.
- One H1 and a logical H2/H3 hierarchy; image alt text and accessible names are present.
- Reduced-motion behavior and the no-JavaScript navigation fallback are implemented in CSS/source. These modes were inspected in source, rather than tested with separate browser emulation.

## Content and verification limits

- No reference image was attached in the received message or present in the workspace. The visual follows the written brief.
- Portrait, project covers, and video posters are original vector placeholders.
- No real video file was supplied. Video loading, sound, captions, and fullscreen are implemented with native HTML video controls but cannot be playback-tested with the current placeholder content.
- All social and external project URLs await Coco’s real links.
- Browser checks cover the Chromium-based in-app browser; separate Safari/Firefox and physical-device testing were not performed.
- Cloudflare confirms `cocohuang.me` is active with no DNS records. The private preview is separate; the production domain has not been changed.
- The first V1 build preceded GitHub repository creation. The repository is now connected to `cocohuangyr/cocohuang.me` through the authorized GitHub connector. The original remote initial commit and Node-template `.gitignore` are preserved; the earlier local commit history is retained on a backup branch.
