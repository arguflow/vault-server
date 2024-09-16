-- Your SQL goes here
CREATE TABLE IF NOT EXISTS crawl_requests (
    id UUID PRIMARY KEY,
    url TEXT NOT NULL,
    status TEXT NOT NULL,
    scrape_id UUID NOT NULL,
    dataset_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);