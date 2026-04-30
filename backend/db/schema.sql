create extension if not exists pgcrypto;
create table messages (
id uuid primary key default,
conversation_id uuid,
role text check (role in ('user', 'assistant', 'system')),
content text not null,
metadata jsonb,
created_at timestamptz default now()
)

create table orders (
    order_id text unique not null,
    status text not null,
    created_at timestamptz not null default now(),
    total_amount numeric(10,2) not null,
    customer jsonb,
    order_items jsonb 
)