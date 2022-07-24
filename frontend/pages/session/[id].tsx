import type { NextPage } from "next";
import { useCountdown } from "../../hooks/use-countdown";

const Session: NextPage = () => {
  const [days, hours, minutes, seconds] = useCountdown("2023-01-01");

  // pad leading zeros
  const pad = (n: number) => (n < 10 ? `0${n}` : n);

  return (
    <div className="w-screen h-screen bg-amber-200 flex justify-center items-center">
      <h1 className="text-7xl font-bold underline tabular-nums">
        {pad(minutes)}:{pad(seconds)}
      </h1>
    </div>
  );
};

export default Session;
