"use client";

import { useState } from "react";
import { LeaveGroupDialog } from "@/components/groups/leave-group-dialog";
import { LogOut } from "lucide-react";

interface LeaveGroupButtonProps {
    groupId: string;
    groupTitle: string;
    hasCaucao: boolean;
}

export function LeaveGroupButton({ groupId, groupTitle, hasCaucao }: LeaveGroupButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 text-gray-400 hover:text-red-600 transition-colors text-xs font-medium mt-2 w-full justify-center"
            >
                <LogOut className="w-3 h-3" />
                Sair do Grupo
            </button>

            <LeaveGroupDialog
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                groupId={groupId}
                groupTitle={groupTitle}
                hasCaucao={hasCaucao}
            />
        </>
    );
}
