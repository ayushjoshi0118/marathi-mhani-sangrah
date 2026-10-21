import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Heart,
  Sparkles,
  ShieldCheck,
  Send,
  HelpCircle,
  ExternalLink,
  Feather,
} from 'lucide-react';
import ThemeToggle from '@/components/layout/ThemeToggle';

export default function Footer() {
  return (
    <footer className="bg-ink-950 text-ivory-100 border-t-4 border-saffron-600 font-devanagari mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron-500 to-terracotta-700 flex items-center justify-center text-ivory-50 shadow-manuscript">
                <span className="font-rozha text-xl font-bold">म्ह</span>
              </div>
              <span className="font-rozha text-2xl font-bold tracking-tight text-ivory-50">
                मराठी म्हणी संग्रह
              </span>
            </div>

            <p className="text-saffron-400 font-medium text-sm">
              &ldquo;मराठी संस्कृतीचा अनमोल ठेवा, जगासाठी खुला.&rdquo;
            </p>

            <p className="text-ink-300 text-sm leading-relaxed pr-6">
              मराठी भाषेतील पारंपारिक ज्ञान, जीवनमूल्ये, व्यावहारिक चातुर्य आणि पिढ्यान्पिढ्या चालत आलेले
              शहाणपण डिजिटल युगातील मराठी अभ्यासक, विद्यार्थी आणि जगभरातील मराठी रसिकांपर्यंत
              पोहोचवणारा १,००० प्रमाणित म्हणींचा मुक्त डिजिटल ग्रंथ.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-ink-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>१,००० संपादकीय प्रमाणित म्हणी कायमस्वरूपी क्रमांकित (#१ ते #१०००)</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-ivory-50 text-base mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-saffron-400" />
              <span>महत्त्वाचे विभाग</span>
            </h3>
            <ul className="space-y-2.5 text-sm text-ink-300">
              <li>
                <Link href="/mhani" className="hover:text-saffron-400 transition-colors">
                  सर्व १,००० म्हणी
                </Link>
              </li>
              <li>
                <Link href="/vishay" className="hover:text-saffron-400 transition-colors">
                  विषयानुसार वर्गीकरण
                </Link>
              </li>
              <li>
                <Link href="/aajchi-mhan" className="hover:text-saffron-400 transition-colors">
                  आजची म्हण (Daily Proverb)
                </Link>
              </li>
              <li>
                <Link href="/khel" className="hover:text-saffron-400 transition-colors">
                  म्हणींचे खेळ व ज्ञानचाचणी
                </Link>
              </li>
              <li>
                <Link href="/aavadtaye-mhani" className="hover:text-saffron-400 transition-colors">
                  जतन केलेल्या आवडत्या म्हणी
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold text-ivory-50 text-base mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-antiquegold-400" />
              <span>प्रमुख विषय</span>
            </h3>
            <ul className="space-y-2.5 text-sm text-ink-300">
              <li>
                <Link href="/vishay/shahanpan-vyavahar" className="hover:text-saffron-400 transition-colors">
                  शहाणपण व व्यवहारज्ञान
                </Link>
              </li>
              <li>
                <Link href="/vishay/mehnat-kashta" className="hover:text-saffron-400 transition-colors">
                  मेहनत आणि कष्ट
                </Link>
              </li>
              <li>
                <Link href="/vishay/kutumb-samaj" className="hover:text-saffron-400 transition-colors">
                  कुटुंब आणि समाज
                </Link>
              </li>
              <li>
                <Link href="/vishay/paisa-vyavahar" className="hover:text-saffron-400 transition-colors">
                  पैसा आणि व्यवहार
                </Link>
              </li>
              <li>
                <Link href="/vishay/swabhav-vartan" className="hover:text-saffron-400 transition-colors">
                  स्वभाव आणि वर्तन
                </Link>
              </li>
              <li>
                <Link href="/vishay/vinod-uprodh" className="hover:text-saffron-400 transition-colors">
                  विनोद आणि उपरोध
                </Link>
              </li>
            </ul>
          </div>

          {/* Community & Legal */}
          <div>
            <h3 className="font-bold text-ivory-50 text-base mb-4 flex items-center gap-2">
              <Feather className="w-4 h-4 text-terracotta-400" />
              <span>सहभाग व माहिती</span>
            </h3>
            <ul className="space-y-2.5 text-sm text-ink-300">
              <li>
                <Link href="/suchva" className="hover:text-saffron-400 transition-colors flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-saffron-400" />
                  <span>नवीन म्हण सुचवा</span>
                </Link>
              </li>
              <li>
                <Link href="/durusti" className="hover:text-saffron-400 transition-colors flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>दुरुस्ती किंवा सूचना नोंदवा</span>
                </Link>
              </li>
              <li>
                <Link href="/aamchyavishayi" className="hover:text-saffron-400 transition-colors">
                  प्रकल्पाविषयी व संपादन पद्धत
                </Link>
              </li>
              <li>
                <Link href="/gopaniyata" className="hover:text-saffron-400 transition-colors">
                  गोपनीयता धोरण (Privacy)
                </Link>
              </li>
              <li>
                <Link href="/niyam-va-aati" className="hover:text-saffron-400 transition-colors">
                  नियम व अटी (Terms)
                </Link>
              </li>
              <li className="pt-2 border-t border-ink-800">
                <Link href="/admin" className="text-xs text-saffron-400 hover:underline flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>संपादकीय कक्ष (Editorial Portal)</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="mt-14 pt-8 border-t border-ink-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-ink-400 gap-4">
          <p>
            © {new Date().getFullYear()} मराठी म्हणी संग्रह. सर्व हक्क राखीव. लोकसाहित्य व भाषा संवर्धनासाठी समर्पित.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-ink-400">रंग योजना:</span>
              <ThemeToggle showLabel={true} />
            </div>
            <span>•</span>
            <span className="text-ink-400">देवनागरी संवर्धन</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
