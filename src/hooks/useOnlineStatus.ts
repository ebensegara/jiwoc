"use client";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function useOnlineStatus(professionalId: string) {
  useEffect(() => {
    if (!professionalId) return;

    let timeoutId: NodeJS.Timeout;

    const markOnline = async () => {
      try {
        await supabase
          .from("professionals")
          .update({ is_available: true })
          .eq("id", professionalId);
      } catch (error) {
        console.error("Failed to mark online:", error);
      }
    };

    const markOffline = async () => {
      try {
        await supabase
          .from("professionals")
          .update({ is_available: false })
          .eq("id", professionalId);
      } catch (error) {
        console.error("Failed to mark offline:", error);
      }
    };

    // Debounced mark online
    timeoutId = setTimeout(markOnline, 500);

    // Handle page unload
    const handleBeforeUnload = () => {
      markOffline();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearTimeout(timeoutId);
      markOffline();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [professionalId]);
}
