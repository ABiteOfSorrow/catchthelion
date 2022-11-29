import { Piece } from "./Piece";
import { Player } from "./Player";

export interface Position {
    row: number;
    col: number;
}

export class Cell {
    private isActive = false;
    readonly _element: HTMLElement = document.createElement('DIV');

    constructor(
        public readonly position: Position,
        private piece: Piece | null | undefined
    ) {
        this._element.classList.add('cell');
    }

    put(piece: Piece | null){
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
    //map과 weakmap의 첫 번째 차이는 weakmap의 key가 반드시 객체(obj)여야 한다는 점이다 원시값은 위크맵의 key가 될 수 없다
    map: WeakMap<HTMLElement, Cell> = new WeakMap()

    constructor(upperPlayer: Player, lowerPlayer: Player) {
        this._element.className = 'board';

        for (let row = 0; row < 4; row++) {
            const rowEl = document.createElement('DIV');
            rowEl.className = 'row';
            this._element.appendChild(rowEl);

            for (let col = 0; col < 3; col++){
                const piece = 
                    upperPlayer.getPieces().find(({currentPosition}) => {
                        return currentPosition.col === col && currentPosition.row === row
                    }) || lowerPlayer.getPieces().find(({currentPosition}) => {
                        return currentPosition.col === col && currentPosition.row === row
                    }) 
                const cell = new Cell({ row, col }, piece);
                this.map.set(cell._element, cell);
                this.cells.push(cell);
                rowEl.appendChild(cell._element);
            }           
        }
    }

    render() {
        this.cells.forEach(v => v.render());
    }

}


export class DeadZone {
    private cells: Cell[] = [];
    readonly deadzoneEl = document.getElementById(`${this.type}_deadzone`)?.querySelector('.card-body');

    constructor(public type: 'upper' | 'lower') {
        for (let col = 0; col < 4; col++) {
            const cell = new Cell({ col, row: 0}, null);
            this.cells.push(cell);
            this.deadzoneEl?.appendChild(cell._element);
        }
    }

    put(piece: Piece) {
        const emptyCell = this.cells.find(v => v.getPiece() == null);
        emptyCell?.put(piece);
        emptyCell?.render();
    }

    render() {
        this.cells.forEach(v => v.render());
    }

}