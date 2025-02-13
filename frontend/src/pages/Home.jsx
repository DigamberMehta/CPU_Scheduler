import React, { useState, useEffect } from "react";
import ProcessForm from "@/components/ProcessForm";
import ProcessTable from "@/components/ProcessTable";

const Home = () => {
  const [algorithm, setAlgorithm] = useState(() => localStorage.getItem("algorithm") || ""); 
  const [processList, setProcessList] = useState([]);
  const [timeQuantum, setTimeQuantum] = useState(""); 

  // Load stored data on component mount
  useEffect(() => {
    const storedProcesses = JSON.parse(localStorage.getItem("processList"));
    if (storedProcesses) setProcessList(storedProcesses);

    const storedAlgorithm = localStorage.getItem("algorithm");
    if (storedAlgorithm) setAlgorithm(storedAlgorithm);

    const storedTimeQuantum = localStorage.getItem("timeQuantum");
    if (storedTimeQuantum) setTimeQuantum(storedTimeQuantum);
  }, []);

  // Save process list, algorithm, and time quantum to localStorage
  useEffect(() => {
    localStorage.setItem("processList", JSON.stringify(processList));
  }, [processList]);

  useEffect(() => {
    localStorage.setItem("algorithm", algorithm);
  }, [algorithm]);

  useEffect(() => {
    localStorage.setItem("timeQuantum", timeQuantum);
  }, [timeQuantum]);

  return (
    <div className="w-[90%] mx-auto mt-8 flex justify-between">
      <ProcessForm
        algorithm={algorithm}
        setAlgorithm={setAlgorithm}
        processList={processList}
        setProcessList={setProcessList}
        timeQuantum={timeQuantum}
        setTimeQuantum={setTimeQuantum}
      />

      <ProcessTable processList={processList} setProcessList={setProcessList} algorithm={algorithm} timeQuantum={timeQuantum} />
    </div>
  );
};

export default Home;
