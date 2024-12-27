import { FC } from "react";
import { Profile, PreApprovalStatus } from "@/types/profile";
import { formatPrice } from "@/lib/utils";

interface PreApprovalStatusDisplayProps {
  status: PreApprovalStatus;
  amount: number | null;
}

const getStatusColor = (status: PreApprovalStatus): string => {
  const colors = {
    approved: 'text-green-600',
    pending: 'text-yellow-600',
    rejected: 'text-red-600',
    cash: 'text-blue-600'
  };
  return colors[status] || 'text-gray-600';
};

export const PreApprovalStatusDisplay: FC<PreApprovalStatusDisplayProps> = ({
  status,
  amount
}) => {
  return (
    <div className="space-y-2">
      <p>
        Current Status:
        <span className={`ml-2 font-semibold capitalize ${getStatusColor(status)}`}>
          {status === 'cash' ? 'Cash Buyer' : status}
        </span>
      </p>
      {amount && (
        <p>
          Pre-Approved Amount:
          <span className="ml-2 font-semibold">
            {formatPrice(amount)}
          </span>
        </p>
      )}
    </div>
  );
};