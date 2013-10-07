GameScene = {
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
		GameScene.placeFloor();
	},

	placeFloor: function(){
		// Place a tree at every edge square on our grid of 16x16 tiles
		for (var x = 0; x < Game.map_grid.width; x++) {
		  for (var y = 0; y < Game.map_grid.height; y++) {
		    var at_floor = y == Game.map_grid.height-10;
		    if (at_floor) {
				this.place('Floor', x, y);
		    }
		  }
		}
	},

	place: function(components, x, y){
		if(!this.occupied[x][y]){
			Crafty.e(components).at(x, y);
			this.occupied[x][y] = true;
		}
	}
};

Crafty.scene('Game', function(){
	GameScene.startOccupied();
	this.player = GameScene.place('Player', 2, 10);	
	GameScene.placeObjects();

});
