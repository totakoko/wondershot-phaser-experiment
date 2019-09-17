<template lang="pug">
canvas.canvas(ref="canvas")
</template>

<script>
import Game from '@/game'

export default {
  name: 'Home',
  mounted () {
    this.game = new Game({
      canvas: this.$refs.canvas
    })
  }
}
</script>

<style lang="stylus">
body
  text-align center
  margin 0
  // margin 0 auto
.canvas
  // overrides GameScalePlugin
  // see https://github.com/samme/phaser-plugin-game-scale/blob/c7783c6c8075963f5ee9ae0d228efffa7c1fdac4/src/main.js#L29
  transform-origin center 0 !important
</style>
