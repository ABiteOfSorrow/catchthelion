import { Piece } from "./Piece";

export interface Position {
    row: number;
    col: number;
}

export class Cell {
    private isActive = false;
    readonly _element: HTMLElement = document.createElement('DIV');

    constructor(
        public readonly position: Position,
        private piece: Piece
    ) {
        this._element.classList.add('cell');
    }

    put(piece: Piece){
        this.piece = piece;
    }

    getPiece() {
        return this.piece;
    }

    active() {
        this.isActive = true;
    }

    deactivate() {
        this.isActive = false;
    }

    render() {
        if (this.isActive) {
            this._element.classList.add('active');
        } else {
            this._element.classList.remove('active');
        }

        this._element.innerHTML = (this.piece) ? this.piece.render() : '';
    }
}

export class Board {
    cells: Cell[] = [];
    _element: HTMLElement = document.createElement('DIV');

    constructor() {
        this._element.className = 'board';
    }
}
