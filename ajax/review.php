<?if($id):?>
	<?$APPLICATION->IncludeComponent(
		"bitrix:news.detail",
		"popup-review",
		Array(
			"DISPLAY_DATE" => "N",
			"DISPLAY_NAME" => "Y",
			"DISPLAY_PICTURE" => "Y",
			"DISPLAY_PREVIEW_TEXT" => "Y",
			"IBLOCK_TYPE" => "aspro_max_content",
			"IBLOCK_ID" => CMaxCache::$arIBlocks[SITE_ID]["aspro_max_content"]["aspro_max_add_review"][0],
			"FIELD_CODE" => array(
				0 => "NAME",
				1 => "PREVIEW_TEXT",
				2 => "PREVIEW_PICTURE",
				3 => "DETAIL_PICTURE",
			),
			"PROPERTY_CODE" => array(
				0 => "RATING",
				1 => "POST",
			),
			"DETAIL_URL"	=>	"",
			"SECTION_URL"	=>	"",
			"META_KEYWORDS" => "",
			"META_DESCRIPTION" => "",
			"BROWSER_TITLE" => "",
			"DISPLAY_PANEL" => "N",
			"SET_CANONICAL_URL" => "N",
			"SET_TITLE" => "N",
			"SET_STATUS_404" => "N",
			"INCLUDE_IBLOCK_INTO_CHAIN" => "N",
			"ADD_SECTIONS_CHAIN" => "N",
			"ADD_ELEMENT_CHAIN" => "N",
			"ACTIVE_DATE_FORMAT" => "d F Y",
			"CACHE_TYPE" => "A",
			"CACHE_TIME" => "3600000",
			"CACHE_FILTER" => "Y",
			"CACHE_GROUPS" => "N",
			"USE_PERMISSIONS" => "N",
			"GROUP_PERMISSIONS" => "N",
			"DISPLAY_TOP_PAGER" => "N",
			"DISPLAY_BOTTOM_PAGER" => "N",
			"PAGER_TITLE" => "",
			"PAGER_SHOW_ALWAYS" => "N",
			"PAGER_TEMPLATE" => "",
			"PAGER_SHOW_ALL" => "N",
			"CHECK_DATES" => "N",
			"ELEMENT_ID" => $id,
			"ELEMENT_CODE" => "",
			"IBLOCK_URL" => "",
		),
		false
	);?>
<?endif;?>