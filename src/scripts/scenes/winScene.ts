export default class WinScene extends Phaser.Scene {

  constructor() {
    super({ key: 'WinScene' })
  }

  create() {
    console.log("DEATH SCENE");
    this.add.text(0, 0, 'You have escaped!', {fontFamily: "EquipmentPro"});
    this.add.text(0, 20, 'Well Done', {fontFamily: "EquipmentPro"});
    const clickButton = this.add.text(100, 100, 'restart', {fontSize: "16px", fontFamily: "m5x7", backgroundColor: "#253a5e"})
      .setInteractive()
      .on('pointerdown', () => this.scene.start("SplashScene"));
  }

  update() {
  }
}
