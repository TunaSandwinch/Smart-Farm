// src/context/SystemStatusContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient.js";

const EMPTY = {
  env_humidity: null,
  env_temperature: null,
  fish_feed_level: null,
  water_temperature: null,
  water_level: null,
  ph_level: null,
  chicken_feed_level: null,
  manure_tea_level: null,
  updated_at: null,
};

const SystemStatusContext = createContext();

export function SystemStatusProvider({ children }) {
  const [data, setData] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchStatus() {
    const { data, error } = await supabase
      .from("system_status")
      .select("*")
      .eq("id", 1)
      .single();

    if (error) {
      setError(error.message);
    } else if (data) {
      setData(data);
      setError(null);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchStatus();

    const channel = supabase
      .channel("system_status_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "system_status",
          filter: "id=eq.1",
        },
        (payload) => {
          if (payload?.new) setData(payload.new);
        }
      )
      .subscribe();

    const intervalId = setInterval(fetchStatus, 5000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <SystemStatusContext.Provider value={{ data, loading, error }}>
      {children}
    </SystemStatusContext.Provider>
  );
}

export function useSystemStatus() {
  return useContext(SystemStatusContext);
}
