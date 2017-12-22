// settings.js
// Michael Roudnitski 12/21/2017
var $ = require('jquery');

var selected = '';  // string storing the name of the coin the user wishes to add to their tracking list

$(document).ready(function() {
    var coinsJSON = {};             // object storing data retreived from coinmarketcap
    $('#search').click(function(){  // when the user clicks on the text field
        if (jQuery.isEmptyObject(coinsJSON)) {
            $.getJSON("https://api.coinmarketcap.com/v1/ticker/?limit=0").done(function(json) {
                coinsJSON = json;
            });
        }
    });
    $('#search').keyup(function() { // when the user finishes keyboard input
        search(coinsJSON);
    });

    $('#addButton').click(function() {
        if (selected.length > 0) {  // if the selection string exists
            addToTrackedList(selected); // add the selected coin to the users list of coins to track
        }
    });

    listCoins();    // list all coins selected by the user
});

function search(data) {
    // handles searching of available coins
    $('#results').html(''); // remove all previous results
    var expression = new RegExp($('#search').val(), "i");   // create our regular expression

    if ($('#search').val().length == 0) {   // remove search results if the search box is empty
        $('#results').html('')
        $('#addButton')[0].innerHTML = "Add";
        $('#addButton')[0].disabled = true;
        selected = null;
    } else {    // if the search box is not empty
        $.each(data, function(i, coin ) {   // for each item(coin) in our json data
            if ($('#results').children().length < 4) {  // if we have not yet found 4 matches
                if(coin.name.search(expression) != -1) {    // find a match with our regexp
                    $('#results').append('<li class="list-group-item list-group-item-action">'+coin.name+'</li>'); // append each matching result as a list item
                    // no sorting necessary as cmc already provides JSON sorted by most popular
                }
            }
        });
    }

    $('.list-group-item-action').click(function() { // add a click listener to each search result
        selected = this.innerHTML;  // sets the selection variable to the name of the coin clicked by the user
        $.each($(".list-group-item-action.active"), function() {
            $(this).removeClass("active");  // make all list items inactive
        });
        $(this).addClass("active"); // make the clicked list item active
        if (this.innerHTML.length > 0) {    // if the selected list item is valid
            $('#addButton')[0].disabled = false;    // set the button to active
        }
        $('#addButton')[0].innerHTML = "Add "+$(this).html();   // change the text displayed by the button to contain the name of the selected coin
    });
}

function addToTrackedList(coinName) {
    // adds the selected coin to the users list of coins to track
    coins = localStorage.getItem("coins").split(',');   // get the users preferences
    if (jQuery.inArray(coinName, coins) != -1) {
        return false;   // retrun false if the user is already tracking the selected coin
    } else {
        coins.push(coinName);   // add the selected coin to the user's list
        localStorage.setItem("coins", coins);   // save the new list
        listCoins();                            // outputs the new list to the ui
        // reset search
        $('#search')[0].value = '';
        $('#results').html('')
        $('#addButton')[0].innerHTML = "Add";
        $('#addButton')[0].disabled = true;
        selected = null;
        //
    }
}

function listCoins() {
    $("#trackedCoinsList").empty(); // removes current list from ui
    var coins = localStorage.getItem("coins").split(',');   // retreive user's list of coins
    if (coins.length > 0 && coins[0] != '') {               // if the users list of coins are not empty
        for (i=0; i<coins.length; i++) {                    // create a list item for each coin
            $('#trackedCoinsList').append(
                "<li class=\"list-group-item\">"+coins[i]+"\
                    <button type=\"button\" class=\"close remove-coin\" id=\""+coins[i]+"\"aria-label=\"Close\">\
                        <span aria-hidden=\"true\">&times;</span>\
                    </button></h3>\
                </li>");
        }
        $.each($(".close.remove-coin"), function() {        // add a removal button for each coin
            $(this).click(function() {
                index = jQuery.inArray(this.id, coins);
                if (index > -1 && coins.length > 1) {       // if the coin is in the user's list and there are at least 2 coins
                    coins.splice(index, 1);                 // remove the coin from the user's list
                }
                localStorage.setItem("coins", coins);       // overwrite the preferences
                listCoins();                                // output new list of coins to ui
            });
        });
    }
}
