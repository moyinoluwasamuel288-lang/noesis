/* ════════════════════════════════════════════════════
   ASHENVEIL — NOESIS Integration Script
   Drop this file into your repo, then add before </body>:
   <script src="ashenveil.js"></script>
   Place it AFTER your main script tag.
════════════════════════════════════════════════════ */

/* ════════════════════════════════════════════════════
   CARD — Procedural pixel preview canvas
════════════════════════════════════════════════════ */
(function initPreview() {
  const canvas = document.getElementById('ash-thumb');
  if (!canvas) return;
  const W = 480, H = 270;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  const C = {
    sky:'#0a0c16', tile:'#111828', tileDk:'#0a0e1a',
    teal:'#70c8d8', gold:'#e8c870', dim:'#253040',
    player:'#c8d4f0', npc:'#a060e0',
    tree1:'#1a2e18', tree2:'#243d22',
  };
  let t = 0;
  const trees = [
    {x:40,h:60},{x:70,h:48},{x:110,h:70},{x:150,h:55},
    {x:310,h:62},{x:345,h:50},{x:390,h:68},{x:430,h:54},{x:460,h:42},
  ];
  const tiles = [];
  for (let tx=0;tx<W;tx+=16) for (let ty=160;ty<H;ty+=16) tiles.push({x:tx,y:ty});
  const parts = Array.from({length:18},()=>({
    x:Math.random()*W, y:Math.random()*160,
    vx:(Math.random()-0.5)*6, vy:-2-Math.random()*4,
    life:Math.random(), decay:0.004+Math.random()*0.006,
    sz:1+Math.random()*1.5,
    col:Math.random()>0.5?C.teal:C.gold,
  }));
  function draw() {
    ctx.fillStyle=C.sky; ctx.fillRect(0,0,W,H);
    ctx.fillStyle='rgba(200,212,240,0.35)';
    for(let i=0;i<40;i++){
      const sx=((i*137+17)%W), sy=((i*89+11)%140);
      ctx.globalAlpha=(0.4+0.6*Math.abs(Math.sin(t*0.8+i)))*0.5;
      ctx.fillRect(sx,sy,1,1);
    }
    ctx.globalAlpha=1;
    for(const tile of tiles){
      ctx.fillStyle=((tile.x/16+tile.y/16)%2===0)?C.tile:C.tileDk;
      ctx.fillRect(tile.x,tile.y,16,16);
    }
    ctx.fillStyle=C.dim; ctx.fillRect(0,159,W,2);
    for(const tr of trees){
      const s=Math.sin(t*0.7+tr.x*0.05)*1.2;
      ctx.fillStyle='#1a1208'; ctx.fillRect(tr.x+3+s,158-tr.h+tr.h*0.5,6,tr.h*0.5);
      ctx.fillStyle=C.tree1; ctx.fillRect(tr.x-10+s,158-tr.h,26,30);
      ctx.fillStyle=C.tree2; ctx.fillRect(tr.x-7+s,158-tr.h-10,20,24);
      ctx.fillStyle='#2e5229'; ctx.fillRect(tr.x-4+s,158-tr.h-18,14,18);
    }
    const p2=0.22+Math.abs(Math.sin(t*3))*0.22;
    ctx.globalAlpha=p2; ctx.fillStyle=C.gold; ctx.fillRect(195,143,10,10); ctx.globalAlpha=1;
    ctx.fillStyle=C.npc; ctx.fillRect(227,137,6,8); ctx.fillRect(228,132,5,5);
    const px=180,py=145,bob=Math.abs(Math.sin(t*4));
    ctx.fillStyle=C.player; ctx.fillRect(px-3,py-8-bob,6,8); ctx.fillRect(px-2,py-13-bob,5,5);
    ctx.globalAlpha=0.18; ctx.fillStyle=C.teal; ctx.fillRect(px-5,py-5-bob,10,3); ctx.globalAlpha=1;
    ctx.globalAlpha=0.6+Math.sin(t*2)*0.4;
    ctx.fillStyle=C.gold; ctx.font='4px "Press Start 2P",monospace';
    ctx.textAlign='center'; ctx.fillText('[E] INTERACT',px,py-21-bob); ctx.globalAlpha=1;
    const bars=[{l:'HP',f:0.72,c:'#70c870'},{l:'POWER',f:0.55,c:'#a060e0'},{l:'LUCK',f:0.88,c:'#e8c870'}];
    bars.forEach((b,i)=>{
      const bx=10,by=10+i*9;
      ctx.fillStyle=C.dim; ctx.font='4px "Press Start 2P",monospace'; ctx.textAlign='left';
      ctx.fillText(b.l,bx,by+4);
      ctx.fillStyle='rgba(255,255,255,0.06)'; ctx.fillRect(bx+38,by,62,3);
      ctx.fillStyle=b.c; ctx.fillRect(bx+38,by,62*b.f,3);
    });
    ctx.fillStyle=C.dim; ctx.font='4px "Press Start 2P",monospace';
    ctx.textAlign='left'; ctx.fillText('STAGE 1 — FOREST',10,43);
    for(const p of parts){
      p.x+=p.vx*0.016; p.y+=p.vy*0.016; p.life-=p.decay;
      if(p.life<=0){p.x=Math.random()*W;p.y=120+Math.random()*40;p.life=0.6+Math.random()*0.4;p.vx=(Math.random()-0.5)*6;p.vy=-2-Math.random()*4;}
      ctx.globalAlpha=p.life*0.7; ctx.fillStyle=p.col; ctx.fillRect(p.x,p.y,p.sz,p.sz);
    }
    ctx.globalAlpha=1;
    const na=0.35+Math.sin(t*0.4)*0.08;
    ctx.globalAlpha=na; ctx.fillStyle='rgba(7,8,15,0.88)'; ctx.fillRect(W/2-130,H-68,260,48);
    ctx.strokeStyle='rgba(100,160,255,0.22)'; ctx.lineWidth=1; ctx.strokeRect(W/2-130,H-68,260,48);
    ctx.globalAlpha=1; ctx.fillStyle=C.teal; ctx.font='4px "Press Start 2P",monospace';
    ctx.textAlign='left'; ctx.fillText('NARRATOR',W/2-120,H-56);
    ctx.fillStyle=C.player; ctx.font='13px "VT323",monospace';
    ctx.fillText('The forest breathes around you.',W/2-120,H-42);
    ctx.fillText('Something watches from the trees.',W/2-120,H-28);
    t+=0.016;
  }
  (function loop(){draw();requestAnimationFrame(loop);})();
})();

/* ════════════════════════════════════════════════════
   MODAL OPEN / CLOSE
════════════════════════════════════════════════════ */
let _ashGameStarted = false;

function openAshenveil() {
  const modal  = document.getElementById('ash-modal');
  const loader = document.getElementById('ash-loader');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  if (!_ashGameStarted) {
    _ashGameStarted = true;
    // Small delay so modal fade-in completes, then hide loader & start game
    setTimeout(() => {
      loader.classList.add('hidden');
      // The game wires its start button automatically via the embedded script
      // User sees the ASHENVEIL title screen and hits BEGIN
    }, 600);
  }
}

function closeAshenveil() {
  document.getElementById('ash-modal').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeAshenveil();
});

/* ════════════════════════════════════════════════════
   ASHENVEIL GAME ENGINE (embedded, no iframe)
   Runs when the page loads — title screen shows on modal open
════════════════════════════════════════════════════ */
'use strict';
/* ════════════════════════════════════════════════════════════════
   ASHENVEIL  — Complete Game Engine (single-file)
   ────────────────────────────────────────────────────────────────
   §01  CFG          constants, tile size, speeds
   §02  MATH         helpers: clamp, lerp, dist, rand
   §03  ANIM_TIME    single global clock for tile animations
   §04  EVENT_BUS    pub/sub, decouples all systems
   §05  INPUT        keyboard + touch joystick, unified axis
   §06  PARTICLES    pooled emitter, draw preset library
   §07  TILES        type ids, draw functions, TDEF table
   §08  TILEMAP      grid, solid-check, zones, viewport-culled draw
   §09  ENTITY       base class: pos, AABB move, alive flag
   §10  PLAYER       input/cinematic move, sprite, trail, facing
   §11  NPC          patrol AI, idle, dialogue trigger
   §12  MONSTER      aggro/flee state machine, damage, capture flag
   §13  SUMMON_SYS   capture bag, cooldown, deploy
   §14  CAMERA       smooth follow, shake, world-clamped
   §15  NARRATOR_UI  floating, typewriter, queued, positional
   §16  CHOICE_UI    action-driven buttons, lock display
   §17  NARRATIVE    flags, checkReq, enterNode, execChoice
   §18  WORLD_MGR    stages 1-4: map build + entity population
   §19  HUD          bars, label, interact hint, toast
   §20  MOBILE       joystick init, action button
   §21  STORY_DB     all narrative nodes, choices, actions
   §22  GAME         assembles everything, loop, start
════════════════════════════════════════════════════════════════ */

// ─────────────────────────────────────────────
// §01  CFG
// ─────────────────────────────────────────────
const CFG = Object.freeze({
  NW: 480, NH: 270,        // native canvas resolution
  TS: 16,                  // tile size px (native)
  MW: 50, MH: 36,          // map dimensions in tiles
  SPD: 76,                 // player speed px/s
  FSTEP: 1/60,             // fixed physics timestep
  MAXDT: 0.05,             // dt cap (prevents spiral of death)
  IRAD: 26,                // interaction radius px
});

// ─────────────────────────────────────────────
// §02  MATH
// ─────────────────────────────────────────────
const clamp  = (v,a,b) => v<a?a:v>b?b:v;
const lerp   = (a,b,t) => a + (b-a)*t;
const dist2  = (ax,ay,bx,by) => Math.hypot(bx-ax, by-ay);
const rand   = (a,b) => a + Math.random()*(b-a);
const randi  = (a,b) => Math.floor(rand(a, b+1));

// ─────────────────────────────────────────────
// §03  ANIM_TIME — single source of truth for tile animations
// ─────────────────────────────────────────────
let AT = 0;  // incremented by game loop; used by all tile draw fns

// ─────────────────────────────────────────────
// §04  EVENT_BUS
// ─────────────────────────────────────────────
const EB = (() => {
  const L = {};
  return {
    on:   (e,f) => { (L[e] = L[e]||[]).push(f); },
    off:  (e,f) => { if (L[e]) L[e] = L[e].filter(x => x!==f); },
    emit: (e,d) => { (L[e]||[]).slice().forEach(f => f(d)); }
  };
})();

// ─────────────────────────────────────────────
// §05  INPUT — keyboard + touch joystick
// ─────────────────────────────────────────────
const Input = (() => {
  const keys = {}, prev = {}, jp = {};
  let jx = 0, jy = 0;

  window.addEventListener('keydown', e => {
    keys[e.code] = true;
    if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','KeyE'].includes(e.code))
      e.preventDefault();
    if (e.code === 'KeyE' || e.code === 'Space') EB.emit('act');
  });
  window.addEventListener('keyup', e => { keys[e.code] = false; });

  function update() {
    for (const k in keys) jp[k] = keys[k] && !prev[k];
    Object.assign(prev, keys);
  }

  function axis() {
    let x = jx, y = jy;
    if (keys['KeyA']||keys['ArrowLeft'])  x -= 1;
    if (keys['KeyD']||keys['ArrowRight']) x += 1;
    if (keys['KeyW']||keys['ArrowUp'])    y -= 1;
    if (keys['KeyS']||keys['ArrowDown'])  y += 1;
    const m = Math.hypot(x,y);
    return m > 0 ? {x:x/m, y:y/m} : {x:0, y:0};
  }

  function initJoystick(zone, thumb) {
    let tid = -1, ox = 0, oy = 0;
    const R = 32;
    const start = (tx,ty) => {
      const r = zone.getBoundingClientRect();
      ox = r.left+r.width/2; oy = r.top+r.height/2;
      move(tx,ty);
    };
    const move = (tx,ty) => {
      const dx = tx-ox, dy = ty-oy, d = Math.hypot(dx,dy);
      const fx = d>R ? dx/d*R : dx, fy = d>R ? dy/d*R : dy;
      thumb.style.transform = `translate(calc(-50% + ${fx}px),calc(-50% + ${fy}px))`;
      jx = clamp(dx/R,-1,1); jy = clamp(dy/R,-1,1);
    };
    const end = () => {
      thumb.style.transform = 'translate(-50%,-50%)';
      jx = 0; jy = 0; tid = -1;
    };
    zone.addEventListener('touchstart', e => {
      e.preventDefault();
      tid = e.changedTouches[0].identifier;
      start(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    }, {passive:false});
    zone.addEventListener('touchmove', e => {
      e.preventDefault();
      for (const t of e.changedTouches)
        if (t.identifier===tid) move(t.clientX, t.clientY);
    }, {passive:false});
    zone.addEventListener('touchend', e => {
      for (const t of e.changedTouches)
        if (t.identifier===tid) end();
    });
  }

  function initActionBtn(btn) {
    btn.addEventListener('touchstart', e => { e.preventDefault(); EB.emit('act'); }, {passive:false});
    btn.addEventListener('click', () => EB.emit('act'));
  }

  return { update, axis, isDown: c => !!keys[c], initJoystick, initActionBtn };
})();

// ─────────────────────────────────────────────
// §06  PARTICLES
// ─────────────────────────────────────────────
class Particles {
  constructor() { this.pool = []; }

  emit(cfg) {
    const n = cfg.n || 6;
    for (let i = 0; i < n; i++) {
      const a = (cfg.angle||0) + (Math.random()-0.5)*(cfg.spread ?? Math.PI*2);
      const s = (cfg.speed||30) * (0.5 + Math.random()*0.7);
      this.pool.push({
        x:  cfg.x + (Math.random()-0.5)*(cfg.scatter||3),
        y:  cfg.y + (Math.random()-0.5)*(cfg.scatter||3),
        vx: Math.cos(a)*s, vy: Math.sin(a)*s,
        life: 1,
        decay: (cfg.decay||1) + Math.random()*0.35,
        sz: (cfg.sz||2) * (0.5 + Math.random()*0.7),
        col: cfg.col || '#ffffff',
        grav: cfg.grav || 0,
        fade: cfg.fade !== false,
      });
    }
  }

  update(dt) {
    for (let i = this.pool.length-1; i >= 0; i--) {
      const p = this.pool[i];
      p.x  += p.vx*dt;  p.y  += p.vy*dt;
      p.vy += p.grav*dt;
      p.vx *= (1 - 1.6*dt);  p.vy *= (1 - 1.6*dt);
      p.life -= p.decay*dt;
      if (p.life <= 0) this.pool.splice(i,1);
    }
  }

  draw(ctx, cam) {
    for (const p of this.pool) {
      if (!cam.vis(p.x-2, p.y-2, 6, 6)) continue;
      const s = cam.ws(p.x, p.y);
      ctx.globalAlpha = p.fade ? Math.max(0, p.life) : 0.9;
      const sz = Math.max(1, Math.round(p.sz * (p.fade ? p.life*0.6+0.4 : 1)));
      ctx.fillStyle = p.col;
      ctx.fillRect(Math.round(s.x), Math.round(s.y), sz, sz);
    }
    ctx.globalAlpha = 1;
  }

  // — Preset emitters —
  dust(x,y)   { this.emit({x,y,n:5,speed:16,decay:1.5,sz:2,col:'#2e2018',scatter:5}); }
  spark(x,y,col='#e8c870') { this.emit({x,y,n:14,speed:68,decay:1.1,sz:2,col,scatter:3}); }
  smoke(x,y)  { this.emit({x,y,n:3,speed:9,decay:0.55,sz:3,col:'#252530',scatter:4,grav:-14,angle:-Math.PI/2,spread:0.75}); }
  blood(x,y)  { this.emit({x,y,n:10,speed:44,decay:0.88,sz:3,col:'#882020',scatter:4,grav:34}); }
  capture(x,y){ this.emit({x,y,n:22,speed:54,decay:1.0,sz:3,col:'#a040c0',scatter:6}); }
  leaves(x,y) { this.emit({x,y,n:8,speed:33,decay:0.75,sz:2,col:'#2a4018',scatter:6,grav:24}); }
  flame(x,y)  { this.emit({x,y,n:4,speed:17,decay:0.6,sz:2,col:'#c86030',scatter:3,grav:-17,angle:-Math.PI/2,spread:0.65}); }
  splash(x,y) { this.emit({x,y,n:6,speed:28,decay:1.0,sz:2,col:'#305878',scatter:4,grav:20}); }
  portal(x,y) { this.emit({x,y,n:5,speed:12,decay:0.5,sz:2,col:'#4080c0',scatter:8}); }
}

// ─────────────────────────────────────────────
// §07  TILES
// ─────────────────────────────────────────────
const T = Object.freeze({
  VOID:0, GRASS:1, DIRT:2, STONE:3, WATER:4,
  TREE:5, WALL:6, RUIN:7, PORTAL:8, SHRINE:9,
  ROAD:10, HOUSE:11, DUNG:12, LAVA:13, SAND:14,
});

// Each tile draw fn: (ctx, screenX, screenY, col, row) => void
// They use the module-level `AT` for animation.

function tdGrass(c,x,y,col,row) {
  c.fillStyle = (col+row)%2 ? '#1a2e18' : '#1c3218';
  c.fillRect(x,y,16,16);
  const h = (col*7+row*13) % 16;
  if (h < 5) { c.fillStyle='#2a4020'; c.fillRect(x+h+2,y+11,1,3); c.fillRect(x+h+4,y+12,1,2); }
}
function tdDirt(c,x,y,col,row) {
  c.fillStyle = (col+row)%2 ? '#2a1e12' : '#231a0f'; c.fillRect(x,y,16,16);
}
function tdStone(c,x,y,col,row) {
  c.fillStyle = (col+row)%2 ? '#252535' : '#1e1e2e'; c.fillRect(x,y,16,16);
}
function tdWater(c,x,y) {
  const w = Math.sin(AT*2.2 + x*0.06 + y*0.045)*0.5+0.5;
  c.fillStyle = w>0.5 ? '#0c2040' : '#0a1830'; c.fillRect(x,y,16,16);
  if (w>0.72) { c.fillStyle='rgba(80,140,220,0.22)'; c.fillRect(x+2,y+6,8,2); }
}
function tdTree(c,x,y) {
  c.fillStyle='#1a2e18'; c.fillRect(x,y,16,16);
  c.fillStyle='#3a2010'; c.fillRect(x+6,y+10,4,6);
  c.fillStyle='#142810'; c.fillRect(x+2,y+5,12,8);
  c.fillStyle='#1a3010'; c.fillRect(x+4,y+3,8,6);
  c.fillStyle='#1e3818'; c.fillRect(x+6,y+1,4,4);
}
function tdWall(c,x,y) {
  c.fillStyle='#1a1a2a'; c.fillRect(x,y,16,16);
  c.fillStyle='#252535'; c.fillRect(x+2,y+4,12,2); c.fillRect(x+4,y+9,8,2);
  c.fillStyle='#141420'; c.fillRect(x,y,16,2);
}
function tdRuin(c,x,y,col,row) {
  c.fillStyle='#1e1820'; c.fillRect(x,y,16,16);
  const h = (col*5+row*11)%3;
  c.fillStyle='#2a2535';
  if (h===0) c.fillRect(x+2,y+2,5,5);
  else if (h===1) c.fillRect(x+9,y+8,5,4);
  else c.fillRect(x+4,y+11,7,3);
}
function tdPortal(c,x,y) {
  c.fillStyle='#0a1825'; c.fillRect(x,y,16,16);
  const p = Math.sin(AT*3 + x*0.04 + y*0.04)*0.5+0.5;
  c.fillStyle=`rgba(64,128,200,${0.18+p*0.30})`; c.fillRect(x+2,y+2,12,12);
  c.fillStyle=`rgba(100,180,255,${0.32+p*0.45})`; c.fillRect(x+5,y+5,6,6);
  c.fillStyle=`rgba(160,220,255,${0.48+p*0.52})`; c.fillRect(x+7,y+7,2,2);
}
function tdShrine(c,x,y) {
  c.fillStyle='#1a1828'; c.fillRect(x,y,16,16);
  const p = Math.sin(AT*1.8 + x*0.04 + y*0.04)*0.5+0.5;
  c.fillStyle=`rgba(200,112,60,${0.10+p*0.20})`; c.fillRect(x+3,y+3,10,10);
  c.fillStyle=`rgba(220,140,80,${0.48+p*0.52})`;
  c.fillRect(x+7,y+4,2,8); c.fillRect(x+5,y+6,6,2);
}
function tdRoad(c,x,y,col,row) {
  c.fillStyle='#252018'; c.fillRect(x,y,16,16);
  c.fillStyle='#1a1810'; c.fillRect(x,y,16,1);
}
function tdHouse(c,x,y) {
  c.fillStyle='#2a1e14'; c.fillRect(x,y,16,16);
  c.fillStyle='#3a2e20'; c.fillRect(x+1,y+6,14,10);
  c.fillStyle='#4a3c2c'; c.fillRect(x+1,y+5,14,3);
  c.fillStyle='#502820'; c.fillRect(x,y+1,16,5);
  c.fillStyle='#623225'; c.fillRect(x+2,y,12,3);
  c.fillStyle='#e8c870'; c.fillRect(x+3,y+8,4,4);
  c.fillStyle='#30281a'; c.fillRect(x+4,y+10,2,1); c.fillRect(x+5,y+8,1,4);
}
function tdDung(c,x,y,col,row) {
  c.fillStyle='#0c0a12'; c.fillRect(x,y,16,16);
  if ((col+row)%4===0) { c.fillStyle='#18152a'; c.fillRect(x+2,y+2,4,4); }
}
function tdLava(c,x,y) {
  const p = Math.sin(AT*3 + x*0.07 + y*0.05)*0.5+0.5;
  c.fillStyle = p>0.5 ? '#c03010' : '#902010'; c.fillRect(x,y,16,16);
  if (p>0.75) { c.fillStyle='rgba(255,180,60,0.38)'; c.fillRect(x+3,y+5,6,4); }
}
function tdSand(c,x,y,col,row) {
  c.fillStyle = (col+row)%2 ? '#3a3018' : '#322a14'; c.fillRect(x,y,16,16);
}

const TDEF = {
  [T.VOID]:  { solid:true,  draw:(c,x,y)=>{ c.fillStyle='#07080f'; c.fillRect(x,y,16,16); } },
  [T.GRASS]: { solid:false, draw:tdGrass  },
  [T.DIRT]:  { solid:false, draw:tdDirt   },
  [T.STONE]: { solid:false, draw:tdStone  },
  [T.WATER]: { solid:true,  draw:tdWater  },
  [T.TREE]:  { solid:true,  draw:tdTree   },
  [T.WALL]:  { solid:true,  draw:tdWall   },
  [T.RUIN]:  { solid:false, draw:tdRuin   },
  [T.PORTAL]:{ solid:false, draw:tdPortal },
  [T.SHRINE]:{ solid:false, draw:tdShrine },
  [T.ROAD]:  { solid:false, draw:tdRoad   },
  [T.HOUSE]: { solid:true,  draw:tdHouse  },
  [T.DUNG]:  { solid:false, draw:tdDung   },
  [T.LAVA]:  { solid:true,  draw:tdLava   },
  [T.SAND]:  { solid:false, draw:tdSand   },
};

// ─────────────────────────────────────────────
// §08  TILEMAP
// ─────────────────────────────────────────────
class TileMap {
  constructor(data, cols, rows) {
    this.d = data; this.cols = cols; this.rows = rows;
    this.pw = cols * CFG.TS; this.ph = rows * CFG.TS;
    this.zones = [];   // {cx,cy,r,id,label}
  }
  get(c,r) {
    if (c<0||c>=this.cols||r<0||r>=this.rows) return T.VOID;
    return this.d[r*this.cols+c] || T.VOID;
  }
  set(c,r,v) { if (c>=0&&c<this.cols&&r>=0&&r<this.rows) this.d[r*this.cols+c]=v; }
  solid(wx,wy) { return !!(TDEF[this.get(Math.floor(wx/CFG.TS), Math.floor(wy/CFG.TS))]?.solid); }
  addZone(z) { this.zones.push(z); }
  nearZone(wx,wy) { return this.zones.find(z => dist2(wx,wy,z.cx,z.cy) < (z.r||24)); }

  draw(ctx, cam) {
    const sc = Math.floor(cam.x/CFG.TS), ec = Math.ceil((cam.x+cam.vw)/CFG.TS)+1;
    const sr = Math.floor(cam.y/CFG.TS), er = Math.ceil((cam.y+cam.vh)/CFG.TS)+1;
    for (let r = sr; r < er; r++) {
      for (let c = sc; c < ec; c++) {
        const tid = this.get(c,r);
        const def = TDEF[tid];
        if (!def) continue;
        const sx = Math.round(c*CFG.TS - cam.x + cam.sx);
        const sy = Math.round(r*CFG.TS - cam.y + cam.sy);
        def.draw(ctx, sx, sy, c, r);
      }
    }
  }
}

// ─────────────────────────────────────────────
// §09  ENTITY BASE
// ─────────────────────────────────────────────
class Entity {
  constructor(x,y) {
    this.x=x; this.y=y; this.vx=0; this.vy=0;
    this.w=8; this.h=10; this.alive=true; this._at=0;
    this.facing='down';
  }
  distTo(e) { return dist2(this.x,this.y,e.x,e.y); }
  distToXY(x,y) { return dist2(this.x,this.y,x,y); }

  // Axis-separated AABB sweep against tilemap
  move(dx,dy,map) {
    const hw = this.w/2;
    // X
    const nx = this.x+dx;
    const xBlocked = (
      map.solid(nx-hw+1, this.y-this.h+2) ||
      map.solid(nx+hw-1, this.y-this.h+2) ||
      map.solid(nx-hw+1, this.y-2) ||
      map.solid(nx+hw-1, this.y-2)
    );
    if (!xBlocked) this.x = nx;
    // Y
    const ny = this.y+dy;
    const yBlocked = (
      map.solid(this.x-hw+