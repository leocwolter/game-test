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
    this.requires('Actor, Collision, Gravity, Solid')
        .gravity("Solid")
        // .repelCharacters()
        .stopOnSolids();
    
  },

  repelCharacters: function(){
    this.onHit('Character', function(data){
        var touch = data[0].normal;
        var direction = data[0].normal.x < 0 ? 'w' : 'e';
        direction += touch.y < 0 ? 'n' : '';
        this.move(direction, 100);
    });
    return this;
  },

  stopOnSolids: function(){
    this.bind('Moved', function(from){
      if(this.hit('2D')) {
        this.attr({x: from.x, y: from.y});
      }
    });
    return this;
  }

});

Crafty.c('Enemy', {
  init: function(){
    this.requires('Character')
        .gravity('Floor')
        .color('rgb(100, 0, 0)');
    // setInterval(function(){
    //     Crafty('Enemy').move('w', DefaultActions.movement.speed);
    // }, 50);
  }
});

Crafty.c('Player', {
  
  health: 100,

  init: function() {
    this.requires('Twoway, Character')
        .twoway(DefaultActions.movement.speed, DefaultActions.movement.jump_power)
        .damageOnEnemy()
        .color("rgb(0, 0, 0)")

  },

  damageOnEnemy: function(){
    this.onHit('Enemy', function(){
        this.subtractHealth();
    });
    return this;
  },

  subtractHealth: function(){
    this.health -= 1;
    this.updateHealth();
  },

  updateHealth: function(){
    var health_bar = document.getElementById('health-bar');
    var quantity = this.health+"%";
    health_bar.style.width = quantity;
    health_bar.innerHTML = quantity;
  }
});

