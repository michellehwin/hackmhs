// TODO
// - iteratively generate until conditions are met
// - multiple random generators (seeds and such)

function generate(pwLength, charset){
	
	pw = "";

	for (var i = pwLength - 1; i >= 0; i--) {
		charIndex = randomInteger(0,charset.length-1);
		pw+= charset.charAt(charIndex);
	}

	return pw;
}

function randomInteger(min, max){
	return (min+Math.floor(Math.random()*(max-min+1)));
}