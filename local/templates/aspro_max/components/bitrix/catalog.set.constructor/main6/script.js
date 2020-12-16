BX.namespace("BX.Catalog.SetConstructor");

BX.Catalog.SetConstructor = (function()
{
	var SetConstructor = function(params)
	{
		this.numSliderItems = params.numSliderItems || 0;
		this.numSetItems = params.numSetItems || 0;
		this.jsId = params.jsId || "";
		this.ajaxPath = params.ajaxPath || "";
		this.currency = params.currency || "";
		this.lid = params.lid || "";
		this.iblockId = params.iblockId || "";
		this.basketUrl = params.basketUrl || "";
		this.setIds = params.setIds || null;
		this.offersCartProps = params.offersCartProps || null;
		this.itemsRatio = params.itemsRatio || null;
		this.noFotoSrc = params.noFotoSrc || "";
		this.messages = params.messages;

		this.canBuy = params.canBuy;
		this.mainElementPrice = params.mainElementPrice || 0;
		this.mainElementOldPrice = params.mainElementOldPrice || 0;
		this.mainElementDiffPrice = params.mainElementDiffPrice || 0;
		this.mainElementBasketQuantity = params.mainElementBasketQuantity || 1;

		this.parentCont = BX(params.parentContId) || null;
		this.sliderParentCont = this.parentCont.querySelector("[data-role='slider-parent-container']");
		this.sliderItemsCont = this.parentCont.querySelector("[data-role='set-other-items']");
		this.setItemsCont = this.parentCont.querySelector("[data-role='set-items']");

		this.setPriceCont = this.parentCont.querySelector("[data-role='set-price']");
		this.setPriceDuplicateCont = this.parentCont.querySelector("[data-role='set-price-duplicate']");
		this.setOldPriceCont = this.parentCont.querySelector("[data-role='set-old-price']");
		this.setOldPriceRow = this.setOldPriceCont.parentNode.parentNode;
		this.setDiffPriceCont = this.parentCont.querySelector("[data-role='set-diff-price']");
		this.setDiffPriceRow = this.setDiffPriceCont.parentNode.parentNode;

		this.notAvailProduct = this.sliderItemsCont.querySelector("[data-not-avail='yes']");

		this.emptySetMessage = this.parentCont.querySelector("[data-set-message='empty-set']");
		
		// BX.bindDelegate(this.setItemsCont, 'click', { 'attribute': 'data-role' }, BX.proxy(this.deleteFromSet, this));
		BX.bindDelegate(this.setItemsCont, 'click', { 'attribute': 'data-role' }, BX.proxy(this.changeStateBtn, this));
		// BX.bindDelegate(this.sliderItemsCont, 'click', { 'attribute': 'data-role' }, BX.proxy(this.addToSet, this));

		var buyButton = this.parentCont.querySelector("[data-role='set-buy-btn']");

		if (this.canBuy)
		{
			BX.show(buyButton);
			BX.bind(buyButton, "click", BX.proxy(this.addToBasket, this));
		}
		else
		{
			BX.hide(buyButton);
		}

		this.recountPrice();
		this.generateSliderStyles();

		window['nabor_ids'] = [];
		window['nabor_offersCartProps'] = this.offersCartProps;
		window['nabor_iblockId'] = this.iblockId;
		window['nabor_lid'] = this.lid;
	};

	SetConstructor.prototype.generateSliderStyles = function()
	{
		var styleNode = BX.create("style", {
			html:	".bx-catalog-set-topsale-slids-"+this.jsId+"{width: " + this.numSliderItems*25 + "%;}"+
					".bx-catalog-set-item-container-"+this.jsId+"{width: " + (100/this.numSliderItems) + "%;}"+
					"@media (max-width:767px){"+
					".bx-catalog-set-topsale-slids-"+this.jsId+"{width: " + this.numSliderItems*20*2 + "%;}}",
			attrs: {
				id: "bx-set-const-style-" + this.jsId
			}});

		if (BX("bx-set-const-style-" + this.jsId))
		{
			BX.remove(BX("bx-set-const-style-" + this.jsId));
		}

		this.parentCont.appendChild(styleNode);
	};

	SetConstructor.prototype.changeStateBtn = function()
	{
		var target = BX.proxy_context,
			item,
			itemId,
			itemName,
			itemUrl,
			itemImg,
			itemPrintPrice,
			itemPrice,
			itemPrintOldPrice,
			itemOldPrice,
			itemDiffPrice,
			itemMeasure,
			itemBasketQuantity,
			i,
			l,
			newSliderNode;

			if(target && target.hasAttribute('data-role') && target.getAttribute('data-role') == 'set-delete-btn'){
				console.log("del");
				target.setAttribute('data-role', "set-add-btn");

				item = target.parentNode.parentNode;

				itemId = item.getAttribute("data-id");
				itemName = item.getAttribute("data-name");
				itemUrl = item.getAttribute("data-url");
				itemImg = item.getAttribute("data-img");
				itemPrintPrice = item.getAttribute("data-print-price");
				itemPrice = item.getAttribute("data-price");
				itemPrintOldPrice = item.getAttribute("data-print-old-price");
				itemOldPrice = item.getAttribute("data-old-price");
				itemDiffPrice = item.getAttribute("data-diff-price");
				itemMeasure = item.getAttribute("data-measure");
				itemBasketQuantity = item.getAttribute("data-quantity");
	
				/*set add*/
				target.setAttribute('data-role', "set-add-btn");
				//add class
				item.classList.remove("choice");
				
				newSliderNode = BX.create("div", {
					attrs: {
						className: "bx-catalog-set-item-container bx-catalog-set-item-container-" + this.jsId,
						"data-id": itemId,
						"data-img": itemImg ? itemImg : "",
						"data-url": itemUrl,
						"data-name": itemName,
						"data-print-price": itemPrintPrice,
						"data-print-old-price": itemPrintOldPrice,
						"data-price": itemPrice,
						"data-old-price": itemOldPrice,
						"data-diff-price": itemDiffPrice,
						"data-measure": itemMeasure,
						"data-quantity": itemBasketQuantity
					},
				});
	
				if (!!this.notAvailProduct)
					this.sliderItemsCont.insertBefore(newSliderNode, this.notAvailProduct);
				else
					this.sliderItemsCont.appendChild(newSliderNode);
	
				this.numSliderItems++;
				this.numSetItems--;
				this.generateSliderStyles();
				// BX.remove(item);
	
				for (i = 0, l = this.setIds.length; i < l; i++)
				{
					if (this.setIds[i] == itemId)
						this.setIds.splice(i, 1);
				}
	
				this.recountPrice();
	
				if (this.numSetItems <= 0 && !!this.emptySetMessage)
					BX.adjust(this.emptySetMessage, { style: { display: 'inline-block' }, html: this.messages.EMPTY_SET });
	
				if (this.numSliderItems > 0 && this.sliderParentCont)
				{
					this.sliderParentCont.style.display = 'none';
				}
				this.ChangeNaborBasketBtn("del", itemId);
				/*recalc*/
				return;
			}
			if(!!target && target.hasAttribute('data-role') && target.getAttribute('data-role') == 'set-add-btn'){
				console.log("set");
				target.setAttribute('data-role', "set-delete-btn");

				item = target.parentNode.parentNode;
				idClick = item.getAttribute("data-id");

				itemToDel = this.sliderParentCont.querySelector('.bx-catalog-set-item-container[data-id="' + idClick + '"]');

				//add class
				item.classList.add("choice");

				itemId = item.getAttribute("data-id");
				itemName = item.getAttribute("data-name");
				itemUrl = item.getAttribute("data-url");
				itemImg = item.getAttribute("data-img");
				itemPrintPrice = item.getAttribute("data-print-price");
				itemPrice = item.getAttribute("data-price");
				itemPrintOldPrice = item.getAttribute("data-print-old-price");
				itemOldPrice = item.getAttribute("data-old-price");
				itemDiffPrice = item.getAttribute("data-diff-price");
				itemMeasure = item.getAttribute("data-measure");
				itemBasketQuantity = item.getAttribute("data-quantity");
				
				this.numSliderItems--;
				this.numSetItems++;
				this.setIds.push(itemId);

				this.generateSliderStyles();
				BX.remove(itemToDel);
				this.recountPrice();

				if (this.numSetItems > 0 && !!this.emptySetMessage)
				BX.adjust(this.emptySetMessage, { style: { display: 'none' }, html: '' });

				if (this.numSliderItems <= 0 && this.sliderParentCont)
				{
					this.sliderParentCont.style.display = 'none';
				}	

			}
			this.ChangeNaborBasketBtn("add", itemId);
			/*recalc*/
			return;
	}
	// add to btn basket
	SetConstructor.prototype.ChangeNaborBasketBtn = function(type, itemId){
		if(type === "del"){

			var btn = BX.findChild(document, {tag: 'span', className: 'to-cart'},true);
			var attr = btn.getAttribute("data-nabor");
			var arrAtr = attr.split(",");
			
			for(var i = 0; i < arrAtr.length; i++){
				if(arrAtr[i] === itemId){
					arrAtr.splice(i, 1);
				}
			}

			if(window['nabor_ids']){
				for(var i = 0; i < window['nabor_ids'].length; i++){
					if(window['nabor_ids'][i]['idNabor'] === itemId){
						window['nabor_ids'].splice(i, 1);
					}
				}
			}
			btn.setAttribute("data-nabor", arrAtr.toString());
		}
		if(type === "add"){
			
			window['nabor_ids'].push({'idNabor' : itemId, 'ratio' : this.itemsRatio[itemId]});

			var btn = BX.findChild(document, {tag: 'span', className: 'to-cart'},true);
			var attr = btn.getAttribute("data-nabor");
			btn.setAttribute("data-nabor", attr + "," + itemId);
		}
	};
	
	SetConstructor.prototype.changeMinPrice = function(price, discountPrice, economyPrice)
	{
		economyPrice = economyPrice || null;
		discountPrice = discountPrice || null;
	
		var blockPrice = document.getElementsByClassName("product-action")[0];
		
		var prices = BX.findChild(blockPrice, {className: "price"}, true, true)
		for(var i = 0; i < prices.length; i++){
			// console.log(prices[i].getAttribute("data-value"))
		}
		
		// если неск. тип цен
		if(BX.findChild(blockPrice, {className: "price_group min"}, true)){
			// set min price
			var priceMin = BX.findChild(blockPrice, {className: "price_group min"}, true)
			var priceMinValues = BX.findChild(priceMin, {className: "price"}, true, true)
	
			for(var i = 0; i < priceMinValues.length; i++){
				console.log(priceMinValues[i])
				if(priceMinValues[i].classList.contains("discount")){
					// discount
					
					if(discountPrice){
						priceMinValues[i].setAttribute("data-value", discountPrice);
						var priceDiscountVal = BX.findChild(priceMinValues[i], {className: "price_value"}, true);
						priceDiscountVal.innerHTML = BX.Currency.currencyFormat(discountPrice, this.currency, false);
					}
				}else{
					
					// min price val
					priceMinValues[i].setAttribute("data-value", price);
					var priceVal = BX.findChild(priceMinValues[i], {className: "price_value"}, true);
					priceVal.innerHTML = BX.Currency.currencyFormat(price, this.currency, false);
				}
				
			}
			if(economyPrice){
				if(BX.findChild(priceMin, {className: "sale_block"}, true)){
					var saleBlock = BX.findChild(priceMin, {className: "sale_block"}, true);
					var saleVal = BX.findChild(saleBlock, {className: "price_value"}, true);
					saleVal.innerHTML = BX.Currency.currencyFormat(economyPrice, this.currency, false);
				}
			}
		}else{
			var priceMinValues = BX.findChild(blockPrice, {className: "price"}, true, true)
			
			for(var i = 0; i < priceMinValues.length; i++){
				if(priceMinValues[i].classList.contains("discount")){
					if(discountPrice){
						priceMinValues[i].setAttribute("data-value", discountPrice);
						var priceDiscountVal = BX.findChild(priceMinValues[i], {className: "price_value"}, true);
						priceDiscountVal.innerHTML = BX.Currency.currencyFormat(discountPrice, this.currency, true);
					}
				}else{
					priceMinValues[i].setAttribute("data-value", price);
					var priceVal = BX.findChild(priceMinValues[i], {className: "price_value"}, true);
					priceVal.innerHTML = BX.Currency.currencyFormat(price, this.currency, false);
				}
			}
			if(economyPrice){
				if(BX.findChild(blockPrice, {className: "sale_block"}, true)){
					var saleBlock = BX.findChild(blockPrice, {className: "sale_block"}, true);
					var saleVal = BX.findChild(saleBlock, {className: "price_value"}, true);
					saleVal.innerHTML = BX.Currency.currencyFormat(economyPrice, this.currency, false);
				}
			}
		}
	};

	SetConstructor.prototype.recountPrice = function()
	{
		
		var sumPrice = this.mainElementPrice*this.mainElementBasketQuantity,
			sumOldPrice = this.mainElementOldPrice*this.mainElementBasketQuantity,
			sumDiffDiscountPrice = this.mainElementDiffPrice*this.mainElementBasketQuantity,
			setItems = BX.findChildren(this.setItemsCont, {tagName: "tr", class: "choice"}, true),
			i,
			l,
			ratio;
		if (setItems)
		{
			for(i = 0, l = setItems.length; i<l; i++)
			{
				ratio = Number(setItems[i].getAttribute("data-quantity")) || 1;
				sumPrice += Number(setItems[i].getAttribute("data-price"))*ratio;
				sumOldPrice += Number(setItems[i].getAttribute("data-old-price"))*ratio;
				sumDiffDiscountPrice += Number(setItems[i].getAttribute("data-diff-price"))*ratio;
			}
		}

		this.setPriceCont.innerHTML = BX.Currency.currencyFormat(sumPrice, this.currency, true);
		this.setPriceDuplicateCont.innerHTML = BX.Currency.currencyFormat(sumPrice, this.currency, true);
		if (Math.floor(sumDiffDiscountPrice*100) > 0)
		{
			this.setOldPriceCont.innerHTML = BX.Currency.currencyFormat(sumOldPrice, this.currency, true);
			this.setDiffPriceCont.innerHTML = BX.Currency.currencyFormat(sumDiffDiscountPrice, this.currency, true);
			BX.style(this.setOldPriceRow, 'display', 'table-row');
			BX.style(this.setDiffPriceRow, 'display', 'table-row');
		}
		else
		{
			BX.style(this.setOldPriceRow, 'display', 'none');
			BX.style(this.setDiffPriceRow, 'display', 'none');
			this.setOldPriceCont.innerHTML = '';
			this.setDiffPriceCont.innerHTML = '';
		}
		setTimeout(() => {
			this.changeMinPrice(sumPrice, sumOldPrice, sumDiffDiscountPrice);
		}, 50);
		// 
		// document.getElementsByClassName("test_price")[0].innerText = sumPrice;
	};

	SetConstructor.prototype.addToBasket = function()
	{
		var target = BX.proxy_context;

		BX.showWait(target.parentNode);

		BX.ajax.post(
			this.ajaxPath,
			{
				sessid: BX.bitrix_sessid(),
				action: 'catalogSetAdd2Basket',
				set_ids: this.setIds,
				lid: this.lid,
				iblockId: this.iblockId,
				setOffersCartProps: this.offersCartProps,
				itemsRatio: this.itemsRatio
			},
			BX.proxy(function(result)
			{
				BX.closeWait();
				document.location.href = this.basketUrl;
			}, this)
		);
	};

	return SetConstructor;
})();