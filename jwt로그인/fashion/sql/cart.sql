create table cart(
  id int not null auto_increment primary key,
  user_id int not null,
  product_id int not null,
  price int not null,
  quantity int not null,
  is_delete boolean not null default FALSE
);

alter table cart add constraint cart_fk foreign key (user_id) REFERENCES user(id);

alter table cart add constraint cart_fk2 foreign key (product_id) REFERENCES product(id);