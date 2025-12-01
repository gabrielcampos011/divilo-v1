"use client";

import { useState } from "react";
import { ReportDialog } from "@/components/forms/report-dialog";
import { Flag } from "lucide-react";

interface ReportGroupButtonProps {
    groupId: string;
    groupTitle: string;
}

export function ReportGroupButton({ groupId, groupTitle }: ReportGroupButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 text-gray-400 hover:text-red-600 transition-colors text-xs font-medium mt-4 w-full justify-center"
            >
                <Flag className="w-3 h-3" />
                Denunciar Grupo
            </button>

            <ReportDialog
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                groupId={groupId}
                groupTitle={groupTitle}
            />
        </>
    );
}
