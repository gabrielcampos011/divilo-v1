'use server'

import { createClient } from "@/utils/supabase/server";

export async function checkAndAwardBadges(userId: string) {
    const supabase = await createClient();

    // 1. Check 'lider' badge
    const { count: groupsLed } = await supabase
        .from("grupos")
        .select("*", { count: 'exact', head: true })
        .eq("lider_id", userId);

    if (groupsLed && groupsLed > 0) {
        await awardBadge(userId, 'lider');
    }

    // 2. Check 'membro-ativo' badge
    const { count: activeMemberships } = await supabase
        .from("membros")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", userId)
        .in("status", ['aprovado', 'pago']);

    if (activeMemberships && activeMemberships > 0) {
        await awardBadge(userId, 'membro-ativo');
    }
}

async function awardBadge(userId: string, badgeSlug: string) {
    const supabase = await createClient();

    // Get badge ID
    const { data: badge } = await supabase
        .from("badges")
        .select("id")
        .eq("slug", badgeSlug)
        .single();

    if (!badge) return;

    // Insert user_badge (ignore if exists due to unique constraint)
    await supabase.from("user_badges").upsert({
        user_id: userId,
        badge_id: badge.id
    }, { onConflict: 'user_id, badge_id', ignoreDuplicates: true });
}

export async function getUserBadges(userId: string) {
    const supabase = await createClient();

    const { data } = await supabase
        .from("user_badges")
        .select(`
            awarded_at,
            badge:badges (
                name,
                description,
                icon_name,
                slug
            )
        `)
        .eq("user_id", userId);

    return data;
}
