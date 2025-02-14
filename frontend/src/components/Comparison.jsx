import React, { useState } from "react";
import axios from "axios";
import ComparisonForm from "@/components/ComparisonForm";
import ComparisonProcessTable from "@/components/ComparisonProcessTable";
import ComparisonResults from "@/components/ComparisonResults";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function Comparison() {
  const [selectedAlgorithms, setSelectedAlgorithms] = useState([]);
  const [comparisonProcesses, setComparisonProcesses] = useState([]);
  const [comparisonResults, setComparisonResults] = useState([]);
  const [timeQuantum, setTimeQuantum] = useState("");
  const [showPriorityDialog, setShowPriorityDialog] = useState(false);
  const [showTQDialog, setShowTQDialog] = useState(false);
  const [missingPriorityProcesses, setMissingPriorityProcesses] = useState([]);


  const validateAndRunComparison = async () => {
    if (selectedAlgorithms.length === 0) {
      toast.error("Please select at least one scheduling algorithm.");
      return;
    }
    if (comparisonProcesses.length === 0) {
      toast.error("Please add at least one process for comparison.");
      return;
    }


    if (selectedAlgorithms.includes("priority")) {
      const missingPriority = comparisonProcesses.filter((p) => p.priority === undefined);

      if (missingPriority.length > 0) {
        setMissingPriorityProcesses(missingPriority);
        setShowPriorityDialog(true);
        return;
      }
    }


    if (selectedAlgorithms.includes("rr") && (!timeQuantum || timeQuantum <= 0)) {
      setShowTQDialog(true);
      return;
    }

    runComparison();
  };


  const runComparison = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/compare", {
        algorithms: selectedAlgorithms,
        processes: comparisonProcesses,
        timeQuantum: selectedAlgorithms.includes("rr") ? timeQuantum : undefined,
      });

      setComparisonResults(response.data);
      toast.success("Comparison executed successfully!");
    } catch (error) {
      console.error("Error running comparison:", error);
      toast.error("Failed to execute comparison.");
    }
  };


  const removePriorityScheduling = () => {
    const updatedAlgorithms = selectedAlgorithms.filter((algo) => algo !== "priority");
    setSelectedAlgorithms(updatedAlgorithms);
    setShowPriorityDialog(false);
    toast.success("Priority Scheduling removed.");
  };


  const removeRoundRobin = () => {
    const updatedAlgorithms = selectedAlgorithms.filter((algo) => algo !== "rr");
    setSelectedAlgorithms(updatedAlgorithms);
    setShowTQDialog(false);
    toast.success("Round Robin removed.");
  };

  return (
    <div className="w-[90%] mx-auto mt-8 flex flex-col items-center gap-6">
      <div className="flex justify-between w-full">
        <ComparisonForm
          selectedAlgorithms={selectedAlgorithms}
          setSelectedAlgorithms={setSelectedAlgorithms}
          comparisonProcesses={comparisonProcesses}
          setComparisonProcesses={setComparisonProcesses}
          timeQuantum={timeQuantum}
          setTimeQuantum={setTimeQuantum}
        />

        <ComparisonProcessTable
          processList={comparisonProcesses}
          setProcessList={setComparisonProcesses}
          selectedAlgorithms={selectedAlgorithms}
          timeQuantum={timeQuantum}
          setTimeQuantum={setTimeQuantum}
        />
      </div>

      <div className="w-full flex justify-center">
        <Button onClick={validateAndRunComparison} className="w-1/3">
          Run Comparison
        </Button>
      </div>

      <ComparisonResults comparisonResults={comparisonResults} />

      
      <Dialog open={showPriorityDialog} onOpenChange={setShowPriorityDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Priority Conflict Detected</DialogTitle>
          </DialogHeader>
          <p className="text-gray-700">
            The following processes are missing a priority value:{" "}
            <span className="font-semibold">{missingPriorityProcesses.map((p) => p.id).join(", ")}</span>
          </p>
          <p className="text-gray-700">What would you like to do?</p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                toast.info("Please edit priority values manually.");
                setShowPriorityDialog(false); // Close the dialog
              }}
            >
              Edit Manually
            </Button>
            <Button variant="destructive" onClick={removePriorityScheduling}>
              Remove Priority Scheduling
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      
      <Dialog open={showTQDialog} onOpenChange={setShowTQDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Time Quantum Required</DialogTitle>
          </DialogHeader>
          <p className="text-gray-700">
            You have selected <b> Round Robin</b>, but no Time Quantum is set. Please enter a valid value.
          </p>
          <DialogFooter>

          <Button variant="outline" onClick={() => setShowTQDialog(false)}>
              Edit Manually
            </Button>

            <Button
              variant="destructive"
              onClick={() => {
                toast.info("Please enter TQ in the input field.");
                setShowTQDialog(false); 
                removeRoundRobin();  
              }}
            >
              Remove Priority Scheduling
            </Button>
          
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


