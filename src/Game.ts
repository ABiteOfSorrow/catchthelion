import { Board, Cell, DeadZone } from "./Board";
import { Player, PlayerType } from "./Player";
import "./Piece";
import { Lion } from "./Piece";


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

        this.board._element.addEventListener('click', e => {
            if (this.state === 'END') {
                return false;
            }
/* instanceof 연산자를 사용하면 객체가 특정 클래스에 속하는지 아닌지를 확인할 수 있습니다. 
    instanceof는 상속 관계도 확인해줍니다.
    ex: obj instanceof Class
    obj가 Class에 속하거나 Class를 상속받는 클래스에 속하면 true가 반환됩니다.
*/
            if (e.target instanceof HTMLElement) {
                let cellEl: HTMLElement;
                if (e.target.classList.contains('cell')) {
                    cellEl = e.target;
                } else if (e.target.classList.contains('piece')) {
                    cellEl = e.target.parentElement as HTMLElement;
                } else {
                    return false;
                }
                const cell = this.board.map.get(cellEl)!;

                if (this.isCurrentUserPiece(cell)) {
                    this.select(cell);
                    return false;
                }

                if (this,this.selectedCell) {
                    this.move(cell);
                    this.changeTurn();
                }
            }
        })
    }

    isCurrentUserPiece(cell: Cell) {
        return cell != null && cell.getPiece() !== null && cell.getPiece()?.ownerType === this.currentPlayer.type;
    }

    select(cell: Cell) {
        if (cell.getPiece() == null) {
            return;
        }

        if (cell.getPiece()?.ownerType !== this.currentPlayer.type) {
            return;
        }

        if (this.selectedCell) {
            this.selectedCell.deactivate()
            this.selectedCell.render()
        }

        this.selectedCell = cell;
        cell.active();
        cell.render();
    }

    move(cell: Cell) {
        this.selectedCell?.deactivate();
        const killed = this.selectedCell?.getPiece()?.move(this.selectedCell, cell).getKilled()
        this.selectedCell = cell;

        if (killed) {
            if (killed.ownerType === PlayerType.UPPER) {
                this.lowerDeadZone.put(killed);
            } else {
                this.upperDeadZone.put(killed);
            }
            
            if(killed instanceof Lion) {
                this.state = 'END';
            }

        }
    }

    renderInfo(extraMessage?: string) {
        this.gameInfoEl.innerHTML = `#${this.turn} turn ${this.currentPlayer.type}'s turn ${(extraMessage) ? '| ' + extraMessage : ''}`
    }

    changeTurn() {
        this.selectedCell?.deactivate();
        this.selectedCell = null;

        if (this.state === 'END') {
            this.renderInfo(`END! ${this.currentPlayer.type} is win`)
        } else {
            this.turn += 1;
            this.currentPlayer = (this.currentPlayer === this.lowerPlayer) ? this.upperPlayer : this.lowerPlayer;
            this.renderInfo();
        }
        this.board.render();
    }

    
}

