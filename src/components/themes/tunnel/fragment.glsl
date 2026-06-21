#version 300 es
// Original: http://www.pouet.net/prod.php?which=57245
// Credits: Danilo Guanabara
#ifdef GL_ES
precision highp float;
#endif

uniform float uTime;
uniform vec2 uResolution;

// Per-iteration z offset — controls how far apart the RGB channels are in time.
// Higher values spread colors into wider rainbow bands; lower values keep it monochromatic.
uniform float uStep;

// Frequency of the radial sine wave — controls ring/wave density.
// Higher values produce tighter, more numerous rings; lower values produce broad sweeping waves.
uniform float uFrequency;

// Tunnel pull strength — scales the UV distortion toward the center.
// 0.0 = flat pattern with no perspective; higher values create a deeper vortex effect.
uniform float uAmplitude;

// Color channel intensity — inversely controls brightness (smaller = brighter).
// Too high darkens the image; too low causes overexposure / color clipping.
uniform float uBrightness;

#define t uTime
#define r uResolution

out vec4 fragColor;
void main() {
  vec3 c;
  float l, z = t;
  for (int i = 0; i < 3; i++) {
    vec2 uv, p = gl_FragCoord.xy / r;
    uv = p;
    p -= .5;
    p.x *= r.x / r.y;
    z += uStep;
    l = length(p);
    uv += p / l * (sin(z) + 1.) * uAmplitude * abs(sin(l * uFrequency - z - z));
    c[i] = uBrightness / length(mod(uv, 1.) - .5);
  }
  fragColor = vec4(c / l, 1.0);
}
