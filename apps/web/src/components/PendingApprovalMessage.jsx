
import React from 'react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

const PendingApprovalMessage = () => {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="max-w-md w-full bg-card border border-border rounded-xl p-8 text-center shadow-lg">
        <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-amber-600 dark:text-amber-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-card-foreground">Approval Pending</h2>
        <p className="text-muted-foreground mb-6">
          Your profile is pending admin approval. You will be notified once approved.
        </p>
        <Button
          onClick={logout}
          variant="outline"
          className="w-full transition-all duration-200"
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default PendingApprovalMessage;
