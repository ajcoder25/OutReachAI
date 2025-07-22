import React, { useState, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, ArrowLeft, Eye, Sparkles } from 'lucide-react';
import { ContactData } from './OutreachApp';

interface TemplateEditorProps {
  headers: string[];
  contacts: ContactData[];
  onTemplateComplete: (template: { subject: string; body: string }) => void;
  onBack: () => void;
}

export function TemplateEditor({ headers, contacts, onTemplateComplete, onBack }: TemplateEditorProps) {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const subjectRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const sampleContact = contacts[0] || {};

  // Insert placeholder at cursor position for body
  const insertPlaceholder = (field: string) => {
    const placeholder = `{{${field}}}`;
    if (bodyRef.current) {
      const textarea = bodyRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = body.slice(0, start) + placeholder + body.slice(end);
      setBody(newValue);
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = start + placeholder.length;
      }, 0);
    } else {
      setBody(prev => prev + placeholder);
    }
  };

  // Insert placeholder at cursor position for subject
  const insertSubjectPlaceholder = (field: string) => {
    const placeholder = `{{${field}}}`;
    if (subjectRef.current) {
      const input = subjectRef.current;
      const start = input.selectionStart || 0;
      const end = input.selectionEnd || 0;
      const newValue = subject.slice(0, start) + placeholder + subject.slice(end);
      setSubject(newValue);
      setTimeout(() => {
        input.focus();
        input.selectionStart = input.selectionEnd = start + placeholder.length;
      }, 0);
    } else {
      setSubject(prev => prev + placeholder);
    }
  };

  const previewContent = useMemo(() => {
    let previewSubject = subject;
    let previewBody = body;
    
    headers.forEach(header => {
      const value = sampleContact[header] || `[${header}]`;
      const placeholder = `{{${header}}}`;
      previewSubject = previewSubject.replace(new RegExp(placeholder, 'g'), String(value));
      previewBody = previewBody.replace(new RegExp(placeholder, 'g'), String(value));
    });
    
    return { subject: previewSubject, body: previewBody };
  }, [subject, body, headers, sampleContact]);

  const handleContinue = () => {
    if (subject.trim() && body.trim()) {
      onTemplateComplete({ subject: subject.trim(), body: body.trim() });
    }
  };

  const suggestedTemplates = [
    {
      subject: "Partnership Opportunity with {{Company}}",
      body: `Hi {{Name}},\n\nI hope this email finds you well. I came across {{Company}} and was impressed by your work in {{Industry}}.\n\nI'd love to discuss a potential partnership opportunity that could benefit both our organizations.\n\nWould you be available for a brief call this week?\n\nBest regards,\n[Your Name]`
    },
    {
      subject: "Quick question about {{Company}}",
      body: `Hello {{Name}},\n\nI've been following {{Company}}'s progress and I'm curious about your approach to {{Industry}}.\n\nI think there might be some interesting synergies between our companies.\n\nWould you be open to a 15-minute conversation?\n\nThanks,\n[Your Name]`
    }
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Create Your Email Template</h2>
          <p className="text-muted-foreground">
            Design your personalized email using placeholders from your uploaded data
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => setIsPreviewMode(!isPreviewMode)}>
            <Eye className="w-4 h-4 mr-2" />
            {isPreviewMode ? 'Edit' : 'Preview'}
          </Button>
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Template Editor */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-3 space-y-6"
        >
          {!isPreviewMode ? (
            <>
              {/* Subject Line */}
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-primary" />
                    Email Subject
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject Line</Label>
                    <Input
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Enter your email subject..."
                      className="text-base"
                      ref={subjectRef}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Email Body */}
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle>Email Body</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="body">Message Content</Label>
                    <Textarea
                      id="body"
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      placeholder="Write your email message here..."
                      className="min-h-[300px] text-base leading-relaxed"
                      ref={bodyRef}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Suggested Templates */}
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle>Quick Start Templates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {suggestedTemplates.map((template, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="text-left justify-start h-auto p-4"
                        onClick={() => {
                          setSubject(template.subject);
                          setBody(template.body);
                        }}
                      >
                        <div>
                          <div className="font-medium">{template.subject}</div>
                          <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {template.body.substring(0, 100)}...
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            /* Preview Mode */
            <Card className="shadow-large">
              <CardHeader>
                <CardTitle>Email Preview</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Preview with sample data from: {sampleContact.Name || sampleContact.name || 'First Contact'}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Subject:</Label>
                  <div className="p-3 bg-muted rounded-md text-base font-medium">
                    {previewContent.subject || 'No subject entered'}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Body:</Label>
                  <div className="p-4 bg-muted rounded-md text-base leading-relaxed whitespace-pre-wrap">
                    {previewContent.body || 'No message content entered'}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Placeholders Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <Card className="shadow-medium sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg">Available Placeholders</CardTitle>
              <p className="text-sm text-muted-foreground">
                Click to insert into your template
              </p>
            </CardHeader>
            <CardContent className="space-y-2">
              {headers.map((header) => (
                <div key={header} className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 justify-start text-xs"
                    onClick={() => insertPlaceholder(header)}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    {header}
                  </Button>
                </div>
              ))}
              
              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground mb-2">For subject line:</p>
                {headers.slice(0, 3).map((header) => (
                  <Button
                    key={`subject-${header}`}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs mb-1"
                    onClick={() => insertSubjectPlaceholder(header)}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    {header}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-end space-x-4"
      >
        <Button
          variant="premium"
          size="lg"
          onClick={handleContinue}
          disabled={!subject.trim() || !body.trim()}
        >
          Continue to Preview
        </Button>
      </motion.div>
    </div>
  );
}