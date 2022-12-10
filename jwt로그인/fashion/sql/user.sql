create table user(
  id int not null auto_increment primary key,
  email varchar(30) not null,
  password varchar(30) not null,
  name varchar(30) not null,
  role varchar(20) not null
);

alter table user add constraint user_email_uindex unique (email);

create index user_idx on user(name);