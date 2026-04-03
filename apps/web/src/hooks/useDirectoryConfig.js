
import { useState, useEffect, useCallback } from 'react';
import pb from '@/lib/pocketbaseClient';

const defaultConfig = {
  show_profile_photo: true,
  show_email: true,
  show_phone: true,
  show_date_of_birth: false,
  show_address: false,
  show_profession_designation: true,
  custom_fields_visible: []
};

export function useDirectoryConfig() {
  const [config, setConfig] = useState(defaultConfig);
  const [configId, setConfigId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchConfig = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const record = await pb.collection('directory_config').getFirstListItem('1=1', {
        $autoCancel: false
      });
      setConfig(record);
      setConfigId(record.id);
    } catch (err) {
      if (err.status === 404) {
        // No config exists yet, use default
        setConfig(defaultConfig);
      } else {
        console.error('Error fetching directory config:', err);
        setError(err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  return { config, configId, loading, error, refetch: fetchConfig };
}
