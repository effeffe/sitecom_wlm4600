/* JavaScript Document */
//全局变量
var G_IpFilterEnable = "<?get :InternetGatewayDevice.X_TWSZ-COM_Firewall.IPFilterEnable?>"; 
var G_SpiEnable = "<?get :InternetGatewayDevice.X_TWSZ-COM_Firewall.SPIEnable?>";

function uiOnload(){
	setJSONValue({
		"RAD_FireWallEnable" 	: G_IpFilterEnable,
		"RAD_SpiEnable" 	    : G_SpiEnable
	});
}

function uiSubmit(){
	$H({
	   "obj-action" 		: "set",
			"getpage" 		: "html/index.html",
			"errorpage" 	: "html/index.html",
			"var:menu" 		: G_Menu,
			"var:page" 		: G_Page,
			"var:errorpage" : G_Page,
			':InternetGatewayDevice.X_TWSZ-COM_Firewall.IPFilterEnable': Form.Radio('RAD_FireWallEnable'),
			':InternetGatewayDevice.X_TWSZ-COM_Firewall.SPIEnable': Form.Radio('RAD_SpiEnable'),
		'var:CacheLastData' : ViewState.Save()
	},true);
	$('uiPostForm').submit();
}

function dealWithError(){
	if (G_Error != 1){ return false;}
	
	var arrayHint = [];
	
	dealErrorMsg(arrayHint, G_Error_Msg);
}

addListeners(uiOnload, dealWithError);