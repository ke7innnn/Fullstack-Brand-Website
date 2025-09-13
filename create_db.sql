DROP TABLE IF EXISTS discounts;
DROP TABLE IF EXISTS t_shirts;

CREATE TABLE t_shirts (
    t_shirt_id INTEGER PRIMARY KEY AUTOINCREMENT,
    brand TEXT NOT NULL CHECK(brand IN ('Van Huesen', 'Levi', 'Nike', 'Adidas')),
    color TEXT NOT NULL CHECK(color IN ('Red', 'Blue', 'Black', 'White')),
    size TEXT NOT NULL CHECK(size IN ('XS', 'S', 'M', 'L', 'XL')),
    price INTEGER CHECK (price BETWEEN 10 AND 50),
    stock_quantity INTEGER NOT NULL,
    UNIQUE (brand, color, size)
);

CREATE TABLE discounts (
    discount_id INTEGER PRIMARY KEY AUTOINCREMENT,
    t_shirt_id INTEGER NOT NULL,
    pct_discount REAL CHECK (pct_discount BETWEEN 0 AND 100),
    FOREIGN KEY (t_shirt_id) REFERENCES t_shirts(t_shirt_id)
);

-- Insert statements for T-Shirts with a wide variety of unique combinations
INSERT INTO t_shirts (brand, color, size, price, stock_quantity) VALUES
('Nike', 'White', 'XS', 25, 91), ('Nike', 'White', 'S', 26, 88), ('Nike', 'White', 'M', 27, 85),
('Nike', 'White', 'L', 28, 82), ('Nike', 'White', 'XL', 29, 79),
('Nike', 'Red', 'XS', 25, 95), ('Nike', 'Red', 'S', 26, 92), ('Nike', 'Red', 'M', 27, 89),
('Nike', 'Red', 'L', 28, 86), ('Nike', 'Red', 'XL', 29, 83),
('Nike', 'Blue', 'XS', 25, 93), ('Nike', 'Blue', 'S', 26, 90), ('Nike', 'Blue', 'M', 27, 87),
('Nike', 'Blue', 'L', 28, 84), ('Nike', 'Blue', 'XL', 29, 81),
('Nike', 'Black', 'XS', 25, 98), ('Nike', 'Black', 'S', 26, 96), ('Nike', 'Black', 'M', 27, 94),
('Nike', 'Black', 'L', 28, 92), ('Nike', 'Black', 'XL', 29, 90),
('Levi', 'White', 'XS', 30, 71), ('Levi', 'White', 'S', 31, 74), ('Levi', 'White', 'M', 32, 77),
('Levi', 'White', 'L', 33, 80), ('Levi', 'White', 'XL', 34, 83),
('Levi', 'Red', 'XS', 30, 75), ('Levi', 'Red', 'S', 31, 78), ('Levi', 'Red', 'M', 32, 81),
('Levi', 'Red', 'L', 33, 84), ('Levi', 'Red', 'XL', 34, 87),
('Levi', 'Blue', 'XS', 30, 79), ('Levi', 'Blue', 'S', 31, 82), ('Levi', 'Blue', 'M', 32, 85),
('Levi', 'Blue', 'L', 33, 88), ('Levi', 'Blue', 'XL', 34, 91),
('Levi', 'Black', 'XS', 30, 80), ('Levi', 'Black', 'S', 31, 85), ('Levi', 'Black', 'M', 32, 90),
('Levi', 'Black', 'L', 33, 95), ('Levi', 'Black', 'XL', 34, 100),
('Adidas', 'White', 'XS', 40, 50), ('Adidas', 'White', 'S', 41, 55), ('Adidas', 'White', 'M', 42, 60),
('Adidas', 'White', 'L', 43, 65), ('Adidas', 'White', 'XL', 44, 70),
('Adidas', 'Red', 'XS', 40, 55), ('Adidas', 'Red', 'S', 41, 60), ('Adidas', 'Red', 'M', 42, 65),
('Adidas', 'Red', 'L', 43, 70), ('Adidas', 'Red', 'XL', 44, 75),
('Adidas', 'Blue', 'XS', 40, 60), ('Adidas', 'Blue', 'S', 41, 65), ('Adidas', 'Blue', 'M', 42, 70),
('Adidas', 'Blue', 'L', 43, 75), ('Adidas', 'Blue', 'XL', 44, 80),
('Adidas', 'Black', 'XS', 40, 65), ('Adidas', 'Black', 'S', 41, 70), ('Adidas', 'Black', 'M', 42, 75),
('Adidas', 'Black', 'L', 43, 80), ('Adidas', 'Black', 'XL', 44, 85),
('Van Huesen', 'White', 'XS', 35, 110), ('Van Huesen', 'White', 'S', 36, 115), ('Van Huesen', 'White', 'M', 37, 120),
('Van Huesen', 'White', 'L', 38, 125), ('Van Huesen', 'White', 'XL', 39, 130),
('Van Huesen', 'Red', 'XS', 35, 120), ('Van Huesen', 'Red', 'S', 36, 125), ('Van Huesen', 'Red', 'M', 37, 130),
('Van Huesen', 'Red', 'L', 38, 135), ('Van Huesen', 'Red', 'XL', 39, 140),
('Van Huesen', 'Blue', 'XS', 35, 130), ('Van Huesen', 'Blue', 'S', 36, 135), ('Van Huesen', 'Blue', 'M', 37, 140),
('Van Huesen', 'Blue', 'L', 38, 145), ('Van Huesen', 'Blue', 'XL', 39, 150),
('Van Huesen', 'Black', 'XS', 35, 140), ('Van Huesen', 'Black', 'S', 36, 145), ('Van Huesen', 'Black', 'M', 37, 150),
('Van Huesen', 'Black', 'L', 38, 155), ('Van Huesen', 'Black', 'XL', 39, 160);

-- Insert statements for Discounts for all new T-shirt entries
INSERT INTO discounts (t_shirt_id, pct_discount) VALUES
(1, 15.0), (2, 10.0), (3, 5.0), (4, 20.0), (5, 10.0), (6, 15.0), (7, 5.0), (8, 20.0), (9, 10.0), (10, 15.0),
(11, 5.0), (12, 20.0), (13, 10.0), (14, 15.0), (15, 5.0), (16, 20.0), (17, 10.0), (18, 15.0), (19, 5.0), (20, 20.0),
(21, 10.0), (22, 15.0), (23, 5.0), (24, 20.0), (25, 10.0), (26, 15.0), (27, 5.0), (28, 20.0), (29, 10.0), (30, 15.0),
(31, 5.0), (32, 20.0), (33, 10.0), (34, 15.0), (35, 5.0), (36, 20.0), (37, 10.0), (38, 15.0), (39, 5.0), (40, 20.0),
(41, 10.0), (42, 15.0), (43, 5.0), (44, 20.0), (45, 10.0), (46, 15.0), (47, 5.0), (48, 20.0), (49, 10.0), (50, 15.0),
(51, 5.0), (52, 20.0), (53, 10.0), (54, 15.0), (55, 5.0), (56, 20.0), (57, 10.0), (58, 15.0), (59, 5.0), (60, 20.0),
(61, 10.0), (62, 15.0), (63, 5.0), (64, 20.0), (65, 10.0), (66, 15.0), (67, 5.0), (68, 20.0), (69, 10.0), (70, 15.0),
(71, 5.0), (72, 20.0), (73, 10.0), (74, 15.0), (75, 5.0), (76, 20.0), (77, 10.0), (78, 15.0), (79, 5.0), (80, 20.0);