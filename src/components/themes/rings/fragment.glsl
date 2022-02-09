precision mediump float;

uniform float uTime;
uniform float hue;
uniform float zoom; // 32.415
uniform vec2 uResolution;
float linearity = 2.; // 2.

void main( void ) {
  float mx = max( uResolution.x, uResolution.y );
  vec2 uv = (gl_FragCoord.xy - uResolution.xy * 0.5) / mx;
  uv.x += sin(uTime + uv.y * linearity) * .2;
  
  uv.y -= cos(uTime) * 0.1;
  
  uv.x = dot(uv,uv)*2.0;

  float angle = .4;
  uv *= mat2(cos(angle), sin(angle), sin(angle), cos(angle));

  float fineness = mx * 0.4; // 0 + 0.4
  // float fineness = mx * (abs(hue) + 0.2); // 0 + 0.4
  float sy = uv.y * fineness;
  float c = fract(-sin(floor(sy) / fineness * 14.) * 437.);

  float f = fract(sy);
  c *= min(f, 1. - f) * 3.;

  // float zoom = 32.415;
  float intensity = 2.5;
  // highlights
  c += cos(uv.y * zoom - uTime) * intensity;

  // background
  float r = -uv.y + (.5 + hue);
  float b = uv.y + (.5 - hue);

  gl_FragColor = vec4(mix(vec3(r, r*.3, b), vec3(c), .3), 1.0);
}