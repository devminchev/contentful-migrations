import { writeFile } from 'node:fs/promises';

export default async (entries, path) => {
    console.log(`--------------------------------`)
    console.log(`Saving in ${path}`);
    console.log(`--------------------------------`)

    await writeFile(`${path}`, JSON.stringify({ entries }));
}
