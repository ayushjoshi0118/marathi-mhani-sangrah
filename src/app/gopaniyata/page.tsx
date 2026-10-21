import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Lock, EyeOff, Database, Server } from 'lucide-react';

export const metadata = {
  title: 'गोपनीयता धोरण | मराठी म्हणी संग्रह',
  description: 'मराठी म्हणी संग्रह व्यासपीठाचे गोपनीयता धोरण आणि वापरकर्त्यांच्या डेटाचे रक्षण.',
};

export default function GopaniyataPage() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
            <ShieldCheck className="w-4 h-4" />
            पारदर्शक आणि सुरक्षित
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-ink-950 font-rozha">
            गोपनीयता धोरण (Privacy Policy)
          </h1>
          <p className="text-sm text-ink-500 font-mukta mt-1">
            शेवटचे अपडेट: २१ ऑक्टोबर २०२६
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-sand-200 p-8 shadow-card space-y-6 text-ink-800 font-mukta">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink-950 font-rozha flex items-center gap-2">
              <EyeOff className="w-5 h-5 text-saffron-600" />
              १. आम्ही कोणतीही वैयक्तिक माहिती ट्रॅक करत नाही
            </h2>
            <p className="leading-relaxed">
              &quot;मराठी म्हणी संग्रह&quot; हा एक सार्वजनिक आणि खुला शैक्षणिक ज्ञानकोश आहे. आम्ही कोणत्याही वापरकर्त्याचा वैयक्तिक डेटा, आयपी पत्ता, किंवा ऑनलाइन हालचाली ट्रॅक करत नाही. आम्ही जाहिराती किंवा डेटा-विक्रीच्या कोणत्याही यंत्रणेशी जोडलेले नाही.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink-950 font-rozha flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-600" />
              २. स्थानिक साठवणूक (Local Storage)
            </h2>
            <p className="leading-relaxed">
              आपण सेव्ह केलेल्या &quot;आवडत्या म्हणी&quot; (Bookmarks) आणि दैनिक ज्ञानचाचणीची आकडेवारी ही केवळ आपल्या डिव्हाइसच्या ब्राऊझरमधील <code className="bg-sand-100 px-1.5 py-0.5 rounded text-xs">localStorage</code> मध्ये सुरक्षित राहते. हा डेटा आमच्या सर्व्हरवर पाठवला जात नाही. आपण इच्छित असल्यास &quot;आवडत्या म्हणी&quot; पृष्ठावरून डेटा कधीही डाऊनलोड (Export) किंवा साफ करू शकता.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink-950 font-rozha flex items-center gap-2">
              <Server className="w-5 h-5 text-emerald-600" />
              ३. सुचवलेल्या म्हणी व दुरुस्त्या
            </h2>
            <p className="leading-relaxed">
              जेव्हा आपण &quot;म्हण सुचवा&quot; किंवा &quot;दुरुस्ती नोंदवा&quot; या फॉर्मचा वापर करता, तेव्हा आपण प्रविष्ट केलेले नाव आणि ईमेल पत्ता केवळ त्या नोंदीच्या संपादकीय पडताळणीपुरताच मर्यादित वापरला जातो. हा ईमेल कधीही सार्वजनिक केला जात नाही किंवा तिसऱ्या पक्षाला दिला जात नाही.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-ink-950 font-rozha flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-600" />
              ४. संपर्क
            </h2>
            <p className="leading-relaxed">
              या धोरणाविषयी किंवा आपल्या गोपनीयतेविषयी काही शंका असल्यास आपण आमच्या संपादकीय चमूशी संपर्क साधू शकता.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
