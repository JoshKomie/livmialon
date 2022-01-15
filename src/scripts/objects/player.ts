export default class Player extends Phaser.GameObjects.Sprite {
  gridx:number;
  gridy:number;
  constructor(scene, x, y) {
    super(scene, x, y, "wizard");
    this.gridx = this.gridy = 0;
    this.setOrigin(0, 0);
    // this.setOrigin(0.5, 1);
  }

  update() {

  }

}
