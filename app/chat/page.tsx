"use client";

import { Chat } from "@/components/chat/chat";
import { ChatLayout } from "@/components/chat/chat-layout";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { HumanBody } from "@/components/3d/HumanBody";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push("/login");
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col md:flex-row">
        {/* Contenu principal à gauche */}
        <div className="w-full md:w-1/2 order-1 p-4">
          <div className="h-full flex flex-col">
            {/*<div className="flex-1 rounded-lg overflow-hidden border border-gray-200">
              <HumanBody />
            </div> */}
          </div>
        </div>

        {/* Chat à droite */}
        <div className="w-full md:w-1/2 order-2 h-[calc(100vh-4rem)]">
          <ChatLayout>
            <Chat />
          </ChatLayout>
        </div>
      </main>
      <Footer />
    </div>
  );
} 