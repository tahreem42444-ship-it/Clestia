const HOROSCOPE_BANK: Record<string, string[]> = {
  aries: [
    "Today, your inner fire burns bright, urging you to take the initiative on a project you've been delaying. Seek out bold actions, but remember that patience is a powerful form of strength. Direct your energy mindfully.",
    "A surge of pioneering energy guides you toward untrodden paths. Take this moment to reflect on your goals and take one brave step. The universe rewards your courage today, so trust your first instincts.",
    "The cosmic currents invite you to balance your passion with diplomacy. You may feel a strong impulse to lead, but listening to others will reveal key insights. Channel your drive into collaborative efforts.",
    "Your enthusiasm is contagious today, making it a perfect time for starting fresh. Focus on personal growth and let go of old frustrations. Trust the journey and allow your natural confidence to shine.",
    "Dynamic celestial forces support your ambitions. Keep your focus sharp and avoid minor distractions. A quiet moment of self-reflection tonight will help ground your fiery spirit for the week ahead.",
  ],
  taurus: [
    "Calm, sensory, and rooted in the physical, today invites you to savor the quiet moments. Connect with nature and slow down. Patience is your greatest ally as you build something lasting.",
    "Financial stability and aesthetic comfort are in focus today. A steady approach to your goals yields steady progress. Avoid sudden shifts, and trust the foundation you have carefully built.",
    "The celestial energy highlights your loyal and steady nature. Nourish your closest relationships with presence and care. Your reliability is a comfort to those around you in turbulent waters.",
    "Take a moment to pamper yourself and appreciate sensory delights. A quiet dinner, beautiful music, or a walk in the park can rejuvenate your spirit. Let yourself feel grounded and at peace.",
    "Stubbornness might arise today, but adaptability can open new doors. Keep your heart open to suggestions while maintaining your values. True strength lies in silent, steady perseverance.",
  ],
  gemini: [
    "Your curiosity is heightened today, prompting quick connections and unexpected conversations. Follow your intellectual impulses; a casual talk may lead to a brilliant idea. Stay open.",
    "A day filled with variety and communication. Your verbal expression is particularly sharp, making it an excellent time to write, present, or negotiate. Express your ideas with clarity.",
    "Lighthearted and playful cosmic winds carry you. Do not feel pressured to stick to one task; exploring multiple interests will keep your energy high. Adaptability is your superpower today.",
    "A puzzle or mental challenge will capture your interest. Share your findings with a friend or colleague. Cultivate the joy of learning simply for the sake of knowing.",
    "With your ruler Mercury active, your mind moves at lightning speed. Remember to pause and breathe to prevent mental fatigue. Ground yourself with a brief meditation or journaling session.",
  ],
  cancer: [
    "Emotional currents run deep today. Create a sanctuary of comfort and safety in your home. Nurturing yourself and your loved ones is the highest priority under these stars.",
    "Your intuition is highly active. Pay attention to the subtle vibes and gut feelings you receive in your interactions. Trust your inner voice to navigate complex social spaces.",
    "A nostalgic mood may sweep in, encouraging you to revisit sweet memories. Reach out to a family member or close friend. Sharing stories from the past will strengthen your bonds.",
    "Protect your sensitive energy today. It is okay to set boundaries and take time for yourself. Resting in your shell will restore the tenderness you need for the world.",
    "An opportunity to extend care and comfort to someone in need will present itself. Your natural empathy is a healing force. Share your warmth, but don't exhaust your own reserves.",
  ],
  leo: [
    "Your natural visibility shines bright today, Leo. Step into the spotlight and lead with warmth and generosity. Your confidence inspires those around you to express themselves freely.",
    "A creative impulse is looking for expression. Whether through art, style, or performance, let your authentic self be seen. The universe supports bold, creative achievements.",
    "Your royal heart is called to support others. Offer appreciation and praise to someone who deserves it. Your encouragement is a powerful gift that builds lasting loyalty.",
    "Playful and dramatic celestial alignments make it a perfect day for celebration or leisure. Bring joy and laughter to your spaces. Let your inner child run free and lead the way.",
    "Focus on aligning your pride with humility. True leadership is about lifting others up rather than seeking validation. Trust your inner light to guide your actions today.",
  ],
  virgo: [
    "An analytical and observant mindset helps you refine your daily routines today. A small improvement in your habits or workspace will yield a great sense of peace. Devote yourself to craft.",
    "Pay close attention to details, as your precision is your greatest asset now. Organise, clean, or edit what needs structure. Your thoughtful service brings order to chaotic spaces.",
    "A quiet dedication to learning or helping others brings deep satisfaction. Do not rush the process; master your skills with patience. Your effort is noticed and highly valued.",
    "Avoid excessive self-criticism or perfectionism today. The stars remind you that progress is more important than absolute perfection. Embrace the beauty of minor imperfections.",
    "Connect with the earth and practical reality. A wholesome meal, some gardening, or organizing your bookshelf will help settle your busy mind. Ground yourself in simple tasks.",
  ],
  libra: [
    "Cosmic energies focus on relationship harmony today. Seek balance in your interactions and practice active listening. Your charm and fairness can bridge any divide gracefully.",
    "An eye for beauty and aesthetics guides your day. Rearrange your environment or create something pleasing. Surrounding yourself with balance and art will soothe your mind.",
    "Decisiveness might be challenging today as you weigh all perspectives. Take your time; a balanced decision is better than a rushed one. Trust your internal sense of harmony.",
    "A wonderful day for social connection. Reach out to a partner or collaborator. The synergy of working together brings peace and creative breakthroughs. Cooperate with ease.",
    "Remember to balance your desire to please others with your own needs. Saying no is a form of maintaining internal peace. Honor your boundaries while staying kind.",
  ],
  scorpio: [
    "A day of emotional depth and intense focus. You are drawn to what lies beneath the surface. Trust your highly perceptive nature to uncover hidden truths and deep connections.",
    "A powerful bond can be strengthened today through honest conversation. Don't fear vulnerability; sharing your private thoughts creates lasting intimacy. Trust is your key word.",
    "Transformative energies invite you to release old grudges or habits that no longer serve you. Rebirth comes from letting go. Embrace the change and step into your personal power.",
    "Keep your plans close to your chest today. A private, focused approach allows you to work without distraction. Your magnetic pull is strongest when you are quietly determined.",
    "Avoid power struggles or control issues. Channel your intense passion into creative work or research. Your ability to concentrate deeply will solve a long-standing mystery.",
  ],
  sagittarius: [
    "Your adventurous spirit is calling today, Sagittarius. Chase new horizons, whether through travel, study, or trying something completely outside your comfort zone. The world is yours to explore.",
    "An optimistic and philosophical mindset allows you to see the big picture. Share your vision and enthusiasm with others. Your honest, free spirit is a breath of fresh air.",
    "A restless urge for freedom might make routine tasks feel constricting. Seek out variety and physical movement. Let your mind wander to big, expansive ideas.",
    "A conversation about meaning, beliefs, or philosophy will stimulate your intellect. Stay open-minded while sharing your truths. Growth comes from exchanging perspectives.",
    "Trust the journey and keep your expectations high. A positive attitude attracts favorable opportunities today. Let go of worry and run toward what excites you.",
  ],
  capricorn: [
    "Steady, structured, and disciplined energy supports your long-term ambitions today. Build slowly but surely. Your patient determination is preparing the ground for future success.",
    "Professional goals and responsibilities are highlighted. Take charge of a project or lead with authority. Your wisdom and reliable guidance will be highly appreciated by others.",
    "A quiet sense of duty and mastery brings peace. Focus on executing your tasks with integrity. The universe rewards those who honor their commitments with patience.",
    "Take a moment to check in on your physical foundations: posture, budget, or home structure. Taking care of details now prevents future issues. Trust solid, proven methods.",
    "Be careful not to work yourself to exhaustion. Remember that rest is a critical component of productivity. A wise leader knows when to pause and gather strength.",
  ],
  aquarius: [
    "Your inventive and original mind is active today. Look at problems from a fresh, unconventional angle. Your independent thinking will lead to unique, future-facing solutions.",
    "A strong draw toward community, humanitarian causes, or collaborating with like-minded individuals. Share your idealistic visions. Together, you can reimagine a better future.",
    "Celebrate your individuality today. You don't need to blend in or follow the crowd. Your unique style and thoughts are your greatest gifts. Walk your own path.",
    "An unexpected insight or moment of sudden inspiration might shift your direction. Keep your mind open to new technologies or modern concepts. Stay adaptable.",
    "Remember that intellectual connections need emotional warmth to truly thrive. Share not just your ideas, but your heart. Cultivate gentle, empathetic listening.",
  ],
  pisces: [
    "A dreamy, imaginative, and highly empathic day lies ahead. Let your creative currents flow freely through art, writing, or daydreaming. Live close to your inner feelings.",
    "Your natural intuition is exceptionally strong today. Pay attention to your dreams and quiet thoughts. The invisible currents of the universe are whispering guidance.",
    "A gentle, nurturing presence helps soothe those around you. Offer a listening ear or a quiet word of comfort. Your empathy is a healing balm in stressful times.",
    "Protect your sensitive heart from harsh environments. Spend time near water, with art, or in quiet solitude to replenish your spirit. Emotional rest is vital for you.",
    "Let go of control and flow with the current of the day. Trust that you are exactly where you need to be. A magical connection or coincidence may brighten your evening.",
  ],
};

function getSeed(str: string, date: Date): number {
  const y = date.getFullYear();
  const m = date.getMonth();
  const d = date.getDate();
  const inputStr = `${str.toLowerCase()}-${y}-${m}-${d}`;
  let hash = 0;
  for (let i = 0; i < inputStr.length; i++) {
    hash = (hash << 5) - hash + inputStr.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getDailyHoroscope(signName: string, date: Date = new Date()): string {
  const key = signName.toLowerCase();
  const bank = HOROSCOPE_BANK[key] || HOROSCOPE_BANK.aries;
  const seed = getSeed(signName, date);
  return bank[seed % bank.length];
}
