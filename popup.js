// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var words = [];
chrome.storage.local.get('words', function (result) {
	if(result.words){
		words = result.words;
		for(var w in words){
			addRow(null,words[w]);
		}
	}
});

function getWords(){
  var divs = document.querySelectorAll('.segment');
  var ws = [];
  for (var i = 0; i < divs.length; i++) {
  	var value = divs[i].querySelector('input');

  	if(value && value.value.length > 0){
		  ws.push(value.value);
  	}
  }
  return ws;
}

function deleteWord(e){
	var topParent = e.target.parentNode.parentNode;
	var val = topParent.querySelector('input').value;
	if(words && words.length > 0){
		var index = words.indexOf(val);
		if(index > -1){
			words.splice(index,1);
			chrome.storage.local.set({'words': words});
		}
	}
	
	topParent.parentNode.removeChild(topParent);
}

function addRow(e,word){
	if(typeof word == "undefined")
		word = '';

	var row = '<div class="segment">'+
    '<label>'+
      '<input type="text" value="'+word+'"></input>'+
    '</label>'+
    '<span class="delete">X</span>'+
  '</div>';
  var el = document.createElement('div');
  el.innerHTML = row;

  el.querySelector('.delete').addEventListener('click',deleteWord);

  var list = document.getElementById('word-list');
  list.insertBefore( el, list.firstChild );
}

function replace(tabId) {

  words = getWords();
  chrome.storage.local.set({'words': words});
  chrome.tabs.query(
        { currentWindow: true, active: true },
        function (tabArray) {
         chrome.tabs.sendMessage(tabArray[0].id, {words:words});
     	}
	);
  window.close();
}

document.addEventListener('DOMContentLoaded', function () {

  var adder = document.querySelector('.segment.add');
  adder.addEventListener('click',addRow);  

  var button = document.querySelector('#replace');
  button.addEventListener('click',replace);

});