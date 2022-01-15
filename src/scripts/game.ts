import 'phaser'
import MainScene from './scenes/mainScene'
import PreloadScene from './scenes/preloadScene'
import GameScene from './scenes/gameScene'

const DEFAULT_WIDTH = 1280
const DEFAULT_HEIGHT = 720

const config = {
  type: Phaser.AUTO,
  width: 400,
  height: 300,
  backgroundColor: "#172038",
  pixelArt: true,
  zoom: 3,
  // scale: {
  //   parent: 'phaser-game',
  //   mode: Phaser.Scale.FIT,
  //   autoCenter: Phaser.Scale.CENTER_BOTH,
  //   width: DEFAULT_WIDTH,
  //   height: DEFAULT_HEIGHT
  // },
  scene: [PreloadScene, GameScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 400 }
    }
  }
}

window.addEventListener('load', () => {
  const game = new Phaser.Game(config)
})
