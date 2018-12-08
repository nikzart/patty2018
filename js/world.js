class World {
  constructor(scene) {
    this.scene_ = scene;
    this.nonResettableObstacles_ = [];
    this.obstacleSprites_ = [];
    this.nonBlockingObstacleSprites_ = [];

    scene.physics.world.setBounds(
        0, 0, Config.WORLD_WIDTH_PX, Config.WORLD_HEIGHT_PX);

    // Render the floor.
    const floor = scene.add.tileSprite(
        Config.WORLD_WIDTH_PX / 2,
        Config.WORLD_HEIGHT_PX / 2,
        Config.WORLD_WIDTH_PX,
        Config.WORLD_HEIGHT_PX,
        'wood');
    floor.depth = Depths.FLOOR;

    this.renderWalls_();

    this.renderObjects_();
  }

  reset() {
    this.obstacleSprites_ = [];
    this.nonBlockingObstacleSprites_ = [];
  }

  renderWalls_() {
    const topWall = this.scene_.physics.add.existing(
        this.scene_.add.tileSprite(
            Config.WORLD_WIDTH_PX / 2,
            Config.WORLD_WALL_TOP_HEIGHT_PX / 2,
            Config.WORLD_WIDTH_PX,
            Config.WORLD_WALL_TOP_HEIGHT_PX,
            'walltop'),
        true /* static */);
    topWall.depth = Depths.FLOOR;

    const topRightWall = this.scene_.physics.add.sprite(
        Config.WORLD_WIDTH_PX - Config.WORLD_WALL_TOP_RIGHT_WIDTH_PX / 2,
        Config.WORLD_WALL_TOP_RIGHT_HEIGHT_PX / 2,
        'walltopright');
    topRightWall.depth = Depths.FLOOR;
    topRightWall.setImmovable(true);

    const topLeftWall = this.scene_.physics.add.sprite(
        Config.WORLD_WALL_TOP_RIGHT_WIDTH_PX / 2,
        Config.WORLD_WALL_TOP_RIGHT_HEIGHT_PX / 2,
        'walltopright');
    topLeftWall.depth = Depths.FLOOR;
    topLeftWall.setImmovable(true);
    topLeftWall.flipX = -1;

    const leftWall = this.scene_.physics.add.existing(
        this.scene_.add.tileSprite(
            Config.WORLD_WALL_SIDE_WIDTH_PX / 2,
            (Config.WORLD_HEIGHT_PX
                + Config.WORLD_WALL_TOP_RIGHT_HEIGHT_PX) / 2,
            Config.WORLD_WALL_SIDE_WIDTH_PX,
            Config.WORLD_HEIGHT_PX - Config.WORLD_WALL_TOP_RIGHT_HEIGHT_PX,
            'wallright'),
        true /* static */);
    leftWall.depth = Depths.FLOOR;
    leftWall.flipX = -1;
    
    this.addNonResettableObstacleSprite_(topWall);
    this.addNonResettableObstacleSprite_(topRightWall);
    this.addNonResettableObstacleSprite_(topLeftWall);
    this.addNonResettableObstacleSprite_(leftWall);
  }

  renderRightWall(gapTopY, gapBottomY) {
    const rightWallTop = this.scene_.physics.add.existing(
        this.scene_.add.tileSprite(
            Config.WORLD_WIDTH_PX - Config.WORLD_WALL_SIDE_WIDTH_PX / 2,
            (gapTopY + Config.WORLD_WALL_TOP_RIGHT_HEIGHT_PX) / 2,
            Config.WORLD_WALL_SIDE_WIDTH_PX,
            gapTopY - Config.WORLD_WALL_TOP_RIGHT_HEIGHT_PX,
            'wallright'),
        true /* static */);
    rightWallTop.depth = Depths.FLOOR;

    const rightWallBottom = this.scene_.physics.add.existing(
        this.scene_.add.tileSprite(
            Config.WORLD_WIDTH_PX - Config.WORLD_WALL_SIDE_WIDTH_PX / 2,
            (Config.WORLD_HEIGHT_PX + gapBottomY) / 2,
            Config.WORLD_WALL_SIDE_WIDTH_PX,
            Config.WORLD_HEIGHT_PX - gapBottomY,
            'wallright'),
        true /* static */);
    rightWallBottom.depth = Depths.FLOOR;

    this.addObstacleSprite(rightWallTop);
    this.addObstacleSprite(rightWallBottom);
  }

  renderObjects_() {
    const pianoWidth = Config.WORLD_PIANO_WIDTH_PX * Config.WORLD_PIANO_SCALE;
    const pianoHeight = Config.WORLD_PIANO_HEIGHT_PX * Config.WORLD_PIANO_SCALE;
    const piano = this.scene_.physics.add.sprite(
        Config.WORLD_WALL_SIDE_WIDTH_PX + pianoWidth / 2,
        200,
        'piano');
    piano.displayWidth = pianoWidth;
    piano.displayHeight = pianoHeight;
    piano.depth = Depths.OBJECTS;
    piano.setImmovable(true);

    const flowers1 = this.scene_.physics.add.sprite(
        Config.WORLD_WALL_SIDE_WIDTH_PX + Config.WORLD_FLOWERS_WIDTH_PX / 2,
        Config.WORLD_HEIGHT_PX - Config.WORLD_FLOWERS_HEIGHT_PX / 2,
        'flowers');
    flowers1.depth = Depths.OBJECTS;
    flowers1.setImmovable(true);

    const flowers2 = this.scene_.physics.add.sprite(
        Config.WORLD_WIDTH_PX - Config.WORLD_WALL_SIDE_WIDTH_PX
            - Config.WORLD_FLOWERS_WIDTH_PX / 2,
        Config.WORLD_HEIGHT_PX - Config.WORLD_FLOWERS_HEIGHT_PX / 2,
        'flowers');
    flowers2.depth = Depths.OBJECTS;
    flowers2.setImmovable(true);

    const bookcaseWidth = Config.WORLD_BOOKCASE_WIDTH_PX
        * Config.WORLD_BOOKCASE_SCALE;
    const bookcaseHeight = Config.WORLD_BOOKCASE_HEIGHT_PX
        * Config.WORLD_BOOKCASE_SCALE;
    const bookcase = this.scene_.physics.add.sprite(
        Config.WORLD_WIDTH_PX - Config.WORLD_WALL_SIDE_WIDTH_PX
            - bookcaseWidth / 2,
        100,
        'bookcase');
    bookcase.displayWidth = bookcaseWidth;
    bookcase.displayHeight = bookcaseHeight;
    bookcase.depth = Depths.OBJECTS;
    bookcase.setImmovable(true);

    this.addNonResettableObstacleSprite_(piano);
    this.addNonResettableObstacleSprite_(flowers1);
    this.addNonResettableObstacleSprite_(flowers2);
    this.addNonResettableObstacleSprite_(bookcase);
  }

  addNonResettableObstacleSprite_(sprite) {
    this.nonResettableObstacles_.push(sprite);
  }

  addObstacleSprite(sprite) {
    this.obstacleSprites_.push(sprite);
  }

  addNonPathBlockingObstacleSprite(sprite) {
    this.nonBlockingObstacleSprites_.push(sprite);
  }

  anyPathBlockingObstacleInRegion(centerX, centerY, width, height) {
    return this.anyObstacleInRegion_(
        this.obstacleSprites_.concat(this.nonResettableObstacles_),
        centerX,
        centerY,
        width,
        height);
  }

  anyObstacleInRegion(centerX, centerY, width, height) {
    return this.anyObstacleInRegion_(
        this.obstacleSprites_
            .concat(this.nonBlockingObstacleSprites_)
            .concat(this.nonResettableObstacles_),
        centerX,
        centerY,
        width,
        height);
  }

  anyObstacleInRegion_(obstacles, centerX, centerY, width, height) {
    const region = new Phaser.Geom.Rectangle(
        centerX - width / 2, centerY - height / 2, width, height);
    for (var i = 0; i < obstacles.length; i++) {
      const obstacleRect = obstacles[i].getBounds();
      const intersection = Phaser.Geom.Rectangle.Intersection(
          region, obstacleRect);
      if (intersection.width || intersection.height) {
        return true;
      }
    }

    return false;
  }

  checkCollisions(sprite) {
    this.scene_.physics.collide(
        sprite,
        this.obstacleSprites_
            .concat(this.nonBlockingObstacleSprites_)
            .concat(this.nonResettableObstacles_));
  }
}
