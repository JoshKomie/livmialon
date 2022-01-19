export default class DeathScene extends Phaser.Scene {

  constructor() {
    super({ key: 'DeathScene' })
  }

  create() {
    console.log("DEATH SCENE");
    this.add.text(0, 0, 'You have died', {"fontSize": "16px", "fontFamily": "EquipmentPro"});
    const clickButton = this.add.text(100, 100, 'restart', {fontSize: "16px", fontFamily: "m5x7", backgroundColor: "#253a5e"})
      .setInteractive()
      .on('pointerdown', () => this.scene.start("SplashScene"));
  }

  update() {
  }
}
