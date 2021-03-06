//play maze at https://nathanfenoglio.github.io/cube_maze/
//maze map at http://nathan-fenoglio.com/Web_Apps


//create squares for each spot in the maze grid
const room_dim = 35;
const grid = document.getElementById("grid");
for(let i = 0; i < room_dim * room_dim; i++){
    let one_square = document.createElement("div");
    one_square.className = "square";
    one_square.setAttribute("id", i);
    grid.appendChild(one_square);
}

const squares = document.querySelectorAll('.square');

//maze_arrays that represent all of the rooms drawn out are in maze_arrays.js

let cube_images = [
    "cube_images/0_0_0_Map.png", 
    "cube_images/0_0_1_Map.png",
    "cube_images/0_0_2_Map.png",
    "cube_images/0_1_0_Map.png",
    "cube_images/0_1_1_Map.png",
    "cube_images/0_1_2_Map.png",
    "cube_images/0_2_0_Map.png",
    "cube_images/0_2_1_Map.png",
    "cube_images/0_2_2_Map.png",
    "cube_images/1_0_0_Map.png", 
    "cube_images/1_0_1_Map.png",
    "cube_images/1_0_2_Map.png",
    "cube_images/1_1_0_Map.png",
    "cube_images/1_1_1_Map.png",
    "cube_images/1_1_2_Map.png",
    "cube_images/1_2_0_Map.png",
    "cube_images/1_2_1_Map.png",
    "cube_images/1_2_2_Map.png",
    "cube_images/2_0_0_Map.png", 
    "cube_images/2_0_1_Map.png",
    "cube_images/2_0_2_Map.png",
    "cube_images/2_1_0_Map.png",
    "cube_images/2_1_1_Map.png",
    "cube_images/2_1_2_Map.png",
    "cube_images/2_2_0_Map.png",
    "cube_images/2_2_1_Map.png",
    "cube_images/2_2_2_Map.png"
];
let counter = 0;
let dim_square_maze = 35;
let current_square = -1; 
let goal_square = -1;
let goal_squares = []; //using array to accomodate multiple exit points
let start_square = -1;
let current_maze = 0; //start at maze 0
let door_num = 2; //start with the left door for maze 0, all else will be determined by the previous room's exit door #

/*
key AA is in 2,1,0 (21)
	needed for passage between 1,2,0 (15) and 1,2,1 (16)
    through the in door of 1,2,0 (15) and through the out door of 1,2,1 (16)
key BB is in 0,2,2 (8)
	needed for passage between 0,0,1 (1) and 0,0,2 (2)
    through the in door of 0,0,1 (1) and through the out door of 0,0,2 (2)
key CC is in 0,1,1 (4)
	needed for passage between 1,1,1 (13) and 1,1,2 (14)
    through the in door of 1,1,1 (13) and through the out door of 1,1,2 (14)
key DD is in 2,0,1 (19)
	needed for passage between 2,0,0 (18) and 2,0,2 (20)
    through the out door of 2,0,0 (18) and through the in door of 2,0,2 (20)
*/

/*
Start room: 0, 0, 0 
End room: 2, 1, 2 
*/

//SOLUTION PATH:
//D, R, D, U, O, U, R, L, D, I, L, U, L, D, I, U, L, R, R, I, D, O, D, U, R, I, R, D, O, O, R, O, R 

//doors locked 0 or open 1
//doors 1, 2, 13, 14, 15, 16, 18, 20 are initially locked
//should color in some way to signify locked
let doors_locked_or_open = [1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

const info_2 = document.createElement('h1');

const info_3 = document.createElement('h1');
info_3.innerHTML = "GOAL ROOM: 212";
info_3.style.color = '#5feb34';
info_3.style.marginTop = '10px';
info_3.style.fontSize = '25px';

//display whether or not have obtained keys
const info_key_AA = document.createElement('h4');
const info_key_BB = document.createElement('h4');
const info_key_CC = document.createElement('h4');
const info_key_DD = document.createElement('h4');


const cube_image = document.createElement('img');

//to not display any transition door room message on the first draw
let first_time = true;

//to save previous room and door info to use in transition message
let previous_maze_num = -1;
let previous_door_num = -1;

const string_rep_of_door_nums = ["UP", "DOWN", "LEFT", "RIGHT", "OUT", "IN"];

function draw_maze(){
    document.body.style.backgroundColor = 'blue';
    counter = 0;
    //just printing
    console.log("door_num: " + door_num + " current_maze: " + current_maze);
   
    if(first_time){
        first_time = false;
    }
    else{
        alert("going through " + string_rep_of_door_nums[previous_door_num] + " door from room " + Number(previous_maze_num).toString(3).padStart(3, '0') + " to room " + Number(current_maze).toString(3).padStart(3, '0'));
    }
    
    info_2.innerHTML = "CURRENT ROOM IN CUBE: " + Number(current_maze).toString(3).padStart(3, '0');
    info_2.style.color = '#ff0080';
    info_2.style.marginTop = '20px';
    info_2.style.fontSize = '25px';
    document.body.appendChild(info_2);

    cube_image.src = cube_images[current_maze];
    cube_image.style.background = '#ffaa69';
    cube_image.style.padding = '20px';
    cube_image.style.marginLeft = '30px';
    document.body.appendChild(cube_image);

    document.body.appendChild(info_3);

    //display whether or not have obtained keys
    if(doors_locked_or_open[15] == 0){
        info_key_AA.innerHTML = "KEY A: DON'T HAVE";
    }
    else{
        info_key_AA.innerHTML = "KEY A: GOT IT";
    }
    if(doors_locked_or_open[1] == 0){
        info_key_BB.innerHTML = "KEY B: DON'T HAVE";
    }
    else{
        info_key_BB.innerHTML = "KEY B: GOT IT";
    }
    if(doors_locked_or_open[13] == 0){
        info_key_CC.innerHTML = "KEY C: DON'T HAVE";
    }
    else{
        info_key_CC.innerHTML = "KEY C: GOT IT";
    }
    if(doors_locked_or_open[18] == 0){
        info_key_DD.innerHTML = "KEY D: DON'T HAVE";
    }
    else{
        info_key_DD.innerHTML = "KEY D: GOT IT";
    }

    info_key_AA.style.color = '#ebc034';
    info_key_AA.style.paddingLeft = '42px';
    info_key_AA.style.fontSize = '16px';
    document.body.appendChild(info_key_AA);

    info_key_BB.style.color = '#ebc034';
    info_key_BB.style.paddingLeft = '42px';
    info_key_BB.style.fontSize = '16px';
    document.body.appendChild(info_key_BB);

    info_key_CC.style.color = '#ebc034';
    info_key_CC.style.paddingLeft = '42px';
    info_key_CC.style.fontSize = '16px';
    document.body.appendChild(info_key_CC);

    info_key_DD.style.color = '#ebc034';
    info_key_DD.style.paddingLeft = '42px';
    info_key_DD.style.fontSize = '16px';
    document.body.appendChild(info_key_DD);


    squares.forEach(square => {
    
        /*
        code for cube land
        10 = empty pathway
        11 = wall
        66 = key
        0 = UP (U)
        1 = DOWN (D)
        2 = LEFT (L)
        3 = RIGHT (R)
        4 = OUT (T)
        5 = IN (N)
        */
        
        let cell_value = maze_arrays[current_maze][Math.floor(counter / dim_square_maze)][counter % dim_square_maze]; 
        if(cell_value == 11){
            square.classList.add('backGroundColorWall');
        }
        else if(cell_value == 10){
            square.classList.add('backGroundColorEmpty');
        }
        //if cell value is one of the possible doors (connecting exit points)
        else if(cell_value == 0 || cell_value == 1 || cell_value == 2 || cell_value == 3 || cell_value == 4 || cell_value == 5){
            square.classList.add('backGroundColorFinish'); //just use Finish for the color of all the non key requiring doors

            //logic for updating door_num value dependent on where the player exits previous room and is entering current room
            if(cell_value == door_num){

                //If it is an up wall, then the cell underneath should be a valid starting point 
                if(cell_value == 0){
                    current_square = counter + dim_square_maze;
                    start_square = counter + dim_square_maze;  
                    console.log("current_square: " + current_square);
                    console.log("start_square: " + start_square);
                    squares[start_square].classList.add('backGroundColorCurrent');
                }
                //If it is a down wall, then the cell above should be a valid starting point
                else if(cell_value == 1){
                    current_square = counter - dim_square_maze;
                    start_square = counter - dim_square_maze;  
                    console.log("current_square: " + current_square);
                    console.log("start_square: " + start_square);
                    squares[start_square].classList.add('backGroundColorCurrent');
                }        
                //If it is a left wall, then the cell to the right should be a valid starting point 
                else if(cell_value == 2){
                    current_square = counter + 1;
                    start_square = counter + 1;  
                    console.log("current_square: " + current_square);
                    console.log("start_square: " + start_square);
                    squares[start_square].classList.add('backGroundColorCurrent');
                }        
                //If it is a right wall, then the cell to the left should be a valid starting point 
                else if(cell_value == 3){
                    current_square = counter - 1;
                    start_square = counter - 1;
                    console.log("current_square: " + current_square);
                    console.log("start_square: " + start_square);  
                    squares[start_square].classList.add('backGroundColorCurrent');
                }        
                //If it is an out wall, then any of the adjacent cells that is not a wall should be a valid starting point 
                //If it is an in wall, then any of the adjacent cells that is not a wall should be a valid starting point
                else if((cell_value == 4) || (cell_value == 5)){
                    let possible_out_door_in_door_start_squares = [counter + dim_square_maze, counter - dim_square_maze, counter + 1, counter - 1];

                    possible_out_door_in_door_start_squares.forEach(s => {
                        if(maze_arrays[current_maze][Math.floor(s / dim_square_maze)][s % dim_square_maze] == 10){
                            current_square = s;
                            start_square = s;          
                        }
                    });

                    squares[start_square].classList.add('backGroundColorCurrent');

                }        


            }

            goal_squares.push(counter);
        }
        else if(cell_value == 66){ //a key
            square.classList.add('backGroundColorKey');
        }

        counter++; 
    
    });
}

function next_is_not_right_boundary(current_square){
    if(((current_square + 1) % dim_square_maze) > (current_square % dim_square_maze)){
        return true;
    }

    return false;
}

function next_is_not_left_boundary(current_square){
    if((current_square % dim_square_maze) == 0){
        return false;
    }

    return true;
}

function next_is_not_up_boundary(current_square){
    if(Math.floor(current_square / dim_square_maze) == 0){
        return false;
    }

    return true;
}

function next_is_not_down_boundary(current_square){
    if(Math.floor(current_square / dim_square_maze) == dim_square_maze){
        return false;
    }

    return true;
}

function right_next_is_not_a_wall(current_square){
    if(maze_arrays[current_maze][Math.floor(current_square / dim_square_maze)][(current_square % dim_square_maze) + 1] == 11){
        return false;
    }

    return true;
}

function left_next_is_not_a_wall(current_square){
    if(maze_arrays[current_maze][Math.floor(current_square / dim_square_maze)][(current_square % dim_square_maze) - 1] == 11){
        return false;
    }

    return true;
}

function up_next_is_not_a_wall(current_square){
    if(maze_arrays[current_maze][(Math.floor(current_square / dim_square_maze)) - 1][(current_square % dim_square_maze)] == 11){
        return false;
    }

    return true;
}

function down_next_is_not_a_wall(current_square){
    let row_to_consider = (Math.floor(current_square / dim_square_maze)) + 1; 

    if(row_to_consider >= dim_square_maze){
        return false;
    }

    if(maze_arrays[current_maze][row_to_consider][(current_square % dim_square_maze)] == 11){
        return false;
    }

    return true;
}

function keyDownHandler(event) {
    if(event.keyCode == 39) { //right
        //check if a valid square
        //a valid square would be a 10 square and also
        //would not to be an edge square, 
        //so if (current_square + 1 % dim_square_maze) > current_square then do it, 
        //else don't do it
        if(next_is_not_right_boundary(current_square) && right_next_is_not_a_wall(current_square)){
            squares[current_square].classList.remove('backGroundColorCurrent');
            squares[current_square].classList.add('backGroundColorEmpty');
            current_square = current_square + 1;
            squares[current_square].classList.add('backGroundColorCurrent');    
        }

    }
    else if(event.keyCode == 37) { //left
        
        if(next_is_not_left_boundary(current_square) && left_next_is_not_a_wall(current_square)){
            squares[current_square].classList.remove('backGroundColorCurrent');
            squares[current_square].classList.add('backGroundColorEmpty');
            current_square = current_square - 1;
            squares[current_square].classList.add('backGroundColorCurrent');
        }

    }
    if(event.keyCode == 40) { //down
        
        if(next_is_not_down_boundary(current_square) && down_next_is_not_a_wall(current_square)){
            squares[current_square].classList.remove('backGroundColorCurrent');
            squares[current_square].classList.add('backGroundColorEmpty');
            current_square = current_square + dim_square_maze;
            squares[current_square].classList.add('backGroundColorCurrent');    
        }

    }
    else if(event.keyCode == 38) { //up

        if(next_is_not_up_boundary(current_square) && up_next_is_not_a_wall(current_square)){
            squares[current_square].classList.remove('backGroundColorCurrent');
            squares[current_square].classList.add('backGroundColorEmpty');
            current_square = current_square - dim_square_maze;
            squares[current_square].classList.add('backGroundColorCurrent');    
        }

    }
}

function determine_next_room_and_door(current_room, exit_door){
    //door_num and current_maze are global
    //could do the array math here once and save in a variable rather than doing every time that you need it below...

    //determine entry door for next room from exit door of current room
    //to oppositize (up <-> down, left <-> right, out <-> in): if door index is odd, subtract one. else, add one
    if((maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] % 2) == 1){ 
        previous_door_num = maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze]; 
        door_num = previous_door_num - 1;
    }
    else{
        previous_door_num = maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze];
        door_num = previous_door_num + 1;
    }

    //determine next maze (room) for each room's exit doors
    if(current_room == 0){
        console.log("exit_door: " + exit_door + " maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze]: " + maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze]);
        if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 0){ //up door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 1){ //down door
            current_maze = 9;
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 2){ //left door
            current_maze = 6;
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 3){ //right door
            current_maze = 3;
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 4){ //out door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 5){ //in door
            console.log("not a valid connection");
        }
        else{
            console.log("not an exit door???");
        }

    }
    else if(current_room == 1){
        if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 0){ //up door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 1){ //down door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 2){ //left door
            current_maze = 7;
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 3){ //right door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 4){ //out door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 5){ //in door
            //KEY BB NEEDED
            current_maze = 2;
        }
        else{
            console.log("not an exit door???");
        }

    }
    else if(current_room == 2){
        if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 0){ //up door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 1){ //down door
            current_maze = 11;
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 2){ //left door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 3){ //right door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 4){ //out door
            //KEY BB NEEDED
            current_maze = 1;
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 5){ //in door
            console.log("not a valid connection");
        }
        else{
            console.log("not an exit door???");
        }

    }
    else if(current_room == 3){
        if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 0){ //up door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 1){ //down door
            current_maze = 12;
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 2){ //left door
            current_maze = 0;
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 3){ //right door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 4){ //out door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 5){ //in door
            console.log("not a valid connection");
        }
        else{
            console.log("not an exit door???");
        }

    }
    else if(current_room == 4){
        if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 0){ //up door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 1){ //down door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 2){ //left door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 3){ //right door
            current_maze = 7;
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 4){ //out door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 5){ //in door
            console.log("not a valid connection");
        }
        else{
            console.log("not an exit door???");
        }

    }
    else if(current_room == 5){
        if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 0){ //up door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 1){ //down door
            current_maze = 14;
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 2){ //left door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 3){ //right door
            current_maze = 8;
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 4){ //out door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 5){ //in door
            console.log("not a valid connection");
        }
        else{
            console.log("not an exit door???");
        }

    }
    else if(current_room == 6){
        if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 0){ //up door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 1){ //down door
            current_maze = 15;
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 2){ //left door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 3){ //right door
            current_maze = 0;
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 4){ //out door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 5){ //in door
            console.log("not a valid connection");
        }
        else{
            console.log("not an exit door???");
        }

    }
    else if(current_room == 7){
        if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 0){ //up door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 1){ //down door
            current_maze = 16;
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 2){ //left door
            current_maze = 4;
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 3){ //right door
            current_maze = 1;
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 4){ //out door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 5){ //in door
            console.log("not a valid connection");
        }
        else{
            console.log("not an exit door???");
        }

    }
    else if(current_room == 8){
        if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 0){ //up door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 1){ //down door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 2){ //left door
            current_maze = 5;
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 3){ //right door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 4){ //out door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 5){ //in door
            console.log("not a valid connection");
        }
        else{
            console.log("not an exit door???");
        }

    }
    else if(current_room == 9){
        if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 0){ //up door
            current_maze = 0;
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 1){ //down door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 2){ //left door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 3){ //right door
            current_maze = 12;
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 4){ //out door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 5){ //in door
            console.log("not a valid connection");
        }
        else{
            console.log("not an exit door???");
        }

    }
    else if(current_room == 10){
        if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 0){ //up door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 1){ //down door
            current_maze = 19;
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 2){ //left door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 3){ //right door
            current_maze = 13;
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 4){ //out door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 5){ //in door
            current_maze = 11;
        }
        else{
            console.log("not an exit door???");
        }

    }
    else if(current_room == 11){
        if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 0){ //up door
            current_maze = 2;
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 1){ //down door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 2){ //left door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 3){ //right door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 4){ //out door
            current_maze = 10;
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 5){ //in door
            console.log("not a valid connection");
        }
        else{
            console.log("not an exit door???");
        }

    }
    else if(current_room == 12){
        if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 0){ //up door
            current_maze = 3;
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 1){ //down door
            current_maze = 21;
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 2){ //left door
            current_maze = 9;
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 3){ //right door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 4){ //out door
            current_maze = 14;
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 5){ //in door
            console.log("not a valid connection");
        }
        else{
            console.log("not an exit door???");
        }

    }
    else if(current_room == 13){
        if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 0){ //up door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 1){ //down door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 2){ //left door
            current_maze = 10;
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 3){ //right door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 4){ //out door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 5){ //in door
            //KEY CC NEEDED
            current_maze = 14;
        }
        else{
            console.log("not an exit door???");
        }

    }
    else if(current_room == 14){
        if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 0){ //up door
            current_maze = 5;
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 1){ //down door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 2){ //left door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 3){ //right door
            current_maze = 17;
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 4){ //out door
            //KEY CC NEEDED
            current_maze = 13;
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 5){ //in door
            current_maze = 12;
        }
        else{
            console.log("not an exit door???");
        }

    }
    else if(current_room == 15){
        if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 0){ //up door
            current_maze = 6;
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 1){ //down door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 2){ //left door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 3){ //right door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 4){ //out door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 5){ //in door
            //KEY AA NEEDED
            current_maze = 16;
        }
        else{
            console.log("not an exit door???");
        }

    }
    else if(current_room == 16){
        if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 0){ //up door
            current_maze = 7;
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 1){ //down door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 2){ //left door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 3){ //right door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 4){ //out door
            //KEY AA NEEDED
            current_maze = 15;
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 5){ //in door
            console.log("not a valid connection");
        }   
        else{
            console.log("not an exit door???");
        }

    }
    else if(current_room == 17){
        if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 0){ //up door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 1){ //down door
            current_maze = 26;
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 2){ //left door
            current_maze = 14;
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 3){ //right door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 4){ //out door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 5){ //in door
            console.log("not a valid connection");
        }
        else{
            console.log("not an exit door???");
        }

    }
    else if(current_room == 18){
        if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 0){ //up door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 1){ //down door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 2){ //left door
            current_maze = 24;
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 3){ //right door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 4){ //out door
            //KEY DD NEEDED
            current_maze = 20;
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 5){ //in door
            console.log("not a valid connection");
        }
        else{
            console.log("not an exit door???");
        }

    }
    else if(current_room == 19){
        if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 0){ //up door
            current_maze = 10;
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 1){ //down door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 2){ //left door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 3){ //right door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 4){ //out door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 5){ //in door
            console.log("not a valid connection");
        }
        else{
            console.log("not an exit door???");
        }

    }
    else if(current_room == 20){
        if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 0){ //up door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 1){ //down door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 2){ //left door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 3){ //right door
            current_maze = 23;
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 4){ //out door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 5){ //in door
            //KEY DD NEEDED
            current_maze = 18;
        }
        else{
            console.log("not an exit door???");
        }

    }
    else if(current_room == 21){
        if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 0){ //up door
            current_maze = 12;
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 1){ //down door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 2){ //left door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 3){ //right door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 4){ //out door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 5){ //in door
            current_maze = 22;
        }
        else{
            console.log("not an exit door???");
        }

    }
    else if(current_room == 22){
        if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 0){ //up door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 1){ //down door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 2){ //left door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 3){ //right door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 4){ //out door
            current_maze = 21;
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 5){ //in door
            console.log("not a valid connection");
        }
        else{
            console.log("not an exit door???");
        }

    }
    else if(current_room == 23){
        if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 0){ //up door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 1){ //down door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 2){ //left door
            current_maze = 20;
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 3){ //right door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 4){ //out door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 5){ //in door
            console.log("not a valid connection");
        }
        else{
            console.log("not an exit door???");
        }

    }
    else if(current_room == 24){
        if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 0){ //up door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 1){ //down door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 2){ //left door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 3){ //right door
            current_maze = 18;
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 4){ //out door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 5){ //in door
            current_maze = 25;
        }
        else{
            console.log("not an exit door???");
        }

    }
    else if(current_room == 25){
        if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 0){ //up door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 1){ //down door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 2){ //left door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 3){ //right door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 4){ //out door
            current_maze = 24;
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 5){ //in door
            current_maze = 26;
        }
        else{
            console.log("not an exit door???");
        }

    }
    else if(current_room == 26){
        if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 0){ //up door
            current_maze = 17;
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 1){ //down door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 2){ //left door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 3){ //right door
            console.log("not a valid connection");
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 4){ //out door
            current_maze = 25;
        }
        else if(maze_arrays[current_maze][Math.floor(exit_door / dim_square_maze)][exit_door % dim_square_maze] == 5){ //in door
            console.log("not a valid connection");
        }
        else{
            console.log("not an exit door???");
        }

    }
    else{
        console.log("not a valid room number???");
    }

}

function walk_maze(){
    //check for key 
    //also checking if key has already been found otherwise not bothering talking
    if(maze_arrays[current_maze][Math.floor(current_square / dim_square_maze)][current_square % dim_square_maze] == 66){
        //key AA
        if(current_maze == 21 && doors_locked_or_open[15] == 0){
            doors_locked_or_open[15] = 1;    
            doors_locked_or_open[16] = 1;    
            console.log("key AA found");
            alert("key needed for passage between 1,2,0 (15) and 1,2,1 (16) found!");
        }
        //key BB
        else if(current_maze == 8 && doors_locked_or_open[1] == 0){
            doors_locked_or_open[1] = 1;    
            doors_locked_or_open[2] = 1;
            console.log("key BB found");    
            alert("key needed for passage between 0,0,1 (1) and 0,0,2 (2) found!");
        }
        //key CC
        else if(current_maze == 4 && doors_locked_or_open[13] == 0){
            doors_locked_or_open[13] = 1;    
            doors_locked_or_open[14] = 1;
            console.log("key CC found");    
            alert("key needed for passage between 1,1,1 (13) and 1,1,2 (14) found!");
        }
        //key DD
        else if(current_maze == 19 && doors_locked_or_open[18] == 0){
            doors_locked_or_open[18] = 1;    
            doors_locked_or_open[20] = 1;
            console.log("key DD found");    
            alert("key needed for passage between 2,0,0 (18) and 2,0,2 (20) found!");
        }
    }

    if(goal_squares.includes(current_square)){
        //set current_maze and door_num based on the cube architecture

        //check for locked door and if door is locked
        //key AA needed
        if(current_maze == 15 && maze_arrays[current_maze][Math.floor(current_square / dim_square_maze)][current_square % dim_square_maze] == 5 && doors_locked_or_open[current_maze] == 0){
            //then display a message about the door being locked and the room that the player can find the key in
            console.log(current_square);
            alert("sorry door is locked, need key found in room 2,1,0 (21)");
            //set door square's color back
            squares[current_square].classList.remove('backGroundColorCurrent');
            squares[current_square].classList.add('backGroundColorFinish');
            //and move the player off of the door square
            current_square = current_square - dim_square_maze;
            squares[current_square].classList.add('backGroundColorCurrent');
        }
        else if(current_maze == 16 && maze_arrays[current_maze][Math.floor(current_square / dim_square_maze)][current_square % dim_square_maze] == 4 && doors_locked_or_open[current_maze] == 0){
            //then display a message about the door being locked and the room that the player can find the key in
            alert("sorry door is locked, need key found in room 2,1,0 (21)");
            //set door square's color back
            squares[current_square].classList.remove('backGroundColorCurrent');
            squares[current_square].classList.add('backGroundColorFinish');
            //and move the player off of the door square
            current_square = current_square + dim_square_maze;
            squares[current_square].classList.add('backGroundColorCurrent');
        }
        //key BB needed
        else if(current_maze == 1 && maze_arrays[current_maze][Math.floor(current_square / dim_square_maze)][current_square % dim_square_maze] == 5 && doors_locked_or_open[current_maze] == 0){
            //then display a message about the door being locked and the room that the player can find the key in
            alert("sorry door is locked, need key found in room 0,2,2 (8)");
            //set door square's color back
            squares[current_square].classList.remove('backGroundColorCurrent');
            squares[current_square].classList.add('backGroundColorFinish');
            //and move the player off of the door square
            current_square = current_square + dim_square_maze;
            squares[current_square].classList.add('backGroundColorCurrent');
        }
        else if(current_maze == 2 && maze_arrays[current_maze][Math.floor(current_square / dim_square_maze)][current_square % dim_square_maze] == 4 && doors_locked_or_open[current_maze] == 0){
            //then display a message about the door being locked and the room that the player can find the key in
            alert("sorry door is locked, need key found in room 0,2,2 (8)");
            //set door square's color back
            squares[current_square].classList.remove('backGroundColorCurrent');
            squares[current_square].classList.add('backGroundColorFinish');
            //and move the player off of the door square
            current_square = current_square + dim_square_maze;
            squares[current_square].classList.add('backGroundColorCurrent');
        }
        //key CC needed
        else if(current_maze == 13 && maze_arrays[current_maze][Math.floor(current_square / dim_square_maze)][current_square % dim_square_maze] == 5 && doors_locked_or_open[current_maze] == 0){
            //then display a message about the door being locked and the room that the player can find the key in
            alert("sorry door is locked, need key found in room 0,1,1 (4)");
            //set door square's color back
            squares[current_square].classList.remove('backGroundColorCurrent');
            squares[current_square].classList.add('backGroundColorFinish');
            //and move the player off of the door square
            current_square = current_square + dim_square_maze;
            squares[current_square].classList.add('backGroundColorCurrent');        
        }
        else if(current_maze == 14 && maze_arrays[current_maze][Math.floor(current_square / dim_square_maze)][current_square % dim_square_maze] == 4 && doors_locked_or_open[current_maze] == 0){
            //then display a message about the door being locked and the room that the player can find the key in
            alert("sorry door is locked, need key found in room 0,1,1 (4)");
            //set door square's color back
            squares[current_square].classList.remove('backGroundColorCurrent');
            squares[current_square].classList.add('backGroundColorFinish');
            //and move the player off of the door square
            current_square = current_square + dim_square_maze;
            squares[current_square].classList.add('backGroundColorCurrent');        
        }
        //key DD needed
        else if(current_maze == 18 && maze_arrays[current_maze][Math.floor(current_square / dim_square_maze)][current_square % dim_square_maze] == 4 && doors_locked_or_open[current_maze] == 0){
            //then display a message about the door being locked and the room that the player can find the key in
            alert("sorry door is locked, need key found in room 2,0,1 (19)");
            //set door square's color back
            squares[current_square].classList.remove('backGroundColorCurrent');
            squares[current_square].classList.add('backGroundColorFinish');
            //and move the player off of the door square
            current_square = current_square - dim_square_maze;
            squares[current_square].classList.add('backGroundColorCurrent');        
        }
        else if(current_maze == 20 && maze_arrays[current_maze][Math.floor(current_square / dim_square_maze)][current_square % dim_square_maze] == 5 && doors_locked_or_open[current_maze] == 0){
            //then display a message about the door being locked and the room that the player can find the key in
            alert("sorry door is locked, need key found in room 2,0,1 (19)");
            //set door square's color back
            squares[current_square].classList.remove('backGroundColorCurrent');
            squares[current_square].classList.add('backGroundColorFinish');
            //and move the player off of the door square
            current_square = current_square + dim_square_maze;
            squares[current_square].classList.add('backGroundColorCurrent');        
        }
        //no key needed
        else{ 
            //can do the customized message at the beginning of the draw_maze function

            //start over
            counter = 0;

            //clear all background colors to redraw        
            squares.forEach(square => {
                square.classList.remove('backGroundColorCurrent');
                square.classList.remove('backGroundColorEmpty');
                square.classList.remove('backGroundColorWall');
                square.classList.remove('backGroundColorFinish');
                square.classList.remove('backGroundColorKey');
            });

            previous_maze_num = current_maze;
            determine_next_room_and_door(current_maze, current_square);

            console.log("current_maze: " + current_maze + " current_square: " + current_square);

            draw_maze();
        }

    }

};

document.addEventListener("keydown", (flam) => {
    keyDownHandler(flam);
});

draw_maze();

let lets_go = setInterval(walk_maze, 100);

