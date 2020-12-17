<?

\Bitrix\Main\Loader::registerAutoLoadClasses(
    null,
    [
        "SM\CustomMax" => "/local/classes/CustomMax.php",
        "SM\CustomCAsproMaxSku" => "/local/classes/CustomCAsproMaxSku.php"
    ]

);

\Bitrix\Main\Loader::includeModule("iblock");

$inst = \Bitrix\Main\EventManager::getInstance();
//$inst->addEventHandler("iblock", "OnAfterIBlockElementAdd", ["Handlers", "OnAfterIBlockElementAddHandler"]);

class Handlers {
    function  OnAfterIBlockElementAddHandler(&$arFields){
        global $USER;
        if($arFields['IBLOCK_SECTION'][0] == '2642'){ //  межкомнатные двери
            echo "";
            $elNalich = new CIBlockElement;
            $resulNalich = $elNalich->Add([
                "MODIFIED_BY"    => $USER->GetID(),
                "IBLOCK_SECTION_ID" => 2765,          // элемент лежит в корне раздела
                "IBLOCK_ID"      => 57,
                "NAME"           => "Набор тест - " . date('H:i:s'),
                "ACTIVE"         => "Y",

            ], false, false, false);

            if($resulNalich){
                $resAddNal = \Bitrix\Catalog\Model\Product::add([
                    'ID' => $resulNalich,
                    'AVAILABLE' => 'Y',
                    'TYPE' => \Bitrix\Catalog\ProductTable::TYPE_PRODUCT,
                    'CAN_BUY_ZERO' => "Y",
                ]);
                if($resAddNal){
                    // add price
//                    \Bitrix\Catalog\Model\Price::add();
                }

            }

//            CCatalogProductSet::add([
//                'ITEM_ID'
//            ]);
        }

    }
}