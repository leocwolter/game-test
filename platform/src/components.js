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
      var xDirection = who.x - this.x > 0 ? 1 : -1;
      var yDirection = who.y - this.y > 0 ? 1 : -1;
      if (!this.hit(selector)) {
        this.x += DefaultActions.movement.speed * xDirection;
        // this.y += DefaultActions.movement.speed * yDirection;
      } 
    });
  }
});

Crafty.c('Character', {
  init: function() {
    this.requires('Actor, Gravity, Solid, Collision')
        .gravity("Solid")
        .collision();
        // .repelCharacters();
  },

  setDefaultDirection: function(){
    this.direction = this.default_direction;
    return this;
  },

  stopOnSolids: function(){
    if(!this.direction) this.setDefaultDirection();
    this.onHit('Solid', function(hitdata){
      this._speed = 0;
      this.attr({x: this.x - this.direction[0] , y: this.y - this.direction[1]});
      this.direction = [DefaultActions.directions.stopped(), DefaultActions.directions.stopped()];
    }, function(){
      this.direction = this.default_direction;
    });
    return this;
  },

  repelCharacters: function(){
    this.onHit('Character', function(data){
        var touch = data[0].normal;
        var direction = data[0].normal.x < 0 ? 'w' : 'e';
        direction += touch.y < 0 ? 'n' : '';
        this.move(direction, 100);
    });
    return this;
  }

});

Crafty.c('Enemy', {
  default_direction: [DefaultActions.directions.left(), DefaultActions.directions.stopped()], 

  init: function(){
    this.requires('Character, Follower')
        .stopOnSolids()
        .color('rgb(100, 0, 0)')
        .follow('Player');
  },


});

Crafty.c('Player', {
  health: 100,
  default_direction: [DefaultActions.directions.stopped(), DefaultActions.directions.stopped()],

  init: function() {
    this.requires('Twoway, Character')
        .twoway(DefaultActions.movement.speed, DefaultActions.movement.jump_power)
        .damageOnEnemy()
        .stopOnSolids()
        .color("rgb(0, 0, 0)")
        .bind('EnterFrame', function(){  
          this.direction = DefaultActions.directions.get(this);
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
