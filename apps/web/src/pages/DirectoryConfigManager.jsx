
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Settings, Eye, Save, LayoutTemplate } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner.jsx';
import MemberCard from '@/components/MemberCard.jsx';

const DirectoryConfigManager = () => {
  const [config, setConfig] = useState(null);
  const [customFields, setCustomFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch custom fields
        const fields = await pb.collection('custom_fields').getFullList({
          sort: 'display_order',
          $autoCancel: false
        });
        setCustomFields(fields);

        // Fetch config
        try {
          const record = await pb.collection('directory_config').getFirstListItem('1=1', {
            $autoCancel: false
          });
          setConfig(record);
        } catch (err) {
          if (err.status === 404) {
            // Create default if not exists
            const defaultRecord = await pb.collection('directory_config').create({
              show_profile_photo: true,
              show_email: true,
              show_phone: true,
              show_date_of_birth: false,
              show_address: false,
              show_profession_designation: true,
              custom_fields_visible: []
            }, { $autoCancel: false });
            setConfig(defaultRecord);
          } else {
            throw err;
          }
        }
      } catch (error) {
        console.error('Error fetching directory config:', error);
        toast.error('Failed to load configuration');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleToggle = (field) => {
    setConfig(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleCustomFieldToggle = (fieldId, checked) => {
    setConfig(prev => {
      const current = prev.custom_fields_visible || [];
      let updated;
      if (checked) {
        updated = [...current, fieldId];
      } else {
        updated = current.filter(id => id !== fieldId);
      }
      return { ...prev, custom_fields_visible: updated };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await pb.collection('directory_config').update(config.id, {
        show_profile_photo: config.show_profile_photo,
        show_email: config.show_email,
        show_phone: config.show_phone,
        show_date_of_birth: config.show_date_of_birth,
        show_address: config.show_address,
        show_profession_designation: config.show_profession_designation,
        custom_fields_visible: config.custom_fields_visible
      }, { $autoCancel: false });
      toast.success('Directory configuration saved successfully');
    } catch (error) {
      console.error('Error saving config:', error);
      toast.error('Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  // Dummy member for preview
  const dummyMember = {
    id: 'dummy',
    full_name: 'Jane Doe',
    member_category: 'Core Committee Member',
    profession_designation: 'Senior Structural Engineer',
    email: 'jane.doe@example.com',
    mobile_number: '+1 (555) 123-4567',
    date_of_birth: '1985-08-15T00:00:00.000Z',
    address: '123 Engineering Blvd, Tech District, City, State 12345',
    profile_photo: null, // Will show initials
    customValues: customFields.reduce((acc, field) => {
      acc[field.id] = `Sample ${field.label}`;
      return acc;
    }, {})
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-secondary/30">
          <LoadingSpinner />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Directory Configuration - Admin</title>
      </Helmet>
      <Header />

      <main className="min-h-screen bg-secondary/30 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center">
                <LayoutTemplate className="w-8 h-8 mr-3 text-primary" />
                Directory Configuration
              </h1>
              <p className="text-muted-foreground mt-1">Control which fields are visible on member cards in the public directory.</p>
            </div>
            <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
              {saving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Settings Panel */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Basic Fields */}
              <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border bg-muted/30">
                  <h2 className="text-lg font-semibold text-card-foreground flex items-center">
                    <Settings className="w-5 h-5 mr-2 text-primary" />
                    Basic Fields Visibility
                  </h2>
                </div>
                <div className="p-6 space-y-6">
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Profile Photo</Label>
                      <p className="text-sm text-muted-foreground">Show member avatars or initials</p>
                    </div>
                    <Switch 
                      checked={config.show_profile_photo} 
                      onCheckedChange={() => handleToggle('show_profile_photo')} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Profession / Designation</Label>
                      <p className="text-sm text-muted-foreground">Show job title below name</p>
                    </div>
                    <Switch 
                      checked={config.show_profession_designation} 
                      onCheckedChange={() => handleToggle('show_profession_designation')} 
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Email Address</Label>
                      <p className="text-sm text-muted-foreground">Show contact email</p>
                    </div>
                    <Switch 
                      checked={config.show_email} 
                      onCheckedChange={() => handleToggle('show_email')} 
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Phone Number</Label>
                      <p className="text-sm text-muted-foreground">Show mobile or landline number</p>
                    </div>
                    <Switch 
                      checked={config.show_phone} 
                      onCheckedChange={() => handleToggle('show_phone')} 
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Date of Birth</Label>
                      <p className="text-sm text-muted-foreground">Show birth date (usually kept private)</p>
                    </div>
                    <Switch 
                      checked={config.show_date_of_birth} 
                      onCheckedChange={() => handleToggle('show_date_of_birth')} 
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Residential Address</Label>
                      <p className="text-sm text-muted-foreground">Show full address</p>
                    </div>
                    <Switch 
                      checked={config.show_address} 
                      onCheckedChange={() => handleToggle('show_address')} 
                    />
                  </div>

                </div>
              </div>

              {/* Custom Fields */}
              <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border bg-muted/30">
                  <h2 className="text-lg font-semibold text-card-foreground flex items-center">
                    <Settings className="w-5 h-5 mr-2 text-primary" />
                    Custom Fields Visibility
                  </h2>
                </div>
                <div className="p-6">
                  {customFields.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No custom fields have been created yet.</p>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground mb-4">Select which custom fields should appear on the directory cards.</p>
                      {customFields.map(field => (
                        <div key={field.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <Checkbox 
                            id={`cf_${field.id}`} 
                            checked={(config.custom_fields_visible || []).includes(field.id)}
                            onCheckedChange={(checked) => handleCustomFieldToggle(field.id, checked)}
                            className="mt-1"
                          />
                          <div className="space-y-1 leading-none">
                            <label 
                              htmlFor={`cf_${field.id}`}
                              className="text-sm font-medium cursor-pointer"
                            >
                              {field.label}
                            </label>
                            <p className="text-xs text-muted-foreground">
                              Type: {field.field_type.replace('_', ' ')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Live Preview Panel */}
            <div className="lg:col-span-5">
              <div className="sticky top-24 space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center">
                  <Eye className="w-5 h-5 mr-2 text-primary" />
                  Live Preview
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  This is how member cards will appear in the directory based on your current settings.
                </p>
                
                {/* Wrapper to constrain width to typical grid column size */}
                <div className="max-w-sm mx-auto lg:mx-0">
                  <MemberCard 
                    member={dummyMember} 
                    config={config} 
                    customFields={customFields} 
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default DirectoryConfigManager;
