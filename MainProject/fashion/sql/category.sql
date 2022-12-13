create table category(
  id int not null auto_increment primary key,
  name varchar(30) not null
);

insert into category(name) values('아우터'), ('이너'), ('니트'), ('셔츠'), ('바지'), ('신발'), ('악세사리'), ('코트'), ('정장');