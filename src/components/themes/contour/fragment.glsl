#extension GL_OES_standard_derivatives : enable
#ifdef GL_ES
precision highp float;
#endif

uniform float uTime;
uniform vec2 uResolution;

// Zoom/scale of the noise pattern — higher values zoom in, revealing more detail
uniform float uScale;

// Number of stripes/contour lines across the noise field
uniform float uScaleContour;

// Line width: controls how much of the contour field is visible (0 = thin hairlines, 1 = wide bands)
uniform float uWidth;


// Max line band: caps the upper visible threshold so all lines have similar spatial width
// smaller = more uniform thin lines, larger = allows wide bands
uniform float uMaxLine;

// First gradient color (RGB)
uniform vec3 uColor1;

// Second gradient color (RGB)
uniform vec3 uColor2;

// Background color — shown where lines and glow are absent
uniform vec3 uBackground;

const float M_PI = 3.14159265;
const int NUM_OCTAVES = 2;

// Hash functions — map domain to pseudo-random [0, 1)
float hash11(float t) {
  return fract(sin(t * 56789.0) * 56789.0);
}

float hash21(vec2 uv) {
  return hash11(hash11(uv[0]) + 2.0 * hash11(uv[1]));
}

// Returns a unit-length gradient vector for a given grid cell
vec2 hashGradient2(vec2 uv) {
  float t = hash21(uv);
  return vec2(cos(2.0 * M_PI * t), sin(2.0 * M_PI * t));
}

// Bilinear mix helper
float mix2(float f00, float f10, float f01, float f11, vec2 uv) {
  return mix(mix(f00, f10, uv[0]), mix(f01, f11, uv[0]), uv[1]);
}

// Rotate a 2D vector by angle r (radians)
vec2 rotate2(vec2 uv, float r) {
  mat2 R = mat2(cos(r), sin(r), -sin(r), cos(r));
  return R * uv;
}

// Gradient (Perlin) noise with optional gradient rotation for animation
float gradientNoise(vec2 uv, float r) {
  vec2 uvi = floor(uv);
  vec2 uvf = uv - uvi;
  vec2 g00 = rotate2(hashGradient2(uvi + vec2(0.0, 0.0)), r);
  vec2 g10 = rotate2(hashGradient2(uvi + vec2(1.0, 0.0)), r);
  vec2 g01 = rotate2(hashGradient2(uvi + vec2(0.0, 1.0)), r);
  vec2 g11 = rotate2(hashGradient2(uvi + vec2(1.0, 1.0)), r);
  float f00 = dot(g00, uvf - vec2(0.0, 0.0));
  float f10 = dot(g10, uvf - vec2(1.0, 0.0));
  float f01 = dot(g01, uvf - vec2(0.0, 1.0));
  float f11 = dot(g11, uvf - vec2(1.0, 1.0));
  float t = mix2(f00, f10, f01, f11, smoothstep(vec2(0.0), vec2(1.0), uvf));
  // Normalize: theoretical bounds are +-1/sqrt(2) ≈ +-0.7
  return (t / 0.7 + 1.0) * 0.5;
}

// Fractional Brownian Motion — stacks octaves for richer noise detail
float noise(vec2 uv, float r) {
  float result = 0.0;
  for (int i = 0; i < NUM_OCTAVES; i++) {
    float p = pow(2.0, float(i));
    result += gradientNoise(uv * p, r) / p;
  }
  // Normalize result back to [0, 1]
  result /= (pow(2.0, float(NUM_OCTAVES)) - 1.0) / pow(2.0, float(NUM_OCTAVES - 1));
  return result;
}

// Maps noise value to a periodic wave that creates the contour bands
float wave(float t) {
  return 0.5 * (1.0 - cos(uScaleContour * M_PI * t));
}

void main() {
  vec2 uv = uScale * gl_FragCoord.xy / uResolution.y;

  // Animate by rotating noise gradients over time (0.628 ≈ 0.1 * 2π)
  float r = 0.628 * uTime;

  float noise_fac = noise(uv, r);
  float contour_fac = wave(noise_fac);
  vec3 color = mix(uColor1, uColor2, noise_fac);

  float lo = 1.0 - uWidth;
  float hi = lo + uMaxLine;
  float fw = fwidth(contour_fac);

  // Crisp anti-aliased line: only pixels in the [lo, hi] band are visible,
  // bounding maximum spatial width so all lines appear roughly equal-sized
  float line = smoothstep(lo - fw, lo + fw, contour_fac)
             - smoothstep(hi - fw, hi + fw, contour_fac);

  float brightness = line;
  gl_FragColor = vec4(mix(uBackground, color, brightness), 1.0);
}
