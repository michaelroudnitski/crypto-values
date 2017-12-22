// fetch.js
// Michael Roudnitski 12/21/2017

$(document).ready(function() {
    var cmcAPI = "https://api.coinmarketcap.com/v1/ticker/?limit=0";
    getData(cmcAPI);
});

function appendText(symbol, value, change, time) {
    if (change < 0){
        var clr = "red";
    } else {
        var clr = "green";
    }
    $("#content").append(
        "<div class=\"card border-light mb-3\">\
            <div class=\"card-body\">\
                <h5 class=\"card-text\" id=\"change\" style=\"color:"+clr+"\";>("+change+")</h5>\
                <h3>"+symbol+"</h3>\
                <h4 class=\"card-title\">$"+value+"</h4>\
                <p class=\"card-text\"><small class=\"text-muted\">Last Updated: "+time+"</small></p>\
            </div>\
        </div>"
    );
}

function getData(url) {
    if (localStorage.getItem("coins") == null) {
        localStorage.setItem("coins", ["Bitcoin", "Ethereum"]);
    }
    console.log(localStorage.getItem("coins").split(','));
    var selectedCoins = localStorage.getItem("coins").split(',');
    $.getJSON(url, function(data) {
        $.each(data, function(i, coin ) {
            if (jQuery.inArray(coin.name, selectedCoins) != -1){
                appendText(
                    coin.symbol,
                    parseFloat(coin.price_usd).toPrecision(5),
                    parseFloat(coin.percent_change_24h).toFixed(2),
                    convertTime(coin.last_updated)
                );
            }
        });
    });
}

function convertTime(time) {
    var date = new Date(time*1000);
    var hh = date.getHours();
    var mm = "0" + date.getMinutes();
    return hh+':'+mm.substr(-2);
}
