"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface PetEnvironmentProps {
  petType: string;
  timeOfDay: "morning" | "day" | "evening" | "night";
  children: React.ReactNode;
}

export function PetEnvironment({
  petType,
  timeOfDay = "day",
  children,
}: PetEnvironmentProps) {
  const [weather, setWeather] = useState<
    "sunny" | "cloudy" | "rainy" | "snowy"
  >("sunny");

  // Randomly change weather occasionally
  useEffect(() => {
    const weatherTypes: ("sunny" | "cloudy" | "rainy" | "snowy")[] = [
      "sunny",
      "cloudy",
      "rainy",
      "snowy",
    ];
    const interval = setInterval(() => {
      const randomWeather =
        weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
      setWeather(randomWeather);
    }, 120000); // Change every 2 minutes

    return () => clearInterval(interval);
  }, []);

  // Get environment based on pet type
  const getEnvironment = () => {
    switch (petType) {
      case "dog":
        return "backyard";
      case "cat":
        return "living-room";
      case "bird":
        return "garden";
      default:
        return "living-room";
    }
  };

  const environment = getEnvironment();

  // Get background colors based on time of day
  const getBackgroundColors = () => {
    switch (timeOfDay) {
      case "morning":
        return "from-amber-100 via-orange-100 to-blue-100";
      case "day":
        return "from-blue-100 via-sky-100 to-indigo-100";
      case "evening":
        return "from-orange-100 via-pink-100 to-purple-100";
      case "night":
        return "from-indigo-900 via-blue-900 to-purple-900";
      default:
        return "from-blue-100 via-sky-100 to-indigo-100";
    }
  };

  // Get environment elements based on environment type
  const getEnvironmentElements = () => {
    switch (environment) {
      case "backyard":
        return (
          <>
            <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-green-600 to-green-500" />
            <motion.div
              className="absolute bottom-1/4 left-10 w-20 h-32 bg-gradient-to-t from-green-700 to-green-600 rounded-full"
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            />
            <motion.div
              className="absolute bottom-1/4 right-10 w-16 h-24 bg-gradient-to-t from-green-700 to-green-600 rounded-full"
              animate={{ y: [0, -3, 0] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
            />
            {weather === "sunny" && (
              <motion.div
                className="absolute top-10 right-10 w-16 h-16 bg-yellow-300 rounded-full"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            )}
            {weather === "cloudy" && (
              <>
                <motion.div
                  className="absolute top-10 right-10 w-20 h-10 bg-gray-200 rounded-full"
                  animate={{ x: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 10 }}
                />
                <motion.div
                  className="absolute top-16 right-20 w-16 h-8 bg-gray-300 rounded-full"
                  animate={{ x: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 15 }}
                />
              </>
            )}
            {weather === "rainy" && (
              <>
                <motion.div
                  className="absolute top-10 right-10 w-20 h-10 bg-gray-500 rounded-full"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 8 }}
                />
                {[...Array(10)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-0.5 h-4 bg-blue-400"
                    style={{
                      top: `${Math.random() * 30 + 20}%`,
                      left: `${Math.random() * 80 + 10}%`,
                    }}
                    animate={{
                      y: [0, 100],
                      opacity: [1, 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.8 + Math.random() * 0.5,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </>
            )}
            {weather === "snowy" && (
              <>
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    style={{
                      top: `${Math.random() * 30}%`,
                      left: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [0, 200],
                      x: [0, Math.random() * 20 - 10],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 5 + Math.random() * 3,
                      delay: Math.random() * 5,
                    }}
                  />
                ))}
              </>
            )}
          </>
        );
      case "living-room":
        return (
          <>
            <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-amber-800 to-amber-700" />
            <div className="absolute bottom-1/4 left-0 right-0 h-1/2 bg-gradient-to-t from-amber-200 to-amber-100" />
            <div className="absolute bottom-1/4 left-10 w-20 h-10 bg-amber-900 rounded-lg" />
            <div className="absolute bottom-1/4 right-10 w-16 h-24 bg-amber-800 rounded-md" />
            <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 w-32 h-16 bg-amber-700 rounded-md" />
            {timeOfDay === "night" && (
              <div className="absolute top-10 right-10 w-8 h-8 bg-yellow-300 rounded-full shadow-lg shadow-yellow-200" />
            )}
          </>
        );
      case "garden":
        return (
          <>
            <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-green-700 to-green-600" />
            <motion.div
              className="absolute bottom-1/4 left-5 w-3 h-32 bg-gradient-to-t from-amber-800 to-amber-700"
              animate={{ rotate: [0, 2, 0, -2, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
            >
              <motion.div
                className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-8 bg-green-500 rounded-full"
                animate={{ rotate: [0, 5, 0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 4, delay: 0.1 }}
              />
            </motion.div>
            <motion.div
              className="absolute bottom-1/4 right-10 w-3 h-24 bg-gradient-to-t from-amber-800 to-amber-700"
              animate={{ rotate: [0, -2, 0, 2, 0] }}
              transition={{ repeat: Infinity, duration: 3.5 }}
            >
              <motion.div
                className="absolute top-0 left-1/2 transform -translate-x-1/2 w-10 h-6 bg-green-500 rounded-full"
                animate={{ rotate: [0, -5, 0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, delay: 0.1 }}
              />
            </motion.div>
            {weather === "sunny" && (
              <motion.div
                className="absolute top-10 right-10 w-16 h-16 bg-yellow-300 rounded-full"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            )}
            {weather === "cloudy" && (
              <>
                <motion.div
                  className="absolute top-10 right-10 w-20 h-10 bg-gray-200 rounded-full"
                  animate={{ x: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 10 }}
                />
                <motion.div
                  className="absolute top-16 right-20 w-16 h-8 bg-gray-300 rounded-full"
                  animate={{ x: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 15 }}
                />
              </>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`relative w-full h-full overflow-hidden rounded-xl bg-gradient-to-b ${getBackgroundColors()}`}
    >
      {getEnvironmentElements()}
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
}
