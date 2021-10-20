export default class room2 extends Phaser.Scene {
  constructor() {
    super("room2");
  }

  init(data) {
    this.player = data.player;
    this.inventory = data.inventory;
  }

  preload() {}

  create() {}
}
