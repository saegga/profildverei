<?

namespace SM;
use Bitrix\Main\Config\Option;
use Bitrix\Main\Loader;
use \Bitrix\Main\Localization\Loc;
use Bitrix\Main\Diag;

class CustomMax extends \CMax{

    public static function CustomGetAddToBasketArray(&$arItem, $totalCount = 0, $defaultCount = 1, $basketUrl = '', $bDetail = false, $arItemIDs = array(), $class_btn = "small", $arParams=array()){
        static $arAddToBasketOptions, $bUserAuthorized;

        if($arAddToBasketOptions === NULL){
            $arAddToBasketOptions = array(
                "SHOW_BASKET_ONADDTOCART" => Option::get(self::moduleID, "SHOW_BASKET_ONADDTOCART", "Y", SITE_ID) == "Y",
                "USE_PRODUCT_QUANTITY_LIST" => Option::get(self::moduleID, "USE_PRODUCT_QUANTITY_LIST", "Y", SITE_ID) == "Y",
                "USE_PRODUCT_QUANTITY_DETAIL" => Option::get(self::moduleID, "USE_PRODUCT_QUANTITY_DETAIL", "Y", SITE_ID) == "Y",
                "BUYNOPRICEGGOODS" => Option::get(self::moduleID, "BUYNOPRICEGGOODS", "NOTHING", SITE_ID),
                "BUYMISSINGGOODS" => Option::get(self::moduleID, "BUYMISSINGGOODS", "ADD", SITE_ID),
                "EXPRESSION_ORDER_BUTTON" => Option::get(self::moduleID, "EXPRESSION_ORDER_BUTTON", GetMessage("EXPRESSION_ORDER_BUTTON_DEFAULT"), SITE_ID),
                "EXPRESSION_ORDER_TEXT" => Option::get(self::moduleID, "EXPRESSION_ORDER_TEXT", GetMessage("EXPRESSION_ORDER_TEXT_DEFAULT"), SITE_ID),
                "EXPRESSION_SUBSCRIBE_BUTTON" => Option::get(self::moduleID, "EXPRESSION_SUBSCRIBE_BUTTON", GetMessage("EXPRESSION_SUBSCRIBE_BUTTON_DEFAULT"), SITE_ID),
                "EXPRESSION_SUBSCRIBED_BUTTON" => Option::get(self::moduleID, "EXPRESSION_SUBSCRIBED_BUTTON", GetMessage("EXPRESSION_SUBSCRIBED_BUTTON_DEFAULT"), SITE_ID),
                "EXPRESSION_ADDTOBASKET_BUTTON_DEFAULT" => Option::get(self::moduleID, "EXPRESSION_ADDTOBASKET_BUTTON_DEFAULT", GetMessage("EXPRESSION_ADDTOBASKET_BUTTON_DEFAULT"), SITE_ID),
                "EXPRESSION_ADDEDTOBASKET_BUTTON_DEFAULT" =>Option::get(self::moduleID, "EXPRESSION_ADDEDTOBASKET_BUTTON_DEFAULT", GetMessage("EXPRESSION_ADDEDTOBASKET_BUTTON_DEFAULT"), SITE_ID),
                "EXPRESSION_READ_MORE_OFFERS_DEFAULT" => Option::get(self::moduleID, "EXPRESSION_READ_MORE_OFFERS_DEFAULT", GetMessage("EXPRESSION_READ_MORE_OFFERS_DEFAULT"), SITE_ID),
            );

            global $USER;
            $bUserAuthorized = $USER->IsAuthorized();
        }

        $buttonText = $buttonHTML = $buttonACTION = '';
        $quantity=$ratio=1;
        $max_quantity=0;
        $float_ratio=is_double($arItem["CATALOG_MEASURE_RATIO"]);

        if($arItem["CATALOG_MEASURE_RATIO"]){
            $quantity=$arItem["CATALOG_MEASURE_RATIO"];
            $ratio=$arItem["CATALOG_MEASURE_RATIO"];
        }else{
            $quantity=$defaultCount;
        }
        if($arItem["CATALOG_QUANTITY_TRACE"]=="Y"){
            if($totalCount < $quantity){
                $quantity=($totalCount>$arItem["CATALOG_MEASURE_RATIO"] ? $totalCount : $arItem["CATALOG_MEASURE_RATIO"] );
            }
            $max_quantity=$totalCount;
        }

        $canBuy = $arItem["CAN_BUY"];
        if($arParams['USE_REGION'] == 'Y' && $arParams['STORES'])
        {
            $canBuy = ($totalCount || ((!$totalCount && $arItem["CATALOG_QUANTITY_TRACE"] == "N") || (!$totalCount && $arItem["CATALOG_QUANTITY_TRACE"] == "Y" && $arItem["CATALOG_CAN_BUY_ZERO"] == "Y")));
        }
        $arItem["CAN_BUY"] = $canBuy;

        $arItemProps = $arItem['IS_OFFER'] === 'Y' ? ($arParams['OFFERS_CART_PROPERTIES'] ? implode(';', $arParams['OFFERS_CART_PROPERTIES']) : "") : ($arParams['PRODUCT_PROPERTIES'] ? implode(';', $arParams['PRODUCT_PROPERTIES']) : "");
        $partProp=($arParams["PARTIAL_PRODUCT_PROPERTIES"] ? $arParams["PARTIAL_PRODUCT_PROPERTIES"] : "" );
        $addProp=($arParams["ADD_PROPERTIES_TO_BASKET"] ? $arParams["ADD_PROPERTIES_TO_BASKET"] : "" );
        $emptyProp=$arItem["EMPTY_PROPS_JS"];
        if($arItem["OFFERS"]){
            global $arTheme;
            $type_sku = is_array($arTheme) ? (isset($arTheme["TYPE_SKU"]["VALUE"]) ? $arTheme["TYPE_SKU"]["VALUE"] : $arTheme["TYPE_SKU"]) : 'TYPE_1';
            if(!$bDetail && $arItem["OFFERS_MORE"] != "Y" && $type_sku != "TYPE_2"){
                $buttonACTION = 'ADD';
                $buttonText = array($arAddToBasketOptions['EXPRESSION_ADDTOBASKET_BUTTON_DEFAULT'], $arAddToBasketOptions['EXPRESSION_ADDEDTOBASKET_BUTTON_DEFAULT']);
                $buttonHTML =
                    '<span class="btn btn-default transition_bg '.$class_btn.' read_more1 to-cart animate-load" 
                    
                    id="'.$arItemIDs['BUY_LINK'].'" 
                data-offers="N" 
                data-iblockID="'.$arItem["IBLOCK_ID"].'" 
                data-nabor=""
                data-item="'.$arItem["ID"].'">'.self::showIconSvg("fw ncolor colored", SITE_TEMPLATE_PATH."/images/svg/basket.svg", $buttonText[0]).'<span>'.$buttonText[0].'</span></span><a rel="nofollow" href="'.$basketUrl.'" id="'.$arItemIDs['BASKET_LINK'].'" 
                class="'.$class_btn.' in-cart btn btn-default transition_bg" data-item="'.$arItem["ID"].'"  style="display:none;">'.self::showIconSvg("fw ncolor colored", SITE_TEMPLATE_PATH."/images/svg/inbasket.svg", $buttonText[1]).'<span>'.$buttonText[1].'</span></a>';
            }
            elseif(($bDetail && $arItem["FRONT_CATALOG"] == "Y") || $arItem["OFFERS_MORE"]=="Y" || $type_sku == "TYPE_2"){
                $buttonACTION = 'MORE';
                $buttonText = array($arAddToBasketOptions['EXPRESSION_READ_MORE_OFFERS_DEFAULT']);
                $buttonHTML = '<a class="btn btn-default basket read_more '.$class_btn.'" rel="nofollow" href="'.$arItem["DETAIL_PAGE_URL"].'" data-item="'.$arItem["ID"].'">'.self::showIconSvg("fw ncolor colored", SITE_TEMPLATE_PATH."/images/svg/more_c.svg", $buttonText[0]).'<span>'.$buttonText[0].'</span></a>';
            }
        }
        else{
            if($bPriceExists = isset($arItem["MIN_PRICE"]) && $arItem["MIN_PRICE"]["VALUE"] > 0){
                // price exists
                if($totalCount > 0){
                    // rest exists
                    if((isset($arItem["CAN_BUY"]) && $arItem["CAN_BUY"]) || (isset($arItem["MIN_PRICE"]) && $arItem["MIN_PRICE"]["CAN_BUY"] == "Y")){
                        if($bDetail && $arItem["FRONT_CATALOG"] == "Y"){
                            $buttonACTION = 'MORE';
                            $buttonText = array($arAddToBasketOptions['EXPRESSION_READ_MORE_OFFERS_DEFAULT']);
                            $rid=($arItem["RID"] ? "?RID=".$arItem["RID"] : "");
                            $buttonHTML = '<a class="btn btn-default transition_bg basket read_more '.$class_btn.'" rel="nofollow" href="'.$arItem["DETAIL_PAGE_URL"].$rid.'" data-item="'.$arItem["ID"].'">'.self::showIconSvg("fw ncolor colored", SITE_TEMPLATE_PATH."/images/svg/more_c.svg", $buttonText[0]).'<span>'.$buttonText[0].'</span></a>';
                        }
                        else{

                            $arItem["CAN_BUY"] = 1;
                            $buttonACTION = 'ADD';
                            $buttonText = array($arAddToBasketOptions['EXPRESSION_ADDTOBASKET_BUTTON_DEFAULT'], $arAddToBasketOptions['EXPRESSION_ADDEDTOBASKET_BUTTON_DEFAULT']);
                            $buttonHTML =
                                '<span data-value="'.$arItem["MIN_PRICE"]["DISCOUNT_VALUE"].'" 
                                data-currency="'.$arItem["MIN_PRICE"]["CURRENCY"].'" 
                                class="'.$class_btn.' to-cart btn btn-default transition_bg animate-load" 
                                data-item="'.$arItem["ID"].'" data-float_ratio="'.$float_ratio.'" 
                                data-ratio="'.$ratio.'" 
                                data-bakset_div="bx_basket_div_'.$arItem["ID"].($arItemIDs['DOP_ID'] ? '_'.$arItemIDs['DOP_ID'] : '').'" 
                                data-props="'.$arItemProps.'" 
                                data-part_props="'.$partProp.'" 
                                data-add_props="'.$addProp.'"  
                                data-empty_props="'.$emptyProp.'" 
                                data-offers="'.$arItem["IS_OFFER"].'" 
                                data-iblockID="'.$arItem["IBLOCK_ID"].'" 
                                data-nabor=""
                                data-quantity="'.$quantity.'">'.self::showIconSvg("fw ncolor colored", SITE_TEMPLATE_PATH."/images/svg/basket.svg", $buttonText[0]).'<span>'.$buttonText[0].'</span></span><a rel="nofollow" href="'.$basketUrl.'" class="'.$class_btn.' in-cart btn btn-default transition_bg" data-item="'.$arItem["ID"].'"  style="display:none;">'.self::showIconSvg("fw ncolor colored", SITE_TEMPLATE_PATH."/images/svg/inbasket.svg", $buttonText[1]).'<span>'.$buttonText[1].'</span></a>';
                        }
                    }
                    elseif($arItem["CATALOG_SUBSCRIBE"] == "Y"){
                        $buttonACTION = 'SUBSCRIBE';
                        $buttonText = array($arAddToBasketOptions['EXPRESSION_SUBSCRIBE_BUTTON'], $arAddToBasketOptions['EXPRESSION_SUBSCRIBED_BUTTON']);
                        $buttonHTML = '<span class="'.$class_btn.' ss to-subscribe'.(!$bUserAuthorized ? ' auth' : '').(self::checkVersionModule('16.5.3', 'catalog') ? ' nsubsc' : '').' btn btn-default transition_bg" rel="nofollow" data-param-form_id="subscribe" data-name="subscribe" data-param-id="'.$arItem["ID"].'" data-item="'.$arItem["ID"].'">'.self::showIconSvg("fw ncolor colored", SITE_TEMPLATE_PATH."/images/svg/subsribe_c.svg", $buttonText[0]).'<span>'.$buttonText[0].'</span></span><span class="'.$class_btn.' ss in-subscribe btn btn-default transition_bg" rel="nofollow" style="display:none;" data-item="'.$arItem["ID"].'">'.self::showIconSvg("fw ncolor colored", SITE_TEMPLATE_PATH."/images/svg/subsribe_c.svg", $buttonText[0]).'<span>'.$buttonText[1].'</span></span>';
                    }
                }
                else{
                    if(!strlen($arAddToBasketOptions['EXPRESSION_ORDER_BUTTON'])){
                        $arAddToBasketOptions['EXPRESSION_ORDER_BUTTON']=GetMessage("EXPRESSION_ORDER_BUTTON_DEFAULT");
                    }
                    if(!strlen($arAddToBasketOptions['EXPRESSION_SUBSCRIBE_BUTTON'])){
                        $arAddToBasketOptions['EXPRESSION_SUBSCRIBE_BUTTON']=GetMessage("EXPRESSION_SUBSCRIBE_BUTTON_DEFAULT");
                    }
                    if(!strlen($arAddToBasketOptions['EXPRESSION_SUBSCRIBED_BUTTON'])){
                        $arAddToBasketOptions['EXPRESSION_SUBSCRIBED_BUTTON']=GetMessage("EXPRESSION_SUBSCRIBED_BUTTON_DEFAULT");
                    }
                    // no rest
                    if($bDetail && $arItem["FRONT_CATALOG"] == "Y"){
                        $buttonACTION = 'MORE';
                        $buttonText = array($arAddToBasketOptions['EXPRESSION_READ_MORE_OFFERS_DEFAULT']);
                        $rid=($arItem["RID"] ? "?RID=".$arItem["RID"] : "");
                        $buttonHTML = '<a class="btn btn-default basket read_more '.$class_btn.'" rel="nofollow" href="'.$arItem["DETAIL_PAGE_URL"].$rid.'" data-item="'.$arItem["ID"].'">'.self::showIconSvg("fw ncolor colored", SITE_TEMPLATE_PATH."/images/svg/more_c.svg", $buttonText[0]).'<span>'.$buttonText[0].'</span></a>';
                    }
                    else{
                        $buttonACTION = $arAddToBasketOptions["BUYMISSINGGOODS"];
                        if($arAddToBasketOptions["BUYMISSINGGOODS"] == "ADD" /*|| $arItem["CAN_BUY"]*/){
                            if($arItem["CAN_BUY"]){
                                $buttonText = array($arAddToBasketOptions['EXPRESSION_ADDTOBASKET_BUTTON_DEFAULT'], $arAddToBasketOptions['EXPRESSION_ADDEDTOBASKET_BUTTON_DEFAULT']);
                                $buttonHTML =
                                    '<span data-value="'.$arItem["MIN_PRICE"]["DISCOUNT_VALUE"].'" 
                                    data-currency="'.$arItem["MIN_PRICE"]["CURRENCY"].'" 
                                    class="'.$class_btn.' to-cart btn btn-default transition_bg animate-load" 
                                    data-item="'.$arItem["ID"].'" 
                                    data-float_ratio="'.$float_ratio.'" 
                                    data-ratio="'.$ratio.'" 
                                    data-bakset_div="bx_basket_div_'.$arItem["ID"].'" 
                                    data-props="'.$arItemProps.'" 
                                    data-part_props="'.$partProp.'" 
                                    data-add_props="'.$addProp.'"  
                                    data-empty_props="'.$emptyProp.'" 
                                    data-offers="'.$arItem["IS_OFFER"].'" 
                                    data-iblockID="'.$arItem["IBLOCK_ID"].'" 
                                    data-nabor=""
                                    data-quantity="'.$quantity.'">'.self::showIconSvg("fw ncolor colored", SITE_TEMPLATE_PATH."/images/svg/basket.svg", $buttonText[0]).'<span>'.$buttonText[0].'</span></span><a rel="nofollow" href="'.$basketUrl.'" class="'.$class_btn.' in-cart btn btn-default transition_bg" data-item="'.$arItem["ID"].'"  style="display:none;">'.self::showIconSvg("fw ncolor colored", SITE_TEMPLATE_PATH."/images/svg/inbasket.svg", $buttonText[1]).'<span>'.$buttonText[1].'</span></a>';
                            }else{
                                if($arAddToBasketOptions["BUYMISSINGGOODS"] == "SUBSCRIBE" && $arItem["CATALOG_SUBSCRIBE"] == "Y"){
                                    $buttonText = array($arAddToBasketOptions['EXPRESSION_SUBSCRIBE_BUTTON'], $arAddToBasketOptions['EXPRESSION_SUBSCRIBED_BUTTON']);
                                    $buttonHTML = '<span class="'.$class_btn.' ss to-subscribe'.(!$bUserAuthorized ? ' auth' : '').(self::checkVersionModule('16.5.3', 'catalog') ? ' nsubsc' : '').' btn btn-default transition_bg" rel="nofollow" data-name="subscribe" data-param-form_id="subscribe" data-param-id="'.$arItem["ID"].'"  data-item="'.$arItem["ID"].'">'.self::showIconSvg("fw ncolor colored", SITE_TEMPLATE_PATH."/images/svg/subsribe_c.svg", $buttonText[0]).'<span>'.$buttonText[0].'</span></span><span class="'.$class_btn.' ss in-subscribe btn btn-default transition_bg" rel="nofollow" style="display:none;" data-item="'.$arItem["ID"].'">'.self::showIconSvg("fw ncolor colored", SITE_TEMPLATE_PATH."/images/svg/subsribe_c.svg", $buttonText[0]).'<span>'.$buttonText[1].'</span></span>';
                                }else{
                                    $buttonText = array($arAddToBasketOptions['EXPRESSION_ORDER_BUTTON']);
                                    $buttonHTML = '<span class="'.$class_btn.' to-order btn btn-default animate-load" data-event="jqm" data-param-form_id="TOORDER" data-name="toorder" data-autoload-product_name="'.self::formatJsName($arItem["NAME"]).'" data-autoload-product_id="'.$arItem["ID"].'">'.self::showIconSvg("fw ncolor colored", SITE_TEMPLATE_PATH."/images/svg/mail_c.svg", $buttonText[0]).'<span>'.$buttonText[0].'</span></span>';
                                    if($arAddToBasketOptions['EXPRESSION_ORDER_TEXT']){
                                        $buttonHTML .='<div class="more_text">'.$arAddToBasketOptions['EXPRESSION_ORDER_TEXT'].'</div>';
                                    }
                                }
                            }

                        }
                        elseif($arAddToBasketOptions["BUYMISSINGGOODS"] == "SUBSCRIBE" && $arItem["CATALOG_SUBSCRIBE"] == "Y"){

                            $buttonText = array($arAddToBasketOptions['EXPRESSION_SUBSCRIBE_BUTTON'], $arAddToBasketOptions['EXPRESSION_SUBSCRIBED_BUTTON']);
                            $buttonHTML = '<span class="'.$class_btn.' ss to-subscribe '.(!$bUserAuthorized ? ' auth' : '').(self::checkVersionModule('16.5.3', 'catalog') ? ' nsubsc' : '').' btn btn-default transition_bg" data-name="subscribe" data-param-form_id="subscribe" data-param-id="'.$arItem["ID"].'"  rel="nofollow" data-item="'.$arItem["ID"].'">'.self::showIconSvg("fw ncolor colored", SITE_TEMPLATE_PATH."/images/svg/mail_c.svg", $buttonText[0]).'<span>'.$buttonText[0].'</span></span><span class="'.$class_btn.' ss in-subscribe btn btn-default transition_bg" rel="nofollow" style="display:none;" data-item="'.$arItem["ID"].'">'.self::showIconSvg("fw ncolor colored", SITE_TEMPLATE_PATH."/images/svg/mail_c.svg", $buttonText[0]).'<span>'.$buttonText[1].'</span></span>';
                        }
                        elseif($arAddToBasketOptions["BUYMISSINGGOODS"] == "ORDER"){
                            $buttonText = array($arAddToBasketOptions['EXPRESSION_ORDER_BUTTON']);
                            $buttonHTML = '<span class="'.$class_btn.' to-order btn btn-default animate-load" data-event="jqm" data-param-form_id="TOORDER" data-name="toorder" data-autoload-product_name="'.self::formatJsName($arItem["NAME"]).'" data-autoload-product_id="'.$arItem["ID"].'">'.self::showIconSvg("fw ncolor colored", SITE_TEMPLATE_PATH."/images/svg/mail_c.svg", $buttonText[0]).'<span>'.$buttonText[0].'</span></span>';
                            if($arAddToBasketOptions['EXPRESSION_ORDER_TEXT']){
                                $buttonHTML .='<div class="more_text">'.$arAddToBasketOptions['EXPRESSION_ORDER_TEXT'].'</div>';
                            }
                        }
                    }
                }
            }
            else{
                // no price or price <= 0
                if($bDetail && $arItem["FRONT_CATALOG"] == "Y"){
                    $buttonACTION = 'MORE';
                    $buttonText = array($arAddToBasketOptions['EXPRESSION_READ_MORE_OFFERS_DEFAULT']);
                    $buttonHTML = '<a class="btn btn-default transition_bg basket read_more '.$class_btn.'" rel="nofollow" href="'.$arItem["DETAIL_PAGE_URL"].'" data-item="'.$arItem["ID"].'">'.self::showIconSvg("fw ncolor colored", SITE_TEMPLATE_PATH."/images/svg/more_c.svg", $buttonText[0]).'<span>'.$buttonText[0].'</span></a>';
                }
                else{
                    $buttonACTION = $arAddToBasketOptions["BUYNOPRICEGGOODS"];
                    if($arAddToBasketOptions["BUYNOPRICEGGOODS"] == "ORDER"){
                        $buttonText = array($arAddToBasketOptions['EXPRESSION_ORDER_BUTTON']);
                        $buttonHTML = '<span class="'.$class_btn.' to-order btn btn-default animate-load" data-event="jqm" data-param-form_id="TOORDER" data-name="toorder" data-autoload-product_name="'.self::formatJsName($arItem["NAME"]).'" data-autoload-product_id="'.$arItem["ID"].'">'.self::showIconSvg("fw ncolor colored", SITE_TEMPLATE_PATH."/images/svg/mail_c.svg", $buttonText[0]).'<span>'.$buttonText[0].'</span></span>';
                        if($arAddToBasketOptions['EXPRESSION_ORDER_TEXT']){
                            $buttonHTML .='<div class="more_text">'.$arAddToBasketOptions['EXPRESSION_ORDER_TEXT'].'</div>';
                        }
                    }
                }
            }
        }

        $arOptions = array("OPTIONS" => $arAddToBasketOptions, "TEXT" => $buttonText, "HTML" => $buttonHTML, "ACTION" => $buttonACTION, "RATIO_ITEM" => $ratio, "MIN_QUANTITY_BUY" => $quantity, "MAX_QUANTITY_BUY" => $max_quantity, "CAN_BUY" => $canBuy);

        foreach(GetModuleEvents(ASPRO_MAX_MODULE_ID, 'OnAsproGetBuyBlockElement', true) as $arEvent) // event for manipulation with buy block element
            ExecuteModuleEventEx($arEvent, array($arItem, $totalCount, $arParams, &$arOptions));

        return $arOptions;
    }
    public static function CustomGetSKUPropsArray(&$arSkuProps, $iblock_id=0, $type_view="list", $hide_title_props="N", $group_iblock_id="N", $arItem = array(), $offerShowPreviewPictureProps = array(), $max_count = false){
        $arSkuTemplate = array();
        $class_title=($hide_title_props=="Y" ? "hide_class" : "show_class");
        $class_title.=' bx_item_section_name';
        if($iblock_id){
            $arPropsSku=\CIBlockSectionPropertyLink::GetArray($iblock_id);
            if($arPropsSku){
                foreach ($arSkuProps as $key=>$arProp){
                    if($arPropsSku[$arProp["ID"]]){
                        $arSkuProps[$key]["DISPLAY_TYPE"]=$arPropsSku[$arProp["ID"]]["DISPLAY_TYPE"];
                    }
                }
            }
        }?>

        <?
        $bTextViewProp = (Option::get(self::moduleID, "VIEW_TYPE_HIGHLOAD_PROP", "N", SITE_ID) == "Y");

        $arCurrentOffer = $arItem['OFFERS'][$arItem['OFFERS_SELECTED']];
        $j = 0;
        $arFilter = $arShowValues = array();

        /*get correct values*/
        
        foreach ($arSkuProps as $key => $arProp){
            $strName = 'PROP_'.$arProp['ID'];
            $arShowValues = self::GetRowValues($arFilter, $strName, $arItem);

            if(in_array($arCurrentOffer['TREE'][$strName], $arShowValues))
            {
                $arFilter[$strName] = $arCurrentOffer['TREE'][$strName];
            }
            else
            {
                $arFilter[$strName] = $arShowValues[0];
            }

            $arCanBuyValues = $tmpFilter = array();
            $tmpFilter = $arFilter;
            foreach($arShowValues as $value)
            {
                $tmpFilter[$strName] = $value;
                if(self::GetCanBuy($tmpFilter, $arItem))
                {
                    $arCanBuyValues[] = $value;
                }
            }
            Diag\Debug::writeToFile($arSkuProps, $varName = "arSkuProps1", $fileName = "debug.txt");
            $arSkuProps[$key] = self::UpdateRow($arFilter[$strName], $arShowValues, $arCanBuyValues, $arProp, $type_view);
        }
        /**/


        if($group_iblock_id=="Y"){
            foreach ($arSkuProps as $iblockId => $skuProps){
                $arSkuTemplate[$iblockId] = array();
                $j = 0;
                foreach ($skuProps as $key=>&$arProp){
                    

                    if($arProp['VALUES'])
                    {
                        foreach($arProp['VALUES'] as $arOneValue)
                        {
                            if($arOneValue['CLASS'] && $arOneValue['CLASS'] == 'active')
                            {
                                $arProp['VALUE'] = '<span class="val">'.$arOneValue['NAME'].'</span>';
                                break;
                            }
                        }
                    }

                    $nameWithDelimeters = $arProp['NAME'];

                    $templateRow = '';
                    $class_title.= (($arProp["HINT"] && $arProp["SHOW_HINTS"] == "Y") ? ' whint char_name' : '');
                    $hint_block = (($arProp["HINT"] && $arProp["SHOW_HINTS"]=="Y") ? '<div class="hint"><span class="icon"><i>?</i></span><div class="tooltip">'.$arProp["HINT"].'</div></div>' : '');
                    if(($arProp["DISPLAY_TYPE"]=="P" || $arProp["DISPLAY_TYPE"]=="R" ) && $type_view!= 'block' ){

                        
                        $templateRow .= '<div class="bx_item_detail_size44" '.$arProp['STYLE'].' id="#ITEM#_prop_'.$arProp['ID'].'_cont" data-display_type="SELECT" data-id="'.$arProp['ID'].'">'.
                            '<span class="'.$class_title.'"><span>'.htmlspecialcharsex($arProp['NAME']).$hint_block.'<span class="sku_mdash">&mdash;</span>'.$arProp['VALUE'].'</span></span>'.
                            '<div class="bx_size_scroller_container form-control bg"><div class="bx_size"><select id="#ITEM#_prop_'.$arProp['ID'].'_list" class="list_values_wrapper">';
                        foreach ($arProp['VALUES'] as $arOneValue){
                            // if($arOneValue['ID']>0){
                            $arOneValue['NAME'] = htmlspecialcharsbx($arOneValue['NAME']);
                            $templateRow .= '<option '.$arOneValue['SELECTED'].' '.$arOneValue['DISABLED'].' data-treevalue="'.$arProp['ID'].'_'.$arOneValue['ID'].'" data-showtype="select" data-onevalue="'.$arOneValue['ID'].'" ';
                            if($arProp["DISPLAY_TYPE"]=="R"){
                                $templateRow .= 'data-img_src="'.$arOneValue["PICT"]["SRC"].'" ';
                            }

                            $templateRow .= 'title="'.$nameWithDelimeters.$arOneValue['NAME'].'">';
                            $templateRow .= '<span class="cnt">'.$arOneValue['NAME'].'</span>';
                            $templateRow .= '</option>';
                            // }
                        }
                        $templateRow .= '</select></div>'.
                            '</div></div>';
                    }elseif ('TEXT' == $arProp['SHOW_MODE']){
                        $templateRow .= '<div class="bx_item_detail_size33" '.$arProp['STYLE'].' id="#ITEM#_prop_'.$arProp['ID'].'_cont" data-display_type="LI" data-id="'.$arProp['ID'].'">'.
                            '<span class="'.$class_title.'"><span>'.htmlspecialcharsex($arProp['NAME']).$hint_block.'<span class="sku_mdash">&mdash;</span>'.$arProp['VALUE'].'</span></span>'.
                            '<div class="bx_size_scroller_container"><div class="bx_size"><ul id="#ITEM#_prop_'.$arProp['ID'].'_list" class="list_values_wrapper">';
                        foreach ($arProp['VALUES'] as $arOneValue){
                            // if($arOneValue['ID']>0){

                            $arOneValue['NAME'] = htmlspecialcharsbx($arOneValue['NAME']);
                            $templateRow .= '<li class="item '.$arOneValue['CLASS'].'" '.$arOneValue['STYLE'].' data-treevalue="'.$arProp['ID'].'_'.$arOneValue['ID'].'" data-showtype="li" data-onevalue="'.$arOneValue['ID'].'" title="'.$nameWithDelimeters.$arOneValue['NAME'].'"><i></i><span class="cnt">'.$arOneValue['NAME'].'</span></li>';
                            // }
                        }
                        $templateRow .= '</ul></div>'.
                            '</div></div>';
                    }elseif ('PICT' == $arProp['SHOW_MODE']){
                        $arCurrentTree = array();
                        if($offerShowPreviewPictureProps && is_array($offerShowPreviewPictureProps))
                        {
                            if(in_array($arProp['CODE'], $offerShowPreviewPictureProps))
                            {
                                if($arCurrentOffer && $arCurrentOffer['TREE'])
                                    $arCurrentTree = $arCurrentOffer['TREE'];
                            }
                        }

                        $isHasPicture = true;
                        foreach($arProp['VALUES'] as &$arOneValue)
                        {
                            $boolOneSearch = false;
                            if($arCurrentTree && $arOneValue['ID'] != 0)
                            {
                                $arRowTree = $arCurrentTree;
                                $arRowTree['PROP_'.$arProp['ID']] = $arOneValue['ID'];

                                foreach($arItem['OFFERS'] as &$arOffer)
                                {
                                    $boolOneSearch = true;
                                    foreach($arRowTree as $rkey => $rval)
                                    {
                                        if($rval !== $arOffer['TREE'][$rkey])
                                        {
                                            $boolOneSearch = false;
                                            break;
                                        }
                                    }
                                    if($boolOneSearch)
                                    {
                                        if($arOffer['PREVIEW_PICTURE_FIELD'] && is_array($arOffer['PREVIEW_PICTURE_FIELD']) && $arOffer['PREVIEW_PICTURE_FIELD']['SRC'])
                                            $arOneValue['NEW_PICT'] = $arOffer['PREVIEW_PICTURE_FIELD'];
                                        else
                                            $boolOneSearch = false;
                                        break;
                                    }
                                }
                                unset($arOffer);
                            }

                            if(!$boolOneSearch)
                            {
                                //if($arOneValue['ID']>0){
                                if(!isset($arOneValue['PICT']['SRC']) || !$arOneValue['PICT']['SRC'])
                                {
                                    if(!$bTextViewProp)
                                    {
                                        $arOneValue['PICT']['SRC'] = SITE_TEMPLATE_PATH.'/images/svg/noimage_product.svg';
                                        $arOneValue['NO_PHOTO'] = 'Y';
                                    }
                                    else
                                    {
                                        $isHasPicture = false;
                                    }
                                }
                                //}
                            }
                        }
                        unset($arOneValue);

                        if($isHasPicture)
                        {
                            $templateRow .= '<div class="bx_item_detail_scu22" '.$arProp['STYLE'].' id="#ITEM#_prop_'.$arProp['ID'].'_cont" data-display_type="LI" data-id="'.$arProp['ID'].'">'.
                                '<span class="'.$class_title.'"><span>'.htmlspecialcharsex($arProp['NAME']).$hint_block.'<span class="sku_mdash">&mdash;</span>'.$arProp['VALUE'].'</span></span>'.
                                '<div class="bx_scu_scroller_container"><div class="bx_scu"><ul id="#ITEM#_prop_'.$arProp['ID'].'_list" class="list_values_wrapper">';
                        }
                        else
                        {
                            $templateRow .= '<div class="bx_item_detail_size22" '.$arProp['STYLE'].' id="#ITEM#_prop_'.$arProp['ID'].'_cont" data-display_type="LI" data-id="'.$arProp['ID'].'">'.
                                '<span class="'.$class_title.'">'.htmlspecialcharsex($arProp['NAME']).'</span>'.
                                '<div class="bx_size_scroller_container"><div class="bx_size"><ul id="#ITEM#_prop_'.$arProp['ID'].'_list" class="list_values_wrapper">';
                        }
                        foreach ($arProp['VALUES'] as $arOneValue)
                        {
                            //if($arOneValue['ID']>0){
                            $arOneValue['NAME'] = htmlspecialcharsbx($arOneValue['NAME']);

                            if($isHasPicture && ($arOneValue['NEW_PICT'] || (isset($arOneValue['PICT']['SRC']) && $arOneValue['PICT']['SRC'])))
                            {
                                $str = '<span class="cnt1"><span class="cnt_item'.($arOneValue['NEW_PICT'] ? ' pp' : '').'" style="background-image:url(\''.($arOneValue['NEW_PICT'] ? $arOneValue['NEW_PICT']['SRC'] : $arOneValue['PICT']['SRC']).'\');" data-obgi="url(\''.$arOneValue['PICT']['SRC'].'\')" title="'.$arProp['NAME'].': '.$arOneValue['NAME'].'"></span></span>';
                                if(isset($arOneValue['NO_PHOTO']) && $arOneValue['NO_PHOTO'] == 'Y')
                                    $str = '<span class="cnt1 nf"><span class="cnt_item" title="'.$arProp['NAME'].': '.$arOneValue['NAME'].'"><span class="bg" style="background-image:url(\''.$arOneValue['PICT']['SRC'].'\');"></span></span></span>';
                                $templateRow .= '<li class="item '.$arOneValue['CLASS'].'" '.$arOneValue['STYLE'].' data-treevalue="'.$arProp['ID'].'_'.$arOneValue['ID'].'" data-showtype="li" data-onevalue="'.$arOneValue['ID'].'"><i title="'.$nameWithDelimeters.$arOneValue['NAME'].'"></i>'.$str.'</li>';
                            }
                            else
                            {
                                $templateRow .= '<li class="item '.$arOneValue['CLASS'].'" '.$arOneValue['STYLE'].' data-treevalue="'.$arProp['ID'].'_'.$arOneValue['ID'].'" data-showtype="li" data-onevalue="'.$arOneValue['ID'].'" title="'.$nameWithDelimeters.$arOneValue['NAME'].'"><i></i><span class="cnt">'.$arOneValue['NAME'].'</span></li>';
                            }
                            //}
                        }
                        $templateRow .= '</ul></div>'.
                            '</div></div>';
                    }
                    $arSkuTemplate[$iblockId][$arProp['CODE']] = $templateRow;
                }
            }
        }else{

            foreach ($arSkuProps as $key=>&$arProp){

                $templateRow = '';
                $class_title.= (($arProp["HINT"] && $arProp["SHOW_HINTS"] == "Y") ? ' whint char_name' : '');
                $hint_block = (($arProp["HINT"] && $arProp["SHOW_HINTS"]=="Y") ? '<span class="hint"><span class="icon"><i>?</i></span><span class="tooltip">'.$arProp["HINT"].'</span></span>' : '');
                $show_more_link = false;
                $count_more = 0;
                $count_visible = 0;

                $nameWithDelimeters = $arProp['NAME'];
                if (strpos($arProp['NAME'], ':') === false) {
                    $nameWithDelimeters .= ': ';
                }

                if($arProp['VALUES'])
                {
                    foreach($arProp['VALUES'] as $propKey => $arOneValue)
                    {
                        $arProp['NAME'] = htmlspecialcharsex($arProp['NAME']);

                        if($arOneValue['CLASS'] && strpos($arOneValue['CLASS'], 'active') !== false)
                        {
                            $arProp['VALUE'] = '<span class="val">'.$arOneValue['NAME'].'</span>';

                            if(!$max_count)
                                break;
                        }

                        if($max_count && $count_visible >= $max_count && ( !$arOneValue['CLASS'] || strpos($arOneValue['CLASS'], 'active') === false ) ) {
                            $arProp['VALUES'][$propKey]['CLASS'] .= ' scu_prop_more';
                            $show_more_link = true;
                            $count_more++;
                        }

                        if( !$arOneValue['CLASS'] || strpos($arOneValue['CLASS'], 'missing') === false ) {
                            $count_visible++;
                        }
                    }
                }

                if($show_more_link) {
                    $show_more_link_html = '';
                    $titles = array(
                        Loc::getMessage('SHOW_MORE_SCU_1'),
                        Loc::getMessage('SHOW_MORE_SCU_2'),
                        Loc::getMessage('SHOW_MORE_SCU_3'),
                    );
                    $more_scu_mess = Loc::getMessage('SHOW_MORE_SCU_MAIN', array( '#COUNT#' => \Aspro\Functions\CAsproMax::declOfNum($count_more, $titles) ));
                    $svgHTML =
                        '<svg xmlns="http://www.w3.org/2000/svg" width="4" height="7" viewBox="0 0 4 7" fill="none">'
                        .'<path d="M0.5 0.5L3.5 3.5L0.5 6.5" stroke="#333" stroke-linecap="round" stroke-linejoin="round"/>'
                        .'</svg>';
                    $show_more_link_html = '<div class="show_more_link"><a class="font_sxs colored_theme_n_hover_bg-svg-stroke" href="'.$arItem['DETAIL_PAGE_URL'].'">'.$more_scu_mess.$svgHTML.'</a></div>';
                }

                if(($arProp["DISPLAY_TYPE"]=="P" || $arProp["DISPLAY_TYPE"]=="R" ) && $type_view!= 'block' ){

                    $showSkuMdash = false;

                    if($arProp['COLOR_REF'] || $arProp['GLASS_12']){
                        $showSkuMdash = true;
                    }

                    $templateRow .= '<div class="bx_item_detail_size11" '.$arProp['STYLE'].' id="#ITEM#_prop_'.$arProp['ID'].'_cont" data-display_type="SELECT" data-id="'.$arProp['ID'].'">'.
                        '<span class="'.$class_title.'"><span>'.($arProp['TITLE'] ? $arProp['TITLE'] : $arProp['NAME']).$hint_block.($showSkuMdash ? '<span class="sku_mdash">&mdash;</span>'.$arProp['VALUE'].'</span>' : "") .'</span>'.
                        '<div class="bx_size_scroller_container form-control bg"><div class="bx_size"><select id="#ITEM#_prop_'.$arProp['ID'].'_list" class="list_values_wrapper">';
                    foreach ($arProp['VALUES'] as $arOneValue){
                        
                        // if($arOneValue['ID']>0){
                        $arOneValue['NAME'] = htmlspecialcharsbx($arOneValue['NAME']);
                        $templateRow .= '<option '.$arOneValue['SELECTED'].' '.$arOneValue['DISABLED'].' data-treevalue="'.$arProp['ID'].'_'.$arOneValue['ID'].'" data-showtype="select" data-onevalue="'.$arOneValue['ID'].'" ';
                        if($arProp["DISPLAY_TYPE"]=="R"){
                            $templateRow .= 'data-img_src="'.$arOneValue["PICT"]["SRC"].'" ';
                        }

                        $templateRow .= 'title="'.$nameWithDelimeters.$arOneValue['NAME'].'">';
                        $templateRow .= '<span class="cnt">'.$arOneValue['NAME'].'</span>';
                        $templateRow .= '</option>';
                        // }
                    }
                    $templateRow .= '</select></div>'.
                        '</div></div>';
                }elseif ('TEXT' == $arProp['SHOW_MODE']){
                    $templateRow .= '<div class="bx_item_detail_size11" '.$arProp['STYLE'].' id="#ITEM#_prop_'.$arProp['ID'].'_cont" data-display_type="LI" data-id="'.$arProp['ID'].'">'.
                        '<span class="'.$class_title.'"><span>'.($arProp['TITLE'] ? $arProp['TITLE'] : $arProp['NAME']).$hint_block.'<span class="sku_mdash">&mdash;</span>'.$arProp['VALUE'].'</span></span>'.
                        '<div class="bx_size_scroller_container"><div class="bx_size"><ul id="#ITEM#_prop_'.$arProp['ID'].'_list" class="list_values_wrapper" '.($max_count ? 'data-max-count="'.$max_count.'"' : '').'>';
                    foreach ($arProp['VALUES'] as $arOneValue){
                        $arOneValue['NAME'] = htmlspecialcharsbx($arOneValue['NAME']);

                        $templateRow .= '<li class="item '.$arOneValue['CLASS'].'" '.$arOneValue['STYLE'].' data-treevalue="'.$arProp['ID'].'_'.$arOneValue['ID'].'" data-showtype="li" data-onevalue="'.$arOneValue['ID'].'" title="'.$nameWithDelimeters.$arOneValue['NAME'].'"><i></i><span class="cnt">'.$arOneValue['NAME'].'</span></li>';
                    }
                    $templateRow .= '</ul></div>'.
                        '</div></div>';
                    if($show_more_link) {
                        $templateRow .= $show_more_link_html;
                    }
                }elseif ('PICT' == $arProp['SHOW_MODE']){

                    $arCurrentTree = array();
                    $showPreviewPictureProp = false;
                    if($offerShowPreviewPictureProps && is_array($offerShowPreviewPictureProps))
                    {
                        if(in_array($arProp['CODE'], $offerShowPreviewPictureProps))
                        {
                            $showPreviewPictureProp = true;
                            if($arCurrentOffer && $arCurrentOffer['TREE'])
                                $arCurrentTree = $arCurrentOffer['TREE'];
                        }
                    }

                    $isHasPicture = true;
                    foreach($arProp['VALUES'] as &$arOneValue)
                    {
                        $boolOneSearch = false;
                        if($arCurrentTree && $arOneValue['ID'] != 0)
                        {
                            $arRowTree = $arCurrentTree;
                            $arRowTree['PROP_'.$arProp['ID']] = $arOneValue['ID'];

                            foreach($arItem['OFFERS'] as &$arOffer)
                            {
                                $boolOneSearch = true;
                                foreach($arRowTree as $rkey => $rval)
                                {
                                    if($rval !== $arOffer['TREE'][$rkey])
                                    {
                                        $boolOneSearch = false;
                                        break;
                                    }
                                }
                                if($boolOneSearch)
                                {
                                    if($arOffer['PREVIEW_PICTURE_FIELD'] && is_array($arOffer['PREVIEW_PICTURE_FIELD']) && $arOffer['PREVIEW_PICTURE_FIELD']['SRC'])
                                        $arOneValue['NEW_PICT'] = $arOffer['PREVIEW_PICTURE_FIELD'];
                                    else
                                        $boolOneSearch = false;
                                    break;
                                }
                            }
                            unset($arOffer);
                        }

                        if(!$boolOneSearch)
                        {
                            //if($arOneValue['ID']>0){
                            if(!isset($arOneValue['PICT']['SRC']) || !$arOneValue['PICT']['SRC'])
                            {
                                if(!$bTextViewProp || $showPreviewPictureProp)
                                {
                                    $arOneValue['PICT']['SRC'] = SITE_TEMPLATE_PATH.'/images/svg/noimage_product.svg';
                                    $arOneValue['NO_PHOTO'] = 'Y';
                                }
                                else
                                {
                                    $isHasPicture = false;
                                }
                            }
                            //}
                        }

                        foreach($arItem['OFFERS'] as &$arOffer)
                        {
                            if($arRowTree['PROP_'.$arProp['ID']] == $arOffer['TREE']['PROP_'.$arProp['ID']] && !$boolOneSearch)
                            {
                                if($arOffer['PREVIEW_PICTURE_FIELD'] && is_array($arOffer['PREVIEW_PICTURE_FIELD']) && $arOffer['PREVIEW_PICTURE_FIELD']['SRC'])
                                    $arOneValue['NEW_PICT'] = $arOffer['PREVIEW_PICTURE_FIELD'];
                                break;
                            }
                        }
                    }
                    unset($arOneValue);
                    if($isHasPicture)
                    {
                        $templateRow .= '<div class="bx_item_detail_scu" '.$arProp['STYLE'].' id="#ITEM#_prop_'.$arProp['ID'].'_cont" data-display_type="LI" data-id="'.$arProp['ID'].'">'.
                            '<span class="'.$class_title.'"><span>'.($arProp['TITLE'] ? $arProp['TITLE'] : $arProp['NAME']).$hint_block.'<span class="sku_mdash">&mdash;</span>'.$arProp['VALUE'].'</span></span>'.
                            '<div class="bx_scu_scroller_container"><div class="bx_scu"><ul id="#ITEM#_prop_'.$arProp['ID'].'_list" class="list_values_wrapper" '.($max_count ? 'data-max-count="'.$max_count.'"' : '').'>';
                    }
                    else
                    {
                        $templateRow .= '<div class="bx_item_detail_size" '.$arProp['STYLE'].' id="#ITEM#_prop_'.$arProp['ID'].'_cont" data-display_type="LI" data-id="'.$arProp['ID'].'">'.
                            '<span class="'.$class_title.'">'.htmlspecialcharsex($arProp['NAME']).'</span>'.
                            '<div class="bx_size_scroller_container"><div class="bx_size"><ul id="#ITEM#_prop_'.$arProp['ID'].'_list" class="list_values_wrapper">';

                    }
                    foreach ($arProp['VALUES'] as $arOneValue)
                    {
                        //if($arOneValue['ID']>0){

                        $arOneValue['NAME'] = htmlspecialcharsbx($arOneValue['NAME']);
                        if($isHasPicture && ($arOneValue['NEW_PICT'] || (isset($arOneValue['PICT']['SRC']) && $arOneValue['PICT']['SRC'])))
                        {
                            $str = '<span class="cnt1"><span class="cnt_item'.($arOneValue['NEW_PICT'] ? ' pp' : '').'" style="background-image:url(\''.($arOneValue['NEW_PICT'] ? $arOneValue['NEW_PICT']['SRC'] : $arOneValue['PICT']['SRC']).'\');" data-obgi="url(\''.$arOneValue['PICT']['SRC'].'\')" title="'.$nameWithDelimeters.$arOneValue['NAME'].'"></span></span>';
                            if(isset($arOneValue['NO_PHOTO']) && $arOneValue['NO_PHOTO'] == 'Y')
                                $str = '<span class="cnt1 nf"><span class="cnt_item" title="'.$nameWithDelimeters.$arOneValue['NAME'].'"><span class="bg no-image" style="background-image:url(\''.$arOneValue['PICT']['SRC'].'\');"></span></span></span>';
                            $templateRow .= '<li class="item '.$arOneValue['CLASS'].'" '.$arOneValue['STYLE'].' data-treevalue="'.$arProp['ID'].'_'.$arOneValue['ID'].'" data-showtype="li" data-onevalue="'.$arOneValue['ID'].'"><i title="'.$nameWithDelimeters.$arOneValue['NAME'].'"></i>'.$str.'</li>';
                        }
                        else
                        {
                            $templateRow .= '<li class="item '.$arOneValue['CLASS'].'" '.$arOneValue['STYLE'].' data-treevalue="'.$arProp['ID'].'_'.$arOneValue['ID'].'" data-showtype="li" data-onevalue="'.$arOneValue['ID'].'" title="'.$nameWithDelimeters.$arOneValue['NAME'].'"><i></i><span class="cnt">'.$arOneValue['NAME'].'</span></li>';
                        }
                        //}
                    }
                    $templateRow .= '</ul></div>'.
                        '</div></div>';

                    if($show_more_link) {
                        $templateRow .= $show_more_link_html;
                    }
                }

                $arSkuTemplate[$arProp['CODE']] = $templateRow;
            }
        }
        unset($templateRow, $arProp);
        return $arSkuTemplate;
    }
}