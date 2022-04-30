//Wireless WDS
<?mget :InternetGatewayDevice.X_TWSZ-COM_Radio.1.WDSConfiguration. "Enable EncryptionModes Passphrase"
`	var G_Enable                      = "$01";//Enable
    var G_EncryptionModes             = "$02";//EncryptionModes
	var G_Passphrase                  = "$03";//Passphrase
`?>
var G_MACAddress_1 = "<?get :InternetGatewayDevice.X_TWSZ-COM_Radio.1.WDSConfiguration.BaseStation.1.MACAddress?>";
var G_MACAddress_2 = "<?get :InternetGatewayDevice.X_TWSZ-COM_Radio.1.WDSConfiguration.BaseStation.2.MACAddress?>";
var G_MACAddress_3 = "<?get :InternetGatewayDevice.X_TWSZ-COM_Radio.1.WDSConfiguration.BaseStation.3.MACAddress?>";
var G_MACAddress_4 = "<?get :InternetGatewayDevice.X_TWSZ-COM_Radio.1.WDSConfiguration.BaseStation.4.MACAddress?>";
var G_AuthenticationMode = "<?get :InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.BeaconType?>";

function uiOnload(){
	//Form.Radio('RAD_activated', G_Enable);
	//alert(G_AuthenticationMode);
	
	setJSONValue({ 
			'RAD_activated'    : G_Enable,
			'SEL_Encryption'   : G_EncryptionModes || 'TKIPEncryption',
		    'TE_WdsKey'        : G_Passphrase,
			'TE_WdsMac_1'      : G_MACAddress_1,
		    'TE_WdsMac_2'      : G_MACAddress_2,
		    'TE_WdsMac_3'      : G_MACAddress_3,
		    'TE_WdsMac_4'      : G_MACAddress_4
		});
	CheckAuthMode();
	disWds();
	/*setJSONValue({ 
		'RAD_activated'    : G_Enable,
		'SEL_Encryption'   : G_EncryptionModes,
		'TE_WdsKey'        : G_Passphrase,
		'TE_WdsMac_1'      : G_MACAddress_1,
		'TE_WdsMac_2'      : G_MACAddress_2,
		'TE_WdsMac_3'      : G_MACAddress_3,
		'TE_WdsMac_4'      : G_MACAddress_4
	});*/
}


function CheckAuthMode()
{
	if((G_AuthenticationMode == 'Basic')||( G_AuthenticationMode =='None'))
	{
		$('wds_encryption').style.display = 'none';
		
	}
	else
	{
		$('wds_encryption').style.display = 'block';
					 
		//
	}
}


function checkShareKeyLength(_value){
	if(_value.length < 8 || _value.length > 64){
		alert("The range of Pre-Shared Key length is 8 ~ 64.");
	}
}

function disWds()
{
	var b_value = Form.Radio('RAD_activated');
	if(b_value !='1')
	{
		disCtrl('wds_config',false);
	}
	else
	{
		disCtrl('wds_config',true);
	}
}
/*function uiOnload()
{
	setJSONValue({ 
		'RAD_activated'      : G_Enable,
		'SEL_Encryption'     : G_EncryptionModes,
		'TE_WdsKey'          : G_Passphrase,
	    'TE_WdsMac_1'        : G_MACAddress_1,
		'TE_WdsMac_2'        : G_MACAddress_2,
		'TE_WdsMac_3'        : G_MACAddress_3,
		'TE_WdsMac_4'        : G_MACAddress_4
	});
}*/
	
function uiSubmit()
{
	//var SSID_Value = $('SEL_VapList').value;
	//var Idx  = SSID_index[SSID_Value];
	//alert("yll");
	//if((G_AuthenticationMode == 'Basic')||( G_AuthenticationMode =='None'))
	/*if($('wds_encryption').style.display == 'none')
	{
		$F(':InternetGatewayDevice.LANDevice.1.X_TWSZ-COM_WDSConfiguration.EncryptionModes'  ,	   'None');
		alert("none");
	}
	else
	{
		
		$F(':InternetGatewayDevice.LANDevice.1.X_TWSZ-COM_WDSConfiguration.EncryptionModes'  ,		$('SEL_Encryption').value);
		alert("wpa");
	}*/
	$H({ 
	    ':InternetGatewayDevice.X_TWSZ-COM_Radio.1.WDSConfiguration.Enable'                    : Form.Radio('RAD_activated'),
	    ':InternetGatewayDevice.X_TWSZ-COM_Radio.1.WDSConfiguration.Passphrase'                : $('TE_WdsKey').value,
		':InternetGatewayDevice.X_TWSZ-COM_Radio.1.WDSConfiguration.BaseStation.1.MACAddress'  : $('TE_WdsMac_1').value,
		':InternetGatewayDevice.X_TWSZ-COM_Radio.1.WDSConfiguration.BaseStation.2.MACAddress'  : $('TE_WdsMac_2').value,
		':InternetGatewayDevice.X_TWSZ-COM_Radio.1.WDSConfiguration.BaseStation.3.MACAddress'  : $('TE_WdsMac_3').value,
		':InternetGatewayDevice.X_TWSZ-COM_Radio.1.WDSConfiguration.BaseStation.4.MACAddress'  : $('TE_WdsMac_4').value,
		'var:menu'      : G_Menu,
		'var:page'      : G_Page,
		//'var:subpage'   : G_SubPage,
		'var:errorpage' : G_Page,
		'getpage'       : 'html/index.html',
		'errorpage'     : 'html/index.html',
		//'var:arrayid'   : Idx,
		'obj-action'    : 'set'
	},true);
	
	if($('wds_encryption').style.display == 'none')
	{
		$F(':InternetGatewayDevice.X_TWSZ-COM_Radio.1.WDSConfiguration.EncryptionModes'  ,	   'None');
		//alert("none");
	}
	else
	{
		
		$F(':InternetGatewayDevice.X_TWSZ-COM_Radio.1.WDSConfiguration.EncryptionModes'  ,		$('SEL_Encryption').value);
		//alert("wpa");
	}
	$('uiPostForm').submit();
}

function dealWithError()
{
     if (G_Error != 1)
     { 
	     return false;
	 }

     var arrayHint = [];

     dealErrorMsg(arrayHint, G_Error_Msg);
}

addListeners(uiOnload,dealWithError);

	
	
