import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, CheckCircle, ArrowLeft, RefreshCw, FileText } from 'lucide-react';
import { EmailData } from './OutreachApp';
import { useToast } from '@/hooks/use-toast';

interface DownloadStepProps {
  emails: EmailData[];
  onReset: () => void;
  onBack: () => void;
}

export function DownloadStep({ emails, onReset, onBack }: DownloadStepProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const { toast } = useToast();

  const generateCSV = () => {
    // Create CSV headers
    const contactKeys = Object.keys(emails[0]?.contact || {});
    const headers = [
      ...contactKeys,
      'Original Subject',
      'Original Body',
      'Personalized Subject',
      'Personalized Body'
    ];

    // Create CSV rows
    const rows = emails.map(email => {
      const contactValues = contactKeys.map(key => {
        const value = email.contact[key];
        // Escape quotes and wrap in quotes if contains comma or quote
        const stringValue = String(value || '');
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      });

      const emailValues = [
        email.subject.replace(/"/g, '""'),
        email.body.replace(/"/g, '""'),
        email.personalizedSubject.replace(/"/g, '""'),
        email.personalizedBody.replace(/"/g, '""')
      ].map(value => `"${value}"`);

      return [...contactValues, ...emailValues].join(',');
    });

    // Combine headers and rows
    const csv = [headers.join(','), ...rows].join('\n');
    return csv;
  };

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      // Simulate processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));

      const csv = generateCSV();
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `personalized-emails-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }

      setDownloadComplete(true);
      toast({
        title: "Download Complete!",
        description: "Your personalized emails have been downloaded successfully.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "There was an error generating your CSV file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-foreground mb-3">Download Your Emails</h2>
        <p className="text-muted-foreground text-lg">
          Your personalized emails are ready! Download them as a CSV file to use in your email campaigns.
        </p>
      </motion.div>

      {/* Success Stats */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="shadow-large gradient-card">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <CardTitle className="text-2xl">All Emails Generated Successfully!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-primary">{emails.length}</div>
                <div className="text-sm text-muted-foreground">Total Emails</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent">100%</div>
                <div className="text-sm text-muted-foreground">Personalized</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-success">✓</div>
                <div className="text-sm text-muted-foreground">Ready</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium text-foreground mb-2">What's included in your CSV:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">✓</Badge>
                    <span>All contact information</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">✓</Badge>
                    <span>Original templates</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">✓</Badge>
                    <span>Personalized subjects</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">✓</Badge>
                    <span>Personalized email bodies</span>
                  </div>
                </div>
              </div>

              {!downloadComplete ? (
                <Button
                  variant="premium"
                  size="xl"
                  className="w-full"
                  onClick={handleDownload}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Generating CSV...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5 mr-2" />
                      Download CSV File
                    </>
                  )}
                </Button>
              ) : (
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  className="text-center space-y-3"
                >
                  <div className="flex items-center justify-center space-x-2 text-success">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Download completed successfully!</span>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleDownload}
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Again
                  </Button>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-center space-x-4"
      >
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Preview
        </Button>
        <Button variant="outline" onClick={onReset}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Start New Batch
        </Button>
      </motion.div>
    </div>
  );
}