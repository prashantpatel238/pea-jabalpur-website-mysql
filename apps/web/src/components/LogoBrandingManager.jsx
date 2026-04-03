
import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Image as ImageIcon, Upload, Loader2, Type } from 'lucide-react';

const LogoBrandingManager = () => {
  const [logoRecord, setLogoRecord] = useState(null);
  const [titleRecord, setTitleRecord] = useState(null);
  
  const [currentLogoUrl, setCurrentLogoUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const [orgTitle, setOrgTitle] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const records = await pb.collection('settings').getFullList({
        filter: 'setting_key="logo" || setting_key="organization_title"',
        $autoCancel: false
      });

      const logoRec = records.find(r => r.setting_key === 'logo');
      if (logoRec) {
        setLogoRecord(logoRec);
        if (logoRec.logo_image) {
          setCurrentLogoUrl(pb.files.getUrl(logoRec, logoRec.logo_image));
        }
      }

      const titleRec = records.find(r => r.setting_key === 'organization_title');
      if (titleRec) {
        setTitleRecord(titleRec);
        setOrgTitle(titleRec.setting_value || '');
      } else {
        setOrgTitle('Professional Engineers Association Jabalpur');
      }
    } catch (error) {
      console.error('Failed to fetch branding settings:', error);
      toast.error('Failed to load branding settings');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // 1. Save Logo
      if (selectedFile) {
        const formData = new FormData();
        formData.append('logo_image', selectedFile);

        if (logoRecord) {
          await pb.collection('settings').update(logoRecord.id, formData, { $autoCancel: false });
        } else {
          formData.append('setting_key', 'logo');
          await pb.collection('settings').create(formData, { $autoCancel: false });
        }
      }

      // 2. Save Title
      if (titleRecord) {
        await pb.collection('settings').update(titleRecord.id, {
          setting_value: orgTitle
        }, { $autoCancel: false });
      } else {
        await pb.collection('settings').create({
          setting_key: 'organization_title',
          setting_value: orgTitle
        }, { $autoCancel: false });
      }

      toast.success('Branding updated successfully');
      
      // Force a reload of the page to update the header/footer
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Failed to update branding:', error);
      toast.error('Failed to update branding');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 flex items-center justify-center min-h-[200px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <ImageIcon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Logo & Branding</h2>
          <p className="text-sm text-muted-foreground">Manage the main website logo and organization title</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <Label className="flex items-center space-x-2 text-base">
            <Type className="w-4 h-4" />
            <span>Organization Title</span>
          </Label>
          <Input 
            value={orgTitle}
            onChange={(e) => setOrgTitle(e.target.value)}
            placeholder="e.g. Professional Engineers Association Jabalpur"
            className="max-w-xl"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Label className="mb-3 block">Current Logo</Label>
            <div className="border-2 border-dashed border-border rounded-xl p-6 flex items-center justify-center bg-secondary/50 min-h-[160px]">
              {currentLogoUrl ? (
                <img
                  src={currentLogoUrl}
                  alt="Current Logo"
                  className="max-h-[80px] w-auto object-contain"
                />
              ) : (
                <div className="text-center text-muted-foreground">
                  <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No logo uploaded</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <Label className="mb-3 block">Upload New Logo</Label>
            <div className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center bg-secondary/50 min-h-[160px] relative hover:bg-secondary/80 transition-colors">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-[80px] w-auto object-contain mb-4"
                />
              ) : (
                <Upload className="w-8 h-8 text-muted-foreground mb-2" />
              )}
              <p className="text-sm text-muted-foreground text-center mb-2">
                {selectedFile ? selectedFile.name : 'Click or drag image here'}
              </p>
              <p className="text-xs text-muted-foreground/70 text-center">
                SVG, PNG, JPG or GIF (max. 20MB)
              </p>
              <input
                type="file"
                accept="image/jpeg,image/png,image/svg+xml,image/gif,image/webp"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="bg-secondary/50 rounded-xl p-6 border border-border">
          <Label className="mb-4 block text-muted-foreground">Live Preview (Header Style)</Label>
          <div className="flex items-center space-x-[var(--title-spacing)] bg-background p-4 rounded-lg border border-border shadow-sm">
            {previewUrl || currentLogoUrl ? (
              <img
                src={previewUrl || currentLogoUrl}
                alt="Logo Preview"
                style={{ height: 'var(--logo-height)', width: 'auto' }}
                className="object-contain"
              />
            ) : (
              <div className="h-[var(--logo-height)] flex items-center justify-center px-4 bg-primary/10 rounded-lg border border-primary/20">
                <span className="font-bold text-xl text-primary">Logo</span>
              </div>
            )}
            <h1 className="font-bold text-lg leading-tight text-foreground">
              {orgTitle || 'Organization Title'}
            </h1>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Branding'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LogoBrandingManager;
