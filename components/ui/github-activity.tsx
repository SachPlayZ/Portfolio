import GitHubCalendar from "react-github-calendar";

export default function GitHubActivity() {
  return (
    <div className="w-full h-full flex flex-col justify-center overflow-hidden">
      <div className="w-[150%] -mr-[50%]">
        <GitHubCalendar
          username="SachPlayZ"
          colorScheme="dark"
          hideMonthLabels
          hideColorLegend
          blockSize={14}
          blockMargin={5}
          style={{
            width: "100%",
            height: "100%",
            minHeight: "150px",
          }}
        />
      </div>
    </div>
  );
}
