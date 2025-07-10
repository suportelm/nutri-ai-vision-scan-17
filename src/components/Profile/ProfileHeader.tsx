
import { Card } from '@/components/ui/card';
import AvatarUpload from '@/components/AvatarUpload';

interface ProfileHeaderProps {
  profile: any;
  onAvatarUpdate: (avatarUrl: string) => void;
  isUpdating: boolean;
}

const ProfileHeader = ({ profile, onAvatarUpdate, isUpdating }: ProfileHeaderProps) => {
  return (
    <Card className="bg-gradient-card border-border/50 p-6">
      {/* Avatar e Nome - Layout Responsivo */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-4">
        <div className="flex-shrink-0">
          <AvatarUpload
            currentAvatarUrl={profile?.avatar_url}
            onAvatarUpdate={onAvatarUpdate}
            disabled={isUpdating}
          />
        </div>
        
        <div className="flex-1 text-center sm:text-left min-w-0">
          <h2 className="text-xl font-semibold truncate">{profile?.full_name || 'Usuário'}</h2>
          <p className="text-muted-foreground text-sm truncate">{profile?.email}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Membro desde {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('pt-BR') : 'hoje'}
          </p>
        </div>
      </div>

      {/* Quick Stats - Grid Responsivo */}
      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border/30">
        <div className="text-center">
          <p className="text-sm font-medium">{profile?.weight || '--'}kg</p>
          <p className="text-xs text-muted-foreground">Peso</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium">{profile?.height || '--'}cm</p>
          <p className="text-xs text-muted-foreground">Altura</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium">{profile?.age || '--'}</p>
          <p className="text-xs text-muted-foreground">Anos</p>
        </div>
      </div>
    </Card>
  );
};

export default ProfileHeader;
