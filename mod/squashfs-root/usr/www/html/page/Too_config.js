/*  JavaScript Document  */

var G_AutoUpg = "<?get :InternetGatewayDevice.X_SITCOM-COM_AUTOUPGRADE.Enable ?>"

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

addListeners(uiOnload,dealWithError);