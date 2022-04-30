/*  JavaScript Document  */

var G_Enable = "<?get :InternetGatewayDevice.X_TWSZ-COM_Logger.LoggerEnabled?>";

//初始化
function uiOnload(){
	//赋值
	Form.Checkbox("CHB_Enable", G_Enable);
	
	if(G_Enable == "1"){
		$("tb_logview").style.display = "";
		//获取日志信息
		var _url = "/cgi-bin/webupg";
		ajax = Ajax.getInstance(_url, "", 0, processResult);
		ajax.post($('uiShowLog'));
	}else{
		$("tb_logview").style.display = "none";
	}
}
//Ajax
function processResult(responseText){
	$('INPUT_LogText').value = responseText;	
}

//提交数据
function uiSubmit(){
	$H({
		':InternetGatewayDevice.X_TWSZ-COM_Logger.LoggerEnabled' : Form.Checkbox('CHB_Enable'),
	   	"obj-action" 		: "set",
		"getpage" 		: "html/index.html",
		"errorpage" 		: "html/index.html",
		"var:menu" 		: G_Menu,
		"var:page" 		: G_Page,
		"var:errorpage" 	: G_Page,
		"var:CacheLastData" 	: ViewState.Save()
	}, true, 'uiPostForm');
	$('uiPostForm').submit();
}

//清除
function uiClear(){
	$H({
		':InternetGatewayDevice.X_TWSZ-COM_Logger.LogClearTrigger' : "1",
	   	"obj-action" 		: "set",
		"getpage" 		: "html/index.html",
		"errorpage" 		: "html/index.html",
		"var:menu" 		: G_Menu,
		"var:page" 		: G_Page,
		"var:errorpage" 	: G_Page,
		"var:CacheLastData" 	: ViewState.Save()
	}, true, 'uiPostForm');
	$('uiPostForm').submit();
}

//保存
function uiSave(){
	$('uiDownloadLog').submit();
}

//错误处理函数
function dealWithError(){
	if (G_Error != 1){ 
		return false;
	}
	var arrayHint = [];
	dealErrorMsg(arrayHint, G_Error_Msg);
}
//监听加载与错误处理函数
addListeners(uiOnload, dealWithError);