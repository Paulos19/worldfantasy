// app/dashboard/chats/[id]/chat-scroll-wrapper.tsx
"use client";

import { useEffect, useRef } from "react";

export function ChatScrollWrapper({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Scroll automático para o final da conversa
        if (ref.current) {
            const scrollable = ref.current.querySelector(".overflow-y-auto");
            if (scrollable) {
                scrollable.scrollTop = scrollable.scrollHeight;
            }
        }
    }, []);

    return <div ref={ref} className="flex-1 overflow-hidden flex flex-col">{children}</div>;
}
