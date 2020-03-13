<?php
/*
	Copyright (c) 2019 pj1985 
	
	This code is part of the Raspberry framework (https://github.com/pj1985/rberry)
	
	You can redistribute it and/or modify it under the terms of the GNU General Public License
	as published by the Free Software Foundation, either version 3 of the License, or later.
	
	You should have received a copy of the GNU General Public License along
	with Raspberry.  See http://www.gnu.org/licenses/
*/
 
class gen_gui extends gen_common{

	 
	protected 
		$word_long = array();
	protected 
		$word_short = array();
	protected
		$gui;
	
	function get_page_attr ($f3, $args){
		$page = $f3->get('POST.page');
		$app = $f3->get('PARAMS.app');
		$el_id = $f3->get('POST.el_id');
		$attr_id = $f3->get('POST.attr_id');
		
		$fl = json_decode(file_get_contents("assets/".$app."/".$page.".j"));
		$elements = (array) $fl->page;
		 
		echo $elements[$el_id]->$attr_id;
		
	}
	function replace_param($f3, $text) {
		if ($text && $f3->get('T_FORM_PARAMS'))
				foreach ($f3->get('T_FORM_PARAMS') as $p=>$v){
					$rep = array("{{".$p."}}", "{{ ".$p." }}");
					$text = str_replace($rep, $v, $text);
					
				}
				
		$text = preg_replace("{{.*}}", "", $text);	
		return $text;
	}
	function db_check_error(){
		$db_errors = $this->db->errorInfo();
		
		if( !empty($db_errors) ){ 
			$error = '';
			foreach ($db_errors	as $val){
				if ($val[2])
					$error.= $val[0].':'.$val[1].':'.$val[2];
			}
			if ($error != ''){
				$this->wlog('SQL ERROR:'.$error);
				//throw new Exception($error);
			}
		}
	}
	function gen_element($f3, $id, $in, $mode){
		$page = (array) $this->gui->page;
		$gui = $page[$id];
		if ($mode == 'dev')
			$f3->set('T_ID', 'xx_'.$id);
		else 
			$f3->set('T_ID', $id);
		if ($mode == 'dev')
			$f3->set('T_ID_HINT', $in);
		 
		$f3->set('T_TAB_PAGE', '1');
		
		$f3->set('T_GUI', $gui);
		$f3->set('T_CODE', 'common');
		$f3->set('T_COMMON', preg_replace('/\s\s+/', ' ', Template::instance()->render('Screen_template.htm')));
		
		if ($gui->type == 'div'){
			
			$f3->set('T_CODE', 'div start');
			echo preg_replace('/\s\s+/', ' ',Template::instance()->render('Screen_template.htm'));
			
			foreach ($gui->sort	as $val){
				
				$show = true;
				if ($page[$val]->show_if == 'Never')
					$show = false;
				
				if ($page[$val]->show_if== 'SQL' && $mode == 'prod'){
					$cnt = $this->exec_sql_bind($f3, $page[$val]->show_if_txt);
					
					if ($cnt == 0) 
						$show = false;
				}
				
				if ($show)
					$this->gen_element($f3, $val, $in.'>'.$val, $mode);
				 
			}	
			if ($mode == 'dev')
				$f3->set('T_ID', 'xx_'.$id);
			else 
				$f3->set('T_ID', $id);
			$f3->set('T_GUI', $gui);
			$f3->set('T_CODE', 'div end');
			echo preg_replace('/\s\s+/', ' ',Template::instance()->render('Screen_template.htm'));
		}
		else if ($gui->type == 'table'){
			
			$f3->set('T_CODE', 'table start');
			echo preg_replace('/\s\s+/', ' ',Template::instance()->render('Screen_template.htm'));
			
			$f3->set('T_CODE', 'table end');
			echo preg_replace('/\s\s+/', ' ',Template::instance()->render('Screen_template.htm'));
			
		}
		else {
			$f3->set('T_CODE', $gui->type);
			
			if ($gui->text)
				$gui->text = $this->replace_param($f3, $gui->text);	
			if ($gui->label)
				$gui->label = $this->replace_param($f3, $gui->label);	
			if ($gui->badge_text)
				$gui->badge_text = $this->replace_param($f3, $gui->badge_text);	
			
			if ($gui->read_if == 'Always')
				$f3->set('T_READONLY', 'readonly disabled');
			else
				$f3->set('T_READONLY', '');
			
			if ($gui->read_if == 'SQL'){
				$cnt = $this->exec_sql_bind($f3, $gui->read_if_txt);
				
				if ($cnt > 0)
					$f3->set('T_READONLY', 'readonly disabled');
				else 
					$f3->set('T_READONLY', '');
			}
			
			if ($gui->type == 'md_to_html'){
				$f3->set('T_MD_TEXT', \Markdown::instance()->convert($gui->text));
			}			
			 
			
			
			if ($gui->type == 'input select'){
				$options = (array)[];
				$f3->set('T_OPTION', $options  );
				if ($gui->subtype == 'list'){
					
					foreach (explode(',',$gui->value) as $val){
						$val_split = explode(':',$val);
						$o = (object) array('label' => $val_split[0], 'value'=>$val_split[1]);
						array_push($options,$o);
					}
					$f3->set('T_OPTION', $options);
				}
				if ($gui->subtype == 'sql' && $mode == 'prod'){
					
					$cn = $this->exec_sql_bind($f3, $gui->value);
					foreach ($f3->get('T_RES') as $val){
						$o = (object) array('label' => ($val['label'] ?? $val['LABEL'] ?? $val['Label']) , 'value'=>($val['value'] ?? $val['Value'] ?? $val['VALUE']));
						array_push($options,$o);
					}
					$f3->set('T_OPTION', $options);
				}
			}
			echo Template::instance()->render('Screen_template.htm');
		}
		 
		
	}
	function clear_text($text) {
		
		//return preg_replace('/[^\P{C}\s]+/u', '', $text);
		//return filter_var($text, FILTER_UNSAFE_RAW, FILTER_FLAG_STRIP_LOW|FILTER_FLAG_STRIP_HIGH);
		return filter_var(preg_replace('/\s\s+/', ' ', $text), FILTER_UNSAFE_RAW, FILTER_FLAG_STRIP_LOW|FILTER_FLAG_STRIP_HIGH);
		//return $text;
	}
	function exec_sql_bind ($f3, $sql_text) {
				
		$this->wlog('EXEC SQL BIND START');
		$sql_text = $this->clear_text($sql_text);
		$this->wlog($sql_text);
		
		$params = $f3->get('T_FORM_PARAMS');
		
		$this->wlog('PARAMS START');
		if ($params)
			foreach ($params as $p=>$v){
				$this->wlog($p.'>'.$v);			
			}
		$this->wlog('PARAMS END');
		
		$words = preg_split('/\s/', $sql_text, -1, PREG_SPLIT_NO_EMPTY);
		$binds = (object)[];
		$this->wlog('BIND START');
		foreach ($words as $val){
			if (substr($val, 0, 1) == ':'){
				$val = str_replace(':', '', $val);
				if ($params>$val){	
					$binds->$val = $params->$val;
					$this->wlog($val.'>'.$params->$val);		
				} else {
					$binds->$val = 'NULL';
					$this->wlog($val.'>NULL');
				}
			}
		}
		$this->wlog('BIND END');
		$cn = 0;
		
		$f3->set('T_RES', $this->db->exec($sql_text, $binds));
		$this->db_check_error();
		
		$cn = $this->db->count();
		$this->wlog('EXEC SQL BIND START');
		
		return $cn;
	}
	function get_chart_data ($f3, $args) {
		
		$f3->set('ONERROR',
			function($f3) {				
				$this->wlog('GET_CHART_DATA ERROR:'.$f3->get('ERROR.text'));
			}
		);
		
		$this->wlog('GET_CHART_DATA START');
		
		$j_dataset = (object) array('label'=> '', 'backgroundColor'=>[], 'borderColor'=>'#000000', 'data'=>[], 'fill'=>'false');
		$j_data = (object) array('labels'=>[], 'datasets'=>[]);
		$page = $f3->get('POST.page');
		$this->wlog('page:'.$page);
		$app = $f3->get('PARAMS.app');
		$this->wlog('app:'.$app);
		$el_id = $f3->get('POST.el_id');
		$this->wlog('el_id:'.$el_id);
		$binds = (array)$f3->get('POST.binds');
		$sql_page = '';
		
		$fl = json_decode(file_get_contents("assets/".$app."/".$page.".j"));
		$elements = (array) $fl->page;
		
		//$f3->set('T_COLS', $elements[$el_id]->columns);
		
		//array_push($j_dataset->backgroundColor, $elements[$el_id]->ds1_bg_color);
		$j_dataset->backgroundColor = explode(',',str_replace("", " ", $elements[$el_id]->ds1_bg_color));
		$j_dataset->borderColor = explode(',',str_replace("", " ", $elements[$el_id]->ds1_border_color));
		
		if ($elements[$el_id]->ds1_fill == 'Y') 
			$j_dataset->fill = true;
		else 
			$j_dataset->fill = false;
		
		$j_dataset->label = $elements[$el_id]->ds1_label;
		$j_dataset->lineTension = $elements[$el_id]->ds1_lineTension;
		
		
		$this->wlog('SQL:'.$this->clear_text($elements[$el_id]->ds1_SQL));
		$f3->set('T_RES', $this->db->exec($this->clear_text($elements[$el_id]->ds1_SQL), $binds));
		$this->db_check_error();
		
		//$this->wlog($this->db->log());
		$this->wlog('set data');
		
		if ($f3->get('T_RES'))
			foreach ($f3->get('T_RES') as $r){
				$this->wlog(($r['Label']??$r['label']??$r['LABEL']));
				array_push($j_data->labels, ($r['Label']??$r['label']??$r['LABEL']));
				$this->wlog(($r['Value']??$r['value']??$r['VALUE']));
				array_push($j_dataset->data, ($r['Value']??$r['value']??$r['VALUE'])); 
				
				if ($r['Color'])
					array_push($j_dataset->backgroundColor, $r['Color']);
				
			}
		if (count($j_dataset->backgroundColor) == 1)
			$j_dataset->backgroundColor = $elements[$el_id]->ds1_bg_color;
		
		$this->wlog('render');
		array_push($j_data->datasets, $j_dataset);
		
		
		//print_r($f3->get('T_RES'));
		echo json_encode($j_data);	
		
		$this->wlog('GET_CHART_DATA END');
		
	}
	function get_progress_data ($f3, $args) {
		
		$f3->set('ONERROR',
			function($f3) {				
				$this->wlog('GET_PROGRESS_DATA ERROR:'.$f3->get('ERROR.text'));
			}
		);
		
		$this->wlog('GET_PROGRESS_DATA START');
		
		$page = $f3->get('POST.page');
		$this->wlog('page:'.$page);
		$app = $f3->get('PARAMS.app');
		$this->wlog('app:'.$app);
		$el_id = $f3->get('POST.el_id');
		$this->wlog('el_id:'.$el_id);
		$binds = (array)$f3->get('POST.binds');
		$sql_page = '';
		
		$fl = json_decode(file_get_contents("assets/".$app."/".$page.".j"));
		$elements = (array) $fl->page;
		  
		$this->wlog('SQL:'.$this->clear_text($elements[$el_id]->SQL));
		$f3->set('T_RES', $this->db->exec($this->clear_text($elements[$el_id]->SQL), $binds));
		$this->db_check_error();
		
		$this->wlog('set data');
		
		$ret = '';
		foreach ($f3->get('T_RES') as $r){
			$this->wlog(($r['Value']??$r['value']??$r['VALUE']));
			$ret = ($r['Value']??$r['value']??$r['VALUE']); 
			
		}
		echo $ret;
		$this->wlog('GET_PROGRESS_DATA END');
		
	}
	function get_sql ($f3, $args) {
		
		$f3->set('ONERROR',
			function($f3) {				
				$this->wlog('GET_SQL ERROR:'.$f3->get('ERROR.text'));
			}
		);
		
		$this->wlog('GET_SQL START');
		
		$sql = $f3->get('POST.i_sql');
		$this->wlog('sql:'.$sql);
		$app = $f3->get('PARAMS.app');
		$this->wlog('app:'.$app);
		$binds = (array)$f3->get('POST.i_binds');
		  
		$this->wlog('SQL:'.$this->clear_text($sql));
		
		if ($sql == '<info>')
			try {
				
				$f3->set('T_SQL_MESSAGE', 
					'<br>Driver:'.$this->db->driver().
					'<br>Version:'.$this->db->version().
					'<br>Name:'.$this->db->name().
					'<br>DB Connect:'.$f3->get('db').
					'<br>DB User:'.$f3->get('user').
					'<br>'
				);
				
				$f3->set('T_CODE', 'SQL_MESSAGE' );
				echo Template::instance()->render('Screen_util.htm');	 
			
			}
			catch (PDOException $e) {
				$f3->set('T_CODE', 'SQL_MESSAGE' );
				$f3->set('T_SQL_MESSAGE', $e->getMessage());
				$this->wlog('SQL Error:'.$e->getMessage());
				echo Template::instance()->render('Screen_util.htm');	 
			}
		else
			try {
				$res = $this->db->exec($this->clear_text($sql), $binds);
				$this->db_check_error();
		
				$cols = [];
				$labels = [];
				if (is_array($res) && count($res) > 0){
					foreach ($res[0] as $p=>$v){
						array_push($cols, $p);
						array_push($labels, ucwords(str_replace("_", " ", $p)));
					}
					$f3->set('T_RES', $res);
					$f3->set('T_COLS', $cols);
					$f3->set('T_LABELS', $labels);
					$f3->set('T_CODE', 'SQL_RESULT' );
				}
				else if (is_array($res) && count($res) == 0){
					$f3->set('T_CODE', 'SQL_MESSAGE' );
					$f3->set('T_SQL_MESSAGE', 'No rows returned.');
				}
				else {
					$f3->set('T_CODE', 'SQL_MESSAGE' );
					$f3->set('T_SQL_MESSAGE', $res);
				}
				echo Template::instance()->render('Screen_util.htm');	 
			
			}
			catch (PDOException $e) {
				$f3->set('T_CODE', 'SQL_MESSAGE' );
				$f3->set('T_SQL_MESSAGE', $e->getMessage());
				$this->wlog('SQL Error:'.$e->getMessage());
				echo Template::instance()->render('Screen_util.htm');	 
			}
		 
		$this->wlog('GET_SQL END');
		
	}
	function get_table_data ($f3, $args) {
		
		$f3->set('ONERROR',
			function($f3) {				
				$this->wlog('GET_TABLE_DATA ERROR:'.$f3->get('ERROR.text'));
			}
		);

		$this->wlog('GET_TABLE_DATA START');
		
		$page = $f3->get('POST.page');
		$this->wlog('page:'.$page);
		$app = $f3->get('PARAMS.app');
		$this->wlog('app:'.$app);
		$el_id = $f3->get('POST.el_id');
		$this->wlog('el_id:'.$el_id);
		
		$tab_sort = $f3->get('POST.tab_sort');
		$this->wlog('tab_sort:'.$tab_sort);
		
		$tab_rows = $f3->get('POST.tab_rows');
		$this->wlog('tab_rows:'.$tab_rows);
		
		$tab_page = $f3->get('POST.tab_page');
		$this->wlog('tab_page:'.$tab_page);
		$binds = (array)$f3->get('POST.binds');
		$sql_page = '';
		
		
		if ($tab_page < 1)
			$tab_page = 1;
		
		$fl = json_decode(file_get_contents("assets/".$app."/".$page.".j"));
		$elements = (array) $fl->page;
		$f3->set('T_COLS', $elements[$el_id]->columns);
		$f3->set('T_GUI', $elements[$el_id]);
		$f3->set('T_ID', $el_id);
		
		
		
		$sql = $this->clear_text($elements[$el_id]->SQL);

		$this->wlog('elements');
		if ($tab_sort != ''){
			$tab_sort = ($tab_sort != ''? ' ORDER BY '.$tab_sort:''); 
		} 

		if ($tab_sort == '' && $elements[$el_id]->order_by != ''){
			$tab_sort = $elements[$el_id]->order_by;
		}
		
		if ($elements[$el_id]->page != ''){
			if ($tab_rows == '')
				$tab_rows = $elements[$el_id]->page;
			
			$this->wlog('rows:'.$tab_rows);
			
			$offset = ($tab_page-1)* $tab_rows;
			
			if ($f3->get('db_type') == 'MSSQL'){
				$sql_page = ' OFFSET '.$offset.' ROWS FETCH NEXT '.$tab_rows.' ROWS ONLY';
				IF ($tab_sort == '') $tab_sort = ' ORDER BY (SELECT 1) ';
				 
			}
			if ($f3->get('db_type') == 'ORACLE'){
				$sql_page = ' OFFSET '.$offset.' ROWS FETCH NEXT '.$tab_rows.' ROWS ONLY';
				IF ($tab_sort == '') $tab_sort = ' ORDER BY 1 ';
				
			}
			//if ($f3->get('db_type') == 'MYSQL')
			//	$sql_page = ' '.($tab_sort != ''? ' ORDER BY '.$tab_sort:' ').' OFFSET '.$offset.' ROWS FETCH NEXT '.$elements[$el_id]->page. ' ROWS ONLY';
			//$this->wlog($sql_page);
		}
		
		$sql = $sql.$tab_sort.$sql_page;
		$this->wlog('SQL:'.$sql);
		
		$f3->set('T_RES', $this->db->exec($sql, $binds));
		$this->db_check_error();
		
		//$this->wlog($this->db->log());
		$this->wlog('set data');
		$f3->set('T_CODE', 'T_TAB_DATA'); 
		
		echo json_encode($f3->get('T_RES'));
	 
		//echo Template::instance()->render('Screen_template.htm');	
		
		$this->wlog('GET_TABLE_DATA END');
		
	}
	function get_datacard_data ($f3, $args) {
		$f3->set('ONERROR',
			function($f3) {				
				$this->wlog('GET_DATACARD_DATA ERROR:'.$f3->get('ERROR.text'));
			}
		);
		
		$this->wlog('GET_DATACARD_DATA START');
		
		$page = $f3->get('POST.page');
		$this->wlog('page:'.$page);
		$app = $f3->get('PARAMS.app');
		$this->wlog('app:'.$app);
		$el_id = $f3->get('POST.el_id');
		$this->wlog('el_id:'.$el_id);
		$binds = (array)$f3->get('POST.binds');
		$f3->set('T_ID', $el_id);
		$sql_page = '';
		
		$fl = json_decode(file_get_contents("assets/".$app."/".$page.".j"));
		$elements = (array) $fl->page;
		$f3->set('T_COLS', $elements[$el_id]->columns);
		$f3->set('T_GUI', $elements[$el_id]);
		$this->wlog('elements');
		
		$this->wlog('SQL:'.$this->clear_text($elements[$el_id]->SQL.$sql_page));
		$f3->set('T_RES', $this->db->exec($this->clear_text($elements[$el_id]->SQL.$sql_page), $binds));
		$this->db_check_error();
		
		//$this->wlog($this->db->log());
		$this->wlog('set data');
		$f3->set('T_CODE', 'data-card-data'); 
		
		//print_r($f3->get('T_RES'));
		echo Template::instance()->render('Screen_template.htm');	
		
		$this->wlog('GET_DATACARD_DATA END');
		
	}
	function push_toast($f3, $h, $b, $t){
		$i = $f3->get('T_TOASTS');
		if ($i){
			array_push($i,[$h, json_encode($b),$t]);
			$f3->set('T_TOASTS', $i);
		}
		else {
			$f3->set('T_TOASTS', (array)[[$h, json_encode($b), $t]]);
		
		}
	}
	function run ($f3, $args) {
		$valid = true;
		$f3->set('T_HEADER_PRINT', 'Y');
		$f3->set('ONERROR',
			function($f3) {				
				
				$this->push_toast($f3,'Error', htmlentities($f3->get('T_ALERT_TEXT').':'.$f3->get('ERROR.text'), ENT_QUOTES), 'danger');
				$this->wlog('RUN ERROR:'.$f3->get('ERROR.text'));
				if ($f3->get('T_HEADER_PRINT') == 'Y')
					echo Template::instance()->render('Screen_header.htm');
				echo Template::instance()->render('Screen_footer.htm');
				
			}
		);
		
		$f3->set('T_APP', $f3->get('PARAMS.app'));
		$f3->set('T_MODE', 'prod');
		$app = $f3->get('T_APP');
		$app_path = "assets/".$app;
		 
		$params = (object)[];	//POST/GET PARAMETERS
		$el_css = (object)[];	//ELEMENTS CSS
		
		//META GENERATION
		$this->wlog('GENERATE META START');
		$menu = array();
		$nav = new stdClass();
		$perm = 'N';
		$menu_type = 'TOP';
		
		if (file_exists($app_path."/_meta.j")){
			$fl = json_decode(file_get_contents($app_path."/_meta.j"));
		 
			if ($fl->theme != '')
				$f3->set('T_THEME', $fl->theme);
			else 
				$f3->set('T_THEME', 'boot');
			
			if ($fl->app_name != '')
				$f3->set('T_APP_NAME', $fl->app_name);
			else 
				$f3->set('T_APP_NAME', $app);
			
			if ($fl->login != '')
				$f3->set('T_LOGIN', $fl->login);
			else 
				$f3->set('T_LOGIN', 'N');
			
			if ($fl->permission != '')
				$perm = $fl->permission;
			
			if (!$f3->get('PARAMS.page')) {
				foreach ($fl->menu	as $val){
					if ($val->app == 'HOME') {
						if ($menu[$val->menu]){
							array_push($menu[$val->menu], $val);					
						} else {
							$menu[$val->menu] = array();
							array_push($menu[$val->menu], $val);
						}
					}
				}
				$f3->set('T_MENU', $menu);
			} else {
				foreach ($fl->menu	as $val){
					if ($val->app == 'HOME')
						continue;
					$k = $val->app;					
				
					if ($nav->$k[$val->menu]){
						array_push($nav->$k[$val->menu], $val);					
					} else {
						$nav->$k[$val->menu] = array();
						array_push($nav->$k[$val->menu], $val);
					}
				}
				 
				$f3->set('T_NAV', $nav);
			}
		}
		$this->wlog('GENERATE META END');
		
		IF ($f3->get('T_LOGIN') == 'Y'){
			$this->wlog('CHECK LOGIN START');
			if ($f3->get('SESSION.lastseen')+$f3->get('expiry')*3600<time()){
				$this->wlog('Session has expired',4);
				$f3->reroute('/'.$f3->get('PARAMS.app').'/logout');
			}
			// Update session data
			$f3->set('SESSION.lastseen',time());
			$this->wlog('CHECK LOGIN END');
		}
		
		$f3->set('ESCAPE',FALSE);
		
		// REDIRECT TO HOME PAGE IF NO PAGE WAS SPECIFIED
		if (!$f3->get('PARAMS.page')){
			$this->wlog('REDIRECT HOME');
			echo Template::instance()->render('Screen_home.htm');	
			return;
			
		}
		// CHECK IF PAGE EXISTS
		if(!file_exists($app_path."/".$f3->get('PARAMS.page').".j")) {
			$this->wlog('PAGE NOT FOUND:'.$f3->get('PARAMS.page'));
			$err = new StdClass;
			$err->code = '-1';
			$err->status = 'Info';
			$err->text = 'Page '.$f3->get('PARAMS.page'). ' not found';
			$err->trace = '';
			$f3->set('T_ERROR', (array)$err);
			//print_r($f3->get('POST')); 
			echo Template::instance()->render('Screen_error.htm');	
			return;
		}
		
		$f3->set('T_PAGE', $f3->get('PARAMS.page'));
		$fl = file_get_contents($app_path."/".$f3->get('PARAMS.page').".j");
		$this->gui = json_decode($fl);
		
		$this->wlog('PAGE START:'.$f3->get('PARAMS.page'));
		
		//GENERATE PAGE SETTINGS
		$this->wlog('PAGE SETTINGS START');
		$f3->set('T_SETTINGS', $this->gui->settings);
		$this->wlog('PAGE SETTINGS END');
		
		
		$page = (array) $this->gui->page;
		
		//BUTTON WAS CLICKED
		if ($f3->get('POST.y_btn_click')){
			
			$this->wlog('BUTTON CLICK:'.$f3->get('POST.y_btn_click'));
			$this->wlog('PROCESS AFTER POST START');
			foreach ($f3->get('POST') as $k=>$v){
				if (substr( $k, 0, 1 ) !== 'y'){
					$params->$k= $v;
					$this->wlog($k.'='.$v);	
				}
			}
			$this->wlog('PROCESS AFTER POST END');
			
			$btn = $f3->get('POST.y_btn_click');
			$ignore_valid = $page[$f3->get('POST.y_btn_click')]->ignore_valid;
			$this->wlog('ignore_valid:'.$ignore_valid);
			
			$this->wlog('CHECK SQL AFTER START');
			foreach ($this->gui->after->Check as $k=>$v){
				if ($v->type != 'SQL') {
					continue;
				}
				
				if ($v->btn != $f3->get('POST.y_btn_click') and $v->btn != ''){
					$this->wlog('EXCLUDE:'.$k); 
					continue;
				}
				
				if ($ignore_valid == 'Y'){
					$this->wlog('EXCLUDE:'.$k); 
					continue;
				}
				
				$this->wlog('Check:'.$k); 
				$binds = (object)[];
				foreach (explode(",", preg_replace('/\s/', '', $this->clear_text($v->binds))) as $w){
					if ($w != ''){
						$n = ':'.$w;
						$this->wlog('val:'.$params->$w); 
						$binds->$n = ($params->$w?$params->$w:'');		
						$this->wlog('Bind:'.$n.'=>'.$binds->$n); 
					}
				}
				$this->wlog('Code:'.$v->code); 
				
				$res = $this->db->exec($this->clear_text($v->code), $binds);
				$this->db_check_error();
		
				$cn = $this->db->count();
				if ($cn > 0){
					$el = $v->el;
					if ($el)
						$el_css->$el = 'is-invalid';
					$this->push_toast($f3, 'Check', $v->message, $v->level);
					$valid = false;
				}
				 
			}
			$this->wlog('CHECK SQL AFTER END');
			
			$this->wlog('PROCESS AFTER START');
			
			if ($valid)
			foreach ($this->gui->after->Process as $k=>$v){
				if ($v->type != 'SQL') {
					continue;
				}
				if ($v->btn != $f3->get('POST.y_btn_click') and $v->btn != ''){
					$this->wlog('EXCLUDE:'.$k); 
					continue;
				}
				
				$this->wlog('Process:'.$k); 
				$binds = (object)[];
				foreach (explode(",", preg_replace('/\s/', '', $this->clear_text($v->binds))) as $w){
					if ($w != ''){
						$n = ':'.$w;
						$this->wlog('val:'.$params->$w); 
						$binds->$n = $params->$w;
						//$binds->$n = ($params->$w?$params->$w:'');		
						$this->wlog('Bind:'.$n.'=>'.$binds->$n); 
					}
				}
				$this->wlog('Code:'.$v->code); 
				
				$res = $this->db->exec($this->clear_text($v->code), $binds);
				$this->db_check_error();
		
				
				if ($v->message != ''){
					$this->push_toast($f3, 'Info', $v->message, 'info');
				}
				/*foreach (explode(",", str_replace(' ', '', $v->mapping)) as $w){
					foreach($res as $row){
						$this->wlog('Mapping:'.$params->$w.'=>'.$row[$w]); 
						$params->$w = $row[$w];
					}
				}*/
			}
			
			$this->wlog('PROCESS AFTER END');
			
			
			//REDIRECT IF PAGE WAS DEFINED
			//$page = (array) $this->gui->page;
			$goto_page = $page[$f3->get('POST.y_btn_click')]->goto_page;
			
			if (substr($goto_page, 0, 1) == ':'){
				$l_goto = str_replace(':','',$goto_page); 
				$goto_page = $params->$l_goto;
				if ($goto_page == '')
					$goto_page = '.';
			}
			
			if ($goto_page != '.' && $valid){
				
				
				$this->wlog('REDIRECT:'.$goto_page); 
				$f3->set('T_ACTION', $goto_page);
				echo Template::instance()->render('Screen_header.htm');
				$f3->set('T_HEADER_PRINT', 'N');
				$f3->set('T_CODE', 'input hidden redirect');
				
				foreach ($page[$f3->get('POST.y_btn_click')]->mapping as $a){
					$aa = $a[1];
					$this->wlog('MAPPING:'.$a[0].':'.$params->$aa); 
					$f3->set('T_ID', $a[0]);
					$f3->set('T_VAL', $params->$aa);					
					echo Template::instance()->render('Screen_template.htm');
				}
				echo Template::instance()->render('Screen_footer_redirect.htm');
				return;
				
				//$f3->reroute($goto_page);				
			}
				
		}
		
		// GENERATE AFTER JAVASCRIPT
		$this->wlog('JAVASCRIPT AFTER BEGIN');
		$f3->set('T_TP', 'AFTER');
		$f3->set('T_J_BEFORE_GOTO', '');
		foreach ($this->gui->after->Process as $k=>$v){
			if ($v->type != 'JS') continue;
			$this->wlog('AFTER JS:'.$k);
			if ($v->btn != ''){
					$f3->set('T_J_BEFORE_GOTO',$f3->get('T_J_BEFORE_GOTO').' if (btn ==  \''.$v->btn.'\'){ '
					.$v->code.'}');
			} else 
				$f3->set('T_J_BEFORE_GOTO',$f3->get('T_J_BEFORE_GOTO').$v->code);
		}
		$this->wlog('JAVASCRIPT AFTER END');
		
		// GENERATE BEFORE CHECK JAVASCRIPT BEGIN
		$this->wlog('JAVASCRIPT BEFORE CHECK BEGIN');
		$f3->set('T_JS_CHECK_BEFORE', '');
		$f3->set('T_TP', 'BEFORE');
		foreach ($this->gui->before->Check as $k=>$v){
			if ($v->type != 'JS') continue;
			$this->wlog('BEFORE JS CHECK:'.$k);
			$f3->set('T_CODE', 'JS CHECK');
			$f3->set('T_CHECK', $v);
			$f3->set('T_JS_CHECK_BEFORE',$f3->get('T_JS_CHECK_BEFORE').Template::instance()->render('Screen_template.htm') );
			
		}
		$this->wlog('JAVASCRIPT BEFORE CHECK END');
		
		// GENERATE AFTER CHECK JAVASCRIPT BEGIN
		$this->wlog('JAVASCRIPT AFTER CHECK BEGIN');
		$f3->set('T_JS_CHECK_AFTER', '');
		$f3->set('T_TP', 'AFTER');
		foreach ($this->gui->after->Check as $k=>$v){
			if ($v->type != 'JS') continue;
			$this->wlog('BEFORE JS AFTER:'.$k);
			$f3->set('T_CODE', 'JS CHECK');
			$f3->set('T_CHECK', $v);
			$f3->set('T_JS_CHECK_AFTER',$f3->get('T_JS_CHECK_AFTER').Template::instance()->render('Screen_template.htm') );
			
		}
		$this->wlog('JAVASCRIPT BEFORE CHECK END');
		
		// process before
		$this->wlog('PROCESS BEFORE POST START');
		
		foreach ($f3->get('POST') as $k=>$v){
			if (substr( $k, 0, 1 ) != 'y'){
					$params->$k= $v;
					$this->wlog($k.'='.$v); 
			}
		}
		
		$this->wlog('PROCESS BEFORE POST END');
		
		$this->wlog('PROCESS BEFORE GET START');
		
		foreach ($f3->get('GET') as $k=>$v){
			if (substr( $k, 0, 1 ) != 'y' && $this->gui->page->$k->get_allowed == 'Y'){
					$params->$k= $v;
					$this->wlog($k.'='.$v); 
			}
		} 
		
		$this->wlog('PROCESS BEFORE GET END');
		
		$this->wlog('PROCESS BEFORE START');
		if ($valid)
		foreach ($this->gui->before->Process as $k=>$v){
			$this->wlog('Process:'.$k); 
			
			if ($v->type == 'JS'){
				$this->wlog('javascript:'.$v->code); 
				$f3->set('T_J_DOCUMENT_READY',$f3->get('T_J_DOCUMENT_READY').' '.$v->code);
				continue;
			}
			
			$binds = (object)[];
			foreach (explode(",", preg_replace('/\s/', '', $v->binds)) as $w){
				if ($w != ''){
					$n = ':'.$w;
					$binds->$n = $params->$w;
					//$binds->$n = ($params->$w?$params->$w:'');		
					$this->wlog('Bind:'.$n.'=>'.$binds->$n); 
				}
			}
			$this->wlog('Code:'.$v->code); 
			$f3->set('T_ALERT_TEXT',$k);
			$res = $this->db->exec($v->code, $binds);
			$this->db_check_error();
		
			
			foreach (explode(",", preg_replace("/\s/", "", $v->mapping)) as $w){
				foreach($res as $row){
					$this->wlog('Mapping:'.$w.'=>'.$row[$w]); 
					$params->$w = $row[$w];
				}
			}
		}
		$this->wlog('PROCESS BEFORE END');
		
		$f3->set('T_ACTION', ''.$f3->get('PARAMS.page'));
		$f3->set('T_FORM_PARAMS', $params);
		$f3->set('T_EL_CSS', $el_css);
		
		echo Template::instance()->render('Screen_header.htm');
		$f3->set('T_HEADER_PRINT', 'N');
		foreach ($this->gui->page->sort	as $val){
			$show = true;
			if ($this->gui->page->$val->show_if == 'Never')
				$show = false;
			
			if ($this->gui->page->$val->show_if == 'SQL'){
				$cnt = $this->exec_sql_bind($f3, $this->gui->page->$val->show_if_txt);
				
				
				if ($cnt == 0) 
					$show = false;
			}
			
			if ($show)
				$this->gen_element($f3, $val, 'Page', 'prod');
			
		}
		echo Template::instance()->render('Screen_footer.htm');
		
		$this->wlog('PAGE END:'.$f3->get('PARAMS.page'));
		
	}
	function publish ($f3, $args) {
		$this->gui = json_decode($f3->get('POST.data',TRUE));
		
		file_put_contents("assets/".$f3->get('PARAMS.app')."/".$this->gui->name.'.j', $f3->get('POST.data',TRUE));
		
	}
	function download ($f3, $args) {
		if ($f3->get('POST.pg',TRUE)){
			$fl = file_get_contents("assets/".$f3->get('PARAMS.app')."/".$f3->get('POST.pg',TRUE));
			
			echo $fl;
		}else {
			
			$ht = '';
			$this->wlog('get list');
			$files = array_diff(scandir("assets/".$f3->get('PARAMS.app')), array('.', '..', '_meta.j'));
			$f3->set('T_CODE', 'PAGE_CARD' );
			foreach ($files	as $val){
				$fl = json_decode(file_get_contents("assets/".$f3->get('PARAMS.app')."/".$val));
				$f3->set('T_PAGE', $fl->settings );
				$f3->set('T_LAST', date("Y-m-d H:i:s",filemtime("assets/".$f3->get('PARAMS.app')."/".$val)));
				$f3->set('T_FILENAME', $val );
				echo Template::instance()->render('Screen_util.htm');
				echo $ht;
			}
	 
		}
		
	}
	function page_delete ($f3, $args) {
		if ($f3->get('POST.pg',TRUE)){
			unlink("assets/".$f3->get('PARAMS.app')."/".$f3->get('POST.pg',TRUE));			
		}
		
	}
	function get_log_files ($f3, $args) {
		if ($f3->get('POST.log_file',TRUE)){
			
			$lines = file("logs/".$f3->get('POST.log_file',TRUE));

			$cnt = count($lines);
			
			for( $i=$cnt; $i>=($cnt>1000?$cnt-1000:0); $i-- ){
				if (stripos(htmlspecialchars($lines[$i]), 'error') !== false)
					echo '<br><span class="font-weight-bold text-danger">'.htmlspecialchars($lines[$i]).'</span>';
				else 
					echo '<br>'.htmlspecialchars($lines[$i]);
			}
			/*
			foreach ($lines as $line_num => $line) {
				if (strpos($line, 'error') !== false)
					echo htmlspecialchars($line);
				else 
					echo htmlspecialchars($line);
			}*/	
			//$fl = file_get_contents("logs/".$f3->get('POST.log_file',TRUE));
			
			//echo $fl;
		}else {
			
			$this->wlog('get logs');
			$files = array_diff(scandir("logs", SCANDIR_SORT_DESCENDING), array('.', '..', '_meta.j'));
			$f3->set('T_CODE', 'LOG_LIST' );
			foreach ($files	as $val){
				$f3->set('T_FILENAME', $val );
				echo Template::instance()->render('Screen_util.htm');
			}
	 
		}
		
	}
	function get_menu ($f3, $args) {
		 
		echo file_get_contents("assets/".$f3->get('PARAMS.app')."/_meta.j");
		
	}
	function set_menu ($f3, $args) {
		
		$this->gui = json_decode($f3->get('POST.data',TRUE));
		file_put_contents("assets/".$f3->get('PARAMS.app')."/_meta.j", $f3->get('POST.data',TRUE));
		
	}
	
	
	function gen ($f3, $args) {
		
		/*$f3->set('ONERROR',
			function($f3) {				
				// custom error handler code goes here
				// use this if you want to display errors in a
				// format consistent with your site's theme
				
				$this->push_toast($f3,'DB ERROR', str_replace("'", '"', $f3->get('T_ALERT_TEXT').':'.$f3->get('ERROR.text')), 'danger');
				echo Template::instance()->render('Screen_header.htm');
				echo Template::instance()->render('Screen_footer.htm');
				
			}
		);*/
		
		$this->gui = json_decode($f3->get('POST.data',TRUE));
		
		$f3->set('T_MODE', 'dev');
		foreach ($this->gui->page->sort	as $val){
			if ($this->gui->page->$val->show_if != 'Never')
				$this->gen_element($f3, $val, 'Page', 'dev');
			
		}
		
		echo Template::instance()->render('Screen_devel.htm'); 
		
		return;
		
		 
	}
	
	function start($f3, $args) {
		$md = \Markdown::instance();
		$file = F3::instance()->read('CHANGELOG.md');
		$f3->set('changelog_md', $md->convert($file) );
		
		$file = F3::instance()->read('README.md');
		$f3->set('readme_md', $md->convert($file) );
		
		$f3->set('pdo_driver', PDO::getAvailableDrivers() );
		$f3->set('php_version', phpversion() );
		
		$f3->set('db_version', $this->db->version());
		$f3->set('db_driver', $this->db->driver());
		
		$dirs = array_diff(scandir('assets'), array('..', '.'));
		$f3->set('dirs', $dirs );
		
		$f3->set('req_uri', "http://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'] );
		
		
		echo Template::instance()->render('Screen_welcome.html');
	}
	
	function screen_creator($f3, $args) {
				
		echo Template::instance()->render('Screen.html');
	}
	 
}
