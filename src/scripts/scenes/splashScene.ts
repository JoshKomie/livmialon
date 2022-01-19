export default class SplashScene extends Phaser.Scene {

  constructor() {
    super({ key: 'SplashScene' })
  }

  create() {
    let instructions = "You have been trapped in a dungeon by the evil archwizard. The dungeon is infested with skeletons, serpents and ogres. Luckily you find a spellbook labelled livmialon with 3 spells: Sonus, Olfo, and Lux.  skeletons are distracted by sound  serpents by smell  and ogres by light.  Use this knowledge to escape!";
    this.add.text(90, 0, 'Livmialon', {fontFamily: "EquipmentPro"});
    this.add.text(10, 20, instructions, {fontFamily: "m5x7", wordWrap: {width: 232}});
    const clickButton = this.add.text(100, 155, 'start', {fontFamily: "EquipmentPro", fontSize: "16px", backgroundColor: "#253a5e"})
      .setInteractive()
      .on('pointerdown', () => this.scene.start("GameScene"));
  }

}
