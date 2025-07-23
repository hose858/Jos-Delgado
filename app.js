(async () => {
  const canvas = document.getElementById('canvas');
  const ctx    = canvas.getContext('2d');
  let regions, minX, maxX, minY, maxY, cx, cy;

  // Carga JSON y calcula bounds
  async function init() {
    const res  = await fetch('sunflowers.json');
    const data = await res.json();
    regions    = data.regions;
    calcBounds();
    window.addEventListener('resize', resize);
    resize();
  }

  // Calcula min/max y centro
  function calcBounds() {
    const xs = regions.flatMap(r => r.contour.map(p => p[0]));
    const ys = regions.flatMap(r => r.contour.map(p => p[1]));
    minX = Math.min(...xs);
    maxX = Math.max(...xs);
    minY = Math.min(...ys);
    maxY = Math.max(...ys);
    cx   = (minX + maxX) / 2;
    cy   = (minY + maxY) / 2;
  }

  // Ajusta canvas y transforma contexto
  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    const scale = Math.min(
      canvas.width  / (maxX - minX),
      canvas.height / (maxY - minY)
    ) * 0.9;

    // scaleX, skewX, skewY, scaleY, translateX, translateY
    ctx.setTransform(
      scale, 0,
      0, -scale,
      canvas.width  / 2 - cx * scale,
      canvas.height / 2 + cy * scale
    );
    drawRegions();
  }

  // Dibuja cada región con su color
  function drawRegions() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    regions.forEach(region => {
      ctx.beginPath();
      region.contour.forEach(([x, y], i) => {
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.closePath();

      // Pétalos en blanco, resto en su RGB
      ctx.fillStyle = region.type === 'petal'
        ? '#FFFAFA'
        : `rgb(${region.color.join(',')})`;
      ctx.fill();
    });
  }

  // Inicio
  init();
})();