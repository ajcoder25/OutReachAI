import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import * as XLSX from 'xlsx';
import { ContactData } from './OutreachApp';

interface FileUploadProps {
  onUploadComplete: (contacts: ContactData[], headers: string[]) => void;
}

export function FileUpload({ onUploadComplete }: FileUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<{ headers: string[]; rowCount: number } | null>(null);

  const processFile = useCallback(async (file: File) => {
    setIsProcessing(true);
    setError(null);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

      if (jsonData.length < 2) {
        throw new Error('File must contain at least a header row and one data row');
      }

      const headers = jsonData[0].map(header => String(header).trim()).filter(Boolean);
      const rows = jsonData.slice(1).filter(row => row.some(cell => cell !== undefined && cell !== ''));

      if (headers.length === 0) {
        throw new Error('No valid headers found in the file');
      }

      const contacts: ContactData[] = rows.map(row => {
        const contact: ContactData = {};
        headers.forEach((header, index) => {
          contact[header] = row[index] !== undefined ? String(row[index]).trim() : '';
        });
        return contact;
      });

      setPreviewData({ headers, rowCount: contacts.length });
      setUploadedFile(file);
      
      // Auto-proceed after successful upload
      setTimeout(() => {
        onUploadComplete(contacts, headers);
      }, 1000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file');
    } finally {
      setIsProcessing(false);
    }
  }, [onUploadComplete]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file && (file.name.endsWith('.csv') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
      processFile(file);
    } else {
      setError('Please upload a CSV or Excel file');
    }
  }, [processFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-foreground mb-3">Upload Your Contacts</h2>
        <p className="text-muted-foreground text-lg">
          Upload a CSV or Excel file with your contact information to get started
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="max-w-2xl mx-auto shadow-large border-0 gradient-card">
          <CardContent className="p-8">
            {!uploadedFile ? (
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 cursor-pointer",
                  isDragActive ? "border-primary bg-primary/5 scale-105" : "border-border hover:border-primary/50 hover:bg-muted/30"
                )}
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
                onDragLeave={() => setIsDragActive(false)}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <motion.div
                  animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Upload className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {isDragActive ? 'Drop your file here' : 'Upload your contact file'}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Drag and drop your CSV or Excel file, or click to browse
                  </p>
                  <Button variant="premium" size="lg" disabled={isProcessing}>
                    {isProcessing ? 'Processing...' : 'Choose File'}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-4">
                    Supports .csv, .xlsx, and .xls files up to 10MB
                  </p>
                </motion.div>
                
                <input
                  id="file-input"
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileInput}
                  className="hidden"
                  disabled={isProcessing}
                />
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-success/10 rounded-full mx-auto">
                  <CheckCircle className="w-8 h-8 text-success" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">File Uploaded Successfully!</h3>
                  <div className="bg-muted rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-center space-x-2">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">{uploadedFile.name}</span>
                      <span className="text-sm text-muted-foreground">({formatFileSize(uploadedFile.size)})</span>
                    </div>
                    {previewData && (
                      <div className="text-sm text-muted-foreground">
                        <p><strong>{previewData.headers.length}</strong> columns • <strong>{previewData.rowCount}</strong> contacts</p>
                        <p className="mt-1">Columns: {previewData.headers.join(', ')}</p>
                      </div>
                    )}
                  </div>
                  <p className="text-muted-foreground mt-4">
                    Proceeding to template editor...
                  </p>
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center space-x-2"
              >
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                <span className="text-destructive text-sm">{error}</span>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}