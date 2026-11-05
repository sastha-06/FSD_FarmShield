/**
 * FarmShield Plant Disease & Botanical Pathology Database
 * Corresponds to all 38 classes of the rodynaemad/plant-disease-dinov2-small model
 * Trained on the PlantVillage benchmark dataset (14 crop species, 26 diseases, 12 healthy classes)
 * References: ICAR, TNAU Agritech Portal, PlantVillage & University Agricultural Extensions
 */

export const SUPPORTED_CROPS = [
  'Rice',
  'Paddy',
  'Apple',
  'Blueberry',
  'Cherry',
  'Corn',
  'Maize',
  'Grape',
  'Orange',
  'Citrus',
  'Peach',
  'Pepper',
  'Bell Pepper',
  'Capsicum',
  'Potato',
  'Raspberry',
  'Soybean',
  'Squash',
  'Strawberry',
  'Tomato',
];

export const CROP_CANONICAL_MAP = {
  rice: 'Rice',
  paddy: 'Rice',
  'paddy / rice': 'Rice',
  'rice / paddy': 'Rice',
  நெல்: 'Rice',
  धान: 'Rice',
  వరి: 'Rice',
  ಭತ್ತ: 'Rice',
  നെല്ല്: 'Rice',
  apple: 'Apple',
  blueberry: 'Blueberry',
  cherry: 'Cherry',
  corn: 'Corn (Maize)',
  maize: 'Corn (Maize)',
  grape: 'Grape',
  grapes: 'Grape',
  orange: 'Orange',
  citrus: 'Orange',
  peach: 'Peach',
  pepper: 'Pepper, bell',
  'bell pepper': 'Pepper, bell',
  capsicum: 'Pepper, bell',
  chilli: 'Pepper, bell',
  chili: 'Pepper, bell',
  potato: 'Potato',
  raspberry: 'Raspberry',
  soybean: 'Soybean',
  soya: 'Soybean',
  squash: 'Squash',
  pumpkin: 'Squash',
  strawberry: 'Strawberry',
  tomato: 'Tomato',
};

export const PLANT_DISEASE_PROFILES = {
  // ---------------- APPLE (4 classes) ----------------
  Apple___Apple_scab: {
    crop: 'Apple',
    condition: 'Apple Scab',
    isHealthy: false,
    pathogen: 'Fungus (Venturia inaequalis)',
    description: 'Olive-green to dull brown velvety spots on leaf surfaces and fruit. Severe infection leads to premature leaf fall and stunted fruit development.',
    symptoms: [
      'Velvety olive-green lesions turning dark brown to black on upper leaf surface',
      'Leaf curling, distortion, and premature summer defoliation',
      'Cork-like scab lesions on apple fruit skin'
    ],
    management: {
      cultural: 'Rake and destroy fallen leaves in autumn to eliminate overwintering ascospores. Prune canopy to improve air circulation.',
      organic: 'Apply sulfur or copper octanoate spray during bud break; use biocontrol agent Bacillus subtilis.',
      chemical: 'Apply protectant fungicides like Captan (0.2%) or Mancozeb (0.25%), or systemic fungicides like Difenoconazole at green tip and petal fall stages.',
      preventive: 'Plant scab-resistant cultivars (e.g., Liberty, Prima) and avoid overhead irrigation.'
    }
  },
  Apple___Black_rot: {
    crop: 'Apple',
    condition: 'Black Rot (Frogeye Leaf Spot)',
    isHealthy: false,
    pathogen: 'Fungus (Diplodia seriata / Botryosphaeria obtusa)',
    description: 'Produces frogeye leaf spots with purple margins and tan centers, limb cankers, and firm black rot on maturing fruit.',
    symptoms: [
      'Circular purple spots that enlarge with concentric tan centers (frogeye appearance)',
      'Dark sunken cankers on twigs and scaffold branches',
      'Black rot and mummy mummification of maturing fruit'
    ],
    management: {
      cultural: 'Prune out dead wood, fire-blight cankers, and remove all mummified fruit from the orchard.',
      organic: 'Bordeaux mixture (1%) application during dormant season; bio-rational copper sprays.',
      chemical: 'Foliar sprays of Thiophanate-methyl, Captan, or Strobilurin (Kresoxim-methyl) from tight cluster through cover sprays.',
      preventive: 'Maintain tree vigor with balanced fertilizer and minimize mechanical wounding during harvesting.'
    }
  },
  Apple___Cedar_apple_rust: {
    crop: 'Apple',
    condition: 'Cedar Apple Rust',
    isHealthy: false,
    pathogen: 'Fungus (Gymnosporangium juniperi-virginianae)',
    description: 'Heteroecious rust requiring Eastern red cedar/juniper and apple hosts. Bright yellow-orange leaf spots with black fruiting structures.',
    symptoms: [
      'Bright yellow-orange circular lesions on upper leaf surface with red halos',
      'Tube-like aecia structures developing on lower leaf surface under lesions',
      'Premature defoliation during mid-summer under heavy spore load'
    ],
    management: {
      cultural: 'Remove nearby Eastern red cedar (Juniperus virginiana) trees within a 1-2 km radius if feasible; prune cedar galls.',
      organic: 'Sulfur-based fungicides applied preventively just as orange cedar spore horns gelatinize in spring rains.',
      chemical: 'Apply Myclobutanil, Difenoconazole, or Mancozeb from pink bud until 2-3 weeks after petal fall.',
      preventive: 'Choose rust-resistant apple rootstocks and scions (e.g., Enterprise, Freedom).'
    }
  },
  Apple___healthy: {
    crop: 'Apple',
    condition: 'Healthy Foliage',
    isHealthy: true,
    pathogen: 'None - Foliage is Healthy',
    description: 'Vibrant green, intact apple leaves with smooth lamina, normal serration, and clear vascular venation.',
    symptoms: ['Uniform chlorophyll distribution', 'Turgid intact leaf blades', 'No necrotic lesions or fungal sporulation'],
    management: {
      cultural: 'Maintain seasonal mulch, canopy pruning for sunlight penetration, and balanced irrigation.',
      organic: 'Compost tea foliar drench and balanced organic matter maintenance.',
      chemical: 'No chemical intervention required.',
      preventive: 'Regular weekly orchard scouting to catch early foliar blemishes.'
    }
  },

  // ---------------- BLUEBERRY (1 class) ----------------
  Blueberry___healthy: {
    crop: 'Blueberry',
    condition: 'Healthy Foliage',
    isHealthy: true,
    pathogen: 'None - Foliage is Healthy',
    description: 'Normal glossy green elliptical blueberry leaves without leaf spots, rust pustules, or interveinal chlorosis.',
    symptoms: ['Glossy deep green leaf lamina', 'No marginal leaf scorch', 'Vigorous cane and shoot extension'],
    management: {
      cultural: 'Maintain acidic soil pH (4.5 - 5.2) using elemental sulfur and organic pine bark mulch.',
      organic: 'Mycorrhizal inoculation and organic composted pine needle mulching.',
      chemical: 'No chemical treatment needed.',
      preventive: 'Ensure continuous drip irrigation and avoid alkaline water sources.'
    }
  },

  // ---------------- CHERRY (2 classes) ----------------
  'Cherry_(including_sour)___Powdery_mildew': {
    crop: 'Cherry',
    condition: 'Powdery Mildew',
    isHealthy: false,
    pathogen: 'Fungus (Podosphaera clandestina)',
    description: 'White powdery fungal mycelium covering young leaves and shoots, causing curling, blistering, and reduced photosynthesis.',
    symptoms: [
      'Patches of white talcum-like powdery growth on both leaf surfaces',
      'Upward leaf rolling, distortion, and stunted shoot terminals',
      'Deformed, dull fruit with web-like russeting'
    ],
    management: {
      cultural: 'Prune dense canopies to promote air circulation and sunlight penetration; avoid excessive vegetative nitrogen.',
      organic: 'Apply potassium bicarbonate (0.3%), horticultural mineral oil, or neem oil (0.5%) upon earliest sign.',
      chemical: 'Spray systemic fungicides like Myclobutanil, Tebuconazole, or Fluxapyroxad beginning at shuck fall.',
      preventive: 'Time fungicide applications early in the season before mildew colonies establish on terminal growth.'
    }
  },
  'Cherry_(including_sour)___healthy': {
    crop: 'Cherry',
    condition: 'Healthy Foliage',
    isHealthy: true,
    pathogen: 'None - Foliage is Healthy',
    description: 'Healthy cherry leaves displaying characteristic serrated margins, symmetrical lamina, and vibrant green color.',
    symptoms: ['Glossy serrated foliage', 'Absence of shot-hole or powdery patches', 'Robust new shoot growth'],
    management: {
      cultural: 'Maintain balanced pruning and post-harvest orchard hygiene.',
      organic: 'Regular organic mulching and microbial soil conditioning.',
      chemical: 'No chemical fungicides necessary.',
      preventive: 'Monitor for bacterial canker during humid spring conditions.'
    }
  },

  // ---------------- CORN / MAIZE (4 classes) ----------------
  'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot': {
    crop: 'Corn (Maize)',
    condition: 'Gray Leaf Spot (Cercospora)',
    isHealthy: false,
    pathogen: 'Fungus (Cercospora zeae-maydis)',
    description: 'Tan to gray rectangular lesions strictly bounded by leaf veins, coalescing under warm humid conditions to cause blighting.',
    symptoms: [
      'Small tan spots that elongate into narrow rectangular lesions bounded by veins',
      'Gray cast on lesions during humid periods due to fungal sporulation',
      'Severe premature foliar blighting and lodging due to stalk cannibalization'
    ],
    management: {
      cultural: 'Rotate away from maize for at least one year; incorporate previous crop residue to promote microbial breakdown.',
      organic: 'Apply bio-fungicides containing Trichoderma harzianum or Bacillus amyloliquefaciens.',
      chemical: 'Foliar application of Strobilurin + Triazole premix (e.g., Azoxystrobin + Difenoconazole or Pyraclostrobin) at tassel (VT) stage.',
      preventive: 'Select corn hybrids with high Gray Leaf Spot (GLS) tolerance ratings.'
    }
  },
  'Corn_(maize)___Common_rust_': {
    crop: 'Corn (Maize)',
    condition: 'Common Rust',
    isHealthy: false,
    pathogen: 'Fungus (Puccinia sorghi)',
    description: 'Cinnamon-brown powdery pustules on both upper and lower leaf surfaces, exploding through the epidermis to release urediniospores.',
    symptoms: [
      'Oval to elongate cinnamon-brown powdery pustules (uredinia) scattered on leaves',
      'Pustules rupture epidermal tissue and release reddish-brown powdery dust when touched',
      'Chlorotic halos surrounding dense pustule clusters leading to leaf desiccation'
    ],
    management: {
      cultural: 'Plant early in the season to avoid peak air-borne spore showers from southern storm fronts.',
      organic: 'Foliar spray of wettable sulfur (0.2%) or bio-control Pseudomonas fluorescens.',
      chemical: 'Apply Pyraclostrobin, Propiconazole, or Tebuconazole if pustules appear before blister stage on high-yield fields.',
      preventive: 'Use maize cultivars possessing the Rp-resistant gene against Puccinia sorghi.'
    }
  },
  'Corn_(maize)___Northern_Leaf_Blight': {
    crop: 'Corn (Maize)',
    condition: 'Northern Corn Leaf Blight (NCLB)',
    isHealthy: false,
    pathogen: 'Fungus (Exserohilum turcicum / Setosphaeria turcica)',
    description: 'Large elliptical cigar-shaped grayish-green to tan lesions that can spread rapidly throughout the canopy during moderate humid weather.',
    symptoms: [
      'Long elliptical, cigar-shaped grayish-green lesions (2.5 to 15 cm in length)',
      'Lesions darken with olive-black fungal spores during damp weather',
      'Widespread leaf death resembling frost damage when severe'
    ],
    management: {
      cultural: 'Deep tillage of infected stubble and 2-year crop rotation with non-host crops like soybean or cotton.',
      organic: 'Soil and foliar application of Trichoderma viride and Pseudomonas formulations.',
      chemical: 'Foliar spray of Mancozeb (0.25%), Propiconazole (0.1%), or Azoxystrobin at initial disease onset.',
      preventive: 'Plant hybrids with specific resistance genes (Ht1, Ht2, Ht3, or HtN).'
    }
  },
  'Corn_(maize)___healthy': {
    crop: 'Corn (Maize)',
    condition: 'Healthy Foliage',
    isHealthy: true,
    pathogen: 'None - Foliage is Healthy',
    description: 'Vigorous erect maize leaves with prominent midrib, rich chlorophyll pigmentation, and intact linear margins.',
    symptoms: ['Dark green parallel venation', 'Turgid erect leaf blades', 'No rust pustules or necrotic striping'],
    management: {
      cultural: 'Ensure balanced split application of nitrogen and adequate zinc supplementation.',
      organic: 'Apply farmyard manure and Azospirillum bio-fertilizer.',
      chemical: 'No chemical fungicides needed.',
      preventive: 'Maintain optimal plant population and weed-free critical period (first 30-45 days).'
    }
  },

  // ---------------- GRAPE (4 classes) ----------------
  Grape___Black_rot: {
    crop: 'Grape',
    condition: 'Black Rot',
    isHealthy: false,
    pathogen: 'Fungus (Guignardia bidwellii)',
    description: 'Small circular reddish-brown leaf spots with tiny black pycnidia; causes grape berries to shrivel into hard, black, wrinkled mummies.',
    symptoms: [
      'Circular reddish-brown necrotic spots with distinct dark margins on leaves',
      'Minute black speck-like pycnidia arranged in a ring inside lesions',
      'Berries turn soft, brown, and shrivel into black wrinkled mummies hanging on vine'
    ],
    management: {
      cultural: 'Meticulously remove and destroy all mummified berries from vine and soil during dormant winter pruning.',
      organic: 'Copper hydroxide or Bordeaux mixture (1%) applied before bloom and after fruit set.',
      chemical: 'Spray Myclobutanil, Mancozeb, or Kresoxim-methyl starting at bud break and continuing through 4-5 weeks post-bloom.',
      preventive: 'Train vines with open canopy architectures to accelerate leaf drying after rains.'
    }
  },
  'Grape___Esca_(Black_Measles)': {
    crop: 'Grape',
    condition: 'Esca (Black Measles / Grapevine Trunk Disease)',
    isHealthy: false,
    pathogen: 'Fungal Complex (Phaeomoniella chlamydospora, Phaeoacremonium aleophilum, Fomitiporia mediterranea)',
    description: 'Tiger-stripe foliar interveinal chlorosis and necrosis, vascular wood discolouration, and purple speckling on berry skins.',
    symptoms: [
      'Distinctive "tiger-stripe" pattern: chlorotic and necrotic areas between main leaf veins',
      'Small dark brown or purple spots on fruit resembling measles',
      'Sudden apoplexy (wilting and collapse of entire vine shoots in hot dry summer)'
    ],
    management: {
      cultural: 'Prune during dry winter weather; paint large pruning wounds immediately with pruning sealants or wound protectants.',
      organic: 'Treat pruning cuts with Trichoderma atroviride biocontrol formulations.',
      chemical: 'No curative systemic chemical cure exists; protect pruning wounds with Thiophanate-methyl paste.',
      preventive: 'Remove infected dead wood and replace severely declining vines with certified virus-free nursery stock.'
    }
  },
  'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)': {
    crop: 'Grape',
    condition: 'Leaf Blight (Isariopsis / Pseudocercospora)',
    isHealthy: false,
    pathogen: 'Fungus (Pseudocercospora cladosporioides / Isariopsis clavispora)',
    description: 'Irregular brown or purplish spots with defined margins on older leaves, causing premature defoliation late in the season.',
    symptoms: [
      'Irregular reddish-brown spots with dark borders on mature grapevine leaves',
      'Faint gray-brown sporulation on lower surface during humid weather',
      'Premature leaf senescence leading to delayed cane ripening and sunburn on clusters'
    ],
    management: {
      cultural: 'Maintain open trellis canopy to reduce humidity; remove senescent lower leaves after veraison.',
      organic: 'Apply sulfur dusting or bio-fungicide sprays after harvest to lower inoculum.',
      chemical: 'Spray Copper oxychloride (0.25%), Mancozeb (0.2%), or Carbendazim (0.1%) when spots first appear.',
      preventive: 'Ensure post-harvest protection spray before winter leaf fall.'
    }
  },
  Grape___healthy: {
    crop: 'Grape',
    condition: 'Healthy Foliage',
    isHealthy: true,
    pathogen: 'None - Foliage is Healthy',
    description: 'Broad, lobed green grape leaves with clean margins, active shoot elongation, and healthy tendril production.',
    symptoms: ['Vibrant uniform green lamina', 'Intact palmate venation', 'No leaf spot or downy/powdery mildew patches'],
    management: {
      cultural: 'Canopy management through shoot positioning, suckering, and leaf pulling.',
      organic: 'Periodic bio-extracts and seaweed spray for physiological resilience.',
      chemical: 'No fungicides required.',
      preventive: 'Calibrate drip fertigation and maintain vine moisture balance.'
    }
  },

  // ---------------- ORANGE / CITRUS (1 class) ----------------
  'Orange___Haunglongbing_(Citrus_greening)': {
    crop: 'Orange',
    condition: 'Huanglongbing (HLB / Citrus Greening)',
    isHealthy: false,
    pathogen: 'Bacterium (Candidatus Liberibacter asiaticus) vectored by Asian Citrus Psyllid (Diaphorina citri)',
    description: 'Devastating phloem-limited bacterial disease causing asymmetric blotchy mottle chlorosis, yellow shoots, and bitter, lopsided fruit.',
    symptoms: [
      'Asymmetric blotchy mottle yellowing across leaf blades (yellowing differs on either side of midrib)',
      'Thickened, corky veins that become raised and split',
      'Small, lopsided, poorly colored fruit with aborted seeds and bitter juice',
      'Dieback of twigs and progressive tree decline'
    ],
    management: {
      cultural: 'Immediately eradicate and destroy confirmed HLB-positive trees to prevent spread to neighboring groves.',
      organic: 'Release biological parasitoid wasp Tamarixia radiata to suppress Asian Citrus Psyllid populations.',
      chemical: 'Aggressive vector control: Foliar sprays of Imidacloprid, Thiamethoxam, or Dimethoate targeting psyllid flushes.',
      preventive: 'Plant only certified disease-free budwood grown in screened pest-exclusion nurseries.'
    }
  },

  // ---------------- PEACH (2 classes) ----------------
  Peach___Bacterial_spot: {
    crop: 'Peach',
    condition: 'Bacterial Spot (Xanthomonas)',
    isHealthy: false,
    pathogen: 'Bacterium (Xanthomonas arboricola pv. pruni)',
    description: 'Angular water-soaked leaf spots turning purple-black and dropping out (shot-hole effect), accompanied by fruit pitting.',
    symptoms: [
      'Angular water-soaked spots on leaves turning reddish-purple to brown',
      'Centers of lesions fall out, giving a "shot-hole" or ragged appearance',
      'Severe yellowing of leaf tips and midribs leading to premature defoliation',
      'Deep sunken cracked lesions on peach fruit skin'
    ],
    management: {
      cultural: 'Plant windbreaks to reduce windblown sand abrasions that provide entry points for bacteria.',
      organic: 'Apply low-rate copper formulations combined with agricultural hydrated lime to prevent phytotoxicity.',
      chemical: 'Oxytetracycline sprays during bloom to petal-fall; dormant copper applications.',
      preventive: 'Plant bacterial spot-resistant peach cultivars (e.g., Candor, Reliance, Bellaire).'
    }
  },
  Peach___healthy: {
    crop: 'Peach',
    condition: 'Healthy Foliage',
    isHealthy: true,
    pathogen: 'None - Foliage is Healthy',
    description: 'Long lanceolate peach leaves with finely serrated margins, bright glossy green color, and robust shoot vigor.',
    symptoms: ['Symmetrical lanceolate blades', 'Glossy green upper lamina', 'Absence of leaf curl, shot-hole, or gummosis'],
    management: {
      cultural: 'Summer pruning for interior sunlight penetration and soil moisture monitoring.',
      organic: 'Apply organic compost and mulch around dripline.',
      chemical: 'No chemical intervention required.',
      preventive: 'Routine winter dormant spray for peach leaf curl prevention.'
    }
  },

  // ---------------- PEPPER, BELL (2 classes) ----------------
  'Pepper,_bell___Bacterial_spot': {
    crop: 'Pepper, bell',
    condition: 'Bacterial Spot (Xanthomonas)',
    isHealthy: false,
    pathogen: 'Bacterium (Xanthomonas euvesicatoria / X. vesicatoria)',
    description: 'Water-soaked irregular spots on leaves turning dark brown with chlorotic halos, causing heavy lower canopy defoliation.',
    symptoms: [
      'Small, circular to irregular water-soaked spots on undersides of leaves',
      'Spots enlarge and turn dark brown to black with prominent yellow halos',
      'Severe leaf drop exposing fruit to direct solar radiation and sunscald'
    ],
    management: {
      cultural: 'Avoid working in pepper fields when foliage is wet. Rotate with non-solanaceous crops for at least 2 seasons.',
      organic: 'Foliar application of Copper Hydroxide combined with Bacillus subtilis formulations.',
      chemical: 'Tank-mix Copper hydroxide (0.2%) with Mancozeb (0.2%) or apply Kasugamycin / Streptomycin sulfate (in permitted regions).',
      preventive: 'Use hot-water treated or certified disease-free seeds and plant resistant pepper cultivars (Xcv races 1-5).'
    }
  },
  'Pepper,_bell___healthy': {
    crop: 'Pepper, bell',
    condition: 'Healthy Foliage',
    isHealthy: true,
    pathogen: 'None - Foliage is Healthy',
    description: 'Broad, glossy green leaves with smooth margins and no necrotic specks, leaf curl, or mosaic symptoms.',
    symptoms: ['Lustrous dark green leaf surfaces', 'Balanced vegetative branching', 'Absence of thrips or viral mottling'],
    management: {
      cultural: 'Maintain consistent drip moisture to prevent blossom end rot and foliar drought stress.',
      organic: 'Neem cake application and vermicompost tea drench.',
      chemical: 'No chemical fungicides needed.',
      preventive: 'Install yellow sticky traps for monitoring sucking insect vectors.'
    }
  },

  // ---------------- POTATO (3 classes) ----------------
  Potato___Early_blight: {
    crop: 'Potato',
    condition: 'Early Blight',
    isHealthy: false,
    pathogen: 'Fungus (Alternaria solani)',
    description: 'Dark brown to black necrotic spots showing concentric rings (target board pattern), progressing from older lower foliage upwards.',
    symptoms: [
      'Concentric circular or target-like ring lesions delimited by leaf veins',
      'Yellow chlorotic halos surrounding lesions on lower mature foliage',
      'Premature drying and defoliation reducing tuber sizing and yield'
    ],
    management: {
      cultural: 'Avoid nitrogen deficiency; maintain optimal plant vigor. Ensure 3-year rotation away from solanaceous crops.',
      organic: 'Spray Trichoderma viride or Bacillus amyloliquefaciens at 15-day intervals.',
      chemical: 'Apply Mancozeb (0.25%), Chlorothalonil (0.2%), or Difenoconazole / Azoxystrobin upon observing initial target spots.',
      preventive: 'Use certified disease-free seed tubers and minimize plant stress during tuber bulking.'
    }
  },
  Potato___Late_blight: {
    crop: 'Potato',
    condition: 'Late Blight',
    isHealthy: false,
    pathogen: 'Oomycete (Phytophthora infestans)',
    description: 'Devastating disease causing rapidly expanding water-soaked dark lesions with white downy fungal growth on leaf undersides during cool, wet weather.',
    symptoms: [
      'Large, irregular water-soaked pale-to-dark brown lesions appearing on leaf tips and margins',
      'Delicate white cottony mildew sporulation on the underside of leaves around lesion borders in humid conditions',
      'Rapid foliar collapse, foul decaying odor, and brown dry rot inside infected tubers'
    ],
    management: {
      cultural: 'Destroy all cull piles of discarded potatoes; hill soil well over tuber beds to prevent zoospores washing onto tubers.',
      organic: 'Bordeaux mixture (1%) or Copper oxychloride (0.3%) applied preventively before cloudy/foggy spells.',
      chemical: 'Systemic curative fungicides: Metalaxyl + Mancozeb (0.25%), Cymoxanil + Mancozeb, or Dimethomorph + Chlorothalonil.',
      preventive: 'Monitor weather alerts for late-blight forecast conditions (temperatures 15-22°C and relative humidity >90%).'
    }
  },
  Potato___healthy: {
    crop: 'Potato',
    condition: 'Healthy Foliage',
    isHealthy: true,
    pathogen: 'None - Foliage is Healthy',
    description: 'Robust compound potato foliage with deep green leaf blades, sturdy petioles, and active stolon/tuber development.',
    symptoms: ['Deep green compound leaves', 'Turgid upright canopy', 'No blight lesions or leaf curling'],
    management: {
      cultural: 'Keep ridge hills high and soil aerated; avoid over-saturation.',
      organic: 'Apply bio-fertilizer consortia and composted manure.',
      chemical: 'No fungicides required.',
      preventive: 'Scout field edges twice weekly, particularly after unseasonal mist or rain.'
    }
  },

  // ---------------- RASPBERRY (1 class) ----------------
  Raspberry___healthy: {
    crop: 'Raspberry',
    condition: 'Healthy Foliage',
    isHealthy: true,
    pathogen: 'None - Foliage is Healthy',
    description: 'Vigorous pinnately compound green raspberry leaves with serrate edges and healthy cane growth.',
    symptoms: ['Serrated compound foliage', 'Clean cane epidermis', 'Absence of spur blight or rust lesions'],
    management: {
      cultural: 'Prune out spent floricanes immediately after harvest to maximize airflow for primocanes.',
      organic: 'Organic wood chip mulch to retain root moisture.',
      chemical: 'No chemical treatment needed.',
      preventive: 'Ensure trellising prevents canes from trailing in mud.'
    }
  },

  // ---------------- SOYBEAN (1 class) ----------------
  Soybean___healthy: {
    crop: 'Soybean',
    condition: 'Healthy Foliage',
    isHealthy: true,
    pathogen: 'None - Foliage is Healthy',
    description: 'Trifoliate green soybean leaves exhibiting balanced nodulation, uniform chlorophyll, and healthy canopy closure.',
    symptoms: ['Trifoliate symmetrical green leaves', 'Clean leaf lamina', 'No frogeye leaf spots or rust pustules'],
    management: {
      cultural: 'Ensure Bradyrhizobium japonicum inoculation and balanced phosphorus fertilization.',
      organic: 'Apply rhizobial culture and organic mycorrhiza.',
      chemical: 'No chemical intervention required.',
      preventive: 'Scout for pod borers and foliar caterpillars during reproductive stages.'
    }
  },

  // ---------------- SQUASH (1 class) ----------------
  Squash___Powdery_mildew: {
    crop: 'Squash',
    condition: 'Powdery Mildew',
    isHealthy: false,
    pathogen: 'Fungus (Podosphaera xanthii / Erysiphe cichoracearum)',
    description: 'White talcum-like powdery spots on both surfaces of squash leaves, spreading rapidly to cover the entire canopy and causing premature senescence.',
    symptoms: [
      'Circular powdery white fungal spots on upper and lower leaf surfaces',
      'Leaves turn yellow, become brittle and brown, and senesce prematurely',
      'Exposed fruit suffer sunscald and lack sugar accumulation'
    ],
    management: {
      cultural: 'Plant in full sun with generous plant spacing to allow rapid drying of foliage.',
      organic: 'Spray potassium bicarbonate, neem oil (0.5%), or diluted milk spray (1:9 ratio) at first white speck.',
      chemical: 'Apply systemic fungicides like Myclobutanil, Trifloxystrobin, or Quinoxyfen on a 7-10 day schedule.',
      preventive: 'Select powdery mildew-resistant squash hybrids (labeled PMR).'
    }
  },

  // ---------------- STRAWBERRY (2 classes) ----------------
  Strawberry___Leaf_scorch: {
    crop: 'Strawberry',
    condition: 'Leaf Scorch',
    isHealthy: false,
    pathogen: 'Fungus (Diplocarpon earlianum)',
    description: 'Numerous small, irregular purple-to-dark brown spots on strawberry leaflets, coalescing to give leaves a scorched, burnt appearance.',
    symptoms: [
      'Small, dark purple or brown irregular spots on leaflets without distinct white centers',
      'Tissues between spots turn purple, brown, and dry out',
      'Whole leaf margins curl upward and appear scorched by fire'
    ],
    management: {
      cultural: 'Mow or trim foliage after harvest in June-bearing plantings; avoid overhead sprinkler watering.',
      organic: 'Copper hydroxide or Bacillus subtilis sprays applied before and after blooming.',
      chemical: 'Foliar sprays of Captan (0.2%), Thiram, or Pyraclostrobin during spring crown emergence.',
      preventive: 'Plant certified virus-free runners on raised plastic-mulched beds with drip irrigation.'
    }
  },
  Strawberry___healthy: {
    crop: 'Strawberry',
    condition: 'Healthy Foliage',
    isHealthy: true,
    pathogen: 'None - Foliage is Healthy',
    description: 'Tri-foliate strawberry leaves with bright green luster, sturdy petioles, and healthy crown development.',
    symptoms: ['Lustrous trifoliate leaves', 'Crisp serrated leaf borders', 'No leaf spot or scorch lesions'],
    management: {
      cultural: 'Maintain clean straw or plastic mulch to keep foliage and berries away from wet soil.',
      organic: 'Apply seaweed fertilizer extract and organic compost.',
      chemical: 'No fungicides required.',
      preventive: 'Routine monitoring for spider mites on leaf undersides.'
    }
  },

  // ---------------- TOMATO (10 classes) ----------------
  Tomato___Bacterial_spot: {
    crop: 'Tomato',
    condition: 'Bacterial Spot (Xanthomonas)',
    isHealthy: false,
    pathogen: 'Bacterium (Xanthomonas perforans / X. vesicatoria)',
    description: 'Small, water-soaked dark spots on leaves, stems, and fruit. In humid conditions, spots become angular with yellow chlorotic halos.',
    symptoms: [
      'Small, circular to angular water-soaked dark brown specks (<3 mm) on leaves',
      'Yellow halos surrounding lesions that give a ragged shot-hole look when centers tear',
      'Black scab-like raised lesions on green tomato fruit'
    ],
    management: {
      cultural: 'Stake and prune plants to improve airflow. Never work in wet tomato rows.',
      organic: 'Copper hydroxide mixed with Bacillus subtilis or Pseudomonas fluorescens.',
      chemical: 'Tank mix copper hydroxide (0.2%) with Mancozeb (0.2%) to overcome bacterial copper tolerance.',
      preventive: 'Use hot-water treated seeds and ensure 2-3 year rotation away from solanaceous plants.'
    }
  },
  Tomato___Early_blight: {
    crop: 'Tomato',
    condition: 'Early Blight',
    isHealthy: false,
    pathogen: 'Fungus (Alternaria solani)',
    description: 'Characterized by concentric brown-to-black ring spots ("target spots") surrounded by yellow halos, starting on older lower foliage.',
    symptoms: [
      'Concentric circular target-board lesions on mature lower leaves',
      'Yellow chlorotic halos surrounding lesions; premature defoliation progresses upward',
      'Dark sunken stem cankers (collar rot) at soil level'
    ],
    management: {
      cultural: 'Prune bottom 30 cm of lower leaves once vines establish; mulch around base to prevent soil splash.',
      organic: 'Foliar spray of Trichoderma harzianum or bio-fungicide copper octanoate.',
      chemical: 'Apply Mancozeb (0.25%), Chlorothalonil (0.2%), or Azoxystrobin at 10-14 day intervals.',
      preventive: 'Drip irrigation strictly; avoid overhead splashing.'
    }
  },
  Tomato___Late_blight: {
    crop: 'Tomato',
    condition: 'Late Blight',
    isHealthy: false,
    pathogen: 'Oomycete (Phytophthora infestans)',
    description: 'Aggressive water-soaked pale green or dark brown lesions rapidly spreading during cool, humid conditions, often with white fungal fuzz on leaf undersides.',
    symptoms: [
      'Large irregular water-soaked greasy gray-green lesions turning brown and necrotic',
      'White downy fungal growth on the underside of foliage in humid mornings',
      'Firm brown greasy rot on tomato fruit shoulders causing total fruit decay'
    ],
    management: {
      cultural: 'Promptly remove and bag infected plants; do not compost blighted vines.',
      organic: 'Preventive Bordeaux mixture (1%) or Copper oxychloride (0.3%).',
      chemical: 'Apply curative translaminar fungicides: Metalaxyl + Mancozeb (0.25%), Cymoxanil, or Dimethomorph.',
      preventive: 'Scout closely when temperatures stay between 15-22°C with sustained relative humidity above 90%.'
    }
  },
  Tomato___Leaf_Mold: {
    crop: 'Tomato',
    condition: 'Leaf Mold',
    isHealthy: false,
    pathogen: 'Fungus (Passalora fulva / Cladosporium fulvum)',
    description: 'Pale yellow chlorotic patches on upper leaf surface corresponding to velvety olive-green to grayish-brown fungal sporulation on lower leaf surface.',
    symptoms: [
      'Pale green or yellowish spots with indefinite margins on upper leaf surfaces',
      'Olive-green to velvety brown mold sporulation on the underside of infected leaves',
      'Leaves curl, wither, and drop prematurely, particularly in greenhouse or high-tunnel setups'
    ],
    management: {
      cultural: 'Enhance greenhouse ventilation and maintain relative humidity below 85% using horizontal airflow fans.',
      organic: 'Bio-fungicide sprays containing Bacillus amyloliquefaciens or sulfur dusting.',
      chemical: 'Apply Chlorothalonil, Difenoconazole, or Boscalid upon initial detection.',
      preventive: 'Select tomato cultivars with Cf-resistance genes against Passalora fulva.'
    }
  },
  Tomato___Septoria_leaf_spot: {
    crop: 'Tomato',
    condition: 'Septoria Leaf Spot',
    isHealthy: false,
    pathogen: 'Fungus (Septoria lycopersici)',
    description: 'Numerous small circular spots with dark brown margins and sunken grayish-white centers dotted with tiny black pycnidia.',
    symptoms: [
      'Small circular spots (2-3 mm) with dark brown margins and gray or tan centers',
      'Minute black specks (pycnidia) clearly visible in center of lesions with a hand lens',
      'Rapid lower leaf yellowing and severe upward defoliation'
    ],
    management: {
      cultural: 'Mulch soil surface thoroughly; strip lower diseased foliage and sterilize shears between plants.',
      organic: 'Apply copper sulfate or bio-fungicide Bacillus subtilis preventively.',
      chemical: 'Spray Chlorothalonil (0.2%), Mancozeb (0.25%), or Propiconazole starting when lower leaves show spots.',
      preventive: 'Practice a 3-year crop rotation and completely avoid overhead watering.'
    }
  },
  'Tomato___Spider_mites Two-spotted_spider_mite': {
    crop: 'Tomato',
    condition: 'Two-Spotted Spider Mite Infestation',
    isHealthy: false,
    pathogen: 'Arthropod Pest (Tetranychus urticae)',
    description: 'Tiny sap-feeding arachnids causing microscopic chlorotic stippling (pinpoint yellow spots), fine silken webbing on leaf undersides, and leaf bronzing.',
    symptoms: [
      'Fine yellow or white specks (chlorotic stippling) on upper leaf surfaces',
      'Fine silken webbing covering leaf undersides, growing tips, and flower clusters',
      'Leaves turn bronze, dry out, and exhibit parchment-like texture under severe feeding pressure'
    ],
    management: {
      cultural: 'Avoid excessive dry and dusty conditions; keep field perimeter vegetation trimmed.',
      organic: 'Release predatory mites (Phytoseiulus persimilis or Neoseiulus californicus); apply cold-pressed neem oil (1%) or insecticidal soap.',
      chemical: 'Apply targeted miticides: Spiromesifen, Fenazaquin, or Abamectin (rotate chemical classes to prevent rapid resistance).',
      preventive: 'Maintain adequate field moisture and wash undersides of foliage with high-pressure water sprays in early infestation.'
    }
  },
  Tomato___Target_Spot: {
    crop: 'Tomato',
    condition: 'Target Spot',
    isHealthy: false,
    pathogen: 'Fungus (Corynespora cassiicola)',
    description: 'Small pinpoint brown lesions that expand into circular lesions with pale brown centers and dark concentric rings, causing rapid blighting.',
    symptoms: [
      'Small brown circular spots with concentric target-like rings and light brown centers',
      'Lesions frequently develop yellow chlorotic margins and coalesce across leaf lamina',
      'Deep, pitted dark lesions on green and ripe tomato fruit'
    ],
    management: {
      cultural: 'Increase plant-to-plant spacing to maximize air drying; remove infected crop residue immediately after harvest.',
      organic: 'Apply bio-fungicide Bacillus subtilis or copper hydroxide.',
      chemical: 'Foliar sprays of Pyraclostrobin, Fluxapyroxad, or Azoxystrobin + Difenoconazole.',
      preventive: 'Avoid overhead sprinkler irrigation and use drip delivery.'
    }
  },
  Tomato___Tomato_Yellow_Leaf_Curl_Virus: {
    crop: 'Tomato',
    condition: 'Tomato Yellow Leaf Curl Virus (TYLCV)',
    isHealthy: false,
    pathogen: 'Begomovirus (TYLCV) transmitted by Whitefly (Bemisia tabaci)',
    description: 'Viral disease causing severe stunting of plant growth, pronounced upward leaf cupping, pale yellowing of leaf margins, and flower drop.',
    symptoms: [
      'Pronounced upward curling and cupping of leaflets ("boat-shaped" leaves)',
      'Interveinal chlorosis with bright yellow marginal leaf borders',
      'Severe plant stunting, shortened internodes, and bushy compact appearance',
      'Heavy flower abscission resulting in almost total yield loss when infected young'
    ],
    management: {
      cultural: 'Rogue out and destroy infected viral plants immediately; install 50-mesh insect-proof screening in nursery greenhouses.',
      organic: 'Spray cold-pressed neem oil (1%) and install yellow sticky cards (10-15 per acre) to trap whitefly vectors.',
      chemical: 'Control whitefly vectors: Soil drench or foliar spray of Imidacloprid, Thiamethoxam, or Spirotetramat.',
      preventive: 'Plant TYLCV-resistant or tolerant tomato hybrids (e.g., US-618, Abhinav, Tyking).'
    }
  },
  Tomato___Tomato_mosaic_virus: {
    crop: 'Tomato',
    condition: 'Tomato Mosaic Virus (ToMV)',
    isHealthy: false,
    pathogen: 'Tobamovirus (ToMV) - Highly stable, mechanically transmitted virus',
    description: 'Mechanically transmitted virus causing mottled light-and-dark green foliage, leaf distortion ("fern leaf" or "shoestring"), and internal brown fruit browning.',
    symptoms: [
      'Mottled alternating light and dark green mosaic patterns on foliage',
      'Distortion, blistering, and narrow shoestring/fern-like leaflets',
      'Stunting of plant growth and internal vascular necrosis in fruit'
    ],
    management: {
      cultural: 'Workers must wash hands with 20% non-fat dry milk or trisodium phosphate (TSP) and soap before handling plants; strictly prohibit smoking/tobacco use near fields.',
      organic: 'Spray milk solution (diluted non-fat dry milk) as an inhibitor of mechanical viral transmission during transplanting.',
      chemical: 'No chemical cure exists for viral infections; focus strictly on strict hygiene and tool sanitation.',
      preventive: 'Use certified virus-free seed treated with trisodium phosphate (TSP) or dry heat (70°C for 4 days).'
    }
  },
  Tomato___healthy: {
    crop: 'Tomato',
    condition: 'Healthy Foliage',
    isHealthy: true,
    pathogen: 'None - Foliage is Healthy',
    description: 'Vibrant dark green compound leaves with upright vigor, clean petioles, strong flower trusses, and no signs of blights or viruses.',
    symptoms: ['Lustrous deep green foliage', 'Balanced vegetative and generative growth', 'Absence of foliar spots or insect webbing'],
    management: {
      cultural: 'Maintain regular staking, suckering, and balanced drip fertigation.',
      organic: 'Apply Panchagavya or sea-weed extract at 15-day intervals.',
      chemical: 'No fungicides required.',
      preventive: 'Scout foliage weekly and maintain strict hygiene.'
    }
  },

  // ---------------- RICE (ORYZA SATIVA - 5 classes) ----------------
  Rice___Blast: {
    crop: 'Rice',
    condition: 'Rice Blast (Leaf & Neck Blast)',
    isHealthy: false,
    pathogen: 'Fungus (Magnaporthe oryzae / Pyricularia oryzae)',
    description: 'Produces spindle-shaped or diamond-shaped lesions with ash-grey centers and dark brown-red borders on leaf blades; panicle infections cause neck blast with empty white earheads.',
    symptoms: [
      'Spindle-shaped or eye-shaped lesions with grey or white centers and dark brown margins',
      'Lesions coalesce causing rapid foliar blighting and burning appearance',
      'Blackish-brown rotting at panicle neck causing drooping earheads with empty chaffy grains'
    ],
    management: {
      cultural: 'Avoid excessive nitrogenous fertilizer; split urea into 3-4 doses. Maintain shallow standing water in the field.',
      organic: 'Spray Pseudomonas fluorescens (0.2% / 10g/L) or Bacillus subtilis. Apply bio-silica to strengthen leaf epidermal cuticle.',
      chemical: 'Apply Tricyclazole 75% WP (Beam @ 0.6g/L) or Isoprothiolane 40% EC (1.5 ml/L) or Kasugamycin 3% SL (2 ml/L) at first symptom appearance.',
      preventive: 'Use blast-tolerant cultivars (ADT 36, CO 51, TPS 5). Soak seeds in Carbendazim solution (2g/kg) for 24 hours prior to sowing.'
    }
  },
  Rice___Bacterial_leaf_blight: {
    crop: 'Rice',
    condition: 'Bacterial Leaf Blight (BLB)',
    isHealthy: false,
    pathogen: 'Bacteria (Xanthomonas oryzae pv. oryzae)',
    description: 'Water-soaked lesions on leaf margins near tips that enlarge, turn yellow-orange, and wave downward along margins, causing leaves to dry into a grayish-white straw appearance.',
    symptoms: [
      'Yellow-to-white wavy marginal stripes starting from leaf tips downward',
      'Bacterial milky ooze drops visible on young lesions in humid early mornings',
      'Rapid wilting and rolling of leaves in tillering phase (Kresek wilt)'
    ],
    management: {
      cultural: 'Avoid excessive nitrogen application; ensure proper field drainage. Eradicate alternative weed hosts (Leersia hexandra) on field bunds.',
      organic: 'Foliar spray of fresh cow dung slurry (20%) or Pseudomonas fluorescens (0.2% / 10g/L) at tillering and panicle initiation.',
      chemical: 'Foliar spray of Copper Hydroxide (2.0g/L) or Copper Oxychloride 50% WP (2.5g/L) mixed with Streptomycin sulphate + Tetracycline hydrochloride (Plantomycin / Agrimycin 300mg/10L).',
      preventive: 'Plant resistant rice cultivars (Improved White Ponni, CR 1009, CO 43, Samba Mahsuri). Treat seeds with Pseudomonas @ 10g/kg.'
    }
  },
  Rice___Brown_spot: {
    crop: 'Rice',
    condition: 'Rice Brown Spot',
    isHealthy: false,
    pathogen: 'Fungus (Bipolaris oryzae / Cochliobolus miyabeanus)',
    description: 'Circular to oval dark brown spots on leaves with yellowish-gray centers and yellow halos. Strongly associated with poor soil fertility, zinc deficiency, and moisture stress.',
    symptoms: [
      'Small dark brown spots that expand into oval sesame-seed-like lesions with yellow halos',
      'Lesions coalesce causing large patches of foliar blighting and grain discolouration',
      'Infected grains show dark blackish spots and poor grain filling'
    ],
    management: {
      cultural: 'Correct soil nutrient deficiencies by applying recommended Potassium (MOP) and Zinc sulphate (25 kg/ha). Maintain uniform irrigation.',
      organic: 'Foliar spray with Neem oil (3%) or Trichoderma viride (10g/L) at booting stage.',
      chemical: 'Apply Propiconazole 25% EC (1 ml/L) or Mancozeb 75% WP (2g/L) or Carbendazim + Mancozeb (Saaf @ 2g/L) upon spot detection.',
      preventive: 'Hot water seed treatment (53-54°C for 10 min) or seed treatment with Carbendazim (2g/kg). Avoid severe moisture stress.'
    }
  },
  Rice___Leaf_smut: {
    crop: 'Rice',
    condition: 'Rice Leaf Smut',
    isHealthy: false,
    pathogen: 'Fungus (Entyloma oryzae)',
    description: 'Small, angular, slightly raised, lead-black spots scattered along leaf veins on mature leaves, releasing powdery black teliospores in late season under heavy nitrogen.',
    symptoms: [
      'Small, rectangular or angular lead-black spots restricted between leaf veins',
      'Ruptured black sorus releasing powdery teliospores in late season',
      'Premature yellowing and drying of older leaves from apex to base'
    ],
    management: {
      cultural: 'Avoid excess nitrogen fertilizer during boot leaf and flowering stages. Burn or plough in infected crop stubbles after harvest.',
      organic: 'Spray neem seed kernel extract (NSKE 5%) or apply wood ash to supply potassium and silica.',
      chemical: 'Foliar spray of Mancozeb (2.5g/L) or Copper Oxychloride (2.5g/L) if infection affects flag leaves.',
      preventive: 'Ensure balanced N:P:K fertilization (120:40:40 kg/ha). Maintain clean field bunds.'
    }
  },
  Rice___healthy: {
    crop: 'Rice',
    condition: 'Healthy Rice Foliage',
    isHealthy: true,
    pathogen: 'None - Foliage is Healthy',
    description: 'Vigorous, emerald-green erect leaves free from chlorosis, necrotic spotting, leaf rolling, or pathogen lesions with healthy root tillers.',
    symptoms: [
      'Uniform emerald-to-lime green leaf blades without spots or edge scorching',
      'Turgid, erect tillers with healthy root system and no bacterial ooze',
      'Robust panicle emergence with clean green glumes'
    ],
    management: {
      cultural: 'Maintain recommended alternate wetting and drying (AWD) irrigation; split nitrogen into basal, active tillering, and panicle initiation doses.',
      organic: 'Apply Azospirillum and Phosphobacteria biofertilizers with enriched farmyard manure (FYM).',
      chemical: 'No fungicides required. Maintain regular pest scouting.',
      preventive: 'Routine weekly monitoring for leaf folder and stem borer activity.'
    }
  }
};

/**
 * Normalizes input crop name to canonical format
 */
export const normalizeCropName = (cropName) => {
  if (!cropName || typeof cropName !== 'string') return '';
  const clean = cropName.trim().toLowerCase();
  for (const [key, val] of Object.entries(CROP_CANONICAL_MAP)) {
    if (clean.includes(key)) return val;
  }
  return cropName.trim();
};

/**
 * Checks whether a given crop is supported by the 14 PlantVillage classes
 */
export const isCropSupported = (cropName) => {
  if (!cropName || typeof cropName !== 'string') return false;
  const clean = cropName.trim().toLowerCase();
  return SUPPORTED_CROPS.some((c) => clean.includes(c.toLowerCase()));
};

/**
 * Returns the pathology profile for a raw Hugging Face label
 */
export const getDiseaseProfile = (rawLabel) => {
  if (!rawLabel) return null;
  return PLANT_DISEASE_PROFILES[rawLabel] || null;
};

/**
 * Decodes a raw Hugging Face DINOv2 label into human-readable information
 */
export const parseDinoV2Label = (rawLabel) => {
  const profile = getDiseaseProfile(rawLabel);
  if (profile) {
    return {
      rawLabel,
      crop: profile.crop,
      condition: profile.condition,
      pathogen: profile.pathogen,
      isHealthy: profile.isHealthy,
      description: profile.description,
      observableSymptoms: profile.symptoms,
      management: profile.management,
    };
  }

  // Fallback string parsing if custom label
  const parts = (rawLabel || '').split('___');
  const rawCrop = parts[0] ? parts[0].replace(/_/g, ' ') : 'Unknown Crop';
  const rawCondition = parts[1] ? parts[1].replace(/_/g, ' ') : 'Unknown Condition';
  const isHealthy = rawCondition.toLowerCase().includes('healthy');

  return {
    rawLabel,
    crop: rawCrop,
    condition: rawCondition,
    pathogen: isHealthy ? 'None - Plant is Healthy' : 'Foliar Pathogen',
    isHealthy,
    description: `Foliar leaf condition identified as ${rawCondition} for ${rawCrop}.`,
    observableSymptoms: isHealthy ? ['Healthy foliage'] : ['Foliar lesions or chlorosis'],
    management: {
      cultural: 'Maintain field sanitation.',
      organic: 'Apply bio-fertilizers and organic sprays.',
      chemical: 'Consult regional agronomist.',
      preventive: 'Weekly scouting.',
    },
  };
};
