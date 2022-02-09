#ifdef GL_ES
precision highp float;
#endif

uniform float uTime;
uniform vec2 uResolution;
uniform float symmetry;
uniform float thickness;

float f(vec3 x) {
  x.z -= uTime;
  float a = x.z * symmetry;
  x.xy *= mat2(cos(a), sin(a), -sin(a), cos(a));
  return thickness - length(cos(x.xy) + sin(x.yz));
}

vec3 lambda_0(vec3 x) {
  return x + f(x) * (0.5 - (vec3(gl_FragCoord.xy, 1.0) / uResolution.x));
}

void main() {
  vec3 i_0 = vec3(0.0,0.0,0.0);

	for (float i_1 = 0.0; i_1 < 32.; i_1++) i_0 = lambda_0(i_0);

  vec3 p = i_0;
  gl_FragColor = vec4(((vec3(2.0,5.0,9.0) + sin(p)) / length(p)),1.0);
}