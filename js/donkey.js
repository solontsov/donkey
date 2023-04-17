// starting position -  [ [row1, column1], [row2, column2], ..., [row10, column10] ] 
const donkeyGameStartingPosition = [[1, 1], [1, 2], [1, 4], [3, 1], [3, 2], [3, 4], [4, 2], [4, 3], [5, 1], [5, 4]];

// box dimensions -  [ [width1, height1], [width2, height2], ..., [width10, height10] ] 
const boxDimensions = [[1, 2], [2, 2], [1, 2], [1, 2], [2, 1], [1, 2], [1, 1], [1, 1], [1, 1], [1, 1]];

const donkeyGameContainer = document.querySelector(".donkey-game");

let donkeyGame; //instance of DonkeyGame class

function getBoxProps(index) {
    let props = {}

    props.name = (index + 1).toString();
    [props.row, props.column] = donkeyGameStartingPosition[index];
    [props.width, props.height] = boxDimensions[index];
    return props;
}

// represents array of boxes and rules of there movements
class DonkeyGame {

    constructor() {
        //array of DonkeyBox-es
        this.boxArray = [];
        for (let index = 0; index < 10; index++) {
            this.boxArray.push(new DonkeyBox(getBoxProps(index)));
        }
        //array of two objects that represent empty spaces - places where boxes can be moved
        this.spaces = [{ row: 5, column: 2 }, { row: 5, column: 3 }];
    }



}

class DonkeyBox {
    constructor(props) {
        this.name = props.name;
        this.row = props.row;
        this.column = props.column;
        this.width = props.width;
        this.height = props.height;

        this.createVisualElement();
    }

    setGridPosition(element) {
        element.style.gridRow = `${this.row} / span ${this.height}`;
        element.style.gridColumn = `${this.column} / span ${this.width}`;

    }

    createVisualElement() {
        let element = document.createElement("div");
        element.innerHTML = this.name;

        element.className = "dnk-box";
        this.setGridPosition(element);

        // add click handlers
        // to make "this" available inside method handleClick 
        // we can use (e) => this.handleClick(e) or this.handleClick.bind(this)
        element.addEventListener("click", (e) => this.handleClick(e));

        donkeyGameContainer.appendChild(element);
    }


    //check if there is a space above the box
    checkSpaceAbove() {
        let row = this.row - 1; //row above
        for (let column = this.column; column < this.column + this.width; column++) {
            if (!donkeyGame.spaces.some(space => space.row === row && space.column === column)) return false;
        }
        return true;
    }

    //check if there is a space under the box
    checkSpaceUnder() {
        let row = this.row + 1; //row under
        for (let column = this.column; column < this.column + this.width; column++) {
            if (!donkeyGame.spaces.some(space => space.row === row && space.column === column)) return false;
        }
        return true;
    }
    //check if there is a space on the left of the box
    checkSpaceLeft() {
        let column = this.column - 1; // column on the left
        for (let row = this.row; row < this.row + this.height; row++) {
            if (!donkeyGame.spaces.some(space => space.row === row && space.column === column)) return false;
        }
        return true;
    }

    //check if there is a space on the right of the box
    checkSpaceRight() {
        let column = this.column + 1; // column on the right
        for (let row = this.row; row < this.row + this.height; row++) {
            if (!donkeyGame.spaces.some(space => space.row === row && space.column === column)) return false;
        }
        return true;
    }


    //returns array of possible places, that are objects. For example, [ { row: 5, column: 2 }, {} ]
    // if there is no place to move, then returns [] (empty array)
    findPlacesToMove() {
        let result = [];

        //check if there is a space above, under, on the left, on the right
        if (this.checkSpaceAbove()) result.push({ row: this.row - 1, column: this.column });
        if (this.checkSpaceUnder()) result.push({ row: this.row + 1, column: this.column });
        if (this.checkSpaceLeft()) result.push({ row: this.row, column: this.column - 1 });
        if (this.checkSpaceRight()) result.push({ row: this.row, column: this.column + 1 });

        //TODO: debug
        // console.log("checkSpaceAbove", this.checkSpaceAbove())
        // console.log("checkSpaceUnder", this.checkSpaceUnder())
        // console.log("checkSpaceLeft", this.checkSpaceLeft())
        // console.log("checkSpaceRight", this.checkSpaceRight())

        return result;
    }

    handleClick = (e) => {

        // check ability to move
        let placesToMove = this.findPlacesToMove();
        if (placesToMove.length == 0) return;

        let index = 0; // first element of placesToMove, if there is only one place

        if (placesToMove.length == 2) {
            // 2 direction to move. By clicked part we need to determine direction
            // TODO:
            index = 1; //just to test

            // for small boxes (1 by 1) there might be  
            let partClicked = 1;
        }

        // element in grid layout
        let element = e.target;

        //put corresponding box with absolute position above the clicked one
        //TODO: 

        //hide the clicked box (aligned to grid)
        //e.target.style.display = 'none';

        //make changes in object model 
        //deal with spaces
        
        Object.assign(this, placesToMove[index]);
        
        //change the absolute position 

        //change grid position of the clicked box
        this.setGridPosition(element);

        //show the clicked box after delay 

        //hide box with absolute position
    }

}





// when documents loads
document.addEventListener("DOMContentLoaded", () => {
    donkeyGame = new DonkeyGame();

}
);
