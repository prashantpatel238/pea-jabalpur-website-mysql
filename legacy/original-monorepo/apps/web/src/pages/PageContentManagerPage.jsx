
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Save, Image as ImageIcon } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import LoadingSpinner from '@/components/LoadingSpinner.jsx';

const PageContentManagerPage = () => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  // Local state for form fields
  const [formData, setFormData] = useState({
    home: { page_title: '', hero_title: '', hero_subtitle: '', section_content: '' },
    about: { page_title: '', hero_title: '', hero_subtitle: '', section_content: '' },
    leadership: { page_title: '', hero_title: '', hero_subtitle: '', section_content: '' },
    contact: { page_title: '', hero_title: '', hero_subtitle: '', section_content: '' }
  });

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    setLoading(true);
    try {
      const data = await pb.collection('page_content').getFullList({
        $autoCancel: false
      });
      setContents(data);
      
      // Map fetched data to formData state
      const newFormData = { ...formData };
      data.forEach(item => {
        if (newFormData[item.page_name]) {
          newFormData[item.page_name][item.field_name] = item.field_value;
        }
      });
      setFormData(newFormData);
    } catch (error) {
      console.error('Failed to fetch contents:', error);
      toast.error('Failed to load page content');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (page, field, value) => {
    setFormData(prev => ({
      ...prev,
      [page]: {
        ...prev[page],
        [field]: value
      }
    }));
  };

  const handleSave = async (page) => {
    setSaving(true);
    try {
      const pageData = formData[page];
      const promises = [];

      for (const [field_name, field_value] of Object.entries(pageData)) {
        // Find existing record
        const existingRecord = contents.find(c => c.page_name === page && c.field_name === field_name);
        
        if (existingRecord) {
          promises.push(pb.collection('page_content').update(existingRecord.id, { field_value }, { $autoCancel: false }));
        } else {
          promises.push(pb.collection('page_content').create({
            page_name: page,
            section_name: 'main',
            field_name,
            field_value
          }, { $autoCancel: false }));
        }
      }

      await Promise.all(promises);
      toast.success(`${page.charAt(0).toUpperCase() + page.slice(1)} page content saved successfully`);
      fetchContents(); // Refresh to get new IDs
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  const renderPageEditor = (page) => (
    <div className="space-y-6 bg-card p-6 rounded-xl border border-border shadow-sm mt-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`${page}-page_title`}>SEO Page Title</Label>
          <Input 
            id={`${page}-page_title`} 
            value={formData[page].page_title || ''} 
            onChange={(e) => handleInputChange(page, 'page_title', e.target.value)}
            placeholder="e.g., Home - Professional Engineers Association"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`${page}-hero_title`}>Hero Title (H1)</Label>
          <Input 
            id={`${page}-hero_title`} 
            value={formData[page].hero_title || ''} 
            onChange={(e) => handleInputChange(page, 'hero_title', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${page}-hero_subtitle`}>Hero Subtitle</Label>
          <Textarea 
            id={`${page}-hero_subtitle`} 
            value={formData[page].hero_subtitle || ''} 
            onChange={(e) => handleInputChange(page, 'hero_subtitle', e.target.value)}
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${page}-section_content`}>Main Content (Rich Text / HTML)</Label>
          <Textarea 
            id={`${page}-section_content`} 
            value={formData[page].section_content || ''} 
            onChange={(e) => handleInputChange(page, 'section_content', e.target.value)}
            rows={10}
            className="font-mono text-sm"
            placeholder="<p>Enter your content here...</p>"
          />
          <p className="text-xs text-muted-foreground">You can use basic HTML tags for formatting.</p>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-border">
        <Button onClick={() => handleSave(page)} disabled={saving}>
          {saving ? <LoadingSpinner className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Save {page.charAt(0).toUpperCase() + page.slice(1)} Content
        </Button>
      </div>
    </div>
  );

  if (loading && contents.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Page Content Manager - Admin</title>
      </Helmet>
      <Header />

      <main className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Page Content Manager</h1>
          <p className="text-muted-foreground mt-1">Edit text and SEO metadata for public pages.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="leadership">Leadership</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>
          
          <TabsContent value="home">{renderPageEditor('home')}</TabsContent>
          <TabsContent value="about">{renderPageEditor('about')}</TabsContent>
          <TabsContent value="leadership">{renderPageEditor('leadership')}</TabsContent>
          <TabsContent value="contact">{renderPageEditor('contact')}</TabsContent>
        </Tabs>
      </main>

      <Footer />
    </>
  );
};

export default PageContentManagerPage;
