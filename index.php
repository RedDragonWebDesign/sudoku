<!DOCTYPE html>

<html lang="en-us">

<head>
	<title>Sudoku - Red Dragon Web Design</title>
	<link rel="stylesheet" href="sudoku.css" />
	<script src="sudoku.js"></script>
</head>

<body>

<h1>Sudoku</h1>

<p>Generates easy puzzles on demand. Solves puzzles extremely quickly, even puzzles that cause other solvers to time out, by using a combination of iteration and recursion. Impossible to type an incorrect number.</p>

<p>
	<button id="new" class="done" title="Generate a random, very easy sudoku.">New</button>
	<button id="hint" class="done" title="Check for very easy unsolved squares. Highlight them green. If no very easy squares exist, will not highlight anything.">Hint</button>
	<button id="validate" class="done" title="Solve the puzzle using a recursive algorithm. Will work on any sudoku regardless of difficulty. Will detect broken puzzles.">Solve</button>
	<button id="import" class="done" title="Import a sudoku. Must enter an 81 digit string. You can represent blank squares with 0 . _ *">Import</button>
	<button id="restart" class="done" title="Clear user-entered solutions. Reset the puzzle to its original import state.">Restart</button>
	<button id="propagate">Propagate</button>
	<!--<button id="solve" class="done">Solve Logically</button>-->
	<span id="algorithm">
		<span></span> ms
	</span>
</p>

<p>
	<select id="puzzle-picker">
		<option value="000000000000000000000000000000000000000000000000000000000000000000000000000000000">[Blank Board]</option>
		<option value="custom">[Custom Puzzle]</option>
		<option value="100000000000000000000000000000000000000000000000000000000000000000000000000000000">Testing - Propagate</option>
		<option value="123056789467000000580000000600000000700000000800000000000000000200000000300000000">Testing - Process Of Elimination</option>
		<option value="080165427145372968726984135871296354964531782532847691213759846497628513658413279">Testing - Solution Count 1</option>
		<option value="380160407140370968726980135870296354964501782532847601213059846497028513658403279">Testing - Solution Count 2</option>
		<option value="1....7....3..2...8..96..5....53..9...1..8...26....4...3......1..41.....7..7...3..">Testing - 20 Solutions</option>
		<option value="1.........3..2...8..96..5....53..9...1..8...26....4...3......1..41.....7..7...3..">Testing - 500+ Solutions</option>
		<!-- don't use https://www.sudokuweb.org/, their generator makes unsolveable puzzles -->
		<!-- from https://www.sudokuwiki.org/ -->
		<option value="080100007000070960026900130000290304960000082502047000013009840097020000600003070">Beginner</option>
		<option value="240070038000006070300040600008020700100000006007030400004080009860400000910060002">Intermediate - Last Number In Row, Col, & Box</option>
		<option value="246070038000306074370040600008020700100000006007030400004080069860400007910060042">Intermediate - Naked Single</option>
		<option value="000004028406000005100030600000301000087000140000709000002010003900000507670400000">Intermediate - Hidden Singles</option>
		<option value="400000038002004100005300240070609004020000070600703090057008300003900400240000009">Intermediate - Naked Pairs/Triples</option>
		<option value="000000000904607000076804100309701080008000300050308702007502610000403208000000000">Intermediate - Hidden Pairs/Triples</option>
		<option value="000030086000020000000008500371000094900000005400007600200700800030005000700004030">Intermediate - Naked/Hidden Quads</option>
		<option value="010903600000080000900000507002010430000402000064070200701000005000030000005601020">Intermediate - Pointing Pairs</option>
		<option value="016007803000800000070001060048000300600000002009000650060900020000002000904600510">Intermediate - Box/Line Reduction</option>
		<option value="100000569402000008050009040000640801000010000208035000040500010900000402621000005">Advanced - X-Wing</option>
		<option value="007003600039000800020010050040100300000367000003008060090070020004000130008600900">Advanced - Simple Coloring</option>
		<option value="900040000000600031020000090000700020002935600070002000060000073510009000000080009">Advanced - Y-Wing</option>
		<option value="500010003006003002003200000002300076000050000190007500000009400200800600900040005">Advanced - Swordfish</option>
		<option value="090001700500200008000030200070004960200060005069700030008090000700003009003800040">Advanced - XYZ Wing</option>
		<!-- from https://github.com/attractivechaos/plb/blob/master/sudoku/sudoku.txt -->
		<option value="..............3.85..1.2.......5.7.....4...1...9.......5......73..2.1........4...9">Insane Puzzle #1 - 25s (Hidden Singles)</option>
		<option value=".......12........3..23..4....18....5.6..7.8.......9.....85.....9...4.5..47...6...">Insane Puzzle #2 - 2s</option>
		<option value=".2..5.7..4..1....68....3...2....8..3.4..2.5.....6...1...2.9.....9......57.4...9..">Insane Puzzle #3 - 0.2s</option>
		<option value="........3..1..56...9..4..7......9.5.7.......8.5.4.2....8..2..9...35..1..6........">Insane Puzzle #4 - 7s (1 Hidden Single, Then Exocet)</option>
		<option value="12.3....435....1....4........54..2..6...7.........8.9...31..5.......9.7.....6...8">Insane Puzzle #5 - 2s</option>
		<option value="1.......2.9.4...5...6...7...5.9.3.......7.......85..4.7.....6...3...9.8...2.....1">Insane Puzzle #6 - 2s</option>
		<option value=".......39.....1..5..3.5.8....8.9...6.7...2...1..4.......9.8..5..2....6..4..7.....">Insane Puzzle #7 - 1s</option>
		<option value="12.3.....4.....3....3.5......42..5......8...9.6...5.7...15..2......9..6......7..8">Insane Puzzle #8 - 9s (Exocet)</option>
		<option value="..3..6.8....1..2......7...4..9..8.6..3..4...1.7.2.....3....5.....5...6..98.....5.">Insane Puzzle #9 - 0.3s</option>
		<option value="1.......9..67...2..8....4......75.3...5..2....6.3......9....8..6...4...1..25...6.">Insane Puzzle #10 - 2s</option>
		<option value="..9...4...7.3...2.8...6...71..8....6....1..7.....56...3....5..1.4.....9...2...7..">Insane Puzzle #11 - 2s</option>
		<option value="....9..5..1.....3...23..7....45...7.8.....2.......64...9..1.....8..6......54....7">Insane Puzzle #12 - 7s</option>
		<option value="4...3.......6..8..........1....5..9..8....6...7.2........1.27..5.3....4.9........">Insane Puzzle #13 - 33s (1 Hidden Single, then Bowman's Bingo)</option>
		<option value="7.8...3.....2.1...5.........4.....263...8.......1...9..9.6....4....7.5...........">Insane Puzzle #14 - 4s</option>
		<option value="3.7.4...........918........4.....7.....16.......25..........38..9....5...2.6.....">Insane Puzzle #15 - 1s</option>
		<option value="........8..3...4...9..2..6.....79.......612...6.5.2.7...8...5...1.....2.4.5.....3">Insane Puzzle #16 - 7s (1 Hidden Single, then stuck)</option>
		<option value=".......1.4.........2...........5.4.7..8...3....1.9....3..4..2...5.1........8.6...">Insane Puzzle #17 - 0.2s</option>
		<option value=".......12....35......6...7.7.....3.....4..8..1...........12.....8.....4..5....6..">Insane Puzzle #18 - 20s (Hidden Singles)</option>
		<option value="1.......2.9.4...5...6...7...5.3.4.......6........58.4...2...6...3...9.8.7.......1">Insane Puzzle #19 - 4s</option>
		<option value=".....1.2.3...4.5.....6....7..2.....1.8..9..3.4.....8..5....2....9..3.4....67.....">Insane Puzzle #20 - 0.6s</option>
		<option value="800000000003600000070090200050007000000045700000100030001000068008500010090000400">Insane Puzzle #21 - 5s</option>
		<option value="......6.5...3...9..8...4..1.4..2.97...........31.8..6.9..6...2..1...7...5.4......">Riddle of Sho - 0.2s</option>
		<option value="1....7.9..3..2...8..96..5....53..9...1..8...26....4...3......1..41.....7..7...3..">Escargot - 0.1s</option>
		<option value=".....1..2..3....4..5..6.7.....8...7...7..38..9...5...1..6.8.2...4.6....72....9.6.">Shining Mirror - 0.9s</option>
		<option value="8..........36......7..9.2...5...7.......457.....1...3...1....68..85...1..9....4..">Arto Inkala - 5s</option>
		<option value="000000001000000023004005000000100000000030600007000580000067000010004000520000000">Only 17 Numbers - 8s</option>
	</select>
</p>
		
<table id="sudoku">
	<tbody>
		<tr>
			<td><input type="text" maxlength="1" /></td>
			<td><input type="text" maxlength="1" /></td>
			<td class="thick-right"><input type="text" maxlength="1" /></td>
			<td><input type="text" maxlength="1" /></td>
			<td><input type="text" maxlength="1" /></td>
			<td class="thick-right"><input type="text" maxlength="1" /></td>
			<td><input type="text" maxlength="1" /></td>
			<td><input type="text" maxlength="1" /></td>
			<td><input type="text" maxlength="1" /></td>
		</tr>
		<tr>
			<td><input type="text" maxlength="1" /></td>
			<td><input type="text" maxlength="1" /></td>
			<td class="thick-right"><input type="text" maxlength="1" /></td>
			<td><input type="text" maxlength="1" /></td>
			<td><input type="text" maxlength="1" /></td>
			<td class="thick-right"><input type="text" maxlength="1" /></td>
			<td><input type="text" maxlength="1" /></td>
			<td><input type="text" maxlength="1" /></td>
			<td><input type="text" maxlength="1" /></td>
		</tr>
		<tr class="thick-bottom">
			<td><input type="text" maxlength="1" /></td>
			<td><input type="text" maxlength="1" /></td>
			<td class="thick-right"><input type="text" maxlength="1" /></td>
			<td><input type="text" maxlength="1" /></td>
			<td><input type="text" maxlength="1" /></td>
			<td class="thick-right"><input type="text" maxlength="1" /></td>
			<td><input type="text" maxlength="1" /></td>
			<td><input type="text" maxlength="1" /></td>
			<td><input type="text" maxlength="1" /></td>
		</tr>
		<tr>
			<td><input type="text" maxlength="1" /></td>
			<td><input type="text" maxlength="1" /></td>
			<td class="thick-right"><input type="text" maxlength="1" /></td>
			<td><input type="text" maxlength="1" /></td>
			<td><input type="text" maxlength="1" /></td>
			<td class="thick-right"><input type="text" maxlength="1" /></td>
			<td><input type="text" maxlength="1" /></td>
			<td><input type="text" maxlength="1" /></td>
			<td><input type="text" maxlength="1" /></td>
		</tr>
		<tr>
			<td><input type="text" maxlength="1" /></td>
			<td><input type="text" maxlength="1" /></td>
			<td class="thick-right"><input type="text" maxlength="1" /></td>
			<td><input type="text" maxlength="1" /></td>
			<td><input type="text" maxlength="1" /></td>
			<td class="thick-right"><input type="text" maxlength="1" /></td>
			<td><input type="text" maxlength="1" /></td>
			<td><input type="text" maxlength="1" /></td>
			<td><input type="text" maxlength="1" /></td>
		</tr>
		<tr class="thick-bottom">
			<td><input type="text" maxlength="1" /></td>
			<td><input type="text" maxlength="1" /></td>
			<td class="thick-right"><input type="text" maxlength="1" /></td>
			<td><input type="text" maxlength="1" /></td>
			<td><input type="text" maxlength="1" /></td>
			<td class="thick-right"><input type="text" maxlength="1" /></td>
			<td><input type="text" maxlength="1" /></td>
			<td><input type="text" maxlength="1" /></td>
			<td><input type="text" maxlength="1" /></td>
		</tr>
		<tr>
			<td><input type="text" maxlength="1" /></td>
			<td><input type="text" maxlength="1" /></td>
			<td class="thick-right"><input type="text" maxlength="1" /></td>
			<td><input type="text" maxlength="1" /></td>
			<td><input type="text" maxlength="1" /></td>
			<td class="thick-right"><input type="text" maxlength="1" /></td>
			<td><input type="text" maxlength="1" /></td>
			<td><input type="text" maxlength="1" /></td>
			<td><input type="text" maxlength="1" /></td>
		</tr>
		<tr>
			<td><input type="text" maxlength="1" /></td>
			<td><input type="text" maxlength="1" /></td>
			<td class="thick-right"><input type="text" maxlength="1" /></td>
			<td><input type="text" maxlength="1" /></td>
			<td><input type="text" maxlength="1" /></td>
			<td class="thick-right"><input type="text" maxlength="1" /></td>
			<td><input type="text" maxlength="1" /></td>
			<td><input type="text" maxlength="1" /></td>
			<td><input type="text" maxlength="1" /></td>
		</tr>
		<tr>
			<td><input type="text" maxlength="1" /></td>
			<td><input type="text" maxlength="1" /></td>
			<td class="thick-right"><input type="text" maxlength="1" /></td>
			<td><input type="text" maxlength="1" /></td>
			<td><input type="text" maxlength="1" /></td>
			<td class="thick-right"><input type="text" maxlength="1" /></td>
			<td><input type="text" maxlength="1" /></td>
			<td><input type="text" maxlength="1" /></td>
			<td><input type="text" maxlength="1" /></td>
		</tr>
	</tbody>
</table>

<p>
	<input id="string-box" type="text" />
</p>

<p>
	See the logical solving steps using the <a id="sudoku-wiki-link">Sudoku Wiki Solver</a>
</p>

<p>
	Want to report a bug or request a feature? <a href="https://github.com/RedDragonWebDesign/Sudoku/issues">Create an issue</a> on our GitHub.
</p>

<p id="console">
	<textarea></textarea>
</p>

</body>

</html>