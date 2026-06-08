'use client'

import { useState, useMemo, useEffect } from 'react'
import { Search, BookOpen, Filter, X, ChevronDown, ChevronUp, Heart, Globe, Lightbulb, Mail } from 'lucide-react'
import Link from 'next/link'

interface PageContent {
  id: string
  pageKey: string
  sectionKey: string
  title: string | null
  content: string | null
  orderIndex: number
  status: string
}

interface GlossaryTerm {
  term: string
  tradition: string
  category: string
  shortDefinition: string
  expandedExplanation: string
  relatedTerms: string
  commonMisunderstanding: string
  peacebuildingInsight: string
}

const traditions = [
  'All Traditions', 'Islam', 'Christianity', 'Judaism', 'Hinduism',
  'Buddhism', 'Sikhism', 'Jainism', 'Baháʼí Faith', 'Taoism',
  'Indigenous Traditions', 'Interfaith / Shared Values'
]

const categories = [
  'All Categories', 'Sacred Texts', 'Spiritual Practices', 'Ethics & Values',
  'Religious Leadership', 'Mysticism', 'Rituals', 'Sacred Places',
  'Theology', 'Peacebuilding', 'Community Life'
]

const alphabet = ['All', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

const glossaryData: GlossaryTerm[] = [
  { term: 'Tawhid', tradition: 'Islam', category: 'Theology', shortDefinition: 'The absolute oneness of God in Islam.', expandedExplanation: 'Tawhid is the foundational principle of Islam affirming that God (Allah) is one, unique, and indivisible. It shapes all Islamic theology, worship, and ethics. It rejects polytheism and emphasizes that only God is worthy of worship.', relatedTerms: 'Shirk, Iman, Allah', commonMisunderstanding: 'Tawhid is sometimes misunderstood as a purely negative rejection of other beliefs rather than a profound affirmation of divine unity.', peacebuildingInsight: 'Tawhid teaches that all humanity comes from the same divine source, providing a foundation for human equality and shared dignity.' },
  { term: 'Quran', tradition: 'Islam', category: 'Sacred Texts', shortDefinition: 'The holy book of Islam, revealed to Prophet Muhammad.', expandedExplanation: 'The Quran is the central religious text of Islam, believed to be the literal word of God (Allah) revealed to Prophet Muhammad over approximately 23 years. It consists of 114 chapters (surahs) covering theology, law, ethics, and guidance for personal and communal life.', relatedTerms: 'Sunnah, Hadith, Wahy', commonMisunderstanding: 'The Quran is often reduced to a legal code or a list of rules, but it is primarily a spiritual guide emphasizing mercy, reflection, and relationship with God.', peacebuildingInsight: 'The Quran explicitly teaches that diversity of peoples and tribes is a sign of God\'s creation and a basis for mutual recognition, not conflict.' },
  { term: 'Hadith', tradition: 'Islam', category: 'Sacred Texts', shortDefinition: 'Sayings and actions of Prophet Muhammad.', expandedExplanation: 'Hadith are collections of the sayings, actions, and approvals of Prophet Muhammad. They serve as a major source of Islamic law and guidance alongside the Quran. Scholars evaluate hadith based on chains of transmission and content reliability.', relatedTerms: 'Sunnah, Quran, Isnad', commonMisunderstanding: 'Hadith are sometimes mistakenly equated with the Quran in authority. While important, they are considered secondary to the Quran and vary in authenticity.', peacebuildingInsight: 'Many hadith emphasize compassion, justice, and kindness toward neighbors regardless of faith, providing a strong basis for interfaith relations.' },
  { term: 'Sunnah', tradition: 'Islam', category: 'Theology', shortDefinition: 'The prophetic tradition and way of life of Prophet Muhammad.', expandedExplanation: 'Sunnah refers to the practices, customs, and teachings of Prophet Muhammad that serve as a model for Muslims. It includes his words, actions, and silent approvals, and is considered the second source of Islamic guidance after the Quran.', relatedTerms: 'Hadith, Quran, Sharia', commonMisunderstanding: 'Sunnah is sometimes seen as rigid, but it encompasses a wide range of practices including kindness, generosity, and mercy.', peacebuildingInsight: 'The Sunnah emphasizes peaceful resolution of conflicts, mercy in leadership, and respect for people of all backgrounds.' },
  { term: 'Salah', tradition: 'Islam', category: 'Spiritual Practices', shortDefinition: 'The five daily prayers performed by Muslims.', expandedExplanation: 'Salah is the ritual prayer performed five times daily at prescribed times: dawn, noon, afternoon, sunset, and evening. It involves specific movements, recitations, and facing Mecca. It is a direct connection between the worshiper and God.', relatedTerms: 'Dhikr, Dua, Wudu', commonMisunderstanding: 'Salah is sometimes viewed as mere ritual, but it is a deeply spiritual practice of remembrance, humility, and submission to God.', peacebuildingInsight: 'The discipline of daily prayer cultivates mindfulness, gratitude, and a sense of shared humanity across time zones and cultures.' },
  { term: 'Zakat', tradition: 'Islam', category: 'Ethics & Values', shortDefinition: 'Obligatory charity and wealth purification in Islam.', expandedExplanation: 'Zakat is one of the Five Pillars of Islam, requiring Muslims to give a portion (typically 2.5%) of their accumulated wealth to those in need. It purifies wealth, reduces inequality, and fosters community solidarity.', relatedTerms: 'Sadaqah, Charity, Tzedakah', commonMisunderstanding: 'Zakat is often reduced to a tax, but it is a spiritual act of worship and a moral obligation to ensure economic justice.', peacebuildingInsight: 'Zakat reflects the principle that wealth is a trust from God and must serve the common good, a value shared across many traditions.' },
  { term: 'Sawm', tradition: 'Islam', category: 'Spiritual Practices', shortDefinition: 'Fasting during the month of Ramadan.', expandedExplanation: 'Sawm is the practice of abstaining from food, drink, smoking, and marital relations from dawn to sunset during Ramadan. It cultivates self-discipline, empathy for the hungry, spiritual reflection, and increased devotion.', relatedTerms: 'Ramadan, Eid, Lent, Upavasa', commonMisunderstanding: 'Sawm is often seen only as physical abstention, but its core purpose is spiritual purification and moral self-restraint.', peacebuildingInsight: 'Fasting traditions exist across many faiths, creating a shared human experience of sacrifice, reflection, and renewal.' },
  { term: 'Hajj', tradition: 'Islam', category: 'Rituals', shortDefinition: 'The pilgrimage to Mecca required of all able Muslims.', expandedExplanation: 'Hajj is the annual pilgrimage to Mecca in Saudi Arabia, required once in a lifetime for Muslims who are physically and financially able. It involves specific rituals over several days, commemorating the trials of Prophet Abraham and his family.', relatedTerms: 'Umrah, Mecca, Pilgrimage', commonMisunderstanding: 'Hajj is sometimes viewed as a tourist journey, but it is a profound spiritual transformation and a demonstration of global Muslim unity.', peacebuildingInsight: 'Hajj gathers millions of people from every nation, race, and class in equal dress and devotion, symbolizing human unity before God.' },
  { term: 'Jihad', tradition: 'Islam', category: 'Theology', shortDefinition: 'A concept meaning struggle or striving in the way of God.', expandedExplanation: 'Jihad literally means "struggle" or "striving." It primarily refers to the internal spiritual struggle against sin and ego (greater jihad). It can also refer to defending the faith or community (lesser jihad), subject to strict ethical rules including proportionality and protection of civilians.', relatedTerms: 'Striving, Ijtihad, Qital', commonMisunderstanding: 'Jihad is often reduced only to violence in public discourse, ignoring its primary meaning of spiritual struggle and ethical striving.', peacebuildingInsight: 'Understanding the broader meaning of Jihad helps reduce fear and misrepresentation, revealing a concept centered on ethical effort and self-improvement.' },
  { term: 'Sufism', tradition: 'Islam', category: 'Mysticism', shortDefinition: 'The mystical dimension of Islam focused on divine love.', expandedExplanation: 'Sufism (Tasawwuf) is the inner, mystical path of Islam emphasizing direct experience of God, love, purification of the heart, and spiritual realization. Sufis seek to transcend the ego and unite with the Divine through practices like dhikr, meditation, and guidance from a spiritual teacher.', relatedTerms: 'Dhikr, Fana, Murshid, Tariqa', commonMisunderstanding: 'Sufism is sometimes seen as a sect separate from Islam, but it is deeply rooted in Quranic teachings and has been practiced by mainstream Muslims for centuries.', peacebuildingInsight: 'Sufism\'s emphasis on divine love, tolerance, and the unity of all existence makes it a powerful force for interfaith understanding and peace.' },
  { term: 'Dhikr', tradition: 'Islam', category: 'Spiritual Practices', shortDefinition: 'The remembrance of God through repetition of divine names.', expandedExplanation: 'Dhikr is the spiritual practice of remembering God through repetition of His names, phrases from the Quran, or specific prayers. It can be performed individually or in groups, silently or aloud, and is central to Sufi spiritual development.', relatedTerms: 'Sufism, Salah, Meditation', commonMisunderstanding: 'Dhikr is sometimes dismissed as mere chanting, but it is a profound meditative practice aimed at purifying the heart and attaining spiritual presence.', peacebuildingInsight: 'Like meditative practices in other traditions, Dhikr cultivates inner peace, compassion, and awareness that support harmonious relationships.' },
  { term: 'Fana', tradition: 'Islam', category: 'Mysticism', shortDefinition: 'Annihilation of the ego in the divine presence.', expandedExplanation: 'Fana is a Sufi concept describing the passing away or annihilation of the individual ego and self-will in the presence of God. It is not the destruction of personality but the purification of the self from selfish desires, allowing one to live in accordance with divine will.', relatedTerms: 'Baqa, Sufism, Tawhid', commonMisunderstanding: 'Fana is sometimes misinterpreted as literal self-destruction or loss of identity, but it is a spiritual state of ego transcendence.', peacebuildingInsight: 'Fana teaches the letting go of ego-driven divisions, opening the heart to unity with others and with the Divine.' },
  { term: 'Murshid', tradition: 'Islam', category: 'Religious Leadership', shortDefinition: 'A spiritual guide or teacher in Sufism.', expandedExplanation: 'A Murshid is a qualified spiritual guide in the Sufi tradition who leads seekers (murids) on the spiritual path. The relationship is based on trust, respect, and the transmission of spiritual knowledge and blessing.', relatedTerms: 'Shaykh, Pir, Murid, Tariqa', commonMisunderstanding: 'The role of Murshid is sometimes misunderstood as absolute authority over a follower, but true spiritual guidance empowers the seeker\'s own realization.', peacebuildingInsight: 'The Murshid-murid relationship models respectful guidance and mentorship that can inspire interfaith spiritual companionship.' },
  { term: 'Bible', tradition: 'Christianity', category: 'Sacred Texts', shortDefinition: 'The holy scripture of Christianity.', expandedExplanation: 'The Bible is the collection of sacred texts in Christianity, divided into the Old Testament (shared with Judaism) and the New Testament (focusing on the life and teachings of Jesus Christ). It includes history, poetry, prophecy, letters, and apocalyptic literature.', relatedTerms: 'Gospel, Torah, Scripture', commonMisunderstanding: 'The Bible is sometimes read as a single book rather than a diverse library of texts written across centuries with different literary genres.', peacebuildingInsight: 'The Bible\'s central teachings of love, forgiveness, and reconciliation provide a strong foundation for peacebuilding.' },
  { term: 'Gospel', tradition: 'Christianity', category: 'Sacred Texts', shortDefinition: 'The good news of Jesus Christ and the four Gospel accounts.', expandedExplanation: 'Gospel means "good news." It refers both to the message of salvation through Jesus Christ and to the four canonical Gospels (Matthew, Mark, Luke, John) that narrate Jesus\'s life, teachings, death, and resurrection.', relatedTerms: 'Bible, Jesus, Messiah', commonMisunderstanding: 'The Gospels are sometimes viewed as biographies in the modern sense, but they are theological narratives written to inspire faith.', peacebuildingInsight: 'The Gospel message of peace, forgiveness of enemies, and love of neighbor directly supports interfaith reconciliation.' },
  { term: 'Trinity', tradition: 'Christianity', category: 'Theology', shortDefinition: 'The Christian doctrine of one God in three persons.', expandedExplanation: 'The Trinity is the central Christian doctrine that God exists as three persons Father, Son (Jesus Christ), and Holy Spirit while being one being. It is not tritheism but a mystery of unity and diversity within the Godhead.', relatedTerms: 'Jesus, Holy Spirit, Incarnation', commonMisunderstanding: 'The Trinity is often misunderstood as belief in three gods (polytheism), which orthodox Christianity rejects.', peacebuildingInsight: 'The Trinity models relationship, love, and unity within diversity values essential for interfaith harmony.' },
  { term: 'Eucharist', tradition: 'Christianity', category: 'Rituals', shortDefinition: 'The Christian sacrament of communion commemorating Jesus\'s last supper.', expandedExplanation: 'The Eucharist (also called Holy Communion or the Lord\'s Supper) is a sacrament where bread and wine are consecrated and shared, commemorating Jesus\'s last meal with his disciples. It is central to Christian worship across denominations, though interpretations vary.', relatedTerms: 'Sacrament, Communion, Mass', commonMisunderstanding: 'The Eucharist is sometimes reduced to a symbolic meal, but for many Christians it is a profound encounter with the presence of Christ.', peacebuildingInsight: 'The Eucharist as a shared meal of reconciliation and remembrance can inspire interfaith sharing of sacred hospitality.' },
  { term: 'Baptism', tradition: 'Christianity', category: 'Rituals', shortDefinition: 'The Christian rite of initiation using water.', expandedExplanation: 'Baptism is a sacrament of initiation into the Christian faith, using water as a symbol of purification, rebirth, and entry into the community of believers. It originates from John the Baptist\'s practice and Jesus\'s own baptism.', relatedTerms: 'Sacrament, Initiation, Conversion', commonMisunderstanding: 'Baptism is sometimes seen as merely a ritual, but it represents a profound spiritual transformation and commitment.', peacebuildingInsight: 'Baptism\'s symbolism of cleansing and new beginning resonates with purification rituals in many traditions.' },
  { term: 'Grace', tradition: 'Christianity', category: 'Theology', shortDefinition: 'The unearned love and favor of God toward humanity.', expandedExplanation: 'Grace is a central Christian concept describing God\'s free and unmerited love, mercy, and favor. It is not earned through good works but is a gift received through faith. Grace transforms the believer and empowers ethical living.', relatedTerms: 'Mercy, Love, Salvation', commonMisunderstanding: 'Grace is sometimes misunderstood as permission to act without moral responsibility, but authentic grace inspires gratitude and ethical transformation.', peacebuildingInsight: 'The concept of unearned love and forgiveness can inspire interfaith relationships built on generosity rather than judgment.' },
  { term: 'Salvation', tradition: 'Christianity', category: 'Theology', shortDefinition: 'Deliverance from sin and reconciliation with God.', expandedExplanation: 'Salvation in Christianity refers to deliverance from sin, death, and separation from God through Jesus Christ. Different traditions emphasize various aspects: forgiveness, justification, sanctification, and eternal life.', relatedTerms: 'Grace, Redemption, Atonement', commonMisunderstanding: 'Salvation is sometimes reduced to an afterlife ticket, but it also involves transformation and healing in the present life.', peacebuildingInsight: 'The hope of salvation can motivate believers to work for peace and justice as expressions of God\'s reconciling love.' },
  { term: 'Resurrection', tradition: 'Christianity', category: 'Theology', shortDefinition: 'Jesus Christ rising from the dead on the third day.', expandedExplanation: 'The Resurrection is the foundational event of Christianity, in which Jesus rose from the dead on the third day after his crucifixion. It affirms the victory over death, validates Jesus\'s divine identity, and promises eternal life to believers.', relatedTerms: 'Jesus, Easter, Salvation', commonMisunderstanding: 'The Resurrection is sometimes dismissed as a myth or metaphor, but it is central to Christian faith as a historical and spiritual reality.', peacebuildingInsight: 'The Resurrection message of hope, renewal, and victory over death resonates with themes of spiritual rebirth in many traditions.' },
  { term: 'Messiah', tradition: 'Christianity', category: 'Theology', shortDefinition: 'The anointed one or savior in Christian and Jewish traditions.', expandedExplanation: 'Messiah (Christ in Greek) means "anointed one." In Christianity, Jesus is recognized as the Messiah prophesied in the Hebrew Scriptures. In Judaism, the Messiah is a future leader who will bring peace and restore Israel.', relatedTerms: 'Christ, Jesus, Redemption', commonMisunderstanding: 'Christians and Jews use the term differently; Christians believe the Messiah has come in Jesus, while Judaism awaits a future Messiah.', peacebuildingInsight: 'The shared Messianic hope between Jewish and Christian traditions can be a bridge for dialogue about peace and redemption.' },
  { term: 'Contemplative Prayer', tradition: 'Christianity', category: 'Spiritual Practices', shortDefinition: 'Silent, meditative prayer focusing on God\'s presence.', expandedExplanation: 'Contemplative prayer is a Christian practice of silent, wordless prayer that goes beyond verbal petitions to rest in God\'s presence. It emphasizes listening, stillness, and openness to the divine. Figures like St. John of the Cross and St. Teresa of Avila are key teachers.', relatedTerms: 'Meditation, Silence, Mysticism', commonMisunderstanding: 'Contemplative prayer is sometimes mistaken for emptying the mind completely, but it is about filling the heart with God\'s presence.', peacebuildingInsight: 'Contemplative prayer parallels meditative practices in Buddhism, Hinduism, and Sufism, offering common ground for interfaith spiritual exchange.' },
  { term: 'Torah', tradition: 'Judaism', category: 'Sacred Texts', shortDefinition: 'The central sacred text of Judaism, the first five books.', expandedExplanation: 'The Torah (the Five Books of Moses) is the foundational text of Judaism, containing the narrative of creation, the patriarchs, the exodus from Egypt, and the giving of the law at Sinai. It is read publicly in synagogues and studied continuously.', relatedTerms: 'Talmud, Tanakh, Mitzvah', commonMisunderstanding: 'Torah is sometimes thought of only as "law," but it includes narrative, poetry, and teachings about God, humanity, and covenant.', peacebuildingInsight: 'The Torah\'s vision of all humanity created in the image of God (Genesis 1:27) is a powerful foundation for universal human dignity.' },
  { term: 'Talmud', tradition: 'Judaism', category: 'Sacred Texts', shortDefinition: 'The central text of rabbinic Judaism containing law and commentary.', expandedExplanation: 'The Talmud is a vast collection of Jewish law, ethics, philosophy, and tradition, comprising the Mishnah (oral law) and Gemara (commentary). It reflects centuries of rabbinic debate and interpretation, shaping Jewish life and thought.', relatedTerms: 'Torah, Mishnah, Gemara', commonMisunderstanding: 'The Talmud is sometimes viewed as difficult or inaccessible, but it contains profound ethical insights and spiritual wisdom.', peacebuildingInsight: 'The Talmud\'s emphasis on debate, multiple perspectives, and reasoned discussion models productive interfaith dialogue.' },
  { term: 'Mitzvah', tradition: 'Judaism', category: 'Ethics & Values', shortDefinition: 'A divine commandment or good deed in Judaism.', expandedExplanation: 'Mitzvah (plural: Mitzvot) refers to the 613 commandments in the Torah as well as good deeds performed out of religious duty. They cover ethical behavior, ritual observance, and social justice, shaping Jewish identity and practice.', relatedTerms: 'Torah, Halakhah, Tzedakah', commonMisunderstanding: 'Mitzvah is often reduced to "good deed" in popular usage, but it fundamentally means a divine commandment with spiritual significance.', peacebuildingInsight: 'The concept of Mitzvah as sacred obligation to do good can inspire commitment to justice and service across communities.' },
  { term: 'Sabbath', tradition: 'Judaism', category: 'Rituals', shortDefinition: 'The day of rest from Friday sunset to Saturday sunset.', expandedExplanation: 'The Sabbath (Shabbat) in Judaism is a weekly day of rest and spiritual renewal from Friday evening to Saturday evening. It commemorates God\'s rest after creation and the liberation from Egypt. Work is prohibited, and the day is devoted to prayer, family, study, and rest.', relatedTerms: 'Rest, Sanctification, Sabbath (Christian)', commonMisunderstanding: 'The Sabbath is sometimes seen only as a list of prohibitions, but it is primarily a gift of sacred time for rest and connection.', peacebuildingInsight: 'The universal need for rest and renewal is reflected in Sabbath-like practices across many traditions, offering shared values of balance and presence.' },
  { term: 'Kosher', tradition: 'Judaism', category: 'Ethics & Values', shortDefinition: 'Foods prepared according to Jewish dietary laws.', expandedExplanation: 'Kosher (Kashrut) refers to foods that comply with Jewish dietary laws derived from the Torah. These include permitted and forbidden animals, proper slaughter methods, and separation of meat and dairy. Kashrut sanctifies the act of eating.', relatedTerms: 'Halal, Dietary Laws, Blessing', commonMisunderstanding: 'Kosher is sometimes seen purely as dietary restriction, but it is a spiritual discipline reminding Jews of their covenant with God in daily life.', peacebuildingInsight: 'Like halal in Islam and mindful eating in Buddhism, kosher practices show how faith transforms everyday activities into acts of devotion.' },
  { term: 'Rabbi', tradition: 'Judaism', category: 'Religious Leadership', shortDefinition: 'A Jewish spiritual teacher and legal authority.', expandedExplanation: 'A Rabbi is a Jewish teacher and authority on Jewish law and tradition. Rabbis serve as community leaders, teachers, counselors, and interpreters of Jewish texts. The role emphasizes scholarship, wisdom, and guidance rather than priestly mediation.', relatedTerms: 'Teacher, Scholar, Synagogue', commonMisunderstanding: 'Rabbi is sometimes equated with "priest," but rabbis are primarily teachers and not sacerdotal intermediaries.', peacebuildingInsight: 'The rabbinic tradition of textual interpretation and ethical debate offers a model for respectful, thoughtful interfaith dialogue.' },
  { term: 'Covenant', tradition: 'Judaism', category: 'Theology', shortDefinition: 'The sacred agreement between God and the Jewish people.', expandedExplanation: 'Covenant (Brit) is a central concept in Judaism describing the ongoing relationship between God and the Jewish people, established with Abraham and renewed at Sinai. It involves mutual commitments, blessings, and responsibilities.', relatedTerms: 'Torah, Abraham, Faithfulness', commonMisunderstanding: 'Covenant is sometimes seen as exclusive, but Judaism also teaches that righteous people of all nations have a share in the world to come.', peacebuildingInsight: 'The covenantal idea of a sacred agreement can inspire interfaith commitments to work together for peace and justice.' },
  { term: 'Kabbalah', tradition: 'Judaism', category: 'Mysticism', shortDefinition: 'Jewish mystical tradition exploring the nature of God.', expandedExplanation: 'Kabbalah is the esoteric and mystical tradition within Judaism that seeks to understand the hidden nature of God, creation, and the soul. It includes teachings on the Sefirot (divine emanations), the Zohar (primary text), and practices for spiritual ascent.', relatedTerms: 'Mysticism, Sefirot, Zohar', commonMisunderstanding: 'Kabbalah is often misrepresented as magic or separated from its Jewish roots in popular culture.', peacebuildingInsight: 'Kabbalah\'s vision of divine unity and the interconnectedness of all things supports interfaith recognition of shared spiritual truths.' },
  { term: 'Tikkun Olam', tradition: 'Judaism', category: 'Ethics & Values', shortDefinition: 'The Jewish concept of repairing and perfecting the world.', expandedExplanation: 'Tikkun Olam means "repair of the world." It is a Jewish concept urging social justice, environmental stewardship, and acts of kindness to heal the brokenness in the world. It has become a central value in modern Jewish thought and activism.', relatedTerms: 'Justice, Service, Tzedakah', commonMisunderstanding: 'Tikkun Olam is sometimes used vaguely, but it has deep roots in Jewish mystical and rabbinic thought about human responsibility.', peacebuildingInsight: 'Tikkun Olam inspires collaborative work across faiths to address social and environmental challenges as a shared sacred duty.' },
  { term: 'Dharma', tradition: 'Hinduism', category: 'Ethics & Values', shortDefinition: 'Righteous duty, cosmic order, and ethical living.', expandedExplanation: 'Dharma is a key concept in Hinduism (and other Indian traditions) referring to the ethical duties, moral law, and righteous way of living that sustains cosmic order. It varies according to one\'s stage of life, social role, and circumstances.', relatedTerms: 'Karma, Moksha, Artha', commonMisunderstanding: 'Dharma is sometimes oversimplified as "religion," but it is a comprehensive concept of duty, justice, and harmony.', peacebuildingInsight: 'Dharma emphasizes responsibility toward others and the cosmos, inspiring ethical interfaith engagement and environmental care.' },
  { term: 'Karma', tradition: 'Hinduism', category: 'Ethics & Values', shortDefinition: 'The law of cause and effect governing actions and their results.', expandedExplanation: 'Karma is the spiritual principle of cause and effect where intentional actions have consequences in this life or future lives. It is not punishment but a natural law of moral causation that shapes the cycle of birth, death, and rebirth (samsara).', relatedTerms: 'Dharma, Samsara, Moksha', commonMisunderstanding: 'Karma is often misunderstood as fatalistic or as cosmic punishment, but it emphasizes personal responsibility and ethical growth.', peacebuildingInsight: 'Karma teaches that our actions matter and that ethical behavior creates positive conditions for all, encouraging mindful interfaith cooperation.' },
  { term: 'Moksha', tradition: 'Hinduism', category: 'Mysticism', shortDefinition: 'Liberation from the cycle of birth and death.', expandedExplanation: 'Moksha is the ultimate goal in Hinduism, liberation from the cycle of samsara (repeated birth and death). It is the realization of one\'s true nature as Atman (soul) united with Brahman (ultimate reality), attained through knowledge, devotion, or selfless action.', relatedTerms: 'Nirvana, Atman, Brahman, Samsara', commonMisunderstanding: 'Moksha is sometimes confused with heaven, but it is a state of liberation beyond all dualities including life and death.', peacebuildingInsight: 'The shared aspiration for liberation from suffering across traditions can foster mutual respect and spiritual solidarity.' },
  { term: 'Atman', tradition: 'Hinduism', category: 'Theology', shortDefinition: 'The individual soul or true self in Hindu philosophy.', expandedExplanation: 'Atman is the eternal, unchanging inner self or soul in Hindu philosophy. It is distinct from the body, mind, and ego. The realization that Atman is one with Brahman (universal consciousness) is the goal of spiritual knowledge.', relatedTerms: 'Brahman, Moksha, Self', commonMisunderstanding: 'Atman is sometimes confused with the ego or personality, but it is the timeless essence beyond all temporary identities.', peacebuildingInsight: 'The recognition of a shared inner divinity across all beings supports the principle of universal respect central to interfaith ethics.' },
  { term: 'Brahman', tradition: 'Hinduism', category: 'Theology', shortDefinition: 'The ultimate reality, universal consciousness, and source of all.', expandedExplanation: 'Brahman is the ultimate, unchanging reality in Hindu philosophy, the ground of all existence, beyond form, attributes, and description. It is both immanent (present in all things) and transcendent (beyond all things).', relatedTerms: 'Atman, Moksha, Vedanta', commonMisunderstanding: 'Brahman is sometimes mistaken for a personal god, but it is the impersonal absolute reality underlying all gods and creation.', peacebuildingInsight: 'The concept of an ultimate reality beyond all names and forms can help interfaith dialogue transcend doctrinal differences.' },
  { term: 'Puja', tradition: 'Hinduism', category: 'Rituals', shortDefinition: 'Worship ritual involving offerings, prayers, and devotion.', expandedExplanation: 'Puja is a Hindu ritual of worship involving offerings such as flowers, food, incense, and water to a deity or divine image. It can be performed at home or in temples, individually or communally, and expresses devotion (bhakti) and gratitude.', relatedTerms: 'Bhakti, Temple, Aarti', commonMisunderstanding: 'Puja is sometimes misunderstood as idol worship, but the images and symbols are focal points for connecting with the divine.', peacebuildingInsight: 'Puja\'s sensory richness and devotional spirit offer a beautiful example of embodied spirituality that can be appreciated across traditions.' },
  { term: 'Yoga', tradition: 'Hinduism', category: 'Spiritual Practices', shortDefinition: 'A spiritual practice of union of body, mind, and spirit.', expandedExplanation: 'Yoga (meaning "union") is an ancient spiritual practice from India that integrates physical postures, breath control, meditation, and ethical principles to unite body, mind, and spirit with the divine. It is one of the six orthodox schools of Hindu philosophy.', relatedTerms: 'Meditation, Bhakti, Asana', commonMisunderstanding: 'Yoga is often reduced to physical exercise in the West, but it is a comprehensive spiritual path with deep philosophical roots.', peacebuildingInsight: 'Yoga\'s global popularity shows how spiritual practices can transcend cultural boundaries and promote holistic well-being and peace.' },
  { term: 'Bhakti', tradition: 'Hinduism', category: 'Mysticism', shortDefinition: 'The path of loving devotion to a personal deity.', expandedExplanation: 'Bhakti is the path of loving devotion to a personal form of God, one of the major paths (yogas) in Hinduism. It emphasizes love, surrender, and emotional connection with the divine, expressed through prayer, chanting, and service.', relatedTerms: 'Puja, Yoga, Devotion', commonMisunderstanding: 'Bhakti is sometimes dismissed as emotionalism, but it is a sophisticated spiritual path with profound theology and practice.', peacebuildingInsight: 'Bhakti\'s emphasis on love as a spiritual path resonates with devotional traditions in Christianity, Islam, and other faiths.' },
  { term: 'Guru', tradition: 'Hinduism', category: 'Religious Leadership', shortDefinition: 'A spiritual teacher who dispels darkness and guides seekers.', expandedExplanation: 'Guru (meaning "dispeller of darkness") is a spiritual teacher and guide in Hindu, Buddhist, and Sikh traditions. The guru imparts knowledge, initiates students, and guides them on the spiritual path. The guru-shishya (teacher-student) relationship is sacred.', relatedTerms: 'Teacher, Master, Murshid', commonMisunderstanding: 'Guru is sometimes associated with cult-like control in Western media, but the true guru empowers the student\'s own realization.', peacebuildingInsight: 'The teacher-student relationship in Eastern traditions models respectful transmission of wisdom that can inspire interfaith learning.' },
  { term: 'Four Noble Truths', tradition: 'Buddhism', category: 'Theology', shortDefinition: 'The foundational teaching of Buddhism about suffering and its end.', expandedExplanation: 'The Four Noble Truths are the core of Buddha\'s teaching: 1) Life involves suffering (dukkha), 2) Suffering arises from craving and attachment, 3) Suffering can cease, 4) The Eightfold Path leads to the cessation of suffering. They provide a diagnostic and therapeutic framework for spiritual liberation.', relatedTerms: 'Eightfold Path, Nirvana, Dukkha', commonMisunderstanding: 'The First Truth is sometimes misinterpreted as pessimism, but Buddhism offers a realistic assessment followed by a clear path to freedom.', peacebuildingInsight: 'The Four Noble Truths offer a universal framework for recognizing and transforming suffering applicable to personal and societal peacebuilding.' },
  { term: 'Eightfold Path', tradition: 'Buddhism', category: 'Spiritual Practices', shortDefinition: 'The Buddhist path to liberation from suffering.', expandedExplanation: 'The Eightfold Path is the practical guide to liberation in Buddhism, consisting of: Right View, Right Intention, Right Speech, Right Action, Right Livelihood, Right Effort, Right Mindfulness, and Right Concentration. It integrates ethics, meditation, and wisdom.', relatedTerms: 'Four Noble Truths, Nirvana, Mindfulness', commonMisunderstanding: 'The Eightfold Path is sometimes seen as a linear sequence, but the factors are practiced simultaneously and support each other.', peacebuildingInsight: 'The Path\'s emphasis on right speech, action, and livelihood provides an ethical framework for peaceful and harmonious living.' },
  { term: 'Nirvana', tradition: 'Buddhism', category: 'Mysticism', shortDefinition: 'The ultimate state of liberation from suffering and rebirth.', expandedExplanation: 'Nirvana (meaning "blowing out" or "extinction") is the ultimate goal in Buddhism, the cessation of suffering, craving, and the cycle of rebirth. It is a state of perfect peace, wisdom, and freedom, beyond description or conceptualization.', relatedTerms: 'Moksha, Enlightenment, Four Noble Truths', commonMisunderstanding: 'Nirvana is sometimes mistaken as annihilation, but it is the extinction of the ego, not existence itself.', peacebuildingInsight: 'Nirvana as the ideal of peace and freedom from inner conflict can inspire the pursuit of peace in the world.' },
  { term: 'Sangha', tradition: 'Buddhism', category: 'Community Life', shortDefinition: 'The community of Buddhist practitioners.', expandedExplanation: 'Sangha originally referred to the community of monks and nuns, but in modern usage it includes all Buddhist practitioners. It is one of the Three Jewels of Buddhism (Buddha, Dharma, Sangha), providing support, guidance, and companionship on the spiritual path.', relatedTerms: 'Three Jewels, Community, Dharma', commonMisunderstanding: 'Sangha is sometimes reduced to just monastic communities, but lay practitioners are equally part of the spiritual community.', peacebuildingInsight: 'Sangha demonstrates the importance of community in spiritual life, a value shared across all religious traditions.' },
  { term: 'Bodhisattva', tradition: 'Buddhism', category: 'Theology', shortDefinition: 'One who postpones their own enlightenment to help all beings.', expandedExplanation: 'A Bodhisattva is an enlightened being who compassionately postpones final nirvana to help all sentient beings achieve liberation. The Bodhisattva ideal is central to Mahayana Buddhism, embodying universal compassion and the vow to serve others.', relatedTerms: 'Compassion, Enlightenment, Mahayana', commonMisunderstanding: 'Bodhisattvas are sometimes viewed as deities to be worshipped, but they are beings to be emulated as models of compassion.', peacebuildingInsight: 'The Bodhisattva ideal of selfless service for the benefit of all beings is a profound inspiration for peacebuilding and humanitarian work.' },
  { term: 'Mindfulness', tradition: 'Buddhism', category: 'Spiritual Practices', shortDefinition: 'The practice of present-moment awareness without judgment.', expandedExplanation: 'Mindfulness (Sati) is a Buddhist practice of maintaining moment-to-moment awareness of thoughts, feelings, bodily sensations, and the environment with clarity and non-judgment. It is cultivated through meditation and daily life practice.', relatedTerms: 'Meditation, Awareness, Concentration', commonMisunderstanding: 'Mindfulness is sometimes reduced to a stress-reduction technique, but it is a profound spiritual practice for insight and liberation.', peacebuildingInsight: 'Mindfulness promotes self-awareness, emotional regulation, and compassion, skills essential for peaceful communication and conflict resolution.' },
  { term: 'Meditation', tradition: 'Buddhism', category: 'Spiritual Practices', shortDefinition: 'Mental training practices for concentration and insight.', expandedExplanation: 'Meditation (Bhavana) in Buddhism includes a wide range of practices for developing concentration (samatha), insight (vipassana), loving-kindness (metta), and other qualities. It is the primary method for transforming the mind and realizing liberation.', relatedTerms: 'Mindfulness, Concentration, Samadhi', commonMisunderstanding: 'Meditation is sometimes seen as merely relaxation, but it is a rigorous mental training aimed at profound spiritual transformation.', peacebuildingInsight: 'Meditation practices are now shared across cultures and faiths, demonstrating how spiritual technologies can promote universal well-being and peace.' },
  { term: 'Zen', tradition: 'Buddhism', category: 'Mysticism', shortDefinition: 'A school of Buddhism emphasizing direct experience and meditation.', expandedExplanation: 'Zen (Chan in Chinese) is a school of Mahayana Buddhism that emphasizes direct insight into one\'s true nature through meditation, koans (paradoxical questions), and the guidance of a teacher. It values direct experience over scriptural study.', relatedTerms: 'Meditation, Koan, Satori', commonMisunderstanding: 'Zen is sometimes portrayed as a philosophy rather than a religion, but it is a complete spiritual path with monastic traditions.', peacebuildingInsight: 'Zen\'s emphasis on direct experience and present-moment awareness can help interfaith dialogue move beyond intellectual agreement to shared spiritual experience.' },
  { term: 'Guru Granth Sahib', tradition: 'Sikhism', category: 'Sacred Texts', shortDefinition: 'The eternal living guru and holy scripture of Sikhism.', expandedExplanation: 'The Guru Granth Sahib is the central religious scripture of Sikhism, considered the living Guru. It contains hymns and poetry from Sikh Gurus and saints from Hindu and Muslim traditions, emphasizing the oneness of God, equality of all, and devotional meditation.', relatedTerms: 'Sikhism, Waheguru, Langar', commonMisunderstanding: 'The Guru Granth Sahib is sometimes viewed as just a book, but Sikhs treat it as a living Guru with full reverence and authority.', peacebuildingInsight: 'The Guru Granth Sahib includes writings from multiple traditions, exemplifying interfaith respect long before modern interfaith movements.' },
  { term: 'Waheguru', tradition: 'Sikhism', category: 'Theology', shortDefinition: 'The Wonderful Lord, the supreme being in Sikhism.', expandedExplanation: 'Waheguru is the Sikh name for God, meaning "Wonderful Lord" or "Awesome Divine Being." Sikhism emphasizes God as formless, eternal, and beyond human comprehension, yet present in all creation and accessible through meditation and devotion.', relatedTerms: 'God, Nam Simran, Guru Granth Sahib', commonMisunderstanding: 'Waheguru is sometimes compared to a personal deity, but Sikh theology emphasizes God\'s transcendence and immanence beyond human categories.', peacebuildingInsight: 'The Sikh concept of a universal God who is the same for all humanity supports interfaith recognition of shared divine reality.' },
  { term: 'Langar', tradition: 'Sikhism', category: 'Community Life', shortDefinition: 'The community kitchen serving free meals to all visitors.', expandedExplanation: 'Langar is a Sikh institution of a community kitchen that serves free meals to all visitors regardless of religion, caste, gender, or social status. It is a practical expression of equality, service (seva), and the rejection of all discrimination.', relatedTerms: 'Seva, Equality, Community', commonMisunderstanding: 'Langar is sometimes seen as just charity, but it is a radical practice of equality and sacred hospitality.', peacebuildingInsight: 'Langar is a living model of interfaith hospitality, demonstrating that sharing food can break down barriers and build community.' },
  { term: 'Seva', tradition: 'Sikhism', category: 'Ethics & Values', shortDefinition: 'Selfless service performed without expectation of reward.', expandedExplanation: 'Seva (selfless service) is a core value in Sikhism (and other Indian traditions), involving service to others without any expectation of reward or recognition. It is considered a form of worship and a path to spiritual growth.', relatedTerms: 'Langar, Service, Charity', commonMisunderstanding: 'Seva is sometimes reduced to volunteer work, but it is a spiritual discipline of ego-transcendence and love in action.', peacebuildingInsight: 'Seva as selfless service is a universal value that can unite people of all faiths in practical peacebuilding and humanitarian work.' },
  { term: 'Khalsa', tradition: 'Sikhism', category: 'Community Life', shortDefinition: 'The collective body of initiated Sikhs.', expandedExplanation: 'Khalsa is the community of initiated Sikhs founded by Guru Gobind Singh in 1699. Initiated Sikhs follow a code of conduct and wear the Five Ks (physical articles of faith). The Khalsa represents the ideal of the saint-soldier committed to justice.', relatedTerms: 'Five Ks, Amrit, Sikhism', commonMisunderstanding: 'The Khalsa is sometimes seen as militant, but its founding was a stand against oppression and for religious freedom and justice.', peacebuildingInsight: 'The Khalsa ideal of standing up for justice and protecting the vulnerable can inspire interfaith solidarity against oppression.' },
  { term: 'Simran', tradition: 'Sikhism', category: 'Spiritual Practices', shortDefinition: 'The practice of meditative remembrance of God.', expandedExplanation: 'Simran is the Sikh practice of remembering and meditating on God\'s name, often through repetition of Nam (God\'s name). It purifies the mind, cultivates love for God, and leads to spiritual realization. It is central to Sikh spiritual life.', relatedTerms: 'Nam Japna, Meditation, Dhikr', commonMisunderstanding: 'Simran is sometimes seen as mechanical repetition, but it is a heart-centered practice of love and remembrance.', peacebuildingInsight: 'Simran parallels dhikr in Islam and other remembrance practices, showing how diverse traditions cultivate divine presence through focused devotion.' },
  { term: 'Compassion', tradition: 'Interfaith / Shared Values', category: 'Ethics & Values', shortDefinition: 'The recognition of suffering and the desire to alleviate it.', expandedExplanation: 'Compassion is a universal ethical value found in every major religious and philosophical tradition. It involves empathy, kindness, and active care for others, especially those who are suffering. It is considered the foundation of moral life across traditions.', relatedTerms: 'Mercy, Love, Karuna, Chesed', commonMisunderstanding: 'Compassion is sometimes confused with pity, but true compassion is empathetic action that recognizes our shared humanity.', peacebuildingInsight: 'Compassion is the most universally recognized value across faiths, making it the strongest foundation for interfaith peacebuilding.' },
  { term: 'Mercy', tradition: 'Interfaith / Shared Values', category: 'Ethics & Values', shortDefinition: 'Compassionate forgiveness and kindness toward others.', expandedExplanation: 'Mercy is the quality of compassion, forgiveness, and kindness shown toward those who have done wrong or are in need. It is emphasized in all major religious traditions as a divine attribute and a human virtue. Mercy tempers justice with love.', relatedTerms: 'Compassion, Forgiveness, Grace, Rahma', commonMisunderstanding: 'Mercy is sometimes seen as weakness, but it requires great moral strength and wisdom.', peacebuildingInsight: 'Mercy breaks cycles of retaliation and opens pathways to reconciliation, making it essential for peacebuilding.' },
  { term: 'Justice', tradition: 'Interfaith / Shared Values', category: 'Ethics & Values', shortDefinition: 'Fairness, righteousness, and the proper ordering of society.', expandedExplanation: 'Justice is the ethical principle of fairness, moral rightness, and giving each person their due. It is central to all religious traditions, encompassing both individual conduct and social structures. Justice seeks to protect the vulnerable and uphold human dignity.', relatedTerms: 'Righteousness, Equity, Adl', commonMisunderstanding: 'Justice is sometimes reduced to punishment, but its deeper meaning is restoration, equity, and right relationship.', peacebuildingInsight: 'Justice and peace are inseparable; sustainable peace requires just social structures and respect for human rights.' },
  { term: 'Forgiveness', tradition: 'Interfaith / Shared Values', category: 'Ethics & Values', shortDefinition: 'The intentional release of resentment and desire for revenge.', expandedExplanation: 'Forgiveness is the conscious decision to release feelings of anger, resentment, and the desire for revenge toward someone who has caused harm. It is a central teaching in all major faiths and is essential for personal healing and social reconciliation.', relatedTerms: 'Mercy, Reconciliation, Grace', commonMisunderstanding: 'Forgiveness is not the same as forgetting, condoning, or reconciling without accountability.', peacebuildingInsight: 'Forgiveness is essential for breaking cycles of violence and building sustainable peace in families, communities, and nations.' },
  { term: 'Peace', tradition: 'Interfaith / Shared Values', category: 'Peacebuilding', shortDefinition: 'A state of harmony, wholeness, and absence of violence.', expandedExplanation: 'Peace (Shalom, Salam, Shanti) is a comprehensive concept across traditions encompassing inner tranquility, harmonious relationships, social justice, and the absence of war. It is both a divine gift and a human responsibility to cultivate.', relatedTerms: 'Shalom, Salam, Shanti, Harmony', commonMisunderstanding: 'Peace is sometimes reduced to the absence of conflict, but true peace includes justice, well-being, and right relationship.', peacebuildingInsight: 'Peace is the central goal of interfaith work the recognition that all traditions, at their best, seek the peace and flourishing of all.' },
  { term: 'Service', tradition: 'Interfaith / Shared Values', category: 'Ethics & Values', shortDefinition: 'Helping others without expectation of reward.', expandedExplanation: 'Service is the practice of helping others, especially those in need, as an expression of love, compassion, and faith. It is emphasized in every religious tradition and is considered a form of worship and a path to spiritual growth.', relatedTerms: 'Seva, Charity, Sadaqah', commonMisunderstanding: 'Service is sometimes seen as charity from a distance, but authentic service involves personal engagement and respect for those served.', peacebuildingInsight: 'Service projects that bring different faith communities together to address common needs build trust and mutual respect.' },
  { term: 'Humility', tradition: 'Interfaith / Shared Values', category: 'Ethics & Values', shortDefinition: 'The quality of being modest and recognizing one\'s limitations.', expandedExplanation: 'Humility is the virtue of modesty, self-awareness, and the recognition of one\'s place within the larger whole. It is valued across religious traditions as the foundation of wisdom, learning, and right relationship with God and others.', relatedTerms: 'Modesty, Meekness, Tawadu', commonMisunderstanding: 'Humility is sometimes confused with low self-worth, but true humility is accurate self-assessment and openness to others.', peacebuildingInsight: 'Humility enables interfaith dialogue by creating space to listen, learn, and recognize truth in different traditions.' },
  { term: 'Gratitude', tradition: 'Interfaith / Shared Values', category: 'Ethics & Values', shortDefinition: 'Thankfulness and appreciation for blessings received.', expandedExplanation: 'Gratitude is the quality of being thankful and appreciative for the gifts of life, relationships, and divine provision. It is a universal spiritual practice that transforms perspective, fosters contentment, and connects us with the source of all goodness.', relatedTerms: 'Thanksgiving, Shukr, Blessing', commonMisunderstanding: 'Gratitude is sometimes seen as mere politeness, but it is a transformative spiritual practice.', peacebuildingInsight: 'Gratitude shifts focus from what divides us to what we have received, fostering generosity and interfaith appreciation.' },
  { term: 'Nonviolence', tradition: 'Interfaith / Shared Values', category: 'Peacebuilding', shortDefinition: 'The principle of refraining from causing harm to others.', expandedExplanation: 'Nonviolence (Ahimsa) is the ethical principle of not causing harm to any living being through thought, word, or action. It is central to Jainism, Buddhism, and Hinduism, and has been powerfully applied by leaders like Gandhi and Martin Luther King Jr. for social change.', relatedTerms: 'Ahimsa, Peace, Civil Disobedience', commonMisunderstanding: 'Nonviolence is sometimes mistaken for passivity, but it is an active force for justice that requires great courage.', peacebuildingInsight: 'Nonviolence is the most powerful methodology for social change and peacebuilding, proven effective across cultures and faiths.' },
  { term: 'Sacred Ecology', tradition: 'Interfaith / Shared Values', category: 'Peacebuilding', shortDefinition: 'The understanding of nature as spiritually sacred and worthy of reverence.', expandedExplanation: 'Sacred Ecology is the recognition that the natural world is not merely a resource but a manifestation of the divine, worthy of reverence, protection, and care. It is found in Indigenous traditions, Hinduism, Buddhism, Taoism, and the mystical streams of all faiths.', relatedTerms: 'Creation, Stewardship, Nature', commonMisunderstanding: 'Sacred Ecology is sometimes dismissed as nature worship, but it represents a profound spiritual understanding of interconnectedness.', peacebuildingInsight: 'Care for the Earth is a unifying interfaith issue that brings all traditions together around a shared sacred responsibility.' }
]

const comparisonData = [
  { theme: 'Charity', traditions: ['Zakat (Islam)', 'Tzedakah (Judaism)', 'Dana (Buddhism/Hinduism)', 'Charity (Christianity)', 'Seva (Sikhism)'] },
  { theme: 'Prayer', traditions: ['Salah (Islam)', 'Tefillah (Judaism)', 'Prayer (Christianity)', 'Puja (Hinduism)', 'Meditation (Buddhism)'] },
  { theme: 'Fasting', traditions: ['Sawm (Islam)', 'Lent (Christianity)', 'Yom Kippur Fast (Judaism)', 'Upavasa (Hinduism)', 'Monastic Fasts (Buddhism)'] },
  { theme: 'Service', traditions: ['Seva (Sikhism)', 'Charity (Christianity)', 'Tikkun Olam (Judaism)', 'Compassionate Action (Buddhism)', 'Khidmah (Islam)'] },
  { theme: 'Pilgrimage', traditions: ['Hajj (Islam)', 'Pilgrimage (Christianity)', 'Sacred Journeys (Judaism)', 'Tirtha Yatra (Hinduism)', 'Sacred Sites (Buddhism)'] },
  { theme: 'Peace', traditions: ['Salam (Islam)', 'Shalom (Judaism)', 'Shanti (Hinduism/Buddhism)', 'Peace (Christianity)', 'Santih (Sikhism)'] }
]

export default function InterfaithGlossaryPage() {
  const [pageContent, setPageContent] = useState<PageContent[]>([])

  useEffect(() => {
    fetch('/api/page-content?pageKey=interfaith-glossary')
      .then(res => res.ok ? res.json() : [])
      .then(data => setPageContent(data))
      .catch(() => {})
  }, [])

  const content = (key: string) => pageContent.find(p => p.sectionKey === key)

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTradition, setSelectedTradition] = useState('All Traditions')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedLetter, setSelectedLetter] = useState('All')
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const filteredTerms = useMemo(() => {
    return glossaryData.filter(term => {
      const matchesSearch = !searchQuery || [
        term.term, term.tradition, term.category, term.shortDefinition,
        term.expandedExplanation, term.relatedTerms
      ].some(field => field.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesTradition = selectedTradition === 'All Traditions' || term.tradition === selectedTradition

      const matchesCategory = selectedCategory === 'All Categories' || term.category === selectedCategory

      const matchesLetter = selectedLetter === 'All' || term.term[0].toUpperCase() === selectedLetter

      return matchesSearch && matchesTradition && matchesCategory && matchesLetter
    })
  }, [searchQuery, selectedTradition, selectedCategory, selectedLetter])

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedTradition('All Traditions')
    setSelectedCategory('All Categories')
    setSelectedLetter('All')
  }

  const hasActiveFilters = searchQuery || selectedTradition !== 'All Traditions' || selectedCategory !== 'All Categories' || selectedLetter !== 'All'

  return (
    <div>
      <section className="section-premium pt-28 md:pt-36 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 sacred-pattern opacity-60"></div>
        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <div className="inline-flex items-center space-x-2 glass-effect px-4 sm:px-6 py-2 sm:py-3 rounded-xl mb-4 sm:mb-6">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-[#C8A75E]" />
            <span className="text-xs sm:text-sm font-semibold text-[#C8A75E]">{content('hero_badge')?.title || 'Interfaith Knowledge'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl heading-premium text-[#f5f3ee] mb-4 sm:mb-6 leading-tight px-4">
            {content('hero_heading')?.title || 'Interfaith Glossary'}
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-[#aab0d6] mb-4 max-w-2xl mx-auto">
            {content('hero_subtitle')?.content || 'Understanding sacred language across traditions.'}
          </p>

          <p className="text-sm sm:text-base text-premium leading-relaxed max-w-3xl mx-auto mb-8 px-4">
            {content('hero_paragraph')?.content || 'This glossary helps reduce misunderstanding and supports respectful interfaith learning by providing clear, contextual definitions of sacred terms from the world\'s religious traditions.'}
          </p>

          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            <a href="#glossary" className="btn-primary inline-flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              {content('hero_cta_1_text')?.title || 'Explore Terms'}
            </a>
            <a href="#suggest" className="btn-secondary inline-flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              {content('hero_cta_2_text')?.title || 'Suggest a Term'}
            </a>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 sacred-pattern">
        <div className="container mx-auto max-w-4xl">
          <div className="card-premium p-6 sm:p-8 md:p-10 lg:p-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl heading-premium text-[#f5f3ee] mb-6 text-center">
              {content('intro_title')?.title || 'Why This Glossary Exists'}
            </h2>
            <div className="divider-premium max-w-xs mx-auto mb-8"></div>
            <div className="space-y-4 sm:space-y-5 text-sm sm:text-base text-premium leading-relaxed">
              <p>{content('intro_paragraph_1')?.content || 'Across history, humanity has developed countless spiritual traditions, sacred texts, rituals, philosophies, and systems of meaning. Yet many people encounter religious terminology through headlines, social media debates, stereotypes, or incomplete information.'}</p>
              <p>{content('intro_paragraph_2')?.content || 'Misunderstanding of sacred terms creates confusion, fear, and division. When words like Jihad, Dharma, Karma, or Messiah are presented without proper context, they can reinforce prejudice rather than build understanding.'}</p>
              <p className="font-semibold text-[#c8a75e]">{content('intro_paragraph_3')?.content || 'The purpose of this glossary is simple: to replace confusion with understanding, fear with knowledge, and division with meaningful dialogue.'}</p>
              <p>{content('intro_paragraph_4')?.content || 'This glossary is neutral, respectful, and educational. It does not promote, rank, endorse, or criticize any faith tradition. Each term is explained within its historical, cultural, theological, and spiritual framework, using language that reflects how practitioners understand their own beliefs.'}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="glossary" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-[#0B0F2A]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-3xl md:text-4xl heading-premium text-[#f5f3ee] mb-3 sm:mb-4">
              {content('glossary_section_title')?.title || 'Explore Sacred Terms'}
            </h2>
            <div className="divider-premium max-w-xs mx-auto mb-4"></div>
            <p className="text-sm sm:text-base text-[#aab0d6] max-w-2xl mx-auto">
              {content('glossary_section_subtitle')?.content || 'Search, filter, and explore glossary terms by tradition, category, or alphabet.'}
            </p>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#aab0d6]" />
              <input
                type="text"
                placeholder="Search by term, keyword, tradition, theme, or meaning..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-10 py-3 sm:py-4 rounded-xl bg-[#141A3A] border border-[#C8A75E]/30 text-[#f5f3ee] placeholder-[#aab0d6]/60 focus:outline-none focus:border-[#C8A75E] focus:ring-1 focus:ring-[#C8A75E]/30 transition-all text-sm sm:text-base"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#aab0d6] hover:text-[#f5f3ee] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-[#141A3A] border border-[#C8A75E]/30 text-[#f5f3ee] text-sm"
            >
              <span className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-[#C8A75E]"></span>
                )}
              </span>
              {showMobileFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          <div className={`lg:block ${showMobileFilters ? 'block' : 'hidden'} mb-6 space-y-4`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#aab0d6] uppercase tracking-wider mb-2">
                  Tradition
                </label>
                <select
                  value={selectedTradition}
                  onChange={e => setSelectedTradition(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#141A3A] border border-[#C8A75E]/30 text-[#f5f3ee] focus:outline-none focus:border-[#C8A75E] text-sm appearance-none cursor-pointer"
                  style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%2712%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23aab0d6%27 stroke-width=%272%27%3E%3Cpolyline points=%276 9 12 15 18 9%27%3E%3C/polyline%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
                >
                  {traditions.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#aab0d6] uppercase tracking-wider mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#141A3A] border border-[#C8A75E]/30 text-[#f5f3ee] focus:outline-none focus:border-[#C8A75E] text-sm appearance-none cursor-pointer"
                  style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%2712%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23aab0d6%27 stroke-width=%272%27%3E%3Cpolyline points=%276 9 12 15 18 9%27%3E%3C/polyline%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#aab0d6] uppercase tracking-wider mb-2">
                Alphabet
              </label>
              <div className="flex flex-wrap gap-1 sm:gap-1.5">
                {alphabet.map(letter => (
                  <button
                    key={letter}
                    onClick={() => setSelectedLetter(letter)}
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                      selectedLetter === letter
                        ? 'bg-[#C8A75E] text-[#0B0F2A] shadow-md'
                        : 'bg-[#141A3A] text-[#aab0d6] hover:bg-[#C8A75E]/20 hover:text-[#C8A75E] border border-[#C8A75E]/20'
                    }`}
                  >
                    {letter}
                  </button>
                ))}
              </div>
            </div>

            {hasActiveFilters && (
              <div className="flex justify-center">
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#C8A75E] hover:text-[#D4B56D] transition-colors"
                >
                  <X className="w-3 h-3" />
                  Clear all filters
                </button>
              </div>
            )}
          </div>

          <div className="mb-4 text-sm text-[#aab0d6]">
            Showing <span className="text-[#f5f3ee] font-semibold">{filteredTerms.length}</span> term{filteredTerms.length !== 1 ? 's' : ''}
          </div>

          {filteredTerms.length > 0 ? (
            <div className="space-y-4">
              {filteredTerms.map((term, index) => (
                <GlossaryCard
                  key={`${term.term}-${index}`}
                  term={term}
                  isExpanded={expandedTerm === `${term.term}-${index}`}
                  onToggle={() => setExpandedTerm(
                    expandedTerm === `${term.term}-${index}` ? null : `${term.term}-${index}`
                  )}
                />
              ))}
            </div>
          ) : (
            <div className="card-premium p-8 sm:p-12 text-center">
              <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-[#C8A75E]/40 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-[#f5f3ee] mb-2">No glossary terms found</h3>
              <p className="text-sm sm:text-base text-[#aab0d6]">Try another keyword or filter.</p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-4 btn-primary inline-flex items-center gap-2 text-sm"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 sacred-pattern">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <div className="inline-flex items-center space-x-2 glass-effect px-4 sm:px-6 py-2 sm:py-3 rounded-xl mb-4 sm:mb-6">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-[#C8A75E]" />
              <span className="text-xs sm:text-sm font-semibold text-[#C8A75E]">{content('comparison_badge')?.title || 'Shared Values'}</span>
            </div>
            <h2 className="text-xl sm:text-3xl md:text-4xl heading-premium text-[#f5f3ee] mb-3 sm:mb-4">
              {content('comparison_title')?.title || 'Shared Values Across Traditions'}
            </h2>
            <div className="divider-premium max-w-xs mx-auto"></div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="p-3 sm:p-4 text-xs sm:text-sm font-bold text-[#C8A75E] uppercase tracking-wider border-b border-[#C8A75E]/30 bg-[#141A3A] rounded-tl-xl">Theme</th>
                  <th className="p-3 sm:p-4 text-xs sm:text-sm font-bold text-[#f5f3ee] uppercase tracking-wider border-b border-[#C8A75E]/30 bg-[#141A3A]">Across Traditions</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, i) => (
                  <tr key={row.theme} className={`transition-colors hover:bg-[#C8A75E]/5 ${i < comparisonData.length - 1 ? 'border-b border-[#C8A75E]/10' : ''}`}>
                    <td className="p-3 sm:p-4 font-semibold text-[#f5f3ee] text-sm sm:text-base whitespace-nowrap">{row.theme}</td>
                    <td className="p-3 sm:p-4">
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {row.traditions.map((t, j) => (
                          <span
                            key={j}
                            className="px-2.5 py-1 rounded-lg bg-[#141A3A] border border-[#C8A75E]/20 text-[#aab0d6] text-xs sm:text-sm"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-center text-sm text-[#aab0d6] mt-6 max-w-2xl mx-auto">
            {content('comparison_note')?.content || 'The goal is not to suggest equivalence but to encourage understanding of how different traditions express shared human values through their unique languages and practices.'}
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-[#0B0F2A]">
        <div className="container mx-auto max-w-4xl">
          <div className="gradient-border p-6 sm:p-8 md:p-10 text-center">
            <Globe className="w-10 h-10 sm:w-12 sm:h-12 text-[#C8A75E] mx-auto mb-4 sm:mb-6" />
            <h2 className="text-lg sm:text-2xl md:text-3xl heading-premium text-[#f5f3ee] mb-4 sm:mb-6">
              {content('disclaimer_title')?.title || 'Educational Disclaimer'}
            </h2>
            <div className="divider-premium max-w-xs mx-auto mb-6"></div>
            <p className="text-sm sm:text-base text-premium leading-relaxed max-w-3xl mx-auto">
              {content('disclaimer_content')?.content || 'This glossary is designed for educational and peacebuilding purposes. It does not replace formal religious scholarship, clergy guidance, or tradition-specific study. Definitions are presented with respect for the diversity of interpretation within each tradition. Readers are encouraged to consult recognized authorities within each faith for deeper understanding.'}
            </p>
          </div>
        </div>
      </section>

      <section id="suggest" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 sacred-pattern">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-xl sm:text-3xl md:text-4xl heading-premium text-[#f5f3ee] mb-4 sm:mb-6 px-4">
            {content('cta_title')?.title || 'Help Build a Language of Peace'}
          </h2>
          <div className="divider-premium max-w-xs mx-auto mb-6"></div>
          <p className="text-sm sm:text-base md:text-lg text-premium max-w-2xl mx-auto mb-8 px-4">
            {content('cta_text')?.content || 'Suggest a sacred term, contribute educational insight, or help expand the Interfaith Glossary for future learners. Your knowledge can help build bridges of understanding.'}
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            <Link href="/contact-us" className="btn-primary inline-flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              {content('cta_btn_1_text')?.title || 'Suggest a Term'}
            </Link>
            <Link href="/contact-us" className="btn-secondary inline-flex items-center gap-2">
              <Mail className="w-4 h-4" />
              {content('cta_btn_2_text')?.title || 'Contact Us'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function GlossaryCard({ term, isExpanded, onToggle }: { term: GlossaryTerm; isExpanded: boolean; onToggle: () => void }) {
  return (
    <div
      className="card-premium p-4 sm:p-6 cursor-pointer transition-all duration-300"
      onClick={onToggle}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="text-base sm:text-lg font-bold text-[#f5f3ee]">{term.term}</h3>
            <span className="px-2 py-0.5 rounded-md bg-[#C8A75E]/15 text-[#C8A75E] text-xs font-medium border border-[#C8A75E]/20">
              {term.tradition}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#9b59b6]/15 text-[#9b59b6] text-xs font-medium border border-[#9b59b6]/20">
              {term.category}
            </span>
          </div>
          <p className="text-sm text-[#aab0d6]">{term.shortDefinition}</p>
        </div>
        <div className="flex-shrink-0 mt-1">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-[#C8A75E]" />
          ) : (
            <ChevronDown className="w-5 h-5 text-[#aab0d6]" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-[#C8A75E]/20 space-y-4">
          <div>
            <h4 className="text-xs font-semibold text-[#C8A75E] uppercase tracking-wider mb-1">Expanded Explanation</h4>
            <p className="text-sm text-premium leading-relaxed">{term.expandedExplanation}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <h4 className="text-xs font-semibold text-[#aab0d6] uppercase tracking-wider mb-1">Related Terms</h4>
              <p className="text-sm text-[#f5f3ee]">{term.relatedTerms}</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[#aab0d6] uppercase tracking-wider mb-1">Common Misunderstanding</h4>
              <p className="text-sm text-[#d4a07b]">{term.commonMisunderstanding}</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[#aab0d6] uppercase tracking-wider mb-1">Peacebuilding Insight</h4>
              <p className="text-sm text-[#27AE60]">{term.peacebuildingInsight}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
