var replacement = '\uD83D\uDCA9';
function walk(node) 
{
	// I stole this function from here:
	// http://is.gd/mwZp7E
	
	var child, next;
	// 3 == text
	// 8 == html comments
	switch ( node.nodeType )  
	{
		case 1:  // Element
		case 9:  // Document
		case 11: // Document fragment
			if(node.tagName.toLowerCase() == 'input' && node.type == 'text')
			{
				handleTextInput(node);
			}else{
				child = node.firstChild;
				while ( child ) 
				{
					next = child.nextSibling;
					walk(child);
					child = next;
				}
			}
			
			break;

		case 3: // Text node
			handleText(node);
			break;
		default :
		break;
	}
}

function handleTextInput(node){
	var v = node.value;

	for(var i = 0, l = words.length;i<l;i++){
		var r = new RegExp("\\b"+words[i]+"\\b", "gi");
		v = v.replace(r, replacement);
	}
	
	node.value = v;
}

function handleText(textNode) 
{
	var v = textNode.nodeValue;

	for(var i = 0, l = words.length;i<l;i++){
		var r = new RegExp("\\b"+words[i]+"\\b", "gi");
		v = v.replace(r, replacement);
	}
	
	textNode.nodeValue = v;
}

function handleTitle(document) 
{
	var v = document.title;

	for(var i = 0, l = words.length;i<l;i++){
		var r = new RegExp(words[i], "gi");
		v = v.replace(r, replacement);
	}
	
	document.title = v;
}
var words = [];
function doReplacement(newWords){
	if(typeof newWords == "undefined")
	{
		chrome.storage.local.get('words', function (result) {
			if(result.words){
				words = result.words;
				walk(document.body);
				handleTitle(document);
			}
		});
	}else{
		words = newWords;
		walk(document.body);
		handleTitle(document);
	}
}
doReplacement();

var config = { attributes: true, childList: true, characterData: true };
var observer = new MutationObserver(function(mutations) {
	doReplacement();
});
observer.observe(document.body, config);

chrome.runtime.onMessage.addListener(function(request, sender, callback) {
	if(request.words)
		doReplacement(request.words);
});