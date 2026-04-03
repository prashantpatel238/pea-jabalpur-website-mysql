
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CustomFieldForm = ({ initialData, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    label: '',
    field_type: 'text',
    required: false,
    member_editable: true,
    display_order: 0,
    visible_in_directory: true,
    private: false,
    dropdown_options: '',
    help_text: '',
    placeholder_text: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        label: initialData.label || '',
        field_type: initialData.field_type || 'text',
        required: initialData.required || false,
        member_editable: initialData.member_editable ?? true,
        display_order: initialData.display_order || 0,
        visible_in_directory: initialData.visible_in_directory ?? true,
        private: initialData.private || false,
        dropdown_options: initialData.dropdown_options || '',
        help_text: initialData.help_text || '',
        placeholder_text: initialData.placeholder_text || ''
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.label.trim()) newErrors.label = 'Label is required';
    if (!formData.field_type) newErrors.field_type = 'Field type is required';
    
    if (['dropdown', 'radio', 'checkbox'].includes(formData.field_type) && !formData.dropdown_options.trim()) {
      newErrors.dropdown_options = 'Options are required for this field type (comma separated)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const needsOptions = ['dropdown', 'radio', 'checkbox'].includes(formData.field_type);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="label">Field Label <span className="text-destructive">*</span></Label>
          <Input
            id="label"
            value={formData.label}
            onChange={(e) => handleChange('label', e.target.value)}
            placeholder="e.g., LinkedIn Profile"
            className={errors.label ? 'border-destructive' : ''}
          />
          {errors.label && <p className="text-sm text-destructive">{errors.label}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="field_type">Field Type <span className="text-destructive">*</span></Label>
          <Select value={formData.field_type} onValueChange={(val) => handleChange('field_type', val)}>
            <SelectTrigger id="field_type" className={errors.field_type ? 'border-destructive' : ''}>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text (Single Line)</SelectItem>
              <SelectItem value="textarea">Textarea (Multi Line)</SelectItem>
              <SelectItem value="number">Number</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="phone">Phone</SelectItem>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="dropdown">Dropdown (Select)</SelectItem>
              <SelectItem value="checkbox">Checkbox (Multiple Choice)</SelectItem>
              <SelectItem value="radio">Radio (Single Choice)</SelectItem>
              <SelectItem value="image_upload">Image URL</SelectItem>
              <SelectItem value="file_upload">File URL</SelectItem>
            </SelectContent>
          </Select>
          {errors.field_type && <p className="text-sm text-destructive">{errors.field_type}</p>}
        </div>

        {needsOptions && (
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="dropdown_options">Options (Comma separated) <span className="text-destructive">*</span></Label>
            <Textarea
              id="dropdown_options"
              value={formData.dropdown_options}
              onChange={(e) => handleChange('dropdown_options', e.target.value)}
              placeholder="Option 1, Option 2, Option 3"
              className={errors.dropdown_options ? 'border-destructive' : ''}
            />
            {errors.dropdown_options && <p className="text-sm text-destructive">{errors.dropdown_options}</p>}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="placeholder_text">Placeholder Text</Label>
          <Input
            id="placeholder_text"
            value={formData.placeholder_text}
            onChange={(e) => handleChange('placeholder_text', e.target.value)}
            placeholder="e.g., Enter your profile URL"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="display_order">Display Order</Label>
          <Input
            id="display_order"
            type="number"
            value={formData.display_order}
            onChange={(e) => handleChange('display_order', parseInt(e.target.value) || 0)}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="help_text">Help Text (Optional)</Label>
          <Textarea
            id="help_text"
            value={formData.help_text}
            onChange={(e) => handleChange('help_text', e.target.value)}
            placeholder="Instructions for the member filling out this field"
            className="h-20"
          />
        </div>

        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-xl border border-border">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.required}
              onChange={(e) => handleChange('required', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Required Field</p>
              <p className="text-xs text-muted-foreground">Member must fill this out</p>
            </div>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.member_editable}
              onChange={(e) => handleChange('member_editable', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Member Editable</p>
              <p className="text-xs text-muted-foreground">Members can edit this themselves</p>
            </div>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.visible_in_directory}
              onChange={(e) => handleChange('visible_in_directory', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Visible in Directory</p>
              <p className="text-xs text-muted-foreground">Show on public member cards</p>
            </div>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.private}
              onChange={(e) => handleChange('private', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Private Field</p>
              <p className="text-xs text-muted-foreground">Only visible to admins and the member</p>
            </div>
          </label>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-border">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Field'}
        </Button>
      </div>
    </form>
  );
};

export default CustomFieldForm;
