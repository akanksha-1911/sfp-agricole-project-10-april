import React from 'react';
import { CreditCard, Smartphone, Building } from 'lucide-react';
import { Card } from '../ui/card';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';

interface PaymentFormProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  selectedMethod,
  onMethodChange
}) => {
  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Pay securely with your card'
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: Smartphone,
      description: 'Pay using UPI apps'
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: Building,
      description: 'Pay via internet banking'
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: CreditCard,
      description: 'Pay when you receive'
    }
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <CreditCard className="w-5 h-5 text-indigo-600" />
        <h2 className="text-xl font-bold">Payment Method</h2>
      </div>

      <RadioGroup value={selectedMethod} onValueChange={onMethodChange}>
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                selectedMethod === method.id
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-200'
              }`}
              onClick={() => onMethodChange(method.id)}
            >
              <RadioGroupItem value={method.id} id={method.id} />
              <method.icon className="w-5 h-5 text-gray-600" />
              <div className="flex-1">
                <Label htmlFor={method.id} className="cursor-pointer font-semibold">
                  {method.name}
                </Label>
                <p className="text-sm text-gray-600">{method.description}</p>
              </div>
            </div>
          ))}
        </div>
      </RadioGroup>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>Note:</strong> All transactions are secure and encrypted. Your payment information is safe with us.
        </p>
      </div>
    </Card>
  );
};
