import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';

/**
 * The hero background: one lit argon tube across the page, drawn the way a
 * real sign tube looks.
 *
 * - The light fills the tube's whole bore: an even bar with a crisp edge at
 *   the glass, white-hot in the middle and saturated toward the wall.
 * - The halo is a separate, softer pass outside the glass. Blurring the core
 *   itself is what makes fake neon look muddy.
 * - Brightness is even end to end.
 * - Pure argon glows a pale lavender; the vivid violet of a sign comes from
 *   argon with a trace of mercury in a phosphor-coated tube, which is the
 *   colour used here.
 * - It flickers irregularly while it strikes, then holds steady.
 *
 * The tube enters from beyond the left edge on the "link" side, runs between
 * the two headline lines, and bends down at the right into a neon download
 * arrow that lands in a tray beside the word "file". When the hero demo fetches, a band of brighter light
 * runs the whole path, turns the corner and drops into the arrow, and the tray
 * flashes as the result lands. The pointer warms the stretch it is near.
 *
 * Plain WebGL2 and one fragment shader, so the effect costs no library. Without
 * WebGL2 the host's CSS background shows instead.
 */
const VERTEX = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

const FRAGMENT = `#version 300 es
precision highp float;

uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;     // 0..1, origin bottom-left
uniform float uPull;     // 0 when the pointer is away, 1 when it is over the hero
uniform float uCharge;   // 0..1, the tube striking on page load
uniform float uTube;     // tube height, 0..1 from the bottom
uniform float uFlow;     // 0..1, current surging while a fetch runs
uniform float uPulse;    // 0..1, strength of the travelling band
uniform float uPulseX;   // its position along the path, 0 = link end, 1 = arrow tip
uniform float uFloor;    // baseline of the second headline line, 0..1 from the bottom
uniform float uArrowX;   // right edge of the arrow's column, 0..1 from the left
uniform float uArrowW;   // width of that column, as a fraction of the width
uniform float uLand;     // 0..1, the arrow and tray flashing as a fetch lands

out vec4 outColor;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p *= 2.03;
    a *= 0.5;
  }
  return v;
}

float band(float x, float at, float width) {
  float k = (x - at) / width;
  return exp(-k * k);
}

// Light reaching p from a glowing segment a-b, integrated along its length in
// closed form. Light from every piece simply adds, so there is no edge where
// one piece hands over to another, and a long run of glass glows more than a
// short one, as it would for real. Two falloffs come back:
//   x - inverse square: the soft, wide glow that carries across the page
//   y - inverse cube: the bright band that hugs the glass
// soft keeps both finite inside the glass.
vec2 lineLight(vec2 p, vec2 a, vec2 b, float soft) {
  vec2 ab = b - a;
  float len = length(ab);
  vec2 dir = ab / len;
  float t = dot(p - a, dir);
  float h2 = dot(p - a - dir * t, p - a - dir * t) + soft * soft;
  float h = sqrt(h2);
  float e = len - t;
  float wide = (atan(e / h) + atan(t / h)) / h;
  float tight = (e / sqrt(e * e + h2) + t / sqrt(t * t + h2)) / h2;
  return vec2(wide, tight);
}

// Distance from p to the segment a-b (x), and how far along it the nearest point is (y), in px.
vec2 seg(vec2 p, vec2 a, vec2 b) {
  vec2 ab = b - a;
  float h = clamp(dot(p - a, ab) / dot(ab, ab), 0.0, 1.0);
  return vec2(length(p - a - ab * h), h * length(ab));
}

// --- Per-piece accumulation -------------------------------------------------
// Every piece of glass reports in. The crisp bore comes from the nearest piece,
// but glow and brightness are blended across all of them with a smooth
// minimum, so there is no seam where one piece hands over to the next.
float gK;        // blend width, px
float gMin;      // nearest distance so far
float gW;        // sum of blend weights
float gWLevel;   // weighted sum of brightness
float gWBloomD;  // weighted sum of distance (for the smooth-min)
float gBase;     // brightness before per-piece effects
float gToTip;    // path length from the link end to the arrow tip

float pieceLevel(float along, float arrow, float tray) {
  float lev = gBase;
  lev += band(along, uPulseX * gToTip, uRes.x * 0.04) * uPulse * 1.4 * (1.0 - tray);
  lev += uLand * (tray * 1.1 + arrow * 0.6);
  return lev;
}

// Weights are kept relative to a fixed reference so they never underflow.
void piece(float d, float along, float arrow, float tray, float ref) {
  float w = exp(-(d - ref) / gK);
  gW += w;
  gWLevel += w * pieceLevel(along, arrow, tray);
  gMin = min(gMin, d);
}

void main() {
  vec2 px = gl_FragCoord.xy;
  vec2 uv = px / uRes;
  float aspect = uRes.x / uRes.y;
  float t = uTime;

  // --- Room: drifting smoke, domain-warped so it curls instead of sliding ----
  // The tube lights it further down, so the smoke glows where it passes the glass.
  vec2 p = vec2(uv.x * aspect, uv.y);
  vec2 q = vec2(fbm(p * 1.4 + t * 0.03), fbm(p * 1.4 - t * 0.025 + 7.0));
  float gas = fbm(p * 2.1 + q * 1.9 + t * 0.02);
  float smoke = smoothstep(0.35, 0.95, gas);
  vec3 col = mix(vec3(0.04, 0.014, 0.11), vec3(0.16, 0.05, 0.34), smoke);

  // --- Geometry -------------------------------------------------------------
  // The tube enters from beyond the left edge of the page, runs across, and
  // bends down into a download arrow over a tray. The arrow is sized from the
  // room above the second headline line, in units of u, so it never touches
  // the text at any screen size.
  float scale = min(uRes.x, uRes.y * 1.6);
  float y0 = uTube * uRes.y;
  float x0 = -uRes.x * 0.05;
  // The arrow fits both the drop from the tube to the baseline (7 units tall)
  // and the column beside the second line (a tray 4.8 units wide).
  float avail = max(y0 - uFloor * uRes.y, 40.0);
  float u = max(min(avail / 7.0, uArrowW * uRes.x * 0.72 / 4.8), 5.0);
  float bore = min(scale * 0.011, u * 0.42);    // radius of the glowing gas, in px
  float wall = bore * 1.28;                      // outer radius of the glass

  float cr = 1.5 * u;          // bend radius
  float tw = 2.4 * u;          // tray half width
  float th = 1.2 * u;          // tray wall height
  float aw = 1.6 * u;          // arrowhead arm reach
  // Where the tube turns down: the arrow sits against the right edge of its
  // column, leaving clear space between it and the end of the second line.
  float xB = uArrowX * uRes.x - tw - bore * 1.3;
  float trayY = y0 - 7.0 * u + bore;  // the tray's floor sits on the baseline
  float tipY = trayY + 1.7 * u;

  // Striking: irregular blinks while the tube comes up, then it holds.
  float strikeNoise = hash(vec2(floor(t * 18.0), 3.1));
  float on = uCharge >= 0.999 ? 1.0 : mix(0.08, 1.0, step(1.0 - uCharge * 0.9, strikeNoise)) * smoothstep(0.0, 0.15, uCharge);

  // The pointer warms the glass near it. Measured from the pointer itself, so
  // the warm spot is round and continuous across every piece.
  vec2 m = uMouse * uRes;
  float warm = exp(-length(px - m) / (uRes.y * 0.16)) * uPull * 0.35;

  gBase = (1.0 + uFlow * 0.18 + warm) * on * (0.985 + 0.015 * noise(vec2(t * 7.0, 0.0)));
  gK = bore * 0.9;
  gMin = 1e9;
  gW = 0.0;
  gWLevel = 0.0;

  float lenH = xB - cr - x0;
  float lenArc = 1.5707963 * cr;
  gToTip = lenH + lenArc + (y0 - cr - tipY);

  // A reference distance for the blend weights: the straight run is always
  // close enough to everything on screen that this never underflows.
  vec2 h = seg(px, vec2(x0, y0), vec2(xB - cr, y0));
  float ref = h.x;

  piece(h.x, h.y, 0.0, 0.0, ref);

  // The bend: inside its quarter the distance is to the curve, outside it the
  // nearest point is one of its ends, which the straight pieces already cover.
  vec2 c = px - vec2(xB - cr, y0 - cr);
  // atan(0, 0) is undefined in GLSL and returns NaN on some GPUs, which would
  // poison every pixel outside the bend; keep x off zero.
  float ang = atan(max(c.y, 0.0), max(c.x, 1e-3));
  float inArc = step(0.0, c.x) * step(0.0, c.y);
  float dArc = mix(min(length(px - vec2(xB - cr, y0)), length(px - vec2(xB, y0 - cr))),
                   abs(length(c) - cr), inArc);
  piece(dArc, lenH + (1.5707963 - ang) * cr, 0.0, 0.0, ref);

  vec2 v = seg(px, vec2(xB, y0 - cr), vec2(xB, tipY));
  piece(v.x, lenH + lenArc + v.y, 1.0, 0.0, ref);

  vec2 armL = seg(px, vec2(xB, tipY), vec2(xB - aw, tipY + aw));
  vec2 armR = seg(px, vec2(xB, tipY), vec2(xB + aw, tipY + aw));
  piece(armL.x, gToTip, 1.0, 0.0, ref);
  piece(armR.x, gToTip, 1.0, 0.0, ref);

  vec2 postL = seg(px, vec2(xB - tw, trayY + th), vec2(xB - tw, trayY));
  vec2 floorT = seg(px, vec2(xB - tw, trayY), vec2(xB + tw, trayY));
  vec2 postR = seg(px, vec2(xB + tw, trayY), vec2(xB + tw, trayY + th));
  piece(postL.x, 0.0, 0.0, 1.0, ref);
  piece(floorT.x, 0.0, 0.0, 1.0, ref);
  piece(postR.x, 0.0, 0.0, 1.0, ref);

  float d = gMin;                              // crisp: the nearest glass
  // gW is at least 1: the straight run is its own reference, so log() is safe.
  // Where several pieces sit close (the tray, the arrowhead) the blend would
  // pull the glow outward and thicken it, so it may only soften the seam, never
  // move the edge by more than a fraction of the bore.
  float dSoft = max(ref - gK * log(gW), d - bore * 0.25);
  float level = gWLevel / gW;                  // brightness, blended the same way
  float dy = px.y - y0;

  // --- The bore: an even bar, white-hot centre, saturated at the wall ---------
  float fill = 1.0 - smoothstep(bore - 1.2, bore + 0.6, d);
  float depth = clamp(1.0 - d / bore, 0.0, 1.0);
  // The site's own violets: the wall takes the second headline line's colour
  // (#b47cff), the core runs to a lilac white, the glow is the brand violet.
  vec3 wallTone = vec3(0.706, 0.486, 1.0);
  vec3 hot = vec3(0.95, 0.91, 1.0);
  vec3 gasColor = mix(wallTone, hot, smoothstep(0.3, 0.95, depth) * clamp(level, 0.0, 1.4) * 0.8);
  vec3 core = gasColor * fill * level * 1.15;

  // --- Halo: a separate soft pass outside the glass ----------------------------
  // A tight halo hugging the glass, from the blended distance...
  float outside = max(dSoft - bore, 0.0);
  float halo = exp(-outside / (bore * 1.6)) * 0.55;

  // ...and the wide spill, from summing every piece as a line light.
  float soft = bore * 1.5;
  vec2 lightRun = lineLight(px, vec2(x0, y0), vec2(xB - cr, y0), soft)
                 + lineLight(px, vec2(xB, y0 - cr), vec2(xB, tipY), soft);
  // The bend, as four chords around its quarter circle.
  vec2 bc = vec2(xB - cr, y0 - cr);
  for (int i = 0; i < 4; i++) {
    float a0 = 1.5707963 * (1.0 - float(i) / 4.0);
    float a1 = 1.5707963 * (1.0 - float(i + 1) / 4.0);
    lightRun += lineLight(px, bc + cr * vec2(cos(a0), sin(a0)), bc + cr * vec2(cos(a1), sin(a1)), soft);
  }
  vec2 lightArrow = lineLight(px, vec2(xB, tipY), vec2(xB - aw, tipY + aw), soft)
                   + lineLight(px, vec2(xB, tipY), vec2(xB + aw, tipY + aw), soft);
  vec2 lightTray = lineLight(px, vec2(xB - tw, trayY + th), vec2(xB - tw, trayY), soft)
                  + lineLight(px, vec2(xB - tw, trayY), vec2(xB + tw, trayY), soft)
                  + lineLight(px, vec2(xB + tw, trayY), vec2(xB + tw, trayY + th), soft);
  vec2 spill = (lightRun + lightArrow * (1.0 + uLand * 0.8) + lightTray * (1.0 + uLand * 1.4)) * gBase;

  // The fetch pulse is a point of extra light travelling the path.
  float along = uPulseX * gToTip;
  vec2 pp = along < lenH ? vec2(x0 + along, y0)
          : along < lenH + lenArc ? bc + cr * vec2(sin((along - lenH) / cr), cos((along - lenH) / cr))
          : vec2(xB, y0 - cr - (along - lenH - lenArc));
  float pd = length(px - pp);
  float pulseGlow = uPulse / (1.0 + pd * pd / (bore * bore * 16.0));

  vec3 violet = vec3(0.6, 0.28, 0.99);   // #9948fd, the brand violet
  vec3 glow = violet * halo * level * (1.0 - fill);
  // Kept modest on purpose: the white core has to stay the brightest thing,
  // with a tight halo and a glow that fades out, as in a real sign. Scaled by
  // the bore, so a thicker tube throws proportionally more light.
  float wideGlow = spill.x * bore * 0.2;
  float tightGlow = spill.y * bore * bore * 0.45;
  glow += violet * (wideGlow + tightGlow + pulseGlow) * (1.0 - fill);
  // Smoke near the tube catches its light.
  glow += violet * smoke * wideGlow * 1.4 * (1.0 - fill);

  col += 1.0 - exp(-(core + glow) * 1.3);

  // --- Glass ---------------------------------------------------------------------
  // The wall itself is barely visible; a thin specular streak runs along the
  // top of the straight run, fading out before the bend.
  float straight = 1.0 - smoothstep(xB - cr * 1.5, xB - cr, px.x);
  // Squares are written out: pow() with a negative base is undefined in GLSL
  // and turns into NaN on Direct3D-backed browsers.
  float rimK = (d - wall) / 0.8;
  float streakK = (dy - bore * 0.55) / 0.9;
  float rim = exp(-rimK * rimK) * 0.035;
  float streak = exp(-streakK * streakK) * fill * 0.35 * straight;
  col += vec3(0.85, 0.8, 1.0) * (rim + streak * on);

  // Vignette, then film grain so the field has a surface instead of a sheen.
  float vig = 1.0 - smoothstep(0.3, 1.3, length((uv - 0.5) * vec2(1.1, 1.5)));
  col *= mix(0.6, 1.0, vig);
  col += (hash(px + fract(t * 13.0)) - 0.5) * 0.035;

  outColor = vec4(col, 1.0);
}`;

const UNIFORMS = ['uRes', 'uTime', 'uMouse', 'uPull', 'uCharge', 'uTube', 'uFlow', 'uPulse', 'uPulseX', 'uFloor', 'uLand', 'uArrowX', 'uArrowW'];

@Component({
  selector: 'app-discharge',
  template: `<canvas #canvas aria-hidden="true"></canvas>`,
  styles: `
    :host { position: absolute; inset: 0; display: block; }
    canvas { width: 100%; height: 100%; display: block; }
  `,
})
export class DischargeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  /** 0..1, the tube striking. The hero drives this from its entrance timeline. */
  @Input() charge = 1;

  /** Renders one still frame and stops; used for reduced motion. */
  @Input() still = false;

  /** Tube height, 0..1 from the bottom. The hero aims it into the gap between its two headline lines. */
  electrode = 0.46;

  /** 0..1, how hard current is flowing. Brightens the whole tube while a fetch runs. */
  flow = 0;

  /** The travelling band: its strength, and where along the path it is (0 link end, 1 arrow tip). */
  pulse = 0;
  pulseX = 0;

  /** Baseline of the second headline line, 0..1 from the bottom; the tray lands on it. */
  floor = 0.3;

  /** The column beside the second line that the arrow hangs in: right edge (0..1 from the left) and width (fraction). */
  arrowX = 0.97;
  arrowW = 0.1;

  /** 0..1, the arrow and tray flashing as a fetch lands. */
  land = 0;

  private zone = inject(NgZone);
  private gl?: WebGL2RenderingContext;
  private uniforms: Record<string, WebGLUniformLocation | null> = {};
  private frame = 0;
  private visible = true;
  private observer?: IntersectionObserver;
  private start = performance.now();

  // The pointer is eased, so the warm spot drifts after it instead of snapping.
  private mouse = { x: 0.5, y: 0.5, pull: 0 };
  private target = { x: 0.5, y: 0.5, pull: 0 };

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, powerPreference: 'low-power' });
    if (!gl || !this.compile(gl)) return;
    this.gl = gl;
    canvas.classList.add('is-live');

    this.zone.runOutsideAngular(() => {
      window.addEventListener('resize', this.resize);
      window.addEventListener('pointermove', this.onPointer, { passive: true });
      document.documentElement.addEventListener('pointerleave', this.onLeave);

      // Stop drawing once the hero is scrolled away; it is the costliest thing on the page.
      this.observer = new IntersectionObserver(([entry]) => {
        this.visible = entry.isIntersecting;
        if (this.visible && !this.frame && !this.still) this.loop();
      });
      this.observer.observe(canvas);

      this.resize();
      if (this.still) this.draw(14);
      else this.loop();
    });
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.frame);
    this.observer?.disconnect();
    window.removeEventListener('resize', this.resize);
    window.removeEventListener('pointermove', this.onPointer);
    document.documentElement.removeEventListener('pointerleave', this.onLeave);
    this.gl?.getExtension('WEBGL_lose_context')?.loseContext();
  }

  /** Repaints the still frame, for when layout moves the tube. */
  redraw(): void {
    if (this.still) this.draw(14);
  }

  private compile(gl: WebGL2RenderingContext): boolean {
    const shader = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn('[discharge]', gl.getShaderInfoLog(s));
        return null;
      }
      return s;
    };

    const vs = shader(gl.VERTEX_SHADER, VERTEX);
    const fs = shader(gl.FRAGMENT_SHADER, FRAGMENT);
    if (!vs || !fs) return false;

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return false;
    gl.useProgram(program);

    // One oversized triangle covers the viewport with no seam down the diagonal.
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    for (const name of UNIFORMS) {
      this.uniforms[name] = gl.getUniformLocation(program, name);
    }
    return true;
  }

  private resize = () => {
    const gl = this.gl;
    if (!gl) return;
    const canvas = gl.canvas as HTMLCanvasElement;
    // The glow is soft by nature, so one pixel per CSS pixel is plenty and keeps
    // the GPU free for scrolling on high-density screens.
    const dpr = 1;
    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
    if (this.still) this.draw(14);
  };

  private onPointer = (e: PointerEvent) => {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const inside = e.clientY >= rect.top && e.clientY <= rect.bottom;
    this.target.x = (e.clientX - rect.left) / rect.width;
    this.target.y = 1 - (e.clientY - rect.top) / rect.height;
    this.target.pull = inside && e.pointerType === 'mouse' ? 1 : 0;
  };

  private onLeave = () => {
    this.target.pull = 0;
  };

  private loop = () => {
    if (!this.visible) {
      this.frame = 0;
      return;
    }
    const now = performance.now();

    const m = this.mouse;
    m.x += (this.target.x - m.x) * 0.08;
    m.y += (this.target.y - m.y) * 0.08;
    m.pull += (this.target.pull - m.pull) * 0.05;
    this.draw((now - this.start) / 1000);
    this.frame = requestAnimationFrame(this.loop);
  };

  private draw(time: number): void {
    const gl = this.gl;
    if (!gl) return;
    const u = this.uniforms;
    gl.uniform2f(u['uRes'], gl.canvas.width, gl.canvas.height);
    gl.uniform1f(u['uTime'], time);
    gl.uniform2f(u['uMouse'], this.mouse.x, this.mouse.y);
    gl.uniform1f(u['uPull'], this.mouse.pull);
    gl.uniform1f(u['uCharge'], this.still ? 1 : this.charge);
    gl.uniform1f(u['uTube'], this.electrode);
    gl.uniform1f(u['uFlow'], this.flow);
    gl.uniform1f(u['uPulse'], this.pulse);
    gl.uniform1f(u['uPulseX'], this.pulseX);
    gl.uniform1f(u['uFloor'], this.floor);
    gl.uniform1f(u['uLand'], this.land);
    gl.uniform1f(u['uArrowX'], this.arrowX);
    gl.uniform1f(u['uArrowW'], this.arrowW);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
}
