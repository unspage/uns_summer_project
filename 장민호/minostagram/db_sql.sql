/************ MySql 시작할 때 필요한 DB DDL ********************/
create database gallery;

use gallery;

create table users (
	idx int auto_increment primary key,
    user_id varchar(50) not null,
    user_pwd varchar(30) not null,
    user_name varchar(10) not null,
    phone varchar(20) not null
);

create table post (
	idx int auto_increment primary key,
    writer varchar(50) references users(id),
    title varchar(30) not null,
    content varchar(200) not null,
    upTime datetime not null,
    img_path varchar(100) not null,
    good int default 0
);

insert into users(user_id, user_pwd, user_name, phone)
values ('admin', 'admin', '관리자', '0000');

# nodejs와 mysql을 연동하기 위해서 필요한 sql 문
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'database';

create table comments (
    idx int auto_increment primary key,
    post_idx int auto_increment references post(idx) on delete cascade,
    writer varchar(50) references users(id),
    content varchar(200) not null,
    upTime datetime not null
);

create table its_good (
	idx int auto_increment primary key,
    user_id varchar(50) not null references users(user_id),
    post_idx int not null references post(idx) on delete cascade
);


/************ Query 메모장 ****************/
-- 기본키가 아닌 칼럼을 WHERE절에서 사용하기 위해
set sql_safe_updates = 0;

select * from users;
select * from post;

alter table post drop img_id;

drop table images;

alter table post drop title;
alter table post add img_path varchar(100) not null;

truncate post;

alter table post add writer varchar(50) references users(id);