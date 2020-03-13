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
*/

/**
 * Default page setup for new page 
 */
var j_page = {
	"name": "new_page",
	"template":"Simple",
	"settings":{},
	"before": {
		"Process" : {},
		"Check":{}	 
	},
	"page":{
		"sort":["d_top", "d_center", "d_bottom"],
		
		"d_top":{
			"type":"div",
			"parent":"Start",
			"sort":[]
		},
		"d_center":{
			"type":"div",
			"parent":"Start",
			"sort":[]
		},
		"d_bottom":{
			"type":"div",
			"parent":"Start",
			"sort":[]
		}
		 
	},
	"after": {
		"Check":{},
		"Process" : {},
	} 
 }
 /**
 * Function to print context menu (dropdown) for every element type in type.js
 */
function loadContextMenu(){
	let ht = '';
	
	// load types into context menu to be used in tree view
	jQuery.each(j_type, function(i, val) {
		if(i !== 'common') ht += '<a class="dropdown-item" href="#" id="Goto_'+i+'">+ '+i+'</a>';
	});
	//ht += '<hr><a class="dropdown-item" href="#" id="Goto_Duplicate">duplicate</a>';
	ht += '<hr><a class="dropdown-item" href="#" id="Goto_Delete">delete</a>';
	
	$('#context-menu').html(ht);
} 
 /**
 * Send json page configuration to Rberry core to generate HTML preview
 */
function ext_gen(){

	$('#spinner').removeClass('d-none');
	$.post('edit/gen', { data: 
		JSON.stringify(j_page, null, ' ')

	}, function (data) {
		$('#D_Screen').html(data);
		$('#spinner').addClass('d-none');
	}); 
	
}
 /**
 * Send json page configuration to store the configuration on the server (in page.j file)
 */
function ext_publish(){

	$('#spinner').removeClass('d-none');
	$.post('edit/publish', { data: 
		JSON.stringify(j_page, null, ' ')

	}, function (data) {
		$('#D_toast').toast({delay:2000});
		 
		$('#D_toast_body').html('Page "<b>'+ $('#I_Page_Name').val() + '</b>" was published..');
		$('#D_toast').toast('show');
		$('#spinner').addClass('d-none');
	}); 
	
	
}
/**
 * Download page configuration from the server (from page.j file)
 * @i_pg {String} Page identfication
 */
function ext_download(i_pg){

	$('#spinner').removeClass('d-none');
	$.post('edit/download', { pg:i_pg

	}, function (data) {
		if (i_pg){
			
			$('#M_Files').modal('hide');
			j_page = JSON.parse(data);
			$( ".srt").sortable("destroy");
			showRegionTree();
			refreshTree();
			ext_gen();
		} else {
			$('#D_Modal_Files').html(data);
		}
		$('#spinner').addClass('d-none');
	}); 
	
	
}
/**
 * Delete page configuration file
 * @i_pg {String} Page identfication
 */
function ext_delete(i_pg){

	const result = confirm("Do you really want to delete page?");
	if (result) {
		$('#spinner').removeClass('d-none');
		$.post('edit/page_delete', { 
			pg:i_pg
		}, function (data) {
			
			document.getElementById('y_card_'+i_pg).remove();
			
			$('#spinner').addClass('d-none');
		});
	}
}
/**
 * Load log file from the server
 * @i_log {String} log file name
 */
function ext_get_logs(i_log) {

	$('#spinner').removeClass('d-none');
	$.post('edit/get_log_files', { log_file:i_log

	}, function (data) {
		$('#D_Logs').html(data);
		$('#spinner').addClass('d-none');
	}); 
}
/**
 * Load list of page configurations from the server
 *  
 */
function ext_get_pages(){

	$('#spinner').removeClass('d-none');
	$.post('edit/get_pages', { 

	}, function (data) {
		$('#spinner').addClass('d-none');
	}); 	
}
/**
 * Execute SQL command on database (for SQL workbench)
 * @i_sql {String}
 */
function ext_get_sql(i_sql){

	$('#s_spinner_sql').removeClass('d-none');
	
	const $rows = $('#T_sql_binds').find('tr');
	
	let binds = {};
	$rows.each(function(){
		const $td = $(this).find('td');
		
		if ($td.eq(0).text() !== '') binds[':'+$td.eq(0).text()] = $td.eq(1).text();
		 
	});
	
	$.post('edit/get_sql', { 
		i_sql: (i_sql?i_sql:$('#T_sql_textarea').val()),
		i_binds: binds

	}, function (data) {
		
		$('#D_sql_result').html(data);
		setSQLTableLabels();
		$('#s_spinner_sql').addClass('d-none');
	}); 
	
	
}
/**
 * Save application configuration to server (_meta.j file)
 * @j {String} Application configuration
 */
function ext_set_menu(j){

	$('#spinner').removeClass('d-none');
	$.post('edit/set_menu', { data: 
		JSON.stringify(j, null, ' ')

	}, function (data) {
		$('#D_toast').toast({delay:2000});
		 
		$('#D_toast_body').html('Application configuration published..');
		$('#D_toast').toast('show');
		$('#spinner').addClass('d-none');
	}); 
	
}
/**
 * Get application configuration to server (_meta.j file)
 *  
 */
function ext_get_menu(){
	
	$('#spinner').removeClass('d-none');
	$.post('edit/get_menu', {  

	}, function (data) {
		
		const j = JSON.parse(data);
		
		let ind = 0;
		let ht = '<div class="display-4 text-muted">Application Configuration</div><hr class="w-100"><div class="form-row p-2">';
		
		ht += '<div class="form-group w-50 p-2" ><label for="I_boot_theme">CSS Bootstrap file name</label>'
		ht += '<p class="text-muted small">Name of the bootstrap (or bootstrap mini) CSS file stored in ui/css folder.</p>'
		ht += '<input type="text" class="form-control" id="I_boot_theme" value="'+j.theme+'"></input></div>'
		
		ht += '<div class="form-group w-50 p-2"><label for="I_app_name">Application name</label>'
		ht += '<input type="text" class="form-control" id="I_app_name" value="'+j.app_name+'"></input></div>'
		
		ht += '<div class="form-group w-50 p-2"><label for="I_app_login">Use login</label>'
		ht += '<p class="text-muted small">Only logged users can access appliaction. Application needs DB connection and USR table (or view) to access user accounts.</p>'
		ht += '<select class="form-control" id="I_app_login">'
		ht += '<option value="Y" '+(j.login==="Y"?"selected":"")+'>Yes</option>'
		ht += '<option value="N" '+(j.login==="N"?"selected":"")+'>No</option>'
		ht += '</select></div>'
		
		ht += '<div class="form-group w-50 p-2"><label for="I_app_login">Use permissions</label>'
		ht += '<p class="text-muted small">Application use permissions to access pages and items. Application needs DB connection and USR_PERM table (or view) to access user permissions.</p>'
		ht += '<select class="form-control" id="I_app_permission">'
		ht += '<option value="Y" '+(j.permission==="Y"?"selected":"")+'>Yes</option>'
		ht += '<option value="N" '+(j.permission==="N"?"selected":"")+'>No</option>'
		ht += '</select></div>'
		
		
		ht += '</div><br><p class="h4">Menu configuration</p>'
		ht += '<p class="text-muted small">Setup menu for application. Group can be TOP (top menu in application), LEFT (for sidebar) or HOME for home screen cards.</p>'
		ht += '<table class="table table-bordered table-responsive" id="T_Menu"><thead class="table-primary"><tr>';
		ht += '<th class="w-10">Group</th>';
		ht += '<th >Menu</th>';
		ht += '<th >Item</th>';
		ht += '<th >Page</th>';
		ht += '<th >Permissions</th>';
		ht += '<th >Icon (Fa Class)</th>';
		ht += '<th >Description</th>';
		ht += '<th></th></tr></thead>';
		
		jQuery.each(JSON.parse(data).menu, function(c, val_c){
			ht +='<tr><td class="" contenteditable="true">'+val_c.app
			+'</td><td class="" contenteditable="true">'+val_c.menu
			+'</td><td class="" contenteditable="true">'+val_c.item
			+'</td><td class="" contenteditable="true">'+val_c.page
			+'</td><td class="" contenteditable="true">'+val_c.perm
			+'</td><td class="" contenteditable="true">'+val_c.icon
			+'</td><td class="" contenteditable="true">'+val_c.desc
			;
		 
			ind += 1;
			ht+= '</td><td class="w-10" style="text-align: center;">' 
			+ '<a href="#"   style="font-family: FontAwesome" id="TD_UpColumn_Menu_'+ind+'" data-toggle="tooltip" title="Move up">\uf139</a>'
			+ '<a href="#"   style="font-family: FontAwesome" id="TD_DownColumn_Menu_'+ind+'" data-toggle="tooltip" title="Move down">\uf13a</a>'
			+'<a href="#"   style="font-family: FontAwesome" id="TD_DelColumn_Menu_'+ind+'" data-toggle="tooltip" title="Remove column">\uf056</a>' 
			+'</td>';
		});
		ht += '</table>'; 
		
		ht += '<div class="d-flex flex-row-reverse"><a href="#" id="A_AddRow_Menu" class="align-middle btn btn-outline-primary btn-sm" style="font-family: FontAwesome" data-toggle="tooltip" title="Add column">\uf067</a></div>';
		
		$('#D_Modal_Menu').html(ht+'<input type="hidden" id="UID_Index" value="'+ind+'">');
		
		$('[id^=TD_DelColumn_]').on("click", function() {
			$(this).parents('tr').detach();
		 
		});
		
		$('[id^=TD_UpColumn_]').on("click", function() {
			let row = $(this).parents('tr');
			row.prev().before(row);			 
		});
		$('[id^=TD_DownColumn_]').on("click", function() {
			let row = $(this).parents('tr');
			row.next().after(row);		 
		});
		
		$('#A_AddRow_Menu').click(function () {
			let ind = Number($('#UID_Index').val())+1;
			  
			$('#T_Menu' ).append(
			'<tr><td class="" contenteditable="true">' 
			+'</td><td class="" contenteditable="true">' 
			+'</td><td class="" contenteditable="true">' 
			+'</td><td class="" contenteditable="true">'
			+'</td><td class="" contenteditable="true">'
			+'</td><td class="" contenteditable="true">'
			+'</td><td class="" contenteditable="true"></td><td style="text-align: center;">' 
			+'<a href="#" style="font-family: FontAwesome" id="TD_UpColumn_Menu_'+ind+'" data-toggle="tooltip" title="Move up">\uf139</a>'
			+'<a href="#" style="font-family: FontAwesome" id="TD_DownColumn_Menu_'+ind+'" data-toggle="tooltip" title="Move down">\uf13a</a>'
			+'<a href="#" style="font-family: FontAwesome" id="TD_DelColumn_Menu_'+ind+'" data-toggle="tooltip" title="Remove column">\uf056</a>'
			+'</td></tr>');	
			
			$('#TD_DelColumn_Menu_'+ind).on("click", function() {
				$(this).parents('tr').detach();
				 
			});
			$('#TD_UpColumn_Menu_'+ind).on("click", function() {
				let row = $(this).parents('tr');
				row.prev().before(row);			 
			});
			$('#TD_DownColumn_Menu_'+ind).on("click", function() {
				let row = $(this).parents('tr');
				row.next().after(row);		 
			});
		 
			$('#UID_Index').val(ind);	
 			
		});
		
		$('#spinner').addClass('d-none');
	}); 
	 
}
/**
 * Save menu configuration from form to json format
 *  
 */
function saveMenu(){
	
	const j = {};
	const $rows = $('#T_Menu').find('tr');
	
	let data = [];
	$rows.each(function(){
		const $td = $(this).find('td');
						
		if ($td.eq(0).text() !== '') {
			const h = {
				"app":$td.eq(0).text(),
				"menu":$td.eq(1).text(),
				"item":$td.eq(2).text(),
				"page":$td.eq(3).text(),
				"perm":$td.eq(4).text(),
				"icon":$td.eq(5).text(),
				"desc":$td.eq(6).text()
			}
			data.push(h);
		}
		 
	});
	
	j.theme = $('#I_boot_theme').val();
	j.app_name = $('#I_app_name').val();
	j.login = $('#I_app_login').val();
	j.permission = $('#I_app_permission').val();
	j.menu = data;
	ext_set_menu(j);
	 
	
}
/**
 * Future use - function prototype with nodes hiding
 *  
 */
function showRegionTree2(){
	let ht = '<ul class="ul_tree h6" id="D_Tree">'
	ht += '<li><span class="caret text-primary">Before</span>';
	ht += '<ul class="nested ">';
	
	jQuery.each(j_page.before, function(c, val_c){				
		if (c) ht += '<li><a href=# id="A_bt_'+c+'">' + c + '</a></li>';		
	});
	
	ht += '</ul>';
	ht += '</li>';
	ht += '<li><span class="caret text-primary">Page</span>';
	ht += '<ul class="nested " id="U_bt_Start"></ul></li>';
	$("#D_Tree_Panel").html(ht);
	
	jQuery.each(j_page.page.sort, function(c, val_c){
		
		if (val_c){
			if (val_c === 'sort') return;
			if(j_page.page[val_c].type === 'div'){
				ht = '<li><span class="caret text-primary"></span><a href=# id="A_bt_'+val_c +'"  >'+val_c+'</a><ul class="nested " id="U_bt_'+val_c+'">';
				ht += '</ul>';
				ht += '</li>';				
			} else {
				ht = '<li><a href=# id="A_bt_'+val_c+'">' + val_c + '</a></li>';
			}
			if (j_page.page[val_c].parent){
				$('#U_bt_'+j_page.page[val_c].parent).append(ht);
			} else {
				$('#U_bt_Start').append(ht);
			}
		}
	});
	
	ht = '<li><span class="caret text-primary">After</span>';
	ht += '<ul class="nested ">';
	
	jQuery.each(j_page.after, function(c, val_c){				
		if (c) ht += '<li><a href=# id="A_bt_'+c+'">' + c + '</a></li>';
	});
	
	ht += '</ul></li></ul>';
 	
	$('#D_Tree').append(ht);
	
	$(".caret").on("click", function(e) {
		this.parentElement.querySelector(".nested").classList.toggle("active");
		this.classList.toggle("caret-down");
	});
	
	$("[id^=A_bt_]").on("click", function(e) {
		/*$('#I_BusTerm').val($(this).attr('id').replace('A_bt_', ''));
		
		showBusTermEdit();
		*/
	});
}
/**
 * Print part div subtree from page tree. 
 * Function is called recursively to print page tree 
 * @i {String} node identification
 * @sort {Array} list of elements for render under div node
 */
function showDiv(i, sort){
	
	jQuery.each(sort, function(c, val_c){
		let ht;
		if (val_c){
			
			if(j_page.page[val_c].type === 'div'){
				ht = '<li><a href=# id="A_bt_'+val_c +'"  >'+val_c+'</a><i class="icon-move">\uf047</i><ol id="U_bt_'+val_c+'">';
				ht += '</ol>';
				ht += '</li>';				
			}
			else {
				ht = '<li><a href=# id="A_bt_'+val_c+'">' + val_c + '</a><i class="icon-move">\uf047</i></li>';
			}
			$('#U_bt_'+j_page.page[val_c].parent).append(ht);
			
			if(j_page.page[val_c].type === 'div') showDiv(val_c, j_page.page[val_c].sort);			
		}
	});
	
}
/**
 * Print page tree
 */
function showRegionTree(){
	let ht = '<ul class="h6 text-primary" style=" padding-left:0;" id="D_Tree">'
	ht += '<li>Before';
	ht += '<ul>';
	
	jQuery.each(j_page.before, function(c, val_c){				
		if (c) ht += '<li><a href=# id="A_Bf_'+c+'">' + c + '</a></li>';
	});
	
	ht += '</ul>';
	ht += '</li>';
	ht += '<li>Page';
	ht += '<ol class="nested_with_switch vertical srt" id="U_bt_Start"></ol></li>';
	$("#D_Tree_Panel").html(ht);
	
	jQuery.each(j_page.page.sort, function(c, val_c){
		if (val_c){
			if (val_c === 'sort') return;
			if(j_page.page[val_c].type == 'div'){
				ht = '<li><a href=# id="A_bt_'+val_c +'"  >'+val_c+'</a><i class="icon-move">\uf047</i><ol class="" id="U_bt_'+val_c+'">';
				ht += '</ol>';
				ht += '</li>';				
			} else {
				ht = '<li><a href=# id="A_bt_'+val_c+'">' + val_c + '</a><i class="icon-move">\uf047</i></li>';			
			}
			$('#U_bt_'+j_page.page[val_c].parent).append(ht);
			 
			if(j_page.page[val_c].type === 'div') showDiv(val_c, j_page.page[val_c].sort);			
		}
	});
	
	ht = '<li>After';
	ht += '<ul>';
	
	jQuery.each(j_page.after, function(c, val_c){				
		if (c) ht += '<li><a href=# id="A_Af_'+c+'">' + c + '</a></li>';
	});
	
	ht += '</ul>';
	ht += '</li>';
	
	ht += '</ul>';
	
	$('#D_Tree').append(ht);
}
/**
 * Prepare context menu helpers for parameters
 */
function refreshHelper(){
	let arr_input = [];
	let arr_button = [];
	let arr_page = [];
	let arr_element = [];
	let arr_modal = [];
	
	jQuery.each(j_page.page, function(c, val_c){
		
		if (val_c.type && val_c.type.indexOf('input') > -1) arr_input.push(c);
		if (val_c.type && val_c.type.indexOf('button') > -1) arr_button.push(c);
		
		if (val_c.type){
			if (val_c.type.indexOf('table') > -1 || val_c.type.indexOf('chart') > -1 || val_c.type.indexOf('data-card') > -1 ) arr_element.push(c);
			if (val_c.template && val_c.template === 'modal') arr_modal.push(c);
		}
	});
	arr_input.sort();
	arr_button.sort();
	arr_element.sort();
	arr_modal.sort();
		
	let ht = '<table class="small"><tr>';
	let cols = Math.ceil(arr_input.length/7);
	let cols_ind = 0;
	
	$.each( arr_input, function( index, value ){
		if (cols_ind === cols){
			ht += '</tr><tr>';
			cols_ind = 0;
		} else {
			cols_ind += 1;
		}
		ht += '<td><a class="dropdown-item" href="#" id="Helper_'+value+'">'+value+'</a></td>'
	});
	
	ht += '</tr></table>'
	
	$('#context-input').html(ht);
	
	ht = '<table class="small"><tr>';
	cols = Math.ceil(arr_button.length/7);
	cols_ind = 0;
	
	$.each( arr_button, function( index, value ){
		if (cols_ind === cols){
			ht += '</tr><tr>';
			cols_ind = 0;
		}
		else 
			cols_ind += 1;
			
		ht += '<td><a class="dropdown-item" href="#" id="Helper_'+value+'">'+value+'</a></td>'
	});
	
	ht += '</tr></table>'
	
	
	
	$('#context-button').html(ht);
	
	ht = '<table class="small"><tr>';
	cols = Math.ceil(arr_page.length/7);
	cols_ind = 0;
	
	$.each( arr_page, function( index, value ){
		if (cols_ind === cols){
			ht += '</tr><tr>';
			cols_ind = 0;
		} else {
			cols_ind += 1;
		}
		ht += '<td><a class="dropdown-item" href="#" id="Helper_'+value+'">'+value+'</a></td>'
	});
	
	ht += '</tr></table>'
	
	$('#context-page').html(ht);
	
	ht = '<table class="small"><tr>';
	cols = Math.ceil(j_context_fa.length/7);
	cols_ind = 0;
	
	$.each( j_context_fa, function( index, value ){
		if (cols_ind === cols){
			ht += '</tr><tr>';
			cols_ind = 0;
		} else {
			cols_ind += 1;
		}
		ht += '<td><a class="dropdown-item" href="#" id="Helper_'+value+'"><span class="icon '+value+'"></span></a></td>'
	});
	
	ht += '</tr></table>'
	
	$('#context-fa').html(ht);
	
	ht = '<table class="small"><tr>';
	cols = Math.ceil(j_context_css_flex.length/7);
	cols_ind = 0;
	
	$.each( j_context_css_flex, function( index, value ){
		if (cols_ind === cols){
			ht += '</tr><tr>';
			cols_ind = 0;
		} else {
			cols_ind += 1;
		}
		ht += '<td><a class="dropdown-item" href="#" id="Helper_'+value+'">'+value+'</a></td>'
	});
	
	ht += '</tr></table>'
	
	$('#context-css-flex').html(ht);
	
	ht = '<table class="small"><tr>';
	cols = Math.ceil(j_context_css_text.length/7);
	cols_ind = 0;
	
	$.each( j_context_css_text, function( index, value ){
		if (cols_ind === cols){
			ht += '</tr><tr>';
			cols_ind = 0;
		} else {
			cols_ind += 1;
		}
		ht += '<td><a class="dropdown-item" href="#" id="Helper_'+value+'">'+value+'</a></td>'
	});
	
	ht += '</tr></table>'
	
	$('#context-css-text').html(ht);
	
	ht = '<table class="small"><tr>';
	cols = Math.ceil(arr_element.length/7);
	cols_ind = 0;
	
	$.each( arr_element, function( index, value ){
		if (cols_ind === cols){
			ht += '</tr><tr>';
			cols_ind = 0;
		} else {
			cols_ind += 1;
		}
			
		ht += '<td><a class="dropdown-item" href="#" id="Helper_'+value+'">'+value+'</a></td>'
	});
	
	ht += '</tr></table>'
	
	$('#context-element').html(ht);
	
	ht = '<table class="small"><tr>';
	cols = Math.ceil(arr_modal.length/7);
	cols_ind = 0;
	
	$.each( arr_modal, function( index, value ){
		if (cols_ind === cols){
			ht += '</tr><tr>';
			cols_ind = 0;
		} else {
			cols_ind += 1;
		}
		ht += '<td><a class="dropdown-item" href="#" id="Helper_'+value+'">'+value+'</a></td>'
	});
	
	ht += '</tr></table>'
	
	$('#context-modal').html(ht);
	
	$("[id^=Helper_]").on('click', function(e){
		
		const el = $('#I_Selected_Context').val();
		
		  
		if ($('#'+el).is("input")||$('#'+el).is("textarea")){  		
			const cursorPos = $('#'+ el).prop('selectionStart');
			const v = $('#'+ el).val();
			const textBefore = v.substring(0,  cursorPos);
			const textAfter  = v.substring(cursorPos, v.length);

			$('#'+ el).val(textBefore + $(this).attr('id').replace('Helper_', '') + textAfter);
		} 
		if ($('#'+el).is("td")) {
			const v = $('#'+ el).text();
	 
			$('#'+ el).text(v + $(this).attr('id').replace('Helper_', ''));
		}
	});
	
}
/**
 * Reorder elements in the page tree
 * @th 
 * @cont
 */
function reorder(th, cont){
	
	const i = th.replace('A_bt_', '');
	const div = cont.replace('U_bt_', '');
	const old = j_page.page[i].parent;
	let sort_old = [];
	let sort_new = [];
	
	$('#U_bt_' + old).find('li').each(function(c, val){
		
		const par = $(val).closest('ol').attr('id').replace('U_bt_', '');
		
		if (par != old) return true;
		 
		sort_old.push($(val).find('a').attr('id').replace('A_bt_', ''));		
		
    });
	
	$('#U_bt_' + div).find('li').each(function(c, val){
		const par = $(val).closest('ol').attr('id').replace('U_bt_', '');
		
		if (par != div)	return true;
		
		sort_new.push($(val).find('a').attr('id').replace('A_bt_', ''));
		
		 
    });
	
	j_page.page[i].parent = div;
	
	if (div === 'Start')
		j_page.page.sort = sort_new;
	else 
		j_page.page[div].sort = sort_new;
	
	if (old === 'Start')
		j_page.page.sort = sort_old;
	else 
		j_page.page[old].sort = sort_old;
	
	ext_gen();
	
}
/**
 * Delete element in the page tree (with all child elements)
 * @id {String} element ID
 */
function del_element (id){
	
	const srt = j_page.page[id].sort;
	
	if (srt)
		jQuery.each(srt, function(c, val_c){
			if (j_page.page[val_c].type === 'div')
				del_element(val_c);	
		});	
	delete j_page.page[id];	
}
/**
 * Refresh right panel with page tree. 
 *
 */
function refreshTree(){
	
	loadContextMenu();
	refreshHelper();
	
	$('#I_Page_Name').val(j_page.name);
	
	let oldContainer;
	
	$( "ol.srt").sortable({
	  group: 'nested',
	  handle: 'i.icon-move',
	  revert: "invalid",
	  afterMove: function (placeholder, container) {
		if(oldContainer !== container){
			/*if(oldContainer)
			oldContainer.el.removeClass("active");
			container.el.addClass("active");
			*/
		  oldContainer = container;
		  
		  
		}
	  },
	  onDrop: function ($item, container, _super) {
		//container.el.removeClass("active");
		//console.log('item:'+$item.find('a').attr('id'));
		//console.log(container);
		//console.log('new container:'+container.el.attr('id'));
		//console.log('old container:'+oldContainer.el.attr('id'));
		reorder($item.find('a').attr('id'),container.el.attr('id') );
		_super($item, container);
	  }
	});
 
 
	
	//standard context menu
	$("#context-menu a").on("click", function(e) {
		
		if ($(this).attr('id').indexOf('Goto') > -1){
			
			if ($(this).attr('id') === 'Goto_Delete'){
				const i = $('#I_Selected_El').val().replace('A_bt_', '');
				const par = j_page.page[i].parent;
				del_element(i);
				
				if (par === 'Start')
					j_page.page.sort.splice(j_page.page.sort.indexOf(i), 1);
				else  			
					j_page.page[par].sort.splice(j_page.page.sort.indexOf(i), 1);
				
				$('#'+$('#I_Selected_El').val()).closest('li').remove();
				$('#'+$('#I_Selected_El').val().replace('A_bt_', 'U_bt_')).remove();
				
				ext_gen(); //generate html preview
			} else if ($(this).attr('id') === 'Goto_Duplicate'){
				const i = $('#I_Selected_El').val().replace('A_bt_', '');
				const par = j_page.page[i].parent;
				//del_element(i);
				
				ext_gen(); //generate html preview
			} else
				showModal($(this).attr('id').replace('Goto_', ''), '');
			
		}
		
		//$(this).parent().removeClass("show").hide();
	});
	
	$("[id^=A_bt_]").hover(
		function(e) {$('#xx_'+$(this).attr('id').replace('A_bt_', '')).addClass('sel');}
		,function(e) {$('#xx_'+$(this).attr('id').replace('A_bt_', '')).removeClass('sel');}
	);
	
	$("[id^=A_bt_]").on('contextmenu', function(e) {
		
		const top = e.pageY - 10;
		const left = e.pageX - 30;
		let mn = '';
			 
		mn = "#context-menu";
			
		$('#I_Selected_El').val($(this).attr('id'));
			
			
		$(mn).css({
			display: "block",
			top: top,
			left: left
		}).addClass("show");
			
		return false;  
	}).on("click", function() {
		$("[id^=context-menu]").removeClass("show").hide(); 
	});
	
	$("[id^=A_bt_]").on('click', function(e) {
		showModal('', $(this).attr('id').replace('Goto_', ''));	
		 
	});
	$("[id^=A_Bf_]").on('click', function(e) {
		showModal('', $(this).attr('id'));		 
	});
	$("[id^=A_Af_]").on('click', function(e) {
		showModal('', $(this).attr('id'));		 
	});
	
}
 /**
 * Save content of the modal window - element configuration, process/check before/after
 *  
 */
function saveModal(){
	let v = {};
		
	if (["A_Bf_Process", "A_Bf_Check", "A_Af_Check", "A_Af_Process"].indexOf($('#I_Selected_El').val()) > -1){
		const $rows = $('#T_'+$('#I_Selected_El').val()).find('tr');
		let data = {};
		$rows.each(function(){
			const $td = $(this).find('td');
			let h = {};
			let i;
			if ($td.eq(0).text() !== '') {
				  
				if (["A_Bf_Process"].indexOf($('#I_Selected_El').val()) > -1){
					
					h = {
						"type": $td.eq(1).find('select').val(),
						"desc": $td.eq(2).text(),
						"code": $td.eq(3).text(),
						"mapping": $td.eq(4).text(),
						"binds": $td.eq(5).text(),
						"message": $td.eq(6).text()
					};
				} else if (["A_Af_Process"].indexOf($('#I_Selected_El').val()) > -1){
					
					h = {
						"type": $td.eq(1).find('select').val(),
						"btn": $td.eq(2).find('select').val(),	
						"desc": $td.eq(3).text(),
						"code": $td.eq(4).text(),
						"binds": $td.eq(5).text(),
						"message": $td.eq(6).text()
					};
				}
				else if (["A_Af_Check"].indexOf($('#I_Selected_El').val()) > -1){
					
					h = {
						"type": $td.eq(1).find('select').val(),
						"level": $td.eq(2).find('select').val(),
						"btn": $td.eq(3).find('select').val(),
						"message": $td.eq(4).text(),
						"el": $td.eq(5).text(),
						"desc": $td.eq(6).text(),
						"code": $td.eq(7).text(),
						"binds": $td.eq(8).text(),
					};
				} else {
					
					h = {
						"type": $td.eq(1).find('select').val(),
						"level": $td.eq(2).find('select').val(),
						"message": $td.eq(3).text(),
						"el": $td.eq(4).text(),
						"desc": $td.eq(5).text(),
						"code": $td.eq(6).text(),
						"binds": $td.eq(7).text(),
					};
				}
				data[$td.eq(0).text()] = h;
			}
			 
		});
			
		if ($('#I_Selected_El').val() === 'A_Bf_Process') j_page.before.Process = data;
		if ($('#I_Selected_El').val() === 'A_Af_Process') j_page.after.Process = data;
		if ($('#I_Selected_El').val() === 'A_Bf_Check') j_page.before.Check = data;
		if ($('#I_Selected_El').val() === 'A_Af_Check') j_page.after.Check = data;
		
		$('#I_Selected_El').val('');
		return;
	}
	
	// save common parameters
	jQuery.each(j_type['common'], function(c, val_c){
		v[c] = $('#I_el_'+c).val();
	});
	// save all custom parameters
	jQuery.each(j_type[$('#I_el_type').val()], function(c, val_c){
		if (val_c.type === 'table'){
			const $rows = $('#I_el_' + c).find('tr');
			let data = [];
			$rows.each(function(){
				const $td = $(this).find('td');
				let h = [];
								
				if ($td.eq(0).text() !== '') {
					let i = 0;
					jQuery.each(val_c.values, function (d, e){
						h[i] = $td.eq(i).text();
						i+=1;
					});
					data.push(h);
				}
				 
			});
			v[c] = data;
			
		} else {
			v[c] = $('#I_el_'+c).val();
		}
	});
	
	// store element type
	v.type = $('#I_el_type').val();
	
	//sort elements for div type
	if (v.type === 'div'){
		v.sort = [];
		if (j_page.page[$('#I_el_ID_old').val()]) v.sort = j_page.page[$('#I_el_ID_old').val()].sort;
	}
	
	//save parent element
	v['parent'] = $('#I_el_parent').val();
		
	j_page.page[$('#I_el_ID').val()] = v;
		
	//parent change
	if ($('#I_el_parent').val() !== $('#I_el_parent_old').val()){
			if ($('#I_el_parent_old').val() === 'Start') j_page.page.sort.splice(j_page.page.sort.indexOf($('#I_el_ID_old').val()), 1);
			else if (j_page.page[$('#I_el_parent_old').val()]) j_page.page[$('#I_el_parent_old').val()].sort.splice(j_page.page.sort.indexOf($('#I_el_ID_old').val()), 1);
	}
	
	
	// ID change
	if ($('#I_el_ID').val() !== $('#I_el_ID_old').val()){
		if ($('#I_el_parent_old').val() === 'Start'){
			const ind = j_page.page.sort.indexOf($('#I_el_ID_old').val());
			if (ind >= 0) j_page.page.sort[ind] = $('#I_el_ID').val();
		} else if (j_page.page[$('#I_el_parent').val()]){
			const ind = j_page.page[$('#I_el_parent').val()].sort.indexOf($('#I_el_ID_old').val());
			if (ind >= 0) j_page.page[$('#I_el_parent').val()].sort[ind] = $('#I_el_ID').val();
		}
		
		if (v.type === 'div' && j_page.page[$('#I_el_ID').val()]) 
			jQuery.each(j_page.page[$('#I_el_ID').val()].sort, function(c, val_c){
				j_page.page[val_c].parent = $('#I_el_ID').val();
			});
		
		delete j_page.page[$('#I_el_ID_old').val()];
	} 
	// parent change
	if ($('#I_el_parent').val() === 'Start'){
		if (j_page.page.sort.indexOf($('#I_el_ID').val()) < 0) j_page.page.sort.push($('#I_el_ID').val());
		else {}
	} else { 
		if (j_page.page[$('#I_el_parent').val()].sort.indexOf($('#I_el_ID').val()) < 0) {
			j_page.page[$('#I_el_parent').val()].sort.push($('#I_el_ID').val());
		}
		else {}
	}
	let ht;
	if (v.type !== 'div') {
		ht = '<li><a href=# id="A_bt_' + $('#I_el_ID').val() + '"> ' + $('#I_el_ID').val() + '</a><i class="icon-move">\uf047</i></li>';
	} else {
		ht = '<li><a href=# id="A_bt_' + $('#I_el_ID').val() + '"> ' + $('#I_el_ID').val() 
			+ '</a><i class="icon-move">\uf047</i><ol id="U_bt_' + $('#I_el_ID').val() + '"></ol></li>'
	}
	
	if ($('#I_el_parent').val() !== $('#I_el_parent_old').val()){
		let html;
		
		if (v.type === 'div'){
			html = $('#U_bt_'+$('#I_el_ID_old').val()).html();
			$('#U_bt_'+$('#I_el_ID_old').val()).closest('ol').remove();
		}
		$('#A_bt_'+$('#I_el_ID_old').val()).closest('li').remove();
		
		$('#U_bt_'+v['parent']).append(ht);
		
		if (html) $('#U_bt_'+$('#I_el_ID').val()).html(html);
		
	} else if ($('#I_el_ID').val() !== $('#I_el_ID_old').val()){
		$('#A_bt_'+$('#I_el_ID_old').val()).html($('#I_el_ID').val());
		$('#A_bt_'+$('#I_el_ID_old').val()).attr("id", 'A_bt_'+$('#I_el_ID').val());
		if (v.type === 'div') $('#U_bt_'+$('#I_el_ID_old').val()).attr("id", 'U_bt_'+$('#I_el_ID').val());		
	}
		
	// Refresh tree view and generate html preview
	refreshTree();
	ext_gen();
}
/**
 * Print <select> component for process type dropdown
 * @val {String} selected value
 * @id {String} html element ID
 */
function getOperSelect(val, id){
	
	const ht = '<select id="'+ id +'" >'
	+'<option value="SQL" '+ (val==='SQL'?'selected':'')+'>SQL</option>'
	+'<option value="JS" '+ (val==='JS'?'selected':'')+'>Javascript</option>'
	+'</select>';
	return ht;
}
/**
 * Print <select> component for level dropdown
 * @val {String} selected value
 * @id {String} html element ID
 */
function getLevelSelect(val, id){
		
	const ht = '<select id="' + id + '" >'
	+'<option value="info" '+ (val === 'info'?'selected':'')+'>Info</option>'
	+'<option value="warning" '+ (val === 'warning'?'selected':'')+'>Warning</option>'
	+'<option value="danger" '+ (val === 'danger'?'selected':'')+'>Error</option>'
	+'</select>';
	return ht;
}
/**
 * Set SQL table labels from SQL work bench for
 */
function setSQLTableLabels (){
	
	const id = $('#S_sql_elements_select').val();
	const head = $('.y_mapping_header').find('th');
	
	if (j_page.page[id]) {
		jQuery.each(head, function(c,c_val){
			jQuery.each(j_page.page[id].columns, function(d,d_val){
				if (head.eq(c).text().replace(/ /g,'') === d_val[0]) $('.y_mapping_label').find('th').eq(c).text(d_val[1]); 
			});
		});
	}
	
}
/**
 * Load SQL text into SQL Workbench
 * @id {String} Element ID
 */
function getSQLElement(id){
	$('[id^=td_bind_]').text('');
		
	if (j_page.page[id]){
		if (j_page.page[id].binds){
			const str = j_page.page[id].binds.replace(/ /g,'');
			
			jQuery.each(str.split(','), function(c,val){
				$('#td_bind_' + c).text(val); 
			});
		}
		
		$('#T_sql_textarea').val(j_page.page[id].SQL);
	}
	
	if (j_page.before.Process[id]){
		if (j_page.before.Process[id].binds){
			const str = j_page.before.Process[id].binds.replace(/ /g,'');
			
			jQuery.each(str.split(','), function(c,val){
				$('#td_bind_'+c).text(val); 
			});
		}
		$('#T_sql_textarea').val(j_page.before.Process[id].code);
	}
	if (j_page.after.Process[id]){
		if (j_page.after.Process[id].binds){
			const str = j_page.after.Process[id].binds.replace(/ /g,'');
			
			jQuery.each(str.split(','), function(c,val){
				$('#td_bind_'+c).text(val); 
			});
		}
		$('#T_sql_textarea').val(j_page.after.Process[id].code);
	}
		
	if (j_page.before.Check[id]){
		if (j_page.before.Check[id].binds){
			const str = j_page.before.Check[id].binds.replace(/ /g,'');
			
			jQuery.each(str.split(','), function(c,val){
				$('#td_bind_'+c).text(val); 
			});
		}
		$('#T_sql_textarea').val(j_page.before.Check[id].code);
	}
	if (j_page.after.Check[id]){
		if (j_page.after.Check[id].binds){
			const str = j_page.after.Check[id].binds.replace(/ /g,'');
			
			jQuery.each(str.split(','), function(c,val){
				$('#td_bind_'+c).text(val); 
			});
		}
		$('#T_sql_textarea').val(j_page.after.Check[id].code);
	}
	
}
/**
 * Get list of elements, that can be configured in SQL Workbench
 * @val {String} Selected value
 */
function getSQLElementsSelect(val){
		
	let ht = '<select class="from-contorl w-100" id="S_sql_elements_select" ><option value=""></option>'

	jQuery.each(j_page.page, function(c, val_c){
		if (val_c.SQL) {
			ht += '<option value="'+c+'" '
			+(val===c?' selected ':'')	
			+'>'+c+'</option>';	
		}
	});	
	jQuery.each(j_page.before.Process, function(c, val_c){
		if (val_c.type === 'SQL') {
			ht += '<option value="'+c+'" '
			+(val===c?' selected ':'')	
			+'>'+c+'</option>';	
		}
	});	
	jQuery.each(j_page.before.Check, function(c, val_c){
		if (val_c.type === 'SQL') {
			ht += '<option value="'+c+'" '
			+(val===c?' selected ':'')	
			+'>'+c+'</option>';	
		}
	});	
	jQuery.each(j_page.after.Process, function(c, val_c){
		if (val_c.type === 'SQL') {
			ht += '<option value="'+c+'" '
			+(val===c?' selected ':'')	
			+'>'+c+'</option>';	
		}
	});	
	jQuery.each(j_page.after.Check, function(c, val_c){
		if (val_c.type === 'SQL') {
			ht += '<option value="'+c+'" '
			+(val===c?' selected ':'')	
			+'>'+c+'</option>';	
		}
	});	
	ht +='</select>';
	
	$('#S_sql_elements').html(ht);
	
	$('#S_sql_elements_select').on ('change', function(e){
		const id = $(this).val();
		getSQLElement(id);
	});
	
}
/**
 * Get list of existing buttons in page configuration
 * @val {String} Selected value
 * @id {String} html id
 */
function getButtonSelect(val, id){

	let ht = '<select id="'+id+'" ><option value=""></option>'

	jQuery.each(j_page.page, function(c, val_c){
		if (val_c.type === 'button') {
			ht += '<option value="'+c+'" '
			+(val===c?' selected ':'')	
			+'>'+c+'</option>';	
		}
	});	
	ht += '<option value="<ajax>">::Action::</option>'
	ht +='</select>';
	return ht;
}
/**
 * Batch element creating
 *
 */
function saveBatchTable(){
	
	const $rows = $('#T_Wizard_Batch').find('tr');
	let par = $('#I_Wizard_Batch_parent' ).val();
	
	if (par === '') par = 'Start';
	
	//let data = {};
	$rows.each(function(){
		
		const $td = $(this).find('td');
		
		const id = $td.eq(2).text();
		
		if (id !== ''){
			const h = {
						"type": $td.eq(0).find('select').val(),
						"label": $td.eq(1).text(),
						"tooltip": $td.eq(3).text(),
						"mandatory": $td.eq(4).find('select').val(),
						"permission": $td.eq(5).text(),
						"parent":par
				};
				
			jQuery.each(j_type['common'], function(c, val_c){
				if (val_c.default !== '') h[c] = val_c.default;
			});
			
			jQuery.each(j_type[h.type], function(c, val_c){
				if (val_c.default !== '') h[c] = val_c.default;
			});	
			j_page.page[id] = h;
			j_page.page[par].sort.push(id);
		}		 
	});
	
	
}
/**
 * Print table for batch element create
 *
 */
function showBatchTable(){
	let ht ='';
	let ind = 0;
	ht += '<div class=" w-25 form-group">'
		+ '<label for="I_Wizard_Batch_parent">Parent DIV</label>'
		+ '<select class="form-control" id="I_Wizard_Batch_parent" title="Unique identificator of element">'
		
	jQuery.each(j_page.page, function(c, val_c){
		if (val_c.type === 'div') {
			ht += '<option value="'+c+'" '
			+'>'+c+'</option>';	
		}
	});
	ht +=  '</select></div>';
	
	ht += '<div><table class="table table-bordered" id="T_Wizard_Batch"><thead class="table-primary"><tr>';
	ht += '<th >Type</th>';
	ht += '<th >Label</th>';
	ht += '<th >Name (ID)</th>';
	ht += '<th >Tooltip</th>';
	ht += '<th >Mandatory</th>';
	ht += '<th >Permission</th></thead>';
	
	
	for (let j=0; j < 10; j++){
		ht += '<tr class="p-0">';
		ht += '<td class="p-0" contenteditable="false"><select class="wizard-type w-100">';
		jQuery.each(j_type, function(i, val) {
			if(['common', 'div'].indexOf(i) > -1) return;
			ht += '<option value="'+i+'">'+i+'</option>';
		});
		ht += '</select></td>';
		ht += '<td contenteditable="true" class="wizard-type p-0"></td>';
		ht += '<td contenteditable="true" class="p-0"></td>';
		ht += '<td contenteditable="true" class="p-0"></td>';
		ht += '<td contenteditable="false" class="p-0"><select class="w-100"><option value="N">N</option><option value="Y">Y</option></td>';
		ht += '<td contenteditable="true" class="p-0"></td>';
		ht += '</tr>';
	}
	ht += '</table></div>'
	
	ht += '<div class="d-flex flex-row-reverse"><a href="#" id="A_Wizard_Batch_AddRow" class="align-middle btn btn-outline-primary btn-sm" style="font-family: FontAwesome" data-toggle="tooltip" title="Add column">\uf067</a></div>';
	$('#D_Wizard_Batch').html(ht);
	
	$('.wizard-type').on ('keyup', function(e){
		
		const $td = $(this).closest('tr').find('td');
		
		const txt = $td.eq(0).find('select').val().substring(0,1) + '_' + $td.eq(1).text().toLowerCase().replace(' ', '_');
		
		$td.eq(2).text(txt);
		
	});
	$('.wizard-type').on ('change', function(e){
		
		const $td = $(this).closest('tr').find('td');
		
		const txt = $td.eq(0).find('select').val().substring(0,1) + '_' + $td.eq(1).text().toLowerCase().replace(' ', '_');
		
		$td.eq(2).text(txt);		
	});
		
	$('#A_Wizard_Batch_AddRow').click(function () {
			let ht2;
			ht2 = '<tr>';
			ht2 += '<td contenteditable="false" class="p-0"><select class=" w-100 wizard-type">';
		 	jQuery.each(j_type, function(i, val) {
				if(['common', 'div'].indexOf(i) > -1) return;
				ht2 += '<option value="'+i+'">'+i+'</option>';
					 
			});
			ht2 += '</select></td>';
			ht2 += '<td contenteditable="true" class="p-0"></td>';
			ht2 += '<td contenteditable="true" class="p-0"></td>';
			ht2 += '<td contenteditable="true" class="p-0"></td>';
			ht2 += '<td contenteditable="false" class="p-0"><select class="w-100"><option value="N">N</option><option value="Y">Y</option></td>';
			ht2 += '<td contenteditable="true" class="p-0"></td>';
			ht2 += '</tr>';
			$('#T_Wizard_Batch' ).append(ht2);
	});
}
/**
 * Print modal window - element configuration, process/check before/after
 * @type {String} 
 * @id {String} Element ID
 */
function showModal(type,id){
	
	let ht ='';
	//var cont;
	let par = 'Start';
	let ht2 = {};
	
	//var ord = -1;
	
	$('#B_Modal_Save').attr("disabled", false);
	
	$('#M_Default_sm_inner').removeClass('m_wide');
	
	if (id.indexOf('f_Check')> 0) {
		$('#M_Default_sm_head').text('Check');
		$('#M_Default_sm_inner').addClass('m_wide');
		$('#I_Selected_El').val(id);
		
		let help;
		if (id === 'A_Bf_Check') help = j_help["Before Check"];
		if (id === 'A_Af_Check') help = j_help["After Check"];
		
		let ind = 0;
		ht = '<p class="muted">'+help+'</p><table class="table table-bordered table-responsive" id="T_'+id+'"><thead class="table-primary"><tr>';
		ht += '<th class="w-10">Name (ID)</th>';
		ht += '<th >Type</th>';
		ht += '<th >Level</th>';
		if (id == 'A_Af_Check') ht += '<th >Button</th>';
		ht += '<th >Message</th>';
		ht += '<th >Element</th>';
		ht += '<th >Description</th>';
		ht += '<th class="w-75">Code</th><th>Binds</th><th></th></tr></thead>';
		
		let p;
		if (id === 'A_Bf_Check') p = j_page.before.Check;
		else p = j_page.after.Check;
		
		jQuery.each(p, function(c, val_c){
			ht +='<tr><td class="" contenteditable="true">'+c
			+'</td><td class="" contenteditable="false">'+getOperSelect(val_c.type, 'TD_Sel_Oper_'+ind)
			+'</td><td class="" contenteditable="false">'+getLevelSelect(val_c.level, 'TD_Sel_Level_'+ind)
			+ (id == 'A_Af_Check'?'</td><td class="" contenteditable="false">'+getButtonSelect(val_c.btn, 'TD_Sel_Button_'+ind):'')
			+'</td><td class="" contenteditable="true">'+val_c.message
			+'</td><td class="context-input" contenteditable="true" id="TD_El_'+ind+'">'+val_c.el
			+'</td><td class="" contenteditable="true">'+val_c.desc
			+'</td><td class="context-input code" id="TD_Code_'+ind+'" contenteditable="true">'+val_c.code
			+'</td><td class="context-input" id="TD_Binds_'+ind+'" contenteditable="true">'+val_c.binds
			;
			
			ind += 1;
			ht+= '</td><td class="w-10" style="text-align: center;">' 
			+ '<a href="#"   style="font-family: FontAwesome" id="TD_UpColumn_'+ind+'" data-toggle="tooltip" title="Move up">\uf139</a>'
			+ '<a href="#"   style="font-family: FontAwesome" id="TD_DownColumn_'+ind+'" data-toggle="tooltip" title="Move down">\uf13a</a>'
			+'<a href="#"   style="font-family: FontAwesome" id="TD_DelColumn_'+ind+'" data-toggle="tooltip" title="Remove column">\uf056</a>' 
			+'</td>';
		});
		ht += '</table>'; 
			
		ht += '<div class="d-flex flex-row-reverse"><a href="#" id="A_AddRow" class="align-middle btn btn-outline-primary btn-sm" style="font-family: FontAwesome" data-toggle="tooltip" title="Add column">\uf067</a></div>';
		
		$('#D_Modal_Default_sm').html(ht+'<input type="hidden" id="UID_Index" value="'+ind+'">');
		
		$('[id^=TD_DelColumn_]').on("click", function() {
			$(this).parents('tr').detach();
		 
		});
		
		$('[id^=TD_UpColumn_]').on("click", function() {
			const $row = $(this).parents('tr');
			$row.prev().before($row);			 
		});
		$('[id^=TD_DownColumn_]').on("click", function() {
			const $row = $(this).parents('tr');
			$row.next().after($row);		 
		});
		
		$('#A_AddRow').click(function () {
			const ind = Number($('#UID_Index').val())+1;
			$('#T_'+id).append(
			'<tr><td class="" contenteditable="true">' 
			+'</td><td class="" contenteditable="false">'+getOperSelect('', 'TD_Sel_Oper_'+ind)
			+'</td><td class="" contenteditable="false">'+getLevelSelect('', 'TD_Sel_Level_'+ind)
			+ (id == 'A_Af_Check'?'</td><td class="" contenteditable="false">'+getButtonSelect('', 'TD_Sel_Button_'+ind):'')
			+'</td><td class="" contenteditable="true">' 
			+'</td><td class="context-input code" contenteditable="true" id="TD_El_'+ind+'">' 
			+'</td><td class="" contenteditable="true">' 
			+'</td><td class="context-input" id="TD_Code_'+ind+'" contenteditable="true">' 
			+'</td><td class="context-input" id="TD_Binds_'+ind+'" contenteditable="true"></td><td>' 
			+'<a href="#"   style="font-family: FontAwesome" id="TD_UpColumn_'+ind+'" data-toggle="tooltip" title="Move up">\uf139</a>'
			+'<a href="#"   style="font-family: FontAwesome" id="TD_DownColumn_'+ind+'" data-toggle="tooltip" title="Move down">\uf13a</a>'
			+'<a href="#" style="font-family: FontAwesome" id="TD_DelColumn_'+ind+'" data-toggle="tooltip" title="Remove column">\uf056</a>'
			+'</td></tr>');	
			
			$('#TD_DelColumn_'+ind).on("click", function() {
				$(this).parents('tr').detach();
				 
			});
			$('#TD_UpColumn_'+ind).on("click", function() {
				const $row = $(this).parents('tr');
				$row.prev().before($row);			 
			});
			$('#TD_DownColumn_'+ind).on("click", function() {
				const $row = $(this).parents('tr');
				$row.next().after($row);		 
			});
		 
			$('#UID_Index').val(ind);	
			
			refreshContextHelper();
 			
		});
		refreshContextHelper();
		$('#M_Default_sm').modal({
			backdrop: 'static',
			keyboard: true
		});
		
		return;
	}
	
	if (id.indexOf('f_Process') > 0){
		$('#M_Default_sm_head').text('Process');
		$('#M_Default_sm_inner').addClass('m_wide');
		$('#I_Selected_El').val(id);
		let ind = 0;
		
		let help;
		if (id === 'A_Bf_Process') help = j_help["Before Process"];
		if (id === 'A_Af_Process') help = j_help["After Process"];
		
		ht = '<p class="muted">'+help+'</p><table class="table table-bordered table-responsive" id="T_'+id+'"><thead class="table-primary"><tr>';
		ht += '<th class="w-10">Name (ID)</th>';
		ht += '<th >Type</th>';
		if (id === 'A_Af_Process') ht += '<th>Button</th>'
		ht += '<th >Description</th>';
		ht += '<th class="w-75">Code</th>'
		if (id === 'A_Bf_Process') ht += '<th>Mapping</th>'
		ht += '<th>Binds</th><th>Message</th><th></th></tr></thead>';
		
		let p;
		if (id === 'A_Af_Process') p = j_page.after.Process;
		else p = j_page.before.Process;
		
		jQuery.each(p, function(c, val_c){
			ht +='<tr><td class="" contenteditable="true">'+c
			+'</td><td class="" contenteditable="false">'+getOperSelect(val_c.type, 'TD_Sel_Oper_'+ind)
			+ (id === 'A_Af_Process'?'</td><td class="" contenteditable="false">'+getButtonSelect(val_c.btn, 'TD_Sel_Button_'+ind):'')
			+'</td><td class="" contenteditable="true">'+val_c.desc
			+'</td><td class="context-input code" contenteditable="true" id="TD_Code_'+ind+'">'+String(val_c.code)
			+ (id === 'A_Bf_Process'?'</td><td class="context-input" id="TD_Mapping_'+ind+'" contenteditable="true">'+val_c.mapping: '')
			+'</td><td class="context-input" contenteditable="true" id="TD_Binds_'+ind+'">'+val_c.binds
			+'</td><td class="" contenteditable="true">'+val_c.message
			;
		 
			ind += 1;
			ht+= '</td><td class="w-10" style="text-align: center;">' 
			+ '<a href="#"   style="font-family: FontAwesome" id="TD_UpColumn_'+ind+'" data-toggle="tooltip" title="Move up">\uf139</a>'
			+ '<a href="#"   style="font-family: FontAwesome" id="TD_DownColumn_'+ind+'" data-toggle="tooltip" title="Move down">\uf13a</a>'
			+'<a href="#"   style="font-family: FontAwesome" id="TD_DelColumn_'+ind+'" data-toggle="tooltip" title="Remove column">\uf056</a>' 
			+'</td>';
		});
		ht += '</table>'; 
			
		ht += '<div class="d-flex flex-row-reverse"><a href="#" id="A_AddRow" class="align-middle btn btn-outline-primary btn-sm" style="font-family: FontAwesome" data-toggle="tooltip" title="Add column">\uf067</a></div>';
		
		$('#D_Modal_Default_sm').html(ht+'<input type="hidden" id="UID_Index" value="'+ind+'">');
		
		$('[id^=TD_DelColumn_]').on("click", function() {
			$(this).parents('tr').detach(); 
		});
		
		$('[id^=TD_UpColumn_]').on("click", function() {
			const $row = $(this).parents('tr');
			$row.prev().before($row);			 
		});
		$('[id^=TD_DownColumn_]').on("click", function() {
			const $row = $(this).parents('tr');
			$row.next().after($row);		 
		});
		
		$('#A_AddRow').click(function () {
			const ind = Number($('#UID_Index').val())+1;
			$('#T_'+id).append(
			'<tr><td class="" contenteditable="true">' 
			+'</td><td class="" contenteditable="false">'+getOperSelect('', 'TD_Sel_Oper_'+ind)
			+ (id === 'A_Af_Process'?'</td><td class="" contenteditable="false">'+getButtonSelect('', 'TD_Sel_Button_'+ind):'')
			+'</td><td class="" contenteditable="true">' 
			+'</td><td class="context-input code" contenteditable="true" id="TD_Code_'+ind+'">' 
			+  (id === 'A_Bf_Process'?'</td><td class="context-input" contenteditable="true" id="TD_Mapping_'+ind+'">':'</td>')
			+'</td><td class="context-input" contenteditable="true" id="TD_Binds_'+ind+'"></td><td class="" contenteditable="true"></td><td>' 
			+'<a href="#"   style="font-family: FontAwesome" id="TD_UpColumn_'+ind+'" data-toggle="tooltip" title="Move up">\uf139</a>'
			+'<a href="#"   style="font-family: FontAwesome" id="TD_DownColumn_'+ind+'" data-toggle="tooltip" title="Move down">\uf13a</a>'
			+'<a href="#" style="font-family: FontAwesome" id="TD_DelColumn_'+ind+'" data-toggle="tooltip" title="Remove column">\uf056</a>'
			+'</td></tr>');	
			
			$('#TD_DelColumn_'+ind).on("click", function() {
				$(this).parents('tr').detach(); 
			});
			$('#TD_UpColumn_'+ind).on("click", function() {
				const $row = $(this).parents('tr');
				$row.prev().before($row);			 
			});
			$('#TD_DownColumn_'+ind).on("click", function() {
				const $row = $(this).parents('tr');
				$row.next().after($row);		 
			});
		 
			$('#UID_Index').val(ind);	
			
			refreshContextHelper();
 			
		});
		
		
		refreshContextHelper();
		
		$('#M_Default_sm').modal({
			backdrop: 'static',
			keyboard: true
		});
		
		return;
	}
	
	let search;
	if (id){
		search = id.replace('A_bt_', '');
		type = j_page.page[search].type;
		cont = j_page.page[search];
		par = cont['parent'];
		$('#I_Selected_El').val(id);
	} else {
		if (j_page.page[$('#I_Selected_El').val().replace('A_bt_','')].type === 'div'){
			par = $('#I_Selected_El').val().replace('A_bt_','');
		} else { 
			par = j_page.page[$('#I_Selected_El').val().replace('A_bt_','')].parent;			
		}
	}
	
	$('#M_Default_sm_head').text(type);
	
	ht += '<div class="row"><div class="col-6 form-group">'
			+ '<label for="I_el_ID">Name (ID)</label>'
			+ '<input type="hidden" class="form-control" id="I_el_type" value="'+(id && cont.type?cont.type:type)+'"></input>'
			+ '<input type="hidden" class="form-control" id="I_el_ID_old" value="'+search+'"></input>'
			+ '<input type="text" class="form-control" id="I_el_ID" data-toggle="tooltip" title="Unique identificator of element" required="true" value="'
			+ (search?search:type.substring(0,1)+'_')
			+'"></input>'
			+ '</div>';
	ht += '<hr>';
	ht += '<div class="col-6 form-group">'
			+ '<label for="I_el_parent">Parent DIV</label>'
			+ '<input type="hidden" class="form-control" id="I_el_parent_old" value="'+(id?par:'')+'"></input>'
			+ '<select class="form-control" id="I_el_parent" title="Unique identificator of element" '+((id && cont.type?cont.type:type)==='div'?' disabled ':'')+'>'
			+ '<option value="Start" '+(par==='Start'?' selected ':'')+'>...</option>';
			
			jQuery.each(j_page.page, function(c, val_c){
				if (val_c.type === 'div') {
					ht += '<option value="'+c+'" '
					+(par===c?' selected ':'')	
					+'>'+c+'</option>';	
				}
			});
			
			ht +=  '</select></div></div>';
			
	jQuery.each(j_type.common, function(c, val_c){		
		if (!ht2[val_c.tab]) ht2[val_c.tab] = '';
		
		if (val_c.type === 'text') {			
			ht2[val_c.tab] += '<div class="col-6 form-group">'
			+ '<label class="m-1" for="I_el_'+c+'">'+val_c.label+'</label>'
			+ '<p class="text-muted small m-1">'+val_c.tooltip+'</p>'
			+ '<input type="text" class="form-control '+val_c.helper+'" id="I_el_'+c+'" data-toggle="tooltip" title="'+val_c.tooltip+'" required="'+val_c.mandatory+'" value="'
			+ (id?(cont[c]?cont[c]:''):val_c.default)
			+'"></input>'
			+ '</div>';
		}
		if (val_c.type === 'color') {
			ht2[val_c.tab] += '<div class="col-6 form-group">'
			+ '<label class="m-1" for="I_el_'+c+'">'+val_c.label+'</label>'
			+ '<p class="text-muted small m-1">'+val_c.tooltip+'</p>'
			+ '<input type="color" class="form-control" id="I_el_'+c+'" data-toggle="tooltip" title="'+val_c.tooltip+'" required="'+val_c.mandatory+'" value="'
			+ (id?(cont[c]?cont[c]:''):val_c.default)
			+'"></input>'
			+ '</div>';
		}
		if (val_c.type === 'textarea') {
			ht2[val_c.tab] += '<div class="col-6 form-group ">'
			+ '<label class="m-1" for="I_el_'+c+'">'+val_c.label+'</label>'
			+ '<p class="text-muted small m-1">'+val_c.tooltip+'</p>'
			+ '<textarea class="form-control '+val_c.helper+'" rows="5" id="I_el_'+c+'" data-toggle="tooltip" title="'+val_c.tooltip+'" required="'+val_c.mandatory+'"  '
			+ '>'+ (id?(cont[c]?cont[c]:''):val_c.default)+'</textarea>'
			+ '</div>';	
		}
		if (val_c.type === 'numeric') {
			ht2[val_c.tab] += '<div class="col-6 form-group ">'
			+ '<label class="m-1" for="I_el_'+c+'">'+val_c.label+'</label>'
			+ '<p class="text-muted small m-1">'+val_c.tooltip+'</p>'
			+ '<input type="number" class="form-control" id="I_el_'+c+'" data-toggle="tooltip" title="'+val_c.tooltip+'" required="'+val_c.mandatory+'" value="'
			+ (id?(cont[c]?cont[c]:''):val_c.default)
			+ '"></input>'
			+ '</div>';
		}
		if (val_c.type === 'select'){
			ht2[val_c.tab] += '<div class="col-6 form-group ">'
			+ '<label class="m-1" for="I_el_'+c+'">'+val_c.label+'</label>'
			+ '<p class="text-muted small m-1">'+val_c.tooltip+'</p>'
			+ '<select class="form-control" id="I_el_'+c+'" data-toggle="tooltip" title="'+val_c.tooltip+'" required="'+val_c.mandatory+'">';
			jQuery.each(val_c.values, function (d, e){
				ht2[val_c.tab] += '<option value="'+e+'" '
				+((id?(cont[c]?cont[c]:''):val_c.default)==e?' selected ':'')	
				+'>'+e+'</option>';				
			});
			ht2[val_c.tab] += '</select></div>';
		} 
	});
	let cl_index = 0;
	let col = '6';
	jQuery.each(j_type[type], function(c, val_c){	
		if (!ht2[val_c.tab]) ht2[val_c.tab] = '';
		
		if (val_c.col) col = val_c.col;
		else col = 6;
		
		if (val_c.type === 'text') {
			ht2[val_c.tab] += '<div class="col-'+col+' form-group">'
			+ '<label class="m-1" for="I_el_'+c+'">'+val_c.label+'</label>'
			+ '<p class="text-muted small m-1">'+val_c.tooltip+'</p>'
			+ '<input type="text" class="form-control '+val_c.helper+'" id="I_el_'+c+'" data-toggle="tooltip" title="'+val_c.tooltip+'" required="'+val_c.mandatory+'" value="'
			+ (id?(cont[c]?cont[c]:''):val_c.default)
			+'"></input>'
			+ '</div>';
		}
		if (val_c.type === 'color') {
			ht2[val_c.tab] += '<div class="col-'+col+' form-group ">'
			+ '<label class="m-1" for="I_el_'+c+'">'+val_c.label+'</label>'
			+ '<p class="text-muted small m-1">'+val_c.tooltip+'</p>'
			+ '<input type="color" class="form-control" id="I_el_'+c+'" data-toggle="tooltip" title="'+val_c.tooltip+'" required="'+val_c.mandatory+'" value="'
			+ (id?(cont[c]?cont[c]:''):val_c.default)
			+'"></input>'
			+ '</div>';
		}
		if (val_c.type === 'textarea') {
			ht2[val_c.tab] += '<div class="col-'+col+' form-group">'
			+ '<label class="m-1" for="I_el_'+c+'">'+val_c.label+'</label>'
			+ '<p class="text-muted small m-1">'+val_c.tooltip+'</p>'
			+ '<textarea class="form-control '+val_c.helper+'" rows="5" id="I_el_'+c+'" data-toggle="tooltip" title="'+val_c.tooltip+'" required="'+val_c.mandatory + '" >'
			+ (id?(cont[c]?cont[c]:''):val_c.default)
			+'</textarea>'
			+ (c=='SQL'?'<span class="icon-nav fa-flask float-right y_sql_workbench" id="sql_el_'+id+'"></span>':'')
			+ '</div>';
		}
		if (val_c.type === 'numeric') {
			ht2[val_c.tab] += '<div class="col-'+col+' form-group">'
			+ '<label class="m-1" for="I_el_'+c+'">'+val_c.label+'</label>'
			+ '<p class="text-muted small m-1">'+val_c.tooltip+'</p>'
			+ '<input type="number" class="form-control" id="I_el_'+c+'" data-toggle="tooltip" title="'+val_c.tooltip+'" required="'+val_c.mandatory+'" value="'
			+ (id?(cont[c]?cont[c]:''):val_c.default)
			+ '"></input>'
			+ '</div>';
		}
		if (val_c.type === 'select'){
			ht2[val_c.tab] += '<div class="col-'+col+' form-group ">'
			+ '<label class="m-1" for="I_el_'+c+'">'+val_c.label+'</label>'
			+ '<p class="text-muted small m-1">'+val_c.tooltip+'</p>'
			+ '<select class="form-control" id="I_el_'+c+'" data-toggle="tooltip" title="'+val_c.tooltip+'" required="'+val_c.mandatory+'">';
			jQuery.each(val_c.values, function (d, e){
				ht2[val_c.tab] += '<option value="'+e+'" '
				+((id?(cont[c]?cont[c]:''):val_c.default)==e?' selected ':'')	
				+'>'+e+'</option>';				
			});
			ht2[val_c.tab]+= '</select>'
			+ '</div>';
		}
		if (val_c.type === 'table'){
			ht2[val_c.tab] += '<div class="col-'+col+' form-group ">'
			+ '<label class="m-1" for="I_el_'+c+'">'+val_c.label+'</label>'
			+ '<p class="text-muted small m-1">'+val_c.tooltip+'</p>'
			+ '<table class="table table-bordered" id="I_el_'+c+'" data-toggle="tooltip" title="'+val_c.tooltip+'" required="'+val_c.mandatory+'"><thead class="table-primary"><tr>';
			
			jQuery.each(val_c.values, function (d, e){
				ht2[val_c.tab] += '<th>'+e+'</th>';
			});

			ht2[val_c.tab] += '<th>#</th><tr></thead>';
			
			if (id && cont[c]){
				jQuery.each(cont[c], function (d, e){
					ht2[val_c.tab] += '<tr>';
					let i = 0;
					jQuery.each(val_c.values, function (f, g){
						ht2[val_c.tab] += '<td class=" pad-slim '+val_c.helper+'" id="TD_'+f+'_'+cl_index+'" contenteditable="true">'+(e[i]?e[i]:'')+'</td>';
						i += 1;
					});
					cl_index += 1;
					ht2[val_c.tab]+= '</td><td class="w-10" style="text-align: center;">' 
						+ '<a href="#"   style="font-family: FontAwesome" id="TD_UpColumn_'+c+ '_'+cl_index+'" data-toggle="tooltip" title="Move up">\uf139</a>'
						+ '<a href="#"   style="font-family: FontAwesome" id="TD_DownColumn_'+c+ '_'+cl_index+'" data-toggle="tooltip" title="Move down">\uf13a</a>'
						+'<a href="#"   style="font-family: FontAwesome" id="TD_DelColumn_'+c+ '_'+cl_index+'" data-toggle="tooltip" title="Remove column">\uf056</a>' 
						+'</td>';
					
					ht2[val_c.tab] += '</tr>';
					
				}); 
			}
			else 
				for (let i = 0; i < 5; i++) { 
					ht2[val_c.tab] += '<tr>';
					jQuery.each(val_c.values, function (d, e){
						ht2[val_c.tab] += '<td class=" pad-slim '+val_c.helper+'" contenteditable="true" id="TD_'+d+'_'+cl_index+'"></td>';
					});
					cl_index += 1;
					ht2[val_c.tab]+= '</td><td class="w-10" style="text-align: center;">' 
						+ '<a href="#"   style="font-family: FontAwesome" id="TD_UpColumn_'+c+ '_'+cl_index+'" data-toggle="tooltip" title="Move up">\uf139</a>'
						+ '<a href="#"   style="font-family: FontAwesome" id="TD_DownColumn_'+c+ '_'+cl_index+'" data-toggle="tooltip" title="Move down">\uf13a</a>'
						+'<a href="#"   style="font-family: FontAwesome" id="TD_DelColumn_'+c+ '_'+cl_index+'" data-toggle="tooltip" title="Remove column">\uf056</a>' 
						+'</td>';
					
					ht2[val_c.tab] += '</tr>';
				}

			ht2[val_c.tab] += '</table>';
			ht2[val_c.tab] += '<a href="#" id="A_AddRow_'+c+ '" class="align-middle btn btn-outline-primary btn-sm" style="font-family: FontAwesome" data-toggle="tooltip" title="Add column">\uf067</a>'
			+ '</div>';
			
			
		}
	
		
	});
	
	let ui = '<ul class="nav nav-tabs" id="U_Properties" role="tablist">';
	let li = '<div class="tab-content" id="U_Properties_Content">'
	let act = 'active';
	jQuery.each(ht2, function (d, e){
		ui += 
		'<li class="nav-item">'
		+'<a class="nav-link '+act+'" id="UI_'+d+'" data-toggle="tab" href="#UID_'+d+'" role="tab" aria-controls="UID_'+d+'" aria-selected="true">'+d+'</a>'
		+'</li>'
		
		li += '<div class="tab-pane fade show '+act+'" id="UID_'+d+'" role="tabpanel" aria-labelledby="UI_'+d+'"><p></p><div class="row">'
		li += e;
		li += '</div></div>';
		act = '';
		
	});
	li += '</div>';
	ui += '</ul>';
	
	$('#D_Modal_Default_sm').html(ht+'<div class="flex-column"><input type="hidden" id="UID_Index" value="'+cl_index+'">' + ui+li+ '</div>');	
	
	// ID checks
	$('#I_el_ID').on("change", function() {
		if ($(this).val().charAt(0) === 'y'){
			$(this).addClass('is-invalid');
			$(this).after( "<div class='invalid-feedback y_invalid_id'>ID can't start with y</div>" );
			$(this).focus();
			$('#B_Modal_Save').attr("disabled", true);
			return;
		}
		if ($(this).val() !== $('#I_el_ID_old').val() && j_page.page[$(this).val()]){
			$(this).addClass('is-invalid');
			$(this).after( "<div class='invalid-feedback y_invalid_id'>ID already exists</div>" );
			$(this).focus();
			$('#B_Modal_Save').attr("disabled", true);
			return;
		}
		
		$(this).removeClass('is-invalid');
		$(this).addClass('is-valid');
		$('.y_invalid_id').remove();
		$('#B_Modal_Save').attr("disabled", false);
		
	});
	
	
	$('[id^=TD_UpColumn_]').on("click", function() {
		const $row = $(this).parents('tr');
		$row.prev().before($row);			 
	});
	$('[id^=TD_DownColumn_]').on("click", function() {
		const $row = $(this).parents('tr');
		$row.next().after($row);		 
	});
	$('[id^=TD_DelColumn_]').on("click", function() {
		$(this).parents('tr').detach();
	 
	});
	
	$('[id^=A_AddRow_]').click(function () {
		const i = $(this).attr('id').replace('A_AddRow_', '');
		let ht3 = '<tr>';
		jQuery.each(j_type[type][i].values, function (d, e){
			ht3 += '<td class=" pad-slim '+j_type[type][i].helper+'" contenteditable="true" id="TD_'+d+'_'+cl_index+'"></td>';
		});
		cl_index += 1;
		ht3 += '</td><td class="w-10" style="text-align: center;">' 
		+ '<a href="#"   style="font-family: FontAwesome" id="TD_UpColumn_'+i+ '_'+cl_index+'" data-toggle="tooltip" title="Move up">\uf139</a>'
		+ '<a href="#"   style="font-family: FontAwesome" id="TD_DownColumn_'+i+ '_'+cl_index+'" data-toggle="tooltip" title="Move down">\uf13a</a>'
		+ '<a href="#"   style="font-family: FontAwesome" id="TD_DelColumn_'+i+ '_'+cl_index+'" data-toggle="tooltip" title="Remove column">\uf056</a>' 
		+ '</td>';
		ht3 += '</tr>';
			
		$('#I_el_'+i).append(ht3);	
		
		$('#TD_UpColumn_'+i+ '_'+cl_index).on("click", function() {
			const $row = $(this).parents('tr');
			$row.prev().before($row);			 
		});
		$('#TD_DownColumn_'+i+ '_'+cl_index).on("click", function() {
			const $row = $(this).parents('tr');
			$row.next().after($row);		 
		});
		$('#TD_DelColumn_'+i+ '_'+cl_index).on("click", function() {
			$(this).parents('tr').detach();		 
		});
		refreshContextHelper();
	});
	
	refreshContextHelper();
	
	$(".y_sql_workbench").on('click', function(e) {
		
		getSQLElementsSelect($(this).attr('id').replace('sql_el_', ''));
		getSQLElement($(this).attr('id').replace('sql_el_', ''));
		
		$('.modal').modal('hide');
		$('.modal').css('overflow-y', 'auto');
		$('#M_sql').modal({
			backdrop: 'static',
			keyboard: true
		});
	});
	
	$('#M_Default_sm').modal({
			backdrop: 'static',
			keyboard: true
	});
	
}
/**
 * Refresh context helper
 *  
 */
function refreshContextHelper(){
	$(".context-input").on('contextmenu', function(e) {
		const top = e.pageY - 10;
		const left = e.pageX - 30;
		let mn = "#context-input";
	
		$('#I_Selected_Context').val($(this).attr('id'));
		
		$(mn).css({
			display: "block",
			top: top,
			left: left,
			"z-index":1200
		}).addClass("show");
			return false;  
	}).on("click", function() {
		$("[id^=context-input]").removeClass("show").hide(); 			
	});
	$(".context-modal").on('contextmenu', function(e) {
		const top = e.pageY - 10;
		const left = e.pageX - 30;
		let mn = "#context-modal";
	
		$('#I_Selected_Context').val($(this).attr('id'));
		
		$(mn).css({
			display: "block",
			top: top,
			left: left,
			"z-index":1200
		}).addClass("show");
			return false;  
	}).on("click", function() {
		$("[id^=context-modal]").removeClass("show").hide(); 			
	});
	$(".context-button").on('contextmenu', function(e) {
		const top = e.pageY - 10;
		const left = e.pageX - 30;
		let mn = "#context-button";
	
		$('#I_Selected_Context').val($(this).attr('id'));
		
		$(mn).css({
			display: "block",
			top: top,
			left: left,
			"z-index":1200
		}).addClass("show");
			return false;  
	}).on("click", function() {
		$("[id^=context-button]").removeClass("show").hide(); 			
	});
	$(".context-element").on('contextmenu', function(e) {
		const top = e.pageY - 10;
		const left = e.pageX - 30;
		let mn = "#context-element";
	
		$('#I_Selected_Context').val($(this).attr('id'));
		
		$(mn).css({
			display: "block",
			top: top,
			left: left,
			"z-index":1200
		}).addClass("show");
			return false;  
	}).on("click", function() {
		$("[id^=context-element]").removeClass("show").hide(); 			
	});
	$(".context-page").on('contextmenu', function(e) {
		const top = e.pageY - 10;
		const left = e.pageX - 30;
		let mn = "#context-page";
	
		$('#I_Selected_Context').val($(this).attr('id'));
		
		$(mn).css({
			display: "block",
			top: top,
			left: left,
			"z-index":1200
		}).addClass("show");
			return false;  
	}).on("click", function() {
		$("[id^=context-page]").removeClass("show").hide(); 			
	});
	$(".context-css-text").on('contextmenu', function(e) {
		const top = e.pageY - 10;
		const left = e.pageX - 30;
		let mn = "#context-css-text";
	
		$('#I_Selected_Context').val($(this).attr('id'));
		
		$(mn).css({
			display: "block",
			top: top,
			left: left,
			"z-index":1200
		}).addClass("show");
			return false;  
	}).on("click", function() {
		$("[id^=context-css-text]").removeClass("show").hide(); 			
	});
	$(".context-css-flex").on('contextmenu', function(e) {
		const top = e.pageY - 10;
		const left = e.pageX - 30;
		let mn = "#context-css-flex";
	
		$('#I_Selected_Context').val($(this).attr('id'));
		
		$(mn).css({
			display: "block",
			top: top,
			left: left,
			"z-index":1200
		}).addClass("show");
			return false;  
	}).on("click", function() {
		$("[id^=context-css-flex]").removeClass("show").hide(); 			
	});
	$(".context-permission").on('contextmenu', function(e) {
		const top = e.pageY - 10;
		const left = e.pageX - 30;
		let mn = "#context-permission";
	
		$('#I_Selected_Context').val($(this).attr('id'));
		
		$(mn).css({
			display: "block",
			top: top,
			left: left,
			"z-index":1200
		}).addClass("show");
			return false;  
	}).on("click", function() {
		$("[id^=context-permission]").removeClass("show").hide(); 			
	});
	$(".context-fa").on('contextmenu', function(e) {
		const top = e.pageY - 10;
		const left = e.pageX - 30;
		let mn = "#context-fa";
	
		$('#I_Selected_Context').val($(this).attr('id'));
		
		$(mn).css({
			display: "block",
			top: top,
			left: left,
			"z-index":1200
		}).addClass("show");
			return false;  
	}).on("click", function() {
		$("[id^=context-fa]").removeClass("show").hide(); 			
	});
	
}
$(document).click(function() {
    $("[id^=context-]").removeClass("show").hide();
});
/**
 * Helper function to import configuration
 * @r {String}
 */
function f_TextRead(r) {
    r.onloadend = function(event) {
		$('#I_NetworkImport').val(event.target.result);
    }
}
/**
 * File reader
 * 
 */
function f_FileSelection() {
	const file = I_ImportFile.files[0],
        r = new FileReader();
    f_TextRead(r);
    r.readAsText(file);
}
/**
 * Util function for converting object to array
 * @obj {Object}
 */
function objectToArray(obj) {
	return Object.keys(obj).map(function (key) {
	  obj[key].id = key;
	  return obj[key];
	});
}
/**
 * Function to load page settings to form
 *
 */
function showPageSettings (){
	
	if (!j_page.settings) j_page.settings = {};
	 
	if (j_page.settings.title) $('#I_el_page_title').val(j_page.settings.title);
	else $('#I_el_page_title').val('');
	
	if (j_page.settings.category) $('#I_el_page_category').val(j_page.settings.category);
	else $('#I_el_page_category').val('');
	
	if (j_page.settings.desc) $('#I_el_page_desc').val(j_page.settings.desc);
	else $('#I_el_page_desc').val('');
	
	if (j_page.settings.permission) $('#I_el_page_permission').val(j_page.settings.permission);
	else $('#I_el_page_permission').val('');
	
	if (j_page.settings.js) $('#I_el_page_js').val(j_page.settings.js);
	else $('#I_el_page_js').val('');
	
	if (j_page.settings.css) $('#I_el_page_css').val(j_page.settings.css);
	else $('#I_el_page_css').val('');
	 
	$('#M_Page').modal({
			backdrop: 'static',
			keyboard: true
	});
}
/**
 * Filter function to remove - values
 * @value
 */
function filterDeleted(value) {
	return value[1] != '-';
}
 
 $(document).ready(function() {
	 
	showRegionTree();
	refreshTree();
	ext_gen();
	 
	$('#GotoImportNetwork').on("click", function(){
		
		$('#I_NetworkImport').val(JSON.stringify(j_page, null, ' '));
		
		$('#B_ExportScreen').attr('href', 'data:text/json;charset=utf-8,' + encodeURIComponent($('#I_NetworkImport').val()) + '');
		
		$('#I_ImportFile').change(f_FileSelection);
		
		$('#M_ImportScreen').modal({
			backdrop: 'static',
			keyboard: true
		})
	});
	
	$('#GotoMenu').on("click", function(){
		$('#D_Tree_Panel').collapse('toggle');
		 
	});
	
	$("#B_ImportScreen").on("click", function(e) {
		j_page = JSON.parse($('#I_NetworkImport').val());
		$(".srt").sortable("destroy");
		showRegionTree();
		refreshTree();
		
		ext_gen();
		
		$('#I_Page_Name').val(j_page.name);
	});
	
	$("#I_Page_Name").on("change", function(e) {
		const nm = $("#I_Page_Name").val().toLowerCase().replace(/\s/g, "_");
		$("#I_Page_Name").val(nm);
		j_page.name = nm; 		
	});
	
	
	$("#B_ImportLoadDemo").on("click", function(e) {
		$('#I_NetworkImport').val(JSON.stringify(demo));		
	});
	
	$("#B_Modal_Save").on('click', function(e) {
		
		saveModal();			 
	});
	$("#B_Modal_Menu_Save").on('click', function(e) {
		
		saveMenu();			 
	});
	
	
	$("#GotoRun").on('click', function(e) {
		
		window.open('run/'+$('#I_Page_Name').val(),'_blank');			 
	});
	
	$("#GotoDeploy").on('click', function(e) {
		ext_publish(); 
	});
	$("#GotoDownload").on('click', function(e) {
		ext_download(); 
		
		$('#M_Files').modal({
			backdrop: 'static',
			keyboard: true
		})
	});
	
	$("#GotoMenuConfig").on('click', function(e) {
		ext_get_menu(); 
		
		$('#M_Menu').modal({
			backdrop: 'static',
			keyboard: true
		})
	});
	
	$("#GotoWizard").on('click', function(e) {
		
		$('#M_Wizard').modal({
			backdrop: 'static',
			keyboard: true
		})
	});
	
	$(".GotoLogs").on('click', function(e) {
		ext_get_logs();
		$('#M_Logs').modal({
			backdrop: 'static',
			keyboard: true
		})
	});
	
	$("#GotoSettings").on('click', function(e) {
		showPageSettings(); 		
		
	});
	
	$("#B_sql_execute").on('click', function(e) {
		ext_get_sql(); 				
	});
	$("#B_sql_info").on('click', function(e) {
		ext_get_sql('<info>'); 				
	});
	
	$("#B_Modal_Page_Save").on('click', function(e) {
		j_page.settings.title = $('#I_el_page_title').val();
		j_page.settings.permission = $('#I_el_page_permission').val();
		j_page.settings.js = $('#I_el_page_js').val();
		j_page.settings.css = $('#I_el_page_css').val();
		j_page.settings.category = $('#I_el_page_category').val();
		j_page.settings.desc = $('#I_el_page_desc').val();
	});
	
	$("#B_Wizard_Batch").on('click', function(e) {
		showBatchTable();
		$('#M_Wizard_Batch').modal({
			backdrop: 'static',
			keyboard: true
		});
	});
	
	$("#GotoDoc").on('click', function(e) {
		
		const filename  = $('#I_Page_Name').val()+'.pdf';
		
 
		$('#D_Screen').addClass('div_exp');
		
		html2canvas(document.querySelector('#D_Screen'), 
								{
								 height:1200
								,width:1200
								/*,scrollX:-$('#D_Tree').width()+10 */
								}
						 ).then(canvas => {
			let pdf = new jsPDF('p', 'mm', 'a4');

			
			pdf.setFontStyle("bold");
			pdf.setFontSize(22);
			pdf.text((j_page.settings.title?j_page.settings.title:'?'), 10, 10);
			pdf.line(10, 15, 200, 15)
			
			pdf.setFontStyle("italic");
			pdf.setFontSize(10);
			pdf.text('ID:'+$('#I_Page_Name').val(), 10, 20);
			pdf.setFontStyle("normal");
			
			pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 30,  180, 180);
			
			pdf.text((j_page.settings.desc?j_page.settings.desc:'')  , 10, 190,{maxWidth:180, align:'justify'});
			
			pdf.addPage('a4', '0');
			
			var aaa = [];
			
			jQuery.each(j_page.page, function(c, val_c){
				if(c === 'sort')return;
				aaa.push({'id':(val_c.label?val_c.label:c), 'label':'', 'desc':(val_c.tooltip?val_c.tooltip:'')});
				if (val_c.type) aaa.push({'id':'', 'label':'Type:', 'desc':val_c.type});
				if (val_c.doc_desc) aaa.push({'id':'', 'label':'Description:', 'desc':val_c.doc_desc});
				if (val_c.doc_act) aaa.push({'id':'', 'label':'Action:', 'desc':val_c.doc_act});
				if (val_c.doc_source) aaa.push({'id':'', 'label':'Source:', 'desc':val_c.doc_source});
				if (val_c.doc_open) aaa.push({'id':'', 'label':'Open points:', 'desc':val_c.doc_open});
				
				if (val_c.action) aaa.push({'id':'', 'label':'Button action:', 'desc':val_c.action});
				if (val_c.goto_page) aaa.push({'id':'', 'label':'Go to page:', 'desc':val_c.goto_page});
				
				if (val_c.modal) aaa.push({'id':'', 'label':'Open Modal:', 'desc':val_c.modal});
				
				if (val_c.mandatory) aaa.push({'id':'', 'label':'Mandatory:', 'desc':val_c.mandatory});
				if (val_c.refresh) aaa.push({'id':'', 'label':'Refresh element:', 'desc':val_c.refresh});
				
				if (val_c.value) aaa.push({'id':'', 'label':'Element Value:', 'desc':val_c.value});
				
				if (val_c.SQL) aaa.push({'id':'', 'label':'SQL:', 'desc':val_c.SQL});
				
				if (val_c.show_if_txt) aaa.push({'id':'', 'label':'Show if:', 'desc':val_c.show_if_txt});
				
				if (val_c.read_if_txt) aaa.push({'id':'', 'label':'Read if:', 'desc':val_c.read_if_txt});
				if (val_c.permission) aaa.push({'id':'', 'label':'Permissions:', 'desc':val_c.permission});
				
				aaa.push({'id':'', 'label':'', 'desc':''});
				 
			});
			 
			//pdf.table(1, 1, aaa, null, {autoSize:true, printHeaders:false, padding:[0,0,0,0]});
			pdf.autoTable({
					body: aaa
					,theme:'plain'
					,columnStyles: { id: { fontStyle: 'bold', cellWidth:40 }, label: { fontStyle: 'bold', halign:'right', cellWidth:20 } }
					 
			});
			 
			pdf.save(filename);
		});
		
		$('#D_Screen').removeClass('div_exp');
		
		/*$('#M_doc').modal({
			backdrop: 'static',
			keyboard: true
		});*/
	})
	
	$("#GotoSQL").on('click', function(e) {
		getSQLElementsSelect();
		$('#M_sql').modal({
			backdrop: 'static',
			keyboard: true
		});
	});
	
	
	
	$("#B_Modal_Wizard_Batch_Save").on('click', function(e) {
		saveBatchTable();
		$(".srt").sortable("destroy");
		showRegionTree();
		refreshTree();
		ext_gen();
		 
	});
	
	$("#B_sql_save").on('click', function(e) {
		const id = $('#S_sql_elements_select').val();
		
		let binds = '';
		$('[id^=td_bind_]').each(function() {
			if ($( this ).text() !== ''){
				if (binds === '') binds = $( this ).text();
				else binds += ',' + $( this ).text();
			}
		});
		
		
		//save labels/mapping
		
		const head = $('.y_mapping_header').find('th');
		const label = $('.y_mapping_label').find('th');
		 
		
		if (id != ''){
			if (j_page.page[id]){
				
				j_page.page[id].binds = binds;
				j_page.page[id].SQL = $('#T_sql_textarea').val();
				
				
				if (j_page.page[id].type === 'table' || j_page.page[id].type === 'data-card'){
					// update existing
					 
					jQuery.each(j_page.page[id].columns, function(k, k_val){
						let found = 0;
						jQuery.each (head, function (h, h_val){
							if (head.eq(h).text().replace(/ /g,'') === k_val[0]){
								j_page.page[id].columns[k][1] = label.eq(h).text();		
								found = 1;
							}							
						});	
						if (found === 0)
							j_page.page[id].columns[k][1] = '-';
					});
					//remove with label -
					 j_page.page[id].columns = j_page.page[id].columns.filter(filterDeleted);
					
					//add new
					jQuery.each (head, function (h, h_val){
						if (label.eq(h).text().replace(/ /g,'') !== '-') {
							let found = 0;
							jQuery.each(j_page.page[id].columns, function(k, k_val){
								if (head.eq(h).text().replace(/ /g,'') === k_val[0]){
									found = 1;
								}							
							});
							if (found === 0) {
								var h = [head.eq(h).text().replace(/ /g,''), label.eq(h).text()];
								j_page.page[id].columns.push(h);
							}	
						}
					});
					
				}
			 
				$('#I_el_SQL').val($('#T_sql_textarea').val());
				$('#I_el_binds').val(binds);
				
				ext_gen();
			}
			if (j_page.before.Process[id]){
				j_page.before.Process[id].binds = binds;
				j_page.before.Process[id].code = $('#T_sql_textarea').val();
				
				let comma = '';
				let list = '';
				jQuery.each (head, function (h, h_val){
					list = list + comma + head.eq(h).text();		
					comma = ',';											
				});
				j_page.before.Process[id].mapping = list;
				
			}
			if (j_page.after.Process[id]){
				j_page.after.Process[id].binds = binds;
				j_page.after.Process[id].code = $('#T_sql_textarea').val();
				 
			}
			
			if (j_page.before.Check[id]){				
				j_page.before.Check[id].binds = binds;
				j_page.before.Check[id].code = $('#T_sql_textarea').val();
				 
			}
			if (j_page.after.Check[id]){
				j_page.after.Check[id].binds = binds;
				j_page.after.Check[id].code = $('#T_sql_textarea').val();
				
			}
			
			$('#D_toast').toast({delay:2000});
		 
			$('#D_toast_body').html('SQL saved..');
			$('#D_toast').toast('show');
		}
		 
	});
	
	
	$('.carousel').carousel({
		interval: false
	});
	
	
 });