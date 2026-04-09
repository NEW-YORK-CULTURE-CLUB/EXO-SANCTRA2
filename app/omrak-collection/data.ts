export type OmrakArtwork = {
  id: number;
  slug: string;
  title: string;
  image: string;
  description: string;
  arId?: string; // matches AR_ARTWORKS id in /ar page
  usdzPath?: string;
  glbPath?: string;
};

export const omrakArtworks: OmrakArtwork[] = [
  {
    id: 1,
    slug: 'planet-of-love',
    title: 'Planet of Love',
    image: '/vault/Characters for AR_Art Collection/Planet of Love.jpg',
    description:
      "What if every hidden, loud, sensual, dreamy, quiet, and weird part of you had a place to gather, to hold each other and give love without fear? What if they could all live on one strange planet together without judgment, just peace? That planet already lives inside of you. The more you feed the creatures there with a rain of raw love, dripping down like permission, the more they grow—and the more they love you back. Nothing inside you was ever too much; it just needed space to exist.",
    arId: 'artwork-1',
    glbPath: '/vault/AR/artwork 1_planet of love_character.glb',
    usdzPath: '/vault/AR/artwork 1_planet of love_character.usdz',
  },
  {
    id: 2,
    slug: 'the-unburied-ones',
    title: 'The Unburied Ones',
    image: '/vault/Characters for AR_Art Collection/The Unburied Ones.jpg',
    description:
      "There is something in this world that never disappears. The past doesn't stay buried—it breathes quietly through your bones, shaping instincts and impulses, guiding choices in ways you may not see but always feel. It lives in your spirit and flows through your intuition. These breathing ghosts are fragments of memory still unfolding in the present, reminding you that you are more than one story, more than one body, more than one life. In this moment, it is in your power to transform both the past and the future.",
    arId: 'artwork-2',
    glbPath: '/vault/AR/artwork 2_the unburied ones_character.glb',
    usdzPath: '/vault/AR/artwork 2_the unburied ones_character.usdz',
  },
  {
    id: 3,
    slug: 'ugly-is-beautiful',
    title: 'Ugly is Beautiful',
    image: '/vault/Characters for AR_Art Collection/Ugly is Beautiful.jpg',
    description:
      "Beauty doesn't live in perfection. It lives in the cracks, in the scars, in the trembling places that refuse to be erased. What looks ugly at first is often the truest form of grace. There is a strange light in the broken, a glow that appears only when something dares to show itself as it really is. Ugly is beautiful because it is real, because it doesn't hide its dirt behind a powdered mask—and once you recognize it, you begin to recognize yourself, turning the hidden self inside out so it can finally breathe beyond human skin.",
  },
  {
    id: 4,
    slug: 'my-freak-family',
    title: 'My Freak Family',
    image: '/vault/Characters for AR_Art Collection/My Freak Family.jpg',
    description:
      "Have you ever touched someone's body or looked into someone's eyes and felt your own reflection looking back at you? The kind of soul-touch that makes your strangeness stop aching because it finally finds its healing mirror. Your true family is not the ones who share your blood or your genes—it is the ones who can sit with your dark corners, your mold, your puddles of tears, and still grow gardens from them. They see that you are already whole when you are real. This is a family built not on rules, but on courage, vulnerability, and radical acceptance.",
    arId: 'artwork-4',
    glbPath: '/vault/AR/artwork 4_my freak family_character.glb',
    usdzPath: '/vault/AR/artwork 4_my freak family_character.usdz',
  },
  {
    id: 5,
    slug: 'exorcise-me-whole',
    title: 'Exorcise Me Whole',
    image: '/vault/Characters for AR_Art Collection/Exorcise Me Whole.jpg',
    description:
      "Parasites grow when you keep your mouth shut and hide your hands shaking from fear. You let strangers carve rules into your bones, rules that were never yours. Vomit the silence until you choke on your own freedom. Spit on their laws. Let your blood ink their unholy pages. Scream until your ribs nearly crack, burn so hot your shame turns to ash, and seal the holes they crawl through. This world is yours—will you let them touch it again, or will you open your hands and take it back?",
  },
  {
    id: 6,
    slug: 'homebound-galaxy',
    title: 'Homebound Galaxy',
    image: '/vault/Characters for AR_Art Collection/Homebound Galaxy.jpg',
    description:
      "Find the secret galaxy tucked in your ribs. Breathe the stars in slowly. Little planets spin, comet-like memories arc across, and small suns keep the dark from swallowing you whole. These interior orbits protect the fragile, tender parts of you. Wherever you go, your universe goes with you—an inner home that stays full, a stubborn light that will not leave even when hope feels far away.",
  },
  {
    id: 7,
    slug: 'liquid-desire',
    title: 'Liquid Desire',
    image: '/vault/Characters for AR_Art Collection/Liquid Desire.jpg',
    description:
      "Desire is a leak you learn to trust. It finds the seams you thought were sewn shut, wets the places shame told you to keep dry, and loosens your body until you can breathe wider than you thought possible. A warm, cosmic flow that knows you when you're naked nudges you toward whatever makes you feel alive and carries your deepest feelings like a tide. Wanting and feeling are not weaknesses—they are fuel that teaches your body to give itself permission, to melt slowly and release everything you've been holding for human centuries.",
    arId: 'artwork-7',
    glbPath: '/vault/AR/artwork 7_liquid desire_character.glb',
    usdzPath: '/vault/AR/artwork 7_liquid desire_character.usdz',
  },
  {
    id: 8,
    slug: 'cleansing-rite',
    title: 'Cleansing Rite',
    image: '/vault/Characters for AR_Art Collection/Cleansing Rite.jpg',
    description:
      "Sometimes things inside you have to die. Fluids that once fed you turn sour, old rules rot into sludge, and the only medicine is to make a clean wound of it—call the muck forward, see it, and let it go. This piece names that ugly alchemy: death, discharge, the slow turning of waste into light. The ritual is not neat or painless. You scrape, you wash, you watch what drains away, and choose your own honest mud over the puddles other people left behind. Choose your dirt. Choose your clean.",
    arId: 'artwork-8',
    glbPath: '/vault/AR/artwork 8_cleansing rite_character.glb',
    usdzPath: '/vault/AR/artwork 8_cleansing rite_character.usdz',
  },
  {
    id: 9,
    slug: 'taste-the-power',
    title: 'Taste the Power',
    image: '/vault/Characters for AR_Art Collection/Taste the Power.jpg',
    description:
      "Power feels like heat in hands that used to be frozen. To hold it is to feel appetite and honor at the same time, a knowing that lives in the body—a hunger for honest consequence. It wakes you to the fact that authority is earned every morning, in small choices and loud ones, in what you answer and what you refuse. It pushes you toward fierce creation and necessary undoing. Own your will: strengths and flaws as one force.",
  },
  {
    id: 10,
    slug: 'necroflora',
    title: 'Necroflora',
    image: '/vault/Characters for AR_Art Collection/Necroflora.jpg',
    description:
      "Where others close graves, something else opens—colorful, wet, and free. Decay becomes soil, and from rotten places new flesh pushes up, fresh bodies that feel like beginnings. It is ugly and intimate at once, a violent tenderness that insists on living out of what was left to die. Your loss can seed new shapes. Your ruins can feed growth. Choose the scar that opens a new reality, tend that strange garden, and let the bloom be your truth.",
    arId: 'artwork-10',
    glbPath: '/vault/AR/artwork 10_necroflora_character.glb',
    usdzPath: '/vault/AR/artwork 10_necroflora_character.usdz',
  },
  {
    id: 11,
    slug: 'let-go',
    title: 'Let Go',
    image: '/vault/Characters for AR_Art Collection/Let Go.jpg',
    description:
      'Deep inside, notice how you open wide. Swim deeper and deeper. Can you feel it? Can you hear it? This is your truth.',
  },
];
