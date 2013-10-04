GameScene = {
	//occupied: startOccupied(),

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
		GameScene.placeTrees();
		GameScene.placeVillages();
	},

	placeVillages: function(){
		// Generate up to five villages on the map in random locations
		var max_villages = 5;
		for (var x = 0; x < Game.map_grid.width; x++) {
		  for (var y = 0; y < Game.map_grid.height; y++) {
		    if (Math.random() < 0.02) {
		      if (Crafty('Village').length >= max_villages) return;
		      this.place('Village', x, y);
		    }
		  }
		}
	},

	placeTrees: function(){
		// Place a tree at every edge square on our grid of 16x16 tiles
		for (var x = 0; x < Game.map_grid.width; x++) {
		  for (var y = 0; y < Game.map_grid.height; y++) {
		    var at_edge = x == 0 || x == Game.map_grid.width - 1 || y == 0 || y == Game.map_grid.height - 1;
		    if (at_edge) {
				// Place a tree entity at the current tile
				this.place('Tree', x, y);
		    } else if (Math.random() < 0.06) {
		    	this.place('Bush', x, y);
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
	// This defines our grid's size and the size of each of its tiles
	GameScene.startOccupied();
	this.player = GameScene.place('Player', 5, 7);	
	GameScene.placeObjects();

	this.show_victory = this.bind('VillageVisited', function() {
		if (!Crafty('Village').length) {
			Crafty.scene('Victory');
		}
	}, function() {
		this.unbind('VillageVisited', this.show_victory);
	});

});

Crafty.scene('Victory', function() {
	Crafty.e('2D, DOM, Text')
		.attr({ x: 0, y: 0 })
		.text('Victory!');

	this.restart_game = this.bind('KeyDown', function() {
		Crafty.scene('Game');
	});
}, function() {
	console.log(this.restart_game);
	this.unbind('KeyDown', this.restart_game);
});