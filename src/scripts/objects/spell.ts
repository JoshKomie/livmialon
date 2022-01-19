
type Vec = Phaser.Math.Vector2;
import GameScene from "../scenes/gameScene";
class SpellSpark {
  img:Phaser.GameObjects.Image;
  lifetime:number = 0;
  constructor(img:Phaser.GameObjects.Image) {
    this.img = img;
    this.lifetime = 0;
  }
}
export default class Spell extends Phaser.GameObjects.Sprite {
  gridx:number;
  gridy:number;
  spellType:string;
  scene:GameScene;
  timeAlive:number;
  alive:boolean;
  line:Vec[];
  sparki:number = 0;
  sparkName:string;
  doneSparks:boolean = false;
  lastSpark:number = 0;
  sparks:SpellSpark[];
  audio:Phaser.Sound.BaseSound[];
  constructor(scene, x, y, spellType, line) {
    super(scene, 0, 0, spellType);
    this.line = line;
    this.scene = scene;
    this.spellType = spellType;
    this.gridx = x;
    this.gridy = y;
    this.setOrigin(0, 0);
    let pos = this.scene.map.tileToWorldXY(this.gridx, this.gridy);
    this.x = pos.x;
    this.y = pos.y;
    this.timeAlive = 0;
    this.alive = true;
    this.sparkName = spellType + "Spark";
    this.sparks = [];
    this.alpha = 0;
    this.audio = [];
    for (let i = 1; i <= 3; i++) {
      this.audio.push(this.scene.sound.add(spellType + i, {loop: false}));
    }
    this.audio[Math.floor(Math.random()*this.audio.length)].play();
  }
  makeSpark() {
    if (this.doneSparks)
      return;
    let tilemap = this.scene.map;
    let p = this.line[this.sparki];
    let tile = tilemap.getTileAt(p.x, p.y, true);
    let img = this.scene.add.image(tile.getLeft(), tile.getTop(), this.sparkName);
    img.setOrigin(0, 0);
    this.sparki += 1;
    this.sparks.push(new SpellSpark(img));
    if (this.sparki >= this.line.length)
    {
      this.alpha = 1;
      this.doneSparks = true;
    }
  }

  update(time, delta) {
    this.timeAlive += delta;
    if (this.timeAlive > 4000)
    {
      let index = this.scene.spells.findIndex(x => x === this);
      delete this.scene.spells[index];
      this.alive = false;
      this.destroy();
    }
    if (this.lastSpark > 30) {
      this.makeSpark();
      this.lastSpark = 0;
    }
    let toDestroy:number[] = [];
    let i = 0;
    for (let spark of this.sparks) {
      spark.lifetime += delta;
      if (spark.lifetime >= 100) {
        spark.img.destroy();
        toDestroy.push(i);
      }
      i+=1
    }
    for(let num of toDestroy) {
      this.sparks.splice(num, 1);
    }


    this.lastSpark += delta;

  }
}
