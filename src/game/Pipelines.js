import Phaser from 'phaser'

/* eslint-disable */
// filters imported from https://cdn.rawgit.com/photonstorm/phaser/c298a45d1fc0e90618736ade3782ee82a39f7108/v2/filters/BlurX.js

/**
* A horizontal blur filter by Mat Groves http://matgroves.com/ @Doormat23
*/

// export class BlurPipeline extends Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline {
// export class BlurPipeline extends Phaser.Renderer.WebGL.WebGLPipeline {
//   constructor (game) {
//     super({
//       game: game,
//       renderer: game.renderer,
//       gl: game.renderer.gl,
//       topology: game.renderer.gl.TRIANGLES,
//       vertShader: `
//       #define SHADER_NAME PHASER_TEXTURE_TINT_VS

//       precision mediump float;

//       uniform mat4 uProjectionMatrix;
//       uniform mat4 uViewMatrix;
//       uniform mat4 uModelMatrix;

//       attribute vec2 inPosition;
//       attribute vec2 inTexCoord;
//       attribute float inTintEffect;
//       attribute vec4 inTint;

//       varying vec2 outTexCoord;
//       varying float outTintEffect;
//       varying vec4 outTint;

//       void main ()
//       {
//           gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(inPosition, 1.0, 1.0);

//           outTexCoord = inTexCoord;
//           outTint = inTint;
//           outTintEffect = inTintEffect;
//       }
//       `,
//       fragShader: `
//       precision mediump float;

//       uniform sampler2D uMainSampler;
//       uniform vec2 uResolution;
//       uniform float uTime;

//       varying vec2 outTexCoord;
//       varying vec4 outTint;

//       vec4 plasma()
//       {
//           vec2 pixelPos = gl_FragCoord.xy / uResolution * 20.0;
//           float freq = 0.8;
//           float value =
//               sin(uTime + pixelPos.x * freq) +
//               sin(uTime + pixelPos.y * freq) +
//               sin(uTime + (pixelPos.x + pixelPos.y) * freq) +
//               cos(uTime + sqrt(length(pixelPos - 0.5)) * freq * 2.0);

//           return vec4(
//               cos(value),
//               sin(value),
//               sin(value * 3.14 * 2.0),
//               cos(value)
//           );
//       }

//       void main()
//       {
//           vec4 texel = texture2D(uMainSampler, outTexCoord);
//           texel *= vec4(outTint.rgb * outTint.a, outTint.a);
//           gl_FragColor = texel * plasma();
//       }`,
//       vertexCapacity: 6 * game.renderer.config.batchSize,
//       vertexSize: Float32Array.BYTES_PER_ELEMENT * 5 + Uint8Array.BYTES_PER_ELEMENT * 4,
//       attributes: [

//       ]
//     })
//   }
// }
// export class BlurPipeline extends Phaser.Renderer.WebGL.WebGLPipeline {
export class BlurPipeline extends Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline {
  constructor (game) {
    super({
      game: game,
      renderer: game.renderer,
      fragShader:`
                precision mediump float;
                uniform sampler2D uMainSampler;
                uniform float uBlur;
                varying vec2 outTexCoord;
                void main(void) {
                  // vec4 color = texture2D(uMainSampler, outTexCoord);
                  // float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
                  // gl_FragColor = vec4(vec3(gray), 1.0);
                  // gl_FragColor = color;
                  vec4 sum = vec4(0.0);
                  sum += texture2D(uMainSampler, vec2(outTexCoord.x - 4.0*uBlur, outTexCoord.y)) * 0.05;
                  sum += texture2D(uMainSampler, vec2(outTexCoord.x - 3.0*uBlur, outTexCoord.y)) * 0.09;
                  sum += texture2D(uMainSampler, vec2(outTexCoord.x - 2.0*uBlur, outTexCoord.y)) * 0.12;
                  sum += texture2D(uMainSampler, vec2(outTexCoord.x - uBlur, outTexCoord.y)) * 0.15;
                  sum += texture2D(uMainSampler, vec2(outTexCoord.x, outTexCoord.y)) * 0.16;
                  sum += texture2D(uMainSampler, vec2(outTexCoord.x + uBlur, outTexCoord.y)) * 0.15;
                  sum += texture2D(uMainSampler, vec2(outTexCoord.x + 2.0*uBlur, outTexCoord.y)) * 0.12;
                  sum += texture2D(uMainSampler, vec2(outTexCoord.x + 3.0*uBlur, outTexCoord.y)) * 0.09;
                  sum += texture2D(uMainSampler, vec2(outTexCoord.x + 4.0*uBlur, outTexCoord.y)) * 0.05;
                  gl_FragColor = sum;
                }
                `
      // gl: game.renderer.gl,
      // topology: game.renderer.gl.TRIANGLES,
      // vertShader: `
      //   #define SHADER_NAME PHASER_BLUR_VS
      //   precision mediump float;

      //   attribute vec2 aTextureCoord;
      //   varying vec2 vTextureCoord;

      //   void main() {
      //     gl_Position = vec4(aTextureCoord, 0.0, 1.0);
      //     vTextureCoord = aTextureCoord;
      //   }
      // `,
      // fragShader: `
      //   #define SHADER_NAME PHASER_BLUR_FS
      //   precision mediump float;

      //   const float blur = 0.001953125;
      //   varying vec2 vTextureCoord;
      //   uniform sampler2D uSampler;

      //   void main(void) {
      //     vec4 sum = vec4(0.0);
      //     sum += texture2D(uSampler, vec2(vTextureCoord.x - 4.0*blur, vTextureCoord.y)) * 0.05;
      //     sum += texture2D(uSampler, vec2(vTextureCoord.x - 3.0*blur, vTextureCoord.y)) * 0.09;
      //     sum += texture2D(uSampler, vec2(vTextureCoord.x - 2.0*blur, vTextureCoord.y)) * 0.12;
      //     sum += texture2D(uSampler, vec2(vTextureCoord.x - blur, vTextureCoord.y)) * 0.15;
      //     sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y)) * 0.16;
      //     sum += texture2D(uSampler, vec2(vTextureCoord.x + blur, vTextureCoord.y)) * 0.15;
      //     sum += texture2D(uSampler, vec2(vTextureCoord.x + 2.0*blur, vTextureCoord.y)) * 0.12;
      //     sum += texture2D(uSampler, vec2(vTextureCoord.x + 3.0*blur, vTextureCoord.y)) * 0.09;
      //     sum += texture2D(uSampler, vec2(vTextureCoord.x + 4.0*blur, vTextureCoord.y)) * 0.05;
      //     gl_FragColor = sum;
      //   }
      // `,
      // vertexCapacity: 3,
      // vertexSize: Float32Array.BYTES_PER_ELEMENT * 2,
      // vertices: new Float32Array([
      //   -1, +1, -1, -7, +7, +1
      // ]).buffer,
      // attributes: [
      //   {
      //     name: 'aTextureCoord',
      //     size: 2,
      //     type: game.renderer.gl.FLOAT,
      //     normalized: false,
      //     offset: 0
      //   },
      //   // {
      //   //   name: 'vTextureCoord',
      //   //   size: 2,
      //   //   type: game.renderer.gl.FLOAT,
      //   //   normalized: false,
      //   //   offset: 0
      //   // }
      // ]
      // fragShader: `
      // precision mediump float;

      // uniform sampler2D uMainSampler;
      // uniform vec2 uResolution;
      // uniform float uTime;

      // varying vec2 outTexCoord;
      // varying vec4 outTint;

      // vec4 plasma()
      // {
      //     vec2 pixelPos = gl_FragCoord.xy / uResolution * 20.0;
      //     float freq = 0.8;
      //     float value =
      //         sin(uTime + pixelPos.x * freq) +
      //         sin(uTime + pixelPos.y * freq) +
      //         sin(uTime + (pixelPos.x + pixelPos.y) * freq) +
      //         cos(uTime + sqrt(length(pixelPos - 0.5)) * freq * 2.0);

      //     return vec4(
      //         cos(value),
      //         sin(value),
      //         sin(value * 3.14 * 2.0),
      //         cos(value)
      //     );
      // }

      // void main()
      // {
      //     vec4 texel = texture2D(uMainSampler, outTexCoord);
      //     texel *= vec4(outTint.rgb * outTint.a, outTint.a);
      //     gl_FragColor = texel * plasma();
      // }
      // `
    })
  }
}

// Phaser.Filter.BlurX = function (game) {

//     Phaser.Filter.call(this, game);

//     this.uniforms.blur = { type: '1f', value: 1 / 512 };

//     this.fragmentSrc = [

//       "precision mediump float;",
//       "varying vec2 vTextureCoord;",
//       "varying vec4 vColor;",
//       "uniform float blur;",
//       "uniform sampler2D uSampler;",

//         "void main(void) {",

//           "vec4 sum = vec4(0.0);",

//           "sum += texture2D(uSampler, vec2(vTextureCoord.x - 4.0*blur, vTextureCoord.y)) * 0.05;",
//           "sum += texture2D(uSampler, vec2(vTextureCoord.x - 3.0*blur, vTextureCoord.y)) * 0.09;",
//           "sum += texture2D(uSampler, vec2(vTextureCoord.x - 2.0*blur, vTextureCoord.y)) * 0.12;",
//           "sum += texture2D(uSampler, vec2(vTextureCoord.x - blur, vTextureCoord.y)) * 0.15;",
//           "sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y)) * 0.16;",
//           "sum += texture2D(uSampler, vec2(vTextureCoord.x + blur, vTextureCoord.y)) * 0.15;",
//           "sum += texture2D(uSampler, vec2(vTextureCoord.x + 2.0*blur, vTextureCoord.y)) * 0.12;",
//           "sum += texture2D(uSampler, vec2(vTextureCoord.x + 3.0*blur, vTextureCoord.y)) * 0.09;",
//           "sum += texture2D(uSampler, vec2(vTextureCoord.x + 4.0*blur, vTextureCoord.y)) * 0.05;",

//           "gl_FragColor = sum;",

//         "}"
//     ];

// };

// Phaser.Filter.BlurX.prototype = Object.create(Phaser.Filter.prototype);
// Phaser.Filter.BlurX.prototype.constructor = Phaser.Filter.BlurX;

// Object.defineProperty(Phaser.Filter.BlurX.prototype, 'blur', {

//     get: function() {
//         return this.uniforms.blur.value / (1/7000);
//     },

//     set: function(value) {
//         this.dirty = true;
//         this.uniforms.blur.value = (1/7000) * value;
//     }

// });

// /**
// * A vertical blur filter by Mat Groves http://matgroves.com/ @Doormat23
// */
// Phaser.Filter.BlurY = function (game) {

//     Phaser.Filter.call(this, game);

//     this.uniforms.blur = { type: '1f', value: 1 / 512 };

//     this.fragmentSrc = [

//       "precision mediump float;",
//       "varying vec2 vTextureCoord;",
//       "varying vec4 vColor;",
//       "uniform float blur;",
//       "uniform sampler2D uSampler;",

//         "void main(void) {",

//           "vec4 sum = vec4(0.0);",

//           "sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - 4.0*blur)) * 0.05;",
//           "sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - 3.0*blur)) * 0.09;",
//           "sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - 2.0*blur)) * 0.12;",
//           "sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - blur)) * 0.15;",
//           "sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y)) * 0.16;",
//           "sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + blur)) * 0.15;",
//           "sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + 2.0*blur)) * 0.12;",
//           "sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + 3.0*blur)) * 0.09;",
//           "sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + 4.0*blur)) * 0.05;",

//           "gl_FragColor = sum;",

//         "}"

//     ];

// };

// Phaser.Filter.BlurY.prototype = Object.create(Phaser.Filter.prototype);
// Phaser.Filter.BlurY.prototype.constructor = Phaser.Filter.BlurY;

// Object.defineProperty(Phaser.Filter.BlurY.prototype, 'blur', {

//     get: function() {
//         return this.uniforms.blur.value / (1/7000);
//     },

//     set: function(value) {
//         this.dirty = true;
//         this.uniforms.blur.value = (1/7000) * value;
//     }

// });
