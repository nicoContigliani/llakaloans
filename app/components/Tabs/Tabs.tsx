// components/Tabs/Tabs.tsx
'use client';

import React from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import styles from './Tabs.module.css';

export interface TabItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  content: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  activationMode?: 'automatic' | 'manual';
}

export const TabsComponent: React.FC<TabsProps> = ({
  tabs,
  defaultValue,
  value,
  onValueChange,
  orientation = 'horizontal',
  activationMode = 'automatic'
}) => {
  return (
    <Tabs.Root
      className={styles.tabsRoot}
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange}
      orientation={orientation}
      activationMode={activationMode}
    >
      <Tabs.List className={styles.tabsList} aria-label="Manage your account">
        {tabs.map((tab) => (
          <Tabs.Trigger
            key={tab.value}
            className={styles.tabsTrigger}
            value={tab.value}
            disabled={tab.disabled}
          >
            {tab.icon && <span className={styles.tabIcon}>{tab.icon}</span>}
            <span className={styles.tabLabel}>{tab.label}</span>
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      {tabs.map((tab) => (
        <Tabs.Content
          key={tab.value}
          className={styles.tabsContent}
          value={tab.value}
        >
          {tab.content}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
};

export default TabsComponent;