export default class GameScene extends Phaser.Scene {

  map:Phaser.Tilemaps.Tilemap;
  constructor() {
    super({ key: 'GameScene' })
  }

  create() {
    console.log("HI");
    this.map = this.make.tilemap({key: "tilemap"});
    let tileset = this.map.addTilesetImage("tileset", "tileset");
    this.map.createLayer("Ground", "tileset");
    this.map.createLayer("Walls", "tileset");

  }

  update() {
  }
}
