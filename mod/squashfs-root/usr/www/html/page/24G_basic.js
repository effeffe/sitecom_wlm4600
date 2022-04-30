//Wireless basic
var G_Wireless = [];
var m = 0;

<?objget :InternetGatewayDevice.LANDevice.1.WLANConfiguration. "Enable SSID SSIDAdvertisementEnabled WMMEnable X_TWSZ-COM_MAXSTATION X_TWSZ-COM_GuestAccess ChannelsInUse X_TWSZ-COM_RadioInterface"
`	G_Wireless[m] = ['InternetGatewayDevice.LANDevice.1.WLANConfiguration.$00.', //path
					 '$01',//Enable
					 '$02', //SSID
					 '$03',  //SSIDAdvertisementEnabled
					// '$04', //X_TWSZ-COM_APIsolate
					 '$04',//WMMEnable
					 '$05',//X_TWSZ-COM_MAXSTATION
					 '$06',//X_TWSZ-COM_GuestAccess
					 '$07', //ChannelsInUse
					 '$08'
					 ];
	m++;
`?>
<?mget :InternetGatewayDevice.X_TWSZ-COM_Radio.1. "Enable RegulatoryDomain Channel AutoChannelEnable Standard  OperatingChannelBandwidth  X_TWSZ-COM_APIsolate"
`	var G_Enable                      = "$01";//Enable
    var G_RegulatoryDomain            = "$02";//RegulatoryDomain
	var G_Channel                     = "$03";//Channel
	var G_AutoChannelEnable           = "$04";//AutoChannelEnable
	var G_Standard                    = "$05";//Standard
	var G_OperatingChannelBandwidth   = "$06";//OperatingChannelBandwidth
	var G_APIsolate                   = "$07";//X_TWSZ-COM_APIsolate		
	//var G_MaxBitRate                  = "$07";//MaxBitRate  //yll del ,20120809
	//var G_MIMO                        = "$08";//X_TWSZ-COM_MIMO
	//var G_GuardInterval               = "$09";//GuardInterval
`?>

//var _index = -1;
//var _ssidIndex = '<?echo $var:ssid_idx?>';
function uiOnload(){
	//alert("opq");
	$('wireless_enable').style.display="block";
   // var Idx = 0;
	createCurrentCtryOpt();
	$('SEL_country').value = GetCountryName(G_RegulatoryDomain);
	setJSONValue({ 
		'RAD_enable'       : G_Enable,
		//'TE_ssid'          : G_Wireless[Idx][1],
		//'RAD_visible'      : G_Wireless[Idx][2],
		'SEL_ApIso'        : G_APIsolate,
		'SEL_mode'         : G_Standard,
		'SEL_BandWidth'    : G_OperatingChannelBandwidth || '20',
		'TE_CurChannel'    : G_Wireless[0][7]
		//'SELECT_Rate'         : G_MaxBitRate
	});
    
	//disCtrl('wlan_enable', $('RAD_enable').checked ? 1 : 0);
	//for(idx=0;idx<G_Wireless.length;idx++)
	//{
	//$('SEL_SsidIndex').value = Idx+1;
	//}
    OnBandWidthEnable();
	createSsidOpt();
	onchangeSsidName();
	disSingleSsid();
	disWireless();
	//$('wlan_enableNMode').style.display = 'none';
 
}

function disCurChannel()
{
	$('TE_CurChannel').disabled = true;
}

/*function disWireless()
{
	
	 disCtrl('wlan_enable', Form.Radio('RAD_enable') == '0'? 0 : 1);
	 disSingleSsid();
	 disCurChannel();
	 
}*/
//当Wireless Basic Settings页面Access Point选择Disable后，屏蔽其他的Wireless Settings页面 --majiangying 2012/10/19
function disWireless()
{
	 if(Form.Radio('RAD_enable') == '1')
	 {
	     disCtrl('wlan_enable',1);
	     disSingleSsid();
	     document.getElementById("24G_basic").style.display="";
       document.getElementById("24G_security").style.display="";
       document.getElementById("24G_acl").style.display="";
       document.getElementById("24G_advanced").style.display="";
       document.getElementById("24G_wds").style.display="";
       document.getElementById("24G_wps").style.display="";
	 }
	 else
	 {
		 disCtrl('wlan_enable',0);
      document.getElementById("24G_basic").style.display="";
      document.getElementById("24G_security").style.display="none";
      document.getElementById("24G_acl").style.display="none";
      document.getElementById("24G_advanced").style.display="none";
      document.getElementById("24G_wds").style.display="none";
      document.getElementById("24G_wps").style.display="none";
	 }
	 
	 disCurChannel();
	 
}

function disSingleSsid()
{
    disCtrl('SetSsidOpt', Form.Radio('RAD_EnWL') == '0'? 0 : 1);	
}
//function ConfirmChannel()
//{
	
//   $('TE_CurChannel').value =  G_Channel;   	
//}//

// 
/*function ctrlBool(){
	
	var _bool = G_Standard.indexOf('n') > -1;
	
	if(_bool){
		$('SELECT_WMMAdv').disabled   = _bool;
		$('SELECT_WMMAdv_1').disabled = _bool;
		$('SELECT_WMMAdv_2').disabled = _bool;
		$('SELECT_WMMAdv_3').disabled = _bool;
	//	$('SELECT_WMMAdv_4').disabled = _bool;
	}
}   */

function createSsidOpt()
{
	var _text = [], _value = [];
	
	for(var i = 0, _len = G_Wireless.length; i < _len; i++){
        if (G_Wireless[i][8] == '1' ){
            _text.push(i+1);
            _value.push(G_Wireless[i][0]);
        }

	}
	$S('SEL_SsidIndex', _text, _value);
}

function  GetSsidIndex(){
	var ssid_path = $('SEL_SsidIndex').value;
  
	for(var i = 0; i < G_Wireless.length; i++){
		if (ssid_path == G_Wireless[i][0]){
			return i;
        }
    }
	return -1;
}

function onchangeSsidName()
{
	//var _text = [], _value = [];
	var index = GetSsidIndex();
	if(index != -1)
	{
		if(index == 0)
		{
			$('FirstSwitch').style.display = 'none';
		}
		else
		{
			$('FirstSwitch').style.display = 'block';
		}
		setJSONValue({ 
		'RAD_EnWL'         : G_Wireless[index][1],
		'TE_ssid'          : G_Wireless[index][2],
		'RAD_visible'      : G_Wireless[index][3],
		//'SEL_UserIso'      : G_Wireless[index][4],
		'SEL_DisWMMAdv'    : G_Wireless[index][4],
		'TE_MaxUser'       : G_Wireless[index][5],
		'SEL_UserIso'      : G_Wireless[index][6]
		//'SELECT_Rate'         : G_MaxBitRate
        });
		disSingleSsid();
		
	}
	
		//if(index != -1)
	//{
		//Form.Radio('RAD_EnWL', G_Wireless[index][1]);
		//$('TE_ssid').value = G_Wireless[index][2];
		//Form.Radio('RAD_visible',G_Wireless[index][3]);
		
		//$S('SEL_UserIso',G_Wireless[index][4]);
		//$S('SEL_DisWMMAdv',G_Wireless[index][5]) ;	
		//$('SEL_UserIso').value = G_Wireless[index][4]) ;
	
	//}//$('SEL_DisWMMAdv').value = G_Wireless[index][5]) ;	
       	
}
//var _index = -1;
//var _ssidIndex = '<?echo $var:ssid_idx?>';
/*function  GetSsidIndex(){
	var ssid_index = $('SEL_SsidIndex').value;
  
	for(var i = 0; i < G_Wlan.length; i++){
		if (ssid_path == G_Wlan[i][0]){
			return i;
        }
    }
	return -1;
}  */

function OnBandWidthEnable(value_opt){
	//n mode, or b/g/n
	var _mode = $("SEL_mode").value;
	if (Form.Radio('RAD_enable') && _mode.indexOf('n') > -1)
	{
		$('wlan_enableNMode').style.display = 'block';
		$('DisWMMAdv').style.display = 'none';
		//$('SEL_BandWidth').disabled = false;//yll del ,20120809
	}
	else
	{	
	   // supplyValue('SELECT_BandWidth','20');
	    $('wlan_enableNMode').style.display = 'none';
		$('DisWMMAdv').style.display = 'block';
		//supplyValue('SEL_BandWidth','20');
		//$('SEL_BandWidth').disabled = true;
	}
	
	ctrlChannelOpt(value_opt);
	$('SEL_channel').value = G_Channel;
	
	//createMaxRateOpt($('SEL_BandWidth').value, $('SEL_mode').value);
	//$('SELECT_Rate').value =  G_MaxBitRate;//yll del rate func,20120809
}


function ctrlChannelOpt(value_opt){
	//alert("opq");
	var country = $('SEL_country').value;
	var _s = 0, _e = 13;
	var _bw = $('SEL_BandWidth').value; 
	var _mode = $("SEL_mode").value;
	
	if('Colombia,Canada,Mexico,Norway,Panama,Puerto Rico,Taiwan,USA'.indexOf(country) > -1)
	{
		_s = 0, _e = 11;      // G_BAND_REGION_0                  
	}
	else if('Israel' == country)
	{
		_s = 2, _e = 9;
	} 
	else 
	{
		_s = 0, _e = 13;      // G_BAND_REGION_1  
	} 	
	
	if(!value_opt && _mode.indexOf('n') > -1 || value_opt && _mode.indexOf('n') > -1){
		
		if(_bw == '40PLUS'){ //40PLUS
			_e -= 4;
		}
		else if(_bw == '40MINUS'){ //40MINUS
			_s += 4;
	} 
	}
	
	createChannelOpt(_s, _e);
}

function createChannelOpt(_start, _end){
	var _text = [
				 'CH01',
				 'CH02',
				 'CH03',
				 'CH04',
				 'CH05',
				 'CH06',
				 'CH07',
				 'CH08',
				 'CH09',
				 'CH10',
				 'CH11',
				 'CH12',
				 'CH13',
				 'CH14'
				 ].slice(_start,_end);
	var _value = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14'].slice(_start,_end);
	
	$S('SEL_channel', ['Auto Scan(recommended)'].concat(_text), ['0'].concat(_value));	
	//$('TE_CurChannel').value =  $S('SEL_channel').value;
}

var Country_Code = {
	'Albania' : "AL",
	'Algeria' : "DZ",
	'Argentina' : "AR",
	'Armenia' : "AM",
	'Australia' : "AU",
	'Austria' : "AT",
	'Azerbaijan' : "AZ",
	'Bahrain' : "BH",
	'Belarus' : "BY",
	'Belgium' : "BE",
	'Belize' : "BZ",
	'Bolivia' : "BO",
	'Bosnia Herzegowina' : "BA",
	'Brazil' : 'BR' ,
	'Brunei Darussalam' : "BN",
	'Bulgaria' : "BG",
	'Canada' : "CA",
	'Chile' : "CL",
	'China' : "CN",
	'Colombia' : "CO",
	'Costa Rica' : "CR",
	'Croatia' : "HR",
	'Cyprus' : "CY",
	'Czech Republic' : "CZ",
	'Denmark' : "DK",
	'Dominican Republic' : "DO",
	'Ecuador' : "EC",
	'Egypt' : "EG",
	'El Salvador' : "SV",
	'Estonia' : "EE",
	'Finland' : "FI",
	'France' : "FR",
	'Jordan' : "JO",
	'Georgia' : "GE",
	'Germany' : "DE",
	'Greece' : "GR",
	'Guatemala' : "GT",
	'Honduras' : "HN",
	'Hong Kong' : "HK",
	'Hungary' : "HU",
	'Iceland' : "IS",
	'India' : "IN",
	'Indonesia' : "ID",
	'Iran' : "IR",
	'Ireland' : "IE",
	'Israel' : "IL",
	'Italy' : "IT",
	'Japan' : "JP",
	'Japan1' : "J1",
	'Japan2' : "J2",
	'Kazakhstan' : "KZ",
	'Kenya' : "KE",
	'North Korea' : "KP",
	'South Korea' : "KR",
	'South Korea Roc2' : "K2",
	'Kuwait' : "KW",
	'Latvia' : "LV",
	'Lebanon' : "LB",
	'Liechtenstein' : "LI",
	'Lithuania' : "LT",
	'Luxembourg' : "LU",
	'Macau' : "MO",
	'Macedonia' : "MK",
	'Yugoslavia' : "YU",
	'Malaysia' : "MY",
	'Mexico' : "MX",
	'Monaco' : "MC",
	'Morocco' : "MA",
	'Netherlands' : "NL",
	'New Zealand' : "NZ",
	'Nigeria' : 'NE',
	'Norway' : "NO",
	'Oman' : "OM",
	'Pakistan' : "PK",
	'Panama' : "PA",
	'Paraguay' : "PY",
	'Peru' : "PE",
	'Philippines' : "PH",
	'Poland' : "PL",
	'Portugal' : "PT",
	'Puerto Rico' : "PR",
	'Qatar' : "QA",
	'Romania' : "RO",
	'Russia' : "RU",
	'Saudi Arabia' : "SA",
	'Singapore' : "SG",
	'Slovakia' : "SK",
	'Slovenia' : "SI",
	'South Africa' : "ZA",
	'Spain' : "ES",
	'Sri Lanka' : "LK",
	'Sweden' : "SE",
	'Switzerland' : "CH",
	'Syria' : "SY",
	'Taiwan' : "TW",
	'Thailand' : "TH",
	'Trinidad Y TOBAGO' : "TT",
	'Tunisia' : "TN",
	'Turkey' : "TR",
	'United Arab Emirates' : "AE",
	'UAE' : "AE",
	'Ukraine' : "UA",
	'United Kingdom' : "GB",
	'USA' : "US",
	'United States FCC49' : "US",
	'Uruguay' : "UY",
	'Uzbekistan' : "UZ",
	'Venezuela' : "VE",
	'Viet Nam' : "VN",
	'Yemen' : "YE",
	'Zimbabwe' : "ZW"
}

function GetCountryCode(name)
{
	var code = Country_Code[name];
	//alert('Code: ' + code);
	return code;
}

function GetCountryName(code)
{
	for(countryName in Country_Code)
	{
		if(Country_Code[countryName] == code)
		{
			return countryName;
		}
	}
	
	return "";
}

function createCurrentCtryOpt(){
	var _text = ['Argentina', 'Australia', 'Austria', 'Bahrain','Belarus','Belgium', 'Bolivia', 'Brazil','Bulgaria', 'Canada',
	             'Chile', 'China', 'Colombia','Costa Rica', 'Croatia','Cyprus', 'Czech Republic','Denmark','Egypt', 'Estonia', 
	             'Finland', 'France',  'Germany', 'Greece', 'Hong Kong', 'Hungary', 'Iceland','India', 'Indonesia','Ireland',
	             'Israel', 'Italy','Jordan', 'Kuwait', 'Latvia','Lebanon', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macedonia',
	             'Malaysia', 'Mexico', 'Morocco', 'Netherlands','New Zealand', 'Norway', 'Panama', 'Peru', 'Philippines', 'Poland',
	             'Portugal', 'Puerto Rico','Romania', 'Russia', 'Saudi Arabia', 'Singapore', 'Slovakia', 'Slovenia', 'South Africa','South Korea', 
	             'Spain','Sweden', 'Switzerland','Taiwan','Thailand', 'Turkey','USA','United Arab Emirates', 'United Kingdom', 'Uruguay', 
	             'Venezuela'];
	$S('SEL_country', _text);
}
function uiSubmit(){
	//var ssid_index = $('SEL_SsidIndex').text;
	var _index = GetSsidIndex();
	var node_wl = $('SEL_country','SEL_channel','SEL_mode','SEL_ApIso');
	
   // var node_wl = $('TE_ssid','SEL_country','SEL_channel','SEL_mode');
	$H({
		':InternetGatewayDevice.X_TWSZ-COM_Radio.1.Enable'                                 : Form.Radio('RAD_enable'),
		':InternetGatewayDevice.X_TWSZ-COM_Radio.1.RegulatoryDomain'                       : GetCountryCode(node_wl[0].value),
		':InternetGatewayDevice.X_TWSZ-COM_Radio.1.Channel'                                : node_wl[1].value,
		':InternetGatewayDevice.X_TWSZ-COM_Radio.1.AutoChannelEnable'                      : node_wl[1].value == '0'?1:0,
		':InternetGatewayDevice.X_TWSZ-COM_Radio.1.Standard'                               : node_wl[2].value,
		':InternetGatewayDevice.X_TWSZ-COM_Radio.1.X_TWSZ-COM_APIsolate'                   : node_wl[3].value,
		//':InternetGatewayDevice.X_TWSZ-COM_Radio.1.OperatingChannelBandwidth'              : node_wl[3].value.indexOf('n')>-1 ? node_wl[4].value:undefined, //band width
		//':InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.SSID'                      : node_wl[3].value,
		//':InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.SSIDAdvertisementEnabled'  : Form.Radio('RAD_visible'),
		'var:menu'      : G_Menu,
		'var:page'      : G_Page,
     	//'var:subpage'   : G_SubPage,
		//'var:errorpage' : G_SubPage,
		'var:errorpage' : G_Page,
		'getpage'       : 'html/index.html',
		'errorpage'     : 'html/index.html',
		'var:CacheLastData' : ViewState.Save()
		//'obj-action'    : 'set'
	},true);	
	$F('obj-action', 'set');
	var _mode = $("SEL_mode").value;
	$('TE_CurChannel').value =  $('SEL_channel').value; 
	//if(ssid_index == '3')
	//{
	//$F(':InternetGatewayDevice.LANDevice.1.WLANConfiguration.3.' + 'SSID' , $('TE_ssid').value);
	//$F(':InternetGatewayDevice.LANDevice.1.WLANConfiguration.3.' + 'SSIDAdvertisementEnabled' , Form.Radio('RAD_visible'));
	//}
	 if(_index != -1)
    {
		     if(_index == 0)
			{
				if(Form.Radio('RAD_enable') == '0')
				{
					$F(':' + G_Wireless[_index][0] + 'Enable', 0);
				}
				else
				{
					$F(':' + G_Wireless[_index][0] + 'Enable', 1);
				}
			}
			else
			{
			    $F(':' + G_Wireless[_index][0] + 'Enable', Form.Radio('RAD_EnWL'));
			}
			//if(Form.Radio('RAD_EnWL'))
			//{
			$F(':' + G_Wireless[_index][0] + 'SSID', $('TE_ssid').value);
			$F(':' + G_Wireless[_index][0] + 'SSIDAdvertisementEnabled', Form.Radio('RAD_visible'));
			//$F(':' + G_Wireless[_index][0] + 'X_TWSZ-COM_APIsolate', $('SEL_UserIso').value);
				//if( _mode.indexOf('n') > -1)
				//{
			$F(':' + G_Wireless[_index][0] + 'WMMEnable', $('SEL_DisWMMAdv').value);
			$F(':' + G_Wireless[_index][0] + 'X_TWSZ-COM_MAXSTATION', $('TE_MaxUser').value);
			$F(':' + G_Wireless[_index][0] + 'X_TWSZ-COM_GuestAccess', $('SEL_UserIso').value);
				//}
			//}
    }
	
	if (Form.Radio('RAD_enable')&&_mode.indexOf('n') > -1)
	{
		//if(_mode.indexOf('n') > -1)
	    //{
	        $F(':' + 'InternetGatewayDevice.X_TWSZ-COM_Radio.1.OperatingChannelBandwidth', $('SEL_BandWidth').value);
	 }
  //  if(_index != -1)
   // {
			//$F(':' + G_Wireless[_index][1] + 'Enable', Form.Radio('RAD_EnWL'));
			//if(Form.Radio('RAD_EnWL'))
			//{
			//$F(':' + G_Wireless[_index][2] + 'SSID', $('TE_ssid').value);
			//$F(':' + G_Wireless[_index][3] + 'SSIDAdvertisementEnabled', Form.Radio('RAD_visible'));
			//$F(':' + G_Wireless[_index][4] + 'X_TWSZ-COM_APIsolate', $('SEL_UserIso').value);
				//if( _mode.indexOf('n') > -1)
				//{
				//$F(':' + G_Wireless[_index][5] + 'WMMEnable', $('SEL_DisWMMAdv').value);
				//}
			//}
   // }
	
	//alert(node_wl[3].value);
	
	$('uiPostForm').submit();
	//alert("yll");
}

function dealWithError(){
	if (G_Error != 1){
		return false;
	}
	
	var arrayHint = [];

	dealErrorMsg(arrayHint, G_Error_Msg);
}

addListeners(uiOnload, dealWithError);
