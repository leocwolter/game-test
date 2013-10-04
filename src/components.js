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
    this.requires('2D, Canvas, Grid');
  }
});

Crafty.c('Tree', {
  init: function() {
    this.requires('Actor, Solid, SprTree');
  },
});

Crafty.c('Bush', {
  init: function() {
    this.requires('Actor, Solid, SprBush');
  },
});

Crafty.c('Player', {
  init: function() {
    this.requires('Actor, Fourway, Collision, Color')
        .fourway(4)
        .stopOnSolids()
        .color("rgb(0, 0, 0)")
        .onHit('Village', this.visitVillage);

  },

  visitVillage: function(data){
    villlage = data[0].obj;
    villlage.collect();
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
  }
});

Crafty.c('Village', {
  init: function() {
    this.requires('Actor, SprVillage');
  },
 
  collect: function() {
    this.destroy();
    Crafty.trigger('VillageVisited', this);
  }
});