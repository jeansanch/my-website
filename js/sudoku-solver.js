var table = new Array(81).fill(0);
var visualization = true;
var running = false;[]

function readTable(){
  for(var i = 0; i < 81; i++){
    (document.getElementById('cell'+i).value != 0) ? table.push(parseInt(document.getElementById('cell'+i).value)) : table.push(0);
  }
}

function remove(arr, value){
		for(var i = 0; i < arr.length; i++){
			if(arr[i]==value){
				arr.splice(i, 1);
			}
		}
		return arr;
}

function testH(){
	clearTable();
	table.fill(0);
	table[3] = 2;
	table[5] = 5;
	table[8] = 4;
	table[9] = 8;
	table[10] = 4;
	table[13] = 6;
	table[14] = 1;
	table[16] = 2;
	table[17] = 7;
	table[20] = 2;
	table[23] = 4;
	table[25] = 6;
	table[26] = 3;
	table[31] = 3;
	table[32] = 9;
	table[36] = 4;
	table[42] = 3;
	table[45] = 6;
	table[52] = 7;
	table[53] = 8;
	table[54] = 3;
	table[60] = 8;
	table[61] = 4;
	table[63] = 2;
	table[73] = 8;
	table[74] = 1;
	table[77] = 7;
	table[78] = 2;
	table[79] = 3;
	printTable();
}

function test(){
	clearTable();
	table.fill(0);
	table[2] = 4;
	table[3] = 5;
	table[4] = 6;
	table[8] = 3;
	table[9] = 6;
	table[13] = 9;
	table[15] = 4;
	table[16] = 8;
	table[20] = 5;
	table[22] = 2;
	table[25] = 7;
	table[31] = 3;
	table[32] = 9;
	table[37] = 4;
	table[39] = 7;
	table[41] = 8;
	table[42] = 3;
	table[43] = 6;
	table[45] = 9;
	table[48] = 2;
	table[49] = 1;
	table[50] = 6;
	table[54] = 1;
	table[55] = 7;
	table[56] = 9;
	table[65] = 2;
	table[66] = 3;
	table[69] = 8;
	table[74] = 8;
	table[75] = 9;
	table[78] = 6;
	table[79] = 2;
	table[80] = 7;
	printTable();
}

function whiteOut(){
		for (var i = 0; i<81; i++){
			document.getElementById("cell"+i).style.background = "white"
		}
}

function timer(ms) {
 return new Promise(res => setTimeout(res, ms));
}

function doublePair(pos, numbers){
	var values = [];
	var offset = parseInt(pos % 9);
	var line = parseInt(pos/9);
	var newid;
	var possib = [];
	var id;
	//console.log(pos);
	//console.log(numbers);
	for(let l = 0; l < 3; l++){
		for(let i = 0; i < 9; i++){
			values = [];
			switch (l) {
				case 0:
					//squares
					id = (parseInt(offset/3)*3) + (parseInt(line/3)*27) + (parseInt(i/3)*9) + (i % 3);
				break;
				case 1:
					//rows
					id = line*9+i;
				break;
				case 2:
					// column
					id = (i*9 + offset);
				break;
			}
			//Check the possible values in the same column/row/sqaure
			if(table[id] == 0 && id != pos){
					values = compare(id);
			}
			//possible values is the same in 2 different cells
			if (values.length == 2){
				//console.log ("VALUES = "+values+" IN > "+id);
				if (values[0] > values[1]){
					var aux = values[0];
					values[0] = values[1];
					values[1] = aux;
				}
				if (values[0] == numbers[0] && values[1] == numbers[1]){
					//console.log ("NUMBERS = "+numbers+" IN > "+pos+" AND VALUES = "+values+" IN > "+id);
					for(let j = 0; j < 9; j++){
						if (j != i){
							possib = [];
							switch (l) {
								case 0:
									//squares
									newid = (parseInt(offset/3)*3) + (parseInt(line/3)*27) + (parseInt(j/3)*9) + (j % 3);
									break;
								case 1:
									//rows
									newid = line*9+j;
									break;
								case 2:
									// column
									newid = (j*9 + offset);
									break;
							}
							if(id == 62){
								//console.log("NEWID = "+newid);
							}

							if (table[newid] == 0 && newid != pos){
								//console.log("Calling compare " + newid);
								possib = compare(newid)
							}
							if (possib.length == 3){
								for(k = 0; k < numbers.length; k++){
							    try{
							      possib = remove(possib, numbers[k]);
							    }
							    catch{

							    }
							  }
								if (possib.length == 1){
									write(newid, possib[0]);
									return true;
								}
							}
						}
					}
				}
			}
		}
	}
	return false;
}

function arrayMerge(toMerge, from){
	//console.log("to = "+toMerge+" from "+from +" length " +from.length);
	for(let i = 0; i < from.length; i++){
		//console.log("PUSH DE "+from[i]);
		toMerge.push(from[i]);
	}
	//console.log("NEW TOMERGE "+ toMerge);
	return toMerge;
}

function isAlone(pos, numbers){
	var repeat;
	var offset = parseInt(pos % 9);
	var line = parseInt(pos/9);
	var id;
	var values = [];
	for(let i = 0; i < numbers.length; i++){
		repeat = false;
		for(let j = 0; j < 3; j++){
			//ID TA QUEBRANDO O CODIGO
			values = [];
			for(let k = 0; k < 9; k++){
				switch (j) {
					case 0:
						//squares
						id = (parseInt(offset/3)*3) + (parseInt(line/3)*27) + (parseInt(k/3)*9) + (k % 3);
					break;
					case 1:
						//rows
						id = line*9+k;
					break;
					case 2:
						// column
						id = (k*9 + offset);
					break;
				}
				if(table[id] == 0 && id != pos){
					values = arrayMerge(values, compare(id));
				}
			}
			//console.log("values = "+values);
			if(i == 1 && pos == 7)
				console.log(numbers[i] + " " + values);
			if (values.length > 0){
				for(let l = 0; l < values.length; l++){
					if (numbers[i] == values[l]){
						repeat = true;
						break;
					}
				}
				if (repeat == false)
					return numbers[i];
			}
		}
	}
	return null;
}

function compare(pos){
  var numbers = [];
  var free = [1,2,3,4,5,6,7,8,9];
  var offset = parseInt(pos % 9);
  var line = parseInt(pos/9);
	//console.log("PRE FREE: "+free);
	whiteOut();
  for(let i = 0; i < 9; i++){
		// column
		id = (i*9 + offset);
		if(visualization == true){
			document.getElementById("cell"+pos).style.background = "rgba(10, 200, 10, 0.4)"
			if (pos != id){
				document.getElementById("cell"+id).style.background = "rgba(200, 10, 200, 0.4)"
			}
		}
    if(table[id] != 0){
      if (numbers.indexOf(table[id]) === -1)
        numbers.push(table[id]);
    }
		//rows
		id = line*9+i;
		if(visualization == true){
			if (pos != id){
				document.getElementById("cell"+id).style.background = "rgba(0, 0, 256, 0.4)"
			}
		}
    if(table[id] != 0){
      if (numbers.indexOf(table[id]) === -1)
        numbers.push(table[id]);
    }
		//squares
		id = (parseInt(offset/3)*3) + (parseInt(line/3)*27) + (parseInt(i/3)*9) + (i % 3);
		if(visualization == true){
			if (pos != id){
				document.getElementById("cell"+id).style.background = "rgba(0, 200, 200, 0.4)"
			}
		}
    if(table[id] != 0){
      if (numbers.indexOf(table[id]) === -1)
        numbers.push(table[id]);
    }
  }


	//console.log("NUMBERS: "+numbers+"POS: "+pos);
  for(i = 0; i < numbers.length; i++){
    try{
      free = remove(free, numbers[i]);
    }
    catch{

    }
  }
	//console.log("POS FREE:"+free);
  return free;
}

function printTable(){
	for(var i = 0; i < 81; i++){
		if(table[i] != 0)
    	document.getElementById('cell'+i).value = table[i];
  }
  //console.log(table);
}

function write(pos, value){
  table[pos] = value;
	document.getElementById('cell'+pos).value = value;
}

async function solve(){
	var free = [];
	var isAloneVar;
	if (running == false){
		running = true;
	  table = [];
	  readTable();

		var done = false;
	  changed = true;

	  while(done == false && changed == true){
	    changed = false;
	    done = true;
	    for(let i = 0; i < table.length; i++){
	      if (table[i] == 0){
	        done = false;
					await timer(0200);
					free = compare(i);
					if (free.length == 1){
						write(i, free[0]);
						changed = true;
					}
					else if (free.length == 2){
						if (doublePair(i, free) == true){
							changed = true;
						}
					}
					if (changed != true){
						if(i == 7){
							console.log("Chamando isAloneVar")
						}
						isAloneVar = isAlone(i, free)
						if(isAloneVar != null){
							console.log("Escrevendo com isAlone o valor" + isAloneVar + " Em " + i);
							write(i, isAloneVar);
							changed = true;
						}
					}
	      }
	    }
	  }
	  //printTable();
		running = false;
	}
}

function clearTable(){
	//console.log("Running CLEAR");
	for(var i = 0; i < 81; i++){
		table[i] = '';
  	document.getElementById('cell'+i).value = '';
		document.getElementById("cell"+i).style.background = "rgb(255, 255, 255)"
  }
}
