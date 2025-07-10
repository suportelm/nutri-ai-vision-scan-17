
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ProfileAchievements = () => {
  const achievements = [
    { name: 'Primeiro Login', color: 'bg-primary' },
    { name: 'Perfil Completo', color: 'bg-secondary' },
    { name: 'Primeira Refeição', color: 'bg-accent' }
  ];

  return (
    <Card className="bg-gradient-card border-border/50 p-6">
      <h3 className="text-subheading mb-4">Conquistas</h3>
      <div className="flex flex-wrap gap-2">
        {achievements.map((achievement, index) => (
          <Badge 
            key={index} 
            variant="secondary" 
            className={`${achievement.color}/20 text-white border-0`}
          >
            {achievement.name}
          </Badge>
        ))}
      </div>
    </Card>
  );
};

export default ProfileAchievements;
