import Player from "../objects/player";
import Enemy from "../objects/enemy";
import Spell from "../objects/spell";
import EasyStar from "easystarjs";
import {Mrpas} from "mrpas";
import {PermissiveFov} from "permissive-fov";

import PF from "pathfinding";
function line(p0, p1) {
    let points:Phaser.Math.Vector2[] = [];
    let N = diagonal_distance(p0, p1);
    for (let step = 0; step <= N; step++) {
        let t = N === 0? 0.0 : step / N;
        points.push(round_point(lerp_point(p0, p1, t)));
    }
    return points;
}
function diagonal_distance(p0, p1) {
    let dx = p1.x - p0.x, dy = p1.y - p0.y;
    return Math.max(Math.abs(dx), Math.abs(dy));
}

function round_point(p) {
    return new Phaser.Math.Vector2(Math.round(p.x), Math.round(p.y));
}

function lerp_point(p0, p1, t) {
    return new Phaser.Math.Vector2(lerp(p0.x, p1.x, t),
                     lerp(p0.y, p1.y, t));
}

function lerp(start, end, t) {
    return start + t * (end-start);
}

export default class GameScene extends Phaser.Scene {

  map:Phaser.Tilemaps.Tilemap;
  wallLayer:Phaser.Tilemaps.TilemapLayer;
  groundLayer:Phaser.Tilemaps.TilemapLayer;
  shadowLayer:Phaser.Tilemaps.TilemapLayer;
  player:Player;
  enemies:Enemy[];
  spells:Spell[];
  pathfind;
  playerTimer:number;
  UIText1;
  spellText;
  path;
  grid:PF.Grid;
  seen:boolean[][];
  castSpellModeOn:boolean = false;
  spellName:string;
  spellReticle:Phaser.GameObjects.Image;

  private fov?:PermissiveFov;

  constructor() {
    super({ key: 'GameScene' })
  }

  create() {
    this.map = this.make.tilemap({key: "tilemap"});
    // this.map = this.make.tilemap({key: "maptest"});
    let tileset = this.map.addTilesetImage("tileset", "tileset");
    this.groundLayer = this.map.createLayer("Ground", "tileset");
    this.wallLayer = this.map.createLayer("Walls", "tileset");
    this.shadowLayer = this.map.createLayer("Shadow", "tileset");
    this.shadowLayer.depth = 2;
    let enemyLayer = this.map.createLayer("Enemies", "tileset");
    enemyLayer.alpha = 0;
    this.player = new Player(this, 0, 0);
    this.add.existing(this.player);
    this.input.keyboard.on('keydown', this.keypress, this);
    this.input.on("pointerdown", this.mousedown, this);
    this.cameras.main.startFollow(this.player);
    // this.cameras.main.setBounds(0, 0, this.map.width * 9, this.map.height * 9);
    this.enemies = [];
    this.spells = [];
    // this.map.destroyLayer("Enemies");
    this.pathfind =  new EasyStar.js();
    let arr:number[][] = [];
    for(let y:number = 0; y < this.map.height; y++){
      arr[y] = [];
      for(let x:number = 0; x < this.map.width; x++){
        let val = this.map.getTileAt(x,y, true, "Walls").index;
        if (val === -1 || val === 8)
          arr[y][x] = 0;
        else
          arr[y][x]  = 1;
        // arr[y][x] = this.map.getTileAt(x,y, true, "Walls").index;
      }
    }
    this.seen = [];
    for (let x: number = 0; x < this.map.width; x++)
      this.seen[x] = [];
    // this.grid = new PF.Grid(arr); 
    let column = "";
    for(let y:number = 0; y < this.map.height; y++){
      for(let x:number = 0; x < this.map.width; x++){
        column += arr[x][y] + " ";
      }
      column += "\n";
    }
    // console.log(column);
    this.pathfind.setGrid(arr);
    this.pathfind.setAcceptableTiles([0]);
    // this.pathfind.enableSync();
    this.playerTimer = 0;

    this.UIText1 = this.add.text(0, 0, 'Health: ' + this.player.health + " / 7", {"fontSize": "16px", "fontFamily": "EquipmentPro"});
    this.UIText1.setScrollFactor(0, 0);
    this.UIText1.depth = 3;
    this.spellText = this.add.text(0, 20, "Spells:\n1: Sonus: Skeleton\n2: Olfo: Serpent\n3: Lux: Ogre", {"fontSize": "16px", "fontFamily": "m5x7"});
    this.spellText.setScrollFactor(0, 0);
    this.spellText.depth = 3;
    // const UICam = this.cameras.add(0, 0, 800, 600);
    // this.cameras.main.ignore([ this.UIText1]);
    // UICam.ignore(this.player);
    // this.pathfind.findPath(0, 0, 4, 0, path => {
    //   console.log(path);
    // })
    // this.pathfind.calculate();
    // Game.finder.setGrid(grid);
    this.fov = new PermissiveFov(this.map.width, this.map.height, (x, y) => {
      return arr[y][x] === 0;
    });
    this.computeFOV();
    this.map.forEachTile(this.tilecallback, this, 0, 0, this.map.width, this.map.height, undefined, "Enemies");
  }

  findPath(start, end, callback){
    this.pathfind.findPath(start.x, start.y, end.x, end.y, callback);
    this.pathfind.calculate();
  }
  // async findPathAsync(start, end): Promise<Phaser.Math.Vector2[]> {
  //   console.log("findPathAsync");
  //   return await this.findPath2(start, end);
  // }
  findPathSync(start, end) : Promise<Phaser.Math.Vector2[]> {
    let p = this.pathfind;
    return new Promise<Phaser.Math.Vector2[]>(resolve => {
      p.findPath(start.x, start.y, end.x, end.y, path => {
        resolve(path);
      });
      p.calculate();
    });
  }

  tilecallback(tile:Phaser.Tilemaps.Tile, index, arr)
  {
    let id = tile.index;
    if (tile.index !== -1) {
      let enemyType:string = "skeleton";
      if (id===43)
        enemyType = "serpent";
      else if (id ===32)
        enemyType = "skeleton";
      else if (id===33)
        enemyType = "ogre";
      let enemy = new Enemy(this, tile.x, tile.y, enemyType);
      this.enemies.push(enemy);
      this.add.existing(enemy);
      // console.log("TILECALLBACK", tile.index);
    }

  }

  keypress(event)
  {
    // if (this.playerTimer < 500)
    //   return;
    // this.playerTimer = 0;
    let dir = new Phaser.Math.Vector2(0, 0);
    if (event.key === "w") {
      dir.y = -1;
    } else if (event.key === "s") {
      dir.y = 1;
    }
    if (event.key === "a") {
      dir.x = -1;
    } else if (event.key === "d") {
      dir.x = 1;
    }
    this.player.move(dir);
    if (event.key === "1")
      this.startCastSpell("sonus");
    else if (event.key === "2")
      this.startCastSpell("olfo");
    else if (event.key === "3")
      this.startCastSpell("lux");
    if (event.key === "Escape") {
      if (this.castSpellModeOn) {
        //handle reticle
        this.spellReticle.destroy();
        let spellType = this.spellName;
        this.castSpellModeOn = false;


      }
    }

  }
  mousedown(event) {
    // console.log("MOUSE DOWN", event);
    this.castSpell();
  }

  moveTo() {
    // let x = this.input.mousePointer.worldX;
    // let y = this.input.mousePointer.worldY;
    // let tile = this.map.getTileAtWorldXY(x, y, true, "Walls");
    // if (tile.index === -1 || tile.index === 8) {
    //   this.scene.pathfind.findPath(this.player.gridx, this.playser.gridy, tile.x, tile.y, path => {
    //     this.path = path;
    //     this.pathCounter = 0;
    //   })
    //   this.scene.pathfind.calculate();
      // let spell = new Spell(this, tile.x, tile.y, spellType);
      // this.add.existing(spell);
      // this.spells.push(spell);
    // }
  }

  startCastSpell(spellType:string) {
    this.castSpellModeOn = true;
    this.spellName = spellType;
    if (this.spellReticle)
      this.spellReticle.destroy();
    this.spellReticle = this.add.image(0, 0, "target");
    this.spellReticle.setOrigin(0, 0);
    this.spellReticle.depth = 100;
  }
  castSpell() {
    if (this.castSpellModeOn) {
      //handle reticle
      this.spellReticle.destroy();
      let spellType = this.spellName;
      this.castSpellModeOn = false;
      let x = this.input.mousePointer.worldX;
      let y = this.input.mousePointer.worldY;
      let tile = this.map.getTileAtWorldXY(x, y, true,this.cameras.main, "Walls");
      let l = line(this.player.mover.position, new Phaser.Math.Vector2(tile.x, tile.y));
      if (tile === null)
        return;
      else if (!this.isValidCastLine(l)) {
        return;
      }
      else if (tile.index === -1 || tile.index === 8) {
        let spell = new Spell(this, tile.x, tile.y, spellType, l);
        this.add.existing(spell);
        this.spells.push(spell);

      }
    } else {
      //move?
    }

  }

  isValidCastLine(l:Phaser.Math.Vector2[]): boolean {
    let validCast:boolean = true;
    for(let p of l) {
      let tile = this.wallLayer.getTileAt(p.x, p.y, true);
      if (tile === null)
        continue;
      if (tile.index === -1 || tile.index === 8) {
        //ok
      } else {
        validCast = false;
      }
    }
    return validCast;
  }

  isValidCast(x:number, y:number) :boolean {
    let l = line(this.player.mover.position, new Phaser.Math.Vector2(x, y));
    return this.isValidCastLine(l);
  }

  update(time, delta) {
    // console.log("time=", time, "delta=", delta);
    // let pos = this.map.tileToWorldXY(this.player.gridx, this.player.gridy);
    // this.player.x = pos.x;
    // this.player.y = pos.y;
    if (this.castSpellModeOn) {
      let x = this.input.mousePointer.worldX;
      let y = this.input.mousePointer.worldY;
      let tile = this.map.getTileAtWorldXY(x, y, true,this.cameras.main, "Walls");
      this.spellReticle.x = tile.getLeft();
      this.spellReticle.y = tile.getTop();
      let validCast:boolean = this.isValidCast(tile.x, tile.y);
      if (validCast)
        this.spellReticle.tint = 0x00ff00;
      else 
        this.spellReticle.tint = 0xff0000;
    } else {

    }
    this.player.update(time, delta);

    for (let enemy of this.enemies) {
      enemy.update(time, delta);
    }
    for (let spell of this.spells) {
      if (spell === undefined) continue;
      spell.update(time, delta);
    }
    this.playerTimer += delta;
    // this.UIText1.setText('Health: ' + this.player.health + " / 7 " + this.game.loop.actualFps);
    this.UIText1.setText('Health: ' + this.player.health + " / 7 ");
  }
  computeFOV()
  {
    if (!this.fov || !this.map || !this.player)
    {
      return;
    }

    // get camera view bounds
    const camera = this.cameras.main
    const bounds = new Phaser.Geom.Rectangle(
      this.map.worldToTileX(camera.worldView.x),
      this.map.worldToTileY(camera.worldView.y),
      this.map.worldToTileX(camera.worldView.width),
      this.map.worldToTileX(camera.worldView.height)
    )

    // set all tiles within camera view to invisible
    for (let y = bounds.y; y < bounds.y + bounds.height; y++)
    {
      for (let x = bounds.x; x < bounds.x + bounds.width; x++)
      {
        if (y < 0 || y >= this.map.height || x < 0 || x >= this.map.width)
        {
          continue;
        }

        const tile = this.shadowLayer.getTileAt(x, y)
        if (tile) {
          if (this.seen[x][y])
            tile.alpha = 0.8;
          else
            tile.alpha = 1;
        }
        // if (tile)
        // {
        //   tile.alpha = 1;
        //   tile.tint = 0x404040;
        // }

        // const tile2 = this.groundLayer.getTileAt(x, y);
        // if (tile2)
        // {
        //   tile2.tint = 0x404040;
        //   tile2.alpha = 1;

        // }
      }
    }
    // previous code...

    //get player's position
    const px = this.map.worldToTileX(this.player.x)
    const py = this.map.worldToTileY(this.player.y)

    // compute fov from player's position
    this.fov.compute(
      px,
      py,
      7,
      (x, y) => {
        const tile = this.shadowLayer!.getTileAt(x, y);
        if (!tile)
        {
          return;
        }
        this.seen[x][y] = true;
        const d = Phaser.Math.Distance.Between(py, px, y, x)
        const alpha = Math.max((d - 5) / 4, 0);
        tile.alpha = alpha;
        // const d = Phaser.Math.Distance.Between(py, px, y, x);
        // const alpha = Math.min(2 - d / 6, 1);
        // const tile = this.wallLayer!.getTileAt(x, y)
        // if (tile)
        // {
        //   tile.tint = 0xffffff;
        //   tile.alpha =  alpha;
        // }
        // const tile2 = this.groundLayer!.getTileAt(x, y);
        // if (tile2)
        // {
        //   tile2.tint = 0xffffff;
        //   tile2.alpha =  alpha;
        // }


      }
    )
  }
}
