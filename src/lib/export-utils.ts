/**
 * Generates a complete standalone HTML document with embedded SVG and GSAP logic.
 */
export function generateStandaloneHtml(svgContent: string, gsapCode: string, title: string = "AetherMotion Export") {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <style>
        body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #07070D; display: flex; align-items: center; justify-content: center; }
        .stage { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
        svg { max-width: 90%; max-height: 90%; }
    </style>
</head>
<body>
    <div class="stage" id="stage">
        ${svgContent}
    </div>
    <script>
        window.addEventListener('load', () => {
            const container = document.getElementById('stage');
            try {
                ${gsapCode}
            } catch (e) {
                console.error("GSAP Animation Error:", e);
            }
        });
    </script>
</body>
</html>
  `.trim();
}
