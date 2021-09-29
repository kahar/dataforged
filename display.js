
var BACKGROUND_COLOR_SUGGESTIONS = 'lightyellow'
var BACKGROUND_COLOR_ORACLES = 'lightblue'
var BACKGROUND_COLOR_MULTIPLE_ROLLS = 'lightcoral'
var BACKGROUND_COLOR_GAME_OBJECT = 'lightgreen'
var BACKGROUND_COLOR_DERELICT_LOCATION = 'lightcyan'
var BACKGROUND_COLOR_PLANET = 'lightsalmon'
var BACKGROUND_COLOR_SETTLEMENT = 'lightskyblue'
var BACKGROUND_COLOR_DERELICT = 'lightpink'
var BACKGROUND_COLOR_PRECURSOR = 'yellow'
var BACKGROUND_COLOR_PRECURSOR_VAULT_INTERNAL = 'coral'
var BACKGROUND_COLOR_11 = 'cyan'

/*Tabs part*/
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (var i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (var i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}
/*markdown to html converter*/
var converter = new showdown.Converter({
    extensions: ['table']
});

/*local storage*/
var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];
var content = document.getElementsByClassName("modal-content-txt")[0];

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function displayInModal(newContent) {
    content.innerHTML = newContent;
    modal.style.display = "block";
}

function addToLocalStoreHistory() {
    var currentHistory = JSON.parse(localStorage.getItem("history"));
    currentHistory.push(document.getElementsByClassName("modal-content-txt")[0].innerHTML);

    localStorage.setItem("history", JSON.stringify(currentHistory));

}

function showLocalStoreHistory() {
    var array = JSON.parse(localStorage.getItem("history"));
    var strToDisplay = "";
    for (var i = 0; i < array.length; i++) {
        strToDisplay = strToDisplay + "#" + i + " " + array[i] + "<br>";
    }
    displayInModal(strToDisplay);
}

function clearLocalStoreHistory() {
    localStorage.setItem("history", JSON.stringify([]));
}
if (localStorage.getItem("history") == null) {
    localStorage.setItem("history", JSON.stringify([]));
}

/*other*/
function hideSubElements(el) {
    var element = $(el).parent().find('#subelements');

    if (element.is(":visible")) {
        element.hide();
    } else {
        element.show();
    }
}

function toId(txt) {
    return (txt).replace(/\s+/g, '-').replace('/', '\\/').replace(/:\s*/g, "");
}

function spaceToUnderscore(txt) {
    return (txt).replace(/\s+/g, '_').replace(/:\s*/g, "");
}

function cleanText(txt) {
    return txt.replace(/[^0-9a-z\s]/gi, '');
}

function getNameOrDisplayName(obj) {
    return obj.Name != null ? obj.Name : obj["Display name"];
}

function pickRandomFromJsArray(t) {
    return t[Math.floor(Math.random() * t.length)];
}



/*roll oracles*/

var enforceOneRoll = false;
var enforcedResult = 100;




/*other*/
        function todo() {
            //enforceOneRoll = true;
            //enforcedResult = 100;
            //var txt = rollOnOracleSF(oracles.Starship.Starship_Type)
            //displayInModal(txt);
            alert('not implemented yed');
        }

