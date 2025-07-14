var tab;
const hPlayer = "X";
const rPlayer = "O";

const comb = [
  [0, 1, 2], 
  [3, 4, 5], 
  [6, 7, 8], 
  [0, 4, 8], 
  [2, 4, 6], 
  [0, 3, 6], 
  [1, 4, 7], 
  [2, 5, 8]
];

const sr = document.querySelectorAll('.square');
Start();

function Start() {	document.querySelector(".endGame").style.display = "none";
	tab = Array.from(Array(9).keys());
	for (var i = 0; i < sr.length; i++) {
		sr[i].innerText = '';
		sr[i].style.removeProperty('background-color');
		sr[i].addEventListener('click', turnC, false);
	}
}

function turnC(qd) {
	if (typeof tab[qd.target.id] == 'number') {
		turn(qd.target.id, hPlayer)
		if (!verVic(tab, hPlayer) && !verEmp()) turn(bestPos(), rPlayer);
	}
}

function turn(IdQd, player) {
	tab[IdQd] = player;
  document.getElementById(IdQd).innerText = player;
	let vic = verVic(tab, player)
	if (vic) endGame(vic)
}

function verVic(tb, player) {
	let plays = tb.reduce((x, y, z) =>
		(y === player) ? x.concat(z) : x, []);
	let vic = null;
	for (let [index, vit] of comb.entries()) {
		if (vit.every(el => plays.indexOf(el) > -1)) {
			vic = {index: index, player: player};
			break;
		}
	}
	return vic;
}

function endGame(vic) {
	for (let index of comb[vic.index]) {
		document.getElementById(index).style.backgroundColor =
			vic.player == hPlayer ? "green" : "red";
	}
	for (var j = 0; j < sr.length; j++) {
		sr[j].removeEventListener('click', turnC, false);
	}
	champ(vic.player == hPlayer ? "Parabéns! Você venceu a partida!!!" : "Que pena! Você perdeu!");
}

function champ(winner) {
document.querySelector(".endGame").style.display = "block";
	document.querySelector(".endGame .text").innerText = winner;
}

function empSq() {
	return tab.filter(a => typeof a == 'number');
}

function bestPos() {
	return minamax(tab, rPlayer).index;
}

function verEmp() {
	if (empSq().length == 0) {
		for (var k = 0; k < sr.length; k++) {
			sr[k].style.backgroundColor = "yellow";
			sr[k].removeEventListener('click', turnC, false);
		}
		champ("Empatou! Deu velha!")
		return true;
	}
	return false;
}

function minamax(newTab, player) {
	var emp = empSq();
	if (verVic(newTab, hPlayer)) {
		return {pontos: -10};
	} else if (verVic(newTab, rPlayer)) {
		return {pontos: 10};
	} else if (emp.length === 0) {
		return {pontos: 0};
	}
	var plays = [];
	for (var i = 0; i < emp.length; i++) {
		var play = {};
		play.index = newTab[emp[i]];
		newTab[emp[i]] = player;

		if (player == rPlayer) {
			var rs = minamax(newTab, hPlayer);
			play.pontos = rs.pontos;
		} else {
			var rs = minamax(newTab, rPlayer);
			play.pontos = rs.pontos;
		}

		newTab[emp[i]] = play.index;

		plays.push(play);
	}

	var bestPlay;
	if(player === rPlayer) {
		var highP = -10000;
		for(var r = 0; r < plays.length; r++) {
			if (plays[r].pontos > highP) {
				highP = plays[r].pontos;
				bestPlay = r;
			}
		}
	} else {
		var highP = 10000;
		for(var t = 0; t < plays.length; t++) {
			if (plays[t].pontos < highP) {
				highP = plays[t].pontos;
				bestPlay = t;
			}
		}
	}
	return plays[bestPlay];
}