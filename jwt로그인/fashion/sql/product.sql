create table product(
  id int not null auto_increment primary key,
  user_id int not null,
  category_id int not null,
  name varchar(30) not null,
  description varchar(100) not null,
  price int not null,
  stock int not null,
  is_delete boolean not null DEFAULT false
);

alter table product add constraint product_user_id_fk foreign key (user_id) references user(id);

alter table product add constraint product_category_id_fk foreign key (category_id) references category(id);

create index product_idx on product(name);