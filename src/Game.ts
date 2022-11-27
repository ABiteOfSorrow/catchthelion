import { Board, DeadZone } from "./Board";


export class Game {

    readonly board = new Board()
    readonly upperDeadZone = new DeadZone('upper');
    readonly lowerDeadZone = new DeadZone('lower');
    
    constructor() {
        const boardContainer: any = document.querySelector('.board-container');
        boardContainer.firstChild.remove();
        boardContainer.appendChild(this.board._element);
    }

}