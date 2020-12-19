/*
You can use this file with your scripts.
It will not be overwritten when you upgrade solution.
*/

BX.ready(function(){

    var ProductPrice = (function(){
        
        function ProductPrice (){

            this.blockPrice = document.getElementsByClassName("prices_block")[0];

            this.minPrice = Number(getMinPrice.call(this));
            this.oldPrice = Number(getOldPrice.call(this));
            this.economy = Number(getEconomy.call(this));

            this.currentMinPrice = Number(this.minPrice);
            this.currentOldPrice = Number(this.oldPrice);
            this.currentEconomy  = Number(this.economy);

            this.quantity = Number($(".counter_block").find("input[type=text]").val());
        }

        function getMinPrice(){
            if(BX.findChild(this.blockPrice, {className: "price_group min"}, true)){
                var priceMin = BX.findChild(this.blockPrice, {className: "price_group min"}, true)
                var priceMinValues = BX.findChild(priceMin, {className: "price"}, true, true)
                
                for(var i = 0; i < priceMinValues.length; i++){
                    if(!priceMinValues[i].classList.contains("discount")){
                        // min price val
                        var priceVal = priceMinValues[i].getAttribute("data-value");
                    }
                }
            }else{
                var priceMinValues = BX.findChild(this.blockPrice, {className: "price"}, true, true)
                
                for(var i = 0; i < priceMinValues.length; i++){
                    if(!priceMinValues[i].classList.contains("discount")){
                        var priceVal = priceMinValues[i].getAttribute("data-value");
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
                        var priceDiscountVal = priceMinValues[i].getAttribute('data-value');
                    }
                }
            }else{
                var priceMinValues = BX.findChild(this.blockPrice, {className: "price"}, true, true)
                
                for(var i = 0; i < priceMinValues.length; i++){
                    if(priceMinValues[i].classList.contains("discount")){
                        var priceDiscountVal = priceMinValues[i].getAttribute('data-value');
                    }
                }
            }
            return priceDiscountVal;
        }

        function getEconomy(){
            var economy = 0;
                if(BX.findChild(this.blockPrice, {className: "price_group min"}, true)){
                    var priceMin = BX.findChild(this.blockPrice, {className: "price_group min"}, true)
        
                    if(BX.findChild(priceMin, {className: "sale_block"}, true)){
                        var saleBlock = BX.findChild(priceMin, {className: "sale_block"}, true);
                        var saleVal = BX.findChild(saleBlock, {className: "price_value"}, true);
                    }
                }else{
        
                    if(BX.findChild(this.blockPrice, {className: "sale_block"}, true)){
                        var saleBlock = BX.findChild(this.blockPrice, {className: "sale_block"}, true);
                        var saleVal = BX.findChild(saleBlock, {className: "values_wrapper"}, true);
                        economy = saleVal;
                    }
                }

            return economy;
        }

        ProductPrice.prototype.changePrices = function(quantity){
            
            if(!quantity){
               var quantity = this.quantity; 
            }else{
                this.quantity = quantity;
            }

            var summNabor = getSummNabor.call(this);
            
            if(summNabor > 0){
                this.currentMinPrice = (this.minPrice * quantity) + summNabor;
                this.currentOldPrice = (this.oldPrice * quantity) + summNabor;
                this.currentEconomy = this.currentOldPrice - this.currentMinPrice;
            }else{
                this.currentMinPrice = this.minPrice * quantity;
                this.currentOldPrice = this.oldPrice * quantity;
                this.currentEconomy = this.currentOldPrice - this.currentMinPrice;
            }
    
        }
        function changeDomPrices(context){
            if(BX.findChild(context.blockPrice, {className: "price_group min"}, true)){
                    
                var priceMin = BX.findChild(context.blockPrice, {className: "price_group min"}, true);
                var priceMinValues = BX.findChild(priceMin, {className: "price"}, true, true);

                for(var j = 0; j < priceMinValues.length; j++){
                    if(priceMinValues[j].classList.contains("discount")){
                        
                        var blockPriceValue = BX.findChild(priceMinValues[j], {className: "price_value"}, true);
                        priceMinValues[j].setAttribute("data-value", context.currentOldPrice);
                        blockPriceValue.innerHTML = BX.Currency.currencyFormat( context.currentOldPrice, "RUB", false);

                    }else{
                        var priceVal = BX.findChild(priceMinValues[j], {className: "price_value"}, true);
                        priceVal.innerHTML = BX.Currency.currencyFormat(context.currentMinPrice, "RUB", false);
                        priceMinValues[j].setAttribute("data-value", context.currentMinPrice);
                    }
                }

                if(BX.findChild(context.blockPrice, {className: "sale_block"}, true)){

                    var saleBlock = BX.findChild(priceMin, {className: "sale_block"}, true);
                    var saleVal = BX.findChild(saleBlock, {className: "price_value"}, true);
                    
                    var saleValNumber = Number(saleVal.innerText.replace(/\s+/g, ""));
                    
                    saleVal.innerHTML = BX.Currency.currencyFormat(context.currentEconomy, "RUB", false);
                }
            }else{
                var priceMinValues = BX.findChild(context.blockPrice, {className: "price"}, true, true);
                
                for(var j = 0; j < priceMinValues.length; j++){
                    if(priceMinValues[j].classList.contains("discount")){

                        var blockPriceValue = BX.findChild(priceMinValues[j], {className: "price_value"}, true);
                        priceMinValues[j].setAttribute("data-value", context.currentOldPrice);
                        blockPriceValue.innerHTML = BX.Currency.currencyFormat( context.currentOldPrice, "RUB", false);
                        
                    }else{
                        var priceVal = BX.findChild(priceMinValues[j], {className: "price_value"}, true);
                        priceVal.innerHTML = BX.Currency.currencyFormat(context.currentMinPrice, "RUB", false);
                        priceMinValues[j].setAttribute("data-value", context.currentMinPrice);
                    }
                }

                if(BX.findChild(context.blockPrice, {className: "sale_block"}, true)){
    
                    var saleBlock = BX.findChild(priceMin, {className: "sale_block"}, true);
                    var saleVal = BX.findChild(saleBlock, {className: "price_value"}, true);
    
                    saleValNumber = Number(saleVal.innerText.replace(/\s+/g, ""));
                    
                    saleVal.innerHTML = BX.Currency.currencyFormat(context.currentEconomy, "RUB", false);
                }
            }
        }

        ProductPrice.prototype.setPricesCustom = function(){
            debugger
            var that = this;
            var flagOffer = false;
            BX.addCustomEvent('onAsproSkuSetPrice', function(eventdata){
                flagOffer = true;
                changeDomPrices(that);
            });

            if(!flagOffer){
                changeDomPrices(this);
            }

        };

        function getSummNabor(){
            
            var tr = BX.findChild(document.getElementsByClassName('bx-added-item-table')[0], {tagName: "TR", className: "choice"}, true, true);
            var isNaborActive = false;
            var summNabor = 0;
            if(tr){
                for(var i = 0; i < tr.length; i++){
                    if(tr[i].classList.contains('choice')){
                        isNaborActive = true;
                        summNabor += Number(tr[i].getAttribute('data-price'));
                    }
                }
            }
            return summNabor;
        }

        return ProductPrice;
    }());

    var flagOffer = false;

    BX.addCustomEvent('onAsproSkuSetPrice', function(eventdata){
        flagOffer = true;
        var input = $(".counter_block").find("input[type=text]");
        window['ProductPrice'] = new ProductPrice;
        $(input).on('change', function(e){
            // debugger
            window.ProductPrice.changePrices(e.target.value);
            window.ProductPrice.setPricesCustom();
           
            BX.removeCustomEvent('onCounterProductAction', function(){console.log("ds")});
        });
    });
    if(!flagOffer){

        var input = $(".counter_block").find("input[type=text]");
        window['ProductPrice'] = new ProductPrice;
        $(input).on('change', function(e){
            // debugger
            window.ProductPrice.changePrices(e.target.value);
            window.ProductPrice.setPricesCustom();
           
            BX.removeCustomEvent('onCounterProductAction', function(){console.log("ds")});
        });
    }

    // var summTotal = document.createElement('div');
    // summTotal.className = "c_summ_total";

    // document.body.appendChild(summTotal);


    // var minPrice, oldPrice, economy;
    // var currentMinPrice, currentOldPrice, currentEconomy;

    // var block = document.getElementsByClassName("prices_block")[0];
 

});