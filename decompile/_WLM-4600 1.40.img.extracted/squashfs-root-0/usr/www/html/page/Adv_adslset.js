// DSL Set
<?mget :InternetGatewayDevice.WANDevice.1.WANDSLInterfaceConfig. "X_TWSZ-COM_DSLMode X_TWSZ-COM_StandardRequested"
`	var G_DSLMode   = "$01";
    var G_ADSLType  = "$02";
`?>

function uiOnload(){
    Form.Select('SELECT_DSLMode', G_DSLMode);
       
  //  if ( G_ADSLType == "Annex_A,Annex_I,Annex_J,Annex_L,Annex_M" ){
        // 系统默认是 Annex_A,Annex_I,Annex_J,Annex_L,Annex_M, 但 Annex_J 暂时没有用,为了赋值,暂时做这处理
  //      G_ADSLType = "Annex_A,Annex_I,Annex_L,Annex_M";
	//}
    Form.Select('SELECT_ADSLType', G_ADSLType);
	dealWithError();
}

function uiSubmit()
{
	//alert($('EnableDSL').checked);
	$H({
		':InternetGatewayDevice.WANDevice.1.WANDSLInterfaceConfig.X_TWSZ-COM_DSLMode'            : Form.Select('SELECT_DSLMode'),
		':InternetGatewayDevice.WANDevice.1.WANDSLInterfaceConfig.X_TWSZ-COM_StandardRequested'  : Form.Select('SELECT_ADSLType'),
		'var:menu'     : G_Menu,
		'var:page'     : G_Page,
		'var:subpage'  : G_SubPage,
		'var:errorpage': G_SubPage,
		'obj-action'   : 'set',
		'getpage'      : 'html/index.html',
		'errorpage'    : 'html/index.html',
		'var:CacheLastData': ViewState.Save()
	},true);
	
	$('uiPostForm').submit();
}

function dealWithError(){
	if (G_Error != 1){
		return false;
	}
	
	var arrayHint = [];
	
	dealErrorMsg(arrayHint, G_Error_Msg);
}

addListeners(uiOnload);