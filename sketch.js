let font;
let textLayer;

let container;
let w;
let h;
let border;

let angle = 0;

let selected = '--';

//images
let bbi;
let bni;
let bri;
let bki;
let bqi;
let bpi;
let wbi;
let wni;
let wri;
let wki;
let wqi;
let wpi;

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

let wturn = true;

let pick_pawn = false;
let pawn1 = 0;
let pawn2 = 0;
let pawn_upgrade = '-';

let en_passante_row = -1;
let wen_passante = true;

let bqcastle = true;
let bkcastle = true;
let wqcastle = true;
let wkcastle = true;

let stalemate = false;
let wwin = false;
let bwin = false;

let drawing = true;

function updateContainer() {
  container = select('#sketchContainer');
  w = parseFloat(getComputedStyle(container.elt).getPropertyValue('width'));
  h = parseFloat(getComputedStyle(container.elt).getPropertyValue('height'));
}

function windowResized() {
  updateContainer();
  resizeCanvas(w, h);
  drawing = true;
}

function setup() {
  updateContainer();
  canvas = createCanvas(w, h);
  smooth();
  canvas.parent("#sketchContainer");
}

function preload() {
  bbi = loadImage("PiecesImgs/bbFinal.png");
  wbi = loadImage("PiecesImgs/wbfinal.png");
  bpi = loadImage("PiecesImgs/bpfinal.png");
  wpi = loadImage("PiecesImgs/wpfinal.png");
  bni = loadImage("PiecesImgs/bnfinal.png");
  wni = loadImage("PiecesImgs/wnfinal.png");
  bki = loadImage("PiecesImgs/bkfinal.png");
  wki = loadImage("PiecesImgs/wkfinal.png");
  bqi = loadImage("PiecesImgs/bqfinal.png");
  wqi = loadImage("PiecesImgs/wqfinal.png");
  bri = loadImage("PiecesImgs/brfinal.png");
  wri = loadImage("PiecesImgs/wrfinal.png");
}

function draw() {
  if (drawing && !pick_pawn && !stalemate && !wwin && !bwin) {
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
          fill('#444466')
        } else if ((i+j) % 2 == 0) {
          fill('#444444');
        } else {
          fill('#AAAAAA');
        }
        rect((w/8) * i, (h/8) * j, (w/8) * (i+1), (h/8) *(j+1));
        fill('#888888');
        textSize(20);
        //text(pieces[j][i], (w/8)*i, (h/8)*j, (w/8) * (i+1), (h/8) *(j+1));
        if (pieces[j][i] == 'bp') {
          image(bpi, (w/8)*i, (h/8) * j, w/8, h/8);
        } else if (pieces[j][i] == 'wp'){
          image(wpi, (w/8)*i, (h/8) * j, w/8, h/8);
        } else if (pieces[j][i] == 'wr'){
          image(wri, (w/8)*i, (h/8) * j, w/8, h/8);
        } else if (pieces[j][i] == 'br'){
          image(bri, (w/8)*i, (h/8) * j, w/8, h/8);
        } else if (pieces[j][i] == 'wn'){
          image(wni, (w/8)*i, (h/8) * j, w/8, h/8);
        } else if (pieces[j][i] == 'bn'){
          image(bni, (w/8)*i, (h/8) * j, w/8, h/8);
        } else if (pieces[j][i] == 'wb'){
          image(wbi, (w/8)*i, (h/8) * j, w/8, h/8);
        } else if (pieces[j][i] == 'bb'){
          image(bbi, (w/8)*i, (h/8) * j, w/8, h/8);
        } else if (pieces[j][i] == 'wq'){
          image(wqi, (w/8)*i, (h/8) * j, w/8, h/8);
        } else if (pieces[j][i] == 'bq'){
          image(bqi, (w/8)*i, (h/8) * j, w/8, h/8);
        } else if (pieces[j][i] == 'wk'){
          image(wki, (w/8)*i, (h/8) * j, w/8, h/8);
        } else if (pieces[j][i] == 'bk'){
          image(bki, (w/8)*i, (h/8) * j, w/8, h/8);
        }
      }
    }
    //check stalemate or checkmate
    let possible_moves = 0;
    let temp_selected = selected;
    for(let h = 0; h < 8; h++) {
      for(let g = 0; g < 8; g++) {
        if ((pieces[h][g][0] == 'w' && wturn) || (pieces[h][g][0] == 'b' && !wturn)) {
          selected = h + "" + g;
          var moves = checkMove();
          possible_moves += moves.length;
        }
      }
    }
    selected = temp_selected;
    if (possible_moves == 0) {
      //find king and check if under attack
      for (let h = 0; h < 8; h++) {
        for (let g = 0; g < 8; g++) {
          if ((pieces[h][g][0] == 'wk' && wturn)) {
            if (check_king('w', 0, 0, 0, 0)) { //checks board as is if king is in check
              stalemate = true;
              //print("STALEMATE");
            } else {
              bwin = true;
              //print("WHITE CHECKMATE");
            }
            break;
          } else if ((pieces[h][g] == 'bk' && !wturn)) {
            if (check_king('b', 0, 0, 0, 0)) { //checks board as is if king is in check
              stalemate = true;
              //print("STALEMATE");
            } else {
              wwin = true;
              //print("BLACK CHECKMATE");
            }
            break;
          }
        }
      }
    }
    if (selected != '--') {
      var movearr = checkMove();
      if (movearr != '--') {
        for(let i = 0; i < movearr.length; i++){
          fill('#6666AA');
          circle((w/8) * Number(movearr[i][1]) + (w/16), (h/8) * Number(movearr[i][0]) + (h/16), w/20);
        }
      }
    }
    drawing = false;
  } else if (stalemate) {
    fill('#FFFFFF');
    textSize(30);
    textAlign("center", "center");
    text("STALEMATE", w/8, h/8, 3*(w/4), 3*(h/8));
  } else if (bwin) {
    fill('#FFFFFF');
    textSize(30);
    textAlign("center", "center");
    text("Black Wins", w/8, h/8, 3*(w/4), 3*(h/8));
  } else if (wwin) {
    fill('#FFFFFF');
    textSize(30);
    textAlign("center", "center");
    text("White Wins", w/8, h/8, 3*(w/4), 3*(h/8));
  } else if (pick_pawn) {
    fill('#999999');
    rect(w/8, h/8, 7*(w/8), 7*(h/8));
    if (wturn) {
      image(bni, w/8, h/8, 3*(w/8), 3*(h/8));
      image(bbi, w/2, h/8, 3*(w/8), 3*(h/8));
      image(bri, w/8, h/2, 3*(w/8), 3*(h/8));
      image(bqi, w/2, h/2, 3*(w/8), 3*(h/8));
    } else {
      image(wni, w/8, h/8, 3*(w/8), 3*(h/8));
      image(wbi, w/2, h/8, 3*(w/8), 3*(h/8));
      image(wri, w/8, h/2, 3*(w/8), 3*(h/8));
      image(wqi, w/2, h/2, 3*(w/8), 3*(h/8));
    }
    pawn_input();
  }
}

function mouseClicked() {
  drawing = true;
  if (!pick_pawn) {
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
                if (pieces[i][j][0] == 'w') {
                  wcaptured.push(pieces[i][j]);
                } else {
                  bcaptured.push(pieces[i][j]);
                }
              }
              pieces[i][j] = pieces[selected[0]][selected[1]];
              if (wturn && i == 0 && pieces[i][j] == 'wp') { // pawns gets to end
                pawn1 = i;
                pawn2 = j;
                pawn_input();
              } else if (!wturn && i == 7 && pieces[i][j] == 'bp') {
                pawn1 = i;
                pawn2 = j;
                pawn_input();
              } else {
                pieces[selected[0]][selected[1]] = '--';
              }
              if (pieces[i][j] == 'wp' && selected[0] - i == 2) { // en passante
                en_passante_row = j;
                wen_passante = true;
              } else if (pieces[i][j] == 'bp' && selected[0] - i == -2) {
                en_passante_row = j;
                wen_passante = false;
              } else {
                if (pieces[i][j] == 'wp' && i == 2 && j == en_passante_row) {
                  bcaptured.push(pieces[i+1][j]);
                  pieces[i+1][j] = '--';
                }
                if (pieces[i][j] == 'bp' && i == 5 && j == en_passante_row) {
                  wcaptured.push(pieces[i+1][j]);
                  pieces[i-1][j] = '--';
                }
                en_passante_row = -1;
              }
              if (pieces[i][j] == 'bk') { //checks if castling pieces move
                bkcastle = false;
                bqcastle = false;
              } else if (pieces[i][j] == 'br' && selected[1] == 0) {
                bqcastle = false;
              } else if (pieces[i][j] == 'br' && selected[1] == 7) {
                bkcastle = false;
              }
              if (pieces[i][j] == 'wk') { //checks if castling pieces move
                wkcastle = false;
                wqcastle = false;
              } else if (pieces[i][j] == 'wr' && selected[1] == 0) {
                wqcastle = false;
              } else if (pieces[i][j] == 'wr' && selected[1] == 7) {
                wkcastle = false;
              }

              if (pieces[i][j] == 'wk' && wturn && selected[1] - j == -2) { //castles wk
                pieces[7][5] = 'wr';
                pieces[7][7] = '--';
              }
              if (pieces[i][j] == 'wk' && wturn && selected[1] - j == 2) { //castles wq
                pieces[7][3] = 'wr';
                pieces[7][0] = '--';
              }
              if (pieces[i][j] == 'bk' && !wturn && selected[1] - j == -2) { //castles bk
                pieces[0][5] = 'br';
                pieces[0][7] = '--';
              }
              if (pieces[i][j] == 'bk' && !wturn && selected[1] - j == 2) { //castles bq
                pieces[0][3] = 'br';
                pieces[0][0] = '--';
              }
              selected = '--';
              wturn = !wturn;
              return;
            } else {
              if ((pieces[i][j][0] == 'w' && wturn) || (pieces[i][j][0] == 'b' && !wturn) || pieces[i][j] == '--') {
                selected = "" + i + "" + j;
                return;
              } else {
                return;
              }
            }
          } else {
            if ((pieces[i][j][0] == 'w' && wturn) || (pieces[i][j][0] == 'b' && !wturn) || pieces[i][j] == '--') {
              selected = "" + i + "" + j;
              return;
            } else {
              return;
            }
          }
        }
      }
    }
    selected = '--';
  } else {
    if (mouseX > w/8 && mouseY > h/8 && mouseX < w/2 && mouseY < h/2) {
      pawn_upgrade = 'n';
    } else if (mouseX > w/2 && mouseY > h/8 && mouseX < 7*(w/8) && mouseY < h/2){
      pawn_upgrade = 'b';
    } else if (mouseX > w/8 && mouseY > h/2 && mouseX < w/2 && mouseY < 7*(h/8)) {
      pawn_upgrade = 'r';
    } else if (mouseX > w/8 && mouseY > h/2 && mouseX < 7*(w/8) && mouseY < 7*(h/8)) {
      pawn_upgrade = 'q';
    }
  }
}

function checkMove() {
  if (pieces[selected[0]][selected[1]] == '--') {
    return ['--'];
  }
  if (pieces[selected[0]][selected[1]][1] == 'p') {
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
    if (en_passante_row != -1 && !wen_passante && abs(p2 - en_passante_row) == 1 && p1 == 3) { //en passante
      if (check_king('w', p1, p2, (Number(p1) - 1), en_passante_row)) {
        returnarr.push("" + (Number(p1) - 1) + "" + en_passante_row);
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
    if (en_passante_row != -1 && wen_passante && abs(p2 - en_passante_row) == 1 && p1 == 4) { //en passante
      if (check_king('b', p1, p2, (Number(p1) + 1), en_passante_row)) {
        returnarr.push("" + (Number(p1) + 1) + "" + en_passante_row);
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
function pawn_input() {
  pick_pawn = true;
  if (pawn_upgrade != '-') {
    if (wturn) { //turn already changes by this time
      pieces[pawn1][pawn2] = "b" + pawn_upgrade;
      pieces[pawn1-1][pawn2] = '--';
    } else {
      pieces[pawn1][pawn2] = "w" + pawn_upgrade;
      pieces[pawn1+1][pawn2] = '--';
    }
    pawn_upgrade = '-';
    pick_pawn = false;
  }
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
        if(pieces[Number(p1)+i][Number(p2)+j][0] != side && check_king(side, p1, p2, Number(p1) +i, Number(p2) +j)) {
          returnarr.push("" + (Number(p1) +i) + "" + (Number(p2) +j));
        }
      }
    }
  }
  //castling
  if (wkcastle == true && side == 'w' && pieces[7][5] == '--' && pieces[7][6] == '--') {
    if (check_king(side, p1, p2, 7, 5) && check_king(side, p1, p2, 7, 6) && check_king(side, 0, 0, 0, 0)) {
      returnarr.push("76");
    }
  }
  if (wqcastle == true && side == 'w' && pieces[7][2] == '--' && pieces[7][3] == '--' && pieces[7][1] == '--') {
    if (check_king(side, p1, p2, 7, 2) && check_king(side, p1, p2, 7, 3) && check_king(side, 0, 0, 0, 0)) {
      returnarr.push("72");
    }
  }
  if (bkcastle == true && side == 'b' && pieces[0][5] == '--' && pieces[0][6] == '--') {
    if (check_king(side, p1, p2, 0, 5) && check_king(side, p1, p2, 0, 6) && check_king(side, 0, 0, 0, 0)) {
      returnarr.push("06");
    }
  }
  if (bqcastle == true && side == 'b' && pieces[0][2] == '--' && pieces[0][3] == '--' && pieces[0][1] == '--') {
    if (check_king(side, p1, p2, 0, 2) && check_king(side, p1, p2, 0, 3) && check_king(side, 0, 0, 0, 0)) {
      returnarr.push("02");
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
            if (i == Number(p1) - 1 && (j == Number(p2) - 1 || j == Number(p2) + 1)) {
              return false;
            }
          } else {
            if (i == Number(p1) + 1 && (j == Number(p2) - 1 || j == Number(p2) + 1)) {
              return false;
            }
          }
        }
        if (board[i][j][1] == 'r' || board[i][j][1] == 'q') { //rooks or queens
          if (i == p1) {
            if (p2 > j) {
              for (let k = j + 1; k <= p2; k++) {
                if (k == Number(p2)) {
                  return false;
                }
                if (board[i][k] != '--') {
                  break;
                }
              }
            } else {
              for (let k = j - 1; k >= p2; k--) {
                if (k == Number(p2)) {
                  return false;
                }
                if (board[i][k] != '--') {
                  break;
                }
              }
            }
          }
          if (j == p2) {
          //   print("p1:" + p1 + " p2: " + p2 + " i:" + i + " j:" + j);
          //   for(let y = 0; y < 8;y++) {
          //     print(board[y]);
          //   }
            if (i < p1) {
              for (let k = i + 1; k <= p1; k++) {
                if (k == Number(p1)) {
                  return false;
                }
                if (board[k][j] != '--') {
                  break;
                }
              }
            } else {
              for (let k = i - 1; k >= p1; k--) {
                if (k == Number(p1)) {
                  return false;
                }
                if (board[k][j] != '--') {
                  break;
                }
              }
            }
          }
        }
          
        if (board[i][j][1] == 'b' || board[i][j][1] == 'q') { //bishops or queens
          if (abs(j-p2) == abs(i-p1)) {
            if (j < p2) {
              if (i < p1) {
                for (let k = 1; k <= abs(Number(p1) - i); k++) {
                  if (k == abs(Number(p1) -i)) {
                    return false;
                  }
                  if (board[i+k][j+k] != '--') {
                    break;
                  }
                }
              } else {
                for (let k = 1; k <= abs(Number(p1) - i); k++) {
                  if (k == abs(Number(p1) -i)) {
                    return false;
                  }
                  if (board[i-k][j+k] != '--') {
                    break;
                  }
                }
              }
            } else {
              if (i < p1) {
                for (let k = 1; k <= abs(Number(p1) - i); k++) {
                  if (k == abs(Number(p1) -i)) {
                    return false;
                  }
                  if (board[i+k][j-k] != '--') {
                    break;
                  }
                }
              } else {
                for (let k = 1; k <= abs(Number(p1) - i); k++) {
                  if (k == abs(Number(p1) -i)) {
                    return false;
                  }
                  if (board[i-k][j-k] != '--') {
                    break;
                  }
                }
              }
            }
          }
        }
        if (board[i][j][1] == 'n') { //knights
          if ((i + 1 == p1 && j + 2 == p2) || (i+1 == p1 && j-2 == p2) || (i-1 == p1 && j+2 == p2) || (i-1 == p1 && j-2 == p2) ||
              (i + 2 == p1 && j + 1 == p2) || (i+2 == p1 && j-1 == p2) || (i-2 == p1 && j+1 == p2) || (i-2 == p1 && j-1 == p2)) {
            return false;
          }
        }
        if (board[i][j][1] == 'k') { //king
          if (abs(i-p1) <= 1 && abs(j-p2) <= 1) { //within 1 square
            return false;
          }
        }
        //end pieces
      } //for loop
    } //for loop
  } //check if other side
  
  return true;
}