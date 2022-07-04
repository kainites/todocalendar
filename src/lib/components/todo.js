export const deleteTodo = async (id) => {
    todos = todos.filter((t) => t.id != id);
    const { data, error } = await db.from('todos').delete().eq('id', id);
}

export const saveTodo = async (todo) => {
    const { data, error } = await db.from('todos').upsert(todo);
    todos[todos.findIndex((t) => (t.id == todo.id))] = {...todo, isEditing: !todo.isEditing};
}
