'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ShieldAlert, Send, CheckCircle2, AlertCircle, ArrowLeft, HelpCircle } from 'lucide-react';

function DurustiForm() {
  const searchParams = useSearchParams();
  const initialMhanId = searchParams.get('id') || searchParams.get('mhanId') || '';
  const initialSerial = searchParams.get('serial') || '';
  const initialProverb = searchParams.get('proverb') || searchParams.get('text') || '';

  const [formData, setFormData] = useState({
    proverbId: initialMhanId,
    proverbText: initialProverb,
    serialNumber: initialSerial,
    issueType: 'spelling',
    description: '',
    suggestedCorrection: '',
    reporterName: '',
    reporterEmail: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-fill from search params if passed
  useEffect(() => {
    if (initialProverb) {
      setFormData((prev) => ({
        ...prev,
        proverbId: initialMhanId,
        proverbText: initialProverb,
        serialNumber: initialSerial,
      }));
    }
  }, [initialMhanId, initialSerial, initialProverb]);

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
    if (!formData.proverbText.trim()) {
      setStatus('error');
      setErrorMessage('कृपया दुरुस्ती आवश्यक असणारी म्हण नमूद करा.');
      return;
    }

    if (!formData.description.trim() || formData.description.trim().length < 5) {
      setStatus('error');
      setErrorMessage('कृपया दुरुस्तीचे कारण स्पष्ट करा (किमान ५ अक्षरे).');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api/durusti', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'दुरुस्ती नोंदणी अयशस्वी झाली.');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMessage('इंटरनेट किंवा सर्व्हर समस्या आली. कृपया पुन्हा प्रयत्न करा.');
    }
  };

  const resetForm = () => {
    setFormData({
      proverbId: '',
      proverbText: '',
      serialNumber: '',
      issueType: 'spelling',
      description: '',
      suggestedCorrection: '',
      reporterName: '',
      reporterEmail: '',
    });
    setStatus('idle');
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/mhani"
          className="inline-flex items-center gap-2 text-sm text-ink-600 hover:text-saffron-600 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          संग्रहाकडे परत जा
        </Link>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-3">
          <ShieldAlert className="w-4 h-4 text-amber-700" />
          शुद्धता व गुणवत्ता नियंत्रण
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ink-950 font-rozha mb-3">
          दुरुस्ती किंवा त्रुटी नोंदवा
        </h1>
        <p className="text-base sm:text-lg text-ink-700 max-w-xl mx-auto font-mukta">
          एखाद्या म्हणीत शुद्धलेखन, अर्थ, संदर्भ किंवा उदाहरणात चूक आढळल्यास आम्हाला कळवा. ज्ञानकोश निर्दोष ठेवण्यासाठी आपले सहकार्य मोलाचे आहे.
        </p>
      </div>

      {status === 'success' ? (
        <div className="bg-white rounded-2xl border border-sand-200 p-8 sm:p-12 text-center shadow-card">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-ink-900 font-rozha mb-3">
            आपली दुरुस्ती नोंदवली गेली आहे!
          </h2>
          <p className="text-ink-700 max-w-lg mx-auto mb-6 font-mukta">
            मराठी भाषेच्या अचूकतेसाठी आपण घेतलेल्या जागरूकतेबद्दल मनःपूर्वक आभार. आमची संपादकीय चमू या दुरुस्तीची शहानिशा करून योग्य ते बदल करेल.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={resetForm}
              className="px-6 py-2.5 bg-saffron-500 hover:bg-saffron-600 text-white font-medium rounded-xl transition-colors shadow-sm"
            >
              आणखी दुरुस्ती नोंदवा
            </button>
            <Link
              href="/mhani"
              className="px-6 py-2.5 bg-sand-100 hover:bg-sand-200 text-ink-800 font-medium rounded-xl transition-colors"
            >
              सर्व म्हणी पहा
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-sand-200 p-6 sm:p-8 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {status === 'error' && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-800 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Proverb Reference Field */}
            <div>
              <label htmlFor="proverbText" className="block text-sm font-semibold text-ink-900 mb-1">
                संबंधित म्हण <span className="text-saffron-600">*</span>
              </label>
              <input
                type="text"
                id="proverbText"
                name="proverbText"
                required
                value={formData.proverbText}
                onChange={handleChange}
                placeholder="उदा. अति तिथे माती किंवा म्हण क्रमांक"
                className="w-full px-4 py-3 rounded-xl border border-sand-300 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent text-ink-900 font-mukta text-lg placeholder:text-ink-400"
              />
              {formData.serialNumber && (
                <p className="text-xs text-saffron-700 mt-1 font-medium">
                  क्रमांक: #{formData.serialNumber} साठी दुरुस्ती
                </p>
              )}
            </div>

            {/* Issue Type */}
            <div>
              <label htmlFor="issueType" className="block text-sm font-semibold text-ink-900 mb-1">
                त्रुटीचा प्रकार <span className="text-saffron-600">*</span>
              </label>
              <select
                id="issueType"
                name="issueType"
                value={formData.issueType}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-sand-300 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent text-ink-900 bg-white font-mukta text-sm"
              >
                <option value="spelling">शुद्धलेखन / टंकलेखन त्रुटी (Typo or Spelling)</option>
                <option value="meaning">अर्थ अपूर्ण किंवा चुकीचा आहे (Inaccurate Meaning)</option>
                <option value="usage">वाक्यात उपयोग किंवा संदर्भ अयोग्य (Usage / Context)</option>
                <option value="other">इतर सुधारणा (Other Suggestion)</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-ink-900 mb-1">
                त्रुटीचे सविस्तर वर्णन <span className="text-saffron-600">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="उदा. या म्हणीमधील '...' हा शब्द चुकीचा टाईप झाला असून तो '...' असा असावा."
                className="w-full px-4 py-3 rounded-xl border border-sand-300 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent text-ink-900 font-mukta placeholder:text-ink-400"
              />
            </div>

            {/* Suggested Correction */}
            <div>
              <label htmlFor="suggestedCorrection" className="block text-sm font-semibold text-ink-900 mb-1">
                योग्य रूप / आपला संदर्भ (ऐच्छिक)
              </label>
              <textarea
                id="suggestedCorrection"
                name="suggestedCorrection"
                rows={2}
                value={formData.suggestedCorrection}
                onChange={handleChange}
                placeholder="योग्य अर्थ, संदर्भ ग्रंथ किंवा प्रमाण उदाहरण नमूद करू शकता."
                className="w-full px-4 py-2.5 rounded-xl border border-sand-300 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent text-ink-900 font-mukta placeholder:text-ink-400 text-sm"
              />
            </div>

            {/* Reporter details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-sand-200">
              <div>
                <label htmlFor="reporterName" className="block text-xs font-semibold text-ink-700 mb-1">
                  आपले नाव (ऐच्छिक)
                </label>
                <input
                  type="text"
                  id="reporterName"
                  name="reporterName"
                  value={formData.reporterName}
                  onChange={handleChange}
                  placeholder="उदा. प्रा. आनंद पाटील"
                  className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500"
                />
              </div>
              <div>
                <label htmlFor="reporterEmail" className="block text-xs font-semibold text-ink-700 mb-1">
                  ईमेल पत्ता (ऐच्छिक)
                </label>
                <input
                  type="email"
                  id="reporterEmail"
                  name="reporterEmail"
                  value={formData.reporterEmail}
                  onChange={handleChange}
                  placeholder="contact@example.com"
                  className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              {status === 'submitting' ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>दुरुस्ती नोंदवली जात आहे...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>दुरुस्ती पाठवा</span>
                </>
              )}
            </button>
          </form>

          {/* Note */}
          <div className="mt-6 flex items-start gap-2.5 text-xs text-ink-500 bg-sand-50 p-4 rounded-xl border border-sand-200">
            <HelpCircle className="w-4 h-4 text-ink-400 flex-shrink-0 mt-0.5" />
            <span>
              नोंदवलेली दुरुस्ती आमच्या संपादकीय मंडळाकडे जाते. मूळ संदर्भग्रंथ आणि प्रमाण व्याकरणाशी पडताळणी करूनच नोंदीमध्ये आवश्यक बदल केले जातात.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DurustiPage() {
  return (
    <div className="min-h-screen bg-sand-50 py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="max-w-3xl mx-auto py-12 text-center text-ink-500">लोड होत आहे...</div>}>
        <DurustiForm />
      </Suspense>
    </div>
  );
}
