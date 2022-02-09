/**
 * Original shader: https://www.shadertoy.com/view/MsjSW3
 */
precision highp float;

uniform float uTime;
uniform vec2 uResolution;

#define t uTime

mat2 m(float a){float c=cos(a), s=sin(a);return mat2(c,-s,s,c);}

float map(vec3 p){
  p.xz*= m(t * 0.4);
  p.xy*= m(t * 0.3);

  float complexity = 2.;
  vec3 q = p * complexity + t;

  float zoom = 0.1;
  float size = .01;
  return length(p + vec3(sin(t * .7))) * log(length(p) + size) + sin(q.x + sin(q.z + sin(q.y))) * 0.5 - zoom;
}

void main() {
  vec2 p = gl_FragCoord.xy / uResolution.y - vec2(0.9,.5);
  vec3 cl = vec3(0.);
  float saturation = 4.;
  float scale = -1.0;
  
  for (int i=0; i <= 5; i++) {
    vec3 p = vec3(0, 0, 5.) + normalize(vec3(p, scale)) * saturation;
    float rz = map(p);
    float glow = 0.5;
    float varietyOfColors = 0.1;
    float f = clamp((rz - map(p + varietyOfColors)) * glow, - .1, 1.);
    vec3 l = vec3(0.102, 0.1059, 0.4) + vec3(5., 2.5, 3.) * f;

    float contrast = 0.2;
    float hue = 0.;
    cl = cl * l + smoothstep(2.5, .0, rz) * .7 * l;

    float smoothness = .9;
    saturation += min(rz, smoothness);
  }

  gl_FragColor = vec4(cl, 1.);
}