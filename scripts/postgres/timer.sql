create table if not exists timer
(
    id     uuid          not null primary key,
    time   integer       not null,
    url    varchar(2048) not null,
    status varchar(255)  not null
)
