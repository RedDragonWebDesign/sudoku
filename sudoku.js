// Copyright https://www.RedDragonWebDesign.com/
// Permission required to use or copy code. All rights reserved.

`use strict`;

class SudokuBoard {
	constructor() {
		this.blankBoard = SudokuBoard.getBlankBoard();
		this.board = SudokuBoard.getBlankBoard();
		this.originalBoard = SudokuBoard.getBlankBoard();
	}
	
	static getBlankBoard() {
		return [
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0]
		];
	}
	
	// This is only meant for use by solveRecursively. Faster than parseString
	// Everything else should use parseString. parseString performs more data validation.
	setBoard(board) {
		this.board = board;
	}
	
	static cloneBoard(board) {
		let array = SudokuBoard.getBlankBoard();
		for ( let i = 0; i < 9; i++ ) {
			for ( let j = 0; j < 9; j++ ) {
				array[i][j] = board[i][j];
			}
		}
		return array;
		
		// return Helper.deepCopyArray(board);
	}
	
	// returns if board changed or not
	parseString(boardString, setOriginalBoard = true) {
		const oldBoard = SudokuBoard.cloneBoard(this.board);
		
        if ( ! boardString ) {
            return false;
        }

		if ( ! boardString.match(/^[0-9*_.]{81}$/m) ) {
			return false;
		}
        
        // TODO: foreach getBoardSquares
		for ( let row = 0; row < 9; row++ ) {
			for ( let column = 0; column < 9; column++ ) {
				let char = boardString.charAt(row*9+column);
				if ( char === `*` || char === `_` || char === `.` )
				{
					char = 0;
				}
				this.board[row][column] = parseInt(char);
			}
		}
		
		if ( ! this.puzzleIsValid() ) {
			this.board = SudokuBoard.cloneBoard(oldBoard);
			return false;
		}
		
		if ( setOriginalBoard ) {
			this.setOriginalBoard(this.board);
		}
		
		return true;
	}
	
	getBoard() {
		return this.board;
	}
	
	getString() {
		let str = ``;
		for ( let row = 0; row < 9; row++ ) {
			for ( let col = 0; col < 9; col++ ) {
				str += this.board[row][col];
			}
		}
		return str;
	}
	
	// making this its own method to help with debugging
	setOriginalBoard(obj) {
		this.originalBoard = SudokuBoard.cloneBoard(obj);
	}
	
	restartPuzzle() {
		this.board = SudokuBoard.cloneBoard(this.originalBoard);
	}
	
	makeMove(row, col, value) {
		if ( value === `` ) {
			value = 0;
		}
		this.board[row][col] = parseInt(value);
	}
	
	numberInBox(candidate, square) {
		const row = square.getRow();
		const col = square.getCol();
		
		// find top left corner of box
		const rowOffset = Math.floor(row/3)*3;
		const colOffset = Math.floor(col/3)*3;
		
		// iterate around 3x3 area
		for ( let i = 0 + rowOffset; i <= 2 + rowOffset; i++ ) {
			for ( let j = 0 + colOffset; j <= 2 + colOffset; j++ ) {
				const value = this.board[i][j];
				if ( value === candidate ) {
					return true;
				}
			}
		}
		
		return false;
	}
	
	getSquaresInRow(row) {
		let squares = [];
		for ( let i = 0; i < 9; i++ ) {
			const value = this.board[row][i];
			squares.push(new SudokuSquare(row, i, value));
		}
		return squares;
	}
	
	getSquaresInColumn(col) {
		let squares = [];
		for ( let i = 0; i < 9; i++ ) {
			const value = this.board[i][col];
			squares.push(new SudokuSquare(i, col, value));
		}
		return squares;
	}
	
	getAllSquares() {
		let squares = [];
		for ( let i = 0; i < 9; i++ ) {
			for ( let j = 0; j < 9; j++ ) {
				const value = this.board[i][j];
				squares.push(new SudokuSquare(i, j, value));
			}
		}
		return squares;
	}
	
	getSquare(row, col) {
		return new SudokuSquare(row, col, this.board[row][col]);
	}
	
	getAllBoxes() {
		let squares = [];
		for ( let i = 0; i <= 2; i++ ) {
			for ( let j = 0; j <= 2; j++ ) {
				const value = this.board[i*3][j*3];
				squares.push(new SudokuSquare(i*3, j*3, value));
			}
		}
		return squares;
	}
	
	
	
	
	
	
	
	
	
	
	// TODO: consider splitting the below code into a SudokuSolver class
	// I haven't done it yet because I'd have to pass a board variable around. That's a lot of code re-writing. Not sure it's worth it.
	
	puzzleIsValid() {
		try {
			this.fullHouse(false, false);
		} catch {
			return false;
		}
		return true;
	}
	
	isLegalMove(row, col, value, checkForNonNumbers = true) {
		value = parseInt(value);
		
		// check for non numbers
		// Regex is very expensive. Only check this for user input.
		if ( checkForNonNumbers ) {
			if ( ! value.toString().match(/^[1-9]$/m) ) {
				return false;
			}
		}
		
        // check row
        // TODO: foreach getRowSquares
		for ( let i = 0; i < 9; i++ ) {
			if ( value === this.board[row][i] ) {
				return false;
			}
		}
		
        // check column
        // TODO: foreach getColumnSquares
		for ( let i = 0; i < 9; i++ ) {
			if ( value === this.board[i][col] ) {
				return false;
			}
		}
		
        // check 3x3 grid
        // TODO: foreach getBoxSquares
		const rowOffset = Math.floor(row/3)*3;
		const colOffset = Math.floor(col/3)*3;
		for ( let i = 0 + rowOffset; i <= 2 + rowOffset; i++ ) {
			for ( let j = 0 + colOffset; j <= 2 + colOffset; j++ ) {
				if ( value === this.board[i][j] ) {
					return false;
				}
			}
		}
		
		return true;
	}
	
	solveLogically() {
		this.solveUsingAllTechniques();
		
		if ( this.puzzleIsSolved() ) {
			return true;
		} else {
			return false;
		}
	}
	
	getHint() {
		return this.solveUsingAllTechniques(true);
	}
	
	solveUsingAllTechniques(hintMode = false) {
		let hintSquare;
		let lastHintSquare = false;
		
		// Need to keep looping, trying the techniques from easiest to hardest.
		// If a technique solves a square, restart the loop.
		// If no techniques can solve the current square, end the loop.
		while ( true ) {
			// TODO: have every square store its candidates, like sudokuwiki.org does
			
			hintSquare = this.fullHouse(hintMode);
			if ( hintSquare && hintMode ) {
				return hintSquare;
			} else if ( hintSquare != lastHintSquare ) {
				lastHintSquare = hintSquare;
				continue;
			}
			
			hintSquare = this.boxXray(hintMode);
			if ( hintSquare && hintMode ) {
				return hintSquare;
			} else if ( hintSquare != lastHintSquare ) {
				lastHintSquare = hintSquare;
				continue;
			}
			
			// rowXray
			
			// columnXray
			
			// add other more complicated techniques here
			
			break;
		}
		
		return hintSquare;
	}
	
	// Possibilities {1:true, 2:true, 3:true, 4:true, 5:true, 6:true, 7:true, 8:true, 9:true}
	static squareIsSolved(possibilities) {
		let trueCount = 0;
		for ( let i = 1; i <= 9; i++ ) {
			if ( possibilities[i] ) {
				trueCount++;
			}
			if ( trueCount >= 2 ) {
				return false;
			}
		}
		if ( trueCount === 1 ) {
			return true;
		}
		return false;
	}
	
	// If 8 of 9 squares are filled in, fill in 9th square.
	fullHouse(hintMode = false, modifyBoard = true) {
        let possibilities;
		let emptyCol;
		let emptyRow;
	
        // check row
		for ( let row = 0; row < 9; row++ ) {
			// bool array [true, true, true] is faster than list [1, 2, 3]
			possibilities = {1:true, 2:true, 3:true, 4:true, 5:true, 6:true, 7:true, 8:true, 9:true};
			emptyCol = 0;
			
			for ( let col = 0; col < 9; col++ ) {
				const value = this.board[row][col];
				if ( value === 0 ) {
					emptyCol = col;
					continue;
				} else if ( possibilities[value] ) {
					possibilities[value] = false;
				} else {
					this.throwDuplicateNumberError();
				}
			}
			
			if ( SudokuBoard.squareIsSolved(possibilities) ) {
				if ( hintMode ) {
					return new SudokuSquare(row, emptyCol);
				} else if ( modifyBoard ) {
					this.board[row][emptyCol] = SudokuBoard.getTrueKey(possibilities);
				}
			}
		}

		// check column
		for ( let col = 0; col < 9; col++ ) {
			possibilities = {1:true, 2:true, 3:true, 4:true, 5:true, 6:true, 7:true, 8:true, 9:true};
			emptyRow = 0;
			
			for ( let row = 0; row < 9; row++ ) {
				const value = this.board[row][col];
				if ( value === 0 ) {
					emptyRow = row;
					continue;
				} else if ( possibilities[value] ) {
					possibilities[value] = false;
				} else {
					this.throwDuplicateNumberError();
				}
			}
			
			if ( SudokuBoard.squareIsSolved(possibilities) ) {
				if ( hintMode ) {
					return new SudokuSquare(emptyRow, col);
				} else if ( modifyBoard ) {
					this.board[emptyRow][col] = SudokuBoard.getTrueKey(possibilities);
				}
			}
		}
        
		// check 3x3 grid
		for ( let row = 0; row < 9; row+=3 ) {
			for ( let col = 0; col < 9; col+=3 ) {
				possibilities = {1:true, 2:true, 3:true, 4:true, 5:true, 6:true, 7:true, 8:true, 9:true};
				emptyRow = 0;
				emptyCol = 0;
				
				const rowOffset = Math.floor(row/3)*3;
				const colOffset = Math.floor(col/3)*3;
				// iterate around 3x3 area
				for ( let i = 0 + rowOffset; i <= 2 + rowOffset; i++ ) {
					for ( let j = 0 + colOffset; j <= 2 + colOffset; j++ ) {
						const value = this.board[i][j];
						if ( value === 0 ) {
							emptyRow = i;
							emptyCol = j;
							continue;
						} else if ( possibilities[value] ) {
							possibilities[value] = false;
						} else {
							this.throwDuplicateNumberError();
						}
					}
				}
				
				if ( SudokuBoard.squareIsSolved(possibilities) ) {
					if ( hintMode ) {
						return new SudokuSquare(emptyRow, emptyCol);
					} else if ( modifyBoard ) {
						this.board[emptyRow][emptyCol] = SudokuBoard.getTrueKey(possibilities);
					}
				}
			}
		}
	}
	
	// finds some hidden singles, using the cross hatching technique
	// Try numbers 1-9. See if there are 2 row boxXrays, 2 column boxXrays, and that number is not present within 3x3.
	boxXray(hintMode = false) {
		// foreach 3x3 box on the board (method will grab the top left square of the box)
		const boxes = this.getAllBoxes();
		for ( let square of boxes ) {
			// foreach candidate 1-9
			for ( let candidate = 1; candidate <= 9; candidate++ ) {
				// is number already in 3x3 box? continue;
				if ( this.numberInBox(candidate, square) ) {
					continue;
				}
				
                // boolean 3x3 array to track which cells in the box can possibly contain our candidate. default true.
				let tests = [
					[true, true, true],
					[true, true, true],
					[true, true, true],
				];
				
				// any spot in bool 3x3 that already has a number, set to false
				tests = this.markOccupiedSquares(tests, square);
							
                // foreach 3 rows
                // if a row has that number, set false to 3 squares in that row
				tests = this.markRowXrays(tests, square, candidate);
				
                // foreach 3 cols
                // if a col has that number, set false to 3 squares in that col
				tests = this.markColXrays(tests, square, candidate);

				// does bool array have exactly 1 true? if so, square solved
				// write the value to this.board
				const solvedSquare = this.getSolvedSquare(tests, square, candidate);
				if ( solvedSquare ) {
					const solvedRow = solvedSquare.getRow();
					const solvedCol = solvedSquare.getCol();
					if ( ! hintMode ) {
						this.board[solvedRow][solvedCol] = candidate;
					}
					return solvedSquare;
				}
			}
		}
	}
	
	getSolvedSquare(tests, square, candidate) {
		let count = 0;
		// Keep in mind that $square is the top left square of the box, and not the $solvedSquare.
		let solvedRow = square.getRow();
		let solvedCol = square.getCol();
		
		for ( let i = 0; i <= 2; i++ ) {
			for ( let j = 0; j <= 2; j++ ) {
				if ( tests[i][j] ) {
					count++;
					// Figure out square that is solved. Store it in $box_row, $box_col
					solvedRow += i;
					solvedCol += j;
				}
			}
		}
		
		if ( count === 1 ) {
			return new SudokuSquare(solvedRow, solvedCol, candidate);
		} else {
			return false;
		}		
	}
	
	throwDuplicateNumberError() {
		window.alert(`Bad puzzle. A duplicate number was found.`);
		// Using throw here because JS doesn`t appear to have the PHP equivalent of break 2 to break out of nested loops and functions
		throw `Bad puzzle. A duplicate number was found.`;
	}
	
	// If the 3 rows going through this box have the candidate number, mark the squares in those rows as false.
	markRowXrays(tests, square, candidate) {
		let testResults = tests;
		
		// figure out 3 rows to test
		const row = square.getRow();
		const rowOffset = Math.floor(row/3)*3;
		
		// foreach 3 rows
		for ( let i = 0 + rowOffset; i <= 2 + rowOffset; i++ ) {
			// foreach 9 columns
			for ( let j = 0; j < 9; j++ ) {
				const value = this.board[i][j];
				// if candidate
				if ( value === candidate ) {
					// set correct test_result row squares (3 squares) to false
					testResults[i - rowOffset][0] = false;
					testResults[i - rowOffset][1] = false;
					testResults[i - rowOffset][2] = false;
				}
			}
		}
		
		return testResults;
	}
	
	markColXrays(tests, square, candidate) {
		let testResults = tests;
		
		// figure out 3 cols to test
		const col = square.getCol();
		const colOffset = Math.floor(col/3)*3;
		
		// foreach 3 cols
		for ( let i = 0 + colOffset; i <= 2 + colOffset; i++ ) {
			// foreach 9 rows
			for ( let j = 0; j < 9; j++ ) {
				const value = this.board[j][i];
				// if candidate
				if ( value === candidate ) {
					// set correct test_result col squares (3 squares) to false
					testResults[0][i - colOffset] = false;
					testResults[1][i - colOffset] = false;
					testResults[2][i - colOffset] = false;
				}
			}
		}
		
		return testResults;
	}
	
	markOccupiedSquares(tests, square) {
		let testResults = tests;
		
		const row = square.getRow();
		const col = square.getCol();
		
		// find top left corner of box
		const rowOffset = Math.floor(row/3)*3;
		const colOffset = Math.floor(col/3)*3;
		
		// iterate around 3x3 area
		for ( let i = 0 + rowOffset; i <= 2 + rowOffset; i++ ) {
			for ( let j = 0 + colOffset; j <= 2 + colOffset; j++ ) {
				const value = this.board[i][j];
				
				if ( value ) {
					testResults[i - rowOffset][j - colOffset] = false;
				}
			}
		}
		
		return testResults;
	}
	
	getLegalMoves() {
		let numberOfSolutionsSoFar = 0;
		let solutionsChecked = 0;
		solutionsChecked++;
		let legalMoves = new LegalMoves();
		const currentSudoku = this;
		
		if ( numberOfSolutionsSoFar > 500 ) {
			return legalMoves;
		}
		
		if ( ! this.puzzleIsValid() ) {
			return legalMoves;
		}
		
		if ( this.puzzleIsSolved() ) {
			return legalMoves;
		}
		
		// foreach boardsquare
		for ( let square of currentSudoku.getAllSquares() ) {
			// if square is empty
			if ( square.getValue() === 0 ) {
				// for each possible number 1-9
				for ( let i = 1; i <= 9; i++ ) {
					const row = square.getRow();
					const col = square.getCol();
					
					if ( currentSudoku.isLegalMove(row, col, i) ) {
						// create new Sudoku
						let nextSudoku = new SudokuBoard();
						nextSudoku.parseString(currentSudoku.getString());
						
						// make move
						nextSudoku.makeMove(row, col, i);
						
						if ( nextSudoku.puzzleIsSolved() ) {
							numberOfSolutionsSoFar++;
						}
						
						legalMoves.addMove(nextSudoku.getString());
					}
				}
			}
		}
		
		return legalMoves;
	}
	
	puzzleIsSolved() {
		for ( let i = 0; i < 9; i++ ) {
			for ( let j = 0; j < 9; j++ ) {
				if ( this.board[i][j] === 0 ) {
					return false;
				}
			}
		}
		return true;				
	}
	
	getAllSolutions() {
		if ( ! this.puzzleIsValid() ) {
			this.throwDuplicateNumberError();
			return 0;
		}
		
		if ( this.puzzleIsSolved() ) {
			return 1;
		}
		
		const initialRecursionTracker = new RecursionTracker();
		const initialSudoku = new SudokuBoard();
		initialSudoku.setBoard(SudokuBoard.cloneBoard(this.board));
		
		// Solve using simple logical techniques first. Filling in a couple of the first squares really helps speed up recursion for certain difficult puzzles.
		const solvedEarly = initialSudoku.solveLogically();
		
		initialRecursionTracker.setSudokuToCheck(initialSudoku);
		
		if ( solvedEarly ) {
			initialRecursionTracker.addSolution(initialSudoku);
			return initialRecursionTracker;
		}
		
		const finalRecursionTracker = this.solveRecursively(initialRecursionTracker);
		
		return finalRecursionTracker;
	}
		
	solveRecursively(recursionTracker) {
		// Benchmark History, RECURSION_LIMIT = 50,000, board = Testing Solution Count 2, DESKTOP-PC, Chrome
			// 2508  ms initially
			// 2186  ms added/refactored getTrueKey
			// 1519  ms added/refactored cloneBoard
			//  789  ms added/refactored squareIsSolved
			//  298  ms added/refactored setBoard
			//  170  ms commented out RegEx in get_legal_move
			//    0.4ms added return after for loop in solveRecursively
			//    0.1ms tries to logical solve once before trying to recursive solve
			
		// The best way to get speed is to use a combination of iteration (simple logical solving techniques) and recursion. The iteration cuts down on the amount of recursion needed significantly, and recursion checks the rest.
		
		const RECURSION_LIMIT = 1000000000;
		const SOLUTION_LIMIT = 500;
		
		if ( recursionTracker.getSolutionCount() >= SOLUTION_LIMIT ) {
			return recursionTracker;
		}
		
		if ( recursionTracker.getBoardsCheckedCount() > RECURSION_LIMIT ) {
			recursionTracker.markEarlyExit();
			return recursionTracker;
		}
		
		const currentSudoku = recursionTracker.getSudokuToCheck();
		
		// foreach boardsquare
		for ( let square of currentSudoku.getAllSquares() ) {
			// if square is empty
			if ( square.getValue() === 0 ) {
				// for each possible number 1-9
				for ( let i = 1; i <= 9; i++ ) {
					if ( recursionTracker.getBoardsCheckedCount() > RECURSION_LIMIT ) {
						recursionTracker.markEarlyExit();
						return recursionTracker;
					}
					
					const row = square.getRow();
					const col = square.getCol();
					
					if ( currentSudoku.isLegalMove(row, col, i, false) ) {
						recursionTracker.incrementBoardsChecked();
						
						// create new Sudoku
						let nextSudoku = new SudokuBoard();
						
						const board = SudokuBoard.cloneBoard(currentSudoku.board);
						nextSudoku.setBoard(board);
						
						// make move
						nextSudoku.makeMove(row, col, i);
						// propagate forced-moves
						if ( ! nextSudoku.propagate() ) {
							continue;
						}
						
						if ( nextSudoku.puzzleIsSolved() ) {
							recursionTracker.addSolution(nextSudoku);
							recursionTracker.incrementBoardsChecked();
						} else {
							recursionTracker.setSudokuToCheck(nextSudoku);
							recursionTracker = this.solveRecursively(recursionTracker);
						}
					}
				}
				
				// This line is super important. I didn't have it and the solver was slow as molasses until I figured this out.
				// We should find ONE blank square, find a legal move, then make a recursive solve call using the new board.
				// The tree should be expanding DOWNWARDS, not SIDEWAYS.
				// This line will prune all the sideways calculations except for trying legal moves in one empty square.
				// Find that ONE blank square, try 1-9, then get out.
				return recursionTracker;
			}
		}
		
		return recursionTracker;
	}
	
	static getTrueKey(array) {
		let count = 0;
		let trueKey = false;
		for ( let key in array ) {
			if ( array[key] ) {
				trueKey = key;
				count++;
			}
		}
		if ( count === 1 ) {
			return parseInt(trueKey);
		} else {
			return false;
		}
	}
	
	makeEasyPuzzle() {
		// Optimization history. Run loop 100 times with no early exit.
		//  900-1450ms 
		//  306- 381ms getLegalMovesForSquare (bitwise) instead of try 100 random numbers
		//  188- 245ms makeSolvedPuzzle method: 2x "for" loops instead of "for of" loop
		
		let newBoard;
		let triedSoFar = 0;
		while ( true ) {
		// for ( let i = 0; i < 100; i++ ) {
			newBoard = new SudokuBoard();
			newBoard.makeSolvedPuzzle();
			newBoard.deleteSquares(47); // 47
			triedSoFar++;
			
			const recursionTracker = new RecursionTracker();
			recursionTracker.setSudokuToCheck(newBoard);
			const numberOfSolutions = this.solveRecursively(recursionTracker).getSolutionCount();
			
			const newBoardCopy = new SudokuBoard();
			newBoardCopy.parseString(newBoard.getString());
			const easyToSolve = newBoardCopy.solveLogically();
			
			// Check for these two "bad" conditions. If true, continue looking for puzzles.
				// Recursive solve has multiple solutions
				// Simple solver cannot solve it. Difficulty level too hard for the user.
			if (numberOfSolutions === 1 && easyToSolve ) {
				break;
			}
		}
		console.log(triedSoFar + ` puzzles generated before finding a puzzle that has only 1 solution AND is very easy.`);
		this.parseString(newBoard.getString());
	}
	
	deleteSquares(howMany) {
		let deletedSoFar = 0;
		while ( deletedSoFar < howMany ) {
			const row = Helper.getRandomInteger(0,8);
			const col = Helper.getRandomInteger(0,8);
			if ( this.board[row][col] ) {
				this.board[row][col] = 0;
				deletedSoFar++;
			}
		}
	}
	
	makeSolvedPuzzle() {
		do {
			newBoard:
			for ( let row = 0; row < 9; row++ ) {
				for ( let col = 0; col < 9; col++ ) {
					const legalMoves = this.getLegalMovesForSquare(row, col);
					
					// Empty arrays are not falsey in JavaScript. Have to be verbose here.
					if ( legalMoves.length === 0 ) {
						this.restartPuzzle();
						break newBoard;
					}
					
					const index = Helper.getRandomInteger(0, legalMoves.length-1);
					const value = legalMoves[index];
					
					this.makeMove(row, col, value);
				}
			}
		} while ( ! this.puzzleIsSolved() );
	}
	
	getLegalMovesForSquare(row, col) {
		if ( this.board[row][col] ) {
			return false;
		}
		
		// binary representation of candidates
		// 987654321X
		// 1 means the # IS a possible candidate, 0 means the # is NOT a possible candidate
		let candidates = 0b1111111110;
		
		for ( let i = 0; i < 9; i++ ) {
			// If i is in row/col/house, set candidate from 1 (possible candidate) to 0 (not possible candidate)
			
			// check row
			candidates &= ~(1 << this.board[row][i]);
			
			// check column
			candidates &= ~(1 << this.board[i][col]);
			
			// check house
			// 1 2 3
			// 4 5 6
			// 7 8 9
			const houseTopLeftRow = Math.floor(row/3)*3;
			const houseTopLeftCol = Math.floor(col/3)*3;
			const houseRow = houseTopLeftRow + Math.floor(i/3);
			const houseCol = houseTopLeftCol + (i % 3);
			candidates &= ~(1 << this.board[houseRow][houseCol]);
		}
		
		let candidatesArray = [];
		for ( let i = 1; i <= 9; i++ ) {
			if ( candidates & 1 << i ) {
				candidatesArray.push(i);
			}
		}
		
		return candidatesArray;
	}
	
	// TODO: rename
	// Credit to harold at codereview.stackexchange.com for this code.
	// https://codereview.stackexchange.com/questions/239935/javascript-sudoku-recursive-solver
	// By taking a bitwise approach, it sped up the solve routine considerably.
	propagate() {
		// For each row, column and block,
		// get a mask indicating which values are already present in it.
		// 0b987654321X
		// block order is top top top middle middle middle bottom bottom bottom
		let rowmask = new Int32Array(9);
		let colmask = new Int32Array(9);
		let blockmask = new Int32Array(9);
		for ( let i = 0; i < 9; i++ ) {
			for ( let j = 0; j < 9; j++ ) {
				rowmask[i] |= 1 << this.board[i][j];
				colmask[j] |= 1 << this.board[i][j];
				// | 0 forces integer, no remainder. JavaScript defaults to float, and quietly rounds decimal array indexes.
				blockmask[(i / 3 | 0) * 3 + (j / 3 | 0)] |= 1 << this.board[i][j];
			}
		}
		
		// For each cell, get a mask indicating which values are valid to fill into it.
		// Excludes zero, as zero is the lack of a value.
		// For a filled cell, the only value it can have is the value it already has.
		// For empty cells, the possible values are values that are not already used in the same row/column/block.
		let cellmask = new Int32Array(81);
		for ( let i = 0; i < 9; i++ ) {
			for ( let j = 0; j < 9; j++ ) {
				var mask = rowmask[i] | colmask[j] | blockmask[(i / 3 | 0) * 3 + (j / 3 | 0)];
				// invert to take the *unused* values
				// 0x3FE = 0011_1111_1110 (bits 1 to 9 are set)
				cellmask[i * 9 + j] = ~mask & 0x3FE;
				if ( this.board[i][j] !== 0 ) {
					cellmask[i * 9 + j] = 1 << this.board[i][j];
				}
			}
		}

		var changed = false;
		do {
			changed = false;
			
			// hidden single - only candidate in that house/row/col
			for ( let i = 0; i < 9; i++ ) {
				var m1 = 0;
				var m2 = 0;
				for ( let j = 0; j < 9; j++ ) {
					var m = cellmask[i * 9 + j];
					m2 |= m1 & m;
					m1 |= m;
				}
				for ( let j = 0; j < 9; j++ ) {
					var m = cellmask[i * 9 + j];
					m &= ~m2;
					if ( m !== 0 ) {
						cellmask[i * 9 + j] = m & -m;
					}
				}
			}
			
			for ( let j = 0; j < 9; j++ ) {
				var m1 = 0;
				var m2 = 0;
				for ( let i = 0; i < 9; i++ ) {
					var m = cellmask[i * 9 + j];
					m2 |= m1 & m;
					m1 |= m;
				}
				for ( let i = 0; i < 9; i++ ) {
					var m = cellmask[i * 9 + j];
					m &= ~m2;
					if ( m !== 0 ) {
						cellmask[i * 9 + j] = m & -m;
					}
				}
			}
			
			// naked singles - only candidate left in that particular cell
			
            // we just filled a cell with the value 'move' 
            // remove that as a possible value from cells in
            // the same row/column/block
			for ( let i = 0; i < 9; i++ ) {
				for ( let j = 0; j < 9; j++ ) {
					let mask = cellmask[i * 9 + j];                   
					if ( this.board[i][j] !== 0 ) {
						continue;
					}
					if ( mask === 0 ) {
						return false;
					}
					if ( this.isSingleSetBit(mask) ) {
						let move = this.getSetBitPosition(mask);
						this.makeMove(i, j, move);
						changed = true;
						
						// we just filled a cell with the value 'move' 
						// remove that as a possible value from cells in
						// the same row/column/block
						for ( let k = 0; k < 9; k++ ) {
							cellmask[i * 9 + k] &= ~(1 << move);
							cellmask[k * 9 + j] &= ~(1 << move);
						}
						for ( let k = 0; k < 3; k++ ) {
							for ( let l = 0; l < 3; l++ ) {
								cellmask[((i / 3 | 0) * 3 + k) * 9 + (j / 3 | 0) * 3 + l] &= ~(1 << move);
							}
						}
					}
				}
			}
		} while (changed);
		
		return true;
	}

	isSingleSetBit(x) {
		return x !== 0 && (x & -x) === x;
	}

	getSetBitPosition(x) {
		for ( let i = 0; i < 31; i++ ) {
		if ((x & (1 << i)) !== 0)
			return i;
		}
		return -1;
	}
}

class RecursionTracker {
	constructor() {
		this.numberOfSolutions = 0;
		this.solutionList = [];
		this.sudokuToCheck = null;
		this.boardsChecked = 0;
		this.earlyExit = false;
	}
	
	getSolutionCount() {
		return this.solutionList.length;
	}
	
	getSolutionList() {
		return this.solutionList;
	}
	
	getInfoString() {
		let string = ``;
		string += Helper.addCommasToNumber(this.getBoardsCheckedCount()) + ` Boards Checked Recursively\r\n`;
		
		if ( this.solutionList.length >= 500 ) {
			string += `At Least 500 Solutions. Exited Early.\r\n`;
		} else if ( this.solutionList.length === 1 ) {
			string += `1 Solution Found\r\n`;
		} else {
			string += this.solutionList.length + ` Solutions Found\r\n`;
		}
		
		if ( this.earlyExit ) {
			string += `Recursion Limit Reached. Exited Early.\r\n`;
		}
		
		if ( this.solutionList.length !== 0 ) {
			string += `Solutions:\r\n`;
		}
		
		for ( let solutionString of this.solutionList ) {
			string += solutionString + `\r\n`;
		}
		return string;
	}
	
	getSudokuToCheck() {
		return this.sudokuToCheck;
	}
	
	getBoardsCheckedCount() {
		return this.boardsChecked;
	}
	
	markEarlyExit() {
		this.earlyExit = true;
	}
	
	addSolution(sudoku) {
		const sudokuStringToCheck = sudoku.getString();
		if ( ! this.solutionList.includes(sudokuStringToCheck) ) {
			this.solutionList.push(sudokuStringToCheck);
		}
	}
	
	setSudokuToCheck(sudoku) {
		this.sudokuToCheck = sudoku;
	}
	
	incrementBoardsChecked() {
		this.boardsChecked++;
	}
}

class LegalMoves {
	constructor() {
		this.legalMoves = [];
	}
	
	addMove(move) {
		this.legalMoves.push(move);
	}
	
	getString() {
		let moveString = '';
		for ( let move of this.legalMoves ) {
			moveString = moveString + move + `\r\n`;
		}
		return moveString;
	}
	
	count() {
		return this.legalMoves.length;
	}
}

class SudokuSquare {
	constructor(row, col, value = 0) {
		this.row = parseInt(row);
		this.col = parseInt(col);
		this.value = parseInt(value);
	}
	
	getSquare() {
		return [this.row, this.col];
	}
	
	getRow() {
		return this.row;
	}
	
	getCol() {
		return this.col;
	}
	
	getValue() {
		return this.value;
	}
	
	setValue(value) {
		this.value = value;
	}
}

class SudokuDOM {
	static displayBoard(
		sudoku,
		sudokuSquares,
		stringBox,
		sudokuWikiLink,
		changeSquareColor = true
	) {
		const board = sudoku.getBoard();
		this.clearBoard(sudokuSquares, changeSquareColor);
		for ( let row = 0; row < 9; row++ ) {
			for ( let col = 0; col < 9; col++ ) {
				const input = sudokuSquares[row][col];
				input.classList.remove(`hint`);
				input.disabled = false;
				
				if ( board[row][col] != 0 ) {
					input.value = board[row][col];
					if ( changeSquareColor ) {
						input.classList.add(`imported-square`);
						input.disabled = true;
					}
				}
			}
		}
		SudokuDOM.displayString(sudoku, stringBox, sudokuWikiLink);
	}
	
	static displayString(board, stringBox, sudokuWikiLink) {
		stringBox.value = board.getString();
		sudokuWikiLink.href = `https://www.sudokuwiki.org/sudoku.htm?bd=` + board.getString();
	}

	static clearBoard(sudokuSquares, changeSquareColor = true) {
		for ( let row = 0; row < 9; row++ ) {
			for ( let col = 0; col < 9; col++ ) {
				sudokuSquares[row][col].value = ``;
				if ( changeSquareColor ) {
					sudokuSquares[row][col].classList.remove(`imported-square`);
				}
			}
		}
	}

	static highlightIllegalMove(obj){
		obj.classList.add(`invalid`);
		setTimeout(function(){
			obj.classList.remove(`invalid`);
		}, 2000);
	}
	
	static highlightHint(obj) {
		obj.classList.add(`hint`);
		setTimeout(function(){
			obj.classList.remove(`hint`);
		}, 2000);
	}
	
	static hideConsole(consoleBox, algorithm) {
		consoleBox.style.display = 'none';
		algorithm.style.display = 'none';
	}
}

class Helper {
	static createArray(length) {
		var arr = new Array(length || 0), i = length;
		if (arguments.length > 1) {
			var args = Array.prototype.slice.call(arguments, 1);
			while ( i-- ) {
				arr[length-1 - i] = Helper.createArray.apply(this, args);
			}
		}
		return arr;
	}
	
	static getRandomInteger(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}
	
	static addCommasToNumber(x) {
    	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
}

// Listeners
window.addEventListener(`DOMContentLoaded`, (e) => {
	// Calls to the DOM are expensive and are retrieved as references. Save the reference and re-use.
	const stringBox = document.getElementById(`string-box`);
	const sudokuWikiLink = document.getElementById(`sudoku-wiki-link`);
	const algorithm = document.getElementById(`algorithm`);
	const consoleBox = document.getElementById(`console`);
	const puzzlePicker = document.getElementById(`puzzle-picker`);
	const newButton = document.getElementById(`new`);
	
	const game1 = new SudokuBoard();
	const sudokuSquares = Helper.createArray(9,9);
	const CUSTOM_PUZZLE_SELECTEDINDEX = 1;
	
	// Store all the Sudoku square <input type=`text`> elements in variables for quick accessing
	for ( let row = 0; row < 9; row++ ) {
		for ( let col = 0; col < 9; col++ ) {
			sudokuSquares[row][col] = document.getElementById(`sudoku`).rows[row].cells[col].children[0];
		}
	}
	
	for ( let row = 0; row < 9; row++ ) {
		for ( let col = 0; col < 9; col++ ) {
			sudokuSquares[row][col].addEventListener(`input`, function(e) {
				e.target.classList.remove(`invalid`);
				e.target.classList.remove(`hint`);
				
				// Listen for illegal moves. If illegal, delete input and turn square red for 2 seconds.
				if ( ! game1.isLegalMove(row, col, e.target.value) && e.target.value != `` ) {
					e.target.value = ``;
					SudokuDOM.highlightIllegalMove(e.target);
				} else {
					game1.makeMove(row, col, e.target.value);
				}
				
				SudokuDOM.displayString(game1, stringBox, sudokuWikiLink);
			});
		}
	}
	
	/*
	solveButton.addEventListener(`click`, function(e) {
		const t1 = performance.now();
		game1.solveLogically();
		const t2 = performance.now();
		document.querySelector(`#algorithm span`).innerHTML = (t2 - t1).toFixed(1);
		SudokuDOM.displayBoard(game1, sudokuSquares, stringBox, sudokuWikiLink, false);
		algorithm.style.display = `block`;
	});
	*/
	
	/*
	setButton.addEventListener(`click`, function(e) {
		game1.setAsStartPoint();
		puzzlePicker.selectedIndex = CUSTOM_PUZZLE_SELECTEDINDEX;
		SudokuDOM.displayBoard(game1, sudokuSquares, stringBox, sudokuWikiLink, true);
	});
	*/
	
	document.getElementById(`validate`).addEventListener(`click`, function(e) {
		const t1 = performance.now();
		const recursionTracker = game1.getAllSolutions();
		const t2 = performance.now();
		// TODO: display recursionTracker stuff like # of solutions, strings of the solutions, etc.
		document.querySelector(`#algorithm span`).innerHTML = (t2 - t1).toFixed(1);
		algorithm.style.display = `inline-block`;
		consoleBox.children[0].innerHTML = recursionTracker.getInfoString();
		consoleBox.style.display = `block`;
		if ( recursionTracker.getSolutionCount() === 1 ) {
			game1.parseString(recursionTracker.getSolutionList()[0], false);
			SudokuDOM.displayBoard(game1, sudokuSquares, stringBox, sudokuWikiLink, false);
		}
	});
	
	/*
	legalMovesButton.addEventListener(`click`, function(e) {
		const t1 = performance.now();
		const legalMoves = game1.getLegalMoves();
		consoleBox.children[0].innerHTML = legalMoves.count() + ` Legal Moves\r\n` + legalMoves.getString();
		const t2 = performance.now();
		document.querySelector(`#algorithm span`).innerHTML = (t2 - t1).toFixed(1);
		algorithm.style.display = `block`;
		consoleBox.style.display = `block`;
	});
	*/
	
	document.getElementById(`restart`).addEventListener(`click`, function(e) {
		SudokuDOM.hideConsole(consoleBox, algorithm);
		game1.restartPuzzle();
		SudokuDOM.displayBoard(game1, sudokuSquares, stringBox, sudokuWikiLink);
	});
	
	document.getElementById(`hint`).addEventListener(`click`, function(e) {
		SudokuDOM.hideConsole(consoleBox, algorithm);
		const hint = game1.getHint();
		if ( hint ) {
			const row = hint.getRow();
			const col = hint.getCol();
			SudokuDOM.highlightHint(sudokuSquares[row][col]);
		}
	});
	
	document.getElementById(`import`).addEventListener(`click`, function(e) {
		SudokuDOM.hideConsole(consoleBox, algorithm);
		const board = window.prompt(`Please enter a sequence of 81 numbers, with 0 representing an empty square.`);
		const boardChanged = game1.parseString(board);
		if ( boardChanged ) {
			puzzlePicker.selectedIndex = CUSTOM_PUZZLE_SELECTEDINDEX;
			SudokuDOM.displayBoard(game1, sudokuSquares, stringBox, sudokuWikiLink);
		}
	});
	
	puzzlePicker.addEventListener(`change`, function(e) {
		SudokuDOM.hideConsole(consoleBox, algorithm);
		game1.parseString(puzzlePicker.value);
		SudokuDOM.displayBoard(game1, sudokuSquares, stringBox, sudokuWikiLink);
	});
	
	newButton.addEventListener(`click`, function(e) {
		SudokuDOM.hideConsole(consoleBox, algorithm);
		const t1 = performance.now();
		game1.makeEasyPuzzle();
		const t2 = performance.now();
		document.querySelector(`#algorithm span`).innerHTML = (t2 - t1).toFixed(1);
		algorithm.style.display = `inline-block`;
		SudokuDOM.displayBoard(game1, sudokuSquares, stringBox, sudokuWikiLink);
		puzzlePicker.selectedIndex = CUSTOM_PUZZLE_SELECTEDINDEX;
	});
	
	document.getElementById("propagate").addEventListener("click", function(e) {
		const t1 = performance.now();
		// game1.propagate();
		game1.getLegalMovesForSquare(1,4);
		const t2 = performance.now();
		document.querySelector(`#algorithm span`).innerHTML = (t2 - t1).toFixed(1);
		algorithm.style.display = `inline-block`;
	});
	
	newButton.dispatchEvent(new Event(`click`));
});