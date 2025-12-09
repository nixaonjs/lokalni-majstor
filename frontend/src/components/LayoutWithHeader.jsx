import Header from "./header";
import { Outlet } from "react-router-dom";

export default function LayOutWithHeader() {

    return (
        <div className="min-h-dvh bg-slate-100 text-slate-950 dark:bg-slate-50 dark:text-black">
            <Header />
            <main className="px-4 py-4 sm:px-6">
                <Outlet />
            </main>
        </div>
    );
}