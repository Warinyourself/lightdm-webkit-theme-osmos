#version 300 es
// Inspiration: https://www.shadertoy.com/view/cfjGzV — Zippy Zaps
// Credits: -13 thanks to Nguyen2007 ⚡
#ifdef GL_ES
precision highp float;
#endif

uniform float uTime;
uniform vec2  uResolution;

// Overall zoom / scale of the electric pattern
uniform float uZoom;

// Shifts the base colour phase vector, cycling through hue combinations
uniform float uColorShift;


out vec4 fragColor;
void main() {
  vec2 res = uResolution;
  vec2 u   = gl_FragCoord.xy;

  // Centre and normalise to screen height; uZoom replaces the hardcoded 0.2
  u = uZoom * (u + u - res) / res.y;

  // Base colour phase vector — uColorShift scrolls through hue space
  // z.wxzw swizzle = vec4(z.w, z.x, z.z, z.w) = vec4(0,1,3,0) used in mat2 rotation
  vec4 z = vec4(1.0 + uColorShift, 2.0 + uColorShift, 3.0 + uColorShift, 0.0);
  vec4 o = z;

  float a = 0.5;
  float t = uTime;
  float i = 0.0;

  // Original: for (float a=.5, t=iTime, i; ++i<19.; o+=...)  v=..., u+=...
  // Rewritten: float i counts 1..18 (pre-increment in condition);
  //            ++t and a+=.03 moved to explicit statements preserving order;
  //            comma-operator body split into sequential statements.
  vec2 v = res;

  for (int iter = 0; iter < 18; iter++) {
    i += 1.0;  // pre-increment: matches ++i in original condition

    // ++t happens inside the v= expression (pre-increment before the rhs is evaluated)
    t += 1.0;
    a += 0.03;

    v = cos(t - 7.0 * u * pow(a, i)) - 5.0 * u;

    // mat2 from explicit components avoids mat2(vec4) constructor rejection on ANGLE/Mesa
    // vec4(scalar) - vec4 ensures float-vec4 subtraction is unambiguous
    vec4 r = cos(vec4(i + 0.02 * t) - z.wxzw * 11.0);
    u *= mat2(r.x, r.y, r.z, r.w);

    // If black/NaN artifacts appear, replace tanh with stanh (smoothstep-tanh approximation)
    u += tanh(40.0 * dot(u, u) * cos(100.0 * u.yx + t)) / 200.0
       + 0.2 * a * u
       + cos(4.0 / exp(dot(o, o) / 100.0) + t) / 300.0;

    // for-increment: accumulate glow using the freshly updated v and u
    o += (1.0 + cos(z + t))
       / length((1.0 + i * dot(v, v))
                * sin(1.5 * u / (0.5 - dot(u, u)) - 9.0 * u.yx + t));
  }

  // Tonemapping: multiply numerator/denominator by o to avoid float/vec4 division
  // Equivalent to: 25.6 / (min(o,13.) + 164./o)
  o = 25.6 * o / (min(o, 13.0) * o + 164.0) - dot(u, u) / 250.0;

  fragColor = vec4(o);
}
