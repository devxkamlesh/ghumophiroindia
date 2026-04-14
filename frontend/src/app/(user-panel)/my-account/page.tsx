'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPanelLayout } from '@/components/user-panel/UserPanelLayout';
import { authService } from '@/services/api';
import { User, Mail, Phone, Calendar, Shield, Edit2, Check, X, MapPin, TrendingUp } from 'lucide-react';

export default function MyAccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const profile = await authService.getProfile();
        setUser(profile);
        setFormData({
          name: profile.name,
          phone: profile.phone || '',
        });
      } catch (err: any) {
        console.error('Failed to fetch profile:', err);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setSuccess('Profile updated successfully!');
      setEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <UserPanelLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary"></div>
        </div>
      </UserPanelLayout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <UserPanelLayout>
      <div className="max-w-6xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Welcome back, {user.name}!</h1>
          <p className="text-sm text-muted-foreground">Manage your profile and view your travel statistics</p>
        </div>

        {/* Alerts */}
        {success && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-2">
            <Check size={16} className="text-green-600 dark:text-green-400" />
            <p className="text-sm text-green-800 dark:text-green-200">{success}</p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2">
            <X size={16} className="text-red-600 dark:text-red-400" />
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total Bookings</p>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                    <TrendingUp size={12} />
                    <span>All time</span>
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <Calendar className="text-white" size={20} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Upcoming Tours</p>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-xs text-muted-foreground mt-1">Next 30 days</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                  <MapPin className="text-white" size={20} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total Spent</p>
                  <p className="text-2xl font-bold">₹0</p>
                  <p className="text-xs text-muted-foreground mt-1">Lifetime value</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <TrendingUp className="text-white" size={20} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Information */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold">Personal Information</h2>
                <p className="text-sm text-muted-foreground">Update your personal details</p>
              </div>
              {!editing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditing(true)}
                  className="gap-2 h-9 rounded-lg"
                >
                  <Edit2 size={14} />
                  Edit Profile
                </Button>
              )}
            </div>

            {editing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1.5 h-10 rounded-lg"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="mt-1.5 h-10 rounded-lg"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    onClick={handleSave} 
                    disabled={saving} 
                    className="gap-2 h-10 rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                  >
                    <Check size={16} />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditing(false);
                      setFormData({
                        name: user.name,
                        phone: user.phone || '',
                      });
                    }}
                    className="gap-2 h-10 rounded-lg"
                  >
                    <X size={16} />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 border border-blue-100 dark:border-blue-800/30">
                  <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <User className="text-white" size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">Full Name</p>
                    <p className="text-sm font-semibold truncate">{user.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10 border border-green-100 dark:border-green-800/30">
                  <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0">
                    <Mail className="text-white" size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">Email Address</p>
                    <p className="text-sm font-semibold truncate">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 border border-purple-100 dark:border-purple-800/30">
                  <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center flex-shrink-0">
                    <Phone className="text-white" size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-1">Phone Number</p>
                    <p className="text-sm font-semibold truncate">{user.phone || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/20 dark:to-orange-800/10 border border-orange-100 dark:border-orange-800/30">
                  <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center flex-shrink-0">
                    <Shield className="text-white" size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-orange-600 dark:text-orange-400 mb-1">Account Type</p>
                    <p className="text-sm font-semibold capitalize">{user.role}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-pink-50 to-pink-100/50 dark:from-pink-900/20 dark:to-pink-800/10 border border-pink-100 dark:border-pink-800/30 md:col-span-2">
                  <div className="w-10 h-10 rounded-lg bg-pink-500 flex items-center justify-center flex-shrink-0">
                    <Calendar className="text-white" size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-pink-600 dark:text-pink-400 mb-1">Member Since</p>
                    <p className="text-sm font-semibold">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </UserPanelLayout>
  );
}
