export type Language = "en" | "hi";

export type TranslationDictionary = Record<string, Record<Language, string>>;

export const translations: TranslationDictionary = {
  // Global & Header
  "app.title": { en: "Kanch-Net", hi: "काँच-नेट" },
  "app.subtitle": { en: "Firozabad Craft Network", hi: "फिरोजाबाद काँच क्राफ्ट नेटवर्क" },
  "header.home": { en: "Home", hi: "मुख्य" },
  "header.myPiles": { en: "My Piles", hi: "मेरे बंडल" },
  "header.buyerLot": { en: "Buyer Lot", hi: "खरीदार लॉट" },
  "header.escrowPool": { en: "Escrow Pool", hi: "एस्क्रो पूल" },
  "header.pickupQc": { en: "Pickup QC", hi: "पिकअप जाँच" },
  "header.payouts": { en: "Payouts", hi: "भुगतान" },
  "header.matchingEngine": { en: "Matching Engine", hi: "मैचिंग इंजन" },
  "header.mandiMap": { en: "Mandi Map", hi: "मंडी नक्शा" },
  "header.logout": { en: "Log out", hi: "लॉग आउट" },
  "header.staffNote": {
    en: "Staff Inspection View · Deterministic Spec Matching Active",
    hi: "कर्मचारी निरीक्षण दृश्य · नियम-आधारित मिलान सक्रिय",
  },
  "lang.switchLabel": { en: "Switch language to Hindi", hi: "अंग्रेजी में बदलें" },
  "lang.display": { en: "🇮🇳 हिन्दी", hi: "🇬🇧 English" },

  // Bottom Navigation
  "nav.home": { en: "Home", hi: "मुख्य" },
  "nav.piles": { en: "Piles", hi: "बंडल" },
  "nav.chat": { en: "Chat", hi: "बात" },
  "nav.orders": { en: "Orders", hi: "ऑर्डर" },
  "nav.money": { en: "Money", hi: "पैसा" },
  "nav.pickup": { en: "Pickup", hi: "पिकअप" },
  "nav.matching": { en: "Matching", hi: "मिलान" },
  "nav.map": { en: "Map", hi: "नक्शा" },

  // Homepage & Login
  "home.tagline": {
    en: "Firozabad Glass Bangle Household Network",
    hi: "फिरोजाबाद काँच चूड़ी कारीगर परिवार नेटवर्क",
  },
  "home.description": {
    en: "Connecting small home-based worker piles into verified wholesale buyer lots.",
    hi: "छोटे घरेलू कारीगरों के बंडलों को थोक खरीदार के बड़े ऑर्डर से जोड़ना।",
  },
  "home.processTitle": {
    en: "नेटवर्क की प्रक्रिया / How It Works",
    hi: "नेटवर्क की कार्य प्रक्रिया",
  },
  "home.step1Title": { en: "1. My Piles", hi: "1. घरेलू बंडल" },
  "home.step1Sub": { en: "200–500 pcs", hi: "200–500 नग" },
  "home.step2Title": { en: "2. Aggregate", hi: "2. एकत्रीकरण" },
  "home.step2Sub": { en: "Locality pools", hi: "इलाके के पूल" },
  "home.step3Title": { en: "3. Match", hi: "3. स्पेक मिलान" },
  "home.step3Sub": { en: "Spec verification", hi: "सख्त गुणवत्ता जाँच" },
  "home.step4Title": { en: "4. Fulfillment", hi: "4. पूर्ति व भुगतान" },
  "home.step4Sub": { en: "QC & Escrow", hi: "जाँच व एस्क्रो" },
  "login.title": { en: "Portal Login", hi: "पोर्टल में प्रवेश" },
  "login.subtitle": {
    en: "Enter your registered phone number & 4-digit PIN code",
    hi: "अपना पंजीकृत फोन नंबर और 4-अंकों का पिन कोड दर्ज करें",
  },
  "login.phoneLabel": { en: "Phone Number", hi: "फोन नंबर" },
  "login.phonePlaceholder": { en: "e.g. 9000000001", hi: "उदा. 9000000001" },
  "login.codeLabel": { en: "Code", hi: "पिन कोड" },
  "login.codePlaceholder": { en: "e.g. 1111", hi: "उदा. 1111" },
  "login.error": {
    en: "Invalid phone or security code.",
    hi: "गलत फोन नंबर या सुरक्षा कोड।",
  },
  "login.submit": { en: "Enter Portal", hi: "पोर्टल में प्रवेश करें" },
  "login.quickDemo": { en: "Quick Demo Accounts:", hi: "त्वरित परीक्षण खाते:" },
  "home.footerTitle": {
    en: "Kanch-Net · Firozabad Craft Supply Aggregation Engine",
    hi: "काँच-नेट · फिरोजाबाद काँच क्राफ्ट आपूर्ति एकत्रीकरण",
  },
  "home.footerSub": {
    en: "Preserving artisan privacy (Household IDs only) & deterministic spec matching",
    hi: "कारीगरों की गोपनीयता (केवल परिवार आईडी) और नियम-आधारित मिलान",
  },

  // Matching Engine
  "matching.badge": { en: "Deterministic Engine", hi: "नियम-आधारित इंजन" },
  "matching.title": { en: "Matching Engine", hi: "स्पेक मिलान स्क्रीन" },
  "matching.buyerOrder": { en: "Buyer Order", hi: "खरीदार का ऑर्डर" },
  "matching.mandi": { en: "Firozabad Mandi", hi: "फिरोजाबाद मंडी" },
  "matching.redBangles": { en: "red glass bangles", hi: "लाल काँच चूड़ियाँ" },
  "matching.demandSub": {
    en: "Wholesale Mandi Buyer Demand Lot",
    hi: "थोक मंडी खरीदार मांग लॉट",
  },
  "matching.reqTitle": { en: "Requirements / शर्तें:", hi: "शर्ते एवं गुणवत्ता आवश्यकताएँ:" },
  "matching.matchedPieces": { en: "Matched pieces", hi: "मेल खाने वाले नग" },
  "matching.totalNeeded": { en: "total needed", hi: "कुल आवश्यक" },
  "matching.remaining": { en: "Remaining", hi: "बाकी मात्रा" },
  "matching.lotFull": { en: "Lot is 100% full", hi: "ऑर्डर 100% पूरा हो गया" },
  "matching.piecesShort": { en: "pieces short", hi: "नग और चाहिए" },
  "matching.matchingPiles": { en: "Matching Piles", hi: "मेल खाने वाले बंडल" },
  "matching.pilesQualified": { en: "piles qualified", hi: "बंडल योग्य पाए गए" },
  "matching.noMatchingPiles": {
    en: "No matching piles qualified yet.",
    hi: "अभी कोई मेल खाने वाला बंडल उपलब्ध नहीं है।",
  },
  "matching.nonMatchingPiles": {
    en: "Non-Matching Piles",
    hi: "मेल न खाने वाले (अस्वीकृत) बंडल",
  },
  "matching.pilesRejected": { en: "piles rejected", hi: "बंडल अस्वीकृत" },
  "matching.nonMatchingSub": {
    en: "Separated deterministically based on first spec mismatch.",
    hi: "गुणवत्ता या साइज़ में अंतर के कारण पृथक किए गए।",
  },
  "matching.allMatch": { en: "All available piles match!", hi: "सभी उपलब्ध बंडल मेल खाते हैं!" },

  // Phone / Worker Experience
  "phone.badge": { en: "Worker Mobile", hi: "घरेलू कारीगर फोन" },
  "phone.sub": {
    en: "Firozabad Glass Household Portal · Simple 1-Tap Operation",
    hi: "फिरोजाबाद काँच परिवार पोर्टल · सरल 1-टैप उपयोग",
  },
  "phone.tabMyPiles": { en: "My Piles", hi: "मेरे बंडल" },
  "phone.tabAddPile": { en: "Add Stock", hi: "नया माल" },
  "phone.tabOrders": { en: "Orders", hi: "मांग (ऑर्डर)" },
  "phone.speakBtn": { en: "Speak (Voice Entry)", hi: "बोलकर दर्ज करें" },
  "phone.speakSub": {
    en: "Tap mic or fill simple form below",
    hi: "माइक दबाएँ या नीचे आसान फॉर्म भरें",
  },
  "phone.addNewStock": { en: "Add New Stock", hi: "नया माल दर्ज करें" },
  "phone.productLabel": { en: "1. Product", hi: "1. उत्पाद चुनें" },
  "phone.sizeLabel": { en: "2. Size", hi: "2. साइज़ चुनें" },
  "phone.qtyLabel": { en: "3. Quantity (pieces)", hi: "3. संख्या (टुकड़े)" },
  "phone.readyDateLabel": { en: "4. Ready Date", hi: "4. तैयार होने की तारीख" },
  "phone.submitNext": { en: "Next to Confirm", hi: "आगे बढ़ें (पुष्टि करें)" },
  "phone.confirmTitle": { en: "Is this correct?", hi: "क्या यह सही है?" },
  "phone.confirmSub": {
    en: "Please review before saving under My Piles",
    hi: "कृपया 'मेरे बंडल' में सेव करने से पहले जाँच लें",
  },
  "phone.confirmYes": { en: "Confirm & Save", hi: "हाँ, पक्का करें (सेव करें)" },
  "phone.confirmEdit": { en: "Edit / Go Back", hi: "वापस बदलें" },
  "phone.noPilesYet": { en: "No piles added yet", hi: "अभी कोई बंडल दर्ज नहीं है" },
  "phone.noPilesSub": {
    en: "Tap 'Add Stock' to enter your first bundle.",
    hi: "'नया माल' बटन दबाकर पहला बंडल जोड़ें।",
  },
  "phone.openDemandsTitle": { en: "Buyer Orders", hi: "खुली मांग (खरीदार ऑर्डर)" },
  "phone.openDemandsSub": {
    en: "Wholesale buyer demands in Firozabad Mandi",
    hi: "फिरोजाबाद मंडी में थोक खरीदार की मांगें",
  },

  // Artisan Home
  "artisan.title": { en: "Your Work", hi: "आपका काम" },
  "artisan.craftLabel": { en: "Craft Category", hi: "काम का प्रकार" },
  "artisan.bangles": { en: "Glass Bangles", hi: "काँच चूड़ी" },
  "artisan.pottery": { en: "Pottery (In development)", hi: "मिट्टी के बर्तन (निर्माणाधीन)" },
  "artisan.textile": { en: "Textile (In development)", hi: "कपड़ा (निर्माणाधीन)" },
  "artisan.locked": {
    en: "This craft is not open yet. Select Glass Bangles.",
    hi: "यह काम अभी चालू नहीं है। काँच चूड़ी चुनें।",
  },
  "artisan.addStock": { en: "Add Stock", hi: "स्टॉक दर्ज करें" },
  "artisan.addHint": {
    en: "Select colour, quantity, quality. Then post for buyers.",
    hi: "रंग, संख्या, गुणवत्ता चुनें। फिर पोस्ट करें।",
  },
  "artisan.speak": { en: "Speak", hi: "बोलें" },
  "artisan.listening": { en: "Listening...", hi: "सुन रहे हैं..." },
  "artisan.micHint": {
    en: "Say red or blue, quantity, and grade A or B.",
    hi: "लाल या नीली, संख्या, और ग्रेड A या B बोलें।",
  },
  "artisan.colour": { en: "Colour", hi: "रंग" },
  "artisan.red": { en: "Red (लाल)", hi: "लाल" },
  "artisan.blue": { en: "Blue (नीली)", hi: "नीली" },
  "artisan.howMany": { en: "How many pieces", hi: "कितने टुकड़े" },
  "artisan.quality": { en: "Quality Grade", hi: "गुणवत्ता ग्रेड" },
  "artisan.gradeA": { en: "A · Fine", hi: "A · बढ़िया" },
  "artisan.gradeB": { en: "B · Regular", hi: "B · सामान्य" },
  "artisan.postStock": { en: "Post Stock", hi: "स्टॉक भेजें" },
  "artisan.buyerWants": { en: "Buyer Demand", hi: "खरीदार की मांग" },
  "artisan.yourStock": { en: "Your Stock Piles", hi: "आपका उपलब्ध स्टॉक" },
  "artisan.noneYet": { en: "No stock posted yet.", hi: "अभी कोई स्टॉक दर्ज नहीं है।" },

  // Buyer Home
  "buyer.title": { en: "Buyer Portal", hi: "खरीदार पोर्टल" },
  "buyer.raiseDemand": { en: "Raise a Demand Lot", hi: "नई मांग (ऑर्डर) दर्ज करें" },
  "buyer.raiseHint": {
    en: "Specify colour, quantity, size, and grade requirement.",
    hi: "रंग, संख्या, साइज़ और गुणवत्ता चुनें।",
  },
  "buyer.postDemand": { en: "Post Demand Lot", hi: "मांग पोस्ट करें" },
  "buyer.postedNote": {
    en: "Demand posted. Artisans see it. Matching piles ordered nearest first.",
    hi: "मांग भेज दी गई है। कारीगरों को दिखेगी। मिलती स्टॉक पास वाले इलाकों से दिखेगी।",
  },
  "buyer.openDemands": { en: "Your Active Demands", hi: "आपकी चालू मांगें" },
  "buyer.artisanStock": { en: "Matching Artisan Stock", hi: "मेल खाने वाला कारीगर स्टॉक" },
  "buyer.stockHint": {
    en: "Exact spec match first. Then sorted by distance to Mandi.",
    hi: "पहले वही गुणवत्ता व रंग। फिर मंडी से दूरी के आधार पर।",
  },
  "buyer.noMatch": { en: "No matching stock available yet.", hi: "अभी कोई मेल खाता स्टॉक उपलब्ध नहीं है।" },
  "buyer.wontWork": { en: "Non-Matching Stock", hi: "मेल न खाने वाला स्टॉक" },
  "buyer.showMore": { en: "Show More Stock", hi: "और स्टॉक देखें" },
  "buyer.hideMore": { en: "Hide Extra Stock", hi: "अतिरिक्त स्टॉक छिपाएँ" },

  // Pickup QC
  "pickup.title": { en: "Pickup & QC Verification", hi: "पिकअप व गुणवत्ता जाँच" },
  "pickup.badge": { en: "Collector Portal", hi: "कलेक्टर पोर्टल" },
  "pickup.selectBatch": { en: "Select Household Batch", hi: "परिवार का बंडल चुनें" },
  "pickup.inspectTitle": { en: "QC Inspection Form", hi: "गुणवत्ता निरीक्षण फॉर्म" },
  "pickup.collected": { en: "Total Collected Qty", hi: "कुल इकट्ठा संख्या" },
  "pickup.good": { en: "Good / Qualified", hi: "सही माल (स्वीकृत)" },
  "pickup.damaged": { en: "Broken / Damaged", hi: "टूटा / खराब माल" },
  "pickup.saveBtn": { en: "Save QC Inspection", hi: "जाँच दर्ज करें" },
  "pickup.savedMsg": {
    en: "QC verification saved. Escrow payout updated.",
    hi: "जाँच दर्ज हो गई। एस्क्रो भुगतान अपडेट हो गया।",
  },

  // Money & Escrow
  "money.title": { en: "Money Pool & Escrow", hi: "पैसा पूल व एस्क्रो" },
  "money.badge": { en: "Financial Escrow", hi: "वित्तीय एस्क्रो" },
  "money.sub": {
    en: "Escrow settlement engine. Advance booking locked → Released to artisan families post-QC inspection.",
    hi: "एस्क्रो भुगतान प्रणाली। बुकिंग जमा → जाँच के बाद कारीगर परिवारों को रिहाई।",
  },
  "money.releasedTitle": { en: "Released Payouts", hi: "रिहाई भुगतान" },
  "money.releasedSub": {
    en: "Accepted QC pieces paid to artisan households",
    hi: "जाँच में पास हुए माल का कारीगर परिवारों को भुगतान",
  },
  "money.noPayouts": {
    en: "No payouts released yet. Complete Collector QC inspection first.",
    hi: "अभी कोई भुगतान नहीं हुआ है। कलेक्टर जाँच पूरी करें।",
  },

  // Chat
  "chat.title": { en: "Chat & Sample Demos", hi: "बातचीत व सैंपल डेमो" },
  "chat.sub": {
    en: "Exchange sample demos and negotiate fulfillment.",
    hi: "सैंपल डेमो भेजें व खरीदार से बात करें।",
  },
  "chat.sendSampleTitle": { en: "Send Demo Sample Piece", hi: "सैंपल डेमो भेजें" },
  "chat.sendSampleSub": {
    en: "Send a small 12-24 piece batch to lock buyer commitment",
    hi: "खरीदार की पुष्टि के लिए 12-24 पीस सैंपल भेजें",
  },
  "chat.acceptDemo": { en: "Accept Demo", hi: "डेमो स्वीकार करें" },
  "chat.rejectDemo": { en: "Reject Demo", hi: "डेमो अस्वीकार करें" },
  "chat.typePlaceholder": { en: "Type message...", hi: "संदेश लिखें..." },
  "chat.send": { en: "Send", hi: "भेजें" },

  // Map
  "map.title": { en: "Locality Map", hi: "इलाका नक्शा" },
  "map.sub": {
    en: "Firozabad glass cluster geography. Nearest households prioritized after spec matching.",
    hi: "फिरोजाबाद काँच क्लस्टर। स्पेक मैच के बाद पास के परिवारों को प्राथमिकता।",
  },
};

export function getTranslation(lang: Language, key: string, params?: Record<string, string | number>): string {
  const dict = translations[key];
  if (!dict) return key;
  let val = dict[lang] || dict["en"] || key;
  if (params) {
    Object.entries(params).forEach(([pKey, pVal]) => {
      val = val.replace(new RegExp(`{${pKey}}`, "g"), String(pVal));
    });
  }
  return val;
}
