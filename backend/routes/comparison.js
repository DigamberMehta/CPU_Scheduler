import express from "express";
import fcfs from "../schedulingAlgorithms/fcfs.js";
import sjf from "../schedulingAlgorithms/sjf.js";
import priorityScheduling from "../schedulingAlgorithms/priority.js";
import roundRobin from "../schedulingAlgorithms/roundRobin.js";

const router = express.Router();

//  Route: Run Comparison for Multiple Algorithms → POST /api/compare
router.post("/compare", (req, res) => {
  const { algorithms, processes, timeQuantum } = req.body;

  if (!algorithms || !Array.isArray(algorithms) || algorithms.length === 0) {
    return res.status(400).json({ error: "No algorithms selected for comparison." });
  }
  if (!processes || !Array.isArray(processes) || processes.length === 0) {
    return res.status(400).json({ error: "Process list is empty." });
  }

  let results = [];

  for (const algorithm of algorithms) {
    let result;
    switch (algorithm.toLowerCase()) {
      case "fcfs":
        result = fcfs(processes);
        break;
      case "sjf":
        result = sjf(processes);
        break;
      case "priority":
        result = priorityScheduling(processes);
        break;
      case "rr":
        if (!timeQuantum || timeQuantum <= 0) {
          return res.status(400).json({ error: "Invalid time quantum for Round Robin." });
        }
        result = roundRobin(processes, timeQuantum);
        break;
      default:
        return res.status(400).json({ error: `Unknown algorithm: ${algorithm}` });
    }

    results.push({
      algorithm,
      result,
    });
  }

  return res.json(results);
});

export default router;
