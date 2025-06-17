import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, LucideIcon } from 'lucide-react';
interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
  earned: boolean;
  date?: string;
  progress?: number;
}
interface AchievementsSectionProps {
  achievements: Achievement[];
  timeframe: 'week' | 'month' | 'year';
}
const AchievementsSection = ({
  achievements,
  timeframe
}: AchievementsSectionProps) => {
  const getProgressMax = (achievementId: number) => {
    if (achievementId === 3) return 50;
    return timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : 365;
  };
  return <Card className="bg-gradient-card border-border/50 p-6 my-0 mx-0 px-[24px]">
      <h3 className="text-subheading text-foreground mb-4">Conquistas</h3>
      
      <div className="grid gap-4">
        {achievements.map(achievement => {
        const Icon = achievement.icon;
        const progressMax = getProgressMax(achievement.id);
        return <div key={achievement.id} className={`p-4 rounded-lg border transition-all ${achievement.earned ? 'bg-primary/10 border-primary/20' : 'bg-muted/10 border-border/30'}`}>
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${achievement.earned ? 'bg-primary/20' : 'bg-muted/20'}`}>
                  <Icon size={20} className={achievement.earned ? 'text-primary' : 'text-muted-foreground'} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-foreground">{achievement.title}</h4>
                    {achievement.earned && <Badge variant="secondary" className="bg-primary/20 text-primary text-xs">
                        <Award size={12} className="mr-1" />
                        Conquistado
                      </Badge>}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    {achievement.description}
                  </p>
                  
                  {achievement.earned ? achievement.date && <p className="text-xs text-muted-foreground">
                        Conquistado em {achievement.date}
                      </p> : achievement.progress !== undefined && <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Progresso</span>
                          <span className="text-foreground">
                            {achievement.progress}/{progressMax}
                          </span>
                        </div>
                        <div className="w-full bg-muted/30 rounded-full h-1.5">
                          <div className="bg-primary h-1.5 rounded-full transition-all duration-300" style={{
                    width: `${achievement.progress / progressMax * 100}%`
                  }} />
                        </div>
                      </div>}
                </div>
              </div>
            </div>;
      })}
      </div>
    </Card>;
};
export default AchievementsSection;