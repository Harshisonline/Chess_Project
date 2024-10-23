Authentication database

Create table user{
    id int unique serial primary key,
    email varchar(32) unique,
    password varchar(100)
}

