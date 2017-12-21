// settings.js
// Michael Roudnitski 12/21/2017

var selected = '';

$(document).ready(function() {
    var coinsJSON = {};
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
        if (selected.length > 0) {
            addToTrackedList(selected);
        }
    });

    listCoins();
});

function search(data) {
    $('#results').html(''); // remove all previous results
    var expression = new RegExp($('#search').val(), "i");   // create our regular expression

    if ($('#search').val().length == 0) {
        $("form.list-group").empty();
    } else {
        $.each(data, function(i, coin ) {   // for each item(coin) in our json data
            if ($('#results').children().length < 4) {  // if we have not yet found 4 matches
                if(coin.name.search(expression) != -1) {    // find a match with our regexp
                    $('#results').append('<li class="list-group-item list-group-item-action">'+coin.name+'</li>'); // append each matching result as a list item
                    // no sorting necessary as cmc already provides JSON sorted by most popular
                }
            }
        });
    }

    $('.list-group-item-action').click(function() {
        selected = this.innerHTML;
        $.each($(".list-group-item-action.active"), function() {
            $(this).removeClass("active");
        });
        if (this.innerHTML.length > 0) {
            $('#addButton')[0].disabled = false;
        }
        $(this).addClass("active");
        $('#addButton')[0].innerHTML = "Add "+$(this).html();
    });
}

function addToTrackedList(coinName) {
    coins = localStorage.getItem("coins").split(',');
    if (jQuery.inArray(coinName, coins) != -1) {
        alert("already in the list");
    } else {
        coins.push(coinName);
        localStorage.setItem("coins", coins);
        listCoins();
    }
}

function listCoins() {
    $("#trackedCoinsList").empty();
    var trackedCoins = localStorage.getItem("coins").split(',');
    for (i=0; i<trackedCoins.length; i++) {
        $('#trackedCoinsList').append(
            "<li class=\"list-group-item\">"+trackedCoins[i]+"\
                <button type=\"button\" class=\"close\" id=\""+trackedCoins[i]+"\"aria-label=\"Close\">\
                    <span aria-hidden=\"true\">&times;</span>\
                </button></h3>\
            </li>");
    }
    $.each($(".close"), function() {
        $(this).click(function() {
            coins = localStorage.getItem("coins").split(',');
            coins.splice(jQuery.inArray(this.id, coins), 1);
            localStorage.setItem("coins", coins);
            listCoins();
        });
    });
}
