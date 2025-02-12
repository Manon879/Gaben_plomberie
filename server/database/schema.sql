create table admin (
  id int unsigned primary key auto_increment not null,
  email varchar(255) not null unique,
  password varchar(255) not null
);

create table service (
  id int unsigned primary key auto_increment not null,
  title varchar(255) not null,
  description varchar(300)not null,
  picture varchar(255)not null
);

