import { writeFile } from 'fs/promises';

export default async (entries, path) => {
    console.log(`--------------------------------`)
    console.log(`Saving in ${path}`);
    console.log(`--------------------------------`)

    await writeFile(`${path}`, JSON.stringify({ entries }));
}
