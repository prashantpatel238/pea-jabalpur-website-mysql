
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const PageContentManager = () => {
  const [contents, setContents] = useState([]);
  const [selectedPage, setSelectedPage] = useState('home');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      const data = await pb.collection('page_content').getFullList({
        sort: 'sort_order',
        $autoCancel: false
      });
      setContents(data);
    } catch (error) {
      console.error('Failed to fetch contents:', error);
    } finally {
      setLoading(false);
    }
  };

  const pageContents = contents.filter(c => c.page_name === selectedPage);

  return (
    <>
      <Helmet>
        <title>Page Content Manager - Admin Dashboard</title>
      </Helmet>
      <Header />

      <div className="min-h-screen bg-secondary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Page Content Manager</h1>
            <p className="text-muted-foreground">Edit website content and pages</p>
          </div>

          <div className="mb-6">
            <Label>Select Page</Label>
            <Select value={selectedPage} onValueChange={setSelectedPage}>
              <SelectTrigger className="max-w-xs mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="home">Home Page</SelectItem>
                <SelectItem value="about">About Page</SelectItem>
                <SelectItem value="contact">Contact Page</SelectItem>
                <SelectItem value="important_members">Leadership Page</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-card border border-border rounded-xl p-8">
            <p className="text-muted-foreground">
              Content management for {selectedPage} page will be available here. This feature allows you to edit hero sections, text content, and images for each page.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default PageContentManager;
