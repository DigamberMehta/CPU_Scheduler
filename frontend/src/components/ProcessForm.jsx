import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
// import "./ProcessForm.css";

export default function ProcessForm({ algorithm, setAlgorithm, processList, setProcessList, timeQuantum, setTimeQuantum }) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      processId: "",
      arrivalTime: "",
      burstTime: "",
      priority: "",
    },
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingAlgorithm, setPendingAlgorithm] = useState("");

  // Open confirmation modal when changing algorithm
  const handleAlgorithmChange = (newAlgorithm) => {
    if (processList.length > 0) {
      setPendingAlgorithm(newAlgorithm);
      setShowConfirmModal(true);
    } else {
      applyAlgorithmChange(newAlgorithm);
    }
  };

  // Apply algorithm change after confirmation
  const applyAlgorithmChange = (newAlgorithm) => {
    setAlgorithm(newAlgorithm);
    setProcessList([]); // Clear processes
    reset(); // Clear form inputs
    if (newAlgorithm !== "rr") setTimeQuantum(""); // Reset TQ if not RR
    toast.success("Algorithm changed successfully!");
  };

  // Prevent duplicate Process IDs
  const checkDuplicateProcessId = (id) => processList.some((process) => process.id === id);

  // Handle process submission
  const onSubmit = (data) => {
    if (!algorithm) {
      toast.error("Please select an algorithm before adding processes.");
      return;
    }

    if (algorithm === "rr" && !timeQuantum) {
      toast.error("Please enter Time Quantum before adding processes.");
      return;
    }

    if (checkDuplicateProcessId(data.processId)) {
      toast.error("Process ID must be unique!");
      return;
    }

    const newProcess = {
      id: data.processId,
      arrivalTime: parseInt(data.arrivalTime),
      burstTime: parseInt(data.burstTime),
      ...(algorithm === "priority" && { priority: parseInt(data.priority) }),
    };

    setProcessList([...processList, newProcess]);
    toast.success(`Process ${data.processId} added successfully!`);
    reset(); // Clear form after adding
  };

  return (
    <>
    <div className="w-[40%]">
      {/* Confirmation Dialog */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Switch Algorithm?</DialogTitle>
          </DialogHeader>
          <p className="text-gray-700">Changing the algorithm will remove all added processes. Are you sure?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmModal(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { applyAlgorithmChange(pendingAlgorithm); setShowConfirmModal(false); }}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Main Form */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>CPU Scheduling Process Form</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Algorithm Selection */}
          <Label className="font-medium">Select Scheduling Algorithm</Label>
          <Select onValueChange={handleAlgorithmChange} value={algorithm}>
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder="Choose an algorithm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fcfs">First-Come, First-Serve (FCFS)</SelectItem>
              <SelectItem value="sjf">Shortest Job First (SJF)</SelectItem>
              <SelectItem value="priority">Priority Scheduling</SelectItem>
              <SelectItem value="rr">Round Robin (RR)</SelectItem>
            </SelectContent>
          </Select>

          {/* Time Quantum Input for RR (Visible Only Once) */}
          {algorithm === "rr" && (
            <div className="mt-4">
              <Label>Time Quantum (RR Algorithm)</Label>
              <Input
                type="number"
                value={timeQuantum}
                onChange={(e) => setTimeQuantum(parseInt(e.target.value))}
                placeholder="Enter Time Quantum (e.g., 4)"
                required
              />
            </div>
          )}
        </CardContent>

        {/* Process Input Form */}
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Label>Process ID</Label>
            <Input className="!mb-3 !mt-0"  {...register("processId")} placeholder="Enter a unique process ID (e.g., P1, P2)" required />

            <Label>Arrival Time</Label>
            <Input className="!mb-3 !mt-0"  type="number" {...register("arrivalTime")} placeholder="Enter arrival time (e.g., 0, 5, 10)" required />

            <Label>Burst Time</Label>
            <Input className="!mb-3 !mt-0"  type="number" {...register("burstTime")} placeholder="Enter burst time (e.g., 3, 8, 12)" required />

            {algorithm === "priority" && (
              <>
                <Label>Priority</Label>
                <Input className="!mb-3 !mt-0"  type="number" {...register("priority")} placeholder="Enter priority (1 = highest, 10 = lowest)" required />
              </>
            )}

            <Button type="submit" className="w-full">
              Add Process
            </Button>
          </form>
        </CardContent>
      </Card>
      </div>
    </>
  );
}
