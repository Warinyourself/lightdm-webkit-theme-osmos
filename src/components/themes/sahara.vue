<template lang="pug">
  .sahara(ref='scene' data-hover-only='true' data-friction-x="1" data-friction-y='0' data-scalar-x='25' data-scalar-y='15')
    li.prllx-block(data-depth='0.0')
      .stars
    li.prllx-block(data-depth='0.02')
      .pyramids
    li.prllx-block(data-depth='0.1')
      .rocket
    li.prllx-block(data-depth='0.2')
      .sand
    li.prllx-block(data-depth='0.1')
      .sand-second
</template>

<script>
import Parallax from 'parallax-js'

export default {
  name: 'SaharaTheme',
  mounted() {
    new Parallax(this.$refs.scene);
  }
}
</script>

<style lang="stylus">
:root {
  --height-sea: 30vh;
} 

.sahara
  width 100%
  height 100vh
  overflow hidden
  position relative
  background radial-gradient(ellipse 249% 104% at bottom, var(--color-active) 0%, #7E2586 15%, #3B1B80 55%, #230C54 85%)

.rocket
  z-index 1
  height 5vw
  width 30vw
  position absolute
  left -7%
  top 45%
  transform translateY(-50%) rotate(-62deg)
  background url('../../assets/images/themes/sahara/rocket.svg') bottom/contain no-repeat

.pyramids
  z-index 1
  height 20vw
  width 30vw
  position absolute
  bottom 2vw
  left 50%
  transform translateX(-50%)
  background url('../../assets/images/themes/sahara/pyramids.svg') bottom/contain no-repeat

.sand
  z-index 2
  height 15vw
  width 100vw
  position absolute
  bottom 0
  left 0
  transform scaleX(1.2)
  background url('../../assets/images/themes/sahara/sand-second.svg') bottom/contain no-repeat

.sand-second
  z-index 2
  height 15vw
  width 100vw
  position absolute
  bottom 0
  left 0
  transform scaleX(1.1)
  background url('../../assets/images/themes/sahara/sand.svg') bottom/contain no-repeat


.stars, .stars:before
  height 60vh
  width 100vw
  position absolute
  background url('../../assets/images/themes/osmos/stars.svg') 0% top 
  background-size calc(25vmin * 5.3) 25vmin

.stars
  bottom var(--height-sea)
</style>
