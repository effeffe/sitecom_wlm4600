
<?mget :InternetGatewayDevice.X_SITCOM-COM_CLOUD. "Enable"
`	var G_SCSEnable 		= "$01";
`?>

function uiOnload(){
	Form.Radio('RAD_SCSEnable', G_SCSEnable);
    enclick();
}

function uiSubmit(){
	$H({
		":InternetGatewayDevice.X_SITCOM-COM_CLOUD.Enable"       : Form.Radio('RAD_SCSEnable') == '1' ? 1:0,
		'obj-action'   : 'set',
		'var:menu'     : G_Menu,
		'var:page'     : G_Page,
		'var:errorpage': G_Page,
		'getpage'      : 'html/index.html',
		'var:CacheLastData': ViewState.Save()
	});
	$('uiPostForm').submit();
}

function uiAcitivConfig(){
    location.href="http://www.sitecomcloudsecurity.com";
}

function enclick(){
    $('SCS007').disabled = (G_SCSEnable == '1' ?  false : true);
}

function dealWithError(){
	if (G_Error != 1){ return false;}
	
	var arrayHint = [];
	dealErrorMsg(arrayHint, G_Error_Msg);
}

addListeners(uiOnload,dealWithError);
