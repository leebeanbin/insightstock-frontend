'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/organisms/Sidebar';
import Header from '@/components/organisms/Header';
import Card from '@/components/molecules/Card';
import dynamic from 'next/dynamic';
import { Moon, Sun, Monitor, Globe, Bell, Shield, User, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

// ThemeToggle을 동적 import로 로드 (SSR 방지)
const ThemeToggle = dynamic(() => import('@/components/atoms/ThemeToggle').then(mod => ({ default: mod.ThemeToggle })), {
  ssr: false,
  loading: () => <div className="w-32 h-9 rounded-xl bg-background-hover" />
});

// SettingsContent 컴포넌트 (useTheme 사용)
function SettingsContent() {
  const { useTheme } = require('@/lib/contexts/ThemeContext');
  const { useLanguage } = require('@/lib/contexts/LanguageContext');
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    news: true,
  });

  const themeOptions = [
    { value: 'light' as const, icon: Sun },
    { value: 'dark' as const, icon: Moon },
    { value: 'system' as const, icon: Monitor },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* 페이지 헤더 */}
            <div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">{t('settings.title')}</h1>
        <p className="text-sm text-text-secondary">{t('settings.subtitle')}</p>
            </div>

      {/* 테마 설정 */}
      <Card variant="default" header={
        <div className="flex items-center gap-2">
          <Palette size={20} className="text-primary-600 dark:text-primary-400" />
          <h2 className="text-lg font-semibold text-text-primary">{t('settings.theme.title')}</h2>
                </div>
      }>
              <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            {t('settings.theme.description')}
          </p>
          <div className="grid grid-cols-3 gap-3">
            {themeOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = theme === option.value;
              return (
                  <button
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                    className={cn(
                    'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200',
                    isSelected
                      ? 'border-primary-600 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/30'
                      : 'border-border-default hover:border-[var(--brand-light-purple)] dark:hover:border-[var(--brand-purple)] bg-background-card hover:bg-background-hover'
                  )}
                >
                  <Icon 
                    size={24} 
                    className={cn(
                      isSelected 
                        ? 'text-primary-600 dark:text-primary-400' 
                        : 'text-text-tertiary'
                    )} 
                  />
                  <span className={cn(
                    'text-sm font-medium',
                    isSelected 
                      ? 'text-primary-600 dark:text-primary-400' 
                      : 'text-text-secondary'
                  )}>
                    {t(`settings.theme.${option.value}`)}
                  </span>
                  </button>
              );
            })}
                </div>
          <div className="pt-2 border-t border-border-default">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">{t('settings.theme.current')}</span>
              <ThemeToggle variant="button" />
                  </div>
                </div>
              </div>
            </Card>

      {/* 언어 설정 */}
      <Card variant="default" header={
        <div className="flex items-center gap-2">
          <Globe size={20} className="text-primary-600 dark:text-primary-400" />
          <h2 className="text-lg font-semibold text-text-primary">{t('settings.language.title')}</h2>
                </div>
      }>
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            {t('settings.language.description')}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'ko' as const, labelKey: 'settings.language.korean' },
              { value: 'en' as const, labelKey: 'settings.language.english' },
            ].map((option) => {
              const isSelected = language === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => setLanguage(option.value)}
                  className={cn(
                    'flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-200',
                    isSelected
                      ? 'border-primary-600 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                      : 'border-border-default hover:border-[var(--brand-light-purple)] dark:hover:border-[var(--brand-purple)] bg-background-card hover:bg-background-hover text-text-secondary'
                  )}
                >
                  <span className="text-sm font-medium">{t(option.labelKey)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* 알림 설정 */}
      <Card variant="default" header={
        <div className="flex items-center gap-2">
          <Bell size={20} className="text-primary-600 dark:text-primary-400" />
          <h2 className="text-lg font-semibold text-text-primary">{t('settings.notifications.title')}</h2>
        </div>
      }>
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            {t('settings.notifications.description')}
          </p>
          <div className="space-y-3">
            {[
              { key: 'email' as const, labelKey: 'settings.notifications.email', descKey: 'settings.notifications.emailDesc' },
              { key: 'push' as const, labelKey: 'settings.notifications.push', descKey: 'settings.notifications.pushDesc' },
              { key: 'news' as const, labelKey: 'settings.notifications.news', descKey: 'settings.notifications.newsDesc' },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between p-3 rounded-lg bg-background-subtle hover:bg-background-hover transition-colors"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-primary">{t(item.labelKey)}</p>
                  <p className="text-xs text-text-tertiary mt-0.5">{t(item.descKey)}</p>
                </div>
                <button
                  onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                  className={cn(
                    'relative w-11 h-6 rounded-full transition-colors duration-200',
                    notifications[item.key]
                      ? 'bg-primary-600 dark:bg-primary-500'
                      : 'bg-gray-300 dark:bg-gray-600'
                  )}
                >
                  <span
                    className={cn(
                      'absolute top-0.5 left-0.5 w-5 h-5 bg-white dark:bg-gray-200 rounded-full transition-transform duration-200 shadow-sm',
                      notifications[item.key] ? 'translate-x-5' : 'translate-x-0'
                    )}
                  />
                </button>
              </div>
            ))}
          </div>
              </div>
            </Card>

      {/* 계정 설정 */}
      <Card variant="default" header={
        <div className="flex items-center gap-2">
          <User size={20} className="text-primary-600 dark:text-primary-400" />
          <h2 className="text-lg font-semibold text-text-primary">{t('settings.account.title')}</h2>
        </div>
      }>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-background-subtle">
            <div>
              <p className="text-sm font-medium text-text-primary">{t('settings.account.profile')}</p>
              <p className="text-xs text-text-tertiary mt-0.5">{t('settings.account.profileDesc')}</p>
            </div>
            <button className="px-4 py-2 text-sm font-medium text-[var(--brand-main)] dark:text-[var(--brand-purple)] hover:text-[var(--brand-purple)] dark:hover:text-[var(--brand-light-purple)] transition-colors">
              {t('common.edit')}
            </button>
                </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-background-subtle">
                <div>
              <p className="text-sm font-medium text-text-primary">{t('settings.account.password')}</p>
              <p className="text-xs text-text-tertiary mt-0.5">{t('settings.account.passwordDesc')}</p>
            </div>
            <button className="px-4 py-2 text-sm font-medium text-[var(--brand-main)] dark:text-[var(--brand-purple)] hover:text-[var(--brand-purple)] dark:hover:text-[var(--brand-light-purple)] transition-colors">
              {t('common.edit')}
            </button>
                </div>
              </div>
            </Card>

      {/* 개인정보 보호 */}
      <Card variant="default" header={
        <div className="flex items-center gap-2">
          <Shield size={20} className="text-primary-600 dark:text-primary-400" />
          <h2 className="text-lg font-semibold text-text-primary">{t('settings.privacy.title')}</h2>
        </div>
      }>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-background-subtle">
            <div>
              <p className="text-sm font-medium text-text-primary">{t('settings.privacy.export')}</p>
              <p className="text-xs text-text-tertiary mt-0.5">{t('settings.privacy.exportDesc')}</p>
            </div>
            <button className="px-4 py-2 text-sm font-medium text-[var(--brand-main)] dark:text-[var(--brand-purple)] hover:text-[var(--brand-purple)] dark:hover:text-[var(--brand-light-purple)] transition-colors">
              {t('settings.privacy.export')}
            </button>
                </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-background-subtle">
                <div>
              <p className="text-sm font-medium text-text-primary">{t('settings.privacy.delete')}</p>
              <p className="text-xs text-text-tertiary mt-0.5">{t('settings.privacy.deleteDesc')}</p>
            </div>
            <button className="px-4 py-2 text-sm font-medium text-semantic-red dark:text-semantic-red-light hover:text-semantic-red-dark transition-colors">
              {t('common.delete')}
            </button>
                </div>
              </div>
      </Card>
              </div>
  );
}

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-screen bg-background-page">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-text-secondary">로딩 중...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background-page transition-colors duration-200">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto">
          <SettingsContent />
        </div>
      </div>
    </div>
  );
}
