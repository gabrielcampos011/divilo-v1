import { createClient } from "@/utils/supabase/server";
import { Navbar } from "@/components/ui/navbar";
import { CreateGroupWizard } from "@/components/forms/create-group-wizard";
import { redirect } from "next/navigation";

export default async function NewGroupPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: servicos } = await supabase
        .from("servicos")
        .select("*")
        .order("nome");

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#050505]">
            <Navbar />

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Novo Grupo</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Compartilhe sua assinatura e comece a economizar hoje mesmo.
                    </p>
                </div>

                <CreateGroupWizard servicos={servicos || []} />
            </main>
        </div>
    );
}
