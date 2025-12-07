import { PrismaClient, Role, RatingLevel, ComplaintStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clean
  console.log('🗑️ Cleaning...')
  await prisma.log.deleteMany()
  await prisma.interaction.deleteMany()
  await prisma.complaint.deleteMany()
  await prisma.rating.deleteMany()
  await prisma.productStat.deleteMany()
  await prisma.product.deleteMany()
  await prisma.user.deleteMany()

  // Admin
  const admin = await prisma.user.create({
    data: {
      fullName: 'Sarena Admin',
      email: 'admin@sarenastore.cm',
      phone: '+237690000000',
      role: Role.ADMIN,
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    },
  })

  // Supplier
  const supplier = await prisma.user.create({
    data: {
      fullName: 'Paul Fournisseur',
      email: 'supplier@sarenastore.cm',
      phone: '+237691111111',
      role: Role.SUPPLIER,
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    },
  })

  // Test User
  const testUser = await prisma.user.create({
    data: {
      fullName: 'Marie Client',
      email: 'user@sarenastore.cm',
      role: Role.USER,
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
    },
  })

  console.log('✅ Users created')

  // Products with translations
  const products = [
    {
      name: { fr: 'Casque Audio Sans Fil', en: 'Wireless Headphones' },
      shortDesc: {
        fr: 'Casque Bluetooth avec réduction de bruit et son HD.',
        en: 'Bluetooth headphones with noise cancellation and HD sound.',
      },
      longDesc: {
        fr: `Casque audio premium sans fil.

🎧 CARACTÉRISTIQUES
• Bluetooth 5.0 haute fidélité
• Réduction de bruit active
• 20h d'autonomie
• Microphone intégré HD

📦 CONTENU
• Casque
• Câble USB-C
• Étui de transport`,
        en: `Premium wireless headphones.

🎧 FEATURES
• Bluetooth 5.0 high fidelity
• Active noise cancellation
• 20h battery life
• HD integrated microphone

📦 INCLUDED
• Headphones
• USB-C cable
• Carrying case`,
      },
      price: 25000,
      stock: 20,
      city: 'Douala',
      thumbnail:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=800&fit=crop',
      ],
      isNew: true,
    },
    {
      name: { fr: 'Montre Connectée Sport', en: 'Sport Smartwatch' },
      shortDesc: {
        fr: 'Smartwatch avec suivi santé, GPS et écran tactile.',
        en: 'Smartwatch with health tracking, GPS and touchscreen.',
      },
      longDesc: {
        fr: `Montre connectée sport.

⌚ FONCTIONNALITÉS
• Écran tactile AMOLED
• GPS intégré
• Suivi cardiaque 24/7
• 7 jours d'autonomie
• Étanche IP68`,
        en: `Sport smartwatch.

⌚ FEATURES
• AMOLED touchscreen
• Built-in GPS
• 24/7 heart rate monitoring
• 7 days battery life
• IP68 waterproof`,
      },
      price: 35000,
      stock: 15,
      city: 'Yaoundé',
      thumbnail:
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&h=800&fit=crop',
      ],
      isNew: true,
    },
    {
      name: { fr: 'Sac à Dos Urbain', en: 'Urban Backpack' },
      shortDesc: {
        fr: 'Sac résistant avec compartiment laptop 15".',
        en: 'Durable bag with 15" laptop compartment.',
      },
      longDesc: {
        fr: `Sac à dos urbain élégant.

💼 CARACTÉRISTIQUES
• Compartiment laptop 15"
• Port USB externe
• Tissu imperméable
• Bretelles ergonomiques`,
        en: `Elegant urban backpack.

💼 FEATURES
• 15" laptop compartment
• External USB port
• Waterproof fabric
• Ergonomic straps`,
      },
      price: 15000,
      stock: 30,
      city: 'Douala',
      thumbnail: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop',
      images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop'],
      isNew: false,
    },
    {
      name: { fr: 'Enceinte Bluetooth', en: 'Bluetooth Speaker' },
      shortDesc: {
        fr: 'Enceinte portable étanche avec basses puissantes.',
        en: 'Waterproof portable speaker with powerful bass.',
      },
      longDesc: {
        fr: `Enceinte Bluetooth portable.

🔊 AUDIO
• 20W de puissance
• Basses profondes
• IPX7 étanche
• 12h d'autonomie`,
        en: `Portable Bluetooth speaker.

🔊 AUDIO
• 20W power
• Deep bass
• IPX7 waterproof
• 12h battery life`,
      },
      price: 18000,
      stock: 25,
      city: 'Bafoussam',
      thumbnail:
        'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop',
      images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=800&fit=crop'],
      isNew: true,
    },
    {
      name: { fr: 'Lampe LED Bureau', en: 'LED Desk Lamp' },
      shortDesc: {
        fr: 'Lampe de bureau réglable avec port USB.',
        en: 'Adjustable desk lamp with USB port.',
      },
      longDesc: {
        fr: `Lampe LED pour bureau.

💡 ÉCLAIRAGE
• 3 modes de lumière
• Intensité réglable
• Port USB intégré
• Protection des yeux`,
        en: `LED desk lamp.

💡 LIGHTING
• 3 light modes
• Adjustable brightness
• Built-in USB port
• Eye protection`,
      },
      price: 12000,
      stock: 5,
      city: 'Douala',
      thumbnail:
        'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=600&fit=crop',
      images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=800&fit=crop'],
      isNew: false,
    },
    {
      name: { fr: 'Appareil Photo Instantané', en: 'Instant Camera' },
      shortDesc: {
        fr: 'Appareil photo avec impression instantanée.',
        en: 'Camera with instant printing.',
      },
      longDesc: {
        fr: `Appareil photo instantané.

📸 PHOTO
• Impression immédiate
• Mode selfie
• Flash automatique
• Design rétro`,
        en: `Instant camera.

📸 PHOTO
• Instant printing
• Selfie mode
• Auto flash
• Retro design`,
      },
      price: 45000,
      stock: 8,
      city: 'Yaoundé',
      thumbnail:
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&h=600&fit=crop',
      images: ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&h=800&fit=crop'],
      isNew: false,
    },
  ]

  for (const p of products) {
    await prisma.product.create({
      data: {
        name: p.name,
        shortDesc: p.shortDesc,
        longDesc: p.longDesc,
        price: p.price,
        stock: p.stock,
        city: p.city,
        thumbnail: p.thumbnail,
        images: p.images,
        isNew: p.isNew,
        supplierId: supplier.id,
      },
    })
  }
  console.log('✅ Products created')

  const createdProducts = await prisma.product.findMany()

  // Stats
  const statsData = createdProducts.map((product, index) => ({
    productId: product.id,
    views: [180, 150, 100, 120, 60, 80][index] || 50,
    clicks: [70, 55, 40, 50, 25, 35][index] || 20,
    complaints: 0,
    ratingAvg: [4.5, 4.2, 4.0, 4.3, 4.8, 3.8][index] || 4.0,
  }))
  await prisma.productStat.createMany({ data: statsData })

  // Ratings
  const ratingsData = [
    {
      userId: testUser.id,
      productId: createdProducts[0].id,
      level: RatingLevel.LEGENDAIRE,
      comment: 'Excellent !',
    },
    {
      userId: testUser.id,
      productId: createdProducts[1].id,
      level: RatingLevel.FEU,
      comment: 'Très bien.',
    },
    {
      userId: admin.id,
      productId: createdProducts[4].id,
      level: RatingLevel.LEGENDAIRE,
      comment: 'Parfait.',
    },
  ]
  await prisma.rating.createMany({ data: ratingsData })

  // Interactions
  const interactions = Array.from({ length: 50 }, () => ({
    productId: createdProducts[Math.floor(Math.random() * createdProducts.length)].id,
    userIp: `192.168.1.${Math.floor(Math.random() * 255)}`,
  }))
  await prisma.interaction.createMany({ data: interactions })

  console.log('')
  console.log('🎉 Database seeded!')
  console.log('')
  console.log('📧 Accounts:')
  console.log('   Admin: admin@sarenastore.cm')
  console.log('   Supplier: supplier@sarenastore.cm')
  console.log('   User: user@sarenastore.cm')
  console.log('')
  console.log('📱 WhatsApp:', admin.phone)
  console.log('🛍️ Products:', createdProducts.length)
}

main()
  .catch(e => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
