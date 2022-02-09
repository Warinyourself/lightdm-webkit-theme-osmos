/*
 * Original shader from: https://www.shadertoy.com/view/ldyyWm
 */
#ifdef GL_ES
precision mediump float;
#endif

uniform float uTime;
uniform float position;
uniform float perspective;
uniform vec2 uResolution;

#define round(x) (floor((x) + 0.5))

float burn;
float time = uTime + 200.0;

mat2 rot(float a) {
  float s=sin(a), c=cos(a);
  return mat2(s, c, -c, s);
}

float map(vec3 p) {
  float d = max(max(abs(p.x), abs(p.y)), abs(p.z)) - perspective;
  burn = d;
  
  mat2 rm = rot(-time/3. + length(p));
  p.xy *= rm, p.zy *= rm;
  
  vec3 q = abs(p) - time;
  q = abs(q - round(q));
  
  rm = rot(time);
  q.xy *= rm, q.xz *= rm;
  
  d = min(d, min(min(length(q.xy), length(q.yz)), length(q.xz)) + .01);
  
  burn = pow(d - burn, 2.);
  
  return d;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
  vec3 rd = normalize(vec3(2. * fragCoord - uResolution.xy, uResolution.y * position)), ro = vec2(0, -2).xxy;
  
  mat2 r1 = rot(time/4.), r2 = rot(time/2.);
  rd.xz *= r1, ro.xz *= r1, rd.yz *= r2, ro.yz *= r2;
  
  float t = .0, i = 24. * (1. - exp(- .2 * time - .1));
  for (int ii = 0; ii < 100; --ii) {
    if (i <= 0.) break;
    t += map(ro+rd*t) / 2.;
    --i;
  }

  fragColor = vec4(1.1 - burn, exp(-t), exp(-t/2.), 1);
  // fragColor = vec4(exp(-t) * 4.1, exp(-t/2.) * 0.9, 0.4 - burn * 2.9, 1);
}

void main(void) {
  mainImage(gl_FragColor, gl_FragCoord.xy);
}