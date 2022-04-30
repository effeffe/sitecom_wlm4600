/*  JavaScript Document  */

var G_AutoUpg = "<?get :InternetGatewayDevice.X_SITCOM-COM_AUTOUPGRADE.Enable ?>"

var firmwarepro = 0;
function upFirmwareProgress() {
	var _firmware = $("firmware").value;
	var _config = $("config").value;
	//每次只能升级一个
	if(_firmware == ""){
		alert(SEcode[2000]);
		return false;
	}else if(_firmware.match(/.img$/) == null){
		alert(SEcode[2003]);
		return false;
	}
	
	if(firmwarepro == 0){
		firmwarepro = 1;
		return true;
	}
	alert(SEcode[2001]);
	return false;
}

var configpro = 0;
function upConfigProgress() {
	var _config = $("config").value;
	//文件类型
	if(_config == ""){
		alert(SEcode[2000]);
		return false;
	}else if(_config.match(/.xml$/) == null){
		alert(SEcode[2002]);
		return false;
	}
	
	if(configpro == 0){
		configpro = 1;
		return true;
	}
	alert(SEcode[2001]);
	return false;
}

function uiOnload(){
    Form.Radio("RAD_Switch" ,G_AutoUpg);
}

function dealWithError(){
	if (G_Error != 1){ return false;}
	
	var arrayHint = [];
	dealErrorMsg(arrayHint, G_Error_Msg);
}

function setAutoUpgrade(){
	$H({
		":InternetGatewayDevice.X_SITCOM-COM_AUTOUPGRADE.Enable"       : Form.Radio('RAD_Switch') == '1' ? 1:0,
		'obj-action'   : 'set',
		'var:menu'     : G_Menu,
		'var:page'     : G_Page,
		'var:errorpage': G_Page,
		'getpage'      : 'html/index.html'
	}, false, 'uiAutoUpgrade');
}

addListeners(uiOnload,dealWithError);