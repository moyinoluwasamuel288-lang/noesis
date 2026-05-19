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
      map.solid(this.x-hw+1, ny-this.h+2) ||
      map.solid(this.x+hw-1, ny-this.h+2) ||
      map.solid(this.x-hw+1, ny-2) ||
      map.solid(this.x+hw-1, ny-2)
    );
    if (!yBlocked) this.y = ny;
  }

  setFacing(dx,dy) {
    if (Math.abs(dx) > Math.abs(dy))
      this.facing = dx > 0 ? 'right' : 'left';
    else if (dy !== 0)
      this.facing = dy > 0 ? 'down' : 'up';
  }

  update(dt,world) {}
  draw(ctx,cam) {}
}

// ─────────────────────────────────────────────
// §10  PLAYER
// ─────────────────────────────────────────────
class Player extends Entity {
  constructor(x,y) {
    super(x,y);
    this.stats = { hp:100, maxHp:100, power:20, luck:50, morality:50 };
    this._stepT = 0;
    this._trail = [];
    this._moving = false;
    // Cinematic
    this._cinTgt = null;
    this._cinSpd = 0;
    this._cinCb  = null;
    this._locked = false;   // blocks player input (narrative)
    // Zone proximity (set each frame by Game)
    this.nearZone   = null;
    this.nearEntity = null;
    this._animF = 0;
  }

  // Narrative calls this to move player cinematically
  walkTo(wx, wy, speed, onDone) {
    this._cinTgt = {x:wx, y:wy};
    this._cinSpd = speed || CFG.SPD;
    this._cinCb  = onDone || null;
    this._locked = true;
  }
  unlock() { this._locked=false; this._cinTgt=null; }

  update(dt, world) {
    this._at += dt;
    this._animF = Math.floor(this._at * 9) % 4;

    if (this._cinTgt) {
      this._updateCinematic(dt, world.map);
    } else if (!this._locked) {
      this._updateInput(dt, world);
    } else {
      this._moving = false;
    }
    // Trail
    this._trail.unshift({x:this.x, y:this.y});
    if (this._trail.length > 7) this._trail.pop();
  }

  _updateCinematic(dt, map) {
    const dx = this._cinTgt.x - this.x;
    const dy = this._cinTgt.y - this.y;
    const d  = Math.hypot(dx, dy);
    if (d < 2.5) {
      this.x = this._cinTgt.x; this.y = this._cinTgt.y;
      const cb = this._cinCb;
      this._cinTgt = null; this._cinCb = null; this._locked = false;
      this._moving = false;
      if (cb) cb();
    } else {
      const spd = this._cinSpd * dt;
      this.move(dx/d*spd, dy/d*spd, map);
      this.setFacing(dx, dy);
      this._moving = true;
    }
  }

  _updateInput(dt, world) {
    const ax = Input.axis();
    this._moving = (ax.x !== 0 || ax.y !== 0);
    if (this._moving) {
      this.move(ax.x * CFG.SPD * dt, ax.y * CFG.SPD * dt, world.map);
      this.setFacing(ax.x, ax.y);
      this._stepT += dt;
      if (this._stepT > 0.20) {
        this._stepT = 0;
        world.particles.dust(this.x, this.y+2);
      }
    }
  }

  draw(ctx, cam) {
    const s  = cam.ws(this.x, this.y);
    const sx = Math.round(s.x), sy = Math.round(s.y);

    // Trail
    if (this._moving) {
      this._trail.forEach((t,i) => {
        const ts = cam.ws(t.x, t.y);
        ctx.globalAlpha = (1 - i/this._trail.length) * 0.09;
        ctx.fillStyle = '#d0c0a0';
        ctx.fillRect(Math.round(ts.x)-3, Math.round(ts.y)-5, 7, 9);
      });
      ctx.globalAlpha = 1;
    }

    const bob = this._moving ? Math.sin(this._at*12)*1 : 0;
    const by  = sy - 10 + bob;

    // Shadow
    ctx.fillStyle='rgba(0,0,0,0.32)'; ctx.fillRect(sx-4,sy-1,9,3);
    // Cloak
    ctx.fillStyle='#1c1428'; ctx.fillRect(sx-4,by+2,9,9);
    // Body
    ctx.fillStyle='#2e2440'; ctx.fillRect(sx-3,by+3,7,6);
    // Chest
    ctx.fillStyle='#3c3258'; ctx.fillRect(sx-2,by+4,5,3);
    // Head
    ctx.fillStyle='#c0a878'; ctx.fillRect(sx-2,by-1,5,5);
    // Hood
    ctx.fillStyle='#17101e'; ctx.fillRect(sx-3,by-3,7,4); ctx.fillRect(sx-2,by-4,5,2);
    // Eyes
    ctx.fillStyle='#90d8ff';
    if (this.facing==='right')      ctx.fillRect(sx+1,by,2,1);
    else if (this.facing==='left')  ctx.fillRect(sx-2,by,2,1);
    else if (this.facing==='down') { ctx.fillRect(sx-1,by,2,1); ctx.fillRect(sx+2,by,1,1); }
    // Weapon
    if (this.facing==='right') { ctx.fillStyle='#6878b0'; ctx.fillRect(sx+3,by+2,1,7); }
    if (this.facing==='left')  { ctx.fillStyle='#6878b0'; ctx.fillRect(sx-3,by+2,1,7); }
    // Interact indicator
    if (this.nearZone || this.nearEntity) {
      const p = Math.sin(this._at*5)*0.5+0.5;
      ctx.fillStyle = `rgba(232,200,112,${0.5+p*0.5})`;
      ctx.fillRect(sx-1,by-7,3,2); ctx.fillRect(sx,by-9,1,2);
    }
  }
}

// ─────────────────────────────────────────────
// §11  NPC
// ─────────────────────────────────────────────
class NPC extends Entity {
  constructor(x, y, def) {
    super(x,y);
    this.def        = def;
    this.name       = def.name   || 'NPC';
    this.col        = def.col    || '#a08060';
    this.colD       = def.colD   || '#705040';
    this.speed      = def.speed  || 26;
    this.patrol     = def.patrol || [];
    this._pi        = 0;
    this._idle      = 0;
    this._idleMax   = 1.5 + Math.random()*2.5;
    this.state      = this.patrol.length ? 'patrol' : 'idle';
    this.interactable = def.interactable !== false;
    this.nodeId     = def.nodeId || null;
    this._talked    = false;
    this.smoky      = def.smoky  || false;
  }

  update(dt, world) {
    this._at += dt;
    if (this.smoky && Math.random() < 0.04)
      world.particles.smoke(this.x, this.y-12);

    if (this.state==='patrol' && this.patrol.length) {
      const tgt = this.patrol[this._pi];
      const dx = tgt.x-this.x, dy = tgt.y-this.y;
      const d  = Math.hypot(dx,dy);
      if (d < 3) {
        this._pi = (this._pi+1) % this.patrol.length;
        this.state='idle'; this._idle=0;
        this._idleMax = 1.0 + Math.random()*2;
      } else {
        this.move(dx/d*this.speed*dt, dy/d*this.speed*dt, world.map);
        this.setFacing(dx,dy);
        this._moving = true;
      }
    } else if (this.state==='idle') {
      this._idle += dt;
      if (this._idle > this._idleMax) this.state='patrol';
      this._moving = false;
    }
  }

  draw(ctx, cam) {
    if (!cam.vis(this.x-8, this.y-14, 16,14)) return;
    const s  = cam.ws(this.x, this.y);
    const sx = Math.round(s.x), sy = Math.round(s.y);
    const bob = this._moving ? Math.sin(this._at*9)*0.8 : 0;
    const by  = sy-10+bob;

    ctx.fillStyle='rgba(0,0,0,0.26)'; ctx.fillRect(sx-3,sy-1,7,3);
    ctx.fillStyle=this.colD; ctx.fillRect(sx-3,by+3,7,7);
    ctx.fillStyle=this.col;  ctx.fillRect(sx-2,by+2,6,6);
    ctx.fillStyle='#b09070'; ctx.fillRect(sx-2,by-2,4,4);

    if (this.def.showName) {
      ctx.fillStyle='rgba(200,210,230,0.62)';
      ctx.font='4px "Press Start 2P"';
      ctx.textAlign='center';
      ctx.fillText(this.name, sx+0.5, by-5);
      ctx.textAlign='left';
    }
    // Exclamation (untriggered dialogue)
    if (this.interactable && !this._talked) {
      const p = Math.sin(this._at*4)*0.5+0.5;
      ctx.fillStyle = `rgba(232,200,112,${0.48+p*0.52})`;
      ctx.fillRect(sx, by-10, 2,5);
      ctx.fillRect(sx, by-4,  2,2);
    }
  }
}

// ─────────────────────────────────────────────
// §12  MONSTER
// ─────────────────────────────────────────────
class Monster extends Entity {
  constructor(x, y, def) {
    super(x,y);
    this.def      = def;
    this.name     = def.name;
    this.hp       = def.hp;
    this.maxHp    = def.hp;
    this.speed    = def.speed   || 50;
    this.aggroR   = def.aggroR  || 90;
    this.captureAt= def.captureAt||0.32;
    this.col      = def.col     || '#a04060';
    this.state    = 'wander';
    this._wt      = 0;
    this._wdir    = {x:0,y:0};
    this.interactable = false;
  }

  update(dt, world) {
    this._at += dt;
    const px = world.player.x, py = world.player.y;
    const d  = dist2(this.x,this.y,px,py);
    const pct= this.hp / this.maxHp;

    this.interactable = (pct < this.captureAt) && this.def.capturable;

    if (pct < this.captureAt) {
      this.state = 'flee';
    } else if (d < this.aggroR) {
      this.state = 'chase';
    } else {
      this.state = 'wander';
    }

    if (this.state==='chase') {
      const nx=(px-this.x)/d, ny=(py-this.y)/d;
      this.move(nx*this.speed*dt, ny*this.speed*dt, world.map);
      this.setFacing(px-this.x, py-this.y);
      // Contact damage
      if (d < 10) {
        world.player.stats.hp = Math.max(0, world.player.stats.hp - 7*dt);
        EB.emit('hud:refresh');
      }
    } else if (this.state==='flee') {
      const nx=-(px-this.x)/d, ny=-(py-this.y)/d;
      this.move(nx*this.speed*1.25*dt, ny*this.speed*1.25*dt, world.map);
      if (Math.random()<0.06)
        world.particles.emit({x:this.x,y:this.y-4,n:2,speed:10,decay:1.5,sz:2,col:this.col,grav:-14});
    } else {
      this._wt += dt;
      if (this._wt > 2.0) {
        this._wt = 0;
        this._wdir = {x:rand(-1,1), y:rand(-1,1)};
      }
      const wl = Math.hypot(this._wdir.x, this._wdir.y);
      if (wl > 0) this.move(this._wdir.x/wl*this.speed*0.28*dt, this._wdir.y/wl*this.speed*0.28*dt, world.map);
    }
  }

  damage(v, world) {
    this.hp = Math.max(0, this.hp-v);
    world.particles.blood(this.x,this.y);
    world.cam.addShake(3, 0.18);
    if (this.hp <= 0) { world.particles.spark(this.x,this.y,this.col); this.alive=false; }
  }

  draw(ctx, cam) {
    if (!cam.vis(this.x-10, this.y-16, 20,16)) return;
    const s  = cam.ws(this.x, this.y);
    const sx = Math.round(s.x), sy = Math.round(s.y);
    const pct= this.hp/this.maxHp;

    // Capturable glow
    if (pct < this.captureAt) {
      const gp = Math.sin(this._at*6)*0.5+0.5;
      ctx.globalAlpha = 0.22+gp*0.22;
      ctx.fillStyle = this.col; ctx.fillRect(sx-9,sy-15,18,15);
      ctx.globalAlpha = 1;
    }

    // Shadow
    ctx.fillStyle='rgba(0,0,0,0.32)'; ctx.fillRect(sx-5,sy-2,10,3);

    // Sprite (defined per monster def)
    this.def.draw(ctx, sx, sy, this._at, this);

    // HP bar
    ctx.fillStyle='#3a0000'; ctx.fillRect(sx-6,sy-18,12,2);
    ctx.fillStyle = pct>0.5?'#40c040':pct>0.25?'#c0a040':'#c04040';
    ctx.fillRect(sx-6,sy-18, Math.round(12*pct), 2);

    // Capture label
    if (pct < this.captureAt) {
      const fa = 0.6 + Math.sin(this._at*8)*0.4;
      ctx.fillStyle = `rgba(160,64,200,${fa})`;
      ctx.font='4px "Press Start 2P"';
      ctx.textAlign='center';
      ctx.fillText('[E] CAPTURE', sx+0.5, sy-21);
      ctx.textAlign='left';
    }
  }
}

// Monster sprite definitions
const MDEF = {
  lurker: {
    id:'lurker', name:'LURKER', hp:38, speed:54, aggroR:84, captureAt:0.35,
    col:'#6040a0', capturable:true, cdTurns:3, maxUses:4,
    summonText:'The Lurker melts into shadow. All enemies scatter.',
    onSummon(world) {
      world.entities.forEach(e => { if (e instanceof Monster) e.state='flee'; });
    },
    draw(c,sx,sy,t,self) {
      const p = Math.sin(t*4)*0.8;
      c.fillStyle='#2a1035'; c.fillRect(sx-6,sy-12+p,12,11);
      c.fillStyle='#6040a0'; c.fillRect(sx-5,sy-13+p,10,9);
      c.fillStyle='#8060c0'; c.fillRect(sx-3,sy-14+p,6,4);
      c.fillStyle='#f0d0ff';
      c.fillRect(sx-3,sy-11+p,2,2);
      c.fillRect(sx+1, sy-11+p,2,2);
      c.fillStyle='#3a1060';
      c.fillRect(sx-7,sy-9+p,2,5);
      c.fillRect(sx+5, sy-10+p,2,6);
    }
  },
  ashwolf: {
    id:'ashwolf', name:'ASHWOLF', hp:58, speed:66, aggroR:98, captureAt:0.30,
    col:'#a06030', capturable:true, cdTurns:4, maxUses:3,
    summonText:'The Ashwolf charges through. Ground cracks in its wake.',
    onSummon(world) {
      world.entities.forEach(e => { if (e instanceof Monster) e.damage(30, world); });
    },
    draw(c,sx,sy,t,self) {
      const r = self.state==='chase' ? Math.sin(t*8)*0.8 : 0;
      c.fillStyle='#5a3018'; c.fillRect(sx-7,sy-10+r,14,8);
      c.fillStyle='#9a5028'; c.fillRect(sx-6,sy-11+r,12,7);
      c.fillStyle='#aa6030'; c.fillRect(sx-3,sy-14+r,8,6);
      c.fillRect(sx+4,sy-13+r,3,3);
      c.fillStyle='#ff9020';
      c.fillRect(sx-1,sy-12+r,2,2);
      c.fillRect(sx+2, sy-12+r,2,2);
      c.fillStyle='#7a4020';
      c.fillRect(sx-5,sy-3+r,3,4);
      c.fillRect(sx+2, sy-4+r,3,5);
    }
  },
  shadowcrab: {
    id:'shadowcrab', name:'SHADOW CRAB', hp:44, speed:44, aggroR:68, captureAt:0.30,
    col:'#1a3060', capturable:true, cdTurns:3, maxUses:3,
    summonText:'The Shadow Crab flanks your enemies. They cannot see it coming.',
    onSummon(world) { world.cam.addShake(5, 0.45); },
    draw(c,sx,sy,t,self) {
      const w = Math.sin(t*5)*1;
      c.fillStyle='#102030'; c.fillRect(sx-8,sy-7+w,16,8);
      c.fillStyle='#1a3050'; c.fillRect(sx-7,sy-8+w,14,7);
      c.fillStyle='#204060'; c.fillRect(sx-3,sy-11+w,6,5);
      c.fillStyle='#60b0ff';
      c.fillRect(sx-2,sy-10+w,2,2);
      c.fillRect(sx+1, sy-10+w,2,2);
      c.fillStyle='#1a3050';
      c.fillRect(sx-11,sy-5+w,4,3);
      c.fillRect(sx+7,  sy-5+w,4,3);
    }
  },
};

// ─────────────────────────────────────────────
// §13  SUMMON SYSTEM
// ─────────────────────────────────────────────
class SummonSys {
  constructor() { this.bag = {}; }  // id → {def, cd, uses, max}

  capture(monster, world) {
    const id = monster.def.id;
    if (this.bag[id]) { EB.emit('toast', `Already bound: ${monster.name}`); return false; }
    this.bag[id] = { def:monster.def, name:monster.name, cd:0, uses:0, max:monster.def.maxUses||4 };
    world.particles.capture(monster.x, monster.y);
    EB.emit('narrator:q', { text:`${monster.def.name} is bound to your will.`, tag:'CAPTURE', dur:3200 });
    EB.emit('summon:refresh');
    return true;
  }

  canUse(id) {
    const s = this.bag[id];
    return s && s.cd===0 && s.uses < s.max;
  }

  use(id, world) {
    if (!this.canUse(id)) return false;
    const s = this.bag[id];
    s.cd = s.def.cdTurns || 3; s.uses++;
    world.particles.capture(world.player.x, world.player.y);
    if (s.def.onSummon) s.def.onSummon(world);
    EB.emit('narrator:q', { text:s.def.summonText||`${s.name} answers.`, tag:'SUMMON', dur:3000 });
    EB.emit('summon:refresh');
    return true;
  }

  tick() {
    for (const s of Object.values(this.bag)) if (s.cd>0) s.cd--;
    EB.emit('summon:refresh');
  }
}

// ─────────────────────────────────────────────
// §14  CAMERA
// ─────────────────────────────────────────────
class Camera {
  constructor(vw, vh) {
    this.x=0; this.y=0; this.vw=vw; this.vh=vh;
    this.sx=0; this.sy=0;    // shake offset
    this._sd=0; this._sm=0;  // shake duration/mag
  }
  addShake(mag, dur) { this._sm=mag; this._sd=dur; }
  update(dt, mapW, mapH, target) {
    // Shake
    if (this._sd>0) {
      this._sd -= dt;
      this.sx = (Math.random()-0.5)*this._sm;
      this.sy = (Math.random()-0.5)*this._sm;
    } else { this.sx=0; this.sy=0; }
    // Follow
    const tx = target.x - this.vw/2;
    const ty = target.y - this.vh/2;
    this.x = lerp(this.x, tx, 0.11);
    this.y = lerp(this.y, ty, 0.11);
    this.x = clamp(this.x, 0, Math.max(0, mapW-this.vw));
    this.y = clamp(this.y, 0, Math.max(0, mapH-this.vh));
  }
  ws(wx,wy) { return { x: wx-this.x+this.sx, y: wy-this.y+this.sy }; }
  vis(wx,wy,w,h) { const s=this.ws(wx,wy); return s.x+w>0&&s.x<this.vw&&s.y+h>0&&s.y<this.vh; }
}

// ─────────────────────────────────────────────
// §15  NARRATOR UI — floating, typewriter, queued
// ─────────────────────────────────────────────
class NarratorUI {
  constructor() {
    this._el=null; this._txt=null; this._tag=null;
    this._q=[]; this._busy=false; this._timer=null;
  }
  init() {
    this._el  = document.getElementById('narrator');
    this._txt = document.getElementById('n-txt');
    this._tag = document.getElementById('n-tag');
    this._cur = document.getElementById('n-cur');
  }

  // tag, dur, pos: 'n-top'|'n-mid'|'n-btm'
  show(text, tag='NARRATOR', dur=4000, pos='n-top') {
    this._q.push({text, tag, dur, pos});
    if (!this._busy) this._next();
  }

  _next() {
    if (!this._q.length) { this._busy=false; return; }
    this._busy = true;
    const {text,tag,dur,pos} = this._q[0];
    // Position
    this._el.classList.remove('n-top','n-mid','n-btm');
    this._el.classList.add(pos);
    this._tag.textContent = tag;
    this._txt.textContent = '';
    this._cur.style.display = 'inline-block';
    this._el.classList.add('visible');
    // Typewriter
    let i=0;
    const type = () => {
      if (!this._busy) return;
      if (i <= text.length) { this._txt.textContent = text.slice(0,i); i++; setTimeout(type,18); }
    };
    type();
    clearTimeout(this._timer);
    this._timer = setTimeout(() => {
      this._el.classList.remove('visible');
      setTimeout(() => { this._q.shift(); this._next(); }, 420);
    }, dur);
  }

  hide() {
    clearTimeout(this._timer);
    this._el?.classList.remove('visible');
    this._q=[]; this._busy=false;
  }
}

// ─────────────────────────────────────────────
// §16  CHOICE UI
// ─────────────────────────────────────────────
class ChoiceUI {
  constructor() { this._el = document.getElementById('choices'); }

  show(choices, eng, world) {
    this._el.innerHTML = '';
    choices.forEach((ch,i) => {
      const ok = eng.checkReq(ch.requires, world);
      const btn = document.createElement('button');
      btn.className = 'cb';
      btn.disabled = !ok;

      let html = `<span class="cb-key">[${i+1}]</span> ${ch.text}`;
      if (ch.cost) {
        const parts = Object.entries(ch.cost).map(([k,v])=>`${k}${v>0?'+':''}${v}`);
        html += `<span class="cb-cost">${parts.join(' · ')}</span>`;
      }
      if (!ok && ch.requires) {
        const hint = ch.requires.flag
          ? `🔒 need: ${ch.requires.flag}`
          : ch.requires.stat
          ? `🔒 need ${ch.requires.stat} ≥ ${ch.requires.min}`
          : ch.requires.summon
          ? `🔒 need summon: ${ch.requires.summon}`
          : '';
        html += `<span class="cb-lock">${hint}</span>`;
      }
      btn.innerHTML = html;
      if (ok) btn.addEventListener('click', () => { this.hide(); eng.execChoice(ch, world); });
      this._el.appendChild(btn);
    });
    this._el.classList.add('visible');
  }

  hide() { this._el.classList.remove('visible'); this._el.innerHTML=''; }
}

// ─────────────────────────────────────────────
// §17  NARRATIVE ENGINE
// ─────────────────────────────────────────────
class NarrativeEngine {
  constructor(narrator, choiceUI) {
    this.narrator  = narrator;
    this.choiceUI  = choiceUI;
    this.flags     = {};
    this.isBlocking = false;
  }

  setFlag(k, v=true) { this.flags[k]=v; EB.emit('flag:set',{k,v}); }
  flag(k) { return !!this.flags[k]; }

  checkReq(req, world) {
    if (!req) return true;
    if (req.flag   && !this.flags[req.flag]) return false;
    if (req.stat) {
      const v = world?.player?.stats[req.stat];
      if (v === undefined || v < req.min) return false;
    }
    if (req.summon && !world?.summons?.bag[req.summon]) return false;
    return true;
  }

  enter(nodeId, world) {
    const node = STORY[nodeId];
    if (!node) { console.warn('[Narrative] missing node:', nodeId); return; }
    this.choiceUI.hide();
    if (node.onEnter) node.onEnter(this, world);
    if (node.choices?.length) this.choiceUI.show(node.choices, this, world);
  }

  execChoice(ch, world) {
    // Stat deltas
    if (ch.delta && world?.player) {
      for (const [k,v] of Object.entries(ch.delta)) {
        if (k in world.player.stats)
          world.player.stats[k] = clamp(world.player.stats[k]+v, 0, 100);
      }
      EB.emit('hud:refresh');
    }
    // Flags
    if (ch.flags) for (const [k,v] of Object.entries(ch.flags)) this.setFlag(k,v);
    // Action (the gameplay bridge — runs BEFORE next node)
    if (ch.action) {
      ch.action(this, world);
    } else if (ch.next) {
      setTimeout(() => this.enter(ch.next, world), 350);
    }
  }
}

// ─────────────────────────────────────────────
// §18  WORLD MANAGER — stages 1-4
// ─────────────────────────────────────────────
const STAGES = {
  1: { label:'STAGE 1 — FOREST RUINS',  sky:'#07080f' },
  2: { label:'STAGE 2 — MAREN VILLAGE', sky:'#080a12' },
  3: { label:'STAGE 3 — VALE CITY',     sky:'#060810' },
  4: { label:'STAGE 4 — DUNGEON DEEP',  sky:'#040407' },
};

class WorldManager {
  constructor() {
    this.stage    = 1;
    this.map      = null;
    this.entities = [];
    this._spawnX  = 0;
    this._spawnY  = 0;
  }

  build(stage) {
    this.stage = clamp(stage,1,4);
    this.entities = [];
    switch (this.stage) {
      case 1: this.map=this._s1(); this._spawnX=320; this._spawnY=272; break;
      case 2: this.map=this._s2(); this._spawnX=88;  this._spawnY=296; break;
      case 3: this.map=this._s3(); this._spawnX=200; this._spawnY=152; break;
      case 4: this.map=this._s4(); this._spawnX=196; this._spawnY=272; break;
    }
    return this.map;
  }

  spawnPlayer(player) {
    player.x=this._spawnX; player.y=this._spawnY;
    player._cinTgt=null; player._locked=false;
    player._trail=[];
  }

  // ── helpers ──────────────────────────────────
  _fill(d,W,c,r,w,h,v) { for(let rr=r;rr<r+h;rr++) for(let cc=c;cc<c+w;cc++) { if(cc>=0&&cc<W&&rr>=0) d[rr*W+cc]=v; } }

  _s1() {
    const W=CFG.MW, H=CFG.MH, d=new Array(W*H).fill(T.GRASS);
    const s=(c,r,v)=>{ if(c>=0&&c<W&&r>=0&&r<H) d[r*W+c]=v; };
    const f=this._fill.bind(this,d,W);

    // Tree border
    for(let c=0;c<W;c++){ s(c,0,T.TREE); s(c,H-1,T.TREE); }
    for(let r=0;r<H;r++){ s(0,r,T.TREE); s(W-1,r,T.TREE); }
    // Scattered interior trees
    for(let r=1;r<H-1;r++) for(let c=1;c<W-1;c++)
      if((c*13+r*7)%17===0) s(c,r,T.TREE);
    // Central clearing
    f(17,11,16,13,T.GRASS);
    // Water lake
    f(5,7,9,6,T.WATER);
    // Dirt path
    for(let c=7;c<=33;c++) s(c,17,T.DIRT);
    for(let r=9;r<=17;r++) s(22,r,T.DIRT);
    // Ruins
    f(9,4,6,5,T.RUIN); s(11,5,T.WALL); s(12,4,T.WALL); s(13,6,T.WALL);
    // Shrine
    s(22,9,T.SHRINE);
    // Portal (next stage)
    s(24,14,T.PORTAL); s(25,14,T.PORTAL);

    const map = new TileMap(d,W,H);
    map.addZone({cx:22*16+8, cy:9*16+8,  r:24, id:'shrine', label:'Shrine of Ash'});
    map.addZone({cx:24*16+16,cy:14*16+8, r:28, id:'portal', label:'Enter Village →'});
    map.addZone({cx:12*16+8, cy:6*16+8,  r:26, id:'ruins',  label:'Ancient Ruins'});

    // Entities
    this.entities.push(new NPC(298,252,{
      name:'WANDERER',col:'#7090a0',colD:'#405060',speed:22,showName:true,
      interactable:true,nodeId:'wanderer_s1',
      patrol:[{x:288,y:245},{x:315,y:258},{x:300,y:272},{x:278,y:260}]
    }));
    this.entities.push(new NPC(178,118,{
      name:'RUIN KEEPER',col:'#908060',colD:'#605040',speed:16,showName:true,
      interactable:true,nodeId:'ruinkeeper',
      patrol:[{x:178,y:118},{x:192,y:114},{x:188,y:128},{x:175,y:132}]
    }));
    this.entities.push(new Monster(228,158,MDEF.lurker));
    this.entities.push(new Monster(172,302,MDEF.ashwolf));
    return map;
  }

  _s2() {
    const W=CFG.MW, H=CFG.MH, d=new Array(W*H).fill(T.GRASS);
    const s=(c,r,v)=>{ if(c>=0&&c<W&&r>=0&&r<H) d[r*W+c]=v; };
    const f=this._fill.bind(this,d,W);

    for(let c=0;c<W;c++){ s(c,0,T.TREE); s(c,H-1,T.TREE); }
    for(let r=0;r<H;r++){ s(0,r,T.TREE); s(W-1,r,T.TREE); }
    // Roads
    for(let c=2;c<W-2;c++) s(c,H/2|0,T.ROAD);
    for(let r=2;r<H-2;r++) s(W/2|0,r,T.ROAD);
    // Houses
    [[5,5],[9,5],[13,5],[17,5],[5,25],[10,25],[15,25],[19,25],
     [28,8],[33,8],[37,8],[28,22],[33,22],[37,22]]
    .forEach(([c,r])=>f(c,r,3,3,T.HOUSE));
    // Water feature
    f(38,5,5,5,T.WATER);
    // Tree cluster (right side only — left cluster removed; blocked player spawn)
    f(24,3,4,5,T.TREE);
    // Dirt around market
    f(22,14,7,4,T.DIRT);
    // Portal to city
    s(W-3,(H/2|0),T.PORTAL); s(W-3,(H/2|0)+1,T.PORTAL);

    const map = new TileMap(d,W,H);
    map.addZone({cx:(W-3)*16+8, cy:(H/2|0)*16+8, r:30, id:'portal', label:'City Gate →'});
    map.addZone({cx:(W/2|0)*16+8, cy:14*16+8, r:30, id:'market', label:'Village Market'});

    // NPCs
    const names  = ['ANNA','MERCHANT','GUARD','FARMER','CHILD','ELDER','SMITH','SCOUT'];
    const cols   = ['#a08060','#806040','#7090c0','#80a060','#c09060','#a0b0c0','#806050','#708090'];
    const pts    = [{x:80,y:195},{x:105,y:208},{x:128,y:192},{x:205,y:272},
                    {x:228,y:264},{x:352,y:178},{x:375,y:192},{x:456,y:228}];
    pts.forEach((p,i)=>this.entities.push(new NPC(p.x,p.y,{
      name:names[i]||'VILLAGER', col:cols[i]||'#908060', colD:'#503820',
      speed:18+randi(0,14), showName:i<4,
      interactable:i<3, nodeId:i===0?'anna_s2':i===1?'merchant_s2':'guard_s2',
      patrol:[p,{x:p.x+randi(-24,24),y:p.y+randi(-20,20)},{x:p.x+randi(-18,18),y:p.y+randi(-22,22)}]
    })));
    this.entities.push(new Monster(424,78, MDEF.shadowcrab));
    return map;
  }

  _s3() {
    const W=CFG.MW, H=CFG.MH, d=new Array(W*H).fill(T.STONE);
    const s=(c,r,v)=>{ if(c>=0&&c<W&&r>=0&&r<H) d[r*W+c]=v; };
    const f=this._fill.bind(this,d,W);

    for(let c=0;c<W;c++){ s(c,0,T.WALL); s(c,H-1,T.WALL); }
    for(let r=0;r<H;r++){ s(0,r,T.WALL); s(W-1,r,T.WALL); }
    // City grid roads
    [9,18,27].forEach(r=>{ for(let c=1;c<W-1;c++) s(c,r,T.ROAD); });
    [12,25,38].forEach(c=>{ for(let r=1;r<H-1;r++) s(c,r,T.ROAD); });
    // City blocks
    [[2,2],[2,11],[2,20],[14,2],[14,11],[14,20],[27,2],[27,11],[27,20],[40,2],[40,11],[40,20]]
    .forEach(([c,r])=>f(c,r,8,6,T.HOUSE));
    // Dirt courtyards
    f(3,3,7,5,T.DIRT); f(15,3,8,4,T.DIRT); f(28,12,7,5,T.DIRT);
    // Portal to dungeon
    s(W-3,13,T.PORTAL); s(W-3,14,T.PORTAL);

    const map = new TileMap(d,W,H);
    map.addZone({cx:(W-3)*16+8, cy:13*16+8, r:30, id:'portal', label:'Dungeon Entrance ↓'});
    map.addZone({cx:12*16+8, cy:9*16+8,  r:30, id:'center',label:'City Center'});
    map.addZone({cx:25*16+8, cy:18*16+8, r:30, id:'market', label:'Grand Market'});

    // Guards patrol roads
    [{x:180,y:144},{x:292,y:144},{x:394,y:144},{x:190,y:288},{x:302,y:288}]
    .forEach((p,i)=>this.entities.push(new NPC(p.x,p.y,{
      name:'GUARD',col:'#7080b0',colD:'#405070',speed:28,showName:false,
      interactable:i===0,nodeId:'guard_city',
      patrol:[p,{x:p.x+48,y:p.y},{x:p.x+48,y:p.y+14},{x:p.x,y:p.y+14}]
    })));
    // Civilians
    for(let i=0;i<10;i++){
      const p={x:randi(30,580),y:randi(30,500)};
      this.entities.push(new NPC(p.x,p.y,{
        name:'CITIZEN',col:`hsl(${randi(20,55)},28%,${randi(40,55)}%)`,colD:'#303020',
        speed:randi(14,26),showName:false,interactable:false,
        patrol:[p,{x:p.x+randi(-38,38),y:p.y+randi(-28,28)}]
      }));
    }
    // Two monsters guarding dungeon area
    this.entities.push(new Monster(560,192,MDEF.shadowcrab));
    this.entities.push(new Monster(560,240,MDEF.lurker));
    return map;
  }

  _s4() {
    const W=CFG.MW, H=CFG.MH, d=new Array(W*H).fill(T.DUNG);
    const s=(c,r,v)=>{ if(c>=0&&c<W&&r>=0&&r<H) d[r*W+c]=v; };
    const f=this._fill.bind(this,d,W);

    for(let c=0;c<W;c++){ s(c,0,T.WALL); s(c,H-1,T.WALL); }
    for(let r=0;r<H;r++){ s(0,r,T.WALL); s(W-1,r,T.WALL); }
    // Corridors
    for(let c=2;c<W-2;c++) s(c,H/2|0,T.STONE);
    for(let r=2;r<H-2;r++) s(W/2|0,r,T.STONE);
    // Rooms
    f(5,5,10,8,T.STONE); f(30,4,12,9,T.STONE);
    f(6,20,10,10,T.STONE); f(28,18,14,12,T.STONE);
    // Lava
    f(18,4,6,4,T.LAVA); f(17,22,5,5,T.LAVA);
    // Shrines
    s(W/2|0,4,T.SHRINE); s(W/2|0,H-3,T.SHRINE);
    // Portal back
    s(3,H/2|0,T.PORTAL); s(3,(H/2|0)+1,T.PORTAL);

    const map = new TileMap(d,W,H);
    map.addZone({cx:(W/2|0)*16+8, cy:4*16+8,    r:26, id:'shrine', label:'Dungeon Shrine'});
    map.addZone({cx:3*16+8,       cy:(H/2|0)*16+8,r:28,id:'portal', label:'↑ Surface'});

    // Prisoner NPC
    this.entities.push(new NPC(310,118,{
      name:'PRISONER', col:'#906858', colD:'#503828', speed:7,
      showName:true, interactable:true, nodeId:'prisoner_s4',
      patrol:[{x:310,y:118},{x:316,y:124},{x:310,y:130},{x:304,y:124}]
    }));
    // Dungeon monsters (tougher)
    [{x:128,y:88},{x:402,y:98},{x:108,y:348},{x:452,y:362},{x:310,y:198}]
    .forEach(p=>this.entities.push(new Monster(p.x,p.y,{
      ...MDEF.shadowcrab, name:'DUNGEON HORROR', hp:78, speed:58, aggroR:116,
      captureAt:0.25,
    })));
    return map;
  }
}

// ─────────────────────────────────────────────
// §19  HUD
// ─────────────────────────────────────────────
class HUD {
  constructor() {
    this._hp   = document.getElementById('h-hp');
    this._pw   = document.getElementById('h-pw');
    this._lk   = document.getElementById('h-lk');
    this._slbl = document.getElementById('stage-lbl');
    this._hint = document.getElementById('ihint');
    this._ann  = document.getElementById('loc-ann');
    this._fade = document.getElementById('fade');
    this._toast= document.getElementById('toast');
    this._tTimer=null;
  }

  refresh(player, stage) {
    if (!player) return;
    const s = player.stats;
    this._hp.style.width = s.hp  + '%';
    this._pw.style.width = s.power + '%';
    this._lk.style.width = s.luck  + '%';
    this._slbl.textContent = STAGES[stage]?.label || '';
  }

  setHint(show, text='[E] INTERACT') {
    this._hint.textContent = text;
    this._hint.classList.toggle('on', show);
  }

  positionHint(cam, wx, wy) {
    const canvas = document.getElementById('gc');
    const rect   = canvas.getBoundingClientRect();
    const scaleX = rect.width  / CFG.NW;
    const scaleY = rect.height / CFG.NH;
    const s = cam.ws(wx, wy);
    this._hint.style.left      = (rect.left + s.x*scaleX) + 'px';
    this._hint.style.top       = (rect.top  + s.y*scaleY - 28) + 'px';
    this._hint.style.transform = 'translateX(-50%)';
  }

  announce(text) {
    this._ann.textContent = text;
    this._ann.classList.add('show');
    setTimeout(() => this._ann.classList.remove('show'), 2600);
  }

  toast(msg) {
    this._toast.textContent = msg;
    this._toast.classList.add('on');
    clearTimeout(this._tTimer);
    this._tTimer = setTimeout(() => this._toast.classList.remove('on'), 2400);
  }

  async transition(fn) {
    this._fade.classList.add('dark');
    await new Promise(r => setTimeout(r, 480));
    fn();
    await new Promise(r => setTimeout(r, 180));
    this._fade.classList.remove('dark');
  }
}

// ─────────────────────────────────────────────
// §20  MOBILE CONTROLS
// ─────────────────────────────────────────────
function initMobile() {
  const mc = document.getElementById('mc');
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    || navigator.maxTouchPoints > 2
    || window.matchMedia('(pointer:coarse)').matches;
  if (isMobile) {
    mc.style.display = 'block';
    Input.initJoystick(
      document.getElementById('jzone'),
      document.getElementById('jthumb')
    );
    Input.initActionBtn(document.getElementById('btn-e'));
  }
}

// ─────────────────────────────────────────────
// §21  STORY DATABASE
//   Each node: { onEnter?(eng,world), choices?[] }
//   Each choice: { text, requires?, cost?, delta?, flags?, action?(eng,world), next? }
//   action() fires BEFORE next node — this is the gameplay bridge.
// ─────────────────────────────────────────────
const STORY = {

  // ── INTRO ─────────────────────────────────────────────────
  intro: {
    onEnter(eng, world) {
      eng.narrator.show(
        'You wake at the edge of a world that does not know your name.',
        'NARRATOR', 4500, 'n-mid'
      );
    },
    choices: []
  },

  // ── STAGE 1: FOREST RUINS ─────────────────────────────────
  wanderer_s1: {
    onEnter(eng, world) {
      eng.narrator.show(
        '"You look lost," the wanderer says.\n"Three roads from here.\nEach one costs something different."',
        'WANDERER', 5000, 'n-top'
      );
    },
    choices: [
      {
        text: 'Ask about the shrine',
        delta: { luck: +8 },
        flags: { asked_shrine: true },
        action(eng, world) {
          eng.narrator.show(
            '"The shrine is older than the trees.\nIt remembers blood.\nGo — it is already waiting for you."',
            'WANDERER', 4800, 'n-top'
          );
          // Player physically walks to shrine area
          world.player.walkTo(350, 152, 68, () => {
            eng.enter('shrine_approach', world);
          });
        }
      },
      {
        text: 'Ask about the ruins',
        delta: { power: +5 },
        action(eng, world) {
          eng.narrator.show(
            '"A temple, once.\nNow a warning.\nThe keeper still tends it — ask them what happened."',
            'WANDERER', 4800, 'n-top'
          );
        }
      },
      {
        text: 'Say nothing. Walk away.',
        delta: { morality: +10, luck: +5 },
        flags: { silent_start: true },
        action(eng, world) {
          eng.narrator.show(
            'The wanderer watches you leave.\nSilence, they think, is its own kind of answer.',
            'NARRATOR', 4000, 'n-top'
          );
          world.player.walkTo(world.player.x, world.player.y - 55, 70, null);
        }
      }
    ]
  },

  shrine_approach: {
    onEnter(eng, world) {
      world.particles.flame(352, 148);
      world.particles.flame(356, 152);
      eng.narrator.show(
        'The shrine hums with warmth that has no source.\nOld light lives in the stone.',
        'SHRINE', 4000, 'n-top'
      );
    },
    choices: [
      {
        text: 'Offer blood — take power',
        delta: { hp: -18, power: +22 },
        flags: { blood_offered: true },
        action(eng, world) {
          world.particles.blood(world.player.x, world.player.y);
          world.cam.addShake(4, 0.30);
          eng.narrator.show(
            'The shrine drinks.\nSomething inside you shifts and does not return.',
            'SHRINE', 4200, 'n-top'
          );
          EB.emit('hud:refresh');
        }
      },
      {
        text: 'Leave an offering — honor it',
        delta: { morality: +15, luck: +12 },
        flags: { honored_shrine: true },
        action(eng, world) {
          world.particles.spark(352, 148, '#c87040');
          eng.narrator.show(
            'The flame brightens.\nThe world feels slightly less against you.',
            'SHRINE', 4000, 'n-top'
          );
        }
      },
      {
        text: 'Study it. Take nothing.',
        delta: { morality: +5 },
        flags: { shrine_studied: true },
        action(eng, world) {
          eng.narrator.show(
            '"Knowledge is a kind of offering,"\nthe stone seems to say.\nIt will remember you.',
            'NARRATOR', 4400, 'n-top'
          );
        }
      }
    ]
  },

  ruins_explore: {
    onEnter(eng, world) {
      eng.narrator.show(
        'The ruins hold shapes that should not still be standing.\nSomething kept them upright.',
        'WORLD', 4000, 'n-top'
      );
    },
    choices: [
      {
        text: 'Search for artifacts',
        delta: { power: +8, luck: -5 },
        flags: { searched_ruins: true },
        action(eng, world) {
          world.cam.addShake(2, 0.12);
          eng.narrator.show(
            'You find a shard of something crystalline.\nIt hums at a frequency your teeth can feel.',
            'NARRATOR', 4200, 'n-top'
          );
          EB.emit('toast', '+ Crystal Shard');
        }
      },
      {
        text: 'Leave them undisturbed',
        delta: { morality: +10 },
        flags: { respected_ruins: true },
        action(eng, world) {
          eng.narrator.show(
            'Some silences deserve to be kept.\nThe ruins acknowledge you with stillness.',
            'NARRATOR', 4000, 'n-top'
          );
        }
      }
    ]
  },

  ruinkeeper: {
    onEnter(eng, world) {
      eng.narrator.show(
        '"These stones stood before the burning," the keeper says.\n"And they will outlast whatever comes next."',
        'RUIN KEEPER', 5000, 'n-top'
      );
    },
    choices: [
      {
        text: '"What burning?"',
        delta: { morality: +5 },
        action(eng, world) {
          eng.narrator.show(
            '"Maren. The village south of here.\nThe Warden\'s men.\nThree seasons ago.\nYou didn\'t know?"',
            'RUIN KEEPER', 5000, 'n-top'
          );
          eng.setFlag('knows_about_maren', true);
          setTimeout(() => eng.enter('knows_maren', world), 5500);
        }
      },
      {
        text: 'Ask about the portal in the clearing',
        flags: { asked_portal: true },
        action(eng, world) {
          eng.narrator.show(
            '"The portal leads to what remains of Maren.\nThey\'ve rebuilt.\nBarely.\nBut they remember what was done."',
            'RUIN KEEPER', 5000, 'n-top'
          );
        }
      }
    ]
  },

  knows_maren: {
    onEnter(eng, world) {
      eng.narrator.show(
        'So the smoke on the horizon was not a harvest fire.',
        'NARRATOR', 3600, 'n-mid'
      );
    },
    choices: [
      {
        text: 'Find the Warden',
        delta: { power: +10, morality: -5 },
        flags: { seeking_warden: true },
        action(eng, world) {
          eng.narrator.show(
            '"The village portal will take you closer.\nBut know what you are walking toward."',
            'RUIN KEEPER', 4500, 'n-top'
          );
        }
      },
      {
        text: 'Help the village first',
        delta: { morality: +20, luck: +8 },
        flags: { helping_village: true },
        action(eng, world) {
          eng.narrator.show(
            '"A rarer choice than it should be."\nThe keeper nods.\n"The portal is open.\nThey need hands more than heroes."',
            'RUIN KEEPER', 5500, 'n-top'
          );
        }
      }
    ]
  },

  // ── STAGE 2: VILLAGE ──────────────────────────────────────
  anna_s2: {
    onEnter(eng, world) {
      const line = eng.flag('helping_village')
        ? '"You actually came." She looks as if she expected to wait longer.'
        : '"Another traveler." She does not look up from her work.\n"There are fewer every season."';
      eng.narrator.show(line, 'ANNA', 4800, 'n-top');
    },
    choices: [
      {
        text: '"I came because of Maren."',
        delta: { reputation: +12, morality: +8 },
        flags: { told_anna: true },
        action(eng, world) {
          eng.narrator.show(
            '"Then you know what we are dealing with.\nThe Warden does not stop at one village."',
            'ANNA', 4500, 'n-top'
          );
          setTimeout(() => eng.enter('anna_mission', world), 5000);
        }
      },
      {
        text: '"Just passing through."',
        delta: { morality: -5, luck: +5 },
        action(eng, world) {
          eng.narrator.show(
            'She looks at you for a long moment.\n"No one just passes through anymore," she says.\n"Not on this road."',
            'ANNA', 5000, 'n-top'
          );
        }
      }
    ]
  },

  anna_mission: {
    onEnter(eng, world) {
      eng.narrator.show(
        '"There are three things the Warden fears.\nWe have one.\nYou can find another.\nThe third..." She pauses.\n"We don\'t speak of the third."',
        'ANNA', 6000, 'n-top'
      );
    },
    choices: [
      {
        text: 'Accept the mission',
        delta: { morality: +10, power: +5 },
        flags: { anna_mission: true },
        action(eng, world) {
          eng.narrator.show(
            '"Good. The city gate is north.\nDo not trust the guards.\nTrust those not wearing uniforms."',
            'ANNA', 5000, 'n-top'
          );
          EB.emit('toast', 'Quest: Find the Warden\'s weakness');
        }
      },
      {
        text: 'Ask what the third thing is',
        delta: { luck: +10 },
        flags: { asked_third: true },
        action(eng, world) {
          eng.narrator.show(
            'She goes very still.\n"You," she says.\n"We don\'t speak of it because we weren\'t sure you were real."',
            'ANNA', 5500, 'n-top'
          );
        }
      }
    ]
  },

  merchant_s2: {
    onEnter(eng, world) {
      eng.narrator.show(
        '"Good wares. Fair prices.\nThe Warden\'s tax comes due at dawn —\nso everything must go."',
        'MERCHANT', 4000, 'n-top'
      );
    },
    choices: [
      {
        text: 'Buy a travel torch [costs luck]',
        cost: { luck: -8 },
        delta: { luck: -8, power: +5 },
        flags: { has_torch: true },
        action(eng, world) {
          eng.narrator.show('The torch is dense and tarred. It will last.', 'NARRATOR', 3000, 'n-top');
          EB.emit('toast', '+ Travel Torch');
        }
      },
      {
        text: 'Ask about the dungeon rumors',
        action(eng, world) {
          eng.narrator.show(
            '"There are things in the dungeon that were not put there by men.\nThe Warden knows. That is why he guards the entrance."',
            'MERCHANT', 5000, 'n-top'
          );
          eng.setFlag('heard_dungeon_lore', true);
        }
      }
    ]
  },

  guard_s2: {
    onEnter(eng, world) {
      eng.narrator.show(
        '"Move along. Curfew at dusk.\nWarden\'s orders."',
        'VILLAGE GUARD', 3200, 'n-top'
      );
    },
    choices: []
  },

  // ── STAGE 3: CITY ─────────────────────────────────────────
  guard_city: {
    onEnter(eng, world) {
      const line = eng.flag('anna_mission')
        ? '"You\'re the one Anna mentioned.\nWatch yourself in there.\nThe Warden has eyes on the street."'
        : '"State your business in Vale City."';
      eng.narrator.show(line, 'CITY GUARD', 4500, 'n-top');
    },
    choices: [
      {
        text: 'Show Anna\'s letter [requires anna_mission]',
        requires: { flag: 'anna_mission' },
        delta: { reputation: +15 },
        flags: { guard_trust: true },
        action(eng, world) {
          eng.narrator.show(
            '"Alright. The dungeon entrance is east.\nThe Warden\'s men use it as a shortcut.\nWe don\'t officially know this."',
            'GUARD', 5000, 'n-top'
          );
        }
      },
      {
        text: '"Merchant business."',
        delta: { luck: +5 },
        action(eng, world) {
          eng.narrator.show(
            'The guard eyes you for a long moment.\n"Right. Move along."',
            'GUARD', 3500, 'n-top'
          );
        }
      },
      {
        text: 'Offer coin — bribe your way in',
        delta: { morality: -10, luck: +10 },
        flags: { bribed_guard: true },
        action(eng, world) {
          eng.narrator.show(
            'The coin disappears.\nThe guard steps aside.\nNeither of you acknowledge what just happened.',
            'NARRATOR', 4200, 'n-top'
          );
        }
      }
    ]
  },

  // ── STAGE 4: DUNGEON ──────────────────────────────────────
  prisoner_s4: {
    onEnter(eng, world) {
      eng.narrator.show(
        '"They left me here because I know where the Warden hides.\nHelp me and I will tell you."',
        'PRISONER', 4500, 'n-top'
      );
    },
    choices: [
      {
        text: 'Free the prisoner',
        delta: { morality: +20, reputation: +15 },
        flags: { freed_prisoner: true },
        action(eng, world) {
          world.particles.spark(world.player.x, world.player.y, '#e8c870');
          world.cam.addShake(2, 0.15);
          eng.narrator.show(
            '"The Warden\'s vault is in the eastern chamber.\nHe keeps everything he fears losing there.\nEverything."',
            'PRISONER', 5500, 'n-top'
          );
          eng.setFlag('knows_vault', true);
          // Remove the prisoner NPC
          world.entities = world.entities.filter(e => !(e instanceof NPC && e.name==='PRISONER'));
        }
      },
      {
        text: '"Tell me first. Then I decide."',
        delta: { morality: -10, power: +5 },
        action(eng, world) {
          eng.narrator.show(
            '"That is the offer of someone who has already decided no," they say.\n"The Warden taught you well."',
            'PRISONER', 5000, 'n-top'
          );
        }
      },
      {
        text: 'Ask how they ended up here',
        action(eng, world) {
          eng.narrator.show(
            '"I found something I was not supposed to find.\nHe doesn\'t kill people who know things.\nHe just... keeps them."',
            'PRISONER', 5200, 'n-top'
          );
        }
      }
    ]
  },
};

// ─────────────────────────────────────────────
// §22  GAME — assembles all systems, runs the loop
// ─────────────────────────────────────────────
const Game = (() => {
  // DOM
  const canvas = document.getElementById('gc');
  const ctx    = canvas.getContext('2d');

  // Systems (instantiated once)
  const cam      = new Camera(CFG.NW, CFG.NH);
  const particles= new Particles();
  const narrator = new NarratorUI();
  const choiceUI = new ChoiceUI();
  const eng      = new NarrativeEngine(narrator, choiceUI);
  const worldMgr = new WorldManager();
  const hud      = new HUD();
  let   summons  = new SummonSys();
  let   player   = new Player(320, 272);

  // Loop state
  let running = false;
  let lastT   = 0;
  let acc     = 0;
  let ambT    = 0;   // ambient effect accumulator

  // ── Live world object — passed to every system ────
  // Using getters so references stay valid across stage transitions
  const world = {
    get player()   { return player;             },
    get map()      { return worldMgr.map;       },
    get entities() { return worldMgr.entities;  },
    set entities(v){ worldMgr.entities = v;     },
    get cam()      { return cam;                },
    get particles(){ return particles;          },
    get summons()  { return summons;            },
    get stage()    { return worldMgr.stage;     },
    get eng()      { return eng;                },
  };

  // ── Event wiring ──────────────────────────────────
  EB.on('hud:refresh',    () => hud.refresh(player, worldMgr.stage));
  EB.on('narrator:q',    d  => narrator.show(d.text, d.tag, d.dur, d.pos||'n-top'));
  EB.on('summon:refresh', () => _renderSummonPanel());
  EB.on('toast',          msg=> hud.toast(msg));
  EB.on('act',            () => _handleInteract());

  // ── Stage transition ──────────────────────────────
  async function _stageTransition(to) {
    if (to < 1 || to > 4) {
      narrator.show('There is no road beyond this point. Not yet.', 'WORLD', 3500, 'n-top');
      return;
    }
    await hud.transition(() => {
      worldMgr.build(to);
      worldMgr.spawnPlayer(player);
      summons.tick();
      choiceUI.hide();
    });
    hud.refresh(player, to);
    hud.announce(STAGES[to]?.label || '');
    const intros = {
      2: 'The trees give way to rooftops.\nMaren — or what it is becoming — stretches ahead.',
      3: 'Vale City.\nStone and pretense, as far as the eye goes.',
      4: 'The air changes underground.\nSomething here has been waiting a long time for company.',
    };
    if (intros[to]) setTimeout(() => narrator.show(intros[to], 'NARRATOR', 5000, 'n-top'), 600);
  }

  // ── Interact handler ──────────────────────────────
  function _handleInteract() {
    if (!running) return;

    const px = player.x, py = player.y;

    // 1. Capturable monster nearby?
    const nearM = worldMgr.entities.find(e =>
      e instanceof Monster && e.alive && e.interactable && dist2(e.x,e.y,px,py) < CFG.IRAD
    );
    if (nearM) {
      summons.capture(nearM, world);
      nearM.alive = false;
      return;
    }

    // 2. Interactable NPC nearby?
    const nearNPC = worldMgr.entities.find(e =>
      e instanceof NPC && e.alive && e.interactable && dist2(e.x,e.y,px,py) < CFG.IRAD
    );
    if (nearNPC && nearNPC.nodeId && !nearNPC._talked) {
      nearNPC._talked = true;
      eng.enter(nearNPC.nodeId, world);
      return;
    }

    // 3. Zone?
    const zone = worldMgr.map.nearZone(px, py);
    if (zone) {
      switch (zone.id) {
        case 'portal':
          _stageTransition(worldMgr.stage + 1);
          break;
        case 'shrine':
          if (!eng.flag('shrine_visited')) {
            eng.setFlag('shrine_visited', true);
            eng.enter('shrine_approach', world);
          } else {
            narrator.show('The shrine has already given what it had for you.', 'SHRINE', 3200, 'n-top');
          }
          break;
        case 'ruins':
          eng.enter('ruins_explore', world);
          break;
        case 'market':
          narrator.show(
            'The market hums with quiet desperation.\nGoods change hands.\nStories stay where they are.',
            'WORLD', 4000, 'n-top'
          );
          break;
        case 'center':
          narrator.show(
            'The city center. Guards on every corner.\nNo one looks anyone in the eye.',
            'WORLD', 3800, 'n-top'
          );
          break;
        case 'exit':
          _stageTransition(worldMgr.stage - 1);
          break;
      }
    }
  }

  // ── Fixed-step update ─────────────────────────────
  function _update(dt) {
    AT += dt;          // global anim clock for tiles
    ambT += dt;

    // Camera
    cam.update(dt, worldMgr.map.pw, worldMgr.map.ph, player);

    // Player
    player.update(dt, world);

    // Entities
    for (let i = worldMgr.entities.length-1; i >= 0; i--) {
      const e = worldMgr.entities[i];
      if (!e.alive) { worldMgr.entities.splice(i,1); continue; }
      e.update(dt, world);
    }

    // Proximity flags (for hint and interact indicator)
    player.nearZone   = worldMgr.map.nearZone(player.x, player.y);
    player.nearEntity = worldMgr.entities.find(e =>
      e.alive && e.interactable && dist2(e.x,e.y,player.x,player.y) < CFG.IRAD
    ) || null;

    // Ambient particles
    if (ambT > 0.13) {
      ambT = 0;
      // Shrine flames (all stages)
      worldMgr.map.zones.filter(z => z.id==='shrine').forEach(z => particles.flame(z.cx, z.cy));
      // Dungeon lava
      if (worldMgr.stage===4 && Math.random()<0.28)
        particles.emit({x:rand(280,310),y:rand(64,88),n:2,speed:7,decay:0.65,sz:2,col:'#c04010',grav:-10});
    }
    // Stage 2 rain
    if (worldMgr.stage===2 && Math.random()<0.12)
      particles.splash(rand(0, worldMgr.map.pw), rand(0, worldMgr.map.ph));

    particles.update(dt);

    // HUD hint
    const hasTarget = !!(player.nearZone || player.nearEntity);
    let hintText = '[E] INTERACT';
    if (player.nearEntity instanceof Monster) hintText = '[E] CAPTURE';
    else if (player.nearEntity instanceof NPC) hintText = `[E] TALK`;
    else if (player.nearZone) hintText = `[E] ${player.nearZone.label}`;
    hud.setHint(hasTarget, hintText);
    if (hasTarget) hud.positionHint(cam, player.x, player.y - 14);

    Input.update();
    EB.emit('hud:refresh');
  }

  // ── Render ────────────────────────────────────────
  function _render() {
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = STAGES[worldMgr.stage]?.sky || '#07080f';
    ctx.fillRect(0, 0, CFG.NW, CFG.NH);

    // Tilemap
    worldMgr.map.draw(ctx, cam);

    // Zone pulsing markers
    worldMgr.map.zones.forEach(z => {
      if (!cam.vis(z.cx-22, z.cy-22, 44,44)) return;
      const s = cam.ws(z.cx, z.cy);
      const p = Math.sin(AT*3 + z.cx*0.01)*0.5+0.5;
      ctx.globalAlpha = 0.22 + p*0.22;
      ctx.fillStyle = '#e8c870';
      ctx.fillRect(Math.round(s.x)-5, Math.round(s.y)-5, 10, 10);
      ctx.globalAlpha = 1;
    });

    // Entities — Y-sorted depth
    const drawOrder = [...worldMgr.entities, player].sort((a,b) => a.y - b.y);
    drawOrder.forEach(e => { if (e.alive !== false) e.draw(ctx, cam); });

    // Particles
    particles.draw(ctx, cam);

    // Dungeon vignette
    if (worldMgr.stage===4) {
      const g = ctx.createRadialGradient(CFG.NW/2,CFG.NH/2,72, CFG.NW/2,CFG.NH/2,200);
      g.addColorStop(0,'rgba(0,0,0,0)');
      g.addColorStop(1,'rgba(0,0,0,0.58)');
      ctx.fillStyle=g; ctx.fillRect(0,0,CFG.NW,CFG.NH);
    }
  }

  // ── Game loop (RAF) ───────────────────────────────
  function _loop(ts) {
    if (!running) return;
    const dt = Math.min((ts - lastT) / 1000, CFG.MAXDT);
    lastT = ts;
    acc += dt;
    while (acc >= CFG.FSTEP) { _update(CFG.FSTEP); acc -= CFG.FSTEP; }
    _render();
    requestAnimationFrame(_loop);
  }

  // ── Canvas scaling ────────────────────────────────
  function _resize() {
    const sw = window.innerWidth, sh = window.innerHeight;
    // Integer scale, fallback to fractional on small screens
    let sc = Math.min(Math.floor(sw/CFG.NW), Math.floor(sh/CFG.NH));
    if (sc < 1) sc = Math.min(sw/CFG.NW, sh/CFG.NH);
    canvas.width  = CFG.NW;
    canvas.height = CFG.NH;
    canvas.style.width  = Math.round(CFG.NW * sc) + 'px';
    canvas.style.height = Math.round(CFG.NH * sc) + 'px';
    cam.vw = CFG.NW; cam.vh = CFG.NH;
  }

  // ── Summon panel render ───────────────────────────
  function _renderSummonPanel() {
    const el = document.getElementById('summons');
    el.innerHTML = '';
    for (const s of Object.values(summons.bag)) {
      const rdy   = s.cd===0 && s.uses < s.max;
      const spent = s.uses >= s.max;
      const div   = document.createElement('div');
      div.className = 'ss' + (rdy?' rdy':spent?' spent':'');
      div.innerHTML = `${s.name}<br><span style="font-size:4.5px;opacity:0.7">
        ${s.cd>0?'CD:'+s.cd:spent?'SPENT':'READY'} · ${s.uses}/${s.max}</span>`;
      if (rdy) div.addEventListener('click', () => {
        summons.use(s.def.id, world);
        _renderSummonPanel();
      });
      el.appendChild(div);
    }
  }

  // ── Public start ──────────────────────────────────
  function start() {
    document.getElementById('title').style.display = 'none';
    _resize();
    window.addEventListener('resize', _resize);
    narrator.init();
    initMobile();

    worldMgr.build(1);
    worldMgr.spawnPlayer(player);
    cam.x = player.x - CFG.NW/2;
    cam.y = player.y - CFG.NH/2;

    hud.refresh(player, 1);
    hud.announce(STAGES[1].label);

    running = true;
    lastT   = performance.now();
    requestAnimationFrame(_loop);

    // Opening sequence
    setTimeout(() => eng.enter('intro', world), 400);
    setTimeout(() => narrator.show(
      'WASD or arrow keys to move.\nPress E near glowing markers to interact.\nWeaken monsters to capture them.',
      'GUIDE', 5500, 'n-top'
    ), 5500);
  }

  return { start };
})();

// ── Wire title button ──────────────────────────
document.getElementById('start-btn').addEventListener('click', () => Game.start());
  window._AshGame = Game;

// ── Prevent mobile scroll / zoom ──────────────
document.addEventListener('touchmove', e => e.preventDefault(), {passive:false});
document.addEventListener('contextmenu', e => e.preventDefault());