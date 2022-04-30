//WPS
//document.write('<>')
document.write('<script type="text/javascript" src="/html/js/ajax.js"><\/script>');
var G_WPS = [];
var t = 0;
<?objget :InternetGatewayDevice.LANDevice.1.WLANConfiguration. "WPS.Enable WPS.DevicePassword WPS.X_TWSZ-COM_PeerPassword WPS.X_TWSZ-COM_StartWpsSession WPS.X_TWSZ-COM_GeneratePinEnable WPS.X_TWSZ-COM_WpsSessionStatus WPS.X_TWSZ-COM_GeneratePinStatus WPS.IsMatchCondition Enable SSID BeaconType BasicEncryptionModes WPAEncryptionModes WPAAuthenticationMode IEEE11iEncryptionModes IEEE11iAuthenticationMode X_TWSZ-COM_RadioInterface"
`	G_WPS[t] = [':InternetGatewayDevice.LANDevice.1.WLANConfiguration.$00',//path
				'$01',//Enable
				'$02',//DevicePassword
				'$03',//PeerPassword
				'$04',//StartWpsSession
				'$05',//GeneratePin
				'$06',//WpsSessionStatus
				'$07',//GeneratePinStatus
				'$08',//IsMatchCondition
				
				'$09',//Wireless Enable
				'$0a',//SSID
				'$0b',//BeaconType
				'$0c',//BasicEncryptionModes
				'$0d',//WPAEncryptionModes
				'$0e',//WPAAuthenticationMode
				'$0f',//IEEE11iEncryptionModes
				'$0g', //IEEE11iAuthenticationMode
				'$0h'
				];
	t++;
`?>
var G_WpsSession = [], k = 0;
<?objget :InternetGatewayDevice.LANDevice.1.WLANConfiguration. "WPS.X_TWSZ-COM_StartWpsSession"
`	G_WpsSession[k] = [':InternetGatewayDevice.LANDevice.1.WLANConfiguration.$00',
					   '$01'
					   ];
	k++;
`?>

var SUB_Idx = '<?echo $var:arrayid?>';


var SSID_index = {
				  'SSID_0'	:0,
				  'SSID_1'	:1,
				  'SSID_2'	:2,
				  'SSID_3'	:3
					};
var WPS_Status  = {
					'0'	:	SEcode[4000],//'Inprogress',
					'1'	:	SEcode[4001],//'Overlap',
					'2'	:	SEcode[4002],//'Timeout',
					'3'	:	SEcode[4003]//'Success'					
					};

function uiOnload(){
	//生成SSID下拉列表
	var F_SSID;
	if(SUB_Idx=='-'){
		F_SSID = 'SSID_0';		
		}else{			
		F_SSID = 'SSID_'+SUB_Idx;
			}
	createSsidOpt();
	$('SEL_VapList').value = F_SSID;
	OnVapListChange(F_SSID);
}

function createSsidOpt(){
	var _text = [], _value = [];
	
	for(var i = 0, _len = G_WPS.length; i < _len; i++){
		if( G_WPS[i][17] == '1' ){
			_text.push(G_WPS[i][10]);
			_value.push('SSID_' + i);			
		}

	}
	
	$S('SEL_VapList', _text, _value);
}
var SSID_Value;
var Idx_SSID ;
function OnVapListChange(SSIDValue){
	Idx_SSID = SSID_index[SSIDValue];
	//var WLANMode = top.data_language['dynamic'].WLANMode;	
	var WLANMode = SEcode[4004];	
	var _mode = G_WPS[Idx_SSID][11] == 'Basic' && G_WPS[Idx_SSID][12] == 'None' ? 'None' : G_WPS[Idx_SSID][11];
	var _beacon_type, _bool;
	$('SPAN_WpsSessionSt').innerHTML = ' ';
	$('WpsConnection').innerHTML = ' ';
	switch(_mode){
		case 'None' :
			_bool = 'none';
			break;
		case 'Basic' :
			_bool = 'none';
			break;
		case 'WPA' :
			_bool = 'block';
			supplyValue('SPAN_BeaconType', G_WPS[Idx_SSID][14] == 'PSKAuthentication' ? 'WPA-PSK' : 'WPA-Enterprise');
			break;
		case '11i' :
			_bool = 'block';
			supplyValue('SPAN_BeaconType', G_WPS[Idx_SSID][16] == 'PSKAuthentication' ? 'WPA2-PSK' : 'WPA2-Enterprise');
			break;
		case 'WPAand11i' :
			_bool = 'block';
			supplyValue('SPAN_BeaconType', G_WPS[Idx_SSID][16] == 'PSKAuthentication' ? 'WPA2 Mixed-PSK' : 'WPA2 Mixed-Enterprise');
			break;		
	}
	Form.Radio('RAD_EnWps', G_WPS[Idx_SSID][1]);
	//Form.Checkbox('INPUT_WpsEnable',G_WPS[Idx_SSID][1]);
	//WPSDisable();//yll test
	$('Wpa_Wpa2').style.display = _bool;
	if(_bool=='none'){
		disCtrl('wps_enchk',false);
		disCtrl('wps_enable',false);
		$('WpsConnection').innerHTML = WLANMode;
	}else{
		disCtrl('wps_enchk',true);
		disCtrl('wps_enable',true);	
		$('WpsConnection').innerHTML = '';
		WPSDisable();
		}
	
		
}
/*function WPSDisable()
{
	disCtrl('wps_enable', Form.Radio('RAD_EnWps') == '0'? 0 : 1);
}*/

function WPSDisable()
{
	//var b_value = Form.Checkbox('INPUT_WpsEnable');
	var b_value = Form.Radio('RAD_EnWps');
	if(b_value!='1')
	{
		disCtrl('wps_enable',false);
	}else{
		disCtrl('wps_enable',true);
		}
}
function ConnectStatus(_bool)
{
	var Connecting = SEcode[4009];
	var dynamicSpar = [
					   '......'
					   ];
	if(_bool == 0){
		$('WpsConnection').innerHTML = Connecting + ' [ ' + dynamicSpar[0] + ' ]';
	}else{
		$('WpsConnection').innerHTML ='';
		}
}

function ChooseWpaMode()
{
	//var b_value = Form.Checkbox('INPUT_WpsEnable');
	var b_value = Form.Radio('RAD_pin');
	if(b_value!='1')
	{
		$('PinNum').style.display = 'block';
	}else{
		$('PinNum').style.display = 'none';
	}
}
function enabledPbc(){
	disCtrl('wps_enchk', false);//yll test
	disCtrl('SEL_SSID', false);//yll test
	disCtrl('wps_enable', false);
	disCtrl('BTN_Apply', false);
	var _path = G_WPS[Idx_SSID][0];
	$H({
	   'obj-action'       : 'set',
	   'getpage'          : 'html/page/24G_wps_setup.ajax.js',
	   'var:page'         : 'G_Page'
	},true);
	$F(_path + '.WPS.X_TWSZ-COM_SetupMethod','PBC');
	$F(_path + '.WPS.X_TWSZ-COM_StartWpsSession','0');
	
	var _url = "/cgi-bin/webproc";//yll del
	ajax = Ajax.getInstance(_url, "", 0, getData,getErr);
	ajax.post($('uiPostForm'));
}

/*
function enabledPin(){
	var PATTERN_hint     = /^[0-9]$/;
	var PIN_Value = $('TE_PinNum').value;
	if(PIN_Value == '')
	{
		DealWith.Wrong('TE_PinNum',SEcode[4005]);
		return false;
	}else if(PIN_Value.match(/^[0-9]{8}$/) == null)
	{
		DealWith.Wrong('TE_PinNum',SEcode[4006]);
		return false;
	}else if(!checkPIN(PIN_Value)){
		DealWith.Wrong('TE_PinNum',SEcode[4007]);
		return false;			
	}
	
	DealWith.Right('TE_PinNum');
	
	var _path = G_WPS[Idx_SSID][0];
	$H({
	   'obj-action'       : 'set',
	   'getpage'          : 'html/page/24G_wps_setup.ajax.js',
	   'var:page'         : 'wps'
	},true);
	$F(_path + '.WPS.X_TWSZ-COM_SetupMethod','StationPIN');
	$F(_path + '.WPS.X_TWSZ-COM_StartWpsSession','0');
	$F(_path + '.WPS.X_TWSZ-COM_PeerPassword',$('TE_PinNum').value);
	var _url = "/cgi-bin/webproc";
	ajax = Ajax.getInstance(_url, "", 0, getDataPin,getErr);
	ajax.post(document.forms[0]);
}
*/
function getData(_text)
{
	try{
		eval(_text);
	}catch(e){
		alert('Ajax Response Error:'+e.message);
		return;
	}
	var WPS = G_WPS_StartWPSSession;
	if(WPS[Idx_SSID] == '0')
	{
		$('SPAN_WpsSessionSt').innerHTML = WPS_Status[WPS[Idx_SSID]];	
		ConnectStatus(0);
		
		setTimeout('GetWpsStatus(getData)', 1000);
		return false;
	}else{
		disCtrl('wps_enchk', true);
		disCtrl('SEL_SSID', true);
		disCtrl('wps_enable', true);
		disCtrl('BTN_Apply', true);
		$('SPAN_WpsSessionSt').innerHTML = WPS_Status[WPS[Idx_SSID]];	
		ConnectStatus(1);
		return true;
		}
}

function GetWpsStatus(_function)
{
	var _url = "/cgi-bin/webproc?getpage=html/page/24G_wps_setup.ajax.js&var:page=wps";
	ajax = Ajax.getInstance(_url, "", 0, _function,getErr);
	ajax.get();
}
function getDataPin(_text)
{
	try{
		eval(_text);
	}catch(e){
		alert('Ajax Response Error:'+e.message);
		return;
	}
	//var PINError = top.data_language['dynamic'].PINError;
	var PINError = SEcode[4008];
	if(G_Error!='0'){
		alert('G_Error : Please enter the correct value!');
	}else{
		disCtrl('wps_enchk', false);
		disCtrl('wps_enable', false);
		disCtrl('SEL_SSID', false);
		disCtrl('BTN_Apply', false);	
		
		setTimeout('GetWpsStatus(getData)', 1000);
	}
}

function uiSubmit(){
	var SSID_Value = $('SEL_VapList').value;
	var Idx  = SSID_index[SSID_Value];
	$H({ 
		'var:menu'      : G_Menu,
		'var:page'      : G_Page,
		//'var:subpage'   : G_SubPage,
		'var:errorpage' : G_Page,
		'getpage'       : 'html/index.html',
		'errorpage'     : 'html/index.html',
		'var:arrayid'   : Idx,
		'obj-action'    : 'set'
	},true);

	$F(G_WPS[Idx][0] + '.WPS.Enable',Form.Radio('RAD_EnWps'));

	$('uiPostForm').submit();
}
function getErr(_json){
	try{
		var Err_data  = eval('(' + _json + ')');
//		window.parent.uiTransparentLayer('none');
		alert(SEcode[9885]);
	}
	catch (ex){
		return false;
	}
}
function checkPIN( pin ) 
{
	var accum = 0;
    var pinNum = Number(pin);
    
    if(pinNum == NaN)
    	return false;
    
	accum += 3 * (Math.floor(pinNum / 10000000) % 10); 
	accum += 1 * (Math.floor(pinNum / 1000000) % 10); 
	accum += 3 * (Math.floor(pinNum / 100000) % 10); 
	accum += 1 * (Math.floor(pinNum / 10000) % 10); 
	accum += 3 * (Math.floor(pinNum / 1000) % 10); 
	accum += 1 * (Math.floor(pinNum / 100) % 10); 
	accum += 3 * (Math.floor(pinNum / 10) % 10); 
	accum += 1 * (Math.floor(pinNum / 1) % 10); 
	
    return (0 == (accum % 10));
}

function WPSRefresh()
{
	var SSID_Value = $('SEL_VapList').value;
	var Idx  = SSID_index[SSID_Value];
	var _text = '&var:arrayid=' +Idx;
	var url_text = uiGetPageUrl(_text);
    document.location.href = url_text;
}
function dealWithError(){
	if (G_Error != 1){
		return false;
	}

	dealErrorMsg({}, G_Error_Msg);
	
		}
		
addListeners(uiOnload, dealWithError);
