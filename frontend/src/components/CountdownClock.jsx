import { useEffect, useState } from "react";

export default function CountdownClock() {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();

      // Target = today 13:00 UTC
      let target = new Date();
      target.setUTCHours(13, 0, 0, 0);

      // If time already passed, set target to tomorrow
      if (now > target) {
        target.setUTCDate(target.getUTCDate() + 1);
      }

      const diff = target - now;

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(
        `${hours.toString().padStart(2, "0")}:` +
        `${minutes.toString().padStart(2, "0")}:` +
        `${seconds.toString().padStart(2, "0")}`
      );
    };

    updateCountdown(); // run immediately
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center text-base font-extralight text-gray-400">
      Time remaining next analysis: <span className="text-blue-400">{timeLeft}</span>
    </div>
  );
}
