<?php
/*
	Copyright (c) 2019 pj1985 
	
	This code is part of the Raspberry framework (https://github.com/pj1985/rberry)
	
	You can redistribute it and/or modify it under the terms of the GNU General Public License
	as published by the Free Software Foundation, either version 3 of the License, or later.
	
	You should have received a copy of the GNU General Public License along
	with Raspberry.  See http://www.gnu.org/licenses/
*/
 
class gen_common {

	protected
		$db;
	protected 
		$lg;
	protected 
		$f3;
	protected
		$lg_args;
	protected
		$timer;
	protected
		$start;
	protected
		$uri;
	
	function beforeroute($f3) {
		$db=$this->db;
		$this->uri = $this->f3->hive()['URI'];
		$this->start = microtime(true);
		$this->timer = microtime(true);
		$this->wlog($f3->get('PARAMS.page'));
	}

	function afterroute($f3) {
		$end = microtime(true);
		
		$this->wlog($f3->get('PARAMS.page').':'.sprintf("%.3f",$end-$this->start));				 
	}
	 
	function __construct() {
		$f3=Base::instance();
		$this->f3=$f3;
		try {
			// Connect to the database
			$db=new DB\SQL($f3->get('db'), $f3->get('user_id'), $f3->get('password'));
			// Use database-managed sessions
			new DB\SQL\Session($db);
		} catch (Exception $e) {
			echo 'Cannot connect to DB..';
			
		} 
		
		// here you can set attributes for connection
		//$db->setAttribute(PDO::ATTR_CASE, PDO::CASE_UPPER);
		$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		
		//$db->setAttribute(PDO::ATTR_AUTOCOMMIT,1);


		$lg = new Log('debug_'.date('Y_m_d').'.log');
		$lg_args = new Log('args_'.date('Y_m_d').'.log');
		
		// Save frequently used variables
		$this->db=$db;
		$this->lg=$lg;
		$this->lg_args=$lg_args;
		
		 
		
	}
	function error($f3, $args) {
		 
		$this->wlog($f3->get('ERROR.text'),1);
		$f3->set('T_ERROR', $f3->get('ERROR'));
		echo Template::instance()->render('Screen_error.htm');
	}
	function wlog($txt='', int $log_level=3){
		$caller = next(debug_backtrace());
		if ($this->timer)
			$elapsed = microtime(true) - $this->timer;
		else
			$elapsed = 0;	
		$this->timer = microtime(true);
		
		$format = 'H:i:s';
		if ($this->f3->get('LOG_LEVEL') >= $log_level){
			$this->lg->write('::'.$log_level.'::'.$this->f3->get('SESSION.session_id').'::'.$this->uri.'::'.$caller['function'].'::{'.$txt.'}::('.sprintf("%.3f",$elapsed).')',$format );
			
			if ($log_level == 1 and $this->f3->get('LOG_LEVEL')==5){
					$this->lg_args->write('('.$this->f3->get('SESSION.session_id').'):::args:::'.print_r($caller['args'], true).':::/args:::', $format);
			}
		}
	}
}