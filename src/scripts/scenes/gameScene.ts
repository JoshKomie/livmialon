import Player from "../objects/player";

export default class GameScene extends Phaser.Scene {

  map:Phaser.Tilemaps.Tilemap;
  player:Player;
  constructor() {
    super({ key: 'GameScene' })
  }

  create() {
    this.map = this.make.tilemap({key: "tilemap"});
    let tileset = this.map.addTilesetImage("tileset", "tileset");
    this.map.createLayer("Ground", "tileset");
    this.map.createLayer("Walls", "tileset");
    this.player = new Player(this, 0, 0);
    this.add.existing(this.player);
    this.input.keyboard.on('keydown', this.keypress, this);
    this.cameras.main.startFollow(this.player);
  }

  keypress(event)
  {
    let newx = this.player.gridx, newy = this.player.gridy;
    if (event.key === "w") {
      newy = this.player.gridy - 1;
    } else if (event.key === "s") {
      newy = this.player.gridy + 1;
    }
    if (event.key === "a") {
      newx = this.player.gridx - 1;
    } else if (event.key === "d") {
      newx = this.player.gridx + 1;
    }
    //check collision
    let tile = this.map.getTileAt(newx, newy, false, "Walls");
    if (tile === null)//empty
    {
      this.player.gridx = newx;
      this.player.gridy = newy;
    }

  }


  update(time, delta) {
    // console.log("time=", time, "delta=", delta);
    let pos = this.map.tileToWorldXY(this.player.gridx, this.player.gridy);
    this.player.x = pos.x;
    this.player.y = pos.y;

  }
}
