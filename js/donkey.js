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
        self.boxArray = [];
        for (let index = 0; index < 10; index++) {
            self.boxArray.push(new DonkeyBox(getBoxProps(index)));
        }
        //array of two objects that represent empty spaces - places where boxes can be moved
        self.spaces = [{ row: 5, column: 2 }, { row: 5, column: 3 }];
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

    createVisualElement() {
        let element = document.createElement("div");
        element.innerHTML = this.name;
        
        element.className = "dnk-box";
        element.style.gridRow = `${this.row} / span ${this.height}`;
        element.style.gridColumn = `${this.column} / span ${this.width}`;
        
        // add click handlers
        element.addEventListener("click", this.handleClick);

        donkeyGameContainer.appendChild(element);
    }


    handleClick = (e) => {
        //TODO: handle clicks
        console.log("CLICK", e.target)

        //put corresponding box with absolute position above the clicked one

        //hide the clicked box (aligned to grid)
        e.target.style.display = 'none';

        //change the absolute position 

        //change grid position of the clicked box

        //show the clicked box after delay 

        //hide box with absolute position
    }

}





// when documents loads
document.addEventListener("DOMContentLoaded", () => {
    donkeyGame = new DonkeyGame();

}
);
