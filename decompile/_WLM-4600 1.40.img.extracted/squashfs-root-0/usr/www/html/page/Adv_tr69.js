/*  ڴJavaScript  */
var G_TR069_Enable = "<?get :InternetGatewayDevice.ManagementServer.EnableCWMP?>";
<?mget :InternetGatewayDevice.ManagementServer. "URL Username PeriodicInformEnable PeriodicInformInterval ConnectionRequestUsername ConnectionRequestEnable Password ConnectionRequestPassword"
`	var G_TR069_URL = "$01";                    //URL
	var G_TR069_Username = "$02";
	var G_TR069_PeriodicInformEnable = "$03";
	var G_TR069_PeriodicInformInterval = "$04";
	var G_TR069_ConnectionRequestUsername = "$05";
	var G_TR069_ConnectionRequestEnable = "$06";
	var G_TR069_Password = "$07";
	var G_TR069_ConnectionRequestPassword = "$08";
`?>

var g_PwdShow = "#$^%.";

function uiOnload(){
	var enable_interval=G_TR069_PeriodicInformEnable;
	var enable_tr069 = G_TR069_Enable;
	
	Form.Radio('RAD_CwmpEnable', enable_tr069);
	doCwmpActive(enable_tr069);
	setJSONValue({
		'TE_url'      					: G_TR069_URL,
		'TE_AcsUsername' 				: G_TR069_Username,
		'TE_AcsPassword'  				: g_PwdShow,
		'TE_ConnectUsername'			: G_TR069_ConnectionRequestUsername,
		'TE_ConnectPassword'			: g_PwdShow,
		'TE_interval'					: G_TR069_PeriodicInformInterval
	});
	
	if(G_TR069_ConnectionRequestEnable=='1')
	{
		$('CHE_auth').checked=true;
	}
	else
	{
		$('CHE_auth').checked=false;
		$('TE_ConnectUsername').disabled = true;
		$('TE_ConnectPassword').disabled = true;
	}
	
	Form.Radio('RAD_InformEnable', enable_interval);
	
	if(enable_interval=='0'){
		$('TE_interval').disabled=true;
	}
}

function doInformActive(value)
{
	if(value == '1')
	{
		$('TE_interval').disabled = false;
	}
	else
	{
		$('TE_interval').disabled = true;
	}
}

function enableAuth()
{
	if($('CHE_auth').checked == '1')
	{
		$('TE_ConnectUsername').disabled = false;
		$('TE_ConnectPassword').disabled = false;
	}
	else
	{
		$('TE_ConnectUsername').disabled = true;
		$('TE_ConnectPassword').disabled = true;
	}
}

function doCwmpActive(value)
{
	if(value == '1')
	{
		$('TE_url').disabled = false;
		$('TE_AcsUsername').disabled = false;
		$('TE_AcsPassword').disabled = false;
		$('CHE_auth').disabled = false;
		$('TE_ConnectUsername').disabled = false;
		$('TE_ConnectPassword').disabled = false;
		$('RAD_InformEnable').disabled = false;
		$('RAD_InformDisable').disabled = false;
		$('TE_interval').disabled = false;
	}
	else
	{
		$('TE_url').disabled = true;
		$('TE_AcsUsername').disabled =true;
		$('TE_AcsPassword').disabled = true;
		$('CHE_auth').disabled = true;
		$('TE_ConnectUsername').disabled = true;
		$('TE_ConnectPassword').disabled = true;
		$('RAD_InformEnable').disabled = true;
		$('RAD_InformDisable').disabled = true;
		$('TE_interval').disabled = true;
	}
}

function uiSubmit(){	
	var value_array   = $('TE_url','TE_AcsUsername','TE_AcsPassword','TE_ConnectUsername','TE_ConnectPassword','TE_interval');

	
	var enable_TR069 = Form.Radio('RAD_CwmpEnable');
	var enable_auth = Form.Checkbox('CHE_auth');
	var enable_infrom = Form.Radio('RAD_InformEnable');
	
	$H({
		':InternetGatewayDevice.ManagementServer.EnableCWMP'   : enable_TR069 =='1' ? 1 : 0,
		':InternetGatewayDevice.ManagementServer.PeriodicInformEnable'     : enable_infrom=='1' ? 1 : 0,
		':InternetGatewayDevice.ManagementServer.PeriodicInformInterval'   : enable_infrom=='1' ? value_array[5].value : undefined,
		':InternetGatewayDevice.ManagementServer.Password'                 : value_array[2].value != g_PwdShow ? value_array[2].value : undefined,
		':InternetGatewayDevice.ManagementServer.ConnectionRequestPassword': Form.Checkbox('CHE_auth') ? (value_array[4].value != g_PwdShow?value_array[4].value:undefined) : undefined,
		':InternetGatewayDevice.ManagementServer.URL'                      : value_array[0].value,
		':InternetGatewayDevice.ManagementServer.Username'                 : value_array[1].value,
		':InternetGatewayDevice.ManagementServer.ConnectionRequestUsername': Form.Checkbox('CHE_auth') ? value_array[3].value : 'abcde12345',
		':InternetGatewayDevice.ManagementServer.ConnectionRequestEnable'  : Form.Checkbox('CHE_auth') ? 1:0,
		'var:menu'     : G_Menu,
		'var:page'     : G_Page,
		'var:errorpage': G_Page,
		'getpage'      :'html/index.html',
		'errorpage'    :'html/index.html',
		'obj-action'   :'set',
		'var:CacheLastData': ViewState.Save()
	},true);
	$('uiPostForm').submit();
}


function dealWithError(){
	if (G_Error != 1){
		return false;
	}
	
	if (G_Error != 1){
		return false;
	}
	
	var arrayHint = [];
	
	dealErrorMsg(arrayHint, G_Error_Msg);
}

addListeners(uiOnload,dealWithError);

