class Shape
{
  constructor(scene, x, y, iOffset, jOffset, blocksInfo, cellSize, sceneBlocksGroup) {

    this.blocksInfo = blocksInfo;
    this.shapeBlocksGroup = scene.add.group();

    const shapeDimension = 3;
    this.layout = this.blocksInfo['layout' + this.blocksInfo.rotation];

    for (let i = 0; i < shapeDimension; i++) {
      for (let j = 0; j < shapeDimension; j++) {
        const cell = this.layout[i][j];
        if(cell == 1)
        {
          const block = new Block(scene, x + cellSize * j, y + cellSize * i, i + iOffset, j + jOffset, cellSize, 'block');
          this.shapeBlocksGroup.add(block);
          if(sceneBlocksGroup) sceneBlocksGroup.add(block);
        }
      }
    }
  }

  setTintColor(tintColor)
  {
    this.shapeBlocksGroup.children.iterate(function (child) {
      child.setTintColor(tintColor);
    });
  }

  setAlpha(alpha)
  {
    this.shapeBlocksGroup.children.iterate(function (child) {
      child.setAlpha(alpha);
    });
  }

  destroyShape()
  {
    this.shapeBlocksGroup.children.iterate(function (child) {
      child.destroyBlock();
    });
  }
}

