-- Enable RLS
alter table if exists public.todos enable row level security;

-- Create todos table
create table if not exists public.todos (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id),
    title text not null,
    completed boolean default false,
    created_at timestamptz default timezone('utc'::text, now()),
    updated_at timestamptz default timezone('utc'::text, now())
);

-- Create RLS policies
create policy "Users can view their own todos" on todos
    for select using (auth.uid() = user_id);

create policy "Users can create their own todos" on todos
    for insert with check (auth.uid() = user_id);

create policy "Users can update their own todos" on todos
    for update using (auth.uid() = user_id);

create policy "Users can delete their own todos" on todos
    for delete using (auth.uid() = user_id);

-- Create indexes
create index if not exists todos_user_id_idx on todos(user_id);
create index if not exists todos_created_at_idx on todos(created_at);

-- Enable realtime
alter publication supabase_realtime add table todos; 