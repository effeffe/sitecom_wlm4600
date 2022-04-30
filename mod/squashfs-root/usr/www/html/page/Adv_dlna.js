/*  在此添加JavaScript  */
<?mget :InternetGatewayDevice.X_TWSZ-COM_DLNA. "Enable"
`	var G_DLNAEnable    = "$01"; // Enable
`?>

function uiOnload(){
	Form.Radio('RAD_DLNA',G_DLNAEnable);
}



function uiSubmit(){	
	$H({
		':InternetGatewayDevice.X_TWSZ-COM_DLNA.Enable'      : Form.Radio('RAD_DLNA'),
		'var:menu'     : G_Menu,
		'var:page'     : G_Page,
		'var:errorpage': G_Page,
		'obj-action':'set',
		'getpage'   :'html/index.html',
		'errorpage' :'html/index.html',
		'var:CacheLastData': ViewState.Save()
	});
	$('uiPostForm').submit();
}

function dealWithError(){
	if(G_Error != 1){
		return false;
	}
	
	var arrayHint = [];	
	dealErrorMsg(arrayHint, G_Error_Msg);
}

addListeners(uiOnload, dealWithError);

