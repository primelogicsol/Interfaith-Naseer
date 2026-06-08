import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...\n')

  // ── Accounts ──────────────────────────────────────────
  console.log('--- Accounts ---')

  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD
  const adminName = process.env.ADMIN_NAME

  const moderatorEmail = process.env.MODERATOR_EMAIL
  const moderatorPassword = process.env.MODERATOR_PASSWORD
  const moderatorName = process.env.MODERATOR_NAME

  if (!adminEmail || !adminPassword) {
    console.warn('⚠️  ADMIN_EMAIL or ADMIN_PASSWORD not set in .env — skipping admin seed')
  } else {
    const adminHash = await bcrypt.hash(adminPassword, 10)
    await prisma.user.upsert({
      where: { email: adminEmail },
      update: {},
      create: {
        email: adminEmail,
        passwordHash: adminHash,
        fullName: adminName || 'Super Admin',
        role: 'admin',
        emailVerified: true,
        isActive: true,
      },
    })
    console.log(`✅ Admin account: ${adminEmail} (role: admin)`)
  }

  if (!moderatorEmail || !moderatorPassword) {
    console.warn('⚠️  MODERATOR_EMAIL or MODERATOR_PASSWORD not set in .env — skipping moderator seed')
  } else {
    const modHash = await bcrypt.hash(moderatorPassword, 10)
    await prisma.user.upsert({
      where: { email: moderatorEmail },
      update: {},
      create: {
        email: moderatorEmail,
        passwordHash: modHash,
        fullName: moderatorName || 'Head Moderator',
        role: 'moderator',
        emailVerified: true,
        isActive: true,
      },
    })
    console.log(`✅ Moderator account: ${moderatorEmail} (role: moderator)`)
  }

  // ── Helper: seed only when table is empty ──────────────
  async function seedTable<T>(name: string, fn: () => Promise<T[]>): Promise<number> {
    // Exclude models that use sectionKey as unique identifier
    const skipCountModels = ['missionContent', 'aboutContent', 'teachingSection', 'truthSection', 'traditionSection', 'sufiContent', 'approachContent', 'pageContent']
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const model = (prisma as any)[name]
    if (!skipCountModels.includes(name)) {
      const count = await model.count()
      if (count > 0) {
        console.log(`⏭️  ${name}: ${count} existing records — skipping`)
        return count
      }
    }
    const data = await fn()
    console.log(`✅ ${name}: ${data.length} records created`)
    return data.length
  }

  // ── Core Pillars ───────────────────────────────────────
  console.log('\n--- Core Pillars ---')

  await seedTable('corePillar', async () => {
    const pillars = [
      {
        title: 'Eliminate Hatred',
        description: 'Through divine love and understanding, we dissolve the barriers of prejudice and fear that separate hearts. We believe that when hearts are purified through spiritual practice, they become mirrors reflecting the Divine Light in all beings.',
        icon: 'Heart',
        color: '#E07070',
        orderIndex: 0,
      },
      {
        title: 'Dispel Misconceptions',
        description: 'Illuminate truth by addressing falsehoods and revealing the authentic beauty of each tradition. Through education and compassionate dialogue, we replace ignorance with understanding and fear with appreciation.',
        icon: 'Lightbulb',
        color: '#D4A07B',
        orderIndex: 1,
      },
      {
        title: 'Foster Unity',
        description: 'Discover the universal thread of compassion, mercy, and love woven through all spiritual paths. We celebrate both the unique beauty of each tradition and the shared essence that unites all seekers of truth.',
        icon: 'HeartHandshake',
        color: '#C8A75E',
        orderIndex: 2,
      },
      {
        title: 'Share Sufi Wisdom',
        description: 'Share the timeless wisdom of Sufism, the path of divine love that embraces all of humanity. Sufi teachings remind us that all rivers of faith flow toward the same infinite ocean of Divine Truth.',
        icon: 'Flame',
        color: '#D4A07B',
        orderIndex: 3,
      },
      {
        title: 'Build Global Peace',
        description: 'Build bridges of understanding that span cultures, languages, and traditions worldwide. We envision a world where diversity is celebrated as a reflection of divine creativity and unity.',
        icon: 'Globe',
        color: '#27AE60',
        orderIndex: 4,
      },
      {
        title: 'Preserve Sacred Knowledge',
        description: 'Preserve and share the profound wisdom that guides seekers toward truth and enlightenment. We honor the sacred texts, teachings, and practices of all traditions as pathways to the Divine.',
        icon: 'BookOpen',
        color: '#9B59B6',
        orderIndex: 5,
      },
    ]
    return await prisma.$transaction(
      pillars.map(p => prisma.corePillar.create({ data: p }))
    )
  })

  // ── Mission Content ────────────────────────────────────
  console.log('\n--- Mission Content ---')

  const missionSections = [
    {
      sectionKey: 'header',
      title: 'Our Mission for Interfaith Harmony',
      content: 'Rooted in the timeless wisdom of Sufism, we dedicate ourselves to building bridges of understanding, eliminating hatred, and revealing the divine unity that connects all hearts.',
    },
    {
      sectionKey: 'sufi_path',
      title: 'The Sufi Path to Interfaith Harmony',
      content: `Sufism teaches that the Divine is infinite and cannot be contained by any single form or expression. Just as the sun's light illuminates countless windows, each with its own unique color and character, the Divine Light manifests through diverse spiritual traditions, each offering a unique window into the infinite.

At the heart of Sufism is the principle of Divine Love - a love that sees beyond superficial differences to recognize the sacred essence in every being. This love does not tolerate hatred, because when one truly sees with the eye of the heart, one recognizes that harming another is harming oneself.

We carry forward this Sufi wisdom as a torch to light the path toward interfaith understanding. By purifying our hearts of prejudice, seeking knowledge over ignorance, and choosing compassion over judgment, we become living bridges between communities that might otherwise remain divided.

Our mission is not to erase the beautiful diversity of spiritual traditions, but to reveal the unity that already exists beneath the surface - the unity of hearts seeking truth, peace, and divine connection.`,
    },
  ]

  for (const section of missionSections) {
    await prisma.missionContent.upsert({
      where: { sectionKey: section.sectionKey },
      update: {},
      create: section,
    })
  }
  console.log(`✅ missionContent: ${missionSections.length} sections`)

  // ── Wisdom to Action ───────────────────────────────────
  console.log('\n--- Wisdom to Action ---')

  await seedTable('wisdomToAction', async () => {
    const items = [
      {
        title: 'The Path from Wisdom to Action',
        content: 'Sufi wisdom teaches that spiritual knowledge must be lived, not merely contemplated. True understanding of divine love manifests in service, compassion, and active peacemaking. Our initiatives embody this principle, translating ancient wisdom into modern action.\n\nEach initiative is designed to address a specific barrier to interfaith harmony - whether it\'s lack of personal connection, educational gaps, or absence of collaborative spaces. By creating opportunities for genuine encounter and shared purpose, we help people move beyond abstract tolerance to authentic friendship.\n\nThe impact extends far beyond statistics. When a Christian and a Muslim build a community garden together, when a Hindu and a Jew share their family\'s migration stories, when a Buddhist and a Sufi meditate side by side - these moments transform hearts and ripple outward to transform communities.\n\nPeace is not merely the absence of conflict - it is the active presence of understanding, compassion, and recognition of our shared humanity.',
      },
    ]
    return await prisma.$transaction(
      items.map(item => prisma.wisdomToAction.create({ data: item }))
    )
  })

  // ── Impact Goals ───────────────────────────────────────
  console.log('\n--- Impact Goals ---')

  await seedTable('impactGoal', async () => {
    const goals = [
      { number: '50,000+', label: 'Active Members', orderIndex: 0 },
      { number: '75', label: 'Countries Reached', orderIndex: 1 },
      { number: '1,200+', label: 'Dialogue Events', orderIndex: 2 },
      { number: '500+', label: 'Community Partners', orderIndex: 3 },
    ]
    return await prisma.$transaction(
      goals.map(g => prisma.impactGoal.create({ data: g }))
    )
  })

  // ── Featured Programs ──────────────────────────────────
  console.log('\n--- Featured Programs ---')

  await seedTable('featuredProgram', async () => {
    const programs = [
      {
        title: 'Sacred Text Exploration',
        description: 'Deep-dive workshops exploring sacred texts from multiple traditions side by side, revealing common themes and unique perspectives that enrich our understanding of the Divine.',
        details: { features: ['Comparative scripture study', 'Expert scholar facilitation', 'Small group discussion', 'Personal reflection exercises'], duration: '8 weeks', format: 'Online + In-person' },
        testimonialText: 'This program transformed how I read scripture. I now see the divine thread woven through all holy books.',
        testimonialAuthor: 'Sarah M., Participant',
        orderIndex: 0,
      },
      {
        title: 'Interfaith Youth Leadership',
        description: 'Empowering the next generation of interfaith leaders through mentorship, training, and hands-on peacebuilding projects in their communities.',
        details: { features: ['Leadership training retreats', 'Peace project incubation', 'Global youth network', 'Mentorship pairing'], duration: '12 months', format: 'Hybrid' },
        testimonialText: 'I went from being afraid of other religions to leading interfaith dialogues in my university. This program changed my life.',
        testimonialAuthor: 'Ahmed K., Youth Fellow',
        orderIndex: 1,
      },
      {
        title: 'Community Peace Circles',
        description: 'Local facilitated gatherings where people of different faiths share meals, stories, and meaningful dialogue, building trust one conversation at a time.',
        details: { features: ['Monthly gatherings', 'Shared meals', 'Storytelling circles', 'Collaborative service projects'], duration: 'Ongoing', format: 'In-person local' },
        testimonialText: 'Our peace circle started with 5 people. Now we have 50 regular attendees from 8 different faith traditions.',
        testimonialAuthor: 'Priya R., Circle Facilitator',
        orderIndex: 2,
      },
    ]
    return await prisma.$transaction(
      programs.map(p => prisma.featuredProgram.create({ data: p }))
    )
  })

  // ── Regional Initiatives ───────────────────────────────
  console.log('\n--- Regional Initiatives ---')

  await seedTable('regionalInitiative', async () => {
    const regions = [
      {
        region: 'South Asia',
        initiatives: [
          { name: 'India-Pakistan People-to-People Dialogues', description: 'Cross-border peacebuilding through shared cultural heritage and family connections.', status: 'active' },
          { name: 'Sufi Shrine Restoration Project', description: 'Restoring historic Sufi shrines as symbols of shared spiritual heritage.', status: 'active' },
          { name: 'Interfaith Youth Camps', description: 'Week-long camps bringing together youth from Hindu, Muslim, Sikh, Christian, and Buddhist backgrounds.', status: 'active' },
        ],
        orderIndex: 0,
      },
      {
        region: 'Middle East & North Africa',
        initiatives: [
          { name: 'Abrahamic Family Reunion', description: 'Jewish, Christian, and Muslim leaders collaborating on community peace initiatives.', status: 'active' },
          { name: 'Sacred Geography Tours', description: 'Educational pilgrimages visiting holy sites of all three Abrahamic faiths.', status: 'pending' },
        ],
        orderIndex: 1,
      },
      {
        region: 'Europe',
        initiatives: [
          { name: 'Refugee Welcome Networks', description: 'Faith communities sponsoring and supporting refugee families.', status: 'active' },
          { name: 'Mosque-Synagogue-Church Partnerships', description: 'Tri-faith partnerships for community service and dialogue.', status: 'active' },
        ],
        orderIndex: 2,
      },
      {
        region: 'North America',
        initiatives: [
          { name: 'Interfaith Campus Network', description: 'University-based interfaith groups collaborating on shared projects.', status: 'active' },
          { name: 'Indigenous-Faith Solidarity', description: 'Building bridges between Indigenous spiritual traditions and organized religions.', status: 'active' },
        ],
        orderIndex: 3,
      },
    ]
    return await prisma.$transaction(
      regions.map(r => prisma.regionalInitiative.create({ data: r }))
    )
  })

  // ── Get Involved ───────────────────────────────────────
  console.log('\n--- Get Involved ---')

  await seedTable('getInvolved', async () => {
    const items = [
      {
        title: 'Join Our Community',
        description: 'Become a member of our global interfaith network. Connect with like-minded individuals, participate in events, and contribute to peacebuilding efforts in your region.',
        orderIndex: 0,
      },
      {
        title: 'Volunteer Your Time',
        description: 'Share your skills and passion by volunteering with our programs. From event coordination to content creation, there are many ways to make a difference.',
        orderIndex: 1,
      },
      {
        title: 'Start a Local Circle',
        description: 'Launch an interfaith peace circle in your community. We provide training, resources, and ongoing support to help you build bridges locally.',
        orderIndex: 2,
      },
    ]
    return await prisma.$transaction(
      items.map((item, i) => prisma.getInvolved.create({ data: { ...item, orderIndex: i } }))
    )
  })

  // ── Peace Initiatives ────────────────────────────────────
  console.log('\n--- Peace Initiatives ---')

  await seedTable('peaceInitiative', async () => {
    const initiatives = [
      {
        title: 'Sacred Text Dialogue Circles',
        description: 'Small facilitated groups that read and discuss sacred texts from different traditions side by side, discovering common themes and shared wisdom.',
        impact: 'Participants report 70% increase in understanding of other faiths and lasting cross-faith friendships.',
        status: 'active',
      },
      {
        title: 'Youth Peace Ambassador Program',
        description: 'Training young leaders from diverse faith backgrounds to facilitate interfaith dialogue and lead peace projects in their communities.',
        impact: '500+ youth trained across 15 countries, with alumni launching 40+ community peace initiatives.',
        status: 'active',
      },
      {
        title: 'Community Service Alliance',
        description: 'Faith communities partnering on local service projects — food drives, shelter support, environmental cleanup — building trust through shared action.',
        impact: '200+ interfaith service events completed, serving 50,000+ community members.',
        status: 'active',
      },
      {
        title: 'Interfaith Family Reunions',
        description: 'Multi-day gatherings where families from different faiths share meals, stories, traditions, and build deep personal connections across religious lines.',
        impact: '80% of participants maintain connections with new friends from other faiths after 6 months.',
        status: 'active',
      },
      {
        title: 'Sacred Site Exchange Program',
        description: 'Guided visits to mosques, churches, temples, synagogues, and gurdwaras with hosted conversations led by community members of each tradition.',
        impact: '10,000+ participants have visited sacred sites of other faiths for the first time.',
        status: 'active',
      },
      {
        title: 'Global Peace Summit',
        description: 'Annual virtual and in-person gathering of interfaith leaders, activists, and scholars to share best practices and coordinate global peace efforts.',
        impact: 'Last summit drew 3,000+ attendees from 60 countries.',
        status: 'planned',
      },
    ]
    return await prisma.$transaction(
      initiatives.map(p => prisma.peaceInitiative.create({ data: p }))
    )
  })

  // ── Current Initiatives (from current-initiatives.json) ──
  console.log('\n--- Current Initiatives ---')

  await seedTable('currentInitiative', async () => {
    const items = [
      { category: 'Interfaith Dialogue', title: 'Global Dialogue Series', description: 'Monthly virtual gatherings bringing together faith leaders, scholars, and practitioners from around the world to discuss pressing global issues through an interfaith lens.', stats: '12,000+ participants across 65 countries', event: 'May 15, 2026 - Climate Justice & Sacred Stewardship', iconColor: 'gold', orderIndex: 0 },
      { category: 'Grassroots Peacebuilding', title: 'Community Peace Circles', description: 'Facilitated small-group dialogues in local communities where neighbors of different faiths share stories, build relationships, and collaborate on community projects.', stats: '450+ active circles in 28 countries', event: 'Weekly circles ongoing - Find one near you', iconColor: 'green', orderIndex: 1 },
      { category: 'Youth Empowerment', title: 'Interfaith Youth Leadership Program', description: 'Year-long intensive training for young adults (18-30) to become interfaith leaders in their communities, combining theological education, leadership skills, and hands-on peacebuilding.', stats: '200+ graduates serving in 40 countries', event: 'Applications open June 2026 for 2027 cohort', iconColor: 'purple', orderIndex: 2 },
      { category: 'Community Service', title: 'Sacred Service Days', description: 'Quarterly interfaith volunteer events where people of all faiths work together on community projects - from feeding the hungry to environmental restoration.', stats: '25,000+ volunteers, 150+ projects completed', event: 'June 21, 2026 - Summer Solstice Service Day', iconColor: 'orange', orderIndex: 3 },
    ]
    return await prisma.$transaction(
      items.map(item => prisma.currentInitiative.create({ data: item }))
    )
  })

  // ── Shareable Quotes ───────────────────────────────────
  console.log('\n--- Shareable Quotes ---')

  await seedTable('shareableQuote', async () => {
    const quotes = [
      { quoteText: 'Peace is not merely the absence of conflict; it is the active presence of understanding, compassion, and recognition of our shared humanity.', backgroundStyle: 'gradient-1', shareCount: 0, status: 'published' },
      { quoteText: 'The lamps are different, but the Light is the same. — Rumi', backgroundStyle: 'gradient-2', shareCount: 0, status: 'published' },
      { quoteText: 'In the garden of humanity, every flower is a different color. It is the variety that makes the garden beautiful.', backgroundStyle: 'gradient-3', shareCount: 0, status: 'published' },
      { quoteText: 'Love is the bridge between you and everything. — Rumi', backgroundStyle: 'gradient-4', shareCount: 0, status: 'published' },
      { quoteText: 'When we approach other traditions with curiosity rather than judgment, we discover profound beauty and wisdom that unites rather than divides.', backgroundStyle: 'gradient-5', shareCount: 0, status: 'published' },
      { quoteText: 'The journey toward peace begins within our own hearts. When we cultivate love and compassion internally, we naturally extend these qualities to others.', backgroundStyle: 'gradient-6', shareCount: 0, status: 'published' },
    ]
    return await prisma.$transaction(
      quotes.map(q => prisma.shareableQuote.create({ data: q }))
    )
  })

  // ── Assessment Questions ───────────────────────────────
  console.log('\n--- Assessment Questions ---')

  await seedTable('assessmentQuestion', async () => {
    const questions = [
      { questionText: 'I believe that all religious traditions contain valid paths to spiritual truth.', category: 'tolerance', orderIndex: 0 },
      { questionText: 'I feel comfortable attending religious ceremonies of traditions other than my own.', category: 'peace', orderIndex: 1 },
      { questionText: 'When I hear about conflict in the name of religion, I feel motivated to promote understanding.', category: 'compassion', orderIndex: 2 },
      { questionText: 'I actively seek opportunities to learn about faiths different from my own.', category: 'understanding', orderIndex: 3 },
      { questionText: 'I believe that interfaith dialogue can lead to meaningful solutions for global problems.', category: 'peace', orderIndex: 4 },
      { questionText: 'It is possible to respect someone else\'s faith while holding my own beliefs confidently.', category: 'tolerance', orderIndex: 5 },
      { questionText: 'I feel sadness when I see people being judged or excluded because of their religion.', category: 'compassion', orderIndex: 6 },
      { questionText: 'I can name at least three core teachings from a religious tradition other than my own.', category: 'understanding', orderIndex: 7 },
      { questionText: 'I believe that people of different faiths can live together peacefully in the same community.', category: 'peace', orderIndex: 8 },
      { questionText: 'I would encourage a friend to explore their own spiritual path, even if different from mine.', category: 'tolerance', orderIndex: 9 },
      { questionText: 'I feel a sense of connection with people of other faiths who are working for peace and justice.', category: 'compassion', orderIndex: 10 },
      { questionText: 'I understand the basic beliefs and practices of at least two other religious traditions.', category: 'understanding', orderIndex: 11 },
      { questionText: 'I sometimes feel that people from other religions do not share the same moral values as I do.', category: 'hatred', orderIndex: 12 },
      { questionText: 'When I hear a different faith\'s perspective, I try to understand it before judging it.', category: 'tolerance', orderIndex: 13 },
      { questionText: 'I believe that shared spiritual practices (meditation, prayer, service) can unite people across faiths.', category: 'compassion', orderIndex: 14 },
      { questionText: 'I have read sacred texts or teachings from at least one tradition other than my own.', category: 'understanding', orderIndex: 15 },
      { questionText: 'I believe that peace between religions is achievable in my lifetime.', category: 'peace', orderIndex: 16 },
      { questionText: 'I am open to having my own beliefs challenged or expanded through interfaith encounter.', category: 'tolerance', orderIndex: 17 },
      { questionText: 'I feel inspired when I see people from different faiths working together for common good.', category: 'compassion', orderIndex: 18 },
      { questionText: 'I can explain at least one way that different religions approach the concept of divine love.', category: 'understanding', orderIndex: 19 },
    ]
    return await prisma.$transaction(
      questions.map(q => prisma.assessmentQuestion.create({ data: q }))
    )
  })

  // ── About Content ──────────────────────────────────────
  console.log('\n--- About Content ---')

  const aboutSections = [
    {
      sectionKey: 'story',
      title: 'Our Story',
      content: `Founded in 2025, Interfaith Peace Bridge emerged from a simple yet profound vision: to create a world where religious differences become opportunities for dialogue rather than division.

Inspired by the universal teachings of Sufi masters who saw all religions as paths to the same divine truth, we began as a small group of seekers from diverse faith backgrounds meeting in community centers and homes.

Today, we've grown into a global network of over 50,000 members across 40 countries, united in our commitment to peace, understanding, and the recognition of our shared humanity.`,
      orderIndex: 0,
    },
    {
      sectionKey: 'vision',
      title: 'Our Vision',
      content: 'A world where every human being recognizes the divine spark in every other, transcending the boundaries of religion, culture, and nationality to embrace our fundamental interconnectedness.',
      orderIndex: 1,
    },
    {
      sectionKey: 'values',
      title: 'Our Core Values',
      content: 'Universal Love - We believe that love is the essence of all spiritual traditions and the foundation for lasting peace.\n\nInclusivity - Every faith, every tradition, every seeker is welcomed and honored in our community.\n\nSacred Wisdom - We draw from the deep wells of Sufi teachings while honoring the truth in all spiritual paths.\n\nCommunity - Together we are stronger. We build meaningful connections that transcend superficial differences.\n\nTransformation - We commit to inner growth and outer action, becoming agents of positive change in our world.\n\nAuthenticity - We practice what we teach, grounding our mission in genuine spiritual experience and integrity.',
      orderIndex: 2,
    },
  ]

  for (const section of aboutSections) {
    await prisma.aboutContent.upsert({
      where: { sectionKey: section.sectionKey },
      update: {},
      create: section,
    })
  }
  console.log(`✅ aboutContent: ${aboutSections.length} sections`)

  // ── About Values ──────────────────────────────────────
  console.log('\n--- About Values ---')

  const aboutValues = [
    { title: 'Universal Love', description: 'We believe that love is the essence of all spiritual traditions and the foundation for lasting peace.', icon: 'Heart', color: '#E07070', orderIndex: 0 },
    { title: 'Inclusivity', description: 'Every faith, every tradition, every seeker is welcomed and honored in our community.', icon: 'Globe', color: '#C8A75E', orderIndex: 1 },
    { title: 'Sacred Wisdom', description: 'We draw from the deep wells of Sufi teachings while honoring the truth in all spiritual paths.', icon: 'BookHeart', color: '#D4A07B', orderIndex: 2 },
    { title: 'Community', description: 'Together we are stronger. We build meaningful connections that transcend superficial differences.', icon: 'Users', color: '#27AE60', orderIndex: 3 },
    { title: 'Transformation', description: 'We commit to inner growth and outer action, becoming agents of positive change in our world.', icon: 'Sparkles', color: '#9B59B6', orderIndex: 4 },
    { title: 'Authenticity', description: 'We practice what we teach, grounding our mission in genuine spiritual experience and integrity.', icon: 'Target', color: '#14B8A6', orderIndex: 5 },
  ]

  await seedTable('aboutValue', async () => {
    await prisma.aboutValue.createMany({ data: aboutValues })
    return aboutValues
  })

  // ── About Leaders ─────────────────────────────────────
  console.log('\n--- About Leaders ---')

  const aboutLeaders = [
    { name: 'Dr. Amina Hassan', role: 'Founder & Spiritual Director', description: 'Sufi scholar and interfaith dialogue facilitator with 25 years of experience bridging religious communities.', orderIndex: 0 },
    { name: 'Rabbi David Cohen', role: 'Director of Interfaith Programs', description: 'Dedicated to Jewish-Muslim dialogue and building coalitions for peace across Abrahamic traditions.', orderIndex: 1 },
    { name: 'Rev. Maria Santos', role: 'Community Engagement Lead', description: 'Christian mystic and community organizer passionate about grassroots interfaith movements.', orderIndex: 2 },
  ]

  await seedTable('aboutLeader', async () => {
    await prisma.aboutLeader.createMany({ data: aboutLeaders })
    return aboutLeaders
  })

  // ── Teaching Sections ──────────────────────────────────
  console.log('\n--- Teaching Sections ---')

  const teachingSections = [
    {
      sectionKey: 'universal_message',
      title: 'The Universal Message',
      content: `Throughout history, enlightened teachers from every tradition have shared a common message: that love conquers hatred, compassion heals division, and unity underlies all apparent diversity.

These teachings remind us that the path to peace begins within our own hearts. When we cultivate love, understanding, and compassion internally, we naturally extend these qualities to others, regardless of their faith, culture, or background.

May these sacred teachings inspire your journey toward a heart filled with divine love and a life dedicated to peace.`,
    },
  ]

  for (const section of teachingSections) {
    await prisma.teachingSection.upsert({
      where: { sectionKey: section.sectionKey },
      update: {},
      create: section,
    })
  }
  console.log(`✅ teachingSection: ${teachingSections.length} sections`)

  // ── Truth Sections ─────────────────────────────────────
  console.log('\n--- Truth Sections ---')

  const truthSections = [
    {
      sectionKey: 'dispelling_misconceptions',
      title: 'Why Dispelling Misconceptions Matters',
      content: `Misconceptions are seeds of division. When we believe false narratives about other faiths, we create barriers that prevent genuine connection and understanding. These falsehoods often stem from ignorance, fear, or deliberate distortion rather than authentic knowledge.

The Sufi path teaches us to seek knowledge with humility and an open heart. When we approach other traditions with curiosity rather than judgment, we discover profound beauty, wisdom, and shared values that unite rather than divide.

By illuminating truth, we don't just correct errors — we create space for authentic dialogue, mutual respect, and the recognition of our common humanity. This is how we transform hatred into understanding and fear into love.

"The truth will set you free" — not just as a religious ideal, but as a practical path toward peace and interfaith harmony.`,
    },
  ]

  for (const section of truthSections) {
    await prisma.truthSection.upsert({
      where: { sectionKey: section.sectionKey },
      update: {},
      create: section,
    })
  }
  console.log(`✅ truthSection: ${truthSections.length} sections`)

  // ── Tradition Sections ─────────────────────────────────
  console.log('\n--- Tradition Sections ---')

  const traditionSections = [
    {
      sectionKey: 'unity_in_diversity',
      title: 'Unity in Diversity',
      content: `The Sufi masters teach us a profound truth: the Divine is infinite and manifests in countless forms. Just as white light passing through a prism creates a rainbow of colors, the One Truth expresses itself through the beautiful diversity of world religions.

This diversity is not a problem to solve but a gift to celebrate. Each tradition offers unique insights, practices, and perspectives that enrich our collective understanding of the sacred. When we honor these differences with respect and curiosity, we discover that beneath surface variations lies a deep unity.

All authentic spiritual paths share core values: compassion, justice, truth, love, and service to others. They may express these values through different languages, rituals, and stories, but the essence remains the same — the call to transcend ego, serve others, and connect with the Divine.

"The lamps are different, but the Light is the same." — Rumi`,
    },
  ]

  for (const section of traditionSections) {
    await prisma.traditionSection.upsert({
      where: { sectionKey: section.sectionKey },
      update: {},
      create: section,
    })
  }
  console.log(`✅ traditionSection: ${traditionSections.length} sections`)

  // ── Sufi Content ──────────────────────────────────────
  console.log('\n--- Sufi Content ---')

  const sufiSections = [
    {
      sectionKey: 'what_is_sufism',
      title: 'What is Sufism?',
      content: `Sufism, known as Tasawwuf in Arabic, is the inner, mystical dimension of Islam. It is the path of purifying the heart, transcending the ego, and experiencing direct communion with the Divine.

While rooted in Islamic tradition, Sufi wisdom speaks to universal truths found in all spiritual paths: the primacy of love, the unity of all existence, and the journey from separation to union with the Beloved.

Sufi masters have taught that all religions are rays of the same sun, different languages expressing the same divine truth. This makes Sufism a natural bridge for interfaith understanding and dialogue.`,
      orderIndex: 0,
    },
    {
      sectionKey: 'core_principles',
      title: 'Core Principles',
      content: `Ishq (Divine Love) — The path of divine love transforms the seeker from separation to union. Love is not just an emotion but the very fabric of existence and the ultimate path to the Divine.

Marifah (Gnosis) — Direct experiential knowledge of God that transcends intellectual understanding. Through spiritual practice and divine grace, the heart comes to know what the mind cannot grasp.

Fana (Annihilation) — The dissolution of the ego and the experience of unity with the Divine Beloved. In this state, the seeker's individual self is consumed by the ocean of divine consciousness.

Baqa (Subsistence) — Eternal existence in God after the annihilation of the false self. Having died to ego, the soul lives permanently in awareness of divine unity.`,
      orderIndex: 1,
    },
    {
      sectionKey: 'sufi_path',
      title: 'The Sufi Path',
      content: `The journey of the soul from separation to union follows three sacred stages: Shariah establishes ethical conduct and ritual practice as the foundation. Tariqah engages spiritual practices, purifying the heart and cultivating divine attributes. Haqiqah unveils direct experience of divine reality and ultimate truth.

Shariah (The Law) — The foundation: living according to divine guidance, establishing ethical conduct and ritual practice.

Tariqah (The Way) — The journey: engaging in spiritual practices, purifying the heart, and cultivating divine attributes.

Haqiqah (The Truth) — The realization: direct experience of divine reality and the unveiling of ultimate truth.`,
      orderIndex: 2,
    },
    {
      sectionKey: 'key_practices',
      title: 'Key Practices',
      content: `Dhikr (Remembrance) — The repetition of divine names and sacred phrases to maintain constant awareness of God's presence. Through rhythmic breathing and vocalization, dhikr purifies the heart and brings the seeker into the present moment.

Muraqaba (Meditation) — Contemplative practice involving deep introspection, visualization, and spiritual observation. The seeker watches the movements of the heart while remaining in the presence of the Divine.

Sama (Sacred Music) — Spiritual listening and devotional music that induces ecstatic states and opens the heart to divine love. The whirling dance of the Mevlevi order is perhaps the most famous example.

Sohbet (Spiritual Discourse) — Heart-to-heart conversations with a spiritual teacher or fellow seekers. Through storytelling, poetry, and dialogue, wisdom is transmitted from heart to heart.`,
      orderIndex: 3,
    },
    {
      sectionKey: 'great_masters',
      title: 'Great Sufi Masters',
      content: `Jalal ad-Din Muhammad Rumi (1207-1273 CE) — Persian poet and mystic whose works transcend cultural and religious boundaries, inspiring millions worldwide. His timeless quote: "Let yourself be silently drawn by the strange pull of what you really love. It will not lead you astray."

Muhyiddin Ibn Arabi (1165-1240 CE) — Andalusian philosopher and mystic who articulated the doctrine of the Unity of Being (Wahdat al-Wujud). His timeless quote: "My heart has become capable of every form: it is a pasture for gazelles and a convent for Christian monks."

Rabia al-Adawiyya (717-801 CE) — One of the first Sufi saints and the first to articulate the principle of divine love without expectation of reward. Her timeless prayer: "O God! If I worship You for fear of Hell, burn me in Hell. If I worship You in hope of Paradise, exclude me from Paradise. But if I worship You for Your Own sake, grudge me not Your everlasting Beauty."`,
      orderIndex: 4,
    },
    {
      sectionKey: 'closing_quote',
      title: 'Closing Quote',
      content: `You are not a drop in the ocean. You are the entire ocean in a drop. — Rumi

Begin your journey into the timeless wisdom of Sufism, where divine love illuminates the path to unity and peace.`,
      orderIndex: 5,
    },
  ]

  for (const section of sufiSections) {
    await prisma.sufiContent.upsert({
      where: { sectionKey: section.sectionKey },
      update: {},
      create: section,
    })
  }
  console.log(`✅ sufiContent: ${sufiSections.length} sections`)

  // ── Approach Content ──────────────────────────────────
  console.log('\n--- Approach Content ---')

  const approachSections = [
    {
      sectionKey: 'four_pillars',
      title: 'Four Pillars of Our Work',
      content: `Education & Learning — We believe understanding comes before unity. Our educational programs demystify religious traditions, correct misconceptions, and highlight shared values across faiths. Features: Interfaith study circles, Sacred text exploration workshops, Online courses on world religions, Scholar-led seminars and webinars.

Dialogue & Exchange — Creating safe, sacred spaces where people of different faiths can speak from the heart, listen deeply, and discover our common humanity. Features: Facilitated interfaith dialogues, Community conversation circles, Virtual global gatherings, One-on-one faith pairing programs.

Service & Action — Faith without action is incomplete. We unite diverse communities through collaborative service projects that address real needs. Features: Interfaith volunteer initiatives, Community development projects, Disaster relief partnerships, Social justice advocacy.

Spiritual Practice — Shared contemplative practices create heart connections that transcend intellectual understanding and theological differences. Features: Interfaith meditation gatherings, Peace prayer ceremonies, Sufi-inspired spiritual retreats, Contemplative practice workshops.`,
      orderIndex: 0,
    },
    {
      sectionKey: 'philosophy',
      title: 'Our Philosophy',
      content: `We don't seek to create a new religion or minimize differences. Instead, we honor the unique beauty of each tradition while recognizing that all authentic spiritual paths lead to the same Source. Unity in diversity, not uniformity.`,
      orderIndex: 1,
    },
    {
      sectionKey: 'methodology',
      title: 'Our Methodology in Action',
      content: `Connect — Bring people together in welcoming, inclusive spaces.

Learn — Share knowledge about different faith traditions authentically.

Relate — Find common ground through shared values and experiences.

Serve — Work together on meaningful projects that benefit communities.

Transform — Become ambassadors of peace in your own circles.`,
      orderIndex: 2,
    },
    {
      sectionKey: 'core_principles',
      title: 'Core Principles',
      content: `Mutual Respect — We honor each tradition's integrity, authenticity, and sacred teachings. No faith is superior or inferior; each is a valid path to the Divine.

Deep Listening — We create spaces for genuine dialogue where people feel truly heard. Understanding precedes agreement, and connection transcends conversion.

Heart-Centered Approach — We engage from the heart, not just the head. Spiritual connection and lived experience complement intellectual understanding.

Collaborative Spirit — We work with, not for, communities. Local leaders and participants co-create programs that reflect their unique contexts and needs.

Action-Oriented — Dialogue without action is incomplete. We translate understanding into concrete initiatives that create positive change.

Global-Local Balance — We maintain a global vision while honoring local contexts, cultures, and specific interfaith dynamics in each community.`,
      orderIndex: 3,
    },
    {
      sectionKey: 'what_makes_us_different',
      title: 'What Makes Us Different?',
      content: `Rooted in Tradition, Open to All — While grounded in Sufi wisdom, we welcome people of all faiths and none. Our Sufi foundation provides spiritual depth without exclusivity.

Experience Over Theory — We emphasize lived experience and personal transformation, not just academic knowledge or theological debate.

Sustainable Relationships — We're not interested in one-time events. We build long-term relationships and communities that continue growing together.

Grassroots Empowerment — We train local leaders to facilitate interfaith work in their own communities, creating a multiplier effect.`,
      orderIndex: 4,
    },
    {
      sectionKey: 'success_metrics',
      title: 'Success Metrics',
      content: `We measure our impact through: Number of lasting friendships formed across faith lines. Community projects completed collaboratively. Participants reporting reduced prejudice and increased understanding. New interfaith initiatives launched by trained leaders. Stories of personal transformation and spiritual growth.`,
      orderIndex: 5,
    },
  ]

  for (const section of approachSections) {
    await prisma.approachContent.upsert({
      where: { sectionKey: section.sectionKey },
      update: {},
      create: section,
    })
  }
  console.log(`✅ approachContent: ${approachSections.length} sections`)

  // ── Sufi Cards ────────────────────────────────────────────
  console.log('\n--- Sufi Cards ---')

  await seedTable('sufiCard', async () => {
    const cards = [
      // Principles
      { sectionType: 'principle', title: 'Ishq (Divine Love)', description: 'Love is not just an emotion but the very fabric of existence and the ultimate path to the Divine.', icon: 'Heart', color: '#E07070', orderIndex: 0 },
      { sectionType: 'principle', title: 'Marifah (Gnosis)', description: 'Direct experiential knowledge of God that transcends intellectual understanding.', icon: 'Eye', color: '#C8A75E', orderIndex: 1 },
      { sectionType: 'principle', title: 'Fana (Annihilation)', description: 'The dissolution of the ego and the experience of unity with the Divine Beloved.', icon: 'Flame', color: '#D4A07B', orderIndex: 2 },
      { sectionType: 'principle', title: 'Baqa (Subsistence)', description: 'Eternal existence in God after the annihilation of the false self.', icon: 'Sun', color: '#F59E0B', orderIndex: 3 },
      // Stages
      { sectionType: 'stage', title: 'Shariah (The Law)', description: 'The foundation: living according to divine guidance, establishing ethical conduct and ritual practice.', icon: 'Moon', color: '#C8A75E', orderIndex: 0 },
      { sectionType: 'stage', title: 'Tariqah (The Way)', description: 'The journey: engaging in spiritual practices, purifying the heart, and cultivating divine attributes.', icon: 'Wind', color: '#9B59B6', orderIndex: 1 },
      { sectionType: 'stage', title: 'Haqiqah (The Truth)', description: 'The realization: direct experience of divine reality and the unveiling of ultimate truth.', icon: 'Sun', color: '#D4A07B', orderIndex: 2 },
      // Practices
      { sectionType: 'practice', title: 'Dhikr (Remembrance)', description: 'The repetition of divine names and sacred phrases to maintain constant awareness of God\'s presence.', icon: 'Sparkles', color: '#C8A75E', orderIndex: 0 },
      { sectionType: 'practice', title: 'Muraqaba (Meditation)', description: 'Contemplative practice involving deep introspection, visualization, and spiritual observation.', icon: 'Eye', color: '#9B59B6', orderIndex: 1 },
      { sectionType: 'practice', title: 'Sama (Sacred Music)', description: 'Spiritual listening and devotional music that induces ecstatic states and opens the heart to divine love.', icon: 'Wind', color: '#D4A07B', orderIndex: 2 },
      { sectionType: 'practice', title: 'Sohbet (Spiritual Discourse)', description: 'Heart-to-heart conversations with a spiritual teacher or fellow seekers.', icon: 'Heart', color: '#E07070', orderIndex: 3 },
      // Masters
      { sectionType: 'master', title: 'Rumi', subtitle: '1207-1273 CE', description: 'Persian poet and mystic whose works transcend cultural and religious boundaries, inspiring millions worldwide.', quote: 'Let yourself be silently drawn by the strange pull of what you really love. It will not lead you astray.', icon: 'Heart', color: '#C8A75E', orderIndex: 0 },
      { sectionType: 'master', title: 'Ibn Arabi', subtitle: '1165-1240 CE', description: 'Andalusian philosopher and mystic who articulated the doctrine of the Unity of Being (Wahdat al-Wujud).', quote: 'My heart has become capable of every form: it is a pasture for gazelles and a convent for Christian monks.', icon: 'Eye', color: '#9B59B6', orderIndex: 1 },
      { sectionType: 'master', title: 'Rabia al-Adawiyya', subtitle: '717-801 CE', description: 'One of the first Sufi saints and the first to articulate the principle of divine love without expectation of reward.', quote: 'O God! If I worship You for fear of Hell, burn me in Hell. If I worship You in hope of Paradise, exclude me from Paradise. But if I worship You for Your Own sake, grudge me not Your everlasting Beauty.', icon: 'Sparkles', color: '#D4A07B', orderIndex: 2 },
    ]
    await prisma.sufiCard.createMany({ data: cards })
    return cards
  })

  // ── Approach Cards ─────────────────────────────────────────
  console.log('\n--- Approach Cards ---')

  await seedTable('approachCard', async () => {
    const cards = [
      // Pillars
      { sectionType: 'pillar', title: 'Education & Learning', description: 'We believe understanding comes before unity. Our educational programs demystify religious traditions, correct misconceptions, and highlight shared values across faiths.', features: ['Interfaith study circles', 'Sacred text exploration workshops', 'Online courses on world religions', 'Scholar-led seminars and webinars'], icon: 'BookOpen', color: '#C8A75E', orderIndex: 0 },
      { sectionType: 'pillar', title: 'Dialogue & Exchange', description: 'Creating safe, sacred spaces where people of different faiths can speak from the heart, listen deeply, and discover our common humanity.', features: ['Facilitated interfaith dialogues', 'Community conversation circles', 'Virtual global gatherings', 'One-on-one faith pairing programs'], icon: 'MessageCircle', color: '#9B59B6', orderIndex: 1 },
      { sectionType: 'pillar', title: 'Service & Action', description: 'Faith without action is incomplete. We unite diverse communities through collaborative service projects that address real needs.', features: ['Interfaith volunteer initiatives', 'Community development projects', 'Disaster relief partnerships', 'Social justice advocacy'], icon: 'HandHeart', color: '#E07070', orderIndex: 2 },
      { sectionType: 'pillar', title: 'Spiritual Practice', description: 'Shared contemplative practices create heart connections that transcend intellectual understanding and theological differences.', features: ['Interfaith meditation gatherings', 'Peace prayer ceremonies', 'Sufi-inspired spiritual retreats', 'Contemplative practice workshops'], icon: 'Heart', color: '#D4A07B', orderIndex: 3 },
      // Steps
      { sectionType: 'step', title: 'Connect', description: 'Bring people together in welcoming, inclusive spaces', color: '#C8A75E', orderIndex: 0 },
      { sectionType: 'step', title: 'Learn', description: 'Share knowledge about different faith traditions authentically', color: '#9B59B6', orderIndex: 1 },
      { sectionType: 'step', title: 'Relate', description: 'Find common ground through shared values and experiences', color: '#14B8A6', orderIndex: 2 },
      { sectionType: 'step', title: 'Serve', description: 'Work together on meaningful projects that benefit communities', color: '#D4A07B', orderIndex: 3 },
      { sectionType: 'step', title: 'Transform', description: 'Become ambassadors of peace in your own circles', color: '#E07070', orderIndex: 4 },
      // Approach Principles
      { sectionType: 'principle', title: 'Mutual Respect', description: 'We honor each tradition\'s integrity, authenticity, and sacred teachings. No faith is superior or inferior; each is a valid path to the Divine.', icon: 'Users', color: '#C8A75E', orderIndex: 0 },
      { sectionType: 'principle', title: 'Deep Listening', description: 'We create spaces for genuine dialogue where people feel truly heard. Understanding precedes agreement, and connection transcends conversion.', icon: 'MessageCircle', color: '#D4A07B', orderIndex: 1 },
      { sectionType: 'principle', title: 'Heart-Centered Approach', description: 'We engage from the heart, not just the head. Spiritual connection and lived experience complement intellectual understanding.', icon: 'Heart', color: '#E07070', orderIndex: 2 },
      { sectionType: 'principle', title: 'Collaborative Spirit', description: 'We work with, not for, communities. Local leaders and participants co-create programs that reflect their unique contexts and needs.', icon: 'HandHeart', color: '#C8A75E', orderIndex: 3 },
      { sectionType: 'principle', title: 'Action-Oriented', description: 'Dialogue without action is incomplete. We translate understanding into concrete initiatives that create positive change.', icon: 'Target', color: '#9B59B6', orderIndex: 4 },
      { sectionType: 'principle', title: 'Global-Local Balance', description: 'We maintain a global vision while honoring local contexts, cultures, and specific interfaith dynamics in each community.', icon: 'Globe', color: '#14B8A6', orderIndex: 5 },
      // Differentiators
      { sectionType: 'differentiator', title: 'Rooted in Tradition, Open to All', description: 'While grounded in Sufi wisdom, we welcome people of all faiths and none. Our Sufi foundation provides spiritual depth without exclusivity.', orderIndex: 0 },
      { sectionType: 'differentiator', title: 'Experience Over Theory', description: 'We emphasize lived experience and personal transformation, not just academic knowledge or theological debate.', orderIndex: 1 },
      { sectionType: 'differentiator', title: 'Sustainable Relationships', description: 'We\'re not interested in one-time events. We build long-term relationships and communities that continue growing together.', orderIndex: 2 },
      { sectionType: 'differentiator', title: 'Grassroots Empowerment', description: 'We train local leaders to facilitate interfaith work in their own communities, creating a multiplier effect.', orderIndex: 3 },
    ]
    await prisma.approachCard.createMany({ data: cards })
    return cards
  })

  console.log('\n--- Similarity Themes ---')

  await seedTable('similarityTheme', async () => {
    const themes = [
      { title: 'The Golden Rule', description: 'Nearly every faith tradition teaches some form of the Golden Rule: treat others as you would wish to be treated. This universal ethic forms the foundation of compassionate living.', icon: 'Heart', color: '#D4A07B', slug: 'golden-rule', orderIndex: 1 },
      { title: 'Compassion & Mercy', description: 'Compassion for all beings and mercy toward those who struggle are central values across world religions, calling us to respond to suffering with kindness.', icon: 'HeartHandshake', color: '#E07070', slug: 'compassion-mercy', orderIndex: 2 },
      { title: 'Prayer & Meditation', description: 'All major faiths practice forms of prayer, meditation, or contemplation to connect with the Divine, cultivate inner peace, and align with sacred purpose.', icon: 'Sparkles', color: '#9B59B6', slug: 'prayer-meditation', orderIndex: 3 },
      { title: 'Charity & Service', description: 'Serving others and giving to those in need are universal religious obligations, reflecting our interconnection and shared humanity.', icon: 'HandHeart', color: '#27AE60', slug: 'charity-service', orderIndex: 4 },
      { title: 'Love & Unity', description: 'Love as the highest spiritual principle and recognition of fundamental human unity transcend religious boundaries.', icon: 'Users', color: '#C8A75E', slug: 'love-unity', orderIndex: 5 },
      { title: 'Justice & Righteousness', description: 'Standing for justice, defending the oppressed, and living righteously are commanded across traditions.', icon: 'Scale', color: '#5B7FDB', slug: 'justice-righteousness', orderIndex: 6 },
      { title: 'Humility & Wisdom', description: 'Cultivating humility before the Divine and seeking wisdom over mere knowledge are universal spiritual values.', icon: 'BookOpen', color: '#D4A07B', slug: 'humility-wisdom', orderIndex: 7 },
      { title: 'Sacred Hospitality', description: 'Welcoming strangers and showing generous hospitality reflect divine grace and human dignity in many traditions.', icon: 'Home', color: '#10B981', slug: 'sacred-hospitality', orderIndex: 8 },
    ]
    await prisma.similarityTheme.createMany({ data: themes })
    return themes
  })

  console.log('\n--- Similarity Teachings ---')

  const existingTeachingCount = await prisma.similarityTeaching.count()
  if (existingTeachingCount === 0) {
    const traditionMap = new Map<string, string>()
    const traditions = await prisma.tradition.findMany({ select: { id: true, name: true } })
    for (const t of traditions) traditionMap.set(t.name, t.id)

    const themeMap = new Map<string, string>()
    const themes = await prisma.similarityTheme.findMany({ select: { id: true, slug: true } })
    for (const t of themes) themeMap.set(t.slug, t.id)

    const teachingData: { themeSlug: string; traditionName: string; teaching: string; source: string; context: string }[] = [
      // Golden Rule
      { themeSlug: 'golden-rule', traditionName: 'Christianity', teaching: 'Do to others as you would have them do to you.', source: 'Luke 6:31 (Bible)', context: 'Jesus teaches this as the essence of the Law and the Prophets, summarizing ethical living in one principle.' },
      { themeSlug: 'golden-rule', traditionName: 'Islam', teaching: 'None of you truly believes until he loves for his brother what he loves for himself.', source: 'Hadith 13, An-Nawawi\'s Forty Hadith', context: 'Prophet Muhammad establishes empathy and concern for others as essential to faith.' },
      { themeSlug: 'golden-rule', traditionName: 'Judaism', teaching: 'What is hateful to you, do not do to your neighbor. This is the whole Torah; the rest is commentary.', source: 'Talmud, Shabbat 31a', context: 'Rabbi Hillel summarizes the entire Jewish law in this negative formulation of reciprocity.' },
      { themeSlug: 'golden-rule', traditionName: 'Hinduism', teaching: 'One should never do something to others that one would regard as an injury to one\'s own self. In brief, this is dharma. Anything else is succumbing to desire.', source: 'Mahabharata 13.114.8', context: 'This teaching connects ethical reciprocity to dharma (righteous duty) and self-mastery.' },
      { themeSlug: 'golden-rule', traditionName: 'Buddhism', teaching: 'Hurt not others in ways that you yourself would find hurtful.', source: 'Udana-Varga 5:18', context: 'Buddha teaches this as part of right conduct, emphasizing the elimination of harm.' },
      { themeSlug: 'golden-rule', traditionName: 'Confucianism', teaching: 'Do not impose on others what you yourself do not desire.', source: 'Analects 15:23', context: 'Confucius identifies reciprocity (shu) as a fundamental principle for harmonious living.' },
      { themeSlug: 'golden-rule', traditionName: 'Sikhism', teaching: 'I am a stranger to no one; and no one is a stranger to me. Indeed, I am a friend to all.', source: 'Guru Granth Sahib, pg. 1299', context: 'Guru Nanak teaches universal kinship, seeing all people as equals deserving respect.' },
      { themeSlug: 'golden-rule', traditionName: 'Jainism', teaching: 'One should treat all beings as one would like to be treated.', source: 'Sutrakritanga 1.11.33', context: 'This principle extends to all living beings, reflecting Jainism\'s profound commitment to ahimsa.' },
      { themeSlug: 'golden-rule', traditionName: 'Taoism', teaching: 'Regard your neighbor\'s gain as your own gain, and your neighbor\'s loss as your own loss.', source: 'T\'ai Shang Kan Ying P\'ien', context: 'Taoist teaching emphasizes empathic identification with others\' fortunes.' },
      { themeSlug: 'golden-rule', traditionName: 'Zoroastrianism', teaching: 'Do not do unto others whatever is injurious to yourself.', source: 'Shayast-na-Shayast 13:29', context: 'This ancient teaching predates many formulations and connects to Zoroastrian ethics of truth and righteousness.' },
      // Compassion & Mercy
      { themeSlug: 'compassion-mercy', traditionName: 'Islam', teaching: 'In the name of Allah, the Most Compassionate, the Most Merciful.', source: 'Opening of every Quranic chapter', context: 'These divine attributes begin every chapter of the Quran, emphasizing that mercy and compassion define God\'s nature.' },
      { themeSlug: 'compassion-mercy', traditionName: 'Buddhism', teaching: 'May all beings be happy. May all beings be free from suffering.', source: 'Metta Sutta (Loving-Kindness Discourse)', context: 'The practice of metta (loving-kindness) extends compassion unconditionally to all sentient beings.' },
      { themeSlug: 'compassion-mercy', traditionName: 'Christianity', teaching: 'Blessed are the merciful, for they will be shown mercy.', source: 'Matthew 5:7 (Bible)', context: 'Jesus teaches that showing mercy to others opens us to receive divine mercy.' },
      { themeSlug: 'compassion-mercy', traditionName: 'Judaism', teaching: 'The Lord is gracious and merciful, slow to anger and abounding in steadfast love.', source: 'Psalm 145:8', context: 'God\'s mercy and compassion are celebrated throughout Jewish scripture and prayer.' },
      { themeSlug: 'compassion-mercy', traditionName: 'Hinduism', teaching: 'Compassion for all living beings is the highest dharma.', source: 'Various Puranas', context: 'Karuna (compassion) and ahimsa (non-violence) are foundational Hindu values.' },
      { themeSlug: 'compassion-mercy', traditionName: 'Jainism', teaching: 'Compassion and right conduct are the foundation of Jain teaching.', source: 'Tattvartha Sutra', context: 'Jainism\'s radical commitment to non-violence flows from profound compassion for all life.' },
      { themeSlug: 'compassion-mercy', traditionName: 'Sikhism', teaching: 'Be merciful, so that you may receive mercy. In the realm of grace, the Divine is merciful.', source: 'Guru Granth Sahib', context: 'Sikh teaching emphasizes divine mercy and calls adherents to embody mercy toward all.' },
      // Prayer & Meditation
      { themeSlug: 'prayer-meditation', traditionName: 'Islam', teaching: 'Prayer is the pillar of religion and the key to Paradise.', source: 'Hadith collections', context: 'Muslims pray five times daily, orienting their entire day toward remembrance of Allah.' },
      { themeSlug: 'prayer-meditation', traditionName: 'Christianity', teaching: 'Pray without ceasing.', source: '1 Thessalonians 5:17', context: 'Christians are called to maintain continuous communion with God through prayer.' },
      { themeSlug: 'prayer-meditation', traditionName: 'Judaism', teaching: 'Prayer should be recited three times daily.', source: 'Talmud, Berakhot', context: 'Jewish tradition structures the day around morning, afternoon, and evening prayers.' },
      { themeSlug: 'prayer-meditation', traditionName: 'Buddhism', teaching: 'Meditation brings wisdom; lack of meditation leaves ignorance.', source: 'Dhammapada', context: 'Buddhist meditation practices cultivate mindfulness, concentration, and insight into reality.' },
      { themeSlug: 'prayer-meditation', traditionName: 'Hinduism', teaching: 'Yoga is the journey of the self, through the self, to the self.', source: 'Bhagavad Gita', context: 'Hindu practices of meditation and yoga unite the individual soul with ultimate reality.' },
      { themeSlug: 'prayer-meditation', traditionName: 'Sikhism', teaching: 'Meditate on the Name of the Lord, even for a moment; nothing else will go with you.', source: 'Guru Granth Sahib', context: 'Naam Simran (meditation on God\'s name) is central to Sikh spiritual practice.' },
      { themeSlug: 'prayer-meditation', traditionName: 'Bahá\'í Faith', teaching: 'The obligatory prayers are binding and have been revealed in three forms.', source: 'Kitáb-i-Aqdas', context: 'Bahá\'ís choose among three daily obligatory prayers, maintaining regular spiritual connection.' },
      // Charity & Service
      { themeSlug: 'charity-service', traditionName: 'Islam', teaching: 'Those who spend their wealth in charity day and night, secretly and openly - their reward is with their Lord.', source: 'Quran 2:274', context: 'Zakat (charity) is a pillar of Islam, requiring 2.5% of wealth given to those in need.' },
      { themeSlug: 'charity-service', traditionName: 'Christianity', teaching: 'Truly I tell you, whatever you did for one of the least of these, you did for me.', source: 'Matthew 25:40', context: 'Jesus identifies himself with the poor and vulnerable, making service to them sacred duty.' },
      { themeSlug: 'charity-service', traditionName: 'Judaism', teaching: 'Tzedakah (charity) is equal in importance to all other commandments combined.', source: 'Talmud, Baba Batra 9a', context: 'Giving to those in need is not optional kindness but religious obligation in Judaism.' },
      { themeSlug: 'charity-service', traditionName: 'Sikhism', teaching: 'Those who have loved, have obtained the Lord. They do seva (selfless service) and practice compassion.', source: 'Guru Granth Sahib', context: 'Seva (selfless service) is a cornerstone of Sikh practice, exemplified by the langar (free kitchen).' },
      { themeSlug: 'charity-service', traditionName: 'Buddhism', teaching: 'Generosity brings happiness at every stage of its expression.', source: 'Buddha\'s teachings', context: 'Dana (generosity) is the first of the Buddhist perfections, purifying the heart and supporting others.' },
      { themeSlug: 'charity-service', traditionName: 'Hinduism', teaching: 'Charity given to a worthy person simply because it is right to give, without anything expected in return, is sattvic charity.', source: 'Bhagavad Gita 17:20', context: 'Selfless giving without expectation of reward is the highest form of charity.' },
      { themeSlug: 'charity-service', traditionName: 'Bahá\'í Faith', teaching: 'It is not for him to pride himself who loveth his own country, but rather for him who loveth the whole world.', source: 'Bahá\'u\'lláh', context: 'Bahá\'ís are called to universal service and working for the betterment of humanity.' },
      // Love & Unity
      { themeSlug: 'love-unity', traditionName: 'Christianity', teaching: 'God is love, and whoever abides in love abides in God.', source: '1 John 4:16', context: 'Love is understood as God\'s essential nature and the defining mark of Christian life.' },
      { themeSlug: 'love-unity', traditionName: 'Islam', teaching: 'O mankind, indeed We have created you from male and female and made you peoples and tribes that you may know one another.', source: 'Quran 49:13', context: 'Human diversity is divinely intended for mutual understanding and unity, not division.' },
      { themeSlug: 'love-unity', traditionName: 'Judaism', teaching: 'Love your neighbor as yourself.', source: 'Leviticus 19:18', context: 'This commandment is considered foundational to Jewish ethics and spiritual life.' },
      { themeSlug: 'love-unity', traditionName: 'Hinduism', teaching: 'The wise see that there is One Spirit within all beings.', source: 'Bhagavad Gita', context: 'Recognition of divine unity within all creation leads to universal love and compassion.' },
      { themeSlug: 'love-unity', traditionName: 'Buddhism', teaching: 'Hatred is never appeased by hatred. Hatred is appeased by love alone.', source: 'Dhammapada 1:5', context: 'Buddha teaches that only love and compassion can truly overcome enmity and division.' },
      { themeSlug: 'love-unity', traditionName: 'Bahá\'í Faith', teaching: 'The earth is but one country, and mankind its citizens.', source: 'Bahá\'u\'lláh', context: 'Bahá\'í Faith teaches the unity of humanity and works toward global peace and cooperation.' },
      { themeSlug: 'love-unity', traditionName: 'Sikhism', teaching: 'Recognize the Divine Light within all, and do not ask about caste or social class.', source: 'Guru Granth Sahib', context: 'All humans are equal before God, united by divine presence regardless of worldly differences.' },
      // Justice & Righteousness
      { themeSlug: 'justice-righteousness', traditionName: 'Judaism', teaching: 'Justice, justice shall you pursue.', source: 'Deuteronomy 16:20', context: 'The repetition emphasizes that both the ends and means of justice must be just.' },
      { themeSlug: 'justice-righteousness', traditionName: 'Islam', teaching: 'O you who believe! Stand out firmly for justice, as witnesses to Allah, even if it be against yourselves.', source: 'Quran 4:135', context: 'Muslims are commanded to uphold justice even when it contradicts self-interest.' },
      { themeSlug: 'justice-righteousness', traditionName: 'Christianity', teaching: 'He has shown you what is good. And what does the Lord require of you? To act justly, love mercy, and walk humbly with your God.', source: 'Micah 6:8', context: 'The prophet summarizes true religion as justice, mercy, and humble relationship with God.' },
      { themeSlug: 'justice-righteousness', traditionName: 'Hinduism', teaching: 'Dharma protects those who protect it.', source: 'Manusmriti', context: 'Upholding dharma (righteousness/duty) creates cosmic and social order that sustains all.' },
      { themeSlug: 'justice-righteousness', traditionName: 'Buddhism', teaching: 'A person who practices the Dharma is protected by the Dharma.', source: 'Buddhist teaching', context: 'Living according to righteous principles creates protection and well-being.' },
      { themeSlug: 'justice-righteousness', traditionName: 'Sikhism', teaching: 'Where there is greed, sin, and vice, righteousness does not dwell there.', source: 'Guru Granth Sahib', context: 'Living righteously requires rejecting greed and corruption in favor of honest conduct.' },
      { themeSlug: 'justice-righteousness', traditionName: 'Bahá\'í Faith', teaching: 'The best beloved of all things in My sight is Justice.', source: 'Bahá\'u\'lláh', context: 'Justice is elevated as the supreme virtue and foundation for establishing peace.' },
      // Humility & Wisdom
      { themeSlug: 'humility-wisdom', traditionName: 'Christianity', teaching: 'God opposes the proud but shows favor to the humble.', source: 'James 4:6', context: 'Humility opens the heart to receive divine grace and wisdom.' },
      { themeSlug: 'humility-wisdom', traditionName: 'Taoism', teaching: 'Those who know do not speak; those who speak do not know.', source: 'Tao Te Ching, Chapter 56', context: 'True wisdom recognizes the limits of words and the value of quiet understanding.' },
      { themeSlug: 'humility-wisdom', traditionName: 'Confucianism', teaching: 'Real knowledge is to know the extent of one\'s ignorance.', source: 'Confucius, Analects', context: 'Wisdom begins with humble recognition of how much we don\'t know.' },
      { themeSlug: 'humility-wisdom', traditionName: 'Islam', teaching: 'The servants of the Most Merciful are those who walk upon the earth in humility.', source: 'Quran 25:63', context: 'Humility in conduct reflects submission to God and respect for creation.' },
      { themeSlug: 'humility-wisdom', traditionName: 'Buddhism', teaching: 'If you think you know everything, you have learned nothing.', source: 'Buddhist teaching', context: 'The beginner\'s mind, free from arrogance, remains open to wisdom and insight.' },
      { themeSlug: 'humility-wisdom', traditionName: 'Judaism', teaching: 'Who is wise? One who learns from every person.', source: 'Pirkei Avot 4:1', context: 'Humility to learn from all people, regardless of status, characterizes true wisdom.' },
      { themeSlug: 'humility-wisdom', traditionName: 'Hinduism', teaching: 'Humility is the ornament of wisdom.', source: 'Tirukkural', context: 'True spiritual wisdom manifests in humble, egoless conduct.' },
      // Sacred Hospitality
      { themeSlug: 'sacred-hospitality', traditionName: 'Christianity', teaching: 'Do not forget to show hospitality to strangers, for by so doing some have shown hospitality to angels without knowing it.', source: 'Hebrews 13:2', context: 'Welcoming strangers may be encountering the divine in disguise.' },
      { themeSlug: 'sacred-hospitality', traditionName: 'Islam', teaching: 'Whoever believes in Allah and the Last Day should honor his guest.', source: 'Hadith', context: 'Hospitality is a mark of true faith and reflects God\'s generosity to humanity.' },
      { themeSlug: 'sacred-hospitality', traditionName: 'Judaism', teaching: 'Hospitality to wayfarers is greater than welcoming the Divine Presence.', source: 'Talmud, Shabbat 127a', context: 'Abraham\'s example of interrupting prayer to welcome strangers shows hospitality\'s importance.' },
      { themeSlug: 'sacred-hospitality', traditionName: 'Hinduism', teaching: 'The guest is God (Atithi Devo Bhava).', source: 'Taittiriya Upanishad', context: 'Treating guests with honor and care is treating the divine with reverence.' },
      { themeSlug: 'sacred-hospitality', traditionName: 'Sikhism', teaching: 'The Guru\'s Langar feeds all who come, regardless of caste, creed, or status.', source: 'Sikh tradition', context: 'The free community kitchen exemplifies radical hospitality and equality before God.' },
      { themeSlug: 'sacred-hospitality', traditionName: 'Buddhism', teaching: 'Welcoming all beings with kindness opens the path to enlightenment.', source: 'Buddhist teaching', context: 'Generosity and hospitality purify the heart and express universal compassion.' },
      { themeSlug: 'sacred-hospitality', traditionName: 'Native American Spirituality', teaching: 'All who enter are family; the stranger is sacred.', source: 'Various tribal teachings', context: 'Many Native traditions view hospitality as sacred duty, honoring the divine in each visitor.' },
    ]

    const records = teachingData.map((t, i) => ({
      themeId: themeMap.get(t.themeSlug)!,
      traditionId: traditionMap.get(t.traditionName)!,
      teaching: t.teaching,
      source: t.source,
      context: t.context,
      orderIndex: i,
    }))

    await prisma.similarityTeaching.createMany({ data: records })
    console.log(`✅ similarityTeaching: ${records.length} records created`)
  } else {
    console.log(`⏭️  similarityTeaching: ${existingTeachingCount} existing records — skipping`)
  }

  // ── Page Content ────────────────────────────────────────
  console.log('\n--- Page Content ---')

  const pageSections = [
    // Home
    { pageKey: 'home', sectionKey: 'hero_badge', title: 'Bearer of Sufi Wisdom', content: null, orderIndex: 0 },
    { pageKey: 'home', sectionKey: 'hero_heading_1', title: 'Uniting Hearts Through', content: null, orderIndex: 1 },
    { pageKey: 'home', sectionKey: 'hero_heading_2', title: 'Divine Love & Understanding', content: null, orderIndex: 2 },
    { pageKey: 'home', sectionKey: 'hero_subtitle', title: null, content: 'A sacred space to eliminate hatred, dispel misconceptions, and discover the universal truths that bind all faiths together in peace, compassion, and divine love.', orderIndex: 3 },
    { pageKey: 'home', sectionKey: 'mission_heading', title: 'Our Sacred Mission', content: null, orderIndex: 4 },
    { pageKey: 'home', sectionKey: 'mission_subtitle', title: null, content: 'Guided by Sufi wisdom, we illuminate the path to interfaith harmony', orderIndex: 5 },
    { pageKey: 'home', sectionKey: 'join_heading', title: 'Join the Movement for Peace', content: null, orderIndex: 6 },
    { pageKey: 'home', sectionKey: 'join_subtitle', title: null, content: 'Together, we can create a world where love triumphs over hate, understanding overcomes fear, and unity transcends division.', orderIndex: 7 },
    // Mission
    { pageKey: 'mission', sectionKey: 'hero_badge', title: 'Our Sacred Purpose', content: null, orderIndex: 0 },
    { pageKey: 'mission', sectionKey: 'hero_heading_1', title: 'Our Mission for', content: null, orderIndex: 1 },
    { pageKey: 'mission', sectionKey: 'hero_heading_2', title: 'Interfaith Harmony', content: null, orderIndex: 2 },
    { pageKey: 'mission', sectionKey: 'pillars_heading', title: 'Core Pillars of Our Work', content: null, orderIndex: 3 },
    // Approach
    { pageKey: 'approach', sectionKey: 'hero_badge', title: 'Our Methodology', content: null, orderIndex: 0 },
    { pageKey: 'approach', sectionKey: 'hero_heading_1', title: 'Our', content: null, orderIndex: 1 },
    { pageKey: 'approach', sectionKey: 'hero_heading_2', title: 'Approach to Unity', content: null, orderIndex: 2 },
    { pageKey: 'approach', sectionKey: 'hero_subtitle', title: null, content: 'A proven methodology combining ancient wisdom with modern engagement strategies to foster genuine interfaith harmony.', orderIndex: 3 },
    { pageKey: 'approach', sectionKey: 'subtitle', title: null, content: 'A step-by-step process for building genuine interfaith understanding', orderIndex: 4 },
    { pageKey: 'approach', sectionKey: 'ready_heading', title: 'Ready to Experience Our Approach?', content: null, orderIndex: 5 },
    { pageKey: 'approach', sectionKey: 'ready_subtitle', title: null, content: 'Join us in building a world where religious diversity enriches rather than divides.', orderIndex: 6 },
    // Sufi Teachings
    { pageKey: 'sufi-teachings', sectionKey: 'hero_badge', title: 'The Path of Love', content: null, orderIndex: 0 },
    { pageKey: 'sufi-teachings', sectionKey: 'hero_heading_1', title: 'Sufi', content: null, orderIndex: 1 },
    { pageKey: 'sufi-teachings', sectionKey: 'hero_heading_2', title: 'Teachings & Wisdom', content: null, orderIndex: 2 },
    { pageKey: 'sufi-teachings', sectionKey: 'hero_subtitle', title: null, content: 'Explore the timeless wisdom of Sufism, the mystical heart of Islam, and discover the path of divine love that transcends all boundaries.', orderIndex: 3 },
    // Teachings
    { pageKey: 'teachings', sectionKey: 'hero_badge', title: 'Sacred Wisdom', content: null, orderIndex: 0 },
    { pageKey: 'teachings', sectionKey: 'hero_heading_1', title: 'Timeless Teachings of', content: null, orderIndex: 1 },
    { pageKey: 'teachings', sectionKey: 'hero_heading_2', title: 'Love & Unity', content: null, orderIndex: 2 },
    { pageKey: 'teachings', sectionKey: 'hero_subtitle', title: null, content: 'Explore sacred wisdom from Sufism and world traditions that illuminate the path to peace and understanding.', orderIndex: 3 },
    { pageKey: 'teachings', sectionKey: 'similarities_heading', title: 'Similarities Among Faiths', content: null, orderIndex: 4 },
    { pageKey: 'teachings', sectionKey: 'similarities_subtitle', title: null, content: 'Discover the profound common ground shared across world religions, revealing the universal truths that unite humanity.', orderIndex: 5 },
    // Truth
    { pageKey: 'truth', sectionKey: 'hero_badge', title: 'Illuminating Truth', content: null, orderIndex: 0 },
    { pageKey: 'truth', sectionKey: 'hero_heading_1', title: 'Revealing Truth,', content: null, orderIndex: 1 },
    { pageKey: 'truth', sectionKey: 'hero_heading_2', title: 'Dispelling Darkness', content: null, orderIndex: 2 },
    { pageKey: 'truth', sectionKey: 'hero_subtitle', title: null, content: 'Understanding replaces ignorance when we illuminate common misconceptions with the light of authentic knowledge.', orderIndex: 3 },
    { pageKey: 'truth', sectionKey: 'misconceptions_heading', title: 'Common Misconceptions & Their Truths', content: null, orderIndex: 4 },
    { pageKey: 'truth', sectionKey: 'misconceptions_subtitle', title: null, content: 'Knowledge is the first step toward understanding. Explore the truths behind common misconceptions.', orderIndex: 5 },
    // Traditions
    { pageKey: 'traditions', sectionKey: 'hero_badge', title: 'Celebrating Diversity', content: null, orderIndex: 0 },
    { pageKey: 'traditions', sectionKey: 'hero_heading_1', title: 'Honoring All Paths', content: null, orderIndex: 1 },
    { pageKey: 'traditions', sectionKey: 'hero_heading_2', title: 'to the Divine', content: null, orderIndex: 2 },
    { pageKey: 'traditions', sectionKey: 'hero_subtitle', title: null, content: 'Each tradition is a river flowing toward the ocean of divine truth, carrying the unique beauty of its cultural and spiritual heritage.', orderIndex: 3 },
    { pageKey: 'traditions', sectionKey: 'traditions_heading', title: 'Faith Traditions We Honor', content: null, orderIndex: 4 },
    { pageKey: 'traditions', sectionKey: 'traditions_subtitle', title: null, content: 'From ancient wisdom to contemporary expressions of faith, each tradition offers a unique path to the Divine.', orderIndex: 5 },
    { pageKey: 'traditions', sectionKey: 'values_heading', title: 'Shared Values Across Traditions', content: null, orderIndex: 6 },
    // Sacred Texts
    { pageKey: 'sacred-texts', sectionKey: 'hero_badge', title: 'Universal Wisdom', content: null, orderIndex: 0 },
    { pageKey: 'sacred-texts', sectionKey: 'hero_heading_1', title: 'Sacred Texts', content: null, orderIndex: 1 },
    { pageKey: 'sacred-texts', sectionKey: 'hero_heading_2', title: '& Scriptures', content: null, orderIndex: 2 },
    { pageKey: 'sacred-texts', sectionKey: 'hero_subtitle', title: null, content: 'Explore the profound wisdom found in the sacred writings of the world\'s great religious traditions.', orderIndex: 3 },
    { pageKey: 'sacred-texts', sectionKey: 'languages_heading', title: 'One Truth, Many Languages', content: null, orderIndex: 4 },
    { pageKey: 'sacred-texts', sectionKey: 'languages_subtitle', title: null, content: 'While each sacred text speaks in its own cultural and historical context, the universal truths they convey echo across time and tradition.', orderIndex: 5 },
    { pageKey: 'sacred-texts', sectionKey: 'traditions_heading', title: 'Sacred Texts from World Traditions', content: null, orderIndex: 6 },
    { pageKey: 'sacred-texts', sectionKey: 'themes_heading', title: 'Shared Themes Across Traditions', content: null, orderIndex: 7 },
    { pageKey: 'sacred-texts', sectionKey: 'themes_subtitle', title: null, content: 'Despite differences in language, culture, and historical context, profound similarities emerge when we compare sacred texts side by side.', orderIndex: 8 },
    { pageKey: 'sacred-texts', sectionKey: 'sufi_heading', title: 'Sufi Perspective on Sacred Texts', content: null, orderIndex: 9 },
    { pageKey: 'sacred-texts', sectionKey: 'study_heading', title: 'Study Resources', content: null, orderIndex: 10 },
    // Sacred Texts Explorer
    { pageKey: 'sacred-texts-explorer', sectionKey: 'hero_heading_1', title: 'Sacred Texts', content: null, orderIndex: 0 },
    { pageKey: 'sacred-texts-explorer', sectionKey: 'hero_heading_2', title: 'Explorer', content: null, orderIndex: 1 },
    { pageKey: 'sacred-texts-explorer', sectionKey: 'hero_subtitle', title: null, content: 'Discover the profound similarities across world religions through their sacred writings.', orderIndex: 2 },
    // About
    { pageKey: 'about', sectionKey: 'hero_badge', title: 'Who We Are', content: null, orderIndex: 0 },
    { pageKey: 'about', sectionKey: 'hero_heading_1', title: 'About', content: null, orderIndex: 1 },
    { pageKey: 'about', sectionKey: 'hero_heading_2', title: 'Interfaith Peace Bridge', content: null, orderIndex: 2 },
    { pageKey: 'about', sectionKey: 'hero_subtitle', title: null, content: 'A global movement dedicated to building bridges of understanding between all faiths and spiritual traditions.', orderIndex: 3 },
    { pageKey: 'about', sectionKey: 'leadership_heading', title: 'Our Leadership', content: null, orderIndex: 4 },
    { pageKey: 'about', sectionKey: 'leadership_subtitle', title: null, content: 'Guided by scholars, spiritual teachers, and interfaith activists dedicated to fostering global harmony.', orderIndex: 5 },
    { pageKey: 'about', sectionKey: 'impact_heading', title: 'Our Impact', content: null, orderIndex: 6 },
    { pageKey: 'about', sectionKey: 'join_heading', title: 'Join Us in Building Bridges', content: null, orderIndex: 7 },
    { pageKey: 'about', sectionKey: 'join_subtitle', title: null, content: 'Be part of a global movement transforming interfaith relations through the power of divine love.', orderIndex: 8 },
    { pageKey: 'about', sectionKey: 'contact_heading', title: 'Contact Us', content: null, orderIndex: 9 },
    { pageKey: 'about', sectionKey: 'contact_subtitle', title: null, content: 'Have a question, suggestion, or want to collaborate? We\'d love to hear from you.', orderIndex: 10 },
    // Peace
    { pageKey: 'peace', sectionKey: 'hero_badge', title: 'Building Peace Together', content: null, orderIndex: 0 },
    { pageKey: 'peace', sectionKey: 'hero_heading_1', title: 'Our', content: null, orderIndex: 1 },
    { pageKey: 'peace', sectionKey: 'hero_heading_2', title: 'Peace Work', content: null, orderIndex: 2 },
    { pageKey: 'peace', sectionKey: 'hero_subtitle', title: null, content: 'From local dialogue circles to global collaborations, our peace initiatives are rooted in the Sufi tradition of universal love.', orderIndex: 3 },
    { pageKey: 'peace', sectionKey: 'initiatives_heading', title: 'Active Initiatives', content: null, orderIndex: 4 },
    { pageKey: 'peace', sectionKey: 'join_heading', title: 'Join Our Peace Movement', content: null, orderIndex: 5 },
    { pageKey: 'peace', sectionKey: 'join_subtitle', title: null, content: 'Every act of understanding, every bridge built, brings us closer to a world of lasting peace.', orderIndex: 6 },
    // Peace Initiatives
    { pageKey: 'peace-initiatives', sectionKey: 'hero_badge', title: 'Building Peace Together', content: null, orderIndex: 0 },
    { pageKey: 'peace-initiatives', sectionKey: 'hero_heading_1', title: 'Peace', content: null, orderIndex: 1 },
    { pageKey: 'peace-initiatives', sectionKey: 'hero_heading_2', title: 'Initiatives', content: null, orderIndex: 2 },
    { pageKey: 'peace-initiatives', sectionKey: 'hero_subtitle', title: null, content: 'Active programs and collaborative projects building bridges of understanding across communities worldwide.', orderIndex: 3 },
    { pageKey: 'peace-initiatives', sectionKey: 'initiatives_heading', title: 'Our Current Initiatives', content: null, orderIndex: 4 },
    { pageKey: 'peace-initiatives', sectionKey: 'goals_heading', title: '2026 Impact Goals', content: null, orderIndex: 5 },
    { pageKey: 'peace-initiatives', sectionKey: 'programs_heading', title: 'Featured Programs', content: null, orderIndex: 6 },
    { pageKey: 'peace-initiatives', sectionKey: 'regional_heading', title: 'Regional Initiatives', content: null, orderIndex: 7 },
    { pageKey: 'peace-initiatives', sectionKey: 'involved_heading', title: 'Get Involved', content: null, orderIndex: 8 },
    { pageKey: 'peace-initiatives', sectionKey: 'involved_subtitle', title: null, content: 'Every initiative needs dedicated people like you. Find your place in our movement for peace.', orderIndex: 9 },
    { pageKey: 'peace-initiatives', sectionKey: 'events_heading', title: 'Upcoming Events', content: null, orderIndex: 10 },
    // Join
    { pageKey: 'join', sectionKey: 'hero_badge', title: 'Join Us Today', content: null, orderIndex: 0 },
    { pageKey: 'join', sectionKey: 'hero_heading_1', title: 'Be Part of', content: null, orderIndex: 1 },
    { pageKey: 'join', sectionKey: 'hero_heading_2', title: 'Something Greater', content: null, orderIndex: 2 },
    { pageKey: 'join', sectionKey: 'hero_subtitle', title: null, content: 'Join thousands of people from every faith tradition and background who are building bridges of understanding worldwide.', orderIndex: 3 },
    { pageKey: 'join', sectionKey: 'ready_heading', title: 'Ready to Join?', content: null, orderIndex: 4 },
    { pageKey: 'join', sectionKey: 'ready_subtitle', title: null, content: 'Fill out the form below to become part of our global interfaith family.', orderIndex: 5 },
    { pageKey: 'join', sectionKey: 'footer_heading', title: 'Together, We Create a World of Peace', content: null, orderIndex: 6 },
    { pageKey: 'join', sectionKey: 'footer_subtitle', title: null, content: 'Every person who joins our movement adds a unique thread to the tapestry of global peace.', orderIndex: 7 },
    // Subscribe
    { pageKey: 'subscribe', sectionKey: 'hero_badge', title: 'Stay Connected', content: null, orderIndex: 0 },
    { pageKey: 'subscribe', sectionKey: 'hero_heading_1', title: 'Subscribe to Our', content: null, orderIndex: 1 },
    { pageKey: 'subscribe', sectionKey: 'hero_heading_2', title: 'Newsletter', content: null, orderIndex: 2 },
    { pageKey: 'subscribe', sectionKey: 'hero_subtitle', title: null, content: 'Receive inspiring content, sacred wisdom, and updates from our global interfaith community.', orderIndex: 3 },
    { pageKey: 'subscribe', sectionKey: 'subscribers_heading', title: 'Join 25,000+ Subscribers', content: null, orderIndex: 4 },
    { pageKey: 'subscribe', sectionKey: 'newsletter_heading', title: 'What\'s Inside Each Newsletter?', content: null, orderIndex: 5 },
    { pageKey: 'subscribe', sectionKey: 'newsletter_subtitle', title: null, content: 'Free forever. Delivered with love.', orderIndex: 6 },
    { pageKey: 'subscribe', sectionKey: 'form_heading', title: 'Subscribe Now', content: null, orderIndex: 7 },
    { pageKey: 'subscribe', sectionKey: 'form_subtitle', title: null, content: 'Free forever. Delivered with love.', orderIndex: 8 },
    { pageKey: 'subscribe', sectionKey: 'footer_heading', title: 'Start Your Journey of Discovery Today', content: null, orderIndex: 9 },
    { pageKey: 'subscribe', sectionKey: 'footer_subtitle', title: null, content: 'Join thousands of seekers receiving wisdom, inspiration, and community in their inbox.', orderIndex: 10 },
    // Founder
    { pageKey: 'founder', sectionKey: 'hero_badge', title: 'Our Founder', content: null, orderIndex: 0 },
    { pageKey: 'founder', sectionKey: 'hero_heading_1', title: 'Our', content: null, orderIndex: 1 },
    { pageKey: 'founder', sectionKey: 'hero_heading_2', title: 'Founder', content: null, orderIndex: 2 },
    { pageKey: 'founder', sectionKey: 'hero_subtitle', title: null, content: 'The guiding lights behind Interfaith Peace Bridge, whose vision and dedication continue to inspire our global movement.', orderIndex: 3 },
    // Share Quotes
    { pageKey: 'share-quotes', sectionKey: 'hero_heading_1', title: 'Share', content: null, orderIndex: 0 },
    { pageKey: 'share-quotes', sectionKey: 'hero_heading_2', title: 'Sacred Wisdom', content: null, orderIndex: 1 },
    { pageKey: 'share-quotes', sectionKey: 'hero_subtitle', title: null, content: 'Beautiful, shareable quote cards from world religions to inspire and uplift.', orderIndex: 2 },
    // Assessment
    { pageKey: 'assessment', sectionKey: 'hero_badge', title: 'Faith Assessment', content: null, orderIndex: 0 },
    { pageKey: 'assessment', sectionKey: 'hero_heading_1', title: 'Heart & Faith', content: null, orderIndex: 1 },
    { pageKey: 'assessment', sectionKey: 'hero_heading_2', title: 'Assessment', content: null, orderIndex: 2 },
    { pageKey: 'assessment', sectionKey: 'hero_subtitle', title: null, content: 'A thoughtful journey of self-reflection to discover the universal values that unite us all.', orderIndex: 3 },
    // Contact Us
    { pageKey: 'contact-us', sectionKey: 'hero_badge', title: 'Get in Touch', content: null, orderIndex: 0 },
    { pageKey: 'contact-us', sectionKey: 'hero_heading_1', title: 'Contact Us', content: null, orderIndex: 1 },
    { pageKey: 'contact-us', sectionKey: 'hero_subtitle', title: null, content: 'Have a question, suggestion, or want to collaborate? We\'d love to hear from you.', orderIndex: 2 },
    { pageKey: 'contact-us', sectionKey: 'form_heading', title: 'Send Us a Message', content: null, orderIndex: 3 },
    { pageKey: 'contact-us', sectionKey: 'form_subtitle', title: null, content: 'Fill out the form below and we\'ll get back to you as soon as possible.', orderIndex: 4 },
    // Interfaith Glossary
    { pageKey: 'interfaith-glossary', sectionKey: 'hero_badge', title: 'Interfaith Knowledge', content: null, orderIndex: 0 },
    { pageKey: 'interfaith-glossary', sectionKey: 'hero_heading', title: 'Interfaith Glossary', content: null, orderIndex: 1 },
    { pageKey: 'interfaith-glossary', sectionKey: 'hero_subtitle', title: null, content: 'Understanding sacred language across traditions.', orderIndex: 2 },
    { pageKey: 'interfaith-glossary', sectionKey: 'hero_paragraph', title: null, content: 'This glossary helps reduce misunderstanding and supports respectful interfaith learning by providing clear, contextual definitions of sacred terms from the world\'s religious traditions.', orderIndex: 3 },
    { pageKey: 'interfaith-glossary', sectionKey: 'hero_cta_1_text', title: 'Explore Terms', content: null, orderIndex: 4 },
    { pageKey: 'interfaith-glossary', sectionKey: 'hero_cta_2_text', title: 'Suggest a Term', content: null, orderIndex: 5 },
    { pageKey: 'interfaith-glossary', sectionKey: 'intro_title', title: 'Why This Glossary Exists', content: null, orderIndex: 6 },
    { pageKey: 'interfaith-glossary', sectionKey: 'intro_paragraph_1', title: null, content: 'Across history, humanity has developed countless spiritual traditions, sacred texts, rituals, philosophies, and systems of meaning. Yet many people encounter religious terminology through headlines, social media debates, stereotypes, or incomplete information.', orderIndex: 7 },
    { pageKey: 'interfaith-glossary', sectionKey: 'intro_paragraph_2', title: null, content: 'Misunderstanding of sacred terms creates confusion, fear, and division. When words like Jihad, Dharma, Karma, or Messiah are presented without proper context, they can reinforce prejudice rather than build understanding.', orderIndex: 8 },
    { pageKey: 'interfaith-glossary', sectionKey: 'intro_paragraph_3', title: null, content: 'The purpose of this glossary is simple: to replace confusion with understanding, fear with knowledge, and division with meaningful dialogue.', orderIndex: 9 },
    { pageKey: 'interfaith-glossary', sectionKey: 'intro_paragraph_4', title: null, content: 'This glossary is neutral, respectful, and educational. It does not promote, rank, endorse, or criticize any faith tradition. Each term is explained within its historical, cultural, theological, and spiritual framework, using language that reflects how practitioners understand their own beliefs.', orderIndex: 10 },
    { pageKey: 'interfaith-glossary', sectionKey: 'glossary_section_title', title: 'Explore Sacred Terms', content: null, orderIndex: 11 },
    { pageKey: 'interfaith-glossary', sectionKey: 'glossary_section_subtitle', title: null, content: 'Search, filter, and explore glossary terms by tradition, category, or alphabet.', orderIndex: 12 },
    { pageKey: 'interfaith-glossary', sectionKey: 'comparison_badge', title: 'Shared Values', content: null, orderIndex: 13 },
    { pageKey: 'interfaith-glossary', sectionKey: 'comparison_title', title: 'Shared Values Across Traditions', content: null, orderIndex: 14 },
    { pageKey: 'interfaith-glossary', sectionKey: 'comparison_note', title: null, content: 'The goal is not to suggest equivalence but to encourage understanding of how different traditions express shared human values through their unique languages and practices.', orderIndex: 15 },
    { pageKey: 'interfaith-glossary', sectionKey: 'disclaimer_title', title: 'Educational Disclaimer', content: null, orderIndex: 16 },
    { pageKey: 'interfaith-glossary', sectionKey: 'disclaimer_content', title: null, content: 'This glossary is designed for educational and peacebuilding purposes. It does not replace formal religious scholarship, clergy guidance, or tradition-specific study. Definitions are presented with respect for the diversity of interpretation within each tradition. Readers are encouraged to consult recognized authorities within each faith for deeper understanding.', orderIndex: 17 },
    { pageKey: 'interfaith-glossary', sectionKey: 'cta_title', title: 'Help Build a Language of Peace', content: null, orderIndex: 18 },
    { pageKey: 'interfaith-glossary', sectionKey: 'cta_text', title: null, content: 'Suggest a sacred term, contribute educational insight, or help expand the Interfaith Glossary for future learners. Your knowledge can help build bridges of understanding.', orderIndex: 19 },
    { pageKey: 'interfaith-glossary', sectionKey: 'cta_btn_1_text', title: 'Suggest a Term', content: null, orderIndex: 20 },
    { pageKey: 'interfaith-glossary', sectionKey: 'cta_btn_2_text', title: 'Contact Us', content: null, orderIndex: 21 },
  ]

  for (const section of pageSections) {
    await prisma.pageContent.upsert({
      where: { pageKey_sectionKey: { pageKey: section.pageKey, sectionKey: section.sectionKey } },
      update: {},
      create: section,
    })
  }
  console.log(`✅ pageContent: ${pageSections.length} sections`)

  // ── Founder Page Sections ──────────────────────────────
  console.log('\n--- Founder Page Sections ---')

  const founderSections = [
    {
      slug: 'the-originator',
      pageTitle: 'Bani — The Originator',
      pageSubtitle: 'Representative stewardship and institutional development are guided by Dr. Zarf-e-Noori under the framework of Mithaq.',
      cardTitle: 'Spiritual guide, physician, and Sufi master whose life bridged medicine, mysticism, and structured institutional awakening.',
      cardSubtitle: 'Dr. Ghulam Mohammad Kumar',
      badgeLabel: 'FOUNDER — BANI',
      imagePath: '/uploads/founders/dr-kumar.png',
      order: 1,
      cardDescription: [
        "Dr. Ghulam Mohammad Kumar's journey began within a Kashmiri heritage grounded in scholarly and spiritual traditions. Born in 1957 into a family rooted in learning and healing, he demonstrated exceptional contemplative nature and profound inner sensitivity from his earliest years.",
        'He trained in modern medicine at Government Medical College Srinagar and practiced as a Medical Officer. Yet instinctively drawn deeper into inner inquiry, he transitioned from clinical practice toward a life devoted to spiritual depth and the pursuit of universal truth.',
        "His formative years in Kashmir's rich spiritual landscape shaped a disposition that would ultimately bridge conventional medical training with the ancient wisdom traditions of Kashmiri Sufism. Fourteen years of contemplative retreat in the forests of Ganderbal shaped a vision that transcends individual legacy."
      ]
    },
    {
      slug: 'representative-stewardship',
      pageTitle: 'Representative Stewardship',
      pageSubtitle: 'Guiding institutional development under the constitutional framework of Mithaq',
      cardTitle: 'Overseeing structural development, institutional governance integration, and digital expansion aligned with the founding charter.',
      cardSubtitle: 'Dr. Zarf-e-Noori',
      badgeLabel: 'REPRESENTATIVE FOUNDER',
      imagePath: '/uploads/founders/dr-zafr.jpeg',
      order: 2,
      cardDescription: [
        'The representative role focuses on architectural design: translating constitutional principles into operational systems, integrating editorial processes with production workflows, and establishing technological infrastructure that serves institutional permanence.',
        'Structural development includes the construction of multi-layered governance systems, role-based participation frameworks, registry documentation protocols, and economic transparency mechanisms that reinforce charter authority.'
      ]
    }
  ]

  for (const section of founderSections) {
    await prisma.founderPageSection.upsert({
      where: { slug: section.slug },
      update: {},
      create: section,
    })
  }
  console.log(`✅ founderPageSection: ${founderSections.length} sections`)

  console.log('\n🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
