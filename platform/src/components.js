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

Crafty.c('Solid', {
  init: function(){
    this.requires('Collision')
        .collision();
  }

});

Crafty.c('Actor', {
  init: function(){
    this.requires('2D, Canvas, Grid, Color');
  },

  stopOnSolids: function(){
    if(!this.direction) this.setDefaultDirection();
    this.onHit('Solid', function(hitdata){
      this._speed = 0;
      this.attr({x: this.x - this.direction[0] , y: this.y - this.direction[1]});
      this.direction = [DefaultActions.movement.stopped(), DefaultActions.movement.stopped()];
    }, function(){
      this.direction = this.default_direction;
    });
    return this;
  },

  setDefaultDirection: function(){
    this.direction = this.default_direction;
    return this;
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

Crafty.c('Follower', {
  follow: function(selector){
    this.bind('EnterFrame', function(){
      var who = Crafty(selector);
      this.direction[0] = this.getDirection(who.x - this.x);
      this.direction[1] = this.getDirection(who.y - this.y);
      if (!this.hit(selector)) {
        this.x += this.direction[0];
        this.y += this.direction[1];
      } 
    });
  },

  getDirection: function(delta){
    if(delta > 0)
      return DefaultActions.movement.right();
    else if(delta < 0)
      return DefaultActions.movement.left();
    return 0;
  }
});

Crafty.c('Character', {
  init: function() {
    this.requires('Actor, Gravity, Solid')
        .gravity("Solid")
  },

});

Crafty.c('Enemy', {
  default_direction: [DefaultActions.movement.left(), DefaultActions.movement.stopped()], 
  init: function(){
    this.requires('Actor, Solid, Follower')
        .stopOnSolids()
        .color('rgb(100, 0, 0)')
        .follow('Player');
  },


});

Crafty.c('Player', {
  health: 100,
  default_direction: [DefaultActions.movement.stopped(), DefaultActions.movement.stopped()],

  init: function() {
    this.requires('Twoway, Character')
        .twoway(DefaultActions.movement.player_speed, DefaultActions.movement.jump_power)
        .damageOnEnemy()
        .stopOnSolids()
        .color("rgb(0, 0, 0)")
        .bind('EnterFrame', function(){  
          this.direction = DefaultActions.movement.get(this);
        });
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
