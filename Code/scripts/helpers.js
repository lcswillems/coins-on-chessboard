/*
 * Converts a number written with digits to a number written with letters.
 * For exemple, '27' is converted to '"AA"'.
 */
function digits2letters(digits) {
	var alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
	var letters = ''

	while (digits > 0) {
		letters = alphabet[(digits-1) % 26] + letters
		digits = parseInt((digits-1) / 26)
	}

	return letters
}

/*
 * Converts a tuple position to a chess position.
 * For example, '[2, 1]' is converted to '"A2"'.
 */
function tpos2cpos(cpos) {
	return digits2letters(cpos[1]) + cpos[0].toString()
}

/*
 * Converts a number written with letters to a number written with digits.
 * For exemple, '"AA"' is converted to '27'.
 */
function letters2digits(letters) {
	var alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
	var digits = 0

	while (letters.length) {
		flt = letters.slice(0, 1)
		digits = digits*26 + (alphabet.indexOf(flt) + 1)

		letters = letters.slice(1)
	}

	return digits
}

/*
 * Converts a chess position to a tuple position.
 * For example, '"A2"' is converted to '[2, 1]'.
 */
function cpos2tpos(tpos) {
	splitedTpos = /([A-Z]+)([0-9]+)/g.exec(tpos)
	return [parseInt(splitedTpos[2]), letters2digits(splitedTpos[1])]
}

/*
 * Returns the largest line and column numbers in a list of tposs.
 */
function maxTpos(tposss) {
	maxI = 0
	maxJ = 0
	for (let tposs of tposss) {
		maxI = Math.max(maxI, tposs[0][0])
		maxJ = Math.max(maxJ, tposs[0][1])
	}
	return [maxI, maxJ]
}

/*
 * Compares 2 tuple positions and returns true iff both positions are equal.
 */
function compareTpos(tpos1, tpos2) {
	return tpos1[0] == tpos2[0] && tpos1[1] == tpos2[1]
}