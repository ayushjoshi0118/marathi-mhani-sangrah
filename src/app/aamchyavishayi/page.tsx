import React from 'react';
import Link from 'next/link';
import { BookOpen, Sparkles, Award, ShieldCheck, Heart, Users, Globe2, Compass, ArrowRight } from 'lucide-react';
import { toDevanagariDigits } from '@/lib/devanagari';
import { getStats } from '@/data/storage';

export const metadata = {
  title: 'आमच्याविषयी — मराठी संस्कृतीचा अनमोल ठेवा | मराठी म्हणी संग्रह',
  description:
    'मराठी भाषेतील १,००० म्हणींचे डिजिटल संवर्धन, संदर्भ, अर्थ व जीवनमूल्ये यांचा अधिकृत व मोफत ज्ञानकोश.',
};

export default function AamchyavishayiPage() {
  const stats = getStats();

  return (
    <div className="min-h-screen bg-sand-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-saffron-100 text-saffron-900 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-saffron-600" />
            मराठी संस्कृतीचा अनमोल ठेवा, जगासाठी खुला
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-ink-950 font-rozha tracking-tight">
            आमच्याविषयी
          </h1>
          <p className="text-lg sm:text-xl text-ink-700 max-w-2xl mx-auto font-mukta leading-relaxed">
            &quot;मराठी म्हणी संग्रह&quot; हा मराठी भाषेतील पिढ्यान्‌पिढ्या चालत आलेल्या मौखिक लोकज्ञानाचा, जीवनमूल्यांचा आणि भाषिक सौंदर्याचा एक आदरपूर्वक डिजिटल संग्रह आहे.
          </p>
        </div>

        {/* Mission Statement Callout */}
        <div className="bg-gradient-to-br from-white to-sand-100 rounded-3xl border border-sand-300 p-8 sm:p-10 shadow-soft relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-saffron-100 rounded-full blur-3xl opacity-50" />
          <div className="relative z-10 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-ink-950 font-rozha">
              आमचे ध्येय व संकल्पना
            </h2>
            <p className="text-base sm:text-lg text-ink-800 font-mukta leading-relaxed">
              कोणतीही भाषा केवळ शब्दांचा संच नसते; तर त्यामध्ये संपूर्ण संस्कृतीचे शहाणपण, अनुभव आणि समाजदर्शन सामावलेले असते. मराठी म्हणी या आपल्या पूर्वजांनी जीवनातील अनुभवांमधून तावून-सुलाखून काढलेली जीवनसूत्रे आहेत.
            </p>
            <p className="text-base sm:text-lg text-ink-800 font-mukta leading-relaxed">
              बदलत्या काळात ही समृद्ध परंपरा नवीन पिढीपर्यंत, परदेशातील मराठी भाषकांपर्यंत आणि भाषाप्रेमींपर्यंत सहज, आधुनिक आणि विश्वासार्ह स्वरूपात पोहोचवणे हे या व्यासपीठाचे मुख्य उद्दिष्ट आहे.
            </p>
          </div>
        </div>

        {/* Four Key Pillars */}
        <div>
          <h2 className="text-2xl font-bold text-ink-950 font-rozha mb-6 text-center">
            व्यासपीठाची चार प्रमुख वैशिष्ट्ये
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-sm flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-saffron-100 text-saffron-700 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-ink-950 font-rozha mb-1">
                  १. पडताळलेले व अधिकृत संपादन
                </h3>
                <p className="text-sm text-ink-700 font-mukta">
                  प्रत्येक म्हणीचा अर्थ, संदर्भ आणि व्याकरण मराठीतील प्रमाण शब्दकोश व संदर्भांशी तपासूनच नोंदवले गेले आहे.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-sm flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-ink-950 font-rozha mb-1">
                  २. कायमस्वरूपी अनुक्रमांक (#१ ते #{toDevanagariDigits(1000)})
                </h3>
                <p className="text-sm text-ink-700 font-mukta">
                  प्रत्येक म्हणीला एक स्थिर अनुक्रमांक आणि युनिक वेबलिंक (Slug) दिलेली आहे, ज्यामुळे संदर्भ देणे व अभ्यास करणे अत्यंत सोपे होते.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-sm flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                <Globe2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-ink-950 font-rozha mb-1">
                  ३. द्विभाषिक सुलभता (मराठी व इंग्रजी)
                </h3>
                <p className="text-sm text-ink-700 font-mukta">
                  जगभरातील मराठी शिकणाऱ्यांसाठी आणि परदेशातील मुलांसाठी मराठी अर्थासोबतच इंग्रजी अनुवाद व समतुल्य इंग्रजी म्हणी दिल्या आहेत.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-sm flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-ink-950 font-rozha mb-1">
                  ४. पूर्णतः मोफत व जाहिरातमुक्त
                </h3>
                <p className="text-sm text-ink-700 font-mukta">
                  कोणतीही व्यावसायिक जाहिरात किंवा अडथळा नसलेला, वाचनाचा आनंद देणारा अत्यंत स्वच्छ व सुबक अनुभव.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Catalog Numbers */}
        <div className="bg-ink-950 text-white rounded-3xl p-8 sm:p-10 shadow-card">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold font-rozha text-saffron-300">
              डिजिटल ज्ञानकोशाची सध्याची स्थिती
            </h2>
            <p className="text-sm sm:text-base text-sand-300 font-mukta mt-1">
              पारदर्शक आकडेवारी — थेट डेटाबेसमधून
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 bg-ink-900/60 rounded-2xl border border-ink-800">
              <div className="text-3xl sm:text-4xl font-extrabold text-saffron-400 font-rozha">
                {toDevanagariDigits(stats.published)}
              </div>
              <div className="text-xs sm:text-sm text-sand-300 font-mukta mt-1">
                प्रकाशित म्हणी
              </div>
            </div>

            <div className="p-4 bg-ink-900/60 rounded-2xl border border-ink-800">
              <div className="text-3xl sm:text-4xl font-extrabold text-saffron-400 font-rozha">
                {toDevanagariDigits(stats.categoriesCount)}
              </div>
              <div className="text-xs sm:text-sm text-sand-300 font-mukta mt-1">
                सांस्कृतिक वर्गवाऱ्या
              </div>
            </div>

            <div className="p-4 bg-ink-900/60 rounded-2xl border border-ink-800">
              <div className="text-3xl sm:text-4xl font-extrabold text-saffron-400 font-rozha">
                ५
              </div>
              <div className="text-xs sm:text-sm text-sand-300 font-mukta mt-1">
                ज्ञानात्मक खेळ
              </div>
            </div>

            <div className="p-4 bg-ink-900/60 rounded-2xl border border-ink-800">
              <div className="text-3xl sm:text-4xl font-extrabold text-saffron-400 font-rozha">
                १००%
              </div>
              <div className="text-xs sm:text-sm text-sand-300 font-mukta mt-1">
                मोफत व खुला ठेवा
              </div>
            </div>
          </div>
        </div>

        {/* Editorial Standards & Integrity */}
        <div className="bg-white rounded-2xl border border-sand-200 p-8 shadow-sm space-y-4">
          <h2 className="text-2xl font-bold text-ink-950 font-rozha">
            संपादकीय निकष व सत्यता
          </h2>
          <p className="text-ink-700 font-mukta leading-relaxed">
            आम्ही कृत्रिम बुद्धिमत्ता (AI) किंवा अप्रमाणित स्रोतांमधून परस्पर तयार केलेली माहिती ग्राह्य मानत नाही. प्रत्येक म्हण मराठी लोकसंस्कृती, लोकसाहित्य, पारंपरिक संदर्भ आणि व्यावहारिक संभाषणांमधून घेतलेली आहे.
          </p>
          <p className="text-ink-700 font-mukta leading-relaxed">
            ज्या म्हणींमध्ये कालसुसंगत अथवा प्रादेशिक भेद (उदा. खानदेशी, वऱ्हाडी, कोकणी उच्चार) आहेत, त्यांची नोंद घेऊन मूळ म्हणीचे पावित्र्य जपण्याचा प्रयत्न करण्यात आला आहे.
          </p>
        </div>

        {/* Call to action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-saffron-50 border border-saffron-200 rounded-3xl p-8">
          <div>
            <h3 className="text-xl font-bold text-ink-950 font-rozha mb-1">
              आपल्याकडेही काही जुन्या म्हणी आहेत?
            </h3>
            <p className="text-sm text-ink-700 font-mukta">
              नवीन म्हणी सुचवून किंवा दुरुस्ती नोंदवून या चळवळीत सहभागी व्हा.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/suchva"
              className="px-5 py-2.5 bg-saffron-600 hover:bg-saffron-700 text-white font-medium rounded-xl transition-colors shadow-sm inline-flex items-center gap-2"
            >
              <span>म्हण सुचवा</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/mhani"
              className="px-5 py-2.5 bg-white hover:bg-sand-100 text-ink-800 font-medium rounded-xl border border-sand-300 transition-colors"
            >
              सर्व म्हणी वाचा
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
