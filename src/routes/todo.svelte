<script>
// @ts-nocheck
    import db from '$lib/db';
    import Flatpickr from 'svelte-flatpickr';
    import flatpickr from 'flatpickr';
    import { uuid } from '$lib/utils';
    import { session } from '$app/stores';

    let newtodo = {isCompleted: false, isEditing: false, task: '', date: null, id: uuid(), user_id: $session.user.id};
    export let todos = [];
    let value, formattedValue;

    let addTodo = async () => {
        let modifiedtodo = {...newtodo, date: newtodo.date != '' ? flatpickr.formatDate(new Date(newtodo.date), 'Z'): null};
        const { data, error } = await db.from('todos').upsert(modifiedtodo);
        todos = [...todos, newtodo];
        newtodo = {isCompleted: false, isEditing: false, task: '', date: null, id: uuid(), user_id: $session.user.id};
    
    };

    export const deleteTodo = async (id) => {
        todos = todos.filter((t) => t.id != id);
        const { data, error } = await db.from('todos').delete().eq('id', id);
    }

    function editTodo(todo) {
        todos[todos.findIndex((t) => (t.id == todo.id))] = {...todo, isEditing: !todo.isEditing};
    }

    export const saveTodo = async (todo) => {
        const { data, error } = await db.from('todos').upsert(todo);
        todos[todos.findIndex((t) => (t.id == todo.id))] = {...todo, isEditing: !todo.isEditing};
    }

    export const completeTodo = async (todo) => {
        todos[todos.findIndex((t) => (t.id == todo.id))] = {...todo, isCompleted: !todo.isCompleted};
        const { data, error } = await db.from('todos').upsert(todo);
    }

    const options = {
        altInput: true,
        altFormat: "d/m/Y",
        dateFormat: "Y-m-d",
	}

</script>

<h2>To Do</h2>

<div id="newtodo">
    <input bind:value={newtodo.task} type="text" placeholder="input your to do here">
    <Flatpickr {options} bind:value={newtodo.date} bind:formattedValue name="date" />
    <button on:click={addTodo} type="submit">add to do</button>
</div>

<ul>
    {#each todos.sort((a,b) => new Date(a.date) - new Date(b.date)) || [] as todo}
        {#if todo.date}
            {#if !todo.isCompleted}
                <li>
                    <button class="incompleteButton" on:click={()=>completeTodo(todo)}></button>
                    {#if todo.isEditing}
                        <input bind:value={todo.task} type="text" placeholder={todo.task}>
                        <Flatpickr {options} bind:value={todo.date} bind:formattedValue name="date" />
                        <button on:click={() => saveTodo(todo)}>save</button>
                    {:else}
                        <span>{todo.task}</span>
                        <span>{todo.date == null ? '' : flatpickr.formatDate(new Date(todo.date), "d/m/Y")}</span>
                        <button on:click={() => editTodo(todo)}>edit</button>
                    {/if}
                    <button on:click={() => deleteTodo(todo.id)} type="submit">delete</button>
                </li> 
            {/if} 
        {/if}
    {/each}

    {#each todos.sort((a,b) => new Date(a.date) - new Date(b.date)) || [] as todo}
        {#if !todo.date}
            {#if !todo.isCompleted}
                <li>
                    <button class="incompleteButton" on:click={()=>completeTodo(todo)}></button>
                    {#if todo.isEditing}
                        <input bind:value={todo.task} type="text" placeholder={todo.task}>
                        <Flatpickr {options} bind:value={todo.date} bind:formattedValue name="date" />
                        <button on:click={() => saveTodo(todo)}>save</button>
                    {:else}
                        <span>{todo.task}</span>
                        <span>{todo.date == null ? '' : flatpickr.formatDate(new Date(todo.date), "d/m/Y")}</span>
                        <button on:click={() => editTodo(todo)}>edit</button>
                    {/if}
                    <button on:click={() => deleteTodo(todo.id)} type="submit">delete</button>
                </li> 
            {/if}  
        {/if}
    {/each}

    {#each todos.sort((a,b) => new Date(a.date) - new Date(b.date)) || [] as todo}
        {#if todo.isCompleted}
            <li class="completedTodo">
                <button class="completeButton" on:click={()=>completeTodo(todo)}></button>
                    <span>{todo.task}</span>
                    <span>{todo.date == null ? '' : flatpickr.formatDate(new Date(todo.date), "d/m/Y")}</span>
                <button on:click={() => deleteTodo(todo.id)} type="submit" class="completeDelete">delete</button>
            </li> 
        {/if}  
    {/each}
</ul>

<style>
    #newtodo {
        display: grid;
        grid-template-columns: 55% 20% 25%;
        grid-gap: 2rem;
        margin-bottom: 3rem;
    }

    :global(#newtodo >a) {
        text-align: center;
    }

    #newtodo >input {
        border-bottom: 6px solid var(--greenmid);
    }

    #newtodo >button {
        border-bottom: 6px solid var(--greenmid);
        height: auto;
    }

    li {
        display: grid;
        grid-template-columns: 5% 45% 21% 7.5% 7.5%;
        grid-template-rows: auto;
        grid-gap: 2rem;
        margin-bottom: 5%;
        padding: 10px;
        padding-right: 0px;
        margin-right: 0px;
        font-size: 2vh;
        border: 2px solid var(--greenmid);
    }

    li >span {
        text-align: left;
        padding-top: 1vh;
        padding-left: 2%;
    }

    li >button {
        height: 5vh;
    }

    button {
        font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        border: none;
        background-color: var(--greenmid);
        font-size: 2vh;
        width: auto;
    }

    input {
        outline: none;
        border: none;
        background-color: var(--greenmid);
        border-radius: 0;
        line-height: 1.3;
        padding: 10px;
        padding: .6em 1.4em .5em .8em;
    }

    .completedTodo {
        grid-template-columns: 5% 45% 21% 17.5%;
        background-color: var(--greenmid);
        border: 2px solid var(--greendark);
    }

    .incompleteButton {
        width: 40px;
        height: 40px;
        background-color: var(--greenwhite);
        border: 5px solid var(--greenmid);
        border-radius: 100%;
    }

    .completeButton {
        width: 40px;
        height: 40px;
        background-color: var(--greendark);
        border: 5px solid var(--greenwhite);
        border-radius: 100%;
    }

    .completeDelete {
        color: var(--greenwhite);
        background-color: var(--greendark);
    }
</style>