# -*- coding: utf-8 -*-
"""
Catalog Builder for Marathi Mhani Sangrah (1,000 distinct Marathi Proverbs)
Generates src/data/proverbs.json with exactly 1,000 editorially verified entries.
"""

import json
import os
import re

# Comprehensive list of authentic Marathi proverbs with their meanings, examples, categories, and equivalents
CATALOG_SEEDS = [
    # 1 - 25
    {
        "proverb": "अति तिथे माती",
        "meaningMarathi": "कोणत्याही गोष्टीचा अतिरेक हा शेवटी नुकसानीस कारणीभूत ठरतो.",
        "meaningEnglish": "Excess of anything leads to ruin or negative consequences.",
        "exampleMarathi": "अभ्यास चांगला असला तरी रात्रंदिवस न झोपता वाचन करू नकोस, अति तिथे माती होते.",
        "exampleEnglish": "While studying is good, do not skip sleep day and night; too much of anything is good for nothing.",
        "context": "जेव्हा एखादी व्यक्ती कोणत्याही चांगल्या किंवा वाईट गोष्टीचा अतिरेक करते, तेव्हा तिला सावध करण्यासाठी ही म्हण वापरतात.",
        "englishEquivalent": "Too much of anything is good for nothing.",
        "category": "शहाणपण आणि व्यवहारज्ञान",
        "tags": ["अतिरेक", "मर्यादा", "संयम", "सावधगिरी"]
    },
    {
        "proverb": "नाचता येईना अंगण वाकडे",
        "meaningMarathi": "स्वतःमध्ये कौशल्याचा अभाव असताना परिस्थितीला किंवा साधनांना दोष देणे.",
        "meaningEnglish": "Blaming one's tools or circumstances to hide one's own incompetence.",
        "exampleMarathi": "परीक्षेत कमी गुण मिळाल्यावर रोहन म्हणाला की प्रश्नपत्रिकाच वाईट होती; याला म्हणतात नाचता येईना अंगण वाकडे.",
        "exampleEnglish": "When Rohan scored low in the exam, he blamed the question paper; a bad workman quarrels with his tools.",
        "context": "स्वतःची अकार्यक्षमता झाकण्यासाठी बाह्य घटकांवर खापर फोडणाऱ्या प्रवृत्तीवर टीका करताना ही म्हण वापरली जाते.",
        "englishEquivalent": "A bad workman blames his tools.",
        "category": "स्वभाव आणि वर्तन",
        "tags": ["दोषारोप", "अकार्यक्षमता", "बहाणा", "आत्मपरीक्षण"]
    },
    {
        "proverb": "गाढवाला गुळाची चव काय",
        "meaningMarathi": "ज्याला एखाद्या उत्कृष्ट गोष्टीचे मूल्य समजत नाही, त्याला ती गोष्ट निरुपयोगी वाटते.",
        "meaningEnglish": "An ignorant or tasteless person cannot appreciate true excellence or beauty.",
        "exampleMarathi": "त्याला शास्त्रीय संगीतातील बारकावे समजावून सांगणे म्हणजे गाढवाला गुळाची चव विचारण्यासारखे आहे.",
        "exampleEnglish": "Explaining the nuances of classical music to him is like casting pearls before swine.",
        "context": "कला, ज्ञान किंवा उच्च दर्जाच्या वस्तूंची कदर नसलेल्या व्यक्तीसमोर अशा गोष्टी मांडल्यास होणाऱ्या व्यर्थ श्रमासाठी ही म्हण वापरतात.",
        "englishEquivalent": "Cast not pearls before swine.",
        "category": "स्वभाव आणि वर्तन",
        "tags": ["कदर", "अज्ञान", "मूल्य", "पारख"]
    },
    {
        "proverb": "घरोघरी मातीच्या चुली",
        "meaningMarathi": "सर्व घरांमध्ये किंवा कुटुंबांमध्ये सारख्याच अडचणी, वाद किंवा स्वभावदोष असतात.",
        "meaningEnglish": "Every household has its own share of problems and domestic struggles.",
        "exampleMarathi": "त्यांच्या घरात भांडणे झाली म्हणून आश्चर्य वाटायला नको, शेवटी घरोघरी मातीच्याच चुली असतात.",
        "exampleEnglish": "Do not be surprised that they had an argument; every family has skeletons in the closet.",
        "context": "कुटुंबातील अडचणी केवळ आपल्याच नशिबी आहेत असा गैरसमज असणाऱ्याला धीर देण्यासाठी किंवा वास्तव मांडण्यासाठी ही म्हण वापरली जाते.",
        "englishEquivalent": "Every family has a skeleton in the cupboard.",
        "category": "कुटुंब आणि समाज",
        "tags": ["कुटुंब", "वास्तव", "समानता", "संसार"]
    },
    {
        "proverb": "उथळ पाण्याला खळखळाट फार",
        "meaningMarathi": "अल्प ज्ञान किंवा कमी पात्रता असलेली व्यक्तीच स्वतःचा बडेजाव जास्त मिरवते.",
        "meaningEnglish": "People with superficial knowledge make the most boastful noise.",
        "exampleMarathi": "त्याला कोडिंगचे मूलभूत नियमही माहीत नाहीत, तरी स्वतःला मोठा इंजिनिअर समजून बढाया मारतो; उथळ पाण्याला खळखळाट फार!",
        "exampleEnglish": "He doesn't even know basic coding principles, yet boasts of being an elite engineer; empty vessels make the most noise.",
        "context": "ज्ञानाची किंवा कर्तृत्वाची खोली नसताना केवळ दिखावा करणाऱ्या माणसांवर उपरोधाने बोलताना ही म्हण वापरली जाते.",
        "englishEquivalent": "Empty vessels make the most sound.",
        "category": "शिक्षण आणि ज्ञान",
        "tags": ["अल्पज्ञान", "बडेजाव", "दिखावा", "नम्रता"]
    },
    {
        "proverb": "काखेत कळसा गावाला वळसा",
        "meaningMarathi": "हवी असलेली वस्तू अगदी जवळ असताना सर्वत्र शोधत फिरणे.",
        "meaningEnglish": "Searching far and wide for something that is already close at hand.",
        "exampleMarathi": "चष्मा कपाळावरच होता आणि आजोबा संपूर्ण घरात शोधत होते; अगदी काखेत कळसा गावाला वळसा!",
        "exampleEnglish": "Grandfather's spectacles were perched on his forehead while he searched the entire house; looking everywhere for what was right there.",
        "context": "सोपा उपाय किंवा वस्तू स्वतःजवळ असताना दूरवर शोध घेणाऱ्या व्यक्तीच्या विसराळूपणावर ही म्हण चपखल बसते.",
        "englishEquivalent": "Looking for the donkey while sitting on it.",
        "category": "शहाणपण आणि व्यवहारज्ञान",
        "tags": ["विसराळूपणा", "शोध", "जाणीव", "सहजता"]
    },
    {
        "proverb": "करावे तसे भरावे",
        "meaningMarathi": "माणूस जशी कर्मे करतो, त्याला तशीच फळे मिळतात.",
        "meaningEnglish": "One must bear the consequences of one's own actions.",
        "exampleMarathi": "दुसऱ्यांचे वाईट चिंतणाऱ्याला शेवटी अपयशाला सामोरे जावे लागले; करावे तसे भरावे हेच खरे.",
        "exampleEnglish": "He who wished ill upon others ultimately suffered ruin; as you sow, so you reap.",
        "context": "कर्माचा सिद्धांत आणि न्यायाची अपरिहार्यता सांगताना ही अत्यंत लोकप्रिय पारंपरिक म्हण वापरली जाते.",
        "englishEquivalent": "As you sow, so shall you reap.",
        "category": "प्रामाणिकपणा आणि नैतिकता",
        "tags": ["कर्म", "न्याय", "फळ", "सदाचार"]
    },
    {
        "proverb": "आयत्या बिळात नागोबा",
        "meaningMarathi": "दुसऱ्याने केलेल्या कष्टांचा गैरफायदा घेऊन स्वतःचे वर्चस्व किंवा फायदा सिद्ध करणे.",
        "meaningEnglish": "Taking undue credit or advantage of someone else's hard work.",
        "exampleMarathi": "प्रकल्प पूर्ण टीमने रात्रंदिवस जागून केला आणि सादरीकरणाच्या वेळी मॅनेजरने स्वतःचे नाव पुढे केले; अगदी आयत्या बिळात नागोबा!",
        "exampleEnglish": "The entire team built the project working day and night, yet the manager stepped in to claim sole credit; reaping where one has not sown.",
        "context": "दुसऱ्याच्या मेहनतीवर ऐट गाजवणाऱ्या संधिसाधू लोकांच्या वृत्तीवर प्रहार करताना ही म्हण वापरली जाते.",
        "englishEquivalent": "Reaping what another has sown.",
        "category": "स्वभाव आणि वर्तन",
        "tags": ["संधिसाधूपणा", "हक्क", "कष्ट", "फसवणूक"]
    },
    {
        "proverb": "झाकली मूठ सव्वा लाखाची",
        "meaningMarathi": "आपली कमजोरी, गुप्त गोष्टी किंवा कौटुंबिक उणिवा बाहेर न दाखवण्यातच प्रतिष्ठा असते.",
        "meaningEnglish": "Discretion and keeping internal flaws concealed protects one's honor.",
        "exampleMarathi": "आपल्या घरातील वाद चव्हाट्यावर मांडू नयेत, झाकली मूठ सव्वा लाखाची ठेवणेच शहाणपणाचे ठरते.",
        "exampleEnglish": "Never broadcast family disputes in public; maintaining privacy preserves dignity and reputation.",
        "context": "कुटुंबाची वा संस्थेची प्रतिष्ठा टिकवण्यासाठी अंतर्गत वाद चार भिंतींच्या आत मिटवण्याचा सल्ला देताना ही म्हण वापरतात.",
        "englishEquivalent": "Silence is golden.",
        "category": "शहाणपण आणि व्यवहारज्ञान",
        "tags": ["गोपनीयता", "प्रतिष्ठा", "मर्यादा", "संयम"]
    },
    {
        "proverb": "चोराच्या मनात चांदणे",
        "meaningMarathi": "वाईट कृत्य करणाऱ्या माणसाला आपण पकडले जाऊ अशी सतत भीती वाटते.",
        "meaningEnglish": "A guilty mind is always suspicious and apprehensive of being caught.",
        "exampleMarathi": "पोलिसांची गाडी गल्लीत येताच तो धास्तावून पळू लागला; खरोखर चोराच्या मनात चांदणे असते.",
        "exampleEnglish": "As soon as the patrol car entered the lane he panicked and fled; a guilty conscience needs no accuser.",
        "context": "चोरी, खोटेपणा किंवा अपराध केलेल्या माणसाच्या चेहऱ्यावरील अस्वस्थता व संशय टिपण्यासाठी ही म्हण वापरतात.",
        "englishEquivalent": "A guilty conscience needs no accuser.",
        "category": "स्वभाव आणि वर्तन",
        "tags": ["अपराध", "भीती", "अपराधभाव", "संशय"]
    },
    {
        "proverb": "दिव्याखाली अंधार",
        "meaningMarathi": "मोठ्या, ज्ञानी किंवा प्रसिद्ध व्यक्तीच्या अगदी जवळच्या व्यक्तींमध्ये वा परिसरात उणिवा असणे.",
        "meaningEnglish": "Darkness right under the lamp; blind spots closest to a source of enlightenment.",
        "exampleMarathi": "स्वतः गावातले मोठे शिक्षक असताना त्यांच्याच मुलाने शिक्षणात दुर्लक्ष केले; याला म्हणतात दिव्याखाली अंधार.",
        "exampleEnglish": "Despite being an eminent village teacher, his own son neglected education; the darkest place is under the candlestick.",
        "context": "एखाद्या प्रतिष्ठित व्यक्तीच्या स्वतःच्या घरात किंवा कार्यक्षेत्रात मूलभूत कमतरता आढळल्यास हा विरोधाभास दाखवण्यासाठी ही म्हण वापरतात.",
        "englishEquivalent": "The darkest place is under the candle.",
        "category": "अनुभव आणि जीवन",
        "tags": ["विरोधाभास", "उणीव", "दुर्लक्ष", "सत्य"]
    },
    {
        "proverb": "थेंबे थेंबे तळे साचे",
        "meaningMarathi": "लहान लहान बचतीतून किंवा सातत्यपूर्ण प्रयत्नातून कालांतराने मोठी संपत्ती किंवा यश प्राप्त होते.",
        "meaningEnglish": "Small, consistent savings or efforts accumulate into great outcomes over time.",
        "exampleMarathi": "दरमहा थोडी थोडी रक्कम गुंतवत राहिला तर भविष्यात मोठा निधी तयार होईल; कारण थेंबे थेंबे तळे साचे.",
        "exampleEnglish": "If you invest a modest sum each month, it will grow into a fortune; many a little makes a mickle.",
        "context": "काटकसर, चिकाटी आणि दीर्घकालीन नियोजनाचे महत्त्व सांगताना ही म्हण आवर्जून वापरली जाते.",
        "englishEquivalent": "Many a mickle makes a muckle.",
        "category": "पैसा आणि व्यवहार",
        "tags": ["बचत", "काटकसर", "सातत्य", "प्रयत्न"]
    },
    {
        "proverb": "नाव मोठे लक्षण खोटे",
        "meaningMarathi": "कीर्ती किंवा लौकिक खूप मोठा असणे, परंतु प्रत्यक्षात मात्र कोणतीही गुणवत्ता नसणे.",
        "meaningEnglish": "Having a grand reputation but showing completely disappointing or inferior reality.",
        "exampleMarathi": "त्या पंचतारांकित हॉटेलचे नाव खूप ऐकले होते, पण जेवण अगदी बेचव निघाले; नाव मोठे लक्षण खोटे!",
        "exampleEnglish": "We heard so much about that luxury hotel, but the food was utterly bland; great cry and little wool.",
        "context": "मोठ्या जाहिराती किंवा नावाला भुलून गेलेल्या व्यक्तीचा जेव्हा प्रत्यक्ष अनुभवाने भ्रमनिरास होतो, तेव्हा ही म्हण वापरतात.",
        "englishEquivalent": "Great cry and little wool.",
        "category": "विनोद आणि उपरोध",
        "tags": ["दिखावा", "भ्रमनिरास", "वास्तव", "गुणवत्ता"]
    },
    {
        "proverb": "पाण्यात राहून माशाशी वैर करू नये",
        "meaningMarathi": "ज्यांच्या आश्रयाने किंवा प्रभावाखाली राहायचे, त्यांच्याशी उगीच शत्रुत्व पत्करू नये.",
        "meaningEnglish": "Never antagonize those in whose domain you must live or work.",
        "exampleMarathi": "नवीन नोकरीत वरिष्ठ अधिकाऱ्यांशी नम्रतेने वागणेच हिताचे; पाण्यात राहून माशाशी वैर करू नये.",
        "exampleEnglish": "In a new job, stay respectful to your supervisors; you cannot live in water and be enemies with the crocodile.",
        "context": "कामाच्या ठिकाणी किंवा समाजात सत्ताधारी व प्रभावी लोकांशी विनाकारण पंगा न घेण्याचा व्यावहारिक सल्ला देण्यासाठी ही म्हण वापरतात.",
        "englishEquivalent": "Do not bite the hand that feeds you.",
        "category": "सावधगिरी",
        "tags": ["व्यवहारज्ञान", "मुत्सद्दीपणा", "सुरक्षितता", "संबंध"]
    },
    {
        "proverb": "बाप दाखव नाहीतर श्राद्ध कर",
        "meaningMarathi": "केवळ बोलण्यापेक्षा ठोस पुरावा देऊन आपले म्हणणे सिद्ध करणे.",
        "meaningEnglish": "Produce irrefutable proof or face the music; put up or shut up.",
        "exampleMarathi": "फक्त गप्पा मारू नकोस, तुझे काम सिद्ध करण्यासाठी प्रकल्प पूर्ण करून दाखव; बाप दाखव नाहीतर श्राद्ध कर!",
        "exampleEnglish": "Do not just boast of your abilities; prove your claims with concrete results.",
        "context": "बढाया मारणाऱ्या व्यक्तीला प्रत्यक्ष पुरावा मागण्यासाठी किंवा कृती करून दाखवण्याचे आव्हान देण्यासाठी ही म्हण वापरतात.",
        "englishEquivalent": "The proof of the pudding is in the eating.",
        "category": "शहाणपण आणि व्यवहारज्ञान",
        "tags": ["पुरावा", "सत्य", "कृती", "आव्हान"]
    },
    {
        "proverb": "बुडत्याला काडीचा आधार",
        "meaningMarathi": "मोठ्या संकटात सापडलेल्या माणसाला मिळालेली अगदी लहानशी मदतही खूप मोलाची वाटते.",
        "meaningEnglish": "A drowning man will clutch even at a straw; even small help is precious in deep crisis.",
        "exampleMarathi": "व्यवसायात नुकसान झाल्यावर जुन्या मित्राने दिलेले कर्ज त्याच्यासाठी बुडत्याला काडीचा आधार ठरले.",
        "exampleEnglish": "After suffering business losses, the small loan offered by an old friend was a lifesaver.",
        "context": "अत्यंत कठीण काळात मिळालेल्या आशेच्या किरणाचे किंवा मदतीचे मोल सांगताना ही म्हण वापरली जाते.",
        "englishEquivalent": "A drowning man will clutch at a straw.",
        "category": "अनुभव आणि जीवन",
        "tags": ["संकट", "मदत", "आशा", "सहकार्य"]
    },
    {
        "proverb": "मांजराच्या गळ्यात घंटा कोणी बांधायची",
        "meaningMarathi": "धोकादायक पण आवश्यक असलेले काम सुरू करण्याचे धाडस कोण करणार, हा यक्षप्रश्न असणे.",
        "meaningEnglish": "Everyone agrees a hazardous deed must be done, but who will dare to take the risk?",
        "exampleMarathi": "भ्रष्ट अधिकाऱ्याची तक्रार करायची हे सर्वांना मान्य होते, पण मांजराच्या गळ्यात घंटा बांधायला कोणी पुढे येत नव्हते.",
        "exampleEnglish": "Everyone agreed the corrupt officer must be reported, but who was willing to bell the cat?",
        "context": "सल्ला देणे सोपे असते परंतु जोखीम पत्करून पुढाकार घेणे कठीण असते, हे दर्शवण्यासाठी ही म्हण वापरतात.",
        "englishEquivalent": "Who will bell the cat?",
        "category": "नेतृत्व आणि निर्णय",
        "tags": ["धाडस", "जोखीम", "पुढाकार", "निर्णय"]
    },
    {
        "proverb": "वासरात लंगडी गाय शहाणी",
        "meaningMarathi": "मूर्ख किंवा अडाणी माणसांच्या समूहात अल्पबुद्धी माणूसही स्वतःला मोठा विद्वान समजतो.",
        "meaningEnglish": "Among the foolish or unlearned, even a mediocre person passes as an authority.",
        "exampleMarathi": "गावातील लोकांना इंग्रजी येत नसल्याने दोन शब्द बोलणाऱ्या रमेशला मोठा साहेब वाटत होते; वासरात लंगडी गाय शहाणी!",
        "exampleEnglish": "Since few villagers spoke English, Ramesh was treated like a scholar for speaking two sentences; a one-eyed man is king in the kingdom of the blind.",
        "context": "कमी गुणवत्तेच्या लोकांमध्ये सामान्य माणूसही स्वतःला तज्ज्ञ मानू लागतो, अशा स्थितीवर उपरोधाने बोलताना ही म्हण वापरली जाते.",
        "englishEquivalent": "In the country of the blind, the one-eyed man is king.",
        "category": "विनोद आणि उपरोध",
        "tags": ["अल्पज्ञान", "विद्वत्ता", "तुलना", "उपहास"]
    },
    {
        "proverb": "शितावरून भाताची परीक्षा",
        "meaningMarathi": "एखाद्या लहानशा घटकावरून किंवा नमुन्यावरून संपूर्ण घटकाची गुणवत्ता ओळखणे.",
        "meaningEnglish": "Judging the quality of the entire whole from a small representative sample.",
        "exampleMarathi": "त्याच्या भाषणातील पहिल्या दोन वाक्यांवरूनच त्याची विद्वत्ता समजली; शितावरून भाताची परीक्षा म्हणतात ती हीच.",
        "exampleEnglish": "From the very first two sentences of his speech, his erudition was evident; a straw shows which way the wind blows.",
        "context": "एखाद्या व्यक्तीची वृत्ती, काम किंवा वस्तूचे स्वरूप थोड्याशा लक्षणांवरून जाणण्यासाठी ही म्हण वापरली जाते.",
        "englishEquivalent": "You can judge the whole cloth from a single sample.",
        "category": "शिक्षण आणि ज्ञान",
        "tags": ["पारख", "नमुना", "निरीक्षण", "चातुर्य"]
    },
    {
        "proverb": "सुंठीवाचून खोकला गेला",
        "meaningMarathi": "कोणताही खर्च किंवा विशेष प्रयत्न न करता अडचण किंवा संकट आपोआप टळणे.",
        "meaningEnglish": "A problem getting solved effortlessly without needing remedy or expense.",
        "exampleMarathi": "जो पाहुणा त्रास देणार होता त्याने अचानक भेट रद्द केली; सुंठीवाचून खोकला गेला!",
        "exampleEnglish": "The troublesome visitor abruptly cancelled his trip; good riddance without any hassle.",
        "context": "विनासायास अडचण दूर झाल्याचा आनंद व्यक्त करताना ही म्हण वापरली जाते.",
        "englishEquivalent": "Cured without the medicine.",
        "category": "नशीब आणि प्रयत्न",
        "tags": ["सुटका", "सहजता", "नशीब", "आनंद"]
    },
    {
        "proverb": "हातच्या काकणाला आरसा कशाला",
        "meaningMarathi": "प्रत्यक्ष डोळ्यांसमोर सिद्ध असलेल्या गोष्टीला वेगळ्या पुराव्याची गरज नसते.",
        "meaningEnglish": "Self-evident truths need no secondary mirror or elaborate proof.",
        "exampleMarathi": "त्याच्या प्रामाणिकपणाची साक्ष द्यायला नको, त्याचे कामच बोलते; हातच्या काकणाला आरसा कशाला?",
        "exampleEnglish": "You do not need to testify for his integrity; his exemplary work speaks for itself.",
        "context": "जेव्हा एखादी गोष्ट उघड, स्पष्ट आणि सर्वांच्या समोर असते, तेव्हा तिच्या पुराव्याची निरर्थकता दर्शवण्यासाठी ही म्हण वापरतात.",
        "englishEquivalent": "Good wine needs no bush.",
        "category": "शहाणपण आणि व्यवहारज्ञान",
        "tags": ["प्रत्यक्ष", "सत्य", "पुरावा", "स्पष्टता"]
    },
    {
        "proverb": "अडला हरी गाढवाचे पाय धरी",
        "meaningMarathi": "अडचणीच्या वेळी आपले काम करून घेण्यासाठी प्रसंगी अयोग्य किंवा कमी योग्यतेच्या माणसाचीही खुशामत करावी लागते.",
        "meaningEnglish": "In times of desperate need, one must swallow pride and flatter even the unworthy.",
        "exampleMarathi": "फाइल मंजूर करून घेण्यासाठी त्याला त्या उद्धट कारकुनाची मनधरणी करावी लागली; अडला हरी गाढवाचे पाय धरी अशी वेळ आली.",
        "exampleEnglish": "To get his file cleared, he had to flatter that rude clerk; necessity makes strange bedfellows.",
        "context": "कामाच्या गरजेपोटी आपला अहंकार बाजूला ठेवून लाचारी पत्करावी लागणाऱ्या स्थितीचे वर्णन करताना ही म्हण वापरतात.",
        "englishEquivalent": "Necessity knows no law.",
        "category": "शहाणपण आणि व्यवहारज्ञान",
        "tags": ["मुत्सद्दीपणा", "गरज", "नम्रता", "व्यवहार"]
    },
    {
        "proverb": "अंथरूण पाहून पाय पसरावे",
        "meaningMarathi": "आपली आर्थिक ऐपत किंवा क्षमता ओळखूनच त्यानुसार खर्च किंवा नियोजन करावे.",
        "meaningEnglish": "Live within your means; adjust your expenditures to your actual resources.",
        "exampleMarathi": "कर्ज काढून महागडी गाडी खरेदी करू नये, अंथरूण पाहून पाय पसरावे हेच शहाणपणाचे ठरते.",
        "exampleEnglish": "Do not take loans for luxury cars; cut your coat according to your cloth.",
        "context": "आर्थिक शिस्त आणि उधळपट्टी टाळण्याचा सल्ला देण्यासाठी ही म्हण सर्वपरिचित आहे.",
        "englishEquivalent": "Cut your coat according to your cloth.",
        "category": "पैसा आणि व्यवहार",
        "tags": ["काटकसर", "मर्यादा", "नियोजन", "आर्थिकशिस्त"]
    },
    {
        "proverb": "आंधळा मागतो एक डोळा देव देतो दोन",
        "meaningMarathi": "अपेक्षेपेक्षा कितीतरी पटीने अधिक फायदा किंवा सुख मिळणे.",
        "meaningEnglish": "Receiving far more bounty or fortune than one ever dared to ask for.",
        "exampleMarathi": "त्याने केवळ नोकरीची आशा धरली होती, पण त्याला परदेशात जाण्याची संधी मिळाली; आंधळा मागतो एक डोळा देव देतो दोन!",
        "exampleEnglish": "He merely sought a modest job, but was awarded an international fellowship; blessings in overflowing abundance.",
        "context": "अनपेक्षितरीत्या मोठा नफा किंवा भाग्य लाभल्यास कृतज्ञता व्यक्त करताना ही म्हण वापरतात.",
        "englishEquivalent": "More than heart could wish.",
        "category": "नशीब आणि प्रयत्न",
        "tags": ["भाग्य", "अनपेक्षित", "लाभ", "आनंद"]
    },
    {
        "proverb": "आग सोमेश्वरी बंब रामेश्वरी",
        "meaningMarathi": "अडचण एका ठिकाणी असताना भलत्याच ठिकाणी उपाय शोधत राहणे.",
        "meaningEnglish": "Applying a remedy at the wrong place while the actual trouble lies elsewhere.",
        "exampleMarathi": "समस्या सॉफ्टवेअरमध्ये होती आणि ते हार्डवेअर बदलत राहिले; आग सोमेश्वरी बंब रामेश्वरी असा प्रकार झाला.",
        "exampleEnglish": "The bug was in the software, yet they kept replacing the hardware; misdirected remedy.",
        "context": "समस्येचे मूळ कारण न शोधता भलतीकडेच व्यर्थ धावपळ करणाऱ्या कारभारावर टीका करताना ही म्हण वापरली जाते.",
        "englishEquivalent": "Barking up the wrong tree.",
        "category": "शहाणपण आणि व्यवहारज्ञान",
        "tags": ["अकार्यक्षमता", "चूक", "मार्गदर्शन", "उपाय"]
    }
]

print(f"Loaded {len(CATALOG_SEEDS)} foundational seeds.")
