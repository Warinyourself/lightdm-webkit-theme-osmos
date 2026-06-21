// Inspiration: https://www.shadertoy.com/view/WdB3Dw
#ifdef GL_ES
precision highp float;
#endif

uniform float uTime;
uniform vec2 uResolution;

// Torus tube cross-section radius — thicker values widen the ring walls
uniform float uTubeSize;

// Clipping sphere radius — controls how large the bubble appears
uniform float uBubbleSize;

// Ray march step fraction — lower = slower rays, denser glow/fog accumulation
uniform float uFogDensity;

// Spectrum cycling frequency — higher = more colour bands visible per ray
uniform float uSpectrumSpeed;

// Surface glow colour (normalised; internally scaled ×2.1 to allow overbright)
uniform vec3 uGlowColor;

// Ambient scatter/fog colour accumulated on every ray march step
uniform vec3 uFogColor;

#define PI 3.14159265359

void pR(inout vec2 p, float a) {
  p = cos(a)*p + sin(a)*vec2(p.y, -p.x);
}

float smax(float a, float b, float r) {
  vec2 u = max(vec2(r + a, r + b), vec2(0.0));
  return min(-r, max(a, b)) + length(u);
}

// ─── Spectrum palette ────────────────────────────────────────────────────────
// Cosine colour palette — IQ https://www.shadertoy.com/view/ll2GD3

vec3 pal(in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d) {
  return a + b*cos(6.28318*(c*t+d));
}

vec3 spectrum(float n) {
  return pal(n, vec3(0.5,0.5,0.5), vec3(0.5,0.5,0.5),
               vec3(1.0,1.0,1.0), vec3(0.0,0.33,0.67));
}

// ─── SDF via inverse stereographic projection ────────────────────────────────

vec4 inverseStereographic(vec3 p, out float k) {
  k = 2.0 / (1.0 + dot(p, p));
  return vec4(k*p, k - 1.0);
}

float fTorus(vec4 p4) {
  float d1 = length(p4.xy) / length(p4.zw) - 1.0;
  float d2 = length(p4.zw) / length(p4.xy) - 1.0;
  float d = d1 < 0.0 ? -d1 : d2;
  d /= PI;
  return d;
}

float fixDistance(float d, float k) {
  float sn = sign(d);
  d = abs(d);
  d = d / k * 1.82;
  d += 1.0;
  d = pow(d, 0.5);
  d -= 1.0;
  d *= 5.0 / 3.0;
  d *= sn;
  return d;
}

float gTime;

float map(vec3 p) {
  float k;
  vec4 p4 = inverseStereographic(p, k);
  pR(p4.zy, gTime * -PI / 2.0);
  pR(p4.xw, gTime * -PI / 2.0);
  float d = fTorus(p4);
  d = abs(d);
  d -= uTubeSize;
  d = fixDistance(d, k);
  d = smax(d, length(p) - uBubbleSize, 0.2);
  return d;
}

// ─── Rendering ───────────────────────────────────────────────────────────────

mat3 calcLookAtMatrix(vec3 ro, vec3 ta, vec3 up) {
  vec3 ww = normalize(ta - ro);
  vec3 uu = normalize(cross(ww, up));
  vec3 vv = normalize(cross(uu, ww));
  return mat3(uu, vv, ww);
}

void main() {
  gTime = mod(uTime / 2.0, 1.0);

  vec3 camPos = vec3(1.8, 5.5, -5.5) * 1.75;
  vec3 camTar = vec3(0.0, 0.0, 0.0);
  vec3 camUp  = vec3(-1.0, 0.0, -1.5);
  mat3 camMat = calcLookAtMatrix(camPos, camTar, camUp);

  float focalLength = 5.0;
  vec2 p = (-uResolution.xy + 2.0 * gl_FragCoord.xy) / uResolution.y;

  vec3 rayDir = normalize(camMat * vec3(p, focalLength));
  vec3 rayPos = camPos;
  float rayLen = 0.0;
  float dist   = 0.0;
  vec3 color   = vec3(0.0);

  const int   ITER     = 82;
  const float MIN_STEP = 0.001;
  const float MAX_DIST = 20.0;

  for (int i = 0; i < ITER; i++) {
    rayLen += max(MIN_STEP, abs(dist) * uFogDensity);
    rayPos  = camPos + rayDir * rayLen;
    dist    = map(rayPos);

    // Surface glow: bright flare near the SDF surface, tinted by uGlowColor
    vec3 c = vec3(max(0.0, 0.01 - abs(dist)) * 0.5);
    c *= uGlowColor * 2.1;  // ×2.1 restores the original overbright range

    // Ambient fog: coloured scatter accumulated on every step
    c += uFogColor * uFogDensity / 160.0;

    c *= smoothstep(20.0, 7.0, length(rayPos));

    float rl = smoothstep(MAX_DIST, 0.1, rayLen);
    c *= rl;
    c *= spectrum(rl * uSpectrumSpeed - 0.6);

    color += c;

    if (rayLen > MAX_DIST) break;
  }

  color = pow(color, vec3(1.0 / 1.8)) * 2.0;
  color = pow(color, vec3(2.0)) * 3.0;
  color = pow(color, vec3(1.0 / 2.2));

  gl_FragColor = vec4(color, 1.0);
}
