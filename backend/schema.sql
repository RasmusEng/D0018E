
DO $$ BEGIN
    CREATE TYPE diet_type AS ENUM ('carnivore', 'omnivore', 'herbivore');
EXCEPTION 
    WHEN duplicate_object THEN NULL; 
END $$;

DO $$ BEGIN
    CREATE TYPE region_type AS ENUM ('south africa', 'america', 'asia', 'north america', 'europe', 'south america', 'africa');
EXCEPTION 
    WHEN duplicate_object THEN NULL; 
END $$;

DO $$ BEGIN
    CREATE TYPE dino_type_type AS ENUM ('terrestrial');
EXCEPTION 
    WHEN duplicate_object THEN NULL; 
END $$;
    
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY,
    email VARCHAR(50) UNIQUE,
    password VARCHAR(50),
    admin BOOLEAN
);

CREATE TABLE IF NOT EXISTS products (
    product_id INTEGER PRIMARY KEY,
    product_name VARCHAR(50),
    weight INTEGER,
    height INTEGER,
    length INTEGER,
    diet diet_type,
    region region_type,
    dino_type dino_type_type,
    description TEXT,
    image TEXT,
    stock INTEGER,
    amount_sold INTEGER,
    price INTEGER
);

CREATE TABLE IF NOT EXISTS orders (
    order_id INTEGER PRIMARY KEY,
    user_id INTEGER UNIQUE,
    order_status SMALLINT,
    order_date DATE,
    shipped_date DATE,
 
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);

CREATE TABLE IF NOT EXISTS order_items (
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    list_price NUMERIC(10, 2),

    PRIMARY KEY (order_id, product_id),

    FOREIGN KEY (order_id) REFERENCES orders (order_id),
    FOREIGN KEY (product_id) REFERENCES products (product_id)
);


CREATE TABLE IF NOT EXISTS review (
    product_id INTEGER,
    review TEXT,
    grade INTERVAL,
    user_id INTEGER,
    verified_customer boolean,

    PRIMARY KEY (product_id, user_id),

    FOREIGN KEY (user_id) REFERENCES users (user_id),
    FOREIGN KEY (product_id) REFERENCES products (product_id)
);