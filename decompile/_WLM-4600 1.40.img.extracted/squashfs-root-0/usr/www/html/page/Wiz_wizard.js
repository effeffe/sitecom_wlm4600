/* JavaScript Document */
var G_ConnType  = "";
var n = 0, m = 0;
var G_WanIndex = 0;
var G_WANConn = [];
var G_WanPVC = [];
<?objget :InternetGatewayDevice.WANDevice.1.WANConnectionDevice. "WANDSLLinkConfig.DestinationAddress"
`	G_WanIndex = "$00";
	G_WanPVC[n] = "$01";
	++n;
`?>


<?objget :InternetGatewayDevice.WANDevice.1.WANConnectionDevice. "WANIPConnectionNumberOfEntries WANPPPConnectionNumberOfEntries"
`	<?if gt $11 0
	`	<?objget :InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$20.WANIPConnection. "Enable Name ConnectionStatus ConnectionType AddressingType X_TWSZ-COM_ProtocolType X_TWSZ-COM_IPv6Config.ConnectionStatus"
		`	G_WANConn[m] = "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$20.WANIPConnection.$00.";	//Path
			m++;
		`?>
	`?>
	<?if gt $12 0
	`	<?objget :InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$20.WANPPPConnection. "Enable Name ConnectionStatus ConnectionType ConnectionTrigger X_TWSZ-COM_ProtocolType X_TWSZ-COM_IPv6Config.ConnectionStatus"
		`	G_WANConn[m] = "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.$20.WANPPPConnection.$00.";	//Path
			m++;
		`?>
	`?>
`?>


//自动ISP
<?mget :InternetGatewayDevice.X_TWSZ-COM_Diagnostics.AutoPVCSearch. "Enable SearchPVC FoundPVC DefaultPVCList"
`	G_AutoEnable 		= "$01";
	G_AutoSerachPVC 	= "$02";
	G_AutoFoundPVC 		= "$03";
	G_AutoDefaultPVCList 	= "$04";
`?>


/*  动态加载报错文乿 */
function dyCrtCountryISP(){
	var oHead = document.getElementsByTagName('head').item(0);
	var reforeNode = document.getElementsByTagName('script').item(0);
	
	var oScript0= document.createElement('script'); 
	oScript0.type = "text/javascript";
	oScript0.src = "/html/page/Country_ISP.js";
	
	oHead.insertBefore(oScript0,reforeNode.nextSibling);
}

//国家
var arr_Text  = ["-- Select Country --","Algeria","Argentina","Australia","Austria","Azerbaijan","Bahrein","Belgium","Czech","Denmark","Egypt","Finland","France","Germany","Hungary","Iceland","Indonesia","Israel","Italy","Jordan","Kazakhstan","Kyrgyzstan","Lebanon","Libya","Malaysia","Netherlands","New Zealand","Norway","Philippines","Poland","Portugal","Qatar","Romania","Russia","Saudi Arabia.","Singapore","Slovakia","South Africa","Spain","Sri Lanka","Sweden","Syria","Taiwan","Thailand","Turkey","UAE","UK","USA","Uzbekistan","Vietnam"];
var arr_Value = ["0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40","41","42","43","44","45","46","47","48"];
var arr_ISPText = ["-- Choose your provider --"];
var arr_ISPValue = ["0"];
var finFlag = "<?echo $var:finish?>";
var auto_PVC = "";
var G_auto_Encap = "";
var auto_LinkType = "";

var G_PPPoE_UserName 	= "";
var G_PPPoE_Password 	= "";
var G_PPPoE_ConnType	= "AlwaysOn";
var G_PPPoE_DemandTime	= "";
var G_ISP_DNS			= "";
var G_Country			= "";
var G_ISP 				= "";

//加载初始势
function uiOnload(){
	//创建js外部引用
	$('WIZ012').disabled = false;
	$('WIZ013').disabled = false;
	$('WIZ034').disabled = false;
	$('WIZ035').disabled = false;
	$('WIZ018').disabled = false;
	$('WIZ019').disabled = false;
	G_PPPoE_UserName 	= "";
    G_PPPoE_Password 	= "";
    G_PPPoE_ConnType	= "AlwaysOn";
    G_PPPoE_DemandTime	= "";
    G_ISP_DNS			= "";

	dyCrtCountryISP();
	//create country
	$S('SEL_country', arr_Text, arr_Text);
	//create ISP
	crtISPSel();
	G_ConnType = "";
	if(finFlag != "-"){
		$('ta_wizard_1').style.display = "none";
		$('ta_wizard_4').style.display = "";

	}
}

//ISP
function crtISPSel(xText){
	//判断传递参擿
	if(xText == undefined){
		var xText = [];
	}
	//清空
	arr_ISPText = ["-- Choose your provider --"];
	arr_ISPValue = ["0"];
	
	for(var i=0,len=xText.length; i<len; i++){
		arr_ISPText.push(xText[i]);
		arr_ISPValue.push(xText[i]);
	}
	
	arr_ISPText.push("Manual Configuration");
	arr_ISPValue.push("manual");
	$S('SEL_isp', arr_ISPText, arr_ISPValue);
}

//find ISP by Country
function findISPByCountry(xValue){
	//判断传递参数
	if(xValue == undefined){
		var xValue = "Algeria";
	}
	var arr_xValue = [];
	for(var i=0,len=Country_ISP.length; i<len; i++){
		if(xValue == Country_ISP[i][0]){
			arr_xValue.push(Country_ISP[i][1]);
		}
	}
	
	return arr_xValue;
}

//onchange country
function onChgCountry(xValue){
	var arr_ctText = [];
	if(xValue == undefined){
		var xValue = "-- Select Country --";
	}
	
	G_Country = xValue;
	//根据不同国家创建不同的ISP
	arr_ctText = findISPByCountry(xValue);
	//创建对应的ISP下拉列表
	crtISPSel(arr_ctText);
}


function setSpecialISPParameter(){
	if ( (G_Country == "Italy") || (G_Country == "Russia") || (G_Country == "Spain") ){
		switch (G_ISP){
			case "ADSL Telecom Italia (Flat profile)":
				G_PPPoE_UserName = "adsltelecom";
				G_PPPoE_Password = "adsltelecom";
				G_ISP_DNS	= "212.216.112.112,151.99.0.100";
				break;
			case "ADSL Telecom Italia (Time profile)":
				G_PPPoE_UserName = "adsltelecom";
				G_PPPoE_Password = "adsltelecom";
				G_PPPoE_ConnType = "OnDemand";
				G_PPPoE_DemandTime = "1200"; // 20minutes * 60
				G_ISP_DNS	= "212.216.112.112,151.99.0.100";
				break;
			case "Aruba":
				G_ISP_DNS	= "62.149.128.4,62.149.132.4";
				break;
			case "Libero-Infostrada PPPoE( Default )":
				G_PPPoE_UserName = "benvenuto";
				G_PPPoE_Password = "ospite";
				G_ISP_DNS	= "193.70.152.15,192.70.152.25";
				break;
			case "Libero-Infostrada PPPoA ( Optional )":
				G_PPPoE_UserName = "benvenuto";
				G_PPPoE_Password = "ospite";
				G_ISP_DNS	= "193.70.152.15,192.70.152.25";
				break;
			case "Panservice":
				G_ISP_DNS	= "212.66.96.1,212.66.96.2";
				break;
			case "TeleTU PPPoE(Default)":
				//G_ISP_DNS	= "130.244.127.161,130.244.127.169";
				break;
			case "TeleTU PPPoA(Optional)":
				//G_ISP_DNS	= "130.244.127.161,130.244.127.169";
				break;
			case "Tiscali PPPoE(Default)":
				G_ISP_DNS	= "213.205.32.70,213.205.36.70";
				break;
			case "Tiscali PPPoA(Optional)":
				G_ISP_DNS	= "213.205.32.70,213.205.36.70";
				break;
			case "PeterStar":
				G_ISP_DNS	= "217.195.65.9,217.195.66.253";
				break;

		}
	}
}


function uiNext_1(){	
	$('ta_wizard_1').style.display = "none";
	$('ta_wizard_2').style.display = "";
}
function uiNext_2(){
// init global parameter.
	G_PPPoE_UserName 	= "";
    G_PPPoE_Password 	= "";
    G_PPPoE_ConnType	= "AlwaysOn";
    G_PPPoE_DemandTime	= "";
    G_ISP_DNS			= "";

	G_Country 	= Form.Select("SEL_country");
	G_ISP 		= Form.Select("SEL_isp");
	
	//manual
	if(G_ISP == "manual"){
		uiManual();
		return false;
	}
	//select country adn isp
	if(G_Country == '-- Select Country --' || G_ISP == '0'){
		alert(SEcode[1013]);
		return false;
	}
	
	if(G_auto_Encap == ""){
		var _encap = findEncapByctISP("encap");
	}
	else{ 
			if (auto_LinkType == ""){
			_encap =  "PPPoE" + G_auto_Encap;//没有搜索到就默认为PPPoE	
			}else{
			_encap =  auto_LinkType + G_auto_Encap;	
			}
	}
	var _info = checkConnType(_encap);
	
	setSpecialISPParameter();

	if(_info == "Bridge"|| _info == "DHCP"){	
		uiFinish();
  }
  else if(_info == "IPoA"){
		$('ta_wizard_2').style.display = "none";
	  $('ta_wizard_3_ip').style.display = "";
	  $('ta_wizard_3_ppp').style.display = "none";
	  $('scanSuccess').style.display = "none";
	}	
  else if(_info == "PPPoE"|| _info == "PPPoA"){
  		if (G_PPPoE_UserName){
  			$('INPUT_Username').value = G_PPPoE_UserName;
  		}
  		if (G_PPPoE_Password){
  			$('INPUT_Password').value = G_PPPoE_Password;
  		}
		$('ta_wizard_2').style.display = "none";
	  $('ta_wizard_3_ip').style.display = "none";
	  $('ta_wizard_3_ppp').style.display = "";
	  $('scanSuccess').style.display = "none";
	}	
	
	
	
}
function checkConnType(xEncap){
	if(xEncap == undefined){
		var xEncap = "PPPoE LLC";
	}
	var _pppoe = xEncap.indexOf("PPPoE") > -1 ?  "1" : "0";
	var _pppoa = xEncap.indexOf("PPPoA") > -1 ? "1" : "0";
	var _ipoa  = xEncap.indexOf("IPoA") > -1 ? "1" : "0";
	var _bridge= xEncap.indexOf("Bridge") > -1 ? "1" : "0";
	var _dhcp  = xEncap.indexOf("DHCP") > -1 ? "1" : "0";
	var _llc   = xEncap.indexOf("LLC") > -1 ? "1" : "0";
	var _vcmux = xEncap.indexOf("VCMUX") > -1 ? "1" : "0";
	
	
	 if(_bridge == "1")
	{
		return "Bridge";
	}
	else if(_dhcp == "1")
	{
		return "DHCP";
	}
	else if(_ipoa == "1")
	{
		return "IPoA";
	}
	else if(_pppoa == "1" ){
		return "PPPoA";
	}
	else{
		return "PPPoE";
	}	
}


//上一步
//应客户需求，将Wiz_wizard中的ta_wizard_0页面裁剪 --majiangying 2012/10/19
/*function uiPrevious_1(){
	$('ta_wizard_0').style.display = "";
	$('ta_wizard_1').style.display = "none";
}*/
function uiPrevious_2(){
	$('ta_wizard_1').style.display = "";
	$('ta_wizard_2').style.display = "none";
}
function uiPrevious_3(){
	$('ta_wizard_2').style.display = "";
	$('ta_wizard_3_ip').style.display = "none";
	$('ta_wizard_3_ppp').style.display = "none";
}

function chkManualPVC(){
	var tmpPVC = $('INPUT_ManualPVC').value;
	
	if (tmpPVC == ""){
		return true; // no list, auto search
	}
	
	for (var i=0; i < G_WanPVC.length; ++i){
		var existPVC = G_WanPVC[i].substring( G_WanPVC[i].indexOf(':') + 1 );

		if( tmpPVC.indexOf( existPVC ) != -1){
			alert( SEcode[1016] );
			return false;
		}
	}
	
	var tmpArray = tmpPVC.split(',');
	
	//check pvc pair, not more than 16
	if (tmpArray.length > 16){
		alert(SEcode[1015]);
		return false;
	}
	
	//check pvc format, most be (xx/xxx), 
	for (var i =0; i < tmpArray.length; i++){
		var tmpTest = tmpArray[i].split("/");
		if ((tmpTest.length != 2) ||
			isNaN(tmpTest[0]) || isNaN(tmpTest[1]) ||
			(Number(tmpTest[0]) < 0) 	|| 
			(Number(tmpTest[0]) > 255) 	||
			(Number(tmpTest[1]) < 32)	|| 
			(Number(tmpTest[1]) > 65535)
			){
			alert(SEcode[1015]);
			return false;
		}
			
	}
	
	return true;
	
}

//获取自动扫描PVC结果
function uiStartScann(){
//	if (!chkManualPVC()){
//		return false;
//	}
	
	$H({
		'obj-action'       : 'set',
		'getpage'          : 'html/page/Wiz_wizard.ajax.js',
		'var:page'         : G_Page
	},true);
	//if($('INPUT_ManualPVC').value != ""){
	//	$F(':InternetGatewayDevice.X_TWSZ-COM_Diagnostics.AutoPVCSearch.SearchPVC', $('INPUT_ManualPVC').value);
	//}
	$F(':InternetGatewayDevice.X_TWSZ-COM_Diagnostics.AutoPVCSearch.Enable', "1");
	
	var _url = "/cgi-bin/webproc";
	ajax = Ajax.getInstance(_url, "", 0, function(){});
	ajax.post($('uiPostForm'));
	//创建提示
	$('DIV_Scann').style.display = "";	
	setTimeout('ajaxGetScanStatus()', 2000);
}
//
function ajaxGetScanStatus(){
	var _url = "/cgi-bin/webproc?getpage=html/page/Wiz_wizard.ajax.js&var:page=*";
	ajax = Ajax.getInstance(_url, "", 0, processWpsStatus);
	ajax.get();
}

function processWpsStatus(responseText){
	try{
		//alert(responseText + " = responseText");
		eval(responseText);
		if(G_ScannStatus == "SUCCESS" && G_FoundPVC != "" && G_Encapsulation != ""){//扫描成功
			auto_PVC = G_FoundPVC;
			G_auto_Encap = G_Encapsulation;
			auto_LinkType = G_FoundLinkType;
			$('ta_wizard_1').style.display = "none";
			$('ta_wizard_3_ppp').style.display = "";
			$('ta_wizard_3_ip').style.display = "none";
			$('scanSuccess').style.display = "";
			$('pvcResult').innerHTML = G_FoundPVC;
			$('DIV_Scann').style.display = "none";
		}else if(G_ScannStatus == "FAILED" && (G_FoundPVC == "" || G_Encapsulation != "")){//扫描失败
			$('ta_wizard_1').style.display = "none";
			$('ta_wizard_2').style.display = "";
			$('scanFail').style.display = "";
			$('DIV_Scann').style.display = "none";
		}else{//继续扫描
			setTimeout('ajaxGetScanStatus()', 2000);			
		}
		dealWithError();
	}catch(e){
		$('DIV_Scann').style.display = "none";
		dealWithError();
		//alert('Ajax Response Error:'+e.message);
		return;
	}
}

function skipAutoPVCScan(){
    $('ta_wizard_1').style.display = "none";
	$('ta_wizard_2').style.display = "";
	$('scanFail').style.display = "none";
	$('DIV_Scann').style.display = "none";
}

//由国家和ISP查找PVI/CVI Encap
function findEncapByctISP(xFlag){
	if(xFlag == undefined){
		var xFlag = "pvc";
	}

	var _pvc, _encap;
	var arr_xValue = [];
	//alert("country=" + arr_Text[G_Country] + " | " + "isp=" + arr_ISPText[G_ISP] + "   xFlag = " + xFlag);
	if(xFlag == "pvc"){
		for(var i=0,len=Country_ISP.length; i<len; i++){
			if( G_Country == Country_ISP[i][0] && G_ISP == Country_ISP[i][1]){
				_pvc = "PVC:"+Country_ISP[i][2]+"/"+Country_ISP[i][3];
				return _pvc;
			}
		}
	}else if(xFlag == "encap"){
		for(var j=0,len=Country_ISP.length; j<len; j++){
			if( G_Country == Country_ISP[j][0] && G_ISP == Country_ISP[j][1]){
				_encap = Country_ISP[j][4];
				return _encap;
			}
		}
	}
}

//查找连接类型
function findInfoByEncap(xEncap){
	if(xEncap == undefined){
		var xEncap = "PPPoE LLC";
	}
	//alert("xEncap = " + xEncap);
	var _pppoe = xEncap.indexOf("PPPoE") > -1 ?  "1" : "0";
	var _pppoa = xEncap.indexOf("PPPoA") > -1 ? "1" : "0";
	var _ipoa  = xEncap.indexOf("IPoA") > -1 ? "1" : "0";
	var _bridge= xEncap.indexOf("Bridge") > -1 ? "1" : "0";
	var _dhcp  = xEncap.indexOf("DHCP") > -1 ? "1" : "0";
	var _llc   = xEncap.indexOf("LLC") > -1 ? "1" : "0";
	var _vcmux = xEncap.indexOf("VCMUX") > -1 ? "1" : "0";
	
	
	 if(_bridge == "1")
	{
		G_ConnType = "Bridge";
		if(_llc == "1")
			return ['EoA', 'IP', 'LLC'];
		else
			return ['EoA', 'IP', 'VCMUX'];
	}
	else if(_ipoa == "1"){
		G_ConnType = "IPoA";
		if(_llc == "1")
			return ['IPoA', 'IP', 'LLC'];
		else
			return ['IPoA', 'IP', 'VCMUX'];
	}
	else if(_dhcp == "1")
	{
		G_ConnType = "DHCP";
		if(_llc == "1")
			return ['EoA', 'IP', 'LLC'];
		else
			return ['EoA', 'IP', 'VCMUX'];
	}
	else if(_pppoa == "1"){
		G_ConnType = "PPPoA";
		if(_llc == "1")
			return ['PPPoA', 'PPP', 'LLC'];
		else
			return ['PPPoA', 'PPP', 'VCMUX'];
	}
	else{
		G_ConnType = "PPPoE";
		if(_llc == "1")
			return ['EoA', 'PPP', 'LLC'];
		else
			return ['EoA', 'PPP', 'VCMUX'];
	}
}


//setService Name
function setServiceName(arr_Info){
	var namePrefix = G_ConnType;
	var index = Number(G_WanIndex) + 1;
	return namePrefix + '_0_' +index;
}


//完成
function uiFinish(){
	//PPP类型不允许用户名和密码为秿
	$('WIZ012').disabled = true;
	$('WIZ013').disabled = true;
	$('WIZ034').disabled = true;
	$('WIZ035').disabled = true;
	$('WIZ018').disabled = true;
	$('WIZ019').disabled = true;

	

	if(G_auto_Encap == ""){
		var _encap = findEncapByctISP("encap");
	}
	else{ 
			if (auto_LinkType == ""){
				_encap =  "PPPoE" + G_auto_Encap;//没有搜索到就默认为PPPoE	
			}else{
				_encap =  auto_LinkType + G_auto_Encap;	
			}
	}
	var _info = checkConnType(_encap);
	if(_info == "PPPoE"|| _info == "PPPoA"){
		if($('INPUT_Username').value == "" || $('INPUT_Password').value == ""){
			alert(SEcode[1014]);
		  return false;
		}
	}
//	else if (_info == "IPoA"){
//		if($('INPUT_v4IPAddress').value == "" || $('INPUT_v4Mask').value == "" || $('INPUT_v4GW').value == "" || $('INPUT_v4Pridns').value == "" || $('INPUT_v4Secdns').value == "" ){
//			alert(SEcode[1014]);
//		  return false;
//		}
//	}

	if (G_WANConn.length == 0){
		addNewWanConnection();
	}else{
		createRemoveForm(G_WANConn.shift())
		var _url = "/cgi-bin/webproc";
		ajax = Ajax.getInstance(_url, "", 0, ajax_Proc);
		ajax.post($('uiPostForm'));	
	}

}
//关闭
function uiClose(){
	$H({
	   	"obj-action" 	: "set",
		"getpage" 		: "html/index.html",
		"errorpage" 	: "html/index.html",
		"var:menu" 		: "home",
		"var:page" 		: "Hom_status"
	}, true);
		
	$('uiPostForm').submit();
}

function ajax_Proc(_text){
	try{
		eval(_text);
	} catch (ex){
		G_Error == '1'
		return false;
	}
	
	/* ajax no error, continue process( remove old wan connection or add new wan connection) */
	if (G_Error == '0'){
		/* if G_WANConn.length != 0, mean still has wan connection not del */
		if(G_WANConn.length > 0){
			createRemoveForm(G_WANConn.shift())
			var _url = "/cgi-bin/webproc";
			ajax = Ajax.getInstance(_url, "", 0, ajax_Proc);
			ajax.post($('uiPostForm'));	
		}else{
			/* old wan connection has deleted clean, add new connection which auto search now. */
			addNewWanConnection();
		}

	} else if(G_Error == '1'){
		dealWithError();
		document.location.href = '/cgi-bin/webproc?getpage=html/index.html&var:menu=wizard&var:page=Wiz_wizard';
	}
}


/*  create delete form */
function createRemoveForm(wanConnPath){
	$H({
		'mid'           : '0430',
		'del-obj'       : wanConnPath,
		'obj-action'    : 'del',
		'var:menu'      : G_Menu,
		'var:page'      : G_Page,
		'var:errorpage' : G_Page,
		'getpage'       : 'html/js/global.js'		/* get global.js for error check*/
	},true);
	//$('uiPostForm').submit();
}

function addNewWanConnection(){
	if(auto_PVC == ""){
			var _vpc = findEncapByctISP("pvc");
	}
	else {
		var _vpc = "PVC:" + auto_PVC;
	}
	
	if(G_auto_Encap == ""){
		var _encap = findEncapByctISP("encap");
	}
	else{ 
			if (auto_LinkType == ""){
				_encap =  "PPPoE" + G_auto_Encap;//没有搜索到就默认为PPPoE	
			}else{
				_encap =  auto_LinkType + G_auto_Encap;	
			}
	}
	var _info = findInfoByEncap(_encap);

	//创建 IP(DHCP) or PPPoE or PPPoA
	$H({
		"obj-action" 		: "set",
		"getpage" 		: "html/index.html",
		"errorpage" 		: "html/index.html",
		'var:finish'    	: "1",
		"var:menu" 		: G_Menu,
		"var:page" 		: G_Page,
		"var:errorpage" 	: G_Page
	}, true);
	//路径
	var DevicePath, ConnPath;
	//编辑wan
	//ATM路径
	/*
	DevicePath = G_WAN[0][0];
	//判断连接类型是否更改
	if(G_WANConn[0][0] && G_WANConn[0][0].indexOf(_info[1]) > -1){
		ConnPath = G_WANConn[0][0];
	}else{
		if(_info[1] == "undefined"){
			_info[1] = 'PPP';
		}
		ConnPath = G_WANConn[0][0].replace(_info[1] == 'PPP' ? 'IP' : 'PPP', _info[1]);
		$F('mid','0438');
		$F(":" + ConnPath + "X_TWSZ-COM_ConnectionMode", G_WANConn[0][0].indexOf('IP') > 0 ? 'IP' : 'PPP');
	}
	*/
		
		
	DevicePath = "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.0.";
	ConnPath = DevicePath + 'WAN' + _info[1] + 'Connection.0.';
	$F('mid','0438');
	$F(":" + ConnPath + "X_TWSZ-COM_ConnectionMode", _info[1]);
	
	$F(":" + DevicePath + "X_TWSZ-COM_DSLType", 				'ATM');
	$F(":" + DevicePath + "X_TWSZ-COM_VLANID", 				G_ConnType != "IPoA" ? "0" : undefined);
	$F(":" + DevicePath + "X_TWSZ-COM_VLANPriority", 	G_ConnType != "IPoA" ? "0" : undefined);
	//status/vpivci/QoS
	$F(":" + DevicePath + "WANDSLLinkConfig.Enable", 			"1");
	$F(":" + DevicePath + "WANDSLLinkConfig.DestinationAddress", 		_vpc);
	$F(":" + DevicePath + "WANDSLLinkConfig.ATMQoS", 					'UBR');
	$F(":" + DevicePath + "WANDSLLinkConfig.ATMPeakCellRate", 			'0');
	$F(":" + DevicePath + "WANDSLLinkConfig.ATMSustainableCellRate", 	'0');
	$F(":" + DevicePath + "WANDSLLinkConfig.ATMMaximumBurstSize", 		'0');
	$F(":" + DevicePath + "WANDSLLinkConfig.ATMEncapsulation", 		_info[2]);
	$F(":" + DevicePath + "WANDSLLinkConfig.LinkType", 			_info[0]);	//EoA/IPoA/PPPoA
	//IP common
	$F(":" + ConnPath + "Enable", 						'1');
	$F(":" + ConnPath + "Name", 						setServiceName(_info));	//新增时需要下发生成的Name
	$F(":" + ConnPath + "X_TWSZ-COM_ProtocolType", 		'IPv4');
	$F(":" + ConnPath + "X_TWSZ-COM_ServiceList", 		'Internet');
	$F(":" + ConnPath + "NATEnabled", 					'1');
	$F(":" + ConnPath + "X_TWSZ-COM_NATType", 	"symmetric");
	$F(":" + ConnPath + "ConnectionType", 		"IP_Routed");
	
	
		switch(G_ConnType){
		case "DHCP" :
		    $F(":" + ConnPath + "DNSOverrideAllowed", 	"0");
		    $F(":" + ConnPath + "AddressingType", 		G_ConnType);	
		  	break;
		case "Bridge" :
		    $F(":" + ConnPath + "ConnectionType", 		"IP_Bridged");
		    break;
    case "IPoA" :
//    	   alert(_info);
        $F(":" + ConnPath + "ConnectionType", 		"IP_Routed");
        $F(":" + ConnPath + "AddressingType", 		"Static");	
				var _dnsservers = $('INPUT_v4Pridns').value+','+$('INPUT_v4Secdns').value;
				$F(":" + ConnPath + "ExternalIPAddress", 	$('INPUT_v4IPAddress').value);
				$F(":" + ConnPath + "SubnetMask", 		$('INPUT_v4Mask').value);
				$F(":" + ConnPath + "DefaultGateway", 		$('INPUT_v4GW').value);
				$F(":" + ConnPath + "DNSServers", 		_dnsservers.delcomma());
				$F(":" + ConnPath + "DNSOverrideAllowed", 	"0");
	      break;
		case "PPPoE" :
		case "PPPoA" :
			$F(":" + ConnPath + "Username", 		$('INPUT_Username').value);
			$F(":" + ConnPath + "Password", 		$('INPUT_Password').value != '**********' ? $('INPUT_Password').value : undefined);
			$F(":" + ConnPath + "PPPAuthenticationProtocol", "Auto");

			$F(":" + ConnPath + "ConnectionTrigger", 	G_PPPoE_ConnType );
			$F(":" + ConnPath + "IdleDisconnectTime", 	G_PPPoE_ConnType == "OnDemand" ? G_PPPoE_DemandTime : undefined);
			$F(":" + ConnPath + "MaxMRUSize", 		"1492");
			$F(":" + ConnPath + "MaxMTUSize", 		"1492");
			$F(":" + ConnPath + "PPPLCPEcho", 		"30");
			$F(":" + ConnPath + "PPPLCPEchoRetry", 		"0");
			$F(":" + ConnPath + "X_TWSZ-COM_StaticIPAddress", "");	
			if(G_ISP_DNS){
				$F(":" + ConnPath + "DNSOverrideAllowed", "1" );	
				$F(":" + ConnPath + "X_TWSZ-COM_UsrDNSServers", G_ISP_DNS );	
			}
			else{
			    $F(":" + ConnPath + "DNSOverrideAllowed", "0" );
			}

			break;
		
		default :
			;
	}
	//alert(_info);
	
	$('uiPostForm').submit();
}

//Manual wan
function uiManual(){	
	$H({
	   	"obj-action" 		: "set",
		"getpage" 		: "html/index.html",
		"errorpage" 		: "html/index.html",
		"var:action" 		: "0",
		"var:menu" 		: "basic",
		"var:page" 		: "Bas_wansum",
		'var:subpage' 		: "Bas_wan",
		"var:errorpage" 	: "Bas_wan",
		"var:CacheLastData" 	: ViewState.Save()
	}, true);
		
	$('uiPostForm').submit();
}

//错误处理函数
function dealWithError(){
	if (G_Error != 1){ 
		return false;
	}
	var arrayHint = [];
	dealErrorMsg(arrayHint, G_Error_Msg);
}
//监听加载与错误处理函擿
addListeners(uiOnload, dealWithError);
