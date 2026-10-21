'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  KeyRound,
  FileCheck,
  AlertCircle,
  PlusCircle,
  Download,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Edit3,
  ExternalLink,
  RefreshCw,
  LogOut,
  SlidersHorizontal,
} from 'lucide-react';
import { Proverb, SuggestionSubmission, CorrectionSubmission } from '@/types';
import { toDevanagariDigits } from '@/lib/devanagari';
import { CATEGORIES } from '@/data/categories';

export default function AdminPage() {
  const [pin, setPin] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [authError, setAuthError] = useState('');

  // Dashboard Data
  const [stats, setStats] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<SuggestionSubmission[]>([]);
  const [corrections, setCorrections] = useState<CorrectionSubmission[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'suggestions' | 'corrections' | 'proverbs'>('overview');
  const [loading, setLoading] = useState(false);

  // New Proverb Form
  const [showNewModal, setShowNewModal] = useState(false);
  const [editingProverb, setEditingProverb] = useState<Proverb | null>(null);
  const [proverbForm, setProverbForm] = useState({
    proverb: '',
    meaning: '',
    englishMeaning: '',
    usageExample: '',
    englishUsageExample: '',
    contextExplanation: '',
    englishEquivalent: '',
    category: CATEGORIES[0].titleMarathi,
    tags: '',
    status: 'published' as 'published' | 'draft' | 'pending_review',
  });

  // Action messages
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Check saved token on mount
  useEffect(() => {
    const savedToken = sessionStorage.getItem('admin_token');
    if (savedToken) {
      setToken(savedToken);
      fetchData(savedToken);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);

    try {
      const res = await fetch(`/api/admin?key=${encodeURIComponent(pin)}`);
      if (res.ok) {
        const data = await res.json();
        setToken(pin);
        sessionStorage.setItem('admin_token', pin);
        setStats(data.stats);
        setSuggestions(data.suggestions);
        setCorrections(data.corrections);
      } else {
        setAuthError('अवैध ॲडमीन की. कृपया बरोबर पासवर्ड टाका.');
      }
    } catch (err) {
      setAuthError('लॉगिन करताना त्रुटी आली.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token');
    setToken(null);
    setPin('');
  };

  const fetchData = async (currentKey: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin?key=${encodeURIComponent(currentKey)}`);
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setSuggestions(data.suggestions);
        setCorrections(data.corrections);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSuggestion = async (id: string, newStatus: 'approved' | 'rejected', notes?: string) => {
    if (!token) return;
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: 'update_suggestion',
          id,
          status: newStatus,
          adminNotes: notes || '',
        }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: `सुझाव स्थिती '${newStatus}' म्हणून अद्ययावत केली.` });
        fetchData(token);
      } else {
        setMessage({ type: 'error', text: 'बदल करण्यात अयशस्वी.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'सर्व्हर त्रुटी.' });
    }
  };

  const handleUpdateCorrection = async (id: string, newStatus: 'resolved' | 'dismissed', notes?: string) => {
    if (!token) return;
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: 'update_correction',
          id,
          status: newStatus,
          adminNotes: notes || '',
        }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: `दुरुस्ती नोंद '${newStatus}' म्हणून चिन्हांकित केली.` });
        fetchData(token);
      } else {
        setMessage({ type: 'error', text: 'बदल करण्यात अयशस्वी.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'सर्व्हर त्रुटी.' });
    }
  };

  const handleSaveProverb = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const tagsArray = proverbForm.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      let res;
      if (editingProverb) {
        res = await fetch('/api/admin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            action: 'update_proverb',
            id: editingProverb.id,
            updates: {
              ...proverbForm,
              tags: tagsArray,
            },
          }),
        });
      } else {
        res = await fetch('/api/admin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            action: 'create_proverb',
            ...proverbForm,
            tags: tagsArray,
          }),
        });
      }

      if (res.ok) {
        setMessage({
          type: 'success',
          text: editingProverb ? 'म्हण यशस्वीरित्या अद्ययावत केली.' : 'नवी म्हण यशस्वीरित्या जोडली.',
        });
        setShowNewModal(false);
        setEditingProverb(null);
        fetchData(token);
      } else {
        const d = await res.json();
        setMessage({ type: 'error', text: d.error || 'कृती अयशस्वी.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'सर्व्हर त्रुटी.' });
    }
  };

  // If not logged in, show lock screen
  if (!token) {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-3xl border border-sand-300 p-8 shadow-card text-center space-y-6">
          <div className="w-16 h-16 bg-saffron-100 text-saffron-700 rounded-2xl flex items-center justify-center mx-auto">
            <KeyRound className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-ink-950 font-rozha">
              संपादकीय व व्यवस्थापन कक्ष
            </h1>
            <p className="text-sm text-ink-600 font-mukta mt-1">
              मराठी म्हणी संग्रह सुरक्षित ॲडमीन पोर्टल
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {authError && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
                {authError}
              </div>
            )}
            <div>
              <input
                type="password"
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="गुप्त ॲडमीन की टाका (Admin Key)"
                className="w-full px-4 py-3 rounded-xl border border-sand-300 text-center tracking-widest text-lg focus:outline-none focus:ring-2 focus:ring-saffron-500"
              />
              <p className="text-[11px] text-ink-400 mt-1">
                डिफॉल्ट डेव्हलपमेंट की: <code className="bg-sand-100 px-1 rounded">mhani2026</code>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-saffron-600 hover:bg-saffron-700 text-white font-semibold rounded-xl transition-colors shadow-sm disabled:opacity-50"
            >
              {loading ? 'पडताळणी होत आहे...' : 'कक्ष उघडा'}
            </button>
          </form>

          <div className="pt-4 border-t border-sand-200">
            <Link href="/" className="text-xs text-ink-500 hover:text-saffron-600">
              ← मुख्यपृष्ठाकडे परत जा
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Bar */}
        <div className="bg-white rounded-2xl border border-sand-200 p-4 sm:p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-saffron-100 text-saffron-700 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-ink-950 font-rozha">
                संपादकीय व्यवस्थापन केंद्र
              </h1>
              <span className="text-xs text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> अधिकृत संपादक सत्र
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchData(token)}
              className="p-2 text-ink-600 hover:text-saffron-600 hover:bg-sand-100 rounded-lg transition-colors"
              title="रिफ्रेश करा"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <a
              href={`/api/admin?action=export_json&key=${encodeURIComponent(token)}`}
              className="px-3 py-1.5 bg-sand-100 hover:bg-sand-200 text-ink-800 text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              JSON निर्यात
            </a>
            <a
              href={`/api/admin?action=export_csv&key=${encodeURIComponent(token)}`}
              className="px-3 py-1.5 bg-sand-100 hover:bg-sand-200 text-ink-800 text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              CSV निर्यात
            </a>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              बाहेर पडा
            </button>
          </div>
        </div>

        {/* Global Alert Messages */}
        {message && (
          <div
            className={`p-4 rounded-xl text-sm flex items-center justify-between gap-3 ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            <span>{message.text}</span>
            <button onClick={() => setMessage(null)} className="text-xs font-bold hover:underline">
              बंद करा
            </button>
          </div>
        )}

        {/* Quick Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white p-4 rounded-xl border border-sand-200 shadow-sm text-center">
              <span className="text-xs text-ink-500 font-mukta">एकूण म्हणी</span>
              <div className="text-2xl font-bold text-ink-950 font-rozha mt-1">
                {toDevanagariDigits(stats.totalProverbs)}
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm text-center">
              <span className="text-xs text-emerald-700 font-mukta">प्रकाशित</span>
              <div className="text-2xl font-bold text-emerald-700 font-rozha mt-1">
                {toDevanagariDigits(stats.published)}
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-sand-200 shadow-sm text-center">
              <span className="text-xs text-ink-500 font-mukta">मसुदा (Draft)</span>
              <div className="text-2xl font-bold text-ink-950 font-rozha mt-1">
                {toDevanagariDigits(stats.draft)}
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm text-center">
              <span className="text-xs text-amber-700 font-mukta">प्रलंबित सुझाव</span>
              <div className="text-2xl font-bold text-amber-700 font-rozha mt-1">
                {toDevanagariDigits(stats.pendingSuggestions)}
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-red-200 shadow-sm text-center">
              <span className="text-xs text-red-700 font-mukta">प्रलंबित दुरुस्त्या</span>
              <div className="text-2xl font-bold text-red-700 font-rozha mt-1">
                {toDevanagariDigits(stats.pendingCorrections)}
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-sand-200 shadow-sm text-center">
              <span className="text-xs text-ink-500 font-mukta">वर्गवाऱ्या</span>
              <div className="text-2xl font-bold text-ink-950 font-rozha mt-1">
                {toDevanagariDigits(stats.categoriesCount)}
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="border-b border-sand-200 flex gap-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-saffron-600 text-saffron-600'
                : 'border-transparent text-ink-600 hover:text-ink-950'
            }`}
          >
            आढावा (Overview)
          </button>
          <button
            onClick={() => setActiveTab('suggestions')}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'suggestions'
                ? 'border-saffron-600 text-saffron-600'
                : 'border-transparent text-ink-600 hover:text-ink-950'
            }`}
          >
            सुचवलेल्या म्हणी
            {suggestions.filter((s) => s.status === 'pending').length > 0 && (
              <span className="w-5 h-5 bg-amber-500 text-white rounded-full text-xs flex items-center justify-center">
                {suggestions.filter((s) => s.status === 'pending').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('corrections')}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'corrections'
                ? 'border-saffron-600 text-saffron-600'
                : 'border-transparent text-ink-600 hover:text-ink-950'
            }`}
          >
            दुरुस्ती नोंदी
            {corrections.filter((c) => c.status === 'pending').length > 0 && (
              <span className="w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                {corrections.filter((c) => c.status === 'pending').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('proverbs')}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'proverbs'
                ? 'border-saffron-600 text-saffron-600'
                : 'border-transparent text-ink-600 hover:text-ink-950'
            }`}
          >
            नवी म्हण जोडा
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-sand-200 p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-ink-950 font-rozha">
                नवीन सुचवलेल्या म्हणींची रांग (Recent Suggestions)
              </h3>
              {suggestions.length === 0 ? (
                <p className="text-sm text-ink-500">कोणतीही प्रलंबित सूचना नाही.</p>
              ) : (
                <div className="space-y-3">
                  {suggestions.slice(0, 4).map((s) => (
                    <div key={s.id} className="p-3 rounded-xl bg-sand-50 border border-sand-200 flex justify-between items-center text-sm">
                      <div>
                        <span className="font-bold text-ink-900 font-rozha">{s.proverb}</span>
                        <p className="text-xs text-ink-600 line-clamp-1">{s.meaning}</p>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        s.status === 'pending' ? 'bg-amber-100 text-amber-800' : s.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {s.status}
                      </span>
                    </div>
                  ))}
                  <button
                    onClick={() => setActiveTab('suggestions')}
                    className="text-xs font-bold text-saffron-600 hover:underline pt-2 block"
                  >
                    सर्व सुचवलेल्या म्हणी पहा →
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-sand-200 p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-ink-950 font-rozha">
                दुरुस्ती नोंदी (Recent Corrections)
              </h3>
              {corrections.length === 0 ? (
                <p className="text-sm text-ink-500">कोणतीही प्रलंबित दुरुस्ती नाही.</p>
              ) : (
                <div className="space-y-3">
                  {corrections.slice(0, 4).map((c) => (
                    <div key={c.id} className="p-3 rounded-xl bg-sand-50 border border-sand-200 flex justify-between items-center text-sm">
                      <div>
                        <span className="font-bold text-ink-900 font-rozha">{c.proverbText}</span>
                        <p className="text-xs text-ink-600 line-clamp-1">{c.description}</p>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        c.status === 'pending' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {c.status}
                      </span>
                    </div>
                  ))}
                  <button
                    onClick={() => setActiveTab('corrections')}
                    className="text-xs font-bold text-saffron-600 hover:underline pt-2 block"
                  >
                    सर्व दुरुस्ती नोंदी पहा →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Suggestions */}
        {activeTab === 'suggestions' && (
          <div className="bg-white rounded-2xl border border-sand-200 p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-ink-950 font-rozha">
              सुचवलेल्या म्हणींची तपासणी
            </h3>
            {suggestions.length === 0 ? (
              <p className="text-sm text-ink-500 py-6 text-center">अद्याप कोणतीही म्हण सुचवलेली नाही.</p>
            ) : (
              <div className="space-y-4">
                {suggestions.map((s) => (
                  <div key={s.id} className="p-4 rounded-xl border border-sand-200 bg-sand-50/50 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg font-bold text-ink-950 font-rozha">{s.proverb}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                          s.status === 'pending' ? 'bg-amber-100 text-amber-800' : s.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {s.status}
                        </span>
                      </div>
                      <span className="text-xs text-ink-400">
                        {new Date(s.createdAt).toLocaleDateString('mr-IN')}
                      </span>
                    </div>
                    <p className="text-sm text-ink-800 font-mukta"><strong>अर्थ:</strong> {s.meaning}</p>
                    {s.englishMeaning && (
                      <p className="text-xs text-ink-600"><strong>English:</strong> {s.englishMeaning}</p>
                    )}
                    {s.usageExample && (
                      <p className="text-xs text-ink-600"><strong>उदाहरण:</strong> {s.usageExample}</p>
                    )}
                    {s.contributorName && (
                      <p className="text-xs text-ink-500">
                        योगदानकर्ता: {s.contributorName} {s.contributorEmail ? `(${s.contributorEmail})` : ''}
                      </p>
                    )}

                    {s.status === 'pending' && (
                      <div className="flex gap-2 pt-2 border-t border-sand-200">
                        <button
                          onClick={() => handleUpdateSuggestion(s.id, 'approved', 'संपादक मान्य')}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          मंजूर करा
                        </button>
                        <button
                          onClick={() => handleUpdateSuggestion(s.id, 'rejected', 'अपात्र किंवा पुनरावृत्ती')}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          नाकारा
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Corrections */}
        {activeTab === 'corrections' && (
          <div className="bg-white rounded-2xl border border-sand-200 p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-ink-950 font-rozha">
              वापरकर्त्यांनी नोंदवलेल्या दुरुस्त्या
            </h3>
            {corrections.length === 0 ? (
              <p className="text-sm text-ink-500 py-6 text-center">कोणतीही दुरुस्ती नोंद नाही.</p>
            ) : (
              <div className="space-y-4">
                {corrections.map((c) => (
                  <div key={c.id} className="p-4 rounded-xl border border-sand-200 bg-sand-50/50 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg font-bold text-ink-950 font-rozha">{c.proverbText}</h4>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-sand-200 text-ink-800 font-mono">
                          प्रकार: {c.issueType}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                          c.status === 'pending' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {c.status}
                        </span>
                      </div>
                      <span className="text-xs text-ink-400">
                        {new Date(c.createdAt).toLocaleDateString('mr-IN')}
                      </span>
                    </div>
                    <p className="text-sm text-ink-800 font-mukta"><strong>वर्णन:</strong> {c.description}</p>
                    {c.suggestedCorrection && (
                      <p className="text-xs text-ink-700"><strong>सुचवलेली सुधारणा:</strong> {c.suggestedCorrection}</p>
                    )}
                    {c.reporterName && (
                      <p className="text-xs text-ink-500">
                        नोंदवणारे: {c.reporterName} {c.reporterEmail ? `(${c.reporterEmail})` : ''}
                      </p>
                    )}

                    {c.status === 'pending' && (
                      <div className="flex gap-2 pt-2 border-t border-sand-200">
                        <button
                          onClick={() => handleUpdateCorrection(c.id, 'resolved', 'दुरुस्ती संपन्न')}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          निवारण केले (Resolved)
                        </button>
                        <button
                          onClick={() => handleUpdateCorrection(c.id, 'dismissed', 'आवश्यकता नाही')}
                          className="px-3 py-1 bg-sand-300 hover:bg-sand-400 text-ink-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          रद्द करा (Dismiss)
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Add New Proverb Form */}
        {activeTab === 'proverbs' && (
          <div className="bg-white rounded-2xl border border-sand-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-sand-200 pb-4">
              <h3 className="text-xl font-bold text-ink-950 font-rozha">
                {editingProverb ? 'म्हण संपादित करा' : 'नवीन म्हण प्रविष्ट करा'}
              </h3>
              <p className="text-xs text-ink-500 font-mukta mt-1">
                लक्षात ठेवा: प्रकाशित म्हणीचा अनुक्रमांक बदलता येत नाही. नवीन म्हणीला आपोआप पुढील सलग अनुक्रमांक दिला जाईल.
              </p>
            </div>

            <form onSubmit={handleSaveProverb} className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-xs font-semibold text-ink-900 mb-1">
                  म्हण (मराठीत) *
                </label>
                <input
                  type="text"
                  required
                  value={proverbForm.proverb}
                  onChange={(e) => setProverbForm({ ...proverbForm, proverb: e.target.value })}
                  placeholder="उदा. करावे तसे भरावे"
                  className="w-full px-3 py-2 rounded-lg border border-sand-300 font-mukta text-base"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-900 mb-1">
                  सोपा अर्थ (मराठीत) *
                </label>
                <textarea
                  required
                  rows={2}
                  value={proverbForm.meaning}
                  onChange={(e) => setProverbForm({ ...proverbForm, meaning: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-sand-300 font-mukta text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink-900 mb-1">
                    English Meaning
                  </label>
                  <input
                    type="text"
                    value={proverbForm.englishMeaning}
                    onChange={(e) => setProverbForm({ ...proverbForm, englishMeaning: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-900 mb-1">
                    वर्गवारी (Category) *
                  </label>
                  <select
                    value={proverbForm.category}
                    onChange={(e) => setProverbForm({ ...proverbForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-sand-300 bg-white text-sm"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.titleMarathi}>
                        {cat.titleMarathi}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-900 mb-1">
                  वाक्यात उपयोग (मराठीत)
                </label>
                <textarea
                  rows={2}
                  value={proverbForm.usageExample}
                  onChange={(e) => setProverbForm({ ...proverbForm, usageExample: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-sand-300 font-mukta text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-900 mb-1">
                  सांस्कृतिक संदर्भ व स्पष्टीकरण
                </label>
                <textarea
                  rows={2}
                  value={proverbForm.contextExplanation}
                  onChange={(e) => setProverbForm({ ...proverbForm, contextExplanation: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-sand-300 font-mukta text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink-900 mb-1">
                    टॅग्ज (Tags - स्वल्पविरामाने वेगळे करा)
                  </label>
                  <input
                    type="text"
                    value={proverbForm.tags}
                    onChange={(e) => setProverbForm({ ...proverbForm, tags: e.target.value })}
                    placeholder="उदा. कर्म, नीती, अनुभव"
                    className="w-full px-3 py-2 rounded-lg border border-sand-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-900 mb-1">
                    प्रकाशन स्थिती (Status)
                  </label>
                  <select
                    value={proverbForm.status}
                    onChange={(e) => setProverbForm({ ...proverbForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-sand-300 bg-white text-sm"
                  >
                    <option value="published">प्रकाशित (Published)</option>
                    <option value="draft">मसुदा (Draft)</option>
                    <option value="pending_review">पुनरावलोकन प्रलंबित (Pending Review)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-saffron-600 hover:bg-saffron-700 text-white font-semibold rounded-xl transition-colors shadow-sm inline-flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  {editingProverb ? 'बदल जतन करा' : 'डेटाबेसमध्ये नोंदवा'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
