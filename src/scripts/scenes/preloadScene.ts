export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    this.load.image("tileset", "assets/img/tileset.png");
    this.load.image("wizard", "assets/img/wizard.png");
    this.load.image("skeleton", "assets/img/skeleton.png");
    this.load.image("serpent", "assets/img/serpent.png");
    this.load.image("ogre", "assets/img/ogre.png");
    this.load.image("sonus", "assets/img/sonus.png");
    this.load.image("lux", "assets/img/lux.png");
    this.load.image("olfo", "assets/img/olfo.png");
    this.load.image("explode", "assets/img/explode.png");
    this.load.image("target", "assets/img/target.png");
    this.load.tilemapTiledJSON("tilemap", "assets/map/map1.json");
    this.load.tilemapTiledJSON("maptest", "assets/map/joshmaptest.json");
    this.load.image("sonusSpark", "assets/img/sonusSpark.png");
    this.load.image("luxSpark", "assets/img/luxSpark.png");
    this.load.image("olfoSpark", "assets/img/olfoSpark.png");

    this.load.audio("lux1", "assets/audio/lux1.wav");
    this.load.audio("lux2", "assets/audio/lux2.wav");
    this.load.audio("lux3", "assets/audio/lux3.wav");

    this.load.audio("olfo1", "assets/audio/olfo1.wav");
    this.load.audio("olfo2", "assets/audio/olfo2.wav");
    this.load.audio("olfo3", "assets/audio/olfo3.wav");

    this.load.audio("sonus1", "assets/audio/sonus1.wav");
    this.load.audio("sonus2", "assets/audio/sonus2.wav");
    this.load.audio("sonus3", "assets/audio/sonus3.wav");

    this.load.audio("hurt1", "assets/audio/hurt1.wav");
    this.load.audio("hurt2", "assets/audio/hurt2.wav");
    this.load.audio("hurt3", "assets/audio/hurt3.wav");
  }

  create() {
    this.scene.start('SplashScene')

    /**
     * This is how you would dynamically import the mainScene class (with code splitting),
     * add the mainScene to the Scene Manager
     * and start the scene.
     * The name of the chunk would be 'mainScene.chunk.js
     * Find more about code splitting here: https://webpack.js.org/guides/code-splitting/
     */
    // let someCondition = true
    // if (someCondition)
    //   import(/* webpackChunkName: "mainScene" */ './mainScene').then(mainScene => {
    //     this.scene.add('MainScene', mainScene.default, true)
    //   })
    // else console.log('The mainScene class will not even be loaded by the browser')
  }
}
