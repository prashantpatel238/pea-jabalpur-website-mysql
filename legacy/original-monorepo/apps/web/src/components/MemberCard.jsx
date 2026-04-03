
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import pb from '@/lib/pocketbaseClient';

const MemberCard = ({ member, config, customFields = [] }) => {
  const getAvatarUrl = () => {
    if (member.profile_photo) {
      return pb.files.getUrl(member, member.profile_photo);
    }
    return null;
  };

  const avatarUrl = getAvatarUrl();
  const initials = member.name
    ? member.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'U';

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCustomValue = (value, type) => {
    if (!value) return '';
    if (type === 'checkbox') {
      try {
        const arr = JSON.parse(value);
        return Array.isArray(arr) ? arr.join(', ') : value;
      } catch (e) {
        return value;
      }
    }
    if (type === 'image_upload' || type === 'file_upload') {
      return 'View Attachment';
    }
    if (type === 'date') {
      return formatDate(value);
    }
    return value;
  };

  const visibleCustomFields = customFields.filter(cf => 
    config.custom_fields_visible?.includes(cf.id)
  );

  return (
    <Link 
      to={`/profile/${member.id}`}
      className="group flex flex-col bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-300 h-full"
    >
      <div className="flex items-start gap-4 mb-5">
        {config.show_profile_photo && (
          <Avatar className="w-16 h-16 border border-border shadow-sm rounded-xl">
            <AvatarImage src={avatarUrl} alt={member.name} className="object-cover" />
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl rounded-xl">
              {initials}
            </AvatarFallback>
          </Avatar>
        )}
        <div className="flex-1 min-w-0 pt-1">
          <h3 className="font-semibold text-lg text-card-foreground truncate group-hover:text-primary transition-colors">
            {member.name}
          </h3>
          <Badge variant="secondary" className="mt-1 font-medium text-xs">
            {member.member_category || 'General Member'}
          </Badge>
        </div>
      </div>

      <div className="space-y-2.5 text-sm text-muted-foreground flex-grow">
        {config.show_email && member.email && (
          <div className="flex items-center gap-2.5">
            <Mail className="w-4 h-4 flex-shrink-0 text-muted-foreground/70" />
            <span className="truncate">{member.email}</span>
          </div>
        )}
        
        {config.show_phone && member.phone && (
          <div className="flex items-center gap-2.5">
            <Phone className="w-4 h-4 flex-shrink-0 text-muted-foreground/70" />
            <span>{member.phone}</span>
          </div>
        )}

        {config.show_date_of_birth && member.date_of_birth && (
          <div className="flex items-center gap-2.5">
            <Calendar className="w-4 h-4 flex-shrink-0 text-muted-foreground/70" />
            <span>{formatDate(member.date_of_birth)}</span>
          </div>
        )}

        {visibleCustomFields.length > 0 && (
          <div className="pt-2 mt-2 border-t border-border/50 space-y-2">
            {visibleCustomFields.map(field => {
              const val = member.customValues?.[field.id];
              if (!val) return null;
              return (
                <div key={field.id} className="flex items-start gap-2">
                  <span className="font-medium text-xs uppercase tracking-wider text-muted-foreground/60 mt-0.5 min-w-[80px]">
                    {field.label}:
                  </span>
                  <span className="truncate text-card-foreground flex-1">
                    {formatCustomValue(val, field.field_type)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <div className="mt-6 pt-4 border-t border-border text-sm font-medium text-primary flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
        View Full Profile
        <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform">→</span>
      </div>
    </Link>
  );
};

export default MemberCard;
