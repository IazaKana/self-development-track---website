create table image(
  id int not null auto_increment primary key,
  product_id int not null,
  image_key varchar(30) not null,
  image_value mediumblob not null
);

alter table image add constraint image_fk foreign key (product_id) references product(id);

create index image_idx on image(image_key);