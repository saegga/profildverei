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
		BX.bindDelegate(this.sliderItemsCont, 'click', { 'attribute': 'data-role' }, BX.proxy(this.addToSet, this));

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
	SetConstructor.prototype.deleteFromSet = function()
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
		
		if (target && target.hasAttribute('data-role') && target.getAttribute('data-role') == 'set-delete-btn')
		{
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
				children: [
					BX.create("div", {
							attrs: {
								className: "bx-catalog-set-item"
							},
							children: [
								BX.create("div", {
									attrs: {
										className: "bx-catalog-set-item-img"
									},
									children: [
										BX.create("div", {
											attrs: {
												className: "bx-catalog-set-item-img-container"
											},
											children: [
												BX.create("img", {
													attrs: {
														src: itemImg ? itemImg : this.noFotoSrc,
														className: "img-responsive"
													}
												})
											]
										})
									]
								}),
								BX.create("div", {
									attrs: {
										className: "bx-catalog-set-item-title"
									},
									children: [
										BX.create("a", {
											attrs: {
												href: itemUrl,
												className: "dark_link font_sm"
											},
											html: itemName
										})
									]
								}),
								BX.create("div", {
									attrs: {
										className: "bx-catalog-set-item-price"
									},
									children: [
										BX.create("div", {
											attrs: {
												className: "bx-catalog-set-item-price-new font_sm"
											},
											html: itemPrintPrice + ' * ' + itemBasketQuantity + itemMeasure
										}),
										BX.create("div", {
											attrs: {
												className: "bx-catalog-set-item-price-old  muted font_sxs"
											},
											html: itemPrice != itemOldPrice ? itemPrintOldPrice : ""
										})
									]
								}),
								BX.create("div", {
									attrs: {
										className: "bx-catalog-set-item-add-btn"
									},
									children: [
										BX.create("a", {
											attrs: {
												className: "btn btn-default btn-xs",
												"data-role": "set-add-btn"
											},
											html: this.messages.ADD_BUTTON
										})
									]
								})
							]
						}
					)]
			});

			if (!!this.notAvailProduct)
				this.sliderItemsCont.insertBefore(newSliderNode, this.notAvailProduct);
			else
				this.sliderItemsCont.appendChild(newSliderNode);

			this.numSliderItems++;
			this.numSetItems--;
			this.generateSliderStyles();
			BX.remove(item);

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
				this.sliderParentCont.style.display = '';
			}
		}
	};

	SetConstructor.prototype.addToSet = function()
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
			newSetNode;

			
		if (!!target && target.hasAttribute('data-role') && target.getAttribute('data-role') == 'set-add-btn')
		{
			item = target.parentNode.parentNode.parentNode;

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

			target.setAttribute("data-role", "set-delete-btn");

			newSetNode = BX.create("tr", {
					attrs: {
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
					children: [
						BX.create("td", {
							attrs: {
								className: "bx-added-item-table-cell-img"
							},
							children: [
								BX.create("img", {
									attrs: {
										src: itemImg ? itemImg : this.noFotoSrc,
										className: "img-responsive"
									}
								})
							]
						}),
						BX.create("td", {
							attrs: {
								className: "bx-added-item-table-cell-itemname"
							},
							children: [
								BX.create("a", {
									attrs: {
										href: itemUrl,
										className: "tdn font_sm dark_link"
									},
									html: itemName
								})
							]
						}),
						BX.create("td", {
							attrs: {
								className: "bx-added-item-table-cell-price"
							},
							children: [
								BX.create("div", {
									attrs: {
										className: "bx-added-item-new-price font_sm"
									},
									html: itemPrintPrice + ' * ' + itemBasketQuantity + itemMeasure
								}),
								// BX.create("br"),
								BX.create("div", {
									attrs: {
										className: "bx-added-item-old-price font_sxs muted"
									},
									html: itemPrice != itemOldPrice ? itemPrintOldPrice : ""
								})
							]
						}),
						BX.create("td", {
							attrs: {
								className: "bx-added-item-table-cell-del"
							},
							children: [
								BX.create("div", {
									attrs: {
										className: "bx-added-item-delete",
										"data-role": "set-delete-btn"
									}
								})
							]
						})
					]
				}
			);
			this.setItemsCont.appendChild(newSetNode);

			this.numSliderItems--;
			this.numSetItems++;
			this.generateSliderStyles();
			BX.remove(item);
			this.setIds.push(itemId);
			this.recountPrice();

			if (this.numSetItems > 0 && !!this.emptySetMessage)
				BX.adjust(this.emptySetMessage, { style: { display: 'none' }, html: '' });

			if (this.numSliderItems <= 0 && this.sliderParentCont)
			{
				this.sliderParentCont.style.display = 'none';
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