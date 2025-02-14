import React, { useState, useEffect, useRef } from "react";
import { scaleLinear } from "@visx/scale";
import { Group } from "@visx/group";
import { Bar } from "@visx/shape";
import { AxisBottom } from "@visx/axis";
import { Text } from "@visx/text";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const colors = ["#4CAF50", "#FF9800", "#2196F3", "#FF5722", "#9C27B0", "#3F51B5", "#00BCD4", "#FFEB3B"];
const getColor = (id) => colors[parseInt(id.replace(/\D/g, ""), 10) % colors.length];

const GanttChart = ({ scheduleResult, algorithm }) => {
  if (!scheduleResult) return <p className="text-gray-500">No scheduling results available.</p>;

  const allExecutions =
    algorithm.toLowerCase() === "rr" && scheduleResult.timeline ? scheduleResult.timeline : scheduleResult.schedule;

  if (!allExecutions || allExecutions.length === 0) {
    return <p className="text-gray-500">No Gantt Chart available.</p>;
  }

  const minTime = 0;
  const maxTime = Math.max(...allExecutions.map((p) => p.endTime));

  const containerRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(800); // Default width

  useEffect(() => {
    if (containerRef.current) {
      setChartWidth(containerRef.current.clientWidth * 1); // 80% of parent width
    }

    const handleResize = () => {
      if (containerRef.current) {
        setChartWidth(containerRef.current.clientWidth * 1);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const height = 80;
  const barHeight = 30;
  const padding = 50;

  const xScale = scaleLinear({
    domain: [minTime, maxTime],
    range: [padding, chartWidth - padding],
  });

  const [currentExecutions, setCurrentExecutions] = useState(allExecutions);
  const [isVisualizing, setIsVisualizing] = useState(false);

  useEffect(() => {
    setCurrentExecutions(allExecutions);
  }, [scheduleResult]);

  const startVisualization = () => {
    setIsVisualizing(true);
    let index = 0;
    let updatedExecutions = [];

    const executeNext = () => {
      if (index < allExecutions.length) {
        updatedExecutions.push(allExecutions[index]);
        setCurrentExecutions([...updatedExecutions]);
        index++;
        setTimeout(executeNext, 1000);
      } else {
        setIsVisualizing(false);
      }
    };

    executeNext();
  };

  return (
    <div ref={containerRef} className="w-full flex flex-col items-center mt-6 border-2 border-gray-200 rounded-lg shadow-lg p-4">
      <CardHeader className="!p-2">
        <CardTitle className="!text-left !p-0">Gantt Chart</CardTitle>
      </CardHeader>

      <Button onClick={startVisualization} disabled={isVisualizing}>
        {isVisualizing ? "Visualizing..." : "Visualize Execution"}
      </Button>

      <svg width={chartWidth} height={height + 50}>
        <Group top={30}>
          {currentExecutions.length > 0 &&
            currentExecutions.map((process, index) => {
              if (!process || process.startTime === undefined || process.endTime === undefined) return null;

              const barX = xScale(process.startTime);
              const barWidth = xScale(process.endTime) - barX;
              return (
                <Group key={`${process.id}-${index}`}>
                  <Bar x={barX} y={40} width={barWidth} height={barHeight} fill={getColor(process.id)} stroke="#333" />
                  <Text x={barX + barWidth / 2} y={55} dy=".35em" fontSize={14} textAnchor="middle" fill="#fff">
                    {process.id}
                  </Text>
                </Group>
              );
            })}
          <AxisBottom
            scale={xScale}
            top={barHeight + 50}
            stroke="black"
            tickStroke="black"
            tickLabelProps={() => ({
              fill: "black",
              fontSize: 12,
              textAnchor: "middle",
            })}
          />
        </Group>
      </svg>
    </div>
  );
};

export default GanttChart;
