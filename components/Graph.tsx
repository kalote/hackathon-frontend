import { Bar } from "react-chartjs-2";
import {
  Chart,
  BarElement,
  BarController,
  CategoryScale,
  Legend,
  Title,
  LinearScale,
  Tooltip,
  TooltipItem,
} from "chart.js";

Chart.register(
  BarElement,
  BarController,
  CategoryScale,
  LinearScale,
  Legend,
  Title,
  Tooltip
);

const Graph: React.FC<GraphProps> = ({ balanceData }) => {
  const data = {
    labels: balanceData ? balanceData.labels : ["a", "b", "c", "d", "e", "f"],
    datasets: [
      {
        label: "IN",
        data: balanceData ? balanceData.data.in : [12, 19, 3, 5, 2, 3],
        backgroundColor: "rgba(0, 255, 0, 0.6)",
      },
      {
        label: "OUT",
        data: balanceData ? balanceData.data.out : [12, 19, 3, 5, 2, 3],
        backgroundColor: "rgba(255, 0, 0, 0.6)",
      },
    ],
  };

  return (
    <div>
      <Bar
        data={data}
        options={{
          responsive: true,
          plugins: {
            title: {
              display: false,
            },
            legend: {
              display: false,
            },
            tooltip: {
              position: "nearest",
              callbacks: {
                title: (items) => {
                  let theTitle;
                  items.forEach((item) => {
                    if (item.label) theTitle = item.label;
                  });
                  return `Block: ${theTitle}`;
                },
              },
            },
          },
          scales: {
            x: {
              position: "bottom",
              ticks: {
                callback: function (val, index) {
                  // Hide every 2nd tick label
                  return `Block #${this.getLabelForValue(val as number)}`;
                },
                color: "rgba(170, 170, 171, 0.3)",
              },
              grid: {
                display: false,
              },
            },
            y: {
              position: "right",
              ticks: {
                color: "rgba(170, 170, 171, 0.3)",
              },
              grid: {
                color: "rgba(170, 170, 171, 0.3)",
              },
            },
          },
        }}
      />
    </div>
  );
};

export default Graph;
