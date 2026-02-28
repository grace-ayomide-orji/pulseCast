"use client";
import { useEffect, useRef } from "react";
import { useData } from "@/lib/DataContext";
import { fetchCityByIP } from "@/lib/api";

export default function GeolocationHandler() {
  const { updateWeather, updateWeatherByCoords } = useData();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentCityRef = useRef<string | null>(null);

  useEffect(() => {
    const startPolling = (city: string) => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      currentCityRef.current = city;
      intervalRef.current = setInterval(async () => {
        await updateWeather(city);
      }, 600000);
    };
  
    const handleResetPolling = (event: CustomEvent) => {
      startPolling(event.detail.city);
    };
  
    const getLocation = async () => {
      const storedCity = localStorage.getItem("lastCity");
      if (storedCity) {
        await updateWeather(storedCity);
        startPolling(storedCity);
        return;
      }
  
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const result = await updateWeatherByCoords(latitude, longitude);
            if (!("error" in result) && result.city) {
              localStorage.setItem("lastCity", result.city);
              startPolling(result.city);
            }
          },
          async () => {
            const city = await fetchCityByIP();
            if (city) {
              const result = await updateWeather(city);
              if (!("error" in result) && result.city) {
                localStorage.setItem("lastCity", result.city);
                startPolling(result.city);
              }
            }
          },
          {
            timeout: 10000, // 10 second timeout
            enableHighAccuracy: false // Don't require high accuracy
          }
        );
      } else {
        const city = await fetchCityByIP();
        if (city) {
          const result = await updateWeather(city);
          if (!("error" in result) && result.city) {
            localStorage.setItem("lastCity", result.city);
            startPolling(result.city);
          }
        }
      }
    };
  
    window.addEventListener("resetWeatherPolling", handleResetPolling as EventListener);
    getLocation();
  
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      window.removeEventListener("resetWeatherPolling", handleResetPolling as EventListener);
    };
  }, [updateWeather, updateWeatherByCoords]);

  return null;
}