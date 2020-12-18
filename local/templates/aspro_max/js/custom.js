/*
You can use this file with your scripts.
It will not be overwritten when you upgrade solution.
*/

BX.ready(function(){

    // (function (window) {

        window.ProductPrice = function(minPrice, oldPrice, economy){
            debugger
            this.minPrice = minPrice;
            this.oldPrice = oldPrice;
            this.economy = economy;
            this.block = document.getElementsByClassName("prices_block")[0];
        }
        window.ProductPrice.prototype = {
            getProduct: function(){
                return this.block;
            }
        }
        // this.minPrice = this.getMinPrice();
        
    // }(window));
    var ProductPrice = (function(){
        
        function ProductPrice (){

            this.blockPrice = document.getElementsByClassName("prices_block")[0];

            this.minPrice = getMinPrice.call(this);
            this.oldPrice = getOldPrice.call(this);
            this.economy = getEconomy(this);

            this.currentMinPrice = this.minPrice;
            this.currentOldPrice = this.oldPrice;
            this.currentEconomy  = this.economy;

            // this.quantity = null;
        }

        function getMinPrice(){
            if(BX.findChild(this.blockPrice, {className: "price_group min"}, true)){
                var priceMin = BX.findChild(this.blockPrice, {className: "price_group min"}, true)
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
                var priceMinValues = BX.findChild(this.blockPrice, {className: "price"}, true, true)
                
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

        function getOldPrice(){
            
            if(BX.findChild(this.blockPrice, {className: "price_group min"}, true)){
                // set min price
                var priceMin = BX.findChild(this.blockPrice, {className: "price_group min"}, true)
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
                var priceMinValues = BX.findChild(this.blockPrice, {className: "price"}, true, true)
                
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

        function getEconomy(){

            if(BX.findChild(this.blockPrice, {className: "price_group min"}, true)){
                var priceMin = BX.findChild(this.blockPrice, {className: "price_group min"}, true)
    
                if(BX.findChild(priceMin, {className: "sale_block"}, true)){
                    var saleBlock = BX.findChild(priceMin, {className: "sale_block"}, true);
                    var saleVal = BX.findChild(saleBlock, {className: "price_value"}, true);
                    // economy = saleVal.innerText;
                }
            }else{
                var priceMinValues = BX.findChild(blockPrice, {className: "price"}, true, true)
    
                if(BX.findChild(blockPrice, {className: "sale_block"}, true)){
                    var saleBlock = BX.findChild(this.blockPrice, {className: "sale_block"}, true);
                    var saleVal = BX.findChild(saleBlock, {className: "price_value"}, true);
                    // economy = saleVal.innerText;
    
                }
            }
            return saleVal.innerText;
        }

        ProductPrice.prototype.changePrices() = function(quantity){
            var quantity = Number(quantity);

            this.minPrice = minPrice * quantity;
            this.oldPrice = oldPrice * quantity;
            this.economy =  economy * quantity;

            var summNabor = getSummNabor.call(this);
            
            if(summNabor > 0){
                this.currentMinPrice = this.minPrice + summNabor;
                this.currentOldPrice = this.oldPrice + summNabor;
                this.currentEconomy = this.currentOldPrice - this.currentMinPrice;
            }else{
                this.currentMinPrice = this.minPrice;
                this.currentOldPrice = this.oldPrice;
                this.currentEconomy = this.economy;
            }
    
            console.log(currentMinPrice)
            console.log(currentOldPrice)
            console.log(currentEconomy)
        }

        function getSummNabor(){
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

        // function 
        return ProductPrice;
    }());

    window['ProductPrice'] = new ProductPrice;

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
        var summNabor = window['getSummNabor']();
        if(summNabor > 0){
            currentMinPrice = minPrice + summNabor;
            currentOldPrice = oldPrice + summNabor;
            currentEconomy = currentOldPrice - currentMinPrice;
        }else{
            currentMinPrice = minPrice;
            currentOldPrice = oldPrice;
            currentEconomy = economy;
        }

        console.log(currentMinPrice)
        console.log(currentOldPrice)
        console.log(currentEconomy)
    });
    window['getSummNabor'] = function(){
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
    window['setPricesCustom'] = function(block){
        if(BX.findChild(block, {className: "price_group min"}, true)){
			var priceMin = BX.findChild(block, {className: "price_group min"}, true);
            var priceMinValues = BX.findChild(priceMin, {className: "price"}, true, true);
            for(var j = 0; j < priceMinValues.length; j++){
				if(priceMinValues[j].classList.contains("discount")){
                    priceMinValues[j].setAttribute("data-value", currentOldPrice);
                }else{
                    var priceVal = BX.findChild(priceMinValues[j], {className: "price_value"}, true);
                    priceVal.innerHTML = BX.Currency.currencyFormat(currentMinPrice, "RUB", false);
					priceMinValues[j].setAttribute("data-value", currentMinPrice);
                }
            }
        }else{

        }
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
            var priceMinValues = BX.findChild(block, {className: "price"}, true, true)
			
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

    // minPrice = Number(window['getMinPrice'](block));
    // oldPrice = Number(window['getOldPrice'](block));
    // economy = Number(window['getEconomy'](block));

    console.log()

});