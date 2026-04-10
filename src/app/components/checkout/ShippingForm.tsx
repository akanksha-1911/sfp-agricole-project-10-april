import React from 'react';
import { MapPin } from 'lucide-react';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface ShippingFormProps {
  formData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  onChange: (field: string, value: string) => void;
}

export const ShippingForm: React.FC<ShippingFormProps> = ({ formData, onChange }) => {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <MapPin className="w-5 h-5 text-indigo-600" />
        <h2 className="text-xl font-bold">Shipping Information</h2>
      </div>

      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => onChange('name', e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              placeholder="Enter phone number"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => onChange('email', e.target.value)}
            placeholder="Enter email address"
            required
          />
        </div>

        <div>
          <Label htmlFor="address">Street Address *</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => onChange('address', e.target.value)}
            placeholder="House no, Street name"
            required
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => onChange('city', e.target.value)}
              placeholder="City"
              required
            />
          </div>
          <div>
            <Label htmlFor="state">State *</Label>
            <Input
              id="state"
              value={formData.state}
              onChange={(e) => onChange('state', e.target.value)}
              placeholder="State"
              required
            />
          </div>
          <div>
            <Label htmlFor="pincode">Pincode *</Label>
            <Input
              id="pincode"
              value={formData.pincode}
              onChange={(e) => onChange('pincode', e.target.value)}
              placeholder="Pincode"
              required
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
