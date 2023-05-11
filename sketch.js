let font;
let textLayer;

let container;
let w;
let h;
let border;

let angle = 0;

let pieces = [
  ['br','bn','bb','bq','bk','bb','bn','br']
  ['bp','bp','bp','bp','bp','bp','bp','bp']
  ['-','-','-','-','-','-','-','-']
  ['-','-','-','-','-','-','-','-']
  ['-','-','-','-','-','-','-','-']
  ['-','-','-','-','-','-','-','-']
  ['-','-','-','-','-','-','-','-']
  ['wp','wp','wp','wp','wp','wp','wp','wp']
  ['wr','wn','wb','wq','wk','wb','wn','wr']
];

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
function pawnMove(p1, p2) {
  var returnarr = new Array();
  if (pieces[p1] == w) {
    if (p1 == 0) {
      pawn_input('w', p1, p2);
      return;
    }
    if (pieces[p1 - 1][p2 + 1] != '-') { //pawn attack right
      if (check_king('w', p1 - 1, p2 + 1)) {
        returnarr.push("" + (p1 - 1) + "" + (p2 + 1));
      }
    }
    if (pieces[p1 - 1][p2 - 1] != '-') { //pawn attack left
      if (check_king('w', p1 - 1, p2 - 1)) {
        returnarr.push("" + (p1 - 1) + "" + (p2 - 1));
      }
    }
    if (pieces[p1 - 1][p2] == '-') { //pawn go forward
      if (check_king('w', p1 - 1, p2)) {
        returnarr.push("" + (p1 - 1) + "" + (p2));
      }
    }
    if (p1 == 6 && pieces[p1-2][p2] == '-') { //first move 2 spaces
      if (check_king('w', p1 - 2, p2)) {
        returnarr.push("" + (p1 - 2) + "" + (p2));
      }
    }
  } else {
    if (p1 == 7) {
      pawn_input('b', p1, p2);
      return;
    }
    if (pieces[p1 + 1][p2 + 1] != '-') { //pawn attack right
      if (check_king('b', p1 + 1, p2 + 1)) {
        returnarr.push("" + (p1 + 1) + "" + (p2 + 1));
      }
    }
    if (pieces[p1 + 1][p2 - 1] != '-') { //pawn attack left
      if (check_king('b', p1 + 1, p2 - 1)) {
        returnarr.push("" + (p1 + 1) + "" + (p2 - 1));
      }
    }
    if (pieces[p1 + 1][p2] == '-') { //pawn go forward
      if (check_king('b', p1 + 1, p2)) {
        returnarr.push("" + (p1 + 1) + "" + (p2));
      }
    }
    if (p1 == 6 && pieces[p1+2][p2] == '-') { //first move 2 spaces
      if (check_king('b', p1 + 2, p2)) {
        returnarr.push("" + (p1 + 2) + "" + (p2));
      }
    }
  }
  return returnarr;
}

//changes pawn that makes it all the way across to user input
function pawn_input(side, p1, p2) {


}

//checks if the move specified by p1 and p2 would have the king in check
function check_king(side, p1, p2) {

  return true;
}