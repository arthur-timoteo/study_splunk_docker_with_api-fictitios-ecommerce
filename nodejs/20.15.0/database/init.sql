-- install uuid-ossp extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- create database
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_database WHERE datname = 'dbecommerce'
    ) THEN
        PERFORM dblink_exec('dbname=postgres', 'CREATE DATABASE dbecommerce');
    END IF;
END
$$;

-- create tables 
CREATE TABLE CATEGORY (
    Pk UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    Category_Name VARCHAR(50) NOT NULL UNIQUE,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT NULL
);

CREATE TABLE SPECIFICATION (
    Pk UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    Fk_Category UUID NOT NULL,
    Specification_Name VARCHAR(50) NOT NULL,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP NULL,

    CONSTRAINT cnstnt_specification_fk_category 
        FOREIGN KEY(Fk_Category) 
        REFERENCES CATEGORY(Pk)
);

CREATE TABLE PRODUCT (
    Pk UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    Fk_Category UUID NOT NULL,
    Product_Name VARCHAR(50) NOT NULL,
    Product_Description VARCHAR(500) NOT NULL,
    Price DECIMAL(10,2) NOT NULL,
    Is_New BOOLEAN NOT NULL,
    Brand VARCHAR(50),
    Product_Location VARCHAR(50),
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP NULL,

    CONSTRAINT cnstnt_product_fk_category 
        FOREIGN KEY(Fk_Category) 
        REFERENCES CATEGORY(Pk)
);

CREATE TABLE SPECIFICATION_PRODUCT (
    Pk UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    Fk_Specification UUID NOT NULL,
    Fk_Product UUID NOT NULL,
    Specification_Value VARCHAR(50) NOT NULL,

    CONSTRAINT cnstnt_specification_product_fk_specification 
        FOREIGN KEY(Fk_Specification) 
        REFERENCES SPECIFICATION(Pk),
    CONSTRAINT cnstnt_specification_product_fk_product 
        FOREIGN KEY(Fk_Product) 
        REFERENCES PRODUCT(Pk)
);

CREATE TABLE ACCOUNT (
    Pk UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    User_Name VARCHAR(50) NOT NULL UNIQUE,
    Email VARCHAR(50) NOT NULL UNIQUE,
    Account_Password VARCHAR(50) NOT NULL,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT NULL
);

-- initialize database
INSERT INTO category (category_name) VALUES ('cellphone');
INSERT INTO category (category_name) VALUES ('air conditioning');

INSERT INTO specification (fk_category, specification_name) VALUES 
((SELECT pk FROM category WHERE category_name = 'cellphone'), 'ram');
INSERT INTO specification (fk_category, specification_name) VALUES 
((SELECT pk FROM category WHERE category_name = 'cellphone'), 'storage');

INSERT INTO specification (fk_category, specification_name) VALUES 
((SELECT pk FROM category WHERE category_name = 'air conditioning'), 'btu/h');
INSERT INTO specification (fk_category, specification_name) VALUES 
((SELECT pk FROM category WHERE category_name = 'air conditioning'), 'voltage');

INSERT INTO product (fk_category, product_name, product_description, price, is_new, brand, product_location) VALUES 
((SELECT pk FROM category WHERE category_name = 'cellphone'), 'Iphone 16', '', 5999.00, true, 'Apple', 'São Paulo');
INSERT INTO specification_product (fk_specification, fk_product, specification_value) VALUES 
(
    (SELECT pk FROM specification WHERE specification_name = 'ram' AND fk_category = (SELECT pk FROM category WHERE category_name = 'cellphone')),
    (SELECT pk FROM product ORDER BY created_at DESC LIMIT 1),
    '16GB'
);
INSERT INTO specification_product (fk_specification, fk_product, specification_value) VALUES 
(
    (SELECT pk FROM specification WHERE specification_name = 'storage' AND fk_category = (SELECT pk FROM category WHERE category_name = 'cellphone')),
    (SELECT pk FROM product ORDER BY created_at DESC LIMIT 1),
    '256GB'
);


INSERT INTO product (fk_category, product_name, product_description, price, is_new, brand, product_location) VALUES 
((SELECT pk FROM category WHERE category_name = 'air conditioning'), 'Ar-Condicionado LG Dual Inverter', '', 2599.00, true, 'LG', 'São Paulo');
INSERT INTO specification_product (fk_specification, fk_product, specification_value) VALUES 
(
    (SELECT pk FROM specification WHERE specification_name = 'btu/h' AND fk_category = (SELECT pk FROM category WHERE category_name = 'air conditioning')),
    (SELECT pk FROM product ORDER BY created_at DESC LIMIT 1),
    '12.000'
);
INSERT INTO specification_product (fk_specification, fk_product, specification_value) VALUES 
(
    (SELECT pk FROM specification WHERE specification_name = 'voltage' AND fk_category = (SELECT pk FROM category WHERE category_name = 'air conditioning')),
    (SELECT pk FROM product ORDER BY created_at DESC LIMIT 1),
    '220V'
);