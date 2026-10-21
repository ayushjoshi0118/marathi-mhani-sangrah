'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Send, CheckCircle2, AlertCircle, BookOpen, ArrowLeft, ShieldCheck } from 'lucide-react';
import { CATEGORIES } from '@/data/categories';

export default function SuchvaPage() {
  const [formData, setFormData] = useState({
    proverb: '',
    meaning: '',
    englishMeaning: '',
    usageExample: '',
    suggestedCategory: CATEGORIES[0].titleMarathi,
    contributorName: '',
    contributorEmail: '',
    notes: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.proverb.trim() || !formData.meaning.trim()) {
      setStatus('error');
      setErrorMessage('कृपया म्हण आणि तिचा सोपा अर्थ प्रविष्ट करा.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api/suchva', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'नोंदणी अयशस्वी झाली.');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMessage('इंटरनेट किंवा सर्व्हर समस्या आली. कृपया पुन्हा प्रयत्न करा.');
    }
  };

  const resetForm = () => {
    setFormData({
      proverb: '',
      meaning: '',
      englishMeaning: '',
      usageExample: '',
      suggestedCategory: CATEGORIES[0].titleMarathi,
      contributorName: '',
      contributorEmail: '',
      notes: '',
    });
    setStatus('idle');
  };

  return (
    <div className="min-h-screen bg-sand-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back navigation */}
        <div className="mb-6">
          <Link
            href="/mhani"
            className="inline-flex items-center gap-2 text-sm text-ink-600 hover:text-saffron-600 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            सर्व म्हणींकडे परत जा
          </Link>
        </div>

        {/* Hero Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-saffron-100 text-saffron-800 text-xs font-semibold mb-3">
            <Sparkles className="w-4 h-4 text-saffron-600" />
            लोकसहभाग व संवर्धन
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-ink-950 font-rozha mb-3">
            नवी म्हण सुचवा
          </h1>
          <p className="text-base sm:text-lg text-ink-700 max-w-2xl mx-auto font-mukta">
            आपल्या बोलीभाषेत, घरात किंवा भागात वापरली जाणारी पण या संग्रहात नसलेली म्हण सुचवून मराठी भाषेच्या या समृद्ध खजिन्यात मोलाचा हातभार लावा.
          </p>
        </div>

        {/* Success View */}
        {status === 'success' ? (
          <div className="bg-white rounded-2xl border border-saffron-200 p-8 sm:p-12 text-center shadow-soft">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-ink-900 font-rozha mb-3">
              धन्यवाद! म्हण यशस्वीपणे नोंदवली गेली आहे.
            </h2>
            <p className="text-ink-700 max-w-lg mx-auto mb-6 font-mukta">
              आपण सुचवलेली म्हण आमच्या संपादक मंडळाकडे पाठवली गेली आहे. भाषिक व संदर्भ पडताळणीनंतर ती &quot;मराठी म्हणी संग्रह&quot;मध्ये प्रकाशित केली जाईल.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={resetForm}
                className="px-6 py-2.5 bg-saffron-500 hover:bg-saffron-600 text-white font-medium rounded-xl transition-colors shadow-sm"
              >
                आणखी एक म्हण सुचवा
              </button>
              <Link
                href="/mhani"
                className="px-6 py-2.5 bg-sand-100 hover:bg-sand-200 text-ink-800 font-medium rounded-xl transition-colors"
              >
                संग्रह एक्सप्लोर करा
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Column */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-sand-200 p-6 sm:p-8 shadow-card">
              <form onSubmit={handleSubmit} className="space-y-6">
                {status === 'error' && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-800 text-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Proverb input */}
                <div>
                  <label htmlFor="proverb" className="block text-sm font-semibold text-ink-900 mb-1">
                    म्हण (मराठीत) <span className="text-saffron-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="proverb"
                    name="proverb"
                    required
                    value={formData.proverb}
                    onChange={handleChange}
                    placeholder="उदा. करावे तसे भरावे"
                    className="w-full px-4 py-3 rounded-xl border border-sand-300 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent text-ink-900 font-mukta text-lg placeholder:text-ink-400"
                  />
                  <p className="text-xs text-ink-500 mt-1">देवनागरी लिपीत अचूक काना-मात्रांसह लिहा.</p>
                </div>

                {/* Meaning input */}
                <div>
                  <label htmlFor="meaning" className="block text-sm font-semibold text-ink-900 mb-1">
                    म्हणीचा अर्थ (मराठीत) <span className="text-saffron-600">*</span>
                  </label>
                  <textarea
                    id="meaning"
                    name="meaning"
                    required
                    rows={3}
                    value={formData.meaning}
                    onChange={handleChange}
                    placeholder="उदा. आपल्या कृत्यांची फळे आपल्यालाच भोगावी लागतात."
                    className="w-full px-4 py-3 rounded-xl border border-sand-300 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent text-ink-900 font-mukta placeholder:text-ink-400"
                  />
                </div>

                {/* English meaning */}
                <div>
                  <label htmlFor="englishMeaning" className="block text-sm font-semibold text-ink-900 mb-1">
                    English Meaning / Equivalent (ऐच्छिक)
                  </label>
                  <input
                    type="text"
                    id="englishMeaning"
                    name="englishMeaning"
                    value={formData.englishMeaning}
                    onChange={handleChange}
                    placeholder="e.g. As you sow, so shall you reap."
                    className="w-full px-4 py-2.5 rounded-xl border border-sand-300 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent text-ink-900 placeholder:text-ink-400 text-sm"
                  />
                </div>

                {/* Usage example */}
                <div>
                  <label htmlFor="usageExample" className="block text-sm font-semibold text-ink-900 mb-1">
                    वाक्यात उपयोग (ऐच्छिक)
                  </label>
                  <textarea
                    id="usageExample"
                    name="usageExample"
                    rows={2}
                    value={formData.usageExample}
                    onChange={handleChange}
                    placeholder="उदा. परीक्षेत कॉपी करताना रमेश पकडला गेला, शेवटी करावे तसे भरावे."
                    className="w-full px-4 py-2.5 rounded-xl border border-sand-300 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent text-ink-900 font-mukta placeholder:text-ink-400 text-sm"
                  />
                </div>

                {/* Category Selection */}
                <div>
                  <label htmlFor="suggestedCategory" className="block text-sm font-semibold text-ink-900 mb-1">
                    विषय / वर्गवारी
                  </label>
                  <select
                    id="suggestedCategory"
                    name="suggestedCategory"
                    value={formData.suggestedCategory}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-sand-300 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent text-ink-900 bg-white font-mukta text-sm"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.titleMarathi}>
                        {cat.titleMarathi} ({cat.titleEnglish})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Submitter Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-sand-200">
                  <div>
                    <label htmlFor="contributorName" className="block text-xs font-semibold text-ink-700 mb-1">
                      आपले नाव (ऐच्छिक)
                    </label>
                    <input
                      type="text"
                      id="contributorName"
                      name="contributorName"
                      value={formData.contributorName}
                      onChange={handleChange}
                      placeholder="उदा. राहुल जोशी"
                      className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="contributorEmail" className="block text-xs font-semibold text-ink-700 mb-1">
                      ईमेल (ऐच्छिक, पडताळणीसाठी)
                    </label>
                    <input
                      type="email"
                      id="contributorEmail"
                      name="contributorEmail"
                      value={formData.contributorEmail}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full py-3.5 bg-saffron-500 hover:bg-saffron-600 disabled:bg-saffron-300 text-white font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {status === 'submitting' ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>नोंदणी होत आहे...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>म्हण पडताळणीसाठी पाठवा</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Sidebar Guidelines & Live Preview */}
            <div className="lg:col-span-5 space-y-6">
              {/* Live Preview Card */}
              <div className="bg-white rounded-2xl border border-sand-200 p-6 shadow-soft">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-sand-100">
                  <span className="text-xs font-bold text-saffron-700 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" /> थेट पूर्वावलोकन (Preview)
                  </span>
                  <span className="text-xs text-ink-400">अप्रकाशित मसुदा</span>
                </div>
                <div className="p-4 bg-sand-50 rounded-xl border border-sand-200 min-h-[140px] flex flex-col justify-between">
                  <div>
                    <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-saffron-100 text-saffron-800 mb-2 font-mukta">
                      {formData.suggestedCategory}
                    </span>
                    <h3 className="text-xl font-bold text-ink-950 font-rozha mb-2">
                      {formData.proverb || 'येथे तुमची म्हण दिसेल...'}
                    </h3>
                    <p className="text-sm text-ink-700 font-mukta">
                      {formData.meaning || 'येथे म्हणीचा सोपा अर्थ दिसेल...'}
                    </p>
                  </div>
                  {formData.englishMeaning && (
                    <p className="text-xs text-ink-500 italic mt-3 pt-2 border-t border-sand-200">
                      &quot;{formData.englishMeaning}&quot;
                    </p>
                  )}
                </div>
              </div>

              {/* Editorial Guidelines */}
              <div className="bg-sand-100/70 rounded-2xl border border-sand-200 p-6 text-sm text-ink-800">
                <div className="flex items-center gap-2 font-bold text-ink-950 mb-3 font-rozha text-base">
                  <ShieldCheck className="w-5 h-5 text-saffron-600" />
                  संपादकीय निकष व मार्गदर्शक तत्त्वे
                </div>
                <ul className="space-y-2.5 text-xs sm:text-sm text-ink-700 font-mukta">
                  <li className="flex items-start gap-2">
                    <span className="text-saffron-600 font-bold">•</span>
                    <span><strong>पारंपरिक व अस्सल:</strong> ती म्हण मराठी लोकजीवनात पूर्वापार वापरली जात असावी.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-saffron-600 font-bold">•</span>
                    <span><strong>स्पष्ट अर्थ:</strong> तिचा अर्थ सर्वसामान्यांना सहज समजेल असा असावा.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-saffron-600 font-bold">•</span>
                    <span><strong>प्रादेशिक वैविध्य:</strong> वऱ्हाडी, कोकणी, खानदेशी वा मराठवाडी म्हणींचे मनापासून स्वागत आहे.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-saffron-600 font-bold">•</span>
                    <span><strong>पडताळणी प्रक्रिया:</strong> प्रत्येक सुचवलेली म्हण भाषातज्ज्ञांकडून तपासूनच संग्रहात समाविष्ट केली जाते.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
