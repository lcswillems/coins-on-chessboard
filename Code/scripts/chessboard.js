class Chessboard {
    get mode() {
        return this._mode
    }

    set mode(mode) {
        if (mode == this._mode) {
            return
        }

        this._mode = mode

        if (mode == "playing") {
            if (this._jails !== undefined) {
                this._initialJails = this._jails.slice()
            }
            if (this._coins !== undefined) {
                this._initialCoins = this._coins.slice()
            }
        }
        else if (mode == "editing") {
            if (this._initialJails !== undefined) {
                this._jails = this._initialJails.slice()
            }
            if (this._initialCoins !== undefined) {
                this._coins = this._initialCoins.slice()
            }
            this._strokes = []
        }
    }

    get game() {
        if (this.mode == "playing") {
            var _jails = this._initialJails
            var _coins = this._initialCoins
        }
        else if (this.mode == "editing") {
            var _jails = this._jails
            var _coins = this._coins
        }

        var jails = []
        for (let jail of _jails) {
            jails.push(tpos2cpos(jail[0]))
        }

        var coins = []
        for (let coin of _coins) {
            coins.push(tpos2cpos(coin[0])+coin[1])
        }

        var strokes = []
        for (let stroke of this._strokes) {
            strokes.push(tpos2cpos(stroke[0]))
        }

        return jails.join(",") + "|" + coins.join(",") + "|" + strokes.join(",")
    }

    set game(game) {
        this.mode = "editing"

        var splitedGame = game.split("|")

        /*
         * A list of tuples of the form '[tpos]' where
         *   - 'tpos' is a tuple containing the line and column numbers
         */
        this._jails = []
        for (let jail of splitedGame[0].split(",")) {
            if (jail == "") {
                continue
            }
            cpos = jail
            this._addJailIfPossible(cpos2tpos(cpos))
        }
        this._initialJails = this._jails.slice()

        /*
         * A list of tuples of the form '[tpos, face]' where
         *   - 'tpos' is a tuple containing the line and column numbers
         *   - 'face' is either "c", "h" or "t"
         */
        this._coins = []
        for (let coin of splitedGame[1].split(",")) {
            if (coin == "") {
                continue
            }
            var cpos = coin.substring(0, coin.length-1)
            var additional = coin.substring(coin.length-1)
            this._addCoinIfPossible(cpos2tpos(cpos), additional)
        }
        this._initialCoins = this._coins.slice()
        
        /*
         * A list of tuples of the form '[tpos]' where
         *   - 'tpos' is a tuple containing the line and column numbers
         */
        this._strokes = []
        for (let stroke of splitedGame[2].split(",")) {
            if (stroke == "") {
                continue
            }
            this.mode = "playing"
            var cpos = stroke
            this.play(cpos2tpos(cpos))
        }
    }

    _hasJail(tpos) {
        for (var i  = 0; i < this._jails.length; i++) {
            if (compareTpos(this._jails[i][0], tpos)) {
                return true
            }
        }
        return false
    }

    _addJailIfPossible(tpos) {
        if (!this._hasJail(tpos)) {
            this._jails.push([tpos])
        }
    }

    addJailIfPossible(tpos) {
        if (this.mode == "editing") {
            return this._addJailIfPossible(tpos)
        }
    }

    _removeJail(tpos) {
        for (var i  = 0; i < this._jails.length; i++) {
            if (compareTpos(this._jails[i][0], tpos)) {
                return this._jails.splice(i, 1)[0]
            }
        }
    }

    removeJail(tpos) {
        if (this.mode == "editing") {
            return this._removeJail(tpos)
        }
    }

    _hasCoin(tpos) {
        for (var i  = 0; i < this._coins.length; i++) {
            if (compareTpos(this._coins[i][0], tpos)) {
                return true
            }
        }
        return false
    }

    _addCoinIfPossible(tpos, additional) {
        var isPossible = !this._hasCoin(tpos)
        if (isPossible) {
            this._coins.push([tpos, additional])
        }
        return isPossible
    }

    addCoinIfPossible(tpos, additional) {
        if (this.mode == "editing") {
            return this._addCoinIfPossible(tpos, additional)
        }
    }

    _addCoinsIfAllPossible(tposs, additional) {
        var arePossible = true
        for (let tpos of tposs) {
            arePossible &= !this._hasCoin(tpos)
        }
        if (arePossible) {
            for (let tpos of tposs) {
                this._addCoinIfPossible(tpos, additional)
            }
        }
        return arePossible
    }

    _removeCoin(tpos) {
        for (var i  = 0; i < this._coins.length; i++) {
            if (compareTpos(this._coins[i][0], tpos)) {
                return this._coins.splice(i, 1)[0]
            }
        }
    }

    removeCoin(tpos) {
        if (this.mode == "editing") {
            return this._removeCoin(tpos)
        }
    }

    _removeCoins(tposs) {
        for (let tpos of tposs) {
            this._removeCoin(tpos)
        }
    }

    /*
     * 'additional' is only useful to unplay.
     */
    _addStroke(tpos, additional) {
        this._strokes.push([tpos, additional])
    }

    _removeLastStroke() {
        return this._strokes.pop()
    }

    _play(tpos) {
        var item = this._removeCoin(tpos)
        if (item !== undefined) {
            var validAction = false
            var additional = item[1]
            if (additional == "c") {
                validAction = this._addCoinsIfAllPossible([
                    [tpos[0], tpos[1]+1],
                    [tpos[0]+1, tpos[1]]
                ], "c")
            }
            else if (additional == "h") {
                validAction = this._addCoinsIfAllPossible([
                    [tpos[0], tpos[1]+1],
                    [tpos[0]+1, tpos[1]],
                    [tpos[0]+1, tpos[1]+1]
                ], "t")
            }
            else if (additional == "t") {
                validAction = this._addCoinsIfAllPossible([
                    [tpos[0]+1, tpos[1]+2],
                    [tpos[0]+2, tpos[1]+1]
                ], "h") 
            }
            if (validAction) {
                this._addStroke(tpos, additional)
            } else {
                this._addCoinIfPossible(tpos, additional)
            }
        }
    }

    play(tpos) {
        if (this.mode == "playing") {
            return this._play(tpos)
        }
    }

    _unplay() {
        var item = this._removeLastStroke()
        if (item !== undefined) {
            var tpos = item[0]
            var additional = item[1]
            this._addCoinIfPossible(tpos, additional)
            if (additional == "c") {
                this._removeCoins([
                    [tpos[0], tpos[1]+1],
                    [tpos[0]+1, tpos[1]]
                ])
            }
            else if (additional == "h") {
                this._removeCoins([
                    [tpos[0], tpos[1]+1],
                    [tpos[0]+1, tpos[1]],
                    [tpos[0]+1, tpos[1]+1]
                ])
            }
            else if (additional == "t") {
                this._removeCoins([
                    [tpos[0]+1, tpos[1]+2],
                    [tpos[0]+2, tpos[1]+1]
                ]) 
            }
        }
    }

    unplay() {
        if (this.mode == "playing") {
            return this._unplay()
        }
    }

    toHtml() {
        this._jails.sort()
        this._coins.sort()

        var [maxI, maxJ] = maxTpos(this._jails.concat(this._coins))
        var padding = 5
        var minSize = 10
        maxI = Math.max(maxI+padding, minSize)
        maxJ = Math.max(maxJ+padding, minSize)

        var html = '<table oncontextmenu="return false">'

        html += '<tr><td class="border"></td>'
		for (var j = 0; j < maxJ; j++) {
			html += '<td class="border">' + digits2letters(j+1) + '</td>'
		}
        html += '</tr>'

		for (var i = 0; i < maxI; i++) {
			html += '<tr><td class="border">' + (i+1) + '</td>'

			for (var j = 0; j < maxJ; j++) {
				html += '<td></td>'
			}

			html += '</tr>'
        }
        
        html += '</table>'

        var $el = $(html)

        for (let jail of this._jails) {
            var cpos = jail[0]
            $el.find("tr").eq(cpos[0]).find("td").eq(cpos[1]).addClass("jail")
        }

        for (let coin of this._coins) {
            var cpos = coin[0]
            var additional = coin[1]
            $el.find("tr").eq(cpos[0]).find("td").eq(cpos[1]).text(additional)
        }

        return $el[0].outerHTML
    }
}