import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { Settings as SettingsIcon, User, Bell, Key, Palette, Zap } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const settingsSections = [
  {
    title: 'Profile',
    icon: User,
    items: [
      { label: 'Display Name', type: 'input', placeholder: 'Your Name' },
      { label: 'Email', type: 'input', placeholder: 'email@example.com' },
    ],
  },
  {
    title: 'Notifications',
    icon: Bell,
    items: [
      { label: 'Email notifications', type: 'toggle', defaultChecked: true },
      { label: 'Pipeline completion alerts', type: 'toggle', defaultChecked: true },
      { label: 'Weekly digest', type: 'toggle', defaultChecked: false },
    ],
  },
  {
    title: 'API Keys',
    icon: Key,
    items: [
      { label: 'ElevenLabs API Key', type: 'password', placeholder: 'sk-...' },
      { label: 'HeyGen API Key', type: 'password', placeholder: 'hg-...' },
      { label: 'OpenAI API Key', type: 'password', placeholder: 'sk-...' },
    ],
  },
];

const Settings = () => {
  return (
    <>
      <Helmet>
        <title>Settings - Aura Math AI</title>
        <meta name="description" content="Configure your Aura Math AI preferences" />
      </Helmet>
      
      <MainLayout>
        <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border">
          <div className="px-8 py-4">
            <h1 className="text-2xl font-bold">
              <span className="gradient-text">Settings</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Configure your preferences and API keys
            </p>
          </div>
        </header>

        <div className="p-8 max-w-3xl space-y-8">
          {settingsSections.map((section, sectionIndex) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.title}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-xl overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sectionIndex * 0.1 }}
              >
                <div className="flex items-center gap-3 px-6 py-4 bg-muted/30 border-b border-border">
                  <Icon className="w-5 h-5 text-secondary" />
                  <h2 className="font-semibold">{section.title}</h2>
                </div>
                <div className="p-6 space-y-6">
                  {section.items.map((item) => (
                    <div key={item.label} className="flex items-center justify-between gap-4">
                      <Label className="text-sm font-medium">{item.label}</Label>
                      {item.type === 'toggle' ? (
                        <Switch defaultChecked={item.defaultChecked} />
                      ) : (
                        <Input 
                          type={item.type === 'password' ? 'password' : 'text'}
                          placeholder={item.placeholder}
                          className="max-w-xs bg-muted/30"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button className="bg-gradient-primary hover:opacity-90 glow-primary">
              Save Changes
            </Button>
          </motion.div>
        </div>
      </MainLayout>
    </>
  );
};

export default Settings;
