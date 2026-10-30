// Continuous falling money confetti.
(() => {
  const canvas = document.getElementById("money");
  const ctx = canvas.getContext("2d");
  let w, h, dpr, bills = [];

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const target = Math.round(Math.min(90, Math.max(35, (w * h) / 14000)));
    while (bills.length < target) bills.push(makeBill(true));
    bills.length = target;
  }

  function makeBill(anywhere) {
    const size = 34 + Math.random() * 26;
    return {
      x: Math.random() * w,
      y: anywhere ? Math.random() * h - h : -60 - Math.random() * 200,
      size,
      vy: 1.1 + Math.random() * 1.8,
      swayAmp: 0.6 + Math.random() * 1.4,
      swayPhase: Math.random() * Math.PI * 2,
      rot: Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * 0.05,
      flip: Math.random() * Math.PI * 2,
      vflip: 0.03 + Math.random() * 0.06,
      shade: Math.random() < 0.5 ? ["#5fae5a", "#2f6e33"] : ["#7cc173", "#3b7d3d"],
    };
  }

  function drawBill(b) {
    const bw = b.size, bh = b.size * 0.46;
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate(b.rot);
    const flipScale = Math.cos(b.flip);
    ctx.scale(1, flipScale);
    ctx.fillStyle = flipScale > 0 ? b.shade[0] : b.shade[1];
    ctx.strokeStyle = "#1e4a22";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.rect(-bw / 2, -bh / 2, bw, bh);
    ctx.fill();
    ctx.stroke();
    // inner border
    ctx.strokeStyle = "rgba(230,255,220,.6)";
    ctx.lineWidth = 1;
    ctx.strokeRect(-bw / 2 + 3, -bh / 2 + 3, bw - 6, bh - 6);
    // portrait oval + $
    ctx.fillStyle = "rgba(230,255,220,.85)";
    ctx.beginPath();
    ctx.ellipse(0, 0, bh * 0.36, bh * 0.36, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1e4a22";
    ctx.font = `900 ${Math.round(bh * 0.55)}px system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("$", 0, 1);
    ctx.restore();
  }

  let t = 0;
  function tick() {
    t += 1;
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < bills.length; i++) {
      const b = bills[i];
      b.y += b.vy;
      b.x += Math.sin(t * 0.02 + b.swayPhase) * b.swayAmp;
      b.rot += b.vrot;
      b.flip += b.vflip;
      if (b.y > h + 60) bills[i] = makeBill(false);
      drawBill(b);
    }
    requestAnimationFrame(tick);
  }

  window.addEventListener("resize", resize);
  resize();
  tick();
})();
