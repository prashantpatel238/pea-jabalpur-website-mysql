
import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const ProfilePhotoUpload = ({ currentPhotoUrl, onPhotoSelect, disabled }) => {
  const [previewUrl, setPreviewUrl] = useState(currentPhotoUrl || null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (currentPhotoUrl && !previewUrl) {
      setPreviewUrl(currentPhotoUrl);
    }
  }, [currentPhotoUrl]);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateAndProcessFile = (file) => {
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload a JPG, PNG, GIF, or WEBP image.');
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('File is too large. Maximum size is 5MB.');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    onPhotoSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const file = e.dataTransfer.files?.[0];
    validateAndProcessFile(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    validateAndProcessFile(file);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setPreviewUrl(null);
    onPhotoSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div
        className={`relative w-40 h-40 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden transition-all duration-200 ${
          disabled ? 'opacity-50 cursor-not-allowed border-border' :
          isDragging ? 'border-primary bg-primary/5 scale-105' : 'border-border hover:border-primary/50 hover:bg-accent/50 cursor-pointer'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        {previewUrl ? (
          <>
            <img src={previewUrl} alt="Profile preview" className="w-full h-full object-cover" />
            {!disabled && (
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                <p className="text-white text-sm font-medium">Change Photo</p>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center text-muted-foreground p-4 text-center">
            <UploadCloud className="w-8 h-8 mb-2 opacity-50" />
            <span className="text-xs font-medium">Upload Photo</span>
          </div>
        )}
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg, image/png, image/gif, image/webp"
          className="hidden"
          disabled={disabled}
        />
      </div>

      {previewUrl && !disabled && (
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={handleRemove}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <X className="w-4 h-4 mr-2" />
          Remove Photo
        </Button>
      )}
      <p className="text-xs text-muted-foreground text-center max-w-[200px]">
        Recommended: Square image, max 5MB.
      </p>
    </div>
  );
};

export default ProfilePhotoUpload;
