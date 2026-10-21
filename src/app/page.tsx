import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  BookOpen,
  Compass,
  ArrowRight,
  Flame,
  Shuffle,
  Gamepad2,
  Bookmark,
  Share2,
  CheckCircle2,
  Heart,
  Search,
  ShieldCheck,
  Award,
} from 'lucide-react';
import {
  getPublishedProverbs,
  getDailyProverb,
  getCategoriesWithCounts,
  getStats,
} from '@/data/storage';
import { toMarathiNumerals } from '@/lib/devanagari';
import ProverbCard from '@/components/proverbs/ProverbCard';
import SearchBox from '@/components/proverbs/SearchBox';
import ProverbAudioButton from '@/components/proverbs/ProverbAudioButton';

export const revalidate = 3600; // revalidate hourly

export default function HomePage() {
  const stats = getStats();
  const { proverb: dailyProverb, dateString: dailyDate } = getDailyProverb();
  const categories = getCategoriesWithCounts();
  const allProverbs = getPublishedProverbs();

  // Curated proverb for first-time visitors (#1 अति तिथे माती)
  const firstVisitorProverb = allProverbs.find((p) => p.serialNumber === 1) || allProverbs[0];

  // Popular and timeless proverbs selection
  const popularProverbs = allProverbs
    .filter((p) => [2, 3, 4, 5, 6, 7, 8, 9].includes(p.serialNumber))
    .slice(0, 6);

  // Recently reviewed proverbs
  const recentProverbs = allProverbs.slice(10, 14);

  // Pick a random serial number for the random button
  const randomSerial = Math.floor(Math.random() * (stats.published || 1000)) + 1;

  return (
    <div className="font-devanagari text-ink-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-ivory-100 via-ivory-50 to-ivory-50 pt-12 sm:pt-20 pb-16 border-b border-ivory-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-saffron-100/90 border border-saffron-300 text-saffron-900 text-xs sm:text-sm font-semibold mb-6 shadow-xs animate-in fade-in duration-500">
            <Sparkles className="w-4 h-4 text-saffron-600" />
            <span>मराठी संस्कृतीचा अनमोल ठेवा, जगासाठी खुला</span>
          </div>

          {/* Hero Headline */}
          <h1 className="font-rozha text-4xl sm:text-6xl lg:text-7xl font-bold text-ink-950 tracking-tight leading-[1.15] mb-6 max-w-4xl mx-auto text-balance">
            मराठी म्हणी — पिढ्यान्पिढ्यांच्या शहाणपणाचा खजिना
          </h1>

          {/* Supporting Statement */}
          <p className="text-base sm:text-xl text-ink-700 max-w-2xl mx-auto leading-relaxed mb-8">
            <span className="font-bold text-saffron-700">
              {toMarathiNumerals(stats.published)} मराठी म्हणी
            </span>
            , त्यांचे सोपे अर्थ, उदाहरणे आणि आपल्या भाषेतील जीवनज्ञान — एका सुंदर, विश्वासार्ह डिजिटल
            संग्रहात.
          </p>

          {/* Prominent Search Box */}
          <div className="max-w-2xl mx-auto mb-8">
            <SearchBox autoFocus={false} />
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-semibold">
            <Link
              href="/mhani"
              className="px-6 py-3.5 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>सर्व {toMarathiNumerals(stats.published)} म्हणी पहा</span>
            </Link>

            <Link
              href="/aajchi-mhan"
              className="px-6 py-3.5 rounded-xl bg-white hover:bg-ivory-100 border-2 border-ivory-300 text-ink-800 transition-all flex items-center gap-2 shadow-xs"
            >
              <Flame className="w-4 h-4 text-amber-600" />
              <span>आजची म्हण वाचा</span>
            </Link>

            <Link
              href={`/mhani/${randomSerial}`}
              className="px-5 py-3.5 rounded-xl bg-ivory-200 hover:bg-ivory-300 text-ink-800 transition-all flex items-center gap-2"
              title="एक यादृच्छिक म्हण शोधा (Random Discovery)"
            >
              <Shuffle className="w-4 h-4 text-ink-600" />
              <span>यादृच्छिक म्हण</span>
            </Link>
          </div>
        </div>

        {/* Real Live Database Metric Bar */}
        <div className="max-w-5xl mx-auto px-4 mt-14">
          <div className="bg-white/80 backdrop-blur rounded-2xl p-4 sm:p-6 border border-ivory-300 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="font-rozha text-2xl sm:text-3xl font-bold text-saffron-700">
                {toMarathiNumerals(stats.published)}
              </p>
              <p className="text-xs text-ink-600 font-medium">प्रमाणित प्रकाशित म्हणी</p>
            </div>
            <div>
              <p className="font-rozha text-2xl sm:text-3xl font-bold text-ink-900">
                {toMarathiNumerals(categories.length)}
              </p>
              <p className="text-xs text-ink-600 font-medium">सांस्कृतिक व व्यावहारिक विषय</p>
            </div>
            <div>
              <p className="font-rozha text-2xl sm:text-3xl font-bold text-emerald-700">१००%</p>
              <p className="text-xs text-ink-600 font-medium">संपादकीय पडताळणी</p>
            </div>
            <div>
              <p className="font-rozha text-2xl sm:text-3xl font-bold text-amber-600">५</p>
              <p className="text-xs text-ink-600 font-medium">परस्परसंवादी शैक्षणिक खेळ</p>
            </div>
          </div>
        </div>

        {/* Transparent Curation & Editorial Progress Tracker */}
        <div className="max-w-5xl mx-auto px-4 mt-6">
          <div className="bg-sand-100/90 dark:bg-ink-800/80 rounded-2xl p-5 border border-sand-300 dark:border-ink-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-saffron-600 dark:text-saffron-400" />
                <span className="font-semibold text-sm text-ink-900 dark:text-sand-100">
                  संपादकीय पडताळणी प्रगती (Curation Pipeline Progress)
                </span>
              </div>
              <span className="text-xs text-ink-600 dark:text-sand-300 font-medium">
                लक्षित संग्रह: १,००० म्हणी | प्रमाणित: {toMarathiNumerals(stats.published)} ({((stats.published / 1000) * 100).toFixed(1)}%) | उर्वरित अंतर: {toMarathiNumerals(1000 - stats.published)}
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-sand-200 dark:bg-ink-700 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-saffron-600 to-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(1, (stats.published / 1000) * 100))}%` }}
              />
            </div>
            <p className="text-[11px] text-ink-500 dark:text-sand-400 mt-2">
              पारंपरिक लोकसाहित्य, मोल्सवर्थ कोश (१८५७) व शालेय पाठ्यपुस्तकातून टप्प्याटप्प्याने प्रमाणित केलेल्या अस्सल म्हणीच येथे प्रसिद्ध केल्या जातात. कोणतीही कृत्रिम (synthetic) बनावट नोंद प्रकाशित केली जात नाही.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Proverb of the Day & New Visitor Highlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Proverb of the Day Card (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border-2 border-antiquegold-300 shadow-manuscript-lg relative">
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
                <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                <span>आजची म्हण (Proverb of the Day — {dailyDate})</span>
              </span>
              <span className="serial-badge text-xs px-2.5 py-0.5 rounded font-bold">
                #{toMarathiNumerals(dailyProverb.serialNumber, 4)}
              </span>
            </div>

            <Link href={`/mhani/${dailyProverb.serialNumber}`} className="group block">
              <h2 className="font-rozha text-3xl sm:text-4xl font-bold text-ink-950 mb-3 group-hover:text-saffron-700 transition-colors leading-tight">
                &ldquo;{dailyProverb.proverb}&rdquo;
              </h2>
            </Link>

            <p className="text-base sm:text-lg text-ink-800 leading-relaxed mb-4">
              <span className="font-semibold text-ink-900">अर्थ:</span> {dailyProverb.meaningMarathi}
            </p>

            <div className="p-4 rounded-xl bg-ivory-100 border border-ivory-300 mb-6 text-sm text-ink-700">
              <span className="font-semibold">दैनंदिन जीवनातील वापर:</span> &ldquo;
              {dailyProverb.exampleMarathi}&rdquo;
            </div>

            <div className="flex items-center justify-between pt-2">
              <ProverbAudioButton text={dailyProverb.proverb} size="sm" showLabel={true} />
              <Link
                href={`/mhani/${dailyProverb.serialNumber}`}
                className="text-sm font-bold text-saffron-700 hover:text-saffron-800 flex items-center gap-1"
              >
                <span>सविस्तर संदर्भ व वापर वाचा</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* First Time Visitor Card (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-ivory-100 via-white to-ivory-100 rounded-3xl p-6 sm:p-8 border border-ivory-300 shadow-manuscript">
            <div className="flex items-center gap-2 text-xs font-bold text-saffron-800 uppercase tracking-wider mb-3">
              <Sparkles className="w-4 h-4 text-saffron-600" />
              <span>पहिल्यांदा भेट देणाऱ्यांसाठी</span>
            </div>

            <h3 className="font-bold text-xl text-ink-950 mb-2">
              मराठी भाषेची पहिली म्हण
            </h3>
            <p className="text-xs text-ink-600 mb-4 leading-relaxed">
              मराठी संस्कृतीत अत्यंत लोकप्रिय व पहिल्या क्रमांकावर स्थायी असलेली पारंपरिक म्हण:
            </p>

            <div className="bg-white rounded-2xl p-4 border border-ivory-300 shadow-xs mb-4">
              <span className="text-xs font-bold text-saffron-700 block mb-1">
                #{toMarathiNumerals(firstVisitorProverb.serialNumber, 4)}
              </span>
              <p className="font-rozha text-2xl font-bold text-ink-900 mb-2">
                &ldquo;{firstVisitorProverb.proverb}&rdquo;
              </p>
              <p className="text-sm text-ink-800">
                {firstVisitorProverb.meaningMarathi}
              </p>
            </div>

            <Link
              href={`/mhani/${firstVisitorProverb.serialNumber}`}
              className="text-xs font-bold text-saffron-700 hover:underline flex items-center gap-1"
            >
              <span>या म्हणीचा सविस्तर इतिहास वाचा →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Proverbs Grid */}
      <section className="bg-white border-y border-ivory-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-saffron-700 uppercase tracking-wider mb-2">
                <BookOpen className="w-3.5 h-3.5" />
                <span>निवडक म्हणी संग्रह</span>
              </div>
              <h2 className="font-rozha text-3xl sm:text-4xl font-bold text-ink-950">
                लोकप्रिय व नित्य परिचयाच्या म्हणी
              </h2>
              <p className="text-sm text-ink-600 mt-1">
                पिढ्यान्पिढ्या प्रत्येक मराठी घरात उच्चारल्या जाणाऱ्या कालातीत म्हणी
              </p>
            </div>

            <Link
              href="/mhani"
              className="text-sm font-bold text-saffron-700 hover:text-saffron-800 flex items-center gap-1 shrink-0"
            >
              <span>सर्व {toMarathiNumerals(stats.published)} म्हणी पहा</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularProverbs.map((proverb) => (
              <ProverbCard key={proverb.id} proverb={proverb} />
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Categories / Taxonomy */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-saffron-700 uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>विषयानुसार वर्गीकरण</span>
          </div>
          <h2 className="font-rozha text-3xl sm:text-4xl font-bold text-ink-950 mb-3">
            १६ जीवनोपयोगी विषयांमध्ये शोधा
          </h2>
          <p className="text-sm text-ink-600 leading-relaxed">
            शहाणपण, कुटुंब, व्यवहार, शेती आणि नैतिकतेपासून विनोदापर्यंत — जीवनाच्या प्रत्येक पैलूवरील
            म्हणी विषयानुसार सहज शोधा.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/vishay/${cat.slug}`}
              className="group p-5 rounded-2xl bg-white border border-ivory-300 hover:border-saffron-400 hover:shadow-manuscript transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-ivory-200 text-ink-700 font-semibold group-hover:bg-saffron-100 group-hover:text-saffron-800 transition-colors">
                    {toMarathiNumerals(cat.count || 0)} म्हणी
                  </span>
                  <ArrowRight className="w-4 h-4 text-ink-400 group-hover:text-saffron-600 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="font-rozha text-xl font-bold text-ink-950 mb-1 group-hover:text-saffron-700 transition-colors">
                  {cat.titleMarathi}
                </h3>
                <p className="text-xs text-ink-600 font-sans line-clamp-1 mb-2">
                  {cat.titleEnglish}
                </p>
              </div>
              <p className="text-xs text-ink-600 line-clamp-2 mt-2 pt-2 border-t border-ivory-200">
                {cat.descriptionMarathi}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Interactive Learning Games Callout */}
      <section className="bg-gradient-to-br from-ink-900 to-ink-950 text-white py-16 border-y-2 border-saffron-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-600/30 text-saffron-400 border border-saffron-500/40 text-xs font-semibold">
                <Gamepad2 className="w-4 h-4" />
                <span>मराठी भाषा ज्ञान केंद्र</span>
              </span>

              <h2 className="font-rozha text-3xl sm:text-5xl font-bold leading-tight text-ivory-50">
                खेळता खेळता शिका मराठी म्हणी!
              </h2>

              <p className="text-sm sm:text-base text-ink-200 leading-relaxed pr-6">
                &ldquo;म्हण ओळखा&rdquo;, &ldquo;रिकामी जागा भरा&rdquo;, &ldquo;योग्य अर्थ निवडा&rdquo;,
                &ldquo;म्हण जुळवा&rdquo; आणि &ldquo;दैनिक ज्ञानचाचणी&rdquo; अशा ५ रंजक परस्परसंवादी
                खेळांमधून आपल्या मराठी शब्दसंग्रहाची व भाषिक समजेची परीक्षा घ्या.
              </p>

              <div className="pt-4 flex flex-wrap items-center gap-3">
                <Link
                  href="/khel"
                  className="px-6 py-3.5 rounded-xl bg-saffron-600 hover:bg-saffron-500 text-white font-bold text-sm transition-all shadow-md flex items-center gap-2"
                >
                  <Gamepad2 className="w-4 h-4" />
                  <span>खेळ सुरू करा (Play Games)</span>
                </Link>

                <Link
                  href="/aajchi-mhan"
                  className="px-5 py-3.5 rounded-xl bg-ink-800 hover:bg-ink-700 text-ivory-100 font-semibold text-sm transition-all border border-ink-700 flex items-center gap-2"
                >
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>दैनिक आव्हान सोडवा</span>
                </Link>
              </div>
            </div>

            {/* Games Preview Tiles */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-ink-800/80 border border-ink-700">
                <p className="font-bold text-saffron-400 text-sm mb-1">म्हण ओळखा</p>
                <p className="text-ink-300">अर्थावरून योग्य म्हण ओळखण्याचा वेगवान खेळ.</p>
              </div>
              <div className="p-4 rounded-2xl bg-ink-800/80 border border-ink-700">
                <p className="font-bold text-amber-400 text-sm mb-1">रिकामी जागा भरा</p>
                <p className="text-ink-300">म्हणीतील अचूक शब्द शोधून स्मरणशक्ती तपासा.</p>
              </div>
              <div className="p-4 rounded-2xl bg-ink-800/80 border border-ink-700">
                <p className="font-bold text-emerald-400 text-sm mb-1">योग्य अर्थ निवडा</p>
                <p className="text-ink-300">म्हणीचा खरा भावार्थ अचूक पर्यायांतून निवडा.</p>
              </div>
              <div className="p-4 rounded-2xl bg-ink-800/80 border border-ink-700">
                <p className="font-bold text-cyan-400 text-sm mb-1">म्हण जुळवा</p>
                <p className="text-ink-300">म्हण आणि अर्थाच्या जोड्या जुळवणारा मेमरी गेम.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Mission & Cultural Preservation Promise */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-ivory-100 rounded-3xl p-8 sm:p-12 border border-ivory-300 text-center max-w-3xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-saffron-100 text-saffron-700 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="font-rozha text-2xl sm:text-3xl font-bold text-ink-950 mb-3">
            आमचे संपादकीय वचन
          </h2>
          <p className="text-base text-ink-800 leading-relaxed mb-6 font-medium">
            &ldquo;प्रत्येक म्हणीला आपले हक्काचे स्थान आहे, प्रत्येक अर्थ सुलभ व समजण्याजोगा आहे,
            आणि प्रकाशित झालेली प्रत्येक नोंद विश्वसनीय व पडताळलेली आहे.&rdquo;
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm font-semibold">
            <Link
              href="/aamchyavishayi"
              className="text-saffron-700 hover:text-saffron-800 underline flex items-center gap-1"
            >
              <span>संपादकीय पद्धत व मार्गदर्शक तत्त्वे वाचा</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <span className="text-ink-300">•</span>
            <Link
              href="/suchva"
              className="text-saffron-700 hover:text-saffron-800 underline flex items-center gap-1"
            >
              <span>नवीन म्हण सुचवा</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
