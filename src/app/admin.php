<?php
/*
	Copyright (c) 2019 pj1985 
	
	This code is part of the Raspberry framework (https://github.com/pj1985/rberry)
	
	You can redistribute it and/or modify it under the terms of the GNU General Public License
	as published by the Free Software Foundation, either version 3 of the License, or later.
	
	You should have received a copy of the GNU General Public License along
	with Raspberry.  See http://www.gnu.org/licenses/
*/
 
class Admin extends gen_common {
	function login($f3) {
		$f3->clear('SESSION');
		if ($f3->get('eurocookie')) {
			$loc=Web\Geo::instance()->location();
			if (isset($loc['continent_code']) && $loc['continent_code']=='EU')
				$f3->set('T_INFO',
					'The administrator pages of this Web site uses cookies '.
					'for identification and security. Without these '.
					'cookies, these pages would simply be inaccessible. By '.
					'using these pages you agree to this safety measure.');
		}
		$f3->set('COOKIE.sent',TRUE);
		if ($f3->get('T_INFO')) {
			 
			$img=new Image;
			/*$f3->set('captcha',$f3->base64(
				$img->captcha('/fonts/thunder.ttf',18,5,'SESSION.captcha')->dump(),'image/png'));
			*/
		}
			 
		$app_path = "assets/".$f3->get('PARAMS.app');
		if (file_exists($app_path."/_meta.j")){
			$fl = json_decode(file_get_contents($app_path."/_meta.j"));
		 
			if ($fl->theme != '')
				$f3->set('T_THEME', $fl->theme);
			else 
				$f3->set('T_THEME', 'boot');
			
			if ($fl->login_text != '')
				$f3->set('T_LOGIN_TEXT', $fl->login_text);
			else 
				$f3->set('T_LOGIN_TEXT', 'Login');
			 
		}
		
		echo Template::instance()->render('Screen_login.htm');
		
	}
	function chg_login($f3) {
		$f3->clear('SESSION');
		if ($f3->get('eurocookie')) {
			$loc=Web\Geo::instance()->location();
			if (isset($loc['continent_code']) && $loc['continent_code']=='EU')
				$f3->set('T_INFO',
					'The administrator pages of this Web site uses cookies '.
					'for identification and security. Without these '.
					'cookies, these pages would simply be inaccessible. By '.
					'using these pages you agree to this safety measure.');
		}
		$f3->set('COOKIE.sent',TRUE);
		if ($f3->get('T_INFO')) {
			 
			$img=new Image;
			/*$f3->set('captcha',$f3->base64(
				$img->captcha('/fonts/thunder.ttf',18,5,'SESSION.captcha')->dump(),'image/png'));
			*/
		}
			 
		$app_path = "assets/".$f3->get('PARAMS.app');
		if (file_exists($app_path."/_meta.j")){
			$fl = json_decode(file_get_contents($app_path."/_meta.j"));
		 
			if ($fl->theme != '')
				$f3->set('T_THEME', $fl->theme);
			else 
				$f3->set('T_THEME', 'boot');
			
			if ($fl->login_text != '')
				$f3->set('T_LOGIN_TEXT', $fl->login_text);
			else 
				$f3->set('T_LOGIN_TEXT', 'Login');
			 
		}
		
		echo Template::instance()->render('Screen_pwd_change.htm');
		
	}
	
	function chg_login_exec($f3) {
		
		if (!$f3->get('COOKIE.sent'))
			$f3->set('T_MESSAGE','Cookies must be enabled to enter this area');
		else if ($f3->get('POST.old_password') == $f3->get('POST.new_password')){
			$f3->set('T_MESSAGE','Old and new password must be different');
			$this->chg_login($f3);
			return;
		}
		else if ($f3->get('POST.new_password') != $f3->get('POST.new_password2')){
			$f3->set('T_MESSAGE',"Retyped password doesn't match.");
			$this->chg_login($f3);
			return;
		}
		else {
			$f3->set('T_SQL_CODE', 'SQL_GET_USER_PASSWORD');
			$sql_text = Template::instance()->render('../db/sql/sql.ini');
			$this->wlog('sql (login):'.$sql_text);
			
			$binds = array(':user_id'=>$f3->get('POST.user_id'));
			$res = $this->db->exec($sql_text, $binds);
			
			if ($this->db->count() == 0){
				$f3->set('T_MESSAGE','Invalid user ID or password');
				$this->wlog('Invalid user ID or password(3)');
				$this->chg_login($f3);
				return;
			}
			
			foreach($res as $us) {
				 
				$f3->set('password', $us['PWD_CRYPT']);
				$f3->set('user_id', $us['USER_TXT']);
				$this->wlog('user found:'.$f3->get('user_id'),3);
			}
			
			$captcha=$f3->get('SESSION.captcha');
			
			if ($captcha && strtoupper($f3->get('POST.captcha'))!=$captcha) {
				$f3->set('T_MESSAGE','Invalid CAPTCHA code');
				$this->wlog('Invalid captcha');
				$this->chg_login($f3);
				return;
			}
			if ( $f3->get('password') && 
				(
					$f3->get('POST.user_id')!=$f3->get('user_id') ||
					!password_verify($f3->get('POST.old_password'), $f3->get('password'))
					
				)
			){
				$f3->set('T_MESSAGE','Invalid user ID or password');
				$this->wlog('Invalid user ID or password(1)');
				$this->chg_login($f3);
				return;
			}
			if ($f3->get('password') != '' && 
				$f3->get('POST.user_id')!=$f3->get('user_id')  &&
				$f3->get('POST.user_id')!=$f3->get('POST.old_password')
			){
				$f3->set('T_MESSAGE','Invalid user ID or password');
				$this->wlog('Invalid user ID or password(2)');
				$this->chg_login($f3);
				return;
			}
			
				
			$f3->clear('COOKIE.sent');
			$f3->clear('SESSION.captcha');
			
			$f3->set('T_SQL_CODE', 'SQL_UPDATE_USR_PWD');
			$sql_text = Template::instance()->render('../db/sql/sql.ini');
			
			$binds = array(':user_id'=>$f3->get('POST.user_id'), ':pwd'=>password_hash($f3->get('POST.new_password'), PASSWORD_DEFAULT));
			$res = $this->db->exec($sql_text, $binds);
			
			if ($this->db->count() > 0)
				$f3->set('T_MESSAGE','Password changed.');
			
			$this->wlog('password changed:'.$f3->get('user_id'),3);
			
			 
		}
		$this->login($f3);
	}
	

	function auth($f3) {
		
		if (!$f3->get('COOKIE.sent'))
			$f3->set('T_MESSAGE','Cookies must be enabled to enter this area');
		else {
			$f3->set('T_SQL_CODE', 'SQL_GET_USER_PASSWORD');
			$sql_text = Template::instance()->render('../db/sql/sql.ini');
			$this->wlog('sql (login):'.$sql_text);
			
			$binds = array(':user_id'=>$f3->get('POST.user_id'));
			$res = $this->db->exec($sql_text, $binds);
			
			foreach($res as $us) {
				 
				$f3->set('password', $us['PWD_CRYPT']);
				$f3->set('user_id', $us['USER_TXT']);
				$this->wlog('user found:'.$f3->get('user_id'),3);
			}
			
			 
			$captcha=$f3->get('SESSION.captcha');
			if ($captcha && strtoupper($f3->get('POST.captcha'))!=$captcha)
				$f3->set('T_MESSAGE','Invalid CAPTCHA code');
			elseif ($f3->get('POST.user_id')!=$f3->get('user_id') ||
				!password_verify($f3->get('POST.password'), $f3->get('password'))
			)
				$f3->set('T_MESSAGE','Invalid user ID or password');
				
			else {
				$rnd = $f3->get('POST.user_id').rand(1, 100);
				
				
				$f3->set('T_SQL_CODE', 'SQL_UPDATE_USR_SESSION');
				$sql_text = Template::instance()->render('../db/sql/sql.ini');
				
				$binds = array(':user_id'=>$f3->get('POST.user_id'), ':session_id'=>$rnd);
				$res = $this->db->exec($sql_text, $binds);
				
				$f3->clear('COOKIE.sent');
				$f3->clear('SESSION.captcha');
				$f3->set('SESSION.user_id',$f3->get('POST.user_id'));
				$f3->set('SESSION.session_id',$rnd);
				$f3->set('SESSION.crypt',$crypt);
				$f3->set('SESSION.lastseen',time());
				$this->wlog('logged:'.$f3->get('user_id'),3);
				$f3->reroute('run');
				
			}
		}
		$this->login($f3);
	}

	function logout($f3) {
		$this->wlog('logout:'.$f3->get('SESSION.user_id'),3);
		$f3->clear('SESSION');
		$f3->reroute('login');
	}
	 
}
