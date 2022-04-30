//Wireless Advanced
<?mget :InternetGatewayDevice.X_TWSZ-COM_Radio.1. "TransmitPower BeaconInterval RCSCTSThreshlod FRAGLEN DTIM GuardInterval"
   `var G_TransmitPower                   = "$01";//TransmitPower
	var G_BeaconInterval                  = "$02";//BeaconInterval
	var G_RCSCTSThreshlod                 = "$03";//Standard
	var G_FRAGLEN                         = "$04";//FRAGLEN
	var G_DTIM                            = "$05";//DTIM
	var G_GuardInterval                   = "$06";//GuarInterval
`?>

function uiOnload(){
	setJSONValue({
		'SEL_Power'         : G_TransmitPower,
		'TE_beacon'         : G_BeaconInterval,
		'TE_rts'            : G_RCSCTSThreshlod,
		'TE_frag'           : G_FRAGLEN,
		'TE_dtim'           : G_DTIM,
		'SEL_PreType'       : G_GuardInterval
	});
}

function uiSubmit(){
	var nodes = $('SEL_Power','TE_beacon','TE_rts','TE_frag','TE_dtim','SEL_PreType');
	$H({
		 "obj-action" 	: "set",
		 "getpage" 		: "html/index.html",
		 "errorpage" 	: "html/index.html",
		 "var:menu" 	: G_Menu,
		 "var:page" 	: G_Page,
		 "var:errorpage" : G_Page,
		 'var:CacheLastData' : ViewState.Save()
	},true);
	$F(':InternetGatewayDevice.X_TWSZ-COM_Radio.1.' + 'TransmitPower'             , nodes[0].value);
	$F(':InternetGatewayDevice.X_TWSZ-COM_Radio.1.' + 'BeaconInterval'            , nodes[1].value);
	$F(':InternetGatewayDevice.X_TWSZ-COM_Radio.1.' + 'RCSCTSThreshlod'           , nodes[2].value);
	$F(':InternetGatewayDevice.X_TWSZ-COM_Radio.1.' + 'FRAGLEN'                   , nodes[3].value);
	$F(':InternetGatewayDevice.X_TWSZ-COM_Radio.1.' + 'DTIM'                      , nodes[4].value);
	$F(':InternetGatewayDevice.X_TWSZ-COM_Radio.1.' + 'GuardInterval'             , nodes[5].value);
	$('uiPostForm').submit();
}

function dealWithError(){
	if (G_Error != 1){
		return false;
	}
	
	var arrayHint = [];
	

	dealErrorMsg(arrayHint, G_Error_Msg);
}

addListeners(uiOnload, dealWithError);
