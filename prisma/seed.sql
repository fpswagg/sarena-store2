-- ============================================
-- Sarena Store Database Seed Data
-- Generated from Prisma seed.ts
-- ============================================

-- Clean existing data (in reverse dependency order)
TRUNCATE TABLE "Log" CASCADE;
TRUNCATE TABLE "Interaction" CASCADE;
TRUNCATE TABLE "Complaint" CASCADE;
TRUNCATE TABLE "Rating" CASCADE;
TRUNCATE TABLE "ProductStat" CASCADE;
TRUNCATE TABLE "Product" CASCADE;
TRUNCATE TABLE "User" CASCADE;

-- ============================================
-- Insert Users
-- ============================================

-- Admin User
INSERT INTO "User" ("id", "fullName", "email", "phone", "role", "avatar", "createdAt", "updatedAt")
VALUES (
    gen_random_uuid(),
    'Sarena Admin',
    'admin@sarenastore.cm',
    '+237690000000',
    'ADMIN'::"Role",
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Supplier User
INSERT INTO "User" ("id", "fullName", "email", "phone", "role", "avatar", "createdAt", "updatedAt")
VALUES (
    gen_random_uuid(),
    'Paul Fournisseur',
    'supplier@sarenastore.cm',
    '+237691111111',
    'SUPPLIER'::"Role",
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Test User
INSERT INTO "User" ("id", "fullName", "email", "role", "avatar", "createdAt", "updatedAt")
VALUES (
    gen_random_uuid(),
    'Marie Client',
    'user@sarenastore.cm',
    'USER'::"Role",
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- ============================================
-- Insert Products
-- ============================================
-- Note: We'll use CTEs to get the supplier ID

WITH supplier AS (
    SELECT "id" FROM "User" WHERE "email" = 'supplier@sarenastore.cm' LIMIT 1
)
INSERT INTO "Product" ("id", "name", "shortDesc", "longDesc", "price", "stock", "city", "thumbnail", "images", "isNew", "supplierId", "createdAt")
SELECT
    gen_random_uuid(),
    '{"fr": "Casque Audio Sans Fil", "en": "Wireless Headphones"}'::jsonb,
    '{"fr": "Casque Bluetooth avec réduction de bruit et son HD.", "en": "Bluetooth headphones with noise cancellation and HD sound."}'::jsonb,
    '{"fr": "Casque audio premium sans fil.\n\n🎧 CARACTÉRISTIQUES\n• Bluetooth 5.0 haute fidélité\n• Réduction de bruit active\n• 20h d''autonomie\n• Microphone intégré HD\n\n📦 CONTENU\n• Casque\n• Câble USB-C\n• Étui de transport", "en": "Premium wireless headphones.\n\n🎧 FEATURES\n• Bluetooth 5.0 high fidelity\n• Active noise cancellation\n• 20h battery life\n• HD integrated microphone\n\n📦 INCLUDED\n• Headphones\n• USB-C cable\n• Carrying case"}'::jsonb,
    25000,
    20,
    'Douala',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
    ARRAY[
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=800&fit=crop'
    ],
    true,
    supplier."id",
    CURRENT_TIMESTAMP
FROM supplier;

WITH supplier AS (
    SELECT "id" FROM "User" WHERE "email" = 'supplier@sarenastore.cm' LIMIT 1
)
INSERT INTO "Product" ("id", "name", "shortDesc", "longDesc", "price", "stock", "city", "thumbnail", "images", "isNew", "supplierId", "createdAt")
SELECT
    gen_random_uuid(),
    '{"fr": "Montre Connectée Sport", "en": "Sport Smartwatch"}'::jsonb,
    '{"fr": "Smartwatch avec suivi santé, GPS et écran tactile.", "en": "Smartwatch with health tracking, GPS and touchscreen."}'::jsonb,
    '{"fr": "Montre connectée sport.\n\n⌚ FONCTIONNALITÉS\n• Écran tactile AMOLED\n• GPS intégré\n• Suivi cardiaque 24/7\n• 7 jours d''autonomie\n• Étanche IP68", "en": "Sport smartwatch.\n\n⌚ FEATURES\n• AMOLED touchscreen\n• Built-in GPS\n• 24/7 heart rate monitoring\n• 7 days battery life\n• IP68 waterproof"}'::jsonb,
    35000,
    15,
    'Yaoundé',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop',
    ARRAY[
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&h=800&fit=crop'
    ],
    true,
    supplier."id",
    CURRENT_TIMESTAMP
FROM supplier;

WITH supplier AS (
    SELECT "id" FROM "User" WHERE "email" = 'supplier@sarenastore.cm' LIMIT 1
)
INSERT INTO "Product" ("id", "name", "shortDesc", "longDesc", "price", "stock", "city", "thumbnail", "images", "isNew", "supplierId", "createdAt")
SELECT
    gen_random_uuid(),
    '{"fr": "Sac à Dos Urbain", "en": "Urban Backpack"}'::jsonb,
    '{"fr": "Sac résistant avec compartiment laptop 15\".", "en": "Durable bag with 15\" laptop compartment."}'::jsonb,
    '{"fr": "Sac à dos urbain élégant.\n\n💼 CARACTÉRISTIQUES\n• Compartiment laptop 15\"\n• Port USB externe\n• Tissu imperméable\n• Bretelles ergonomiques", "en": "Elegant urban backpack.\n\n💼 FEATURES\n• 15\" laptop compartment\n• External USB port\n• Waterproof fabric\n• Ergonomic straps"}'::jsonb,
    15000,
    30,
    'Douala',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop',
    ARRAY['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop'],
    false,
    supplier."id",
    CURRENT_TIMESTAMP
FROM supplier;

WITH supplier AS (
    SELECT "id" FROM "User" WHERE "email" = 'supplier@sarenastore.cm' LIMIT 1
)
INSERT INTO "Product" ("id", "name", "shortDesc", "longDesc", "price", "stock", "city", "thumbnail", "images", "isNew", "supplierId", "createdAt")
SELECT
    gen_random_uuid(),
    '{"fr": "Enceinte Bluetooth", "en": "Bluetooth Speaker"}'::jsonb,
    '{"fr": "Enceinte portable étanche avec basses puissantes.", "en": "Waterproof portable speaker with powerful bass."}'::jsonb,
    '{"fr": "Enceinte Bluetooth portable.\n\n🔊 AUDIO\n• 20W de puissance\n• Basses profondes\n• IPX7 étanche\n• 12h d''autonomie", "en": "Portable Bluetooth speaker.\n\n🔊 AUDIO\n• 20W power\n• Deep bass\n• IPX7 waterproof\n• 12h battery life"}'::jsonb,
    18000,
    25,
    'Bafoussam',
    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop',
    ARRAY['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=800&fit=crop'],
    true,
    supplier."id",
    CURRENT_TIMESTAMP
FROM supplier;

WITH supplier AS (
    SELECT "id" FROM "User" WHERE "email" = 'supplier@sarenastore.cm' LIMIT 1
)
INSERT INTO "Product" ("id", "name", "shortDesc", "longDesc", "price", "stock", "city", "thumbnail", "images", "isNew", "supplierId", "createdAt")
SELECT
    gen_random_uuid(),
    '{"fr": "Lampe LED Bureau", "en": "LED Desk Lamp"}'::jsonb,
    '{"fr": "Lampe de bureau réglable avec port USB.", "en": "Adjustable desk lamp with USB port."}'::jsonb,
    '{"fr": "Lampe LED pour bureau.\n\n💡 ÉCLAIRAGE\n• 3 modes de lumière\n• Intensité réglable\n• Port USB intégré\n• Protection des yeux", "en": "LED desk lamp.\n\n💡 LIGHTING\n• 3 light modes\n• Adjustable brightness\n• Built-in USB port\n• Eye protection"}'::jsonb,
    12000,
    5,
    'Douala',
    'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=600&fit=crop',
    ARRAY['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=800&fit=crop'],
    false,
    supplier."id",
    CURRENT_TIMESTAMP
FROM supplier;

WITH supplier AS (
    SELECT "id" FROM "User" WHERE "email" = 'supplier@sarenastore.cm' LIMIT 1
)
INSERT INTO "Product" ("id", "name", "shortDesc", "longDesc", "price", "stock", "city", "thumbnail", "images", "isNew", "supplierId", "createdAt")
SELECT
    gen_random_uuid(),
    '{"fr": "Appareil Photo Instantané", "en": "Instant Camera"}'::jsonb,
    '{"fr": "Appareil photo avec impression instantanée.", "en": "Camera with instant printing."}'::jsonb,
    '{"fr": "Appareil photo instantané.\n\n📸 PHOTO\n• Impression immédiate\n• Mode selfie\n• Flash automatique\n• Design rétro", "en": "Instant camera.\n\n📸 PHOTO\n• Instant printing\n• Selfie mode\n• Auto flash\n• Retro design"}'::jsonb,
    45000,
    8,
    'Yaoundé',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&h=600&fit=crop',
    ARRAY['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&h=800&fit=crop'],
    false,
    supplier."id",
    CURRENT_TIMESTAMP
FROM supplier;

-- ============================================
-- Insert Product Stats
-- ============================================

INSERT INTO "ProductStat" ("id", "productId", "views", "clicks", "complaints", "ratingAvg")
SELECT
    gen_random_uuid(),
    p."id",
    CASE 
        WHEN row_number() OVER (ORDER BY p."createdAt") = 1 THEN 180
        WHEN row_number() OVER (ORDER BY p."createdAt") = 2 THEN 150
        WHEN row_number() OVER (ORDER BY p."createdAt") = 3 THEN 100
        WHEN row_number() OVER (ORDER BY p."createdAt") = 4 THEN 120
        WHEN row_number() OVER (ORDER BY p."createdAt") = 5 THEN 60
        WHEN row_number() OVER (ORDER BY p."createdAt") = 6 THEN 80
        ELSE 50
    END,
    CASE 
        WHEN row_number() OVER (ORDER BY p."createdAt") = 1 THEN 70
        WHEN row_number() OVER (ORDER BY p."createdAt") = 2 THEN 55
        WHEN row_number() OVER (ORDER BY p."createdAt") = 3 THEN 40
        WHEN row_number() OVER (ORDER BY p."createdAt") = 4 THEN 50
        WHEN row_number() OVER (ORDER BY p."createdAt") = 5 THEN 25
        WHEN row_number() OVER (ORDER BY p."createdAt") = 6 THEN 35
        ELSE 20
    END,
    0,
    CASE 
        WHEN row_number() OVER (ORDER BY p."createdAt") = 1 THEN 4.5
        WHEN row_number() OVER (ORDER BY p."createdAt") = 2 THEN 4.2
        WHEN row_number() OVER (ORDER BY p."createdAt") = 3 THEN 4.0
        WHEN row_number() OVER (ORDER BY p."createdAt") = 4 THEN 4.3
        WHEN row_number() OVER (ORDER BY p."createdAt") = 5 THEN 4.8
        WHEN row_number() OVER (ORDER BY p."createdAt") = 6 THEN 3.8
        ELSE 4.0
    END
FROM "Product" p
ORDER BY p."createdAt";

-- ============================================
-- Insert Ratings
-- ============================================

WITH 
    test_user AS (SELECT "id" FROM "User" WHERE "email" = 'user@sarenastore.cm' LIMIT 1),
    admin_user AS (SELECT "id" FROM "User" WHERE "email" = 'admin@sarenastore.cm' LIMIT 1),
    products AS (
        SELECT "id", row_number() OVER (ORDER BY "createdAt") as rn
        FROM "Product"
        ORDER BY "createdAt"
    )
INSERT INTO "Rating" ("id", "userId", "productId", "level", "comment", "createdAt")
SELECT
    gen_random_uuid(),
    test_user."id",
    (SELECT "id" FROM products WHERE rn = 1),
    'LEGENDAIRE'::"RatingLevel",
    'Excellent !',
    CURRENT_TIMESTAMP
FROM test_user
UNION ALL
SELECT
    gen_random_uuid(),
    test_user."id",
    (SELECT "id" FROM products WHERE rn = 2),
    'FEU'::"RatingLevel",
    'Très bien.',
    CURRENT_TIMESTAMP
FROM test_user
UNION ALL
SELECT
    gen_random_uuid(),
    admin_user."id",
    (SELECT "id" FROM products WHERE rn = 5),
    'LEGENDAIRE'::"RatingLevel",
    'Parfait.',
    CURRENT_TIMESTAMP
FROM admin_user;

-- ============================================
-- Insert Interactions (50 random interactions)
-- ============================================

-- Generate 50 random interactions
WITH products AS (
    SELECT "id" FROM "Product"
),
random_interactions AS (
    SELECT
        gen_random_uuid() as "id",
        (SELECT "id" FROM products ORDER BY random() LIMIT 1) as "productId",
        '192.168.1.' || floor(random() * 255)::text as "userIp",
        CURRENT_TIMESTAMP as "createdAt"
    FROM generate_series(1, 50)
)
INSERT INTO "Interaction" ("id", "productId", "userIp", "createdAt")
SELECT "id", "productId", "userIp", "createdAt"
FROM random_interactions;

-- ============================================
-- Summary
-- ============================================

DO $$
DECLARE
    user_count INTEGER;
    product_count INTEGER;
    admin_phone TEXT;
BEGIN
    SELECT COUNT(*) INTO user_count FROM "User";
    SELECT COUNT(*) INTO product_count FROM "Product";
    SELECT "phone" INTO admin_phone FROM "User" WHERE "email" = 'admin@sarenastore.cm' LIMIT 1;
    
    RAISE NOTICE '🎉 Database seeded!';
    RAISE NOTICE '';
    RAISE NOTICE '📧 Accounts:';
    RAISE NOTICE '   Admin: admin@sarenastore.cm';
    RAISE NOTICE '   Supplier: supplier@sarenastore.cm';
    RAISE NOTICE '   User: user@sarenastore.cm';
    RAISE NOTICE '';
    RAISE NOTICE '📱 WhatsApp: %', admin_phone;
    RAISE NOTICE '🛍️ Products: %', product_count;
END $$;

