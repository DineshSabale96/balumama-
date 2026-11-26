// Edit business content here.
export const BUSINESS = {
  name: 'BALUMAMA',
  tagline: 'Build Stronger... Dig Deeper...',
  blessing: '॥ Shri Sant Balumama Prasanna ॥',
  intro:
    'We provide reliable and professional well excavation, breaker work, earth moving and well ring services at reasonable rates.',
  slogan: 'YOUR WORK... OUR COMMITMENT...',
  person: 'Samir Dadas',
  phone: '7058490511',
  address: 'M. Post Surwadi, Tal. Phaltan, Dist. Satara, Maharashtra',
  whatsappMessage: 'Hello Balumama Earthmovers, I would like to enquire about your services.',
};

// Photos live in public/images/site/ (see public/images/README.md)
export const HERO_IMAGE = { src: '/images/site/jcb-backhoe.jpeg', alt: 'JCB backhoe loader digging on a rocky site' };

export const SERVICES = [
  { title: 'Well Excavation', text: '35 to 50 feet well excavation without ramp.', image: '/images/site/long-reach-excavator.jpeg' },
  { title: 'Excavator 220 & 380', text: 'Heavy-duty excavation machinery.', image: '/images/site/jcb-excavator.jpeg' },
  { title: 'Breaker Work', text: 'Rock breaking and hard ground excavation.', image: '/images/site/jcb-backhoe.jpeg' },
  { title: 'Earth Moving', text: 'Professional earth moving and excavation solutions.', image: '/images/site/jcb-excavator.jpeg' },
  { title: 'JCB Services', text: 'JCB excavation and site preparation.', image: '/images/site/jcb-backhoe.jpeg' },
  { title: 'Well Ring Work', text: 'Well ring installation and related work.', image: '/images/site/long-reach-excavator.jpeg' },
];

export const GALLERY = [
  { name: 'JCB Backhoe Loader', text: 'Digging, loading and breaking on rocky ground.', image: '/images/site/jcb-backhoe.jpeg' },
  { name: 'JCB Excavator', text: 'Heavy excavation and earth moving.', image: '/images/site/jcb-excavator.jpeg' },
  { name: 'Long-Reach Excavator', text: 'Long-reach digging for deep work.', image: '/images/site/long-reach-excavator.jpeg' },
];

export const REASONS = [
  'Reliable and professional service',
  'Experienced machinery operation',
  'Well excavation without ramp',
  'Suitable for deep well excavation',
  'Affordable and reasonable rates',
  'Customer satisfaction and commitment',
];

export const SERVICE_OPTIONS = [...SERVICES.map((s) => s.title), 'Other'];
