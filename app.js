document.addEventListener("DOMContentLoaded",() => {
grid = document.querySelector(".grid")
squares = Array.from(grid.querySelectorAll("div"))
displays = document.querySelectorAll(".display-grid div")
bottoms = document.querySelectorAll(".bottom")
text = document.querySelector("h1")
scoreDisplay = document.querySelector("#score")
score=0
const width = 10
const height = 20
let currentPosition = 4


// control key for moving current block
function moveBlock(e) {
    switch (true) {
        case e.key == "ArrowLeft":
            moveLeft()
            break;
        case e.key == "ArrowRight":   
            moveRight()
            break;
        case e.key == "ArrowUp":   
            rotate()
            break;
        case e.key == "ArrowDown":   
            moveDown()
            break;
    }
}

// array of each block with element of the rotated state
const lBlock = [
    [1, width+1, width*2+1, width*2+2],
    [width, width*2, width+1, width+2],
    [1, width+2, width*2+2, 2],
    [width*2, width*2+1, width*2+2, width+2]
]

const zBlock = [
    [1, width+1, width+2, width*2+2],
    [width*2, width*2+1, width+1, width+2],
    [1, width+1, width+2, width*2+2],
    [width*2, width*2+1, width+1, width+2]
]

const tBlock = [
    [width, width+1, width+2, width*2+1],
    [width+1, width+2, 2, width*2+2],
    [width, width+1, width+2, 1],
    [width, 0, width*2, width+1]
]

const oBlock = [
    [1, 2, width+1, width+2],
    [1, 2, width+1, width+2],
    [1, 2, width+1, width+2],
    [1, 2, width+1, width+2]
]

const iBlock = [
    [1, width+1, width*2+1, width*3+1],
    [width, width+2, width+1, width+3],
    [1, width+1, width*2+1, width*3+1],
    [width, width+2, width+1, width+3]
]

// all block array
blockArray = [lBlock,zBlock,tBlock,oBlock,iBlock]

// create random generator
random = Math.floor(Math.random()*blockArray.length)
// current rotation
currentRotation = 0
// select block and rotation of block (rotation set to 0)
current = blockArray[random][currentRotation]

//function to map current array into div
function draw(block) {
    current.forEach(index => {
        squares[index+currentPosition].classList.add("block")
    });
}

//function to remove div (for moving block)
function undraw(block) {
    current.forEach(index => {
        squares[index+currentPosition].classList.remove("block")
    });
}


// move right
function moveRight() {

    // cant move right if there was a previous/frozen block on the right
    frozen = current.some(index => 
        squares[currentPosition + index + 1].classList.contains("frozen"))

    // cant move right if block is at the edge
    rightEdge = current.some(index => (currentPosition+index) % width == width-1)

    if (!rightEdge && !frozen) {
        undraw()
        currentPosition+=1
        draw()
    }
}

// move left
function moveLeft() {

    // cant move left if there was a previous/frozen block on the left
    frozen = current.some(index => 
        squares[currentPosition + index - 1].classList.contains("frozen"))

    // cant move left if block is at the edge
    leftEdge = current.some(index => (currentPosition+index) % width == 0)
    if (!leftEdge && !frozen) {
        undraw()
        currentPosition-=1
        draw()
    }
}

// move down
function moveDown() {
    current
        undraw()
        currentPosition+=width
        draw()
        // freeze if the block hits the bottom or another block
        freeze()        
}


function rotate() {

    // cannot rotate if at the edge to prevent block from crossing the edge and appear at the other edge
    rightEdge = current.some(index => (currentPosition+index) % width == width-1)
    leftEdge = current.some(index => (currentPosition+index) % width == 0)

    rotated = []
    
    if (currentRotation+1 == current.length) {
        rotated = blockArray[random][0]
    } else {
        rotated = blockArray[random][currentRotation+1]
    }

    arrays=[]
    rotated.forEach(index => {
            arrays.push(((index+currentPosition)%width))
        })

    undraw()

    // if block will cross the edge when rotated, adjust current position
    if (rightEdge && arrays.includes(0)) {
        if (arrays.includes(1)) {
            currentPosition-=2
        } else {
            currentPosition-=1
        }
        
    } else if (leftEdge && arrays.includes(9)) {
        if (arrays.includes(8)) {
            currentPosition+=3
        } else {
            currentPosition+=1
        }
    }
    
    // add one to the block array to rotate
    currentRotation++;
    
    if (currentRotation == current.length) {
        currentRotation = 0
    }
    current = blockArray[random][currentRotation]
    draw()
}

// freeze if block is at the bottom or hits another block
function freeze() {
    
    bottom = current.some(index => 
        squares[currentPosition + index + width].classList.contains("bottom"))   
    frozen = current.some(index => 
        squares[currentPosition + index + width].classList.contains("frozen"))

    if (bottom || frozen) {
        current.forEach(index => (squares[currentPosition + index].classList.add("frozen")))
        //next random is used to display next block in the display function
        //let random = next random to subsequent draw the block that is displayed
        random = nextRandom
        //display the next block
        display()
        //set the current position back to the top
        currentPosition = 4 
        // set current to the new random
        current = blockArray[random][currentRotation]
        draw()

        //if current block is frozen at the top, game over
        if (current.some(index=>(squares[currentPosition+index].classList.contains("frozen")))) {
            clearInterval(moveDownId)
            text.textContent = "Game Over!"
        }   
    }

    clearBlock()
    
}

function clearBlock() {
    // for the array of div, create a row of divs equal to the width of game board
    for (index=0;index<199;index+=width) {
        const row = [index+0,index+1,index+2,index+3,index+4,index+5,index+6,index+7,index+8,index+9]
        // if every div in the row contains frozen block, remove frozen class
        if (row.every(element=>(squares[element].classList.contains("frozen")))) {
            row.forEach(element => {
                squares[element].classList.remove("frozen") || squares[element].classList.remove("block")
            })
            
            // remove the divs by splicing the row
            const removed = squares.splice(index,width)
            // add back the rows to the top
            squares = removed.concat(squares)
            squares.forEach(cell =>
                grid.appendChild(cell)

            
            )
            
            // increase score by ten when row is cleared
            score+= 10;
            scoreDisplay.textContent = score
        }
     
    }
}

display()
draw()

// display the next grid
function display() {

    displayWidth=4
    displayIndex=0
    // array of all the blocks without rotation
    displayArray = [[1, displayWidth+1, displayWidth*2+1, displayWidth*2+2],
        [1, displayWidth+1, displayWidth+2, displayWidth*2+2],
        [displayWidth, displayWidth+1, displayWidth+2, displayWidth*2+1],
        [1, 2, displayWidth+1, displayWidth+2],
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1]]
    
    nextRandom = Math.floor(Math.random()*displayArray.length)
    array=displayArray[nextRandom]
    
    //remove all previous block from the display grid
    displays.forEach(index => {
        index.classList.remove("block")
})
  
    array.forEach(index => {
        displays[displayIndex+index].classList.add("block")
})

}

moveDownId = setInterval(moveDown,400)

document.addEventListener("keyup",moveBlock)

})