/* JavaScript Document */
var G_AntiDosEnable = "<?get :InternetGatewayDevice.X_TWSZ-COM_AntiAttack.AntiDosEnable ?>";
var G_AntiLogEnable = "<?get :InternetGatewayDevice.X_TWSZ-COM_AntiAttack.AntiLogEnable ?>";
<?mget :InternetGatewayDevice.X_TWSZ-COM_AntiAttack.AntiDos. " SynCookieEnable SynMaxConnections AntiFraggleEnable AntiEchoCargenEnable AntiIPLandEnable IgnrPortScanEnable"
`	var G_dosSyn 			= "$01";
    	var G_dosMaxConn 		= "$02";
	var G_dosFraggle 		= "$03";
	var G_dosChargen 		= "$04";
	var G_dosIPLand 		= "$05";
	var G_dosPortScan 		= "$06";
`?>
<?mget :InternetGatewayDevice.X_TWSZ-COM_AntiAttack.AntiScan. "AntiScanSetSynFinEnable AntiScanSetSynRstEnable AntiScanSetFinRstEnable AntiScanUnAckSetFinEnable AntiScanUnAckSetPshEnable AntiScanUnAckSetUrgEnable AntiScanUnsetAllEnable AntiScanSetAllEnable AntiScanForAllSetSynRstAckFinUrgEnable AntiScanForAllSetFinEnable AntiScanForAllSetFinUrgPshEnable"
`	var G_scanSetSynFin 			= "$01";
	var G_scanSetSynRst 			= "$02";
	var G_scanSetFinRst 			= "$03";
	var G_scanUnAckSetFin 			= "$04";
	var G_ScanUnAckSetPsh 			= "$05";
	var G_scanUnAckSetUrg 			= "$06";
	var G_scanUnsetAll 			= "$07";
	var G_scanSetAll 			= "$08";
	var G_scanSetSynRstAckFinUrg 		= "$09";
	var G_scanSetFin 			= "$0a";
	var G_scanSetFinUrgPsh 			= "$0b";
`?>

function uiOnload(){
	setJSONValue({
		"CHB_Enable" 		: G_AntiDosEnable,
		"CHB_EnableLog" 	: G_AntiLogEnable,
		
		"CHB_Inde1" 		: G_dosSyn,
		"INPUT_MaxSYN" 		: G_dosMaxConn,
		"CHB_Inde2" 		: G_dosFraggle,
		"CHB_Inde3" 		: G_dosChargen,
		"CHB_Inde4" 		: G_dosIPLand,
		"CHB_Inde5" 		: G_dosPortScan,
		
		"CHB_Anti1" 		: G_scanSetSynFin,
		"CHB_Anti2" 		: G_scanSetSynRst,
		"CHB_Anti3" 		: G_scanSetFinRst,
		"CHB_Anti4" 		: G_scanUnAckSetFin,
		"CHB_Anti5" 		: G_ScanUnAckSetPsh,
		"CHB_Anti6" 		: G_scanUnAckSetUrg,
		"CHB_Anti7" 		: G_scanUnsetAll,
		"CHB_Anti8" 		: G_scanSetAll,
		"CHB_Anti9" 		: G_scanSetSynRstAckFinUrg,
		"CHB_Anti10" 		: G_scanSetFin,
		"CHB_Anti11" 		: G_scanSetFinUrgPsh
	});
	
	onClkEnable();
	onClkMaxSYN();
}

function onClkEnable(){
	if($("CHB_Enable").checked){
		$("DIV_Enable").style.display = "";
	}else{
		$("DIV_Enable").style.display = "none";
	}
}

function onClkMaxSYN(){
	if($("CHB_Inde1").checked){
		$("INPUT_MaxSYN").disabled = false;
	}else{
		$("INPUT_MaxSYN").disabled = true;
	}
}

function uiSubmit(){
	$H({
	   	":InternetGatewayDevice.X_TWSZ-COM_AntiAttack.AntiDosEnable" 				: Form.Checkbox('CHB_Enable'),
		":InternetGatewayDevice.X_TWSZ-COM_AntiAttack.AntiLogEnable" 				: Form.Checkbox('CHB_EnableLog'),
		"obj-action" 		: "set",
		"getpage" 		: "html/index.html",
		"errorpage" 		: "html/index.html",
		"var:menu" 		: G_Menu,
		"var:page" 		: G_Page,
		"var:errorpage" 	: G_Page,
		'var:CacheLastData' 	: ViewState.Save()
	},true);
	if(Form.Checkbox('CHB_Enable') == "1"){
		$H({
			//dos
			":InternetGatewayDevice.X_TWSZ-COM_AntiAttack.AntiDos.SynCookieEnable" 			: Form.Checkbox('CHB_Inde1'),
			":InternetGatewayDevice.X_TWSZ-COM_AntiAttack.AntiDos.SynMaxConnections" 		: Form.Checkbox('CHB_Inde1') ? $('INPUT_MaxSYN').value : undefined,
			":InternetGatewayDevice.X_TWSZ-COM_AntiAttack.AntiDos.AntiFraggleEnable" 		: Form.Checkbox('CHB_Inde2'),
			":InternetGatewayDevice.X_TWSZ-COM_AntiAttack.AntiDos.AntiEchoCargenEnable" 		: Form.Checkbox('CHB_Inde3'),
			":InternetGatewayDevice.X_TWSZ-COM_AntiAttack.AntiDos.AntiIPLandEnable" 		: Form.Checkbox('CHB_Inde4'),
			":InternetGatewayDevice.X_TWSZ-COM_AntiAttack.AntiDos.IgnrPortScanEnable" 		: Form.Checkbox('CHB_Inde5'),
			//anti
			":InternetGatewayDevice.X_TWSZ-COM_AntiAttack.AntiScan.AntiScanSetSynFinEnable" 	: Form.Checkbox('CHB_Anti1'),
			":InternetGatewayDevice.X_TWSZ-COM_AntiAttack.AntiScan.AntiScanSetSynRstEnable" 	: Form.Checkbox('CHB_Anti2'),
			":InternetGatewayDevice.X_TWSZ-COM_AntiAttack.AntiScan.AntiScanSetFinRstEnable" 	: Form.Checkbox('CHB_Anti3'),
			":InternetGatewayDevice.X_TWSZ-COM_AntiAttack.AntiScan.AntiScanUnAckSetFinEnable" 	: Form.Checkbox('CHB_Anti4'),
			":InternetGatewayDevice.X_TWSZ-COM_AntiAttack.AntiScan.AntiScanUnAckSetPshEnable" 	: Form.Checkbox('CHB_Anti5'),
			":InternetGatewayDevice.X_TWSZ-COM_AntiAttack.AntiScan.AntiScanUnAckSetUrgEnable" 	: Form.Checkbox('CHB_Anti6'),
			":InternetGatewayDevice.X_TWSZ-COM_AntiAttack.AntiScan.AntiScanUnsetAllEnable" 		: Form.Checkbox('CHB_Anti7'),
			":InternetGatewayDevice.X_TWSZ-COM_AntiAttack.AntiScan.AntiScanSetAllEnable" 		: Form.Checkbox('CHB_Anti8'),
			":InternetGatewayDevice.X_TWSZ-COM_AntiAttack.AntiScan.AntiScanForAllSetSynRstAckFinUrgEnable" 	: Form.Checkbox('CHB_Anti9'),
			":InternetGatewayDevice.X_TWSZ-COM_AntiAttack.AntiScan.AntiScanForAllSetFinEnable" 	: Form.Checkbox('CHB_Anti10'),
			":InternetGatewayDevice.X_TWSZ-COM_AntiAttack.AntiScan.AntiScanForAllSetFinUrgPshEnable" : Form.Checkbox('CHB_Anti11')   
		});
	}
	$('uiPostForm').submit();
}

function dealWithError(){
	if (G_Error != 1){ return false;}
	
	var arrayHint = [];
	
	dealErrorMsg(arrayHint, G_Error_Msg);
}

addListeners(uiOnload, dealWithError);