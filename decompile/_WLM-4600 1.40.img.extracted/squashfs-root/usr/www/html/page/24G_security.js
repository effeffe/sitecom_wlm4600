//Wireless Security
var m = 0;
var G_Wireless = [];
<?objget :InternetGatewayDevice.LANDevice.1.WLANConfiguration. "SSID BeaconType WEPEncryptionLevel WEPKeyIndex BasicAuthenticationMode BasicEncryptionModes WPAAuthenticationMode WPAEncryptionModes IEEE11iAuthenticationMode IEEE11iEncryptionModes X_TWSZ-COM_PSKExpression PreSharedKey.1.KeyPassphrase PreSharedKey.1.PreSharedKey X_TWSZ-COM_WPAGroupRekey X_TWSZ-COM_RadioInterface"
`	G_Wireless[m] = [":InternetGatewayDevice.LANDevice.1.WLANConfiguration.$00", //Path
					 '$01', //SSID
					 '$02', //BeaconType
					 '$03', //WEPEncryptionLevel
					 '$04', //WEPKeyIndex
					 '$05', //BasicAuthenticationMode
					 '$06', //BasicEncryptionModes
					 '$07', //WPAAuthenticationMode
					 '$08', //WPAEncryptionModes
					 '$09', //IEEE11iAuthenticationMode
					 '$0a', //IEEE11iEncryptionModes
					 '$0b', //X_TWSZ-COM_PSKExpression
					 '$0c', //KeyPassphrase
					 '$0d', //PreSharedKey
					 '$0e', //X_TWSZ-COM_WPAGroupRekey
					 '<?get :InternetGatewayDevice.LANDevice.1.WLANConfiguration.$10.X_TWSZ-COM_RadiusServer.1.X_TWSZ-COM_IPAddress?>', //IP
					 '<?get :InternetGatewayDevice.LANDevice.1.WLANConfiguration.$10.X_TWSZ-COM_RadiusServer.1.X_TWSZ-COM_Port?>', //Port
					 '<?get :InternetGatewayDevice.LANDevice.1.WLANConfiguration.$10.X_TWSZ-COM_RadiusServer.1.X_TWSZ-COM_ShareKey?>',//ShareKey
					 '$0f'
					 ];

	m++;
`?>
<?mget :InternetGatewayDevice.X_TWSZ-COM_Radio.1. "Enable Standard"
`	var G_Enable                      = "$01";//Enable
	var G_Standard                    = "$02";//Standard
`?>
//Wireless Wep Key
var G_WEPKey = [];
var n = 0;
<?objget :InternetGatewayDevice.LANDevice.1.WLANConfiguration. "WEPKey.1.WEPKey WEPKey.2.WEPKey WEPKey.3.WEPKey WEPKey.4.WEPKey"
`   G_WEPKey[n] = [":InternetGatewayDevice.LANDevice.1.WLANConfiguration.$00",
				     '$01',
				     '$02',
				     '$03',
				     '$04',
					 ];
   n++;
`?>
var G_SSIDIdx = '<?echo $var:arrayid?>';

function createWirelessMode(){
	var _text = [],_value = [];
	
	if(G_Standard.indexOf('n') > -1){
		_text  = ["None","WPA only"	,"WPA2 only","WPA/WP2 Mixed"];
		_value = ["None","WPA"		,"11i"		,"WPAand11i"];
	} else {
		_text  = ["None","WEP","WPA only","WPA2 only","WPA/WP2 Mixed"];
		_value = ["None","Basic","WPA","11i","WPAand11i"];
	}
	
	$S('SEL_AuthType',_text, _value);
}

function createWPAEncryptionMode(){
    
    if(G_Standard.indexOf('n') > -1){
        var _text  = ["AES"             , "AES+TKIP"];
        var _value = ["AESEncryption"   , "TKIPandAESEncryption"];
    } else {
        var _text  = ["TKIP"            , "AES"             , "AES+TKIP"];
        var _value = ["TKIPEncryption"  , "AESEncryption"   , "TKIPandAESEncryption"];
    }
    
    $S('SEL_EncryptionMode',_text, _value);

}
	
function uiOnload(){
	
	createSSIDOpt();
    createWPAEncryptionMode();
	selectSSID();

}

function selectSSID(){
	
    G_SSIDIdx = $('SEL_ssid').value;
    createWirelessMode();
    $('SEL_AuthType').value = G_Wireless[G_SSIDIdx][2] || 'None';
	ctrlAuthType();

}

function createSSIDOpt(){
	var _text = [], _value = [];
	
	for(var i = 0, _len = G_Wireless.length; i < _len; i++){
		if( G_Wireless[i][18] == '1'){
		_text.push(G_Wireless[i][1]); //SSID
		_value.push(i);
	}
	}
	
	$S('SEL_ssid', _text, _value);
    if (G_SSIDIdx == '-'){
        G_SSIDIdx = $('SEL_ssid').value;
    }else{
        $('SEL_ssid').value = G_SSIDIdx;
    }

}


function getWepKeyDef(){
	var keynum = G_Wireless[G_SSIDIdx][4];
	var wepkey = G_WEPKey[G_SSIDIdx][keynum];
	if(wepkey.length == 5 || wepkey.length == 13){
		supplyValue('SEL_WepKeyFt',0);
	}else{
		supplyValue('SEL_WepKeyFt',1);
	}
}

function ctrlAuthType(){
	var Type = $('SEL_AuthType').value; 
	var node_wpa = $('SEL_WpaMode');
	var nodes = $('wep','wpa');
	var mode_wpa = mode_lli = mode_WPAand11i = '';
	
	switch(Type){
		case 'None' : {
			nodes[0].style.display = nodes[1].style.display = 'none';
			break;
		}
		case 'Basic' : {
			nodes[0].style.display = 'block';
			nodes[1].style.display = 'none';
			
			setJSONValue({
				'SEL_auth'       : G_Wireless[G_SSIDIdx][5],
				'SEL_WepIndex'   : G_Wireless[G_SSIDIdx][3],	//40-bit ||104-bit
				'SEL_WepKey'     : G_Wireless[G_SSIDIdx][4],
				'TE_WepKey1'     : G_WEPKey[G_SSIDIdx][1],//RevWepKey(G_WEPKey[_id+0][0],G_SSIDIdx),
				'TE_WepKey2'     : G_WEPKey[G_SSIDIdx][2],//RevWepKey(G_WEPKey[_id+1][0],G_SSIDIdx),
				'TE_WepKey3'     : G_WEPKey[G_SSIDIdx][3],//RevWepKey(G_WEPKey[_id+2][0],G_SSIDIdx),
				'TE_WepKey4'     : G_WEPKey[G_SSIDIdx][4]//RevWepKey(G_WEPKey[_id+3][0],G_SSIDIdx)
			});
			getWepKeyDef();
			
			onChgWepLen();
			break;
		}
		case 'WPA' : {
			mode_wpa = G_Wireless[G_SSIDIdx][7];
		}
		case '11i' : {
			mode_lli = G_Wireless[G_SSIDIdx][9];
		}
		case 'WPAand11i' : {
			
			mode_WPAand11i = G_Wireless[G_SSIDIdx][9];
			
			
			setJSONValue({
				'SEL_WpaMode'        : mode_wpa || mode_lli || mode_WPAand11i,
				'SEL_EncryptionMode' : Type == 'WPA' ? (G_Wireless[G_SSIDIdx][8] || 'TKIPEncryption') : (G_Wireless[G_SSIDIdx][10] || 'AESEncryption'),
				'TE_GroupKey'        : G_Wireless[G_SSIDIdx][14]
			});
			
			nodes[0].style.display = 'none'; //yll del,20120815
			nodes[1].style.display = 'block';		//yll del,20120815	
			onChgWapMode();
			
			break;
		}
        default:{
            nodes[0].style.display = nodes[1].style.display = 'none';

            break;
        }
	}
}

function onChgWepLen(){ //about wep length
	var value_wep = $('SEL_WepIndex').value;
	var node_wepfmt = $('SEL_WepKeyFt');
	var node_keys = $('TE_WepKey1','TE_WepKey2','TE_WepKey3','TE_WepKey4');
	
	if(value_wep == '104-bit'){
		node_keys[0].maxLength = node_keys[1].maxLength = node_keys[2].maxLength = node_keys[3].maxLength = '26';
		node_wepfmt.options[0].text = 'ASCII (13 characters)';
		node_wepfmt.options[1].text = 'HEX (26 characters)';
	} else {
		node_keys[0].maxLength = node_keys[1].maxLength = node_keys[2].maxLength = node_keys[3].maxLength = '10';
		node_wepfmt.options[0].text = 'ASCII (5 characters)';
		node_wepfmt.options[1].text = 'HEX (10 characters)';
	}
}

function onChgWapMode(){ // WPA Mode
	var value_wpamode = $('SEL_WpaMode').value;
	var nodes = $('prekey','eap');
	
	if(value_wpamode == 'PSKAuthentication'){
		nodes[0].style.display = 'block';
		nodes[1].style.display = 'none';
		$('TE_PreShareKey').value = G_Wireless[G_SSIDIdx][11] == 'KeyPassphrase' ? G_Wireless[G_SSIDIdx][12] : G_Wireless[G_SSIDIdx][13]
	}
	else {
		nodes[0].style.display = 'none';
		nodes[1].style.display = 'block';
		setJSONValue({
			'TE_RadiusIpAddr'    : G_Wireless[G_SSIDIdx][15],
			'TE_RadiusPort'      : G_Wireless[G_SSIDIdx][16],
			'TE_RadiusSharedSec' : G_Wireless[G_SSIDIdx][17]
		});
	}
}

function checkIllegal(){
	//check wep format
	if($('SEL_AuthType').value != 'Basic'){
		return true;
	}
	var _wepKeyFt = $('SEL_WepKeyFt').value;
	var _wepKeyDf = $('SEL_WepKey').value;
	var temp_node = $('TE_WepKey' + _wepKeyDf).value;
	var _HEX = /^[0-9a-fA-F]{10}$/;
	
	if($('SEL_WepIndex').value == '40-bit'){
		if(_wepKeyFt == '0'){ //ACSII 5 char
			for(var i = 1; i < 5; i++){
				if(i == _wepKeyDf && temp_node.length != 5){
					DealWith.Wrong('TE_WepKey' + _wepKeyDf,'WEP Encryption Key length must be 5 characters');
					return false;
				}
				// other
				if($('TE_WepKey' + i).value != '' && $('TE_WepKey' + i).value.length != 5){
					DealWith.Wrong('TE_WepKey' + i,'WEP Encryption Key length must be 5 characters');
					return false;				
				}
			}
		} else { // HEX 10 Char
			for(var i = 1; i < 5; i++){
				if(i == _wepKeyDf && temp_node.match(_HEX) == null){
					DealWith.Wrong('TE_WepKey' + _wepKeyDf,'WEP Encryption Key length must be 10 hex digits');
					return false;
				}
				// other
				if($('TE_WepKey' + i).value != '' && $('TE_WepKey' + i).value.match(_HEX) == null){
					DealWith.Wrong('TE_WepKey' + i,'WEP Encryption Key length must be 10 hex digits');
					return false;				
				}
			}
		}
	} else {
		if(_wepKeyFt == '0'){ //ACSII 10 char
			for(var i = 1; i < 5; i++){
				if(i == _wepKeyDf && temp_node.length != 13){
					DealWith.Wrong('TE_WepKey' + _wepKeyDf,'WEP Encryption Key length must be 13 characters');
					return false;
				}
				// other
				if($('TE_WepKey' + i).value != '' && $('TE_WepKey' + i).value.length != 13){
					DealWith.Wrong('TE_WepKey' + i,'WEP Encryption Key length must be 13 characters');
					return false;				
				}
			}
		} else { // HEX 26 Char
			for(var i = 1; i < 5; i++){
				if(i == _wepKeyDf && temp_node.match(/^[0-9a-fA-F]{26}$/) == null){
					DealWith.Wrong('TE_WepKey' + _wepKeyDf,'WEP Encryption Key length must be 26 hex digits');
					return false;
				}
				// other
				if($('TE_WepKey' + i).value != '' && $('TE_WepKey' + i).value.match(/^[0-9a-fA-F]{26}$/) == null){
					DealWith.Wrong('TE_WepKey' + i,'WEP Encryption Key length must be 26 hex digits');
					return false;				
				}
			}
		}
	}
	
	return true;
}

function checkShareKeyLength(_value){
	if(_value.length < 8 || _value.length > 64){
		alert("The range of Pre-Shared Key'length is 8 ~ 64.");
	}
}
//由于kRadius加密模式需对密钥长度进行判断，故添加如下function
function checkRadiusSharedSecretLength(_value){
	if(_value.length < 8 || _value.length > 64){
		alert("The range of RADIUS server Shared Secret length is 8 ~ 64.");
	}
}

function uiSubmit(){
	var _nodes = $('SEL_AuthType',
				   'SEL_WepIndex','SEL_WepKey','TE_WepKey1','TE_WepKey2','TE_WepKey3','TE_WepKey4','SEL_auth',
				   'SEL_WpaMode','TE_GroupKey','TE_PreShareKey',
				   'TE_RadiusIPAddr','TE_RadiusPort','TE_RadiusSharedSec');
	//check
	if(!checkIllegal()){
		return false;
	}
	
	$H({
		'var:menu'      : G_Menu,
		'var:page'      : G_Page,
		'var:errorpage' : G_Page,
		//'var:errorpage' : '24G_security',
		'getpage'       : 'html/index.html',
		'errorpage'     : 'html/index.html',
		'var:arrayid'   : G_SSIDIdx,
		'obj-action'    : 'set'
	},true);
	
	var _path = G_Wireless[G_SSIDIdx][0];

	switch(_nodes[0].value){
		case 'None' : {
			$F(_path + '.BeaconType'             , 'None');
			$F(_path + '.BasicEncryptionModes'   , 'None');
			$F(_path + '.BasicAuthenticationMode', 'None');
			break;
		}
		case 'Basic' : {
			$F(_path + '.BeaconType'             , 'Basic');
			$F(_path + '.BasicEncryptionModes'   , 'WEPEncryption');
			$F(_path + '.BasicAuthenticationMode', $('SEL_auth').value);
			$F(_path + '.WEPEncryptionLevel'     , $('SEL_WepIndex').value);
			$F(_path + '.WEPKeyIndex'            , $('SEL_WepKey').value);
			$F(_path + '.WEPKey.1.WEPKey'        , $('TE_WepKey1').value);//GetWepKey($('INPUT_WEPKey1').value));
			$F(_path + '.WEPKey.2.WEPKey'        , $('TE_WepKey2').value);//GetWepKey($('INPUT_WEPKey2').value));
			$F(_path + '.WEPKey.3.WEPKey'        , $('TE_WepKey3').value);//GetWepKey($('INPUT_WEPKey3').value));
			$F(_path + '.WEPKey.4.WEPKey'        , $('TE_WepKey4').value);//GetWepKey($('INPUT_WEPKey4').value));
			break;
		}
		case 'WPAand11i' : {
			$F(_path + '.BeaconType', 					'WPAand11i');
			$F(_path + '.WPAEncryptionModes', 			$('SEL_EncryptionMode').value); //yll test
			$F(_path + '.WPAAuthenticationMode', 		$('SEL_WpaMode').value);
			$F(_path + '.IEEE11iEncryptionModes', 		$('SEL_EncryptionMode').value);
			$F(_path + '.IEEE11iAuthenticationMode', 	$('SEL_WpaMode').value);
			$F(_path + '.X_TWSZ-COM_WPAGroupRekey', 	$('TE_GroupKey').value);
			if($('SEL_WpaMode').value == 'PSKAuthentication'){
				//Pre-Shared Key
				if($('TE_PreShareKey').value.length < 64){
					$F(_path + '.PreSharedKey.1.KeyPassphrase', $('TE_PreShareKey').value);
					$F(_path + '.X_TWSZ-COM_PSKExpression', 'KeyPassphrase');
				} else {
					$F(_path + '.PreSharedKey.1.PreSharedKey', $('TE_PreShareKey').value);
					$F(_path + '.X_TWSZ-COM_PSKExpression', 'PreSharedKey');
				}
			} else {
					$F(_path + '.X_TWSZ-COM_RadiusServer.1.X_TWSZ-COM_IPAddress' , $('TE_RadiusIpAddr').value);
					$F(_path + '.X_TWSZ-COM_RadiusServer.1.X_TWSZ-COM_Port'      , $('TE_RadiusPort').value);
					$F(_path + '.X_TWSZ-COM_RadiusServer.1.X_TWSZ-COM_ShareKey'  , $('TE_RadiusSharedSec').value);				
			}
			break;
		}
		case '11i' : {
			$F(_path + '.BeaconType', 					'11i');
			$F(_path + '.IEEE11iEncryptionModes', 		$('SEL_EncryptionMode').value);  //yll test
			
			$F(_path + '.IEEE11iAuthenticationMode', 	$('SEL_WpaMode').value);
			$F(_path + '.IEEE11iEncryptionModes', 		$('SEL_EncryptionMode').value);  //yll add
			$F(_path + '.X_TWSZ-COM_WPAGroupRekey', 	$('TE_GroupKey').value);
			if($('SEL_WpaMode').value == 'PSKAuthentication'){
				//Pre-Shared Key
				if($('TE_PreShareKey').value.length < 64){
					$F(_path + '.PreSharedKey.1.KeyPassphrase', $('TE_PreShareKey').value);
					$F(_path + '.X_TWSZ-COM_PSKExpression', 'KeyPassphrase');
				} else {
					$F(_path + '.PreSharedKey.1.PreSharedKey', $('TE_PreShareKey').value);
				    $F(_path + '.X_TWSZ-COM_PSKExpression', 'PreSharedKey');
				}
			} else {
					$F(_path + '.X_TWSZ-COM_RadiusServer.1.X_TWSZ-COM_IPAddress' , $('TE_RadiusIpAddr').value);
					$F(_path + '.X_TWSZ-COM_RadiusServer.1.X_TWSZ-COM_Port'      , $('TE_RadiusPort').value);
					$F(_path + '.X_TWSZ-COM_RadiusServer.1.X_TWSZ-COM_ShareKey'  , $('TE_RadiusSharedSec').value);				

			}
			break;
		}
		case 'WPA' : {
			$F(_path + '.BeaconType', 					'WPA');
			$F(_path + '.WPAEncryptionModes', 			$('SEL_EncryptionMode').value); //yll test
			
			$F(_path + '.WPAAuthenticationMode', 		$('SEL_WpaMode').value);
			$F(_path + '.IEEE11iEncryptionModes', 		$('SEL_EncryptionMode').value); //yll add
			$F(_path + '.X_TWSZ-COM_WPAGroupRekey', 	$('TE_GroupKey').value);
			if($('SEL_WpaMode').value == 'PSKAuthentication'){
				//Pre-Shared Key
				if($('TE_PreShareKey').value.length < 64){
					$F(_path + '.PreSharedKey.1.KeyPassphrase', $('TE_PreShareKey').value);
					$F(_path + '.X_TWSZ-COM_PSKExpression', 'KeyPassphrase');
				} else {
					$F(_path + '.PreSharedKey.1.PreSharedKey', $('TE_PreShareKey').value);
					$F(_path + '.X_TWSZ-COM_PSKExpression', 'PreSharedKey');
				}
			} else {
					$F(_path + '.X_TWSZ-COM_RadiusServer.1.X_TWSZ-COM_IPAddress' , $('TE_RadiusIpAddr').value);
					$F(_path + '.X_TWSZ-COM_RadiusServer.1.X_TWSZ-COM_Port'      , $('TE_RadiusPort').value);
					$F(_path + '.X_TWSZ-COM_RadiusServer.1.X_TWSZ-COM_ShareKey'  , $('TE_RadiusSharedSec').value);				
			}
			//WPS
//			$F(_path + '.WPS.Enable',Form.Checkbox('INPUT_WpsEnable'));
			/*
			if ($("wps").style.display == "block")
			{
				if ($("INPUT_WpsEnable").checked == true)
					$F(_path + '.WPS.PeerPassword'   ,$('INPUT_DevicePin').value);
			}
			*/
			break;
		}
	}
	$('uiPostForm').submit();
}




function dealWithError(){
	if (G_Error != 1){
		return false;
	}
	
	var arrayHint = [];

	dealErrorMsg(arrayHint, G_Error_Msg);
/*
	dealErrorMsg({
		'PreSharedKey'  : 'TE_PreShareKey',
		'KeyPassphrase' : 'TE_PreShareKey'
	}, G_Error_Msg);
	*/
	
}

addListeners(uiOnload, dealWithError);
