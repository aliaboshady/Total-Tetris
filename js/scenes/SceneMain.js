class SceneMain extends Phaser.Scene
{
  constructor()
  {
    super('SceneMain');
  }

  init() {
    this.grid =
    [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]

    this.shapeChoiceY = 660;
    this.shapeChoiceXLeft = 110;
    this.shapeChoiceXMiddle = 270;
    this.shapeChoiceXRight = 430;

    this.score = 0;
    this.scoreText = null;

    this.gridSize = 10;
    this.cellSize = 50;
    this.gridColor = 0x000000;
    this.defaultTint = 0xFFFFFF;
    this.wrongTint = 0xFA6F66;
    this.disabledTint = 0x505050;
    this.loseTint = 0x828282;
    this.imageCoiceDisplaySize = 120;
    this.innerBackgroundSize = this.gridSize * this.cellSize;
    this.innerBackgroundStartPointX = (config.width / 2) - (this.innerBackgroundSize / 2); //20
    this.innerBackgroundStartPointY = 70;
    this.innerBackground = null;
    this.sceneBlocksGroup = null;

    this.shapeImageLeft = null;
    this.shapeImageMiddle = null;
    this.shapeImageRight = null;

    this.chosenKey = null;
    this.chosenImage = null;
    this.chosenRotation = null;
    this.chosenShapeColumn = -1;
    this.chosenShapePreview = null;
    
    this.shapeChoiceKeyLeft = null;
    this.shapeChoiceKeyMiddle = null;
    this.shapeChoiceKeyRight = null;
    
    this.shapeRotationLeft = null;
    this.shapeRotationMiddle = null;
    this.shapeRotationRight = null;

    this.canPlaceChoiceLeft = true;
    this.canPlaceChoiceMiddle = true;
    this.canPlaceChoiceRight = true;

    this.loseBannerContainer = null;
    this.restartButton = null;
  }

  preload()
  {
    this.load.image('block', 'assets/images/block.jpg');
    this.load.image('background', 'assets/images/background.png');
    this.load.image('innerBackground', 'assets/images/innerBackground.png');
    this.load.image('shape_1', 'assets/images/shape_1.png');
    this.load.image('shape_2', 'assets/images/shape_2.png');
    this.load.image('shape_3', 'assets/images/shape_3.png');
    this.load.image('shape_4', 'assets/images/shape_4.png');
    this.load.image('shape_9', 'assets/images/shape_9.png');
    this.load.image('shape_Lbig', 'assets/images/shape_Lbig.png');
    this.load.image('shape_Lshortright', 'assets/images/shape_Lshortright.png');
    this.load.image('shape_Lshortleft', 'assets/images/shape_Lshortleft.png');
    this.load.image('shape_Lsmall', 'assets/images/shape_Lsmall.png');
    this.load.image('shape_stepright', 'assets/images/shape_stepright.png');
    this.load.image('shape_stepleft', 'assets/images/shape_stepleft.png');
    this.load.image('shape_T', 'assets/images/shape_T.png');
    this.load.image('loseBanner', 'assets/images/loseBanner.png');
    this.load.image('button', 'assets/images/button.png');

    this.load.spritesheet('pick', 'assets/effects/10.png', {frameWidth: 100, frameheight: 100});
    this.load.spritesheet('complete', 'assets/effects/7.png', {frameWidth: 100, frameheight: 100});
  }

  create()
  {
    if(!this.anims.exists('pick_anim'))
    {
      this.anims.create({
        key: 'pick_anim',
        frames: this.anims.generateFrameNumbers('pick'),
        frameRate: 64,
        repeat: false
      });
    }

    if(!this.anims.exists('complete_anim'))
    {
      this.anims.create({
        key: 'complete_anim',
        frames: this.anims.generateFrameNumbers('complete'),
        frameRate: 64,
        repeat: false
      });
    }

    this.sceneBlocksGroup = this.add.group();
    this.createBackground();

    this.shapeImageLeft = this.add.image(this.shapeChoiceXLeft, this.shapeChoiceY, null).setInteractive().on('pointerdown', () => this.onClickOnShapeChoice(this.shapeImageLeft, this.shapeChoiceKeyLeft, this.shapeRotationLeft, 0), this);
    this.shapeImageMiddle = this.add.image(this.shapeChoiceXMiddle, this.shapeChoiceY, null).setInteractive().on('pointerdown', () => this.onClickOnShapeChoice(this.shapeImageMiddle, this.shapeChoiceKeyMiddle, this.shapeRotationMiddle, 1), this);
    this.shapeImageRight = this.add.image(this.shapeChoiceXRight, this.shapeChoiceY, null).setInteractive().on('pointerdown', () => this.onClickOnShapeChoice(this.shapeImageRight, this.shapeChoiceKeyRight, this.shapeRotationRight, 2), this);

    this.addShapeChoice(0);
    this.addShapeChoice(1);
    this.addShapeChoice(2);

    this.scoreText = this.add.text(18, 20, 'Score: 0', {fontSize: 25});
    this.loseBannerContainer = this.add.container(config.width / 2, -200).setDepth(1);

    const loseBannerImmage = this.add.image(0, 0, 'loseBanner');
    loseBannerImmage.displayHeight += 70;
    loseBannerImmage.displayWidth += 70;
    
    const loseText = this.add.text(0, 15, 'No more moves!', {fontSize: 30});
    loseText.setOrigin(0.5, 0.5);
    
    const finalScoreText = this.add.text(0, 85, 'score', {fontSize: 30});
    finalScoreText.setOrigin(0.5, 0.5);
    
    const restartText = this.add.text(0, 160, 'Restart', {fontSize: 30});
    restartText.setOrigin(0.5, 0.5);

    this.restartButton = this.add.image(0, 160, 'button').setInteractive().on('pointerdown', () => {this.scene.restart()}, this);
    this.restartButton.displayHeight -= 20;
    this.restartButton.displayWidth -= 20;

    this.loseBannerContainer.add(loseBannerImmage);
    this.loseBannerContainer.add(loseText);
    this.loseBannerContainer.add(finalScoreText);
    this.loseBannerContainer.add(this.restartButton);
    this.loseBannerContainer.add(restartText);

    this.input.on('pointermove', (pointer) => this.onPointerMoveInInnerBackground(pointer), this);
  }

  createBackground()
  {
    const background = this.add.image(0, 0, 'background');
    this.innerBackground = this.add.image(this.innerBackgroundStartPointX, this.innerBackgroundStartPointY, 'innerBackground');
    this.innerBackground.displayHeight = this.innerBackgroundSize;
    this.innerBackground.displayWidth = this.innerBackgroundSize;
    this.innerBackground.setOrigin(0, 0);
    this.innerBackground.setInteractive().on('pointerdown', (pointer) => this.onInnerBackgroundClick(pointer, this.chosenShapeColumn), this);

    this.graphics = this.add.graphics();
    this.graphics.lineStyle(2.5, this.gridColor);

    for (let i = 0; i <= this.gridSize; i++) {
        const y = i * this.cellSize;
        const x = i * this.cellSize;
        this.graphics.moveTo(this.innerBackgroundStartPointX, y + this.innerBackgroundStartPointY);
        this.graphics.lineTo(this.cellSize * this.gridSize + this.innerBackgroundStartPointX, y + this.innerBackgroundStartPointY);
        this.graphics.moveTo(x + this.innerBackgroundStartPointX, this.innerBackgroundStartPointY);
        this.graphics.lineTo(x + this.innerBackgroundStartPointX, this.cellSize * this.gridSize + this.innerBackgroundStartPointY);
    }
    this.graphics.strokePath();
  }

  addShapeChoice(column)
  {
    const shapeKeys = Object.keys(ShapesInfo.shapesInfo);
    const randomIndex = Math.floor(Math.random() * shapeKeys.length);
    const randomKey = shapeKeys[randomIndex];
    let randomRotation = 0;

    if(ShapesInfo.shapesInfo[randomKey].canRotate)
    {
      randomRotation = Math.floor(Math.random() * 4);
    }

    const shapeInfo = ShapesInfo.shapesInfo[randomKey];
    shapeInfo.rotation = randomRotation;
    const canBePlacedOnGrid = this.canPlaceShapeAnywhere(shapeInfo);

    if(column == 0)
    {
      this.shapeImageLeft.setTexture(randomKey);
      this.shapeImageLeft.angle = 90 * randomRotation;
      this.shapeChoiceKeyLeft = randomKey;
      this.shapeRotationLeft = randomRotation;
      this.shapeImageLeft.displayWidth = this.imageCoiceDisplaySize;
      this.shapeImageLeft.displayHeight = this.imageCoiceDisplaySize;
      canBePlacedOnGrid ? this.shapeImageLeft.setTint(this.defaultTint) : this.shapeImageLeft.setTint(this.disabledTint);
      this.canPlaceChoiceLeft = canBePlacedOnGrid;
    }
    else if(column == 1)
    {
      this.shapeImageMiddle.setTexture(randomKey);
      this.shapeImageMiddle.angle =  90 * randomRotation;
      this.shapeChoiceKeyMiddle = randomKey;
      this.shapeRotationMiddle = randomRotation;
      this.shapeImageMiddle.displayWidth = this.imageCoiceDisplaySize;
      this.shapeImageMiddle.displayHeight = this.imageCoiceDisplaySize;
      canBePlacedOnGrid ? this.shapeImageMiddle.setTint(this.defaultTint) : this.shapeImageMiddle.setTint(this.disabledTint);
      this.canPlaceChoiceMiddle = canBePlacedOnGrid;
    }
    else if(column == 2)
    {
      this.shapeImageRight.setTexture(randomKey);
      this.shapeImageRight.angle =  90 * randomRotation;
      this.shapeChoiceKeyRight = randomKey;
      this.shapeRotationRight = randomRotation;
      this.shapeImageRight.displayWidth = this.imageCoiceDisplaySize;
      this.shapeImageRight.displayHeight = this.imageCoiceDisplaySize;
      canBePlacedOnGrid ? this.shapeImageRight.setTint(this.defaultTint) : this.shapeImageRight.setTint(this.disabledTint);
      this.canPlaceChoiceRight = canBePlacedOnGrid;
    }
  }

  onClickOnShapeChoice(image, shapeChoiceKey, shapeRotation, chosenShapeColumn)
  {
    // If shape cannot be placed anywhere on the grid
    if((chosenShapeColumn == 0 && !this.canPlaceChoiceLeft) || (chosenShapeColumn == 1 && !this.canPlaceChoiceMiddle) || (chosenShapeColumn == 2 && !this.canPlaceChoiceRight)) return;

    this.shapeImageLeft.setAlpha(1);
    this.shapeImageMiddle.setAlpha(1);
    this.shapeImageRight.setAlpha(1);

    //Deselect
    if(this.chosenImage === image)
    {
      this.chosenKey = null;
      this.chosenImage.setAlpha(1);
      this.chosenImage = null;
      this.chosenRotation = null;
      this.chosenShapeColumn = -1;
    }
    //Select
    else
    {
      this.chosenKey = shapeChoiceKey;
      this.chosenImage = image;
      this.chosenImage.setAlpha(0.5);
      this.chosenRotation = shapeRotation;
      this.chosenShapeColumn = chosenShapeColumn;
    }
  }

  onPointerMoveInInnerBackground(pointer)
  {
    //Destroy Shape and Reset Variable
    if(this.chosenShapePreview) this.chosenShapePreview.destroyShape();
    this.chosenShapePreview = null;

    //If no shape is chosen or mouse is outside the inner background, then return
    if
    (!this.chosenKey ||
      pointer.x < this.innerBackground.x ||
      pointer.x > this.innerBackground.x + this.innerBackground.displayWidth ||
      pointer.y < this.innerBackground.y ||
      pointer.y > this.innerBackground.y + this.innerBackground.displayHeight)
    {
      if(this.chosenShapePreview) this.chosenShapePreview.destroyShape();
      this.chosenShapePreview = null;
      return;
    }
    
    const iOffset = Math.floor((pointer.y - this.innerBackgroundStartPointY) / this.cellSize);
    const jOffset = Math.floor((pointer.x - this.innerBackgroundStartPointX) / this.cellSize);
    const x = jOffset * this.cellSize + this.innerBackgroundStartPointX;
    const y = iOffset * this.cellSize + this.innerBackgroundStartPointY;

    const shapeInfo = ShapesInfo.shapesInfo[this.chosenKey];
    shapeInfo.rotation = this.chosenRotation
    this.chosenShapePreview = new Shape(this, x, y, iOffset, jOffset, shapeInfo, this.cellSize, null);
    this.chosenShapePreview.setAlpha(0.5);

    this.chosenShapePreview.setTintColor(this.defaultTint);
    if(!this.canPlaceShapeHere(shapeInfo, iOffset, jOffset))
    {
      this.chosenShapePreview.setTintColor(this.wrongTint);
    }
  }

  onInnerBackgroundClick(pointer, chosenShapeColumn)
  {
    if(this.chosenKey == null) return;

    const iOffset = Math.floor((pointer.y - this.innerBackgroundStartPointY) / this.cellSize);
    const jOffset = Math.floor((pointer.x - this.innerBackgroundStartPointX) / this.cellSize);
    const x = jOffset * this.cellSize + this.innerBackgroundStartPointX;
    const y = iOffset * this.cellSize + this.innerBackgroundStartPointY;
    
    const shapeInfo = ShapesInfo.shapesInfo[this.chosenKey];
    shapeInfo.rotation = this.chosenRotation;
    if(!this.canPlaceShapeHere(shapeInfo, iOffset, jOffset)) return;
    
    const shape = new Shape(this, x, y, iOffset, jOffset, shapeInfo, this.cellSize, this.sceneBlocksGroup);
    this.score += this.getShapeBlocksCount(shapeInfo);
    this.scoreText.setText('Score: ' + this.score);

    this.chosenKey = null;
    this.chosenImage.setAlpha(1);
    this.chosenImage = null;
    this.chosenRotation = null;
    this.chosenShapeColumn = -1;

    if(this.chosenShapePreview) this.chosenShapePreview.destroyShape();
    this.chosenShapePreview = null;

    //Fill Grid Array
    const shapeLayout = shapeInfo['layout' + shapeInfo.rotation];
    for (let i = 0; i < shapeLayout.length; i++) {
      for (let j = 0; j < shapeLayout[0].length; j++) {
        const cellValue = shapeLayout[i][j];
        if(cellValue === 1) this.grid[i + iOffset][j + jOffset] = cellValue;
      }
    }

    this.checkCompletedRowsAndColumns();
    this.checkAllBottomShapeChoicesCanBePlaced();
    this.addShapeChoice(chosenShapeColumn);
    this.playPlacedShapeAnimation(chosenShapeColumn);

    if(!this.canPlaceChoiceLeft && !this.canPlaceChoiceMiddle && !this.canPlaceChoiceRight)
    {
      this.onLose();
    }
  }

  getShapeBlocksCount(shapeInfo)
  {
    let score = 0;

    for (let i = 0; i < shapeInfo.layout0.length; i++) {
        for (let j = 0; j < shapeInfo.layout0[i].length; j++) {
            score += shapeInfo.layout0[i][j];
        }
    }

    return score;
  }

  playPlacedShapeAnimation(col)
  {
    let x = 0;
    let y = this.shapeChoiceY;

    switch (col) {
      case 0:
        x = this.shapeChoiceXLeft;
        break;
      case 1:
        x = this.shapeChoiceXMiddle;
        break;
      case 2:
        x = this.shapeChoiceXRight;
        break;
      default:
        break;
    };

    const effectImage = this.add.sprite(x, y, 'pick');
    effectImage.play('pick_anim');
    effectImage.on('animationcomplete', () => {
      effectImage.destroy();
    });
  }

  checkAllBottomShapeChoicesCanBePlaced()
  {
    const shapeInfoLeft = ShapesInfo.shapesInfo[this.shapeChoiceKeyLeft];
    shapeInfoLeft.rotation = this.shapeRotationLeft;
    const canBePlacedOnGridLeft = this.canPlaceShapeAnywhere(shapeInfoLeft);
    canBePlacedOnGridLeft ? this.shapeImageLeft.setTint(this.defaultTint) : this.shapeImageLeft.setTint(this.disabledTint);
    this.canPlaceChoiceLeft = canBePlacedOnGridLeft;

    const shapeInfoMiddle = ShapesInfo.shapesInfo[this.shapeChoiceKeyMiddle];
    shapeInfoMiddle.rotation = this.shapeRotationMiddle;
    const canBePlacedOnGridMiddle = this.canPlaceShapeAnywhere(shapeInfoMiddle);
    canBePlacedOnGridMiddle ? this.shapeImageMiddle.setTint(this.defaultTint) : this.shapeImageMiddle.setTint(this.disabledTint);
    this.canPlaceChoiceMiddle = canBePlacedOnGridMiddle;
    
    const shapeInfoRight = ShapesInfo.shapesInfo[this.shapeChoiceKeyRight];
    shapeInfoRight.rotation = this.shapeRotationRight;
    const canBePlacedOnGridRight = this.canPlaceShapeAnywhere(shapeInfoRight);
    canBePlacedOnGridRight ? this.shapeImageRight.setTint(this.defaultTint) : this.shapeImageRight.setTint(this.disabledTint);
    this.canPlaceChoiceRight = canBePlacedOnGridRight;
  }

  canPlaceShapeHere(shapeInfo, iOffset, jOffset)
  {
    const shapeLayout = shapeInfo['layout' + shapeInfo.rotation];
    for (let i = 0; i < shapeLayout.length; i++) {
      for (let j = 0; j < shapeLayout[0].length; j++) {
        const cellValue = shapeLayout[i][j];
        if(cellValue === 1 && (i + iOffset >= this.gridSize || j + jOffset >= this.gridSize || this.grid[i + iOffset][j + jOffset] === 1))
        {
          return false;
        }
      }
    }
    return true;
  }

  canPlaceShapeAnywhere(shapeInfo)
  {
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[0].length; j++) {
        if(this.grid[i][j] === 1) continue;

        if(this.canPlaceShapeHere(shapeInfo, i, j))
        {
          return true;
        }
      }
    }
    return false;
  }

  checkCompletedRowsAndColumns()
  {
    let fullSomething = false;

    //Check Rows
    for (let i = 0; i < this.grid.length; i++) {
      let fullRow = true;

      for (let j = 0; j < this.grid[0].length; j++) {
        if(this.grid[i][j] === 0)
        {
          fullRow = false;
          break;
        }
      }

      if(fullRow)
      {
        fullSomething = true;
        this.sceneBlocksGroup.children.iterate(function (block) {
          if(block.i === i) block.shouldDisapear = true;
        });
      }
    }

    //Check Columns
    for (let j = 0; j < this.grid[0].length; j++) {
      let fullCol = true;

      for (let i = 0; i < this.grid.length; i++) {
        if(this.grid[i][j] === 0)
        {
          fullCol = false;
          break;
        }
      }

      if(fullCol)
      {
        fullSomething = true;
        this.sceneBlocksGroup.children.iterate(function (block) {
          if(block.j === j) block.shouldDisapear = true;
        });
      }
    }

    if(fullSomething)
    {
      this.removeCompletedBlocks();
    }
  }

  removeCompletedBlocks()
  {
    this.sceneBlocksGroup.children.iterate(function (block) {
      if(block.shouldDisapear)
      {
        this.score++;
        this.grid[block.i][block.j] = 0;
        block.shouldDisapear = false;
        block.completeBlock();
        block.destroyBlock();
      }
    }.bind(this));

    this.scoreText.setText('Score: ' + this.score);
  }

  onLose()
  {
    this.sceneBlocksGroup.children.iterate((block) => {
      block.setTintColor(this.loseTint);
    });

    this.loseBannerContainer.iterate((child) => {
      if(child instanceof Phaser.GameObjects.Text && child.text === 'score')
      {
        child.setText('Score: ' + this.score);
      }
    });

    this.tweens.add({targets: this.loseBannerContainer, duration: 1000, y: 200});
  }
}