<p align="right">
  <img  width="150" src="https://github.com/pj1985/rberry/blob/master/doc/img/rberry_mid.png">
</p>
 

 
# Raspberry UI Framework
Raspberry is low-code/configuration framework for creating responsive web frontend for common database systems using Bootstrap CSS templates. Raspberry is focused on developers with database background with basic knowledge of FE technologies like Bootstrap and JQuery/Javascript. 

Framework can be used for fast prototyping or for creating rich user interface for various database tools.

### Elements, that can be used in the pages include: ###
- **Tables and Data Cards** - results from the SQL queries, tables contain paging and sorting
- **Charts** - charts.js charts rendered from the SQL queries
- **Form Components** - input fields, buttons, text areas, select,..

### With before and after actions you can: ###
- **Load data** into form inputs
- **Create SQL validations of the processed data**
- **Execute SQL statements** - before page load or after page submit with data from the pages

<p align="center">
<img src="https://github.com/pj1985/rberry/blob/master/doc/img/comp_creator.png">
</p>

<p align="center"><b>Design page in Screen creator</b></p>

Main goal of the Raspberry is to create UI very fast and with as little code (or configuration) as possible. Every Raspberry application contains page configurations (one JSON file per page), from which the html pages are rendered. 

Raspberry provides single-site Screen Creator with live page preview, where user define page elements tree (regions hierarchy, buttons, inputs, tables,..) and what should be done before page renders and after page submits (validations, processes).


- ### [Installation and Configuration](https://github.com/pj1985/rberry/wiki/Get-Started) ###
- ### [Usage](https://github.com/pj1985/rberry/wiki/Get-Started#usage) ###

# Support
Support available via GitHub Issues. 

### Disclaimer
This project is a work in progress. There's still a lot of features waiting to be implemented.. If you like to help, let me know :)

# License & Copyright
Copyright 2019 pj1985

This project is licensed under the GPL http://www.gnu.org/licenses/gpl.txt

Raspberry utilizes and includes: 
 - Fat-Free PHP Framework (https://fatfreeframework.com)
 - Bootstrap Table (https://github.com/wenzhixin/bootstrap-table)
 - localStorage (https://github.com/jaywcjlove/store.js)
 - jquery-resizable-columns (https://github.com/dobtco/jquery-resizable-columns)
