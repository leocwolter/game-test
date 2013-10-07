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
		GameScene.place('Player', 2, 10);
		GameScene.placeFloor();
		GameScene.placeBoundaries();
	},

	placeBoundaries: function(){
		GameScene.walkIntoMapAndPlace(function(x, y){
			var at_boundaries = (y == 0 || x == 0 || y == Game.map_grid.height-1 || x == Game.map_grid.width-1);
			if(at_boundaries){
				GameScene.place('Floor', x, y);
			}
		});
	},

	placeFloor: function(){
		// Place a tree at every edge square on our grid of 16x16 tiles
		GameScene.walkIntoMapAndPlace(function(x, y){
			var at_floor = y == Game.map_grid.height-10;
		    if (at_floor) {
				GameScene.place('Floor', x, y);
		    }
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
