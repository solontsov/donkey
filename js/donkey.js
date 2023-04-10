// starting position -  [ [row1, column1], [row2, column2], ..., [row10, column10] ] 
const donkeyGameStartingPosition = [ [1, 1], [1, 2], [1, 4], [3, 1], [3, 2], [4, 3], [5, 2], [4, 3], [5, 1], [5, 4] ]; 

// box dimensions -  [ [width1, height1], [width2, height2], ..., [width10, height10] ] 
const boxDimensions = [ [1, 2], [2, 2], [1, 2], [1, 2], [2, 1], [1, 2], [1, 1], [1, 1], [1, 1], [1, 1]];

// represents array of boxes and rules of there movements
class DonkeyGame {
    
    constructor() {
        self.boxArray = [];
        self.spaces = [{}]
    }

    

    
}

class DonkeyBox {
    constructor(name, props){
        this.name = name;
        this.row = props.row;
        this.column = props.column;
        this.width = props.width;
        this.height = props.height;        
    }

    handleClick = (e) => {
        //TODO: handle clicks
        console.log("CLICK", e.target )
        
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
    
    // add click handlers to boxes
    document.querySelectorAll(".dnk-box").forEach((el) => {
        el.addEventListener("click", boxHandleClick);
    })

}

);
