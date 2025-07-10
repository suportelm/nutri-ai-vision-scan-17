
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Save } from 'lucide-react';
import GoalsSettings from '@/components/GoalsSettings';
import ProfileHeader from '@/components/Profile/ProfileHeader';
import ProfileForm from '@/components/Profile/ProfileForm';
import ProfileAchievements from '@/components/Profile/ProfileAchievements';
import ProfileSettings from '@/components/Profile/ProfileSettings';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';

const Profile = () => {
  const { signOut } = useAuth();
  const { profile, updateProfile, isUpdating, isLoading } = useProfile();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showGoalsSettings, setShowGoalsSettings] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: '',
    age: '',
    weight: '',
    height: '',
    activity_level: 'moderado',
    goal: 'manter_peso',
    daily_calorie_goal: 2000,
  });

  // Sincronizar formData com dados do perfil sempre que o perfil for carregado
  useEffect(() => {
    if (profile) {
      console.log('Updating form data with profile:', profile);
      setFormData({
        full_name: profile.full_name || '',
        age: profile.age?.toString() || '',
        weight: profile.weight?.toString() || '',
        height: profile.height?.toString() || '',
        activity_level: profile.activity_level || 'moderado',
        goal: profile.goal || 'manter_peso',
        daily_calorie_goal: profile.daily_calorie_goal || 2000,
      });
    }
  }, [profile]);

  const handleSaveProfile = () => {
    console.log('Saving profile with data:', formData);
    updateProfile({
      full_name: formData.full_name,
      age: formData.age ? parseInt(formData.age.toString()) : null,
      weight: formData.weight ? parseFloat(formData.weight.toString()) : null,
      height: formData.height ? parseInt(formData.height.toString()) : null,
      activity_level: formData.activity_level,
      goal: formData.goal,
      daily_calorie_goal: formData.daily_calorie_goal,
    });
    setIsEditingProfile(false);
  };

  const handleAvatarUpdate = (avatarUrl: string) => {
    updateProfile({ avatar_url: avatarUrl });
  };

  const handleLogout = async () => {
    await signOut();
  };

  if (showGoalsSettings) {
    return <GoalsSettings onBack={() => setShowGoalsSettings(false)} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-md border-b border-border/50 p-6 pt-12">
        <div className="flex items-center justify-between">
          <h1 className="text-heading">Perfil</h1>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              if (isEditingProfile) {
                handleSaveProfile();
              } else {
                setIsEditingProfile(true);
              }
            }}
            disabled={isUpdating}
          >
            {isEditingProfile ? <Save size={16} /> : <Edit size={16} />}
          </Button>
        </div>
      </div>

      <div className="px-6 space-y-6">
        <ProfileHeader 
          profile={profile}
          onAvatarUpdate={handleAvatarUpdate}
          isUpdating={isUpdating}
        />

        <ProfileForm 
          formData={formData}
          setFormData={setFormData}
          isEditingProfile={isEditingProfile}
        />

        <ProfileAchievements />

        <ProfileSettings 
          onGoalsClick={() => setShowGoalsSettings(true)}
          onLogout={handleLogout}
        />
      </div>
    </div>
  );
};

export default Profile;
