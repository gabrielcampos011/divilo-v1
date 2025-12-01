import { User } from "@supabase/supabase-js";
import { ShieldCheck, Crown, Rocket, Trophy } from "lucide-react";

interface AchievementsSectionProps {
    user: User;
    createdGroupsCount: number;
}

export function AchievementsSection({ user, createdGroupsCount }: AchievementsSectionProps) {
    const badges = [
        {
            id: "verified",
            title: "Verificado",
            description: "Email confirmado",
            Icon: ShieldCheck,
            unlocked: !!user.email_confirmed_at,
            color: "bg-blue-100 text-blue-600",
        },
        {
            id: "leader",
            title: "Líder",
            description: "Criou pelo menos 1 grupo",
            Icon: Crown,
            unlocked: createdGroupsCount > 0,
            color: "bg-yellow-100 text-yellow-600",
        },
        {
            id: "early-adopter",
            title: "Early Adopter",
            description: "Entrou em 2025",
            Icon: Rocket,
            unlocked: new Date(user.created_at).getFullYear() === 2025,
            color: "bg-purple-100 text-purple-600",
        },
    ];

    return (
        <section>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-600" />
                Conquistas
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {badges.map((badge) => {
                    const IconComponent = badge.Icon;
                    return (
                        <div
                            key={badge.id}
                            className={`p-4 rounded-2xl border transition-all ${badge.unlocked
                                    ? "bg-white border-gray-100 shadow-sm hover:shadow-md"
                                    : "bg-gray-50 border-gray-100 opacity-60 grayscale"
                                }`}
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${badge.unlocked ? badge.color : "bg-gray-200 text-gray-400"}`}>
                                <IconComponent className={`w-5 h-5 ${badge.unlocked ? badge.color.split(' ')[1] : "text-gray-400"}`} />
                            </div>
                            <h4 className="font-bold text-gray-900 text-sm">{badge.title}</h4>
                            <p className="text-xs text-gray-500 mt-1">{badge.description}</p>
                            {badge.unlocked && (
                                <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                    Desbloqueado
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
