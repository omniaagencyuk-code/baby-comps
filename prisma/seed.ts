import { PrismaClient, CompetitionStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const IMG = {
  pram: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1200&q=80',
  nursery:
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
  toys: 'https://images.unsplash.com/photo-1558877385-8c1b8c8d8d8d?auto=format&fit=crop&w=1200&q=80',
  bundle:
    'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=1200&q=80',
  cash: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&w=1200&q=80',
  car: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
  baby: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1200&q=80',
};

function daysFromNow(days: number, hour = 20): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, 0, 0, 0);
  return d;
}

async function main() {
  console.log('🌱 Seeding Tiny Treasure Competitions...');

  // ---- Admin + demo customer -------------------------------------
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@tinytreasure.co.uk';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!';
  const adminHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: 'ADMIN' },
    create: {
      email: adminEmail,
      passwordHash: adminHash,
      name: 'Site Admin',
      role: 'ADMIN',
    },
  });
  console.log(`   ✔ Admin: ${admin.email} (password: ${adminPassword})`);

  const customerHash = await bcrypt.hash('Password123!', 12);
  const customer = await prisma.user.upsert({
    where: { email: 'demo@tinytreasure.co.uk' },
    update: {},
    create: {
      email: 'demo@tinytreasure.co.uk',
      passwordHash: customerHash,
      name: 'Demo Customer',
      role: 'USER',
      marketingOptIn: true,
    },
  });
  console.log(`   ✔ Demo customer: ${customer.email} (password: Password123!)`);

  // ---- Categories -------------------------------------------------
  const categories = [
    { slug: 'nursery', name: 'Nursery & Furniture', description: 'Cots, dressers and nursery sets.' },
    { slug: 'travel', name: 'Prams & Travel', description: 'Pushchairs, car seats and travel systems.' },
    { slug: 'toys', name: 'Toys & Play', description: 'Wooden toys, play kitchens and more.' },
    { slug: 'bundles', name: 'Baby Bundles', description: 'Big all-in-one baby prize bundles.' },
    { slug: 'cash', name: 'Cash Prizes', description: 'Tax-free cash for growing families.' },
  ];
  const categoryMap: Record<string, string> = {};
  for (const c of categories) {
    const created = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.description },
      create: c,
    });
    categoryMap[c.slug] = created.id;
  }
  console.log(`   ✔ ${categories.length} categories`);

  // ---- Competitions ----------------------------------------------
  const competitions = [
    {
      slug: 'luxury-travel-system-bundle',
      title: 'Luxury 3-in-1 Travel System Bundle',
      subtitle: 'Pram, carrycot & car seat worth £1,200',
      description:
        'Win a complete premium 3-in-1 travel system including pushchair, carrycot, and i-Size car seat with ISOFIX base. Everything you need from newborn to toddler in one beautiful package.',
      heroImage: IMG.pram,
      images: [IMG.pram, IMG.baby],
      retailValue: 120000,
      ticketPrice: 199,
      maxEntries: 1500,
      entriesSold: 842,
      drawDate: daysFromNow(9),
      closingDate: daysFromNow(9, 19),
      status: CompetitionStatus.PUBLISHED,
      featured: true,
      category: 'travel',
      skillQuestion: 'How many wheels does a standard pushchair have?',
      answerOptions: ['Two', 'Four', 'Six'],
      correctAnswer: 'Four',
    },
    {
      slug: 'complete-nursery-makeover',
      title: 'Complete Nursery Makeover',
      subtitle: 'Cot bed, dresser, décor & more — worth £2,000',
      description:
        'Transform your nursery with a full designer makeover: convertible cot bed, changing dresser, wardrobe, soft furnishings and wall décor. Professionally styled and delivered to your door.',
      heroImage: IMG.nursery,
      images: [IMG.nursery],
      retailValue: 200000,
      ticketPrice: 299,
      maxEntries: 2000,
      entriesSold: 1340,
      drawDate: daysFromNow(5),
      closingDate: daysFromNow(5, 19),
      status: CompetitionStatus.PUBLISHED,
      featured: true,
      category: 'nursery',
      skillQuestion: 'What piece of furniture does a baby sleep in?',
      answerOptions: ['Cot', 'Table', 'Bookshelf'],
      correctAnswer: 'Cot',
    },
    {
      slug: 'ultimate-baby-bundle',
      title: 'Ultimate Newborn Baby Bundle',
      subtitle: 'Everything for baby’s first year — worth £1,500',
      description:
        'One lucky winner takes home the ultimate newborn bundle: clothing, feeding essentials, monitor, bath set, playmat, toys and a year of nappies. A complete head start for your little treasure.',
      heroImage: IMG.bundle,
      images: [IMG.bundle],
      retailValue: 150000,
      ticketPrice: 149,
      maxEntries: 2500,
      entriesSold: 2110,
      drawDate: daysFromNow(2),
      closingDate: daysFromNow(2, 19),
      status: CompetitionStatus.PUBLISHED,
      featured: true,
      category: 'bundles',
      skillQuestion: 'What do babies wear on their bottoms?',
      answerOptions: ['Nappies', 'Gloves', 'Hats'],
      correctAnswer: 'Nappies',
    },
    {
      slug: 'wooden-play-kitchen-set',
      title: 'Deluxe Wooden Play Kitchen & Toy Set',
      subtitle: 'Montessori-style play set worth £400',
      description:
        'A gorgeous solid-wood play kitchen with accessories, plus a curated bundle of open-ended wooden toys to spark imagination and independent play.',
      heroImage: IMG.toys,
      images: [IMG.toys],
      retailValue: 40000,
      ticketPrice: 99,
      maxEntries: 800,
      entriesSold: 260,
      drawDate: daysFromNow(14),
      closingDate: daysFromNow(14, 19),
      status: CompetitionStatus.PUBLISHED,
      featured: false,
      category: 'toys',
      skillQuestion: 'Which room is a kitchen?',
      answerOptions: ['Where you cook', 'Where you sleep', 'Where you park'],
      correctAnswer: 'Where you cook',
    },
    {
      slug: 'tax-free-cash-2500',
      title: '£2,500 Tax-Free Baby Cash',
      subtitle: 'Spend it however your family needs',
      description:
        'Skip the shopping — win £2,500 in tax-free cash paid straight to your bank account. Perfect for whatever your growing family needs most.',
      heroImage: IMG.cash,
      images: [IMG.cash],
      retailValue: 250000,
      ticketPrice: 249,
      maxEntries: 3000,
      entriesSold: 1890,
      drawDate: daysFromNow(7),
      closingDate: daysFromNow(7, 19),
      status: CompetitionStatus.PUBLISHED,
      featured: false,
      category: 'cash',
      skillQuestion: 'What currency is used in the UK?',
      answerOptions: ['Pounds', 'Dollars', 'Euros'],
      correctAnswer: 'Pounds',
    },
    {
      slug: 'family-suv-giveaway',
      title: 'Family SUV Giveaway',
      subtitle: 'A brand-new 7-seater — or £25,000 cash',
      description:
        'Win a brand-new family SUV with all the space you need for car seats, prams and everything in between. Prefer cash? Take £25,000 instead.',
      heroImage: IMG.car,
      images: [IMG.car],
      retailValue: 3000000,
      ticketPrice: 599,
      maxEntries: 8000,
      entriesSold: 3200,
      drawDate: daysFromNow(21),
      closingDate: daysFromNow(21, 19),
      status: CompetitionStatus.PUBLISHED,
      featured: false,
      category: 'cash',
      skillQuestion: 'How many seats does a 7-seater car have?',
      answerOptions: ['Seven', 'Two', 'Twelve'],
      correctAnswer: 'Seven',
    },
  ];

  for (const c of competitions) {
    const { category, ...data } = c;
    await prisma.competition.upsert({
      where: { slug: c.slug },
      update: { ...data, categoryId: categoryMap[category] },
      create: { ...data, categoryId: categoryMap[category] },
    });
  }
  console.log(`   ✔ ${competitions.length} competitions`);

  // ---- A drawn competition + published winner --------------------
  const drawnComp = await prisma.competition.upsert({
    where: { slug: 'summer-baby-bundle-drawn' },
    update: {},
    create: {
      slug: 'summer-baby-bundle-drawn',
      title: 'Summer Baby Bundle',
      subtitle: 'Completed competition',
      description: 'A completed summer bundle competition. Congratulations to our winner!',
      heroImage: IMG.baby,
      retailValue: 90000,
      ticketPrice: 149,
      maxEntries: 1200,
      entriesSold: 1200,
      drawDate: daysFromNow(-6),
      closingDate: daysFromNow(-7),
      status: CompetitionStatus.DRAWN,
      category: 'bundles',
      categoryId: categoryMap['bundles'],
    } as never,
  });

  await prisma.winner.upsert({
    where: { competitionId: drawnComp.id },
    update: {},
    create: {
      competitionId: drawnComp.id,
      name: 'Sophie M.',
      location: 'Manchester',
      ticketNumber: 738,
      prizeTitle: 'Summer Baby Bundle',
      image: IMG.baby,
      quote: 'I never win anything — I actually cried! Thank you Tiny Treasure!',
      published: true,
      drawnAt: daysFromNow(-6),
    },
  });
  console.log('   ✔ 1 drawn competition + winner');

  // ---- Blog posts -------------------------------------------------
  const posts = [
    {
      slug: 'how-uk-prize-competitions-work',
      title: 'How UK Prize Competitions Work (and Why They’re Legal)',
      excerpt:
        'A plain-English guide to skill-based prize competitions in the UK and how we keep everything fair.',
      content:
        'UK prize competitions are legal when they require an element of skill or knowledge to enter, which distinguishes them from lotteries...\n\nAt Tiny Treasure Competitions, every entry includes a simple skill question. Draws are conducted using a verifiable random method and all winners are published.',
      coverImage: IMG.baby,
      category: 'nursery',
    },
    {
      slug: 'nursery-checklist-for-new-parents',
      title: 'The Ultimate Nursery Checklist for New Parents',
      excerpt: 'Everything you actually need (and what you can skip) when setting up your nursery.',
      content:
        'Setting up a nursery can feel overwhelming. Here is our no-nonsense checklist covering the essentials...\n\n1. A safe sleep space\n2. Somewhere to change baby\n3. Storage\n4. Soft lighting',
      coverImage: IMG.nursery,
      category: 'nursery',
    },
    {
      slug: 'meet-our-winners',
      title: 'Meet Our Winners: Real Families, Real Prizes',
      excerpt: 'We caught up with some of our recent winners to hear their stories.',
      content:
        'Every draw changes a family’s week. We love sharing the moments when our winners find out the good news...',
      coverImage: IMG.bundle,
      category: 'bundles',
    },
  ];
  for (const p of posts) {
    const { category, ...rest } = p;
    await prisma.blogPost.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...rest,
        published: true,
        publishedAt: new Date(),
        categoryId: categoryMap[category],
      },
    });
  }
  console.log(`   ✔ ${posts.length} blog posts`);

  // ---- FAQs -------------------------------------------------------
  const faqs = [
    {
      question: 'How do I enter a competition?',
      answer:
        'Choose a competition, answer the skill question, select how many entries you’d like, and complete your purchase securely with Stripe. Your ticket numbers are allocated instantly once payment is confirmed.',
      category: 'Entering',
      order: 1,
    },
    {
      question: 'When and how is the winner drawn?',
      answer:
        'Each competition has a published draw date. Winners are selected using a verifiable random method from all valid entries, and every winner is published on our Winners page.',
      category: 'Draws',
      order: 2,
    },
    {
      question: 'Is there a free postal entry route?',
      answer:
        'Yes. In line with UK law, a free entry route is available by post. See our Terms & Conditions for the current postal entry address and requirements.',
      category: 'Entering',
      order: 3,
    },
    {
      question: 'How will I receive my prize?',
      answer:
        'Physical prizes are delivered free of charge to your UK address. Cash prizes are paid directly to your bank account, usually within 7 days of the draw.',
      category: 'Prizes',
      order: 4,
    },
    {
      question: 'Can I get a refund?',
      answer:
        'Entries are generally non-refundable once a competition has closed. If a competition is cancelled, all entrants are refunded in full. Contact us if you believe there has been an error.',
      category: 'Payments',
      order: 5,
    },
  ];
  for (const f of faqs) {
    const existing = await prisma.fAQ.findFirst({ where: { question: f.question } });
    if (!existing) await prisma.fAQ.create({ data: f });
  }
  console.log(`   ✔ ${faqs.length} FAQs`);

  // ---- Coupons ----------------------------------------------------
  await prisma.coupon.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: { code: 'WELCOME10', type: 'PERCENT', value: 10, active: true },
  });
  console.log('   ✔ Coupon WELCOME10');

  // ---- Site settings ---------------------------------------------
  const settings: Record<string, string> = {
    'site.tagline': 'Premium baby & family prizes, drawn fairly.',
    'site.announcement': 'Free UK delivery on all physical prizes 🎁',
    'trust.entriesToDate': '128,400',
    'trust.prizesGiven': '£412,000',
    'trust.rating': '4.9',
  };
  for (const [key, value] of Object.entries(settings)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }
  console.log(`   ✔ ${Object.keys(settings).length} site settings`);

  console.log('✅ Seed complete.');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
