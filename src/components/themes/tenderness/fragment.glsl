// Modified so it doesn't really move. Very childish and easy fix.
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 uResolution;
uniform float uTime;

const int complexity = 30;    // More points of color.
const float fluidSpeed = 60.0;  // Drives speed, higher number will make it slower.
const float color_intensity = 0.5;
const float position = 1.0;

void main() {
  vec2 p= (position * gl_FragCoord.xy - uResolution) / max(uResolution.x, uResolution.y);

  for(int i = 1; i < complexity;i++) {
    vec2 newp= p + uTime * 0.005;
    newp.x+=0.6/float(i)*sin(float(i)*p.y+uTime/fluidSpeed+20.3*float(i)) + 0.5; // + mouse.y/mouse_factor+mouse_offset;
    newp.y+=0.6/float(i)*sin(float(i)*p.x+uTime/fluidSpeed+0.3*float(i+10)) - 0.5; // - mouse.x/mouse_factor+mouse_offset;
    p=newp;
  }

  vec3 col=vec3(color_intensity*sin(5.0*p.x)+color_intensity,color_intensity*sin(3.0*p.y)+color_intensity,color_intensity*sin(p.x+p.y)+color_intensity);
  gl_FragColor=vec4(col, 1.0);
}