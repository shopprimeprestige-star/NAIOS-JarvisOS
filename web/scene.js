import * as THREE from "https://esm.sh/three@0.169.0";
const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
function init(id){const canvas=document.getElementById(id);if(!canvas)return null;try{const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:"low-power"});renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(40,1,.1,100);const resize=()=>{const w=canvas.clientWidth,h=canvas.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()};resize();new ResizeObserver(resize).observe(canvas);return {renderer,scene,camera}}catch(e){console.warn("WebGL unavailable",e);return null}}
const cyan=0x18dfff,blue=0x168bff;const mat=(color=cyan,opacity=.8)=>new THREE.MeshBasicMaterial({color,transparent:true,opacity,wireframe:true,depthWrite:false,side:THREE.DoubleSide});
function line(points,color=cyan,opacity=.65){const g=new THREE.BufferGeometry().setFromPoints(points.map(p=>new THREE.Vector3(...p)));return new THREE.Line(g,new THREE.LineBasicMaterial({color,transparent:true,opacity}))}
function addOrb(scene,r){const globe=new THREE.Group();globe.add(new THREE.Mesh(new THREE.SphereGeometry(r,48,32),new THREE.MeshBasicMaterial({color:0x0b4f85,transparent:true,opacity:.34})));globe.add(new THREE.Mesh(new THREE.SphereGeometry(r*1.003,24,14),mat(0x27cfff,.27)));const lat=[];for(let i=-3;i<=3;i++){const a=i*Math.PI/8;const rr=Math.cos(a)*r;const yy=Math.sin(a)*r;const pts=[];for(let j=0;j<=120;j++){const t=j*Math.PI/60;pts.push([Math.cos(t)*rr,yy,Math.sin(t)*rr])}globe.add(line(pts,0x27aaff,.3))}for(let i=0;i<12;i++){const pts=[];const a=i*Math.PI/12;for(let j=0;j<=90;j++){const t=j*Math.PI/45;pts.push([Math.cos(t)*Math.cos(a)*r,Math.sin(t)*r,Math.cos(t)*Math.sin(a)*r])}globe.add(line(pts,0x29cfff,.22))}const continents=[[-.9,.35],[-.7,.55],[-.6,.25],[-.3,.1],[.1,.5],[.35,.6],[.5,.25],[.8,.15],[.45,-.3],[-.4,-.45]];for(const [lon,lat] of continents){const x=Math.cos(lat)*Math.sin(lon*2.6)*r,y=Math.sin(lat*2)*r,z=Math.cos(lat)*Math.cos(lon*2.6)*r;const dot=new THREE.Mesh(new THREE.SphereGeometry(.025,8,8),new THREE.MeshBasicMaterial({color:0xa4f8ff}));dot.position.set(x,y,z);globe.add(dot)}
/* Illuminated geographic coastlines, projected on the 3D Earth surface */
const coastlines=[
[[-168,66],[-145,61],[-129,52],[-124,42],[-117,32],[-110,25],[-98,19],[-88,21],[-81,26],[-81,34],[-71,45],[-60,52],[-55,61],[-83,72],[-115,72],[-145,69],[-168,66]],
[[-81,12],[-75,3],[-78,-8],[-74,-16],[-70,-25],[-71,-35],[-67,-48],[-71,-55],[-60,-52],[-52,-35],[-47,-22],[-35,-8],[-45,1],[-60,10],[-81,12]],
[[-11,36],[-17,21],[-17,10],[-11,-1],[9,-8],[13,-18],[18,-34],[27,-35],[35,-26],[41,-12],[50,11],[43,18],[32,30],[15,37],[-1,36],[-11,36]],
[[-10,36],[-6,44],[3,51],[20,59],[33,70],[51,72],[72,60],[94,59],[116,51],[130,44],[142,40],[150,58],[174,62],[178,50],[145,33],[123,23],[113,14],[106,2],[100,-6],[91,9],[79,9],[70,23],[57,26],[46,38],[34,36],[27,42],[13,45],[4,43],[-10,36]],
[[113,-12],[125,-14],[136,-13],[145,-19],[153,-28],[147,-39],[135,-39],[119,-33],[113,-23],[113,-12]],
[[-52,82],[-44,69],[-40,60],[-48,59],[-59,64],[-61,73],[-52,82]]
];
function geoPoint(lon,lat,r){const a=(lon+180)*Math.PI/180,b=lat*Math.PI/180;return [Math.cos(b)*Math.sin(a)*r,Math.sin(b)*r,Math.cos(b)*Math.cos(a)*r]}
for(const coast of coastlines){const pts=coast.map(([lon,lat])=>geoPoint(lon,lat,r*1.014));globe.add(line(pts,0x8bdfff,.9));}
for(let i=0;i<95;i++){const lat=Math.asin(2*Math.random()-1)*180/Math.PI,lon=Math.random()*360-180;const dot=new THREE.Mesh(new THREE.SphereGeometry(.006+Math.random()*.012,5,5),new THREE.MeshBasicMaterial({color:i%6===0?0xffc36c:0x74dfff,transparent:true,opacity:.65}));dot.position.set(...geoPoint(lon,lat,r*1.02));globe.add(dot)}

scene.add(globe);return globe}
const globeEnv=init("globe3d");if(globeEnv){globeEnv.camera.position.z=4;const orb=addOrb(globeEnv.scene,1.25);const orbit=new THREE.Group();for(let j=0;j<3;j++){const ring=new THREE.Mesh(new THREE.TorusGeometry(1.53+j*.09,.007,5,140),new THREE.MeshBasicMaterial({color:j===1?0x82efff:blue,transparent:true,opacity:.55}));ring.rotation.x=.5+j*.37;ring.rotation.y=j*.4;orbit.add(ring)}globeEnv.scene.add(orbit);const animate=t=>{orb.rotation.y=t*.00011;orbit.rotation.z=t*.00004;globeEnv.renderer.render(globeEnv.scene,globeEnv.camera);if(!reduced)requestAnimationFrame(animate)};requestAnimationFrame(animate)}
const avatarEnv=init("avatar3d");if(avatarEnv){avatarEnv.camera.position.set(0,.2,7.5);const figure=new THREE.Group();const head=new THREE.Mesh(new THREE.SphereGeometry(.43,20,14),mat(0x8befff,.76));head.scale.set(.85,1.16,.83);head.position.y=1.3;figure.add(head);const neck=new THREE.Mesh(new THREE.CylinderGeometry(.18,.23,.36,12),mat());neck.position.y=.66;figure.add(neck);const torso=new THREE.Mesh(new THREE.CylinderGeometry(.72,.46,1.35,22,12,true),mat(0x3edcff,.52));torso.position.y=-.22;figure.add(torso);const shoulders=new THREE.Mesh(new THREE.SphereGeometry(.9,20,12,0,Math.PI*2,0,Math.PI/2),mat(0x6beaff,.55));shoulders.position.y=.35;shoulders.scale.set(1.25,.45,.6);figure.add(shoulders);for(const sign of [-1,1]){const arm=new THREE.Mesh(new THREE.CylinderGeometry(.19,.13,1.25,12,8,true),mat(0x38cfff,.45));arm.position.set(sign*.94,-.45,0);arm.rotation.z=sign*.22;figure.add(arm);const eye=new THREE.Mesh(new THREE.SphereGeometry(.047,8,8),new THREE.MeshBasicMaterial({color:0xeaffff}));eye.position.set(sign*.17,1.36,.35);figure.add(eye)}const core=new THREE.Mesh(new THREE.IcosahedronGeometry(.17,1),new THREE.MeshBasicMaterial({color:0x82faff,wireframe:true}));core.position.set(0,.05,.57);figure.add(core);const halo=new THREE.Mesh(new THREE.TorusGeometry(1.65,.014,6,110),new THREE.MeshBasicMaterial({color:cyan,transparent:true,opacity:.65}));halo.rotation.x=1.2;figure.add(halo);
// ZARK // holographic humanoid facial topology, moving pupils and circuit traces
const faceShell=new THREE.Mesh(new THREE.SphereGeometry(.405,40,30),new THREE.MeshPhongMaterial({color:0x0c69b0,emissive:0x00477d,emissiveIntensity:.8,transparent:true,opacity:.38,shininess:160,side:THREE.DoubleSide}));faceShell.position.y=1.3;faceShell.scale.set(.85,1.17,.83);figure.add(faceShell);
const facial=(points,op=.9)=>{const g=new THREE.BufferGeometry().setFromPoints(points.map(([x,y,z])=>new THREE.Vector3(x,y,z)));const l=new THREE.Line(g,new THREE.LineBasicMaterial({color:0x87f5ff,transparent:true,opacity:op}));figure.add(l);return l};
for(const sign of [-1,1]){
  facial([[sign*.05,1.53,.35],[sign*.15,1.57,.34],[sign*.27,1.52,.26]],.8);
  facial([[sign*.06,1.40,.366],[sign*.13,1.43,.357],[sign*.24,1.39,.30]],1);
  facial([[sign*.07,1.38,.365],[sign*.16,1.36,.35],[sign*.24,1.39,.30]],.8);
  facial([[sign*.31,1.30,.23],[sign*.27,1.15,.27],[sign*.20,1.09,.31]],.5);
  facial([[sign*.04,1.36,.36],[sign*.055,1.22,.39],[0,1.17,.43]],.7);
  facial([[sign*.025,1.07,.39],[sign*.11,1.065,.365],[sign*.19,1.08,.31]],.8);
  const iris=new THREE.Mesh(new THREE.SphereGeometry(.055,12,12),new THREE.MeshBasicMaterial({color:0x9cffff}));iris.position.set(sign*.145,1.405,.36);figure.add(iris);
  const pupil=new THREE.Mesh(new THREE.SphereGeometry(.023,10,10),new THREE.MeshBasicMaterial({color:0xffffff}));pupil.position.set(sign*.145,1.408,.407);figure.add(pupil);
  for(let k=0;k<8;k++){const a=k*Math.PI/4;const x=sign*(.2+k*.04);facial([[x,.28,.45],[x+sign*.12,-.12,.46],[x+sign*.06,-.55,.35]],.3)}
}
for(let i=0;i<9;i++){const theta=i*Math.PI/4;const x=Math.cos(theta)*.42,y=1.3+Math.sin(theta)*.51;facial([[x,y,.03],[x*.8,1.3+(y-1.3)*.8,.24]],.32)}
const mouth=new THREE.Mesh(new THREE.TorusGeometry(.105,.009,5,32,Math.PI),new THREE.MeshBasicMaterial({color:0x86efff}));mouth.position.set(0,1.055,.36);mouth.rotation.z=Math.PI;figure.add(mouth);
const collar=new THREE.Mesh(new THREE.TorusGeometry(.46,.025,8,72),new THREE.MeshBasicMaterial({color:0x6cf4ff}));collar.position.y=.62;collar.rotation.x=Math.PI/2;figure.add(collar);
for(let i=0;i<5;i++){const hoop=new THREE.Mesh(new THREE.TorusGeometry(1.25+i*.18,.009,4,100),new THREE.MeshBasicMaterial({color:i%2?0x67eaff:0x117dff,transparent:true,opacity:.55}));hoop.position.y=-.2+i*.38;hoop.rotation.x=1.15+i*.12;figure.add(hoop)}
const pedestal=new THREE.Mesh(new THREE.CylinderGeometry(1.0,1.35,.18,64,1,true),mat(0x33e5ff,.7));pedestal.position.y=-1.3;figure.add(pedestal);
const light=new THREE.PointLight(0x43dfff,3,7);light.position.set(1,2,3);avatarEnv.scene.add(light);


/* Futuristic chrome-blue bust: dense layered facial contours and metallic energy filaments */
const contourMat=new THREE.MeshPhongMaterial({color:0x187bcb,emissive:0x0566ac,emissiveIntensity:.75,specular:0xb3faff,shininess:130,transparent:true,opacity:.43,side:THREE.DoubleSide,depthWrite:false});
const cranial=new THREE.Mesh(new THREE.SphereGeometry(.415,64,40),contourMat);cranial.position.y=1.3;cranial.scale.set(.85,1.17,.85);figure.add(cranial);
const jaw=new THREE.Mesh(new THREE.SphereGeometry(.27,40,24),contourMat);jaw.position.set(0,1.06,.04);jaw.scale.set(1,.52,.94);figure.add(jaw);
for(let i=0;i<12;i++){const phi=(i/11-.5)*Math.PI*.82;const pts=[];for(let j=0;j<50;j++){const a=(j/49-.5)*Math.PI*.95;const x=Math.cos(phi)*Math.sin(a)*.348,y=1.3+Math.sin(phi)*.48,z=Math.cos(phi)*Math.cos(a)*.34;pts.push([x,y,z])}facial(pts,i%3===0?.8:.25)}
for(let i=0;i<9;i++){const a=(i/8-.5)*Math.PI*.88;const pts=[];for(let j=0;j<50;j++){const p=(j/49-.5)*Math.PI;pts.push([Math.sin(a)*Math.cos(p)*.35,1.3+Math.sin(p)*.48,Math.cos(a)*Math.cos(p)*.34])}facial(pts,.24)}
const chestPlate=new THREE.Mesh(new THREE.SphereGeometry(.77,32,24),contourMat);chestPlate.position.y=-.02;chestPlate.scale.set(1.02,1.02,.61);figure.add(chestPlate);
for(let i=0;i<17;i++){const a=i*Math.PI*2/17;const p1=[Math.cos(a)*.42,.17,Math.sin(a)*.44],p2=[Math.cos(a+.13)*.58,-.25,Math.sin(a+.13)*.39],p3=[Math.cos(a+.24)*.42,-.78,Math.sin(a+.24)*.27];facial([p1,p2,p3],.27)}
const energyCore=new THREE.Mesh(new THREE.SphereGeometry(.17,32,24),new THREE.MeshBasicMaterial({color:0xaaffff}));energyCore.position.set(0,.05,.66);figure.add(energyCore);
const energyRing=new THREE.Mesh(new THREE.TorusGeometry(.245,.02,8,64),new THREE.MeshBasicMaterial({color:0x45cfff}));energyRing.position.set(0,.05,.67);figure.add(energyRing);
const shoulderGlow=new THREE.Mesh(new THREE.TorusGeometry(.95,.017,6,100,Math.PI),new THREE.MeshBasicMaterial({color:0x74ecff}));shoulderGlow.rotation.z=Math.PI;shoulderGlow.position.y=.26;shoulderGlow.scale.set(1.22,.45,1);figure.add(shoulderGlow);


/* ZARK // MARK-V cinematic android armor — custom Three.js geometry, no external assets */
const metal=new THREE.MeshStandardMaterial({color:0x092744,metalness:.88,roughness:.2,emissive:0x064e89,emissiveIntensity:.33,transparent:true,opacity:.93,side:THREE.DoubleSide});
const edgeMetal=new THREE.MeshStandardMaterial({color:0x277cbb,metalness:.8,roughness:.16,emissive:0x0878bd,emissiveIntensity:.5,side:THREE.DoubleSide});
const blackMetal=new THREE.MeshStandardMaterial({color:0x020a16,metalness:.75,roughness:.22,side:THREE.DoubleSide});
const glowMetal=new THREE.MeshBasicMaterial({color:0x9cf9ff});
function armorMesh(geo,m,x,y,z,sx=1,sy=1,sz=1){const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);figure.add(o);return o}
function armorLine(points,color=0x72e9ff,opacity=.85){facial(points,opacity)}
const helmet=armorMesh(new THREE.SphereGeometry(.433,64,48),metal,0,1.37,-.06,.94,1.19,.89);
const crown=armorMesh(new THREE.SphereGeometry(.435,40,20,0,Math.PI*2,0,Math.PI*.35),edgeMetal,0,1.39,-.05,.96,1.19,.91);
const faceplate=armorMesh(new THREE.SphereGeometry(.37,48,32,0,Math.PI*2,Math.PI*.18,Math.PI*.64),metal,0,1.32,.06,.91,1.16,.96);
const jawGuard=armorMesh(new THREE.CylinderGeometry(.26,.19,.24,8,1,false),edgeMetal,0,1.00,.15,1,.85,.76);
const noseGuard=armorMesh(new THREE.ConeGeometry(.075,.26,5),edgeMetal,0,1.28,.39,.78,1,.85);noseGuard.rotation.x=Math.PI;
for(const sign of [-1,1]){
  const cheek=armorMesh(new THREE.BoxGeometry(.23,.29,.095),edgeMetal,sign*.245,1.18,.278,.95,1,.85);cheek.rotation.z=sign*.25;
  const temple=armorMesh(new THREE.BoxGeometry(.11,.26,.19),blackMetal,sign*.345,1.46,.15);temple.rotation.z=sign*.2;
  const eyebrow=armorMesh(new THREE.BoxGeometry(.29,.055,.10),edgeMetal,sign*.16,1.54,.335);eyebrow.rotation.z=-sign*.18;
  const eyeSocket=armorMesh(new THREE.BoxGeometry(.205,.072,.05),blackMetal,sign*.155,1.445,.406);eyeSocket.rotation.z=sign*.13;
  const eyeLight=armorMesh(new THREE.BoxGeometry(.155,.035,.012),glowMetal,sign*.16,1.45,.44);eyeLight.rotation.z=sign*.14;
  const ear=armorMesh(new THREE.CylinderGeometry(.12,.12,.09,12),edgeMetal,sign*.413,1.32,-.03);ear.rotation.z=Math.PI/2;
  const earCore=armorMesh(new THREE.CylinderGeometry(.067,.067,.105,12),glowMetal,sign*.46,1.32,-.03);earCore.rotation.z=Math.PI/2;
  const shoulder=armorMesh(new THREE.SphereGeometry(.43,32,18),metal,sign*.85,.34,-.07,1.4,.56,1.03);shoulder.rotation.z=sign*.2;
  const shoulderPlate=armorMesh(new THREE.SphereGeometry(.41,32,18,0,Math.PI,0,Math.PI*.8),edgeMetal,sign*.88,.39,.04,1.38,.48,1.03);shoulderPlate.rotation.z=sign*.25;
  const upperArm=armorMesh(new THREE.CylinderGeometry(.23,.19,.78,16),metal,sign*1.06,-.28,-.04);upperArm.rotation.z=sign*.2;
  const forearm=armorMesh(new THREE.CylinderGeometry(.20,.14,.58,16),edgeMetal,sign*1.15,-.85,-.03);forearm.rotation.z=sign*.18;
  const clavicle=armorMesh(new THREE.BoxGeometry(.62,.16,.25),edgeMetal,sign*.39,.39,.45);clavicle.rotation.z=-sign*.2;
  const pec=armorMesh(new THREE.SphereGeometry(.52,32,20),metal,sign*.43,.02,.28,1,.55,.66);
  for(let j=0;j<5;j++)armorLine([[sign*(.17+j*.12),.34,.56],[sign*(.23+j*.12),.05,.62],[sign*(.18+j*.11),-.31,.48]],0x54dfff,.5);
  for(let j=0;j<4;j++)armorLine([[sign*.29,-.36-j*.12,.46],[sign*.68,-.36-j*.12,.35]],0x7eeeff,.5);
}
const neckArmor=armorMesh(new THREE.CylinderGeometry(.29,.36,.39,20,2,true),blackMetal,0,.64,-.04);
for(let j=0;j<5;j++){const neckRing=armorMesh(new THREE.TorusGeometry(.31,.012,6,36),j%2?edgeMetal:glowMetal,0,.5+j*.08,0);neckRing.rotation.x=Math.PI/2}
const sternum=armorMesh(new THREE.BoxGeometry(.3,.55,.18),edgeMetal,0,-.20,.48);
const reactorHousing=armorMesh(new THREE.TorusGeometry(.30,.08,12,60),blackMetal,0,.045,.69);
const reactorBezel=armorMesh(new THREE.TorusGeometry(.235,.025,10,60),edgeMetal,0,.045,.77);
const reactorGlass=armorMesh(new THREE.CircleGeometry(.18,48),new THREE.MeshBasicMaterial({color:0x94faff,transparent:true,opacity:.94}),0,.045,.786);
const reactorCross=armorMesh(new THREE.IcosahedronGeometry(.135,2),new THREE.MeshBasicMaterial({color:0xe6ffff,wireframe:true}),0,.045,.81);
const reactorLight=new THREE.PointLight(0x37cfff,4,3);reactorLight.position.set(0,.05,1.3);figure.add(reactorLight);
for(let j=0;j<6;j++){const rib=armorMesh(new THREE.BoxGeometry(.74,.08,.13),j%2?metal:edgeMetal,0,-.46-j*.12,.31-j*.025);rib.scale.x=1-j*.07}
const spine=armorMesh(new THREE.CylinderGeometry(.33,.26,1.1,16,1,true),metal,0,-.30,-.32);
const helmetOutline=armorMesh(new THREE.TorusGeometry(.44,.013,6,80),glowMetal,0,1.37,-.05,.96,1.18,1);helmetOutline.rotation.y=.1;
const backRing=armorMesh(new THREE.TorusGeometry(1.7,.023,8,120),edgeMetal,0,.02,-.55);backRing.rotation.y=.24;
const floatingHalo=armorMesh(new THREE.TorusGeometry(.67,.019,8,100),glowMetal,0,2.06,-.08);floatingHalo.rotation.x=.37;
const scanBar=armorMesh(new THREE.BoxGeometry(1.15,.012,.03),new THREE.MeshBasicMaterial({color:0x9dfaff,transparent:true,opacity:.65}),0,1.2,.55);
const fillLight=new THREE.PointLight(0x3dcaff,6,7);fillLight.position.set(-2,2,4);avatarEnv.scene.add(fillLight);
const rimLight=new THREE.PointLight(0xffc36d,3,6);rimLight.position.set(2,1,-1);avatarEnv.scene.add(rimLight);
avatarEnv.scene.add(figure);const particles=new THREE.BufferGeometry();const coords=[];for(let i=0;i<240;i++){coords.push((Math.random()-.5)*4,(Math.random()-.5)*4,(Math.random()-.5)*2)}particles.setAttribute("position",new THREE.Float32BufferAttribute(coords,3));const cloud=new THREE.Points(particles,new THREE.PointsMaterial({color:cyan,size:.027,transparent:true,opacity:.65}));avatarEnv.scene.add(cloud);let px=0,py=0;window.addEventListener('pointermove',e=>{px=(e.clientX/innerWidth-.5)*2;py=(e.clientY/innerHeight-.5)*2},{passive:true});const animate=t=>{figure.rotation.y=Math.sin(t*.00045)*.22+px*.22;figure.rotation.x=-py*.065;figure.position.y=Math.sin(t*.0012)*.07;core.rotation.y=t*.001;energyRing.rotation.z=t*.0015;energyCore.scale.setScalar(1+Math.sin(t*.003)*.09);reactorCross.rotation.z=t*.0012;reactorGlass.material.opacity=.78+Math.sin(t*.003)*.18;scanBar.position.y=1.3+Math.sin(t*.0016)*.46;floatingHalo.rotation.z=t*.0003;halo.rotation.z=t*.0002;cloud.rotation.y=t*.00004;avatarEnv.renderer.render(avatarEnv.scene,avatarEnv.camera);if(!reduced)requestAnimationFrame(animate)};requestAnimationFrame(animate)}
let audio=null,enabled=false;const toggle=document.getElementById("sound-toggle");function chirp(freq=660){if(!enabled)return;try{audio??=new (window.AudioContext||window.webkitAudioContext)();const osc=audio.createOscillator(),gain=audio.createGain();osc.type="sine";osc.frequency.setValueAtTime(freq,audio.currentTime);osc.frequency.exponentialRampToValueAtTime(freq*1.45,audio.currentTime+.08);gain.gain.setValueAtTime(.0001,audio.currentTime);gain.gain.exponentialRampToValueAtTime(.045,audio.currentTime+.015);gain.gain.exponentialRampToValueAtTime(.0001,audio.currentTime+.16);osc.connect(gain).connect(audio.destination);osc.start();osc.stop(audio.currentTime+.17)}catch(e){}}
toggle?.addEventListener("click",()=>{enabled=!enabled;toggle.textContent=enabled?"♫ AUDIO ON":"♫ AUDIO OFF";toggle.setAttribute("aria-pressed",String(enabled));chirp(900)});document.querySelectorAll("button:not(#sound-toggle)").forEach(b=>b.addEventListener("click",()=>chirp(b.id==="mic"?920:530)));