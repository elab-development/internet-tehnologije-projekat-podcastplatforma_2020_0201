import React, { useEffect } from "react";
import { Chart } from "react-google-charts"; // Import Google Charts
import { connect } from "react-redux";
import { RootState } from "../store/reducers";
import NavigationMenu from "./NavigationMenu";
import { getTPS } from "../store/actions/welcomeActions";
import "./PP.css";

interface PPProps {
  getTPS: () => void;
  tps: any[];
  userType: "viewer" | "host" | "administrator";
}

const PP: React.FC<PPProps> = ({ getTPS, tps, userType }) => {
  useEffect(() => {
    getTPS();
  }, [getTPS]);

  const genreStats = tps.reduce((acc: { [key: string]: number }, podcast) => {
    const genre = podcast.genre || "Unknown";
    acc[genre] = (acc[genre] || 0) + 1;
    return acc;
  }, {});

  const chartData = [["Genre", "Count"], ...Object.entries(genreStats)];

  const chartOptions = {
    title: "Statistika trending podcast žanrova",
    is3D: true,
  };

  const exportToCSV = (data: any) => {
    const csvRows = [];
    const headers = ["Collection Name", "Artist Name", "Genre", "Feed URL"];
    csvRows.push(headers.join(","));

    data.forEach(
      (podcast: {
        collectionName: any;
        artistName: any;
        genre: any;
        feedUrl: any;
      }) => {
        const row = [
          podcast.collectionName,
          podcast.artistName,
          podcast.genre || "Unknown",
          podcast.feedUrl || "N/A",
        ];
        csvRows.push(row.join(","));
      }
    );

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "trendingPodkastiITUnes.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ backgroundColor: "beige", height: "100%" }}>
      <NavigationMenu userType={userType} />
      <div className="chart-container">
        <h2>Trending žanrovi podcasta prema iTunes-u</h2>
        <Chart
          chartType="PieChart"
          data={chartData}
          options={chartOptions}
          width={"100%"}
          height={"400px"}
        />
        <button onClick={() => exportToCSV(tps)}>Export as CSV</button>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const role = state.welcome.currentUser?.role || "";

  const userType: "viewer" | "host" | "administrator" =
    role === "viewer" || role === "host" || role === "administrator"
      ? role
      : "viewer";

  return {
    tps: state.welcome.tps || [],
    userType,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  getTPS: () => dispatch(getTPS()),
});

export default connect(mapStateToProps, mapDispatchToProps)(PP);
