import Actor from "../objects/actor";
import PF from "pathfinding";
export default class Mover {
  position:Phaser.Math.Vector2;
  positionTarget:Phaser.Math.Vector2;
  positionWorld:Phaser.Math.Vector2;
  positionTargetWorld:Phaser.Math.Vector2;
  moveTime:number;
  currentTime:number;
  moving:boolean;
  moveQueue:Phaser.Math.Vector2 | null;
  owner:Actor;

  path:Phaser.Math.Vector2[];
  movePath:boolean = false;
  pathCounter:number;

  constructor(position, owner, moveTime) {
    this.owner = owner;
    this.moveQueue = null;
    this.position = position;
    this.positionWorld = this.owner.scene.map.tileToWorldXY(this.position.x, this.position.y);
    this.setWorldPosition();
    this.moving =false;
    this.moveTime = moveTime;
  }
  move(dir:Phaser.Math.Vector2) {
    if (this.moving) {
      this.moveQueue = dir;
      return;
    }
    // console.log("dir=", dir);
    let newPos = new Phaser.Math.Vector2(this.position.x, this.position.y);
    newPos = newPos.add(dir);
    //check collision
    let tile = this.owner.scene.map.getTileAt(newPos.x, newPos.y, false, "Walls");
    if (tile === null || tile.index === 8 )//empty
    {
      this.moving = true;
      this.positionTarget = newPos;
      this.positionTargetWorld = this.owner.scene.map.tileToWorldXY(this.positionTarget.x, this.positionTarget.y);
      this.currentTime = 0;

      // this.setWorldPosition();
    }
  }
  movePosition(pos:Phaser.Math.Vector2) {
    if (this.moving)
      return;
    let tile = this.owner.scene.map.getTileAt(pos.x, pos.y, false, "Walls");
    if (tile === null || tile.index === 8 )//empty
    {
      this.moving = true;
      this.positionTarget = pos;
      this.positionTargetWorld = this.owner.scene.map.tileToWorldXY(this.positionTarget.x, this.positionTarget.y);
      this.currentTime = 0;
    }
  }
  moveAlongPath(path:Phaser.Math.Vector2[]) {
    this.path = path;
    this.movePath = true;
    this.pathCounter = 1;
    let arr = this.path[this.pathCounter];
    this.movePosition(arr);

  }
  setGridPosition(pos:Phaser.Math.Vector2) {
    this.position = pos;
    this.positionWorld = this.owner.scene.map.tileToWorldXY(pos.x, pos.y);
    this.owner.x = this.positionWorld.x;
    this.owner.y = this.positionWorld.y;
  }
  setWorldPosition()
  {
    let pos = this.owner.scene.map.tileToWorldXY(this.position.x, this.position.y);
    this.owner.x = pos.x;
    this.owner.y = pos.y;

  }
  update(time, delta) {
    if (this.moving) {
      let between = this.positionWorld.lerp(this.positionTargetWorld, this.currentTime / this.moveTime);
      this.currentTime += delta;
      this.owner.x = between.x;
      this.owner.y = between.y;
      if (this.currentTime >= this.moveTime) {
        this.moving = false;
        this.positionWorld = this.positionTargetWorld;
        this.position = this.positionTarget;
        if (this.owner.tag === "player")
          this.owner.scene.computeFOV();
        if (this.moveQueue) {
          let dir = this.moveQueue;
          this.moveQueue = null;
          this.move(dir);
        }
        // else if (this.movePath) {
        //   this.pathCounter +=1;
        //   if (this.pathCounter >= this.path.length) {
        //     this.moving = false;
        //     this.movePath = false;
        //   } else {
        //     let next = this.path[this.pathCounter];
        //     this.movePosition(new Phaser.Math.Vector2(next[0], next[1]));
        //   }

        // }
      }
    }

  }
}
