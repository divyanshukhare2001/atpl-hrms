
const canvas = document.getElementById('bg'), ctx = canvas.getContext('2d');
let W, H, nodes = [];

const ICONS = [
  (x,y,s,a) => { ctx.strokeRect(x-s,y-s*.65,s*2,s*1.3); ctx.beginPath(); ctx.moveTo(x-s,y-s*.65); ctx.lineTo(x,y+s*.18); ctx.lineTo(x+s,y-s*.65); ctx.stroke(); },
  (x,y,s,a) => { ctx.beginPath(); ctx.arc(x,y,s*.5,0,Math.PI*2); ctx.stroke(); ctx.beginPath(); ctx.arc(x,y,s,Math.PI*.1,Math.PI*1.6); ctx.stroke(); },
  (x,y,s,a) => { ctx.beginPath(); ctx.arc(x,y,s,0,Math.PI*2); ctx.stroke(); ctx.beginPath(); ctx.arc(x,y,s*.42,0,Math.PI*2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x-s*1.55,y); ctx.lineTo(x+s*1.55,y); ctx.moveTo(x,y-s*1.55); ctx.lineTo(x,y+s*1.55); ctx.stroke(); }
];

function resize() {
  W = canvas.width = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
}

function initNodes() {
  nodes = Array.from({length: W*H/3200|0}, () => ({
    x: Math.random()*W, y: Math.random()*H,
    vx: (Math.random()-.5)*.35, vy: (Math.random()-.5)*.35,
    r: Math.random()*2.5+1,
    glow: Math.random()*Math.PI*2, glowSpeed: Math.random()*.025+.005,
    hasIcon: Math.random()<.2, iconType: Math.random()*3|0,
    fade: Math.random()*Math.PI*2, fadeSpeed: Math.random()*.012+.005
  }));
}

function draw() {
  ctx.clearRect(0,0,W,H);

  nodes.forEach(n => {
    n.x += n.vx; n.y += n.vy;
    n.glow += n.glowSpeed; n.fade += n.fadeSpeed;
    if (n.x < -40) n.x = W+40; if (n.x > W+40) n.x = -40;
    if (n.y < -40) n.y = H+40; if (n.y > H+40) n.y = -40;
  });

  for (let i=0; i<nodes.length; i++) for (let j=i+1; j<nodes.length; j++) {
    const dx=nodes[j].x-nodes[i].x, dy=nodes[j].y-nodes[i].y, d2=dx*dx+dy*dy;
    if (d2<32400) {
      ctx.beginPath(); ctx.moveTo(nodes[i].x,nodes[i].y); ctx.lineTo(nodes[j].x,nodes[j].y);
      ctx.strokeStyle=`rgba(0,220,200,${(1-Math.sqrt(d2)/180)*.4})`; ctx.lineWidth=.7; ctx.stroke();
    }
  }

  nodes.forEach(n => {
    const p = (Math.sin(n.glow)+1)/2;
    if (n.hasIcon) {
      const fa=(Math.sin(n.fade)+1)/2, s=12+n.r*2.5;
      ctx.save(); ctx.globalAlpha=fa; ctx.shadowColor='rgba(0,220,180,.6)'; ctx.shadowBlur=16;
      ctx.strokeStyle='rgba(0,200,160,.35)'; ctx.lineWidth=.8;
      ctx.strokeRect(n.x-s*1.35,n.y-s*1.2,s*2.7,s*2.4);
      ctx.strokeStyle=`rgba(0,220,180,.9)`; ctx.lineWidth=1.1;
      ICONS[n.iconType](n.x,n.y,s*.72); ctx.restore();
    } else {
      const gr=n.r+7*p, g=ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,gr);
      g.addColorStop(0,`rgba(0,230,200,${.85+p*.15})`);
      g.addColorStop(.4,`rgba(0,200,180,${.4+p*.3})`);
      g.addColorStop(1,'rgba(0,180,160,0)');
      ctx.beginPath(); ctx.arc(n.x,n.y,gr,0,Math.PI*2); ctx.fillStyle=g; ctx.fill();
      ctx.beginPath(); ctx.arc(n.x,n.y,n.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(140,255,230,${.85+p*.15})`; ctx.fill();
    }
  });

  requestAnimationFrame(draw);
}

resize(); initNodes(); draw();
window.addEventListener('resize', () => { resize(); initNodes(); });
