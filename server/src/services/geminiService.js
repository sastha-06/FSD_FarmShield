/**
 * FarmShield Multilingual Chatbot Service
 * Integrates Google Gemini 1.5 Flash with a robust offline agricultural fallback.
 */

const FALLBACK_RESPONSES = {
  en: {
    blight: "Early Blight (*Alternaria solani*) is identified by concentric dark brown target-ring lesions on older lower leaves, often surrounded by yellow halos. Recommended management: 1) Prune affected lower foliage, 2) Avoid overhead sprinkler irrigation to keep leaves dry, 3) Apply protective Copper Oxychloride (0.3%) or Mancozeb (0.2%), or bio-agent *Trichoderma harzianum*.",
    clayCanal: "For Clay Soil with high Canal Water availability, ideal high-return crops include: 1) **Rice / Paddy** (Kuruvai / Samba pattam), 2) **Sugarcane**, 3) **Banana** (Grand Naine / Robusta). Clay soil retains ample moisture, but ensure good surface drainage channels to prevent waterlogging during heavy monsoon spells.",
    digipin: "**DIGIPIN** is India Post & IIT Hyderabad's 10-character National Digital Addressing system (e.g., `39J-49L-L8T4`). It divides the subcontinent into ~3.8m x 3.8m micro-plots. FarmShield uses DIGIPIN to pinpoint your exact farmland parcel without relying on imprecise pin-codes, feeding exact coordinates to satellite weather stations.",
    humidity: "When relative humidity exceeds 85%, foliar fungal and bacterial spore germination accelerates rapidly (Late Blight, Downy Mildew, Blast). Actionable steps: 1) Increase crop canopy air circulation by pruning redundant leaves, 2) Delay scheduled irrigation to reduce standing moisture, 3) Apply a preventive bio-fungicide (*Pseudomonas fluorescens* or Mancozeb) before rain.",
    urea: "To prevent leaf chemical scorching and ammonia volatilization: 1) Never broadcast Urea on wet morning dew-covered foliage; apply only when leaves are dry in late afternoon, 2) Apply in 3-4 split doses (Basal, Active Tillering, Panicle Initiation) rather than all at once, 3) Incorporate into moist soil followed by light irrigation, 4) Use Neem-Coated Urea for sustained nitrogen release.",
    default: "I am FarmShield's Agronomic Assistant. You can ask me about crop disease symptoms, organic & chemical treatments, soil nutrients (N-P-K), irrigation scheduling, or India Post DIGIPIN field mapping. How can I assist your farm today?"
  },
  ta: {
    blight: "தக்காளி மற்றும் உருளையில் **ஆரம்பகால கருகல் நோய்** (*Alternaria solani*) இலைகளில் வட்ட வளைய வடிவ கரும்பழுப்பு புள்ளிகளாக தோன்றும். மேலாண்மை: 1) பாதிக்கப்பட்ட கீழ் இலைகளை வெட்டி அப்புறப்படுத்துங்கள், 2) இலைகளில் நீர் தேங்காதவாறு சொட்டுநீர் பாசனம் அமையுங்கள், 3) மான்கோசெப் (2 கிராம்/லி) அல்லது காப்பர் ஆக்ஸிகுளோரைடு (2.5 கிராம்/லி) அல்லது டிரைக்கோடெர்மா விரிடி தெளிக்கவும்.",
    clayCanal: "களிமண் மற்றும் வாய்க்கால் பாசன வசதி உள்ள நிலங்களுக்கு மிகவும் பொருத்தமான பயிர்கள்: 1) **நெல்** (குறுவை, சம்பா), 2) **கரும்பு**, 3) **வாழை** (ஜி9, நேந்திரன்). களிமண் ஈரப்பதத்தை நன்கு தக்கவைக்கும், ஆனால் மழைக்காலத்தில் வடிகால் வாய்க்கால்களை அமைப்பது அவசியம்.",
    digipin: "**DIGIPIN** என்பது இந்திய அஞ்சல் துறை மற்றும் ஐஐடி ஹைதராபாத் இணைந்து உருவாக்கிய 10-இலக்க தேசிய எண்முறை நில முகவரி ஆகும் (உதா. `39J-49L-L8T4`). இது இந்திய நிலப்பரப்பை 3.8 மீ x 3.8 மீ நுண்-நிலங்களாக பிரிக்கிறது. உங்கள் நிலத்தின் துல்லிய அமைவிடத்தை கண்டறிந்து துல்லிய வானிலை எச்சரிக்கைகளை வழங்க பார்ம்ஷீல்ட் இதை பயன்படுத்துகிறது.",
    humidity: "காற்றின் ஈரப்பதம் 85% க்கு மேல் இருந்தால் பூஞ்சை மற்றும் பாக்டீரியா நோய்கள் (பின்கால கருகல், சாம்பல் நோய்) வேகமாக பரவும். முன்னெச்சரிக்கை: 1) காற்றோட்டம் கிடைக்க பயிர் இலைகளை கவாத்து செய்யுங்கள், 2) பாசனத்தை தற்காலிகமாக குறைக்கவும், 3) மழையின் முன் சூடோமோனாஸ் அல்லது மான்கோசெப் பாதுகாப்பு தெளிப்பு செய்யவும்.",
    urea: "இலை கருகல் மற்றும் தழைச்சத்து வீணாவதை தடுக்க யூரியா இடும் முறை: 1) காலை பனித்துளி உள்ள ஈரமான இலைகளில் யூரியாவை தூவக்கூடாது; இலைகள் காய்ந்த மாலை வேளையில் இடவும், 2) மொத்த யூரியாவை 3-4 தவணைகளாக பிரித்து இடவும், 3) நிலத்தில் ஈரம் இருக்கும்போது இட்டு லேசான பாசனம் செய்யவும், 4) வேப்பம்பூச்சு யூரியாவைப் பயன்படுத்துங்கள்.",
    default: "வணக்கம்! நான் உங்கள் பார்ம்ஷீல்ட் வேளாண் உதவியாளர். பயிர் நோய்கள், மருந்துகள், மண் பரிசோதனை, உர மேலாண்மை, வானிலை மற்றும் DIGIPIN பற்றி எந்தக் கேள்வியும் கேட்கலாம்."
  },
  hi: {
    blight: "**अगेती झुलसा** (*Alternaria solani*) की पहचान पुरानी निचली पत्तियों पर संकेंद्रित छल्लों (टारगेट रिंग) जैसे गहरे भूरे धब्बों से होती है। रोकथाम: 1) रोगग्रस्त निचली पत्तियों को काटकर नष्ट करें, 2) पत्तियों पर पानी का छिड़काव न करें, 3) मैंकोज़ेब (2 ग्राम/लीटर) या कॉपर ऑक्सीक्लोराइड (2.5 ग्राम/लीटर) या ट्राइकोडर्मा का छिड़काव करें।",
    clayCanal: "चिकनी मिट्टी (Clay Soil) और नहर के पानी के लिए सर्वोत्तम लाभकारी फसलें: 1) **धान / चावल**, 2) **गन्ना**, 3) **केला**। चिकनी मिट्टी में जल धारण क्षमता अधिक होती है, परंतु जलभराव से बचने के लिए जल निकासी नाली अवश्य बनाएं।",
    digipin: "**DIGIPIN** भारतीय डाक और IIT हैदराबाद द्वारा विकसित 10-वर्णों का राष्ट्रीय डिजिटल भू-पता कोड है (उदा. `39J-49L-L8T4`)। यह भारत को 3.8m x 3.8m के सूक्ष्म भूखंडों में विभाजित करता है। फार्मशील्ड इसका उपयोग आपके खेत की सटीक लोकेशन पर मौसम चेतावनी देने के लिए करता है।",
    humidity: "हवा में नमी 85% से अधिक होने पर फंगल और बैक्टीरियल संक्रमण (पछेती झुलसा, डाउनी मिल्ड्यू) का खतरा बढ़ जाता है। सावधानियां: 1) पौधों के बीच हवा का प्रवाह बढ़ाने के लिए अनावश्यक पत्तियां हटाएं, 2) अतिरिक्त सिंचाई रोकें, 3) बारिश से पहले स्यूडोमोनास या मैंकोज़ेब का छिड़काव करें।",
    urea: "पत्तियों को जलने से बचाने और यूरिया की दक्षता बढ़ाने के उपाय: 1) सुबह ओस वाली गीली पत्तियों पर यूरिया न बिखरें; दोपहर बाद सूखी पत्तियों पर डालें, 2) पूरी खुराक एक साथ न देकर 3 बार में विभाजित करके डालें, 3) नमी वाले खेत में डालकर हल्की सिंचाई करें, 4) हमेशा नीम लेपित यूरिया का उपयोग करें।",
    default: "नमस्ते! मैं आपका फार्मशील्ड कृषि सहायक हूँ। आप मुझसे फसल रोग, जैविक व रासायनिक उपचार, खाद-उर्वरक, मौसम और DIGIPIN के बारे में कुछ भी पूछ सकते हैं।"
  },
  te: {
    blight: "**ముందస్తు మాడ తెగులు** (*Alternaria solani*) లక్షణం ఆకులపై వలయాకారపు ముదురు గోధుమ రంగు మచ్చలు. నివారణ: 1) తెగులు సోకిన కింది ఆకులను తుంచి నాశనం చేయండి, 2) ఆకులపై నీరు నిలవకుండా డ్రిప్ పద్ధతిని వాడండి, 3) మాంకోజెబ్ (2 గ్రా/లీ) లేదా కాపర్ ఆక్సిక్లోరైడ్ లేదా ట్రైకోడెర్మా పిచికారీ చేయండి.",
    clayCanal: "నల్లరేగడి / బంకమట్టి మరియు కాలువ నీటికి అనువైన పంటలు: 1) **వరి**, 2) **చెరకు**, 3) **అరటి**. బంకమట్టి తేమను ఎక్కువ కాలం నిలుపుకుంటుంది, కానీ వర్షాకాలంలో మురుగునీరు పోయేందుకు కాలువలు తీయడం తప్పనిసరి.",
    digipin: "**DIGIPIN** అనేది భారత పోస్టల్ శాఖ & IIT హైదరాబాద్ రూపొందించిన 10-అక్షరాల జాతీయ డిజిటల్ చిరునామా (ఉదా: `39J-49L-L8T4`). ఇది దేశాన్ని 3.8 మీ x 3.8 మీ సూక్ష్మ పొలాలుగా విభజిస్తుంది. మీ పొలానికి ఖచ్చితమైన వాతావరణ సమాచారం అందించడానికి ఫార్మ్‌షీల్డ్ దీనిని ఉపయోగిస్తుంది.",
    humidity: "గాలిలో తేమ 85% మించితే శిలీంధ్ర మరియు బాక్టీరియా తెగుళ్ళు వేగంగా వ్యాపిస్తాయి. జాగ్రత్తలు: 1) గాలి వెలుతురు సోకేలా ఆకులను సరిచేయండి, 2) నీటిపారుదల తగ్గించండి, 3) వర్షానికి ముందు మాంకోజెబ్ లేదా సూడోమోనాస్ రక్షక పిచికారీ చేయండి.",
    urea: "ఆకులు మాడకుండా యూరియా వేసే పద్ధతి: 1) ఉదయం మంచు ఉన్న తడి ఆకులపై యూరియా చల్లవద్దు; సాయంత్రం ఆకులు పొడిగా ఉన్నప్పుడు వేయండి, 2) మొత్తం యూరియాను ఒకేసారి కాకుండా 3 దఫాలుగా విభజించి వేయండి, 3) వేసిన వెంటనే తేలికపాటి తడి ఇవ్వండి, 4) వేప పూత పూసిన యూరియా వాడండి.",
    default: "నమస్కారం! నేను మీ ఫార్మ్‌షీల్డ్ వ్యవసాయ సహాయకుడిని. పంట తెగుళ్ళు, ఎరువులు, నేల ఆరోగ్యం, వాతావరణం లేదా DIGIPIN గురించి ఏదైనా అడగండి."
  },
  kn: {
    blight: "**ಮುಂಚಿನ ಕಮರು ರೋಗ** (*Alternaria solani*) ಎಲೆಗಳ ಮೇಲೆ ವೃತ್ತಾಕಾರದ ಕಂದು ಬಣ್ಣದ ಚುಕ್ಕೆಗಳಾಗಿ ಕಾಣಿಸಿಕೊಳ್ಳುತ್ತದೆ. ನಿರ್ವಹಣೆ: 1) ರೋಗಗ್ರಸ್ತ ಕೆಳಗಿನ ಎಲೆಗಳನ್ನು ತೆಗೆದುಹಾಕಿ, 2) ಎಲೆಗಳ ಮೇಲೆ ನೀರು ನಿಲ್ಲದಂತೆ ಹನಿ ನೀರಾವರಿ ಬಳಸಿ, 3) ಮ್ಯಾಂಕೋಜೆಬ್ (2 ಗ್ರಾಂ/ಲೀ) ಅಥವಾ ತಾಮ್ರದ ಆಕ್ಸಿಕ್ಲೋರೈಡ್ ಅಥವಾ ಟ್ರೈಕೋಡರ್ಮಾ ಸಿಂಪಡಿಸಿ.",
    clayCanal: "ಜೇಡಿಮಣ್ಣು ಮತ್ತು ಕಾಲುವೆ ನೀರಿಗೆ ಸೂಕ್ತವಾದ ಬೆಳೆಗಳು: 1) **ಭತ್ತ**, 2) **ಕಬ್ಬು**, 3) **ಬಾಳೆ**. ಜೇಡಿಮಣ್ಣು ತೇವಾಂಶವನ್ನು ಚೆನ್ನಾಗಿ ಹಿಡಿದಿಟ್ಟುಕೊಳ್ಳುತ್ತದೆ, ಆದರೆ ನೀರು ನಿಲ್ಲದಂತೆ ಬಸಿಗಾಲುವೆಗಳನ್ನು ನಿರ್ಮಿಸುವುದು ಮುಖ್ಯ.",
    digipin: "**DIGIPIN** ಎಂಬುದು ಭಾರತೀಯ ಅಂಚೆ ಮತ್ತು ಐಐಟಿ ಹೈದರಾಬಾದ್ ಅಭಿವೃದ್ಧಿಪಡಿಸಿದ 10-ಅಕ್ಷರಗಳ ಡಿಜಿಟಲ್ ವಿಳಾಸವಾಗಿದೆ (ಉದಾ. `39J-49L-L8T4`). ಇದು ಭೂಮಿಯನ್ನು 3.8 ಮೀ x 3.8 ಮೀ ಸಣ್ಣ ಪ್ಲಾಟ್‌ಗಳಾಗಿ ಗುರುತಿಸುತ್ತದೆ. ನಿಮ್ಮ ಜಮೀನಿಗೆ ನಿಖರ ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ ನೀಡಲು ಫಾರ್ಮ್‌ಶೀಲ್ಡ್ ಇದನ್ನು ಬಳಸುತ್ತದೆ.",
    humidity: "ಗಾಳಿಯಲ್ಲಿ ತೇವಾಂಶ 85% ಕ್ಕಿಂತ ಹೆಚ್ಚಿದ್ದರೆ ಎಲೆ ರೋಗಗಳು ವೇಗವಾಗಿ ಹರಡುತ್ತವೆ. ಮುನ್ನೆಚ್ಚರಿಕೆ: 1) ಗಾಳಿಯಾಡುವಂತೆ ಎಲೆಗಳನ್ನು ಸವರಬೇಕು, 2) ನೀರಾವರಿಯನ್ನು ತಾತ್ಕಾಲಿಕವಾಗಿ ಕಡಿಮೆ ಮಾಡಿ, 3) ಮಳೆಯ ಮುನ್ನ ಮ್ಯಾಂಕೋಜೆಬ್ ಅಥವಾ ಸೂಡೋಮೊನಾಸ್ ಸಿಂಪಡಿಸಿ.",
    urea: "ಎಲೆಗಳು ಸುಟ್ಟುಹೋಗದಂತೆ ಯೂರಿಯಾ ಬಳಸುವ ವಿಧಾನ: 1) ಮುಂಜಾನೆ ಇಬ್ಬನಿ ಇರುವಾಗ ಎಲೆಗಳ ಮೇಲೆ ಯೂರಿಯಾ ಸಿಂಪಡಿಸಬೇಡಿ; ಸಂಜೆ ಎಲೆ ಒಣಗಿದಾಗ ಹಾಕಿ, 2) ಒಮ್ಮೆಲೇ ಪೂರ್ತಿ ಹಾಕದೆ 3 ಹಂತಗಳಲ್ಲಿ ವಿಂಗಡಿಸಿ ಹಾಕಿ, 3) ಮಣ್ಣಿನಲ್ಲಿ ತೇವಾಂಶವಿರುವಾಗ ಹಾಕಿ ಲಘು ನೀರು ಕೊಡಿ, 4) ಬೇವಿನ ಲೇಪಿತ ಯೂರಿಯಾ ಬಳಸಿ.",
    default: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಫಾರ್ಮ್‌ಶೀಲ್ಡ್ ಕೃಷಿ ಸಹಾಯಕ. ಬೆಳೆ ರೋಗಗಳು, ಗೊಬ್ಬರಗಳು, ಮಣ್ಣಿನ ಫಲವತ್ತತೆ, ಹವಾಮಾನ ಅಥವಾ DIGIPIN ಬಗ್ಗೆ ಯಾವುದೇ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ."
  },
  ml: {
    blight: "**ഏർലി ബ്ലൈറ്റ്** (*Alternaria solani*) ഇലകളിൽ വൃത്തത്തിലുള്ള ഇരുണ്ട തവിട്ടുനിറത്തിലുള്ള പാടുകളായി കാണപ്പെടുന്നു. നിയന്ത്രണം: 1) രോഗം ബാധിച്ച അടിയിലെ ഇലകൾ മുറിച്ചു മാറ്റുക, 2) ഇലകളിൽ വെള്ളം തങ്ങിനിൽക്കാതിരിക്കാൻ ശ്രദ്ധിക്കുക, 3) മാങ്കോസെബ് (2 ഗ്രാം/ലിറ്റർ) അല്ലെങ്കിൽ കോപ്പർ ഓക്സിക്ലോറൈഡ് അല്ലെങ്കിൽ ട്രൈക്കോഡെർമ തളിക്കുക.",
    clayCanal: "കരിമണ്ണിലും കനാൽ ജലസേചനത്തിലും ഏറ്റവും അനുയോജ്യമായ വിളകൾ: 1) **നെല്ല്**, 2) **കരിമ്പ്**, 3) **വാഴ** (നേന്ത്രൻ, ഗ്രാൻഡ് നൈൻ). കളിമണ്ണ് ഈർപ്പം നന്നായി നിലനിർത്തും, എന്നാൽ മഴക്കാലത്ത് വെള്ളക്കെട്ട് ഒഴിവാക്കാൻ നീർവാർച്ചാ ചാലുകൾ നിർമ്മിക്കുക.",
    digipin: "**DIGIPIN** എന്നത് ഇന്ത്യൻ തപാൽ വകുപ്പും ഐഐടി ഹൈദരാബാദും ചേർന്നൊരുക്കിയ 10-അക്ഷര ഡിജിറ്റൽ വിലാസമാണ് (ഉദാ. `39J-49L-L8T4`). ഇത് രാജ്യത്തെ 3.8 മീ x 3.8 മീ സൂക്ഷ്മ പ്ലോട്ടുകളായി തിരിക്കുന്നു. നിങ്ങളുടെ കൃഷിയിടത്തിലേക്ക് കൃത്യമായ കാലാവസ്ഥാ വിവരങ്ങൾ നൽകാൻ ഫാംഷീൽഡ് ഇത് ഉപയോഗിക്കുന്നു.",
    humidity: "അന്തരീക്ഷ ഈർപ്പം 85% ന് മുകളിലായാൽ കുമിൾ രോഗങ്ങൾ പടരാൻ സാധ്യതയുണ്ട്. മുൻകരുതലുകൾ: 1) വായുസഞ്ചാരം കൂട്ടാൻ ഇലകൾ കോതി നിർത്തുക, 2) നനയ്ക്കുന്നത് കുറയ്ക്കുക, 3) മഴയ്ക്ക് മുൻപായി സ്യൂഡോമോണസ് അല്ലെങ്കിൽ മാങ്കോസെബ് മുൻകരുതലായി തളിക്കുക.",
    urea: "ഇലകൾ കരിഞ്ഞുപോകാതിരിക്കാൻ യൂറിയ പ്രയോഗിക്കുന്ന രീതി: 1) പ്രഭാതത്തിലെ മഞ്ഞുള്ളപ്പോൾ നനഞ്ഞ ഇലകളിൽ യൂറിയ വിതറരുത്; വൈകുന്നേരം ഇലകൾ ഉണങ്ങിയ ശേഷം പ്രയോഗിക്കുക, 2) ഒന്നിച്ച് പ്രയോഗിക്കാതെ 3 തവണകളായി നൽകുക, 3) മണ്ണിൽ ഈർപ്പമുള്ളപ്പോൾ പ്രയോഗിച്ച് നേരിയ നന നൽകുക, 4) വേപ്പെണ്ണ പുരട്ടിയ യൂറിയ ഉപയോഗിക്കുക.",
    default: "നമസ്കാരം! ഞാൻ നിങ്ങളുടെ ഫാംഷീൽഡ് കാർഷിക സഹായിയാണ്. വിള രോഗങ്ങൾ, വളങ്ങൾ, മണ്ണ്, കാലാവസ്ഥ, DIGIPIN എന്നിവയെക്കുറിച്ച് എന്ത് സംശയവും ചോദിക്കാം."
  }
};

const getLocalFallbackAnswer = (question, lang = 'en') => {
  const q = (question || '').toLowerCase();
  const responses = FALLBACK_RESPONSES[lang] || FALLBACK_RESPONSES.en;

  if (q.includes('blight') || q.includes('கருகல்') || q.includes('झुलसा') || q.includes('మాడ') || q.includes('ಕಮರು')) {
    return responses.blight;
  }
  if (q.includes('clay') || q.includes('canal') || q.includes('களிமண்') || q.includes('வாய்க்கால்') || q.includes('मिट्टी') || q.includes('నల్లరేగడి') || q.includes('ಜೇಡಿಮಣ್ಣು') || q.includes('കരിമണ്ണ്')) {
    return responses.clayCanal;
  }
  if (q.includes('digipin') || q.includes('டிஜிபின்') || q.includes('डीजीपिन') || q.includes('డిజిపిన్') || q.includes('ಡಿಜಿಪಿನ್')) {
    return responses.digipin;
  }
  if (q.includes('humid') || q.includes('85') || q.includes('ஈரப்பதம்') || q.includes('नमी') || q.includes('తేమ') || q.includes('ತೇವಾಂಶ') || q.includes('ഈർപ്പം')) {
    return responses.humidity;
  }
  if (q.includes('urea') || q.includes('யூரியா') || q.includes('यूरिया') || q.includes('యూరియా') || q.includes('ಯೂರಿಯಾ')) {
    return responses.urea;
  }
  return responses.default;
};

const LANGUAGE_NAMES = {
  en: 'English',
  ta: 'Tamil (தமிழ்)',
  hi: 'Hindi (हिन्दी)',
  te: 'Telugu (తెలుగు)',
  kn: 'Kannada (ಕನ್ನಡ)',
  ml: 'Malayalam (മലയാളം)'
};

/**
 * Generate agricultural advisory reply using Gemini 1.5 Flash (or local fallback)
 * @param {Object} params
 * @param {string} params.message - Farmer's question
 * @param {string} params.language - Language code ('en', 'ta', 'hi', 'te', 'kn', 'ml')
 * @param {Object} [params.context] - Optional farm context (crop, soil, weather, disease diagnosis)
 * @returns {Promise<{reply: string, source: 'gemini' | 'local_fallback', model: string}>}
 */
export const askAgronomicAssistant = async ({ message, language = 'en', context = {} }) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const isKeyConfigured = Boolean(
    apiKey &&
    apiKey.trim() !== '' &&
    apiKey !== 'YOUR_GEMINI_API_KEY_HERE' &&
    apiKey !== 'your_gemini_api_key_here'
  );

  // If no API key configured, use local rule-based fallback immediately (0ms latency, 100% free)
  if (!isKeyConfigured) {
    const fallbackAnswer = getLocalFallbackAnswer(message, language);
    return {
      reply: fallbackAnswer,
      source: 'local_fallback',
      model: 'FarmShield Agronomic Knowledge Engine (Offline)',
      notice: 'Gemini API key placeholder detected in server/.env. Using built-in local knowledge engine.'
    };
  }

  // Construct context-grounded system instructions
  const langName = LANGUAGE_NAMES[language] || 'English';
  let contextSnippet = '';
  if (context.crop) contextSnippet += `\n- Current Crop: ${context.crop}`;
  if (context.soilType) contextSnippet += `\n- Soil Type: ${context.soilType}`;
  if (context.temperature) contextSnippet += `\n- Temperature: ${context.temperature}°C`;
  if (context.humidity) contextSnippet += `\n- Humidity: ${context.humidity}%`;
  if (context.recentDiagnosis) contextSnippet += `\n- Recent DINOv2 Diagnosis: ${context.recentDiagnosis}`;

  const systemInstruction = `You are FarmShield's expert agricultural advisor and agronomist for Indian farmers.
CRITICAL INSTRUCTIONS:
1. You MUST respond in ${langName} script only. Do not mix languages.
2. Provide practical, actionable, grounded farming advice.
3. When recommending chemicals or fertilizers, include specific dosages (e.g. Copper Oxychloride 0.3% / 3g/L, Mancozeb 2g/L, Neem-coated urea split application) and organic bio-control alternatives (Trichoderma, Pseudomonas).
4. Keep the answer concise (under 130 words), well-structured with clear bullet points.
5. If field context is provided, personalize your guidance to their exact conditions.${contextSnippet ? `\n\nFARMER CONTEXT:${contextSnippet}` : ''}`;

  try {
    const candidateModels = [
      process.env.GEMINI_MODEL || 'gemini-1.5-flash',
      'gemini-1.5-flash-latest',
      'gemini-2.0-flash',
      'gemini-1.5-pro'
    ];

    let lastError = null;

    for (const modelToTry of candidateModels) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelToTry}:generateContent?key=${apiKey.trim()}`;

        const payload = {
          system_instruction: {
            parts: [{ text: systemInstruction }]
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: message }]
            }
          ],
          generationConfig: {
            temperature: 0.25,
            maxOutputTokens: 500,
            topP: 0.95
          }
        };

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey.trim()
          },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(9000) // 9s timeout for responsive UI
        });

        if (response.status === 404) {
          // Model name variant not enabled on this key, try next candidate
          continue;
        }

        if (!response.ok) {
          const errText = await response.text().catch(() => '');
          console.warn(`[Gemini API] HTTP ${response.status}: ${errText.slice(0, 150)}`);
          lastError = `Gemini HTTP ${response.status}`;
          break;
        }

        const data = await response.json();
        const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (candidateText && typeof candidateText === 'string' && candidateText.trim() !== '') {
          return {
            reply: candidateText.trim(),
            source: 'gemini',
            model: `Google ${modelToTry.replace('gemini-', 'Gemini ')}`
          };
        }
      } catch (e) {
        lastError = e.message;
        break;
      }
    }

    return {
      reply: getLocalFallbackAnswer(message, language),
      source: 'local_fallback',
      model: 'FarmShield Agronomic Knowledge Engine (Offline Fallback)',
      error: lastError || 'Gemini model unavailable'
    };
  } catch (error) {
    console.warn('[Gemini API] Request failed, switching to local knowledge engine:', error.message);
    return {
      reply: getLocalFallbackAnswer(message, language),
      source: 'local_fallback',
      model: 'FarmShield Agronomic Knowledge Engine (Offline Fallback)',
      error: error.message
    };
  }
};
