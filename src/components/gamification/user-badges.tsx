'use client';

import { useEffect, useState } from 'react';
import { getUserBadges } from '@/app/actions/gamification';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Crown, Rocket, ShieldCheck, Star, Trophy } from 'lucide-react';

const iconMap: Record<string, any> = {
    'Crown': Crown,
    'Rocket': Rocket,
    'Star': Star,
    'ShieldCheck': ShieldCheck,
    'Trophy': Trophy
};

interface UserBadge {
    awarded_at: string;
    badge: {
        name: string;
        description: string;
        icon_name: string;
        slug: string;
    };
}

export function UserBadges({ userId }: { userId: string }) {
    const [badges, setBadges] = useState<UserBadge[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadBadges() {
            try {
                const data = await getUserBadges(userId);
                if (data) {
                    setBadges(data as any);
                }
            } catch (error) {
                console.error("Failed to load badges", error);
            } finally {
                setLoading(false);
            }
        }
        loadBadges();
    }, [userId]);

    if (loading) return <div className="h-16 animate-pulse bg-muted rounded-xl w-full" />;

    if (badges.length === 0) {
        return (
            <div className="p-4 border rounded-xl bg-muted/20 text-center text-muted-foreground text-sm">
                Ainda sem conquistas. Participe de grupos para ganhar emblemas!
            </div>
        );
    }

    return (
        <div className="flex flex-wrap gap-3">
            <TooltipProvider>
                {badges.map((userBadge) => {
                    const Icon = iconMap[userBadge.badge.icon_name] || Trophy;
                    return (
                        <Tooltip key={userBadge.badge.slug}>
                            <TooltipTrigger asChild>
                                <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-br from-rose-500/10 to-orange-500/10 border border-rose-200/20 rounded-lg cursor-help hover:bg-rose-500/20 transition-colors">
                                    <Icon className="w-5 h-5 text-rose-500" />
                                    <span className="font-medium text-sm text-foreground">{userBadge.badge.name}</span>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="font-semibold">{userBadge.badge.name}</p>
                                <p className="text-xs text-muted-foreground">{userBadge.badge.description}</p>
                                <p className="text-[10px] text-muted-foreground mt-1">
                                    Conquistado em {new Date(userBadge.awarded_at).toLocaleDateString('pt-BR')}
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    );
                })}
            </TooltipProvider>
        </div>
    );
}
