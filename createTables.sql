CREATE TABLE profiles (username VARCHAR(30) PRIMARY KEY, first_name VARCHAR(30), last_name VARCHAR(30), bio VARCHAR(280), email VARCHAR(50), profile_picture_link INT REFERENCES pictures, password VARCHAR(100));


CREATE TABLE orders (id INT PRIMARY KEY, buyer_id VARCHAR(30) REFERENCES profiles, seller_id VARCHAR(30) REFERENCES profiles, picture_id INT REFERENCES pictures, address VARCHAR(100), date TIMESTAMP);

CREATE TABLE pictures 
(
pic_id SERIAL PRIMARY KEY,
owner_id VARCHAR(30)  references profiles
);

CREATE TABLE tags
(
pic_id INT references pictures,
tag_id INT,
primary key (pic_id, tag_id)
);
