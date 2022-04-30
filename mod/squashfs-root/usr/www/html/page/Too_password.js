/*  JavaScript Document  */
var G_UserInfo = new Array();
//var m = 0;
<?mget :InternetGatewayDevice.X_TWSZ-COM_Authentication.UserList.1. "UserName Level"
`	G_UserName      = "$01"; //UserName
	G_UserLevel     = "$02"; //Level
`?>
//鍒濆鍖?
function uiOnload(){
//	$('USERNAME').value = G_UserName;
	setJSONValue({
		'td_Username' 		: G_UserName
	});

}

//鎻愪氦鏁版嵁
function uiSubmit(){
	//check password
	if($('PASS_NewPassword').value != $('PASS_ConfirmedPassword').value){
		alert(SEcode[1010]);
		return false;
	}
	
	$H({
		'obj-action'   : 'set',
		'var:menu'     : G_Menu,
		'var:page'     : G_Page,
		'var:errorpage': G_Page,
		'getpage'      : 'html/index.html',
		'errorpage'    : 'html/index.html',
		'var:CacheLastData': ViewState.Save()
	}, true);
	$F(':InternetGatewayDevice.X_TWSZ-COM_Authentication.UserList.1.Password', $('PASS_OldPassword').value + ':' +$('PASS_NewPassword').value);
//	$F(':InternetGatewayDevice.X_TWSZ-COM_Authentication.UserList.1.UserName', 	$('USERNAME').value);
	
	$('uiPostForm').submit();
}

//閿欒澶勭悊鍑芥暟
function dealWithError(){
	if (G_Error != 1){ 
		return false;
	}
	var arrayHint = [];
	dealErrorMsg(arrayHint, G_Error_Msg);
}
//鐩戝惉鍔犺浇涓庨敊璇鐞嗗嚱鏁?
addListeners(uiOnload, dealWithError);