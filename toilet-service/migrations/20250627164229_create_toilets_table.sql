-- +goose Up
-- +goose StatementBegin
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

CREATE TYPE gender_enum AS ENUM ('Male', 'Female', 'Gender-neutral');
CREATE TYPE bidet_type_enum AS ENUM ('Hand-held', 'Attachment', 'Standalone');

CREATE TABLE toilets (
                         id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                         name VARCHAR(255) NOT NULL CHECK (char_length(name) > 0),
                         description TEXT DEFAULT '' CHECK (char_length(description) <= 1250),
                         location GEOGRAPHY(Point, 4326) NOT NULL,
                         genders gender_enum[] NOT NULL CHECK (array_length(genders, 1) >= 1),
                         has_handicap BOOLEAN NOT NULL DEFAULT FALSE,
                         has_bidet BOOLEAN NOT NULL DEFAULT FALSE,
                         is_paid BOOLEAN NOT NULL DEFAULT FALSE,
                         bidet_types bidet_type_enum[] NOT NULL DEFAULT '{}',
                         created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                         updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
                         CHECK (
                             (NOT has_bidet AND array_length(bidet_types, 1) IS NULL)
                                 OR
                             (has_bidet AND array_length(bidet_types, 1) >= 1)
                             )
);

CREATE INDEX toilets_location_idx ON toilets USING GIST(location);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON toilets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TRIGGER IF EXISTS set_updated_at ON toilets;
DROP FUNCTION IF EXISTS update_updated_at_column;
DROP TABLE IF EXISTS toilets;
DROP TYPE IF EXISTS gender_enum;
DROP TYPE IF EXISTS bidet_type_enum;
DROP EXTENSION IF EXISTS "postgis";
DROP EXTENSION IF EXISTS "uuid-ossp";
-- +goose StatementEnd
