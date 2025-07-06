-- Create function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Create trigger for todos table
create trigger update_todos_updated_at
    before update on todos
    for each row
    execute function update_updated_at_column(); 