import { spawn } from "child_process";

let transcript = "";

function fetchSummary(filename) {
  const videoPath = `${filename}`;
  const process = spawn("python", ["./", videoPath]);

  process.stdout.on("data", (data) => {
    transcript += data.toString();
  });

  process.stdout.on("data", (data) => {
    console.log(data.toString());
    return data.toString();
  });
}

export { fetchSummary };
