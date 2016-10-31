/**
	modalFormTool v1.0.0
	基于jquery和bootstrap3

	Copyright 2016.10.20
    author 游玩的兔子
*/
;(function($, window, document, undefined){
	

	/**
	 * 创建表单单个条目的父类
	 */
	function FormItem(options){
		this.options = options;
		this.value = '';
		this.verify = true;
		this.$this = null;
	}

	FormItem.prototype.create = function($form, index)
	{
		this.index = index;
		$item = $('<div class="form-group"></div>');
		$content = $(this.createContent());
		$form.append($item);
		$item.append($content);
		this.$this = $item;
	}
	//内容创建类
	FormItem.prototype.createContent = function()
	{
		var content = this.options.content;
		if (typeof(content) == "undefined")
			throw new Error("1:" + this.index);
		return this.options.content;
	}

	//设置取值
	FormItem.prototype.setValue = function(value)
	{
		this.value = value;
	}

	//取出单项的值
	FormItem.prototype.getValue = function()
	{
		return this.value;
	}

	//设置验证结果
	FormItem.prototype.setVerify = function(verify)
	{
		this.verify = verify;
	}

	//获取验证结果
	FormItem.prototype.getVerify = function()
	{
		return this.verify;
	}

	//设置帮助信息
	FormItem.prototype.setHelpMessage = function(message)
	{
		this.$this.find('span.help-block').html(message);
	}

	//验证方法
	FormItem.prototype.verifyFunction = function(inputString){
		return true;
	}

	//设置反馈时 类的变化
	FormItem.prototype.setFeedbackClass = function(status)
	{
		//清空之前的设置
		$children = this.$this.children('div');
		for (var key in this.options.feedbackClass) {
			$children.removeClass(eval("this.options.feedbackClass."
				+ key));
		}
		//设置新的
		var feedbackClass = 
			eval("this.options.feedbackClass." + status);
		if (typeof(feedbackClass) == "undefined")
			throw new Error("3:第" + this.index +"项的feedbackClass中不存在"+status+"状态");
		$children.addClass(feedbackClass);
	}

	//设置反馈时 图标的变化
	FormItem.prototype.setFeedbackIcon = function(status)
	{
		$children = this.$this.children('div');
		//清空图片设置
		$span = $children.find('span.form-control-feedback');
		for (var key in this.options.feedbackIcon) {
			$span.removeClass(eval("this.options.feedbackIcon."
				+ key));
		}
		var feedbackIcon = 
			eval("this.options.feedbackIcon." + status);
		if (typeof(feedbackIcon) == "undefined")
			throw new Error("3:第" + this.index +"项的feedbackIcon中不存在"+status+"状态");
		$span.addClass(feedbackIcon);
	}

	//设置反馈状态
	FormItem.prototype.setFeedbackStatus = function(status)
	{
		this.setFeedbackClass(status);
		this.setFeedbackIcon(status);
		this.setHelpMessage(eval("this.options.helpMessage."
			+ status));
	}

	//获取当前对象类型
	FormItem.prototype.getType = function()
	{
		return this.options.type;
	}

	/**
	 * 单行文本表单项的对象
	 * @param {[type]} options 创建所需参数
	 */
	function OneLineTextItem(options)
	{
		FormItem.call(this, options);
		this.value = options.values;
	}

	OneLineTextItem.prototype = new FormItem();

	OneLineTextItem.prototype.createContent = function()
	{
		//创建内容
		var options = this.options;
		//标签创建
		var html = createLabelHelp(options.label, options.labelCol, options.id);
		//内容创建
		html += '<div class="' + options.contentCol + '">';
		html += '<p class="form-control-static">' + options.values + '</p>';
		html += '</div>';
		return html;
	}

	OneLineTextItem.prototype.setValue = function(value)
	{
		//放入value
		this.$this.find('p.form-control-static').html(value);
		this.value = value;
	}

	OneLineTextItem.prototype.setFeedbackStatus = function(status){}

	/**
	 * 多行文本表单项的对象
	 * @param {[type]} options 创建所需参数
	 */
	function MultiLineTextItem(options)
	{
		FormItem.call(this, options);
		this.value = options.values;
	}

	MultiLineTextItem.prototype = new FormItem();

	MultiLineTextItem.prototype.createContent = function ()
	{
		var options = this.options;
		var html = createLabelHelp(options.label, options.labelCol, options.id);
		//内容创建
		html += '<div class="' + options.contentCol + '">';
		html += '<div class="form-control-textarea-static word-wrap">' + options.values + '</div>';
		html += '</div>';
		return html;
	}

	MultiLineTextItem.prototype.setValue = function(value)
	{
		//放入value
		this.$this.find('div.form-control-textarea-static').html(value);
		this.value = value;
	}

	MultiLineTextItem.prototype.setFeedbackStatus = function(status){}

	/**
	 * 单行可输入表单项的对象
	 * @param {[type]} options 创建所需参数
	 */
	function OneLineInputItem(options)
	{
		FormItem.call(this, options);
		this.value = options.values;
	}

	OneLineInputItem.prototype = new FormItem();

	OneLineInputItem.prototype.createContent = function()
	{
		var options = this.options;
		if (typeof(options.params.type) == "undefined") {
			options.params.type = 'text';
		}
		var html = createLabelHelp(options.label, options.labelCol, options.id);

		html += '<div class=" has-feedback ' + options.contentCol + '">';
		
		html += '<input class="form-control" ' + createAttributeHelp(options.params);
		html += ' id="' + options.id +'" ';
		html += ' value="' + this.value +'" />';
		html += '<span class="glyphicon form-control-feedback"></span>';
		html += '<span class="help-block"></span>';
		html += '</div>';
		return html;
	}

	OneLineInputItem.prototype.setValue = function(value)
	{
		this.$this.find('input.form-control').val(value);
		this.value = value;
	}

	OneLineInputItem.prototype.getValue = function()
	{
		var value = this.$this.find('input.form-control').val();
		this.setValue(value);
		return value;
	}

	//获取可输入对象的jquery对象
	OneLineInputItem.prototype.getInputContent = function()
	{
		return this.$this.find('input.form-control');
	}

	/**
	 * 多行可输入表单项的对象
	 * @param {[type]} options 创建所需参数
	 */
	function MultiLineInputItem(options)
	{
		FormItem.call(this, options);
		this.value = options.values;
	}

	MultiLineInputItem.prototype = new FormItem();

	MultiLineInputItem.prototype.createContent = function()
	{
		var options = this.options;
		var html = createLabelHelp(options.label, options.labelCol, options.id);

		html += '<div class="' + options.contentCol + '">';
		html += '<textarea class="form-control" ' + createAttributeHelp(options.params);
		html += ' id="' + options.id +'">';
		html += this.value+'</textarea>';
		html += '<span class="help-block"></span>';
		html += '</div>';
		return html;
	}

	MultiLineInputItem.prototype.setValue = function(value)
	{
		this.$this.find('textarea.form-control').val(value);
		this.value = value;
	}

	MultiLineInputItem.prototype.getValue = function()
	{
		var value = this.$this.find('textarea.form-control').val();
		this.setValue(value);
		return value;
	}

	MultiLineInputItem.prototype.setFeedbackStatus = function(status)
	{
		this.setFeedbackClass(status);
		this.setHelpMessage(eval("this.options.helpMessage."
			+ status));
	}

	//获取可输入对象的jquery对象
	MultiLineInputItem.prototype.getInputContent = function()
	{
		return this.$this.find('textarea.form-control');
	}
	/**
	 * 下拉选择框表单项的对象
	 * @param {[type]} options 创建所需参数
	 */
	function SingleSelectItem(options)
	{
		FormItem.call(this, options);
	}

	SingleSelectItem.prototype = new FormItem();

	SingleSelectItem.prototype.createContent = function()
	{
		var options = this.options;
		var html = createLabelHelp(options.label, options.labelCol, options.id);
		html += '<div class="' + options.contentCol + '">';
		html += '<select class="form-control" ' + createAttributeHelp(options.params);
		html += ' id="' + options.id +'">';
		for (var value in options.values) {
			html += '<option value="' + value + '"">' + options.values[value] + '</option>';
		}
		html += '</select>';
		html += '<span class="help-block"></span>';
		html += '</div>';
		return html;
	}

	SingleSelectItem.prototype.setValue = function(value)
	{
		this.$this.find('select.form-control').val(value);
		this.value = value;
	}

	SingleSelectItem.prototype.getValue = function()
	{
		var value = this.$this.find('select.form-control').val();
		this.setValue(value);
		return value;
	}

	SingleSelectItem.prototype.setFeedbackStatus = function(status)
	{
		this.setFeedbackClass(status);
		this.setHelpMessage(eval("this.options.helpMessage."
			+ status));
	}
	
	//获取可输入对象的jquery对象
	SingleSelectItem.prototype.getInputContent = function()
	{
		return this.$this.find('select.form-control');
	}
	//帮助创建label标签
	function createLabelHelp(label, width, id)
	{
		var html = '<label class="control-label ';
		html += (width + '" for="');
		html += (id + '">');
		html += (label + '</label>');
		return html;
	}

	function createAttributeHelp(params)
	{
		//开始创建
		var paramStr = "";
		for (var key in params) {
			paramStr += key + '="' + params[key] + '" ';
		}
		return paramStr;
	}

	function createFeedback(object) 
	{
		var $input = object.getInputContent();
		$input.focus(function(event) {
			//焦点存在时
			object.setFeedbackStatus("default");
		});
		$input.blur(function(){
			//获取值
			var value = object.getValue();
			//进行验证
			var status = object.verifyFunction(value);
			//如果返回的是true 或 false 则进行置换
			//否则 直接使用返回值作为status
			if (typeof(status) == "boolean"){
				status = status?"success":"error";
			}
			if (status == "success")
				object.setVerify(true);
			else
				object.setVerify(false);
			//开始反馈
			object.setFeedbackStatus(status);
		});
	}
	//modalFormTool 默认配置
	var defaultOptions = {
		"allLabelCol": 'col-sm-3',
		"allContentCol": 'col-sm-9',
		'hasFeedback':false,
		"feedbackClass":{
			"success":'has-success',
			"warning":'has-warning',
			"error":'has-error',
			"default":""
		},
		"feedbackIcon":{
			"success":'glyphicon-ok',
			"warning":'glyphicon-warning-sign',
			"error":'glyphicon-remove',
			"default":""
		},
		"formContents":[],
		"overwriteFunctions":[]
	};

	//form中单独一项的可配置项
	var voidItemOptions = {
		'type':'',
		'label':'',
		'id':'',
		'labelCol':'',
		'contentCol':'',
		'values':'',
		'feedbackClass':{},
		'feedbackIcon':{},
		'helpMessage':{
			"default":""
		},
		'params':{}
	}
	//类型到对象名的映射
	var TYPE_MAP = [];
		TYPE_MAP['oneLineText'] = 'OneLineTextItem';
		TYPE_MAP['multiLineText'] = 'MultiLineTextItem';
		TYPE_MAP['oneLineInput'] = 'OneLineInputItem';
		TYPE_MAP['multiLineInput'] = 'MultiLineInputItem';
		TYPE_MAP['singleSelect'] = 'SingleSelectItem';
		TYPE_MAP['other'] = 'FormItem';

	var ModalFormTool = {
		/**
		 * 单个表单的创建
		 * @param  {jquery对象} $form  所创建的form的对象
		 * @param  {string} formId form的id名
		 * @param  {object} opt    创建对象所需要的参数
		 * @return {jquery对象}        用于jquery的链式操作
		 */
		create: function($form, formId ,opt)
		{
			//获取配置参数
			var options = $.extend(true,{}, defaultOptions, opt);
			//单个创建
			var defaultItemOptions = {
				'labelCol':options.allLabelCol,
				'contentCol':options.allContentCol,
				'feedbackClass':options.feedbackClass,
				'feedbackIcon':options.feedbackIcon
			}
			$.fn.modalFormToolValues[formId] = new Array();
			for (var item in options.formContents) {
				//单个对象参数
				var itemOptions = $.extend(true,{},
						voidItemOptions,
				 		defaultItemOptions,
				 		options.formContents[item]);
				//获取类型
				var type = itemOptions.type;
				var itemName = TYPE_MAP[type];
				//type不存在错误
				if (typeof(itemName) == "undefined") 
					throw new Error("0:"+type);
				var object = null;
				//创建单个对象
				eval("object = new " + itemName + "(itemOptions)");
				object.create($form, item);
				$.fn.modalFormToolValues[formId][item] = object;
			}
			//自定义方法重写
			for (var key in options.overwriteFunctions) {
				//获取单个参数对象
				var itemFunctions = options.overwriteFunctions[key];
				var index = parseInt(itemFunctions.index);
				//判断索引是否超出范围
				if (typeof($.fn.modalFormToolValues[formId][index]) == "undefined")
					throw new Error("2:"+itemFunctions.index);
				//开始重写方法
				delete itemFunctions.index;
				for (var funcName in itemFunctions) {
					eval("$.fn.modalFormToolValues[formId][index]."
						+ funcName + " = " + itemFunctions[funcName]);
				}
			}

			//是否开启反馈， 只有默认为Input的类型才进行反馈
			//判断输入是否为boolean
			if (typeof(options.hasFeedback) != "boolean")
				throw new Error('5:' + options.hasFeedback);

			if (options.hasFeedback){
				for (var key in $.fn.modalFormToolValues[formId]) {
					var type = $.fn.modalFormToolValues[formId][key].getType();
					if (type == "oneLineInput" || type == "multiLineInput" || type == "singleSelect")
						createFeedback($.fn.modalFormToolValues[formId][key]);
				}
			}
			return $form;
		},
		/**
		 * 给form中的表单项赋值
		 * @param  {jquery对象} $form  所创建的form的对象
		 * @param  {string} formId form的id名
		 * @param {object} params 所需要进行赋值的项和所赋的值
		 * eg:{0:value,1:value}
		 * 索引从0开始计数
		 */
		setValues: function($form, formId, params)
		{

			//params 为赋值内容 [0:11,1:22];
			for (var index in params) {
				var object = $.fn.modalFormToolValues[formId][index];
				if (typeof(object) == "undefined")
					throw new Error("2:" + index);
				object.setValue(params[index]);
			}
			return $form;
		},
		/**
		 * 获取表单中项的值
		 * @param  {jquery对象} $form  所创建的form的对象
		 * @param  {string} formId form的id名
		 * @return {Array}        表单中各项的值
		 * eg:[value1, value2, value3]
		 */
		getValues: function($form, formId)
		{

			var result = new Array();
			for (var index in $.fn.modalFormToolValues[formId]) {
				result[index] = 
					$.fn.modalFormToolValues[formId][index].getValue();
			}
			return result;
		},
		/**
		 * 设置额外显示信息
		 * @param  {jquery对象} $form  所创建的form的对象
		 * @param  {string} formId form的id名
		 * @param {object} params 所需要进行赋值的项和所赋的值
		 * eg:{0:message,1:message}
		 * ps:有的类型的表单项无helpMessage选项如 oneLineText, multiLineText
		 * 就算给其赋值也无显示
		 */
		setHelpMessage:function($form, formId, params){

			//params [a:"sss"];
			for (var index in params) {
				var object = $.fn.modalFormToolValues[formId][index];
				if (typeof(object) == "undefined")
					throw new Error("2:" + index);
				object.setHelpMessage(params[index]);
			}
			return $form;
		},
		/**
		 * 设置反馈状态 可以设置为成功输入或输入错误的显示
		 * @param  {jquery对象} $form  所创建的form的对象
		 * @param  {string} formId form的id名
		 * @param {object} params 所需要进行赋值的项和所赋的值
		 * eg:{0:success, 1:error}
		 * 设置的状态应当与feedbackClass,feedbackIcon,helpMessage中的key保持一致
		 * 否则不会产生变化
		 */
		setFeedbackStatus:function($form, formId, params){

			for (var index in params) {
				var object = $.fn.modalFormToolValues[formId][index];
				if (typeof(object) == "undefined")
					throw new Error("2:" + index);
				object.setFeedbackStatus(params[index]);
			}
			return $form;
		},
		/**
		 * 获取验证结果，纯文字类型的结果永远为真，
		 * 可输入项的结果，根据输入的verifyFunction来判断输入的内容
		 * 是否正确。如果所有的表单项都为真则返回真，否则返回假
		 * @param  {jquery对象} $form  所创建的form的对象
		 * @param  {string} formId form的id名
		 * @return {boolean}        表单中各项输入是否全为真
		 */
		getVerifyResult:function($form, formId){

			var result = true;
			for (var index in $.fn.modalFormToolValues[formId]) {
				result = result &&
					$.fn.modalFormToolValues[formId][index].getVerify();
			}
			return result;
		},
		/**
		 * 设置单项的验证结果
		 * @param  {jquery对象} $form  所创建的form的对象
		 * @param  {string} formId form的id名
		 * @param {object} params  所需要进行赋值的项和所赋的值
		 * eg: {0:true, 1:false}
		 */
		setVerify:function($form, formId, params){

			for (var index in params) {
				var object = $.fn.modalFormToolValues[formId][index];
				if (typeof(object) == "undefined")
					throw new Error("2:" + index);
				if (typeof(params[index]) != "boolean")
					throw new Error("4:第" + index + "项中"+params[index]+"不是布尔值");
				object.setVerify(params[index]);
			}
			return $form;
		}
	};
	/**
	 * [modalFormToolValues 存储每个表单中的各项信息
	 * @type {Array}
	 * [ 表单id => 表单内容对象的数组, ]
	 */
	$.fn.modalFormToolValues = new Array();

	/**
	 * 对外操作接口
	 * @param  {string} method 进行操作的方法，可选项为ModalFormTool中的各个操作
	 * create,	setValues,	getValues,	setHelpMessage
	 * setFeedbackStatus,	getVerifyResult,	setVerify
	 * @param  {object} params 输入的参数，在采用不同的方法时，使用不同的参数
	 * @return {mixed}        当为set或create等时返回jquery对象，当为get时返回获取的值
	 */
	$.fn.modalFormTool = function(method, params)
	{
		var result = null;
		var formId = '';
		formId = this.eq(0).attr('id');
		try {
			var evalString = "result = ModalFormTool." + method + "(this, formId, params)"; 
			eval(evalString);
		}
		catch (error) {
			//错误处理
			var message = error.message;
			var pos = message.indexOf(":");
			var errorCode = parseInt(message.substring(0,pos));
			var errorMsg = message.substring(pos+1,message.length);
			console.log(error.message + " " + error.name);
			alert("errorCode:" + errorCode + " errorMsg:"+errorMsg);
		}
		return result;
	}
})(window.jQuery, window, document);



