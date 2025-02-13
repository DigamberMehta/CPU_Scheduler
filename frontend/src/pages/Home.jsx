import React, { useState } from "react";
import ProcessForm from "@/components/ProcessForm";
import ProcessTable from "@/components/ProcessTable";

const Home = () => {
  const [algorithm, setAlgorithm] = useState(""); // Stores selected scheduling algorithm
  const [processList, setProcessList] = useState([]); // Stores process list
  const [timeQuantum, setTimeQuantum] = useState(""); // Stores Time Quantum for Round Robin

  return (
    <div className="w-[90%] mx-auto mt-8 flex justify-between">
      {/* Process Form */}
      <ProcessForm
        algorithm={algorithm}
        setAlgorithm={setAlgorithm}
        processList={processList}
        setProcessList={setProcessList}
        timeQuantum={timeQuantum}
        setTimeQuantum={setTimeQuantum}
      />

      {/* Process Table */}
      <ProcessTable processList={processList} setProcessList={setProcessList} algorithm={algorithm} timeQuantum={timeQuantum} />
    </div>
  );
};

export default Home;
