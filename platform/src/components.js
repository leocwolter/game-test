// The Grid component allows an element to be located
//  on a grid of tiles
Crafty.c('Grid', {
  init: function() {
    this.attr({
      w: Game.map_grid.tile.width,
      h: Game.map_grid.tile.height
    })
  },

  // Locate this entity at the given position on the grid
  at: function(x, y) {
    if (x === undefined && y === undefined) {
      return { x: this.x/Game.map_grid.tile.width, y: this.y/Game.map_grid.tile.height }
    } else {
      this.attr({ x: x * Game.map_grid.tile.width, y: y * Game.map_grid.tile.height });
      return this;
    }
  }
});

Crafty.c('Actor', {
  init: function(){
    this.requires('2D, Canvas, Grid, Color');
  }
});

Crafty.c('Floor', {
  init: function() {
    this.requires('Actor, Solid')
      .color("rgb(255, 255, 255)");
  },
});

Crafty.c('Boundary', {
  init: function() {
    this.requires('Actor, Solid')
      .color("rgb(0,84,6)");
  },
});

Crafty.c('Character', {
  init: function() {
    this.requires('Actor, Collision, Gravity')
        .gravity("Floor");
    
  }
});

Crafty.c('Player', {
  
  health: 100,

  init: function() {
    this.requires('Twoway, Character')
        .twoway(4, 10)
        .stopOnSolids()
        .damageOnEnemy()
        .color("rgb(0, 0, 0)")

  },

  damageOnEnemy: function(){
    this.onHit('Enemy', function(){this.subtractHealth(), this.stopMovement()});
    return this;
  },

  subtractHealth: function(){
    this.health -= 1;
    this.updateHealth();
  },

  updateHealth: function(){
    document.getElementById('health-bar').style.width = this.health+"%";
  },

  stopOnSolids: function(){
    this.onHit('Solid', this.stopMovement);
    return this;
  },

  stopMovement: function(){
    this._speed = 0;
    if(this._movement){
      this.x -= this._movement.x;
      this.y -= this._movement.y;
    }
  },
});

Crafty.c('Enemy', {
  init: function(){
    this.requires('Character')
        .gravity('Floor')
        .color('rgb(100, 0, 0)')
  }

});
