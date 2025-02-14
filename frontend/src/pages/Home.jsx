import React, { useState, useEffect } from "react";
import axios from "axios";
import ProcessForm from "@/components/ProcessForm";
import ProcessTable from "@/components/ProcessTable";
import ResultTable from "@/components/ResultTable";
import { Button } from "@/components/ui/button";
import GanttChart from "@/components/GanttChart";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

const Home = () => {
  const [algorithm, setAlgorithm] = useState(() => localStorage.getItem("algorithm") || ""); 
  const [processList, setProcessList] = useState([]);
  const [timeQuantum, setTimeQuantum] = useState(""); 
  const [scheduleResult, setScheduleResult] = useState(null); // Stores API response

  // Load stored data on component mount
  useEffect(() => {
    const storedProcesses = JSON.parse(localStorage.getItem("processList"));
    if (storedProcesses) setProcessList(storedProcesses);

    const storedAlgorithm = localStorage.getItem("algorithm");
    if (storedAlgorithm) setAlgorithm(storedAlgorithm);

    const storedTimeQuantum = localStorage.getItem("timeQuantum");
    if (storedTimeQuantum) setTimeQuantum(storedTimeQuantum);
  }, []);

  // Save process list, algorithm, and time quantum to LocalStorage
  useEffect(() => {
    localStorage.setItem("processList", JSON.stringify(processList));
  }, [processList]);

  useEffect(() => {
    localStorage.setItem("algorithm", algorithm);
  }, [algorithm]);

  useEffect(() => {
    localStorage.setItem("timeQuantum", timeQuantum);
  }, [timeQuantum]);

  // Function to send data to backend API
  const runScheduling = async () => {
    if (!algorithm) {
      toast.error("Please select a scheduling algorithm.");
      return;
    }
    if (processList.length === 0) {
      toast.error("Please add at least one process.");
      return;
    }
    if (algorithm === "rr" && (!timeQuantum || timeQuantum <= 0)) {
      toast.error("Please enter a valid Time Quantum for Round Robin.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/schedule", {
        algorithm,
        processes: processList,
        timeQuantum,
      });

      setScheduleResult(response.data); // Store API response
      toast.success("Scheduling executed successfully!");
    } catch (error) {
      console.error("Error running scheduling:", error);
      toast.error("Failed to execute scheduling.");
    }
  };

  return (
    <>
    
  
    <div className="w-[90%] mx-auto mt-8 flex flex-col items-center gap-6">
      
      <div className="flex justify-between w-full">
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

      {/* Run Scheduling Button */}
      <div className="w-full flex ">
        <div className="w-[40%] flex justify-center">
      <Button onClick={runScheduling} className="w-1/2">
        Run Scheduling
      </Button>
      </div>
      </div>
      {/* Scheduling Results Table */}
      <ResultTable scheduleResult={scheduleResult} algorithm={algorithm} timeQuantum={timeQuantum} />
      
      {/* Gantt Chart */}
      <GanttChart scheduleResult={scheduleResult} algorithm={algorithm}/>
    </div>
    </>
  );
};

export default Home;
