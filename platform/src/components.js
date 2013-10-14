// The Grid component allows an element to be located
//  on a grid of tiles
Crafty.c('Grid', {
  init: function() {
    this.attr({
      w: Game.map_grid.tile.width,
      h: Game.map_grid.tile.height
    })
  },

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
      this.direction = [0, 0];
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
      this.direction[0] = this.getDirection(who.x - this.x, this);
      this.direction[1] = this.getDirection(who.y - this.y, this);
      if (!this.hit(selector)) {
        this.x += this.direction[0];
        this.y += this.direction[1];
      } 
    });
  },

  getDirection: function(delta, self){
    if(delta > 0)
      return self.direction_right();
    else if(delta < 0)
      return self.direction_left();
    return 0;
  }
});
Crafty.c('Mobile', {
  default_direction: [0, 0],

  mobile: function(speed){
    this.speed = speed;
    return this;
  },

  step_horizontal: function(direction){
    this.x += direction();
    this.direction[0] = direction();
  },

  step_vertical: function(direction){
    this.y += direction();
    this.direction[1] = direction();
  },

  direction_left: function(){
    return -this.speed; 
  },

  direction_right: function(){
    return this.speed; 
  }, 
  
  direction_up: function(){
    return this.speed;
  },

  direction_down: function(){
    return -this.speed;
  },
  
  get_direction: function(){
    var direction = [0, 0];
    var self = this;
    if(self._movement)
     self.step_horizontal(function(){return self._movement.x});
    if(self._up)
      self.step_vertical(self.direction_up);
    else if(self._down)
      self.step_vertical(self.direction_down);
    return direction;
  }


});

Crafty.c('Character', {
  init: function() {
    this.requires('Actor, Gravity, Solid')
        .gravity("Solid")
  },
});

Crafty.c('Enemy', { 
  init: function(){
    this.requires('Actor, Solid, Follower, Mobile')
        .stopOnSolids()
        .color('rgb(100, 0, 0)')
        .mobile(DefaultActions.movement.enemy_speed)
        .follow('Player');
  },


});

Crafty.c('Player', {
  health: 100,
  init: function() {
    this.requires('Twoway, Character, Mobile')
        .twoway(DefaultActions.movement.player_speed, DefaultActions.movement.jump_power)
        .damageOnEnemy()
        .stopOnSolids()
        .mobile(DefaultActions.movement.player_speed)
        .color("rgb(0, 0, 0)")
        .bind('EnterFrame', function(){  
          this.direction = this.get_direction();
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
