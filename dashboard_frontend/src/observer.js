var myElement = $('#1000').find('.bk-toolbar bk-toolbar-right');

var observer = new MutationObserver(function(mutations) {
   if (document.contains(myElement)) {
        console.log("It's in the DOM!");
        observer.disconnect();
    }
});

observer.observe(document, {attributes: false, childList: true, characterData: false, subtree:true});

$("body").append(myElement); // console.log: It's in the DOM!