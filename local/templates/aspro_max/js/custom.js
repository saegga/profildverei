/*
You can use this file with your scripts.
It will not be overwritten when you upgrade solution.
*/

BX.ready(function(){

    var summTotal = document.createElement('div');
    summTotal.className = "c_summ_total";

    document.body.appendChild(summTotal);


    var minPrice, oldPrice, economy;

    function getMinPrice(blockPrice){
        if(BX.findChild(blockPrice, {className: "price_group min"}, true)){
            var priceMin = BX.findChild(blockPrice, {className: "price_group min"}, true)
            var priceMinValues = BX.findChild(priceMin, {className: "price"}, true, true)
            
            for(var i = 0; i < priceMinValues.length; i++){
				if(!priceMinValues[i].classList.contains("discount")){
					// min price val
                    var priceVal = BX.findChild(priceMinValues[i], {className: "price_value"}, true);
                    minPrice = priceVal;
				}
			}
        }else{
            var priceMinValues = BX.findChild(blockPrice, {className: "price"}, true, true)
			
			for(var i = 0; i < priceMinValues.length; i++){
				if(!priceMinValues[i].classList.contains("discount")){
                    var priceVal = BX.findChild(priceMinValues[i], {className: "price_value"}, true);
                    minPrice = priceVal;
				}
			}
        }
    }

    function getOldPrice(blockPrice){
        if(BX.findChild(blockPrice, {className: "price_group min"}, true)){
			// set min price
			var priceMin = BX.findChild(blockPrice, {className: "price_group min"}, true)
			var priceMinValues = BX.findChild(priceMin, {className: "price"}, true, true)
	
			for(var i = 0; i < priceMinValues.length; i++){
				if(priceMinValues[i].classList.contains("discount")){
					// discount
                    var priceDiscountVal = BX.findChild(priceMinValues[i], {className: "price_value"}, true);
					oldPrice = priceDiscountVal;
				}
			}
		}else{
			var priceMinValues = BX.findChild(blockPrice, {className: "price"}, true, true)
            
			for(var i = 0; i < priceMinValues.length; i++){
				if(priceMinValues[i].classList.contains("discount")){
                    var priceDiscountVal = BX.findChild(priceMinValues[i], {className: "price_value"}, true);
					oldPrice = priceDiscountVal;
				}
			}
		}
    }
    function getEconomy(blockPrice){
        if(BX.findChild(blockPrice, {className: "price_group min"}, true)){
            var priceMin = BX.findChild(blockPrice, {className: "price_group min"}, true)

            if(BX.findChild(priceMin, {className: "sale_block"}, true)){
                var saleBlock = BX.findChild(priceMin, {className: "sale_block"}, true);
                var saleVal = BX.findChild(saleBlock, {className: "price_value"}, true);
                economy = saleVal;
            }
        }else{
            var priceMinValues = BX.findChild(blockPrice, {className: "price"}, true, true)

            if(BX.findChild(blockPrice, {className: "sale_block"}, true)){
                var saleBlock = BX.findChild(blockPrice, {className: "sale_block"}, true);
                var saleVal = BX.findChild(saleBlock, {className: "price_value"}, true);
                economy = saleVal;

            }
        }
    }

});