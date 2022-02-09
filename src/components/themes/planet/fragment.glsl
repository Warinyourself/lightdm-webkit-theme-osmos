/*
 * Original shader from: https://www.shadertoy.com/view/ttKBDd
 */

#ifdef GL_ES
precision mediump float;
#endif

uniform float camR;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 iMouse;

#define texture(s, uv) vec4(0.0)

#define R uResolution.xy

#define m vec2(R.x/R.y*(iMouse.x/R.x-.5),iMouse.y/R.y-.5)
#define ss(a, b, t) smoothstep(a, b, t)
#define rot(a) mat2(cos(a), -sin(a), sin(a), cos(a))
const float pi = 3.14159;

float hsh(vec2 p) {
  vec3 p3  = fract(vec3(p.xyx) * .1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float perlin(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  
  float a = hsh(i);
  float b = hsh(i+vec2(1., .0));
  float c = hsh(i+vec2(0. ,1 ));
  float d = hsh(i+vec2(1., 1. ));
  
  vec2 u = smoothstep(0., 1., f);
  
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float octnse(vec2 p, int oct, float t) {
  float a = 1.;
  float n = 0.;
  
  for(int i = 0; i < 10; i++){
    if (i >= oct) break;
    p.x += t;
    n += perlin(p) * a *.5;  
    p*=2.;
    a *= .5;
  }
  
  return n;
}


// 3D simplex noise stuff from: https://www.shadertoy.com/view/XsX3zB
const float F3 = .3333333;
const float G3 = .1666667;

vec3 random3(vec3 c) {
  float j = 4096.*sin(dot(c,vec3(17., 59.4, 15.)));
  vec3 r;
  r.z = fract(512.*j);
  j *= .125;
  r.x = fract(512.*j);
  j *= .125;
  r.y = fract(512.*j);
  return r-.5;
}

float simplex3d(vec3 p) {
   vec3 s = floor(p + dot(p, vec3(F3)));
   vec3 x = p - s + dot(s, vec3(G3));
   vec3 e = step(vec3(0.), x - x.yzx);
   vec3 i1 = e*(1. - e.zxy);
   vec3 i2 = 1. - e.zxy*(1. - e);
   vec3 x1 = x - i1 + G3;
   vec3 x2 = x - i2 + 2.*G3;
   vec3 x3 = x - 1. + 3.*G3;
   vec4 w, d;
   w.x = dot(x, x);
   w.y = dot(x1, x1);
   w.z = dot(x2, x2);
   w.w = dot(x3, x3);
   w = max(.6 - w, 0.);
   d.x = dot(random3(s), x);
   d.y = dot(random3(s + i1), x1);
   d.z = dot(random3(s + i2), x2);
   d.w = dot(random3(s + 1.), x3);
   w *= w;
   w *= w;
   d *= w;
  
   float nse = dot(d, vec4(52.));
  
   return 1.-exp(-(nse+1.)*.5);
}

vec4 sphere(vec3 ro, vec3 rd, vec3 cn, float r) {
  float b = 2.*dot(rd, ro - cn);
  float c = dot(ro - cn, ro - cn) - (r*r);
  float d = (b*b) - (4.*c);
   
  if (d < 0.) {
    return vec4(0);
  } else {
    float t = .5*(-b - sqrt(d));   
    return vec4(ro+rd*t, t);
  }
}

const float rad = 2.7;

void mainImage( out vec4 f, in vec2 u ) {
  vec2 uv = vec2(u.xy - 0.5*R.xy)/R.y;
  float ux = uv.x;
  uv *= rot(-uTime*.12 + 2.2);
  
  vec3 ro = vec3(0., 0., 0.);
  vec3 rd = normalize(vec3(uv, 1.));
  float camP = camR;
  
  float ang = uTime*.12 + 7.;
  
  if (iMouse.y > 0.){
    camP -= m.y * 6.;
    ang += m.x;
  }
  
  ro.x += camP * cos(ang);
  ro.z += camP * sin(ang);
  
  rd.xz *= rot(ang + pi/2. + .04);
  
  vec3 ld = normalize(vec3(0.4, 0.3, -0.5));
  
  float ts = .5;
  
  vec3 pp = vec3(0);
  vec3 n = vec3(0);
  
  vec3 cntr = vec3(0., 0., 0.);
  vec4 p = sphere(ro, rd, cntr, rad);
  
  vec3 col = vec3(0);
  
  pp = p.xyz;
  n = pp - cntr;
  n = normalize(n);
  
  vec2 cuv = abs(vec2(atan(n.z, n.x), acos(p.y / rad))); 
  cuv *= rot(-uTime*.05 * ts);
  
  float n1 = 2.*octnse(cuv, 10, -uTime*.08 * ts) - 1.;
  float n2 = 2.*octnse((cuv+3.), 10, -uTime*.03 * ts) - 1.;

  vec2 os = vec2(n1, n2);

  float val = octnse((cuv + vec2(n1, n2)*3.6), 8, -uTime*.1 * ts);
  
  col += .35+.35*cos(vec3(1.4, .7, 0.9)* n1 * 10. + uTime * .35);
  col += .48+.37*sin(vec3(2.2, .1, 0.3)* n2 * 20. + vec3(.7, 1.2, .7));
  col += .48+.23*cos(vec3(1.4, .7, 0.9)* val * 30. + vec3(.2, 0.8, 4.7)+ uTime*.25);
  col*=.38;
  
  vec3 ref = reflect(n, rd);
  float val2 = octnse((ref.xy + os*10. + val*5.), 8, -uTime*.1 * ts);
  
  col *= val2*3. * vec3(.9, .8, .8);
  col *= max(dot(n, -rd), 0.0)*vec3(.9, .8, .7);
  
  col = col*col*1.7;
  
  col = 1.-exp(-col);
  
  f = vec4(col, 1.0);
}

void main(void) {
  mainImage(gl_FragColor, gl_FragCoord.xy);
}