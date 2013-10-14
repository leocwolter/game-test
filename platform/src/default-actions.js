DefaultActions = {
	movement:{
		jump_power: 5,
		enemy_speed: 2,
		player_speed: 5,
		left: function(){
			return -DefaultActions.movement.enemy_speed; 
		},
		right: function(){
			return DefaultActions.movement.enemy_speed; 
		}, 
		up: function(){
			return DefaultActions.movement.jump_power;
		},
		down: function(){
			return -DefaultActions.movement.jump_power;
		},
		stopped: function(){
			return 0;
		},
		get: function(entity){
			var direction = [DefaultActions.movement.stopped(), DefaultActions.movement.stopped()];
			if(entity._movement.x) direction[0] = entity._movement.x;
			if(entity._up)
				direction[1] = DefaultActions.movement.up();
			else if(entity._down)
				direction[1] = DefaultActions.movement.down();
			return direction;
		}
	},
}