YUI.add('xpathjs-vendor-config', function (Y) {
	
	// library configuration
	var libs = [];
	
	Y.namespace("XPathJS.Test.Vendor").getAll = function() {
		return libs;
	}
	
	Y.namespace("XPathJS.Test.Vendor").getByIndex = function(index) {
		return libs[index];
	}
	
	libs.push({
		name: "XpathJS",
		link: "https://github.com/andrejpavlovic/xpathjs",
		scripts: [
			"../dist/xpathjs.min.js"
			//"../src/engine.js",
			//"../dist/parser.js"
		],
		initFn: function(win, options) {
			var bindingOptions = {};
			
			if (options.quasiXpath) {
				// assume id not belonging to a namespace, is a unique id as defined by spec
				bindingOptions['unique-ids'] = {
					'' : 'id'
				}
			}
			
			win.XPathJS.bindDomLevel3XPath(
				win.XPathJS.createDomLevel3XPathBindings(bindingOptions)
			);
		},
		createExpression: function(win, expression, resolver) {
			return win.document.createExpression.call(document, expression, resolver);
		},
		evaluateExpression: function(win, expression, contextNode, type, result) {
			return expression.evaluate(contextNode, type, result);
		},
		evaluate: function(win, expression, contextNode, resolver, type, result) {
			return win.document.evaluate(expression, contextNode, resolver, type, result);
		}
	});
	
	// include native support benchmark, only if available
	if (document.evaluate)
	{
		libs.push({
			name: "Native",
			scripts: [
				"../benchmark/js/dummy.js"
			],
			evaluate: function(win, expression, contextNode, resolver, type, result) {
				return win.document.evaluate(expression, contextNode, resolver, type, result);
			}
		});
	}
	
	libs.push({
		name: "Wicked Good XPath",
		link: "https://code.google.com/p/wicked-good-xpath/",
		scripts: [
			"../benchmark/vendor/wicked-good-xpath/wgxpath.install.js"
		],
		initFn: function(win, options) {
			win.wgxpath.install(win);
		},
		evaluate: function(win, expression, contextNode, resolver, type, result) {
			return win.document.evaluate(expression, contextNode, resolver, type, result);
		}
	});
	
	libs.push({
		name: "JavaScript-XPath",
		link: "http://coderepos.org/share/wiki/JavaScript-XPath",
		scripts: [
			"../benchmark/vendor/javascript-xpath/javascript-xpath-0.1.12-cmp.js"
		],
		evaluate: function(win, expression, contextNode, resolver, type, result) {
			return win.document.evaluate(expression, contextNode, resolver, type, result);
		}
	});
	
	libs.push({
		name: "Llama Lab's XPath.js",
		link: "http://llamalab.com/js/xpath/",
		scripts: [
			"../benchmark/vendor/llamalab/Array.js",
			"../benchmark/vendor/llamalab/XPath.min.js"
		],
		evaluate: function(win, expression, contextNode, resolver, type, result) {
			return win.document.evaluate(expression, contextNode, resolver, type, result);
		}
	});
	
	libs.push({
		name: "Google AJAXSLT",
		link: "http://code.google.com/p/ajaxslt/",
		scripts: [
			"../benchmark/vendor/google-ajaxslt/util.js",
			"../benchmark/vendor/google-ajaxslt/xmltoken.js",
			"../benchmark/vendor/google-ajaxslt/dom.js",
			"../benchmark/vendor/google-ajaxslt/xpath.js"
		],
		evaluate: function(win, expression, contextNode, resolver, type, result) {
			var nl = win.xpathEval(expression, new win.ExprContext(contextNode));
			nl.snapshotLength = nl.value.length;
			nl.snapshotItem = function (i) { return this.value[i] };
			return nl;
		}
	});
	
	libs.push({
		name: "Cameron McCormack",
		link: "http://mcc.id.au/xpathjs",
		scripts: [
			"../benchmark/vendor/mccormack/xpath.js"
		],
		initFn: function(win) {
			win.xpathParser = new win.XPathParser();
		},
		evaluate: function(win, expression, contextNode, resolver, type, result) {
			var xpath = win.xpathParser.parse(expression);
			var context = new win.XPathContext();
			context.expressionContextNode = contextNode;
			var result =  xpath.evaluate(context);
			var nodes = result.toArray();
			nodes.snapshotLength = nodes.length;
			return nodes;
		}
	});
	
}, '0.0.1', {
	requires: []
});
