//MAC Filter
var G_Wlan = [];
var n = 0;
<?objget :InternetGatewayDevice.LANDevice.1.WLANConfiguration. "SSID MACAddressControlEnabled X_TWSZ-COM_MACAddressControlAction X_TWSZ-COM_RadioInterface"
`	G_Wlan[n] = ["InternetGatewayDevice.LANDevice.1.WLANConfiguration.$00.", //Path
				 "$01", //SSID
				 "$02", //MACAddressControlEnabled
				 "$03",  //X_TWSZ-COM_MACAddressControlAction
				 "$04"
				 ];
	n++;
`?>

var G_MacFilter = [];
var m = 0;
<?objget :InternetGatewayDevice.LANDevice.1.WLANConfiguration. ""
`	<?objget :InternetGatewayDevice.LANDevice.1.WLANConfiguration.$10.X_TWSZ-COM_MACList. "MACAddress Description"
	`	G_MacFilter[m] = ["InternetGatewayDevice.LANDevice.1.WLANConfiguration.$10.X_TWSZ-COM_MACList.$00.",
						  "$01",
						  "$02"
						  ];
		m++;
	`?>
`?>
var _index = -1;
var _ssidIndex = '<?echo $var:ssid_idx?>';

function uiOnload(){
	//生成SSID下拉框
	createSsidOpt();

	$('SEL_ssid').value = (_ssidIndex == '-') ? G_Wlan[0][0] : G_Wlan[Number(_ssidIndex)][0];
	onSsidChange();
	$('incMacFilter').style.display = 'none';
	onClkWlAcl();

}

function onClkWlAcl(xValue){
	var index = GetSsidIndex();
	//var value_active = Form.Radio('RAD_EnWlAcl');
	if(xValue == undefined){
		xValue = Form.Radio('RAD_EnWlAcl');
	}
	if(xValue == '1'){
		$('SEL_AcsCtrlMode').disabled = false;
		$('SEL_AcsCtrlMode').value = G_Wlan[index][3];
	}else{		
		$('SEL_AcsCtrlMode').disabled = true;
	}
	//alert(index);
}

function createSsidOpt(){
	var _text = [], _value = [];
	
	for(var i = 0, _len = G_Wlan.length; i < _len; i++){
		if ( G_Wlan[i][4] == '1'){
			_text.push(G_Wlan[i][1]);
			_value.push(G_Wlan[i][0]);
        }
	}

	$S('SEL_ssid', _text, _value);
}

function  GetSsidIndex(){
	var ssid_path = $('SEL_ssid').value;
  
	for(var i = 0; i < G_Wlan.length; i++){
		if (ssid_path == G_Wlan[i][0]){
			return i;
        }
    }
	return -1;
}

function onSsidChange(){
	var index = GetSsidIndex();
	var value_active;
	if(index != -1){
		//value_active = G_Wlan[index][2]== '0' ? '0' : G_Wlan[index][3];
		//Form.Radio('RAD_EnWlAcl', G_Wlan[index][2]);
		//xValue = Form.Radio('RAD_DmzEnable');
		//xValue = Form.Radio('RAD_EnWlAcl') == '0' ? '0' : G_Wlan[index][3];
		value_active = Form.Radio('RAD_EnWlAcl', G_Wlan[index][2]);
		$('SEL_AcsCtrlMode').value = (value_active == '0' ? '0' : G_Wlan[index][3]);//yll test,20120808
		//$('SEL_AcsCtrlMode').value = G_Wlan[index][3];
		if(value_active == '1')
		{
			$('SEL_AcsCtrlMode').disabled = false;
		}
		else
		{
			$('SEL_AcsCtrlMode').disabled = true;
		}
		
		//xValue == '0' ? '0' : G_Wlan[index][3];
	    createMacListTb();
	}

}

function createMacListTb(){
	//alert("yll");
	var ssid_path = $('SEL_ssid').value;
	var array_value = [];

	Table.Clear('MacFilterList');
	
	for(var i = 0, _len = G_MacFilter.length; i < _len; i++){
		if(G_MacFilter[i][0].indexOf(ssid_path) > -1){
			array_value[i] = [G_MacFilter[i][1],
							  G_MacFilter[i][2] == "" ? "-": G_MacFilter[i][2],
							  '<img src="/html/skin/pen.gif" style="cursor:pointer;" title="Edit" onclick="uiEdit(' + i + ')"/>',
							  '<img src="/html/skin/cross.gif" style="cursor:pointer;" title="Delete" onclick="uiDelete(' + i + ')"/>'				  
							  ];
				}
			}
	$T('MacFilterList', array_value);
				}

function uiAdd(){
	$('incMacFilter').style.display = 'block';
	$('gobalsubmit').style.display  = 'none';
	$('Add').disabled               = true;	
		}
			
function uiEdit(_i){
	$('incMacFilter').style.display = 'block';
	$('gobalsubmit').style.display  = 'none';
	$('Add').disabled               = true;
			
	_index = _i;
	$('TE_MacAddr').value = G_MacFilter[_index][1];
	$('TE_comment').value = G_MacFilter[_index][2];
	}

function uiDelete(_i){
	if(!confirm('Are you sure you want to delete this item?')){
		return false;
    }
   $H({
		'var:menu'      : G_Menu,
		'var:page'      : G_Page,
		'var:errorpage' : G_SubPage,
		'var:subpage'   : G_SubPage,
		'getpage'       : 'html/index.html',
		'errorpage'     : 'html/index.html',
		'obj-action'    : 'del',
		'del-obj'       : G_MacFilter[_i][0],
		'var:CacheLastData'	: ViewState.Save()
	},true);
	
	$('uiPostForm').submit();
}

function uiApply(){	
	//if (checkAddValue() == false) {
	//    return false;
	//}
	$H({
		'var:menu'      : G_Menu,
		'var:page'      : G_Page,
		'var:errorpage' : G_Page,
		'var:ssid_idx'	: GetSsidIndex(),
		'getpage'       : 'html/index.html',
		'errorpage'     : 'html/index.html'
	},true);
	//alert($('SEL_ssid').value);
	//return false;
	if(_index == -1){
		$H({
			'obj-action'    : 'add-set',
			'add-obj'       : $('SEL_ssid').value + 'X_TWSZ-COM_MACList.',//'InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.X_TWSZ-COM_MACList.',
			':MACAddress'   : $('TE_MacAddr').value,
			':Description'  : $('TE_comment').value
		});
	} else {
		$F(':' + G_MacFilter[_index][0] + 'MACAddress', $('TE_MacAddr').value);
		$F(':' + G_MacFilter[_index][0] + 'Description', $('TE_comment').value);
		$F('obj-action', 'set');
	}
		
	$('uiPostForm').submit();
}

function uiSubmit(){
	var xValue ;
	var value_mode = $('SEL_AcsCtrlMode').value;
	var _path = $('SEL_ssid').value;
    var index = GetSsidIndex();
	$H({
		'var:menu'      : G_Menu,
		'var:page'      : G_Page,
		'var:subpage'   : G_SubPage,
		'var:errorpage' : G_SubPage,
		'var:ssid_idx'	: GetSsidIndex(),
		'getpage'       : 'html/index.html',
		'errorpage'     : 'html/index.html',
		'obj-action'    : 'set'
//		':InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.MACAddressControlEnabled' : value_mode == '0' ? '0' : '1',
//		':InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.X_TWSZ-COM_MACAddressControlAction' : value_mode == '0' ? undefined : value_mode
	},true);
	xValue = Form.Radio('RAD_EnWlAcl');
	$F(':' + _path + 'MACAddressControlEnabled',( xValue  == '0' ? '0' : '1'));
	//$F(':' + _path + 'MACAddressControlEnabled',Form.Radio('RAD_EnWlAcl'));
	//if(xValue != '0'){
	if(xValue != '0'){
	$F(':' + _path + 'X_TWSZ-COM_MACAddressControlAction', value_mode);
	}
    //alert(value_mode);

	
	$('uiPostForm').submit();	
    }
	
function dealWithError(){
	if (G_Error != 1){
		return false; 
}

         var arrayHint = [];
	//arrayHint['MACAddress'] = 'INPUT_MACAddresses';

         dealErrorMsg(arrayHint, G_Error_Msg);
}

addListeners(uiOnload,dealWithError);
