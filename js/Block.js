class Block extends Phaser.GameObjects.Sprite
{
  constructor(scene, x, y, i, j, size, textureKey) {
    super(scene, x, y, textureKey);

    this.scene = scene;
    this.x = x;
    this.y = y;
    this.size = size;

    this.block = scene.add.image(x, y, textureKey);
    this.block.setOrigin(0, 0);
    this.block.displayWidth = size;
    this.block.displayHeight = size;

    this.graphics = scene.add.graphics();
    this.graphics.lineStyle(2, 0x000000);
    this.graphics.strokeRect(x, y, size, size);

    this.i = i;
    this.j = j;
    this.shouldDisapear = false;
  }

  setTintColor(tintColor)
  {
    this.block.setTint(tintColor);
  }

  setAlpha(alpha)
  {
    this.block.alpha = alpha;
  }

  completeBlock()
  {
    const effectImage = this.scene.add.sprite(this.x + this.size / 2, this.y - 5 + this.size / 2, 'complete');
    effectImage.play('complete_anim');
    effectImage.on('animationcomplete', () => {
      effectImage.destroy();
    });
  }

  destroyBlock()
  {
    this.graphics.clear();
    this.block.destroy();
  }
}