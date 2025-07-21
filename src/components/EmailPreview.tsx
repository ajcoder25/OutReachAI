import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Mail, Users } from 'lucide-react';
import { EmailData } from './OutreachApp';

interface EmailPreviewProps {
  emails: EmailData[];
  onContinue: () => void;
  onBack: () => void;
}

export function EmailPreview({ emails, onContinue, onBack }: EmailPreviewProps) {
  const [currentEmailIndex, setCurrentEmailIndex] = useState(0);
  
  const previewEmails = emails.slice(0, 5);
  const currentEmail = previewEmails[currentEmailIndex];

  const nextEmail = () => {
    setCurrentEmailIndex((prev) => (prev + 1) % previewEmails.length);
  };

  const previousEmail = () => {
    setCurrentEmailIndex((prev) => (prev - 1 + previewEmails.length) % previewEmails.length);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Preview Your Emails</h2>
          <p className="text-muted-foreground">
            Review how your personalized emails will look for different contacts
          </p>
        </div>
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Editor
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card className="shadow-soft">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{emails.length}</div>
              <div className="text-sm text-muted-foreground">Total Emails</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-accent" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{previewEmails.length}</div>
              <div className="text-sm text-muted-foreground">Previewing</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <div className="text-lg font-bold text-success">✓</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">100%</div>
              <div className="text-sm text-muted-foreground">Personalized</div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Email Preview */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="shadow-large">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CardTitle>Email Preview</CardTitle>
                <Badge variant="secondary">
                  {currentEmailIndex + 1} of {previewEmails.length}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={previousEmail}
                  disabled={previewEmails.length <= 1}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextEmail}
                  disabled={previewEmails.length <= 1}
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <motion.div
              key={currentEmailIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="p-6"
            >
              {/* Email Header */}
              <div className="border-b pb-4 mb-6">
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                  <span>To: {currentEmail.contact.Email || currentEmail.contact.email || 'No email found'}</span>
                  <span>From: your-email@company.com</span>
                </div>
                <div className="text-lg font-semibold text-foreground">
                  {currentEmail.personalizedSubject}
                </div>
              </div>

              {/* Email Body */}
              <div className="space-y-4">
                <div className="prose prose-gray max-w-none">
                  <div className="whitespace-pre-wrap text-base leading-relaxed text-foreground">
                    {currentEmail.personalizedBody}
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="mt-6 pt-4 border-t bg-muted/30 rounded-lg p-4">
                <h4 className="font-medium text-foreground mb-3">Contact Information:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {Object.entries(currentEmail.contact).slice(0, 6).map(([key, value]) => (
                    <div key={key}>
                      <span className="font-medium text-muted-foreground">{key}:</span>
                      <div className="text-foreground truncate">{String(value)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Navigation */}
      {previewEmails.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center"
        >
          <div className="flex space-x-2">
            {previewEmails.map((_, index) => (
              <Button
                key={index}
                variant={index === currentEmailIndex ? "default" : "outline"}
                size="sm"
                className="w-10 h-10 p-0"
                onClick={() => setCurrentEmailIndex(index)}
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-end"
      >
        <Button variant="premium" size="lg" onClick={onContinue}>
          Generate All Emails
        </Button>
      </motion.div>
    </div>
  );
}