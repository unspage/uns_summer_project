/************ MySql 시작할 때 필요한 DB DDL ********************/
create database minostagram;

use minostagram;

create table users (
	idx int auto_increment primary key,
    user_id varchar(50) not null,
    user_pwd varchar(30) not null,
    user_name varchar(10) not null,
    phone varchar(20) not null
    );

create table post (
	idx int auto_increment primary key,
    writer varchar(50) not null,
    title varchar(30) not null,
    content varchar(200) not null,
    upTime datetime not null,
    img_path varchar(100) not null
    );

insert into users(user_id, user_pwd, user_name, phone)
values ('admin', 'admin', '관리자', '0000');

# nodejs와 mysql을 연동하기 위해서 필요한 sql 문
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'database';

/************ Query 메모장 ****************/
select * from post;
alter table post modify _time datetime;
truncate post;