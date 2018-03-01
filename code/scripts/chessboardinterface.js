class ChessboardInterface {
    constructor() {
		this.chessboard = new Chessboard()

		this.$chessboard = $('#chessboard')
		var $hoveredTdTpos

		var self = this

		$('#game').submit(function(e){
			e.preventDefault()
			self.chessboard.game = $(this).find('input').val()
			if (self.chessboard.mode == "playing") {
				self.play()
			}
			else if (self.chessboard.mode == "editing") {
				self.edit()
			}
			self.display()
		})

		this.$chessboard.on('mousedown', 'td:not(.border)', function(e) {
			var i = $(this).closest('tr').index(), j = $(this).index()
			var tpos = [i, j]

			if (e.which == 1) {
		    	if (self.chessboard.mode == "playing") {
					self.chessboard.play(tpos)
				}
				else if (self.chessboard.mode == "editing") {
					if (self.chessboard.removeJail(tpos) === undefined) {
						self.chessboard.addJailIfPossible(tpos)
					}
				}
			}

			self.display()
		})
		this.$chessboard.on('mouseenter', 'td:not(.border)', function(e) {
			if (self.chessboard.mode == "editing") {
				var i = $(this).closest('tr').index(), j = $(this).index()
				var tpos = [i, j]
				$hoveredTdTpos = tpos
			}
		})
		this.$chessboard.on('mouseleave', 'td:not(.border)', function(e) {
			if (self.chessboard.mode == "editing") {
				$hoveredTdTpos = undefined
			}
		})
		$(document).keydown(function(e) {
			if ($hoveredTdTpos !== undefined) {
				var letter

				if (e.which == 67) {
					letter = "c"
				}
				else if (e.which == 72) {
					letter = "h"
				}
				else if (e.which == 84) {
					letter = "t"
				}

				if (letter !== undefined) {
					var item = self.chessboard.removeCoin($hoveredTdTpos)
					if (item === undefined || item[1] != letter) {
						self.chessboard.addCoinIfPossible($hoveredTdTpos, letter)
					}
				}

				self.display()
			}
		})
		this.$chessboard.mousedown(function(e){
			if (e.which == 3) {
				self.chessboard.unplay()
				self.display()
			}
		})
			
		$('#play').click(function(){
			self.play()
		})

		$('#edit').click(function(){
			self.edit()
		})

		$('#game input').val(this.loadGame())
		$('#game').submit()

		this.display()
	}

	play() {
		$('#play').addClass("selected")
		$('#edit').removeClass("selected")
		this.chessboard.mode = "playing"
		this.display()
	}
	
	edit() {
		$('#play').removeClass("selected")
		$('#edit').addClass("selected")
		this.chessboard.mode = "editing"
		this.display()
	}

	display() {
		var game = this.chessboard.game
		this.saveGame(game)
		$('#game input').val(game)
		$('#chessboard').html(this.chessboard.toHtml())
	}

	loadGame() {
		if (localStorage.getItem("chessboard-game") === null) {
			return "||"
		} else {
			return localStorage.getItem('chessboard-game')
		}
	}

	saveGame(game) {
		localStorage.setItem("chessboard-game", game)
	}
}