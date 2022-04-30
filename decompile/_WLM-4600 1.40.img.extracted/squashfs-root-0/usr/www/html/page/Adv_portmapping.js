var Cache_data = '<?echo $var:data?>';
var ajax;
var G_Action=0;  // Add=1    Edit=2    Delete=3    
var editIdx=0;
var delIdx=0;
var vlanid=0;
var AvailableInt='';
var GroupedInt='';
var G_Group_Interface=[];

// about vlan lan
var G_vlan_lan   = [];
var m = 0;
<?objget :InternetGatewayDevice.Layer2Bridging.Bridge. "BridgeKey BridgeName VLANID X_TWSZ-COM_AssociatedLANDevice"
`	G_vlan_lan[m] = [];
	G_vlan_lan[m][0] = "$01"; //BridgeKey
	G_vlan_lan[m][1] = "$02"; //BridgeName
	G_vlan_lan[m][2] = "$03"; //VLANID
	G_vlan_lan[m][3] = "$04"; //X_TWSZ-COM_AssociatedLANDevice
	G_vlan_lan[m][5] = "InternetGatewayDevice.Layer2Bridging.Bridge.$00.";
	m++;
`?>
//filter
var G_bing_vlan = [];
var m = 0;
<?objget :InternetGatewayDevice.Layer2Bridging.Filter. "FilterKey FilterBridgeReference FilterInterface"
`	G_bing_vlan[m] = [];
	G_bing_vlan[m][0] = "$01"; //FilterKey
	G_bing_vlan[m][1] = "$02"; //FilterBridgeReference
	G_bing_vlan[m][2] = "$03"; //FilterInterface
	G_bing_vlan[m][3] = "InternetGatewayDevice.Layer2Bridging.Filter.$00.";
	m++;
`?>

//interface
var G_Avail_Interface = [];
var n = 0;
<?objget :InternetGatewayDevice.Layer2Bridging.AvailableInterface. "AvailableInterfaceKey InterfaceType InterfaceReference" 
`	<?if eq `LANInterface` `<?echo $22?>`
	`	G_Avail_Interface[n] = [];
		G_Avail_Interface[n][0] = "<?echo $21?>"; //AvailableInterfaceKey
		G_Avail_Interface[n][1] = "<?echo $22?>"; //InterfaceType
		G_Avail_Interface[n][2] = "<?echo $23?>"; //InterfaceReference
		n++;
	`?>
	<?if eq `WANInterface` `<?echo $22?>`
	`	G_Avail_Interface[n] = [];
		G_Avail_Interface[n][0] = "<?echo $21?>"; //AvailableInterfaceKey
		G_Avail_Interface[n][1] = "<?echo $22?>"; //InterfaceType
		G_Avail_Interface[n][2] = "<?echo $23?>"; //InterfaceReference
		n++;
	`?>
`?>

//获取lan config的接口名称//Don't change the order
var G_interface_config = [];
var t = 0;
<?objget :InternetGatewayDevice.LANDevice.1.LANEthernetInterfaceConfig. "X_TWSZ-COM_Description"
`	G_interface_config[t] = [];
	G_interface_config[t][0] = "$01";
	G_interface_config[t][1] = "InternetGatewayDevice.LANDevice.1.LANEthernetInterfaceConfig.$00";
	t++;
`?>
//获取WLAN的SSID //Don't change the order
<?objget :InternetGatewayDevice.LANDevice.1.WLANConfiguration. "X_TWSZ-COM_DeviceName SSID"
`	G_interface_config[t] = [];
	G_interface_config[t][0] = "$01";
	G_interface_config[t][1] = "InternetGatewayDevice.LANDevice.1.WLANConfiguration.$00";
	G_interface_config[t][2] = "$02";
	t++;
`?>


<?objget :InternetGatewayDevice.WANDevice. ""
`
    <?objget :InternetGatewayDevice.WANDevice.$10.WANConnectionDevice. "WANIPConnectionNumberOfEntries"
    `	<?if gt $11 0
        `	<?objget :InternetGatewayDevice.WANDevice.$30.WANConnectionDevice.$20.WANIPConnection. "Name"
            `	G_interface_config[t] = [];
                G_interface_config[t][0] = "$01";
                G_interface_config[t][1] = "InternetGatewayDevice.WANDevice.$30.WANConnectionDevice.$20.WANIPConnection.$00.";
                t++;
            `?>
        `?>
    `?>
`?>

function uiOnload(){
    G_Action=0;
    editTableSwitch();
    createGroupInterface();
    createTable();
}

function searchFilterPath(interfaceName){
	
	for(var n=0; n < G_interface_config.length; n++){
		if(interfaceName==G_interface_config[n][0]){
			for(var k=0 ; k < G_Avail_Interface.length; k++){
				if(G_interface_config[n][1].indexOf(G_Avail_Interface[k][2])>-1)
					for(var i=0; i<G_bing_vlan.length; i++){
						if(G_Avail_Interface[k][0]==G_bing_vlan[i][2]){
							return G_bing_vlan[i][3];
						}
					}	
			}
		}
	}
}

function createGroupInterface(){
	
	for(var j=0; j < G_vlan_lan.length; j++){
		G_Group_Interface[j]=[];
		G_Group_Interface[j][0]='';
		for(var i=0; i<G_bing_vlan.length; i++){
			if(G_bing_vlan[i][1]==G_vlan_lan[j][0]){
				for(var k=0 ; k < G_Avail_Interface.length; k++){
					if(G_Avail_Interface[k][0]==G_bing_vlan[i][2])
						for(var n=0; n < G_interface_config.length; n++){
							if(G_interface_config[n][1].indexOf(G_Avail_Interface[k][2])>-1)
								G_Group_Interface[j][0] += G_interface_config[n][0] + ',';
						}
				}
			}
		}
	}
}

function createTable(){	
	var array_bridge = [];
	//alert(G_vlan_lan.length);
	for(var i = 0; i < G_Group_Interface.length; i++){
		array_bridge[i] = [];
		
		array_bridge[i].push('<input type="checkbox" id="rule_index'+i+'" name="rule_index'+i+'" onclick="$id(' + i + ')">'); 
		array_bridge[i].push(G_vlan_lan[i][1]);
		array_bridge[i].push(G_Group_Interface[i][0].ellipsis(68));	
	}
	$T('td_BridgeList',array_bridge);
	$('rule_index0').disabled=true;
	for(var i = 0; i < G_Group_Interface.length; i++){
		$('td_BridgeList_' + i + '2').title = G_Group_Interface[i][0];
	}
}

function AddEntry(){
	G_Action = 1;
    editTableSwitch();

	var interfaces = G_Group_Interface[0][0].split(',');
	var _text = [], _value = [];

	for(var j = 0; j < interfaces.length-1; j++){
		_text.push(interfaces[j]);
		_value.push(interfaces[j]);
	}

	$S('AvailableInterface',_text,_value);

}

function editTableSwitch(){
    switch(G_Action){
        case 0 : // no action
        case 3 : // delete
            $('EntryInfo').style.display = 'none';
            $('editTable1').style.display = 'none';
            $('editTable2').style.display = 'none';
            $('POMAP005').disabled=false;       //button add
            $('POMAP006').disabled=false;       //button edit
            $('POMAP007').disabled=false;	    //button del
            break;
        case 1 : // add 
        case 2 : // edit
            $('EntryInfo').style.display = 'block';
            $('editTable1').style.display = 'block';
            $('editTable2').style.display = 'block';
            $('POMAP005').disabled=true;       //button add
            $('POMAP006').disabled=true;       //button edit
            $('POMAP007').disabled=true;	    //button del
            break;
        default:
       
    }
}

function AddInterface() {
	var arrSelected = new Array();
	var count = 0;
	for (var i = 0; i < $('AvailableInterface').options.length; i++) {
		if ($('AvailableInterface').options[i].selected == true) {
			arrSelected[count] = $('AvailableInterface').options[i].value;
		}
		count++;
	}
	var x = 0;
	for (var i = 0; i < $('AvailableInterface').options.length; i++) {
		for (x = 0; x < arrSelected.length; x++) {
			if ($('AvailableInterface').options[i].value == arrSelected[x]) {
				varOpt = new Option($('AvailableInterface').options[i].text, $('AvailableInterface').options[i].value);
				$('Grouped_Interfaces').options[$('Grouped_Interfaces').length] = varOpt;
				$('AvailableInterface').options[i] = null;
			}
		}	
	}
}


function RemoveInterface() {

	var arrSelected = new Array();
	var count = 0;
	for (var i = 0; i < $('Grouped_Interfaces').options.length; i++) {
		if ($('Grouped_Interfaces').options[i].selected == true) {
			arrSelected[count] = $('Grouped_Interfaces').options[i].value;
		}
		count++;
	}
	var x = 0;
	for (i = 0; i < $('Grouped_Interfaces').options.length; i++) {
		for (x = 0; x < arrSelected.length; x++) {
			if ($('Grouped_Interfaces').options[i].value == arrSelected[x]) {
				varOpt = new Option($('Grouped_Interfaces').options[i].text, $('Grouped_Interfaces').options[i].value);
				$('AvailableInterface').options[$('AvailableInterface').length] = varOpt;
				$('Grouped_Interfaces').options[i] = null;
			}
		}
	}
}

function uiSubmit(){
	
	$('POMAP012').disabled=true;
	$('POMAP013').disabled = true;
	if(G_Action==1){    //add action
		uiAjax_AddBridge();
		
	}else if(G_Action==2){   //edit action
		Edit_ChangeFilter();
	}
}

function uiAjax_AddBridge(){	

		var lastvlanid=G_vlan_lan[G_vlan_lan.length-1][2];
		vlanid=1+parseInt(lastvlanid);
		
		$H({
			'add-obj'    : 'InternetGatewayDevice.Layer2Bridging.Bridge.',
			':BridgeName': $('GroupName').value,
			':VLANID'    : vlanid,
			':BridgeEnable': '1',
			'obj-action' : 'add-set',
			'var:menu'   : 'advanced',
			'var:page'   : 'Adv_portmapping',
			'var:errorpage': 'Adv_portmapping',
			'getpage'    : 'html/page/portmapping_ajax.js',
			'var:CacheLastData': ViewState.Save()
		},true);
	var _url = "/cgi-bin/webproc";
	ajax = Ajax.getInstance(_url, "", 0, ajax_AddBridgeProc);
	ajax.post($('uiPostForm'));	
}

function ajax_AddBridgeProc(_text){
	try{
		eval(_text);
	} catch (ex){
		G_Error == '1'
		return false;
	}
	
	if (G_Error == '0'){
		uiAjax_Add_ChangeFilter();
	} else if (G_Error == '1'){
		dealWithError();
		document.location.href = '/cgi-bin/webproc?getpage=html/index.html&var:menu=advanced&var:page=Adv_portmapping';
	}
}

var bridgekey;
function uiAjax_Add_ChangeFilter(){
	       //alert(G_vlan_lan.length);

		var path;
		//var num=G_vlan_lan[G_vlan_lan.length-1][0];
		//bridgekey=1+parseInt(num);
		//alert(bridgekey);
		
		$H({
			'obj-action'	:'set',
			'var:menu'     : 'advanced',
			'var:page'     : 'Adv_portmapping',
			'var:errorpage': 'Adv_portmapping',
			'getpage'      : 'html/page/portmapping_ajax.js',
			'var:CacheLastData': ViewState.Save()
		},true);	
		
		for (var i = 1; i < $('AvailableInterface').options.length; i++) {
			path='';
			path=':'+searchFilterPath($('AvailableInterface').options[i].value);
			if(path.indexOf(':InternetGatewayDevice.')>-1)
				$F(path+'FilterBridgeReference', 1);
		}	
		
		for (var i = 0; i < $('Grouped_Interfaces').options.length; i++) {
			path='';
			path=':'+searchFilterPath($('Grouped_Interfaces').options[i].value);
			if(path.indexOf(':InternetGatewayDevice.')>-1)
				$F(path+'FilterBridgeReference', G_NewObjIndex);
		}
			
		var _url = "/cgi-bin/webproc";

		ajax = Ajax.getInstance(_url, "", 0, ajax_Proc);
		ajax.post($('uiPostForm'));	
}

function ajax_Proc(_text){
	//鎴愬姛,鍒欒烦杞〉闈?
	try{
		eval(_text);
	} catch (ex){
		G_Error == '1'
		return false;
	}
	
	if (G_Error == '0'){
		$G('/cgi-bin/webproc',{
			'var:menu'			: 'advanced',
			'var:page'			: 'Adv_portmapping',
			'getpage'			: 'html/index.html',
			'errorpage'			: 'html/index.html',
			'var:errorpage'		:'Adv_portmapping'
		});	
	} else if(G_Error == '1'){
		dealWithError();
		document.location.href = '/cgi-bin/webproc?getpage=html/index.html&var:menu=advanced&var:page=Adv_portmapping';
	}
}

function dealWithError(){
         if (G_Error != 1){ return false; }
         var arrayHint = [];
         dealErrorMsg(arrayHint, G_Error_Msg);
}

function ajax_Del_ChangeFilterProc(_text){
	//鎴愬姛, 鍒檚et
	try{
		eval(_text);
	} catch (ex){
		G_Error == '1'
		return false;
	}
	if (G_Error == '0'){
		uiAjax_DelBridge();
	} else if (G_Error == '1'){
		dealWithError();
		document.location.href = '/cgi-bin/webproc?getpage=html/index.html&var:menu=advanced&var:page=Adv_portmapping';
	}
}

function uiAjax_DelBridge(){
		
	$H({
		'del-obj':    G_vlan_lan[delIdx][5],
		'obj-action' : 'del',
		'var:menu'   : 'advanced',
		'var:page'   : 'Adv_portmapping',
		'var:errorpage': 'Adv_portmapping',
		'getpage'    : 'html/page/portmapping_ajax.js',
		'var:CacheLastData': ViewState.Save()
	},true);
	
	var _url = "/cgi-bin/webproc";
	ajax = Ajax.getInstance(_url, "", 0, ajax_Proc);
	ajax.post($('uiPostForm'));	
}

function RemoveEntry(){
	if(_array_id.length != 1){
		alert(SEcode[1009]);
		return false;
	}
	
	G_Action = 3;
    editTableSwitch();
    
	for(var j = 0; j < G_Group_Interface.length; j++){
		var DelIndexID="rule_index"+j;
		var DelIndex=Form.Checkbox(DelIndexID);
		if(DelIndex=='1'){
			
			if(!confirm(SEcode[1008])){return false;}
			delIdx=j;
			G_Action=3;
			//alert(G_Group_Interface[j][0]);
			if(G_Group_Interface[j][0]==''){
				$H({
					'del-obj'   :G_vlan_lan[j][5],
					'obj-action':'del',
					'var:menu'  :'advanced',
					'var:page'  :'Adv_portmapping',
					'getpage'   :'html/index.html',
					'errorpage' :'html/index.html',
					'var:errorpage':'Adv_portmapping'
				},true);
				
				$('uiPostForm').submit();
			}else{
				uiAjax_Del_ChangeFilter();
			}
		}
	}
}

function uiAjax_Del_ChangeFilter(){
	       //alert(G_vlan_lan.length);

		var path;
	
		$H({
			'obj-action'	:'set',
			'var:menu'     : 'advanced',
			'var:page'     : 'Adv_portmapping',
			'var:errorpage': 'Adv_portmapping',
			'getpage'      : 'html/page/portmapping_ajax.js',
			'var:CacheLastData': ViewState.Save()
		},true);	

		var interfaces = G_Group_Interface[delIdx][0].split(',');
		//alert(interfaces.length);
		for (var i = 0; i < interfaces.length-1; i++) {
			path='';
			
			path=':'+searchFilterPath(interfaces[i]);
			
			if(path.indexOf(':InternetGatewayDevice.')>-1)
				$F(path+'FilterBridgeReference', 1);
		}
			
		var _url = "/cgi-bin/webproc";

		ajax = Ajax.getInstance(_url, "", 0, ajax_Del_ChangeFilterProc);
		ajax.post($('uiPostForm'));	
}

function Edit_ChangeFilter(){

		var path;
	
		$H({
			'obj-action'	:'set',
			'var:menu'     : 'advanced',
			'var:page'     : 'Adv_portmapping',
			'var:errorpage': 'Adv_portmapping',
			'getpage'      : 'html/index.html',
			'errorpage'  	: 'html/index.html',
			'var:CacheLastData': ViewState.Save()
		},true);	
		
		path=':'+G_vlan_lan[editIdx][5];
		$F(path+'BridgeName',$('GroupName').value);
		
		for (var i = 1; i < $('AvailableInterface').options.length; i++) {
			path='';
			path=':'+searchFilterPath($('AvailableInterface').options[i].value);
			if(path.indexOf(':InternetGatewayDevice.')>-1)
				$F(path+'FilterBridgeReference', 1);
		}	
		
		for (var i = 0; i < $('Grouped_Interfaces').options.length; i++) {
			path='';
			path=':'+searchFilterPath($('Grouped_Interfaces').options[i].value);
			if(path.indexOf(':InternetGatewayDevice.')>-1)
				$F(path+'FilterBridgeReference', G_vlan_lan[editIdx][0]);
		}
			
		$('uiPostForm').submit();	
}

function EditEntry(){
    if(_array_id.length != 1){
		alert("please select one item to edit!");
		return false;
	}
	G_Action=2;
	editTableSwitch();

	
	var interfaces = G_Group_Interface[0][0].split(',');
	var _text = [], _value = [];
	//alert(interfaces.length);
	for(var j = 0; j < interfaces.length-1; j++){
		_text.push(interfaces[j]);
		_value.push(interfaces[j]);	
	}
	$S('AvailableInterface',_text,_value);
	
	for(var j = 0; j < G_Group_Interface.length; j++){
		
		var EditIndexID="rule_index"+j;
		var EditIndex=Form.Checkbox(EditIndexID);
		if(EditIndex=='1'){
			editIdx=j;
			var interfaces = G_Group_Interface[j][0].split(',');
			var _text = [], _value = [];
			for(var k = 0; k < interfaces.length-1; k++){
				_text.push(interfaces[k]);
				_value.push(interfaces[k]);
			}
			$S('Grouped_Interfaces',_text,_value);
			$('GroupName').value=G_vlan_lan[j][1];
		}
	}
}

addListeners(uiOnload, dealWithError);