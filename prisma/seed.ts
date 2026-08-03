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

  // ---- Reviews (homepage testimonials) ---------------------------
  const reviews = [
    {
      name: 'Hannah T.',
      location: 'Leeds',
      quote:
        'Won a full nursery set for my second baby. The whole process was so easy and delivery was quick!',
      rating: 5,
      order: 1,
    },
    {
      name: 'Priya K.',
      location: 'Birmingham',
      quote:
        'Love that they publish every winner. Feels genuinely trustworthy compared to other sites.',
      rating: 5,
      order: 2,
    },
    {
      name: 'James & Leah',
      location: 'Bristol',
      quote:
        'Cheaper than buying a travel system outright and we actually won one. Over the moon!',
      rating: 5,
      order: 3,
    },
  ];
  for (const r of reviews) {
    const existing = await prisma.review.findFirst({ where: { name: r.name, quote: r.quote } });
    if (!existing) await prisma.review.create({ data: r });
  }
  console.log(`   ✔ ${reviews.length} reviews`);

  // ---- Content blocks (homepage sections) ------------------------
  const blocks: { key: string; label: string; data: unknown }[] = [
    {
      key: 'home.hero',
      label: 'Homepage hero',
      data: {
        badge: '⭐ Rated {rating}/5 by families',
        titleLead: 'Win premium',
        titleHighlight: 'baby & family',
        titleTail: 'prizes',
        subtitle:
          'Enter beautiful prize competitions for a fraction of retail value. Fair, verifiable draws and every winner published. Your little treasure deserves the best.',
        primaryCtaLabel: 'Browse competitions',
        primaryCtaHref: '/competitions',
        secondaryCtaLabel: 'See our winners',
        secondaryCtaHref: '/winners',
        image:
          'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=900&q=80',
        winnerCaption: 'Sophie from Manchester 🎉',
      },
    },
    {
      key: 'home.trustBadges',
      label: 'Trust badges',
      data: {
        items: [
          { icon: 'lock', title: 'Secure payments', text: 'Powered by Stripe' },
          { icon: 'verified', title: 'Verifiable draws', text: 'Fair & transparent' },
          { icon: 'local_shipping', title: 'Free UK delivery', text: 'On all physical prizes' },
          { icon: 'family_restroom', title: 'UK based', text: 'Real family business' },
        ],
      },
    },
    {
      key: 'home.howItWorks',
      label: 'How it works steps',
      data: {
        items: [
          { icon: 'redeem', title: 'Pick a prize', text: 'Browse our premium competitions and choose your favourite.' },
          { icon: 'quiz', title: 'Answer & enter', text: 'Answer a simple skill question and choose how many entries.' },
          { icon: 'credit_card', title: 'Pay securely', text: 'Checkout safely with Stripe. Tickets allocated instantly.' },
          { icon: 'emoji_events', title: 'Watch the draw', text: 'We draw on the published date and publish the winner.' },
        ],
      },
    },
  ];
  for (const b of blocks) {
    await prisma.contentBlock.upsert({
      where: { key: b.key },
      update: { label: b.label, data: b.data as never },
      create: { key: b.key, label: b.label, data: b.data as never },
    });
  }
  console.log(`   ✔ ${blocks.length} content blocks`);

  // ---- CMS content pages -----------------------------------------
  const pages = [
    {
      slug: 'about',
      title: 'About Us',
      metaTitle: 'About Us',
      metaDescription:
        'Tiny Treasure Competitions is a UK family business giving away premium baby and family prizes through fair, verifiable draws.',
      content: `## We help families win the things they love

Tiny Treasure Competitions was founded by parents who wanted a fairer, friendlier way to win premium baby and family prizes. We hand-pick every prize, run transparent draws, and publish each and every winner — because trust is everything.

## Our promise

We operate our competitions in line with UK law. Every paid entry includes a genuine skill question, and a free postal entry route is always available. Draws take place on the published date using a verifiable random method.

## Play responsibly

Competitions should always be fun. Please only spend what you can comfortably afford. If you ever feel your play is becoming a problem, support is available at BeGambleAware.org.`,
    },
    {
      slug: 'terms',
      title: 'Terms & Conditions',
      metaTitle: 'Terms & Conditions',
      metaDescription: 'The terms and conditions for entering Tiny Treasure Competitions.',
      content: `These terms govern your use of Tiny Treasure Competitions. By entering any competition you agree to these terms in full.

## 1. Eligibility

Entrants must be 18 years or over and resident in the United Kingdom.

## 2. How to enter

Each competition requires the correct answer to a skill-based question. Paid entries are made through our secure Stripe checkout. Ticket numbers are allocated automatically once payment is confirmed.

## 3. Free postal entry route

No purchase is necessary. You may enter for free by post. Send your name, address, email, telephone number, the competition you wish to enter and your answer to the skill question to our registered postal address. One entry per stamped envelope.

## 4. Closing dates and draws

Each competition has a published closing date and draw date. Winners are drawn from all valid entries using a verifiable random selection method.

## 5. Winners and prizes

Winners are notified within 7 days of the draw and published on our Winners page (first name and region only). Physical prizes are delivered free of charge to a UK address.

## 6. Refunds

Entries are non-refundable once a competition has closed, except where a competition is cancelled, in which case all entrants are refunded in full.

## 7. Governing law

These terms are governed by the laws of England and Wales.`,
    },
    {
      slug: 'privacy',
      title: 'Privacy Policy',
      metaTitle: 'Privacy Policy',
      metaDescription:
        'How Tiny Treasure Competitions collects, uses and protects your personal data.',
      content: `This policy explains how we collect, use and protect your personal data in accordance with the UK GDPR and the Data Protection Act 2018.

## Data we collect

Account details, order details, contact details for prize delivery, and technical data such as IP address.

## How we use your data

To administer competitions, process payments securely via Stripe, send marketing emails where you have opted in, and comply with our legal obligations.

## Payment data

Card payments are processed by Stripe. We never store your full card details on our servers.

## Your rights

You have the right to access, correct, or erase your personal data, and to withdraw consent to marketing at any time.`,
    },
    {
      slug: 'responsible-play',
      title: 'Responsible Play',
      metaTitle: 'Responsible Play',
      metaDescription: 'Our commitment to keeping competitions fun, fair and within your means.',
      content: `Competitions should always be fun. We are committed to promoting responsible play.

## Our commitments

We only allow entrants aged 18 and over, display clear pricing and odds on every competition, and never encourage you to spend more than you can afford.

## Tips for staying in control

Set yourself a budget and stick to it. Treat entry fees as the cost of entertainment. Take a break if it stops being fun.

## Getting support

Free and confidential help is available from BeGambleAware (begambleaware.org) and GamCare (gamcare.org.uk), or call the National Gambling Helpline on 0808 8020 133.`,
    },
  ];
  for (const p of pages) {
    await prisma.page.upsert({
      where: { slug: p.slug },
      update: p,
      create: { ...p, published: true },
    });
  }
  console.log(`   ✔ ${pages.length} content pages`);

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
