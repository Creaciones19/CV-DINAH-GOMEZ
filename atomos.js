(function(){
  const canvas = document.getElementById('net');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha:true });

  let w=0,h=0,dpr=1;
  let pts=[];

  const cfg = {
    density: 14000,
    minPts: 42,
    maxPts: 70,
    linkDist: 220,
    maxLinks: 3,
    linkChance: 0.35,   // ✅ ERROR REAL ARREGLADO
    drift: 0.08,
    lineW: 1.0,
    dotR: 1.4,
    baseAlpha: 0.22
  };

  function resize(){
    const r = canvas.getBoundingClientRect();
    dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    w = Math.floor(r.width);
    h = Math.floor(r.height);
    canvas.width = Math.floor(w*dpr);
    canvas.height = Math.floor(h*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);

    const target = Math.max(cfg.minPts,
      Math.min(cfg.maxPts, Math.round((w*h)/cfg.density)));

    pts = new Array(target).fill(0).map(() => ({
      x: Math.random()*w,
      y: Math.random()*h,
      vx:(Math.random()*2-1)*cfg.drift,
      vy:(Math.random()*2-1)*cfg.drift
    }));
  }

  function draw(){
    ctx.clearRect(0,0,w,h);
    ctx.lineWidth = cfg.lineW;
    ctx.fillStyle = "rgba(255,255,255,0.9)";

    for(const p of pts){
      p.x += p.vx;
      p.y += p.vy;
      if(p.x<0||p.x>w) p.vx*=-1;
      if(p.y<0||p.y>h) p.vy*=-1;
    }

    for(let i=0;i<pts.length;i++){
      const a=pts[i];
      ctx.beginPath();
      ctx.arc(a.x,a.y,cfg.dotR,0,Math.PI*2);
      ctx.fill();

      let links = 0;

      for(let j=i+1;j<pts.length && links<cfg.maxLinks;j++){
        const b=pts[j];
        const dist = Math.hypot(a.x-b.x, a.y-b.y);
        if(dist < cfg.linkDist && Math.random() < cfg.linkChance){
          links++;
          const alpha = (1 - dist / cfg.linkDist) * cfg.baseAlpha;
          ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x,a.y);
          ctx.lineTo(b.x,b.y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize, { passive:true });
  resize();
  draw();
})();
