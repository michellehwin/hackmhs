// TODO
// - multiple random generators (seeds and such)
// - mnemonic
const SeedRandom = require("seedrandom");

charset="QWERTYUIOPASDFGHJKLZXCVBNMmnbvcxzasdfghjklpoiuytrewq!@#$%&*_-?.";

//Requires user generated seed for additional entropy. Should have a tooltip explaining this.
function generate(pwLength, seed){
	
	pw = "";

	for (var i = pwLength - 1; i >= 0; i--) {
		charIndex = randomInteger(0,charset.length-1,SeedRandom(seed));
		pw+= charset.charAt(charIndex);
	}

	return pw;
}

function randomInteger(min, max, rng){
	x = ""+Math.random();
	x=x+rng();
	rngFinal = SeedRandom(x);
	return (min+Math.floor(rngFinal()*(max-min+1)));
}

function approvePassword(pw, modes){
	for (var i = modes.length - 1; i >= 0; i--) {
		if(!checkPassword(pw,modes[i])){
			return false;
		}
	}

	return true;
}

function generateApprovedPassword(pwLength, seed, modes){
	r = generate(pwLength,seed);
	while(!approvePassword(r,modes)){
		r= generate(pwLength,seed);
	}

	return r;
}


//Modes
//0 - At least 25% not just letters
//1 - At least 30% of letters are uppercase and lowercase
//2 - No character is more than 1.5x as frequent as it should be (based on the length of charset)
function checkPassword(pw, mode){
	switch(mode){
		case 0:
			letterCount=totalCount=0;
			for (var i = pw.length - 1; i >= 0; i--) {
				c = pw.charCodeAt(i);
				if(isLetter(c)){
					letterCount++;
				}
				totalCount++;
			}
			return (totalCount-letterCount)>=(0.25*pw.length);
		case 1:
			letterCount=upperCount=lowerCount=0;
			for (var i = pw.length - 1; i >= 0; i--) {
				c=pw.charCodeAt(i);
				if(isUpper(c)){
					upperCount++;
					letterCount++;
				}else if(isLower(c)){
					lowerCount++;
					letterCount++;
				}
			}
			threshold = 0.3*letterCount;
			return (upperCount>=threshold&&lowerCount>=threshold);
		case 2:
			map = new Map();
			for (var i = pw.length - 1; i >= 0; i--) {
				c = pw.charAt(i);
				x = 1;
				if(map.has(map.get(c))){
					x = map.get(c)+1;
				}

				map.set(c,x);
			}

			threshold=(1.5*(1.0/charset))*charset.length;

			for(var m in map.values()){
				if(m>threshold)
					return false;
			}

			return true
	}
}

//c is charcode
function isLetter(c){
	return (isUpper(c)||isLower(c));
}

function isUpper(c){
	return (c>=65&&c<=90);
}

function isLower(c){
	return (c>=97&&c<=122);
}

console.log(generateApprovedPassword(15, "I like to eat icersjhcream ppewpo!!#W Y7i8rfeief",[0,1,2]));