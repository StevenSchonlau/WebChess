let font;
let textLayer;

let container;
let w;
let h;
let border;

let angle = 0;

let selected = '--';

let pieces = [
  ['br','bn','bb','bq','bk','bb','bn','br'],
  ['bp','bp','bp','bp','bp','bp','bp','bp'],
  ['--','--','--','--','--','--','--','--'],
  ['--','--','--','--','--','--','--','--'],
  ['--','--','--','--','--','--','--','--'],
  ['--','--','--','--','--','--','--','--'],
  ['wp','wp','wp','wp','wp','wp','wp','wp'],
  ['wr','wn','wb','wq','wk','wb','wn','wr'],
];
let bcaptured = [];
let wcaptured = [];

function updateContainer() {
  container = select('#sketchContainer');
  w = parseFloat(getComputedStyle(container.elt).getPropertyValue('width'));
  h = parseFloat(getComputedStyle(container.elt).getPropertyValue('height'));
}

function windowResized() {
  updateContainer();
  resizeCanvas(w, h);
}

function setup() {
  updateContainer();
  canvas = createCanvas(w, h);
  smooth();
  canvas.parent("#sketchContainer");
}

function draw() {
  background("#DDDDDD");
  stroke('#222831');
  noFill();
  strokeWeight(5);
  rectMode("corners");
  rect(0, 0, width, height);
  strokeWeight(1);
  for(let i = 0; i < 8; i++){
    for(let j = 0; j < 8; j++) {
      if (selected != '--' && j == selected[0] && i == selected[1]) {
        fill('#222266')
      } else if ((i+j) % 2 == 0) {
        fill('#222222');
      } else {
        fill('#BBBBBB');
      }
      rect((w/8) * i, (h/8) * j, (w/8) * (i+1), (h/8) *(j+1));
      fill('#888888');
      textSize(20);
      text(pieces[j][i], (w/8)*i, (h/8)*j, (w/8) * (i+1), (h/8) *(j+1));
    }
  }
  if (selected != '--') {
    print(selected);
    var movearr = checkMove();
    if (movearr != '--') {
      print(movearr);
      for(let i = 0; i < movearr.length; i++){
        print("something");
        fill('#6666AA');
        circle((w/8) * Number(movearr[i][1]) + (w/16), (h/8) * Number(movearr[i][0]) + (h/16), w/20);
      }
    }
  }
}

function mouseClicked() {
  for(let i = 0; i < 8; i++){
    for(let j = 0; j < 8; j++) {
      if((w/8) * j < mouseX && (h/8) * i < mouseY && (w/8) * (j+1) > mouseX && (h/8) *(i+1) > mouseY) {
        if (selected != '--') {
          var movearr = checkMove();
          let found = false;
          for (let k = 0; k < movearr.length; k++) {
            if (i == movearr[k][0] && j == movearr[k][1]) {
              found = true;
            }
          }
          if (found) {
            if (pieces[i][j] != '--') {
              if (pieces[i][j][1] == 'w') {
                wcaptured.push(pieces[i][j]);
              } else {
                bcaptured.push(pieces[i][j]);
              }
            }
            pieces[i][j] = pieces[selected[0]][selected[1]];
            pieces[selected[0]][selected[1]] = '--';
            selected = '--';
            return;
          } else {
            selected = "" + i + "" + j;
            return;
          }
        } else {
          selected = "" + i + "" + j;
          return;
        }
      }
    }
  }
  selected = '--';
}

function checkMove() {
  print("hello");
  if (pieces[selected[0]][selected[1]] == '--') {
    print("nothing selected");
    return ['--'];
  }
  print(pieces[selected[0]][selected[1]][1]);
  if (pieces[selected[0]][selected[1]][1] == 'p') {
    print(selected[0] + " " + selected[1]);
    return pawnMove(selected[0], selected[1]);
  }
  if (pieces[selected[0]][selected[1]][1] == 'r') {
    return rookMove(selected[0], selected[1]);
  }
  if (pieces[selected[0]][selected[1]][1] == 'b') {
    return bishopMove(selected[0], selected[1]);
  }
  if (pieces[selected[0]][selected[1]][1] == 'n') {
    return moveKnight(selected[0], selected[1]);
  }
  if (pieces[selected[0]][selected[1]][1] == 'q') {
    return moveQueen(selected[0], selected[1]);
  }
  if (pieces[selected[0]][selected[1]][1] == 'k') {
    return moveKing(selected[0], selected[1]);
  }
}

function colorAlpha(aColor, alpha) {
  // allows usage of HEX colors with alpha
  const c = color(aColor);
  let a = alpha;
  if (alpha <= 0.1) {
    a = 0.1;
  }
  return color('rgba(${[red(c), green(c), blue(c), a].join(', ')})');
}

//returns array of possible moves in 2 char array for pawn at p1 p2
//need to add au pasante
function pawnMove(p1, p2) {
  var returnarr = new Array();
  if (pieces[Number(p1)][p2][0] == 'w') {
    if (p2 != 7) {
      if (pieces[Number(p1) - 1][Number(p2) + 1] != '--' && pieces[Number(p1) - 1][Number(p2) + 1][0] != 'w') { //pawn attack right
        if (check_king('w', p1, p2, Number(p1) - 1, Number(p2) + 1)) {
          returnarr.push("" + (Number(p1) - 1) + "" + (Number(p2) + 1));
        }
      }
    }
    if (p2 != 0) {
      if (pieces[Number(p1) - 1][Number(p2) - 1] != '--' && pieces[Number(p1) - 1][Number(p2) - 1][0] != 'w') { //pawn attack left
        if (check_king('w', p1, p2, Number(p1) - 1, Number(p2) - 1)) {
          returnarr.push("" + (Number(p1) - 1) + "" + (Number(p2) - 1));
        }
      }
    }
    if (pieces[Number(p1) - 1][Number(p2)] == '--') { //pawn go forward
      if (check_king('w', p1, p2, Number(p1) - 1, p2)) {
        returnarr.push("" + (Number(p1) - 1) + "" + (p2));
      }
    }
    if (p1 == 6 && pieces[Number(p1)-2][Number(p2)] == '--') { //first move 2 spaces
      if (check_king('w', p1, p2, Number(p1) - 2, p2)) {
        returnarr.push("" + (Number(p1) - 2) + "" + (p2));
      }
    }
  } else {
    print("p1:" + (Number(p1)+1) + " " + "p2:" + Number(p1) + " " + pieces[Number(p1) + 1]);
    if (p2 != 7) {
      if (pieces[Number(p1) + 1][Number(p2) + 1] != '--' && pieces[Number(p1) + 1][Number(p2) + 1][0] != 'b') { //pawn attack right
        if (check_king('b', p1, p2, Number(p1) + 1, Number(p2) + 1)) {
          returnarr.push("" + (Number(p1) + 1) + "" + (Number(p2) + 1));
        }
      }
    }
    if (p2 != 0) {
      if (pieces[Number(p1) + 1][Number(p2) - 1] != '--' && pieces[Number(p1) + 1][Number(p2) - 1][0] != 'b') { //pawn attack left
        if (check_king('b', p1, p2, Number(p1) + 1, Number(p2) - 1)) {
          returnarr.push("" + (Number(p1) + 1) + "" + (Number(p2) - 1));
        }
      }
    }
    if (pieces[Number(p1) + 1][Number(p2)] == '--') { //pawn go forward
      if (check_king('b', p1, p2, Number(p1) + 1, p2)) {
        returnarr.push("" + (Number(p1) + 1) + "" + (p2));
      }
    }
    if (p1 == 1 && pieces[Number(p1)+2][Number(p2)] == '--') { //first move 2 spaces
      if (check_king('b', p1, p2, Number(p1) + 2, p2)) {
        returnarr.push("" + (Number(p1) + 2) + "" + (p2));
      }
    }
  }
  return returnarr;
}

//changes pawn that makes it all the way across to user input
function pawn_input(side, p1, p2) {
  print("good job");
}

//rook movement
function rookMove(p1, p2) {
  var returnarr = new Array();
  let side = '--';
  if (pieces[Number(p1)][Number(p2)][0] == 'w') {
    side = 'w';
  } else {
    side = 'b';
  }
  for(let i = Number(p1) +1; i <= 7; i++) { //moving to the right
    if(pieces[i][Number(p2)] != '--') { //can't move past piece
      if (check_king(side, p1, p2, i, p2) && pieces[i][Number(p2)][0] != side) {
        returnarr.push("" + i + "" + p2);
      }
      break;
    }
    if (check_king(side, p1, p2, i, p2)) {
      returnarr.push("" + i + "" + p2);
    }
  }
  for(let i = Number(p1) -1; i >= 0; i--) { //moving to the left
    if(pieces[i][Number(p2)] != '--') { //can't move past piece
      if (check_king(side, p1, p2, i, p2) && pieces[i][Number(p2)][0] != side) {
        returnarr.push("" + i + "" + p2);
      }
      break;
    }
    if (check_king(side, p1, p2, i, p2)) {
      returnarr.push("" + i + "" + p2);
    }
  }
  for(let i = Number(p2) +1; i <= 7; i++) { //moving down
    if(pieces[Number(p1)][i] != '--') { //can't move past piece
      if (check_king(side, p1, p2, p1, i) && pieces[Number(p1)][i][0] != side) {
        returnarr.push("" + Number(p1) + "" + i);
      }
      break;
    }
    if (check_king(side, p1, p2, p1, i)) { //moving up
      returnarr.push("" + Number(p1) + "" + i);
    }
  }
  for(let i = Number(p2) -1; i >= 0; i--) {
    if(pieces[Number(p1)][i] != '--') { //can't move past piece
      if (check_king(side, p1, p2, p1, i) && pieces[Number(p1)][i][0] != side) {
        returnarr.push("" + Number(p1) + "" + i);
      }
      break;
    }
    if (check_king(side, p1, p2, p1, i)) {
      returnarr.push("" + Number(p1) + "" + i);
    }
  }
  return returnarr;
}

function bishopMove(p1, p2) {
  var returnarr = new Array();
  var side = '--';
  if (pieces[Number(p1)][Number(p2)][0] == 'w') {
    side = 'w';
  } else {
    side = 'b';
  }
  for (let i = 1; i <= 7; i++) {
    if(Number(p1) + i > 7 || Number(p2) + i > 7) {
      break;
    }
    if(pieces[Number(p1) + i][Number(p2) + i] != '--') { //can't move past piece
      if (check_king(side, p1, p2, Number(p1) + i, Number(p2) + i) && pieces[Number(p1) + i][Number(p2) + i][0] != side) {
        returnarr.push("" + (Number(p1) + i) + "" + (Number(p2) + i));
      }
      break;
    }
    if (check_king(side, p1, p2, Number(p1) + i, Number(p2) + i)) {
      returnarr.push("" + (Number(p1) + i) + "" + (Number(p2) + i));
    }
  }
  for (let i = 1; i <= 7; i++) {
    if(Number(p1) - i < 0 || Number(p2) - i < 0) {
      break;
    }
    if(pieces[Number(p1) - i][Number(p2) - i] != '--') { //can't move past piece
      if (check_king(side, p1, p2, Number(p1) - i, Number(p2) - i) && pieces[Number(p1) - i][Number(p2) - i][0] != side) {
        returnarr.push("" + (Number(p1) - i) + "" + (Number(p2) - i));
      }
      break;
    }
    
    if (check_king(side, p1, p2, Number(p1) - i, Number(p2) - i)) {
      returnarr.push("" + (Number(p1) - i) + "" + (Number(p2) - i));
    }
  }
  for (let i = 1; i <= 7; i++) {
    if(Number(p1) - i < 0 || Number(p2) + i > 7) {
      break;
    }
    if(pieces[Number(p1) - i][Number(p2) + i] != '--') { //can't move past piece
      if (check_king(side, p1, p2, Number(p1) - i, Number(p2) + i) && pieces[Number(p1) - i][Number(p2) + i][0] != side) {
        returnarr.push("" + (Number(p1) - i) + "" + (Number(p2) + i));
      }
      break;
    }
    
    if (check_king(side, p1, p2, Number(p1) - i, Number(p2) + i)) {
      returnarr.push("" + (Number(p1) - i) + "" + (Number(p2) + i));
    }
  }
  for (let i = 1; i <= 7; i++) {
    if(Number(p1) + i > 7 || Number(p2) - i < 0) {
      break;
    }
    if(pieces[Number(p1) + i][Number(p2) - i] != '--') { //can't move past piece
      if (check_king(side, p1, p2, Number(p1) + i, Number(p2) - i) && pieces[Number(p1) + i][Number(p2) - i][0] != side) {
        returnarr.push("" + (Number(p1) + i) + "" + (Number(p2) - i));
      }
      break;
    }
    
    if (check_king(side, p1, p2, Number(p1) + i, Number(p2) - i)) {
      returnarr.push("" + (Number(p1) + i) + "" + (Number(p2) - i));
    }
  }
  
  return returnarr;
}

function moveKnight(p1, p2) {
  var returnarr = new Array();
  var side = '--';
  if (pieces[Number(p1)][Number(p2)][0] == 'w') {
    side = 'w';
  } else {
    side = 'b';
  }
  if (Number(p1) +1 <= 7 && Number(p2) +2 <=7) {
    if (check_king(side, p1, p2, Number(p1) + 1, Number(p2) + 2) && pieces[Number(p1) + 1][Number(p2) + 2][0] != side) {
      returnarr.push("" + (Number(p1) + 1) + "" + (Number(p2) + 2));
    }
  }
  if (Number(p1) -1 >= 0 && Number(p2) +2 <=7) {
    if (check_king(side, p1, p2, Number(p1) - 1, Number(p2) + 2) && pieces[Number(p1) - 1][Number(p2) + 2][0] != side) {
      returnarr.push("" + (Number(p1) - 1) + "" + (Number(p2) + 2));
    }
  }
  if (Number(p1) +1 <= 7 && Number(p2) -2 >= 0) {
    if (check_king(side, p1, p2, Number(p1) + 1, Number(p2) - 2) && pieces[Number(p1) + 1][Number(p2) - 2][0] != side) {
      returnarr.push("" + (Number(p1) + 1) + "" + (Number(p2) - 2));
    }
  }
  if (Number(p1) -1 >= 0 && Number(p2) -2 >= 0) {
    if (check_king(side, p1, p2, Number(p1) - 1, Number(p2) - 2) && pieces[Number(p1) - 1][Number(p2) - 2][0] != side) {
      returnarr.push("" + (Number(p1) - 1) + "" + (Number(p2) - 2));
    }
  }
  if (Number(p1) +2 <= 7 && Number(p2) +1 <=7) {
    if (check_king(side, p1, p2, Number(p1) + 2, Number(p2) + 1) && pieces[Number(p1) + 2][Number(p2) + 1][0] != side) {
      returnarr.push("" + (Number(p1) + 2) + "" + (Number(p2) + 1));
    }
  }
  if (Number(p1) -2 >= 0 && Number(p2) +1 <=7) {
    if (check_king(side, p1, p2, Number(p1) - 2, Number(p2) + 1) && pieces[Number(p1) -2][Number(p2) + 1][0] != side) {
      returnarr.push("" + (Number(p1) - 2) + "" + (Number(p2) + 1));
    }
  }
  if (Number(p1) +2 <= 7 && Number(p2) -1 >= 0) {
    if (check_king(side, p1, p2, Number(p1) + 2, Number(p2) - 1) && pieces[Number(p1) + 2][Number(p2) -1][0] != side) {
      returnarr.push("" + (Number(p1) + 2) + "" + (Number(p2) - 1));
    }
  }
  if (Number(p1) -2 >= 0 && Number(p2) -1 >= 0) {
    if (check_king(side, p1, p2, Number(p1) - 2, Number(p2) - 1) && pieces[Number(p1) -2][Number(p2) -1][0] != side) {
      returnarr.push("" + (Number(p1) - 2) + "" + (Number(p2) - 1));
    }
  }
  return returnarr;
}

function moveKing(p1, p2) {
  var returnarr = new Array();
  var side = '--';
  if (pieces[Number(p1)][Number(p2)][0] == 'w') {
    side = 'w';
  } else {
    side = 'b';
  }
  for(let i = -1; i <= 1; i++) {
    if (Number(p1) + i > 7 || Number(p1) + i < 0){
      continue;
    }
    for(let j = -1; j <= 1; j++){
      if (Number(p2) + j > 7 || Number(p2) + j < 0){
        continue;
      } else {
        if(check_king(side, p1, p2, Number(p1) +i, Number(p2) +j) && pieces[Number(p1)+i][Number(p2)+j][0] != side) {
          returnarr.push("" + (Number(p1) +i) + "" + (Number(p2) +j));
        }
      }
    }
  }
  return returnarr;
}

function moveQueen(p1, p2) {
  var returnarr = new Array();
  var side = '--';
  if (pieces[Number(p1)][Number(p2)][0] == 'w') {
    side = 'w';
  } else {
    side = 'b';
  }
  //rook movements:
  for(let i = Number(p1) +1; i <= 7; i++) { //moving to the right
    if(pieces[i][Number(p2)] != '--') { //can't move past piece
      if (check_king(side, p1, p2, i, p2) && pieces[i][Number(p2)][0] != side) {
        returnarr.push("" + i + "" + p2);
      }
      break;
    }
    if (check_king(side, p1, p2, i, p2)) {
      returnarr.push("" + i + "" + p2);
    }
  }
  for(let i = Number(p1) -1; i >= 0; i--) { //moving to the left
    if(pieces[i][Number(p2)] != '--') { //can't move past piece
      if (check_king(side, p1, p2, i, p2) && pieces[i][Number(p2)][0] != side) {
        returnarr.push("" + i + "" + p2);
      }
      break;
    }
    if (check_king(side, p1, p2, i, p2)) {
      returnarr.push("" + i + "" + p2);
    }
  }
  for(let i = Number(p2) +1; i <= 7; i++) { //moving down
    if(pieces[Number(p1)][i] != '--') { //can't move past piece
      if (check_king(side, p1, p2, p1, i) && pieces[Number(p1)][i][0] != side) {
        returnarr.push("" + Number(p1) + "" + i);
      }
      break;
    }
    if (check_king(side, p1, p2, p1, i)) { //moving up
      returnarr.push("" + Number(p1) + "" + i);
    }
  }
  for(let i = Number(p2) -1; i >= 0; i--) {
    if(pieces[Number(p1)][i] != '--') { //can't move past piece
      if (check_king(side, p1, p2, p1, i) && pieces[Number(p1)][i][0] != side) {
        returnarr.push("" + Number(p1) + "" + i);
      }
      break;
    }
    if (check_king(side, p1, p2, p1, i)) {
      returnarr.push("" + Number(p1) + "" + i);
    }
  }
  //bishop moves:
  for (let i = 1; i <= 7; i++) {
    if(Number(p1) + i > 7 || Number(p2) + i > 7) {
      break;
    }
    if(pieces[Number(p1) + i][Number(p2) + i] != '--') { //can't move past piece
      if (check_king(side, p1, p2, Number(p1) + i, Number(p2) + i) && pieces[Number(p1) + i][Number(p2) + i][0] != side) {
        returnarr.push("" + (Number(p1) + i) + "" + (Number(p2) + i));
      }
      break;
    }
    if (check_king(side, p1, p2, Number(p1) + i, Number(p2) + i)) {
      returnarr.push("" + (Number(p1) + i) + "" + (Number(p2) + i));
    }
  }
  for (let i = 1; i <= 7; i++) {
    if(Number(p1) - i < 0 || Number(p2) - i < 0) {
      break;
    }
    if(pieces[Number(p1) - i][Number(p2) - i] != '--') { //can't move past piece
      if (check_king(side, p1, p2, Number(p1) - i, Number(p2) - i) && pieces[Number(p1) - i][Number(p2) - i][0] != side) {
        returnarr.push("" + (Number(p1) - i) + "" + (Number(p2) - i));
      }
      break;
    }
    
    if (check_king(side, p1, p2, Number(p1) - i, Number(p2) - i)) {
      returnarr.push("" + (Number(p1) - i) + "" + (Number(p2) - i));
    }
  }
  for (let i = 1; i <= 7; i++) {
    if(Number(p1) - i < 0 || Number(p2) + i > 7) {
      break;
    }
    if(pieces[Number(p1) - i][Number(p2) + i] != '--') { //can't move past piece
      if (check_king(side, p1, p2, Number(p1) - i, Number(p2) + i) && pieces[Number(p1) - i][Number(p2) + i][0] != side) {
        returnarr.push("" + (Number(p1) - i) + "" + (Number(p2) + i));
      }
      break;
    }
    
    if (check_king(side, p1, p2, Number(p1) - i, Number(p2) + i)) {
      returnarr.push("" + (Number(p1) - i) + "" + (Number(p2) + i));
    }
  }
  for (let i = 1; i <= 7; i++) {
    if(Number(p1) + i > 7 || Number(p2) - i < 0) {
      break;
    }
    if(pieces[Number(p1) + i][Number(p2) - i] != '--') { //can't move past piece
      if (check_king(side, p1, p2, Number(p1) + i, Number(p2) - i) && pieces[Number(p1) + i][Number(p2) - i][0] != side) {
        returnarr.push("" + (Number(p1) + i) + "" + (Number(p2) - i));
      }
      break;
    }
    
    if (check_king(side, p1, p2, Number(p1) + i, Number(p2) - i)) {
      returnarr.push("" + (Number(p1) + i) + "" + (Number(p2) - i));
    }
  }
  
  return returnarr;
}

//checks if the move specified by p1 and p2 would have the king in check (includes king moves)
function check_king(side, place1, place2, dest1, dest2) {
  //make copy of board with move:
  var board = [[],[],[],[],[],[],[],[]];
  for(let i = 0; i < 8; i++) {
    for(let j = 0; j < 8; j++) {
      board[i][j] = pieces[i][j]
    }
  }
  board[dest1][dest2] = board[place1][place2];
  board[place1][place2] = '--';
  //find king in new board
  let p1 = 0;
  let p2 = 0;
  for(let i = 0; i <= 7; i++) {
    for (let j = 0; j <= 7; j++) {
      if (board[i][j] == side + "k") {
        p1 = i;
        p2 = j;
        break;
      }
    }
  }

  //check all other pieces
  for(let i = 0; i <= 7; i++) {
    for(let j = 0; j <= 7; j++) {
      if (board[i][j][0] != side) {
        if (board[i][j][1] == 'p') { //pawns
          if (side == 'w') {
            if (i == Number(p1) - 1 && (j == Number(p1) - 1 || j == Number(p1) + 1)) {
              return false;
            }
          } else {
            if (i == Number(p1) + 1 && (j == Number(p1) - 1 || j == Number(p1) + 1)) {
              return false;
            }
          }
        }
        if (board[i][j][1] == 'r' || board[i][j][1] == 'q') { //rooks or queens
          if (i == p1) {
            if (p1 > i) {
              for (let k = j + 1; k < p2; k++) {
                if (board[i][k] != '--') {
                  break;
                }
                if (k == Number(p1) - 1) {
                  return false;
                }
              }
            } else {
              for (let k = j + 1; k < p2; k--) {
                if (board[i][k] != '--') {
                  break;
                }
                if (k == Number(p1) + 1) {
                  return false;
                }
              }
            }
          }
          if (j == p2) {
            if (i < p1) {
              for (let k = i + 1; k < p1; k++) {
                if (board[i][k] != '--') {
                  break;
                }
                if (k == Number(p1) - 1) {
                  return false;
                }
              }
            } else {
              for (let k = i + 1; k < p1; k--) {
                if (board[i][k] != '--') {
                  break;
                }
                if (k == Number(p1) + 1) {
                  return false;
                }
              }
            }
          }
        }
        if (board[i][j][1] == 'b' || board[i][j][1] == 'q') { //bishops or queens
          if (abs(j-p2) == abs(i-p1)) {
            if (j < p2) {
              if (i < p1) {
                for (let k = 1; k < abs(Number(p1) - i); k++) {
                  if (board[i+k][j+k] != '--') {
                    break;
                  }
                  if (k == abs(Number(p1) -i)-1) {
                    return false;
                  }
                }
              } else {
                for (let k = 1; k < abs(Number(p1) - i); k++) {
                  if (board[i-k][j+k] != '--') {
                    break;
                  }
                  if (k == abs(Number(p1) -i)-1) {
                    return false;
                  }
                }
              }
            } else {
              if (i < p1) {
                for (let k = 1; k < abs(Number(p1) - i); k++) {
                  if (board[i+k][j-k] != '--') {
                    break;
                  }
                  if (k == abs(Number(p1) -i)-1) {
                    return false;
                  }
                }
              } else {
                for (let k = 1; k < abs(Number(p1) - i); k++) {
                  if (board[i-k][j-k] != '--') {
                    break;
                  }
                  if (k == abs(Number(p1) -i)-1) {
                    return false;
                  }
                }
              }
            }
          }
        }
        if (board[i][j][1] == 'n') { //knights
          if ((i + 1 == p1 && j + 2 == p2) || (i+1 == p1 && j-2 == p2) || (i-1 == p1 && j+2 == p2) || (i-1 == p2 && j-2 == p2) ||
              (i + 2 == p1 && j + 1 == p2) || (i+2 == p1 && j-1 == p2) || (i-2 == p1 && j+1 == p2) || (i-2 == p2 && j-1 == p2)) {
            return false;
          }
        }
        if (board[i][j][1] == 'k') { //king
          if (abs(i-p1) == 1 && abs(j-p2)) { //within 1 square
            return false;
          }
        }
        //end pieces
      } //for loop
    } //for loop
  } //check if other side
  return true;
}