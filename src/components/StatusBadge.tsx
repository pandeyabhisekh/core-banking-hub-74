import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'inactive' | 'frozen';
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const variants = {
    pending: { variant: 'secondary' as const, label: 'Pending', className: 'bg-pending text-pending-foreground' },
    approved: { variant: 'default' as const, label: 'Approved', className: 'bg-approved text-approved-foreground' },
    rejected: { variant: 'destructive' as const, label: 'Rejected', className: '' },
    active: { variant: 'default' as const, label: 'Active', className: 'bg-success text-success-foreground' },
    inactive: { variant: 'secondary' as const, label: 'Inactive', className: '' },
    frozen: { variant: 'destructive' as const, label: 'Frozen', className: '' },
  };

  const config = variants[status];

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
};
