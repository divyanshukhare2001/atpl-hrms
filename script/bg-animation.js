
const canvas = document.getElementById('bg'), ctx = canvas.getContext('2d');
let W, H, nodes = [];

// ── ICONS ──────────────────────────────────────────────────────
// Three icon shapes drawn at position (x,y) with size (s)
// To add a new icon: add another function to this array
const ICONS = [
  // Envelope
  (x,y,s) => { ctx.strokeRect(x-s,y-s*.65,s*2,s*1.3); ctx.beginPath(); ctx.moveTo(x-s,y-s*.65); ctx.lineTo(x,y+s*.18); ctx.lineTo(x+s,y-s*.65); ctx.stroke(); },
  // @ symbol
  (x,y,s) => { ctx.beginPath(); ctx.arc(x,y,s*.5,0,Math.PI*2); ctx.stroke(); ctx.beginPath(); ctx.arc(x,y,s,Math.PI*.1,Math.PI*1.6); ctx.stroke(); },
  // Target / crosshair
  (x,y,s) => { ctx.beginPath(); ctx.arc(x,y,s,0,Math.PI*2); ctx.stroke(); ctx.beginPath(); ctx.arc(x,y,s*.42,0,Math.PI*2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x-s*1.55,y); ctx.lineTo(x+s*1.55,y); ctx.moveTo(x,y-s*1.55); ctx.lineTo(x,y+s*1.55); ctx.stroke(); }
];

// ── CANVAS RESIZE ──────────────────────────────────────────────
// Keeps canvas pixel size in sync with its CSS size
function resize() {
  W = canvas.width = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
}

// ── NODE CREATION ──────────────────────────────────────────────
// Each node is a moving point — some are plain glowing dots, some show icons
function initNodes() {
  nodes = Array.from({length: W*H/5200|0}, () => ({  // ← density: lower 3200 = more nodes, higher = fewer
    x: Math.random()*W, y: Math.random()*H,           // random start position
    vx: (Math.random()-.5)*.35,                        // ← horizontal speed: increase .35 to move faster
    vy: (Math.random()-.5)*.35,                        // ← vertical speed: increase .35 to move faster
    r: Math.random()*2.5+1,                            // ← dot size: change 2.5 (range) or +1 (min size)
    glow: Math.random()*Math.PI*2,                     // glow animation start offset
    glowSpeed: Math.random()*.025+.005,                // ← glow pulse speed: increase for faster pulsing
    hasIcon: Math.random()<.2,                         // ← icon frequency: .2 = 20% nodes show icons
    iconType: Math.random()*3|0,                       // picks random icon from ICONS array (0,1,2)
    fade: Math.random()*Math.PI*2,                     // fade animation start offset
    fadeSpeed: Math.random()*.012+.005                 // ← icon fade speed: increase for faster fade in/out
  }));
}

// ── MAIN DRAW LOOP ─────────────────────────────────────────────
function draw() {
  ctx.clearRect(0,0,W,H); // clear canvas each frame

  // ── MOVE NODES ───────────────────────────────────────────────
  nodes.forEach(n => {
    n.x += n.vx; n.y += n.vy;         // move by velocity each frame
    n.glow += n.glowSpeed;             // advance glow animation
    n.fade += n.fadeSpeed;             // advance icon fade animation
    // wrap around edges so nodes never disappear
    if (n.x < -40) n.x = W+40; if (n.x > W+40) n.x = -40;
    if (n.y < -40) n.y = H+40; if (n.y > H+40) n.y = -40;
  });

  // ── DRAW LINES BETWEEN NEARBY NODES ─────────────────────────
  // 32400 = 180*180 (max distance for a line to appear)
  // To increase line length: raise 32400 and 180 proportionally e.g. 40000 and 200
  for (let i=0; i<nodes.length; i++) for (let j=i+1; j<nodes.length; j++) {
    const dx=nodes[j].x-nodes[i].x, dy=nodes[j].y-nodes[i].y, d2=dx*dx+dy*dy;
    if (d2<32400) {
      ctx.beginPath(); ctx.moveTo(nodes[i].x,nodes[i].y); ctx.lineTo(nodes[j].x,nodes[j].y);
      ctx.strokeStyle=`rgba(0,220,200,${(1-Math.sqrt(d2)/180)*.4})`; // ← line color: change 0,220,200
      ctx.lineWidth=.7;  // ← line thickness: increase for thicker lines
      ctx.stroke();
    }
  }

  // ── DRAW NODES (dots & icons) ─────────────────────────────────
  nodes.forEach(n => {
    const p = (Math.sin(n.glow)+1)/2; // p oscillates 0→1→0 for glow pulse

    if (n.hasIcon) {
      // ── ICON NODE ────────────────────────────────────────────
      const fa=(Math.sin(n.fade)+1)/2; // fa oscillates 0→1→0 for fade in/out
      const s=12+n.r*2.5;              // ← icon size: increase 12 (base) or 2.5 (scale)
      ctx.save();
      ctx.globalAlpha=fa;                          // applies fade to everything below
      ctx.shadowColor='rgba(0,220,180,.6)';        // ← icon glow color
      ctx.shadowBlur=16;                           // ← icon glow spread: increase for bigger glow
      ctx.strokeStyle='rgba(0,200,160,.35)';       // ← icon box outline color
      ctx.lineWidth=.8;
      ctx.strokeRect(n.x-s*1.35,n.y-s*1.2,s*2.7,s*2.4); // box behind icon
      ctx.strokeStyle=`rgba(0,220,180,.9)`;        // ← icon stroke color
      ctx.lineWidth=1.1;                           // ← icon stroke thickness
      ICONS[n.iconType](n.x,n.y,s*.72);           // draw the actual icon
      ctx.restore();

    } else {
      // ── GLOWING DOT NODE ─────────────────────────────────────
      const gr=n.r+7*p; // glow radius grows with pulse (7 = max extra glow size)
      const g=ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,gr);
      g.addColorStop(0,`rgba(0,230,200,${.85+p*.15})`);   // ← dot center color
      g.addColorStop(.4,`rgba(0,200,180,${.4+p*.3})`);    // ← dot mid glow color
      g.addColorStop(1,'rgba(0,180,160,0)');               // ← dot outer glow (fades to transparent)
      ctx.beginPath(); ctx.arc(n.x,n.y,gr,0,Math.PI*2); ctx.fillStyle=g; ctx.fill();
      ctx.beginPath(); ctx.arc(n.x,n.y,n.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(140,255,230,${.85+p*.15})`; ctx.fill(); // ← dot core color
    }
  });

  requestAnimationFrame(draw); // keep looping ~60fps
}

// ── INIT ───────────────────────────────────────────────────────
resize(); initNodes(); draw();
window.addEventListener('resize', () => { resize(); initNodes(); }); // re-init on window resize
