"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, UserPlus, AlertCircle, User, Lock, Key, ShieldCheck, Bell, Settings, Palette } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useGallery } from '@/contexts/gallery-context';

const GallerySettings = () => {
  const { gallery } = useGallery();
  const [activeTab, setActiveTab] = useState('team');
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [isEditMemberDialogOpen, setIsEditMemberDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  
  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [newArtworkAlerts, setNewArtworkAlerts] = useState(true);
  const [salesAlerts, setSalesAlerts] = useState(true);
  const [auctionUpdates, setAuctionUpdates] = useState(true);

  // Form states
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: 'Staff',
    permissions: []
  });

  const [profileInfo, setProfileInfo] = useState({
    fullName: 'Sarah Johnson',
    email: 'sarah.johnson@gallery.com',
    phone: '+1 (555) 123-4567',
    role: 'Gallery Administrator'
  });

  const [galleryInfo, setGalleryInfo] = useState({
    name: gallery?.name || 'Gallery'
  });

  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@gallery.com',
      role: 'Admin',
      permissions: ['Full Access', 'Billing', 'Inventory', 'Sales', 'Auctions', 'Analytics']
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@gallery.com',
      role: 'Manager',
      permissions: ['Inventory', 'Sales', 'Auctions', 'Analytics']
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      email: 'emma.rodriguez@gallery.com',
      role: 'Staff',
      permissions: ['Inventory', 'Sales']
    }
  ]);

  const allPermissions = [
    'Full Access',
    'Billing',
    'Inventory',
    'Sales',
    'Auctions',
    'Analytics',
    'Digital Floor',
    'Patron Management'
  ];

  const handleAddMember = () => {
    if (newMember.name && newMember.email) {
      const id = teamMembers.length + 1;
      setTeamMembers([...teamMembers, { ...newMember, id }]);
      setNewMember({ name: '', email: '', role: 'Staff', permissions: [] });
      setIsAddMemberDialogOpen(false);
    }
  };

  const handleEditMember = (member) => {
    setSelectedMember(member);
    setIsEditMemberDialogOpen(true);
  };

  const handleUpdateMember = () => {
    setTeamMembers(teamMembers.map(m => 
      m.id === selectedMember.id ? selectedMember : m
    ));
    setIsEditMemberDialogOpen(false);
  };

  const handleRemoveMember = (id) => {
    setTeamMembers(teamMembers.filter(m => m.id !== id));
  };

  const handlePermissionChange = (permission, checked, isEdit = false) => {
    if (isEdit && selectedMember) {
      const newPermissions = checked 
        ? [...selectedMember.permissions, permission]
        : selectedMember.permissions.filter(p => p !== permission);
      setSelectedMember({ ...selectedMember, permissions: newPermissions });
    } else {
      const newPermissions = checked 
        ? [...newMember.permissions, permission]
        : newMember.permissions.filter(p => p !== permission);
      setNewMember({ ...newMember, permissions: newPermissions });
    }
  };

  return (
    <div className="max-w-7xl mx-auto -mt-5">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Gallery Settings</h1>
        <p className="text-gray-600">Manage your gallery's team, account settings, and gallery configuration.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-between items-center grid-cols-3">
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="account">Account Settings</TabsTrigger>
          <TabsTrigger value="gallery">Gallery Settings (Admin)</TabsTrigger>
        </TabsList>

        {/* Team Management Tab */}
        <TabsContent value="team" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="lg:mb-0 mb-2">
                <CardTitle>Team Management</CardTitle>
                {/* <CardDescription>Manage your gallery team members and their permissions</CardDescription> */}
              </div>
              <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="lg:text-sm text-xs">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Team Member
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Add Team Member</DialogTitle>
                    <DialogDescription>
                      Add a new team member to your gallery and set their permissions.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={newMember.name}
                        onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newMember.email}
                        onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="role">Role</Label>
                      <Select value={newMember.role} onValueChange={(value) => setNewMember({ ...newMember, role: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Manager">Manager</SelectItem>
                          <SelectItem value="Staff">Staff</SelectItem>
                          <SelectItem value="Viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Permissions</Label>
                      <div className="space-y-2">
                        {allPermissions.map((permission) => (
                          <div key={permission} className="flex items-center space-x-2">
                            <Checkbox
                              id={permission}
                              checked={newMember.permissions.includes(permission)}
                              onCheckedChange={(checked) => handlePermissionChange(permission, checked)}
                            />
                            <Label htmlFor={permission} className="text-sm font-normal">
                              {permission}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={handleAddMember}>Add Member</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {teamMembers.map((member) => (
                  <Card key={member.id} className="flex flex-col">
                    <CardContent className="p-4 flex-grow">
                      <div className="flex items-start gap-4 mb-6">
                        <Avatar className="w-10 h-10 rounded-full text-xs">
                          <AvatarFallback>
                            {member.name.split(' ').map((n) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm">{member.name}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{member.email}</p>
                        </div>
                        <Badge variant={member.role === 'Admin' ? 'default' : 'secondary'} className="whitespace-nowrap">
                          {member.role}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <Label>Permissions</Label>
                        <div className="flex flex-wrap gap-2">
                          {member.permissions.map((permission) => (
                            <Badge key={permission} variant="outline" className="text-xs font-normal">
                              {permission}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                    <div className="justify-between p-4 flex gap-2">
                      <Button variant="outline" className="w-full text-xs" onClick={() => handleEditMember(member)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" className="w-full text-xs">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently remove {member.name} from your team.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleRemoveMember(member.id)}>
                              Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Settings Tab */}
        <TabsContent value="account" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </CardTitle>
              <CardDescription>Update your account profile information and contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row items-center text-center md:text-left md:items-start gap-8">
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="w-24 h-24 rounded-full bg-gray-200">
                    {/* <AvatarImage src="/placeholder-user.jpg" /> */}
                    <AvatarFallback>{profileInfo.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" className="text-sm">Change Avatar</Button>
                </div>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={profileInfo.fullName}
                      onChange={(e) => setProfileInfo({ ...profileInfo, fullName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileInfo.email}
                      onChange={(e) => setProfileInfo({ ...profileInfo, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profileInfo.phone}
                      onChange={(e) => setProfileInfo({ ...profileInfo, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" value={profileInfo.role} disabled />
                  </div>
                </div>
              </div>
              <Button className="text-sm w-full sm:w-auto">Save Changes</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="w-5 h-5 mr-2" /> Change Password
              </CardTitle>
              <CardDescription>Update your password. It's a good idea to use a strong password that you're not using elsewhere.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                <Button className="text-sm w-full sm:w-auto">Update Password</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <ShieldCheck className="w-5 h-5 mr-2" />
                    Two-Factor Authentication
                </CardTitle>
                <CardDescription>Add an extra layer of security to your account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start justify-between">
                  <div className='space-y-1'>
                    <Label htmlFor="2fa-switch" className='font-medium text-base'>Two-factor authentication</Label>
                    <p className="text-sm text-gray-600">Add an extra layer of security to your account.</p>
                  </div>
                  <Switch
                    id="2fa-switch"
                    checked={twoFactorEnabled}
                    onCheckedChange={setTwoFactorEnabled}
                  />
              </div>
               {twoFactorEnabled && (
                  <p className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-md p-3">
                    Two-factor authentication is enabled. You will be required to enter a verification code when logging in.
                  </p>
                )}
              
              <div className="pt-4 border-t">
                <div className="text-sm text-gray-600 flex justify-between items-center">
                    <div>
                        <p className='font-medium'>Last login</p>
                        <p>March 24, 2025, 2:15 PM</p>
                    </div>
                  <Button variant="outline" className="text-sm">View Login History</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2" /> Notification Preferences
              </CardTitle>
              <CardDescription>Manage how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-4">Notification Channels</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailNotifs">Email Notifications</Label>
                      <p className="text-sm text-gray-600">Receive notifications via email</p>
                    </div>
                    <Switch
                      id="emailNotifs"
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="pushNotifs">Push Notifications</Label>
                      <p className="text-sm text-gray-600">Receive notifications in your browser</p>
                    </div>
                    <Switch
                      id="pushNotifs"
                      checked={pushNotifications}
                      onCheckedChange={setPushNotifications}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="smsNotifs">SMS Notifications</Label>
                      <p className="text-sm text-gray-600">Receive notifications via text message</p>
                    </div>
                    <Switch
                      id="smsNotifs"
                      checked={smsNotifications}
                      onCheckedChange={setSmsNotifications}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-4">Notification Types</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="weeklyDigest">Weekly Digest</Label>
                    <Switch
                      id="weeklyDigest"
                      checked={weeklyDigest}
                      onCheckedChange={setWeeklyDigest}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="newArtwork">New Artwork Alerts</Label>
                    <Switch
                      id="newArtwork"
                      checked={newArtworkAlerts}
                      onCheckedChange={setNewArtworkAlerts}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="salesAlerts">Sales Alerts</Label>
                    <Switch
                      id="salesAlerts"
                      checked={salesAlerts}
                      onCheckedChange={setSalesAlerts}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auctionUpdates">Auction Updates</Label>
                    <Switch
                      id="auctionUpdates"
                      checked={auctionUpdates}
                      onCheckedChange={setAuctionUpdates}
                    />
                  </div>
                </div>
              </div>
              
              <Button className="text-sm">Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gallery Settings Tab */}
        <TabsContent value="gallery" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gallery Information</CardTitle>
              <CardDescription>Manage your gallery's basic information.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="galleryName">Gallery Name</Label>
                  <Input
                    id="galleryName"
                    value={galleryInfo.name}
                    onChange={(e) => setGalleryInfo({ ...galleryInfo, name: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the look and feel of your application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="w-full h-10 bg-black rounded"></div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <Input id="secondaryColor" type="color" defaultValue="#f3f4f6" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="darkMode">Enable Dark Mode</Label>
                <Switch
                  id="darkMode"
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>Configure advanced application settings.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <p className="font-medium text-yellow-800">Warning!</p>
                </div>
                <p className="text-sm text-yellow-700 mt-1">
                  These settings are for advanced users only. Incorrect settings can cause issues with your application.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apiUrl">API URL</Label>
                  <Input
                    id="apiUrl"
                    placeholder="https://api.example.com"
                    defaultValue="https://api.example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="databaseUrl">Database URL</Label>
                  <Input
                    id="databaseUrl"
                    type="password"
                    placeholder="••••••••"
                    defaultValue="••••••••"
                  />
                </div>
                <Button className="text-sm">Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Member Dialog */}
      <Dialog open={isEditMemberDialogOpen} onOpenChange={setIsEditMemberDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
            <DialogDescription>
              Update team member details and permissions.
            </DialogDescription>
          </DialogHeader>
          {selectedMember && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Name</Label>
                <Input value={selectedMember.name} disabled />
              </div>
              <div className="grid gap-2">
                <Label>Email</Label>
                <Input value={selectedMember.email} disabled />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editRole">Role</Label>
                <Select 
                  value={selectedMember.role} 
                  onValueChange={(value) => setSelectedMember({ ...selectedMember, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Staff">Staff</SelectItem>
                    <SelectItem value="Viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Permissions</Label>
                <div className="space-y-2">
                  {allPermissions.map((permission) => (
                    <div key={permission} className="flex items-center space-x-2">
                      <Checkbox
                        id={`edit-${permission}`}
                        checked={selectedMember.permissions.includes(permission)}
                        onCheckedChange={(checked) => handlePermissionChange(permission, checked, true)}
                      />
                      <Label htmlFor={`edit-${permission}`} className="text-sm font-normal">
                        {permission}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="submit" onClick={handleUpdateMember} className="text-sm">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GallerySettings;