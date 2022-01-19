import Mover from "../components/mover";
import Actor from "./actor";

export default class Player extends Actor {
  gridx:number;
  gridy:number;
  scene;
  health:number;
  mover:Mover;
  hurt:Phaser.Sound.BaseSound[];
  constructor(scene, x, y) {
    super(scene, x, y, "wizard");
    this.tag = "player";
    this.scene = scene;
    this.gridx = 7;
    this.gridy = 5;
    this.setOrigin(0, 0);
    this.health = 7;
    // this.mover = new Mover(new Phaser.Math.Vector2(0, 0), this);
    this.mover = new Mover(new Phaser.Math.Vector2(7, 5), this, 300);
    this.hurt = [];
    this.hurt.push(this.scene.sound.add("hurt1", {loop: false}));
    this.hurt.push(this.scene.sound.add("hurt2", {loop: false}));
    this.hurt.push(this.scene.sound.add("hurt3", {loop: false}));
  }
  getScene() {
    return this.scene;
  }

  update(time, delta) {
    this.mover.update(time, delta);
  }
  takeDamage() {
    this.health -= 1;
    if (this.health <= 0)
    {
      this.scene.scene.start("DeathScene");
    }
    this.hurt[Math.floor(Math.random()*this.hurt.length)].play();
  }

  move(dir:Phaser.Math.Vector2) {
    this.mover.move(dir);
    if (this.mover.position.x === 17 && this.mover.position.y === 40)
      this.scene.scene.start("WinScene");
    if (this.mover.position.x === 17 && this.mover.position.y === 41)
      this.scene.scene.start("WinScene");
  }

}
