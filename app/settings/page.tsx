'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SettingsPage() {
  const [language, setLanguage] = useState('th');
  const [theme, setTheme] = useState('dark');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(300); // 5 minutes

  useEffect(() => {
    // Load settings from localStorage
    const savedLanguage = localStorage.getItem('language') || 'th';
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const savedAutoRefresh = localStorage.getItem('autoRefresh') === 'true';
    const savedRefreshInterval = parseInt(localStorage.getItem('refreshInterval') || '300');

    setLanguage(savedLanguage);
    setTheme(savedTheme);
    setAutoRefresh(savedAutoRefresh);
    setRefreshInterval(savedRefreshInterval);
  }, []);

  const saveSettings = () => {
    localStorage.setItem('language', language);
    localStorage.setItem('theme', theme);
    localStorage.setItem('autoRefresh', autoRefresh.toString());
    localStorage.setItem('refreshInterval', refreshInterval.toString());
    
    // Apply theme
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    alert(language === 'th' ? 'บันทึกการตั้งค่าแล้ว!' : 'Settings saved!');
  };

  const text = {
    th: {
      title: 'การตั้งค่า',
      language: 'ภาษา',
      theme: 'ธีม',
      autoRefresh: 'รีเฟรชอัตโนมัติ',
      refreshInterval: 'ระยะเวลารีเฟรช (วินาทีี)',
      light: 'สว่าง',
      dark: 'มืด',
      thai: 'ไทย',
      english: 'อังกฤษ',
      save: 'บันทึก',
      backToHome: 'กลับหน้าหลัก',
      enabled: 'เปิด',
      disabled: 'ปิด'
    },
    en: {
      title: 'Settings',
      language: 'Language',
      theme: 'Theme',
      autoRefresh: 'Auto Refresh',
      refreshInterval: 'Refresh Interval (seconds)',
      light: 'Light',
      dark: 'Dark',
      thai: 'Thai',
      english: 'English',
      save: 'Save',
      backToHome: 'Back to Home',
      enabled: 'Enabled',
      disabled: 'Disabled'
    }
  };

  const t = text[language as keyof typeof text];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t.backToHome}
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">{t.title}</h1>
        </div>

        {/* Settings Panel */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8">
            
            {/* Language Setting */}
            <div className="mb-8">
              <label className="block text-white text-lg font-semibold mb-4">
                {t.language}
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setLanguage('th')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    language === 'th'
                      ? 'border-blue-400 bg-blue-400/20 text-blue-300'
                      : 'border-white/20 bg-white/5 text-white hover:border-white/40'
                  }`}
                >
                  🇹🇭 {t.thai}
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    language === 'en'
                      ? 'border-blue-400 bg-blue-400/20 text-blue-300'
                      : 'border-white/20 bg-white/5 text-white hover:border-white/40'
                  }`}
                >
                  🇺🇸 {t.english}
                </button>
              </div>
            </div>

            {/* Theme Setting */}
            <div className="mb-8">
              <label className="block text-white text-lg font-semibold mb-4">
                {t.theme}
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setTheme('light')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    theme === 'light'
                      ? 'border-yellow-400 bg-yellow-400/20 text-yellow-300'
                      : 'border-white/20 bg-white/5 text-white hover:border-white/40'
                  }`}
                >
                  ☀️ {t.light}
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    theme === 'dark'
                      ? 'border-purple-400 bg-purple-400/20 text-purple-300'
                      : 'border-white/20 bg-white/5 text-white hover:border-white/40'
                  }`}
                >
                  🌙 {t.dark}
                </button>
              </div>
            </div>

            {/* Auto Refresh Setting */}
            <div className="mb-8">
              <label className="block text-white text-lg font-semibold mb-4">
                {t.autoRefresh}
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setAutoRefresh(true)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    autoRefresh
                      ? 'border-green-400 bg-green-400/20 text-green-300'
                      : 'border-white/20 bg-white/5 text-white hover:border-white/40'
                  }`}
                >
                  ✅ {t.enabled}
                </button>
                <button
                  onClick={() => setAutoRefresh(false)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    !autoRefresh
                      ? 'border-red-400 bg-red-400/20 text-red-300'
                      : 'border-white/20 bg-white/5 text-white hover:border-white/40'
                  }`}
                >
                  ❌ {t.disabled}
                </button>
              </div>
            </div>

            {/* Refresh Interval */}
            {autoRefresh && (
              <div className="mb-8">
                <label className="block text-white text-lg font-semibold mb-4">
                  {t.refreshInterval}
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {[300, 600, 1800].map((interval) => (
                    <button
                      key={interval}
                      onClick={() => setRefreshInterval(interval)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        refreshInterval === interval
                          ? 'border-blue-400 bg-blue-400/20 text-blue-300'
                          : 'border-white/20 bg-white/5 text-white hover:border-white/40'
                      }`}
                    >
                      {interval / 60} {language === 'th' ? 'นาที' : 'min'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Save Button */}
            <button
              onClick={saveSettings}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
            >
              {t.save}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}