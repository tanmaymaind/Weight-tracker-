/* Tracking Weight — standalone app, vanilla JS, localStorage only. No server, no AI. */
(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };

  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage full */ } }
  };

  /* ---------------- Language dictionary (main UI labels) ---------------- */
  var DICT = {
    en: {
      subtitle: 'Indian food calorie & weight loss tracker',
      setupTitle: 'Make Your Plan', setupSub: 'Fill details once — the app will make your daily calorie target.',
      age: 'Age (years)', gender: 'Gender', male: 'Male', female: 'Female', other: 'Other',
      height: 'Height (feet + inches)', weight: 'Current Weight (kg)', targetWeight: 'Target Weight (kg)',
      activity: 'Activity Level', actSed: 'Sedentary (mostly sitting)', actLight: 'Light active (light walk)',
      actMod: 'Moderate active (daily walk / work)', actHigh: 'Very active (heavy work / training)',
      makePlan: 'Make My Plan', todayTitle: "Today's Account", calLeftLabel: 'calories left',
      eaten: 'eaten', target: 'target', burned: 'burned', protein: 'Protein', water: 'Water',
      todayFood: 'Eaten Today', noFoodYet: 'Nothing added yet.', todayEx: "Today's Exercise", noExYet: 'No exercise logged yet.',
      addFood: 'Add Food', searchFood: 'Search food… (roti, dal, dosa…)', customFood: 'Add Your Own Food',
      cfNamePh: 'Food name', cfCalPh: 'Calories', cfProtPh: 'Protein (g)', addBtn: 'Add',
      exercise: 'Exercise', exNote: 'Calories are calculated from your body weight.', duration: 'How many minutes?',
      recipes: 'Home Recipes', recNote: 'Tick the items you have at home.',
      progress: 'Progress', goalProg: 'Towards goal', weightPh: 'Weight (kg)', editProfile: 'Edit Profile',
      photoTitle: 'Monthly Body Photo', photoNote: 'Take 1 photo every month. Photos stay only in your browser. Photo comparison is visual only — it is not a medical measurement.',
      photoNotePh: 'Note (optional)', savePhoto: 'Save Photo',
      navToday: 'Today', navFood: 'Food', navEx: 'Exercise', navRec: 'Recipes', navProg: 'Progress',
      bmi: 'BMI', dailyTarget: 'Daily calorie target', proteinTarget: 'Protein target', planSaved: 'Plan saved! Your daily target is ready.',
      add: 'Add', warnTitle: 'Careful', swapLabel: 'Better swap:', noRecipe: 'No recipe matches — tick more ingredients.',
      perMin: 'for the minutes above', monthPhotoDone: 'This month photo is done.', monthPhotoPending: 'This month photo is pending.',
      choosePhoto: 'First choose a photo.', photoSaved: 'Photo saved.', replaced: 'This month photo replaced.',
      added: 'Added', deleted: 'Removed', pickIng: 'Tick ingredients to see recipes.',
      before: 'Before', now: 'Now', goalDone: 'Goal reached!'
    },
    hi: {
      subtitle: 'भारतीय खाने का कैलोरी और वज़न घटाने वाला ट्रैकर',
      setupTitle: 'अपना प्लान बनाओ', setupSub: 'एक बार डिटेल भरो, ऐप आपका डेली कैलोरी टारगेट बना देगा।',
      age: 'उम्र (साल)', gender: 'जेंडर', male: 'पुरुष', female: 'महिला', other: 'अन्य',
      height: 'लंबाई (फीट + इंच)', weight: 'अभी का वज़न (kg)', targetWeight: 'टारगेट वज़न (kg)',
      activity: 'एक्टिविटी लेवल', actSed: 'कम एक्टिव (ज़्यादा बैठना)', actLight: 'हल्का एक्टिव (हल्की वॉक)',
      actMod: 'मध्यम एक्टिव (रोज़ वॉक / काम)', actHigh: 'बहुत एक्टिव (भारी काम / ट्रेनिंग)',
      makePlan: 'मेरा प्लान बनाओ', todayTitle: 'आज का हिसाब', calLeftLabel: 'कैलोरी बची',
      eaten: 'खाई', target: 'टारगेट', burned: 'बर्न', protein: 'प्रोटीन', water: 'पानी',
      todayFood: 'आज खाया हुआ', noFoodYet: 'अभी कुछ ऐड नहीं किया।', todayEx: 'आज की एक्सरसाइज़', noExYet: 'अभी कोई एक्सरसाइज़ लॉग नहीं की।',
      addFood: 'खाना ऐड करो', searchFood: 'खाना ढूंढो… (रोटी, दाल, डोसा…)', customFood: 'अपना खाना ऐड करो',
      cfNamePh: 'खाने का नाम', cfCalPh: 'कैलोरी', cfProtPh: 'प्रोटीन (g)', addBtn: 'ऐड करो',
      exercise: 'एक्सरसाइज़', exNote: 'कैलोरी आपके वज़न से कैलकुलेट होती है।', duration: 'कितने मिनट?',
      recipes: 'घर की रेसिपी', recNote: 'जो चीज़ें घर पर हैं, उन पर टिक करो।',
      progress: 'प्रोग्रेस', goalProg: 'गोल की तरफ', weightPh: 'वज़न (kg)', editProfile: 'प्रोफ़ाइल एडिट करो',
      photoTitle: 'महीने की बॉडी फोटो', photoNote: 'हर महीने 1 फोटो लो। फोटो सिर्फ आपके ब्राउज़र में सेव होती है। फोटो तुलना सिर्फ देखने के लिए है — ये कोई मेडिकल माप नहीं है।',
      photoNotePh: 'नोट (ऑप्शनल)', savePhoto: 'फोटो सेव करो',
      navToday: 'आज', navFood: 'खाना', navEx: 'एक्सरसाइज़', navRec: 'रेसिपी', navProg: 'प्रोग्रेस',
      bmi: 'BMI', dailyTarget: 'डेली कैलोरी टारगेट', proteinTarget: 'प्रोटीन टारगेट', planSaved: 'प्लान सेव हो गया! आपका डेली टारगेट तैयार है।',
      add: 'ऐड करो', warnTitle: 'ध्यान दो', swapLabel: 'बेहतर ऑप्शन:', noRecipe: 'कोई रेसिपी नहीं मिली — और इंग्रेडिएंट टिक करो।',
      perMin: 'ऊपर के मिनट के लिए', monthPhotoDone: 'इस महीने की फोटो हो गई है।', monthPhotoPending: 'इस महीने की फोटो बाकी है।',
      choosePhoto: 'पहले एक फोटो चुनो।', photoSaved: 'फोटो सेव हो गई।', replaced: 'इस महीने की फोटो बदल दी गई।',
      added: 'ऐड हो गया', deleted: 'हटा दिया', pickIng: 'रेसिपी देखने के लिए इंग्रेडिएंट टिक करो।',
      before: 'पहले', now: 'अब', goalDone: 'गोल पूरा हो गया!'
    },
    mr: {
      subtitle: 'भारतीय अन्नाचे कॅलरी आणि वजन कमी करण्याचे ट्रॅकर',
      setupTitle: 'आपला प्लॅन बनवा', setupSub: 'एकदा माहिती भरा, अॅप तुमचे दररोजचे कॅलरी लक्ष्य बनवेल.',
      age: 'वय (वर्षे)', gender: 'लिंग', male: 'पुरुष', female: 'महिला', other: 'इतर',
      height: 'उंची (फूट + इंच)', weight: 'सध्याचे वजन (kg)', targetWeight: 'लक्ष्य वजन (kg)',
      activity: 'अॅक्टिव्हिटी पातळी', actSed: 'कमी अॅक्टिव्ह (जास्त बसणे)', actLight: 'हलके अॅक्टिव्ह (हलकी चाल)',
      actMod: 'मध्यम अॅक्टिव्ह (रोज चालणे / काम)', actHigh: 'खूप अॅक्टिव्ह (जड काम / ट्रेनिंग)',
      makePlan: 'माझा प्लॅन बनवा', todayTitle: 'आजचा हिशेब', calLeftLabel: 'कॅलरी शिल्लक',
      eaten: 'खाल्ल्या', target: 'लक्ष्य', burned: 'जळाल्या', protein: 'प्रोटीन', water: 'पाणी',
      todayFood: 'आज खाल्लेले', noFoodYet: 'अजून काही जोडले नाही.', todayEx: 'आजचा व्यायाम', noExYet: 'अजून कोणताही व्यायाम नोंदवला नाही.',
      addFood: 'अन्न जोडा', searchFood: 'अन्न शोधा… (पोळी, डाळ, डोसा…)', customFood: 'स्वतःचे अन्न जोडा',
      cfNamePh: 'अन्नाचे नाव', cfCalPh: 'कॅलरी', cfProtPh: 'प्रोटीन (g)', addBtn: 'जोडा',
      exercise: 'व्यायाम', exNote: 'कॅलरी तुमच्या वजनावरून काढल्या जातात.', duration: 'किती मिनिटे?',
      recipes: 'घरगुती रेसिपी', recNote: 'घरात असलेल्या गोष्टींवर टिक करा.',
      progress: 'प्रगती', goalProg: 'लक्ष्याकडे', weightPh: 'वजन (kg)', editProfile: 'प्रोफाइल बदला',
      photoTitle: 'मासिक शरीर फोटो', photoNote: 'दर महिन्याला 1 फोटो घ्या. फोटो फक्त तुमच्या ब्राउझरमध्ये सेव होतो. फोटो तुलना फक्त पाहण्यासाठी आहे — हे वैद्यकीय मोजमाप नाही.',
      photoNotePh: 'नोंद (ऐच्छिक)', savePhoto: 'फोटो सेव करा',
      navToday: 'आज', navFood: 'अन्न', navEx: 'व्यायाम', navRec: 'रेसिपी', navProg: 'प्रगती',
      bmi: 'BMI', dailyTarget: 'दररोजचे कॅलरी लक्ष्य', proteinTarget: 'प्रोटीन लक्ष्य', planSaved: 'प्लॅन सेव झाला! तुमचे दररोजचे लक्ष्य तयार आहे.',
      add: 'जोडा', warnTitle: 'लक्ष द्या', swapLabel: 'चांगला पर्याय:', noRecipe: 'कोणतीही रेसिपी मिळाली नाही — आणखी साहित्य टिक करा.',
      perMin: 'वरील मिनिटांसाठी', monthPhotoDone: 'या महिन्याचा फोटो झाला आहे.', monthPhotoPending: 'या महिन्याचा फोटो बाकी आहे.',
      choosePhoto: 'आधी एक फोटो निवडा.', photoSaved: 'फोटो सेव झाला.', replaced: 'या महिन्याचा फोटो बदलला.',
      added: 'जोडले', deleted: 'काढले', pickIng: 'रेसिपी पाहण्यासाठी साहित्य टिक करा.',
      before: 'आधी', now: 'आता', goalDone: 'लक्ष्य गाठले!'
    }
  };

  function t(k) { return (DICT[lang] && DICT[lang][k]) || DICT.en[k] || k; }

  /* ---------------- Food database (per normal serving) ---------------- */
  var REASON = {
    fried: { en: 'Deep-fried in oil, often reused: lots of unhealthy trans fat and calories with almost no nutrition.',
      hi: 'तेल में डीप-फ्राई, अक्सर दोबारा गरम तेल: खराब ट्रांस फैट और खाली कैलोरी, पोषण लगभग नहीं।',
      mr: 'तेलात डीप-फ्राय, अनेकदा पुन्हा गरम केलेले तेल: हानिकारक ट्रान्स फॅट आणि रिकाम्या कॅलरी, पोषण जवळजवळ नाही.' },
    sodium: { en: 'Very high salt (sodium) — raises blood pressure and causes water retention.',
      hi: 'बहुत ज़्यादा नमक — ब्लड प्रेशर बढ़ाता है और शरीर में पानी रोकता है।',
      mr: 'खूप जास्त मीठ — रक्तदाब वाढवते आणि शरीरात पाणी अडकवते.' },
    sugar: { en: 'Hidden sugar — spikes blood sugar and adds empty calories that turn into fat.',
      hi: 'छिपी हुई चीनी — ब्लड शुगर बढ़ाती है और खाली कैलोरी चर्बी बन जाती है।',
      mr: 'लपलेली साखर — रक्तातील साखर वाढवते आणि रिकाम्या कॅलरी चरबी बनतात.' },
    empty: { en: 'Almost no fibre, protein or vitamins — only empty calories that do not fill you up.',
      hi: 'न फाइबर, न प्रोटीन, न विटामिन — सिर्फ खाली कैलोरी जो पेट भी नहीं भरती।',
      mr: 'फायबर, प्रोटीन वा जीवनसत्त्वे नाहीत — फक्त रिकाम्या कॅलरी, पोटही भरत नाही.' },
    refined: { en: 'Made from refined flour and lots of fat — low nutrition, high unhealthy fat.',
      hi: 'मैदा और ज़्यादा फैट से बना — पोषण कम, खराब फैट ज़्यादा।',
      mr: 'मैदा आणि भरपूर चरबीपासून बनवलेले — पोषण कमी, खराब चरबी जास्त.' }
  };
  function food(id, en, hi, mr, kcal, prot, serve, warn) {
    return { id: id, name: { en: en, hi: hi, mr: mr }, kcal: kcal, prot: prot, serve: serve, warn: warn || null };
  }
  var FOODS = [
    food('roti', 'Phulka Roti', 'फुलका रोटी', 'फुलका पोळी', 70, 2, '1 pc'),
    food('rice', 'Plain Rice', 'सादा चावल', 'साधा भात', 200, 4, '1 katori'),
    food('jeeraRice', 'Jeera Rice', 'जीरा राइस', 'जिरा राईस', 220, 4, '1 katori'),
    food('moongDal', 'Moong Dal', 'मूंग दाल', 'मूग डाळ', 120, 7, '1 katori'),
    food('toorDal', 'Toor Dal Tadka', 'तूर दाल तड़का', 'तूर डाळ तडका', 140, 7, '1 katori'),
    food('chana', 'Chana Masala', 'चना मसाला', 'चणा मसाला', 180, 8, '1 katori'),
    food('rajma', 'Rajma', 'राजमा', 'राजमा', 190, 8, '1 katori'),
    food('chole', 'Chole', 'छोले', 'छोले', 180, 8, '1 katori'),
    food('paneerButter', 'Paneer Butter Masala', 'पनीर बटर मसाला', 'पनीर बटर मसाला', 280, 14, '1 katori'),
    food('palakPaneer', 'Palak Paneer', 'पालक पनीर', 'पालक पनीर', 200, 12, '1 katori'),
    food('mixVeg', 'Mixed Veg Sabzi', 'मिक्स वेज सब्जी', 'मिक्स व्हेज भाजी', 120, 4, '1 katori'),
    food('alooGobi', 'Aloo Gobi', 'आलू गोभी', 'बटाटा फ्लॉवर', 150, 4, '1 katori'),
    food('bhindi', 'Bhindi Masala', 'भिंडी मसाला', 'भेंडी मसाला', 110, 3, '1 katori'),
    food('baingan', 'Baingan Bharta', 'बैंगन भरता', 'वांगी भरीत', 130, 3, '1 katori'),
    food('idli', 'Idli (2 pc)', 'इडली (2 पीस)', 'इडली (2 नग)', 120, 4, '2 pc'),
    food('masalaDosa', 'Masala Dosa', 'मसाला डोसा', 'मसाला डोसा', 250, 5, '1 pc'),
    food('plainDosa', 'Plain Dosa', 'सादा डोसा', 'साधा डोसा', 120, 3, '1 pc'),
    food('uttapam', 'Uttapam', 'उत्तपम', 'उत्तप्पा', 180, 5, '1 pc'),
    food('poha', 'Poha', 'पोहा', 'पोहे', 180, 4, '1 plate'),
    food('upma', 'Upma', 'उपमा', 'उपमा', 200, 4, '1 plate'),
    food('paratha', 'Plain Paratha (1)', 'सादा पराठा', 'साधा पराठा', 180, 4, '1 pc'),
    food('alooParatha', 'Aloo Paratha (1)', 'आलू पराठा', 'बटाटा पराठा', 250, 5, '1 pc'),
    food('chickenBiryani', 'Chicken Biryani', 'चिकन बिरयानी', 'चिकन बिर्याणी', 450, 25, '1 plate'),
    food('vegBiryani', 'Veg Biryani', 'वेज बिरयानी', 'व्हेज बिर्याणी', 380, 8, '1 plate'),
    food('dahi', 'Dahi', 'दही', 'दही', 100, 5, '1 katori'),
    food('chaas', 'Chaas', 'छाछ', 'ताक', 40, 2, '1 glass'),
    food('milk', 'Milk (1 glass)', 'दूध (1 गिलास)', 'दूध (1 ग्लास)', 150, 8, '1 glass'),
    food('egg', 'Boiled Egg (1)', 'उबला अंडा', 'उकडलेले अंडे', 70, 6, '1 pc'),
    food('eggBhurji', 'Anda Bhurji', 'अंडा भुर्जी', 'अंडा भुर्जी', 180, 12, '1 plate'),
    food('chickenCurry', 'Chicken Curry', 'चिकन करी', 'चिकन करी', 250, 22, '1 katori'),
    food('fishCurry', 'Fish Curry', 'फिश करी', 'मासे करी', 220, 24, '1 katori'),
    food('samosa', 'Samosa (1)', 'समोसा', 'समोसा', 150, 3, '1 pc',
      { reasons: ['fried'], swap: { en: 'Roasted chana', hi: 'भुना चना', mr: 'भाजलेले चणे' } }),
    food('pakora', 'Pakora (1 plate)', 'पकोड़ा', 'भजी', 300, 5, '1 plate',
      { reasons: ['fried'], swap: { en: 'Sprouts chaat', hi: 'स्प्राउट्स चाट', mr: 'स्प्राउट्स चाट' } }),
    food('maggi', 'Maggi (1 pack)', 'मैगी', 'मॅगी', 340, 7, '1 pack',
      { reasons: ['sodium', 'empty'], swap: { en: 'Oats upma or dalia', hi: 'ओट्स उपमा या दलिया', mr: 'ओट्स उपमा किंवा दलिया' } }),
    food('chips', 'Chips (1 pack)', 'चिप्स', 'चिप्स', 150, 2, '1 pack',
      { reasons: ['sodium', 'empty'], swap: { en: 'Roasted makhana', hi: 'भुना मखाना', mr: 'भाजलेले मखाणे' } }),
    food('biscuits', 'Biscuits (4 pc)', 'बिस्कुट', 'बिस्किटे', 160, 2, '4 pc',
      { reasons: ['sugar', 'refined'], swap: { en: 'Roasted chana or fruit', hi: 'भुना चना या फल', mr: 'भाजलेले चणे किंवा फळ' } }),
    food('coldDrink', 'Cold Drink (300 ml)', 'कोल्ड ड्रिंक', 'कोल्ड्रिंक', 140, 0, '300 ml',
      { reasons: ['sugar', 'empty'], swap: { en: 'Chaas, nimbu pani or water', hi: 'छाछ, नींबू पानी या सादा पानी', mr: 'ताक, लिंबू पाणी किंवा साधे पाणी' } }),
    food('gulabJamun', 'Gulab Jamun (2 pc)', 'गुलाब जामुन', 'गुलाबजाम', 300, 3, '2 pc',
      { reasons: ['sugar', 'empty'], swap: { en: 'Fruit', hi: 'फल', mr: 'फळ' } }),
    food('jalebi', 'Jalebi (2 pc)', 'जलेबी', 'जिलेबी', 280, 2, '2 pc',
      { reasons: ['sugar', 'empty'], swap: { en: 'Fruit chaat', hi: 'फ्रूट चाट', mr: 'फ्रूट चाट' } }),
    food('vadaPav', 'Vada Pav', 'वडा पाव', 'वडा पाव', 300, 6, '1 pc',
      { reasons: ['fried', 'refined'], swap: { en: 'Grilled sandwich', hi: 'ग्रिल्ड सैंडविच', mr: 'ग्रिल्ड सँडविच' } }),
    food('paniPuri', 'Pani Puri (6 pc)', 'पानी पुरी', 'पाणीपुरी', 180, 3, '6 pc',
      { reasons: ['fried'], swap: { en: 'Sprouts chaat', hi: 'स्प्राउट्स चाट', mr: 'स्प्राउट्स चाट' } }),
    food('pavBhaji', 'Pav Bhaji', 'पाव भाजी', 'पाव भाजी', 400, 8, '1 plate',
      { reasons: ['refined', 'empty'], swap: { en: 'Tawa sabzi with 1 roti', hi: 'तवा सब्जी और 1 रोटी', mr: 'तव्यावरची भाजी आणि 1 पोळी' } }),
    food('khichdi', 'Moong Dal Khichdi', 'मूंग दाल खिचड़ी', 'मूग डाळ खिचडी', 200, 7, '1 plate'),
    food('oats', 'Oats (1 bowl)', 'ओट्स', 'ओट्स', 150, 5, '1 bowl'),
    food('sprouts', 'Sprouts Chaat', 'स्प्राउट्स चाट', 'स्प्राउट्स चाट', 150, 8, '1 plate'),
    food('tea', 'Chai (milk + sugar)', 'चाय', 'चहा', 80, 2, '1 cup')
  ];

  /* ---------------- Exercises (MET values) ---------------- */
  var EXERCISES = [
    { id: 'walkSlow', name: { en: 'Slow Walking', hi: 'धीमी वॉक', mr: 'हळू चालणे' }, met: 2.5 },
    { id: 'walkFast', name: { en: 'Brisk Walking', hi: 'तेज़ वॉक', mr: 'जलद चालणे' }, met: 4.0 },
    { id: 'run', name: { en: 'Running', hi: 'दौड़ना', mr: 'धावणे' }, met: 9.8 },
    { id: 'cycle', name: { en: 'Cycling', hi: 'साइकिल', mr: 'सायकल' }, met: 7.5 },
    { id: 'skip', name: { en: 'Skipping Rope', hi: 'रस्सी कूदना', mr: 'दोरीवरच्या उड्या' }, met: 12.3 },
    { id: 'yoga', name: { en: 'Yoga', hi: 'योगा', mr: 'योगा' }, met: 3.0 },
    { id: 'home', name: { en: 'Home Workout', hi: 'घर की एक्सरसाइज़', mr: 'घरचा व्यायाम' }, met: 6.0 },
    { id: 'swim', name: { en: 'Swimming', hi: 'तैराकी', mr: 'पोहणे' }, met: 8.0 },
    { id: 'dance', name: { en: 'Dancing', hi: 'डांस', mr: 'नृत्य' }, met: 5.5 },
    { id: 'stairs', name: { en: 'Stair Climbing', hi: 'सीढ़ियां चढ़ना', mr: 'पायऱ्या चढणे' }, met: 8.8 },
    { id: 'cricket', name: { en: 'Cricket', hi: 'क्रिकेट', mr: 'क्रिकेट' }, met: 5.0 },
    { id: 'clean', name: { en: 'House Cleaning', hi: 'घर की सफाई', mr: 'घराची स्वच्छता' }, met: 3.5 }
  ];

  /* ---------------- Ingredients & recipes ---------------- */
  var INGS = [
    { id: 'rice', name: { en: 'Rice', hi: 'चावल', mr: 'तांदूळ' } },
    { id: 'moongDal', name: { en: 'Moong Dal', hi: 'मूंग दाल', mr: 'मूग डाळ' } },
    { id: 'toorDal', name: { en: 'Toor Dal', hi: 'तूर दाल', mr: 'तूर डाळ' } },
    { id: 'chana', name: { en: 'Chana', hi: 'चना', mr: 'चणा' } },
    { id: 'soya', name: { en: 'Soya Chunks', hi: 'सोया चंक्स', mr: 'सोया चंक्स' } },
    { id: 'anda', name: { en: 'Eggs', hi: 'अंडे', mr: 'अंडी' } },
    { id: 'paneer', name: { en: 'Paneer', hi: 'पनीर', mr: 'पनीर' } },
    { id: 'curd', name: { en: 'Curd', hi: 'दही', mr: 'दही' } },
    { id: 'sabzi', name: { en: 'Seasonal Sabzi', hi: 'मौसमी सब्जी', mr: 'मोसमी भाजी' } },
    { id: 'onion', name: { en: 'Onion', hi: 'प्याज़', mr: 'कांदा' } },
    { id: 'tomato', name: { en: 'Tomato', hi: 'टमाटर', mr: 'टोमॅटो' } },
    { id: 'lemon', name: { en: 'Lemon', hi: 'नींबू', mr: 'लिंबू' } },
    { id: 'oats', name: { en: 'Oats', hi: 'ओट्स', mr: 'ओट्स' } },
    { id: 'sprouts', name: { en: 'Sprouts', hi: 'स्प्राउट्स', mr: 'मोड आलेली कडधान्ये' } },
    { id: 'dalia', name: { en: 'Dalia (Broken Wheat)', hi: 'दलिया', mr: 'दलिया' } },
    { id: 'palak', name: { en: 'Palak', hi: 'पालक', mr: 'पालक' } },
    { id: 'masale', name: { en: 'Basic Masale', hi: 'बेसिक मसाले', mr: 'मूळ मसाले' } }
  ];
  function recipe(nameEn, nameHi, nameMr, ings, kcal, stepEn, stepHi, stepMr) {
    return { name: { en: nameEn, hi: nameHi, mr: nameMr }, ings: ings, kcal: kcal,
      steps: { en: stepEn, hi: stepHi, mr: stepMr } };
  }
  var RECIPES = [
    recipe('Moong Dal Khichdi', 'मूंग दाल खिचड़ी', 'मूग डाळ खिचडी', ['rice', 'moongDal', 'sabzi'], 250,
      'Wash rice and dal, pressure-cook with sabzi and haldi for 3 whistles, add salt and a small tadka.',
      'चावल-दाल धोकर सब्जी और हल्दी के साथ कुकर में 3 सीटी तक पकाओ, नमक और छोटा तड़का डालो।',
      'तांदूळ-डाळ धुवून भाजी व हळदीसह कुकरमध्ये 3 शिट्ट्या शिजवा, मीठ व छोटा तडका घाला.'),
    recipe('Chana Chaat', 'चना चाट', 'चणा चाट', ['chana', 'onion', 'tomato', 'lemon'], 200,
      'Mix boiled chana with chopped onion, tomato, lemon juice, salt and chaat masala. No frying.',
      'उबले चने में कटा प्याज़, टमाटर, नींबू रस, नमक और चाट मसाला मिलाओ। बिना तले।',
      'उकडलेल्या चण्यात चिरलेला कांदा, टोमॅटो, लिंबाचा रस, मीठ व चाट मसाला मिसळा. तळू नका.'),
    recipe('Soya Keema', 'सोया कीमा', 'सोया कीमा', ['soya', 'onion', 'tomato', 'masale'], 220,
      'Soak soya chunks, squeeze dry, then cook with onion, tomato and garam masala in 1 spoon oil.',
      'सोया चंक्स भिगोकर निचोड़ो, फिर 1 चम्मच तेल में प्याज़, टमाटर और गरम मसाले के साथ पकाओ।',
      'सोया चंक्स भिजवून पिळून घ्या, मग 1 चमचा तेलात कांदा, टोमॅटो व गरम मसाल्यासह शिजवा.'),
    recipe('Anda Bhurji', 'अंडा भुर्जी', 'अंडा भुर्जी', ['anda', 'onion', 'tomato'], 180,
      'Scramble 2 eggs with onion, tomato and green chilli in 1 spoon oil. Serve with 1 roti.',
      '2 अंडे प्याज़, टमाटर और हरी मिर्च के साथ 1 चम्मच तेल में भुर्जी बनाओ। 1 रोटी के साथ खाओ।',
      '2 अंडी कांदा, टोमॅटो व हिरव्या मिरचीसह 1 चमचा तेलात भुर्जी करा. 1 पोळीसह खा.'),
    recipe('Paneer Tikka (Tawa)', 'पनीर टिक्का (तवा)', 'पनीर टिक्का (तवा)', ['paneer', 'curd', 'masale'], 250,
      'Marinate paneer in curd and tikka masala for 15 minutes, then roast on a tawa with very little oil.',
      'पनीर को दही और टिक्का मसाले में 15 मिनट मैरीनेट करो, फिर तवे पर कम तेल में सेको।',
      'पनीर दही व टिक्का मसाल्यात 15 मिनिटे मुरवून तव्यावर कमी तेलात भाजा.'),
    recipe('Oats Upma', 'ओट्स उपमा', 'ओट्स उपमा', ['oats', 'sabzi', 'onion'], 180,
      'Roast oats, then cook with chopped sabzi, onion and mustard tadka in 1 spoon oil.',
      'ओट्स भूनो, फिर कटी सब्जी, प्याज़ और राई के तड़के के साथ 1 चम्मच तेल में पकाओ।',
      'ओट्स भाजून घ्या, मग चिरलेली भाजी, कांदा व मोहरीच्या तडक्यासह 1 चमचा तेलात शिजवा.'),
    recipe('Sprouts Salad', 'स्प्राउट्स सलाद', 'स्प्राउट्स सॅलड', ['sprouts', 'onion', 'tomato', 'lemon'], 150,
      'Mix steamed sprouts with onion, tomato, lemon and salt. Filling, high protein, no cooking oil.',
      'भाप में पके स्प्राउट्स में प्याज़, टमाटर, नींबू और नमक मिलाओ। भरपेट, हाई प्रोटीन, बिना तेल।',
      'वाफवलेल्या मोड आलेल्या कडधान्यांत कांदा, टोमॅटो, लिंबू व मीठ मिसळा. पोटभरीचे, जास्त प्रोटीन, तेल नाही.'),
    recipe('Veg Dalia', 'वेज दलिया', 'व्हेज दलिया', ['dalia', 'sabzi'], 200,
      'Roast dalia, pressure-cook with sabzi and salt for 2 whistles. Light and full of fibre.',
      'दलिया भूनकर सब्जी और नमक के साथ कुकर में 2 सीटी तक पकाओ। हल्का और फाइबर से भरपूर।',
      'दलिया भाजून भाजी व मिठासह कुकरमध्ये 2 शिट्ट्या शिजवा. हलके आणि फायबरयुक्त.'),
    recipe('Palak Paneer Light', 'पालक पनीर लाइट', 'पालक पनीर लाइट', ['paneer', 'palak'], 220,
      'Blanch palak, blend, then simmer with paneer cubes. Skip the cream and extra butter.',
      'पालक ब्लांच करके पीसो, फिर पनीर के टुकड़ों के साथ धीमी आंच पर पकाओ। क्रीम और ज़्यादा मक्खन नहीं।',
      'पालक ब्लांच करून वाटा, मग पनीरच्या तुकड्यांसह मंद आचेवर शिजवा. क्रीम व जास्त लोणी नको.'),
    recipe('Egg Curry', 'अंडा करी', 'अंडा करी', ['anda', 'onion', 'tomato', 'masale'], 240,
      'Boil eggs, make a simple onion-tomato masala in 1 spoon oil, add eggs and simmer 5 minutes.',
      'अंडे उबालो, 1 चम्मच तेल में प्याज़-टमाटर मसाला बनाओ, अंडे डालकर 5 मिनट धीमी आंच पर पकाओ।',
      'अंडी उकडून 1 चमचा तेलात कांदा-टोमॅटो मसाला करा, अंडी घालून 5 मिनिटे मंद आचेवर शिजवा.'),
    recipe('Toor Dal Tadka', 'तूर दाल तड़का', 'तूर डाळ तडका', ['toorDal', 'onion', 'tomato', 'masale'], 160,
      'Pressure-cook toor dal, then add a tadka of jeera, garlic and onion in 1 spoon ghee.',
      'तूर दाल कुकर में पकाओ, फिर 1 चम्मच घी में जीरा, लहसुन और प्याज़ का तड़का डालो।',
      'तूर डाळ कुकरमध्ये शिजवा, मग 1 चमचा तुपात जिरे, लसूण व कांद्याचा तडका घाला.')
  ];

  /* ---------------- State ---------------- */
  var lang = store.get('tw_lang', 'hi');
  var profile = store.get('tw_profile', null);
  var portion = 1;
  var currentTab = 'today';
  var pendingPhoto = null;

  function todayKey() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function monthKey() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
  }
  function monthLabel(key) {
    var parts = key.split('-');
    var d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, 1);
    var loc = lang === 'hi' ? 'hi-IN' : (lang === 'mr' ? 'mr-IN' : 'en-IN');
    try { return d.toLocaleDateString(loc, { month: 'long', year: 'numeric' }); } catch (e) { return key; }
  }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function toast(msg) {
    var el = document.createElement('div');
    el.textContent = msg;
    el.style.cssText = 'position:fixed;left:50%;transform:translateX(-50%);bottom:96px;background:#30d158;color:#000;font-weight:700;padding:12px 22px;border-radius:999px;z-index:50;box-shadow:0 8px 24px rgba(0,0,0,.5);';
    document.body.appendChild(el);
    setTimeout(function () { el.remove(); }, 2200);
  }

  /* ---------------- Plan math ---------------- */
  function calcPlan(p) {
    var cm = p.ft * 30.48 + p.in * 2.54;
    var bmi = p.weight / Math.pow(cm / 100, 2);
    var bmr = p.gender === 'female'
      ? 10 * p.weight + 6.25 * cm - 5 * p.age - 161
      : 10 * p.weight + 6.25 * cm - 5 * p.age + 5;
    var tdee = bmr * p.activity;
    var target = Math.max(1200, Math.round(tdee - 500));
    var protein = Math.round(p.weight * 1.4);
    return { bmi: bmi, target: target, protein: protein };
  }

  /* ---------------- Language & tabs ---------------- */
  function applyLang() {
    $$('[data-t]').forEach(function (el) { el.textContent = t(el.dataset.t); });
    $$('[data-t-ph]').forEach(function (el) { el.placeholder = t(el.dataset.tPh); });
    $$('.lang-switch button').forEach(function (b) { b.classList.toggle('active', b.dataset.lang === lang); });
    document.documentElement.lang = lang;
  }
  function showTab(id) {
    currentTab = id;
    $$('.tab-page').forEach(function (s) { s.classList.toggle('show', s.id === 'tab-' + id); });
    $$('.tabbar button').forEach(function (b) { b.classList.toggle('active', b.dataset.tab === id); });
    if (id === 'today') renderToday();
    if (id === 'food') renderFood();
    if (id === 'exercise') renderExercises();
    if (id === 'recipes') renderRecipes();
    if (id === 'progress') renderProgress();
    window.scrollTo(0, 0);
  }

  /* ---------------- Setup form ---------------- */
  function buildSetup() {
    var ftSel = $('#inFt'), inSel = $('#inIn');
    ftSel.innerHTML = ''; inSel.innerHTML = '';
    for (var f = 4; f <= 7; f++) { var o = document.createElement('option'); o.value = f; o.textContent = f + ' ft'; ftSel.appendChild(o); }
    for (var i = 0; i <= 11; i++) { var o2 = document.createElement('option'); o2.value = i; o2.textContent = i + ' in'; inSel.appendChild(o2); }
    var chips = $('#heightChips'); chips.innerHTML = '';
    for (var ft = 5; ft <= 6; ft++) {
      for (var inch = 0; inch <= 11; inch++) {
        if (ft === 6 && inch > 0) break;
        (function (f2, i2) {
          var b = document.createElement('button');
          b.type = 'button';
          b.textContent = f2 + '′' + i2 + '″';
          b.addEventListener('click', function () {
            ftSel.value = String(f2); inSel.value = String(i2);
            $$('#heightChips button').forEach(function (x) { x.classList.remove('active'); });
            b.classList.add('active');
          });
          chips.appendChild(b);
        })(ft, inch);
      }
    }
    if (profile) {
      $('#inAge').value = profile.age; $('#inGender').value = profile.gender;
      ftSel.value = String(profile.ft); inSel.value = String(profile.in);
      $('#inWeight').value = profile.weight; $('#inTarget').value = profile.target;
      $('#inActivity').value = String(profile.activity);
      showPlan(profile);
    }
  }
  function showPlan(p) {
    var c = calcPlan(p);
    var box = $('#planResult');
    box.hidden = false;
    box.innerHTML = '<b>' + t('planSaved') + '</b><br>' + t('bmi') + ': ' + c.bmi.toFixed(1) +
      '<br>' + t('dailyTarget') + ': <b>' + c.target + ' kcal</b>' +
      '<br>' + t('proteinTarget') + ': <b>' + c.protein + 'g</b>';
  }

  /* ---------------- Today ---------------- */
  function dayEntries(key, storeKey) {
    var all = store.get(storeKey, {});
    return all[key] || [];
  }
  function renderToday() {
    if (!profile) { showTab('setup'); return; }
    var c = calcPlan(profile);
    var key = todayKey();
    var foods = dayEntries(key, 'tw_food');
    var exs = dayEntries(key, 'tw_ex');
    var eaten = foods.reduce(function (s, e) { return s + e.kcal; }, 0);
    var prot = foods.reduce(function (s, e) { return s + e.prot; }, 0);
    var burned = exs.reduce(function (s, e) { return s + e.kcal; }, 0);
    var left = Math.max(0, c.target - eaten);
    $('#calLeft').textContent = left;
    $('#calEaten').textContent = eaten;
    $('#calTarget').textContent = c.target;
    $('#exBurned').textContent = burned;
    $('#protText').textContent = Math.round(prot) + ' / ' + c.protein + 'g';
    $('#protBar').style.width = Math.min(100, Math.round(prot / c.protein * 100)) + '%';
    var pct = Math.min(100, Math.round(eaten / c.target * 100));
    $('#calRing').style.strokeDashoffset = String(527.8 * (1 - pct / 100));
    // water
    var water = store.get('tw_water', {});
    var count = water[key] || 0;
    var wg = $('#waterGlasses'); wg.innerHTML = '';
    for (var i = 0; i < 8; i++) {
      (function (idx) {
        var b = document.createElement('button');
        b.type = 'button'; b.textContent = idx < count ? '💧' : '🥛';
        if (idx < count) b.classList.add('on');
        b.addEventListener('click', function () {
          var w = store.get('tw_water', {});
          w[key] = (w[key] === idx + 1) ? idx : idx + 1;
          store.set('tw_water', w); renderToday();
        });
        wg.appendChild(b);
      })(i);
    }
    $('#waterText').textContent = count + ' / 8 glasses';
    // food list
    var fl = $('#todayFoodList'); fl.innerHTML = '';
    $('#noFoodMsg').style.display = foods.length ? 'none' : 'block';
    foods.forEach(function (e, idx) {
      var li = document.createElement('li');
      li.innerHTML = '<span>' + esc(e.name) + ' <span class="muted">(' + e.portion + 'x)</span></span><span>' + e.kcal + ' kcal <button type="button" class="del" data-i="' + idx + '">×</button></span>';
      li.querySelector('.del').addEventListener('click', function () {
        var all = store.get('tw_food', {}); all[key].splice(idx, 1); store.set('tw_food', all); renderToday();
      });
      fl.appendChild(li);
    });
    var el2 = $('#todayExList'); el2.innerHTML = '';
    $('#noExMsg').style.display = exs.length ? 'none' : 'block';
    exs.forEach(function (e, idx) {
      var li = document.createElement('li');
      li.innerHTML = '<span>' + esc(e.name) + ' <span class="muted">(' + e.minutes + ' min)</span></span><span>' + e.kcal + ' kcal <button type="button" class="del" data-i="' + idx + '">×</button></span>';
      li.querySelector('.del').addEventListener('click', function () {
        var all = store.get('tw_ex', {}); all[key].splice(idx, 1); store.set('tw_ex', all); renderToday();
      });
      el2.appendChild(li);
    });
  }

  /* ---------------- Food ---------------- */
  function renderFood() {
    var q = ($('#foodSearch').value || '').toLowerCase();
    var list = $('#foodList'); list.innerHTML = '';
    FOODS.filter(function (f) {
      return f.name.en.toLowerCase().indexOf(q) !== -1 ||
        f.name.hi.indexOf(q) !== -1 || f.name.mr.indexOf(q) !== -1 || q === '';
    }).forEach(function (f) {
      var kcal = Math.round(f.kcal * portion);
      var prot = Math.round(f.prot * portion * 10) / 10;
      var div = document.createElement('div');
      div.className = 'food-item';
      var html = '<div><div class="food-name">' + esc(f.name[lang]) + '</div>' +
        '<div class="food-meta">' + kcal + ' kcal • ' + prot + 'g protein • ' + f.serve + ' × ' + portion + '</div>';
      if (f.warn) {
        html += '<div class="warn"><b>⚠️ ' + t('warnTitle') + ':</b> ' +
          f.warn.reasons.map(function (r) { return REASON[r][lang]; }).join(' ') +
          '<br><span class="swap">' + t('swapLabel') + ' ' + esc(f.warn.swap[lang]) + '</span></div>';
      }
      html += '</div><button type="button" class="btn-small">' + t('add') + '</button>';
      div.innerHTML = html;
      div.querySelector('button').addEventListener('click', function () {
        var all = store.get('tw_food', {});
        var key = todayKey();
        if (!all[key]) all[key] = [];
        all[key].push({ name: f.name[lang], kcal: kcal, prot: prot, portion: portion });
        store.set('tw_food', all);
        toast(t('added') + ': ' + f.name[lang]);
      });
      list.appendChild(div);
    });
  }

  /* ---------------- Exercise ---------------- */
  function renderExercises() {
    var w = profile ? profile.weight : 70;
    var mins = parseInt($('#exMinutes').value, 10) || 30;
    var list = $('#exList'); list.innerHTML = '';
    EXERCISES.forEach(function (ex) {
      var kcal = Math.round(ex.met * w * mins / 60);
      var div = document.createElement('div');
      div.className = 'food-item';
      div.innerHTML = '<div><div class="food-name">' + esc(ex.name[lang]) + '</div>' +
        '<div class="food-meta">' + kcal + ' kcal • ' + mins + ' min • ' + t('perMin') + '</div></div>' +
        '<button type="button" class="btn-small">' + t('add') + '</button>';
      div.querySelector('button').addEventListener('click', function () {
        var all = store.get('tw_ex', {});
        var key = todayKey();
        if (!all[key]) all[key] = [];
        all[key].push({ name: ex.name[lang], kcal: kcal, minutes: mins });
        store.set('tw_ex', all);
        toast(t('added') + ': ' + ex.name[lang]);
      });
      list.appendChild(div);
    });
  }

  /* ---------------- Recipes ---------------- */
  function renderRecipes() {
    var box = $('#ingList'); box.innerHTML = '';
    INGS.forEach(function (ing) {
      var b = document.createElement('button');
      b.type = 'button'; b.dataset.ing = ing.id; b.textContent = ing.name[lang];
      b.addEventListener('click', function () { b.classList.toggle('on'); renderRecipeResults(); });
      box.appendChild(b);
    });
    renderRecipeResults();
  }
  function renderRecipeResults() {
    var selected = $$('#ingList button.on').map(function (b) { return b.dataset.ing; });
    var out = $('#recipeList'); out.innerHTML = '';
    if (!selected.length) { out.innerHTML = '<p class="muted">' + t('pickIng') + '</p>'; return; }
    var matched = RECIPES.filter(function (r) { return r.ings.every(function (i) { return selected.indexOf(i) !== -1; }); });
    if (!matched.length) { out.innerHTML = '<p class="muted">' + t('noRecipe') + '</p>'; return; }
    matched.forEach(function (r) {
      var div = document.createElement('div');
      div.className = 'food-item';
      div.innerHTML = '<div><div class="food-name">' + esc(r.name[lang]) + '</div>' +
        '<div class="food-meta">' + r.kcal + ' kcal</div>' +
        '<p class="muted small" style="margin:6px 0 0">' + esc(r.steps[lang]) + '</p></div>';
      out.appendChild(div);
    });
  }

  /* ---------------- Progress ---------------- */
  function renderProgress() {
    var weights = store.get('tw_weights', []).slice().sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    var start = profile ? profile.weight : (weights.length ? weights[0].kg : 0);
    var current = weights.length ? weights[weights.length - 1].kg : (profile ? profile.weight : 0);
    var target = profile ? profile.target : current;
    var pct = 0;
    if (start !== target) pct = Math.max(0, Math.min(100, Math.round((start - current) / (start - target) * 100)));
    if (start === current && start === target) pct = 100;
    $('#goalText').textContent = current + ' kg → ' + target + ' kg (' + pct + '%)';
    $('#goalBar').style.width = pct + '%';
    var wl = $('#weightList'); wl.innerHTML = '';
    weights.slice().reverse().forEach(function (w, idx) {
      var realIdx = weights.length - 1 - idx;
      var li = document.createElement('li');
      li.innerHTML = '<span>' + w.date + '</span><span>' + w.kg + ' kg <button type="button" class="del" data-i="' + realIdx + '">×</button></span>';
      li.querySelector('.del').addEventListener('click', function () {
        var all = store.get('tw_weights', []); all.splice(realIdx, 1); store.set('tw_weights', all); renderProgress();
      });
      wl.appendChild(li);
    });
    drawChart(weights);
    // photos
    var mk = monthKey();
    var photos = store.get('tw_photos', []);
    var hasThis = photos.some(function (p) { return p.month === mk; });
    $('#photoMonthLabel').textContent = monthLabel(mk) + ' — ' + (hasThis ? t('monthPhotoDone') : t('monthPhotoPending'));
    var tl = $('#photoTimeline'); tl.innerHTML = '';
    photos.slice().sort(function (a, b) { return a.month < b.month ? 1 : -1; }).forEach(function (p, idx) {
      var realIdx = photos.indexOf(p);
      var div = document.createElement('div');
      div.innerHTML = '<p style="margin:14px 0 0"><b>' + monthLabel(p.month) + '</b> <span class="muted">' + esc(p.note || '') + '</span> ' +
        '<button type="button" class="del" data-i="' + realIdx + '">×</button></p>' +
        '<img class="photo-thumb" src="' + p.dataUrl + '" alt="Body progress photo">';
      div.querySelector('.del').addEventListener('click', function () {
        var all = store.get('tw_photos', []); all.splice(realIdx, 1); store.set('tw_photos', all); renderProgress();
      });
      tl.appendChild(div);
    });
    var cmp = $('#photoCompare'); cmp.innerHTML = '';
    if (photos.length >= 2) {
      var sorted = photos.slice().sort(function (a, b) { return a.month < b.month ? -1 : 1; });
      var first = sorted[0], last = sorted[sorted.length - 1];
      cmp.innerHTML = '<div class="compare">' +
        '<figure><img src="' + first.dataUrl + '" alt="Before"><figcaption>' + t('before') + ' — ' + monthLabel(first.month) + '</figcaption></figure>' +
        '<figure><img src="' + last.dataUrl + '" alt="Now"><figcaption>' + t('now') + ' — ' + monthLabel(last.month) + '</figcaption></figure></div>';
    }
  }
  function drawChart(weights) {
    var cv = $('#weightChart');
    var ctx = cv.getContext('2d');
    var W = cv.width, H = cv.height;
    ctx.clearRect(0, 0, W, H);
    if (weights.length < 2) {
      ctx.fillStyle = '#a1a1a6'; ctx.font = '13px sans-serif';
      ctx.fillText(weights.length === 1 ? '1 entry — add more to see trend' : 'No weight entries yet', 14, 30);
      return;
    }
    var vals = weights.map(function (w) { return w.kg; });
    var min = Math.min.apply(null, vals) - 1, max = Math.max.apply(null, vals) + 1;
    var pad = 28;
    ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.beginPath();
    ctx.moveTo(pad, pad); ctx.lineTo(pad, H - pad); ctx.lineTo(W - pad, H - pad); ctx.stroke();
    ctx.strokeStyle = '#30d158'; ctx.lineWidth = 2.5; ctx.beginPath();
    weights.forEach(function (w, i) {
      var x = pad + (W - pad * 2) * (weights.length === 1 ? 0 : i / (weights.length - 1));
      var y = H - pad - (H - pad * 2) * (w.kg - min) / (max - min);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.fillStyle = '#30d158';
    weights.forEach(function (w, i) {
      var x = pad + (W - pad * 2) * (weights.length === 1 ? 0 : i / (weights.length - 1));
      var y = H - pad - (H - pad * 2) * (w.kg - min) / (max - min);
      ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
    });
    ctx.fillStyle = '#a1a1a6'; ctx.font = '11px sans-serif';
    ctx.fillText(weights[0].date, pad, H - 8);
    ctx.fillText(weights[weights.length - 1].date, W - pad - 58, H - 8);
  }

  /* ---------------- Photo upload (downscale to max 800px JPEG) ---------------- */
  function downscale(file, cb) {
    var reader = new FileReader();
    reader.onload = function (e) {
      var img = new Image();
      img.onload = function () {
        var scale = Math.min(1, 800 / Math.max(img.width, img.height));
        var cv = document.createElement('canvas');
        cv.width = Math.round(img.width * scale); cv.height = Math.round(img.height * scale);
        cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
        cb(cv.toDataURL('image/jpeg', 0.8));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  /* ---------------- Events ---------------- */
  $$('.lang-switch button').forEach(function (b) {
    b.addEventListener('click', function () {
      lang = b.dataset.lang; store.set('tw_lang', lang);
      applyLang(); showTab(currentTab === 'setup' ? 'setup' : currentTab);
    });
  });
  $$('.tabbar button').forEach(function (b) {
    b.addEventListener('click', function () { showTab(b.dataset.tab); });
  });
  $$('.portion-row button').forEach(function (b) {
    b.addEventListener('click', function () {
      portion = parseFloat(b.dataset.portion);
      $$('.portion-row button').forEach(function (x) { x.classList.toggle('active', x === b); });
      renderFood();
    });
  });
  $('#foodSearch').addEventListener('input', renderFood);
  $('#exMinutes').addEventListener('input', renderExercises);
  $('#cfAdd').addEventListener('click', function () {
    var name = $('#cfName').value.trim();
    var kcal = Math.round(parseFloat($('#cfCal').value) || 0);
    var prot = Math.round((parseFloat($('#cfProt').value) || 0) * 10) / 10;
    if (!name || !kcal) return;
    var all = store.get('tw_food', {});
    var key = todayKey();
    if (!all[key]) all[key] = [];
    all[key].push({ name: name, kcal: Math.round(kcal * portion), prot: Math.round(prot * portion * 10) / 10, portion: portion });
    store.set('tw_food', all);
    $('#cfName').value = ''; $('#cfCal').value = ''; $('#cfProt').value = '';
    toast(t('added') + ': ' + name);
  });
  $('#profileForm').addEventListener('submit', function (e) {
    e.preventDefault();
    profile = {
      age: parseInt($('#inAge').value, 10),
      gender: $('#inGender').value,
      ft: parseInt($('#inFt').value, 10),
      in: parseInt($('#inIn').value, 10),
      weight: parseFloat($('#inWeight').value),
      target: parseFloat($('#inTarget').value),
      activity: parseFloat($('#inActivity').value)
    };
    store.set('tw_profile', profile);
    showPlan(profile);
    $('.tabbar').style.display = 'flex';
    showTab('today');
  });
  $('#editProfileBtn').addEventListener('click', function () {
    buildSetup(); showTab('setup');
  });
  $('#wAdd').addEventListener('click', function () {
    var kg = parseFloat($('#wKg').value);
    if (!kg) return;
    var all = store.get('tw_weights', []);
    all.push({ date: todayKey(), kg: kg });
    store.set('tw_weights', all);
    $('#wKg').value = '';
    renderProgress();
  });
  $('#photoFile').addEventListener('change', function () {
    var f = $('#photoFile').files[0];
    if (!f) return;
    downscale(f, function (url) { pendingPhoto = url; });
  });
  $('#photoSave').addEventListener('click', function () {
    if (!pendingPhoto) { toast(t('choosePhoto')); return; }
    var mk = monthKey();
    var all = store.get('tw_photos', []);
    var existing = -1;
    for (var i = 0; i < all.length; i++) { if (all[i].month === mk) existing = i; }
    var rec = { month: mk, dataUrl: pendingPhoto, note: $('#photoNote').value.trim(), date: todayKey() };
    if (existing >= 0) { all[existing] = rec; toast(t('replaced')); }
    else { all.push(rec); toast(t('photoSaved')); }
    store.set('tw_photos', all);
    pendingPhoto = null; $('#photoFile').value = ''; $('#photoNote').value = '';
    renderProgress();
  });

  /* ---------------- Init ---------------- */
  buildSetup();
  applyLang();
  if (profile) {
    $('.tabbar').style.display = 'flex';
    showTab('today');
  } else {
    $('.tabbar').style.display = 'none';
    showTab('setup');
  }
})();
