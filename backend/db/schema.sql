create extension if not exists pgcrypto;
create table messages (
id uuid primary key default,
conversation_id uuid,
role text check (role in ('user', 'assistant', 'system')),
content text not null,
metadata jsonb,
created_at timestamptz default now()
)