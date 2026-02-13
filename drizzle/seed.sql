-- Seed data for development. Run after migrations.
INSERT INTO users (name, email, phone) VALUES
  ('Test User', 'user@test.com', '+1234567890');

INSERT INTO artists (name, bio, hourly_rate, timezone) VALUES
  ('Sample Artist', 'Experienced tattoo artist specializing in custom designs.', 80, 'America/New_York');
