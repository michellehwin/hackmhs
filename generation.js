// TODO
// - conjunctions
// - adverbs
// - discourage too many adjectives? (shorter sentences)?
// - proper adjectives must come last?
// - discourage repeats.

const SeedRandom = require("seedrandom");
const deepclone = require("lodash.clonedeep");
const converter = require('number-to-words');

const charset="QWERTYUIOPASDFGHJKLZXCVBNMmnbvcxzasdfghjklpoiuytrewq!@&?.1234567890";

const nouns = ["armies","animals","aircrafts","adults","bodies","banks","beds","boys","cats","countries","companies","children","dogs","dads","doors","documents","economies","eyes","engines","eagles","families","faces","feathers","friends","generals","gentlemen","gardens","geese","houses","heads","hands","horses","islands","individuals","infants","judges","jaguars","jellies","kings","keys","kitchens","kittens","ladies","libraries","legs","lakes","men","monkeys","mothers","ministers","neighbors","newspapers","nations","officers","otters","owls","people","papers","presidents","plants","queens","quails","quarterbacks","reporters","rivers","radios","schools","snakes","sons","sisters","tigers","teachers","trains","tarantulas","uncles","universities","unicorns","visitors","vans","villagers","vampires","wives","windows","writers","wombats","xylophones","xrays","youths","yetis","zebras","zombies","zippers","Audis","Alexanders","Austrians","Bandaids","Billies","Bentleys","Corvettes","Christophers","Christians","Daniels","Danes","Doritos","Englishmen","Ezekiels","Esthers","Fords","Franklins","Frigidaires","Gavins","Grammys","Gorbachevs","Harleys","Hamburglars","Henrys","Infinitis","Ivans","Inuits","Jerrys","Jordans","Jeeps","Kias","Kevins","Kennedys","Lincolns","Lamborghinis","Lauras","Michaels","Mercedes","Mormons","Nissans","Nancys","Napoleans","Oscars","Oldsmobiles","Ottomans","Pringles","Patricks","Pontiacs","Quakers","Quincys","Quintons","Rasheeds","Rolexes","Rambos","Supermen","Saturns","Subarus","Teslas","Teddies","Toyotas","Ubers","Ursulas","Ursas","Umas","Vickys","Volkswagens","Voltaires","Wendys","Walkmans","Wilfreds","Xterras","Xaviers","Xenos","Yodas","Yamahas","Yankees","Zacharys","Zippos","Zeldas"];
const adjectives = ["acidic","acrobatic","admirable","bouncy","bad","big","crying","calm","crazy","dangerous","dastardly","dumb","excellent","evil","energetic","funny","friendly","furry","great","green","gross","handsome","heavy","happy","iconic","imaginary","joyful","jittery","jumping","kind","knowledgeable","knavish","large","luscious","lanky","mighty","magic","magnificent","noble","nosy","nimble","oily","old","optimistic","princely","pretty","pleasant","quick","quarrelsome","quirky","rabid","rambunctious","rebellious","stinky","slimy","silly","tiny","teal","thankful","unbearable","upset","untamable","velvety","vegetarian","verbose","warm","wasteful","weak","xenophobic","xenial","xenogenic","yellow","young","yelping","zippy","zesty","zealous","Australian","Argentinan","Arctic","Basque","Bolivian","Bermudan","Caribbean","Cuban","Catalonian","Danish","Dravidian","Draconian","English","Elizabethan","Estonian","Finnish","Fijian","French","Frankish","Ganymedian","Guatemalan","Greek","Haitian","Hellenic","Hungarian","Indian","Indonesian","Irish","Jovian","Jamaican","Japanese","Kenyan","Korean","Kurdish","Lebanese","Lithuanian","Latvian","Mexican","Marxist","Machiavellian","Nigerian","Norwegian","Nicaraguan","Orcish","Orwellian","Ottoman","Peruvian","Polynesian","Polish","Qatari","Queensland","Québécois","Russian","Romanian","Rhodesian","Saturnian","Sudanese","Siberian","Turkish","Thai","Tanzanian","Ugandan","Uzbek","Ukrainian","Venetian","Venezuelan","Victorian","Welsh","Wiccan","Wakandan","Xhosan","Xerxian","Xanthian","Yiddish","Yemeni","Yorkish","Zimbabwean","Zambian","Zootopian"];
const verbs = ["attack","assault","answer","berate","beat","block","create","call","choke","deny","defeat","discover","eat","elect","employ","fight","favor","feed","goad","grab","generate","hate","haunt","help","idolize","imagine","impress","jinx","judge","justify","know","keep","kill","like","lick","label","make","mourn","marry","nag","nationalize","neutralize","observe","offend","obliterate","pay","pass","paint","quash","quantify","quiz","ravage","repair","replace","see","scrub","select","tackle","target","teach","understand","undermine","usurp","vindicate","vandalize","vanquish","warn","whack","wheedle","yank","yoke","yield","zap","zest","zip"];
const atplaces = ["at armories","at bars","at church","at diners","at events","at firehouses","at gardens","at home","at infirmaries","at jails","at kindergartens","at lakes","at malls","at nightclubs","at offices","at pharmacies","at quarries","at railways","at school","at theaters","at unveilings","at villas","at weddings","at yachts","at zones"];
const atverbs = ["aim at","bat at","cry at","dive at","erupt at","flaunt","gripe at","harp at","itch at","jump at","kick at","look at","marvel at","neg at","ogle at","punch at","quack at","run at","stare at","tap at","unsheathe at","vomit at","wail at","yawn at","zoom at"];
const numbersuffixes = ["armed","brained","chinned","dimensional","eared","faced","geared","headed","ingredient","jawed","kneed","legged","mouthed","nosed","orificed","pointed","quilled","ribbed","sided","toed","uddered","vertex","winged","yard","zoned"];
const verbsX = ["explode","excommunicate","excavate"];
const atplacesX = ["at excavations"];
const atverbsX = ["exclaim at"];
const numbersuffixesX = ["extremitied"];

nMap = new Map();
aMap = new Map();
vMap = new Map();
apMap = new Map();
nsMap = new Map();
snMap = new Map();
svMap = new Map();
masterDict = new Map();

function initDictionary(){
	fullMaps=[nMap, aMap, apMap,snMap];
	lowerMaps=[vMap, nsMap, svMap];
	lowerAlphabet="abcdefghijklmnopqrstuvwxyz";
	fullAlphabet="ABCDEFGHIJKLMNOPQRSTUVWXYZ"+lowerAlphabet;
	for (var i = 0; i < fullMaps.length; i++) {
		for (var ii = 0; ii < fullAlphabet.length;ii++) {
			fullMaps[i].set(""+fullAlphabet.charAt(ii),[]);
		}
	}
	for (var i = 0; i < lowerMaps.length; i++) {
		for (var ii = 0; ii < lowerAlphabet.length; ii++) {
			lowerMaps[i].set(""+lowerAlphabet.charAt(ii),[]);
		}
	}
	for (var i = 0; i < lowerAlphabet.length; i++) {
		vMap.set(""+lowerAlphabet.charAt(i)+"@",[]);
	}
	for (var i = 0; i < nouns.length; i++) {
		tmp = nouns[i];
		char = ""+tmp.charAt(0);
		if(tmp=="Mercedes")
			snMap.get(char).push(tmp);
		else if (tmp =="zombies")
			snMap.get(char).push("zombie");
		else if(tmp == "Rolexes")
			snMap.get(char).push("Rolex");
		else if(tmp.match(/ies$/))
			snMap.get(char).push(tmp.substring(0,tmp.length-3)+"y");
		else if (tmp.match(/s$/))
			snMap.get(char).push(tmp.substring(0,tmp.length-1));
		else if (tmp.match(/men$/))
			snMap.get(char).push(tmp.substring(0,tmp.length-2)+"an");
		else if (tmp=="children")
			snMap.get(char).push("child");
		else if (tmp=="geese")
			snMap.get(char).push("goose");
		else if (tmp=="people")
			snMap.get(char).push("person");
		nMap.get(char).push(tmp);
	}
	for (var i = 0; i < adjectives.length; i++) {
		tmp = adjectives[i];
		aMap.get(""+tmp.charAt(0)).push(tmp);
	}
	for (var i = 0; i < verbs.length; i++) {
		tmp = verbs[i];
		char = ""+tmp.charAt(0);
		if (tmp.match(/y$/) && tmp!="employ")
			svMap.get(char).push(tmp.substring(0,tmp.length-1)+"ies");
		else if(["jinx","pass","quash","vanquish","teach"].includes(tmp))
			svMap.get(char).push(tmp+"es");
		else if(tmp=="quiz")
			svMap.get(char).push("quizzes");
		else
			svMap.get(char).push(tmp+"s");
		vMap.get(char).push(tmp);
	}
	for (var i = 0; i < atplaces.length; i++) {
		tmp = atplaces[i];
		apMap.get(""+tmp.charAt(0)).push(tmp);
	}
	for (var i = 0; i < atverbs.length; i++) {
		tmp = atverbs[i];
		vMap.get(""+tmp.charAt(0)+"@").push(tmp);
	}
	for (var i = 0; i < numbersuffixes.length; i++) {
		tmp = numbersuffixes[i];
		nsMap.get(""+tmp.charAt(0)).push(tmp);
	}
	for (var i = 0; i < verbsX.length; i++) {
		vMap.get("x").push(verbsX[i]);
	}
	for (var i = 0; i < atplacesX.length; i++) {
		apMap.get("x").push(atplacesX[i]);
	}
	for (var i = 0; i < atverbsX.length; i++) {
		vMap.get("x@").push(atverbsX[i]);
	}
	for (var i = 0; i < numbersuffixesX.length; i++) {
		nsMap.get("x").push(numbersuffixesX[i]);
	}

	masterDict.set("noun",nMap);
	masterDict.set("adjective",aMap);
	masterDict.set("verb",vMap);
	masterDict.set("adverb",apMap);
}

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
	m = generateMnemonic(r);
	while((!approvePassword(r,modes))||m==-1){
		r=generate(pwLength,seed);
		m=generateMnemonic(r);
	}
	return r;
}


//Modes
//Security
//0 - At least 20% not just letters and at least 35% of those are special characters 
//1 - At least 30% of letters are uppercase and lowercase
//2 - No character is more than 1.5x as frequent as it should be (based on the length of charset)
//Mnemonic compatibility
//3 - Punctuation
//		-No consecutive punctuation besides ?!
//		-No less than three words can occur before . or @
//		-Punctuation cannot begin a pw
function checkPassword(pw, mode){
	pwLength = pw.length;
	switch(mode){
		case 0:
			letterCount=numberCount=totalCount=0;
			for (var i = pwLength - 1; i >= 0; i--) {
				c = pw.charCodeAt(i);
				if(isLetter(c)){
					letterCount++;
				}else if(isNumber(c)){
					numberCount++;
				}
				totalCount++;
			}
			nonLetters=totalCount-letterCount;
			return (nonLetters>=(0.2*pwLength))&&(numberCount<=.65*(nonLetters));
		case 1:
			letterCount=upperCount=lowerCount=0;
			for (var i = pwLength - 1; i >= 0; i--) {
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
			for (var i = pwLength - 1; i >= 0; i--) {
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
		case 3:
			if (pwLength<=3)
				return false;
			sinceLast=0;
			last=0;
			for (var i = 0; i<pwLength; i++){
				c=pw.charCodeAt(i)
				if(isSpecialChar(c)){
					if(sinceLast<3){
						//?! edge case
						if ((sinceLast==0)){
							if (!(last == 63&&c==33)){
								return false;
							}
						//! and ? can have < 3 words before them  (not . or @)						
						}else if (c == 46 || c==64){
							return false;
						}
					}
					sinceLast=0;
					last = c;
				}else{
					sinceLast++;
				}

			}

			return true;
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


function isNumber(c){
	return (c>=48&&c<=57);
}

function evalFirst(s, f){
	return f(s.charCodeAt(0));
}

function isSpecialChar(c){
	return !(isLetter(c)||isNumber(c));
}

function generateMnemonic(pw){
	punc=[];

	for (var i = 0; i < pw.length; i++) {
		if(i!=pw.length-1&&pw.substring(i,i+2)=="?!"){
			punc.push("?!");
			i++;
		}else{
			c=pw.charAt(i);
			if(c.match(/^[!?.]$/)){
				punc.push(""+c);
			}
		}
	}
	sentences = pw.split(/(?!)|[!?.]/);
	postSentences = [];
	for (var si =0; si<sentences.length;si++){
		s=sentences[si];
		if(s==''){
			continue;
		}

		possibleVerbIndices=[];

		typesInit = [];
		unitsInit = deepclone(s.split(''));
		for (var i = 0; i < unitsInit.length; i++) {
			typesInit.push("none");
		}
		
		//Group numbers
		for (var i =unitsInit.length-1; i >0; i--) {
			if(evalFirst(unitsInit[i],isNumber)){
				if(evalFirst(unitsInit[i-1],isNumber)){
					unitsInit[i-1]+=unitsInit.splice(i,1);
					typesInit.splice(i,1);
				}
			}
		}	

		for (var i = 1; i <unitsInit.length-1; i++) {
			if(evalFirst(unitsInit[i],isLower)){
				possibleVerbIndices.push(i);
			}
		}

		types=deepclone(typesInit);
		units=deepclone(unitsInit);

		if(possibleVerbIndices.length==0){
			return -1;
		}


		mid = Math.ceil((units.length-1)/2);
		possibleVerbIndices.sort(function(a,b){
			return distCompare(a,b,mid)
		});

		good=false;

		for(var vi = 0; vi< possibleVerbIndices.length;vi++){
			v=possibleVerbIndices[vi];
			types=deepclone(typesInit);
			units=deepclone(unitsInit);
			listss = tryGenerateLists(v);
			attempt=tryFormSentence(listss);
			if(attempt==1){
				good=true;
				break;
			}

			function tryFormSentence(xxx){
				if(xxx[0]!=-1){
					try{
						singleClause=false;
						final = [];
						for (var i = 0; i < units.length; i++) {
							toPush = getWord(units[i],types[i]);
							if(types[i-1]=="verb"){
								singleClause=false;
							}
							if(units[i]=="1"){
								singleClause=true;
							}

							toPush=getWord(units[i],types[i],singleClause);
							final.push(toPush);
						}
						postSentences.push(final.join(" "));
						return 1;
					}catch(e){
						return [-1,e];
					}
				}return -1;	
				function getWord(small,type, single=false){
					//big & furry
					if(small.includes("&")){
						return small.split("&").map(x=>getWord(x,type)).join(" and ");
					}
					//one hundred
					else if(small.match(/^([0-9])+$/)&&type=="adjective"){
						return converter.toWords(small);
					}
					//stare at
					else if(small.match(/^[a-z]@$/)&&type=="verb"){
						array=avMap.get(""+small.charAt(0));
						return array[Math.floor(Math.random() * array.length)];
					}
					//10-legged
					else if(small.match(/^[0-9]+[a-z]$/)&&type=="adjective"){
						array=nsMap.get(""+small.charAt(small.length-1));
						return (converter.toWords(small.substring(0,small.length-1)))+"-"+(array[Math.floor(Math.random() * array.length)]);
					}else if(single&&type=="noun"){
						array = snMap.get(""+small.charAt(0));
						return array[Math.floor(Math.random() * array.length)];
					}else if(single&&type=="verb"){
						array = svMap.get(""+small.charAt(0));
						return array[Math.floor(Math.random() * array.length)];
					}
					else{
						dict=masterDict.get(type);
						array=dict.get(small);
						return array[Math.floor(Math.random() * array.length)];
					}
				}
			}

			function tryGenerateLists(verbIndex){
				types[verbIndex]="verb";			

				//Number/@ Pair handling
				for (var i = units.length-1;i>=0;i--){
					c = units[i].charAt(0);
					if(c=='@'){
						if(i == units.length-2 && evalFirst(units[units.length-1], isLetter)){
							types[i]="adverb";
							units[i]="@"+removeElement(i+1,1);
						}else if(i>0&&types[i-1]=="verb"){
							units[i-1]+=removeElement(i,1);
						}else{
							return [-1,0];
						}
					}else if(evalFirst(c,isNumber)){
						//if its the first character
						if(i==0){
							types[i]="adjective";
						}
						//if it can be a compound adjective (4-headed)
						else if(i<=units.length-3&&units[i+1].length==1&&units[i+1].match(/[a-z]/)&&trySetType(i+1,"adjective")){
							units[i]+=removeElement(i+1,1);
							types[i]="adjective";
						}
						//if it can just be an adjective (three) (comes right after a verb)
						else if(types[i-1]=="verb"&&i<=units.length-2){
							types[i]="adjective";
						}else{
							return [-1,1];
						}
					}
				}

				//adverb and last noun handling
				l = units.length-1;
				if(types[l]=="adverb"){
					l--;
				}
				if(!trySetType(l,"noun")){
					return [-1,4];
				}
				//typesetting each unit
				for (var i = l-1; i >= 0; i--) {
					if(units[i]=="&"){
						if((units[i-1]!=undefined&&units[i-1].match(/^[0-9]$/))||(!trySetType(i-1, types[i+1]))){
							return [-1,5];
						}
						units[i-1]+=removeElement(i,2).join("");
						i-=1;
					}else if(types[i+1]=="verb"){
						if(!trySetType(i,"noun")){
							return [-1,6];
						}
					}else if(i!=verbIndex){
						if(!trySetType(i,"adjective")){
							return [-1,7];
						}
					}
				}
				function removeElement(index,length){
					if(index<=verbIndex){
						verbIndex-=length;
					}
					types.splice(index, length);
					return(units.splice(index,length));
				}


				return [units, types];
			}
			function trySetType(index, type){
				if(types[index]=="none"){
					types[index]=type;
				}
				return types[index]==type;
			}
		}
		if(!good){
			return -1;
		}
	}

	mnemonic="";

	if(postSentences.length==0){
		return -1;
	}
	for (var i = 0; i < postSentences.length; i++) {
		mnemonic+=postSentences[i]+(i<punc.length ? punc[i] : "")+" ";
	}

	return mnemonic.trim();

}

function distCompare(x,y,z){
	//distance from x to z
	xdist=Math.abs(z-x);
	//distance from y to z
	ydist=Math.abs(z-y);

	return Math.sign(xdist-ydist);
}

module.exports = { generateApprovedPassword, initDictionary, generateMnemonic };