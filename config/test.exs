use Mix.Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :nvlp, Nvlp.Endpoint,
  http: [port: 4001],
  server: false

# Print only warnings and errors during test
config :logger, level: :warn

# Configure your database
config :nvlp, Nvlp.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "better",
  password: "better-password",
  database: "envelope_test",
  hostname: "localhost",
  pool: Ecto.Adapters.SQL.Sandbox

config :nvlp, :authentication,
  always_pass: true
