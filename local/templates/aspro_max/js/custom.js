/*
You can use this file with your scripts.
It will not be overwritten when you upgrade solution.
*/

BX.ready(function(){

    (function (window) {

        window.ProductPrice = function(minPrice, oldPrice, economy){
            this.minPrice = minPrice;
            this.oldPrice = oldPrice;
            this.economy = economy;
        }
        // this.minPrice = this.getMinPrice();
        
    }(window));

    var summTotal = document.createElement('div');
    summTotal.className = "c_summ_total";

    document.body.appendChild(summTotal);


    var minPrice, oldPrice, economy;
    var currentMinPrice, currentOldPrice, currentEconomy;

    var block = document.getElementsByClassName("prices_block")[0];
 

    var input = $(".counter_block").find("input[type=text]");

    $(input).on('change', function(e){
        var quantity = Number(e.target.value);

        minPrice = minPrice * quantity;
        oldPrice = oldPrice * quantity;
        economy =  economy * quantity;



        debugger
        // есть в наборе
        var summNabor = window['isActiveNabor']();
        if(summNabor > 0){
            currentMinPrice = minPrice + summNabor;
            currentOldPrice = oldPrice + summNabor;
            currentEconomy = currentOldPrice - currentMinPrice;
        }else{
            currentMinPrice = minPrice;
            currentOldPrice = oldPrice ;
            currentEconomy = economy;
        }

        console.log(currentMinPrice)
        console.log(currentOldPrice)
        console.log(currentEconomy)
    });
    window['isActiveNabor'] = function(){
        var tr = BX.findChild(document.getElementsByClassName('bx-added-item-table')[0], {tagName: "TR"});
        var isNaborActive = false;
        var summNabor = 0;
        if(tr){
            for(k in tr){
				if(tr.classList.contains('choice')){
                    isNaborActive = true;
                    summNabor += tr[k].getAttribute('data-price');
				}
			}
        }
        return summNabor;
    }

    window['recalcPricesCustom'] = function(){

    }

    window['getMinPrice'] = function getMinPrice(blockPrice){
        debugger
        if(BX.findChild(blockPrice, {className: "price_group min"}, true)){
            var priceMin = BX.findChild(blockPrice, {className: "price_group min"}, true)
            var priceMinValues = BX.findChild(priceMin, {className: "price"}, true, true)
            
            for(var i = 0; i < priceMinValues.length; i++){
				if(!priceMinValues[i].classList.contains("discount")){
					// min price val
                    // var priceVal = BX.findChild(priceMinValues[i], {className: "price_value"}, true);
                    var priceVal = priceMinValues[i].getAttribute("data-value");
                    // minPrice = priceVal;
				}
			}
        }else{
            var priceMinValues = BX.findChild(blockPrice, {className: "price"}, true, true)
			
			for(var i = 0; i < priceMinValues.length; i++){
				if(!priceMinValues[i].classList.contains("discount")){
                    // var priceVal = BX.findChild(priceMinValues[i], {className: "price_value"}, true);
                    var priceVal = priceMinValues[i].getAttribute("data-value");
                    // minPrice = priceVal;
				}
			}
        }
        return priceVal;
    }

    window['getOldPrice'] = function getOldPrice(blockPrice){
        debugger
        if(BX.findChild(blockPrice, {className: "price_group min"}, true)){
			// set min price
			var priceMin = BX.findChild(blockPrice, {className: "price_group min"}, true)
			var priceMinValues = BX.findChild(priceMin, {className: "price"}, true, true)
	
			for(var i = 0; i < priceMinValues.length; i++){
				if(priceMinValues[i].classList.contains("discount")){
					// discount
                    // var priceDiscountVal = BX.findChild(priceMinValues[i], {className: "price_value"}, true);
                    var priceDiscountVal = priceMinValues[i].getAttribute('data-value');
					// oldPrice = priceDiscountVal;
				}
			}
		}else{
			var priceMinValues = BX.findChild(blockPrice, {className: "price"}, true, true)
            
			for(var i = 0; i < priceMinValues.length; i++){
				if(priceMinValues[i].classList.contains("discount")){
                    // var priceDiscountVal = BX.findChild(priceMinValues[i], {className: "price_value"}, true);
                    var priceDiscountVal = priceMinValues[i].getAttribute('data-value');
					// oldPrice = priceDiscountVal;
				}
			}
        }
        return priceDiscountVal;
    }
    window['getEconomy'] = function getEconomy(blockPrice){
        debugger
        if(BX.findChild(blockPrice, {className: "price_group min"}, true)){
            var priceMin = BX.findChild(blockPrice, {className: "price_group min"}, true)

            if(BX.findChild(priceMin, {className: "sale_block"}, true)){
                var saleBlock = BX.findChild(priceMin, {className: "sale_block"}, true);
                var saleVal = BX.findChild(saleBlock, {className: "price_value"}, true);
                // economy = saleVal.innerText;
            }
        }else{
            var priceMinValues = BX.findChild(blockPrice, {className: "price"}, true, true)

            if(BX.findChild(blockPrice, {className: "sale_block"}, true)){
                var saleBlock = BX.findChild(blockPrice, {className: "sale_block"}, true);
                var saleVal = BX.findChild(saleBlock, {className: "price_value"}, true);
                // economy = saleVal.innerText;

            }
        }
        return saleVal.innerText;
    }

    minPrice = Number(window['getMinPrice'](block));
    oldPrice = Number(window['getOldPrice'](block));
    economy = Number(window['getEconomy'](block));

    console.log()

});