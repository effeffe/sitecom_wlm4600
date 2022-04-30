/*  JavaScript Document  */
var G_AutoUpg = "<?get :InternetGatewayDevice.X_SITCOM-COM_AUTOUPGRADE.Enable ?>"

function uiSubmit(){
    $H({
		":InternetGatewayDevice.X_SITCOM-COM_AUTOUPGRADE.Enable"       : Form.Radio('RAD_Switch') == '1' ? 1:0,
		'obj-action'   : 'set',
		'var:menu'     : G_Menu,
		'var:page'     : G_Page,
		'var:errorpage': G_Page,
		'getpage'      : 'html/index.html'
	});
	$('uiPostForm').submit();
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