export default class room1 extends Phaser.Scene {
  constructor() {
    super("room1");
  }

  init(data) {
    this.player = data.player;
    this.inventory = data.inventory;
  }

  preload() {}

  create() {}
}
