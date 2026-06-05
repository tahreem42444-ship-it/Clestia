export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  readTime: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "Understanding Your Sun Sign",
    slug: "understanding-your-sun-sign",
    excerpt:
      "Learn how the sun's position at your birth shapes your core identity, ego, and primary path in life.",
    content: `Your Sun sign is the foundation of your astrological identity. In astrology, the Sun represents your ego, core identity, and the light you shine into the world. It dictates your basic personality traits and the primary journey of self-realization you embark upon.

While many people think astrology begins and ends with their Sun sign, it is actually just one piece of your complete birth chart (which also includes your Moon sign, Rising sign, and placement of other planets). However, understanding your Sun sign's element and modality is a powerful first step in self-reflection.

For instance, Fire signs (Aries, Leo, Sagittarius) tend to lead with action and enthusiasm, while Earth signs (Taurus, Virgo, Capricorn) value stability and concrete results. Air signs (Gemini, Libra, Aquarius) prioritize intellect and connection, and Water signs (Cancer, Scorpio, Pisces) experience life through deep emotional lenses. Reflect on how your Sun sign's qualities show up in your daily life.`,
    author: "Celestia Astrologist",
    readTime: "3 min read",
  },
  {
    id: "2",
    title: "Elements in Astrology",
    slug: "elements-in-astrology",
    excerpt:
      "Discover the four elemental groupings—Fire, Earth, Air, and Water—and how they govern temperament.",
    content: `The twelve signs of the zodiac are divided into four essential elements: Fire, Earth, Air, and Water. Each element represents a fundamental way of experiencing reality and responding to the world around us.

- **Fire (Aries, Leo, Sagittarius):** The element of energy, passion, and initiative. Fire signs are warm, creative, and action-oriented. They navigate life based on inspiration and impulse.
- **Earth (Taurus, Virgo, Capricorn):** The element of practicality, physical reality, and structure. Earth signs are grounded, sensual, and reliable. They process life through concrete facts and sensory experiences.
- **Air (Gemini, Libra, Aquarius):** The element of intellect, communication, and social connection. Air signs are curious, objective, and analytical. They experience life as a network of ideas and relationships.
- **Water (Cancer, Scorpio, Pisces):** The element of emotion, intuition, and sensitivity. Water signs are empathetic, imaginative, and deeply feeling. They navigate the world through quiet undercurrents of emotion.

By understanding the balance of elements in your profile and relationships, you can identify areas of strength and potential tension, seeking balance when one element dominates.`,
    author: "Celestia Astrologist",
    readTime: "4 min read",
  },
  {
    id: "3",
    title: "What Birthstones Symbolize",
    slug: "what-birthstones-symbolize",
    excerpt:
      "Explore the ancient origins, traditional meanings, and symbolic benefits of monthly birthstones.",
    content: `Birthstones are gemstones traditionally associated with each month of the Gregorian calendar. The origins of birthstones trace back to ancient times, with roots in the Breastplate of Aaron described in the Book of Exodus, which held twelve gemstones representing the twelve tribes of Israel. Over centuries, these stones became connected to the twelve signs of the zodiac and eventually the twelve months.

Each birthstone carries rich symbolic meanings. For example, February's Amethyst represents clarity, peace, and protection, and is traditionally associated with relieving stress and balancing mood. September's Sapphire represents wisdom, integrity, and nobility.

While modern science does not attribute physical healing or magical properties to these stones, they remain beloved symbols for self-reflection and personal connection. Wearing or meditating on your birthstone can serve as a gentle reminder of the positive qualities you wish to cultivate in your life.`,
    author: "Celestia Astrologist",
    readTime: "3 min read",
  },
  {
    id: "4",
    title: "How Compatibility Readings Work",
    slug: "how-compatibility-readings-work",
    excerpt:
      "A guide to understanding how elemental and modal alignments explain the dynamics between two signs.",
    content: `Astrological compatibility, traditionally known as synastry, is the study of how two individual birth charts interact with one another. In our Celestia MVP, we use the core alignments of the Sun signs—specifically elements and modalities—to calculate a compatibility score for love and friendship.

When checking compatibility, we look at:
1. **Elemental Harmony:** Signs sharing harmonious elements (e.g., Fire + Air, or Earth + Water) tend to support each other naturally. Fire heats Air, and Air fans Fire. Water nurtures Earth, and Earth shapes Water. Same-element relationships offer instant understanding but can sometimes lack balancing perspectives.
2. **Modality Dynamics:** The modalities (Cardinal, Fixed, and Mutable) describe how signs initiate and manage change. Same-modality relationships (e.g., two Fixed signs) can result in stubborn standoffs, whereas different modalities often help balance the partnership.

Remember, compatibility percentages are tools for reflection and entertainment. Real-world relationships rely on communication, respect, and mutual effort far more than birth chart geometry. Use these readings to spark meaningful conversations with your loved ones!`,
    author: "Celestia Astrologist",
    readTime: "4 min read",
  },
  {
    id: "5",
    title: "Daily Horoscopes as Reflection Prompts",
    slug: "daily-horoscopes-as-reflection-prompts",
    excerpt:
      "How to use daily planetary forecasts as mindfulness prompts for journaling and self-awareness.",
    content: `Many people read their daily horoscope looking for predictions of the future. However, a more mindful approach is to use daily horoscopes as reflection prompts. Rather than viewing the horoscope as a set-in-stone prediction, consider it a mirror for your current thoughts and feelings.

If your horoscope advises you to balance passion with patience, ask yourself: *Where in my life am I feeling rushed or impatient? How can I practice gentleness today?* If it suggests focus and discipline, reflect on *what goals truly matter to me right now.*

By treating daily horoscopes as symbolic mindfulness prompts, you transform them from casual entertainment into a powerful tool for journaling and daily self-awareness. Let the stars guide your inner conversation.`,
    author: "Celestia Astrologist",
    readTime: "3 min read",
  },
];
