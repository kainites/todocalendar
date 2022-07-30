import db from '$lib/db'

export async function GET({locals}){
    if (!locals.authenticated) return { status: 401 };
    db.auth.setAuth(locals.access_token);
    const { data, error } = await db.from('todos').select()
    return {body:{todos:data}}
}