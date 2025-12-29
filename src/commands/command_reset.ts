import { deleteAllUsers } from "src/lib/db/queries/users";


export async function handlerReset(cmdName:string): Promise<void> {
    await deleteAllUsers()
    console.log(`Database was cleared`)
}