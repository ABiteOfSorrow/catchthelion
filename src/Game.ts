import { Board, Cell, DeadZone } from "./Board";
import { Player, PlayerType } from "./Player";
import "./Piece";


export class Game {
    private selectedCell: Cell | null;
    private turn = 0;
    private currentPlayer: Player;
    private gameInfoEl = document.querySelector('.alert') as HTMLElement;
    private state: 'STARTED' | 'END' = 'STARTED';

    readonly upperPlayer = new Player(PlayerType.UPPER);
    readonly lowerPlayer = new Player(PlayerType.LOWER);

    readonly board = new Board(this.upperPlayer, this.lowerPlayer)
    readonly upperDeadZone = new DeadZone('upper');
    readonly lowerDeadZone = new DeadZone('lower');
    



    constructor() {
        const boardContainer: any = document.querySelector('.board-container');
        boardContainer.firstChild.remove();
        boardContainer.appendChild(this.board._element);

        this.currentPlayer = this.upperPlayer;

        this.board.render();
        this.renderInfo()
    }

    renderInfo(extraMessage?: string) {
        this.gameInfoEl.innerHTML = `#${this.turn} turn ${this.currentPlayer.type}'s turn ${(extraMessage) ? '| ' + extraMessage : ''}`
    }

    changeTurn() {
        this.selectedCell?.deactivate();
        this.selectedCell = null;

        if (this.state === 'END') {
            this.renderInfo('END!')
        } else {
            this.turn += 1;
            this.currentPlayer = (this.currentPlayer === this.lowerPlayer) ? this.upperPlayer : this.lowerPlayer;
            this.renderInfo();
        }
        this.board.render();
    }

    
}

