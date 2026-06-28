import { useState, useEffect, useRef } from "react";
import * as THREE from "three";

import config from '../config.json';

const SKY      = "#4fa3d1";
const MINT     = "#52c9a0";
const CREAM    = "#f0f9f4";
const DARK     = "#1a1a2e";

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return mobile;
}

const BOARD_BG = "#111111";
const AMBER    = "#ffffff";
const CHARS = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.-:";

function SplitFlapChar({ target, delay = 0, size = "lg", shuffleKey = 0 }) {
  const [display, setDisplay] = useState(" ");
  const rafRef = useRef(null);
  useEffect(() => {
    let frame = 0;
    const targetIdx = Math.max(0, CHARS.indexOf(target.toUpperCase()));
    const totalFrames = (targetIdx + 2) * 3;
    const tick = () => {
      frame++;
      const idx = Math.min(frame, targetIdx);
      setDisplay(idx >= targetIdx ? target.toUpperCase() : CHARS[idx] || " ");
      if (frame < totalFrames) rafRef.current = setTimeout(tick, 40);
    };
    const t = setTimeout(tick, delay);
    return () => { clearTimeout(t); clearTimeout(rafRef.current); };
  }, [target, delay, shuffleKey]);
  const sm = size === "sm";
  return (
    <span style={{
      position: "relative", overflow: "hidden",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: sm ? "1.8ch" : "2.1ch",
      height: sm ? "2rem" : "2.8rem",
      background: BOARD_BG, color: AMBER,
      fontFamily: "'Courier New', monospace", fontWeight: 700,
      fontSize: sm ? "1rem" : "1.4rem",
      borderRadius: 4, margin: "0 2px", border: "1px solid #333",
      boxShadow: "inset 0 1px 4px rgba(0,0,0,0.6)", userSelect: "none",
    }}>
      {display}
      <span aria-hidden style={{
        position: "absolute", left: 0, right: 0, top: "50%",
        height: 2, background: "rgba(0,0,0,0.6)",
        transform: "translateY(-50%)", pointerEvents: "none",
      }} />
    </span>
  );
}

function SolariBoard({ text, label, size = "lg", shuffleKey = 0 }) {
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      {label && <span style={{ fontSize: 11, color: "#888", letterSpacing: 2, fontWeight: 700, textTransform: "uppercase" }}>{label}</span>}
      <div style={{
        background: "#0a0a0a", border: "3px solid #2a2a2a", borderRadius: 10,
        padding: size === "sm" ? "10px 14px 8px" : "14px 20px 10px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        display: "flex", alignItems: "center", flexWrap: "wrap", justifyContent: "center", gap: 2,
      }}>
        {text.toUpperCase().split("").map((c, i) =>
          c === " "
            ? <span key={i} style={{ width: size === "sm" ? "0.6ch" : "0.8ch" }} />
            : <SplitFlapChar key={i} target={c} delay={i * 60} size={size} shuffleKey={shuffleKey} />
        )}
      </div>
    </div>
  );
}

function buildPlane(scene) {
  const group = new THREE.Group();
  const white = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
  const blue  = new THREE.MeshBasicMaterial({ color: 0x4fa3d1, side: THREE.DoubleSide });

  const fuse = new THREE.Mesh(new THREE.CylinderGeometry(0.072, 0.042, 1.0, 12), white);
  fuse.rotation.z = Math.PI / 2;
  group.add(fuse);

  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.072, 0.2, 10), blue);
  nose.rotation.z = -Math.PI / 2;
  nose.position.set(0.6, 0, 0);
  group.add(nose);

  const wingShape = new THREE.Shape();
  wingShape.moveTo(0.1, 0);
  wingShape.lineTo(-0.1, 0);
  wingShape.lineTo(-0.22, -0.6);
  wingShape.lineTo(0.06, -0.6);
  wingShape.lineTo(0.1, 0);
  const wingGeo = new THREE.ShapeGeometry(wingShape);
  const wingL = new THREE.Mesh(wingGeo, blue);
  wingL.position.set(-0.02, 0.01, 0);
  group.add(wingL);
  const wingR = wingL.clone();
  wingR.scale.y = -1;
  group.add(wingR);

  const stabShape = new THREE.Shape();
  stabShape.moveTo(0.06, 0);
  stabShape.lineTo(-0.06, 0);
  stabShape.lineTo(-0.14, -0.28);
  stabShape.lineTo(0.02, -0.28);
  stabShape.lineTo(0.06, 0);
  const stabGeo = new THREE.ShapeGeometry(stabShape);
  const stabL = new THREE.Mesh(stabGeo, blue);
  stabL.position.set(-0.46, 0.01, 0);
  group.add(stabL);
  const stabR = stabL.clone();
  stabR.scale.y = -1;
  group.add(stabR);

  const vtShape = new THREE.Shape();
  vtShape.moveTo(0, 0);
  vtShape.lineTo(0, 0.3);
  vtShape.lineTo(-0.22, 0.28);
  vtShape.lineTo(-0.3, 0);
  vtShape.lineTo(0, 0);
  const vtGeo = new THREE.ShapeGeometry(vtShape);
  const vt = new THREE.Mesh(vtGeo, blue);
  vt.position.set(-0.4, 0.072, 0);
  group.add(vt);

  group.position.set(-4, -2.8, 1);
  group.rotation.z = 0.32;
  scene.add(group);
  return group;
}

function SkyCanvas({ scrollY }) {
  const mountRef = useRef(null);
  const sceneRef = useRef({});

  useEffect(() => {
    const el = mountRef.current;
    const W = el.clientWidth, H = el.clientHeight;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000);
    camera.position.set(0, 0, 5);

    const skyMat = new THREE.ShaderMaterial({
      uniforms: {
        uTop: { value: new THREE.Color("#b8e4f7") },
        uBot: { value: new THREE.Color("#e8f8f0") },
        uProgress: { value: 0 },
      },
      vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
      fragmentShader: `uniform vec3 uTop,uBot; uniform float uProgress; varying vec2 vUv;
        void main(){
          vec3 top=mix(uTop,vec3(0.08,0.18,0.45),uProgress);
          vec3 bot=mix(uBot,vec3(0.05,0.12,0.35),uProgress);
          gl_FragColor=vec4(mix(bot,top,vUv.y),1.0);
        }`,
    });
    const bg = new THREE.Mesh(new THREE.PlaneGeometry(30, 20), skyMat);
    bg.position.set(0, 0, -2);
    scene.add(bg);

    const cloudMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.88 });
    const clouds = [];
    for (let i = 0; i < 14; i++) {
      const g = new THREE.Group();
      for (let j = 0; j < 4; j++) {
        const s = new THREE.Mesh(new THREE.SphereGeometry(0.14 + Math.random() * 0.26, 8, 6), cloudMat);
        s.position.set((Math.random() - 0.5) * 0.65, (Math.random() - 0.5) * 0.15, 0);
        g.add(s);
      }
      g.position.set((Math.random() - 0.5) * 16, (Math.random() - 0.5) * 4 + 0.5, -1 + Math.random() * 0.5);
      g.userData.speed = 0.002 + Math.random() * 0.003;
      scene.add(g);
      clouds.push(g);
    }

    const planeGroup = buildPlane(scene);
    sceneRef.current = { renderer, scene, camera, clouds, skyMat, planeGroup };

    let id;
    const animate = () => {
      id = requestAnimationFrame(animate);
      clouds.forEach(c => { c.position.x -= c.userData.speed; if (c.position.x < -9) c.position.x = 9; });
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth, h = mountRef.current.clientHeight;
      camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mountRef.current) mountRef.current.innerHTML = "";
    };
  }, []);

  useEffect(() => {
    const { skyMat, planeGroup } = sceneRef.current;
    if (!skyMat || !planeGroup) return;
    const p = Math.min(scrollY / 600, 1);
    skyMat.uniforms.uProgress.value = p * 0.6;
    planeGroup.position.x = -4 + p * 9;
    planeGroup.position.y = -2.8 + p * 6;
    planeGroup.rotation.z = 0.32 - p * 0.28;
  }, [scrollY]);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
}

function ProjectCard({ project, index }) {
  const [hovered, setHovered] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const images = project.images || [];
  const bullets = project.bullets || [];
  const visible = expanded ? bullets : bullets.slice(0, 3);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => setActiveIdx(i => (i + 1) % images.length), 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{
      background: "#fff",
      border: `1.5px solid ${hovered ? "#aaa" : "#e4e4e4"}`,
      borderRadius: 14, overflow: "hidden",
      transform: hovered ? "translateY(-5px)" : "translateY(0)",
      transition: "all 0.22s cubic-bezier(.34,1.56,.64,1)",
      boxShadow: hovered ? "0 12px 36px rgba(0,0,0,0.11)" : "0 2px 10px rgba(0,0,0,0.05)",
    }}>
      <div style={{ height: 4, background: SKY }} />

      <div style={{ padding: "14px 18px 12px", borderBottom: "1px solid #efefef", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 10, color: "#bbb", letterSpacing: 2, fontWeight: 700, textTransform: "uppercase", marginBottom: 3 }}>
            {project.subtitle || project.title}
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, color: DARK, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{project.title}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "'Courier New', monospace", flexShrink: 0 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: DARK, letterSpacing: -0.5 }}>{project.from}</div>
            <div style={{ fontSize: 8, color: "#bbb", letterSpacing: 1 }}>ORIGIN</div>
          </div>
          <div style={{ color: "#ddd", fontSize: 12 }}>&mdash;</div>
          <span style={{ fontSize: 14, color: SKY }}>&#9992;</span>
          <div style={{ color: "#ddd", fontSize: 12 }}>&mdash;</div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: DARK, letterSpacing: -0.5 }}>{project.to}</div>
            <div style={{ fontSize: 8, color: "#bbb", letterSpacing: 1 }}>DEST</div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", borderBottom: "1px solid #efefef" }}>
        {[["DATE", project.date], ["SEAT", project.seat], ["GATE", project.gate]].map(([k, v], i, arr) => (
          <div key={k} style={{ flex: 1, padding: "8px 12px", borderRight: i < arr.length - 1 ? "1px solid #efefef" : "none" }}>
            <div style={{ fontSize: 8, color: "#c0c0c0", letterSpacing: 1.5, fontWeight: 700, textTransform: "uppercase", marginBottom: 2 }}>{k}</div>
            <div style={{ fontSize: 11, fontWeight: 800, color: DARK, fontFamily: "'Courier New', monospace" }}>{v}</div>
          </div>
        ))}
      </div>

      {images.length > 0 ? (
        <div style={{ position: "relative", height: 128, overflow: "hidden", background: "#f5f5f5" }}>
          <div style={{ display: "flex", height: "100%", transform: `translateX(-${activeIdx * 100}%)`, transition: "transform 0.4s cubic-bezier(.22,1,.36,1)" }}>
            {images.map((src, i) => (
              <img key={i} src={src} alt={`${project.name} screenshot ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", flexShrink: 0 }} />
            ))}
          </div>
          {images.length > 1 && (
            <>
              <button onClick={() => setActiveIdx(i => (i - 1 + images.length) % images.length)}
                style={{ position: "absolute", left: 4, top: "50%", transform: "translateY(-50%)", width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.85)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, opacity: hovered ? 1 : 0, transition: "opacity 0.2s" }}>
                &#8249;
              </button>
              <button onClick={() => setActiveIdx(i => (i + 1) % images.length)}
                style={{ position: "absolute", right: 4, top: "50%", transform: "translateY(-50%)", width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.85)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, opacity: hovered ? 1 : 0, transition: "opacity 0.2s" }}>
                &#8250;
              </button>
              <div style={{ position: "absolute", bottom: 6, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 4 }}>
                {images.map((_, i) => (
                  <button key={i} onClick={() => setActiveIdx(i)}
                    style={{ width: 6, height: 6, borderRadius: "50%", border: "none", cursor: "pointer", background: i === activeIdx ? "#fff" : "rgba(255,255,255,0.5)", transition: "all 0.2s" }} />
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <div style={{ height: 96, background: "#f7f7f7", display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid #efefef" }}>
          <span style={{ fontSize: 10, color: "#bbb", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>No screenshot</span>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", padding: "12px 0", margin: "0 16px" }}>
        <div style={{ width: 13, height: 13, borderRadius: "50%", background: CREAM, border: "1.5px solid #e4e4e4", flexShrink: 0, marginLeft: -25 }} />
        <div style={{ flex: 1, borderTop: "2px dashed #e8e8e8" }} />
        <div style={{ width: 13, height: 13, borderRadius: "50%", background: CREAM, border: "1.5px solid #e4e4e4", flexShrink: 0, marginRight: -25 }} />
      </div>

      <div style={{ padding: "0 16px 16px" }}>
        <ul style={{ margin: 0, padding: 0, listStyle: "none", marginBottom: 14 }}>
          {visible.map((b, i) => (
            <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "#555", lineHeight: 1.65, marginBottom: 8 }}>
              <span style={{ marginTop: 7, width: 6, height: 6, borderRadius: "50%", background: SKY, flexShrink: 0 }} />
              {b}
            </li>
          ))}
        </ul>
        {bullets.length > 3 && (
          <button onClick={() => setExpanded(!expanded)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: "#999", padding: 0, marginBottom: 14 }}>
            {expanded ? <>&#9650; Show less</> : <>&#9660; +{bullets.length - 3} more</>}
          </button>
        )}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
          {project.badges.map(t => (
            <span key={t} style={{
              background: "#fff", color: "#222", border: "1.5px solid #333",
              borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700, letterSpacing: 0.2,
            }}>{t}</span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {project.visitUrl && (
            <a href={project.visitUrl} target="_blank" rel="noopener noreferrer" style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
              background: DARK, color: "#fff", border: "none", borderRadius: 8,
              padding: "9px 0", fontSize: 12, fontWeight: 700, textDecoration: "none", letterSpacing: 0.4,
            }}>&#127760; Live Site</a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
              background: "#fff", color: DARK, border: `1.5px solid ${DARK}`, borderRadius: 8,
              padding: "9px 0", fontSize: 12, fontWeight: 700, textDecoration: "none", letterSpacing: 0.4,
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function Nav({ navSolid, mobile }) {
  const [open, setOpen] = useState(false);
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: navSolid || open ? "rgba(240,249,244,0.96)" : "transparent",
      backdropFilter: navSolid || open ? "blur(14px)" : "none",
      borderBottom: navSolid || open ? "1px solid #d4ece2" : "none",
      transition: "all 0.3s",
      padding: mobile ? "12px 20px" : "14px 40px",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ fontSize: 16 }}>&#9992;&#65039;</span>
          <span style={{ fontWeight: 900, fontSize: 13, color: SKY, letterSpacing: 2, textTransform: "uppercase" }}>Dev.Port</span>
        </div>
        {mobile ? (
          <button onClick={() => setOpen(o => !o)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: DARK, padding: 4 }}>
            {open ? "\u2715" : "\u2630"}
          </button>
        ) : (
          <div style={{ display: "flex", gap: 28 }}>
            {["Skills", "Projects", "Contact"].map(s => (
              <a key={s} href={`#${s.toLowerCase()}`} style={{ color: DARK, textDecoration: "none", fontSize: 13, fontWeight: 600, opacity: 0.65, letterSpacing: 0.5 }}>{s}</a>
            ))}
          </div>
        )}
      </div>
      {mobile && open && (
        <div style={{ paddingTop: 14, paddingBottom: 8, display: "flex", flexDirection: "column", gap: 2 }}>
          {["Skills", "Projects", "Contact"].map(s => (
            <a key={s} href={`#${s.toLowerCase()}`} onClick={() => setOpen(false)}
              style={{ color: DARK, textDecoration: "none", fontSize: 15, fontWeight: 600, padding: "10px 0", borderBottom: "1px solid #e8f0ec", opacity: 0.75 }}>{s}</a>
          ))}
        </div>
      )}
    </nav>
  );
}

export default function New() {
  const [scrollY, setScrollY] = useState(0);
  const [navSolid, setNavSolid] = useState(false);
  const [shuffleKey, setShuffleKey] = useState(0);
  const containerRef = useRef(null);
  const mobile = useIsMobile();

  useEffect(() => {
    const timer = setInterval(() => setShuffleKey(k => k + 1), 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => { setScrollY(el.scrollTop); setNavSolid(el.scrollTop > 60); };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const h = config.hero;
  const MAIN_SKILL_COLORS = { indigo: SKY, violet: SKY, blue: SKY, emerald: MINT };
  const cSkills = config.skills;
  const cProjects = config.projects;

  return (
    <div style={{ position: "relative", height: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", background: CREAM, color: DARK }}>

      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <SkyCanvas scrollY={scrollY} />
      </div>

      <div ref={containerRef} style={{ position: "relative", zIndex: 1, height: "100vh", overflowY: "auto", scrollBehavior: "smooth" }}>

      <Nav navSolid={navSolid} mobile={mobile} />

      <section style={{ position: "relative", height: "100vh", marginTop: -53, overflow: "hidden", display: "flex", alignItems: "center" }}>
        <div style={{ position: "relative", zIndex: 2, padding: mobile ? "0 6vw" : "0 8vw", maxWidth: 680 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, color: SKY, textTransform: "uppercase", marginBottom: 14, background: "rgba(255,255,255,0.78)", display: "inline-block", padding: "4px 14px", borderRadius: 20, border: "1px solid rgba(79,163,209,0.25)" }}>
            Now boarding &#9992;
          </div>
          <h1 style={{ fontSize: mobile ? "2.1rem" : "clamp(2.4rem,5.5vw,4rem)", fontWeight: 900, lineHeight: 1.1, color: DARK, margin: "0 0 16px", textShadow: "0 2px 16px rgba(255,255,255,0.9)" }}>
            {h.headline.line1}<br />
            <span style={{ color: SKY }}>{h.headline.accentWord}</span> {h.headline.line2}<br />
            that <span style={{ color: MINT }}>{h.headline.accentPhrase}</span>
          </h1>
          <p style={{ fontSize: 14, color: "#445", lineHeight: 1.75, margin: "0 0 26px", maxWidth: 400, background: "rgba(255,255,255,0.65)", padding: "10px 14px", borderRadius: 10 }}>
            Hi, I'm <strong>{h.introName}</strong>{h.introSuffix}
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a href="#projects" style={{ background: SKY, color: "#fff", padding: mobile ? "11px 20px" : "12px 26px", borderRadius: 10, fontWeight: 700, fontSize: 13, textDecoration: "none", boxShadow: "0 4px 18px rgba(79,163,209,0.35)" }}>
              View projects &#8595;
            </a>
            <a href="#contact" style={{ background: "rgba(255,255,255,0.82)", color: DARK, padding: mobile ? "11px 20px" : "12px 26px", borderRadius: 10, fontWeight: 700, fontSize: 13, textDecoration: "none", border: "1.5px solid #cce6da" }}>
              Get in touch
            </a>
          </div>
        </div>
      </section>

      <section style={{ background: "#0f0f0f", padding: mobile ? "48px 20px" : "64px 40px", textAlign: "center" }}>
        <p style={{ fontSize: 10, letterSpacing: 3, color: "#555", textTransform: "uppercase", marginBottom: 28 }}>Departure board</p>
        <SolariBoard text={h.name} label="Passenger" size={mobile ? "sm" : "lg"} shuffleKey={shuffleKey} />
        <div style={{ marginTop: 20 }}>
          <SolariBoard text={h.role} label="Role" size={mobile ? "sm" : "lg"} shuffleKey={shuffleKey} />
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: mobile ? 18 : 36, marginTop: 36, flexWrap: "wrap" }}>
          {[["LOCATION", config.location.toUpperCase()], ["EXPERIENCE", `${config.experience} YEARS`]].map(([k, v]) => (
            <div key={k} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "#888", letterSpacing: 2, fontWeight: 700, marginBottom: 6, textTransform: "uppercase" }}>{k}</div>
              <div style={{ background: BOARD_BG, border: "1px solid #333", borderRadius: 6, padding: "5px 10px", display: "inline-flex", gap: 2 }}>
                {v.split("").map((c, i) =>
                  c === " "
                    ? <span key={i} style={{ width: mobile ? "0.6ch" : "0.8ch" }} />
                    : <SplitFlapChar key={i} target={c} delay={900 + i * 55} size={mobile ? "sm" : "lg"} shuffleKey={shuffleKey} />
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="skills" style={{ padding: mobile ? "56px 5vw" : "80px 8vw", textAlign: "center" }}>
        <div style={{ textAlign: "center", marginBottom: 44, background: "rgba(255,255,255,0.75)", padding: "24px 32px", borderRadius: 16, display: "inline-block" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, color: MINT, textTransform: "uppercase", marginBottom: 10 }}>Tech stack</div>
          <h2 style={{ fontSize: mobile ? "1.7rem" : "clamp(1.8rem,4vw,2.6rem)", fontWeight: 900, margin: 0 }}>Skills manifest</h2>
          <p style={{ color: "#778", marginTop: 8, fontSize: 14 }}>Everything packed for the journey</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(auto-fit,minmax(220px,1fr))", gap: 14 }}>
          {cSkills.map(g => {
            const color = MAIN_SKILL_COLORS[g.accent] || SKY;
            return (
              <div key={g.id} style={{ background: "#fff", border: "1.5px solid #e0ede8", borderRadius: 14, padding: mobile ? "16px 14px" : "22px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: color === SKY ? "rgba(79,163,209,0.12)" : "rgba(82,201,160,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>{g.emoji}</div>
                  <div style={{ fontWeight: 800, fontSize: 13, color: DARK }}>{g.label}</div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {g.items.map(s => (
                    <span key={s} style={{
                      background: color === SKY ? "rgba(79,163,209,0.09)" : "rgba(82,201,160,0.09)",
                      color: color,
                      border: `1px solid ${color === SKY ? "rgba(79,163,209,0.28)" : "rgba(82,201,160,0.28)"}`,
                      borderRadius: 20, padding: "3px 9px", fontSize: mobile ? 10 : 11, fontWeight: 700,
                    }}>{s}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section id="projects" style={{ padding: mobile ? "48px 5vw 64px" : "56px 8vw 80px", textAlign: "center" }}>
        <div style={{ textAlign: "center", marginBottom: 44, background: "rgba(255,255,255,0.75)", padding: "24px 32px", borderRadius: 16, display: "inline-block" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, color: SKY, textTransform: "uppercase", marginBottom: 10 }}>Portfolio</div>
          <h2 style={{ fontSize: mobile ? "1.7rem" : "clamp(1.8rem,4vw,2.6rem)", fontWeight: 900, margin: 0 }}>Flight log</h2>
          <p style={{ color: "#778", marginTop: 8, fontSize: 14 }}>Projects that have taken off</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(auto-fit,minmax(300px,1fr))", gap: 20 }}>
          {cProjects.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
        </div>
      </section>

      <footer id="contact" style={{ background: DARK, color: "#fff", padding: mobile ? "56px 6vw 36px" : "72px 8vw 40px" }}>
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 10, letterSpacing: 3, color: MINT, fontWeight: 700, textTransform: "uppercase", marginBottom: 12 }}>Arrival</div>
          <h2 style={{ fontSize: mobile ? "1.5rem" : "clamp(1.6rem,4vw,2.4rem)", fontWeight: 900, margin: "0 0 12px" }}>Let's work together</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.75, marginBottom: 30 }}>
            Open to new opportunities, freelance projects, and interesting conversations. Reach out and let's build something great.
          </p>
          <div style={{ display: "flex", flexDirection: mobile ? "column" : "row", gap: 10, justifyContent: "center", alignItems: "center", marginBottom: 44 }}>
            <a href={`mailto:${config.email}`} style={{ background: SKY, color: "#fff", padding: "12px 26px", borderRadius: 10, fontWeight: 700, fontSize: 13, textDecoration: "none", width: mobile ? "100%" : "auto", boxSizing: "border-box", textAlign: "center" }}>
              &#9993;&#65039; Send an email
            </a>
            <a href={config.linkedin} target="_blank" rel="noopener noreferrer" style={{ background: "rgba(255,255,255,0.07)", color: "#fff", padding: "12px 26px", borderRadius: 10, fontWeight: 700, fontSize: 13, textDecoration: "none", border: "1.5px solid rgba(255,255,255,0.14)", width: mobile ? "100%" : "auto", boxSizing: "border-box", textAlign: "center" }}>
              LinkedIn &#8594;
            </a>
            <a href={config.github} target="_blank" rel="noopener noreferrer" style={{ background: "rgba(255,255,255,0.07)", color: "#fff", padding: "12px 26px", borderRadius: 10, fontWeight: 700, fontSize: 13, textDecoration: "none", border: "1.5px solid rgba(255,255,255,0.14)", width: mobile ? "100%" : "auto", boxSizing: "border-box", textAlign: "center" }}>
              GitHub &#8594;
            </a>
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", fontFamily: "'Courier New', monospace", letterSpacing: 0.5, marginBottom: 30 }}>
            {config.email}
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 22, display: "flex", flexDirection: mobile ? "column" : "row", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>&#9992;&#65039; DEV.PORT — Cleared for takeoff</span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>&copy; 2026 {h.introName}</span>
          </div>
        </div>
      </footer>

      </div>
    </div>
  );
}
