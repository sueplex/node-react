CREATE TABLE users (
    id int(11) NOT NULL auto_increment,
    email varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    created_at bigint(11) NOT NULL,
    updated_at bigint(11) NOT NULL,
    PRIMARY KEY(id)
);
