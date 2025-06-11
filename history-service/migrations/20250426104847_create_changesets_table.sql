CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- +goose Up
-- +goose StatementBegin
CREATE TABLE changesets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    toilet_id UUID NOT NULL,
    changed_by VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    new_state JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE changesets;
-- +goose StatementEnd
