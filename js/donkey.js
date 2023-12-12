// starting position -  [ [row1, column1], [row2, column2], ..., [row10, column10] ]
const donkeyGameStartingPosition = [
  [1, 1],
  [1, 2],
  [1, 4],
  [3, 1],
  [3, 2],
  [3, 4],
  [4, 2],
  [4, 3],
  [5, 1],
  [5, 4],
];

// box dimensions -  [ [width1, height1], [width2, height2], ..., [width10, height10] ]
const boxDimensions = [
  [1, 2],
  [2, 2],
  [1, 2],
  [1, 2],
  [2, 1],
  [1, 2],
  [1, 1],
  [1, 1],
  [1, 1],
  [1, 1],
];

const donkeyGameContainer = document.querySelector(".donkey-game");
const menuElement = document.querySelector(".menu-sign");

let donkeyGame; //instance of DonkeyGame class

function getBoxProps(index) {
  let props = {};

  props.name = (index + 1).toString();
  [props.row, props.column] = donkeyGameStartingPosition[index];
  [props.width, props.height] = boxDimensions[index];
  return props;
}

// represents array of boxes and rules of their movements
class DonkeyGame {
  constructor() {
    //array of DonkeyBox-es
    this.boxArray = [];
    for (let index = 0; index < 10; index++) {
      this.boxArray.push(new DonkeyBox(getBoxProps(index)));
    }
    //array of two objects that represent empty spaces - places where boxes can be moved
    this.spaces = [
      { row: 5, column: 2 },
      { row: 5, column: 3 },
    ];
  }

  updateSpaces() {
    // array representing 5 rows with 4 columns
    let arr = Array.from({ length: 5 }, () => Array(4).fill(true));

    //mark element of the array occupied by boxes as false, remaining "true" elements would represent spaces
    for (const box of this.boxArray) {
      const { row, column, width, height } = box;
      for (let i = row; i < row + height; i++) {
        for (let j = column; j < column + width; j++) {
          arr[i - 1][j - 1] = false;
        }
      }
    }
    //record spaces position
    this.spaces = [];
    for (let i = 1; i <= 5; i++) {
      for (let j = 1; j <= 4; j++) {
        if (arr[i - 1][j - 1]) this.spaces.push({ row: i, column: j });
      }
    }
  }

  setPosition(gamePosition) {
    this.boxArray.map((box, index) => {
      box.row = gamePosition[index][0];
      box.column = gamePosition[index][1];
      box.setGridPosition();
    });
    this.updateSpaces();
  }

  restart() {
    this.setPosition(donkeyGameStartingPosition);
  }

  restore() {
    //TODO: handle no data case
    let currentPosition = JSON.parse(localStorage.getItem("currentPosition"));
    this.setPosition(currentPosition);
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

  setGridPosition() {
    this.visualElement.style.gridRow = `${this.row} / span ${this.height}`;
    this.visualElement.style.gridColumn = `${this.column} / span ${this.width}`;
  }

  createVisualElement() {
    let element = document.createElement("div");
    element.innerHTML = this.name;

    element.className = "dnk-box";
    this.visualElement = element;

    this.setGridPosition();

    // add click handlers
    // to make "this" available inside method handleClick
    // we can use (e) => this.handleClick(e) or this.handleClick.bind(this)
    element.addEventListener("click", (e) => this.handleClick(e));

    donkeyGameContainer.appendChild(element);
  }

  //check if there is a space above the box
  checkSpaceAbove() {
    let row = this.row - 1; //row above
    for (
      let column = this.column;
      column < this.column + this.width;
      column++
    ) {
      if (
        !donkeyGame.spaces.some(
          (space) => space.row === row && space.column === column
        )
      )
        return false;
    }
    return true;
  }

  //check if there is a space under the box
  checkSpaceUnder() {
    let row = this.row + this.height; //row under
    for (
      let column = this.column;
      column < this.column + this.width;
      column++
    ) {
      if (
        !donkeyGame.spaces.some(
          (space) => space.row === row && space.column === column
        )
      )
        return false;
    }
    return true;
  }
  //check if there is a space on the left of the box
  checkSpaceLeft() {
    let column = this.column - 1; // column on the left
    for (let row = this.row; row < this.row + this.height; row++) {
      if (
        !donkeyGame.spaces.some(
          (space) => space.row === row && space.column === column
        )
      )
        return false;
    }
    return true;
  }

  //check if there is a space on the right of the box
  checkSpaceRight() {
    let column = this.column + this.width; // column on the right
    for (let row = this.row; row < this.row + this.height; row++) {
      if (
        !donkeyGame.spaces.some(
          (space) => space.row === row && space.column === column
        )
      )
        return false;
    }
    return true;
  }

  // returns array of possible places, that are objects. For example, [ { row: 5, column: 2 }, {} ]
  // if there is no place to move, then returns [] (empty array)
  findPlacesToMove() {
    let result = [];

    // check if there is a space above, on the right, under, on the left
    // order is important for later movement direction determination
    if (this.checkSpaceAbove())
      result.push({ row: this.row - 1, column: this.column });
    if (this.checkSpaceRight())
      result.push({ row: this.row, column: this.column + 1 });
    if (this.checkSpaceUnder())
      result.push({ row: this.row + 1, column: this.column });
    if (this.checkSpaceLeft())
      result.push({ row: this.row, column: this.column - 1 });

    return result;
  }

  handleClick = (e) => {
    // check ability to move
    let placesToMove = this.findPlacesToMove();
    if (placesToMove.length == 0) return; // no spaces around

    // clicked element (in grid layout)
    let element = e.target;

    let index = 0; // index of placesToMove array (will point to first element, if there is only one place around)

    if (placesToMove.length == 2) {
      // 2 possible direction to move. Determine the direction by what area of the box is clicked

      // for small boxes (1 by 1) there might be  opposite and 90 degrees different directions
      if (placesToMove[0].row == placesToMove[1].row) {
        // moving horizontally
        if (e.offsetX > element.clientWidth / 2) {
          // left
          index = 1;
        }
      } else if (placesToMove[0].column == placesToMove[1].column) {
        // moving vertically
        if (e.offsetY < element.clientHeight / 2) {
          // down
          index = 1;
        }
      } else {
        // 90 degrees different directions
        // there are 4 possible variants of empty spaces layouts relative to clicked box

        //spaces are above and on the right
        if (
          placesToMove[0].row === this.row - 1 &&
          placesToMove[1].column === this.column + 1
        ) {
          if (e.offsetY < element.clientWidth - e.offsetX) {
            // right
            index = 1;
          }
        }
        //spaces are under and on the left
        if (
          placesToMove[0].row === this.row + 1 &&
          placesToMove[1].column === this.column - 1
        ) {
          if (e.offsetY > element.clientWidth - e.offsetX) {
            // left
            index = 1;
          }
        }

        //spaces are above and on the left
        if (
          placesToMove[0].row === this.row - 1 &&
          placesToMove[1].column === this.column - 1
        ) {
          if (e.offsetY < e.offsetX) {
            // left
            index = 1;
          }
        }
        //spaces are on the right and under
        if (
          placesToMove[0].column === this.column + 1 &&
          placesToMove[1].row === this.row + 1
        ) {
          if (e.offsetY < e.offsetX) {
            // down
            index = 1;
          }
        }
      }
      // let partClicked = 1;
      // TODO:
    }
    // to animate movement
    // put corresponding box with absolute position above the clicked one
    //TODO:

    //hide the clicked box (aligned to grid)
    //e.target.style.display = 'none';

    //make changes in object model
    Object.assign(this, placesToMove[index]);
    //deal with spaces
    donkeyGame.updateSpaces();

    //change the absolute position

    //change grid position of the clicked box
    this.setGridPosition(); //element

    //show the clicked box after delay

    //hide box with absolute position
  };
}

const menuList = document.querySelector("menu");
let menuClicked = false;

const hideMenu = (e) => {
  if (menuClicked) {
    menuClicked = false;
    return;
  }
  menuElement.style.display = "grid";
  menuList.style.left = "-65vw"; // hide
};

const actionRestart = () => {
  donkeyGame.restart();
};

const actionSave = () => {
  let currentPosition = [];
  for (const { row, column } of donkeyGame.boxArray) {
    currentPosition.push([row, column]);
  }
  localStorage.setItem("currentPosition", JSON.stringify(currentPosition));
};

const actionRestore = () => {
  donkeyGame.restore();
};

const handleMenuItemClick = (e) => {
  if (e.target.tagName === "LI") {
    const value = e.target.getAttribute("value");
    switch (value) {
      case "restart":
        console.log("restart clicked");
        actionRestart();
        break;
      case "save":
        console.log("save clicked");
        actionSave();
        break;
      case "restore":
        console.log("restore clicked");
        actionRestore();
        break;
    }
  }
};

// when documents loads
document.addEventListener("DOMContentLoaded", () => {
  donkeyGame = new DonkeyGame();

  menuElement.addEventListener("click", (e) => {
    menuClicked = true;
    menuElement.style.display = "none";
    menuList.style.left = "0"; // make visible
  });

  menuList.addEventListener("click", handleMenuItemClick);

  window.addEventListener("click", hideMenu);
});
