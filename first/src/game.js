Game = {
	// This defines our grid's size and the size of each of its tiles
	map_grid: {
		width:  60,
		height: 30,
		tile: {
		  width:  16,
		  height: 16
		}
	},

	// The total width of the game screen. Since our grid takes up the entire screen
	//  this is just the width of a tile times the width of the grid
	width: function() {
		return this.map_grid.width * this.map_grid.tile.width;
	},

	// The total height of the game screen. Since our grid takes up the entire screen
	//  this is just the height of a tile times the height of the grid
	height: function() {
		return this.map_grid.height * this.map_grid.tile.height;
	},

	// Initialize and start our game
	start: function() {
		// Start crafty and set a background color so that we can see it's working
		Crafty.init(Game.width(), Game.height());
	    Crafty.background('');
		Crafty.scene('Loading');
	}
}

$text_css = { 'font-size': '24px', 'font-family': 'Arial', 'color': 'white', 'text-align': 'center' }
