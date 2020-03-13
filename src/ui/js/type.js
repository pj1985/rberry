/**
 *	Copyright (c) 2019 pj1985 
 *	
 *	This code is part of the Raspberry framework (https://github.com/pj1985/rberry)
 *	
 *	You can redistribute it and/or modify it under the terms of the GNU General Public License
 *	as published by the Free Software Foundation, either version 3 of the License, or later.
 *	
 *	You should have received a copy of the GNU General Public License along
 *	with Raspberry.  See http://www.gnu.org/licenses/
 *	
 *	Types of elements and attributes, that can be configured via screen creator. Attributes defined in "common" are
 *	configurable in all elements.
 *	
 *	Attribute parameters:
 *	type - type of field for attribute configuration : text, textarea, select, color
 *	label - label for field
 *	tooltip - text defined as help for the configuration
 *	mandatory - mandatory field
 *	default - default value for field
 *	tab - in which the field will be shown
 *	helper - context helper (right click) defined for the field: context-input, context-button, context-page, context-css-text, context-css-flex, context-permission, context-fa, context-element, context-modal
 *	
*/
var j_type = {
	"common":{
		"label":{
			"type":"text",
			"label":"Label",
			"tooltip":"Label defined for element. You can include input values with {{ i_input }} syntax.",
			"mandatory":"",
			"default":"",
			"tab":"Common",
			"helper":"context-input"
		},
		"label_class":{
			"type":"text",
			"label":"Label Class",
			"tooltip":"Bootstrap CSS class used for label",
			"mandatory":"",
			"default":"",
			"tab":"Common",
			"helper":"context-css-text"
		},
		"col":{
			"type":"select",
			"values":["", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
			"label":"Column span",
			"tooltip":"Columns span of element 1-12. Not usable when using flex system.",
			"mandatory":"",
			"default":"",
			"tab":"Layout"
		},		
		"small":{
			"type":"select",
			"label":"Small",
			"values":["N", "Y"],
			"tooltip":"Smaller text",
			"mandatory":"",
			"default":"",
			"tab":"Common"
		},
		"tooltip":{
			"type":"text",
			"label":"Tooltip",
			"tooltip":"Tooltip for element shown on mouse over.",
			"mandatory":"",
			"default":"",
			"tab":"Common"
		},		
		"margin":{
			"type":"select",
			"values":["", "0", "1", "2", "3", "4", "5", "auto"],
			"label":"Margin",
			"tooltip":"",
			"mandatory":"",
			"default":"",
			"tab":"Layout"
		},	
		"bg_color":{
			"type":"select",
			"values":["", "primary", "secondary", "success", "danger", "warning", "info", "light", "dark"],
			"label":"Background color",
			"tooltip":"",
			"mandatory":"",
			"default":"",
			"tab":"Common"
		},	
		"shadow":{
			"type":"select",
			"values":["", "shadow", "shadow-sm", "shadow-lg"],
			"label":"Component shadow",
			"tooltip":"",
			"mandatory":"",
			"default":"",
			"tab":"Common"
		},			
		"padding":{
			"type":"select",
			"values":["", "0", "1", "2", "3", "4", "5", "auto"],
			"label":"Padding",
			"tooltip":"",
			"mandatory":"",
			"default":"2",
			"tab":"Layout"
		},
		"flex_width":{
			"type":"select",
			"values":["", "25", "50", "75", "100"],
			"label":"Width (flex)%",
			"tooltip":"",
			"mandatory":"",
			"default":"",
			"tab":"Layout"
			 
		 },
		 "flex_height":{
			"type":"select",
			"values":["", "25", "50", "75", "100"],
			"label":"Height (flex)%",
			"tooltip":"",
			"mandatory":"",
			"default":"",
			"tab":"Layout"
			 
		 },	
		"float":{
			"type":"select",
			"values":["", "float-left", "float-right"],
			"label":"Float",
			"tooltip":"Float an element to the left or right",
			"mandatory":"",
			"default":"",
			"tab":"Layout"
			 
		 },			 
		"class":{
			"type":"text",
			"label":"Class",
			"tooltip":"Add CSS class to element (Bootstrap class)",
			"mandatory":"",
			"default":"",
			"tab":"Common",
			"helper":"context-css-text"
		},		
		"show_if":{
			"type":"select",
			"values":["", "SQL", "Javascript", "Never"],
			"label":"Show Component If",
			"tooltip":"For SQL - if select returns any rows. Can contain binded variables. Rejected components are not rendered (condition is tested on page render). For JS - if condition. Element is rendered, but have class d-none, so is not visible. Never - component is never rendered.",
			"mandatory":"",
			"default":"",
			"tab":"Conditions"
		},		
		"show_if_txt":{
			"type":"textarea",
			"label":"Show Component If",
			"tooltip":"SQL Select or Javascript condition (if ..)",
			"mandatory":"",
			"default":"",
			"tab":"Conditions"
		},		
		"read_if":{
			"type":"select",
			"values":["", "SQL", "Javascript", "Always"],
			"label":"Read Only Component If",
			"tooltip":"For SQL - if select returns any rows. Can contain binded variables. For JS - if condition. Always - component is always read-only.",
			"mandatory":"",
			"default":"",
			"tab":"Conditions"
		},		
		"read_if_txt":{
			"type":"textarea",
			"label":"Read Only Component If",
			"tooltip":"SQL Select or Javascript condition (if ..)",
			"mandatory":"",
			"default":"",
			"tab":"Conditions"
		},
		"permission":{
			"type":"text",
			"label":"Permissions",
			"tooltip":"Coma separated list of permissions",
			"mandatory":"",
			"default":"",
			"tab":"Conditions",
			"helper":"context-permission"
		},
		"badge_text":{
			"type":"text",
			"label":"Text",
			"tooltip":"Badge text",
			"mandatory":"",
			"default":"",
			"tab":"Badge"
		},
		"badge_color":{
			"type":"select",
			"values":["", "primary", "secondary", "success", "danger", "warning", "info", "light", "dark"],
			"label":"Color",
			"tooltip":"Badge color",
			"mandatory":"",
			"default":"",
			"tab":"Badge"
		},
		"doc_act":{
			"type":"textarea",
			"label":"Action Description",
			"tooltip":"What action should be triggered with this component",
			"mandatory":"",
			"default":"",
			"col":"12",
			"tab":"Design"
		},
		"doc_source":{
			"type":"textarea",
			"label":"Source Description",
			"tooltip":"What is data source for this component",
			"mandatory":"",
			"default":"",
			"col":"12",
			"tab":"Design"
		},
		"doc_desc":{
			"type":"textarea",
			"label":"Extended Business Description",
			"tooltip":"Business description important for design (shorter description should be in tooltip)",
			"mandatory":"",
			"default":"",
			"col":"12",
			"tab":"Design"
		},"doc_open":{
			"type":"textarea",
			"label":"Open Points",
			"tooltip":"Open points for this component",
			"mandatory":"",
			"default":"",
			"col":"12",
			"tab":"Design"
		}
		
		
	},
	"div":{
		"border":{
			"type":"select",
			"values":["", "primary", "secondary", "success", "info", "warning", "danger", "light", "dark"],
			"label":"Border color",
			"tooltip":"",
			"mandatory":"",
			"default":"",
			"tab":"Common"
			 
		 },
		 "border_radius":{
			"type":"select",
			"values":["", "rounded", "rounded-circle", "rounded-pill"],
			"label":"Border radius",
			"tooltip":"",
			"mandatory":"",
			"default":"",
			"tab":"Common"
			 
		 },
		"template":{
			"type":"select",
			"values":["", "card", "form-row", "form-group", "jumbotron", "container", "container-fluid", "list-group", "btn-group",  "modal", "carousel", "carousel-item", "collapse"],
			"label":"Template",
			"tooltip":"jumbotron - big box for calling extra attention to some special content or information.<br>card - small container with specific header<br>form-group - Container for form input and label.<br>form-row - Grid system to organize inputs.<br>container/container-fluid - standard containers for other elements<br>list-group - to organize elements in list<br>btn-group - container for organizing buttons<br>modal - container for modal window content. Must be opened (shown) with button (defined in action)<br>carousel - sliding views. carousel div must contain carousel-item divs as childs.<br>collapse - collapsible region useful when you want to hide and show content",
			"mandatory":"",
			"default":"",
			"tab":"Common"
			 
		 },
		 "position":{
			"type":"select",
			"values":["", "fixed-top", "fixed-bottom", "sticky-top"],
			"label":"Specific position",
			"tooltip":"Behavior visible only in run mode (not in screen creator). fixed-top - Position an element at the top of the viewport, from edge to edge<br>fixed-bottom - Position an element at the bottom of the viewport, from edge to edge<br>sticky-top - position an element at the top of the viewport, from edge to edge, but only after you scroll past it",
			"mandatory":"",
			"default":"",
			"tab":"Layout"
			 
		 },
		"flex_align_items":{
			"type":"select",
			"values":["", "start", "end", "center", "baseline", "stretch"],
			"label":"Align items (flex)",
			"tooltip":"Use align-items utilities on flexbox containers to change the alignment of flex items on the cross axis (the y-axis to start, x-axis if flex-direction: column)",
			"mandatory":"",
			"default":"",
			"tab":"Layout"
			 
		 },
		"flex_align_self":{
			"type":"select",
			"values":["", "start", "end", "center", "baseline", "stretch"],
			"label":"Align self (flex)",
			"tooltip":"Use align-self utilities on flexbox items to individually change their alignment on the cross axis (the y-axis to start, x-axis if flex-direction: column)",
			"mandatory":"",
			"default":"",
			"tab":"Layout"
			 
		 },
		"flex_justify_content":{
			"type":"select",
			"values":["", "start", "end", "center", "between", "around", "stretch"],
			"label":"Justify content (flex)",
			"tooltip":"Use justify-content utilities on flexbox containers to change the alignment of flex items on the main axis (the x-axis to start, y-axis if flex-direction: column)",
			"mandatory":"",
			"default":"",
			"tab":"Layout"
			 
		 },
		"flex_grow":{
			"type":"select",
			"values":["", "grow", "shrink"],
			"label":"Grow/Shrink (flex)",
			"tooltip":"Flex item’s ability to grow to fill available space or shrink if necessary",
			"mandatory":"",
			"default":"",
			"tab":"Layout"
			 
		 },
		
		"flex_direction":{
			"type":"select",
			"values":["", "row", "row-reverse", "column", "column-reverse"],
			"label":"Direction (flex)",
			"tooltip":"Set the direction of flex items in a flex container",
			"mandatory":"",
			"default":"",
			"tab":"Layout"
			 
		 },
		"flex":{
			"type":"select",
			"values":["Y", "N"],
			"label":"Flex container",
			"tooltip":"",
			"mandatory":"",
			"default":"",
			"tab":"Layout"
			 
		 } ,
		"carausel_active":{
			"type":"select",
			"values":["", "Y", "N"],
			"label":"Carausel active",
			"tooltip":"Active carausel card. Only applicable for carausel-item template.",
			"mandatory":"",
			"default":"",
			"tab":"Custom"
			 
		 },
		 "collapse_show":{
			"type":"select",
			"values":["", "Y", "N"],
			"label":"Collapse default show",
			"tooltip":"Y - collapse region is shown by default.",
			"mandatory":"",
			"default":"N",
			"tab":"Custom"
			 
		 }
	},
	"button":{
		"color":{
			"type":"select",
			"values":["primary", "secondary", "success", "info", "warning", "danger", "link", "outline-primary"],
			"label":"Color",
			"tooltip":"Button color",
			"mandatory":"",
			"default":"primary",
			"tab":"Common"
		}, 
		"size":{
			"type":"select",
			"values":["", "lg", "sm"],
			"label":"Button size",
			"tooltip":"Size",
			"mandatory":"",
			"default":"",
			"tab":"Common"
		},
		"fa":{
			"type":"text",
			"label":"Icon (FA Class)",
			"tooltip":"Font awesome class",
			"mandatory":"",
			"default":"",
			"tab":"Common",
			"helper":"context-fa"
		},
		"action":{
			"type":"select",
			"values":["", "goto", "refresh", "modal"],
			"label":"Action type",
			"tooltip":"goto - submit page and goto specified page. After processes and checks are executed. If you want to stay on same page (with inputs maintained) put . in goto.<br>refresh - Refresh element (chart, table, data-card)<br>modal - button is used to open modal window.",
			"mandatory":"",
			"default":"",
			"tab":"Action"
		},
		"goto_page":{
			"type":"text",
			"label":"Goto page [goto]",
			"tooltip":"Used for goto action. Goto page after click. You can refresh actual page by putting '.' into field. If no page is specified then button will not submit page. You can get target page from input by putting input name starting with ':' (example :input).",
			"mandatory":"",
			"default":"",
			"tab":"Action",
			"helper":"context-page"
		},
		"mapping":{
			"type":"table",
			"values":["from", "to"],
			"label":"Parameter mapping [goto]",
			"tooltip":"Used for goto action. Mapping of the parameters for page redirect.",
			"mandatory":"",
			"default":"",
			"tab":"Action",
			"helper":"context-input"
		},
		"refresh":{
			"type":"text",
			"label":"Refresh Element [refresh]",
			"tooltip":"Used for refresh action. Refresh table or chart",
			"mandatory":"",
			"default":"",
			"tab":"Action",
			"helper":"context-element"
		},
		"click_js":{
			"type":"textarea",
			"label":"On Click (JS)",
			"tooltip":"Javascript executed on click. Executed in all actions",
			"mandatory":"",
			"default":"",
			"tab":"Action"
		},
		"modal":{
			"type":"text",
			"label":"Open Modal DIV [modal]",
			"tooltip":"Used for modal action. Identification of DIV for modal",
			"mandatory":"",
			"default":"",
			"tab":"Action",
			"helper":"context-modal"
		},
		"ignore_valid": {
			"type":"select",
			"values":["N", "Y"],
			"label":"Ignore general validations [goto]",
			"tooltip":"Ignore validations.",
			"mandatory":"N",
			"default":"",
			"tab":"Action",
		}
	},
	"input text":{
		"subtype":{
			"type":"select",
			"values":["text", "password", "email", "number", "color", "tel", "url", "datetime-local", "date", "month", "time", "week", "search"],
			"label":"Subtype of field",
			"tooltip":"Subtype of the field",
			"mandatory":"",
			"default":"",
			"tab":"Common",			
		},
		"placeholder":{
			"type":"text",
			"label":"Placeholder",
			"tooltip":"Placeholder",
			"mandatory":"",
			"default":"",
			"tab":"Common"
		},
		"mandatory":{
			"type":"select",
			"values":["N", "Y"],
			"label":"Mandatory",
			"tooltip":"Mandatory",
			"mandatory":"",
			"default":"",
			"tab":"Common"
		},
		"get_allowed":{
			"type":"select",
			"values":["N", "Y"],
			"label":"GET Allowed",
			"tooltip":"Input parameter can be used as GET parameter in URL (?parameter=value).",
			"mandatory":"",
			"default":"",
			"tab":"Common"
		},
		"refresh":{
			"type":"text",
			"label":"Refresh Element",
			"tooltip":"Refresh table, data-card or chart on value change. Comma separated list of element IDs (table, data card, chart)",
			"mandatory":"",
			"default":"",
			"tab":"Action",
			"helper":"context-element"
		}
	},
	"input textarea":{
		"rows":{
			"type":"text",
			"label":"Rows",
			"tooltip":"Rows",
			"mandatory":"",
			"default":"3",
			"tab":"Common"
		},
		"mandatory":{
			"type":"select",
			"values":["N", "Y"],
			"label":"Mandatory",
			"tooltip":"Mandatory",
			"mandatory":"",
			"default":"",
			"tab":"Common"
		},
		"refresh":{
			"type":"text",
			"label":"Refresh Element",
			"tooltip":"Refresh table, data-card or chart on value change. Comma separated list of element IDs (table, data card, chart)",
			"mandatory":"",
			"default":"",
			"tab":"Action",
			"helper":"context-element"
		}		
	},
	"input select":{
		"subtype":{
			"type":"select",
			"values":["list",  "sql"],
			"label":"Subtype of field",
			"tooltip":"Subtype of the field",
			"mandatory":"",
			"default":"",
			"tab":"Common"
		},
		"value":{
			"type":"textarea",
			"label":"Values - List (label1:value1,label2:value2), SQL (result must have columns label, value))",
			"tooltip":"values",
			"mandatory":"",
			"default":"",
			"tab":"Common"
		},
		"mandatory":{
			"type":"select",
			"values":["N", "Y"],
			"label":"Mandatory",
			"tooltip":"Mandatory",
			"mandatory":"",
			"default":"",
			"tab":"Common"
		},
		"add_null":{
			"type":"select",
			"values":["N", "Y"],
			"label":"Add Null",
			"tooltip":"Add null value as select option on first place",
			"mandatory":"",
			"default":"Y",
			"tab":"Common"
		},
		"get_allowed":{
			"type":"select",
			"values":["N", "Y"],
			"label":"GET Allowed",
			"tooltip":"Input parameter can be used as GET parameter in URL.",
			"mandatory":"",
			"default":"",
			"tab":"Common"
		},
		"refresh":{
			"type":"text",
			"label":"Refresh Element",
			"tooltip":"Refresh table, data-card or chart on value change. Comma separated list of element IDs (table, data card, chart)",
			"mandatory":"",
			"default":"",
			"tab":"Action",
			"helper":"context-element"
		}
	},
	"input hidden":{
		"get_allowed":{
			"type":"select",
			"values":["N", "Y"],
			"label":"GET Allowed",
			"tooltip":"Input parameter can be used as GET parameter in URL.",
			"mandatory":"",
			"default":"",
			"tab":"Common"
		}
	},
	"text":{
		"subtype":{
			"type":"select",
			"values":["", "h1", "h2", "h3", "h4","h5", "h6"],
			"label":"Heading",
			"tooltip":"Heading",
			"mandatory":"",
			"default":"",
			"tab":"Common"
		},		
		"color":{
			"type":"select",
			"values":["primary", "secondary", "success", "info", "warning", "danger", "light", "dark", "body", "muted", "black-50"],
			"label":"Color",
			"tooltip":"Text color",
			"mandatory":"",
			"default":"",
			"tab":"Common"
		},
		"text":{
			"type":"textarea",
			"label":"Text",
			"tooltip":"Text",
			"mandatory":"",
			"default":"",
			"tab":"Common",
			"col":"12"
		}
	},
	"md_to_html":{
		"color":{
			"type":"select",
			"values":["primary", "secondary", "success", "info", "warning", "danger", "light", "dark", "body", "muted", "black-50"],
			"label":"Color",
			"tooltip":"Text color",
			"mandatory":"",
			"default":"",
			"tab":"Common"
		},
		"text":{
			"type":"textarea",
			"label":"Text",
			"tooltip":"Text",
			"mandatory":"",
			"default":"",
			"tab":"Text",
			"col":"12"
		}
	},
	"table":{
		"color":{
			"type":"select",
			"values":["primary", "secondary", "success", "info", "warning", "danger", "link"],
			"label":"Color",
			"tooltip":"Element color",
			"mandatory":"",
			"default":"",
			"tab":"Common"
		},
		"page":{
			"type":"text",
			"label":"Rows per page",
			"tooltip":"Rows per page",
			"mandatory":"",
			"default":"",
			"tab":"Table"
		},
		"sortable":{
			"type":"select",
			"values":["N", "Y"],
			"label":"Sortable",
			"tooltip":"Sortable columns",
			"mandatory":"",
			"default":"",
			"tab":"Table"
		},
		"autoload":{
			"type":"select",
			"values":["N", "Y"],
			"label":"Autoload data",
			"tooltip":"Automatically load data on page start",
			"mandatory":"",
			"default":"",
			"tab":"Table"
		},
		"select_into":{
			"type":"select",
			"values":["N", "Y"],
			"label":"Select into",
			"tooltip":"Table will have button to store selected row values to input parameters specified in columns->parameter.",
			"mandatory":"",
			"default":"",
			"tab":"Table",
			"helper":"context-fa"
		},
		"select_into_hide":{
			"type":"select",
			"values":["N", "Y"],
			"label":"Select into - hide modal",
			"tooltip":"Hide modal windows after click on the row button",
			"mandatory":"",
			"default":"",
			"tab":"Table"
		},
		"columns":{
			"type":"table",
			"values":["column", "label", "page", "parameter", "value", "icon", "class", "component"],
			"label":"Columns",
			"tooltip":"column - name of the DB column<br>label - header of the column<br>page - when filled with page name, value will be link to specified page<br>parameter - name of the input element in the target page, that will be filled with value of the column<br>value - constatn value, that will replace data from the SQL<br>icon - FA class, that will be used in button, that will replace value from database<br>class - CSS class used to style the column (or component if selected)<br>component - value from the column will be rendered as component:<br>FA (value should be font awesome class)<br>PROGRESS (value should be 0 - 100), YN - values should be Y or N, BADGE - value will be placed in badge (style defined in class)<br>HIGHLIGHT - value should be color (primary, secondary, warning, danger,..) to highlight row. Column is not visible in table.<br>CHART_LINE - value should be comma separated list of numbers (example:13,4,5)<br>CHART_PIE - value should be comma separated list of numbers. Colors are assigned based on position in the list (primary, secondary,..)<br>LONG - long texts are shortened. Full text is in tooltip.",
			"mandatory":"",
			"default":"",
			"tab":"Data",
			"helper":"context-input",
			"col":"12"
		},		
		"SQL":{
			"type":"textarea",
			"label":"SQL",
			"tooltip":"SQL text with bind variables. Without order by clause.",
			"mandatory":"",
			"default":"",
			"tab":"Data",
			"helper":"context-input",
			"col":"12"
		},
		"input":{
			"type":"text",
			"label":"Input column",
			"tooltip":"When filled, check button appears as first column in table and element will be used as input. Value will be set from specified DB column name",
			"mandatory":"",
			"default":"",
			"tab":"Data"
		},
		"refresh":{
			"type":"text",
			"label":"Refresh Element",
			"tooltip":"Refresh table, data-card or chart on Input column (radio button) change. Input column attribute must be fillded. Comma separated list of element IDs (table, data card, chart)",
			"mandatory":"",
			"default":"",
			"tab":"Data",
			"helper":"context-element"
		},
		"row_select":{
			"type":"select",
			"label":"Row Select",
			"values":["N", "Y"],
			"tooltip":"Used when 'input' radio button is active. When set to Y, radio button is set on whole row click.",
			"mandatory":"",
			"default":"",
			"tab":"Table",
			"helper":""
		},
		"binds":{
			"type":"textarea",
			"label":"Binds",
			"tooltip":"Text",
			"mandatory":"",
			"default":"",
			"tab":"Data",
			"helper":"context-input"
		},
		"order_by":{
			"type":"text",
			"label":"Order by",
			"tooltip":"Default order by clause. Comma separated list of columns.",
			"mandatory":"",
			"default":"",
			"tab":"Data"
		},
		"responsive":{
			"type":"select",
			"values":["N", "Y"],
			"label":"Table Responsive",
			"tooltip":"Responsive behavior of the table.",
			"mandatory":"N",
			"default":"",
			"tab":"Common"
		},
		"table_class":{
			"type":"select",
			"values":["", "table", "table-bordered", "table-hover", "table-striped", "table-dark", "table-sm", "table-borderless"],
			"label":"Table Class",			
			"tooltip":"The class name of table. By default, the table is bordered.",
			"mandatory":"",
			"default":"",
			"tab":"Table"
		},
		"thead_class":{
			"type":"select",
			"values":["", "thead-light", "thead-dark"],
			"label":"Header Class",
			"tooltip":"The class name of table thead.",
			"mandatory":"",
			"default":"",
			"tab":"Table"
		},
		"quick_search":{
			"type":"select",
			"values":["", "Y", "N"],
			"label":"Show Quick Search",
			"tooltip":"Show field for quick search in displayed table data.",
			"mandatory":"",
			"default":"",
			"tab":"Table"
		}
	},
	"data-card":{
		"color":{
			"type":"select",
			"values":["primary", "secondary", "success", "info", "warning", "danger", "link"],
			"label":"Color",
			"tooltip":"Element color",
			"mandatory":"",
			"default":"",
			"tab":"Common"
		}, 
		"line_justify":{
			"type":"select",
			"values":["start", "end", "center", "between", "around"],
			"label":"Justify Lines",
			"tooltip":"Flex justify content on the lines",
			"mandatory":"",
			"default":"start",
			"tab":"Lines"
		},
		"line_class":{
			"type":"text",
			"label":"Line Classes",
			"tooltip":"Classes for lines in data card",
			"mandatory":"",
			"default":"",
			"tab":"Lines",
			"helper":"context-css-text"
		},
		"columns":{
			"type":"table",
			"values":["column", "label", "icon", "class", "component"],
			"label":"Columns",
			"tooltip":"class - CSS class used to style the column (or component if selected)<br>component - value from the column will be rendered as component:<br>FA (value should be font awesome class)<br>PROGRESS (value should be 0 - 100)<br>YN - values should be Y or N<br>BADGE - value will be placed in badge (style defined in class)<br>CHART_LINE - value should be comma separated list of numbers (example:13,4,5)<br>CHART_PIE - value should be comma separated list of numbers. Colors are assigned based on position in the list (primary, secondary,..)",
			"mandatory":"",
			"default":"",
			"tab":"Data",
			"helper":"context-input",
			"col":"12"
		},
		"SQL":{
			"type":"textarea",
			"label":"SQL",
			"tooltip":"SQL text with bind variables. Without order by clause.",
			"mandatory":"",
			"default":"",
			"tab":"Data",
			"helper":"context-input",
			"col":"12"
		},
		"binds":{
			"type":"textarea",
			"label":"Binds",
			"tooltip":"Text",
			"mandatory":"",
			"default":"",
			"tab":"Data",
			"helper":"context-input"
		}
	},
	"html":{
		"color":{
			"type":"select",
			"values":["primary", "secondary", "success", "info", "warning", "danger", "link"],
			"label":"Color",
			"tooltip":"Element color",
			"mandatory":"",
			"default":"",
			"tab":"Common"
		},
		"text":{
			"type":"textarea",
			"label":"Text",
			"tooltip":"Text",
			"mandatory":"",
			"default":"",
			"tab":"Common",
			"col":"12"
		}
	},
	"progress":{
		"min_val":{
			"type":"text",
			"label":"Minimum value",
			"tooltip":"Minimum value",
			"mandatory":"",
			"default":"0",
			"tab":"Common"
		},
		"max_val":{
			"type":"text",
			"label":"Maximum value",
			"tooltip":"Maximum value",
			"mandatory":"",
			"default":"100",
			"tab":"Common"
		},
		"striped":{
			"type":"select",
			"values":["N", "Y"],
			"label":"Striped",
			"tooltip":"Striped",
			"mandatory":"",
			"default":"N",
			"tab":"Common"
		},
		"color":{
			"type":"select",
			"values":["primary", "secondary", "success", "info", "warning", "danger", "link"],
			"label":"Color",
			"tooltip":"Element color",
			"mandatory":"",
			"default":"",
			"tab":"Common"
		},
		"show_value":{
			"type":"select",
			"values":["N", "Y"],
			"label":"Show Value",
			"tooltip":"Show value in progress bar",
			"mandatory":"",
			"default":"N",
			"tab":"Common"
		},
		"SQL":{
			"type":"textarea",
			"label":"SQL",
			"tooltip":"SQL text with bind variables. Without order by clause. SQL should return one numeric value in column Value.",
			"mandatory":"",
			"default":"",
			"tab":"Data",
			"helper":"context-input",
			"col":"12"
		},
		"binds":{
			"type":"textarea",
			"label":"Binds",
			"tooltip":"Text",
			"mandatory":"",
			"default":"",
			"tab":"Data",
			"helper":"context-input"
		},
		"auto_refresh":{
			"type":"select",
			"values":["", "5", "15", "30", "60", "300", "1800"],
			"label":"Auto Refresh (in sec)",
			"tooltip":"Progress is automatically refreshed in number of seconds.",
			"mandatory":"",
			"default":"",
			"tab":"Data"
		}
	},
	"chart":{
		"subtype":{
			"type":"select",
			"values":["line", "bar", "horizontalBar", "pie", "doughnut", "radar", "polarArea"],
			"label":"Chart type",
			"tooltip":"Type of chart",
			"mandatory":"",
			"default":"",
			"tab":"Common"
		},
		"responsive":{
			"type":"select",
			"values":["Y", "N"],
			"label":"Responsive",
			"tooltip":"",
			"mandatory":"",
			"default":"Y",
			"tab":"Common"
		},
		"maintain_aspect":{
			"type":"select",
			"values":["Y", "N"],
			"label":"Maintain Aspect Ratio",
			"tooltip":"",
			"mandatory":"",
			"default":"Y",
			"tab":"Common"
		},
		"ds1_label":{
			"type":"text",
			"label":"Label",
			"tooltip":"Label for dataset",
			"mandatory":"",
			"default":"",
			"tab":"Dataset_1"
		},
		"ds1_fill":{
			"type":"select",
			"values":["N", "Y"],
			"label":"Fill",
			"tooltip":"Fill the chart",
			"mandatory":"",
			"default":"N",
			"tab":"Dataset_1"
		},
		"ds1_bg_color":{
			"type":"text",
			"label":"Background Color",
			"tooltip":"Border Color. Comma separated #RGB codes",
			"mandatory":"",
			"default":"",
			"tab":"Dataset_1"
		},
		"ds1_border_color":{
			"type":"text",
			"label":"Border Color.",
			"tooltip":"Comma separated #RGB codes",
			"mandatory":"",
			"default":"",
			"tab":"Dataset_1"
		},
		"ds1_SQL":{
			"type":"textarea",
			"label":"SQL",
			"tooltip":"SQL text with bind variables. SQL result must have columns Label, Value. Optionaly, you can specify color with Color column. Without order by clause.",
			"mandatory":"",
			"default":"",
			"tab":"Dataset_1",
			"helper":"context-input",
			"col":"12"
		},
		"ds1_lineTension":{
			"type":"text",
			"label":"Line Tension",
			"tooltip":"Bezier curve tension of the line. Set to 0 to draw straightlines",
			"mandatory":"",
			"default":"0.4",
			"tab":"Dataset_1"
		},
		"ds1_pointStyle":{
			"type":"select",
			"values":["","circle", "cross","crossRot","dash","line","rect","rectRounded","rectRot","star","triangle"],
			"label":"Point style",
			"tooltip":"Bezier curve tension of the line. Set to 0 to draw straightlines",
			"mandatory":"",
			"default":"",
			"tab":"Dataset_1"
		},
		"binds":{
			"type":"textarea",
			"label":"Binds",
			"tooltip":"Text",
			"mandatory":"",
			"default":"",
			"tab":"Chart",
			"helper":"context-input"
		},
		"show_lines":{
			"type":"select",
			"values":["Y", "N"],
			"label":"Show Lines",
			"tooltip":"If false, the lines between points are not drawn.",
			"mandatory":"",
			"default":"Y",
			"tab":"Chart"
		},
		"snap_gaps":{
			"type":"select",
			"values":["N", "Y"],
			"label":"Show Gaps",
			"tooltip":"If false, NaN data causes a break in the line.",
			"mandatory":"",
			"default":"N",
			"tab":"Chart"
		},
		"auto_refresh":{
			"type":"select",
			"values":["", "5", "15", "30", "60", "300", "1800"],
			"label":"Auto Refresh (in sec)",
			"tooltip":"Chart is automatically refreshed in number of seconds.",
			"mandatory":"",
			"default":"",
			"tab":"Chart"
		},
		"display_title":{
			"type":"select",
			"values":["Y", "N"],
			"label":"Display Title",
			"tooltip":"Show chart title",
			"mandatory":"",
			"default":"Y",
			"tab":"Chart"
		},
		"display_legend":{
			"type":"select",
			"values":["Y", "N"],
			"label":"Display Legend",
			"tooltip":"Show chart legend",
			"mandatory":"",
			"default":"Y",
			"tab":"Chart"
		},
		"position_legend":{
			"type":"select",
			"values":["top", "left", "bottom", "right"],
			"label":"Legend Position",
			"tooltip":"Legend placement",
			"mandatory":"",
			"default":"top",
			"tab":"Chart"
		},
		"display_x":{
			"type":"select",
			"values":["Y", "N"],
			"label":"Display X Axes",
			"tooltip":"Display standard X axes",
			"mandatory":"",
			"default":"Y",
			"tab":"Chart"
		},
		"display_y":{
			"type":"select",
			"values":["Y", "N"],
			"label":"Display Y Axes",
			"tooltip":"Display standard Y axes",
			"mandatory":"",
			"default":"Y",
			"tab":"Chart"
		},
		"tooltips":{
			"type":"textarea",
			"label":"Configuration for tooltips",
			"tooltip":"Tooltips json configuration for chartjs. See documentation.",
			"mandatory":"",
			"default":"",
			"tab":"Chart"
		},		
		
		
	}
};
var j_context_fa = [
'fa-comment', 
'fa-bars',
'fa-arrow-right', 
'fa-arrow-left', 
'fa-arrow-down', 
'fa-arrow-up', 
'fa-area-chart', 
'fa-align-justify',
'fa-arrows',
'fa-bar-chart',
'fa-binoculars',
'fa-bolt',
'fa-book',
'fa-bookmark',
'fa-bug',
'fa-bullseye',
'fa-calendar',
'fa-check-square',
'fa-check',
'fa-child',
'fa-cogs',
'fa-cog',
'fa-columns',
'fa-edit',
'fa-envelope-o',
'fa-external-link',
'fa-exclamation-triangle',
'fa-exclamation-circle',
'fa-exclamation',
'fa-flag',
'fa-filter',
'fa-folder-o',
'fa-floppy-o',
'fa-group',
'fa-hand-o-right',
'fa-history',
'fa-home',
'fa-line-chart',
'fa-lock',
'fa-plus',
'fa-photo',
'fa-remove',
'fa-plus',
'fa-smile-o',
'fa-sort',
'fa-star',
'fa-thumbs-o-up',
'fa-user',
'fa-undo',
'fa-unlock'
];
var j_context_css_flex = ['d-none' ];
var j_context_css_text = ['overflow-auto','mx-auto', 'vw-100', 'vh-100','text-muted','small', 'strong', 'display-1', 'display-2', 'display-3', 'display-4', 'lead', 'text-left', 'text-center', 'text-right', 'text-truncate', 'text-lowercase', 'text-uppercase', 'text-monospace'];
 