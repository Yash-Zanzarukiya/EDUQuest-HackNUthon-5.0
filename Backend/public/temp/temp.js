import { spawn } from "child_process";

let transcript = "";

function fetchSummary(filename) {
  let videoPath = `${filename}`;
  const process = spawn("python", ["./test1.py", videoPath]);

  process.stdout.on("data", (data) => {
    transcript += data.toString();
  });

  process.stdout.on("data", (data) => {
    console.log(data.toString());
    return data.toString();
  });
}

export { fetchSummary };
