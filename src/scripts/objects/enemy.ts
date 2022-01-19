import GameScene from "../scenes/gameScene";
import Spell from "./spell";
import Mover from "../components/mover";
import Actor from "./actor";

class Attack {
  lifetime:number;
  img:Phaser.GameObjects.Image;
  constructor(img:Phaser.GameObjects.Image) {
    this.lifetime = 0;
    this.img = img;
  }
}
export default class Enemy extends Actor {
  gridx:number;
  gridy:number;
  enemyType:string;
  targetSpell:string;
  pathType:string;
  path:[] | null;
  timeSinceLastMove:number;
  pathCounter:number;
  mover:Mover;
  attacking:boolean = false;
  attacks:Attack[];
  timeSinceChooseAction:number = 0;
  constructor(scene:GameScene, x, y, enemyType) {
    super(scene, 0, 0, enemyType);
    this.tag = enemyType;
    this.enemyType = enemyType;
    this.gridx = x;
    this.gridy = y;
    this.setOrigin(0, 0);
    this.path = null;
    this.timeSinceLastMove = 0;
    this.pathCounter = 0;
    this.targetSpell = this.getTargetSpell();
    this.pathType = "none";
    this.mover = new Mover(new Phaser.Math.Vector2(x, y), this, this.getSpeed());
    this.attacks = [];
    // this.setOrigin(0.5, 1);
  }
  getSpeed() :number{
    if (this.enemyType === "serpent")
      return 700;
    else if (this.enemyType === "skeleton")
      return 1000;
    else 
      return 1200;
  }
  getTargetSpell()
  {
    if (this.enemyType === "serpent")
      return "olfo";
    else if (this.enemyType === "skeleton")
      return "sonus";
    else 
      return "lux";
  }

  getNearestTargetSpell() : Spell | null {

    let tSpells:Spell[] = [];
    for (let spell of this.scene.spells) {
      if (spell === undefined) continue;
      if (spell.spellType === this.targetSpell)
        tSpells.push(spell);
    }
    if (tSpells.length <= 0)
      return null;
    let lowest = 1000000;
    let nearestSpell:Spell | null = null;
    for (let spell of tSpells) {
      let dist = Phaser.Math.Distance.Between(this.gridx, this.gridy, spell.gridx, spell.gridy);
      if (dist < lowest)
      {
        lowest = dist;
        nearestSpell = spell;
      }

    }
    return nearestSpell;
  }
  attack() {
    let player = this.scene.player;
    player.takeDamage();
    this.timeSinceLastMove = 0;
    this.attacking = true;
    let img = this.scene.add.image(player.x, player.y, "explode");
    img.setOrigin(0, 0);
    this.attacks.push(new Attack(img));

  }
  async chooseAction() {
    this.timeSinceChooseAction = 0;
    let player = this.scene.player;
    let playerPath = await this.scene.findPathSync(this.mover.position, player.mover.position);
    // console.log(playerPath.length);
    if (playerPath.length < 3 && this.timeSinceLastMove > 1000)
    {
      this.attack()
      return;
    }
    //chase spell

    let nearestSpell = this.getNearestTargetSpell();
    if (nearestSpell != null) {
      let spellPos = new Phaser.Math.Vector2(nearestSpell.gridx, nearestSpell.gridy);
      let spellPath = await this.scene.findPathSync(this.mover.position, spellPos);
      if (spellPath.length < 10 && spellPath.length > 2) {
        this.mover.moveAlongPath(spellPath);
        return;
      }
      else if (spellPath.length <= 2)
        return;
    }

    //move to player
    
    if (playerPath.length < 8 && playerPath.length > 2)
    {
      this.mover.moveAlongPath(playerPath);
    }
  }

  update(time, delta) {
    if (!this.mover.moving && this.timeSinceChooseAction > 100)
      this.chooseAction();
    this.timeSinceChooseAction += delta;
    this.mover.update(time, delta);
    this.timeSinceLastMove += delta;
    if (this.timeSinceLastMove > 1000)
      this.attacking = false;

    let toRemove:number[] = [];
    let i = 0;
    for (let attack of this.attacks) {
      attack.lifetime += delta;

      if (attack.lifetime >= 200) {
        attack.img.destroy();
        toRemove.push(i);
      }
      i+=1
    }
    for (let num of toRemove)
      this.attacks.splice(num, 1);
    // let pos = this.mover.position;
    // let nearestSpell = this.getNearestTargetSpell();
    // let player = this.scene.player;
    // let dist = Phaser.Math.Distance.Between(this.mover.position.x, this.mover.position.y, player.mover.position.x, player.mover.position.y);
    // if (nearestSpell !== null) {
    //   let spell = nearestSpell;
    //   this.scene.pathfind.findPath(this.gridx, this.gridy, spell.gridx, spell.gridy, path => {
    //     if (path.length > 6)
    //       return;
    //     this.mover.moveAlongPath(path);
    //   })
    //   this.scene.pathfind.calculate();
    // }
    // else
    // {
    //   // console.log("dist=", dist);
    //   if (dist < 4) {
    //     this.scene.pathfind.findPath(this.gridx, this.gridy, player.gridx, player.gridy, path => {
    //       if (path.length > 6)
    //         return;
    //       this.mover.moveAlongPath(path);
    //     })
    //     this.scene.pathfind.calculate();
    //   }

    // }
    // if (this.timeSinceLastMove > 1000) {
    //   if (dist < 2) {
    //     player.takeDamage();
    //   }
    //   this.timeSinceLastMove = 0;
    // }
    // else
    // {
    //   this.timeSinceLastMove += delta;
    // }
  }

  idToType(id) {
  }

}
