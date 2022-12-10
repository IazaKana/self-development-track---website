create table orders(
  id int not null AUTO_INCREMENT primary key,
  user_id int not null,
  product_id int not null,
  quantity int not null,
  is_cancel boolean not null DEFAULT FALSE
);

alter table orders add constraint order_fk foreign key (user_id) REFERENCES user(id);

alter table orders add constraint order_fk2 foreign key (product_id) REFERENCES product(id);