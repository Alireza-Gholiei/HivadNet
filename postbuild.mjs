import { execSync } from "child_process";

execSync("xcopy public .next\\standalone\\public /E /I /Y", { stdio: "inherit" });
execSync("xcopy .next\\static .next\\standalone\\.next\\static /E /I /Y", { stdio: "inherit" });
