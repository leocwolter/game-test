GameScene = {
	go: function(){
		GameScene.init();
		Crafty.scene('Game');
	},

	init: function(){
		GameScene.startOccupied();
		GameScene.placeObjects();
		Crafty.background('rgb(100, 160, 20)');
		Crafty.scene('Game', GameScene.init);
		
	},

	floor: function(){
		return {
			y: Game.map_grid.height-10
		}
	},

	startOccupied: function(){
		this.occupied = new Array(Game.map_grid.width);
		for (var i = 0; i < Game.map_grid.width; i++) {
			this.occupied[i] = new Array(Game.map_grid.height);
			for (var y = 0; y < Game.map_grid.height; y++) {
				this.occupied[i][y] = false;
			}
		}	
	},

	placeObjects: function(){
		GameScene.placeBoundaries();
		GameScene.placeFloor();
		GameScene.place('Player', 2, 10);
		GameScene.placeEnemies();
	},

	placeBoundaries: function(){
		GameScene.walkIntoMapAndPlace(function(x, y){
			var at_boundaries = (y == 0 || x == 0 || y == Game.map_grid.height-1 || x == Game.map_grid.width-1);
			if(at_boundaries){
				GameScene.place('Boundary', x, y);
			}
		});
	},

	placeFloor: function(){
		GameScene.walkIntoMapAndPlace(function(x, y){
			var at_floor = y == GameScene.floor().y;
		    if (at_floor) {
				GameScene.place('Floor', x, y);
		    }
		});
	},

	placeEnemies: function(){
		var max = 5;
		GameScene.walkIntoMapAndPlace(function(x, y){
			var should_place_new_enemy = (x > Game.map_grid.width-20 && Crafty('Enemy').length < max && y < GameScene.floor().y)
			if(should_place_new_enemy) GameScene.place('Enemy', x, y);
		});
	},

	place: function(components, x, y){
		if(!this.occupied[x][y]){
			Crafty.e(components).at(x, y);
			this.occupied[x][y] = true;
		}
	},

	walkIntoMapAndPlace: function(placeWhen){
		for (var x = 0; x < Game.map_grid.width; x++) {
			for (var y = 0; y < Game.map_grid.height; y++) {
				placeWhen(x, y);
			}
		}
	}

};
