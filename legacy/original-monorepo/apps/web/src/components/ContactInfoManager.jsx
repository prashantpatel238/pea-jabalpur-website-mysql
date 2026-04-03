
import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { MapPin, Phone, Mail, Building, Loader2 } from 'lucide-react';

const ContactInfoManager = () => {
  const [settings, setSettings] = useState({
    org_name: '',
    address_street: '',
    address_city: '',
    address_state: '',
    address_zip: '',
    contact_phone: '',
    contact_email: '',
    map_lat: '23.1815',
    map_lng: '79.9864'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const records = await pb.collection('settings').getFullList({
        filter: 'setting_key ~ "contact_" || setting_key ~ "address_" || setting_key ~ "map_" || setting_key="org_name"',
        $autoCancel: false
      });

      const newSettings = { ...settings };
      records.forEach(record => {
        if (record.setting_key in newSettings) {
          newSettings[record.setting_key] = record.setting_value;
        }
      });
      setSettings(newSettings);
    } catch (error) {
      console.error('Failed to fetch contact settings:', error);
      toast.error('Failed to load contact settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Fetch existing to know whether to update or create
      const existingRecords = await pb.collection('settings').getFullList({
        filter: 'setting_key ~ "contact_" || setting_key ~ "address_" || setting_key ~ "map_" || setting_key="org_name"',
        $autoCancel: false
      });

      const existingMap = {};
      existingRecords.forEach(r => { existingMap[r.setting_key] = r.id; });

      const promises = Object.entries(settings).map(([key, value]) => {
        if (existingMap[key]) {
          return pb.collection('settings').update(existingMap[key], { setting_value: value }, { $autoCancel: false });
        } else {
          return pb.collection('settings').create({ setting_key: key, setting_value: value }, { $autoCancel: false });
        }
      });

      await Promise.all(promises);
      toast.success('Contact information updated successfully');
    } catch (error) {
      console.error('Failed to update contact info:', error);
      toast.error('Failed to update contact information');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-2xl p-8 flex items-center justify-center min-h-[200px] shadow-soft">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-soft transition-all duration-300 hover:shadow-hover">
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
          <MapPin className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Contact & Location Info</h2>
          <p className="text-sm text-muted-foreground">Manage organization address, contact details, and map location</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Details */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center border-b pb-2">
              <Building className="w-5 h-5 mr-2 text-muted-foreground" /> General Details
            </h3>
            
            <div className="space-y-2">
              <Label>Organization Name</Label>
              <Input 
                value={settings.org_name} 
                onChange={(e) => handleChange('org_name', e.target.value)} 
                placeholder="e.g. Professional Engineers Association"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Contact Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  type="email"
                  value={settings.contact_email} 
                  onChange={(e) => handleChange('contact_email', e.target.value)} 
                  className="pl-10"
                  placeholder="info@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Contact Phone (Include Country Code)</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  value={settings.contact_phone} 
                  onChange={(e) => handleChange('contact_phone', e.target.value)} 
                  className="pl-10"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
          </div>

          {/* Address Details */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center border-b pb-2">
              <MapPin className="w-5 h-5 mr-2 text-muted-foreground" /> Address
            </h3>
            
            <div className="space-y-2">
              <Label>Street Address</Label>
              <Input 
                value={settings.address_street} 
                onChange={(e) => handleChange('address_street', e.target.value)} 
                placeholder="123 Main Street"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>City</Label>
                <Input 
                  value={settings.address_city} 
                  onChange={(e) => handleChange('address_city', e.target.value)} 
                  placeholder="Jabalpur"
                />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Input 
                  value={settings.address_state} 
                  onChange={(e) => handleChange('address_state', e.target.value)} 
                  placeholder="Madhya Pradesh"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Postal Code</Label>
              <Input 
                value={settings.address_zip} 
                onChange={(e) => handleChange('address_zip', e.target.value)} 
                placeholder="482001"
              />
            </div>
          </div>
        </div>

        {/* Map Coordinates */}
        <div className="space-y-6 pt-6 border-t border-border">
          <h3 className="text-lg font-semibold">Google Maps Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Latitude</Label>
                  <Input 
                    value={settings.map_lat} 
                    onChange={(e) => handleChange('map_lat', e.target.value)} 
                    placeholder="23.1815"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Longitude</Label>
                  <Input 
                    value={settings.map_lng} 
                    onChange={(e) => handleChange('map_lng', e.target.value)} 
                    placeholder="79.9864"
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Find coordinates by right-clicking a location on Google Maps and copying the numbers.
              </p>
            </div>
            
            <div className="h-[200px] rounded-xl overflow-hidden border border-border shadow-inner bg-muted">
              {settings.map_lat && settings.map_lng ? (
                <iframe
                  title="Map Preview"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0 }}
                  src={`https://maps.google.com/maps?q=${settings.map_lat},${settings.map_lng}&z=15&output=embed`}
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  Enter coordinates to see preview
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-border">
          <Button type="submit" disabled={saving} className="min-w-[150px]">
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Contact Info'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ContactInfoManager;
