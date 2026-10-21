import React from 'react';
import Link from 'next/link';
import { FileText, ArrowLeft, CheckCircle, Scale, GraduationCap, AlertTriangle } from 'lucide-react';

export const metadata = {
  title: 'नियम व अटी | मराठी म्हणी संग्रह',
  description: 'मराठी म्हणी संग्रह व्यासपीठाच्या वापराचे नियम, अटी आणि शैक्षणिक वापराची मार्गदर्शक तत्त्वे.',
};

export default function NiyamVaAatiPage() {
  return (
    <div className="min-h-screen bg-sand-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-ink-600 hover:text-saffron-600 font-medium transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            मुख्यपृष्ठाकडे परत जा
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-saffron-100 text-saffron-900 text-xs font-semibold mb-2">
            <FileText className="w-4 h-4" />
            वापर नियमावली
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-ink-950 font-rozha">
            नियम व अटी (Terms of Service)
          </h1>
          <p className="text-sm text-ink-500 font-mukta mt-1">
            शेवटचे अपडेट: २१ ऑक्टोबर २०२६
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-sand-200 p-8 shadow-card space-y-6 text-ink-800 font-mukta">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink-950 font-rozha flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-saffron-600" />
              १. शैक्षणिक व सांस्कृतिक वापर
            </h2>
            <p className="leading-relaxed">
              &quot;मराठी म्हणी संग्रह&quot; हा विद्यार्थी, शिक्षक, लेखक, संशोधक आणि मराठी भाषाप्रेमी यांच्या ज्ञानसंवर्धनासाठी खुला आहे. यातील माहिती आपण शैक्षणिक, संशोधन, निबंध, आणि भाषिक संवादासाठी विनामूल्य वापरू शकता. शक्य असल्यास &quot;मराठी म्हणी संग्रह&quot;चा संदर्भ (Credit / Attribution) नमूद करावा.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink-950 font-rozha flex items-center gap-2">
              <Scale className="w-5 h-5 text-indigo-600" />
              २. व्यावसायिक पुनर्वापर
            </h2>
            <p className="leading-relaxed">
              या व्यासपीठावरील संपूर्ण डेटाबेस एकत्रितपणे स्वयंचलित साधनांद्वारे (Scraping) डाऊनलोड करून व्यावसायिक फायद्यासाठी किंवा अन्य ॲप्स/पुस्तकांमध्ये अनधिकृतपणे विक्री करण्यावर निर्बंध आहेत. वैयक्तिक किंवा शैक्षणिक कारणांसाठी संदर्भ देणे पूर्णतः मुक्त आहे.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink-950 font-rozha flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              ३. योगदानकर्त्यांचे हक्क
            </h2>
            <p className="leading-relaxed">
              जेव्हा आपण &quot;म्हण सुचवा&quot; द्वारे एखादी म्हण अथवा अर्थ पाठवता, तेव्हा आपण ती माहिती सार्वजनिक हितासाठी सर्वांसाठी खुली करण्याची अनुमती देत आहात. संपादक मंडळाला त्यात व्याकरणात्मक किंवा संदर्भीय सुधारणा करण्याचे अधिकार राहतील.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink-950 font-rozha flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              ४. जबाबदारी मर्यादा (Disclaimer)
            </h2>
            <p className="leading-relaxed">
              म्हणी हा पारंपरिक लोकजीवनाचा भाग असून त्यातील काही म्हणी जुन्या समाजव्यवस्थेचे चित्रण करतात. त्या केवळ भाषिक, सांस्कृतिक व ऐतिहासिक अभ्यासासाठी जतन केल्या आहेत. कोणत्याही व्यक्ती, समुदाय अथवा घटकाचा अवमान करण्याचा यामागे हेतू नाही.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
