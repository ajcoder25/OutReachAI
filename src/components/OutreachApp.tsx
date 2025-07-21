import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileUpload } from './FileUpload';
import { TemplateEditor } from './TemplateEditor';
import { EmailPreview } from './EmailPreview';
import { DownloadStep } from './DownloadStep';
import { StepIndicator } from './StepIndicator';
import { CheckCircle, Upload, Edit, Eye, Download } from 'lucide-react';

export interface ContactData {
  [key: string]: string | number;
}

export interface EmailData {
  subject: string;
  body: string;
  personalizedSubject: string;
  personalizedBody: string;
  contact: ContactData;
}

const steps = [
  { id: 1, title: 'Upload Contacts', icon: Upload, description: 'Import your CSV or Excel file' },
  { id: 2, title: 'Create Template', icon: Edit, description: 'Design your email template' },
  { id: 3, title: 'Preview Emails', icon: Eye, description: 'Review personalized emails' },
  { id: 4, title: 'Download Results', icon: Download, description: 'Get your personalized emails' },
];

export function OutreachApp() {
  const [currentStep, setCurrentStep] = useState(1);
  const [contacts, setContacts] = useState<ContactData[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [template, setTemplate] = useState({
    subject: '',
    body: ''
  });
  const [personalizedEmails, setPersonalizedEmails] = useState<EmailData[]>([]);

  const handleFileUpload = (uploadedContacts: ContactData[], uploadedHeaders: string[]) => {
    setContacts(uploadedContacts);
    setHeaders(uploadedHeaders);
    setCurrentStep(2);
  };

  const handleTemplateComplete = (templateData: { subject: string; body: string }) => {
    setTemplate(templateData);
    
    // Generate personalized emails
    const emails = contacts.map(contact => {
      let personalizedSubject = templateData.subject;
      let personalizedBody = templateData.body;
      
      // Replace placeholders with actual data
      headers.forEach(header => {
        const value = contact[header] || '';
        const placeholder = `{{${header}}}`;
        personalizedSubject = personalizedSubject.replace(new RegExp(placeholder, 'g'), String(value));
        personalizedBody = personalizedBody.replace(new RegExp(placeholder, 'g'), String(value));
      });
      
      return {
        subject: templateData.subject,
        body: templateData.body,
        personalizedSubject,
        personalizedBody,
        contact
      };
    });
    
    setPersonalizedEmails(emails);
    setCurrentStep(3);
  };

  const handlePreviewComplete = () => {
    setCurrentStep(4);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setContacts([]);
    setHeaders([]);
    setTemplate({ subject: '', body: '' });
    setPersonalizedEmails([]);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0
    },
    exit: { 
      opacity: 0, 
      x: -20
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 relative">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center relative"
          >
            {/* Centered logo and title */}
            <div className="flex items-center space-x-3">
              <img
                src="/logo-outreachai-icon.svg"
                alt="Outreach AI Logo"
                className="w-10 h-10 rounded-lg shadow-soft"
                style={{ background: 'transparent' }}
                draggable={false}
              />
              <h1 className="text-2xl font-bold text-foreground">Outreach AI</h1>
            </div>
            {/* Step indicator absolutely positioned to the right */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              Step {currentStep} of {steps.length}
            </div>
          </motion.div>
        </div>
      </header>

      {/* Step Indicator */}
      <div className="container mx-auto px-6 py-8">
        <StepIndicator steps={steps} currentStep={currentStep} />
      </div>

      {/* Main Content */}
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-6 pb-12"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-w-4xl mx-auto"
          >
            {currentStep === 1 && (
              <FileUpload onUploadComplete={handleFileUpload} />
            )}
            {currentStep === 2 && (
              <TemplateEditor
                headers={headers}
                contacts={contacts}
                onTemplateComplete={handleTemplateComplete}
                onBack={() => setCurrentStep(1)}
              />
            )}
            {currentStep === 3 && (
              <EmailPreview
                emails={personalizedEmails}
                onContinue={handlePreviewComplete}
                onBack={() => setCurrentStep(2)}
              />
            )}
            {currentStep === 4 && (
              <DownloadStep
                emails={personalizedEmails}
                onReset={handleReset}
                onBack={() => setCurrentStep(3)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.main>
    </div>
  );
}