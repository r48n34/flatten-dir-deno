// https://www.npmjs.com/package/flatten-directory?activeTab=code
// deno run -A .\flattenDirectory.ts

import path from "node:path";
import process from "node:process";
import fs from "npm:fs-extra@11.2.0";
import lodash from "npm:lodash@4.17.21";

export function flattenDirectoryToDir(
    rootdir: string, // Directory to flatten
    outputdir: string, // Output Directory
): void {
    if (!fs.existsSync(rootdir)) {
        console.error(`\x1b[31mInput Rootdir ${rootdir} is not exist\x1b[0m`);
        throw new Error(`Input Rootdir ${rootdir} is not exist`);
    }

    if (!fs.existsSync(outputdir)) {
        console.log(`Output dir not exist, creating at ${outputdir}`);
        fs.mkdirSync(outputdir);
    }
    else {
        console.error(`\x1b[31mOutput Directory ${rootdir} already exist\x1b[0m`);
        throw new Error(`Output Directory ${rootdir} already exist`);
    }

    const helpers = {
        filesInDirectory(
            dir: string,
            recursive: boolean = true,
            acc: string[] = [],
        ) {
            try {
                const files = fs.readdirSync(dir);
                for (const i in files) {
                    const name: string = [dir, files[i]].join(path.sep);
                    if (fs.statSync(name).isDirectory()) {
                        if (recursive) {
                            helpers.filesInDirectory(name, recursive, acc);
                        }
                    } else {
                        acc.push(name);
                    }
                }
                return acc;
            } catch (_e) {
                return acc;
            }
        },
        getEnvVars() {
            const strings = process.argv.slice(2).map((
                s,
            ) => (s.startsWith("--") ? s.slice(2) : s));

            return lodash.reduce(
                strings,
                (acc: Record<string, boolean>, v: string) => {
                    if (v.indexOf("=") !== -1) {
                        const [name, value] = v.split("=").map((s) =>
                            lodash.trim(s)
                        );
                        if (value === "true") {
                            acc[name] = true;
                        } else if (value === "false") {
                            acc[name] = false;
                        } else {
                            const num = lodash.parseInt(value);
                            acc[name] = lodash.isNaN(num) ? value : num;
                        }
                    } else {
                        acc[v] = true;
                    }
                    return acc;
                },
                {},
            );
        },
        log(...args: string[]) {
            console.log(...args);
        },
        move(oldPath: string, newPath: string) {
            try {
                // create dir if not exist
                const dir = newPath.split(path.sep)
                    .filter(Boolean)
                    .slice(0, -1)
                    .join(path.sep);

                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }

                fs.renameSync(oldPath, newPath);
            } catch (e) {
                if (e.code === "EXDEV") {
                    fs.copySync(oldPath, newPath, {
                        overwrite: true,
                        dereference: true,
                    });
                    fs.unlinkSync(oldPath);
                } else {
                    throw e;
                }
            }
        },
    };

    const envVars = helpers.getEnvVars();
    const copy = !envVars.cut;

    const allFiles = helpers.filesInDirectory(rootdir, true);

    helpers.log(`Running on dir: ${rootdir}`);
    helpers.log(`Processing ${allFiles.length} files...`);
    helpers.log(`--------------------------------------`);

    allFiles.forEach((orig) => {
        const destFileName = orig.slice(rootdir.length)
            .split(path.sep)
            .filter(Boolean)
            .join("-")
            .split(" ")
            .join("-");

        const dest = path.resolve(outputdir, destFileName);
        // helpers.log(`${orig} -> ${dest}`);

        console.log(`From: ${orig}`);
        console.log(`\x1b[33mTo: ${dest}\x1b[0m`);

        if (copy) {
            fs.copySync(orig, dest, { overwrite: true, dereference: true });
        } else {
            helpers.move(orig, dest);
        }
    });

    helpers.log(`--------------------------------------`);
    helpers.log("Done");
}

function main() {
    try { 
        const targetDir = Deno.args[0];
    
        if(!targetDir || targetDir.length <= 1){
            throw new Error("MIssing Output Directory, please input the output params (e.g. flatDir myFolder)")
        }
    
        flattenDirectoryToDir(
            Deno.cwd(), // "C:\\Users\\reemo\\Downloads\\submissions"
            targetDir,  // "C:\\Users\\reemo\\Downloads\\submissions\\result"
        );
    } catch (error) {
        console.log(error);
    }
}

if (import.meta.main) {
    main();
}

// https://jsr.io/@reemo/flatten-dir-deno/0.1.0/mod.ts
