DefaultActions = {
	movement:{
		jump_power: 5,
		speed: 5,
	},
	directions: {
		left: function(){
			return -DefaultActions.movement.speed; 
		},
		right: function(){
			return DefaultActions.movement.speed; 
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
			var direction = [DefaultActions.directions.stopped(), DefaultActions.directions.stopped()];
			if(entity._movement.x) direction[0] = entity._movement.x;
			if(entity._up)
				direction[1] = DefaultActions.directions.up();
			else if(entity._down)
				direction[1] = DefaultActions.directions.down();

			return direction;
		}
	}
}